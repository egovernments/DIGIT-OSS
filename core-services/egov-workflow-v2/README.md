# eGov-Workflow-v2 Service

Workflows are a series of steps that moves a process from one state to another state by actions performed by different kind of Actors - Humans, Machines, Time based events etc. to achieve a goal like on boarding an employee, or approve an application or grant a resource etc. The egov-workflow-v2 is a workflow engine which helps in performing this operations seamlessly using a predefined configuration. 

### DB UML Diagram
- NA

### Service Dependencies
- egov-mdms
- egov-user

### Swagger API Contract

Please refer to the [Swagger API contract](https://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/core-services/master/docs/worfklow-2.0.yml#!/) for egov-workflow-v2 service to understand the structure of APIs and to have visualization of all internal APIs.


## Service Details

### Functionalities
- Always allow anyone with a role in the workflow state machine to view the workflow instances and comment on it.

- On the creation of workflow it will appear in the inbox of all employees that have roles that can perform any state transitioning actions in this state. 

- Once an instance is marked to an individual employee it will appear only in that employees inbox although point 1 will still hold true and all others participating in the workflow can still search it and act if they have necessary action available to them.

- If the instance is marked to a person who cannot perform any state transitioning action, they can still comment/upload and mark to anyone else.

- **Overall SLA** : SLA for the complete processing of the application/Entity.

- **State level SLA** : SLA for a particular state in the workflow.

    | Environment Variables                     | Description                                                       |
    | ----------------------------------------- | ------------------------------------------------------------------|
    | `egov.wf.default.offset`                  | The default value of offset in search.                            | 
    | `egov.wf.default.limit`                   | The default value of limit in search                              | 
    | `egov.wf.max.limit`                       | Maximum number of records that are returned in search response    |
    | `egov.wf.statelevel`                      | Boolean flag set to true if statelevel workflow is required       |
    | `egov.wf.inbox.assignedonly`              | Boolean flag if set to true default search will return records assigned to the user only, if false it will return all the records based on user’s role. (default search is the search call when no query params are sent and based on the RequestInfo of the call, records are returned, it’s used to show applications in employee inbox) |

### Configuration Details

- The Workflow configuration has 3 level of hierarchy: 
   -  BusinessService
   -  State
   -  Action
   
    The top level object is BusinessService, it contains fields describing the workflow and list of States that are part of the workflow. The businessService can be defined at tenant level like pb.amritsar or at state level like pb.  All objects maintains an audit sub object which keeps track of who is creating and updating and the time of it
```json
{
        "tenantId": "pb.amritsar",
        "businessService": "PGR",
        "business": "pgr-services",
        "businessServiceSla": 432000000,
        "states": [...]
    }
```
   Each State object is a valid status for the application. The State object contains the information of the state and what actions can be performed on it.

```json
{
        "sla": 36000000,
        "state": "PENDINGFORASSIGNMENT",
        "applicationStatus": "PENDINGFORASSIGNMENT",
        "docUploadRequired": false,
        "isStartState": false,
        "isTerminateState": false,
        "isStateUpdatable": false,
        "actions": [...]
    }
```
The action object is the last object in hierarchy, it defines the name of the action and the roles that can perform the action.
```json
{
        "action": "ASSIGN",
        "roles": [
            "GRO",
            "DGRO"
         ],
        "nextState": "PENDINGATLME"
}
```
- The workflow should always start from null state as the service treats new applications as having null as the initial state. eg:
```json
{
        "sla": null,
        "state": null,
        "applicationStatus": null,
        "docUploadRequired": false,
        "isStartState": true,
        "isTerminateState": false,
        "isStateUpdatable": true,
        "actions": [
          {
            "action": "APPLY",
            "nextState": "APPLIED",
            "roles": [
                 "CITIZEN",
                 "CSR"
            ]
          }
        ]
}
```
- In action object whatever nextState is defined, the application will be sent to that state. It can be to another forward state or even some backward state from where the application have already passed
( generally such actions are named SENDBACK)

- SENDBACKTOCITIZEN is a special keyword for action name. This action sends back the application to citizen’s inbox for him to take action. A new State should be created on which Citizen can take action and should be the nextState of this action. While calling this action from module assignes should be enriched by the module with the uuids of the owners of the application.


### API Details

`BasePath` /egov-workflow-v2/egov-wf/[API endpoint]

##### Method
a) `/businessservice/_create`

This method is use to create new BuinessService.
    
b) `/businessservice/_update`

This methhod is use to update the existing BusinessServices.

c) `/businessservice/_search`

This method is use to get list of BusinessServices define in the system.

d} `/process/_transition`

This method handle the request to moves a process/application from one state to another state by actions performed by different role lile citizen, employee.

e) `process/_search`

This method search the list of transition performed on the application.

**`Postman collection`** :- https://www.getpostman.com/collections/8552e3de40c819e34190





### Kafka Consumers

- NA

### Kafka Producers

- Following are the Producer topic.
    - **save-wf-businessservice** :- This topic is used to save new BusinessService.
    - **update-wf-businessservice** ;- This topic is used to update the existing BusinessService.
    - **save-wf-transitions** :- This topic is use to save process transition for a application.
