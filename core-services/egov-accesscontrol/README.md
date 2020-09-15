# Access Control Service
### Egov Access Control Service
DIGIT is API based Platform here each api is denoting to a DIGIT resource.
Access Control Service(ACS) main job is to Authorize end user based on their roles and provide access of the DIGIT platform resources.

### DB UML Diagram

- NA

### Service Dependencies
- egov-mdms service

### Swagger API Contract

- Please refer to the [Swagger API contarct](https://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/egov-services/master/docs/egov-accesscontrol/contracts/v1-0-1.yml#!/) for access control service to understand the structure of APIs and to have visualization of all internal APIs.

## Service Details

Access control functionality basically works based on below points:

- **Actions:** Actions are events which is performed by an user. This can be a api end-point or Frontend event. This is MDMS master

- **Roles:** Role are assigned to user, a user can hold multiple roles. Roles are defined in MDMS masters.

- **Role-Action:** Role actions are mapping b/w Actions and Roles. Based on Role,Action  mapping access control service identifies applicable action for role.    

**Feature List V1:**
- Serve the applicable actions for a user based on user role.
- On each action which is performed by an user, access control look at the roles for the user and validate actions mapping with the role.

**Feature List V1.1(Impacted from user changes):**
- Action authorization for multi tenant user.
- Module tenant mapping validation based on city-tenant master data from MDMS.

**Feature List V1.2(Impacted from user changes):**
- Actions,Role,& Role-action has to be simplified.(Denormalization)
- Support tenant level role-action

For Action-Role mapping following mdms file has to update.
- [action-test.json](https://raw.githubusercontent.com/egovernments/egov-mdms-data/master/data/pb/ACCESSCONTROL-ACTIONS-TEST/actions-test.json)
- [roleaction.json](https://raw.githubusercontent.com/egovernments/egov-mdms-data/master/data/pb/ACCESSCONTROL-ROLEACTIONS/roleactions.json)

In **action-test.json** mdms file, action(url) has to be mention as given below example
```json
{
  "tenantId": "pb",
  "moduleName": "ACCESSCONTROL-ACTIONS-TEST",
  "actions-test": [
    {
          "id": 100,
          "name": "BillingSlabCreate",
          "url": "/pt/billingslab/mutation/_create",
          "displayName": "Billing Slab Create",
          "orderNumber": 1,
          "parentModule": "",
          "enabled": false,
          "serviceCode": "pt-v2",
          "code": "null",
          "path": ""
        }
  ]
}
````

For the action id added in above file, same id has to be mention in **roleaction.json** mdms file with necessary roles.
Refer to the action given below.
```json
{
    "tenantId": "pb",
    "moduleName": "ACCESSCONTROL-ROLEACTIONS",
    "roleactions": [
      {
        "rolecode": "PT_FIELD_INSPECTOR",
        "actionid": 100,
        "actioncode": "",
        "tenantId": "pb"
      },
      {
        "rolecode": "PT_DOC_VERIFIER",
        "actionid": 100,
        "actioncode": "",
        "tenantId": "pb"
      },
      {
        "rolecode": "EMPLOYEE",
        "actionid": 100,
        "actioncode": "",
        "tenantId": "pb"
      }
    ]
}
````

### API Details

`BasePath` /access/v1/[API endpoint]

##### Method

a) `actions/_search`

- This method is use to get the list of actions based on either roles or features..

b) `actions/_create`

- This methhod is use to create a new action. An action entry is required for each and every path to authenticate the access based on the assigned role of an user.

c) `actions/_update`

- This method is use to update the existing action(s) in the system.

d} `actions/_validate`

- This method validate a particular action for a given tenant and roles of the tenant.

e) `roles/_search`

- This method is use to get the list of roles based on role codes in the input parameters.

f) `roles/_create`

- This method is use to create new Role(s) in the system.

g) `roles/_update`

- This method is use to update the existing role(s) in the system.

### Kafka Consumers

- NA
### Kafka Producers

- NA