# egov-custom-consumer service

Custom consumer service invokes a co-existence api to clear the auth token present in co-existence finance erp if the user logs out in the rain maker system.

### DB UML Diagram

NA

### Service Dependencies

NA

### Swagger API Contract

NA

## Service Details

egov-custom-consumer is a consumer which listens to the res-custom-filter topic, and invokes co-existence rest end ponit to clear the auth token present in the co-existence finance erp.

### API Details

NA

### Kafka Consumers

egov.custom.async.filter.topic : res-custom-filter
	
	listens to this topic to clear the auth token present in the finance co-existence erp.

### Kafka Producers

NA
