# fsm-calculator

FSM Calculator is a system that enables FSM Admin to create billing slab for the FSM application(s) with different combination of propertyType , slum , tank capacity and etc..

Generates the Demand after calculating the charges for the given application using the billing slab already configured. This document contains the details about how to setup the fsm-calculator service and description the functionalities it provides.   

### DB UML Diagram

![plot](./fsm-calculator.png)

### Service Dependencies

- billing-service
- mdms-service
- workflow-v2
- user-service
- vendor
- vehicle


### Swagger API Contract

Link to the swagger API contract [yaml](https://raw.githubusercontent.com/egovernments/municipal-services/master/docs/fsm/Fsm_Apply_Contract.yaml) and editor link like below


### Postman Collection
Link to the postman collection [here](https://www.getpostman.com/collections/8b9eb951a810486f41a4)


## Service Details

**Faecal sludge management Calculator: fsm-calculator**

- Contains the API's to create, update, search billing Slab with certain combination
- Contains the API's to calculate and generate Demand for FSM Application and return the Estimate of the Charges for Given FSM.



### API Details

`_calculate` : This API calculates the TRIP Charge fees based on the billing slab identified for FSM Application.

`_estimate` : This API returns the estimate of the TRIP Charges for the given FSM Application.

`billingSlab/_create` : The create api to create BillingSlab with the combination of tankCapacity, Slum and propertyType.

`billingSlab/_update`  :The update api to update the existing billingSlab for the given combination of tankCapacity, Slum and PropertyType.

`billingSlab/_search` : The search api search for the billngslab based on the search criteria.


### Reference Document
TBD


### Kafka Consumers


### Kafka Producers
- **save-fsm-billing-slab** : service sends data to this topic to create new billing slab.


- **update-fsm-billing-slab** : service sends data to this topic to update the billing slab