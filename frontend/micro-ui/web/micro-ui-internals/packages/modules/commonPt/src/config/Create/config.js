export const newConfig =[
    {
        "head": "PT_ASSEMBLY_DET",
        "body": [
            {
                "type": "component",
                "route": "property-type",
                "isMandatory": true,
                "component": "CPTPropertyAssemblyDetails",
                "texts": {
                    "headerCaption": "",
                    "header": "PT_ASSEMBLY_DET",
                    "cardText": "",
                    "submitBarLabel": "PT_COMMONS_NEXT"
                },
                "nextStep": {
                    "COMMON_PROPTYPE_BUILTUP_INDEPENDENTPROPERTY": "landarea",
                    "COMMON_PROPTYPE_BUILTUP_SHAREDPROPERTY": "PtUnits",
                    "COMMON_PROPTYPE_VACANT": "area"
                },
                "key": "assemblyDet",
                "withoutLabel": true
            },
        ]
    },
    {
        "head": "PT_LOCATION_DETAILS",
        "body": [
            {
                "type": "component",
                "route": "property-type",
                "isMandatory": true,
                "component": "CPTPropertyLocationDetails",
                "texts": {
                    "headerCaption": "",
                    "header": "PT_LOCATION_DETAILS",
                    "cardText": "",
                    "submitBarLabel": "PT_COMMONS_NEXT"
                },
                "nextStep": {
                    "COMMON_PROPTYPE_BUILTUP_INDEPENDENTPROPERTY": "landarea",
                    "COMMON_PROPTYPE_BUILTUP_SHAREDPROPERTY": "PtUnits",
                    "COMMON_PROPTYPE_VACANT": "area"
                },
                "key": "locationDet",
                "withoutLabel": true
            },
        ]
    },
    
    {
        "head": "PT_OWNERSHIP_DETAILS",
        "body": [
            {
                "type": "component",
                "route": "institutional-owner-address",
                "isMandatory": true,
                "component": "CPTPropertyOwnerDetails",
                "texts": {
                    "headerCaption": "PT_OWNERS_DETAILS",
                    "header": "PT_OWNERS_ADDRESS",
                    "cardText": "",
                    "submitBarLabel": "PT_COMMON_NEXT"
                },
                "key": "owners",
                "withoutLabel": true,
                "nextStep": "institutional-proof-of-identity",
                "hideInEmployee": true
            },
        ]
    },
];