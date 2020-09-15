# Local Setup

To setup the egov-accesscontrol service in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [x] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [ ] Kafka
  - [ ] Consumer
  - [ ] Producer

## Running Locally

To run the egov-accesscontrol services locally, you need to port forward below services locally

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt egov-mdms-service) 8088:8080
``` 

Update below listed properties in `application.properties` before running the project:

```ini
 
egov.mdms.host={mdms hostname}

mdms.roleactionmaster.names = {roleactions master name}

mdms.roleaction.path = {roleaction json path}

mdms.actions.path = {action json path}

mdms.actionstest.path = {action test json path}

mdms.role.path = {role json path}
```
