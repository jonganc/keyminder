// a dummy keyboard for testing

import { Modifiers } from '../model/key-bindings';
import { Geometry, Layout, makeKeyboard } from '../model/keyboard-layout';
import { DeepMap } from '../model/types';

const geometry: Geometry = {
  geometryName: 'test-geometry',
  rows: [
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
  ],
};

const layout: Layout = {
  layoutName: 'test-layout',
  keyCaps: new Map([
    [
      'AE01',
      {
        keyCapLabel: 'Q',
        keyEvents: new DeepMap([
          [Modifiers(), 'q'],
          [Modifiers(['Shift']), 'Q'],
        ]),
      },
    ],
    [
      'AE02',
      {
        keyCapLabel: 'W',
        keyEvents: new DeepMap([
          [Modifiers(), 'w'],
          [Modifiers(['Shift']), 'W'],
        ]),
      },
    ],
    [
      'AE03',
      {
        keyCapLabel: 'E',
        keyEvents: new DeepMap([
          [Modifiers(), 'e'],
          [Modifiers(['Shift']), 'E'],
        ]),
      },
    ],
    [
      'AD01',
      {
        keyCapLabel: 'A',
        keyEvents: new DeepMap([
          [Modifiers(), 'a'],
          [Modifiers(['Shift']), 'A'],
        ]),
      },
    ],
    [
      'AD02',
      {
        keyCapLabel: 'S',
        keyEvents: new DeepMap([
          [Modifiers(), 's'],
          [Modifiers(['Shift']), 'S'],
        ]),
      },
    ],
    [
      'AD03',
      {
        keyCapLabel: 'D',
        keyEvents: new DeepMap([
          [Modifiers(), 'd'],
          [Modifiers(['Shift']), 'D'],
        ]),
      },
    ],
    [
      'RTRN',
      {
        keyCapLabel: '&#x23CE;',
        keyEvents: new DeepMap([[Modifiers(), 'Enter']]),
      },
    ],
  ]),
};

export const keyboard = makeKeyboard(geometry, layout);
