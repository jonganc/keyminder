import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';
import * as serviceWorker from './serviceWorker';

const rootEl = document.getElementById('root');

ReactDOM.render(<App />, rootEl);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

declare global {
  interface NodeModule {
    hot?: { accept: any };
  }
}

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default;
    ReactDOM.render(<NextApp />, rootEl);
  });
}
