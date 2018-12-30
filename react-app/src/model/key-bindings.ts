import { DeepMap, Label } from './types';

/**
 * the most basic unit of a key sequence, e.g. "A" or "PageUp", and which can be modified with modifiers like "Shift" or "Control"
 * key names match what would be in the KeyboardEvent.key property of a keyboard event in a web browser. In particular:
 * - for keys with a printed representation, the name is the Unicode representation of the printed key, e.g. 'a' or '@'
 * - for non-printable keys, the names are given at https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values, e.g. 'Alt', 'NumLock'
 */
//
export type KeyEvent = string;

export type KeyEventLabels = Map<KeyEvent, Label>;

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
export function Modifiers(modifiers: Modifier[]) {
  return new Set(modifiers);
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

export interface ModdedKeyEvent {
  keyEvent: KeyEvent;
  modifiers: Modifiers;
}

export interface KeyMap {
  bindings: DeepMap<ModdedKeyEvent, Binding>;
  name?: string;
}

export type Binding = string | KeyMap;

export class KeyMapByEvent {
  constructor(
    public readonly bindings: Map<KeyEvent, DeepMap<Modifiers, BindingByEvent>>,
    public readonly name?: string,
  ) {}
}

export type BindingByEvent = string | KeyMapByEvent;

/**
 * A way for bindings to be displayed via labels instead of the binding name
 */
export type BindingLabels = Map<string, Label>;

export type KeySequence = ModdedKeyEvent[];

export function makeKeyMapByEvent(keyMap: KeyMap): KeyMapByEvent {
  const { name, bindings: fullBindings } = keyMap;
  const fullBindingsByEvent = new Map<
    KeyEvent,
    DeepMap<Modifiers, BindingByEvent>
  >([]);
  fullBindings.forEach((binding, moddedKeyEvent) => {
    const bindingByEvent =
      typeof binding === 'string' ? binding : makeKeyMapByEvent(binding);

    const bindingAndModifiersForEvent = fullBindingsByEvent.get(
      moddedKeyEvent.keyEvent,
    );
    if (bindingAndModifiersForEvent === undefined) {
      fullBindingsByEvent.set(
        moddedKeyEvent.keyEvent,
        new DeepMap([[moddedKeyEvent.modifiers, bindingByEvent]]),
      );
    } else {
      bindingAndModifiersForEvent.set(moddedKeyEvent.modifiers, bindingByEvent);
    }
  });

  return { name, bindings: fullBindingsByEvent };
}
