

# eGov Sewerage Service Calculator



This module created to manage the Bill calculation for the registered Sewerage Service Connections in the System.

### Work Flow
- Estimate
   - To Activate the Sewerage Service application, the user needs to pay the ONE_TIME_FEE for the connection. To calculate the ONE_TIME_FEE sw-calculator/sewerageCalculator/_estimate API used.
- Calculate
   - sw-calculator/sewerageCalculator/_calculate API used to generate the demand for metered or non-metered Sewerage connection.
- UpdateDemand
   - User can pay partial / full / advance amount for the Metered or Non-Metered connection bill. In these cases, Billing service would call back sw-calculator/sewerageCalculator/_updateDemand API to update the details of the demand generated.
- Scheduler API
   - sw-calculator/sewerageCalculator/_jobscheduler API used to generate demand for Non-metered connections. This API can be called periodically!
- Apply Adhoc Tax
   - sw-calculator/sewerageCalculator/_applyAdhocTax API used to add Rebate or Penalty on any bill and based on that the bill amount will be adjusted.
   
Swagger API yaml [[ Swagger API ](https://app.swaggerhub.com/apis/egov-foundation/Water-Sewerage-1.0/1.0.0#/free)] .


### Project Structure 
*Packages*
 - config - Contains all the configuration related to module
 - constants - Contains the constants.
 - consumer - Contains all the kafka consumers
 - producer - Contains kafka producer
 - repository - Fetch data from dependent micro services
 - repository/rowmapper - Rowmappers to convert db query results to object
 - repository/builder - Contains query builder for search
 - service - Consists of all services containing the business logic.
 - util - Contains utility functions.
 - web/controller - Controllers for the app.
 - web/models - POJO for the module.
 
### Resources
- Granular details about the API's can be found in the [swagger api definition](https://app.swaggerhub.com/apis/egov-foundation/Water-Sewerage-1.0/1.0.0#/free)
- Postman collection for all the API's can be found in the [postman collection](sw-calculator-postman.json)


## Build & Run


    mvn clean install
    java -jar target/sw-calculator-1.0.0-SNAPSHOT.jar


## Dependencies


- Postgres database to store Meter Reading data.

- Sewerage Service to validate the Sewerage connection object.

- Persister module for persistence.

- MDMS service to verify master data

- PT Services to verify the Property details

- Billing Service to create and update demand details
