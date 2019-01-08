import { KeyEvent, KeyEventLabels, Modifiers } from './key-bindings';
import { Geometry, Keyboard, Layout, makeKeyboard } from './keyboard-layout';
import { DeepMap, Rectangle } from './types';

describe('makeKeyboard', () => {
  it('should make a Keyboard', () => {
    const geometry: Geometry = [
      { keyCode: 'AE01', shape: new Rectangle([[0, 10], [20, 30]]) },
      { keyCode: 'AD01', shape: new Rectangle([[25, 35], [40, 50]]) },
    ];

    const layout: Layout = new Map([
      [
        'AE01',
        new DeepMap<Modifiers, KeyEvent>([
          [Modifiers(), '1'],
          [Modifiers(['Shift']), '!'],
        ]),
      ],
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

    const aN = expect.any(Number);

    const expectedKeyboard: Keyboard = expect.arrayContaining([
      {
        keyCode: 'AE01',
        shape: new Rectangle([[0, 10], [20, 30]]),
        relativeShape: new Rectangle([[0, aN], [aN, aN]]),
        keyCap: new DeepMap([
          [Modifiers(), { keyEvent: '1', keyEventLabel: '1' }],
          [Modifiers(['Shift']), { keyEvent: '!', keyEventLabel: '!' }],
        ]),
      },
      {
        keyCode: 'AD01',
        shape: new Rectangle([[25, 35], [40, 50]]),
        relativeShape: new Rectangle([[aN, aN], [1, 1]]),
        keyCap: new DeepMap([
          [Modifiers(), { keyEvent: 'q', keyEventLabel: 'The letter q' }],
          [Modifiers(['Shift']), { keyEvent: 'Q', keyEventLabel: 'Q' }],
        ]),
      },
    ]);

    expect(keyboard).toEqual(expectedKeyboard);

    // let's fully check one of the relative shapes
    const ae01RS = keyboard.find(key => key.keyCode === 'AE01')!.relativeWidth
      .points;
    for (const [actual, expected] of [
      [ae01RS[0][1], 0.2],
      [ae01RS[1][0], 0.5],
      [ae01RS[1][1], 0.6],
    ]) {
      expect(actual).toBeCloseTo(expected, 7);
    }
  });
});
