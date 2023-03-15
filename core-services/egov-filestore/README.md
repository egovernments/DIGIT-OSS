
# <eGov-Filestore>

Filestore provides file upload capability for all the rest of the modules in the Digit suite.

### DB UML Diagram




### Service Dependencies



### Swagger API Contract
- Please refer to the [Swagger API contarct](https://raw.githubusercontent.com/egovernments/DIGIT-OSS/master/core-services/docs/filestore-service-contract.yml) for Filestore service to understand the structure of APIs and to have visualization of all internal APIs.




## Service Details

File uploader for the egov suite. The service can be configured to provide upload and download for files. The Application uses one of the following filestore services Aws-s3/Azure/Minio/file system to save the files. 

The application will start successfully only when atleast one of the config of azure/aws/minio is enabled as mentioned in the local setup.

### API Details

The "/v1/files" Api will validate the file formats sent through it, if it doesn't fit the available formats the application will throw error for invalid files. Any images uploaded will result in creation of three additional thumbnails along with it which can be searched. 

The "/v1/files/url" Api will return encrypted urls for any given UUID, multiple urls for image will be returned and will be separated by commas. each of the url will point to one of the thumbnails created for images. in case of files only one url will be returned.


### Kafka Consumers

### Kafka Producers
