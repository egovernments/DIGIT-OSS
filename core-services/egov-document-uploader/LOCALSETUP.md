# Local Setup

To setup the egov-document-uploader service in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [x] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [x] Kafka
  - [ ] Consumer
  - [x] Producer

## Running Locally

To run the egov-document-uploader service locally, you need to port forward below services locally

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt egov-mdms-service) 8088:8080
kubectl port-forward -n egov $(kgpt egov-idgen) 8089:8080
kubectl port-forward -n egov $(kgpt egov-url-shortening) 8084:8080
``` 