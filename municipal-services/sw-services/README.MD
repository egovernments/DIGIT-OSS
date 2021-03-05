# SW-Services
This module created to manage Sewerage Service connections against a Property in the system.

### DB UML Diagram
- To Do

### Service Dependencies
- egov-mdms service
- property-service
- egov-idgen
- egov-persister
- sw-calculator
- egov-filestore
- pdf-service

### Swagger API Contract

- Please refer to the [Swagger API contarct](https://github.com/egovernments/municipal-services/blob/master/docs/water-sewerage-services.yaml) for ws-services to understand the structure of APIs and to have visualization of all internal APIs.

## Service Details

**Functionality:**
- Apply for sewerage connection.
- Searching for sewerage connections/application.
- Can take different action based on state (Workflow) 
- Notification based on the application state.```

### API Details

`BasePath` /sw-services/swc/[API endpoint]

##### Method

a) `_create`

   - Sewerage Service connection created by calling sw-services/swc/_create api.
   
   - The response contains the SewerageConnection object with its assigned ApplicationId of that SewerageService Connection.
   
b) `_update`

  -  Created SewerageService application needs to be approved and activated, and these are done by calling the sw-services/swc/_update api.
  
  - Once the application activated new Sewerage Connection Number will be generated, and the same would be updated in the SewerageConnection Object.

c) `_search`

   -  SewerageService Application/Connection  can be searched based on several search parameters as detailed in the swagger yaml given above.

### Kafka Consumers

- Following are the Consumer topic.
    - **save-sw-connection**, **update-sw-connection**, **update-sw-workflow**, **editnotificationsewerage** and **egov.collection.payment-create** this topic are use to create notification to send to sewerage connection owner.
### Kafka Producers
- Following are the Producer topic.
    - **save-sw-connection** :- This topic is used to create new sewerage connection application in the system.
    - **update-sw-connection** :- This topic is used to update the existing sewerage connection application in the systen.
    - **update-sw-workflow** :- This topic is used to update the process instance of the sewerage connection application.
    - **egov.core.notification.sms** :- This topic is used to send noification to the phone number of the sewerage connection owner.