import React from 'react';
import { Helmet } from 'react-helmet';

function SEO({ children }: { children?: React.ReactNode }) {
  return (
    <Helmet titleTemplate="%s | Broad FHIR Viewer" defaultTitle="Broad FHIR Viewer">
      <html lang="en" />
      {children}
    </Helmet>
  );
}

SEO.defaultProps = {
  children: undefined,
};

export default SEO;
