# Deploying to GCP Kubernetes Engine

> These commands pull identifiers from the environment. If you want to run these commands verbatim, create a .env file with the variables PROJECT_ID, CLUSTER_ZONE, and CLUSTER_NAME defined, then run `export $(grep -v '^#' .env | xargs)` before beginning

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
gcloud config set project ${PROJECT_ID}
gcloud config set compute/zone ${CLUSTER_ZONE}
gcloud beta container --project "${PROJECT_ID}" clusters create "${CLUSTER_NAME}" --zone "${CLUSTER_ZONE}" --no-enable-basic-auth --cluster-version "1.15.12-gke.20" --machine-type "e2-medium" --image-type "COS" --disk-type "pd-standard" --disk-size "100" --metadata disable-legacy-endpoints=true --scopes "https://www.googleapis.com/auth/devstorage.read_only","https://www.googleapis.com/auth/logging.write","https://www.googleapis.com/auth/monitoring","https://www.googleapis.com/auth/servicecontrol","https://www.googleapis.com/auth/service.management.readonly","https://www.googleapis.com/auth/trace.append" --num-nodes "3" --enable-stackdriver-kubernetes --enable-ip-alias --network "projects/broad-fhir-dev/global/networks/default" --subnetwork "projects/broad-fhir-dev/regions/${CLUSTER_ZONE}/subnetworks/default" --default-max-pods-per-node "110" --no-enable-master-authorized-networks --addons HorizontalPodAutoscaling,HttpLoadBalancing --enable-autoupgrade --enable-autorepair --max-surge-upgrade 1 --max-unavailable-upgrade 0
gcloud compute instances list
```

## Build this image

```
docker build . -t gcr.io/${PROJECT_ID}/broad/fhir:$(git log -1 --format=%h)
```

ex: `docker build . -t gcr.io/project-288119/fhir`

## Push to GCP Container Registry

```
docker push gcr.io/${PROJECT_ID}/broad/fhir:$(git log -1 --format=%h)
```

ex: `docker push gcr.io/project-288119/broad/fhir`

## Create deployment

```
kubectl create deployment fhir --image=gcr.io/${PROJECT_ID}/broad/fhir:$(git log -1 --format=%h)
kubectl autoscale deployment fhir --cpu-percent=80 --min=1 --max=5
```

## Deploying a new image

```
kubectl set image deployments/fhir gcr.io/${PROJECT_ID}/broad/fhir:$(git log -1 --format=%h)
```

## Common issues

- Kubectl times out!

Reconfigure kubectl with gcloud

```
gcloud container clusters get-credentials ${CLUSTER_NAME} --zone=${CLUSER_ZONE}
```

## Up Next

- [Home](./INDEX.md)
