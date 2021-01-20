# Secret management

This repository takes advantage of several secrets in Github. Make sure the
following are defined in the repository secure secrets manager:

```
ANVIL_CLIENT_ID
ANVIL_CLIENT_SECRET
ANVIL_QUOTA_PROJECT_ID
ANVIL_REFRESH_TOKEN
ANVIL_TYPE

AUTH_PROVIDER_X509_CERT_URL
AUTH_URI
CLIENT_EMAIL
CLIENT_ID
CLIENT_X509_CERT_URL
GCR_KEY
PRIVATE_KEY
PRIVATE_KEY_ID
PROJECT_ID
TOKEN_URI
TYPE
```

Most of these can be found from generating a GCP Credentials file. Read more about setting these here:

- https://cloud.google.com/docs/authentication/getting-started
- http://acaird.github.io/computers/2020/02/11/github-google-container-cloud-run

## Up Next

- [Home](./INDEX.md)
