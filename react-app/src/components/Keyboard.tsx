import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import React, { Component } from 'react';
import { BindingLabels, KeyMapByEvent } from '../model/key-bindings';
import { Keyboard as KeyboardType } from '../model/keyboard-layout';
import { makeKeyboardWithBindings } from '../model/keyboard-with-bindings';
import './Keyboard.scss';

const styles = createStyles({
  keyboard: {
    flex: '1 1 100%',
    maxWidth: '100%',
  },
  key: {
    height: '100%',
  },
  defaultKey: {},
  binding: {},
});

class Keyboard extends Component<
  WithStyles<typeof styles> & {
    keyboard: KeyboardType;
    keyMapByEvent: KeyMapByEvent;
    bindingLabels: BindingLabels;
  }
> {
  render() {
    const keyboardWithBindings = makeKeyboardWithBindings({
      keyboard: this.props.keyboard,
      keyMapByEvent: this.props.keyMapByEvent,
      bindingLabels: this.props.bindingLabels,
    });
    const { classes } = this.props;
    return (
      <div className={classnames('keyboard', classes.keyboard)}>
        {keyboardWithBindings.map(row =>
          row.keys.map(pkwb => {
            const width = `${pkwb.relativeWidth * 100}%`;

            return (
              <div
                className={classnames(
                  'default',
                  classes.defaultKey,
                  classes.key,
                )}
                key={pkwb.keyCode}
                style={{
                  maxWidth: width,
                  width,
                  marginLeft: `${pkwb.relativeMarginLeft * 100}%`,
                }}
              >
                {[...pkwb.bindings.entries()].map(([modifiers, pkb]) => {
                  const modifiersText = [...modifiers.values()]
                    .sort()
                    .join(',');
                  return (
                    <div
                      className={classnames('binding', classes.binding)}
                      key={modifiersText}
                    >
                      {`${modifiersText}` +
                        (Array.isArray(pkb)
                          ? ': conflicting'
                          : `${pkb.keyEvent}: ${pkb.bindingLabel}`)}
                      {}
                    </div>
                  );
                })}
              </div>
            );
          }),
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Keyboard);
