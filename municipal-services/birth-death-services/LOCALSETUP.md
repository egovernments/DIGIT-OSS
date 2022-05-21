# Local Setup

To setup the birth-death-services in your local system, clone the git repo (https://github.com/egovernments/DIGIT-Dev/tree/master/municipal-services).

## Dependencies

### Infra Dependency

- [X] Postgres DB
- [ ] Redis
- [ ] Elastic search
- [X] Kafka
  - [X] Consumer
  - [X] Producer

## Running Locally

To run the birth-death-services locally, you need to port forward below services locally

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt billing-service) 8088:8080 &
kubectl port-forward -n egov $(kgpt egov-idgen) 8089:8080 &
kubectl port-forward -n egov $(kgpt egov-user) 8090:8080 & 
kubectl port-forward -n egov $(kgpt egov-url-shortening) 8093:8080 &  
kubectl port-forward -n egov $(kgpt egov-mdms-service) 8094:8080 
kubectl port-forward -n egov $(kgpt egov-enc-service) 8095:8080 
```

To run the birth-death-services locally, update below listed properties in `application.properties` prior to running the project:

```ini
egov.user.host : User Service host
egov.idgen.host : Idgen service Host
egov.mdms.host : MDMS service host
egov.billingservice.host: Billing service Host
egov.collection.service.host : Egov collection host
egov.enc.host : Egov enc service host
egov.pdf.host : Egov pdf service host
egov.pdfservice.host : pdf service host
egov.ui.app.host : Digit url host

egov.bnd.deathcert.link : Death certificate details screen after scanning the QA code
egov.bnd.birthcert.link : Birth certificate details screen after scanning the QA code
```
