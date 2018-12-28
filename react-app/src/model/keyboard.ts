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
  LabeledKeyCapEvent,
  VirtualKey,
  Keyboard,
  PhysicalKey,
} from './keyboard-layout';
import { DeepMap, Label, doSetsIntersect } from './types';

// combine key bindings and layouts into keyboards

interface PhysicalKeyBindingSingle extends LabeledKeyCapEvent {
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
export type KeyboardWithBindings = PhysicalKeyWithBindings[];

/**
 * return all bindings in `keybindings` accessible from the current key sequence pressed
 */
function getAccessibleBindings(
  keyMap: KeyMap,
  keySequenceState: KeySequence,
): Array<{
  binding: Binding;
  keySequence: KeySequence;
  remainingKeySequence: KeySequence;
}> {
  return [...keyMap.bindings.entries()]
    .map(([keySequence, binding]) => {
      if (
        l_.isEqual(
          keySequence.slice(0, keySequenceState.length),
          keySequenceState,
        )
      ) {
        return {
          binding,
          keySequence,
          remainingKeySequence: keySequence.slice(keySequenceState.length),
        };
      }
      return undefined;
    })
    .filter((b => b !== undefined) as <T>(b: T | undefined) => b is T);
}

/**
 * Find bindings that could be reached from a physical key being pressed
 * @param keyEvent The key event to consider
 * @param physicalModifiers The modifiers used to reach the key event. As noted in the comment below, this limits the bindings to those which don't use these modifiers
 * @param keyMapByEvent The keymap to scan
 * @returns An array with the bindings plus the full set of modifiers needed to reach the binding
 */
// Note that using modifiers to reach a key event means these modifiers can no longer modify the key event. For example, if we have a binding for Shift-@, this is inaccessible since reaching @ involves pressing Shift-2; there's no way to add a Shift on top of @.
function getAccessibleBindingsFromPhysicalKeyEvent(
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

export function makeKeyboardWithBindings({
  keyboard,
  keyMapByEvent,
  bindingLabels,
}: {
  keyboard: Keyboard;
  keyMapByEvent: KeyMapByEvent;
  bindingLabels: BindingLabels;
}): KeyboardWithBindings {
  keyboard.map(physicalKey => {
    const { keyCap, ...virtualKey } = physicalKey;

    const bindingPairs = [...keyCap.entries()].map(
      ([physicalModifiers, labeledKeyCapEvent]) => {
        const accessibleBindings = getAccessibleBindingsFromPhysicalKeyEvent(
          labeledKeyCapEvent.keyEvent,
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
                ...labeledKeyCapEvent,
                keyEventModifiers,
                binding,
                bindingLabel,
              },
            ] as [Modifiers, PhysicalKeyBinding];
          },
        );
      },
    );

    return {
      ...virtualKey,
      bindings: [...keyCap.entries()].map(
        ([modifiers, labeledKeyCapEvent]) => {},
      ),
    };
  });

  const accessibleBindings = getAccessibleBindings(
    keyBindings,
    keySequenceState,
  );
}
