# PDF-Service

PDF service is one of the core application which is use to bulk generate the pdf as per requirement.

### DB UML Diagram

- NA

### Service Dependencies
- egov-localization
- egov-filestore

### Swagger API Contract
Please refer to the  below Swagger API contarct for PDF service to understand the structure of APIs and to have visualization of all internal APIs [Swagger API contract](https://app.swaggerhub.com/apis/eGovernment/pdf-service_ap_is/1.1.0)


## Service Details

### Funcatinality
1. Provide common framework to generate PDF.
2. Provide flexibility to customize the PDF as per the requirement.
3. Provide functionality to add an image, Qr Code in PDF.
4. Provide functionality to generate pdf in bulk.
5. Provide functionality to specify maximum number of records to be written in one PDF.

### Feature
1. Functionality to generate PDFs in bulk.
2. Avoid regeneration.
3. Support QR codes.
4. Uploading generated PDF to filestore and return filestore id for easy access.
5. For large request generate PDF in multiple files due to upload size restriction by file-store service.
6. Supports localisation.

### External Libraries Used
[PDFMake](https://github.com/bpampuch/pdfmake ):- For generating PDFs

[Mustache.js](https://github.com/janl/mustache.js/ ):- As templating engine to populate format as defined in format config, from request json based on mappings defined in data config

### Configuration
PDF service use two config files for a pdf generation as per requirement
- Format Config File: It define format as per PDFMake syntax of pdf [Sample format config](https://raw.githubusercontent.com/egovernments/configs/master/pdf-service/format-config/tl-receipt.json).
- Data Config File : It use to fill format of pdf to prepare final object which will go to PDFMake and will be converted into PDF [Sample data config](https://raw.githubusercontent.com/egovernments/configs/master/pdf-service/data-config/tl-receipt.json).

PDF generation service read these such files at start-up to support PDF generation for all configured module.

**The data config file  contains the following aspects:**

- `key`:  The key for the pdf, it is used as a path parameter in URL to identify for which PDF has to generate.

- `baseKeyPath`: The json path for the array object that we need to process. 

- `entityIdPath`: The json path for the unique field which is stored in DB. And that unique field value is mapped to file-store id, so we can directly search the pdf which was created earlier with the unique field value and there will be no need to create PDF again.

- `mapping`: There are three mapping object for variable which are direct mapping, externalApi mapping and derived mapping.

- `Direct Mapping`: In direction mapping we define the variable whose value can be fetched from the array object which we extracted using baseKeyPath.

- `ExternalApi Mapping`: We use the externalApi mapping only if there is a need of values from other service response. In externalApi mapping, API endpoint has to be set properly with correct query parameter.

- `Derived mapping`: In derived mapping, the estimation of variable characterize here is equivalent to esteem which acquired from the arithmetic operation between variable of direct mapping and externalApi mapping.

- `QRCode mapping`: This mapping is used to draw QR codes in the PDFs. The text to be shown after scan can be combination of static text and variables from direct and externalApi mappings. 

**The format config file contain the following aspect :**

- `key`: The key for the pdf, it is used as a path parameter in URL to identify for which PDF has to  generate.

- `Content`: In this section, the view of pdf is set. What has to be appear on pdf is declared here, it  just like creating a static html page. The variable which are defined in data config are declared here and place in position as per the requirement. We can also create table here and set the variable as per requirement. 

- `Style`: This section is used to style the component, set the alignment and many more. Basically it's like a CSS to style the html page.

**Sample structure of variable definition in data config**

>**Value Variable**
```json
{
  "Variable": "variable_name",
  "Value":{
      "path": "$.name"                 -----> jsonpath to obtain value.
  }
}
```

>**Lable Variable**
```json
{
  "Variable": "variable_name",
  "Value":{
    "path": "$.name"                   -----> jsonpath to obtain value or key to obtain value from localisation.
  },
  "type":  "label",                    -----> this field is used to mark this variable as label.       
  "localisation":{
      "required": "false",             -----> if this field is true then  localisation is used for this variable and viceversa.
      "prefix": "null",                -----> prefix of the key which is declared in path field.
      "module": "service-module"       -----> the module from which localisation entry is fetched
  }
}
```
>**Date Variable**
```json
{
  "Variable": "variable_name",
  "Value":{
    "path": "$.date"               -----> jsonpath to obtain epoch value of date
  },
  "type": "date",                  -----> this field is used to mark this variable as date.       
  "format": "YYYY/MM/DD"
}
```
If the format field in not specified in date variable declaration then in PDF date is shown with default format of `DD/MM/YYYY`.
### API Details

`BasePath` /pdf-service/v1/[API endpoint]

##### Method
a) `POST /_create` 

This API request to PDF generation service is made to generate pdf and return the filestore id and job id.

- `Endpoint`: /pdf-service/v1/_create?key={configFileName}&tenantId={tenantId}

- `CreateRequest`:  Request Info + json object depending on the requirement which will be converted to pdf. 

- `PDF Create Response`:
```json
{
  "ResponseInfo":"",
  "message": "Success",
  "filestoreIds": ["79ca9d06-0926-40e3-b248-4109732223f4"],
  "jobid": "billTemplate1597058852883",
  "createdtime": 1597058851899,
  "endtime": 1597058853694,
  "tenantid": "ab",
  "totalcount": 1,
  "key": "billTemplate",
  "documentType": "",
  "moduleName": ""
}
```


b) `POST /_search`

This API request to PDF generation service, search the already created pdf (based on job Id or entity id) for particular application number. 

- `Endpoint`: /pdf-service/v1/_search?jobid={jobid}
              /pdf-service/v1/_search?entityid={entityid}

- `SearchRequest`:  Request Info

- `PDF Search Response`:
```json
  {
    "ResponseInfo":"",
    "message": "Success",
    "searchresult": [
        {
            "filestoreids": ["79ca9d06-0926-40e3-b248-4109732223f4"],
            "jobid": "billTemplate1597058852883",
            "tenantid": "ab",
            "createdtime": "1597058851899",
            "endtime": "1597058853694",
            "totalcount": 1,
            "key": "billTemplate",
            "documentType": "",
            "moduleName": ""
        }
    ]
  }
```

c) `POST /_createnosave` 

This API request to PDF generation service, generate pdf and return the downloadable pdf file(binary response) as response.

- `Endpoint`: /pdf-service/v1/_create?key={configFileName}&tenantId={tenantId}

- `CreateRequest`:  Request Info + json object depending on the requirement which will be converted to pdf. 

### Kafka Consumers

- ```PDF_GEN_RECEIVE```: PDF-Service receive the JSON object along with the template name for creation of pdf of particular pdf template.

### Kafka Producers

- ```PDF_GEN_CREATE```: PDF-Service sends create response data to this topic for egov-persister service to store data in DB.