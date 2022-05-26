# eGov Document Uploader service

Document uploader will be used by ULB employees to upload the document which will then be visible to the citizens. In an effort to increase the engagement of citizens with mSeva platform, mSeva is providing this service to enable the citizens to view important documents related to their ULB such as acts, circulars, citizen charters etc.

### DB UML Diagram
- NA

### Service Dependencies
- egov-mdms
- egov-idgen
- egov-localization
- egov-url-shortener

### Swagger API Contract

Please refer to the [Swagger API contract](https://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/DIGIT-OSS/master/core-services/docs/egov-document-uploader-contract.yml) for egov-document-uploader service to understand the structure of APIs and to have visualization of all internal APIs.


### Functionalities
Employees can perform all four operations i.e. creating, searching, updating and deleting the documents whereas the citizens can only search for the created documents. For creating documents in a particular ULB, the document category that needs to be provided in the create API cURL has to be present in the document category mdms file for the tenantId for which the document is getting uploaded. 

 

A sample mdms document category configuration file can be viewed here - egov-mdms-data/DocumentUploader.json at DEV · egovernments/egov-mdms-data 

In this mdms configuration file, ulb key can be added and the allowed category types can be added in categoryList key.

 

Once a document is created in any ULB, the following attributes can be updated for that document - 

1. ULB

2. Document name

3. Document category

4. Links

5. Attachments

Upon deleting any document, that document is soft deleted from the records i.e. that document’s active field is set to false.


### API Details

1. /egov-document-uploader/egov-du/document/_create - Takes RequestInfo and DocumentEntity in request body. Document entity has all the parameters related to the document being inserted.

2. /egov-document-uploader/egov-du/document/_update - Allows editing of attributes related to an already existing document. Searches document based on its uuid and updates attributes.

3. /egov-document-uploader/egov-du/document/_search - Allows searching existing documents in the database. Takes search parameters in the url and RequestInfo in request body.

4. /egov-document-uploader/egov-du/document/_delete - Soft deletes an existing document from the database i.e. it makes the document inactive. It takes the DocumentEntity that needs to be deleted in the request body along with RequestInfo object.

**`Postman collection`** :- https://www.getpostman.com/collections/c0774674d0c8c05181a7





### Kafka Consumers

- NA

### Kafka Producers

- Following are the Producer topic.
    - **save-du-document** :- This topic is used to save new document.
    - **update-du-document** ;- This topic is used to update the existing document.
    - **delete-du-document** :- This topic is use to delete document.