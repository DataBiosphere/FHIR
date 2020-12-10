import { call, put, all, takeEvery } from 'redux-saga/effects';
import makeRequester from '../../utils/request';
import connect from '../../services/FhirClient';

import { loadBundleSuccessAction, loadBundleRequestAction, loadBundleErrorAction } from './actions';
import { GET_BUNDLE } from './constants';

function* getDiagnosticReports({ resourceType, page }) {
  const client = yield call(connect);
  const requester = makeRequester(client);
  try {
    yield put(loadBundleRequestAction());
    const bundle = yield call(requester, `${resourceType}?_page=${page}`);
    yield put(loadBundleSuccessAction(bundle));
  } catch (e) {
    loadBundleErrorAction(e);
  }
}

export default function* searchSaga() {
  yield all([takeEvery(GET_BUNDLE, getDiagnosticReports)]);
}
