import l_ from 'lodash';
import { KeyEvent, KeyEventLabels, Modifiers } from './key-bindings';
import { DeepMap, Label, RawPoint, Shape } from './types';

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
 * For purposes of displaying the key, we convert contains the shape to units out of 1 (i.e. 0.3 is 30% of full width or height) and find an appropriate bounding box for text
 */
export interface VirtualKeyWithProcessedShape extends VirtualKey {
  relativeShape: Shape;
  /**
   * the Shape of a text box completely contained within shape.
   */
  relativeTextBox: Shape;
}

type GeometryWithRelativeShapes = VirtualKeyWithProcessedShape[];

/**
 * the representation of a physical key, containing a shape, key code, and the key's emitted when it is pressed.
 */
interface PhysicalKey extends VirtualKeyWithProcessedShape {
  keyCap: KeyCap;
}

/**
 * one specific keyboard, with the actual keys that are passed to programs on key presses
 */
// mainly an internal representation
export type Keyboard = PhysicalKey[];

function getAllOfOneCoordFromGeometry(
  geometry: Geometry,
  coord: 0 | 1,
): number[] {
  return l_.flatMap(geometry, virtualKey =>
    virtualKey.shape.points.map(p => p.coords[coord]),
  );
}

function getMaxForCoordsForGeometry(geometry: Geometry): RawPoint {
  return [
    Math.max(...getAllOfOneCoordFromGeometry(geometry, 0)),
    Math.max(...getAllOfOneCoordFromGeometry(geometry, 1)),
  ];
}

function makeGeometryWithRelativeDimensions(
  geometry: Geometry,
): GeometryWithRelativeShapes {
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
  const geometryWithRelativeDimensions = makeGeometryWithRelativeDimensions(
    geometry,
  );

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
