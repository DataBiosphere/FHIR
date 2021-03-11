/**
 *
 * Search
 *
 */

// DEV:
// TCGA   - https://portal.gdc.cancer.gov/
// AnVIL  - https://anvil.terra.bio/

import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  Button,
  Box,
  Typography,
  makeStyles,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AddIcon from '@material-ui/icons/Add';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import SearchIcon from '@material-ui/icons/Search';
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
import FilterList from '../../components/FilterList';
import ExportButton from '../../components/ExportButton';
import PaginatedTable from '../../components/PaginatedTable';
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
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '1rem',
      marginTop: '1rem',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 125,
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
    addParams,
    resetParams,
    getDownload,

    bundle,
    loading,

    selectedResource,
    params,

    page,
    pageLinks,

    download,
    downloadProgress,
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
    getResources(selectedResource, newPage + 1, rowsPerPage, pageLinks, params);
  };

  const onChangeRowsPerPage = (event: any) => {
    setRowsPerPage(event.target.value);
    getResources(selectedResource, 1, rowsPerPage, {}, params);
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

  const onApplyClicked = () => {
    getResources(selectedResource, 1, rowsPerPage, pageLinks, params);
  };

  const clearParamField = () => {
    paramRef.current.value = '';
  };

  const closeViewingEntry = () => setOpen(false);

  // runs on inital launch
  useEffect(() => {
    getResources(selectedResource, page, rowsPerPage, pageLinks, params);
  }, []);

  // runs when download changes
  // not too sure if this is the best implementation though
  useEffect(() => {
    // write to file
    if (download) {
      const blob = new Blob([download], { type: 'application/json' });
      (saveAs as any)(blob, 'results.json');
    }
  }, [download]);

  // DEV: prints when params is change
  useEffect(() => {
    console.log(params);
  }, [params]);

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

      <Box display="flex" justifyContent="center" alignItems="center">
        <Box flexGrow={0}>
          <FormControl className={classes.formControl}>
            <InputLabel>Resource</InputLabel>
            <Select
              defaultValue="DiagnosticReport"
              onChange={(event) => {
                clearParamField();
                resetParams();
                getResources(event.target.value, 1, rowsPerPage, {}, {});
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
        </Box>
        <Box></Box>

        <Box className={classes.formControl} flexGrow={1} alignContent="center">
          <TextField
            className={classes.flexCenter}
            inputRef={paramRef} // inputRef != ref...
            label="Search Value"
            onChange={(event) => {
              setParamValue(event.target.value);
            }}
          />
        </Box>

        <Box className={classes.formControl} flexGrow={0}>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddClicked}
          >
            Add Filter
          </Button>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            startIcon={<RotateLeftIcon />}
            onClick={onResetClicked}
          >
            Reset Filters
          </Button>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={onApplyClicked}
          >
            Apply Filter
          </Button>
        </Box>
      </Box>

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
      <div className={classes.flexCenter}>
        {!bundle && !loading ? <Alert severity="info">No entires matching filters</Alert> : null}
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
