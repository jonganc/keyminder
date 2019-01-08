import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import React, { Component } from 'react';
import { BindingLabels, KeyMapByEvent } from '../model/key-bindings';
import { Keyboard as KeyboardType } from '../model/keyboard-layout';
import { makeKeyboardWithBindings } from '../model/keyboard-with-bindings';
import './Keyboard.scss';

const styles = createStyles({
  root: {
    flex: '1 1 100%',
    maxWidth: '100%',
  },
  defaultKey: {},
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
      <div className={classnames('keyboard', classes.root)}>
        {keyboardWithBindings.map((pkwb, idx) => {
          const width = `${pkwb.relativeWidth.width * 100}%`;
          const height = `${pkwb.relativeWidth.height * 100}%`;
          return (
            <div
              className={classnames('default', classes.defaultKey)}
              key={idx}
              style={{ maxWidth: width, width, height }}
            />
          );
        })}
      </div>
    );
  }
}

export default withStyles(styles)(Keyboard);
