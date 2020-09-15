# Local Setup

To setup the egov-location service in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [x] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [ ] Kafka
  - [ ] Consumer
  - [ ] Producer

## Running Locally

To run the egov-location services locally, you need to port forward below services locally

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt egov-mdms-service) 8088:8080
``` 

Update below listed properties in `application.properties` before running the project:

```ini
# {mdms hostname}
egov.services.egov_mdms.hostname=http://127.0.0.1:8088

# {mdms module which contain boundary master}
egov.service.egov.mdms.moduleName = 

# {mdms master file which contain boundary details}
egov.service.egov.mdms.masterName = 
```
