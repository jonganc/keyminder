import { Binding, Key, KeyBindings, ModdedKey, Modifier } from './key-bindings';
import { Geometry, KeyCap, KeyLabels, Layout, Shape } from './keyboard-layout';
import { DeepMap, Label } from './types';

// combine key bindings and layouts into keyboards

export type LabeledKeyBindings = DeepMap<
  ModdedKey,
  { label: Label; binding: Binding }
>;

export interface LocizedKey {
  key: Key;
  label: Label;
}

export type LocizdKeyMapping = DeepMap<Set<Modifier>, LocizedKey>;

export type LocalizedKeyCap = KeyCap & {
  locizdKeyMapping: LocizdKeyMapping;
};

/**
 * one specific keyboard, with the actual keys that are passed to programs on key presses
 */
export type LocizdGeometry = LocalizedKeyCap[];

export type KeyMapKey = KeyCap & {};

export type KeyMap = Array<{
  shape: Shape;
  labeledKeyBindings: LabeledKeyBindings;
}>;

export function makeKeyboard({
  layout,
  geometry,
  keyLabels,
  keybindings,
}: {
  layout: Layout;
  geometry: Geometry;
  keyLabels: KeyLabels;
  keybindings: KeyBindings;
}) {
  const;
}
