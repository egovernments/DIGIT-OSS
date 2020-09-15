# Local Setup

To setup the firenoc-calculator in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [x] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [x] Kafka
  - [ ] Consumer
  - [x] Producer

## Running Locally

To run the firenoc-calculator services locally, you need to run the below command to port forward below services

```bash
 function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}

 kubectl port-forward -n egov $(kgpt billing-service) 8084:8080 &
 kubectl port-forward -n egov $(kgpt egov-mdms-service) 8085:8080 &
 kubectl port-forward -n egov $(kgpt firenoc-service) 8086:8080
``` 

Update below listed properties in `envVariables.js` before running the project:

```ini
EGOV_BILLINGSERVICE_HOST: process.env.EGOV_BILLINGSERVICE_HOST || "http://localhost:8084"
EGOV_MDMS_HOST: process.env.EGOV_MDMS_HOST || "http://localhost:8085"
#  If you are running firenoc service in your local system then mention server port of it
EGOV_FIRENOC_SERVICE_HOST: process.env.EGOV_FIRENOC_SERVICE_HOST || "http://localhost:8086",
```

After updating the properties mentioned above, now start the fire-noc calculator by running the command **npm run dev** in terminal.