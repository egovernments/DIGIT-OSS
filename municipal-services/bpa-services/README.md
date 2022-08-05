
# bpa-service

Module is used to apply for Building Plan Approval, Building Plan Occupancy Certificate.


### DB UML Diagram



### Service Dependencies

- egov-user  ( Manage user )

- tl-services [Stakeholder Registration ( Registration process of Stakeholder is handled by this service)]

- egov-user-event ( What’s New and Events )

- egov-filestore ( To store the documents uploaded by the user )

- egov-idgen ( To generate the application No, Permit No )

- egov-indexer ( To index the bpa data )

- egov-localization ( To use the localized messages )

- egov-location ( To store the address locality )

- egov-mdms ( Configurations/master data used in the application is served by MDMS )

- egov-notification-sms ( Service to send SMS to the users involved in the application )

- egov-persister ( Helps to persist the data  )

- egov-searcher ( Search query used to simply the search )

- egov-workflow-v2 ( Workflow configuration for different BPA application is configured )

- pdf-service ( Receipt’s, permitorder etc.. and prepared )

- billing-service ( Create demands and bills for the fees to be collected )

- collection-services ( Create receipt for the payment received for the bills )

- bpa-calculator ( Calculates the fees to be collected at different stages)

- land-services ( land information related to BPA application is stored )

- dcr-services ( get and validate Edcr data ) 

- noc-service ( Apply and approval of NOC )

### Swagger API Contract

- [Swagger API](https://github.com/egovernments/municipal-services/blob/master/docs/bpa/bpa-service.yaml)

## Service Details

bpa-service is the service from which we create bpa /occupancy certificate application and process the application.
Process:
1. Dcr plan scrutiny
2. Apply the BPA/Occupancy certificate using the dcr/ocdcr scrutiny number
3. Process the application with respect to workflow
 

### API Details

- Create : Building Plan Approval application with bpa-services/v1/bpa/_create api. The response contains the BPA object with its assigned applicationNumber  and application Fee Generated.
- Update : On created BPA multiple assessments can be done by calling the bpa-services/v1/bpa/_update api.  Validations are carried out to verify the authenticity of the request and generate application fee which will be paid by the architect and gets approval number generated on approval .
- Search : BPA can be searched based on several search parameters by calling  bpa-services/v1/bpa/_search.



### Kafka Consumers
- kafka.topics.receipt.create=egov.collection.payment-create

- persister.save.buildingplan.topic=save-bpa-buildingplan

- persister.update.buildingplan.topic=update-bpa-buildingplan

- persister.update.buildingplan.workflow.topic=update-bpa-workflow

- persister.update.buildingplan.adhoc.topic=update-bpa-adhoc-buildingplan


### Kafka Producers

- persister.save.buildingplan.topic=save-bpa-buildingplan

- persister.update.buildingplan.topic=update-bpa-buildingplan

- persister.update.buildingplan.workflow.topic=update-bpa-workflow

- persister.update.buildingplan.adhoc.topic=update-bpa-adhoc-buildingplan

