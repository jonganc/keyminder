import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';

const styles = createStyles({
  root: {
    paddingTop: 80,
    flex: '1 1 100%',
    maxWidth: '100%',
    margin: '0 auto',
  },
});

class App extends Component<WithStyles<typeof styles>> {
  render() {
    const { classes } = this.props;
    return <div className={classes.root}>Abcdef</div>;
  }
}

export default withStyles(styles)(App);
