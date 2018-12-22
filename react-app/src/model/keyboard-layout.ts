import { Key, Modifier } from './keybindings';

/**
 * a code that corresponds to a particular physical location on a keyboard, without specifying what that location actually represents.
 * we use the same codes as in XWindows, which are all 4-letter strings, e.g. "TLDE" for (the standard location of) the '~' character, "AE01" for the '1' key, "AD01" for the 'q' key
 * for example, /usr/share/X11/xkb/geometry/pc on Ubuntu 18.04 gives the keycodes of the keys
 */
export type KeyCode = string;

export type RawPoint = [number, number];

/**
 * a point on the edge of a keyboard key, given by an x and y coordinate
 * the units are essentially arbitrary: the length of the space will be filled by all the KeyCap's.
 */
export class Point {
  constructor(public readonly coords: RawPoint) {}
  translate(x: number, y: number): Point {
    return new Point([this.coords[0] + x, this.coords[1] + y]);
  }
}

export type RawShape = [RawPoint, RawPoint, RawPoint, ...RawPoint[]];

/**
 * the shape of a keyboard key
 * Being a non-flat 2-dimensional objects, it needs at least three points
 */
export class Shape {
  constructor(public readonly points: [Point, Point, Point, ...Point[]]) {}

  static fromRawShape(rawShape: RawShape) {
    return new Shape(rawShape.map(rp => new Point(rp)));
  }

  translate(x: number, y: number): Shape {
    return new Shape(this.points.map(p => p.translate(x, y)));
  }
}

/**
 * a virtual keycap, representing the appearance of a key and what happens when it is pushed
 */
export interface KeyCap {
  keyCode: KeyCode;
  shape: Shape;
  /**
   * this can be any HTML
   */
  label?: string;
}

/**
 * the geometry of a keyboard type, e.g. the generic geometry of 105-key keyboard
 */
export type Geometry = KeyCap[];

/**
 * A mapping giving the meaning of a KeyCode being pressed with various modifers
 * Note that if a KeyCode with a Modifier maps to a key, that key will be produced without the modifier. E.g., the physical key 'A' on a US keyboard has the keymapping `[[[], 'a'], [['shift'], 'A']]`, which means that when Shift is held and the key 'A' is pressed, a ModdedKey of `{ key: 'A', modifiers: new Set() }` is generated, not  `{ key: 'a', modifiers: new Set('Shift') }` or `{ key: 'A', modifiers: new Set('Shift') }`
 */
export type KeyMapping = [Set<Modifier>, Key][];

/**
 * a mapping of KeyCode's to Key's
 * E.g. a layout lets us go from the Geometry of a 105-key keyboard to a US 105-key keyboard
 */
export type Layout = Map<KeyCode, KeyMapping>;
