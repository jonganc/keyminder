import l_ from 'lodash';
import {
  Binding,
  BindingLabels,
  KeyMap,
  KeySequence,
  ModdedKeyEvent,
  KeyMapByEvent,
  Modifiers,
  KeyEvent,
  BindingByEvent,
} from './key-bindings';
import {
  Geometry,
  LabeledKeyEvent,
  VirtualKey,
  Keyboard,
  PhysicalKey,
} from './keyboard-layout';
import { DeepMap, Label, doSetsIntersect } from './types';

// combine key bindings and layouts into keyboards

interface PhysicalKeyBindingSingle extends LabeledKeyEvent {
  /**
   * The physical-key modifiers might be transformed to produce the key-event modifiers, which is what is actually used to determine the bindings. Thus, we include the key-event modifiers for completeness. E.g. if we press Ctrl-Shift-A, the physical-key modifiers will be [Ctrl, Shift] but the key-event modifiers will just be [Ctrl].
   */
  keyEventModifiers: Modifiers;
  binding: Binding;
  bindingLabel: Label;
}

/**
 * This corresponds to the case where multiple key bindings map to the key sequence. This can happen when there is no binding specifically for the modified key event but instead the binding is generated from modifiers added to two different events. For example, Shift-2 maps to `@`. Now imagine that Ctrl-2 were set to be translated to `!` and that Ctrl-@ mapped to a command 'Do-Ctrl-@' and 'Shift-!' mapped to 'Do-Shift-!'. Then the physical key press `Ctrl-Shift-2' would be bound to both 'Do-Ctrl-@' and 'Do-Shift-!'. In practice, this won't often occur, since only Shift and Alt-Gr translate keys usually. But... it's not beyond the realm of possiblity so we allow for it.
 */
type PhysicalKeyBindingConflicting = PhysicalKeyBindingSingle[];

export type PhysicalKeyBinding =
  | PhysicalKeyBindingSingle
  | PhysicalKeyBindingConflicting;

export interface PhysicalKeyWithBindings extends VirtualKey {
  bindings: DeepMap<Modifiers, PhysicalKeyBinding>;
}

/**
 * All keybindings immediately accessible from a particular state (i.e. a sequence of keys already pressed).
 */
export type KeyboardWithBindings = [
  PhysicalKeyWithBindings,
  PhysicalKeyWithBindings,
  ...PhysicalKeyWithBindings[]
];

/**
 * Given a key event plus whatever modifiers were needed to reach it, find bindings that could be reached, possibly by including additional modifiers.
 * Since this corresponds to an "actual" key being pressed, any modifiers using to access the key event will be inaccessible for reaching any key bindings from it; for example, since Shift-2 is mapped to @, Shift-@ is inaccessible.
 * @param keyEvent The key event to consider
 * @param physicalModifiers The modifiers used to reach the key event. As noted in the comment below, this limits the bindings to those which don't use these modifiers
 * @param keyMapByEvent The keymap to scan
 * @returns An array with the bindings plus both the full set of modifiers (`fullPhysicalModifiers`) needed to reach the binding from the key press and the additional binding-only modifers (`keyEventModifiers`) needed to reach the binding from the key event. For example, if we were considering modifiers for @, [Shift] would be passed in as the `physicalModifiers`, and the `fullPhysicalModifiers` would be [Ctrl,Shift] while `keyEventModifiers` would Ctrl;
 */
function mapKeyEventPlusModifiersToBindings(
  keyEvent: KeyEvent,
  physicalModifiers: Modifiers,
  keyMapByEvent: KeyMapByEvent,
): Array<{
  binding: BindingByEvent;
  fullPhysicalModifiers: Modifiers;
  keyEventModifiers: Modifiers;
}> {
  const allBindingsForEvent = keyMapByEvent.bindings.get(keyEvent);
  if (allBindingsForEvent === undefined) {
    return [];
  }
  return [...allBindingsForEvent.entries()]
    .map(([bindingModifiers, bindingsByEvent]) => {
      if (doSetsIntersect(physicalModifiers, bindingModifiers)) {
        return undefined;
      } else {
        return {
          binding: bindingsByEvent,
          fullPhysicalModifiers: new Set([
            ...physicalModifiers,
            ...bindingModifiers,
          ]),
          keyEventModifiers: bindingModifiers,
        };
      }
    })
    .filter((b => b !== undefined) as <T>(b: T | undefined) => b is T);
}

/**
 * Given a key event, find accessible physical key bindings
 */
function mapKeyEventsToAccessiblePhysicalKeyBindings() {}

export function makeKeyboardWithBindings({
  keyboard,
  keyMapByEvent,
  bindingLabels,
}: {
  keyboard: Keyboard;
  keyMapByEvent: KeyMapByEvent;
  bindingLabels: BindingLabels;
}): KeyboardWithBindings {
  return keyboard
    .map(physicalKey => {
      const { keyCap, ...virtualKey } = physicalKey;

      const bindingPairs: Array<[Modifiers, PhysicalKeyBinding]> = l_.flatMap(
        [...keyCap.entries()],
        ([physicalModifiers, labeledKeyEvent]) => {
          const accessibleBindings = mapKeyEventPlusModifiersToBindings(
            labeledKeyEvent.keyEvent,
            physicalModifiers,
            keyMapByEvent,
          );

          return accessibleBindings.map(
            ({ binding, fullPhysicalModifiers, keyEventModifiers }) => {
              const bindingLabel =
                binding instanceof KeyMapByEvent
                  ? // FIXME Ideally, this would be some React component, like () => (<div class="keymap-binding" />)... but I don't want this file to have to use TSX. Maybe I make some file with the React Code for this? Or I could allow an element of bindingLabels to be the symbol KeyMap or something and put the component there...
                    'keymap placeholder'
                  : l_.defaultTo(bindingLabels.get(binding), binding);
              return [
                fullPhysicalModifiers,
                {
                  ...labeledKeyEvent,
                  keyEventModifiers,
                  binding,
                  bindingLabel,
                },
              ] as [Modifiers, PhysicalKeyBinding];
            },
          );
        },
      );

      if (bindingPairs.length === 0) {
        return undefined;
      }

      return {
        ...virtualKey,
        bindings: l_.fromPairs(bindingPairs),
      };
    })
    .filter((key => key !== undefined) as <T>(key: T | undefined) => key is T);
}
