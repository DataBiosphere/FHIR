/**
 * sagas
 */

import { put, all, call, takeEvery, setContext } from 'redux-saga/effects';
import { LOAD_SMART_INFO } from './constants';
import { addSmartInformationAction, addSmartInformationErrorAction } from './actions';

import connect from '../../services/FhirClient';

export function* loadSmartInfo() {
  try {
    const client = yield call(connect);
    yield setContext({ fhirclient: client });
    yield put(addSmartInformationAction(client));
  } catch (e) {
    yield put(addSmartInformationErrorAction());
  }
}

export default function* root() {
  yield all([takeEvery(LOAD_SMART_INFO, loadSmartInfo)]);
}
