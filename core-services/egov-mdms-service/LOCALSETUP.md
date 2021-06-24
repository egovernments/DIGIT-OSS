# Local Setup

To setup the MDMS service in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [ ] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [ ] Kafka
  - [ ] Consumer
  - [ ] Producer

## Running Locally

To run the MDMS services locally, update below listed properties in `application.properties` before running the project:

```ini
egov.mdms.conf.path =
masters.config.url =
```
- Update `egov.mdms.conf.path` and `masters.config.url` to point to the folder/file where the master configuration/data is stored. You can put the folder path present in your local system or put the git hub link of MDMS config folder/file [Sample data](https://github.com/egovernments/egov-mdms-data/blob/master/data/pb/) and [Sample config](https://raw.githubusercontent.com/egovernments/egov-mdms-data/master/master-config.json)

>**Note:** 
If you are mentioning local folder path in above mention property, then add `file://` as prefix.
`file://<file-path>`  
egov.mdms.conf.path = file:///home/abc/xyz/egov-mdms-data/data/pb
>If there are multiple file seperate it with `,` .