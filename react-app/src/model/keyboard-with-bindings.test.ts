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
    const keyboard: Keyboard = {
      layoutName: 'test-layout',
      geometryName: 'test-geometry',
      rows: [
        {
          keys: [
            {
              keyCode: 'AE01',
              width: 20,
              relativeWidth: 1,
              relativeMarginLeft: 0,
              keyCap: {
                keyCapLabel: '1',
                keyEvents: new DeepMap([
                  [Modifiers(), '1'],
                  [Modifiers(['Shift']), '!'],
                  [Modifiers(['Control']), '@'],
                ]),
              },
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
              keyCap: {
                keyCapLabel: 'q',
                keyEvents: new DeepMap([
                  [Modifiers(), 'q'],
                  [Modifiers(['Shift']), 'Q'],
                ]),
              },
            },
          ],
        },
      ],
    };

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
            keyCapLabel: '1',
            keyCode: 'AE01',
            width: 20,
            relativeWidth: 1,
            relativeMarginLeft: 0,
            bindings: new DeepMap<Modifiers, PhysicalKeyBinding>([
              [
                Modifiers(),
                {
                  keyEvent: '1',
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
                    keyEventModifiers: Modifiers(['Control']),
                    binding: 'control-!',
                    bindingLabel: 'control-!',
                  },
                  {
                    keyEvent: '@',
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
            keyCapLabel: 'q',
            keyCode: 'AD01',
            width: 15,
            relativeWidth: 0.75,
            relativeMarginLeft: 0,
            bindings: new DeepMap<Modifiers, PhysicalKeyBinding>([
              [
                Modifiers(),
                {
                  keyEvent: 'q',
                  keyEventModifiers: Modifiers(),
                  binding: 'q',
                  bindingLabel: 'lowercase q binding',
                },
              ],
              [
                Modifiers(['Shift']),
                {
                  keyEvent: 'Q',
                  keyEventModifiers: Modifiers(),
                  binding: 'Q',
                  bindingLabel: 'uppercase q binding',
                },
              ],
              [
                Modifiers(['Control', 'Shift']),
                {
                  keyEvent: 'Q',
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
