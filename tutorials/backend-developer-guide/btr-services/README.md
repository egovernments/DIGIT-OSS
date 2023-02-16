# Birth Registration Service

This service is used to issue birth certificate.

### Service Dependencies

- egov-idgen
- egov-user
- egov-workflow
- btr-calculator

### Swagger API Contract

[API Contract](./birth-registration-api-spec.yaml)

## Service Details

The service is integrated with User service, IdGen service and
Workflow service to create, update and search a birth registration application.
It is also integrated with btr-calculator to calculate the amount to be
paid.

### API Details

`BasePath` /birth-registration/birth-services/v1/registration/[API endpoint]

#### Method

a) `_create`
- Creates birth registration application and return the application number

b) `_update`
- Updates birth registration application based on application number

c) `_search`
- Searches birth registration application based on application number

### Kafka Consumers

- Following are the Consumer topics.
  - **kafka.topics.receipt.create**
  - **btr.kafka.create.topic**

### Kafka Producers

- Following are the Producer topics.
  - **save-bt-application**
  - **update-bt-application**

