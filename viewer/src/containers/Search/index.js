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
  Chip,
  Button,
  Modal,
  makeStyles,
  Container,
  TableCell,
  Paper,
  CircularProgress,
} from '@material-ui/core';
import { compose } from 'redux';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';

import { selectBundle, selectLoading } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { GET_BUNDLE } from './constants';
import PaginatedTable from '../../components/PaginatedTable';

const useStyles = makeStyles(() => ({
  table: {
    marginTop: '1rem',
  },
  loadingIcon: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
    marginTop: '1rem',
  },
}));

export function Search(props) {
  const { dispatch, getResources, bundle, loading } = props;
  console.log(loading);
  console.log(loading);
  console.log(loading);
  console.log(loading);
  console.log(loading);
  useInjectReducer({ key: 'search', reducer });
  useInjectSaga({ key: 'search', saga });

  const [open, setOpen] = useState(false);
  const [viewingEntry, setViewingEntry] = useState();
  const [page, setPage] = useState(0);

  const classes = useStyles();

  const onChangePage = (event, newPage) => {
    setPage(newPage);
    getResources(newPage + 1);
  };

  useEffect(() => {
    // TODO replace me with an action creator
    dispatch({ type: GET_BUNDLE, page });
  }, []);

  const columns = ['Case ID', 'Subject', 'Study', 'Results'];
  const renderer = [
    'id',
    'subject.reference',
    'extension[0].valueReference.reference',
    [
      'result',
      (results) => {
        return results.map((result) => (
          <TableCell
            key={`${result.display}${result.reference}`}
            style={{ display: 'flex', flexDirection: 'column', padding: '.25rem' }}
          >
            <span>{result.display}</span>
            <Chip label={result.reference} />
          </TableCell>
        ));
      },
    ],
  ];
  const itemKey = 'id';

  return (
    <div>
      <Helmet>
        <title>Search</title>
        <meta name="description" content="Description of Search" />
      </Helmet>
      <Typography variant="h1">Search</Typography>
      <Typography variant="h2">DiagnosticReport</Typography>
      {bundle && !loading ? (
        <div className={classes.table}>
          <PaginatedTable
            rows={bundle.entry.map(({ resource }) => resource)}
            renderers={renderer}
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
  dispatch: PropTypes.func.isRequired,
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
    dispatch,
    getResources: (page) => {
      dispatch({ type: GET_BUNDLE, page });
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Search);
