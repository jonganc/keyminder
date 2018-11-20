import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import ReduxProvider from './components/ReduxProvider';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <ReduxProvider>
        <>
          <CssBaseline />
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.tsx</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </header>
          </div>
        </>
      </ReduxProvider>
    );
  }
}

export default App;
