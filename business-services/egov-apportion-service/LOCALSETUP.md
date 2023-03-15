# Local Setup

To setup the egov-apportion-service service in your local system, clone the [Business Service repository](https://github.com/egovernments/business-services).

## Dependencies

### Infra Dependency

- [x] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [x] Kafka
  - [ ] Consumer
  - [x] Producer

## Running Locally

To run the egov-apportion-service in local system, you need to port forward below services.

```bash
 kubectl port-forward -n egov {egov-mdms} 8088:8080
```

Update below listed properties in `application.properties` before running the project:

```ini

-spring.datasource.url=jdbc:postgresql://localhost:5432/{local postgres db name}

-spring.flyway.url=jdbc:postgresql://localhost:5432/{local postgres db name}

-egov.mdms.host={mdms hostname}

```

Optionally egov=persister should be ran locally if auditing is required and following config path should be added in it:
 (https://raw.githubusercontent.com/egovernments/configs/master/egov-persister/apportion-persister.yml)