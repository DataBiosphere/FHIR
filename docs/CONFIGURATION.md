# Configuring the Broad FHIR server

This project utilizes [dotenv](https://www.npmjs.com/package/dotenv) to manage
environment variables. The following environment variables should be defined in `.env` files inside each microservice:

## Microservices

### FHIR

Project directory `fhir`.

| name     | required | default value | description             |
| -------- | -------- | ------------- | ----------------------- |
| PORT     | no       | 3000          |
| TCGA_URL | yes      |               |
| URL      | yes      |               | . Used for FHIR Bundles |

### TCGA

Project directory `tcga`.

| name                           | required | default value | description                                                                                    |
| ------------------------------ | -------- | ------------- | ---------------------------------------------------------------------------------------------- |
| PORT                           | no       | 3001          |
| GOOGLE_APPLICATION_CREDENTIALS | yes      |               | A path to the GCP creds file. See https://cloud.google.com/docs/authentication/getting-started |
| PROJECT_ID                     | yes      |               | The GCP Service account name of the GCP creds file                                             |

## Up Next

- [Deploying to Kubernetes](./DEPLOYMENT.md)
