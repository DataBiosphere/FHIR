import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the home state domain
 */

const selectHomeDomain = (state) => state.home || initialState;

export const selectSummaryInfo = createSelector(
  selectHomeDomain,
  (substate) => substate.summaryInfo
);

export default selectHomeDomain;
