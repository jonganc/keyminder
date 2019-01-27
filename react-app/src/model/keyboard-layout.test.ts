import { KeyEvent, Modifiers } from './key-bindings';
import {
  Geometry,
  Keyboard,
  KeyCap,
  KeyCode,
  Layout,
  makeKeyboard,
} from './keyboard-layout';
import { DeepMap } from './types';

describe('makeKeyboard', () => {
  it('should make a Keyboard', () => {
    const geometry: Geometry = {
      geometryName: 'test-geometry',
      rows: [
        {
          keys: [
            { keyCode: 'AE01', width: 20 },
            { keyCode: 'AE02', width: 20, marginLeft: 10 },
          ],
          marginBottom: 5,
        },
        {
          keys: [{ keyCode: 'AD01', width: 15 }],
          marginBottom: 10,
        },
      ],
    };

    const layout: Layout = {
      layoutName: 'test-layout',
      keyCaps: new Map<KeyCode, KeyCap>([
        [
          'AE01',
          {
            keyCapLabel: '1',
            keyEvents: new DeepMap<Modifiers, KeyEvent>([
              [Modifiers(), '1'],
              [Modifiers(['Shift']), '!'],
            ]),
          },
        ],
        [
          'AE02',
          {
            keyCapLabel: '2',
            keyEvents: new DeepMap<Modifiers, KeyEvent>([[Modifiers(), '2']]),
          },
        ],

        [
          'AD01',
          {
            keyCapLabel: 'q',
            keyEvents: new DeepMap<Modifiers, KeyEvent>([
              [Modifiers(), 'q'],
              [Modifiers(['Shift']), 'Q'],
            ]),
          },
        ],
      ]),
    };
    const keyboard = makeKeyboard(geometry, layout);

    const expectedKeyboard = {
      geometryName: 'test-geometry',
      layoutName: 'test-layout',
      rows: expect.arrayContaining([
        {
          keys: [
            {
              keyCode: 'AE01',
              width: 20,
              relativeWidth: 0.4,
              relativeMarginLeft: 0,
              keyCap: {
                keyCapLabel: '1',
                keyEvents: new DeepMap([
                  [Modifiers(), '1'],
                  [Modifiers(['Shift']), '!'],
                ]),
              },
            },
            {
              keyCode: 'AE02',
              width: 20,
              marginLeft: 10,
              relativeWidth: 0.4,
              relativeMarginLeft: 0.2,
              keyCap: {
                keyCapLabel: '2',
                keyEvents: new DeepMap([[Modifiers(), '2']]),
              },
            },
          ],
          marginBottom: 5,
        },
        {
          keys: [
            {
              keyCode: 'AD01',
              width: 15,
              relativeWidth: 0.3,
              relativeMarginLeft: 0,
              keyCap: {
                keyCapLabel: 'q',
                keyEvents: new DeepMap([
                  [Modifiers(), 'q'],
                  [Modifiers(['Shift']), 'Q'],
                ]),
              },
            },
          ],
          marginBottom: 10,
        },
      ]),
    } as Keyboard;

    expect(keyboard).toEqualExtended(expectedKeyboard, 5);
  });
});
