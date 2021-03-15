# Broad FHIR Server

<p align="center">
  <a href="https://github.com/DataBiosphere/FHIR/workflows/FHIR%20-%20Tests/badge.svg" alt="FHIR - Tests">
    <img src="https://github.com/DataBiosphere/FHIR/workflows/FHIR%20-%20Tests/badge.svg" /></a>
</p>

This is the core of the FHIR server

## Getting started

This does nothing on it's own, but combined with adapters the FHIR server will serve the resources from the adapters

## API Routes

- **/4_0_0/ResearchStudy**
- **/4_0_0/Observation**
- **/4_0_0/Specimen**
- **/4_0_0/DiagnosticReport**
- **/4_0_0/Patient**

## Params

You can view our full parameter support off our Capability Statement using the metadata api endpoint:
**/4_0_0/metadata/**

| key      | value  | support | description                                        |
| -------- | ------ | ------- | -------------------------------------------------- |
| \_id     | string | full    | The internal identifier for the requested resource |
| \_page   | number | full    | The page number                                    |
| \_count  | number | full    | The number of resources per page                   |
| \_source | string | partial | The data bucket you want to filter from            |

## [If you are having trouble, remember to configure the application correctly.](../docs/CONFIGURATION.md)
