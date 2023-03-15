# Local Setup

To setup the egov-workflow-v2 service in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [x] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [x] Kafka
  - [ ] Consumer
  - [x] Producer

## Running Locally

To run the egov-workflow-v2 services locally, you need to port forward below services locally

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt egov-mdms-service) 8088:8080
kubectl port-forward -n egov $(kgpt egov-user) 8089:8080
``` 

Update below listed properties in `application.properties` before running the project:

```ini
# {mdms hostname}
egov.mdms.host=http://127.0.0.1:8088

#{user service hostname}
egov.user.host=http://127.0.0.1:8089 

# true for state level and false for tenant level
egov.wf.statelevel=

#Boolean flag if set to true default search will return records assigned to the user only, if false it will return all the records based on user’s role.
egov.wf.inbox.assignedonly =
```
