# eGov Payment Gateway

Module acts as a liaison between eGov apps and external payment gateways. It facilitates payments, reconciliation of payments and look up of transactions' status'.

### DB UML Diagram

- To Do

### Service Dependencies

- egov-idgen
- collection-services
- egf-master
- egov-persister

### Swagger API Contract

- Please refer to the [Swagger API contarct](https://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/egov-services/master/core/egov-pg-service/egov-pg-service.yml#!/) for egov-pg service to understand the structure of APIs and to have visualization of all internal APIs.


## Service Details

### Reconciliation

- Reconciliation is carried out by two jobs scheduled via a Quartz clustered scheduler.
- Early Reconciliation job is set to run every 15 minutes [configurable via app properties], and is aimed at reconciling transactions which were created 15 - 30 minutes ago and are in PENDING state.
- Daily Reconciliation job is set to run once per day, and is aimed at reconciling all transactions that are in PENDING state, except for ones which were created 30 minutes ago.

### Packages

- config :- All configuration related to the App, including main quartz scheduler configs
- service :- Consists of main service classes for app functioning.
- service/gateways/{gatewayName} :- Third party payment gateways, each sub-package to encapsulate entire code needed for the gateway.
- service/jobs/* :- Contains jobs and respective configs for the jobs which are to be scheduled on the Quartz scheduler
- web/controllers :- Controllers for the app.

### Extension
- Additional gateways can be added by implementing the [Gateway](https://raw.githubusercontent.com/egovernments/egov-services/master/core/egov-pg-service/src/main/java/org/egov/pg/service/Gateway.java) interface.

### Gateways Supported

- AXIS

- PAYTM

- PHONEPE

**Configurable Properties:**

Following are the properties in application.properties file in egov-pg-service has to be added and set with default value after integrating with new payment gateway.
In the below table properties for AXIS bank payment gateway is shown, same releveant propert needs to be add for other payment gateway.

| Property                          | Remarks                                                  | 
| ----------------------------------| ---------------------------------------------------------|
| `axis.active`                     | Bollean lag to set the payment gateway active/inactive   |
| `axis.currency`                   | Currency representation for merchant, default(INR)       |
| `axis.merchant.id`                | Payment merchant Id                                      |
| `axis.merchant.secret.key`        | Secret key for payment merchant                          |
| `axis.merchant.user`              | User name to access the payment merchant for transaction |
| `axis.merchant.pwd`               | Password of the user tp access payment merchant          |
| `axis.merchant.access.code`       | Access code                                              |
| `axis.merchant.vpc.command.pay`   | Pay command                                              |
| `axis.merchant.vpc.command.status`| commans status                                           |
| `axis.url.debit`                  | Url for making payment                                   |
| `axis.url.status`                 | URL to get the status of the transaction                 |


### API Details

`BasePath` /pg-service/transaction/v1/[API endpoint]

##### Method

- `_create`
   - Transaction to be initiated with a call to the transaction/_create API, various validations are carried out to ensure sanctity of the request.
   - The response includes a generated transaction id and a redirect URL to the payment gateway itself.
- `_update`
   -  Once the transaction is completed by following the redirect URL, transaction/_update endpoint is to be called with the query params returned by the gateway.
    - Various validations are carried out to verify the authenticity of the request and the status is updated accordingly.
    - If the transaction is successful, a receipt is generated for the same.
- `_search`
   -  Transactions can be queried based on several search parameters as detailed in the swagger yaml .

- Postman collection for all the API's can be found in the [postman collection](https://raw.githubusercontent.com/egovernments/egov-services/master/core/egov-pg-service/postman/Egov-PG-Service.postman_collection.json)

### Kafka Consumers
- NA

### Kafka Producers

- Following are the Producer topic.

    - `save-pg-txns` : egov-pg-services sends data to this topic to store the payment transaction details.
    - `update-pg-txns` : egov-pg-services sends data to this topic to update the payment transaction details.
    - `save-pg-txns-dump` : egov-pg-services sends data to this topic to store the payment transaction dump details.
    - `update-pg-txns-dump` : egov-pg-services sends data to this topic to update the payment transaction dump details.