

# eGov Water Service Calculator



This module created to manage the Bill calculation for the registered Water Service Connections in the System.

### Work Flow
- Meter Connection Create
   - Water Service created by calling the APIs in WS-Service. Once the Application activated for metered-connection, employee can add meter reading details using this API - ws-calculator/meterConnection/_create which in-turn will generate the Demand.
   - For the Non-Metered connections, the scheduler APIs need to be called periodically to generate the demand.
- Meter Connection Search
   - For the Metered Connection service, to get the previous meter reading ws-calculator/meterConnection/_search API used.
- Estimate
   - To Activate the Water Service application, the user needs to pay the ONE_TIME_FEE for the connection. To calculate the ONE_TIME_FEE ws-calculator/waterCalculator/_estimate API used.
- Calculate
   - ws-calculator/waterCalculator/_calculate API used to generate the demand for metered or non-metered water connection.
- UpdateDemand
   - User can pay partial / full / advance amount for the Metered or Non-Metered connection bill. In these cases, Billing service would call back ws-calculator/waterCalculator/_updateDemand API to update the details of the demand generated.
- Scheduler API
   - ws-calculator/waterCalculator/_jobscheduler API used to generate demand for Non-metered connections. This API can be called periodically!
- Apply Adhoc Tax
   - ws-calculator/waterCalculator/_applyAdhocTax API used to add Rebate or Penalty on any bill and based on that the bill amount will be adjusted.
   
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
 - validator - Contains all validation code
 - web/controller - Controllers for the app.
 - web/models - POJO for the module.
 
### Resources
- Granular details about the API's can be found in the [swagger api definition](https://app.swaggerhub.com/apis/egov-foundation/Water-Sewerage-1.0/1.0.0#/free)
- Postman collection for all the API's can be found in the [postman collection](ws-calculator-postman.json)


## Build & Run


    mvn clean install
    java -jar target/ws-calculator-1.0.0-SNAPSHOT.jar


## Dependencies


- Postgres database to store Meter Reading data.

- Water Service to validate the Water connection object.

- Persister module for persistence.

- MDMS service to verify master data

- PT Services to verify the Property details
