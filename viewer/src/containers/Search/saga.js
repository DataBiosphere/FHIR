import { call, put, all, takeEvery } from 'redux-saga/effects';
import makeRequester from '../../utils/request';
import connect from '../../services/FhirClient';

import { loadBundleSuccessAction } from './actions';
import { GET_BUNDLE } from './constants';

function* getDiagnosticReports(action) {
  const client = yield call(connect);
  const requester = makeRequester(client);
  const bundle = yield call(requester, 'DiagnosticReport');

  yield put(loadBundleSuccessAction(bundle));
}

export default function* searchSaga() {
  yield all([takeEvery(GET_BUNDLE, getDiagnosticReports)]);
}
