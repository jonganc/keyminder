import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles';
import React, { Component } from 'react';

const styles = (theme: Theme) =>
  createStyles({
    root: theme.mixins.gutters({
      paddingTop: 80,
      flex: '1 1 100%',
      maxWidth: '100%',
      margin: '0 auto',
    }),
    [theme.breakpoints.up('md')]: {
      blogRoot: {
        maxWidth: theme.breakpoints.values.md,
      },
    },
  });

class App extends Component<
  WithStyles<ReturnType<typeof styles>> & { className?: string }
> {
  render() {
    return <div>Abcdef</div>;
  }
}

export default withStyles(styles)(App);
