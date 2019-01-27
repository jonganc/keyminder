import classnames from 'classnames';
import l_ from 'lodash';
import React from 'react';
import { Modifier, Modifiers } from '../model/key-bindings';
import { Label } from '../model/types';
import './Keyboard.scss';

interface ModifierDisplay {
  display: Label;
  order: number;
}

/**
 * modifiers and how to display them, by default
 * @param display what to display for the shortened form, as html. null to indicate no default form
 * @param order The relative order,lowest first.
 */
export const modifierDisplays: { [key in Modifier]: ModifierDisplay } = {
  Control: { display: 'C', order: 10 },
  Alt: { display: 'A', order: 20 },
  Shift: { display: '&#x21E7;', order: 30 }, // ⇧
  Win: { display: 'Win', order: 40 },
  Super: { display: 'S', order: 50 },
  Meta: { display: 'M', order: 60 },
  Hyper: { display: 'H', order: 70 },
  NumLock: { display: 'NumLock', order: 80 }, // should never really show anyway
};

const modifierDisplaysWithSortingBitmap = l_
  .chain(modifierDisplays)
  .entries()
  .sort(
    ([, { order: mod1Order }], [, { order: mod2Order }]) =>
      mod1Order - mod2Order,
  )
  .map(
    ([modifier, modifierDisplay], idx) =>
      [
        modifier,
        {
          ...modifierDisplay,
          // tslint:disable-next-line:no-bitwise
          bitmapOrder: 1 << idx,
        },
      ] as [Modifier, ModifierDisplay & { bitmapOrder: number }],
  )
  .fromPairs()
  .value() as { [key in Modifier]: ModifierDisplay & { bitmapOrder: number } };

export function sortModifiers(mods1: Modifiers, mods2: Modifiers) {
  const sizeDiff = mods1.size - mods2.size;

  if (sizeDiff !== 0) {
    return sizeDiff;
  }

  const [mapped1, mapped2] = [mods1, mods2].map(mods => {
    return [...mods.values()]
      .map(val => modifierDisplaysWithSortingBitmap[val].bitmapOrder)
      .reduce((agg, val) => agg + val);
  });

  return mapped1 - mapped2;
}

export default class PrintModifiers extends React.Component<{
  className?: string;
  modifiers: Modifiers;
}> {
  render() {
    const printableModifiers = l_
      .chain([...this.props.modifiers])
      .map(mod => modifierDisplays[mod])
      .sortBy('order')
      .map(modifierDisplay => {
        if (typeof modifierDisplay.display !== 'string') {
          throw new Error('Currently, modifier displays must be strings');
        }
        return modifierDisplay.display;
      })
      .join('-')
      .value();

    return (
      <span
        className={classnames('modifiers', this.props.className)}
        dangerouslySetInnerHTML={{ __html: printableModifiers }}
      />
    );
  }
}
