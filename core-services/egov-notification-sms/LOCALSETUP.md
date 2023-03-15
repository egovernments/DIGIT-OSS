# Local Setup

This document will walk you through the dependencies of this service and how to set it up locally

- To setup the notification sms service in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infrastructure dependency

- [ ] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [x] Kafka
  - [x] Consumer
  - [ ] Producer


## Running Locally

To run the notification sms services locally, update below listed properties in `application.properties` before running the project:

```ini
 sms.provider.class=#{ This property decides which SMS provider is to be used by the service to send messages . Generic, Console, MSDG are the providers available}
sms.provider.contentType=#{ To configure form data or json api set sms.provider.contentType=application/x-www-form-urlencoded or sms.provider.contentType=application/json respectively }
sms.provider.requestType=#{Property to configure the http method used to call provider. Either `GET` or `POST` }
sms.provider.url=#{URL of the SMS gateway provider}
sms.provider.username=#{ Username as provided by the provider } 
sms.provider.password=#{ Password as provided by the provider }
sms.senderid=#{ SMS sender id provided by the provider }
sms.config.map=#{ Map of parameters to be passed to the API provider. {'uname':'$username', 'pwd': '$password', 'sid':'$senderid', 'mobileno':'$mobileno', 'content':'$message', 'smsservicetype':'unicodemsg', 'myParam': '$extraParam' , 'messageType': '$mtype'} }
sms.category.map=#{ replace any value in sms.config.map, see README for more details }
#sms.blacklist.numbers=#{ For blacklisting, a “,” separated list of numbers or number patterns, see README for more details}
#sms.whitelist.numbers=#{ For whitelisting, a “,” separated list of numbers or number patterns, see README for more details}
sms.mobile.prefix=#{ add the prefix to the mobile number coming in the message queue }
```

#### Message Success or Failure

Message success delivery can be controlled using below properties
- `sms.verify.response` (default: false)
- `sms.print.response` (default: false)
- `sms.verify.responseContains`
- `sms.success.codes` (default: 200,201,202)
- `sms.error.codes`

If you want to verify some text in the API call response set `sms.verify.response=true` and `sms.verify.responseContains` to the text that should be contained in the response

Special variables that are mapped

- `$username` maps to `sms.provider.username`
- `$password` maps to `sms.provider.password`
- `$senderid` maps to `sms.senderid`
- `$mobileno` maps to `mobileNumber` from kafka fetched message
- `$message` maps to the `message` from the kafka fetched message
- `$<name>` any variable that is not from above list, is first checked in `sms.category.map` and then in `application.properties` and then in environment variable with full upper case and `_` replacing `-`, space or `.`