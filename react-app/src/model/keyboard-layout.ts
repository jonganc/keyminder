import { Key, Modifier } from './keybindings';

/**
 * a code that corresponds to a particular physical location on a keyboard, without specifying what that location actually represents.
 * we use the same codes as in XWindows, which are all 4-letter strings, e.g. "TLDE" for (the standard location of) the '~' character, "AE01" for the '1' key, "AD01" for the 'q' key
 */
export type KeyCode = string;

/**
 * a point on the edge of a keyboard key, given by an x and y coordinate
 * the units are essentially arbitrary: the length of the space will be filled by all the KeyCap's.
 */
export type Point = [number, number];

/**
 * the shape of a keyboard key
 * Being a non-flat 2-dimensional objects, it needs at least three points
 */
export type Shape = [Point, Point, Point, ...Point[]];

/**
 * a virtual keycap, representing the appearance of a key and what happens when it is pushed
 */
export interface KeyCap {
  keyCode: KeyCode;
  shape: Shape;
  /**
   * this can be any HTML
   */
  label: string;
}

/**
 * the geometry of a keyboard type, e.g. the generic geometry of 105-key keyboard
 */
export type Geometry = KeyCap[];

/**
 * a mapping of a KeyCode to Keys.
 * Note that if if a KeyCode with a Modifier maps to a key, that key will be produced without the modifier. E.g., the physical key 'A' on a US keyboard has the keymapping `{ '': 'a', 'Shift': 'A'}`, which means that when Shift is held and the key 'A' is pressed, a ModdedKey of `{ key: 'A' }` is generated, not  `{ key: 'a', modifiers: 'Shift' }` or `{ key: 'A', modifiers: 'Shift' }`
 */
export type KeyMapping = { '': Key } & { [mod in Modifier]: Key | undefined };

/**
 * a mapping of KeyCode's to Key's
 * E.g. a layout lets us go from the Geometry of a 105-key keyboard to a US 105-key keyboard
 */
export type Layout = { [keyCode in KeyCode]: KeyMapping | undefined };
