import { KeyEvent, KeyEventLabels, Modifiers } from './key-bindings';
import { DeepMap, Label, Shape } from './types';

/**
 * a code that corresponds to a particular physical location on a keyboard, without specifying what that location actually represents.
 * we use the same codes as in XWindows, which are all 4-letter strings, e.g. "TLDE" for (the standard location of) the '~' character, "AE01" for the '1' key, "AD01" for the 'q' key
 * for example, /usr/share/X11/xkb/geometry/pc on Ubuntu 18.04 gives the keycodes of the keys
 */
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

/**
 * A keyboard localization, i.e. a mapping giving the meaning and appearance of a KeyCode being pressed with various modifers. Thus, it is like a key-cap, that is, what is "printed" on the key and what it does when pressed.
 */
export type KeyCaps = Map<
  KeyCode,
  DeepMap<
    Modifiers,
    // Note that if some key-cap with certain modifier maps to a key event, that combination will produce the key event without the modifier. E.g., the physical key 'A' on a US keyboard has the keymapping `[[[], 'a'], [['shift'], 'A']]`, which means that when Shift is held and the physical key is pressed, a ModdedKey of `{ key: 'A', modifiers: new Set() }` is generated, not  `{ key: 'a', modifiers: new Set('Shift') }` or `{ key: 'A', modifiers: new Set('Shift') }`
    KeyEvent
  >
>;

export interface LabeledKeyCapEvent {
  keyEvent: KeyEvent;
  keyEventLabel: Label;
}

/**
 * the representation of a physical key, containing a shape, key code, and the key's emitted when it is pressed
 */
export interface PhysicalKey extends VirtualKey {
  keyCap: DeepMap<Modifiers, LabeledKeyCapEvent>;
}

/**
 * one specific keyboard, with the actual keys that are passed to programs on key presses
 */
export type Keyboard = PhysicalKey[];

export function makeKeyboard({
  keyCaps,
  geometry,
  keyEventLabels,
}: {
  keyCaps: KeyCaps;
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
              LabeledKeyCapEvent
            ];
          }
          return [modifiers, { keyEvent, keyEventLabel }] as [
            Modifiers,
            LabeledKeyCapEvent
          ];
        },
      );

      return { ...virtualKey, keyCap: new DeepMap(labeledKeyCapPairs) };
    })
    .filter((vk => vk !== undefined) as (
      val: PhysicalKey | undefined,
    ) => val is PhysicalKey);
}
