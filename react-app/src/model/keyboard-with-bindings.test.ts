import {
  BindingByEvent,
  BindingLabels,
  KeyMapByEvent,
  Modifiers,
} from './key-bindings';
import { KeyCap } from './keyboard-layout';
import {
  mapKeyCapToPhysicalKeyBindings,
  PhysicalKeyBinding,
  PhysicalKeyBindings,
} from './keyboard-with-bindings';
import { DeepMap } from './types';

describe('mapKeyCapToPhysicalKeyBindings', () => {
  it('should make PhysicalKeyBindings', () => {
    const keyCap: KeyCap = {
      keyCapLabel: '1',
      keyEvents: new DeepMap([
        [Modifiers(), '1'],
        [Modifiers(['Shift']), '!'],
        [Modifiers(['Control']), '@'],
      ]),
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
      ]),
    );

    const bindingLabels: BindingLabels = new Map([
      ['shift-control-1', 'shift-control-1-binding-label'],
    ]);

    const physicalKeyBindings = mapKeyCapToPhysicalKeyBindings({
      keyCap,
      keyMapByEvent,
      bindingLabels,
    });

    const expectedPhysicalKeyBindings: PhysicalKeyBindings = new DeepMap<
      Modifiers,
      PhysicalKeyBinding
    >([
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
    ]);

    expect(physicalKeyBindings.entries()).toEqualExtended(
      expectedPhysicalKeyBindings.entries(),
    );
  });
});
