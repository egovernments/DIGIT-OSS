# Local Setup

This document will walk you through the dependencies of this service and how to set it up locally

- To setup the notification mail service in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [X] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [X] Kafka
  - [X] Consumer
  - [ ] Producer

## Running Locally

To run the notification mail services locally, update below listed properties in `application.properties` before running the project:

```ini
mail.enabled= #Controls if the mail notification to enabled. Default value is true.
mail.sender.username= #Senders email ID
mail.sender.password=#Senders pasdsword
egov.localization.host=#The host value of the server for localization API (eg: https://egov-micro-qa.egovernments.org/citizen/)
egov.user.host=#The host value of the server for User service (eg: https://egov-micro-qa.egovernments.org/citizen/)
email.subject=#The subject for the email.
```
