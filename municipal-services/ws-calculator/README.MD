# WS-Calculator Service
This module created to manage the Bill calculation for the registered water service connections in the system.

### DB UML Diagram
- To Do

### Service Dependencies
- egov-mdms service
- property-service
- egov-persister
- ws-service
- egov-user
- egov-workflow-v2

### Swagger API Contract

- Please refer to the [Swagger API contarct](https://github.com/egovernments/municipal-services/blob/master/docs/water-sewerage-services.yaml) to understand the structure of APIs and to have visualization of all internal APIs.

## Service Details

**Functionality:**
- Calculate water charge and taxes based on billing slab.
- Calculate meter reading charge for water connection
- Generate demand
- Scheduler for generating the demand(for non metered connection) 

### API Details

`BasePath` /ws-calculator/[API endpoint]

##### Method

a) `/meterConnection/_create`
   - Water Service created by calling the APIs in WS-Service. Once the Application activated for metered-connection, employee can add meter reading details using this API - ws-calculator/meterConnection/_create which in-turn will generate the Demand.
   - For the Non-Metered connections, the scheduler APIs need to be called periodically to generate the demand.

b) `/meterConnection/_search`
   - For the Metered Connection service, to get the previous meter reading ws-calculator/meterConnection/_search API used.

c) `/waterCalculator/_estimate`
   - To Activate the Water Service application, the user needs to pay the ONE_TIME_FEE for the connection. To calculate the ONE_TIME_FEE ws-calculator/waterCalculator/_estimate API used.

d) `/waterCalculator/_calculate`
   - This API used to generate the demand for metered or non-metered water connection.

e) `/waterCalculator/_updateDemand`
   - User can pay partial / full / advance amount for the Metered or Non-Metered connection bill. In these cases, Billing service would call back ws-calculator/waterCalculator/_updateDemand API to update the details of the demand generated.

f) `/waterCalculator/_jobscheduler`
   - This API used to generate demand for Non-metered connections. This API can be called periodically!

g) `/waterCalculator/_applyAdhocTax`
   - This API used to add Rebate or Penalty on any bill and based on that the bill amount will be adjusted.
   
### Kafka Consumers

- Following are the Consumer topic.
    - **bill-generation**, **ws-demand-saved**, **ws-demand-failure** This topic are use to create notification to send to water connection owner on generation of demand and bill.
    - **ws-generate-demand** :- This topic is use to generate demand of water connection.
### Kafka Producers
- Following are the Producer topic.
    - **save-ws-meter** :- This topic is used to save meter reading details for connection in system
    - **ws-generate-demand** :- This topic is use to generate demand of water connection.
    - **egov.core.notification.sms**, **persist-user-events-async**  :- This topic are used to send noification to the phone number of the water connection owner.