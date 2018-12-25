import { DeepMap, Label } from './types';

/**
 * the most basic unit of a key sequence, e.g. "A" or "PageUp", and which can be modified with modifiers like "Shift" or "Control"
 * key names match what would be in the KeyboardEvent.key property of a keyboard event in a web browser. In particular:
 * - for keys with a printed representation, the name is the Unicode representation of the printed key, e.g. 'a' or '@'
 * - for non-printable keys, the names are given at https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values, e.g. 'Alt', 'NumLock'
 */
//
export type KeyEvent = string;

export type Modifier =
  | 'Control'
  | 'Alt'
  | 'Shift'
  | 'NumLock'
  | 'Win'
  | 'Super'
  | 'Meta'
  | 'Hyper';

export type Modifiers = Set<Modifier>;
export function Modifiers(...args) {
  return new Set(...args);
}

/**
 * modifiers and how to display them, by default
 * @param display what to display for the shortened form, as html. null to indicate no default form
 * @param order The relative order,lowest first.
 */
export const modifierDisplays: {
  [key in Modifier]:
    | { display: string; order: number }
    | { display: null; order?: undefined }
} = {
  Control: { display: 'C', order: 10 },
  Alt: { display: 'A', order: 20 },
  Shift: { display: '&#x21E7;', order: 30 }, // ⇧
  NumLock: { display: null },
  Win: { display: 'Win', order: 40 },
  Super: { display: 'S', order: 50 },
  Meta: { display: 'M', order: 60 },
  Hyper: { display: 'H', order: 70 },
};

/**
 * a key with appropriate modifiers
 */
export interface ModdedKeyEvent {
  /**
   * the key on the keyboard
   */
  keyEvent: KeyEvent;
  /**
   * the modifiers applied to the key
   */
  modifiers: Modifiers;
}

export type KeySequence = ModdedKeyEvent[];

export type Binding = string;

export type KeyBindings = DeepMap<KeySequence, Binding>;

// we allow for bindings to be denoted by labels instead of the binding name
export type BindingLabels = DeepMap<Binding, Label>;
