/**
 * The App state selectors
 */
import _ from 'lodash';
import { initialState } from './reducer';

import { createSelector } from 'reselect';

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

export const getPatient = (state) => {
  return _.get(state, 'home.patient');
};

/**
 * Default selector used by Capability
 */
const makeSelectApp = () => createSelector(selectApp, (substate) => substate);
export default makeSelectApp;
