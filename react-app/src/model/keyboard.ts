import l_ from 'lodash';
import { Modifiers } from 'popper.js';
import {
  Binding,
  BindingLabels,
  KeyBindings,
  KeySequence,
  ModdedKey,
} from './key-bindings';
import {
  Geometry,
  KeyCap,
  KeyCapKey,
  KeyCaps,
  VirtualKey,
  Keyboard,
} from './keyboard-layout';
import { DeepMap, Label } from './types';

// combine key bindings and layouts into keyboards

/**
 * The binding options for a `PartialKeyboardFullKeyBindings`
 * a value of `null` means that the pressed key would be an incomplete part of a key-sequence
 */
type PartialKeyboardKeyBinding = Binding | null;

export type PartialKeyboardFullKeyBindings = DeepMap<
  Modifiers,
  KeyCapKey &
    // this represents the fact that the binding might not have the same modifiers
    ModdedKey & {
      bindingLabel: Label;
      binding: PartialKeyboardKeyBinding;
    }
>;

/**
 * a keycap with bindings
 */
export type PartialKeyboardKey = VirtualKey & {
  bindings: PartialKeyboardFullKeyBindings;
};

/**
 * A partial keyboard gives all keybindings immediately reachable from a particular state (i.e. a sequence of keys already pressed).
 */
export type PartialKeyboard = PartialKeyboardKey[];

interface AccessibleBinding {
  binding: Binding;
  keySequence: KeySequence;
  remainingKeySequence: KeySequence;
}

/**
 * return all bindings in `keybindings` accessible from the current key sequence pressed
 */
function bindingsAccessbileFromKeySequenceState(
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
 * make a partial keyboard
 * @param keySequenceState The key sequence pressed so far
 */
export function makePartialKeyboard({
  keyboard,
  keyBindings,
  keySequenceState,
}: {
  keyboard: Keyboard;
  keyBindings: KeyBindings;
  keySequenceState: KeySequence;
}): PartialKeyboard {}
