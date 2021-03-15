# TCGA Broad FHIR Adapter

<p align="center">
  <a href="https://github.com/DataBiosphere/FHIR/workflows/TCGA%20-%20Tests/badge.svg" alt="TCGA - Tests">
    <img src="https://github.com/DataBiosphere/FHIR/workflows/TCGA%20-%20Tests/badge.svg" /></a>
</p>

This micro-service is an API used by Broad FHIR in order to power FHIR Applications

## Getting started

Run this in conjunction with Broad FHIR by following the [Getting Started Guide of the project README](../README.md)

### Or run this standalone

```
npm i
npm run dev
```

## API Routes

To limit results to only this adapter, please use the `_source=https://portal.gdc.cancer.gov/` in your FHIR search

- **/api/diagnosticreport**
- **/api/diagnosticreport/:id**
- **/api/observation**
- **/api/observation/:id**
- **/api/specimen**
- **/api/specimen/:id**
- **/api/researchstudy**
- **/api/researchstudy/:id**
- **/api/patient**
- **/api/patient/:id**

## [If you are having trouble, remember to configure the application correctly.](../docs/CONFIGURATION.md)
