# SW-Calculator Service
This module created to manage the bill calculation for the registered sewerage service connections in the system.

### DB UML Diagram
- To Do

### Service Dependencies
- egov-mdms service
- property-service
- egov-persister
- sw-service
- egov-user
- egov-workflow-v2

### Swagger API Contract

- Please refer to the [Swagger API contarct](https://github.com/egovernments/municipal-services/blob/master/docs/water-sewerage-services.yaml) to understand the structure of APIs and to have visualization of all internal APIs.

## Service Details

**Functionality:**
- Calculate sewerage charge and taxes based on billing slab.
- Scheduler for generating the demand(for non metered connection).
- Generate demand. 

### API Details

`BasePath` /sw-calculator/sewerageCalculator/[API endpoint]

##### Method

a) `_estimate`
   - To Activate the Sewerage Service application, the user needs to pay the ONE_TIME_FEE for the connection. To calculate the ONE_TIME_FEE sw-calculator/sewerageCalculator/_estimate API used.

b) `_calculate`
   - This API used to generate the demand for metered or non-metered Sewerage connection.

c) `_updateDemand`
   - User can pay partial / full / advance amount for the Metered or Non-Metered connection bill. In these cases, Billing service would call back sw-calculator/sewerageCalculator/_updateDemand API to update the details of the demand generated.

d) `_jobscheduler`
   - This API used to generate demand for Non-metered connections. This API can be called periodically.

e) `_applyAdhocTax`
   - This API used to add Rebate or Penalty on any bill and based on that the bill amount will be adjusted.
   
### Kafka Consumers

- Following are the Consumer topic.
    - **bill-generation**, **sw-demand-saved**, **sw-demand-failure** This topic are use to create notification to send to sewerage connection owner on generation of demand and bill.
    - **ws-generate-demand** :- This topic is use for generation of demand for sewerage connection.
### Kafka Producers
- Following are the Producer topic.
    - **sw-generate-demand** :- This topic is use to generate demand of sewerage connection.
    - **egov.core.notification.sms**, **persist-user-events-async**  :- This topic are used to send noification to the phone number of the sewerage connection owner.