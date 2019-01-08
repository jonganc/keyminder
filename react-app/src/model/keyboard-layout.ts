import l_ from 'lodash';
import { KeyEvent, KeyEventLabels, Modifiers } from './key-bindings';
import { DeepMap, Label, RawPoint, Rectangle } from './types';

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
  marginLeft: number;
}

export interface KeyRow {
  keys: VirtualKey[];
  marginBottom: number | string;
}

/**
 * the geometry of a keyboard type, e.g. the generic geometry of 105-key keyboard
 */
export type Geometry = KeyRow[];

export interface LabeledKeyEvent {
  keyEvent: KeyEvent;
  keyEventLabel: Label;
}

export type Layout = Map<KeyCode, DeepMap<Modifiers, KeyEvent>>;

export type KeyCap = DeepMap<Modifiers, LabeledKeyEvent>;

/**
 * For purposes of displaying the key, we convert the width to units out of 1 (i.e. 0.3 is 30% of full width)
 */
export interface VirtualKeyForRendering extends VirtualKey {
  relativeMarginLeft: number;
  relativeWidth: number;
}

interface PhysicalKey extends VirtualKeyForRendering {
  keyCap: KeyCap;
}

export interface KeyRowForRendering {
  keys: VirtualKeyForRendering[];
  marginBottom: number | string;
}

type GeometryForRendering = KeyRowForRendering[];

/**
 * one specific keyboard, with the actual keys that are passed to programs on key presses
 */
// mainly an internal representation
export type Keyboard = GeometryForRendering[];

function getKeyRowWidth(keyRow: KeyRow): number {}

function getAllOfOneCoordFromGeometry(
  geometry: Geometry,
  coord: 0 | 1,
): number[] {
  return l_.flatMap(geometry, virtualKey => {
    return virtualKey.shape.points.map(p => p[coord]);
  });
}

function getMaxForCoordsForGeometry(geometry: Geometry): RawPoint {
  return [
    Math.max(...getAllOfOneCoordFromGeometry(geometry, 0)),
    Math.max(...getAllOfOneCoordFromGeometry(geometry, 1)),
  ];
}

function makeGeometryForRendering(geometry: Geometry): GeometryForRendering {
  const maxForCoords = getMaxForCoordsForGeometry(geometry);
  const scaleFactors = [1 / maxForCoords[0], 1 / maxForCoords[1]];

  return geometry.map(vk => ({
    ...vk,
    relativeShape: vk.shape.scale(scaleFactors[0], scaleFactors[1]),
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
  const geometryWithRelativeDimensions = makeGeometryForRendering(geometry);

  const theKeyEventLabels =
    keyEventLabels === undefined ? new Map() : keyEventLabels;

  return geometryWithRelativeDimensions
    .map(virtualKeyWithRelativeDimensions => {
      const keyCap = layout.get(virtualKeyWithRelativeDimensions.keyCode);

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
        ...virtualKeyWithRelativeDimensions,
        keyCap: new DeepMap(labeledKeyCapPairs),
      };
    })
    .filter((vk => vk !== undefined) as <T>(val: T | undefined) => val is T);
}
