# Infra Indexer

### Egov indexer service

<p>Egov indexer service runs as a seperate service, This service is designed to perform all the indexing tasks of the egov platform. The service reads records posted on specific kafka topics and picks the corresponding index configuration from the yaml file provided by the respective module. </p>

### Features supported: 

- Multiple indexes of a record posted on a single topic
- Provision for custom index id
- Performs both bulk and non-bulk indexing
- Supports custom json indexing with field mappings, Enrichment of the input object on the queue
- Performs ES down handling

- Application properties (application.properties of the citizen-indexer application)
- Key : egov.indexer.yml.repo.path
- value : Path of the yml (https://raw.githubusercontent.com/egovernments/egov-services/master/citizen/citizen-indexer/src/main/resources/watercharges-indexer.yml,https://raw.githubusercontent.com/egovernments/egov-services/master/citizen/citizen-indexer/src/main/resources/property-tax.yml)

- Raw yml configuration :
- https://raw.githubusercontent.com/egovernments/egov-services/master/citizen/citizen-indexer/src/main/resources/watercharges-indexer.yml

### Explaination:
- mappings: List of mappings between topic name and respective index configurations.
- topic: The topic on which the input json will be recieved, This will be the parent topic for the list of index configs.
- indexes: List of index configuration to be applied on the input json recieved on the parent topic.
- name: name of the index.
- type: document type.
- id: Json path of the id to be used as index id while indexing. This takes comma seperated Jsonpaths to build custom index id. Values will be fetched from the json path and concatinated to form the indexId.
- isBulk: boolean value to signify if the input is a json array or json object, true in the first case, false other wise. Note: if isBulk = true, indexer will accept only array of json objects as input.
- jsonPath: Json Node path in case just a piece of the input json is to be indexed.
- customJsonMapping: Set of mappings for building an entirely new json object to index onto ES.
- indexMapping: Sample output json which will get indexed on to ES. This has to be provided by the respective module, if not provided, framework will fetch it from the ES. It is recommended to provide this.
- fieldMapping: This is a list of mappings between fields of input and output json namely: inJsonPath and outJsonPath. It takes inJsonPath value from input json and puts it to outJsonPath field of output json.
- uriMapping: This takes uri, queryParam, pathParam and apiRequest as to first build the uri and hit the service to get the response and then takes a list of fieldMappings as above to map fields of the api response to the fields of output json. Note: "$" is to be specified as place holder in the uri path wherever the pathParam is to be substituted in order. queryParams should be comma seperated.


This is the current state of the indexer framework, However there are some enhancements to be done to inculcate more use cases which will be done sooner and this documentation will be accordingly updated

