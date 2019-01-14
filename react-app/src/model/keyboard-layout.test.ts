import { KeyEvent, KeyEventLabels, Modifiers } from './key-bindings';
import { Geometry, Keyboard, Layout, makeKeyboard } from './keyboard-layout';
import { DeepMap } from './types';

describe('makeKeyboard', () => {
  it('should make a Keyboard', () => {
    const geometry: Geometry = [
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
    ];

    const layout: Layout = new Map([
      [
        'AE01',
        new DeepMap<Modifiers, KeyEvent>([
          [Modifiers(), '1'],
          [Modifiers(['Shift']), '!'],
        ]),
      ],
      ['AE02', new DeepMap<Modifiers, KeyEvent>([[Modifiers(), '2']])],

      [
        'AD01',
        new DeepMap<Modifiers, KeyEvent>([
          [Modifiers(), 'q'],
          [Modifiers(['Shift']), 'Q'],
        ]),
      ],
    ]);
    const keyEventLabels: KeyEventLabels = new Map([['q', 'The letter q']]);
    const keyboard = makeKeyboard({ geometry, layout, keyEventLabels });

    const expectedKeyboard = expect.arrayContaining([
      {
        keys: [
          {
            keyCode: 'AE01',
            width: 20,
            relativeWidth: 0.4,
            relativeMarginLeft: 0,
            keyCap: new DeepMap([
              [Modifiers(), { keyEvent: '1', keyEventLabel: '1' }],
              [Modifiers(['Shift']), { keyEvent: '!', keyEventLabel: '!' }],
            ]),
          },
          {
            keyCode: 'AE02',
            width: 20,
            marginLeft: 10,
            relativeWidth: 0.4,
            relativeMarginLeft: 0.2,
            keyCap: new DeepMap([
              [Modifiers(), { keyEvent: '2', keyEventLabel: '2' }],
            ]),
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
            keyCap: new DeepMap([
              [Modifiers(), { keyEvent: 'q', keyEventLabel: 'The letter q' }],
              [Modifiers(['Shift']), { keyEvent: 'Q', keyEventLabel: 'Q' }],
            ]),
          },
        ],
        marginBottom: 10,
      },
    ] as Keyboard);

    expect(keyboard).toEqualExtended(expectedKeyboard, 5);
  });
});
