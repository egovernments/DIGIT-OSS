

# dashboard-analytics


DSS Analytics Module is used to return aggregated data from elastic search indexes which is displayed on UI to gain meaningful insights from the data

### DSS Analytics 
The analytics service creates/wraps queries based on the configuration provided and executes it on the elastic search to fetch the aggregated data.
This aggregated data is then transformed to AggregateDTO by Response Handlers. AggregateDTO contains list of object called Plots. This plot object are created based on the chart type defined in the configuration. The module also provides functionality to compare the data with previous time period,which can be configured 
by defining insight in the chartAPI configuration for the required chart.




### Project Structure 
*Packages*
 - constant - Contains all the constant values
 - controller - Controllers for the app.
 - dao - DAO layer
 - dto - contains POJO's which are used to manage data returned from queries
 - enums - Enum definitions
 - exception - POJO for the module.
 - handler - Reponse Handlers which converts the aggregated data to AggregationDTO object based on chart type defined
 - helper - Helper classes to do computations on data
 - model - POJO's related to chart config
 - org.service - Consists of all services containing the business logic.
 - query.model - POJO's related to building query
 - repository - Fetches data from elastic search
 - service - Implementations of services which help with fetching data
 - utils - Contains utility functions.


### Resources
- Granular details about the API's can be found in the [swagger api definition](https://raw.githubusercontent.com/egovernments/business-services/master/Docs/dss-dashboard/DSS%20Analytics%20Dashboard%20YAML%20Spec%201.0.0.yaml)
- Postman collection for all the API's can be found in the [postman collection](https://www.getpostman.com/collections/0894f347322bed5bea1a)


## Build & Run


    mvn clean install
    java -jar target/analytics-1.1.0-SNAPSHOT.jar


## Dependencies


- Elastic search database to fetch data from index.



