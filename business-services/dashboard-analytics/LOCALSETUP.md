# Local Setup

To setup the dss-analytics service in your local system, clone the [Business Service repository](https://github.com/egovernments/business-services).

## Dependencies

### Infra Dependency

- [ ] Postgres DB
- [ ] Redis
- [x] Elasticsearch
- [ ] Kafka
  - [ ] Consumer
  - [ ] Producer

## Running Locally

To run the dss-analytics in local system, you need to port forward below services.

```bash
 kubectl port-forward -n egov {egov-mdms} 8088:8080
```


Update below listed properties in `application.properties` before running the project:

```ini

- services.esindexer.host=http://localhost:9200/    (elastic search host)
- services.esindexer.host.port=9200                 (elastic search port)
- services.esindexer.username=changeme              (elastic search db username)
- services.esindexer.password=changeme              (elastic search db password)

```

