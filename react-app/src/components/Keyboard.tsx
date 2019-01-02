import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import React, { Component } from 'react';
import { BindingLabels, KeyMapByEvent } from '../model/key-bindings';
import { Keyboard } from '../model/keyboard-layout';
import { makeKeyboardWithBindings } from '../model/keyboard-with-bindings';
import './Keyboard.scss';

const styles = createStyles({
  root: {
    flex: '1 1 100%',
    maxWidth: '100%',
  },
  defaultKey: {},
});

class App extends Component<
  WithStyles<typeof styles> & {
    keyboard: Keyboard;
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
        {keyboardWithBindings.map((pkwb, idx) => (
          <div
            className={classnames('default', classes.defaultKey)}
            key={idx}
            style={{ width: pkwb.relativeShape.points }}
          />
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(App);
