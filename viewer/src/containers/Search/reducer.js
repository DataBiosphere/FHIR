/*
 *
 * Search reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, GET_BUNDLE_REQUEST, GET_BUNDLE_SUCCESS } from './constants';

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
      case DEFAULT_ACTION:
        break;
    }
  });

export default searchReducer;
