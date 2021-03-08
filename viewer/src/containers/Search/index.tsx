/**
 *
 * Search
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  Typography,
  Button,
  makeStyles,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
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
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import mappings from './mappings';
import { DEFAULT_ROWS_PER_PAGE, GET_BUNDLE, GET_DOWNLOAD } from './constants';
import PaginatedTable from '../../components/PaginatedTable';
import ExportButton from '../../components/ExportButton';
import ViewingEntry from '../../components/ViewingEntry';

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
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    inline: {
      margin: theme.spacing(1),
      marginTop: 20,
      display: 'inline-block',
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
    getDownload,
    bundle,
    loading,
    selectedResource,
    page,
    pageLinks,
    download,
    downloadProgress,
  } = props;
  useInjectReducer({ key: 'search', reducer });
  useInjectSaga({ key: 'search', saga });

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [open, setOpen] = useState(false);
  const [viewingEntry, setviewingEntry] = useState<any>();

  const classes = useStyles();

  const onChangePage = (_: any, newPage: number) => {
    getResources(selectedResource, newPage + 1, rowsPerPage, pageLinks);
  };

  const onChangeRowsPerPage = (event: any) => {
    setRowsPerPage(event.target.value);
    getResources(selectedResource, 1, rowsPerPage, {});
  };

  const onExportClicked = () => {
    // TODO: add params for exports
    getDownload(selectedResource, '');
  };

  const closeViewingEntry = () => setOpen(false);

  // runs on inital launch
  useEffect(() => {
    getResources(selectedResource, page, rowsPerPage, pageLinks);
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

  const itemKey = 'id';

  const { columns, renderers } = getColumnsAndRenderers(selectedResource);

  return (
    <>
      <Helmet>
        <title>Search</title>
        <meta name="description" content="Description of Search" />
      </Helmet>
      <Typography variant="h1">Search</Typography>
      <FormControl className={classes.formControl}>
        <InputLabel>Resource</InputLabel>
        <Select
          defaultValue="DiagnosticReport"
          onChange={(event) => {
            getResources(event.target.value, 1, rowsPerPage, {});
          }}
        >
          <MenuItem value="DiagnosticReport">DiagnosticReport</MenuItem>
          <MenuItem value="Observation">Observation</MenuItem>
          <MenuItem value="Specimen">Specimen</MenuItem>
          <MenuItem value="ResearchStudy">ResearchStudy</MenuItem>
        </Select>
      </FormControl>

      <div className={classes.inline}>
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
            onView={(event, item) => {
              setviewingEntry(item);
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

Search.propTypes = {
  getResources: PropTypes.func.isRequired,
  getDownload: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  selectedResource: PropTypes.string,
  page: PropTypes.number,
  pageLinks: PropTypes.any,
  downloadProgress: PropTypes.number,
  bundle: PropTypes.shape({
    entry: PropTypes.array.isRequired,
    total: PropTypes.number,
  }),
  download: PropTypes.string,
};

Search.defaultProps = {
  bundle: undefined,
  download: undefined,
  loading: true,
  page: 1,
  pageLinks: {},
  downloadProgress: 0,
  selectedResource: 'DiagnosticReport',
};

const mapStateToProps = (state: any) => {
  return {
    bundle: selectBundle(state),
    download: selectDownload(state),
    loading: selectLoading(state),
    downloadProgress: selectDownloadProgress(state),
    selectedResource: selectSelectedResource(state),
    page: selectPage(state),
    pageLinks: selectPageLinks(state),
  };
};

function mapDispatchToProps(dispatch: any) {
  return {
    getResources: (resourceType: string, page: number, count: number, pageLinks: any) => {
      dispatch({ type: GET_BUNDLE, resourceType, page, count, pageLinks });
    },

    getDownload: (resourceType: string, params: any) => {
      dispatch({ type: GET_DOWNLOAD, resourceType, params });
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Search);
