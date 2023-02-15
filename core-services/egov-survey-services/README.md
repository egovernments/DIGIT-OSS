# eGov Survey service

Survey service will be used by ULB employees to create citizen surveys to make better informed decisions while issuing new policies/ feedback on existing services.

### DB UML Diagram
- NA

### Service Dependencies
- egov-mdms
- egov-idgen
- egov-localization

### Swagger API Contract

Please refer to the [Swagger API contract](https://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/DIGIT-OSS/master/core-services/docs/survey-service.yml) for egov-survey-service to understand the structure of APIs and to have visualization of all internal APIs.


### Functionalities
This service allows - 

Employees - to create, edit, delete surveys

Employees - to share survey results with other employees/citizens

Citizens - to fill surveys

 

Each survey entity will have questions associated with it. Questions can be of - 

  1. short answer type

  2. long answer type

  3. multiple answers type

  4. checkbox answer type

  5. date answer type

  6. time answer type

 

Survey entities will have a collectCitizenInfo flag associated with them, if that flag is set to true, mobile number and email address of the citizens responding to the survey will be captured. If it is set to false, responding to the survey will be completely anonymous.

 

Surveys will have a startDate and endDate associated with them. Within that period, those surveys will be shown in the active section. However, in case the survey has been manually marked inactive by the employee during its active period, that survey will be shown under the inactive surveys section. Citizens can look at active survey entities and submit their responses for that survey.

 

Once a survey is created, it can be searched with the following parameters - 

tenantIds - To search surveys based on multiple ulbs

title - To search surveys based on survey names

postedBy - To search surveys based on employee who created the survey

status - To search surveys based on status

 

Also, if any created survey needs to be updated -

Before the survey becomes active, users can edit all the fields.

Once the survey becomes Live user can only change 

a. Survey Description

b.End date and time of the survey

 

In case of deletion of a survey, the survey will be soft deleted i.e. the ‘active’ boolean field will be set to false and it will not appear in search results.

### API Details

1. /egov-survey-services/egov-ss/survey/_create - Takes RequestInfo and SurveyEntity in request body. Survey entity has all the parameters related to the survey being created.

2. /egov-survey-services/egov-ss/survey/_search - Allows searching of existing surveys in the database. Takes search parameters in url and RequestInfo in request body.

3. /egov-survey-services/egov-ss/survey/_update - Allows updating of survey parameters according to the uuid provided in the request.

4. /egov-survey-services/egov-ss/survey/_delete - Soft deletes an existing survey from the database i.e. it makes the survey inactive. 

5. /egov-survey-services/egov-ss/survey/response/_submit - Allows citizens to respond to active surveys.

6. /egov-survey-services/egov-ss/survey/response/_results - Allows employees to look at the responses that have been registered for any survey.

**`Postman collection`** :- https://www.getpostman.com/collections/76c0ee0703fab656835d





### Kafka Consumers

- NA

### Kafka Producers

- Following are the Producer topic.
    - **save-ss-survey** :- This topic is used to save new survey.
    - **update-ss-survey** ;- This topic is used to update the existing survey.
    - **delete-ss-survey** :- This topic is used to delete document.
    - **save-ss-answer** :- This topic is used to submit response to a survey.