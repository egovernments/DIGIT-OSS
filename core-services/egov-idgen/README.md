# egov-idgen service

The egov-idgen service generates new id based on the id formats passed. The application exposes a Rest API to take in requests and provide the ids in response in the requested format. 

### DB UML Diagram

- TBD

### Service Dependencies

- egov-mdms-service

### Swagger API Contract

Link to the swagger API contract yaml and editor link like below

http://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/egov-services/master/docs/idgen/contracts/v1-0-0.yml#!/


## Service Details

The application can be run as any other spring boot application but needs lombok extension added in your ide to load it. Once the application is up and running API requests can be posted to the url and ids can be generated.
In case of intellij the plugin can be installed directly, for eclipse the lombok jar location has to be added in eclipse.ini file in this format -javaagent:lombok.jar.


### API Details

- id/v1/_genearte

## Reference document

Details on every parameters and its significance are mentioned in the document - `https://digit-discuss.atlassian.net/l/c/eH501QE3` 


### Kafka Consumers

- NA

### Kafka Producers

- NA