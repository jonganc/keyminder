import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import React, { Component } from 'react';
import { BindingLabels, KeyMapByEvent } from '../model/key-bindings';
import { Keyboard as KeyboardType } from '../model/keyboard-layout';
import { makeKeyboardWithBindings } from '../model/keyboard-with-bindings';
import './Keyboard.scss';
import Label from './Label';
import PrintModifiers, { sortModifiers } from './PrintModifiers';

const styles = createStyles({
  keyboard: {
    flex: '1 1 100%',
    maxWidth: '100%',
  },
  row: { display: 'flex', alignItems: 'stretch' },
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
  binding: {},
});

class Keyboard extends Component<
  WithStyles<typeof styles> & {
    keyboard: KeyboardType;
    keyMapByEvent: KeyMapByEvent;
    bindingLabels?: BindingLabels;
    className?: string;
  }
> {
  render() {
    const keyboardWithBindings = makeKeyboardWithBindings({
      keyboard: this.props.keyboard,
      keyMapByEvent: this.props.keyMapByEvent,
      bindingLabels: this.props.bindingLabels,
    });
    const { classes, className } = this.props;
    return (
      <div className={classnames('keyboard', classes.keyboard, className)}>
        {keyboardWithBindings.rows.map((row, rowIdx) => {
          const keys = row.keys.map(pkwb => {
            const width = `${pkwb.relativeWidth * 100}%`;

            return (
              <div
                className={classnames('keyboard-key-outer', classes.keyOuter)}
                style={{
                  maxWidth: width,
                  width,
                  marginLeft: `${pkwb.relativeMarginLeft * 100}%`,
                }}
              >
                <div
                  className={classnames(
                    'keyboard-key',
                    classes.defaultKey,
                    classes.key,
                  )}
                  key={pkwb.keyCode}
                >
                  <Label
                    className={classnames(
                      'keyboard-key-cap-label',
                      classes.keyCapLabel,
                    )}
                    label={pkwb.keyCapLabel}
                  />

                  {[...pkwb.bindings.entries()]
                    .sort(([mods1], [mods2]) => sortModifiers(mods1, mods2))
                    .map(([modifiers, pkb]) => {
                      return (
                        <div
                          className={classnames(
                            'keyboard-binding',
                            classes.binding,
                          )}
                          key={[...modifiers].sort().join('-')}
                        >
                          <PrintModifiers modifiers={modifiers} />
                          {' ' +
                            (Array.isArray(pkb)
                              ? 'conflicting'
                              : pkb.bindingLabel)}
                          {}
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          });
          return (
            <div
              className={classnames('keyboard-row', classes.row)}
              key={rowIdx}
            >
              {keys}
            </div>
          );
        })}
      </div>
    );
  }
}

export default withStyles(styles)(Keyboard);
