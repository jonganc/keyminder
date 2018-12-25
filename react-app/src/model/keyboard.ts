import l_ from 'lodash';
import { Modifiers } from 'popper.js';
import {
  Binding,
  BindingLabels,
  KeyMap,
  KeySequence,
  ModdedKeyEvent,
} from './key-bindings';
import {
  Geometry,
  KeyCap,
  LabeledKeyCapEvent,
  KeyCaps,
  VirtualKey,
  Keyboard,
  PhysicalKey,
} from './keyboard-layout';
import { DeepMap, Label } from './types';

// combine key bindings and layouts into keyboards

export type PhysicalKeyBindings = DeepMap<
  Modifiers,
  LabeledKeyCapEvent & {
    /**
     * The physical-key modifiers might be transformed to produce the key-event modifiers, which is what is actually used to determine the bindings. Thus, we include the key-event modifiers for completeness. E.g. if we press Ctrl-Shift-A, the physical-key modifiers will be [Ctrl, Shift] but the key-event modifiers will just be [Ctrl].
     */
    keyEventModifiers: Modifiers;
    binding: Binding;
    bindingLabel: Label;
  }
>;

export type PhysicalKeyWiAccessibleBindings = VirtualKey & {
  bindings: PhysicalKeyBindings;
};

/**
 * All keybindings immediately accessible from a particular state (i.e. a sequence of keys already pressed).
 */
export type KeyboardWiAccessibleBindings = PhysicalKeyWiAccessibleBindings[];

/**
 * Search for `keySequence` in `keyMap`
 * @returns If binding is not found
 */
function scanKeyMapForKeySequence(
  keyMap: KeyMap,
  keySequence: KeySequence,
): { binding: Binding; remainingKeySequence: KeySequence } | undefined {}

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
 * make a physical keyboard
 * @param keySequenceState The key sequence pressed so far
 */
export function makePhysicalKeyWiAccessibleBindings({
  keyboard,
  keyBindings,
  keySequenceState,
}: {
  keyboard: Keyboard;
  keyBindings: KeyMap;
  keySequenceState: KeySequence;
}): KeyboardWiAccessibleBindings {
  const accessibleBindings = getAccessibleBindings(
    keyBindings,
    keySequenceState,
  );
}
