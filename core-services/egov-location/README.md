# eGov-Location Service

An eGov core application which provides location details of the tenant for which the services are being provided.
### DB UML Diagram

- NA

### Service Dependencies
- egov-mdms service

### Swagger API Contract

Please refer to the [Swagger API contarct](https://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/egov-services/master/docs/egov-location/contracts/v11-0-0.yml#!/) for egov-location service to understand the structure of APIs and to have visualization of all internal APIs.


## Service Details

The eGov location information also known as boundary date of ULB’s are defined in  different hierarchies ADMIN/ELECTION hierarchy which is defined by theAdministrators, Revenue hierarchy defined by the Revenue department.

The election hierarchy has the locations divided into several types like zone, election ward, block, street  and locality. The Revenue hierarchy has the locations divided into zone, ward, block and locality.

The model which defines the localities like zone, ward and etc is boundary object which contains information like name, lat, long, parent or children boundary if any. The boundaries come under each other in hierarchy like zone contains wards, ward contains blocks, block contains locality. The order in which the boundaries are contained in each other will differ based on the tenants.
### Sample Config

The boundary data has been moved to mdms from the master tables in DB. The location service fetches the JSON from mdms and parses it to the structure of boundary object as mentioned above.. A sample master would look like below

```json
{
  "tenantId": "pg.cityA",
   "moduleName": "egov-location",
  "TenantBoundary": [
  {
      "hierarchyType": {
              "code": "ADMIN",
              "name": "ADMIN"
      },
       "boundary": {
                "id": 1,
                "boundaryNum": 1,
                "name": "CityA",
                "localname": "CityA",
                "longitude": null,
                "latitude": null,
                "label": "City",
                "code": "pg.cityA",
                "children": []
        }
  
    }
 ]
}
```
### API Details

`BasePath` /egov-location/location/v11/[API endpoint]

##### Method
a) `/boundarys/_search`

This method provides a list of boundaries based on TenantId And List of Boundary id's And List Of codes And BoundaryType And HierarchyType
- `URL Parameter`

    | Parameter                                 | Description                                                       | Mandatory  |   Data Type      |
    | ----------------------------------------- | ------------------------------------------------------------------| -----------|------------------|
    | `tenantId`                                | Unique id for a tenant.                                           | Yes        | String           |
    | `boundaryType`                            | lable of boundary within the tenant boundary structure            | No         | Integer          |
    | `hierarchyTypeCode`                       | Type Of the BoundaryType Like REVENUE, ADMIN                      | No         | String           |
    | `codes`                                   | Unique List of boundary codes                                     | No         | Array of String  | 
    
b) `/geography/_search`

This method handles all requests related to geographical boundaries by providing appropriate GeoJson and other associated data based on tenantId or lat/long etc

- `URL Parameter`

    | Parameter                                 | Description                                                       | Mandatory  |   Data Type      |
    | ----------------------------------------- | ------------------------------------------------------------------| -----------|------------------|
    | `tenantId`                                | Unique id for a tenant.                                           | Yes        | String           |
    | `filter`                                  | JSON path filter string for filtering the output                  | No         | String           |

c) `/tenant/_search`

This method tries to resolve a given lat, long to a corresponding tenant, provided there exists a mapping between the reverse geocoded city to tenant.

- `URL Parameter`

    | Parameter                                 | Description                                                       | Mandatory  |   Data Type      |
    | ----------------------------------------- | ------------------------------------------------------------------| -----------|------------------|
    | `tenantId`                                | Unique id for a tenant.                                           | Yes        | String           |
    | `lat`                                     | Latitude                                                          | Yes        | Number           |
    | `lng`                                     | Longitude                                                         | Yes        | Number           |
    




### Kafka Consumers

- NA

### Kafka Producers

- NA