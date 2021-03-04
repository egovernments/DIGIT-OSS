# Local Setup

This document will walk you through the dependencies of this service and how to set it up locally

- To setup the fsm-calculator in your local system, clone the [municipal-services repository](https://github.com/egovernments/municipal-services).

## Dependencies

### Infra Dependency

- [] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [X] Kafka
  - [] Consumer
  - [X] Producer

## Running Locally


To run the fsm locally, you need to port forward below services locally

```bash
billing-service
mdms-service
fsm
```

To run the fsm-calculator locally, update below listed properties in `application.properties` before running the project:

```ini
server.port
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=
spring.datasource.platform=

spring.flyway.url=
spring.flyway.user=
spring.flyway.password=
spring.flyway.table=
```
