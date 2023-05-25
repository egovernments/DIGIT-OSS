# Local Setup

To setup the egov-persister service in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [x] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [x] Kafka
  - [x] Consumer
  - [ ] Producer

## Running Locally

### Local setup
1. To setup the egov-persister service, clone the [Core Service repository](https://github.com/egovernments/core-services)
2. Write configuration as per your requirement.[Sample]().
3. In application.properties file, mention the local file path of configuration under the variable `egov.persist.yml.repo.path` while mentioning the  file path 
   we have to add `file://` as prefix. for example: `egov.persist.yml.repo.path = file:///home/rohit/Documents/configs/egov-persister/abc-persister.yml`. If there are multiple file seperate it with comma (`,`) . 
   We can also load the folder which contains the persister configuration. Add the folder path under the same variable ex: `egov.persist.yml.repo.path = /home/rohit/Documents/configs/egov-persister/`
4.  Run the egov-persister app and push data on kafka topic specified in config to persist it in DB