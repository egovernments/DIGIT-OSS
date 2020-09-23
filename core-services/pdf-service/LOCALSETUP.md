# Local Setup

To setup the PDF-service in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [x] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [x] Kafka
  - [x] Consumer
  - [x] Producer

## Running Locally

### Local setup
1. To setup the PDF-service, clone the [Core Service repository](https://github.com/egovernments/core-services)
2. Write configuration as per your requirement [Sample data config](https://raw.githubusercontent.com/egovernments/configs/master/pdf-service/data-config/tl-receipt.json) and [Sample format config](https://raw.githubusercontent.com/egovernments/configs/master/pdf-service/format-config/tl-receipt.json).
3. In EnvironmentVariable.js file, mention the local file path of data and format configuration file under the variables `DATA_CONFIG_URLS: process.env.DATA_CONFIG_URLS`  and `FORMAT_CONFIG_URLS: process.env.FORMAT_CONFIG_URLS` while mentioning the  file path we have to add `file://` as prefix. If there are multiple file seperate it with `,` .
    
    `DATA_CONFIG_URLS: process.env.DATA_CONFIG_URLS || "file:///home/xyz/Documents/configs/pdf/data/abc-data.json"`

     `FORMAT_CONFIG_URLS: process.env.FORMAT_CONFIG_URLS || "file:///home/xyz/Documents/configs/pdf/format/abc-format.json"`

4. Open the terminal and run the following command

    `cd [filepath to pdf service]`
                                                      
    `npm install`             (run this command only once when you clone the repo)
                                                                                                                                                 
    `npm run dev`

> Note: After running the above command if kafka error comes then make sure that kafka and zookeeper runs in background and if other microservice connection error comes then make sure that in data config the url mentioned in external mapping is correct or you can port-forward that particular service
