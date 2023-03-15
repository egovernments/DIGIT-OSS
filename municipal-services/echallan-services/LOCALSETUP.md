# Local Setup

To setup the echallan-service in your local system, clone the [Muncipal Service repository](https://github.com/egovernments/municipal-services).

## Dependencies

### Infra Dependency

- [X] Postgres DB
- [ ] Redis
- [ ] Elastic search
- [X] Kafka
  - [X] Consumer
  - [X] Producer

## Running Locally

To run the echallan-services locally, you need to port forward below services locally

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt echallan-calculator) 8087:8080 & 
kubectl port-forward -n egov $(kgpt billing-service) 8088:8080 &
kubectl port-forward -n egov $(kgpt egov-idgen) 8089:8080 &
kubectl port-forward -n egov $(kgpt egov-user) 8090:8080 &
kubectl port-forward -n egov $(kgpt egov-location) 8091:8080 &  
kubectl port-forward -n egov $(kgpt egov-filestore) 8092:8080 &  
kubectl port-forward -n egov $(kgpt egov-url-shortening) 8093:8080 &  
kubectl port-forward -n egov $(kgpt egov-mdms-service) 8094:8080 & 
kubectl port-forward -n egov $(kgpt egov-localization) 8095:8080
```

To run the echallan-services locally, update below listed properties in `application.properties` prior to running the project:

```ini
egov.location.host : Location service host
egov.localization.host : Localization Service host
egov.user.host : User Service host
egov.idgen.host : Idgen service Host
egov.mdms.host : MDMS service host
egov.billingservice.host: Billing service Host
egov.echallan.calculator.host : Calculator Service host
egov.filestore.host : Filestore Service host
egov.url.shortner.host : URL Shortening service host
```