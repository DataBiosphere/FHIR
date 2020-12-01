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
        <meta name="description" content="Capability Statement" />
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
