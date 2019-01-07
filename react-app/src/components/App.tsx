import {
  createStyles,
  CssBaseline,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import Dummy from './Dummy';
import withProviders from './withProviders';

const styles = createStyles({
  root: {
    paddingTop: 10,
    paddingLeft: 10,
    flex: '1 1 100%',
    maxWidth: '100%',
    margin: '0 auto',
  },
});

class App extends Component<WithStyles<typeof styles>> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Router>
          <>
            <CssBaseline />
            <Link to="/">Home</Link> | <Link to="/dummy">Dummy data</Link>
            <Route
              path="/"
              exact
              component={() => <div className="App">This is the main app</div>}
            />
            <Route path="/dummy" component={Dummy} />
          </>
        </Router>
      </div>
    );
  }
}

export default withProviders(withStyles(styles)(App));
