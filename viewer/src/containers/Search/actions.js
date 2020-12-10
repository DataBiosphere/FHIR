/*
 *
 * Search actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_BUNDLE_REQUEST,
  GET_BUNDLE_SUCCESS,
  GET_BUNDLE_ERROR,
} from './constants';

export const loadBundleRequestAction = () => ({ type: GET_BUNDLE_REQUEST });

export const loadBundleSuccessAction = (bundle) => ({ type: GET_BUNDLE_SUCCESS, payload: bundle });

export const loadBundleErrorAction = (error) => ({ type: GET_BUNDLE_ERROR, payload: error });

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
