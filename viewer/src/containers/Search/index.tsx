/**
 *
 * Search
 *
 */

// DEV:
// TCGA   - https://portal.gdc.cancer.gov/
// AnVIL  - https://anvil.terra.bio/

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Typography, makeStyles, CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { compose } from 'redux';
import saveAs from 'file-saver';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';

import {
  selectBundle,
  selectLoading,
  selectDownloadProgress,
  selectSelectedResource,
  selectPage,
  selectPageLinks,
  selectDownload,
  selectParams,
  selectViewingEntry,
  selectError,
  selectMeta,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  updateResourceAction,
  addParamAction,
  deleteParamAction,
  resetParamAction,
} from './actions';
import { GET_BUNDLE, GET_ENTRY, GET_DOWNLOAD, GET_META } from './types';

import mappings from './mappings';
import { DEFAULT_ROWS_PER_PAGE } from './constants';
import SearchBar from '../../components/SearchBar';
import FilterList from '../../components/FilterList';
import ExportButton from '../../components/ExportButton';
import PaginatedTable from '../../components/PaginatedTable';
import ViewingEntry from '../../components/ViewingEntry';

interface SearchType {
  getResources: any; // TODO: fix this PropTypes.func
  updateResource: any;
  getDownload: any; // TODO: fix this PropTypes.func
  getMeta: any;
  bundle: fhir.Bundle;
  params?: any; // TODO: fix this
  download?: string;
  loading?: boolean;
  page?: number;
  pageLinks?: any;
  downloadProgress?: number;
  selectedResource?: string;
  error: Error;
  viewingEntry?: fhir.BundleEntry;
}

const useStyles = makeStyles((theme) => {
  return {
    table: {
      marginTop: '1rem',
    },
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '1rem',
      marginTop: '1rem',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    button: {
      margin: theme.spacing(0.25),
      marginTop: 20,
    },
  };
});

const getColumnsAndRenderers = (resource: string) => {
  return mappings[resource];
};

export function Search(props: any) {
  const {
    getResources,
    updateResource,
    addParams,
    deleteParam,
    resetParams,
    getDownload,
    getMeta,

    bundle,
    loading,

    selectedResource,
    params,
    meta,

    page,
    pageLinks,

    download,
    downloadProgress,

    error,
  } = props;
  useInjectReducer({ key: 'search', reducer });
  useInjectSaga({ key: 'search', saga });

  // hooks
  const [fileName, setFileName] = useState('results.json');
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [open, setOpen] = useState(false);
  const [viewingEntry, setViewingEntry] = useState<any>();

  const classes = useStyles();

  // TODO: there has to be a better way to condense this
  const onUpdateResource = (resource: string) => {
    updateResource(resource);
  };
  const onAddParam = (key: string, value: any) => {
    addParams(key, value);
  };
  const onResetParam = () => {
    resetParams();
  };
  const onDeleteParam = (name: string) => {
    deleteParam(name);
  };

  const onChangePage = (_: any, newPage: number) => {
    getResources(selectedResource, newPage + 1, rowsPerPage, pageLinks, params);
  };

  const onChangeRowsPerPage = (event: any) => {
    setRowsPerPage(event.target.value);
    getResources(selectedResource, 1, rowsPerPage, {}, params);
  };

  const onApplyClicked = () => {
    getResources(selectedResource, 1, rowsPerPage, pageLinks, params);
  };

  const onExportClicked = () => {
    const date = new Date();
    setFileName(
      `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}_${selectedResource}_Export`
    );
    getDownload(selectedResource, params);
  };

  const closeViewingEntry = () => setOpen(false);

  // runs on inital launch
  useEffect(() => {
    getMeta();
  }, []);

  // runs when resource changes
  useEffect(() => {
    getResources(selectedResource, 1, rowsPerPage, [], {});
  }, [selectedResource]);

  // runs when download changes
  // not too sure if this is the best implementation though
  useEffect(() => {
    // write to file
    if (download) {
      const blob = new Blob([download], { type: 'application/json' });
      (saveAs as any)(blob, `${fileName}`);
    }
  }, [download]);

  const itemKey = 'id';

  const { columns, renderers } = getColumnsAndRenderers(selectedResource);

  return (
    <>
      <Helmet>
        <title>Search</title>
        <meta name="description" content="Description of Search" />
      </Helmet>
      <Typography variant="h1">Search</Typography>

      <SearchBar
        updateResource={onUpdateResource}
        addParams={onAddParam}
        resetParams={onResetParam}
        applyParams={onApplyClicked}
        meta={meta}
      />

      <div className={classes.flexCenter}>
        <FilterList params={params} onDelete={onDeleteParam} />
      </div>
      <div className={classes.flexCenter}>
        <ExportButton downloadProgress={downloadProgress} onClick={onExportClicked} />
      </div>

      <div className={classes.table}>
        <PaginatedTable
          rows={bundle && !loading ? bundle.entry.map(({ resource }: any) => resource) : []}
          renderers={renderers}
          columns={columns}
          count={bundle ? bundle.total : 0}
          page={page - 1}
          onView={(_, item) => {
            setViewingEntry(item);
            setOpen(true);
          }}
          onChangePage={onChangePage}
          itemKey={itemKey}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />

        {viewingEntry && (
          <ViewingEntry
            title={`${viewingEntry.resourceType} - ${viewingEntry?.id}`}
            entry={JSON.stringify(viewingEntry, null, 2)}
            isOpen={open}
            handleClose={closeViewingEntry}
          />
        )}
      </div>

      <div className={classes.flexCenter}>
        {error ? <Alert severity="error">{error.toString()}</Alert> : null}
        {loading ? <CircularProgress size={80} /> : null}
      </div>
    </>
  );
}

Search.defaultProps = {
  bundle: undefined,
  loading: true,

  selectedResource: 'DiagnosticReport',
  params: {},

  page: 1,
  pageLinks: {},

  download: undefined,
  downloadProgress: 0,

  error: undefined,
};

const mapStateToProps = (state: any) => {
  return {
    bundle: selectBundle(state),
    loading: selectLoading(state),

    selectedResource: selectSelectedResource(state),
    params: selectParams(state),

    page: selectPage(state),
    pageLinks: selectPageLinks(state),

    download: selectDownload(state),
    downloadProgress: selectDownloadProgress(state),

    meta: selectMeta(state),
    error: selectError(state),

    // TODO: figure out how to display different viewing entries
    //        boiler plate is all written
    viewingEntry: selectViewingEntry(state),
  };
};

function mapDispatchToProps(dispatch: any) {
  return {
    getResources: (
      resourceType: string,
      page: number,
      count: number,
      pageLinks: string[],
      params: any
    ) => {
      dispatch({ type: GET_BUNDLE, resourceType, page, count, pageLinks, params });
    },

    updateResource: (resource: string) => {
      dispatch(updateResourceAction(resource));
    },

    addParams: (key: string, value: any) => {
      dispatch(addParamAction(key, value));
    },

    deleteParam: (key: string) => {
      dispatch(deleteParamAction(key));
    },

    resetParams: () => {
      dispatch(resetParamAction());
    },

    getDownload: (resourceType: string, params: any) => {
      dispatch({ type: GET_DOWNLOAD, resourceType, params });
    },

    getViewingEntry: (resourceType: string, id: string) => {
      dispatch({ type: GET_ENTRY, resourceType, id });
    },

    getMeta: () => {
      dispatch({ type: GET_META });
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Search);
