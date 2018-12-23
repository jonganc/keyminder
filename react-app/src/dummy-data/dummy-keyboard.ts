// a dummy keyboard for testing

import { Modifier } from '../model/keybindings';
import { Geometry, KeyLabels, Layout, Shape } from '../model/keyboard-layout';
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

export const layout: Layout = new Map([
  [
    'AE01',
    new DeepMap([
      [new Set<Modifier>(), 'q'],
      [new Set<Modifier>(['Shift']), 'Q'],
    ]),
  ],
  [
    'AE02',
    new DeepMap([
      [new Set<Modifier>(), 'w'],
      [new Set<Modifier>(['Shift']), 'W'],
    ]),
  ],
  [
    'AE03',
    new DeepMap([
      [new Set<Modifier>(), 'e'],
      [new Set<Modifier>(['Shift']), 'E'],
    ]),
  ],
  ['RTRN', new DeepMap([[new Set<Modifier>(), 'Enter']])],
  [
    'AD01',
    new DeepMap([
      [new Set<Modifier>(), 'a'],
      [new Set<Modifier>(['Shift']), 'A'],
    ]),
  ],
  [
    'AD02',
    new DeepMap([
      [new Set<Modifier>(), 's'],
      [new Set<Modifier>(['Shift']), 'S'],
    ]),
  ],
  [
    'AD03',
    new DeepMap([
      [new Set<Modifier>(), 'd'],
      [new Set<Modifier>(['Shift']), 'D'],
    ]),
  ],
]);

export const keyLabels: KeyLabels = new Map([]);
