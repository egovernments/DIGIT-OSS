# tl-services

This service is used to issue license to user after verification. The service is designed in such way that it can be used to serve different type of licenses. 
Currently used to issue trade licenses, perform stakeholder registration and issue lock down pass.  The service is integrated with workflow where we can define 
the steps for approval of the application.

### DB UML Diagram

- TBD

### Service Dependencies

- tl-calculator
- billing-service
- egov-mdms-service
- egov-localization
- egov-idgen
- egov-user

### Swagger API Contract

Link to the swagger API contract yaml and editor link like below

http://editor.swagger.io/?url=https://github.com/egovernments/egov-services/blob/master/docs/rainmaker/trade-license/tl-service.yml#!/


## Service Details

Tl service in integrated with Workflow steps. We can as many internal states/action to be performed on the applications which is configurable.
The license is generated once the application is approved. The notifications are sent over every steps in the workflow.

### API Details

`_create` : This API is used to create an application for the license in the system. Whenever an application is created a application number is generated and assigned to the application for future reference.

`_search` : This API is used to search the applications in the system based on various search parameters like mobile number, application number,status etc.

`_update` : The _update API is used to update the application information or to forward the application from one state to another.


### Reference Document

All the details and configurations on the services are explained in the document `https://digit-discuss.atlassian.net/l/c/kX09Zd5D`

### Kafka Consumers

`update-tl-tradelicense` : TL consumer listens to this topic to get the updated data
`save-tl-tradelicense` : TL consumer listens to this topic to get the TL data
`update-tl-workflow` : TL consumer listens to this topic to get the workflow data

### Kafka Producers

`save-tl-tradelicense` : tl-services sends data to this topic to push to the database table.
`update-tl-tradelicense` : tl-services sends data to this topic to update the entries to the database table.
`update-tl-workflow` : tl-services sends data to this topic to update the workflow data.
`egov.collection.payment-create` : Service sneds dats to this topic when the payments is triggered.
`notification.sms` : This topic is used to send the sms notification
`persist-user-events-async` : TL uses this topic to save the event notification