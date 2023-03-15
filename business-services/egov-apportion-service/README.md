

# eGov ApportionService


Module is used to distribute the paid amount among the taxHeads.

### Apportion 
The Apportioning service is used to distribute the paid amount among the respective taxHead. 
There are two API's first is  /apportion-service/bill/_apportion endpoint which is used to apportion the bill. In this case each bill is processed seperately.
The billDetails in each bill are grouped by businessService. For each group the apportionPaidAmount() function is called to apportion the paid amount.
The second endpoint is /apportion-service/demand/_apportion which is used to apportion advance amount in demands. Demands for the same consumer code should be sent for the apportion.
The interface Apportion is to be implemented for custom logic. Default implementation is provided in class called OrderByPriorityApportion,
Default Implementation:
 1. Apportions the paid amount based on the order in each taxhead (ascending wise priority)
 2. If multiple billDetails are present they are sorted by fromPeriod and the oldest one is apportioned first
 3. Validation is placed to enforce that all taxHeads containing negative amounts should have order less than the one with positive amounts
 4. Any advance amount is added to the latest billDetail as new billAccountDetail
For custom implementation the methods getBusinessService() and apportionPaidAmount() has to be implemented. The first method returns key of the implementation while the second method contains the apportion logic for the particular key
The apportion request and respose are stored for audit using persister



### Service Dependencies
- egov-mdms
- egov-persister


### Project Structure
*Packages*
 - config - Contains all the configuration properties related to module
 - service - Consists of all services containing the business logic.
 - util - Contains utility functions and constants.
 - repository - Fetch data from dependent micro services
 - web/controllers - Controllers for the app.
 - web/models - POJO for the module.
 - producer - Contains kafka producer


### Resources
- Granular details about the API's can be found in the [swagger api definition](https://raw.githubusercontent.com/egovernments/docs/collections/contracts/apportion/egov-apportion-service.yml)
- Postman collection for all the API's can be found in the [postman collection](https://raw.githubusercontent.com/egovernments/egov-services/core/egov-apportion-service/Apportion.postman_collection.json)


## Build & Run


    mvn clean install
    java -jar target/egov-apportion-service-1.1.1-SNAPSHOT.jar



### API Details

`BasePath` /apportion-service/v2/[API endpoint]

##### Method
**a) Apportion Bill `POST /bill/_apportion` :** API (Bulk API) Apportions the paid amount in the field collectedAmount of billDetails in the bill
**b) Apportion demands `POST /demand/_apportion` :** API Apportions the advance amount from previous billing cycles in the latest demands


### Kafka Consumers

- NA


### Kafka Producers

- Following are the Producer topic.
    - **save-apportion-bill-request** :- This topic is used to save the bill apportion request for audit.
    - **save-apportion-bill-response** :- This topic is used to save the bill apportion response for audit.
    - **save-apportion-demand-request** :- This topic is used to save the demand apportion request for audit.
    - **save-apportion-demand-response** :- This topic is used to save the demand apportion response for audit.
