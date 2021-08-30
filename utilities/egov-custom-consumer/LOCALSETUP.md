# Local Setup

To setup the egov-custom-consumer service in your local system, clone the [Utilities repository](https://github.com/egovernments/utilities).

## Dependencies

### Infra Dependency

- [ ] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [X] Kafka
  - [X] Consumer
  - [ ] Producer

## Running Locally

To run the egov-custom-consumer service locally, update below listed properties in `application.properties` before running the project:

```ini
egov.coexistence.hostname=#Host value of the co-existence finance erp server (ex: https://jalandhar-dev.egovernments.org)
```
