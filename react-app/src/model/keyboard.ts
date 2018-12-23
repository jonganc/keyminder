import * as l_ from 'lodash';
import {
  Binding,
  Key,
  KeyBindings,
  KeySequence,
  ModdedKey,
  Modifier,
} from './key-bindings';
import { Geometry, VirtualKey, KeyLabels, Layout } from './keyboard-layout';
import { DeepMap, Label } from './types';

// combine key bindings and layouts into keyboards

export interface LocizedKey {
  key: Key;
  keyLabel: Label;
}

export type LocizdKeyMapping = DeepMap<Set<Modifier>, LocizedKey>;

export type LocizdKeyCap = VirtualKey & {
  locizdKeyMappings: LocizdKeyMapping;
};

/**
 * one specific keyboard, with the actual keys that are passed to programs on key presses
 */
export type LocizdGeometry = LocizdKeyCap[];

export type PartialKeyboardKeyBindings = DeepMap<
  Set<Modifier>,
  LocizedKey &
    ModdedKey & {
      bindingLabel: Label;
      /**
       * a value of `null` means that the pressed key would be an incomplete part of a key-sequence
       */
      binding: Binding | null;
    }
>;

/**
 * a keycap with bindings
 */
export type PartialKeyboardKeyCap = VirtualKey & {
  keyBindings: PartialKeyboardKeyBindings;
};

/**
 * A partial keyboard gives all keybindings reachable from the current state using one key press. (The current state refers to what keys have been pressed previously; e.g. it might be the state with no keys pressed or with [C-x] pressed, etc.)
 */
export type PartialKeyboard = PartialKeyboardKeyCap[];

export function makeLocizdGeomtry({
  layout,
  geometry,
  keyLabels,
}: {
  layout: Layout;
  geometry: Geometry;
  keyLabels: KeyLabels;
}): LocizdGeometry {
  const locizdGeometry: LocizdGeometry = [];

  for (const keyCap of geometry) {
    const keyMapping = layout.get(keyCap.keyCode);

    if (keyMapping === undefined) {
      continue;
    }

    const label = _.defaultTo(keyLabels.get(keyMapping.get()), key);

    const locizdKeyMappingPairs: Array<[Set<Modifier>, LocizedKey]> = [
      ...keyMapping.entries(),
    ].map(([modifiers, key]) => {
      [modifiers];
    });

    for (const [modifiers, key] of keyMapping.entries()) {
    }
    return { ...keyCap, locizdKeyMappings: 1 };
  }
}

/**
 * make a partial keyboard, as defined in `PartialKeyboard`
 * @param keySequence The key sequence pressed so far
 */
export function makePartialKeyboard({
  locizdGeometry,
  keyBindings,
  keySequence,
}: {
  locizdGeometry: LocizdGeometry;
  keyBindings: KeyBindings;
  keySequence: KeySequence;
}) {
  const;
}
