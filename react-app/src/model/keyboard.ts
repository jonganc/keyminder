import l_ from 'lodash';
import { Modifiers } from 'popper.js';
import {
  Binding,
  BindingLabels,
  KeyBindings,
  KeySequence,
  ModdedKeyEvent,
} from './key-bindings';
import {
  Geometry,
  KeyCap,
  KeyCapKey,
  KeyCaps,
  VirtualKey,
  Keyboard,
  PhysicalKey,
} from './keyboard-layout';
import { DeepMap, Label } from './types';

// combine key bindings and layouts into keyboards

export type PhysicalKeyBindings = DeepMap<
  Modifiers,
  KeyCapKey & {
    /**
     * The physical-key modifiers might be transformed to produce the key-event modifiers, which is what is actually used to determine the bindings. Thus, we include the key-event modifiers for completeness. E.g. if we press Ctrl-Shift-A, the physical-key modifiers will be [Ctrl, Shift] but the key-event modifiers will just be [Ctrl].
     */
    keyEventModifiers: Modifiers;
    /**
     * The binding for a set of `PhysicalKeyBindings` bindings.
     * A value of `null` means that the key is an incomplete part of a key-sequence
     */
    binding: Binding | null;
    bindingLabel: Label;
  }
>;

/**
 * a keycap with bindings accessible from a particular state
 */
export type PhysicalKeyWiAccessibleBindings = VirtualKey & {
  bindings: PhysicalKeyBindings;
};

/**
 * All keybindings immediately accessible from a particular state (i.e. a sequence of keys already pressed).
 */
export type KeyboardWiAccessibleBindings = PhysicalKeyWiAccessibleBindings[];

interface AccessibleBinding {
  binding: Binding;
  keySequence: KeySequence;
  remainingKeySequence: KeySequence;
}

/**
 * return all bindings in `keybindings` accessible from the current key sequence pressed
 */
function getAccessibleBindings(
  keyBindings: KeyBindings,
  keySequenceState: KeySequence,
): AccessibleBinding[] {
  return [...keyBindings.entries()]
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
    .filter((b => b !== undefined) as (
      b: AccessibleBinding | undefined,
    ) => b is AccessibleBinding);
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
  keyBindings: KeyBindings;
  keySequenceState: KeySequence;
}): KeyboardWiAccessibleBindings {
  const accessibleBindings = getAccessibleBindings(
    keyBindings,
    keySequenceState,
  );
}
