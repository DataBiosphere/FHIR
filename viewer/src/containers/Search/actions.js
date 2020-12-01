/*
 *
 * Search actions
 *
 */

import { DEFAULT_ACTION, GET_BUNDLE_SUCCESS } from './constants';

export const loadBundleSuccessAction = (bundle) => ({ type: GET_BUNDLE_SUCCESS, payload: bundle });

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
