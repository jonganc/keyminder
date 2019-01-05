import {
  Binding,
  BindingByEvent,
  KeyMap,
  KeyMapByEvent,
  makeKeyMapByEvent,
  ModdedKeyEvent,
  Modifiers,
} from './key-bindings';
import { DeepMap } from './types';

describe('makeKeyMapByEvent', () => {
  it('should properly transform a key map', () => {
    const innerKeyMap: KeyMap = {
      bindings: new DeepMap([
        [
          { keyEvent: 'a', modifiers: Modifiers(['Control']) },
          'control-a-binding',
        ],
      ]),
    };
    const keyMap: KeyMap = {
      bindings: new DeepMap<ModdedKeyEvent, Binding>([
        [
          { keyEvent: 'PageUp', modifiers: Modifiers(['Shift']) },
          'shift-pageup-binding',
        ],
        [
          { keyEvent: 'PageUp', modifiers: Modifiers(['Control']) },
          innerKeyMap,
        ],
      ]),
    };

    const innerKeyMapByEvent = makeKeyMapByEvent(innerKeyMap);
    const keyMapByEvent = makeKeyMapByEvent(keyMap);

    expect(innerKeyMapByEvent).toEqual(
      new KeyMapByEvent(
        new Map([
          [
            'a',
            new DeepMap<Modifiers, BindingByEvent>([
              [Modifiers(['Control']), 'control-a-binding'],
            ]),
          ],
        ]),
      ),
    );

    const expectedKeyMapByEvent = new KeyMapByEvent(
      new Map([
        [
          'PageUp',
          new DeepMap<Modifiers, BindingByEvent>([
            [Modifiers(['Shift']), 'shift-pageup-binding'],
            [Modifiers(['Control']), innerKeyMapByEvent],
          ]),
        ],
      ]),
    );

    expect(keyMapByEvent).toEqual(expectedKeyMapByEvent);
  });
});
