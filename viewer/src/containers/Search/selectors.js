import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the search state domain
 */

const selectSearchDomain = (state) => state.search || initialState;

/**
 * Other specific selectors
 */

export const selectBundle = createSelector(selectSearchDomain, (substate) => substate.bundle);
export const selectLoading = createSelector(selectSearchDomain, (substate) => substate.loading);

/**
 * Default selector used by Search
 */

const makeSelectSearch = () => createSelector(selectSearchDomain, (substate) => substate);

export default makeSelectSearch;