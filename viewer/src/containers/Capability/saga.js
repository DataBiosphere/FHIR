import { call, put } from 'redux-saga/effects';
import { loadCapabilityAction } from './actions';
import makeRequester from '../../utils/request';
import connect from '../../services/FhirClient';

export default function* capabilitySaga(props) {
  const client = yield call(connect);
  const requester = makeRequester(client);

  const metadata = yield call(requester, 'metadata');
  yield put(loadCapabilityAction(metadata));
}
