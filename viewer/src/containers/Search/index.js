/**
 *
 * Search
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Typography,
  Chip,
} from '@material-ui/core';
import { compose } from 'redux';
import _ from 'lodash';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';

import { selectBundle } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { GET_BUNDLE } from './constants';

export function Search(props) {
  const { dispatch } = props;
  useInjectReducer({ key: 'search', reducer });
  useInjectSaga({ key: 'search', saga });

  useEffect(() => {
    // TODO replace me with an action creator
    dispatch({ type: GET_BUNDLE, page: 1, pageSize: 20 });
  }, []);

  const columns = ['Case ID', 'Subject', 'Study', 'Results'];
  const rows = [
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
      <h1>Search</h1>
      <Typography variant="h5">DiagnosticReport</Typography>
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>
                  <Typography variant="h6">{column}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.bundle?.entry.map((entry) => {
              return (
                <TableRow>
                  {rows.map((row) => {
                    if (Array.isArray(row)) {
                      const [key, renderer] = row;
                      return renderer(_.get(entry.resource, key));
                    } else {
                      return <TableCell>{_.get(entry.resource, row)}</TableCell>;
                    }
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <h2>Raw Bundle</h2>
      <pre>
        <code>{JSON.stringify(props.bundle, null, 2)}</code>
      </pre>
    </div>
  );
}

Search.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return { bundle: selectBundle(state) };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Search);
