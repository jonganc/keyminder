import l_ from 'lodash';
import { KeyEvent, KeyEventLabels, Modifiers } from './key-bindings';
import { DeepMap, Labelapp } from './types';

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

export interface LabeledKeyEvent {
  keyEvent: KeyEvent;
  keyEventLabel: Label;
}

export type KeyCap = DeepMap<Modifiers, KeyEvent>;

export type Layout = Map<KeyCode, KeyCap>;

export type LabeledKeyCap = DeepMap<Modifiers, LabeledKeyEvent>;

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
  keyCap: LabeledKeyCap;
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

export function makeKeyboard({
  geometry,
  layout,
  keyEventLabels,
}: {
  geometry: Geometry;
  layout: Layout;
  keyEventLabels?: KeyEventLabels;
}): Keyboard {
  const geometryForRendering = makeGeometryForRendering(geometry);

  const theKeyEventLabels =
    keyEventLabels === undefined ? new Map() : keyEventLabels;

  return geometryForRendering.map(keyRowForRendering => ({
    ...keyRowForRendering,
    keys: keyRowForRendering.keys
      .map(virtualKeyForRendering => {
        const keyCap = layout.get(virtualKeyForRendering.keyCode);

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

        return {
          ...virtualKeyForRendering,
          keyCap: new DeepMap(labeledKeyCapPairs),
        };
      })
      .filter((vk => vk !== undefined) as <T>(val: T | undefined) => val is T),
  }));
}
