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
} from '@material-ui/core';
import { compose } from 'redux';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';

import { selectBundle, selectLoading } from './selectors';
import reducer from './reducer';
import saga from './saga';
import mappings from './mappings';
import { GET_BUNDLE } from './constants';
import PaginatedTable from '../../components/PaginatedTable';

const useStyles = makeStyles((theme) => ({
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
}));

const getColumnsAndRenderers = (resource) => {
  return mappings[resource];
};

export function Search(props) {
  const { getResources, bundle, loading } = props;
  useInjectReducer({ key: 'search', reducer });
  useInjectSaga({ key: 'search', saga });

  const [open, setOpen] = useState(false);
  const [viewingEntry, setViewingEntry] = useState();
  const [selectedResource, setSelectedResource] = useState('DiagnosticReport');
  const [page, setPage] = useState(0);

  const classes = useStyles();

  const onChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    getResources(selectedResource, page + 1);
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
            getResources(event.target.value, 0);
            setSelectedResource(event.target.value);
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
            page={page}
            onView={(event, item) => {
              setViewingEntry(item);
              setOpen(true);
            }}
            onChangePage={onChangePage}
            itemKey={itemKey}
          />
          {viewingEntry ? (
            <Modal open={open}>
              <Container
                style={{ padding: '1rem', marginTop: '2rem' }}
                component={Paper}
                maxWidth="md"
              >
                <Typography variant="h6">{`Viewing ${viewingEntry.resourceType} - ${viewingEntry.id}`}</Typography>
                <pre>
                  <code>{JSON.stringify(viewingEntry, null, 2)}</code>
                </pre>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </Container>
            </Modal>
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
  bundle: PropTypes.shape({
    entry: PropTypes.array.isRequired,
    total: PropTypes.number,
  }),
};

Search.defaultProps = {
  bundle: undefined,
  loading: true,
};

const mapStateToProps = (state) => {
  return { bundle: selectBundle(state), loading: selectLoading(state) };
};

function mapDispatchToProps(dispatch) {
  return {
    getResources: (resourceType, page) => {
      dispatch({ type: GET_BUNDLE, page, resourceType });
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Search);
