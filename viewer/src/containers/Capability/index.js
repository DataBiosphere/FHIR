/**
 *
 * Capability
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { selectMetadata, selectCapabilityDomain, selectSmartContext } from './selectors';
import reducer from './reducer';
import saga from './saga';

export function Capability(props) {
  useInjectReducer({ key: 'capability', reducer });
  useInjectSaga({ key: 'capability', saga });

  return (
    <div>
      <Helmet>
        <title>Capability Statement</title>
        <meta name="description" content="Description of Capability" />
      </Helmet>
      <h1>Capability Statement</h1>
      <pre>
        <code>{JSON.stringify(props.metadata, null, 2)}</code>
      </pre>
    </div>
  );
}

Capability.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  capability: selectCapabilityDomain(state),
  metadata: selectMetadata(state),
  smart: selectSmartContext(state),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Capability);
