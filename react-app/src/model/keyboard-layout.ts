import l_ from 'lodash';
import { observable } from 'mobx';
import { KeyEvent, Modifiers } from './key-bindings';
import { DeepMap, Label } from './types';

export type KeyCode = string;

export type Point = [number, number];

/*
 * a virtual key, representing the size and location of a physical key and which keycode it represents
 */
export class VirtualKey {
  readonly keyCode!: KeyCode;
  @observable width!: number;
  /**
   * the left margin of the key, in the same units as the width
   */
  @observable marginLeft?: number;

  constructor(input: VirtualKey) {
    Object.assign(this, input);
  }
}

export class KeyRow {
  public static fromRaw({ keys, marginBottom }: KeyRow): KeyRow {
    if (keys.some(rawVirtualKey => rawVirtualKey instanceof KeyRow)) {
      throw new Error(
        "All key's passed to KeyRow constructor must not be instances of VirtualKey",
      );
    }
    return new KeyRow({
      keys: keys.map(rawVirtualKey => new VirtualKey(rawVirtualKey)),
      marginBottom,
    });
  }

  @observable keys!: VirtualKey[];
  @observable marginBottom?: number | string;

  constructor(input: KeyRow) {
    if (input.keys.some(virtualKey => !(virtualKey instanceof KeyRow))) {
      throw new Error(
        "All key's passed to KeyRow constructor must be instances of VirtualKey",
      );
    }
    Object.assign(this, input);
  }
}

/**
 * the geometry of a keyboard type, e.g. the generic geometry of 105-key keyboard
 */
export class Geometry {
  geometryName: string;
  rows: KeyRow[];
}

export interface KeyCap {
  /**
   * Generally, the label from KeyEvent will be used but, occassionally, it might be helpful if the keyCap itself has a label
   */
  keyCapLabel: Label;
  keyEvents: DeepMap<Modifiers, KeyEvent>;
}

export interface Layout {
  layoutName: string;
  keyCaps: Map<KeyCode, KeyCap>;
}

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

interface GeometryForRendering {
  geometryName: string;
  rows: KeyRowForRendering[];
}

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
export interface Keyboard {
  geometryName: string;
  layoutName: string;
  rows: PhysicalRow[];
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
