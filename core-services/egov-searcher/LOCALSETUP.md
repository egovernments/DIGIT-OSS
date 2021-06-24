# Local Setup

This document will walk you through the dependencies of eGov-Searcher and how to set it up locally

## Dependencies

### Infra Dependency

- [X] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [ ] Kafka
  - [ ] Consumer
  - [ ] Producer

## Running Locally

To run this services locally, you need to port forward below services locally

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt egov-user) 8088:8080
``` 

Update below listed properties in `application.properties` before running the project:

```ini
#The github link for the file containing searcher query has to be provided here
#if you are using a local file prefix it with file:///PATH TO FILE/FILENAME
search.yaml.path=
egov.user.contextpath=http://127.0.0.1:8088
```
