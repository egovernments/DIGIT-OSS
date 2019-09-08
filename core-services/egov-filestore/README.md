# egr-filestore
Service for storing and retrieving files.

## API

### Save Files

Endpoint
```
POST /files
```

Request Body

| Field | Description |
| ------ | ------ |
| file | Files to upload |
| jurisdictionId | Jurisdiction ID (Required Field) |
| module | Name of the module where this request is coming from. (Required Field) |
| tag | Tag (Optional Field) |

Response
```json
{
  "files": [
    {
      "fileStoreId": "62a12949-e295-4ac1-a84e-8008b9400817"
    },
    {
      "fileStoreId": "893f6922-b1e6-4225-96c2-3df5c81259dd"
    }
  ]
}
```
### Retrieve a File

Endpoint
```
GET /files/{fileStoreId}
```

This endpoint returns the file.

### Retrieve File URLs by Tag

Endpoint

```
GET /files?tag={tag}
```

Response
```json
{
  "files": [
    {
      "url": "http://localhost:8080/filestore/files/ede7540c-f7f0-43d2-ab89-23ba701fe1f9"
    },
    {
      "url": "http://localhost:8080/filestore/files/f8e4de2f-c994-4347-80a2-9aa4b2602f93"
    },
    {
      "url": "http://localhost:8080/filestore/files/71de41db-55e4-43f8-9a46-1146cbf3e619"
    },
    {
      "url": "http://localhost:8080/filestore/files/83eb0e18-1cb8-4a2a-911c-a6ac5105cba8"
    },
    {
      "url": "http://localhost:8080/filestore/files/62a12949-e295-4ac1-a84e-8008b9400817"
    },
    {
      "url": "http://localhost:8080/filestore/files/893f6922-b1e6-4225-96c2-3df5c81259dd"
    }
  ]
}
```
