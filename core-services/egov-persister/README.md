
# Persister
### Egov persister service
Egov-Persister is a service running independently on seperate server. This service reads the kafka topics and put the messages in DB. We write a yml configuration and put the file path in application.properties.

### DB UML Diagram

- NA

### Service Dependencies
- NA

### Swagger API Contract

- NA

## Service Details

**Features supported**
- Insert/Update Incoming Kafka messages to Database.
- Add Modify kafka msg before putting it into database

**Functionality:**
- Persist data asynchronously using kafka providing very low latency
- Data is persisted in batch
- All operations are transactional
- Values in prepared statement placeholder are fetched using JsonPath
- Easy reference to parent object using ‘{x}’ in jsonPath which substitutes the value of the variable x in the JsonPath with value of x for the child object.(explained in detail below in doc)
- Supported data types **ARRAY("ARRAY"), STRING("STRING"), INT("INT"),DOUBLE("DOUBLE"), FLOAT("FLOAT"), DATE("DATE"), LONG("LONG"),BOOLEAN("BOOLEAN"),JSONB("JSONB")**

**Sample json which we are posting to kafka**
- https://github.com/egovernments/egov-services/blob/master/citizen/citizen-persister/kafka-json.json

**Persister configuration**

Persister uses configuration file to persist data. The key variables are described below:
- serviceName: Name of the service to which this configuration belongs.
- description: Description of the service.
- version: the version of the configuration.
- fromTopic: The kafka topic from which data is fetched
- queryMaps: Contains the list of queries to be executed for the given data.
- query: The query to be executed in form of prepared statement:
    - basePath: base of json object from which data is extrated
    - jsonMaps: Contains the list of jsonPaths for the values in placeholders.
    - jsonPath: The jsonPath to fetch the variable value.


```json
serviceMaps:
 serviceName: student-management-service
 mappings:
 - version: 1.0
   description: Persists student details in studentinfo table
   fromTopic: save-student-info
   isTransaction: true
   queryMaps:
       - query: INSERT INTO studentinfo( id, name, age, marks) VALUES (?, ?, ?, ?);
         basePath: Students.*
         jsonMaps:
          - jsonPath: $.Students.*.id

          - jsonPath: $.Students.*.name

          - jsonPath: $.Students.*.age

          - jsonPath: $.Students.*.marks
```                                  

**Bulk Persister:**

To persist large quantity of data bulk setting in persister can be used. It is mainly used when we migrate data from one system to another. 
The bulk persister have the following two settings:

| variable name           | Default value | Description                                     |
|-------------------------|---------------|-------------------------------------------------|
| `persister.bulk.enabled`| false         | Switch to turn on or off the bulk kafka consumer|
| `persister.batch.size`  | 100           | The batch size for bulk update                  |
    
Any kafka topic containing data which has to be bulk persisted should have '-batch' appended at the end of topic name example: save-pt-assessment-batch

### Persister Config Versioning

 - Each persister config has a version attribute which signifies the service version, this version can contain custom DSL; defined here, https://github.com/zafarkhaja/jsemver#external-dsl
 - Every incoming request [via kafka] is expected to have a version attribute set, [jsonpath, $.RequestInfo.ver] if versioning is to be applied.
 - If the request version is absent or invalid [not semver] in the incoming request, then a default version defined by the following property in application.properties`default.version=1.0.0` is used.
 - The request version is then matched against the loaded persister configs and applied appropriately.

    
### Kafka Consumers

- From the Kafka topic which are mentioned in the persister config, persister service get message/data and push the data into the particular tables of the database.

### Kafka Producers

- NA
