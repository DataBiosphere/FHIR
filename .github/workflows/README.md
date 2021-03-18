# GitHub Actions CI/CD

These are the workflows for GitHub Actions automatic deployment to GCP

## Scripts

### Deployment

We utilize Docker containers and Kubernetes to deploy our server onto GCP. This is an automated process. In order to trigger these scripts, make sure that the changes are merged into master and create a `release`

<p align="center">
  <a href="https://github.com/DataBiosphere/FHIR/actions/workflows/publish-to-gke.fhir.yml/badge.svg" alt="FHIR - Deployment">
    <img src="https://github.com/DataBiosphere/FHIR/actions/workflows/publish-to-gke.fhir.yml/badge.svg" /></a>
  <a href="https://github.com/DataBiosphere/FHIR/actions/workflows/publish-to-gke.tcga.yml/badge.svg" alt="TCGA - Deployment">
    <img src="https://github.com/DataBiosphere/FHIR/actions/workflows/publish-to-gke.tcga.yml/badge.svg" /></a>
  <a href="https://github.com/DataBiosphere/FHIR/actions/workflows/publish-to-gke.anvil.yml/badge.svg" alt="ANVIL - Deployment">
    <img src="https://github.com/DataBiosphere/FHIR/actions/workflows/publish-to-gke.anvil.yml/badge.svg" /></a>
  <a href="https://github.com/DataBiosphere/FHIR/actions/workflows/build-and-deploy-to-app-engine.viewer.yml/badge.svg" alt="Viewer - Deployment">
    <img src="https://github.com/DataBiosphere/FHIR/actions/workflows/build-and-deploy-to-app-engine.viewer.yml/badge.svg" /></a>
</p>

### Unit Tests

Testing is extremely important in insuring that the code works as intended. It also makes sure that any future changes do not modify exisiting functionality. On every `push` GitHub will run the testing scripts

<p align="center">
  <a href="https://github.com/DataBiosphere/FHIR/workflows/FHIR%20-%20Tests/badge.svg" alt="FHIR - Tests">
    <img src="https://github.com/DataBiosphere/FHIR/workflows/FHIR%20-%20Tests/badge.svg" /></a>
  <a href="https://github.com/DataBiosphere/FHIR/workflows/TCGA%20-%20Tests/badge.svg" alt="TCGA - Tests">
    <img src="https://github.com/DataBiosphere/FHIR/workflows/TCGA%20-%20Tests/badge.svg" /></a>
  <a href="https://github.com/DataBiosphere/FHIR/workflows/ANVIL%20-%20Tests/badge.svg" alt="ANVIL - Tests">
    <img src="https://github.com/DataBiosphere/FHIR/workflows/ANVIL%20-%20Tests/badge.svg" /></a>
  <a href="https://github.com/DataBiosphere/FHIR/workflows/ANVIL%20-%20Tests/badge.svg" alt="Viewer - Tests">
    <img src="https://github.com/DataBiosphere/FHIR/workflows/Viewer%20-%20Tests/badge.svg" /></a>
</p>

### Obsolete Scripts

There are a few scripts for older versions of the repository that are not used anymore. Feel free to play around with these. They are setup to trigger manually
