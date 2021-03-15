# Kubernetes Deployment Scripts

<p align="center">
  <a href="https://github.com/DataBiosphere/FHIR/workflows/FHIR%20-%20Tests/badge.svg" alt="FHIR - Tests">
    <img src="https://github.com/DataBiosphere/FHIR/workflows/FHIR%20-%20Tests/badge.svg" /></a>
  <a href="https://github.com/DataBiosphere/FHIR/workflows/TCGA%20-%20Tests/badge.svg" alt="TCGA - Tests">
    <img src="https://github.com/DataBiosphere/FHIR/workflows/TCGA%20-%20Tests/badge.svg" /></a>
  <a href="https://github.com/DataBiosphere/FHIR/workflows/ANVIL%20-%20Tests/badge.svg" alt="ANVIL - Tests">
    <img src="https://github.com/DataBiosphere/FHIR/workflows/ANVIL%20-%20Tests/badge.svg" /></a>
</p>

These are the deployment scripts for the adapters and the FHIR server.

Note: This is just a quick reference guide to deployment to the Broad FHIR server. [For more details on custom deployment read the Deployment documentation](../docs/DEPLOYMENT.md)

## Getting started

Configure `kubectl` with gcloud.

```
gcloud container clusters get-credentials broad-fhir-cluster --region=us-east1-b
```

Update the commit hashes for each of the following files:

- **anvil-deployment.yml**
- **fhir-deployment.yml**
- **tcga-deployment.yml**

Wait for (GitHub Actions)[gcloud container clusters get-credentials broad-fhir-cluster --region=us-east1-b] to finish uploading the containers.

Deploy the containers to GCP.

```
kubectl apply -f fhir-deployment.yml && kubectl rollout status deployment/broad-fhir-deployment
kubectl apply -f anvil-deployment.yml && kubectl rollout status deployment/broad-anvil-deployment
kubectl apply -f tcga-deployment.yml && kubectl rollout status deployment/broad-tcga-deployment
```
