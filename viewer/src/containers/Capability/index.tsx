/**
 *
 * Capability
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { Typography } from '@material-ui/core';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { selectMetadata, selectCapabilityDomain, selectSmartContext } from './selectors';
import reducer from './reducer';
import saga from './saga';
import SEO from '../../components/SEO';

interface CapabilityType {
  metadata: fhir.CapabilityStatement; // PropTypes.shape({})
}

export function Capability(props: any) {
  const { metadata } = props;
  useInjectReducer({ key: 'capability', reducer });
  useInjectSaga({ key: 'capability', saga });

  return (
    <div>
      <SEO>
        <title>Capability Statement</title>
        <meta name="description" content="Capability Statement" />
      </SEO>
      <Typography variant="h1">Capability Statement</Typography>
      <pre>
        <code>{JSON.stringify(metadata, null, 2)}</code>
      </pre>
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  capability: selectCapabilityDomain(state),
  metadata: selectMetadata(state),
  smart: selectSmartContext(state),
});

function mapDispatchToProps(dispatch: any) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Capability);
