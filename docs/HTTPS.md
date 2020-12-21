# Deploying Broad FHIR to GKE with HTTPS

1. Reserve your static IP

```
gcloud compute addresses create broad-fhir --global
```

2. Describe your static IP

```
gcloud compute addresses describe broad-fhir --global
35.227.252.90
```

3. Create your ManagedCert

```
kubectl apply -f kube/managed-certificate.yml
```

4. Create your Ingress

```
kubectl apply -f kube/ingress.yml
```
