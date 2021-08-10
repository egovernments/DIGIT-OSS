# Egov-HRMS Service
### HRMS Service
The objective of HRMS is to provide a service that manages all the employees enrolled onto the system. HRMS provides extensive APIs to create, update and search the employees with attributes like assignments, service history, jurisdiction etc. HRMS can be treated a sub-set of the egov-user service, Every employee created through HRMS will also be created as a user in egov-user. 

### DB UML Diagram

- NA

### Service Dependencies
- egov-user
- egov-localization
- egov-idgen
- egov-mdms
- egov-filestore

### Swagger API Contract
- Please refer to the [Swagger API contarct](https://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/business-services/master/Docs/hrms-v1.0.0.yaml#!/) for HRMS service to understand the structure of APIs and to have visualization of all internal APIs.


## Service Details
**Details of all the entities involved:** 

**a) Assignments:** Every employee is assigned a list of assignments, every assignment is a designation provided to that employee for a given period of time. These designations are mapped to departments. This also includes marking the employee as HOD for that dept if needed. Employee can also provide information on who does he report to.
   
   - **Constraints:**
        1. For a given period of time an employee shouldn't have more than one assignments.
        2. The department and designation part of the employee must be configured in the system.
        3. Details of assignment once entered in the system cannot be deleted.
        4. An employee cannot have more than one active assignment.

**b) Jurisdictions:** A jurisdiction is a area of power for any employee. It can be a zone, ward, block, city, state or the country. Currently a jurisdiction is defined as combination of Hierarchy type, Boundary Type and the actual Boundary. However, in the current system we are not validating these jurisdictions. This is being collected only for the sake of data.
   
   - **Constraints:**
        1. The details pertaining to a jurisdiction like Hierarchy, Boundary Type and Boundary must be configured in the system.
        2. An employee can have more than one jurisdictions.
        3. Currently in the system jurisdiction is limited to within a ULB.

**c) Service History:** Service history is the record of an employee's professional experience. It captures information about location and period of work with necessary order number. Information about the current work details are to be entered here.
   
   - **Constraints:**
        1. There's no rule on period, dates of different services can overlap.
        2. There's no cap on the number of entries in the service history.
        3. Captured as legacy data.

**d) Educational Details:** Captures educational details of the employee. Captures information like Degree, Year of Passing, University, Specialization etc as part of the educational details.
   
   - **Constraints:**
        1. Details pertaining to educational details like Degree, Specialization must be configured.


**e) Departmental Tests:** Captures details of the tests undertaken by the employee. Like name of the test and year of passing.
   
   - **Constraints:**
        1. Test details must be configures in the system.  

**f) Deactivation Details:** Details of deactivation of the employee, which captures reason for deactivation, period of deactivation and other necessary details. 
  
   - **Constraints:**
        1. Deactivation details are compulsory while deactivating an employee.

**f) Reactivation Details:** Details of reactivation of the employee, which captures reason for reactivation, the effective date from when reactivation take place and other necessary details. 
  
   - **Constraints:**
        1. Reactivation details are compulsory while reactivating an employee.
   


**Uniqueness Constraints:**
- Employee code has to be unique and will be used as username for login.
- Phone number has to be unique, which means no 2 employees can have the same phone number. 



**Notification:**
- Notification is sent to the phone number of the employee who has been created in the system. This is an SMS notification.

### Configurable properties

| Environment Variables                     | Description                                                                                                                                               | Value                                             |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|
| `egov.hrms.employee.app.link`             | This is the link to the mseva app, which differs based on the environment.                                                                                | https://mseva.lgpunjab.gov.in/employee/user/login |
| `egov.hrms.default.pagination.limit`      | This is the pagination limit on search results of employee search, it can be set to any numeric value without decimals.                                   | 200                                               |
| `egov.hrms.default.pwd.length`            | This is the length of password to be generated at the time of employee creation. However, please ensure this is in sync with the egov-user pwd policy.    | 10                                                |
| `open.search.enabled.roles`               | This is a list of Role codes that are allowed to perform an open-search in hrms.                                                                          | SUPERUSER,ADMIN                                   |
| `egov.idgen.ack.name`                     | Key to be configured in Idgen alongwith the ID format to generate employee code.                                                                          | hrms.employeecode                                 |
|  `egov.idgen.ack.format`                  | Format to be configured in ID gen to generate employee code.                                                                                              | EMP-[city]-[SEQ_EG_HRMS_EMP_CODE]                 |
### API Details

`BasePath` /egov-hrms/employees/[API endpoint]

##### Method
**a) Create Employee `POST /_create` :** API (Bulk API) to create an employee with the following details: Assignments, Jurisdictions, Service History, Educational Details, Departmental Tests

**b) Update Employee `POST /_update` :** API (Bulk API) to update the details of an employee with the following details: Assignments, Jurisdictions, Service History, Educational Details, Departmental Tests. There are constraints under which the update works, which are listed in the details of entities. As part of the personal details of the employee, Code of the employee cannot be updated once created.

Deactivation is a part of the update API where the employee is marked inactive. This marks the user entry of this employee also as inactive. While deactivating an employee it is mandatory to provide deactivation details as well.

**c) Search Employee `POST /_search` :** API to search the employee in the system on the following criteria: Id, UUID, Name, Code, Status, Type, Department, Designation, Position. All of them being arrays, at a time more than one employees can be fetched.
Constraints: a. Open Search is enabled only for a set of users. Currently it is enabled only for SUPERUSER, if it has to be enabled for other roles, add those roles to the parameter 'open.search.enabled.roles' in app.properties with values(role codes) separated by comma.

**d) Count of Employee `POST /_count` :** This API is use to get list of active and inactive employee present in the system.

### Kafka Consumers

- NA

### Kafka Producers

- Following are the Producer topic.
    - **save-hrms-employee** :- This topic is used to create new employee in the system.
    - **update-hrms-employee** :- This topic is used to update the existing employee in the systen.
    - **egov.core.notification.sms** :- This topic is used to send noification to the phone number of the employee who has been created in the system.