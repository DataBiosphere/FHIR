/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import history from '../utils/history';

import appReducer from '../containers/App/reducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
const rootReducer = combineReducers({
  app: appReducer,
  router: connectRouter(history),
});

export default rootReducer;
