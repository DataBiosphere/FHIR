/**
 *
 * Search
 *
 */

import React, { useEffect, useState } from 'react';
import Lorem from 'react-lorem-component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Typography, Chip, Button, Modal, makeStyles, Container } from '@material-ui/core';
import { compose } from 'redux';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';

import { selectBundle } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { GET_BUNDLE } from './constants';
import PaginatedTable from '../../components/PaginatedTable';

const useStyles = makeStyles(() => ({
  table: {
    marginTop: '1rem',
  },
}));

export function Search(props) {
  const { dispatch, getResources, bundle } = props;
  useInjectReducer({ key: 'search', reducer });
  useInjectSaga({ key: 'search', saga });

  const [open, setOpen] = useState();
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
          <ul>
            <li>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>{result.display}</span>
                <Chip label={result.reference} />
              </div>
            </li>
          </ul>
        ));
      },
    ],
  ];

  return (
    <div>
      <Helmet>
        <title>Search</title>
        <meta name="description" content="Description of Search" />
      </Helmet>
      <Typography variant="h1">Search</Typography>
      <Typography variant="h2">DiagnosticReport</Typography>
      {bundle ? (
        <div className={classes.table}>
          <PaginatedTable
            rows={bundle.entry.map(({ resource }) => resource)}
            renderers={renderer}
            columns={columns}
            count={bundle.total}
            page={page}
            onView={() => setOpen(open)}
            onChangePage={onChangePage}
          />
          <Modal open={open}>
            <Container>
              <Lorem />
              <Button onClick={() => setOpen(false)}>Close</Button>
            </Container>
          </Modal>
        </div>
      ) : null}
      <h2>Raw Bundle</h2>
      <pre>
        <code>{JSON.stringify(bundle, null, 2)}</code>
      </pre>
    </div>
  );
}

Search.propTypes = {
  dispatch: PropTypes.func.isRequired,
  getResources: PropTypes.func.isRequired,
  bundle: PropTypes.shape({
    entry: PropTypes.any,
    total: PropTypes.any,
  }),
};

Search.defaultProps = {
  bundle: undefined,
};

const mapStateToProps = (state) => {
  return { bundle: selectBundle(state) };
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
