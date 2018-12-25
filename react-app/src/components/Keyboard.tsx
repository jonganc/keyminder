import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { Shape } from '@material-ui/core/styles/shape';
import React, { Component } from 'react';
import { Binding, KeyMap, ModdedKeyEvent } from '../model/key-bindings';
import { Geometry, KeyLabels, Layout } from '../model/keyboard';
import { DeepMap, Label } from '../model/types';
import './Keyboard.scss';

type LabeledKeys = DeepMap<ModdedKeyEvent, { label: Label; binding: Binding }>;

type Keyboard = Array<{ shape: Shape; labeledKeys: LabeledKeys }>;

const styles = createStyles({
  root: {
    paddingTop: 80,
    flex: '1 1 100%',
    maxWidth: '100%',
    margin: '0 auto',
  },
});

class App extends Component<
  WithStyles<typeof styles> & {
    layout: Layout;
    geometry: Geometry;
    keyEventLabels: KeyLabels;

    keybindings: KeyMap;
  }
> {
  render() {
    const { classes } = this.props;
    return <div className={classes.root}>Abcdef</div>;
  }
}

export default withStyles(styles)(App);
