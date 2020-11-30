import { all } from 'redux-saga/effects';

import appSaga from '../containers/App/saga';

export default function* sagas() {
  yield all([appSaga()]);
}
