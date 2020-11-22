/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';

import appReducer from '../containers/App/reducers';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
const rootReducer = combineReducers({
  app: appReducer,
});

export default rootReducer;
