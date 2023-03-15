# egov-notification-sms service

Notification SMS service consumes SMS from the kafka notification topic and process them to send it to an third party service.

### DB UML Diagram

- NA

### Service Dependencies
- NA

### Swagger API Contract

- NA

## Service Details

This service is a consumer, which means it reads from the kafka queue and doesn’t provide facility to be accessed through API calls, there’s no REST layer here. The producers willing to integrate with this consumer will be posting a JSON  onto the topic configured at ‘kafka.topics.notification.sms.name’.
The notification-sms service reads from the queue and sends the sms to the mentioned phone number using one of the SMS providers configured. 

The implementation of the consumer is present in the directory `src/main/java/org/egov/web/notification/sms/service/impl`.

These are current providers available
- Generic
- Console
- MSDG

The implementation to be used can be configured by setting `sms.provider.class`. 

### Console

The `Console` implementation just prints the message mobile number and message to the console

### Generic implementation

This is the default implementation, which can work with most of the SMS Provider. The generic implementation supports below
- GET or POST based API
- Supports query params, form data, JSON Body

To configure the url of the SMS provider use `sms.provider.url` property
To configure the http method used configure the `sms.provider.requestType` property to either `GET` or `POST`.

To configure form data or json api set `sms.provider.contentType=application/x-www-form-urlencoded` or `sms.provider.contentType=application/json` respectively

To configure which data needs to be sent to the API below property can be configured:

- `sms.config.map`={'uname':'$username', 'pwd': '$password', 'sid':'$senderid', 'mobileno':'$mobileno', 'content':'$message', 'smsservicetype':'unicodemsg', 'myParam': '$extraParam' , 'messageType': '$mtype'}
- `sms.category.map`={'mtype': {'*': 'abc', 'OTP': 'def'}}
- `sms.extra.config.map`={'extraParam': 'abc'}

`sms.extra.config.map` is not used currently and is only kept for custom implementation which requires data that doesn't need to be directly passed to the REST API call

`sms.config.map` is a map of parameters and their values

Special variables that are mapped

- `$username` maps to `sms.provider.username`
- `$password` maps to `sms.provider.password`
- `$senderid` maps to `sms.senderid`
- `$mobileno` maps to `mobileNumber` from kafka fetched message
- `$message` maps to the `message` from the kafka fetched message
- `$<name>` any variable that is not from above list, is first checked in `sms.category.map` and then in `application.properties` and then in environment variable with full upper case and `_` replacing `-`, space or `.`

So if you use `sms.config.map={'u':'$username', 'p':'password'}`. Then the API call will be passed `<url>?u=<$username>&p=password`


#### Message Success or Failure

Message success delivery can be controlled using below properties
- `sms.verify.response` (default: false)
- `sms.print.response` (default: false)
- `sms.verify.responseContains`
- `sms.success.codes` (default: 200,201,202)
- `sms.error.codes`

If you want to verify some text in the API call response set `sms.verify.response=true` and `sms.verify.responseContains` to the text that should be contained in the response


#### Blacklisting or Whitelisting numbers

It is possible to whitelist or blacklist phone numbers to which the messages should be sent. This can be controlled using below properties:

- `sms.blacklist.numbers`
- `sms.whitelist.numbers`

Both of them can be given a `,` separated list of numbers or number patterns. To use patterns use `X` for any digit match and `*` for any number of digits match.

`sms.blacklist.numbers=5*,9999999999,88888888XX` will blacklist any phone number starting with `5`, or the exact number `9999999999` and all numbers starting from `8888888800` to `8888888899`

#### Prefixing

Few 3rd party require a prefix of `0` or `91` or `+91` with the mobile number. In such a case you can use `sms.mobile.prefix` to automatically add the prefix to the mobile number coming in the message queue.

#### Error Handling

There are different topics to which the service will send messages. Below is a list of the same:

```ini
kafka.topics.backup.sms
kafka.topics.expiry.sms=egov.core.sms.expiry
kafka.topics.error.sms=egov.core.sms.error
```

In an event of a failure to send SMS, if `kafka.topics.backup.sms` is specified, then the message will be pushed on to that topic.

Any SMS which expire due to kafka lags, or some other internal issues, they will be passed to topic configured in `kafka.topics.expiry.sms`

If a `backup` topic has not been configured, then in an event of an error the same will be delivered to `kafka.topics.error.sms`

### Kafka Consumers
`egov.core.notification.sms` : egov-notification-sms listens to this topic to get the data


### Kafka Producers

- NA