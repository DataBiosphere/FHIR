/*
 * FeaturePage
 *
 * List all the features
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import H1 from '../../components/H1';
import messages from './messages';

export default function PreferencesPage() {
  return (
    <div>
      <Helmet>
        <title>Preferences</title>
        <meta name="description" content="Preferences page of React.js Boilerplate application" />
      </Helmet>
      <H1>
        <FormattedMessage {...messages.header} />
      </H1>
      <FormattedMessage {...messages.scaffoldingHeader} />
    </div>
  );
}
