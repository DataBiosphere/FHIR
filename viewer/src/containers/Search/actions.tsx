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
export const loadBundleRequestAction = (resourceType: string, page: number, count: number) => ({
  type: GET_BUNDLE_REQUEST,
  payload: { resourceType, page, count },
});

export const loadBundleSuccessAction = (bundle: any, links: any) => ({
  type: GET_BUNDLE_SUCCESS,
  payload: { bundle: bundle, links: links },
});

export const loadBundleErrorAction = (error: any) => ({ type: GET_BUNDLE_ERROR, payload: error });

// export actions
export const downloadBundleRequestAction = (resourceType: string, params: any) => ({
  type: GET_DOWNLOAD_REQUEST,
  payload: { resourceType, params },
});

export const downloadBundleUpdateAction = (downloadProgress: any) => ({
  type: GET_DOWNLOAD_UPDATE,
  payload: downloadProgress,
});

export const downloadBundleSuccessAction = (download: any) => ({
  type: GET_DOWNLOAD_SUCCESS,
  payload: download,
});

export const downloadBundleErrorAction = (error: any) => ({
  type: GET_DOWNLOAD_ERROR,
  payload: error,
});

// default action
export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
