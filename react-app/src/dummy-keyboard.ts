// a dummy keyboard for testing

import { Geometry, KeyLabels, Layout, Shape } from './model/keyboard-layout';
import { DeepMap } from './model/types';

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

export const layout: Layout = new Map([
  ['AE01', new DeepMap([[new Set(), 'q'], [new Set(['Shift']), 'Q']])],
  ['AE02', new DeepMap([[new Set(), 'w'], [new Set(['Shift']), 'W']])],
  ['AE03', new DeepMap([[new Set(), 'e'], [new Set(['Shift']), 'E']])],
  ['RTRN', new DeepMap([[new Set(), 'Enter']])],
  ['AD01', new DeepMap([[new Set(), 'a'], [new Set(['Shift']), 'A']])],
  ['AD02', new DeepMap([[new Set(), 's'], [new Set(['Shift']), 'S']])],
  ['AD03', new DeepMap([[new Set(), 'd'], [new Set(['Shift']), 'D']])],
]);

export const keyLabels: KeyLabels = new Map([]);
