import React from 'react';
import { Keyboard as KeyboardType } from '../model/keyboard-layout';
import Keyboard from './Keyboard';
import {
  Modifiers,
  KeyMapByEvent,
  BindingByEvent,
} from '../model/key-bindings';
import { DeepMap } from '../model/types';
import { mount } from 'enzyme';

describe('Keyboard', () => {
  it('should create a keyboard properly', () => {
    const keyboard: KeyboardType = {
      geometryName: 'test-geometry',
      layoutName: 'test-layout',
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

    const wrapper = mount(
      <Keyboard keyboard={keyboard} keyMapByEvent={keyMapByEvent} />,
    );

    const keyboardRoot = wrapper.find('div').first();
    const firstRow = keyboardRoot.children().first();
    const firstKey = firstRow.children().first();
    const firstBinding = firstKey.children().first();
    const bindingFirstChild = firstBinding.children().first();

    expect(keyboardRoot).toHaveClassName('keyboard');
    expect(firstRow).toHaveClassName('keyboard-row');
    expect(firstKey).toHaveClassName('keyboard-key');
    expect(firstBinding).toHaveClassName('keyboard-binding');
    expect(bindingFirstChild.name()).toBe('PrintModifiers');
    expect(bindingFirstChild.prop('modifiers')).toEqual(Modifiers());
  });
});
