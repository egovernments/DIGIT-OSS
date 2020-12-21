

# eGov WaterService



This module created to manage WaterService connections against a Property in the system.

### Work Flow
- Create
   - WaterService is created by calling ws-services/wc/_create api.
   - The response contains the WaterConnection object with its assigned ApplicationId of that WaterService Connection.
- Update
   -  Created WaterService application needs to be approved and activated, and these are done by calling the ws-services/wc/_update api.
    - Once the application activated new Water Connection Number will be generated, and the same would be updated in the WaterConnection Object.
- Search
   -  WaterService Application/Connection  can be searched based on several search parameters as detailed in the swagger yaml [[ Water Sewerage API ](https://app.swaggerhub.com/apis/egov-foundation/Water-Sewerage-1.0/1.0.0#/free)].

### Project Structure 
*Packages*
 - config - Contains all the configuration properties related to module
 - constants - Contains class which has constant information
 - consumer - Contains all the kafka consumers
 - producer - Contains kafka producer
 - repository - Fetch data from dependent micro services
 - repository/rowmapper - Rowmappers to convert db query results to object
 - repository/builder - Contains query builder for search
 - service - Consists of all services containing the business logic.
 - util - Contains utility functions and constatns.
 - validator - Contains all validation code
 - web/controllers - Controllers for the app.
 - web/models - POJO for the module.
 - workflow - contains workflow service helpers
 

### Resources
- Granular details about the API's can be found in the [swagger api definition](https://app.swaggerhub.com/apis/egov-foundation/Water-Sewerage-1.0/1.0.0#/free)
- Postman collection for all the API's can be found in the [postman collection](ws-services-postman.json)


## Build & Run

    mvn clean install
    java -jar target/ws-service-1.0.0-SNAPSHOT.jar


## Dependencies

- Postgres database to store Water Connection data.

- Property Service to validate the PropertyId.

- ID Gen Module to generate unique WaterApplicationId and WaterConnectionId.

- Persister module for persistence.

- WS calculator module to calculate fee and tax for the given WaterService Application / Connection.

- MDMS service to verify master data

- SMSNotification Service to send notifications related to registration and payment
