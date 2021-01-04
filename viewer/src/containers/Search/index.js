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
  Modal,
  makeStyles,
  Container,
  Paper,
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

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';

import { selectBundle, selectLoading, selectSelectedResource, selectPage } from './selectors';
import reducer from './reducer';
import saga from './saga';
import mappings from './mappings';
import { GET_BUNDLE } from './constants';
import PaginatedTable from '../../components/PaginatedTable';

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

    viewingEntry: {
      color: theme.palette.text.primary,
    },
  };
});

const getColumnsAndRenderers = (resource) => {
  return mappings[resource];
};

export function Search(props) {
  const { getResources, bundle, loading, selectedResource, page } = props;
  useInjectReducer({ key: 'search', reducer });
  useInjectSaga({ key: 'search', saga });

  const [open, setOpen] = useState(false);
  const [viewingEntry, setviewingEntry] = useState();

  const classes = useStyles();

  const onChangePage = (event, newPage) => {
    getResources(selectedResource, newPage + 1);
  };

  const closeViewingEntry = () => setOpen(false);

  useEffect(() => {
    getResources(selectedResource, page);
  }, []);

  const itemKey = 'id';

  const { columns, renderers } = getColumnsAndRenderers(selectedResource);

  return (
    <div>
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
            getResources(event.target.value, 1);
          }}
        >
          <MenuItem value="DiagnosticReport">DiagnosticReport</MenuItem>
          <MenuItem value="Observation">Observation</MenuItem>
        </Select>
      </FormControl>
      {bundle && !loading ? (
        <div className={classes.table}>
          <PaginatedTable
            rows={bundle.entry.map(({ resource }) => resource)}
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
          />
          {viewingEntry ? (
            <Dialog open={open} onClose={closeViewingEntry} maxWidth="md">
              <DialogTitle>
                {`Viewing ${viewingEntry.resourceType} - ${viewingEntry.id}`}
              </DialogTitle>
              <DialogContent>
                <DialogContentText className={classes.viewingEntry}>
                  <pre>
                    <code>{JSON.stringify(viewingEntry, null, 2)}</code>
                  </pre>
                </DialogContentText>
              </DialogContent>
              <Button onClick={closeViewingEntry}>Close</Button>
            </Dialog>
          ) : null}
        </div>
      ) : null}
      {loading ? (
        <div className={classes.loadingIcon}>
          <CircularProgress size={80} />
        </div>
      ) : null}
    </div>
  );
}

Search.propTypes = {
  getResources: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  selectedResource: PropTypes.string,
  page: PropTypes.string,
  bundle: PropTypes.shape({
    entry: PropTypes.array.isRequired,
    total: PropTypes.number,
  }),
};

Search.defaultProps = {
  bundle: undefined,
  loading: true,
  page: 1,
  selectedResource: 'DiagnosticReport',
};

const mapStateToProps = (state) => {
  return {
    bundle: selectBundle(state),
    loading: selectLoading(state),
    selectedResource: selectSelectedResource(state),
    page: selectPage(state),
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getResources: (resourceType, page) => {
      dispatch({ type: GET_BUNDLE, page, resourceType });
    },

    setViewingEntry: () => {},
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Search);
