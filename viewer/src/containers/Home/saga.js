import { take, call, put, takeEvery, all } from 'redux-saga/effects';

import makeRequester from '../../utils/request';
import connect from '../../services/FhirClient';

import GET_SUMMARY_INFO from './constants';
import {
  getSummaryInfoRequestAction,
  getSummaryInfoSuccessAction,
  getSummaryInfoErrorAction,
} from './actions';

export function* homeSaga({ resources = ['DiagnosticReport', 'Observation'] }) {
  const client = yield call(connect);
  const requester = makeRequester(client);

  try {
    yield put(getSummaryInfoRequestAction());

    const bundles = yield all(resources.map((resourceType) => call(requester, resourceType)));

    const info = bundles.map((bundle) => {
      const { resourceType } = bundle.entry[0].resource;
      return {
        resourceType,
        total: bundle.total,
      };
    });

    yield put(getSummaryInfoSuccessAction(info));
  } catch (e) {
    getSummaryInfoErrorAction(e);
  }
}

export default function* searchSaga() {
  yield all([takeEvery(GET_SUMMARY_INFO, homeSaga)]);
}