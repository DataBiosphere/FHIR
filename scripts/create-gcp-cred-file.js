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
require('dotenv').config();
const fs = require('fs');

const {
  TYPE,
  PROJECT_ID,
  PRIVATE_KEY_ID,
  PRIVATE_KEY,
  CLIENT_EMAIL,
  CLIENT_ID,
  AUTH_URI,
  TOKEN_URI,
  AUTH_PROVIDER_X509_CERT_URL,
  CLIENT_X509_CERT_URL,
} = process.env;
