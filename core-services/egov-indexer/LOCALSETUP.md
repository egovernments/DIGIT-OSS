# Local Setup

To setup the Indexer service in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [X] Postgres DB
- [ ] Redis
- [X] Elasticsearch
- [X] Kafka
  - [X] Consumer
  - [X] Producer

## Running Locally

To run the indexer service locally, you need to port forward mdms services locally

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt egov-mdms-service) 8087:8080
```

Update below listed properties in `application.properties` prior to running the project:

```
# Host for MDMS, this can be used withour portforward as well
egov.mdms.host=http://127.0.0.1:8087

#folder or file path to config files. For multiple use `,` separated one
egov.indexer.yml.repo.path=
```
