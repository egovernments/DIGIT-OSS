# birth-death-services

This is the egov application, which helps and provides a digital interface, allowing employees/citizens for downloading the Birth & death Certificates. Employee can register both birth and death applications, update and search where in citizen has an access to download the certificates. There are two processes while downloading the certificates as citizen can download the certificate free for the first time and it will be charged for next downloads so citizen has to pay the amount and download the certificates.

### DB UML Diagram

- NA

### Service Dependencies

- billing-service
- egov-mdms-service
- egov-localization
- egov-idgen
- egov-user
- egov-pdf
- pdf-services
- egov-enc-service

### Swagger API Contract

https://raw.githubusercontent.com/egovernments/DIGIT-OSS/4b75e6a77949ccc85d062a62bc66162ff4656f24/municipal-services/docs/birth-death/birth-death.yml

## Service Details

Creates birth and death applications, download certificates for first time and charges applicable after that.

### API Details

`savebirthimport` : This API is used to create an application for birth in the system. Whenever an application is created an application can be downloaded from the system.

`savedeathimport` : This API is used to create an application for death in the system. Whenever an application is created an application can be downloaded from the system.

`updatebirthimport` : The updatebirthimport API is used to update the application information.

`updatedeathimport` : The updatedeathimport API is used to update the application information.

`_download` : The _download API is to download birth and death application information.

### Kafka Consumers

persister.save.birth.topic=save-birth-topic
persister.update.birth.topic=update-birth-topic

persister.save.death.topic=save-death-topic
persister.update.death.topic=update-death-topic

### Kafka Producers

persister.save.birth.topic=save-birth-topic
persister.update.birth.topic=update-birth-topic

persister.save.death.topic=save-death-topic
persister.update.death.topic=update-death-topic