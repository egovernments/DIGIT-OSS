# Local Setup

To setup the egov-user-event in your local system, clone the [Muncipal Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [X] Postgres DB
- [ ] Redis
- [X] Elastic search
- [X] Kafka
  - [X] Consumer
  - [X] Producer

## Running Locally

To run the egov-user-event locally, you need to port forward below services locally

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt egov-localisation) 8084:8080 &
kubectl port-forward -n egov $(kgpt egov-mdms-service) 8085:8080
```

To run the th-services locally, update below listed properties in `application.properties` prior to running the project:

```ini
egov.mdms.host = http://localhost:8084
egov.localisation.host = http://localhost:8085
```

