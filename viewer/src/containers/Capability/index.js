/**
 *
 * Capability
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { selectMetadata, selectCapabilityDomain, selectSmartContext } from './selectors';
import reducer from './reducer';
import saga from './saga';
import SEO from '../../components/SEO';

export function Capability(props) {
  const { metadata } = props;
  useInjectReducer({ key: 'capability', reducer });
  useInjectSaga({ key: 'capability', saga });

  return (
    <div>
      <SEO>
        <title>Capability Statement</title>
        <meta name="description" content="Capability Statement" />
      </SEO>
      <h1>Capability Statement</h1>
      <pre>
        <code>{JSON.stringify(metadata, null, 2)}</code>
      </pre>
    </div>
  );
}

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

Capability.propTypes = {
  metadata: PropTypes.shape({}).isRequired,
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Capability);
