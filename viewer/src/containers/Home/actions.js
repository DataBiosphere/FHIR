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

export function getSummaryInfoAction() {
  return {
    type: GET_SUMMARY_INFO,
  };
}

export function getSummaryInfoRequestAction() {
  return {
    type: GET_SUMMARY_INFO_REQUEST,
  };
}

export function getSummaryInfoSuccessAction(info) {
  return {
    type: GET_SUMMARY_INFO_SUCCESS,
    payload: info,
  };
}

export function getSummaryInfoErrorAction() {
  return {
    type: GET_SUMMARY_INFO_ERROR,
  };
}
