

# eGov Payment Gateway



Module acts as a liaison between eGov apps and external payment gateways. It facilitates payments, reconciliation of payments and look up of transactions' status'.

### Payment Flow
- Create
   - Transaction to be initiated with a call to the transaction/_create API, various validations are carried out to ensure sanctity of the request.
   - The response includes a generated transaction id and a redirect URL to the payment gateway itself.
- Update
   -  Once the transaction is completed by following the redirect URL, transaction/_update endpoint is to be called with the query params returned by the gateway.
    - Various validations are carried out to verify the authenticity of the request and the status is updated accordingly.
    - If the transaction is successful, a receipt is generated for the same.
- Search
   -  Transactions can be queried based on several search parameters as detailed in the swagger yaml [[ Resources ](#resources)] .



### Reconciliation
- Reconciliation is carried out by two jobs scheduled via a Quartz clustered scheduler.
- Early Reconciliation job is set to run every 15 minutes [configurable via app properties], and is aimed at reconciling transactions which were created 15 - 30 minutes ago and are in PENDING state.
- Daily Reconciliation job is set to run once per day, and is aimed at reconciling all transactions that are in PENDING state, except for ones which were created 30 minutes ago.

### Project Structure
*Packages*
 - config - All configuration related to the App, including main quartz scheduler configs
 - service - Consists of main service classes for app functioning.
 - service/gateways/{gatewayName} - Third party payment gateways, each sub-package to encapsulate entire code needed for the gateway.
 - service/jobs/* - Contains jobs and respective configs for the jobs which are to be scheduled on the Quartz scheduler
 - web/controllers - Controllers for the app.

### Extension
- Additional gateways can be added by implementing the [Gateway](https://raw.githubusercontent.com/egovernments/egov-services/master/core/egov-pg-service/src/main/java/org/egov/pg/service/Gateway.java) interface.

### Resources
- Granular details about the API's can be found in the [swagger api definition](https://raw.githubusercontent.com/egovernments/egov-services/master/core/egov-pg-service/egov-pg-service.yml)
- Postman collection for all the API's can be found in the [postman collection](https://raw.githubusercontent.com/egovernments/egov-services/master/core/egov-pg-service/postman/Egov-PG-Service.postman_collection.json)

### Gateways Supported

- AXIS

- PAYTM

- PHONEPE



## Build & Run


    mvn clean install
    java -jar target/egov-pg-service-0.0.1-SNAPSHOT.jar


## Dependencies


- Postgres database to store transaction data and enable quartz clustered scheduling.
- Collection Service to validate request and to create receipts.

- ID Gen Module to generate unique transaction ID's.

- Persister module for persistence.

- Merchant specific properties, such as merchant id and secret needs to be configured.
