import { call, put, all, takeEvery } from 'redux-saga/effects';
import makeRequester from '../../utils/request';
import connect from '../../services/FhirClient';

import {
  loadBundleSuccessAction,
  loadBundleRequestAction,
  loadBundleErrorAction,
  downloadBundleRequestAction,
  downloadBundleErrorAction,
  downloadBundleUpdateAction,
  downloadBundleSuccessAction,
} from './actions';
import { GET_BUNDLE, GET_DOWNLOAD, PARSING_ROWS_PER_PAGE } from './constants';

function* getResourceType({ resourceType, page, count }) {
  const client = yield call(connect);
  const requester = makeRequester(client);
  try {
    yield put(loadBundleRequestAction(resourceType, page, count));
    const bundle = yield call(requester, `${resourceType}?_page=${page}&_count=${count}`);
    yield put(loadBundleSuccessAction(bundle));
  } catch (e) {
    loadBundleErrorAction(e);
  }
}

function* getDownloadType({ resourceType, params }) {
  const client = yield call(connect);
  const requester = makeRequester(client);
  try {
    yield put(downloadBundleRequestAction(resourceType, params));
    // janky way of getting initial count
    const count = (yield call(requester, `${resourceType}?_count=${1}`)).total;

    let page = 1;
    const entries = [];
    // parse through and get all entries into bundle
    while (entries.length < count) {
      const bundle = yield call(
        requester,
        `${resourceType}?_page=${page}&_count=${PARSING_ROWS_PER_PAGE}&${params}`
      );

      bundle.entry.forEach((entry) => {
        entries.push(JSON.stringify(entry));
      });

      yield put(downloadBundleUpdateAction(entries.length / count));
      page += 1;
    }

    // write to disk
    const download = '['.concat(entries.join(',\n'), ']');
    yield put(downloadBundleSuccessAction(download));
  } catch (e) {
    downloadBundleErrorAction(e);
  }
}

export default function* searchSaga() {
  yield all([takeEvery(GET_BUNDLE, getResourceType)]);
  yield all([takeEvery(GET_DOWNLOAD, getDownloadType)]);
}
