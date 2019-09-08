## Master Data Management service

#### Master data management files check in location and details -

1. Data folder parallel to docs (https://github.com/egovernments/egov-services/tree/master/data/mh). 
2. Under data folder there will be a folder "mh" where maharastra specific state wide master data will be published.
3. Under "mh" folder there will "tenant" folders where ulb specific master data will be checked in. for example "mh.roha"
4. Each module will have one file each for statewide and ulb wise master data. Keep the file name as module name itself.

#### Query Construction
##### _get, method type post (Send requestInfo in Body)
Sample Query: 
If we have filter like this 
[?(@.id==1||@.id==2)]
Query will be like following and parameter should be url-encoded.
http://localhost:8093/egov-mdms-service/v1/_get?moduleName=SWM&masterName=CollectionPoint&tenantId=mh&filter=%5B%3F%28%40.id%3D%3D1%7C%7C%40.id%3D%3D2%29%5D

##### _search, method type post (Send requestInfo in Body)
Please refer contract : https://raw.githubusercontent.com/egovernments/egov-services/master/docs/mdms/contract/v1-0-0.yml
