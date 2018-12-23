import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

class App extends Component {
  render() {
    return (
      <>
        <CssBaseline />
        <div className="App">Hello, this is an app</div>
      </>
    );
  }
}

export default App;
