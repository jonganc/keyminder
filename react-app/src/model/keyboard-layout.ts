import l_ from 'lodash';
import { KeyEvent, Modifiers } from './key-bindings';
import { Label, ReadonlyDeepMap } from './types';

export type KeyCode = string;

export type Point = [number, number];

/**
 * a virtual key, representing the size and location of a physical key and which keycode it represents
 */
export interface VirtualKey {
  readonly keyCode: KeyCode;
  readonly width: number;
  /**
   * the left margin of the key, in the same units as the width
   */
  readonly marginLeft?: number;
}

export interface KeyRow {
  readonly keys: ReadonlyArray<VirtualKey>;
  readonly marginBottom?: number | string;
}

/**
 * the geometry of a keyboard type, e.g. the generic geometry of 105-key keyboard
 */
export interface Geometry {
  readonly geometryName: string;
  readonly rows: ReadonlyArray<KeyRow>;
}

export interface KeyCap {
  /**
   * Generally, the label from KeyEvent will be used but, occassionally, it might be helpful if the keyCap itself has a label
   */
  readonly keyCapLabel: Label;
  readonly keyEvents: ReadonlyDeepMap<Modifiers, KeyEvent>;
}

export interface Layout {
  readonly layoutName: string;
  readonly keyCaps: ReadonlyMap<KeyCode, KeyCap>;
}

/**
 * For purposes of displaying the key, we convert the width to units out of 1 (i.e. 0.3 is 30% of full width)
 */
export interface VirtualKeyForRendering extends VirtualKey {
  readonly relativeMarginLeft: number;
  readonly relativeWidth: number;
}

export interface KeyRowForRendering extends KeyRow {
  readonly keys: ReadonlyArray<VirtualKeyForRendering>;
}

interface GeometryForRendering {
  readonly geometryName: string;
  readonly rows: ReadonlyArray<KeyRowForRendering>;
}

export interface PhysicalKey extends VirtualKeyForRendering {
  readonly keyCap: KeyCap;
}

export interface PhysicalRow extends KeyRowForRendering {
  readonly keys: PhysicalKey[];
}

/**
 * one specific keyboard, with the actual keys that are passed to programs on key presses
 */
// mainly an internal representation
export interface Keyboard {
  readonly geometryName: string;
  readonly layoutName: string;
  readonly rows: PhysicalRow[];
}

function getKeyRowWidth(keyRow: KeyRow): number {
  let sum = 0;
  for (const key of keyRow.keys) {
    sum += key.width + l_.defaultTo(key.marginLeft, 0);
  }
  return sum;
}

function getGeometryWidth(geometry: Geometry): number {
  return Math.max(...geometry.rows.map(getKeyRowWidth));
}

function makeGeometryForRendering(geometry: Geometry): GeometryForRendering {
  const factor = 1 / getGeometryWidth(geometry);

  const rows = geometry.rows.map(row => ({
    ...row,
    keys: row.keys.map(vk => ({
      ...vk,
      relativeWidth: factor * vk.width,
      relativeMarginLeft:
        vk.marginLeft === undefined ? 0 : factor * vk.marginLeft,
    })),
  }));

  return {
    geometryName: geometry.geometryName,
    rows,
  };
}

export function makeKeyboard(geometry: Geometry, layout: Layout): Keyboard {
  const geometryForRendering = makeGeometryForRendering(geometry);

  const rows = geometryForRendering.rows.map(keyRowForRendering => ({
    ...keyRowForRendering,
    keys: keyRowForRendering.keys
      .map(virtualKeyForRendering => {
        const keyCap = layout.keyCaps.get(virtualKeyForRendering.keyCode);

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

  return {
    geometryName: geometry.geometryName,
    layoutName: layout.layoutName,
    rows,
  };
}
