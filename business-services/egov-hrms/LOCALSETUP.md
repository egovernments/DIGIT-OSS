# Local Setup

To setup the egov-hrms service in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [x] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [x] Kafka
  - [ ] Consumer
  - [x] Producer

## Running Locally

To run the egov-hrms services in local system, you need to port forward below services.

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt egov-idgen) 8087:8080 &
kubectl port-forward -n egov $(kgpt egov-mdms-service) 8088:8080 &
kubectl port-forward -n egov $(kgpt egov-user) 8089:8080 &
kubectl port-forward -n egov $(kgpt egov-filestore) 8090:8080 &
kubectl port-forward -n egov $(kgpt egov-localization) 8091:8080 &
``` 

Update below listed properties in `application.properties` before running the project:

```ini
# {Id Gen service hostname}
egov.idgen.host = http://127.0.0.1:8087

# {mdms hostname}
egov.mdms.host=http://127.0.0.1:8088

# {user service hostname}
egov.user.host = http://127.0.0.1:8089

# {Filestore service hostname}
egov.filestore.host = http://127.0.0.1:8090

# {Localization service hostname}
egov.localization.host = http://127.0.0.1:8091
```
