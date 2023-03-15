# Local Setup

To setup the user-otp service in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [ ] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [x] Kafka
  - [ ] Consumer
  - [x] Producer

## Running Locally

To run the user-otp service in your local system, you need to port forward below services

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt egov-localization) 8087:8080
kubectl port-forward -n egov $(kgpt egov-user) 8088:8080
kubectl port-forward -n egov $(kgpt egov-otp) 8089:8080
``` 

Update below listed properties in **`application.properties`** before running the project:

```ini
#{egov-user service hostname}
user.host = http://127.0.0.1:8088

# {egov-otp service hostname}
otp.host = http://127.0.0.1:8089

# {egov-localisation service hostname}
egov.localisation.host = http://127.0.0.1:8087
```
