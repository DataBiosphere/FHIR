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
  UPDATE_RESOURCE,
  GET_ENTRY_REQUEST,
  GET_ENTRY_SUCCESS,
  GET_ENTRY_ERROR,
  ADD_PARAM,
  DELETE_PARAM,
  RESET_PARAM,
  GET_DOWNLOAD_REQUEST,
  GET_DOWNLOAD_UPDATE,
  GET_DOWNLOAD_SUCCESS,
  GET_DOWNLOAD_ERROR,
  GET_META_REQUEST,
  GET_META_SUCCESS,
  GET_META_ERROR,
} from './types';

// default action
export function defaultAction(): SearchActionTypes {
  return {
    type: DEFAULT_ACTION,
  };
}

// load bundle actions
export function loadBundleRequestAction(resourceType: string, page: number): SearchActionTypes {
  return {
    type: GET_BUNDLE_REQUEST,
    payload: { resourceType, page },
  };
}

export function loadBundleSuccessAction(bundle: fhir.Bundle, links: any): SearchActionTypes {
  return {
    type: GET_BUNDLE_SUCCESS,
    payload: { bundle, links },
  };
}

export function loadBundleErrorAction(error: Error): SearchActionTypes {
  return {
    type: GET_BUNDLE_ERROR,
    payload: { error },
  };
}

export function updateResourceAction(resource: string): SearchActionTypes {
  return {
    type: UPDATE_RESOURCE,
    payload: { resource },
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

// param actions
export function addParamAction(key: string, value: string): SearchActionTypes {
  return {
    type: ADD_PARAM,
    payload: { key, value },
  };
}

export function deleteParamAction(key: string): SearchActionTypes {
  return {
    type: DELETE_PARAM,
    payload: { key },
  };
}

export function resetParamAction(): SearchActionTypes {
  return {
    type: RESET_PARAM,
  };
}

// export actions
export function downloadBundleRequestAction(): SearchActionTypes {
  return {
    type: GET_DOWNLOAD_REQUEST,
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

// meta actions
export function getMetaRequestAction(resourceType: string): SearchActionTypes {
  return {
    type: GET_META_REQUEST,
    payload: { resourceType },
  };
}

export function getMetaSuccessAction(meta: any): SearchActionTypes {
  return {
    type: GET_META_SUCCESS,
    payload: { meta },
  };
}

export function getMetaErrorAction(error: Error): SearchActionTypes {
  return {
    type: GET_META_ERROR,
    payload: { error },
  };
}
