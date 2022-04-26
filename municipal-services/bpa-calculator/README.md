
# bpa-calculator

bpa-calculator service used to generate Application Fee, Sanction Fee, Low Application Permit Fee, Deviation Charges for  building permit and Occupancy Certificate Application.Based on the Application Type, RiskType and ServiceType Fee to be calculated and generates a demand for the calculated amount for Payment. 

### DB UML Diagram



### Service Dependencies

- dcr-services (Use Edcr data )

- egov-mdms ( Configurations/master by MDMS )

- billing-service ( Generate and update demands )

- bpa-services (Get the bpa application data for fee calculation )

### Swagger API Contract

 - [Swagger API](https://github.com/egovernments/municipal-services/blob/master/docs/bpa/bpa-calculator.yaml)

## Service Details

bpa-calculator service present in municipal services provides multiple functionalities like calculating Application Fee, Sanction Fee, Low Permit Fee, OC Deviation Charges, generating demands for a particular BPA, BPA occupancy certificate applications and demand updation.

### API Details
- Calculate : bpa-calculator/v1/_calculate end point used to calculate the Fee and create Demand with the applicable businessService and TaxHeads

### Kafka Consumers
NA

### Kafka Producers
- persister.save.bpa.calculation.topic=save-bpa-calculation
