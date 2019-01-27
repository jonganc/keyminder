import l_ from 'lodash';
import { observable } from 'mobx';
import {
  Binding,
  BindingByEvent,
  BindingLabels,
  KeyEvent,
  KeyMapByEvent,
  Modifiers,
} from './key-bindings';
import {
  Keyboard,
  KeyCap,
  KeyRowForRendering,
  VirtualKeyForRendering,
} from './keyboard-layout';
import {
  DeepMap,
  doSetsIntersect,
  groupByDeep,
  Label,
  shouldNotBeInstance,
} from './types';

// combine key bindings and layouts into keyboards

interface PhysicalKeyBindingSingle {
  readonly keyEvent: KeyEvent;
  /**
   * The physical-key modifiers might be transformed to produce the key-event modifiers, which are what are actually used to determine the bindings. For completeness, we include the key-event modifiers. E.g. if we press Control-Shift-2, the key-event will be "@" and the physical-key modifiers will be [Control, Shift] but the key-event modifiers will just be [Control]. (It's mostly for informational purposes)
   */
  readonly keyEventModifiers: Modifiers;
  readonly binding: Binding;
  readonly bindingLabel: Label;
}

// This corresponds to the case where multiple key bindings map to the same key sequence, which can happen if the physical key can generate multiple key events and there are bindings that overlap. For example, Shift-2 maps to "@". Now imagine that Control-2 were set to be translated to "!". Then the physical key press Control-Shift-2 would be bound to both Control-@ and Shift-! and they might both be bound. In practice, this won't often occur, since only Shift and Alt-Gr translate keys usually. But... it's not beyond the realm of possiblity so we have to allow for it.
type PhysicalKeyBindingConflicting = ReadonlyArray<PhysicalKeyBindingSingle>;

/**
 * A physical-key-binding specifies a binding for a physical key given a set of modifiers
 */
export type PhysicalKeyBinding =
  | PhysicalKeyBindingSingle
  | PhysicalKeyBindingConflicting;

export type PhysicalKeyBindings = DeepMap<Modifiers, PhysicalKeyBinding>;

/**
 * A physical-key-with-bindings is a physical-key along with the bindings for any set of modifiers for which a binding is defined.
 */
export interface PhysicalKeyWithBindings extends VirtualKeyForRendering {
  readonly keyCapLabel: Label;
  readonly bindings: PhysicalKeyBindings;
}

export interface PhysicalKeyWithBindingsRow extends KeyRowForRendering {
  readonly keys: PhysicalKeyWithBindings[];
}

/**
 * All keybindings immediately accessible from a particular state (i.e. a sequence of keys already pressed).
 */
export class KeyboardWithBindings {
  readonly geometryName!: string;
  readonly layoutName!: string;
  @observable keyMapName?: string;
  readonly rows!: PhysicalKeyWithBindingsRow[];

  constructor(input: KeyboardWithBindings) {
    shouldNotBeInstance(KeyboardWithBindings, input);
    Object.assign(this, input);
  }
}

/**
 * Given a key event plus whatever modifiers were needed to reach it, find bindings that could be reached, possibly by including additional modifiers.
 * Since this corresponds to an "actual" key being pressed, any modifiers using to access the key event will be inaccessible for reaching any key bindings from it; for example, since Shift-2 is mapped to @, Shift-@ is inaccessible.
 * @param keyEvent The key event to consider
 * @param physicalModifiers The modifiers used to reach the key event. As noted in the comment below, this limits the bindings to those which don't use these modifiers
 * @param keyMapByEvent The keymap to scan
 * @returns An array with the bindings plus both the full set of modifiers (`fullPhysicalModifiers`) needed to reach the binding from the key press and the additional binding-only modifers (`keyEventModifiers`) needed to reach the binding from the key event. For example, if we were considering modifiers for @, [Shift] would be passed in as the `physicalModifiers`, and the `fullPhysicalModifiers` would be [Control,Shift] while `keyEventModifiers` would Control;
 */
function mapKeyEventWithModifiersToBindings({
  keyEvent,
  physicalModifiers,
  keyMapByEvent,
}: {
  keyEvent: KeyEvent;
  physicalModifiers: Modifiers;
  keyMapByEvent: KeyMapByEvent;
}): Array<{
  binding: BindingByEvent;
  fullPhysicalModifiers: Modifiers;
  keyEventModifiers: Modifiers;
}> {
  const allBindingsForEvent = keyMapByEvent.bindings.get(keyEvent);
  if (allBindingsForEvent === undefined) {
    return [];
  }
  return [...allBindingsForEvent.entries()]
    .map(([bindingModifiers, bindingsByEvent]) => {
      if (doSetsIntersect(physicalModifiers, bindingModifiers)) {
        return undefined;
      } else {
        return {
          binding: bindingsByEvent,
          fullPhysicalModifiers: new Set([
            ...physicalModifiers,
            ...bindingModifiers,
          ]),
          keyEventModifiers: bindingModifiers,
        };
      }
    })
    .filter((b => b !== undefined) as <T>(b: T | undefined) => b is T);
}

/**
 * Raw PhysicalKeyBindings are an array of PhysicalKeyBindingSingles that represent all the bindings tied to a physical key pressed with a set of modifiers. Depending on how they are processed, they may result in a PhysicalKeyBindingSingle or PhysicalKeyBindingConflicting
 */
function processRawPhysicalKeyBindings(
  rawPhysicalKeyBindings: [
    PhysicalKeyBindingSingle,
    ...PhysicalKeyBindingSingle[]
  ],
): PhysicalKeyBinding {
  if (rawPhysicalKeyBindings.length === 1) {
    return rawPhysicalKeyBindings[0];
  } else {
    // we want the keys with the longest Modifers length in the keymap, i.e. the shortest keyEventModifier length
    const minKeyEventModifierLength = Math.min(
      ...rawPhysicalKeyBindings.map(pkb => pkb.keyEventModifiers.size),
    );

    const physicalKeyBindings = rawPhysicalKeyBindings.filter(
      pkb => pkb.keyEventModifiers.size === minKeyEventModifierLength,
    ) as PhysicalKeyBindingConflicting;

    if (physicalKeyBindings.length === 1) {
      return physicalKeyBindings[0];
    } else {
      return physicalKeyBindings;
    }
  }
}

/**
 * Given a key cap, find the accessible physical key bindings, i.e. any key bindings which can be reached via a set of modifiers
 */
function mapKeyCapToPhysicalKeyBindings({
  keyCap,
  keyMapByEvent,
  bindingLabels,
}: {
  keyCap: KeyCap;
  keyMapByEvent: KeyMapByEvent;
  bindingLabels?: BindingLabels;
}): PhysicalKeyBindings {
  const rawBindingPairs: Array<
    [Modifiers, PhysicalKeyBindingSingle]
  > = l_.flatMap(
    [...keyCap.keyEvents.entries()],
    ([physicalModifiers, keyEvent]) => {
      const accessibleBindings = mapKeyEventWithModifiersToBindings({
        keyEvent,
        physicalModifiers,
        keyMapByEvent,
      });

      return accessibleBindings.map(
        ({ binding, fullPhysicalModifiers, keyEventModifiers }) => {
          const bindingLabel =
            binding instanceof KeyMapByEvent
              ? // FIXME Ideally, this would be some React component, like () => (<div class="keymap-binding" />)... but I don't want this file to have to use TSX. Maybe I make some file with the React Code for this? Or I could allow an element of bindingLabels to be the symbol KeyMap or something and put the component there... Or I could just manually write out JSX in TypeScipt...
                'keymap placeholder'
              : l_.defaultTo(
                  bindingLabels === undefined
                    ? undefined
                    : bindingLabels.get(binding),
                  binding,
                );
          return [
            fullPhysicalModifiers,
            {
              keyEvent,
              keyEventModifiers,
              binding,
              bindingLabel,
            },
          ] as [Modifiers, PhysicalKeyBindingSingle];
        },
      );
    },
  );

  const groupedBindingPairs = [
    ...groupByDeep(rawBindingPairs, pair => pair[0]).entries(),
  ].map(([modifiers, rawBindingPairsForModifiers]) => {
    const physicalKeyBindings = processRawPhysicalKeyBindings(
      rawBindingPairsForModifiers.map(pair => pair[1]) as [
        PhysicalKeyBindingSingle,
        ...PhysicalKeyBindingSingle[]
      ],
    );

    return [modifiers, physicalKeyBindings] as [Modifiers, PhysicalKeyBinding];
  });

  return new DeepMap(groupedBindingPairs);
}

export function makeKeyboardWithBindings({
  keyboard,
  keyMapByEvent,
  bindingLabels,
}: {
  keyboard: Keyboard;
  keyMapByEvent: KeyMapByEvent;
  bindingLabels?: BindingLabels;
}): KeyboardWithBindings {
  const rows = keyboard.rows
    .map(physicalRow => ({
      keys: physicalRow.keys.map(physicalKey => {
        const { keyCap, ...virtualKey } = physicalKey;

        const bindings = mapKeyCapToPhysicalKeyBindings({
          keyCap,
          keyMapByEvent,
          bindingLabels,
        });

        return {
          ...virtualKey,
          keyCapLabel: physicalKey.keyCap.keyCapLabel,
          bindings,
        };
      }),
    }))
    .filter((key => key !== undefined) as <T>(key: T | undefined) => key is T);

  return new KeyboardWithBindings({
    geometryName: keyboard.geometryName,
    keyMapName: keyMapByEvent.keyMapName,
    layoutName: keyboard.layoutName,
    rows,
  });
}
