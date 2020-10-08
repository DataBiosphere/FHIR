# Configuring the Broad FHIR server

This project utilizes [dotenv](https://www.npmjs.com/package/dotenv) to manage
environment variables. The following environment variables should be defined:

| name                                | required | default value | description                                  |
| ----------------------------------- | -------- | ------------- | -------------------------------------------- |
| PROJECT_ID                          | yes      | -             | GCP Project ID                               |
| CLUSTER_ZONE                        | yes      | -             | GCP Cluster Zone                             |
| CLUSTER_NAME                        | yes      | -             | GCP Cluster Name                             |
| GOOGLE_APPLICATION_CREDENTIALS      | yes      | -             | Path to GCP service account credentials file |
| BIGQUERY_TABLE_NAME=TEST_TABLE_NAME | yes      | -             | The underlying BigQuery table to query       |
| PORT                                | no       | 3000          |                                              |
| HOST_NAME                           | no       | localhost     |                                              |

## Up Next 👉

- [Deploying to Kubernetes](./DEPLOYMENT.md)
