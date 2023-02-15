
# land-services

This service is the major service supporting bpa-services which handles the data of the land like land details, owner information, unit ,address and documents which has the complete information of the land.

### DB UML Diagram



### Service Dependencies

- egov-user  ( Manage user )

- egov-filestore ( To store the documents uploaded by the user )

- egov-idgen ( To generate the application No, Permit No )

- egov-indexer ( To index the bpa data )

- egov-localization ( To use the localized messages )

- egov-location ( To store the address locality )

- egov-mdms ( Configurations/master data used in the application is served by MDMS )

- egov-persister ( Helps to persist the data )

### Swagger API Contract

- [Swagger API](https://github.com/egovernments/municipal-services/blob/master/docs/bpa/bpa-service.yaml)

## Service Details

This service is the major service supporting bpa-services which handles the data of the land like land details, owner information, unit ,address and documents which has the complete information of the land.

### API Details
- Create : land detail in land registry with land-services/v1/land/_create api.
- Update : land detail in land registry with land-services/v1/land/_update api. 
- Search : land detail in land registry can be searched based on several search parameters by calling land-services/v1/land/_search.

### Kafka Consumers


### Kafka Producers
- persister.save.landinfo.topic=save-landinfo

- persister.update.landinfo.topic=update-landinfo

