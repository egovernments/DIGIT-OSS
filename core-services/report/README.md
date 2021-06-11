# Report Service
Reporting Service is a service running independently on seperate server. This service loads the report configuration from a yaml file at the run time and provides the report details by using
couple of APIS.


### DB UML Diagram

- NA

### Service Dependencies
- `egov-enc-service`: used for decryption of user PII data if required
- `egov-mdms-service`: used by encryption library to load encryption configs

### Swagger API Contract
http://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/egov-services/master/docs/reportinfra/contracts/reportinfra-1-0-0.yml#!/

## Service Details

#### Features supported
- Provides metadata about the report.
- Provides the data for the report.
- Reload the configuration at runtime

### YML configuration
- All the module yml configurations are located in https://github.com/egovernments/configs/tree/master/reports

### Sample yml configuration :
- https://raw.githubusercontent.com/egovernments/egov-services/master/docs/citizen/reports/report.yml


#### Report Configuration Details:
- reportName: Name of the report<br />
- summary: Summary message for the report(AssetReport)<br />
- version: version of the report(optional)<br />
- moduleName: modulename of which the report belongs to (eg : asset)<br />
- sourceColumns: - (list of source columns fetched from the query.)<br />
  - name: receiptNo (column name)<br />
  - label: reports.citizen.receiptno (label which will get displayed in the report)<br />
  - type: string (typr of the column)<br />
  - source: citizen (source module)<br />
- searchParams:(list of search parameters which is required for the report)<br />
  - name: consumerno (name of the search param)<br />
  - label: reports.citizen.consumerno (label which will be used for displaying the search param. It has to be created in common.js Front end team will update this information)<br />
  - type: string (type of the search param)<br />
  - source: (source module)<br />
  - isMandatory: false (specifies whether the search param is optional or not)<br />
  - searchClause: and consumerNo = $consumerno (Search clause will get appended to the query based on the ismandatory flag. if it is false and the search param is having that parameter then it will get appended
    otherwise it will not get appended)<br />
- query: (query string which needs to get execute to generate the report with the place holders for the search params. refer - sample config for clarifications)<br />
- groupby: group by clause if needed(group by fieldname)<br />
- orderby: order by clause if needed(order by fieldname asc)<br />

#### Call the MDMS or any other API with the post method
1. Configuring the post object in the yaml itself like below.

- externalService:
  - entity: $.MdmsRes.egf-master.FinancialYear
    - apiURL:  http://localhost:8094/egov-mdms-service/v1/_search
    - keyOrder: finYearRange,startingDate,endingDate,tenantId
    - tableName: tbl_financialyear
    - stateData: true
    - postObject:
      - tenantId: $tenantid
      - moduleDetails:
        - moduleName: egf-master
        - masterDetails:
          - name: FinancialYear
          filter: "[?(@.id IN [2,3] && @.active == true)]"
2. Keep the post object in a seperate json file externally and call at runtime.

### API Details:
a) `POST /report/{moduleName}/metadata/_get`

This request to report service is made to get metadata for any report. The metadata contains information about search filters to be used in the report before actually sending request to get actual data. The user selected values are then used in GET_DATA request to filter data.

b) `POST /report/{moduleName}/_get`

This request to report service is used to get data for the report. Inputs given by user for filters are sent in request body. These filters values are used while querying data from DB.

### Kafka Consumers

- NA

### Kafka Producers

- `audit_data`: used in `kafka.topic.audit` property to push audit data from decryption process
