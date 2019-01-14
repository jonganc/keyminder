import l_ from 'lodash';
import { KeyEvent, Modifiers } from './key-bindings';
import { DeepMap, Label } from './types';

export type KeyCode = string;

export type Point = [number, number];

/**
 * a virtual key, representing the size and location of a physical key and which keycode it represents
 */
export interface VirtualKey {
  keyCode: KeyCode;
  width: number;
  /**
   * the left margin of the key, in the same units as the width
   */
  marginLeft?: number;
}

export interface KeyRow {
  keys: VirtualKey[];
  marginBottom?: number | string;
}

/**
 * the geometry of a keyboard type, e.g. the generic geometry of 105-key keyboard
 */
export type Geometry = KeyRow[];

export interface KeyCap {
  label: Label;
  keyEvents: DeepMap<Modifiers, KeyEvent>;
}

export type Layout = Map<KeyCode, KeyCap>;

/**
 * For purposes of displaying the key, we convert the width to units out of 1 (i.e. 0.3 is 30% of full width)
 */
export interface VirtualKeyForRendering extends VirtualKey {
  relativeMarginLeft: number;
  relativeWidth: number;
}

export interface KeyRowForRendering extends KeyRow {
  keys: VirtualKeyForRendering[];
}

type GeometryForRendering = KeyRowForRendering[];

interface PhysicalKey extends VirtualKeyForRendering {
  keyCap: KeyCap;
}

export interface PhysicalRow extends KeyRowForRendering {
  keys: PhysicalKey[];
}

/**
 * one specific keyboard, with the actual keys that are passed to programs on key presses
 */
// mainly an internal representation
export type Keyboard = PhysicalRow[];

function getKeyRowWidth(keyRow: KeyRow): number {
  let sum = 0;
  for (const key of keyRow.keys) {
    sum += key.width + l_.defaultTo(key.marginLeft, 0);
  }
  return sum;
}

function getGeometryWidth(geometry: Geometry): number {
  return Math.max(...geometry.map(getKeyRowWidth));
}

function makeGeometryForRendering(geometry: Geometry): GeometryForRendering {
  const factor = 1 / getGeometryWidth(geometry);

  return geometry.map(row => ({
    ...row,
    keys: row.keys.map(vk => ({
      ...vk,
      relativeWidth: factor * vk.width,
      relativeMarginLeft:
        vk.marginLeft === undefined ? 0 : factor * vk.marginLeft,
    })),
  }));
}

export function makeKeyboard(geometry: Geometry, layout: Layout): Keyboard {
  const geometryForRendering = makeGeometryForRendering(geometry);

  return geometryForRendering.map(keyRowForRendering => ({
    ...keyRowForRendering,
    keys: keyRowForRendering.keys
      .map(virtualKeyForRendering => {
        const keyCap = layout.get(virtualKeyForRendering.keyCode);

        if (keyCap === undefined) {
          throw new Error(
            `keyCode ${virtualKeyForRendering.keyCode} not found in layout`,
          );
        }

        return {
          ...virtualKeyForRendering,
          keyCap,
        };
      })
      .filter((vk => vk !== undefined) as <T>(val: T | undefined) => val is T),
  }));
}
