# Fire-NOC Service

The main objective of the Fire-NOC module is to provide **No Objection Certificate** indicating that the building is designed as per fire safety norms and regulation.
### DB UML Diagram
- To Do

### Service Dependencies
- egov-mdms
- egov-user
- egov-idgen
- egov-workflow
- egov-location
- firenoc-calculator

### Swagger API Contract

Please refer to the [Swagger API contarct](https://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/municipal-services/master/firenoc-services/docs/contract/fire_noc_contract.yaml#!/) for Fire-NOC service to understand the structure of APIs and to have visualization of all internal APIs.


## Service Details

**MDMS COnfiguration**

Firenoc service makes calls to egov-mdms-service to fetch required masters. These are significant in validations of application.


   | Fire-NOC masters                                                                                                                           | Description                                                                                                    |  
   | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------|
   | [Application Type](https://github.com/egovernments/egov-mdms-data/blob/master/data/pb/firenoc/ApplicationType.json)                        | This master contains the list of application type.                                                             |
   | [Building Type](https://github.com/egovernments/egov-mdms-data/blob/master/data/pb/firenoc/BuildingType.json)                              | This master contains the details about which unit of measurement is use for a particular building type.        | 
   | [FireStations](https://github.com/egovernments/egov-mdms-data/blob/master/data/pb/firenoc/FireStations.json)                               | This master contains the list of firestation present in city.                                                  |
   | [PropertyType](https://github.com/egovernments/egov-mdms-data/blob/master/data/pb/firenoc/PropertyType.json)                               | This master contains the list of property type.                                                                |
   | [FireNocULBConstats](https://github.com/egovernments/egov-mdms-data/blob/master/data/pb/amritsar/firenoc/FireNocULBConstats.json)          | This master contains the list of minimum charges of each application type.                                     |


### API Details

`BasePath` /firenoc-services/v1/[API endpoint]

##### Method
a) `_create`

Create API  call is called with INITIATED action to create new application. In this API call we validate request body(using ajv module for contract specific validation and explicit checking for user related validation checks), enrich audit details, generate application no using idgen, persist data using persister and return response. 

**Allowed user roles:**  NOC_CEMP, CITIZEN
    
b) `_update`

Once application is created it can be updated by citizen or employee while taking action on application 

**Allowed user roles:** NOC_CEMP, CITIZEN, NOC_DOC_VERIFIER, NOC_FIELD_INSPECTOR, NOC_APPROVER

c) `_search`

Search API call is used to search for application. If search call is being made by CITIZEN then only his application would be fetched applying other search filters. For employee search based on search filter will return data.

**Allowed user roles:**  NOC_CEMP, CITIZEN, NOC_DOC_VERIFIER, NOC_FIELD_INSPECTOR, NOC_APPROVER, EMPLOYEE



**Postman collection** :-  https://www.getpostman.com/collections/093e28bb4e341770b6c7





### Kafka Consumers

- The following consumer topic are used to create and send SMS/Email notification
    - **save-fn-firenoc**
    - **update-fn-firenoce**
    - **update-fn-workflow**
    - **egov.collection.payment-create**

### Kafka Producers

- Following are the Producer topic.
    - **save-fn-firenoc** :- This topic is use to save new application in system.
    - **update-fn-firenoce** :- This topic is use to update the existing application in system.
    - **egov.core.notification.sms** :- This topic is use to send SMS/Email notification to user.
