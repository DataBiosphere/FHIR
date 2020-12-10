import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

function SEO({ children }) {
  return (
    <Helmet titleTemplate="%s | Broad FHIR Viewer" defaultTitle="Broad FHIR Viewer">
      <html lang="en" />
      {children}
    </Helmet>
  );
}

SEO.propTypes = {
  children: PropTypes.node,
};

SEO.defaultProps = {
  children: undefined,
};

export default SEO;
