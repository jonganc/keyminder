import { observable, ObservableMap } from 'mobx';
import { DeepMap, Label, ReadonlyDeepMap } from './types';

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

export type Modifiers = ReadonlySet<Modifier>;
export function Modifiers(modifiers?: Modifier[]): Modifiers {
  return new Set(modifiers);
}

export interface ModdedKeyEvent {
  readonly keyEvent: KeyEvent;
  readonly modifiers: Modifiers;
}

export type Binding = string | KeyMap;

export interface KeyMap {
  readonly bindings: ReadonlyDeepMap<ModdedKeyEvent, Binding>;
  readonly keyMapName?: string;
}

export class KeyMapByEvent {
  constructor(
    public readonly bindings: ReadonlyMap<
      KeyEvent,
      ReadonlyDeepMap<Modifiers, BindingByEvent>
    >,
    public readonly keyMapName?: string,
  ) {}
}

export type BindingByEvent = string | KeyMapByEvent;

/**
 * A way for bindings to be displayed via labels instead of the binding name
 */
export type BindingLabels = ObservableMap<string, Label>;

export type KeySequence = ReadonlyArray<ModdedKeyEvent>;

export function makeKeyMapByEvent(keyMap: KeyMap): KeyMapByEvent {
  const { keyMapName, bindings: fullBindings } = keyMap;
  const fullBindingsByEvent = observable.map<
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

  return { keyMapName, bindings: fullBindingsByEvent };
}
