export const DEFAULT_ACTION = 'app/Search/DEFAULT_ACTION';
interface GetDefautAction {
  type: typeof DEFAULT_ACTION;
}

export const GET_BUNDLE = 'app/Search/GET_BUNDLE';
export const GET_BUNDLE_REQUEST = 'app/Search/GET_BUNDLE_REQUEST';
export const GET_BUNDLE_SUCCESS = 'app/Search/GET_BUNDLE_SUCCESS';
export const GET_BUNDLE_ERROR = 'app/Search/GET_BUNDLE_ERROR';

interface GetBundleRequestAction {
  type: typeof GET_BUNDLE_REQUEST;
  payload: {
    resourceType: string;
    page: number;
  };
}

interface GetBundleSuccessAction {
  type: typeof GET_BUNDLE_SUCCESS;
  payload: { bundle: fhir.Bundle; links: string[] };
}

interface GetBundleErrorAction {
  type: typeof GET_BUNDLE_ERROR;
  payload: { error: Error };
}

export const UPDATE_RESOURCE = 'app/Search/UPDATE_RESOURCE';

interface UpdateResourceAction {
  type: typeof UPDATE_RESOURCE;
  payload: { resource: string };
}

export const GET_ENTRY = 'app/Search/GET_ENTRY';
export const GET_ENTRY_REQUEST = 'app/Search/GET_ENTRY_REQUEST';
export const GET_ENTRY_SUCCESS = 'app/Search/GET_ENTRY_SUCCESS';
export const GET_ENTRY_ERROR = 'app/Search/GET_ENTRY_ERROR';

interface GetEntryRequestAction {
  type: typeof GET_ENTRY_REQUEST;
  payload: { resourceType: string; id: string };
}

interface GetEntrySuccessAction {
  type: typeof GET_ENTRY_SUCCESS;
  payload: { entry: fhir.BundleEntry };
}

interface GetEntryErrorAction {
  type: typeof GET_ENTRY_ERROR;
  payload: { error: Error };
}

export const ADD_PARAM = 'app/Search/ADD_PARAM';
export const DELETE_PARAM = 'app/Search/DELETE_PARAM';
export const RESET_PARAM = 'app/Search/RESET_PARAM';

interface AddParamAction {
  type: typeof ADD_PARAM;
  payload: { key: string; value: any };
}

interface DeleteParamAction {
  type: typeof DELETE_PARAM;
  payload: { key: string };
}

interface ResetParamAction {
  type: typeof RESET_PARAM;
}

export const GET_DOWNLOAD = 'app/Search/GET_DOWNLOAD';
export const GET_DOWNLOAD_REQUEST = 'app/Search/GET_DOWNLOAD_REQUEST';
export const GET_DOWNLOAD_UPDATE = 'app/Search/GET_DOWNLOAD_UPDATE';
export const GET_DOWNLOAD_SUCCESS = 'app/Search/GET_DOWNLOAD_SUCCESS';
export const GET_DOWNLOAD_ERROR = 'app/Search/GET_DOWNLOAD_ERROR';

interface GetDownloadRequestAction {
  type: typeof GET_DOWNLOAD_REQUEST;
}

interface GetDownloadUpdateAction {
  type: typeof GET_DOWNLOAD_UPDATE;
  payload: { downloadProgress: number };
}

interface GetDownloadSuccessAction {
  type: typeof GET_DOWNLOAD_SUCCESS;
  payload: { download: any };
}

interface GetDownloadErrorAction {
  type: typeof GET_DOWNLOAD_ERROR;
  payload: { error: Error };
}

export const GET_META = 'app/Search/GET_META';
export const GET_META_REQUEST = 'app/Search/GET_META_REQUEST';
export const GET_META_SUCCESS = 'app/Search/GET_META_SUCCESS';
export const GET_META_ERROR = 'app/Search/GET_META_ERROR';

interface GetMetaRequestAction {
  type: typeof GET_META_REQUEST;
}

interface GetMetaSuccessAction {
  type: typeof GET_META_SUCCESS;
  payload: { meta: any };
}

interface GetMetaErrorAction {
  type: typeof GET_META_ERROR;
  payload: { error: Error };
}

export type SearchActionTypes =
  | GetDefautAction
  | GetBundleRequestAction
  | GetBundleSuccessAction
  | GetBundleErrorAction
  | UpdateResourceAction
  | GetEntryRequestAction
  | GetEntrySuccessAction
  | GetEntryErrorAction
  | AddParamAction
  | DeleteParamAction
  | ResetParamAction
  | GetDownloadRequestAction
  | GetDownloadUpdateAction
  | GetDownloadSuccessAction
  | GetDownloadErrorAction
  | GetMetaRequestAction
  | GetMetaSuccessAction
  | GetMetaErrorAction;
