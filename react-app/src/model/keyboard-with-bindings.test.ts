import {
  BindingByEvent,
  BindingLabels,
  KeyMapByEvent,
  Modifiers,
} from './key-bindings';
import { Keyboard } from './keyboard-layout';
import {
  KeyboardWithBindings,
  makeKeyboardWithBindings,
  PhysicalKeyBinding,
} from './keyboard-with-bindings';
import { DeepMap } from './types';

describe('makeKeyboardWithBindings', () => {
  it('should make a KeyboardWithBindings', () => {
    const keyboard: Keyboard = [
      {
        keys: [
          {
            keyCode: 'AE01',
            width: 20,
            relativeWidth: 1,
            relativeMarginLeft: 0,
            keyCap: new DeepMap([
              [Modifiers(), { keyEvent: '1', keyEventLabel: '1' }],
              [Modifiers(['Shift']), { keyEvent: '!', keyEventLabel: '!' }],
              [Modifiers(['Control']), { keyEvent: '@', keyEventLabel: '@' }],
            ]),
          },
        ],
      },
      {
        keys: [
          {
            keyCode: 'AD01',
            width: 15,
            relativeWidth: 0.75,
            relativeMarginLeft: 0,
            keyCap: new DeepMap([
              [Modifiers(), { keyEvent: 'q', keyEventLabel: 'The letter q' }],
              [Modifiers(['Shift']), { keyEvent: 'Q', keyEventLabel: 'Q' }],
            ]),
          },
        ],
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
        keys: [
          {
            keyCode: 'AE01',
            width: 20,
            relativeWidth: 1,
            relativeMarginLeft: 0,
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
        ],
      },
      {
        keys: [
          {
            keyCode: 'AD01',
            width: 15,
            relativeWidth: 0.75,
            relativeMarginLeft: 0,
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
        ],
      },
    ];

    expect(keyboardWithBindings).toEqualExtended(expectedKeyboardWithBindings);
  });
});
