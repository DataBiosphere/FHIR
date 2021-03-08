/*
 *
 * Search actions
 *
 */
import {
  SearchActionTypes,
  DEFAULT_ACTION,
  GET_BUNDLE_REQUEST,
  GET_BUNDLE_SUCCESS,
  GET_BUNDLE_ERROR,
  GET_ENTRY_REQUEST,
  GET_ENTRY_SUCCESS,
  GET_ENTRY_ERROR,
  GET_DOWNLOAD_REQUEST,
  GET_DOWNLOAD_UPDATE,
  GET_DOWNLOAD_SUCCESS,
  GET_DOWNLOAD_ERROR,
} from './types';

// default action
export function defaultAction(): SearchActionTypes {
  return {
    type: DEFAULT_ACTION,
  };
}

// load bundle actions
export function loadBundleRequestAction(
  resourceType: string,
  page: number,
  count: number
): SearchActionTypes {
  return {
    type: GET_BUNDLE_REQUEST,
    payload: { resourceType, page, count },
  };
}

export function loadBundleSuccessAction(bundle: fhir.Bundle, links: any): SearchActionTypes {
  return {
    type: GET_BUNDLE_SUCCESS,
    payload: { bundle: bundle, links: links },
  };
}

export function loadBundleErrorAction(error: any): SearchActionTypes {
  return {
    type: GET_BUNDLE_ERROR,
    payload: { error },
  };
}

// load entry actions
export function loadEntryRequestAction(resourceType: string, id: string): SearchActionTypes {
  return {
    type: GET_ENTRY_REQUEST,
    payload: { resourceType, id },
  };
}

export function loadEntrySuccessAction(entry: fhir.BundleEntry): SearchActionTypes {
  return {
    type: GET_ENTRY_SUCCESS,
    payload: { entry },
  };
}

export function loadEntryErrorAction(error: Error): SearchActionTypes {
  return {
    type: GET_ENTRY_ERROR,
    payload: { error },
  };
}

// export actions
export function downloadBundleRequestAction(
  resourceType: string,
  params: string
): SearchActionTypes {
  return {
    type: GET_DOWNLOAD_REQUEST,
    payload: { resourceType, params },
  };
}

export function downloadBundleUpdateAction(downloadProgress: number): SearchActionTypes {
  return {
    type: GET_DOWNLOAD_UPDATE,
    payload: { downloadProgress },
  };
}

export function downloadBundleSuccessAction(download: any): SearchActionTypes {
  return {
    type: GET_DOWNLOAD_SUCCESS,
    payload: { download },
  };
}

export function downloadBundleErrorAction(error: Error): SearchActionTypes {
  return {
    type: GET_DOWNLOAD_ERROR,
    payload: { error },
  };
}
