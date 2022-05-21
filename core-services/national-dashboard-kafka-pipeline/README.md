# National Dashboard Kafka Pipeline service

National dashboard kafka pipeline will listen on records sent by national-dashboard-ingest service and sends them to their module specific topics to be indexed.

### DB UML Diagram
- NA

### Service Dependencies
- NA

### Swagger API Contract

- NA

### Functionalities
1. Listens on persist-national-records topic and redirects records to the module specific topic names to be indexed by kafka connector.


### API Details

- NA

### Kafka Consumers

- Kafka consumer topic - persist-national-records

### Kafka Producers

- Producer topics are module specific and can be configured and found in module.index.mapping property