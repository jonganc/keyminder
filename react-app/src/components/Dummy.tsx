import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { bindingLabels, keyboard, keyMapByEvent } from '../dummy-data';
import Keyboard from './Keyboard';

const styles = createStyles({
  root: {},
});

class Dummy extends Component<WithStyles<typeof styles>> {
  render() {
    const { classes } = this.props;
    return (
      <Keyboard
        keyboard={keyboard}
        keyMapByEvent={keyMapByEvent}
        bindingLabels={bindingLabels}
        className={classes.root}
      />
    );
  }
}

export default withStyles(styles)(Dummy);
