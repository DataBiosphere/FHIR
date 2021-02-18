/*
 *
 * Home actions
 *
 */

import {
  GET_SUMMARY_INFO,
  GET_SUMMARY_INFO_REQUEST,
  GET_SUMMARY_INFO_SUCCESS,
  GET_SUMMARY_INFO_ERROR,
} from './constants';

export interface Action {
  type: string;
  [key: string]: any;
}

export function getSummaryInfoAction(): Action {
  return {
    type: GET_SUMMARY_INFO,
  };
}

export function getSummaryInfoRequestAction(): Action {
  return {
    type: GET_SUMMARY_INFO_REQUEST,
  };
}

export function getSummaryInfoSuccessAction(info: any): Action {
  return {
    type: GET_SUMMARY_INFO_SUCCESS,
    payload: info,
  };
}

export function getSummaryInfoErrorAction(): Action {
  return {
    type: GET_SUMMARY_INFO_ERROR,
  };
}
