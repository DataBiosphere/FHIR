import { createSelector } from 'reselect';

import { initialState } from './reducer';

/**
 * Other specific selectors
 */

export const selectApp = (state) => state.app || initialState;

export const getSmartError = createSelector([selectApp], (app) => {
  return app.error;
});

export const getSmartInfo = createSelector([selectApp], (app) => {
  return app.smart;
});

/**
 * Default selector used by Capability
 */
const makeSelectApp = () => createSelector(selectApp, (substate) => substate);
export default makeSelectApp;
