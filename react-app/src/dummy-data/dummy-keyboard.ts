// a dummy keyboard for testing

import { KeyEventLabels, Modifiers } from '../model/key-bindings';
import { Geometry, Layout, makeKeyboard } from '../model/keyboard-layout';
import { DeepMap, Rectangle } from '../model/types';

const basicKeyCapShape = new Rectangle([[0, 0], [20, 20]]);

const geometry: Geometry = [
  {
    keys: [
      {
        keyCode: 'AE01',
        width: 20,
      },
      {
        keyCode: 'AE02',
        width: 20,
      },
      {
        keyCode: 'AE03',
        width: 20,
      },
    ],
  },
  {
    keys: [
      {
        keyCode: 'AD01',
        width: 20,
      },
      {
        keyCode: 'AD02',
        width: 20,
      },
      {
        keyCode: 'AD03',
        width: 20,
      },
      {
        keyCode: 'RTRN',
        width: 20,
        marginLeft: 10,
      },
    ],
  },
];

const layout: Layout = new Map([
  ['AE01', new DeepMap([[Modifiers(), 'q'], [Modifiers(['Shift']), 'Q']])],
  ['AE02', new DeepMap([[Modifiers(), 'w'], [Modifiers(['Shift']), 'W']])],
  ['AE03', new DeepMap([[Modifiers(), 'e'], [Modifiers(['Shift']), 'E']])],
  ['AD01', new DeepMap([[Modifiers(), 'a'], [Modifiers(['Shift']), 'A']])],
  ['AD02', new DeepMap([[Modifiers(), 's'], [Modifiers(['Shift']), 'S']])],
  ['AD03', new DeepMap([[Modifiers(), 'd'], [Modifiers(['Shift']), 'D']])],
  ['RTRN', new DeepMap([[Modifiers(), 'Enter']])],
]);

const keyEventLabels: KeyEventLabels = new Map([]);

export const keyboard = makeKeyboard({ geometry, layout, keyEventLabels });
