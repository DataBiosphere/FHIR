/*
 *
 * Home reducer
 *
 */
import produce from 'immer';
import {
  GET_SUMMARY_INFO_REQUEST,
  GET_SUMMARY_INFO_SUCCESS,
  GET_SUMMARY_INFO_ERROR,
} from './constants';
import { Action } from './actions';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const homeReducer = (state = initialState, action: Action) =>
  produce(state, (draft: any) => {
    switch (action.type) {
      case GET_SUMMARY_INFO_REQUEST:
        draft.loading = true;
        break;
      case GET_SUMMARY_INFO_SUCCESS:
        draft.summaryInfo = action.payload;
        draft.loading = false;
        break;
      case GET_SUMMARY_INFO_ERROR:
        break;
    }
  });

export default homeReducer;
