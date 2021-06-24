# Egov indexer service

<p>Egov indexer service runs as a seperate service, This service is designed to perform all the indexing tasks of the egov platform. The service reads records posted on specific kafka topics and picks the corresponding index configuration from the yaml file provided by the respective module. </p>

### DB UML Diagram

- NA

### Service Dependencies

- `egov-mdms-service`: For enriching mdms data if mentioned in config


### Swagger API Contract

http://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/core-services/RAIN-1284/docs/indexer-contract.yml#!/

## Service Details

Egov indexer service is used in egov platform for all indexing requirements. This service performs three major tasks namely: LiveIndex (indexing the live transaction data), Reindex (indexing data from one index to the othe) and LegacyIndex (indexing legacy data from the DB). For any indexing requirement we have to add a config. There we define source and, destination elastic search index name, custom mappings for data transformation and mappings for data enrichment. Currently following features are supported :-
- Multiple indexes of a record posted on a single topic
- Provision for custom index id
- Performs both bulk and non-bulk indexing
- Supports custom json indexing with field mappings, Enrichment of the input object on the queue
- Performs ES down handling

#### Configurations
ex:- https://raw.githubusercontent.com/egovernments/configs/master/egov-indexer/property-services.yml

The different fields used in index config are following:-
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


### API Details


a) `POST /{key}/_index`

Receive data and index. There should be a mapping with topic as `{key}` in index config files.

b) `POST /_reindex`

This is used to migrate data from one index to another index

c) `POST /_legacyindex`

This is to run LegacyIndex job to index data from DB. In the request body the URL of the service which would be called by indexer service to pick data, must be mentioned.


> Note: In legacy indexing and for collection-service record LiveIndex kafka-connect is used to do part of pushing record to elastic search. For more details please refer https://digit-discuss.atlassian.net/l/c/mxncnagK

### Kafka Consumers
- The service uses consumers for topics defined in index configs to read data which is to be indexed.

### Kafka Producers
- `dss-collection-update` : used in `egov.indexer.dss.collectionindex.topic` application property, indexer service sends collection service data to this topic to be used by DSS module
- The indexer service produces to topic which is `{index_name}-enriched`, for providing option to use kafka-connect for pushing records to elastic search
- In case of legacy indexing, indexer service would produce data fetched from api call to external service to topic mentioned in `topic` field of config.
