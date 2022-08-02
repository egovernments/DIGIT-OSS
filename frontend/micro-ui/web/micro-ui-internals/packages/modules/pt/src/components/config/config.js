export const newConfig =[
        {
            "head": "Birth-Details",
            "body": [
             
            
                {
                    "type": "component",
                    "route": "street",
                    "component": "PTSelectStreet",
                    "key": "address",
                    "withoutLabel": true,
                    "texts": {
                        "headerCaption": "PT_PROPERTY_LOCATION_CAPTION",
                        "header": "CS_FILE_APPLICATION_PROPERTY_LOCATION_ADDRESS_TEXT",
                        "cardText": "PT_STREET_TEXT",
                        "submitBarLabel": "PT_COMMON_NEXT"
                    },
                    "nextStep": "landmark"
                },
            
            ]
        },
        // {
        //     "head": "ES_NEW_APPLICATION_DOCUMENTS_REQUIRED",
        //     "body": [
        //         {
        //             "component": "SelectDocuments",
        //             "withoutLabel": true,
        //             "key": "documents",
        //             "type": "component"
        //         }
        //     ]
        // }
    ];