/**
 * In order to authenticate with GCP BigQuery, you must set a special environment variable called
 * GOOGLE_APPLICATION_CREDENTIALS with the value being a path to a "credentials" JSON file. This makes it problematic
 * to authenticate with BigQuery if your application is configured through environment variables and not the filesystem.
 * In order to work around this, we can create the credentials file from environment variables prior to building the container image.
 *
 * See more at https://github.com/googleapis/google-api-go-client/issues/185
 *             https://cloud.google.com/bigquery/docs/authentication/service-account-file
 *
 */
const fs = require('fs');

const ANVIL_CRED_FILENAME = 'creds.json';

const { CLIENT_ID, CLIENT_SECRET, QUOTA_PROJECT_ID, REFRESH_TOKEN, TYPE } = process.env;

fs.writeFileSync(
  ANVIL_CRED_FILENAME,
  JSON.stringify({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    quota_project_id: QUOTA_PROJECT_ID,
    refresh_token: REFRESH_TOKEN,
    type: TYPE,
  })
);
