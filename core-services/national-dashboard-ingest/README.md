# National Dashboard Ingest service

National dashboard ingest will be used by ULB employee for - 

1. To provide a one-stop framework for ingesting data regardless of data-source based on configuration.

2. To create provision for ingest based on module-wise requirement which directly or indirectly require aggregated data ingestion functionality.

### DB UML Diagram
- NA

### Service Dependencies
- NA

### Swagger API Contract

Please refer to the [Swagger API contract](https://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/DIGIT-OSS/master/core-services/docs/national-dashboard-ingest.yml) for egov-document-uploader service to understand the structure of APIs and to have visualization of all internal APIs.


### Functionalities
1. When national dashboard ingest metrics API is hit, all the data payload lookup keys are first checked against the db to determine whether they already exist or not. The db table currently being used for storing lookup keys is nss-ingest-data. 

2. If the record for a given date and area details is not present, the payload is then flattened and pushed to nss-ingest-keydata topic.

3. National dashboard ingest kafka pipeline consumer listens on nss-ingest-keydata topic and according to the module to which the data belongs to, pushes it to the respective topic defined in the module.index.mapping key.

4. Once the national dashboard ingest kafka pipeline pushes data to the respective topic, a kafka-connector then takes the flattened records from that topic and ingests to ElasticSearch.



### API Details

1. /national-dashboard/metric/_ingest - Takes RequestInfo and Data in request body. Data has all the parameters related to the record being inserted.

2. /national-dashboard/masterdata/_ingest - Takes RequestInfo and Data in request body. Data has all the parameters related to the record being inserted.


**`Postman collection`** :- https://www.getpostman.com/collections/87684b592bf51e3556d1





### Kafka Consumers

- NA

### Kafka Producers

- Following are the Producer topic.
    - **nss-ingest-keydata** :- This topic is used to push data to national-dasboard-kafka-pipeline.