import { DeepMap } from './types';

/**
 * the most basic unit of a key sequence, e.g. "A" or "PageUp", and which can be modified with modifiers like "Shift" or "Control"
 * key names match what would be in the KeyboardEvent.key property of a keyboard event in a web browser. In particular:
 * - for keys with a printed representation, the name is the Unicode representation of the printed key, e.g. 'a' or '@'
 * - for non-printable keys, the names are given at https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values, e.g. 'Alt', 'NumLock'
 */
//
export type Key = string;

export type Modifier =
  | 'Control'
  | 'Alt'
  | 'Shift'
  | 'NumLock'
  | 'ScrollLock'
  | 'Meta'
  | 'Super'
  | 'Win'
  | 'Hyper';

/**
 * a key with appropriate modifiers
 */
export interface ModdedKey {
  /**
   * the key on the keyboard
   */
  key: string;
  /**
   * the modifiers applied to the key
   */
  modifiers: Set<Modifier>;
}

export type KeySequence = ModdedKey[];

export type Binding = string;

export type KeyBinding = DeepMap<KeySequence, string>;
