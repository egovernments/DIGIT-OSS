# Dashboard-Ingest

Dashboard-Ingest module runs as a pipeline and manages to validate, transform and enrich the incoming data and pushes the same to ElasticSearch Index.

### DB UML Diagram

- To Do

### Service Dependencies

- elasticsearch

### Swagger API Contract

- Please refer to the [Swagger API contarct](https://raw.githubusercontent.com/egovernments/business-services/master/Docs/dss-dashboard/DSS%20Ingest%20YAML%20Spec%201.0.0.yaml) for dashboard-ingest to understand the structure of APIs and to have visualization of all internal APIs.


## Service Details

Below are list of configurations

- Topic Context Configurations

- Validator Schema

- JOLT Transformation Schema

- Enrichment Domain Configuration 

- JOLT Domain Transformation Schema

####Descriptions

**Topic Context Configurations**

Topic Context Configuration is an outline to define which data is received on which Kafka Topic. 
Indexer Service and many other services are sending out data on different Kafka Topics. If the Ingest Service is asked to receive those data and pass it through the pipeline, the context and the version of the data being received has to be set. This configuration is used to identify as in which kafka topic consumed the data and what is the mapping for that.
[Click here for full configuration](https://github.com/egovernments/configs/blob/master/egov-dss-dashboards/dashboard-ingest/TopicContextConfiguration.json)

| Parameter Name                    | Description                                                                                                       | 
| ----------------------------------| ------------------------------------------------------------------------------------------------------------------|
| `topic`                           | Holds the name of the Kafka Topic on which the data is being received                                             |           
| `dataContext`                     | Context Name which needs to be set for further actions in the pipeline                                            |
| `dataContextVersion`              | Version of the Data Structure is set here as there might be different structured data at different point of time  |

**Validator Schema**

Validator Schema is a configuration Schema Library from Everit
By passing the data against this schema, it ensures whether the data abides by the rules and requirements of the schema which has been defined. [Click here for example configuration](https://github.com/egovernments/configs/blob/master/egov-dss-dashboards/dashboard-ingest/validator_transaction_v1.json) 



**JOLT Transformation Schema**

JOLT is a JSON to JSON Transformation Library. In order to change the structure of the data and transform it in a generic way, JOLT has been used. 
While the transformation schemas are written for each Data Context, the data is transformed against the schema to obtain a transformed data. 
[Click here for example configuration](https://github.com/egovernments/configs/blob/master/egov-dss-dashboards/dashboard-ingest/transform_collection_v1.json)

**Enrichment Domain Configuration** 

This configuration defines and directs the Enrichment Process which the data goes through. 

For example, if the Data which is incoming is belonging to a Collection Module data, then the Collection Domain Config is picked. And the based on the Business Type specified in the data, the right config is picked. 
In order to enhance the data of Collection, the domain index specified in the configuration is queried with the right arguments and the response data is obtained, transformed and set. 
[Click here for example configuration](https://github.com/egovernments/configs/blob/master/egov-dss-dashboards/dashboard-ingest/DomainConfig.json)

| Parameter Name                         | Description                                                                                                                                                             | 
| ---------------------------------------| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`                                   | Unique Identifier for the Configuration within the configuration document                                                                                               |           
| `businessType`                         | This defines as in which kind of Domain / Service is the data related to. Based on this business type, query and enhancements are decided                               |
| `indexName`                            | Based on Business Type, Index Name is defined as to which index has to be queried to get the enhancements done from                                                     |
| `query`                                | Query to execute to get the Domain Level Object is defined here.                                                                                                        |
| `targetReferences / sourceReferences`  | Fields which are variables in order to get the domain level objects are defined here. The variables and where all the values has to be picked from are documented here. |      

**JOLT Domain Transformation Schema**

As a part of Enhancement, once the domain level object is obtained, we might not need the complete document as is in the end data product. 

Only those parameters which should be or can be used for an aggregation and representation are to be held and others are to be discarded. 

In order to do that, we make use of JOLT again and write schemas to keep the required ones and discard the unwanted ones. 

The [configuration](https://github.com/egovernments/configs/blob/master/egov-dss-dashboards/dashboard-ingest/transform_tl_v1.json) is used to transform the data response in the enrichment layer.

**JOLT Transformation Schema for collection V2**

JOLT transformation schema for payment-v1 has taken as a use case to explain the context  collection and context version v2. The payment records are processed/transformed with the schema. The schema supports splitting the billing records in a independent new record. So if there are 2 bill items in the collection/payment incoming data then this results into 2 collection records in turn.
[Click for example configuration](https://github.com/egovernments/configs/blob/master/egov-dss-dashboards/dashboard-ingest/transform_collection_v2.json)

Here: $i, the variable value that gets incremented for the number of records of paymentDetails 
$j, the variable value that gets incremented for the number of records of billDetails.

>Note: For kafka connect to work, Ingest pipeline application properties or in environments direct push must be disabled.
es.push.direct=false

 

### API Details

`BasePath` /dashboard-ingest/ingest/[API endpoint]

##### Method

- `save`
   - This API receives the Transaction Details JSON Request and passes it on to the Service Layer for further process of persisting into elastic search.

- `upload`
   - This API use to provide response for external data upload. Uploded file get parsed and stores target data to Elastic search.

- `/migrate/{indexName}/{version}`
   -  This api is used for scroll search.
   
- `/pause/{consumerId}`
    - This API use to pause a active kafka consumer.
    
- `/resume/{consumerId}`
    - This API is to resume a paused kafka consumer.

### Kafka Consumers
Following are the kafka consumer topic
- `ingestData`:- The consumer listen on this kafka topic to get the required data for ingest pipleine.
- `dss-collection-update`:- The consumer listen on this topic to get the collection index data.
- `validData` :- The consumer listen on this topic to valida the data before transformation.
- `transformedData`:- The consumer listen on this topic consumes the collection/incoming data and transforms the data using jolt configurations.
- `egov-dss-ingest-enriched`:- The consumer listen on this kafka topic in order to hook the collection data to its business module data.

### Kafka Producers
Following are the kafka producer topic
- `validData`:- The producer send the data to this topic to valid the data before transformation.
- `transformedData` :- The producer send the data to this topic in order to transorm collection/incoming data using jolt configurations.
- `egov-dss-ingest-enriched`:- The producer send the data to this topic after transormation in order to hook the collection data to its business module data.
