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
  GET_DOWNLOAD_REQUEST,
  GET_DOWNLOAD_UPDATE,
  GET_DOWNLOAD_SUCCESS,
  GET_DOWNLOAD_ERROR,
} from './constants';

// load bundle actions
export const loadBundleRequestAction = (resourceType, page, count) => ({
  type: GET_BUNDLE_REQUEST,
  payload: { resourceType, page, count },
});

export const loadBundleSuccessAction = (bundle) => ({ type: GET_BUNDLE_SUCCESS, payload: bundle });

export const loadBundleErrorAction = (error) => ({ type: GET_BUNDLE_ERROR, payload: error });

// export actions
export const downloadBundleRequestAction = (resourceType, params) => ({
  type: GET_DOWNLOAD_REQUEST,
  payload: { resourceType, params },
});

export const downloadBundleUpdateAction = (downloadProgress) => ({
  type: GET_DOWNLOAD_UPDATE,
  payload: downloadProgress,
});

export const downloadBundleSuccessAction = (download) => ({
  type: GET_DOWNLOAD_SUCCESS,
  payload: download,
});

export const downloadBundleErrorAction = (error) => ({ type: GET_DOWNLOAD_ERROR, payload: error });

// default action
export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
