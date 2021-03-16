import { call, put, all, takeEvery } from 'redux-saga/effects';
import makeRequester from '../../utils/request';
import connect from '../../services/FhirClient';

import {
  loadBundleSuccessAction,
  loadBundleRequestAction,
  loadBundleErrorAction,
  loadEntryRequestAction,
  loadEntrySuccessAction,
  loadEntryErrorAction,
  downloadBundleRequestAction,
  downloadBundleErrorAction,
  downloadBundleUpdateAction,
  downloadBundleSuccessAction,
  getMetaRequestAction,
  getMetaSuccessAction,
  getMetaErrorAction,
} from './actions';
import { PARSING_ROWS_PER_PAGE } from './constants';
import { GET_BUNDLE, GET_ENTRY, GET_DOWNLOAD, GET_META } from './types';

// TODO: explore memoizing this for pageLinks
function* getBundle({ resourceType, page, count, pageLinks, params }: any) {
  // @ts-ignore
  const client = yield call(connect);
  const requester = makeRequester(client);
  try {
    yield put(loadBundleRequestAction(resourceType, page));

    // create API call
    const paramString = params ? makeParamString(params) : '';
    const requestUrl: string =
      pageLinks && pageLinks[page]
        ? pageLinks[page]
        : `${resourceType}?_count=${count}&${paramString}`;
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
    yield put(loadBundleErrorAction(e));
  }
}

function* getDownload({ resourceType, params }: any) {
  // @ts-ignore
  const client = yield call(connect);
  const requester = makeRequester(client);
  try {
    yield put(downloadBundleRequestAction());
    let nextPage;
    let count = 0;

    const entries: Array<string> = [];
    // parse through and get all entries into bundle
    do {
      const paramString = makeParamString(params);

      // get the initial page, or get the next page
      let bundle: any;
      if (!nextPage) {
        // @ts-ignore
        bundle = yield call(
          requester,
          `${resourceType}?_count=${PARSING_ROWS_PER_PAGE}&${paramString}`
        );
      } else {
        // @ts-ignore
        bundle = yield call(requester, nextPage);
      }

      // get next link
      nextPage = bundle.link.filter((l: any) => l.relation === 'next')[0].url;

      // insert if there's more entries
      if (bundle.entry) {
        bundle.entry.forEach((entry: fhir.BundleEntry) => {
          entries.push(JSON.stringify(entry));
        });
      }

      // get the initial count, if needed
      if (count === 0) {
        count = bundle.total;
      }

      // update the counter
      yield put(downloadBundleUpdateAction(entries.length / count));
    } while (entries.length < count);

    // put into package
    const download = '['.concat(entries.join(',\n'), ']');
    yield put(downloadBundleSuccessAction(download));
  } catch (e) {
    yield put(downloadBundleUpdateAction(-1));
    yield put(downloadBundleErrorAction(e));
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
    yield put(loadEntryErrorAction(e));
  }
}

function* getMeta({ resourceType }: any) {
  // @ts-ignore
  const client = yield call(connect);
  const requester = makeRequester(client);
  try {
    yield put(getMetaRequestAction(resourceType));

    // @ts-ignore
    const meta: fhir.CapabilityStatement = yield call(requester, `metadata`);
    const server = meta.rest?.find((entry) => entry.mode == 'server')?.resource;
    const resource = server?.find((entry) => entry.type == resourceType);

    yield put(getMetaSuccessAction(resource));
  } catch (e) {
    yield put(getMetaErrorAction(e));
  }
}

export default function* searchSaga() {
  yield all([takeEvery(GET_BUNDLE, getBundle)]);
  yield all([takeEvery(GET_ENTRY, getEntry)]);
  yield all([takeEvery(GET_DOWNLOAD, getDownload)]);
  yield all([takeEvery(GET_META, getMeta)]);
}

// util functions
const makeParamString = (params: any): string => {
  return Object.entries(params)
    .map(([k, v]) => {
      return `${k}=${encodeURIComponent(v as string)}`;
    })
    .join('&');
};
