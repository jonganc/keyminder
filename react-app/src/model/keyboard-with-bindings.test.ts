import { Rectangle, DeepMap } from './types';
import {
  Modifiers,
  KeyMapByEvent,
  BindingByEvent,
  BindingLabels,
} from './key-bindings';
import {
  makeKeyboardWithBindings,
  KeyboardWithBindings,
  PhysicalKeyBinding,
} from './keyboard-with-bindings';
import { Keyboard } from './keyboard-layout';

describe('makeKeyboardWithBindings', () => {
  it('should make a KeyboardWithBindings', () => {
    const keyboard: Keyboard = [
      {
        keyCode: 'AE01',
        shape: new Rectangle([[0, 10], [20, 30]]),
        relativeShape: new Rectangle([[0, 0.2], [0.5, 0.6]]),
        keyCap: new DeepMap([
          [Modifiers(), { keyEvent: '1', keyEventLabel: '1' }],
          [Modifiers(['Shift']), { keyEvent: '!', keyEventLabel: '!' }],
          [Modifiers(['Control']), { keyEvent: '@', keyEventLabel: '@' }],
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
    ];

    const keyMapByEvent = new KeyMapByEvent(
      new Map([
        [
          '1',
          new DeepMap<Modifiers, BindingByEvent>([
            [Modifiers(), '1'],
            [Modifiers(['Shift', 'Control']), 'shift-control-1'],
          ]),
        ],
        [
          '!',
          new DeepMap<Modifiers, BindingByEvent>([
            [Modifiers(['Control']), 'control-!'],
          ]),
        ],
        [
          '@',
          new DeepMap<Modifiers, BindingByEvent>([
            [Modifiers(['Shift']), 'shift-@'],
          ]),
        ],
        ['q', new DeepMap<Modifiers, BindingByEvent>([[Modifiers(), 'q']])],
        [
          'Q',
          new DeepMap<Modifiers, BindingByEvent>([
            [Modifiers(), 'Q'],
            [Modifiers(['Control']), 'control-Q'],
          ]),
        ],
      ]),
    );

    const bindingLabels: BindingLabels = new Map([
      ['q', 'lowercase q binding'],
      ['Q', 'uppercase q binding'],
    ]);

    const keyboardWithBindings = makeKeyboardWithBindings({
      keyboard,
      keyMapByEvent,
      bindingLabels,
    });

    const expectedKeyboardWithBindings: KeyboardWithBindings = [
      {
        keyCode: 'AE01',
        shape: new Rectangle([[0, 10], [20, 30]]),
        relativeShape: new Rectangle([[0, 0.2], [0.5, 0.6]]),
        bindings: new DeepMap<Modifiers, PhysicalKeyBinding>([
          [
            Modifiers(),
            {
              keyEvent: '1',
              keyEventLabel: '1',
              keyEventModifiers: Modifiers(),
              binding: '1',
              bindingLabel: '1',
            },
          ],
          [
            Modifiers(['Shift', 'Control']),
            [
              {
                keyEvent: '!',
                keyEventLabel: '!',
                keyEventModifiers: Modifiers(['Control']),
                binding: 'control-!',
                bindingLabel: 'control-!',
              },
              {
                keyEvent: '@',
                keyEventLabel: '@',
                keyEventModifiers: Modifiers(['Shift']),
                binding: 'shift-@',
                bindingLabel: 'shift-@',
              },
            ],
          ],
        ]),
      },
      {
        keyCode: 'AD01',
        shape: new Rectangle([[25, 35], [40, 50]]),
        relativeShape: new Rectangle([[0.625, 0.7], [1, 1]]),
        bindings: new DeepMap<Modifiers, PhysicalKeyBinding>([
          [
            Modifiers(),
            {
              keyEvent: 'q',
              keyEventLabel: 'The letter q',
              keyEventModifiers: Modifiers(),
              binding: 'q',
              bindingLabel: 'lowercase q binding',
            },
          ],
          [
            Modifiers(['Shift']),
            {
              keyEvent: 'Q',
              keyEventLabel: 'Q',
              keyEventModifiers: Modifiers(),
              binding: 'Q',
              bindingLabel: 'uppercase q binding',
            },
          ],
          [
            Modifiers(['Control', 'Shift']),
            {
              keyEvent: 'Q',
              keyEventLabel: 'Q',
              keyEventModifiers: Modifiers(['Control']),
              binding: 'control-Q',
              bindingLabel: 'control-Q',
            },
          ],
        ]),
      },
    ];

    expect(keyboardWithBindings).toEqualExtended(expectedKeyboardWithBindings);
  });
});
