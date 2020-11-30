import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the capability state domain
 */

const selectCapabilityDomain = (state) => state.capability || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Capability
 */
const makeSelectCapability = () => createSelector(selectCapabilityDomain, (substate) => substate);

export default makeSelectCapability;

export { selectCapabilityDomain };
