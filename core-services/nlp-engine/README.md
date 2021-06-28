# Nlp-Engine service

In the existing version of the Punjab UAT chatbot, the process of user city and locality recognition is a bit inconvenient. The user needs to visit a link, select his/her city from a drop-down menu consisting of around 170 cities, and then return back to WhatsApp to continue the chat further. Using NLP, we can just ask the user to enter his city name and we can detect the user location using NLP techniques.

### DB UML Diagram

- NA

### Service Dependencies

- egov-mdms-service
- egov-location

### Swagger API Contract
- NA

## Service Details

Nlp-Engine service uses the city recognition algorithm to provide city and locality fuzzy search feature.

### Configurations
- NA

### API Details

a) `POST /nlp-engine/fuzzy/city`

Provides the list of cities which matches with highest matching probability against the system data.

b) `POST /nlp-engine/fuzzy/locality`

Provides the list of localities which matches with highest matching probability against the system data.


### Kafka Consumers

- NA

### Kafka Producers

- NA