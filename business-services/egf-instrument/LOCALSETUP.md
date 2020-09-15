# Local Setup

To setup the egf-instrument service in your local system, clone the [Business services repository](https://github.com/egovernments/business-services).

## Dependencies


### Infra Dependency

- [X] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [X] Kafka
  - [X] Consumer
  - [X] Producer

## Running Locally

To run the egf-instrument service locally, you need to port forward below services.

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt egf-master) 8081:8080
``` 

Update below listed properties in `application.properties` before running the project:

```ini
egov.services.egfmaster.hostname = http://127.0.0.1:8081
```
