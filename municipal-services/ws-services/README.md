# WS-Services
This module created to manage WaterService connections against a Property in the system.
### DB UML Diagram

- NA

### Service Dependencies
- egov-mdms service
- property-service
- egov-idgen
- egov-persister
- ws-calculator
- egov-filestore
- pdf-service

### Swagger API Contract

- Please refer to the [Swagger API contarct](https://github.com/egovernments/municipal-services/blob/master/docs/water-sewerage-services.yaml) for ws-services to understand the structure of APIs and to have visualization of all internal APIs.

## Service Details

**Functionality:**
- Apply for water connection.
- Searching for water connections.
- Can take different action based on state (Workflow) 
- Notification based on the application state.```

### API Details

`BasePath` /ws-services/wc/[API endpoint]

##### Method

a) `_create`

   - WaterService is created by calling ws-services/wc/_create api.
   
   - The response contains the WaterConnection object with its assigned ApplicationId of that WaterService Connection.

b) `_update`

   -  Created WaterService application needs to be approved and activated, and these are done by calling the ws-services/wc/_update api.
   
   - Once the application activated new Water Connection Number will be generated, and the same would be updated in the WaterConnection Object.

c) `_search`

   -  WaterService Application/Connection  can be searched based on several search parameters as detailed in the swagger yaml [[ Water Sewerage API ](https://app.swaggerhub.com/apis/egov-foundation/Water-Sewerage-1.0/1.0.0#/free)].

### Kafka Consumers

- Following are the Consumer topic.
    - **save-ws-connection**, **update-ws-connection**, **update-ws-workflow** and **egov.collection.payment-create** this topic are use to create notification to send to water connection owner.
    - **create-meter-reading** :- This topic is use to save intital meter reading of water connection.
### Kafka Producers
- Following are the Producer topic.
    - **save-ws-connection** :- This topic is used to create new water connection application in the system.
    - **update-ws-connection** :- This topic is used to update the existing water connection application in the systen.
    - **update-ws-workflow** :- This topic is used to update the process instance of the water connection application.
    - **egov.core.notification.sms** :- This topic is used to send noification to the phone number of the water connection owner.