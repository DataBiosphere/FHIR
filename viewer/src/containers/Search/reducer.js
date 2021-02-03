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
  GET_DOWNLOAD_REQUEST,
  GET_DOWNLOAD_UPDATE,
  GET_DOWNLOAD_SUCCESS,
} from './constants';

export const initialState = {
  container: 'Search',
};

/* eslint-disable default-case, no-param-reassign */
const searchReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_BUNDLE_REQUEST:
        draft.loading = true;
        draft.selectedResource = action.payload.resourceType;
        draft.page = action.payload.page;
        break;
      case GET_BUNDLE_SUCCESS:
        draft.bundle = action.payload;
        draft.loading = false;
        break;

      case GET_DOWNLOAD_REQUEST:
        draft.downloadProgress = 0;
        break;
      case GET_DOWNLOAD_UPDATE:
        draft.downloadProgress = action.payload;
        break;
      case GET_DOWNLOAD_SUCCESS:
        draft.downloadProgress = 0;
        draft.download = action.payload;
        break;

      case DEFAULT_ACTION:
        break;
    }
  });

export default searchReducer;
