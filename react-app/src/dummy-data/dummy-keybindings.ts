import { DeepMap } from '../model/types';
import { KeyBindings } from '../model/key-bindings';

export const keyBindings: KeyBindings = new DeepMap([
  [{ key: 'q', modifiers: new Set() }, 'self-insert-command'],
  [{ key: 'w', modifiers: new Set() }, 'self-insert-command'],
  [{ key: 'e', modifiers: new Set() }, 'self-insert-command'],
  [{ key: 'a', modifiers: new Set() }, 'self-insert-command'],
  [{ key: 's', modifiers: new Set() }, 'self-insert-command'],
  [{ key: 'd', modifiers: new Set() }, 'self-insert-command'],
  [{ key: 'Q', modifiers: new Set() }, 'self-insert-command'],
  [{ key: 'W', modifiers: new Set() }, 'self-insert-command'],
  [{ key: 'E', modifiers: new Set() }, 'self-insert-command'],
  [{ key: 'A', modifiers: new Set() }, 'self-insert-command'],
  [{ key: 'S', modifiers: new Set() }, 'self-insert-command'],
  [{ key: 'D', modifiers: new Set() }, 'self-insert-command'],
  [{ key: 'Return', modifiers: new Set() }, 'newline'],
]);
