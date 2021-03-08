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
  loadEntryRequestAction,
  loadEntrySuccessAction,
  loadEntryErrorAction,
} from './actions';
import { PARSING_ROWS_PER_PAGE } from './constants';
import { GET_BUNDLE, GET_ENTRY, GET_DOWNLOAD } from './types';

// TODO: explore memoizing this for pageLinks
function* getResourceType({ resourceType, page, count, pageLinks }: any) {
  // @ts-ignore
  const client = yield call(connect);
  const requester = makeRequester(client);
  try {
    yield put(loadBundleRequestAction(resourceType, page, count));

    // create API call
    const requestUrl: string =
      pageLinks && pageLinks[page]
        ? pageLinks[page]
        : `${resourceType}?_page=${page}&_count=${count}`;
    // @ts-ignore
    const bundle = yield call(requester, requestUrl);

    // create paging array
    const pageArray = [];
    if (page > 1) pageArray.push(page - 1);
    pageArray.push(page);
    pageArray.push(page + 1);

    // parse bundle and build links
    const links: any = {};
    pageArray.forEach((p: number) => {
      if (p < page) {
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

function* getEntry({ resourceType, id }: any) {
  // @ts-ignore
  const client = yield call(connect);
  const requester = makeRequester(client);
  try {
    yield put(loadEntryRequestAction(resourceType, id));

    // @ts-ignore
    const entry = yield call(requester, `${resourceType}/${id}`);

    yield put(loadEntrySuccessAction(entry));
  } catch (e) {
    loadEntryErrorAction(e);
  }
}

function* getDownload({ resourceType, params }: any) {
  // @ts-ignore
  const client = yield call(connect);
  const requester = makeRequester(client);
  try {
    yield put(downloadBundleRequestAction(resourceType, params));
    let count = 0;
    let page = 1;

    const entries: Array<any> = [];
    // parse through and get all entries into bundle
    do {
      // @ts-ignore
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
  yield all([takeEvery(GET_ENTRY, getEntry)]);
  yield all([takeEvery(GET_DOWNLOAD, getDownload)]);
}
