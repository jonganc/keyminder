import { Modifiers } from 'popper.js';
import { KeyEvent } from './key-bindings';
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
 * A mapping giving the meaning (in terms of a key) and appearance of a KeyCode being pressed with various modifers. I.e., a key-cap, that is, what is "printed" on the key and what it does when pressed.
 * Note that if a key-cap with a modifier maps to a key, that key will be produced without the modifier. E.g., the physical key 'A' on a US keyboard has the keymapping `[[[], 'a'], [['shift'], 'A']]`, which means that when Shift is held and the physical key is pressed, a ModdedKey of `{ key: 'A', modifiers: new Set() }` is generated, not  `{ key: 'a', modifiers: new Set('Shift') }` or `{ key: 'A', modifiers: new Set('Shift') }`
 */
export type KeyCap = DeepMap<Modifiers, KeyEvent>;

/**
 * a mapping of KeyCode's to KeyCaps's, i.e. a keyboard localization
 * E.g. a layout lets us go from the Geometry of a 105-key keyboard to a US 105-key keyboard
 */
export type KeyCaps = Map<KeyCode, KeyCap>;

export interface LabeledKeyCapEvent {
  keyEvent: KeyEvent;
  keyEventLabel: Label;
}

export type LabeledKeyCaps = DeepMap<Modifiers, LabeledKeyCapEvent>;

export type KeyEventLabels = Map<KeyEvent, Label>;

/**
 * the representation of a physical key, containing a shape, key code, and the key's emitted when it is pressed
 */
export type PhysicalKey = VirtualKey & {
  keyCap: LabeledKeyCaps;
};

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
