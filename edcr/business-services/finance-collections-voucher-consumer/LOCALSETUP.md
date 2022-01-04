# Local Setup

To setup the finance-collections-voucher-consumer service in your local system, clone the [Business services repository](https://github.com/egovernments/business-services).

## Dependencies


### Infra Dependency

- [X] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [X] Kafka
  - [X] Consumer
  - [ ] Producer

## Running Locally

To run the finance-collections-voucher-consumer service locally, you need to port forward below services.

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt egov-mdms-service) 8081:8080
kubectl port-forward -n egov $(kgpt egov-user) 8082:8080
kubectl port-forward -n egov $(kgpt egov-instrument) 8083:8080
kubectl port-forward -n egov $(kgpt collection-service) 8084:8080
kubectl port-forward -n egov $(kgpt egf-master) 8085:8080
``` 

Update below listed properties in `application.properties` before running the project:

```ini
# {egov-user service hostname}
egov.services.egov.user.host = http://127.0.0.1:8082

# {egov-mdms-service service hostname}
egov.services.mdms.hostname = http://127.0.0.1:8081

# {egf-instrument service hostname}
egov.services.egfinstrument.hostname = http://127.0.0.1:8083

# {collection-service service hostname}
egov.services.collections.hostname = http://127.0.0.1:8084

# {egf-master service hostname}
egov.services.egfmaster.hostname = http://127.0.0.1:8085
```
