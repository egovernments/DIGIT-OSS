

# Noc Services



Module is used to apply NOC application for approval of respective noc users.

### Building Plan Approval Flow
- Create
   - NOC application with noc-services/v1/noc/_create api.
   - The response contains the NOC object with its assigned applicationNumber .
- Update
   -  On created NOC multiple assessments can be done by calling the noc-servcies/v1/noc/_update api.
    - Validations are carried out to verify the authenticity of the request and generate application fee which will be paid by the architect and gets approval number generated on approval .
- Search
   -  BPA can be searched based on several search parameters as detailed in the swagger yaml [[ Resources ](#resources)] .




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
- Granular details about the API's can be found in the [swagger api definition](services.yaml)
- Postman collection for all the API's can be found in the [postman collection](https://www.getpostman.com/collections/a13920f8bb971c065e13)


## Build & Run


    mvn clean install
    java -jar target/noc-services-1.0.0-SNAPSHOT.jar


## Dependencies


- Postgres database to store property data.

- ID Gen Module to generate unique PropertyId and assessmentNumber.

- Persister module for persistence.


- MDMS service to verify master data

- User Service to create users of the property owners

- SMSNotification Service to send notifications related to registration and payment

