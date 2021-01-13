# Configuring the Broad FHIR server

This project utilizes [dotenv](https://www.npmjs.com/package/dotenv) to manage
environment variables. The following environment variables should be defined in `.env` files inside each microservice:

## Microservices

### FHIR

Project directory `fhir`.

| name     | required | default value | description           | example                      |
| -------- | -------- | ------------- | --------------------- | ---------------------------- |
| PORT     | no       | 3000          |                       |                              |
| TCGA_URL | yes      |               | http://tcga:3001      |
| URL      | yes      |               | Used for FHIR Bundles | http://localhost:3001/4_0_0/ |

### TCGA

Project directory `tcga`.

| name                           | required | default value | description                                                                                    | example         |
| ------------------------------ | -------- | ------------- | ---------------------------------------------------------------------------------------------- | --------------- |
| PORT                           | no       | 3001          |                                                                                                |                 |
| GOOGLE_APPLICATION_CREDENTIALS | yes      |               | A path to the GCP creds file. See https://cloud.google.com/docs/authentication/getting-started | ./creds.json    |
| PROJECT_ID                     | yes      |               | The GCP Service account name of the GCP creds file                                             | your-project-id |

### Viewer

Project directory `viewer`.

| name                    | required | description |
| ----------------------- | -------- | ----------- |
| REACT_APP_CLIENT_ID     | yes      |             |
| REACT_APP_SCOPE         | yes      |             |
| REACT_APP_ISS           | yes      |             |
| REACT_APP_REDIRECT_URI  | yes      |             |
| REACT_APP_CLIENT_SECRET | yes      |             |

## Up Next

- [Deploying to Kubernetes](./DEPLOYMENT.md)
