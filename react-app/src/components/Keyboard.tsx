import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import React from 'react';
import { BindingLabels, KeyMapByEvent } from '../model/key-bindings';
import {
  Keyboard as KeyboardType,
  PhysicalKey,
  PhysicalRow,
} from '../model/keyboard-layout';
import { mapKeyCapToPhysicalKeyBindings } from '../model/keyboard-with-bindings';
import './Keyboard.scss';
import Label from './Label';
import PrintModifiers, { sortModifiers } from './PrintModifiers';

const keyboardRowStyles = createStyles({
  root: { display: 'flex', alignItems: 'stretch' },
});

const keyboardPhysicalKeyStyles = createStyles({
  keyCapLabel: { fontWeight: 'bold' },
  keyOuter: {
    display: 'flex',
    alignItems: 'stretch',
  },
  key: {
    flexGrow: 1,
    border: '1px solid black',
    padding: 2,
    margin: 2,
    borderRadius: 4,
  },
  defaultKey: {
    backgroundColor: '#F0F0F0',
  },
  modifierBinding: {},
});

const keyboardStyles = createStyles({
  root: {
    flex: '1 1 100%',
    maxWidth: '100%',
  },
});

interface BindingsContext {
  keyMapByEvent: KeyMapByEvent;
  bindingLabels?: BindingLabels;
}

const KeyboardPhysicalKeyUnstyled: React.SFC<
  WithStyles<typeof keyboardPhysicalKeyStyles> & {
    physicalKey: PhysicalKey;
  } & BindingsContext
> = props => {
  const { classes, bindingLabels, keyMapByEvent, physicalKey } = props;

  const width = `${physicalKey.relativeWidth * 100}%`;

  const bindings = mapKeyCapToPhysicalKeyBindings({
    keyCap: physicalKey.keyCap,
    keyMapByEvent,
    bindingLabels,
  });

  return (
    <div
      className={classnames('keyboard-key-outer', classes.keyOuter)}
      style={{
        maxWidth: width,
        width,
        marginLeft: `${physicalKey.relativeMarginLeft * 100}%`,
      }}
    >
      <div
        className={classnames('keyboard-key', classes.defaultKey, classes.key)}
        key={physicalKey.keyCode}
      >
        <Label
          className={classnames('keyboard-key-cap-label', classes.keyCapLabel)}
          label={physicalKey.keyCap.keyCapLabel}
        />

        {[...bindings.entries()]
          .sort(([mods1], [mods2]) => sortModifiers(mods1, mods2))
          .map(([modifiers, pkb]) => {
            return (
              <div
                className={classnames(
                  'keyboard-modifier-binding',
                  classes.modifierBinding,
                )}
                key={[...modifiers].sort().join('-')}
              >
                <PrintModifiers modifiers={modifiers} />
                {' ' +
                  ((Array.isArray as <T>(
                    val: ReadonlyArray<T> | T,
                  ) => val is ReadonlyArray<T>)(pkb)
                    ? 'conflicting'
                    : pkb.bindingLabel)}
                {}
              </div>
            );
          })}
      </div>
    </div>
  );
};

const KeyboardPhysicalKey = withStyles(keyboardPhysicalKeyStyles)(
  KeyboardPhysicalKeyUnstyled,
);

const KeyboardRowUnstyled: React.SFC<
  WithStyles<typeof keyboardRowStyles> & {
    row: PhysicalRow;
  } & BindingsContext
> = props => {
  const { classes, row, keyMapByEvent, bindingLabels } = props;

  return (
    <div className={classnames('keyboard-row', classes.root)}>
      {row.keys.map(physicalKey => (
        <KeyboardPhysicalKey
          physicalKey={physicalKey}
          keyMapByEvent={keyMapByEvent}
          bindingLabels={bindingLabels}
        />
      ))}
    </div>
  );
};

const KeyboardRow = withStyles(keyboardRowStyles)(KeyboardRowUnstyled);

const Keyboard: React.SFC<
  WithStyles<typeof keyboardStyles> & {
    keyboard: KeyboardType;
    className?: string;
  } & BindingsContext
> = props => {
  const { classes, className, keyboard, keyMapByEvent, bindingLabels } = props;
  return (
    <div className={classnames('keyboard', classes.root, className)}>
      {keyboard.rows.map((row, idx) => (
        <KeyboardRow
          row={row}
          keyMapByEvent={keyMapByEvent}
          bindingLabels={bindingLabels}
          key={idx}
        />
      ))}
    </div>
  );
};

export default withStyles(keyboardStyles)(Keyboard);
