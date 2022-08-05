# Billing-Service service

 Generates bills for revenue services.

### DB UML Diagram

NA

### Service Dependencies

- user
- ID-GEN
- Localisation
- Apportion-service

### Swagger API Contract

https://raw.githubusercontent.com/egovernments/business-services/master/Docs/billingservice/V-2.0.yml

## Service Details

Stores demand created by different services, demands can be created and updated, Bills can be generated for the stored demands.

### API Details

- Demand - the demand set of API's can be used to create and update demands.
- Bill - bill the APIs can be used generate bills based on existing demand.
- Bill/_fetchbill - the fetch bill API generates and new bill incase of the old bill being expired, if the demand doesnt exists then genrate/fetchbill will reult in error due to demand not found.

### Kafka Consumers

kafka.topics.receipt.update.demand.v2=egov.collection.payment-create
kafka.topics.receipt.cancel.name.v2=egov.collection.payment-cancel

Kafka consumer listen to payment topic to update demand whenever payment is made against the bills.

### Kafka Producers

producers are disabled currently 
kafka.topics.save.demand=save-demand
kafka.topics.update.demand=update-demand

