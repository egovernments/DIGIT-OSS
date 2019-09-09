# Reporting Framework
### Reporting Service
Reporting Service is a service running independently on seperate server. This service loads the report configuration from a yaml file at the run time and provides the report details by using
couple of APIS.
#### Features supported
- Provides metadata about the report.
- Provides the data for the report.
- Reload the configuration at runtime

### YML configuration
- All the module yml configurations are located in docs/{modulename}/report/report.yml

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
### API Details:

/report/asset/metadata/_get

Request  Sample for Metadata API:
{
   "RequestInfo": {<br />
       "apiId" : "emp",<br />
       "ver" : "1.0",<br />
       "ts" : "10-03-2017 00:00:00",<br />
       "action" : "create",<br />
       "did" : "1",<br />
       "key" : "abcdkey",<br />
       "msgId" : "20170310130900",<br />
       "requesterId" : "rajesh",<br />
       "authToken" : "0348d66f-d818-47fc-933b-ba23079986b8"<br />
      
   } ,<br />
   "tenantId" : "default",<br />
   "reportName" :"ImmovableAssetRegister"<br />
   
}<br />
#########################

/report/asset/_get<br />

{<br />
   "RequestInfo": {<br />
       "apiId" : "emp",<br />
       "ver" : "1.0",<br />
       "ts" : "10-03-2017 00:00:00",<br />
       "action" : "create",<br />
       "did" : "1",<br />
       "key" : "abcdkey",<br />
       "msgId" : "20170310130900",<br />
       "requesterId" : "rajesh",<br />
       "authToken" : "39b6d8aa-e312-441e-8162-7032ae1303e1"<br />
      
   },<br />
    "tenantId": "default",<br />
    "reportName": "ImmovableAssetRegister",<br />
    "searchParams": [<br />
    	
    	{
              "name" : "assetid"
              "input": ["1","2"]
              
        }
        
        
        
    ]<br />
}<br />

########################

: /report/_reload<br />
Request Sample for reload API:<br />
{<br />
   "RequestInfo": {<br />
       "apiId" : "emp",<br />
       "ver" : "1.0",<br />
       "ts" : "10-03-2017 00:00:00",<br />
       "action" : "create",<br />
       "did" : "1",<br />
       "key" : "abcdkey",<br />
       "msgId" : "20170310130900",<br />
       "requesterId" : "rajesh",<br />
       "authToken" : "3081f773-159b-455b-b977-acfd6ed2c61b"<br />
      
   } ,<br />
   "tenantId" : "default",<br />
  
   
}<br />

---
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
