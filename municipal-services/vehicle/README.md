# Vehicle

Vehicle Registry is a system that enables ULB Employees to create and search Vehicle Entities and schedule Vehicle Trip for FSM Application and track the VehicleTrip. This document contains the details about how to setup the Vehicle and describe the functionalities provided.

### DB UML Diagram


![plot](./vehicle.png)

### Service Dependencies


- egov-mdms-service
- egov-workflow-v2
- user-service
- egov-idgen


### Swagger API Contract

Link to the swagger API contract [yaml](https://raw.githubusercontent.com/egovernments/municipal-services/master/docs/fsm/Vehicle_Registry_Contract.yaml) and editor link like below


### Postman Collection
Link to the postman collection [here](https://www.getpostman.com/collections/d2541409b9570e53ed26)


## Service Details

**Vehicle Registry**

- Contains the API's to create,  search Vehicle

** Vehicle Trip **

- Contains the API's create, update, search vehicle Trip.
- Vehicle Trip will be created by FSM Application when, DSO Assign's the Vehicle to FSM Application in Scheduled Status
- update api helps move the vehilce trip application from one state to other state.
- search api fetches the VehicleTrip records based on the search criteria



### API Details

`v1/_create` 		: The create api to create Vehicle in the system

`v1/_search`		: The search api to fetch the vehicles in the system based on the search criteria


`trip/v1/_create` : The create api to create VehicleTrip for a given vehicle and given FSM Application.

`trip/v1/_update`  :The update api to update the existing VehicleTrip following the workflow.

`trip/v1/_search` : The search api search for vehicleTrip based on search criteria.


### Reference Document
TBD


### Kafka Consumers


### Kafka Producers


- **save-vehicle-application** 			: service sends data to this topic to create new Vehicle.


- **save-vehicle-trip** 				: service sends data to this topic to create new vehicle Trip.


- **update-vehicle-trip** 				: service sends data to this topic to update the existing vehicleTrip

- ** update-workflow-vehicle-trip ** 	: service sends data to this topic to update the existing vehicleTrip only workflow status.