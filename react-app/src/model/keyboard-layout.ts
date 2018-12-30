import l_ from 'lodash';
import { KeyEvent, KeyEventLabels, Modifiers } from './key-bindings';
import { DeepMap, Label, Shape, RawPoint } from './types';

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

export type Layout = Map<KeyCode, DeepMap<Modifiers, KeyEvent>>;

export type KeyCap = DeepMap<Modifiers, LabeledKeyEvent>;

/**
 * the representation of a physical key, containing a shape, key code, and the key's emitted when it is pressed
 */
interface PhysicalKey extends VirtualKey {
  keyCap: KeyCap;
}

export type Dimensions = RawPoint;

/**
 * one specific keyboard, with the actual keys that are passed to programs on key presses
 */
// mainly an internal representation
export interface Keyboard {
  dimensions: Dimensions;
  keys: PhysicalKey[];
}

function makeKeyboardKeys({
  geometry,
  layout,
  keyEventLabels,
}: {
  geometry: Geometry;
  layout: Layout;
  keyEventLabels?: KeyEventLabels;
}): PhysicalKey[] {
  const theKeyEventLabels =
    keyEventLabels === undefined ? new Map() : keyEventLabels;

  return geometry
    .map(virtualKey => {
      const keyCap = layout.get(virtualKey.keyCode);

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

function getAllOfOneCoordFromGeometry(
  geometry: Geometry,
  coord: 0 | 1,
): number[] {
  return l_.flatMap(geometry, virtualKey =>
    virtualKey.shape.points.map(p => p.coords[coord]),
  );
}

function getDimensions(geometry: Geometry): Dimensions {
  return [
    Math.max(...getAllOfOneCoordFromGeometry(geometry, 0)),
    Math.max(...getAllOfOneCoordFromGeometry(geometry, 1)),
  ];
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
  const keys = makeKeyboardKeys({
    geometry,
    layout,
    keyEventLabels,
  });

  const dimensions = getDimensions(geometry);

  return {
    dimensions,
    keys,
  };
}
