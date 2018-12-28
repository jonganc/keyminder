import { KeyEvent, KeyEventLabels, Modifiers } from './key-bindings';
import { DeepMap, Label, Shape } from './types';

export type KeyCode = string;

/**
 * a virtual key, representing the size and location of a physical key and which keycode it represents
 */
export interface VirtualKey {
  keyCode: KeyCode;
  shape: Shape;
}

/**
 * the geometry of a keyboard type, e.g. the generic geometry of 105-key keyboard
 */
export type Geometry = VirtualKey[];

export interface LabeledKeyEvent {
  keyEvent: KeyEvent;
  keyEventLabel: Label;
}

/**
 * A keyboard localization, i.e. a mapping giving the meaning and appearance of a KeyCode being pressed with various modifers. Thus, it is like a key-cap, that is, what is "printed" on the key and what it does when pressed.
 */
export type LocalizedKeys = Map<KeyCode, DeepMap<Modifiers, KeyEvent>>;

export type KeyCap = DeepMap<Modifiers, LabeledKeyEvent>;

/**
 * the representation of a physical key, containing a shape, key code, and the key's emitted when it is pressed
 */
export interface PhysicalKey extends VirtualKey {
  keyCap: KeyCap;
}

/**
 * one specific keyboard, with the actual keys that are passed to programs on key presses
 */
export type Keyboard = PhysicalKey[];

export function makeKeyboard({
  localizedKeys,
  geometry,
  keyEventLabels,
}: {
  localizedKeys: LocalizedKeys;
  geometry: Geometry;
  keyEventLabels?: KeyEventLabels;
}): Keyboard {
  const theKeyEventLabels =
    keyEventLabels === undefined ? new Map() : keyEventLabels;

  return geometry
    .map(virtualKey => {
      const keyCap = keyCaps.get(virtualKey.keyCode);

      if (keyCap === undefined) {
        return undefined;
      }

      const labeledKeyCapPairs = [...keyCap.entries()].map(
        ([modifiers, keyEvent]) => {
          const keyEventLabel = theKeyEventLabels.get(keyEvent);
          if (keyEventLabel === undefined) {
            return [modifiers, { keyEvent, keyEventLabel: keyEvent }] as [
              Modifiers,
              LabeledKeyEvent
            ];
          }
          return [modifiers, { keyEvent, keyEventLabel }] as [
            Modifiers,
            LabeledKeyEvent
          ];
        },
      );

      return { ...virtualKey, keyCap: new DeepMap(labeledKeyCapPairs) };
    })
    .filter((vk => vk !== undefined) as (
      val: PhysicalKey | undefined,
    ) => val is PhysicalKey);
}
