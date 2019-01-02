import l_ from 'lodash';
import {
  Binding,
  BindingByEvent,
  BindingLabels,
  KeyEvent,
  KeyMapByEvent,
  Modifiers,
} from './key-bindings';
import {
  Keyboard,
  KeyCap,
  LabeledKeyEvent,
  VirtualKeyWithProcessedShape,
} from './keyboard-layout';
import { DeepMap, doSetsIntersect, groupByDeep, Label } from './types';

// combine key bindings and layouts into keyboards

interface PhysicalKeyBindingSingle extends LabeledKeyEvent {
  /**
   * The physical-key modifiers might be transformed to produce the key-event modifiers, which is what is actually used to determine the bindings. Thus, we include the key-event modifiers for completeness. E.g. if we press Control-Shift-2, the key-event will be "@" and the physical-key modifiers will be [Control, Shift] but the key-event modifiers will just be [Control]. (It's mostly for informational purposes)
   */
  keyEventModifiers: Modifiers;
  binding: Binding;
  bindingLabel: Label;
}

// This corresponds to the case where multiple key bindings map to the same key sequence, which can happen if the physical key can generate multiple key events and there are bindings that overlap. For example, Shift-2 maps to "@". Now imagine that Control-Shift-2 were set to be translated to "!" and image that we have a binding for Control-@. Then the physical key press Control-Shift-2 would be bound to both "!" (insert "!") and the binding for Control-@. In practice, this won't often occur, since only Shift and Alt-Gr translate keys usually. But... it's not beyond the realm of possiblity so we have to allow for it.
type PhysicalKeyBindingConflicting = [
  PhysicalKeyBindingSingle,
  PhysicalKeyBindingSingle,
  ...PhysicalKeyBindingSingle[]
];

/**
 * A physical-key-binding specifies a binding for a physical key given a set of modifiers
 */
export type PhysicalKeyBinding =
  | PhysicalKeyBindingSingle
  | PhysicalKeyBindingConflicting;

export type PhysicalKeyBindings =
  | DeepMap<Modifiers, PhysicalKeyBinding>
  | undefined;

/**
 * A physical-key-with-bindings is a physical-key along with the bindings for any set of modifiers for which a binding is defined.
 */
export interface PhysicalKeyWithBindings extends VirtualKeyWithProcessedShape {
  bindings: PhysicalKeyBindings;
}

/**
 * All keybindings immediately accessible from a particular state (i.e. a sequence of keys already pressed).
 */
export type KeyboardWithBindings = PhysicalKeyWithBindings[];

/**
 * Given a key event plus whatever modifiers were needed to reach it, find bindings that could be reached, possibly by including additional modifiers.
 * Since this corresponds to an "actual" key being pressed, any modifiers using to access the key event will be inaccessible for reaching any key bindings from it; for example, since Shift-2 is mapped to @, Shift-@ is inaccessible.
 * @param keyEvent The key event to consider
 * @param physicalModifiers The modifiers used to reach the key event. As noted in the comment below, this limits the bindings to those which don't use these modifiers
 * @param keyMapByEvent The keymap to scan
 * @returns An array with the bindings plus both the full set of modifiers (`fullPhysicalModifiers`) needed to reach the binding from the key press and the additional binding-only modifers (`keyEventModifiers`) needed to reach the binding from the key event. For example, if we were considering modifiers for @, [Shift] would be passed in as the `physicalModifiers`, and the `fullPhysicalModifiers` would be [Control,Shift] while `keyEventModifiers` would Control;
 */
function mapKeyEventWithModifiersToBindings({
  keyEvent,
  physicalModifiers,
  keyMapByEvent,
}: {
  keyEvent: KeyEvent;
  physicalModifiers: Modifiers;
  keyMapByEvent: KeyMapByEvent;
}): Array<{
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
 * Given a key cap, find the accessible physical key bindings, i.e. any key bindings which can be reached via a set of modifiers
 */
function mapKeyCapToPhysicalKeyBindings({
  keyCap,
  keyMapByEvent,
  bindingLabels,
}: {
  keyCap: KeyCap;
  keyMapByEvent: KeyMapByEvent;
  bindingLabels: BindingLabels;
}): PhysicalKeyBindings | undefined {
  const rawBindingPairs: Array<[Modifiers, PhysicalKeyBinding]> = l_.flatMap(
    [...keyCap.entries()],
    ([physicalModifiers, labeledKeyEvent]) => {
      const accessibleBindings = mapKeyEventWithModifiersToBindings({
        keyEvent: labeledKeyEvent.keyEvent,
        physicalModifiers,
        keyMapByEvent,
      });

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

  if (rawBindingPairs.length === 0) {
    return undefined;
  }

  const groupedBindingPairs = groupByDeep(rawBindingPairs, pair => pair[0]).map(
    ([modifiers, rawBindingPairsForGivenModifiers]) =>
      [
        modifiers,
        rawBindingPairsForGivenModifiers.length === 1
          ? rawBindingPairsForGivenModifiers[0][1]
          : rawBindingPairsForGivenModifiers.map(pair => pair[1]),
      ] as [Modifiers, PhysicalKeyBinding],
  );

  return new DeepMap(groupedBindingPairs);
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
  return keyboard
    .map(physicalKey => {
      const { keyCap, ...virtualKey } = physicalKey;

      const bindings = mapKeyCapToPhysicalKeyBindings({
        keyCap,
        keyMapByEvent,
        bindingLabels,
      });

      return {
        ...virtualKey,
        bindings,
      };
    })
    .filter((key => key !== undefined) as <T>(key: T | undefined) => key is T);
}
