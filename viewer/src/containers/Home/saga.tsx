import { call, put, takeEvery, all } from 'redux-saga/effects';

import makeRequester from '../../utils/request';
import connect from '../../services/FhirClient';

import GET_SUMMARY_INFO from './constants';
import {
  getSummaryInfoRequestAction,
  getSummaryInfoSuccessAction,
  getSummaryInfoErrorAction,
} from './actions';

export function* homeSaga() {
  const client = yield call(connect);
  const requester = makeRequester(client);

  try {
    const metadata = yield call(requester, 'metadata');

    const resources = metadata.rest
      .map(({ resource }: any) => resource)
      .reduce((accum: Array<any>, next: any) => {
        return accum.concat(next);
      }, [])
      .map(({ type }: { type: string }) => type);

    yield put(getSummaryInfoRequestAction());

    const bundles = yield all(
      resources.map((resourceType: string) => call(requester, resourceType))
    );

    const info = bundles.map((bundle: any) => {
      const { resourceType } = bundle.entry[0].resource;
      return {
        resourceType,
        total: bundle.total,
      };
    });

    yield put(getSummaryInfoSuccessAction(info));
  } catch (e) {
    getSummaryInfoErrorAction();
  }
}

export default function* searchSaga() {
  yield all([takeEvery(GET_SUMMARY_INFO, homeSaga)]);
}
