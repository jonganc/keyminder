import {
  BindingLabels,
  KeyMap,
  makeKeyMapByEvent,
  Modifiers,
} from '../model/key-bindings';
import { DeepMap } from '../model/types';

const keyMap: KeyMap = {
  bindings: new DeepMap([
    [{ keyEvent: 'q', modifiers: Modifiers() }, 'self-insert-command'],
    [{ keyEvent: 'w', modifiers: Modifiers() }, 'self-insert-command'],
    [{ keyEvent: 'e', modifiers: Modifiers() }, 'self-insert-command'],
    [{ keyEvent: 'a', modifiers: Modifiers() }, 'self-insert-command'],
    [{ keyEvent: 's', modifiers: Modifiers() }, 'self-insert-command'],
    [{ keyEvent: 'd', modifiers: Modifiers() }, 'self-insert-command'],
    [{ keyEvent: 'Q', modifiers: Modifiers() }, 'self-insert-command'],
    [{ keyEvent: 'W', modifiers: Modifiers() }, 'self-insert-command'],
    [{ keyEvent: 'E', modifiers: Modifiers() }, 'self-insert-command'],
    [{ keyEvent: 'A', modifiers: Modifiers() }, 'self-insert-command'],
    [{ keyEvent: 'S', modifiers: Modifiers() }, 'self-insert-command'],
    [{ keyEvent: 'D', modifiers: Modifiers() }, 'self-insert-command'],
    [{ keyEvent: 'Return', modifiers: Modifiers() }, 'newline'],
  ]),
};

export const keyMapByEvent = makeKeyMapByEvent(keyMap);

export const bindingLabels: BindingLabels = new Map([
  ['self-insert-command', 'SIC'],
]);
