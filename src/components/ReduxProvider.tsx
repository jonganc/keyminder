// from https://github.com/gatsbyjs/gatsby/blob/master/examples/using-redux/gatsby-ssr.js

import React from 'react';
import { Provider } from 'react-redux';

// eslint-disable-next-line import/no-unresolved
import createStore from '../state/createStore';

const store = createStore();

const ReduxProvider: React.SFC<{}> = props => (
  <Provider store={store}>{props.children}</Provider>
);

export default ReduxProvider;
