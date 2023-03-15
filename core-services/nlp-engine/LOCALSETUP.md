# Local Setup

This document will walk you through the dependencies of this service and how to set it up locally

- To setup the nlp-engine service in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [ ] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [ ] Kafka
  - [ ] Consumer
  - [ ] Producer

## Running Locally

To run the nlp-engine service in local system, follow below steps:

a) Run the command `pip install -r requirements.txt`

b) You need to port forward below services.

```bash
 function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
 kubectl port-forward -n egov $(kgpt egov-mdms-service) 8084:8080 &
 kubectl port-forward -n egov $(kgpt egov-location) 8082:8080 
``` 

c) Update below listed properties in `application.properties` before running the project:

```ini
MDMS_HOST = 'http://localhost:8084/'
EGOV_LOCATION_HOST = 'http://localhost:8082/'
```