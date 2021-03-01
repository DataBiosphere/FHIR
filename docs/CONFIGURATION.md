# Configuring the Broad FHIR server

This project utilizes [dotenv](https://www.npmjs.com/package/dotenv) to manage environment variables.
We have included some example files named `.env.test` to get you started.
The following environment variables should be defined in `.env` files inside each microservice:

## Microservices

### FHIR

Project directory `fhir`.

| name     | required | default value | description                       | example                      |
| -------- | -------- | ------------- | --------------------------------- | ---------------------------- |
| PORT     | no       | 3000          |                                   |                              |
| TCGA_URL | yes      |               | Where the TCGA Microservice lives | http://tcga:3001             |
| URL      | yes      |               | Used for FHIR Bundles             | http://localhost:3001/4_0_0/ |

### ANVIL

Project directory `anvil`

| name                           | required | default value | description                                                                                    | example                           |
| ------------------------------ | -------- | ------------- | ---------------------------------------------------------------------------------------------- | --------------------------------- |
| GOOGLE_APPLICATION_CREDENTIALS | yes      |               | A path to the GCP creds file. See https://cloud.google.com/docs/authentication/getting-started | ./creds.json                      |
| GOOGLE_PROJECT                 | yes      |               | The GCP Service account name of the GCP creds file                                             | your-project-id                   |
| AVRO_PATH                      | yes      |               | The path to the PFB with the exported AnVIL data                                               | ./export_2020-11-04T17_48_47.avro |

### TCGA

Project directory `tcga`.

| name                           | required | default value | description                                                                                    | example         |
| ------------------------------ | -------- | ------------- | ---------------------------------------------------------------------------------------------- | --------------- |
| PORT                           | no       | 3001          |                                                                                                |                 |
| GOOGLE_APPLICATION_CREDENTIALS | yes      |               | A path to the GCP creds file. See https://cloud.google.com/docs/authentication/getting-started | ./creds.json    |
| PROJECT_ID                     | yes      |               | The GCP Service account name of the GCP creds file                                             | your-project-id |

### Viewer

Project directory `viewer`.

| name                    | required | description                                 | example                          |
| ----------------------- | -------- | ------------------------------------------- | -------------------------------- |
| REACT_APP_CLIENT_ID     | yes      |                                             |                                  |
| REACT_APP_SCOPE         | yes      | The scope type as defined by your OAuth     | openid profile                   |
| REACT_APP_ISS           | yes      | The server's ISS                            | htttps://fhir.website.com/4_0_0/ |
| REACT_APP_REDIRECT_URI  | yes      | The landing page after a successful sign-in | http://website.com               |
| REACT_APP_CLIENT_SECRET | yes      |                                             |                                  |

## Up Next

- [Deploying to Kubernetes](./DEPLOYMENT.md)
