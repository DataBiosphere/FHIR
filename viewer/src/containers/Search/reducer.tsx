/*
 *
 * Search reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  GET_BUNDLE_REQUEST,
  GET_BUNDLE_SUCCESS,
  GET_BUNDLE_ERROR,
  UPDATE_RESOURCE,
  GET_ENTRY_REQUEST,
  GET_ENTRY_SUCCESS,
  ADD_PARAM,
  DELETE_PARAM,
  RESET_PARAM,
  GET_DOWNLOAD_REQUEST,
  GET_DOWNLOAD_UPDATE,
  GET_DOWNLOAD_SUCCESS,
  GET_DOWNLOAD_ERROR,
  GET_META_SUCCESS,
  GET_META_ERROR,
} from './types';

export const initialState = {
  container: 'Search',
  params: {},
};

/* eslint-disable default-case, no-param-reassign */
const searchReducer = (state = initialState, action: any) =>
  produce(state, (draft: any) => {
    switch (action.type) {
      case GET_BUNDLE_REQUEST:
        draft.loading = true;
        draft.selectedResource = action.payload.resourceType;
        draft.page = action.payload.page;
        break;
      case GET_BUNDLE_SUCCESS:
        draft.bundle = action.payload.bundle;
        draft.pageLinks = action.payload.links;
        draft.loading = false;
        break;
      case GET_BUNDLE_ERROR:
        // TODO: maybe make error more descriptive?
        draft.error = action.payload.error;
        draft.bundle = undefined;
        draft.pageLinks = [];
        draft.loading = false;
        break;

      case UPDATE_RESOURCE:
        draft.selectedResource = action.payload.resource;
        break;

      // TODO: figure out this data race
      //        it should update the params before it makes the first API call
      case ADD_PARAM:
        draft.params[action.payload.key] = action.payload.value;
        draft.pageLinks = [];
        break;
      case DELETE_PARAM:
        delete draft.params[action.payload.key];
        draft.pageLinks = [];
        break;
      case RESET_PARAM:
        draft.params = {};
        draft.pageLinks = [];
        draft.error = '';
        break;

      case GET_DOWNLOAD_REQUEST:
        draft.downloadProgress = 0;
        break;
      case GET_DOWNLOAD_UPDATE:
        draft.downloadProgress = action.payload.downloadProgress;
        break;
      case GET_DOWNLOAD_SUCCESS:
        draft.downloadProgress = 0;
        draft.download = action.payload.download;
        break;
      case GET_DOWNLOAD_ERROR:
        // TODO: maybe make error more descriptive?
        draft.error = action.payload.error;
        draft.bundle = undefined;
        draft.downloadProgress = 0;
        break;

      case GET_ENTRY_REQUEST:
        draft.resourceType = action.payload.resourceType;
        draft.id = action.payload.id;
        break;
      case GET_ENTRY_SUCCESS:
        draft.viewingEntry = action.payload.entry;
        break;

      case GET_META_SUCCESS:
        draft.meta = action.payload.meta;
        break;
      case GET_META_ERROR:
        // TODO: maybe make error more descriptive?
        draft.error = action.payload.error;
        draft.bundle = undefined;
        draft.pageLinks = [];
        draft.loading = false;
        break;

      case DEFAULT_ACTION:
        break;
    }
  });

export default searchReducer;
