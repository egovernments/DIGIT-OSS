# Chatbot

Chatbot service is a chatbot which provides functionality to the user to access PGR module services like file complaint, track complaint, notifications from whatsapp. Currently citizen has three options to start conversation scan QR code, give missed call or directly send message to configured whatsapp number.

### DB UML Diagram

- NA

### Service Dependencies

- `egov-user-chatbot` : For creating user without name validation and logging in user
- `egov-user` : For searching user
- `egov-localization` : The chatbot is made such that it will store localization codes and the actual text value will be fetched only at the end. This way we can provide multi-lingual support. Localization service is also used to construct messages from templates. This dependency can be eliminated if you want to pass values instead of localization codes.
- `egov-filestore` : It is a dependency if you want to send/receive any file. This includes sending PDF/Image files.
- `egov-url-shortening` : For shortening links sent to the user
- `egov-mdms-service` : For loading mdms data
- `egov-location` : For loading locality data
- `rainmaker-pgr` : For creating/searching PGR complaints

### Swagger API Contract

http://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/core-services/RAIN-1288/docs/chatbot-contract.yml#!/

## Service Details

Chatbot service allows citizen to access PGR service through whatsapp. Citizen can provide all details required to create PGR complaint through question and answer method. The service continuosly listen on PGR update Kafka topic and send notifications to users associated with PGR record. On any message from citizen which is forwarded by whatsapp provider, chatbot processes his messages by passing message through various stages ex:- validations, enrichment, transformations etc and at the end sends final response to user by calling endpoint of whatsapp provider.

#### Configurations

There are two types of configurations for chatbot states:-
- Configuration for each state in chatbot, ex:-

   ```
   name : pgr.create.locality
   description : "Locality"
   nodeType : step
   optional : false

   type : text

   validationRequired : true
   typeOfValues : FixedSetValues
   displayOptionsInExternalLink: true

   message : chatbot.messages.pgrCreateLocality

   values :
     class : org.egov.chat.xternal.valuefetch.LocalityValueFetcher
     params :
       tenantId : ~pgr.create.tenantId
       authToken : /user/authToken
       recipient: /extraInfo/recipient

   matchAnswerThreshold: 70

   errorMessage: chatbot.messages.pgrCreateLocalityError
   ```

- Graph adjacency list configuration:- to define flow between chatbot states,ex:-

      root,pgr.create.tenantId,pgr.track.end
      pgr.create.tenantId,pgr.create.locality
      pgr.create.locality,pgr.create.landmark
      
> Note: For more information about these configs please refer technical documentation for the service from https://digit-discuss.atlassian.net/l/c/q8wfb0My

### API Details


a) `POST /messages`

Receive user sent message and forward it to chatbot core logic for further processing and sending back response

- If the `media_type` parameter value is `text` then user input would be sent in parameter `text`, in other cases where `media_type` have some other value ex:- image, location etc, the user input would be sent in parameter `media_data`

b) `GET /messages`

Receive user sent message and forward it to chatbot core logic for further processing and sending back response

- If the `media_type` parameter value is `text` then user input would be sent in parameter `text`, in other cases where `media_type` have some other value ex:- image, location etc, the user input would be sent in parameter `media_data`

### Kafka Consumers
- `update-pgr-service` : used in `update.pgr.service.topic` application property, chatbot listens on this topic to listen for updates on PGR records and then to send notifications to user.
- The service uses consumers for internal processing also between different stages.

### Kafka Producers
- `send-message-localized` : chatbot sends data to this topic for telemetry indexing and for internal processing.
- The service uses producers for internal processing also between different stages.
