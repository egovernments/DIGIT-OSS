# eGov-Searcher

Searcher provides generic search for all the rest of the modules in the egov suite without having to make use of any platform based data models with only the help of yaml based configs. 

### DB UML Diagram




### Service Dependencies

- egov-user

### Swagger API Contract




## Service Details

Generic search provider for the egov suite. The service can be configured to provide search API for nay set of tables by providing yaml config for those. The searches uses json query from psql to extract table element directly as json rather than as a result set. 

The application will start successfully only when atleast one config file has been provided to the application as mentioned in the local setup.

### API Details

The Api path will be constructed based on the inbformation provided in the yaml file. These following variables from the yaml file will form the API - "moduleName","searchName" in the follwing way @PostMapping("/{moduleName}/{searchName}/_get"). The API upon being queried will return results in the form of json based on the output structure provided in the yaml config.

The API will not be found in the Application if the yaml config fails to load. Please find the sample yaml in the same folder.


### Kafka Consumers

### Kafka Producers
