# Local Setup

This document will walk you through the dependencies of eGov-Searcher and how to set it up locally

## Dependencies

### Infra Dependency

- [X] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [ ] Kafka
  - [ ] Consumer
  - [ ] Producer
- [x] Azure
- [x] Aws-s3
- [x] Minio

## Running Locally

To run this services locally, you need to port forward below services locally

```bash

``` 

Update below listed properties in `application.properties` before running the project:

```ini
# Only one of the service provider can be enabled at a time either azure or aws or minio.

#tells whether the image containers to store the fiels are static or dynamic
is.container.fixed=true

#Azure - azure related configs to be added when azure is connected with app
isAzureStorageEnabled=false
azure.defaultEndpointsProtocol=https
azure.accountName=accname
azure.accountKey=acckey
azure.sas.expiry.time.in.secs=86400
source.azure.blob=AzureBlobStorage
azure.blob.host=https://$accountName.blob.core.windows.net
azure.api.version=2018-03-28

#minio and S3 config - minio and S3 share the same variables for configs
minio.url=https://s3.amazonaws.com - if the url is aws then service provider is aws else it's minio
isS3Enabled=true
aws.secretkey=minioadmin
aws.key=minioadmin
fixed.bucketname=egov-rainmaker-1
minio.source=minio
```
