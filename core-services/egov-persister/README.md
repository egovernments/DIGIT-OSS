# Persister
### Egov persister service
Egov-Persister is a service running independently on seperate server. This service reads the kafka topics and put the messages in DB. We write a yml configuration and put the file path in application.properties.
#### Features supported
- Insert/Update Incoming Kafka messages to Database.
- Add Modify kafka msg before putting it into database

### YML configuration
- Application properties
- Key : egov.persist.yml.repo.path 
- value : Path of the yml (https://raw.githubusercontent.com/egovernments/egov-services/master/docs/persist-infra/configuration-yaml/billing-services-persist.yml,https://raw.githubusercontent.com/egovernments/egov-services/master/docs/persist-infra/configuration-yaml/pt-persist.yml)

### Raw yml configuration : 
- https://github.com/egovernments/egov-services/tree/master/docs/persist-infra/configuration-yaml

### Sample json which we are posting to kafka
- https://github.com/egovernments/egov-services/blob/master/citizen/citizen-persister/kafka-json.json
