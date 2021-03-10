/**
 *
 * Search
 *
 */

import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  Button,
  Typography,
  makeStyles,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
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
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import { addParamAction, resetParamAction } from './actions';
import { GET_BUNDLE, GET_ENTRY, GET_DOWNLOAD } from './types';

import mappings from './mappings';
import { DEFAULT_ROWS_PER_PAGE } from './constants';
import PaginatedTable from '../../components/PaginatedTable';
import ExportButton from '../../components/ExportButton';
import ViewingEntry from '../../components/ViewingEntry';

interface SearchType {
  getResources: any; // TODO: fix this PropTypes.func
  getDownload: any; // TODO: fix this PropTypes.func
  bundle: fhir.Bundle;
  params?: any; // TODO: fix this
  download?: string;
  loading?: boolean;
  page?: number;
  pageLinks?: any;
  downloadProgress?: number;
  selectedResource?: string;
  viewingEntry?: fhir.BundleEntry;
}

const useStyles = makeStyles((theme) => {
  return {
    table: {
      marginTop: '1rem',
    },
    loadingIcon: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '1rem',
      marginTop: '1rem',
    },
    facetedSearch: {},
    formControl: {
      margin: theme.spacing(1),
      minWidth: 125,
    },
    search: {
      margin: theme.spacing(1),
      minWidth: 500,
    },
    inline: {
      margin: theme.spacing(0.25),
      marginTop: 20,
      display: 'inline-block',
    },
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
    },
    viewingEntry: {
      color: theme.palette.text.primary,
    },
  };
});

const getColumnsAndRenderers = (resource: string) => {
  return mappings[resource];
};

export function Search(props: any) {
  const {
    getResources,
    addParams,
    resetParams,
    getDownload,
    bundle,
    loading,
    selectedResource,
    page,
    pageLinks,
    download,
    downloadProgress,
    params,
  } = props;
  useInjectReducer({ key: 'search', reducer });
  useInjectSaga({ key: 'search', saga });

  // hooks
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [paramKey, setParamKey] = useState<any>('_id');
  const [paramValue, setParamValue] = useState<any>('');
  const [open, setOpen] = useState(false);
  const [viewingEntry, setViewingEntry] = useState<any>();

  // TODO: this ref can be typed better
  const paramRef = useRef<any>(null);

  const classes = useStyles();

  const onChangePage = (_: any, newPage: number) => {
    getResources(selectedResource, newPage + 1, rowsPerPage, pageLinks);
  };

  const onChangeRowsPerPage = (event: any) => {
    setRowsPerPage(event.target.value);
    getResources(selectedResource, 1, rowsPerPage, {});
  };

  const onExportClicked = () => {
    getDownload(selectedResource, params);
  };

  const onAddClicked = () => {
    addParams(paramKey, paramValue);
  };

  const onResetClicked = () => {
    clearParamField();
    resetParams();
  };

  const clearParamField = () => {
    paramRef.current.value = '';
  };

  const closeViewingEntry = () => setOpen(false);

  // runs on inital launch
  useEffect(() => {
    getResources(selectedResource, page, rowsPerPage, pageLinks);
  }, []);

  // DEV: prints when params is change
  useEffect(() => {
    console.log(params);
  }, [params]);

  // runs when download changes
  // not too sure if this is the best implementation though
  useEffect(() => {
    // write to file
    if (download) {
      const blob = new Blob([download], { type: 'application/json' });
      (saveAs as any)(blob, 'results.json');
    }
  }, [download]);

  const itemKey = 'id';

  const { columns, renderers } = getColumnsAndRenderers(selectedResource);

  // TODO: look into making the search bar Flexbox
  //        https://css-tricks.com/snippets/css/a-guide-to-flexbox/
  return (
    <>
      <Helmet>
        <title>Search</title>
        <meta name="description" content="Description of Search" />
      </Helmet>
      <Typography variant="h1">Search</Typography>

      <div className={classes.facetedSearch}>
        <FormControl className={classes.formControl}>
          <InputLabel>Resource</InputLabel>
          <Select
            defaultValue="DiagnosticReport"
            onChange={(event) => {
              clearParamField();
              getResources(event.target.value, 1, rowsPerPage, {});
            }}
          >
            <MenuItem value="DiagnosticReport">DiagnosticReport</MenuItem>
            <MenuItem value="Observation">Observation</MenuItem>
            <MenuItem value="Specimen">Specimen</MenuItem>
            <MenuItem value="ResearchStudy">ResearchStudy</MenuItem>
          </Select>
        </FormControl>

        <FormControl className={classes.formControl}>
          <InputLabel>Parameter</InputLabel>
          <Select
            id="paramKey"
            defaultValue="_id"
            onChange={(event) => {
              clearParamField();
              setParamKey(event.target.value);
            }}
          >
            <MenuItem value="_id">ID</MenuItem>
            <MenuItem value="_source">Source</MenuItem>
          </Select>
        </FormControl>

        <FormControl className={classes.search}>
          <TextField
            inputRef={paramRef} // inputRef != ref...
            label="Search Value"
            onChange={(event) => {
              setParamValue(event.target.value);
            }}
          />
        </FormControl>

        <div className={classes.inline}>
          <Button
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddClicked}
          >
            Add Filter
          </Button>
        </div>
        <div className={classes.inline}>
          <Button
            color="primary"
            variant="contained"
            startIcon={<RotateLeftIcon />}
            onClick={onResetClicked}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      <div className={classes.flexCenter}>
        <ExportButton downloadProgress={downloadProgress} onClick={onExportClicked} />
      </div>

      {bundle && !loading ? (
        <div className={classes.table}>
          <PaginatedTable
            rows={bundle.entry.map(({ resource }: any) => resource)}
            renderers={renderers}
            columns={columns}
            count={bundle.total}
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
      ) : null}
      {loading ? (
        <div className={classes.loadingIcon}>
          <CircularProgress size={80} />
        </div>
      ) : null}
    </>
  );
}

Search.defaultProps = {
  bundle: undefined,
  download: undefined,
  loading: true,
  page: 1,
  pageLinks: {},
  downloadProgress: 0,
  selectedResource: 'DiagnosticReport',
  params: [],
};

const mapStateToProps = (state: any) => {
  return {
    bundle: selectBundle(state),
    loading: selectLoading(state),
    downloadProgress: selectDownloadProgress(state),
    selectedResource: selectSelectedResource(state),
    page: selectPage(state),
    pageLinks: selectPageLinks(state),
    download: selectDownload(state),
    params: selectParams(state),

    // TODO: figure out how to display different viewing entries
    //        boiler plate is all written
    viewingEntry: selectViewingEntry(state),
  };
};

function mapDispatchToProps(dispatch: any) {
  return {
    getResources: (resourceType: string, page: number, count: number, pageLinks: any) => {
      dispatch({ type: GET_BUNDLE, resourceType, page, count, pageLinks });
    },

    addParams: (key: string, value: any) => {
      dispatch(addParamAction(key, value));
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
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Search);
