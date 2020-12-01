/*
 *
 * Capability actions
 *
 */

import { DEFAULT_ACTION, LOAD_CAPABILITY_STATEMENT } from './constants';

export const loadCapabilityAction = (statement) => {
  return {
    type: LOAD_CAPABILITY_STATEMENT,
    payload: statement,
  };
};

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
