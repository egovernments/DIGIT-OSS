# Local Setup

To setup the inbox in your local system, clone the [Muncipal Service repository](https://github.com/egovernments/municipal-services).

## Dependencies

### Infra Dependency

- [X] Postgres DB
- [ ] Redis
- [X] Elastic search
- [X] Kafka
  - [X] Consumer
  - [X] Producer

## Running Locally

To run the inbox localy, you need to port forward below services locally

```bash
mdms-service
workflow-v2
boundary-service
user-service
idgen-service
vehicle
fsm
```

To run the inbox locally, update below listed properties in `application.properties` prior to running the project:

```ini
service.search.mapping=
```

