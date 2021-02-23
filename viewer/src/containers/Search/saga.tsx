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

function* getResourceType({ resourceType, page, count, pageLinks }: any) {
  const client = yield call(connect);
  const requester = makeRequester(client);
  try {
    yield put(loadBundleRequestAction(resourceType, page, count, pageLinks));
    console.log('PAGE LINKS: ', JSON.stringify(pageLinks, null, 4));
    const requestUrl: string = pageLinks && pageLinks[page] ? pageLinks[page] : `${resourceType}?_page=${page}&_count=${count}`;
    const bundle = yield call(requester, requestUrl);

    const pageArray = [];
    if (page > 1)
      pageArray.push(page - 1);
    pageArray.push(page);
    pageArray.push(page + 1);

    const links: any = {};
    pageArray.forEach((p: number) => {
      if (p < page){
        links[p] = bundle.link.filter((l: any) => l.relation === 'previous')[0].url;
      } else if (p === page) {
        links[p] = bundle.link.filter((l: any) => l.relation === 'self')[0].url;
      } else {
        links[p] = bundle.link.filter((l: any) => l.relation === 'next')[0].url;
      }
    });

    yield put(loadBundleSuccessAction(bundle, links));
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
