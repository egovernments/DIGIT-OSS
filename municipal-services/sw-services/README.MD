

# eGov Sewerage Service



This module created to manage Sewerage Service connections against a Property in the system.

### Work Flow
- Create
   - Sewerage Service connection created by calling sw-services/swc/_create api.
   - The response contains the SewerageConnection object with its assigned ApplicationId of that SewerageService Connection.
- Update
   -  Created SewerageService application needs to be approved and activated, and these are done by calling the sw-services/swc/_update api.
    - Once the application activated new Sewerage Connection Number will be generated, and the same would be updated in the SewerageConnection Object.
- Search
   -  SewerageService Application/Connection  can be searched based on several search parameters as detailed in the swagger yaml [[ Water Sewerage API ](https://app.swaggerhub.com/apis/egov-foundation/Water-Sewerage-1.0/1.0.0#/free)].

### Project Structure 
*Packages*
 - config - Contains all the configuration properties related to module
 - consumer - Contains all the kafka consumers
 - producer - Contains kafka producer
 - repository - Fetch data from dependent micro services
 - repository/rowmapper - Rowmappers to convert db query results to object
 - repository/builder - Contains query builder for search 
 - service - Consists of all services containing the business logic.
 - util - Contains utility functions and constants.
 - validator - Contains all validation code
 - web/controllers - Controllers for the app.
 - web/models - POJO for the module.
 
### Resources
- Swagger API Yaml [Swagger API](https://app.swaggerhub.com/apis/egov-foundation/Water-Sewerage-1.0/1.0.0#/free)
- Postman collection for all the API's can be found in the [Postman Collection](sw-services-postman.json)


## Build & Run
    mvn clean install
    java -jar target/sw-service-1.0.0-SNAPSHOT.jar
    
## Dependencies
- Postgres database to store Sewerage Connection data.

- Property Service to validate the PropertyId.

- ID Gen Module to generate unique SewerageApplicationId and SewerageConnectionId.

- Persister module for persistence.

- SW calculator module to calculate fee and tax for the given SewerageService Application / Connection.

- MDMS service to verify master data

- SMSNotification Service to send notifications related to registration and payment
