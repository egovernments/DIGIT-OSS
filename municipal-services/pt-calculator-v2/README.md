# pt-calculator-v2

This service is used to calculate the property assessment tax fees and property mutation fees based on the defined billing slabs. The service is designed in such way that it can be used to serve different type of property. 

### DB UML Diagram

- To Do

### Service Dependencies

- property-services
- billing-service
- egov-mdms-service
- collection-services

### Swagger API Contract

- Please refer to the below swagger API contract for pt-calculator service to understand the structure of APIs and to have visualization of all internal APIs.
    - [Swagger API contarct](https://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/egov-services/master/docs/propertytax/contracts/pt-calculator/v1.0.0.yml#!/)
    - [Swagger API contarct for mutation](https://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/municipal-services/master/docs/property-services/property-mutation-fees-calculator_API_Contract.yml#!/)



## Service Details

pt calculator application is used to calculate the property assessment tax fees and property mutation fees based on the different billing slabs in the DB. Every Billing Slab combination has its own demand configurations.
Once the demand is created for the combination, it calls billing-services API to generate the fees.

### API Details

`BasePath` /pt-calculator-v2/[API endpoint]

##### Method

`billingslab/_create` : API used to create the billing slabs for property assessment tax fees in the system

`billingslab/_search` : API used to search the property assessment tax fees billing slabs.

`billingslab/_update` : API used to update the existing property assessment tax fees billitaxng slabs.

`billingslab/mutation/_create` : API used to create the billing slabs for property mutation fees in the system

`billingslab/mutation/_search` : API used to search the property mutation fees billing slabs.

`billingslab/mutation/_update` : API used to update the existing property mutation fees billing slabs.

`propertytax/v2/_estimate` : API used to calculates the property assessment tax fees based on applicable billing slab. .

`propertytax/_calculate` : API used to generate the demand in the system.

`propertytax/_updatedemand` : API used to update the demand in the system.

`propertytax/_getbill` : API used to get the bill against the property application in the system.

`propertytax/mutation/_calculate` : API used to calculates the property mutation fees based on applicable billing slab.



### Kafka Consumers
- Following are the kafka consumer:
    - **save-pt-property**, **update-pt-property** : This kafka topic are use for demand generation for property assessment.


### Kafka Producers

`save-pt-billingslab` : pt-claculator sends data to this topic to store the billing slab data for property assessment tax.
`update-pt-billingslab` : pt-claculator sends data to this topic to update the billing slab data for property assessment tax.
`save-pt-mutation-billingslab` : pt-claculator sends data to this topic to store the billing slab data for property mutation fees.
`update-pt-mutation-billingslab` : pt-claculator sends data to this topic to update the billing slab data for property mutation fees.
