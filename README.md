# 🔥 Broad FHIR

![FHIR - Tests](https://github.com/DataBiosphere/FHIR/workflows/FHIR%20-%20Tests/badge.svg)
![TCGA - Tests](https://github.com/DataBiosphere/FHIR/workflows/TCGA%20-%20Tests/badge.svg)

> FHIR is an interoperability standard intended to facilitate the exchange of healthcare information between healthcare providers, patients, caregivers, payers, researchers, and any one else involved in the healthcare ecosystem. It consists of 2 main parts – a content model in the form of ‘resources’, and a specification for the exchange of these resources in the form of real-time RESTful interfaces as well as messaging and Documents.

## Getting started

Clone.

```
git clone https://github.com/DataBiosphere/FHIR-Implementation
```

Install.

```
npm i
```

Run the tests.

```
npm run test
```

Create configuration, and specify your values. See [Configuration](./docs/CONFIGURATION.md)

```
touch fhir/.env
touch tcga/.env
```

Run Docker Compose.

```
docker-compose up
```

## Documentation

Read our docs pages for information on deployment, tech stack, design decisions, and more.

[Docs](./docs/INDEX.md)
