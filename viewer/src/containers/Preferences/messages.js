/*
 * FeaturePage Messages
 *
 * This contains all the text for the FeaturePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.PreferencesPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Preferences',
  },
  scaffoldingHeader: {
    id: `${scope}.scaffolding.header`,
    defaultMessage:
      'Preferences page placeholder -- Because every application needs some customization',
  },
});
