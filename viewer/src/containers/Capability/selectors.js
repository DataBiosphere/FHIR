import { createSelector } from 'reselect';
import _ from 'lodash';
import { initialState } from './reducer';

/**
 * Direct selector to the capability state domain
 */
const selectCapabilityDomain = (state) => state.capability || initialState;

/**
 * Other specific selectors
 */

const selectMetadata = createSelector(selectCapabilityDomain, (capability) => capability.metadata);
const selectSmartContext = (state) => _.get(state, 'global.smart');

/**
 * Default selector used by Capability
 */
const makeSelectCapability = () => createSelector(selectCapabilityDomain, (substate) => substate);

export default makeSelectCapability;

export { selectCapabilityDomain, selectMetadata, selectSmartContext };
