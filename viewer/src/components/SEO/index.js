import React from 'react';
import { Helmet } from 'react-helmet';

function SEO({ children }) {
  return (
    <Helmet titleTemplate="%s | Broad FHIR Viewer" defaultTitle="Broad FHIR Viewer">
      <html lang="en" />
      {children}
    </Helmet>
  );
}

export default SEO;
