var dat = {
  'swm.search': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'collectionPoints',
    url: '/swm-services/collectionpoints/_search',
    title: 'swm.search.page.title.collectionpoints',
    preApiCallsBoundary:[
      {
        url:"/egov-location/location/v11/boundarys/_search?",
        qs:{
          hierarchyTypeCode:"REVENUE"
        }
      },
      
    ],
    groups: [
      {
        name: 'search',
        label: 'swm.collectionpoints.search.title',
        fields: [
          {
            name: 'name',
            jsonPath: 'name',
            label: 'swm.collectionpoints.name',
            type: 'autoCompelete',
            isDisabled: false,
            maxLength: 256,
            patternErrorMsg: 'swm.create.field.message.name',
            url: 'swm-services/collectionpoints/_search?|$..collectionPoints.*.name|$..collectionPoints.*.name',
          },
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "locationCode",
            "isRequired": false,
            "patternErrorMsg": "",
            "fullWidth": true,
            
          },
          {
            name: 'name',
            jsonPath: '',
            label: 'swm.collectionPoint.boundary.message',
            type: 'label',
            isDisabled: true,
            color: "rgb(0,0,0)"
          }
        ],
      },
    ],
    result: {
      header: [
        {
          label: 'swm.collectionpoints.create.name',
        },
        {
          label: 'swm.collectionPoint.search.ward',
        },
        {
          label: 'swm.collectionPoint.search.zone',
        },
        {
          label: 'swm.collectionPoint.search.road',
        },
        {
          label: 'swm.collectionpoints.create.colony',
        },
        {
          label: 'swm.collectionpoints.create.assetOrBinId',
        },
        {
          label: 'swm.collectionpoints.create.rfid',
        },
        {
          label: 'swm.processingplant.create.Latitude',
        },
        {
          label: 'swm.processingplant.create.Longitude',
        },
        // {
        //   label: 'swm.collectionpoints.create.group.title.BinDetails',
        // }
      ],
      values: 
      [
        'name',
        {
          jsonPath: 'collectionPoints[0].location.code',
          isBoundary: true,
          name: 'Ward',
          hierarchyType: "REVENUE",
        },
        {
          jsonPath: 'collectionPoints[0].location.code',
          isBoundary: true,
          name: 'Zone',
          hierarchyType: "REVENUE",
        },
        {
          jsonPath: 'collectionPoints[0].location.code',
          isBoundary: true,
          name: 'Road/Street',
          hierarchyType: "REVENUE",
        },
        {
          jsonPath: 'collectionPoints[0].location.code',
          isBoundary: true,
          name: 'Colony/Society/Complex',
          hierarchyType: "REVENUE",
        },
        {
          jsonPath: 'binDetails',
          isMultiple: true,
          name: 'asset.name' 
        },
        {
          jsonPath: 'binDetails',
          isMultiple: true,
          name: 'asset.assetAttributes' ,
          key: 'RFID',
        },
        {
          jsonPath: 'binDetails',
          isMultiple: true,
          name: 'asset.latitude' 
        },
        {
          jsonPath: 'binDetails',
          isMultiple: true,
          name: 'asset.longitude' 
        },
        // 'binDetails[0].' ,
        // 'binDetails[0].asset.longitude' ,
        // {
        //   jsonPath: 'binDetails',
        //   isMultiple: true,
        //   name: ['latitude', 'longitude']
        // }
      ],
      resultPath: 'collectionPoints',
      rowClickUrlUpdate: '/update/swm/collectionpoints/{code}',
      rowClickUrlView: '/view/swm/collectionpoints/{code}',
    },
    isBoundary: true,
    hierarchyType: "REVENUE",
    jPathBoundary: 'location.code'
  },
  'swm.create': {
    numCols: 3,
    useTimestamp: true,
    objectName: 'collectionPoints',
    idJsonPath: 'collectionPoints[0].code',
    title: 'swm.collectionpoints.create.title',
    groups: [
      {
        name: 'LocationDetails',
        label: 'swm.collectionpoints.create.group.title.LocationDetails',
        "fields": [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "collectionPoints[0].location.code",
            "isRequired": true,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
          }
        ]
      },
      {
        name: 'CollectionPointDetails',
        label: '',
        multiple: false,
        fields: [
          {
            name: 'name',
            jsonPath: 'collectionPoints[0].name',
            label: 'swm.collectionpoints.create.name',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
          },
        ],
      },
      {
        name: 'collectionTypeDetails',
        multiple: true,
        jsonPath: 'collectionPoints[0].collectionPointDetails',
        label: 'swm.collectionpoints.create.group.title.CollectionPointDetails',
        fields: [
          {
            name: 'name',
            jsonPath: 'collectionPoints[0].collectionPointDetails[0].collectionType.code',
            label: 'swm.collectionpoints.create.group.title.CollectionType',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=CollectionType|$..code|$..name',
          },
          {
            name: 'garbageEstimate',
            jsonPath: 'collectionPoints[0].collectionPointDetails[0].garbageEstimate',
            label: 'swm.collectionpoints.create.garbageEstimate',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'description',
            jsonPath: 'collectionPoints[0].collectionPointDetails[0].description',
            label: 'swm.collectionpoints.create.description',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            maxLength: 300,
            minLength: 15,
            pattern:'.{15,300}',
            patternErrMsg: 'swm.collectionpoints.create.description.errormsg'
          }
        ]
      },
      {
        name: 'BinDetails',
        label: 'swm.collectionpoints.create.group.title.BinDetails',
        jsonPath: 'collectionPoints[0].binDetails',
        multiple: true,
        fields: [
          {
            name: 'assetOrBinId',
            jsonPath: 'collectionPoints[0].binDetails[0].asset.code',
            label: 'swm.collectionpoints.create.assetOrBinId',
            type: 'autoCompelete',
            isRequired: true,
            isDisabled: false,
            maxLength: 256,
            minLength: 5,
            patternErrorMsg: '',
            url: '/asset-services-maha/assets/_search?&categoryName=Bin|$.Assets.*.code|$.Assets.*.name',
            "autoCompleteDependancy": {
              "autoCompleteUrl": "asset-services-maha/assets/_search?code={collectionPoints[0].binDetails[0].asset.code}",
              "autoFillFields": {
                "collectionPoints[0].binDetails[0].asset.latitude": "Assets[0].latitude",
                "collectionPoints[0].binDetails[0].asset.longitude": "Assets[0].longitude",
                 "iterableFields": {
                   key : "RFID",
                   from : "Assets[0].assetAttributes",
                   to: "collectionPoints[0].binDetails[0].asset.rfid"
                 }
              },
            },
          },
          
          {
            name: 'latitude',
            jsonPath: 'collectionPoints[0].binDetails[0].asset.latitude',
            label: 'ac.create.Latitude',
            type: 'number',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'longitude',
            jsonPath: 'collectionPoints[0].binDetails[0].asset.longitude',
            label: 'ac.create.Longitude',
            type: 'number',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
              name: 'rfid',
              jsonPath: 'collectionPoints[0].binDetails[0].asset.rfid',
              label: 'swm.collectionpoints.create.rfid',
              type: 'text',
              isRequired: false,
              isDisabled: true,
              patternErrMsg: '',
          },
          // {
          //   name: 'dummy',
          //   jsonPath: '',
          //   label: '',
          //   type: 'textArea',
          //   isRequired: false,
          //   isDisabled: false,
          //   patternErrorMsg: '',
          // },
          // {
          //   name: 'rfidAssigned',
          //   jsonPath: 'collectionPoints[0].binDetails[0].rfidAssigned',
          //   label: 'swm.collectionpoints.create.rfidAssigned',
          //   type: 'checkbox',
          //   isRequired: false,
          //   isDisabled: false,
          //   patternErrorMsg: '',
          //   defaultValue: false,
          //   showHideFields: [
          //     {
          //       ifValue: true,
          //       hide: [],
          //       show: [
          //         {
          //           name: 'rfid',
          //           isGroup: false,
          //           isField: true,
          //         }
                  
          //       ],
          //     },
          //     {
          //       ifValue: false,
          //       show: [],
          //       hide: [
          //         {
          //           name: 'rfid',
          //           isGroup: false,
          //           isField: true,
          //         }
          //       ],
          //     },
          //   ],
          // },
          // {
          //   name: 'rfid',
          //   hide: true,
          //   jsonPath: 'collectionPoints[0].binDetails[0].asset[0].assetAttributes[0].rfid',
          //   label: 'swm.collectionpoints.create.rfid',
          //   defaultValue : '',
          //   type: 'text',
          //   isRequired: true,
          //   isDisabled: false,
          //   maxLength: 256,
          //   minLength: 1,
          //   patternErrorMsg: '',
          // },
        ],
      },
    ],
    url: '/swm-services/collectionpoints/_create',
    tenantIdRequired: true,
  },
  'swm.view': {
    beforeSetForm:
    `
    if(res && res.collectionPoints ){
      for(var x=0 ; x < res.collectionPoints[0].binDetails.length ; x++){
        var assetAttributes = res.collectionPoints[0].binDetails[x].asset.assetAttributes;
        for(var i=0 ; i< assetAttributes.length ; i++){
          if(assetAttributes[i].key === "RFID"){
            res.collectionPoints[0].binDetails[x].asset.rfid = assetAttributes[i].value;
            break;
          }
        }
      }
      
    }
    `,
    numCols: 3,
    useTimestamp: true,
    objectName: 'collectionPoints',
    groups: [
      {
        name: 'LocationDetails',
        label: 'swm.collectionpoints.create.group.title.LocationDetails',
        "fields": [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "collectionPoints[0].location.code",
            "isRequired": false,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
          }
        ]
      },
      {
        name: 'CollectionPointDetails',
        label: '',
        fields: [
          {
            name: 'name',
            jsonPath: 'collectionPoints[0].name',
            label: 'swm.collectionpoints.create.name',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
          },
        ],
      },
      {
        name: 'collectionTypeDetails',
        multiple: true,
        jsonPath: 'collectionPoints[0].collectionPointDetails',
        label: 'swm.collectionpoints.create.group.title.CollectionPointDetails',
        fields: [
          {
            name: 'name',
            jsonPath: 'collectionPoints[0].collectionPointDetails[0].collectionType.code',
            label: 'swm.collectionpoints.create.group.title.CollectionType',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=CollectionType|$..code|$..name',
          },
          {
            name: 'garbageEstimate',
            jsonPath: 'collectionPoints[0].collectionPointDetails[0].garbageEstimate',
            label: 'swm.collectionpoints.create.garbageEstimate',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'description',
            jsonPath: 'collectionPoints[0].collectionPointDetails[0].description',
            label: 'swm.collectionpoints.create.description',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            maxLength: 300,
            minLength: 15,
            patternErrorMsg: '',
          },
        ],
      },
      {
        name: 'BinDetails',
        label: 'swm.collectionpoints.create.group.title.BinDetails',
        multiple: true,
        jsonPath: 'collectionPoints[0].binDetails',
        fields: [
          {
            name: 'assetOrBinId',
            jsonPath: 'collectionPoints[0].binDetails[0].asset.code',
            label: 'swm.collectionpoints.create.assetOrBinId',
            type: 'autoCompelete',
            isRequired: true,
            isDisabled: false,
            maxLength: 256,
            minLength: 5,
            patternErrorMsg: '',
            url: '/asset-services-maha/assets/_search?&categoryName=Bin|$.Assets.*.code|$.Assets.*.name',
            "autoCompleteDependancy": {
              "autoCompleteUrl": "asset-services-maha/assets/_search?code={collectionPoints[0].binDetails[0].asset.code}",
              "autoFillFields": {
                "collectionPoints[0].binDetails[0].latitude": "Assets[0].latitude",
                "collectionPoints[0].binDetails[0].longitude": "Assets[0].longitude",
              },
            },
          },
          
          {
            name: 'latitude',
            jsonPath: 'collectionPoints[0].binDetails[0].asset.latitude',
            label: 'ac.create.Latitude',
            type: 'number',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'longitude',
            jsonPath: 'collectionPoints[0].binDetails[0].asset.longitude',
            label: 'ac.create.Longitude',
            type: 'number',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'rfid',
            jsonPath: 'collectionPoints[0].binDetails[0].asset.rfid',
            label: 'swm.collectionpoints.create.rfid',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrMsg: '',
          },
          {
            name: 'dummy',
            jsonPath: '',
            label: '',
            type: 'textArea',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          // {
          //   name: 'rfidAssigned',
          //   jsonPath: 'collectionPoints[0].binDetails[0].rfidAssigned',
          //   label: 'swm.collectionpoints.create.rfidAssigned',
          //   type: 'checkbox',
          //   isRequired: false,
          //   isDisabled: false,
          //   patternErrorMsg: '',
          //  // defaultValue: false,
          //   // showHideFields: [
          //   //   {
          //   //     ifValue: true,
          //   //     hide: [],
          //   //     show: [
          //   //       {
          //   //         name: 'rfid',
          //   //         isGroup: false,
          //   //         isField: true,
          //   //       }
                  
          //   //     ],
          //   //   },
          //   // ],
          // },
          // {
          //   name: 'rfid',
          //   //hide: true,
          //   jsonPath: 'collectionPoints[0].binDetails[0].rfid',
          //   label: 'swm.collectionpoints.create.rfid',
          //   type: 'text',
          //   isRequired: true,
          //   isDisabled: false,
          //   maxLength: 256,
          //   minLength: 1,
          //   patternErrorMsg: '',
          // },
        ],
      },
    ],
    tenantIdRequired: true,
    url: '/swm-services/collectionpoints/_search?code={code}',
  },
  'swm.update': {
    beforeSetForm:
    `
    if(res && res.collectionPoints ){
      for(var x=0 ; x < res.collectionPoints[0].binDetails.length ; x++){
        var assetAttributes = res.collectionPoints[0].binDetails[x].asset.assetAttributes;
        for(var i=0 ; i< assetAttributes.length ; i++){
          if(assetAttributes[i].key === "RFID"){
            res.collectionPoints[0].binDetails[x].asset.rfid = assetAttributes[i].value;
            break;
          }
        }
      }
      
    }
    `,
    numCols: 3,
    useTimestamp: true,
    objectName: 'collectionPoints',
    idJsonPath: 'collectionPoints[0].code',
    title:'swm.collectionpoints.create.title',
    groups: [
      {
        name: 'LocationDetails',
        label: 'swm.collectionpoints.create.group.title.LocationDetails',
        "fields": [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "collectionPoints[0].location.code",
            "isRequired": true,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
          }
        ]
      },
      {
        name: 'CollectionPointDetails',
        label: '',
        fields: [
          {
            name: 'name',
            jsonPath: 'collectionPoints[0].name',
            label: 'swm.collectionpoints.create.name',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
          },
        ],
      },
      {
        name: 'collectionTypeDetails',
        multiple: true,
        jsonPath: 'collectionPoints[0].collectionPointDetails',
        label: 'swm.collectionpoints.create.group.title.CollectionPointDetails',
        fields: [
          {
            name: 'name',
            jsonPath: 'collectionPoints[0].collectionPointDetails[0].collectionType.code',
            label: 'swm.collectionpoints.create.group.title.CollectionType',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=CollectionType|$..code|$..name'
          },
          {
            name: 'garbageEstimate',
            jsonPath: 'collectionPoints[0].collectionPointDetails[0].garbageEstimate',
            label: 'swm.collectionpoints.create.garbageEstimate',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: ''
          },
          {
            name: 'description',
            jsonPath: 'collectionPoints[0].collectionPointDetails[0].description',
            label: 'swm.collectionpoints.create.description',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            maxLength: 300,
            minLength: 15,
            patternErrorMsg: '',
            pattern:'.{15,300}',
            patternErrMsg: 'swm.collectionpoints.create.description.errormsg'
          }
        ]
      },
      {
        name: 'BinDetails',
        jsonPath: 'collectionPoints[0].binDetails',
        label: 'swm.collectionpoints.create.group.title.BinDetails',
        multiple: true,
        fields: [
          {
            name: 'assetOrBinId',
            jsonPath: 'collectionPoints[0].binDetails[0].asset.code',
            label: 'swm.collectionpoints.create.assetOrBinId',
            type: 'autoCompelete',
            isRequired: true,
            isDisabled: false,
            maxLength: 256,
            minLength: 5,
            patternErrorMsg: '',
            url: '/asset-services-maha/assets/_search?&categoryName=Bin|$.Assets.*.code|$.Assets.*.name',
            "autoCompleteDependancy": {
              "autoCompleteUrl": "asset-services-maha/assets/_search?code={collectionPoints[0].binDetails[0].asset.code}",
              "autoFillFields": {
                "collectionPoints[0].binDetails[0].asset.latitude": "Assets[0].latitude",
                "collectionPoints[0].binDetails[0].asset.longitude": "Assets[0].longitude",
                "iterableFields": {
                  key : "RFID",
                  from : "Assets[0].assetAttributes",
                  to: "collectionPoints[0].binDetails[0].asset.rfid"
                }
              },
            },
          },
          
          {
            name: 'latitude',
            jsonPath: 'collectionPoints[0].binDetails[0].asset.latitude',
            label: 'ac.create.Latitude',
            type: 'number',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'longitude',
            jsonPath: 'collectionPoints[0].binDetails[0].asset.longitude',
            label: 'ac.create.Longitude',
            type: 'number',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'rfid',
            jsonPath: 'collectionPoints[0].binDetails[0].asset.rfid',
            label: 'swm.collectionpoints.create.rfid',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrMsg: '',
          },
        ],
      },
    ],
    url: '/swm-services/collectionpoints/_update',
    tenantIdRequired: true,
    searchUrl: '/swm-services/collectionpoints/_search?code={code}',
  },
};
export default dat;
