# AnVIL Broad FHIR Adapter

<p align="center">
  <a href="https://github.com/DataBiosphere/FHIR/workflows/ANVIL%20-%20Tests/badge.svg" alt="ANVIL - Tests">
    <img src="https://github.com/DataBiosphere/FHIR/workflows/ANVIL%20-%20Tests/badge.svg" /></a>
</p>

This micro-service is an API used by Broad FHIR in order to power AnVIL Applications

## Getting started

Run this in conjunction with Broad FHIR by following the [Getting Started Guide of the project README](../README.md)

### Or run this standalone

```
npm i
npm run dev
```

## API Routes

To limit results to only this adapter, please use the `_source=https://anvil.terra.bio/` in your FHIR search

- **/researchstudy**
- **/researchstudy/:id**
- **/sample/**
- **/sample/:id**
- **/patient**
- **/patient/:id**
- **/observation**
- **/observation/:id**

## [If you are having trouble, remember to configure the application correctly.](../docs/CONFIGURATION.md)
