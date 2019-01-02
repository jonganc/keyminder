// a dummy keyboard for testing

import { KeyEventLabels, Modifiers } from '../model/key-bindings';
import { Geometry, Layout, Rectangle } from '../model/keyboard-layout';
import { DeepMap } from '../model/types';

const basicKeyCapShape = Shape.fromRawShape([
  [0, 0],
  [20, 0],
  [20, 20],
  [0, 20],
]);

export const geometry: Geometry = [
  {
    keyCode: 'AE01',
    shape: basicKeyCapShape,
  },
  {
    keyCode: 'AE02',
    shape: basicKeyCapShape.translate(25, 0),
  },
  {
    keyCode: 'AE03',
    shape: basicKeyCapShape.translate(50, 0),
  },
  {
    keyCode: 'RTRN',
    shape: basicKeyCapShape.translate(75, 0),
  },
  {
    keyCode: 'AD01',
    shape: basicKeyCapShape.translate(0, 25),
  },
  {
    keyCode: 'AD02',
    shape: basicKeyCapShape.translate(25, 25),
  },
  {
    keyCode: 'AD03',
    shape: basicKeyCapShape.translate(50, 25),
  },
];

export const keyCaps: Layout = new Map([
  ['AE01', new DeepMap([[Modifiers(), 'q'], [Modifiers(['Shift']), 'Q']])],
  ['AE02', new DeepMap([[Modifiers(), 'w'], [Modifiers(['Shift']), 'W']])],
  ['AE03', new DeepMap([[Modifiers(), 'e'], [Modifiers(['Shift']), 'E']])],
  ['RTRN', new DeepMap([[Modifiers(), 'Enter']])],
  ['AD01', new DeepMap([[Modifiers(), 'a'], [Modifiers(['Shift']), 'A']])],
  ['AD02', new DeepMap([[Modifiers(), 's'], [Modifiers(['Shift']), 'S']])],
  ['AD03', new DeepMap([[Modifiers(), 'd'], [Modifiers(['Shift']), 'D']])],
]);

export const keyEventLabels: KeyEventLabels = new Map([]);
