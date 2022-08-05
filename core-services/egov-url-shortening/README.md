# Egov url shortening service

The egov-url-shortening service is used to shorten long urls. There may be requirement when we want to avoid sending very long urls to the user ex:- sms, whatsapp etc,
this service compresses the url.

### DB UML Diagram

- NA

### Service Dependencies

NA


### Swagger API Contract

http://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/core-services/gopesh67-patch-8/docs/url-shortening_contract.yml#!/

## Service Details
The egov-url-shortening is used to compress long urls. The converted short urls contains id, which is used by this service to identify and get longer urls. When user opens
short urls the service gets long url associated with id and redirects user to it.


#### Configurations
NA


### API Details


a) `POST /egov-url-shortening/shortener`

Receive long urls and converts them to shorter urls. Shortened urls contains urls to endpoint mentioned next. When user clicks on shortened url he is redirected to long url.


b) `GET /{id}`

This shortened urls contains path to this endpoint. The service uses id used in last endpoint to get long url. As response the user is redirected to long url

### Kafka Consumers
- NA

### Kafka Producers
- NA
