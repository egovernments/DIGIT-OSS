# Local Setup

To setup the egov-pg-serivce in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [X] Postgres DB
- [ ] Redis
- [X] Elastic search
- [X] Kafka
  - [ ] Consumer
  - [X] Producer

## Running Locally

To run the egov-pg-serivce locally, you need to port forward below services in your local system

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt egov-idgen) 8084:8080 &
kubectl port-forward -n egov $(kgpt collection-services) 8085:8080 &
kubectl port-forward -n egov $(kgpt egf-master) 8086:8080
```

To run the egov-pg-serivce locally, update below listed properties in `application.properties` prior to running the project:

```ini
egov.idgen.host = http://localhost:8084
egov.collectionservice.host = http://localhost:8085
egov.bankaccountservice.host = http://localhost:8086
```
