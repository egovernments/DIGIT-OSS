

# eGov PropertyTax



Module is used to register property in the system.

### Property Flow
- Create
   - Property is created by calling pt-services-v2/property/_create api which carries out validations based on the MDMS data of that particular city.
   - The response contains the property object with its assigned propertyId and assessmentNumber and the propertyTax calculation of that property.
- Update
   -  On created property multiple assessments can be done by calling the pt-services-v2/property/_update api.
    - Validations are carried out to verify the authenticity of the request and new assessment is added for that property.
- Search
   -  Property can be searched based on several search parameters as detailed in the swagger yaml [[ Resources ](#resources)] .




### Project Structure 
*Packages*
 - config - Contains all the configuration properties related to module
 - service - Consists of all services containing the business logic.
 - util - Contains utility functions and constatns.
 - validator - Contains all validation code
 - repository - Fetch data from dependent micro services
 - repository/rowmapper - Rowmappers to convert db query results to object
 - repository/builder - Contains query builder for search
 - web/controllers - Controllers for the app.
 - web/models - POJO for the module.
 - consumer - Contains all the kafka consumers
 - producer - Contains kafka producer


### Resources
- Granular details about the API's can be found in the [swagger api definition](https://raw.githubusercontent.com/egovernments/egov-services/master/docs/rainmaker/property-tax/property-service.yml)
- Postman collection for all the API's can be found in the [postman collection](https://raw.githubusercontent.com/egovernments/egov-services/master/rainmaker/pt-services-v2/pt-services-v2-dev.postman_collection.json)


## Build & Run


    mvn clean install
    java -jar target/egov-pt-service-v2-0.0.1-SNAPSHOT.jar


## Dependencies


- Postgres database to store property data.

- Location service to validate locality and set area code.

- ID Gen Module to generate unique PropertyId and assessmentNumber.

- Persister module for persistence.

- PT calculator module to calculate tax for the given property.

- MDMS service to verify master data

- User Service to create users of the property owners

- SMSNotification Service to send notifications related to registration and payment
