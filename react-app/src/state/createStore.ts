// simplified from https://github.com/gatsbyjs/gatsby/blob/master/examples/using-redux/src/state/createStore.js
import {
  Action as ReduxAction,
  createStore as reduxCreateStore,
  Reducer
} from 'redux';

export interface State {
  count: number;
}

export type Action = ReduxAction<'INCREMENT'>;

const initialState: State = { count: 0 };

const reducer: Reducer<State, Action> = (state, action) => {
  if (state === undefined) {
    return initialState;
  }
  if (action.type === `INCREMENT`) {
    return { ...state, count: state.count + 1 };
  }
  return state;
};

const createStore = () => reduxCreateStore(reducer);
export default createStore;
