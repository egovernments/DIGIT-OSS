# Local Setup

To setup the Report service in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [X] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [X] Kafka
  - [ ] Consumer
  - [X] Producer

## Running Locally

To run report service locally, you need to port forward mdms and encryption services locally

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt egov-mdms-service) 8087:8080
kubectl port-forward -n egov $(kgpt egov-enc-service) 8088:8080
```

Update below listed properties in `application.properties` prior to running the project:

```
# path to `reportFileLocationsv1.txt` file from local https://github.com/egovernments/configs/tree/master/reports repo
report.locationsfile.path=
```
