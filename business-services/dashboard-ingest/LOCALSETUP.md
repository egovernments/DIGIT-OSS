# Local Setup

To setup the dashboard-ingest in your local system, clone the [Business Service repository](https://github.com/egovernments/business-services).

## Dependencies

### Infra Dependency

- [ ] Postgres DB
- [ ] Redis
- [X] Elastic search
- [X] Kafka
  - [X] Consumer
  - [X] Producer

## Running Locally

To run the dashboard-ingest locally, update below listed properties in `application.properties` prior to running the project:

```ini
services.esindexer.host = Elasticsearch hostname
services.esindexer.host.port = Elasticsearch port number
services.esindexer.username = Username for elasticsearch index
services.esindexer.password = Password for elastic search index
spring.data.elasticsearch.cluster.name = Elasticsearch cluster name
spring.data.elasticsearch.cluster.nodes = Elasticsearch node name
```
