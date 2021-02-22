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

function* getResourceType({ resourceType, page, count }: any) {
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

function* getDownloadType({ resourceType, params }: any) {
  const client = yield call(connect);
  const requester = makeRequester(client);
  try {
    yield put(downloadBundleRequestAction(resourceType, params));
    let count = 0;
    let page = 1;

    const entries: Array<any> = [];
    // parse through and get all entries into bundle
    do {
      const bundle = yield call(
        requester,
        `${resourceType}?_page=${page}&_count=${PARSING_ROWS_PER_PAGE}&${params}`
      );

      bundle.entry.forEach((entry: any) => {
        entries.push(JSON.stringify(entry));
      });

      // get the initial count, if needed
      if (count === 0) {
        count = bundle.total;
      }

      // update the counter
      yield put(downloadBundleUpdateAction(entries.length / count));
      page += 1;
    } while (entries.length < count);

    // put into package
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
