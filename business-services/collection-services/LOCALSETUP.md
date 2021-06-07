# Local Setup

To setup the billing-service in your local system, clone the git repo(https://github.com/egovernments/business-services).

## Dependencies


### Infra Dependency

- [X] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [X] Kafka
  - [X] Consumer
  - [X] Producer

## Running Locally

To run the service locally, you need to port forward below services.

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}

kubectl port-forward -n egov $(kgpt egov-user) 8081:8080 &
kubectl port-forward -n egov $(kgpt egf-master) 8083:8080 &
kubectl port-forward -n egov $(kgpt egov-common-masters) 8084:8080 &
kubectl port-forward -n egov $(kgpt egf-instrument) 8085:8080 &
kubectl port-forward -n egov $(kgpt billing-service) 8086:8080 &
kubectl port-forward -n egov $(kgpt egov-idgen) 8087:8080 &
kubectl port-forward -n egov $(kgpt egov-mdms-service) 8088:8080 &
kubectl port-forward -n egov $(kgpt egov-apportion-service) 8089:8080 &
``` 

Update below listed properties in `application.properties` before running the project:

```ini

user.service.hostname=http://127.0.0.1:8081
egov.egfmasters.hostname=http://127.0.0.1:8083
egov.egfcommonmasters.hostname =http://127.0.0.1:8084
egov.instrument.hostname = http://127.0.0.1:8085
egov.services.billing_service.hostname=http://127.0.0.1:8086
egov.idgen.hostname = http://127.0.0.1:8087
egov.mdms.host=http://127.0.0.1:8088
egov.apportion.host=http://127.0.0.1:8089

# this is the main server host for sending notification
coll.notification.ui.host=
```
