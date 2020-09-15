# Deploying to GCP Kubernetes Engine

Source: https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app

## Enable the Container Registry API for your Project

```
https://cloud.google.com/container-registry/docs/quickstart
```

## Get Authorized

```
gcloud auth login
gcloud auth configure-docker
```

## Create Cluster

```
gcloud config set project ${PROJECT_ID} # node-test-288119
gcloud config set compute/zone us-central-1 # Or other compute zone
gcloud container clusters create my-cluster # Will take a minute to spin up
gcloud compute instances list
```

## Build this image

```
docker build . -t gcr.io/${PROJECT_ID}/broad-fhir
```

ex: `docker build . -t gcr.io/node-test-288119/broad/fhir`

3. Push to GCP Container Registry

```
docker push gcr.io/${PROJECT_ID}/asymmetrik/broad-fhir
```

ex: `docker push gcr.io/node-test-288119/broad/fhir`

## Create deployment

```
kubectl create deployment my-deployment --image=gcr.io/node-test-288119/broad/fhir
kubectl autoscale deployment my-deployment --cpu-percent=80 --min=1 --max=5
```

## Up Next 👉

- [Home](./INDEX.md)
