## Master Data Management service

#### Master data management files check in location and details -

1. Data folder parallel to docs (https://github.com/egovernments/egov-mdms-data/tree/master/data/pb). 
2. Under data folder there will be a folder `<state>` which is a state specific master folder.
3. Under `<state>` folder there will `<tenant>` folders where ulb specific master data will be checked in. for example `pb.testing`
4. Each module will have one file each for statewide and ulb wise master data. Keep the file name as module name itself.

#### Local Setup

To setup the service, clone the service. Update the `application.properties` and change

- Update `egov.mdms.conf.path` to point to the folder where the master data is stored. [Sample](https://github.com/egovernments/egov-mdms-data/blob/master/data/pb/)
- Update the `masters.config.url` to point to the file which has the masters configuration. [Sample](https://github.com/egovernments/egov-mdms-data/blob/master/master-config.json)

Each master has three key parameters `tenantId`, `moduleName`, `masterName`. A sample master would look like below

```json
{
  "tenantId": "pb",
  "moduleName": "common-masters",
  "OwnerType": [
    {
      "code": "FREEDOMFIGHTER",
      "active": true
    },
    {
      "code": "WIDOW",
      "active": true
    },
    {
      "code": "HANDICAPPED",
      "active": true
    }
  ]
}
```

Here `tenantId=pb`, `moduleName=common-masters`, `masterName=OwnerType`

#### Query Construction

##### _get, method type post (Send requestInfo in Body)
Sample Query: 
If we have filter like this 
[?(@.id==1||@.id==2)]
Query will be like following and parameter should be url-encoded.
http://localhost:8093/egov-mdms-service/v1/_get?moduleName=SWM&masterName=CollectionPoint&tenantId=mh&filter=%5B%3F%28%40.id%3D%3D1%7C%7C%40.id%3D%3D2%29%5D

##### _search, method type post (Send requestInfo in Body)
Please refer contract : https://raw.githubusercontent.com/egovernments/egov-services/master/docs/mdms/contract/v1-0-0.yml
