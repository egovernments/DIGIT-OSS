# egf-instrument service

egf-instrument service used to create, search, update and delete instruments.

### DB UML Diagram

NA

### Service Dependencies

- egf-master

### Swagger API Contract

NA

## Service Details

egf-instrument service used to create, search, update and delete instruments.

### API Details

`/instruments/_create` : API to create instrument
`/instruments/_update` : API to update instrument
`/instruments/_delete` : API to delete instrument
`/instruments/_search` : API to search instrument

### Kafka Consumers

kafka.topics.egf.instrument.validated.topic : egov.egf.instrument.validated.topic
	Kafka Consumer listens to this topic and create/update/delete instrument and publish and event to kafka

### Kafka Producers

kafka.topics.egf.instrument.completed.topic=egov.egf.instrument.completed
	Kafka Producer publishes an event to this topic with the instrument information
