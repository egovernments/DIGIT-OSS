# Local Setup

To setup the tl-services in your local system, clone the [Muncipal Service repository](https://github.com/egovernments/municipal-services).

## Dependencies

### Infra Dependency

- [X] Postgres DB
- [ ] Redis
- [X] Elastic search
- [X] Kafka
  - [X] Consumer
  - [X] Producer

## Running Locally

To run the th-services locally, you need to port forward below services locally

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt tl-calculator) 8087:8080 & 
kubectl port-forward -n egov $(kgpt billing-service) 8088:8080 &
kubectl port-forward -n egov $(kgpt egov-idgen) 8089:8080 &
kubectl port-forward -n egov $(kgpt egov-user) 8090:8080 &
kubectl port-forward -n egov $(kgpt egov-location) 8091:8080 &  
kubectl port-forward -n egov $(kgpt egov-workflow-v2) 8092:8080 &  
kubectl port-forward -n egov $(kgpt egov-url-shortening) 8093:8080 &  
kubectl port-forward -n egov $(kgpt egov-mdms-service) 8094:8080 
```

To run the th-services locally, update below listed properties in `application.properties` prior to running the project:

```ini
egov.location.host : Location service host
egov.localization.host : Localization Service host
egov.user.host : User Service host
egov.idgen.host : Idgen service Host
egov.mdms.host : MDMS service host
egov.billingservice.host: Billing service Host
egov.tl.calculator.host : Calculator Service host
workflow.context.path : Workflow Service host

egov.usr.events.pay.link : Link to redirect the user to pay screen
egov.usr.events.pay.code : The action on which the notification to be triggered
egov.usr.events.pay.triggers : The status on which the notification to be triggered
egov.user.event.notification.enabledForTL : Controls the enabling of TL system generated notifications
egov.user.event.notification.enabledForTLRenewal : Controls the enabling of TL Renewal system generated notifications
notification.sms.enabled.forTL : Controls the enabling of TL sms notifications
notification.sms.enabled.forTLRENEWAL : Controls the enabling of TL Renewal sms notifications
```
