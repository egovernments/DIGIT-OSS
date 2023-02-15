# BTR Calculator

This module calculates the birth registration application
charges and creates bill for the application.

### Service Dependencies
- egov-mdms
- billing service

## Service Details

The service generates demand based on input amount from
mdms.

### API Details

`BasePath` /birth-calculator/v1/[API endpoint]

#### Method

a) `_calculate`
- Calculates the amount due and generates the demand.

b) `_getbill`
- Fetches the bill for given application number.
