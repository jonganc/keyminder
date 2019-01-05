import { Rectangle, DeepMap } from './types';
import { Modifiers, KeyMapByEvent, BindingByEvent } from './key-bindings';

describe('makeKeyboardWithBindings', () => {
  it('should make a KeyboardWithBindings', () => {
    const keyboard = expect.arrayContaining([
      {
        keyCode: 'AE01',
        shape: new Rectangle([[0, 10], [20, 30]]),
        relativeShape: new Rectangle([[0, 0.2], [0.5, 0.6]]),
        keyCap: new DeepMap([
          [Modifiers(), { keyEvent: '1', keyEventLabel: '1' }],
          [Modifiers(['Shift']), { keyEvent: '!', keyEventLabel: '!' }],
        ]),
      },
      {
        keyCode: 'AD01',
        shape: new Rectangle([[25, 35], [40, 50]]),
        relativeShape: new Rectangle([[0.625, 0.7], [1, 1]]),
        keyCap: new DeepMap([
          [Modifiers(), { keyEvent: 'q', keyEventLabel: 'The letter q' }],
          [Modifiers(['Shift']), { keyEvent: 'Q', keyEventLabel: 'Q' }],
        ]),
      },
    ]);

    const keyMapByEvent = new KeyMapByEvent(
      new Map([
        [
          '1',
          new DeepMap<Modifiers, BindingByEvent>([
            [Modifiers(['Shift']), 'shift-pageup-binding'],
            [Modifiers(['Control']), 'control-pageup-binding'],
          ]),
        ],
      ]),
    );

    const bindingLabels;
  });
});
