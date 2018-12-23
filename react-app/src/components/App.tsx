import {
  createGenerateClassName,
  createMuiTheme,
  createStyles,
  CssBaseline,
  MuiThemeProvider,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import React, { Component } from 'react';
import { JssProvider } from 'react-jss';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import Dummy from './Dummy';

const muiThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#0d7339',
    },
    secondary: {
      main: '#0e5663',
    },
  },
  typography: {
    useNextVariants: true,
  },
};

const theme = createMuiTheme(muiThemeOptions);

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
    return (
      <JssProvider generateClassName={createGenerateClassName()}>
        <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
          <Router>
            <>
              <CssBaseline />
              <Link to="/">Home</Link> | <Link to="/dummy">Dummy data</Link>
              <Route
                path="/"
                exact
                component={() => (
                  <div className="App">Hello, this is an app</div>
                )}
              />
              <Route path="/dummy" component={Dummy} />
            </>
          </Router>
        </MuiThemeProvider>
      </JssProvider>
    );
  }
}

export default withStyles(styles)(App);
