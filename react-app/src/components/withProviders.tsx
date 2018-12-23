import {
  createGenerateClassName,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import React from 'react';
import { JssProvider } from 'react-jss';

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

function withProviders(Component: React.ComponentType) {
  return () => (
    <JssProvider generateClassName={createGenerateClassName()}>
      <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
        <Component />
      </MuiThemeProvider>
    </JssProvider>
  );
}

export default withProviders;
