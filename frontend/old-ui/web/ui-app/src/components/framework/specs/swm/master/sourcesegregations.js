var dat = {
  'swm.search': {
    beforeSetSearchResult:`for (var i = 0; i < res.sourceSegregations.length; i++) {
      var totalWetWaste=0,totalDryWaste=0;
      if (res.sourceSegregations[i].collectionDetails) {
        for (var j = 0; j < res.sourceSegregations[i].collectionDetails.length; j++) {
          totalDryWaste+=res.sourceSegregations[i].collectionDetails[j].dryWasteCollected;
          totalWetWaste+=res.sourceSegregations[i].collectionDetails[j].wetWasteCollected;
        }
        res.sourceSegregations[i]['totalDryWasteCollected']=totalDryWaste;
        res.sourceSegregations[i]['totalWetWasteCollected']=totalWetWaste;
        res.sourceSegregations[i]['totalWasteCollected']=totalDryWaste+totalWetWaste;
      }
    }`,
    preApiCallsBoundary:[
      {
        url:"/egov-location/location/v11/boundarys/_search?",
        qs:{
          hierarchyTypeCode:"REVENUE"
        }
      }
    ],
    numCols: 4,
    useTimestamp: true,
    objectName: 'sourceSegregations',
    url: '/swm-services/sourcesegregations/_search',
    title: 'swm.search.page.title.sourcesegregations',
    groups: [
      {
        name: 'search',
        label: 'swm.sourcesegregation.search.title',
        fields: [
          {
            name: 'sourceSegregationDate',
            jsonPath: 'sourceSegregationDate',
            label: 'swm.create.sourceSegregationDate',
            type: 'datePicker',
            isDisabled: false,
            patternErrorMsg: 'swm.create.field.message.sourceSegregationDate',
          },
          {
            name: 'dumpingGroundCode',
            jsonPath: 'dumpingGroundCode',
            label: 'swm.create.dumpingGround',
            type: 'singleValueList',
            isDisabled: false,
            patternErrorMsg: 'swm.create.field.message.dumpingGroundCode',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=DumpingGround|$..DumpingGround.*.code|$..DumpingGround.*.name',
          },
        ],
      },
    ],
    result: {
      header: [
        // {
        //   label: 'swm.create.ulb',
        // },
        {
          label: 'swm.search.result.dumpingGround',
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
          label: 'swm.search.result.sourceSegregationDate',
          isDate: true,
        },
        {
          label: 'swm.collectionPoint.search.totalWetWaste',
        },
        {
          label: 'swm.collectionPoint.search.totalDryWaste',
        },
        {
          label: 'swm.collectionpoints.create.totalWaste',
        }
      ],
      values: ['dumpingGround.name',
      {
        jsonPath: 'sourceSegregations[0].dumpingGround.siteDetails.location.code',
        isBoundary: true,
        name: 'Ward',
        hierarchyType: "REVENUE",
      },
      {
        jsonPath: 'sourceSegregations[0].dumpingGround.siteDetails.location.code',
        isBoundary: true,
        name: 'Zone',
        hierarchyType: "REVENUE",
      },
      {
        jsonPath: 'sourceSegregations[0].dumpingGround.siteDetails.location.code',
        isBoundary: true,
        name: 'Road/Street',
        hierarchyType: "REVENUE",
      },
      {
        jsonPath: 'sourceSegregations[0].dumpingGround.siteDetails.location.code',
        isBoundary: true,
        name: 'Colony/Society/Complex',
        hierarchyType: "REVENUE",
      },
       'sourceSegregationDate','totalDryWasteCollected','totalWetWasteCollected','totalWasteCollected'],
      resultPath: 'sourceSegregations',
      rowClickUrlUpdate: '/update/swm/sourcesegregations/{code}',
      rowClickUrlView: '/view/swm/sourcesegregations/{code}',
      orientation:"portrait"
    },
    isBoundary: true,
    hierarchyType: "REVENUE",
    jPathBoundary: 'dumpingGround.siteDetails.location.code'
  },
  'swm.create': {
    // beforeHandleChange:`if (property=="sourceSegregations[0].dumpingGround.code") {
    //   if (dropDownOringalData && dropDownOringalData.hasOwnProperty("sourceSegregations[0]-dumpingGround-code")) {
    //     var dG=dropDownOringalData['sourceSegregations[0]-dumpingGround-code']["MdmsRes"]["swm"]["DumpingGround"];
    //     for (var i = 0; i < dG.length; i++) {
    //       if (dG[i].code==e.target.value) {
    //         handleChange(
    //           {target:{value:dG[i].siteDetails.location}},
    //           "sourceSegregations[0].dumpingGround.siteDetails.location",
    //           false,
    //           "",
    //           "",
    //           "patternErrMsg"
    //         );
    //       }
    //     }
    //   }
    // }`,
    preApiCalls:[
      {
        url:"/tenant/v1/tenant/_search",
        jsonPath:"sourceSegregations[0]-ulb-code",
        jsExpForDD:{
          key:"$..tenant.*.code",
          value:"$..tenant.*.name",
        }
      }
    ],
    numCols: 4,
    useTimestamp: true,
    objectName: 'sourceSegregations',
    idJsonPath: 'sourceSegregations[0].code',
    title: 'swm.sourcesegregations.create.title',
    groups: [
      {
        name: 'SourceSegregationDetails',
        multiple:false,
        label: 'swm.create.group.title.SourceSegregationDetails',
        fields: [
          {
            name: 'code',
            jsonPath: 'sourceSegregations[0].dumpingGround.code',
            label: 'swm.create.dumpingGround',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: 256,
            minLength: 1,
            patternErrorMsg: '',
            // url: "/egov-mdms-service/v1/_get?&moduleName=swm&masterName=DumpingGround|$.MdmsRes.swm.DumpingGround[*].code|$.MdmsRes.swm.DumpingGround[*].name",
            // autoCompleteDependancy: {
            //   autoCompleteUrl: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=DumpingGround&filter%3D%5B%3F(%40.code%3D=%22{sourceSegregations[0].dumpingGround.code}%22)]',
            //   autoFillFields: {
            //     "sourceSegregations[0].dumpingGround.siteDetails.location.code":"MdmsRes.swm.DumpingGround[0].siteDetails.location.code"
            //   },
            // },

            mdms: {
              moduleName: 'swm',
              masterName: 'DumpingGround',
              filter: '',
              key: 'code',
              value: 'name',
            },
          },
          {
            name: 'sourceSegregationDate',
            jsonPath: 'sourceSegregations[0].sourceSegregationDate',
            label: 'swm.create.sourceSegregationDate',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'ulb',
            jsonPath: 'sourceSegregations[0].ulb.code',
            label: 'swm.create.ulb',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: 256,
            minLength: 1,
            patternErrorMsg: '',
            url: '',
            mdms: {
              moduleName: 'swm',
              masterName: 'DumpingGround',
              filter: '',
              key: '$..ulbs.*.code',
              value: '$..ulbs.*.name',
              dependant: {
                jsonExp: "$.swm.DumpingGround[?(@.code=='sourceSegregations[0].dumpingGround.code')]",
              },
            },
          },
        ],
      },
      {
        name: 'LocationDetails',
        label: 'swm.collectionpoints.create.group.title.LocationTwo',
        fields: [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "sourceSegregations[0].dumpingGround.siteDetails.location.code",
            "isRequired": false,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
            "isDisabled":true,
            "setResponseData": true,
            mdms: {
              moduleName: 'swm',
              masterName: 'DumpingGround',
              filter: '',
              key: '$..siteDetails.location.code',
              value: '$..siteDetails.location.code', 
              dependant: {
                jsonExp: "$.swm.DumpingGround[?(@.code=='sourceSegregations[0].dumpingGround.code')]",
              },
            },
          }
          // {
          //   type: "tableListTemp",
          //   jsonPath: "sourceSegregations[0].dumpingGround",
          //   tableList: {
          //     header: [{
          //         label: "swm.create.sanitationstaffschedules.colletionPoint.location"
          //       },
          //     ],
          //     values: [
          //       {
          //         "type": "boundary",
          //         "label": "",
          //         "hierarchyType": "REVENUE",
          //         "jsonPath": "sourceSegregations[0].dumpingGround.siteDetails.location.code",
          //         "isRequired": true,
          //         "patternErrorMsg": "",
          //         "isDisabled":true,
          //         "setResponseData": true,
          //         "multiple": true,
          //       },
          //     ],
          //     actionsNotRequired: true
          //   },
          //   hasPreTransform: true,
          // }
        ],
      },
      {
        name: 'CollectionTypeDetails',
        label: 'swm.create.group.title.CollectionTypeDetails',
        jsonPath: 'sourceSegregations[0].collectionDetails',
        multiple: true,
        fields: [
          {
            name: 'code',
            jsonPath: 'sourceSegregations[0].collectionDetails[0].collectionType.code',
            label: 'swm.create.collectionType',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=CollectionType|$..code|$..name',
          },
          {
            name: 'wetWasteCollected',
            jsonPath: 'sourceSegregations[0].collectionDetails[0].wetWasteCollected',
            label: 'swm.create.collectionDetails.wetWasteCollected',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'dryWasteCollected',
            jsonPath: 'sourceSegregations[0].collectionDetails[0].dryWasteCollected',
            label: 'swm.create.collectionDetails.dryWasteCollected',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
        ],
      },
    ],
    url: '/swm-services/sourcesegregations/_create',
    tenantIdRequired: true,
  },
  'swm.view': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'sourceSegregations',
    groups: [
      {
        name: 'SourceSegregationDetails',
        label: 'swm.create.group.title.SourceSegregationDetails',
        fields: [
          {
            name: 'code',
            jsonPath: 'sourceSegregations[0].dumpingGround.name',
            label: 'swm.create.dumpingGround',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 256,
            minLength: 1,
            patternErrorMsg: '',
          },
          {
            name: 'sourceSegregationDate',
            jsonPath: 'sourceSegregations[0].sourceSegregationDate',
            label: 'swm.create.sourceSegregationDate',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'ulb',
            jsonPath: 'sourceSegregations[0].ulb.name',
            label: 'swm.create.ulb',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: 256,
            minLength: 1,
            patternErrorMsg: '',
          },
        ],
      },
      {
        name: 'LocationDetails',
        label: 'swm.collectionpoints.create.group.title.LocationTwo',
        fields: [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "sourceSegregations[0].dumpingGround.siteDetails.location.code",
            "isRequired": false,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
            "isDisabled":true,
            "setResponseData": true
          }
        ],
      },
      {
        name: 'CollectionTypeDetails',
        label: 'swm.create.group.title.CollectionTypeDetails',
        jsonPath: 'sourceSegregations[0].collectionDetails',
        multiple: true,
        fields: [
          {
            name: 'code',
            jsonPath: 'sourceSegregations[0].collectionDetails[0].collectionType.name',
            label: 'swm.create.collectionType',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
          },
          {
            name: 'wetWasteCollected',
            jsonPath: 'sourceSegregations[0].collectionDetails[0].wetWasteCollected',
            label: 'swm.create.collectionDetails.wetWasteCollected',
            pattern: '',
            type: 'number',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'dryWasteCollected',
            jsonPath: 'sourceSegregations[0].collectionDetails[0].dryWasteCollected',
            label: 'swm.create.collectionDetails.dryWasteCollected',
            pattern: '',
            type: 'number',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
        ],
      },
    ],
    tenantIdRequired: true,
    url: '/swm-services/sourcesegregations/_search?code={code}',
  },
  'swm.update': {
    preApiCalls:[
      {
        url:"/tenant/v1/tenant/_search",
        jsonPath:"sourceSegregations[0]-ulb-code",
        jsExpForDD:{
          key:"$..tenant.*.code",
          value:"$..tenant.*.name",
        }
      }
    ],
    // beforeHandleChange:`if (property=="sourceSegregations[0].dumpingGround.code") {
    //   if (dropDownOringalData && dropDownOringalData.hasOwnProperty("sourceSegregations[0]-dumpingGround-code")) {
    //     var dG=dropDownOringalData['sourceSegregations[0]-dumpingGround-code']["MdmsRes"]["swm"]["DumpingGround"];
    //     for (var i = 0; i < dG.length; i++) {
    //       if (dG[i].code==e.target.value) {
    //         handleChange(
    //           {target:{value:dG[i].siteDetails.location}},
    //           "sourceSegregations[0].dumpingGround.siteDetails.location",
    //           false,
    //           "",
    //           "",
    //           "patternErrMsg"
    //         );
    //       }
    //     }
    //   }
    // }`,
    numCols: 4,
    useTimestamp: true,
    objectName: 'sourceSegregations',
    idJsonPath: 'sourceSegregations[0].code',
     title: 'swm.sourcesegregations.create.title',
    groups: [
      {
        name: 'SourceSegregationDetails',
        label: 'swm.create.group.title.SourceSegregationDetails',
        fields: [
          {
            name: 'code',
            jsonPath: 'sourceSegregations[0].dumpingGround.code',
            label: 'swm.create.dumpingGround',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: 256,
            minLength: 1,
            patternErrorMsg: '',
            url: '',
            mdms: {
              moduleName: 'swm',
              masterName: 'DumpingGround',
              filter: '',
              key: 'code',
              value: 'name',
            },
          },
          {
            name: 'sourceSegregationDate',
            jsonPath: 'sourceSegregations[0].sourceSegregationDate',
            label: 'swm.create.sourceSegregationDate',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'ulb',
            jsonPath: 'sourceSegregations[0].ulb.code',
            label: 'swm.create.ulb',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: 256,
            minLength: 1,
            patternErrorMsg: '',
            url: '',
            mdms: {
              moduleName: 'swm',
              masterName: 'DumpingGround',
              filter: '',
              key: '$..ulbs.*.code',
              value: '$..ulbs.*.name',
              dependant: {
                jsonExp: "$.swm.DumpingGround[?(@.code=='sourceSegregations[0].dumpingGround.code')]",
              },
            },
          },
        ],
      },
      {
        name: 'LocationDetails',
        label: 'swm.collectionpoints.create.group.title.LocationTwo',
        fields: [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "sourceSegregations[0].dumpingGround.siteDetails.location.code",
            "isRequired": false,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
            "isDisabled":true,
            mdms: {
              moduleName: 'swm',
              masterName: 'DumpingGround',
              filter: '',
              key: '$..siteDetails.location.code',
              value: '$..siteDetails.location.code', 
              dependant: {
                jsonExp: "$.swm.DumpingGround[?(@.code=='sourceSegregations[0].dumpingGround.code')]",
              },
            },
          }
        ],
      },
      {
        name: 'CollectionTypeDetails',
        label: 'swm.create.group.title.CollectionTypeDetails',
        jsonPath: 'sourceSegregations[0].collectionDetails',
        multiple: true,
        fields: [
          {
            name: 'code',
            jsonPath: 'sourceSegregations[0].collectionDetails[0].collectionType.code',
            label: 'swm.create.collectionType',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=CollectionType|$..code|$..name'
          },
          {
            name: 'wetWasteCollected',
            jsonPath: 'sourceSegregations[0].collectionDetails[0].wetWasteCollected',
            label: 'swm.create.collectionDetails.wetWasteCollected',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'dryWasteCollected',
            jsonPath: 'sourceSegregations[0].collectionDetails[0].dryWasteCollected',
            label: 'swm.create.collectionDetails.dryWasteCollected',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
        ],
      },
    ],
    url: '/swm-services/sourcesegregations/_update',
    tenantIdRequired: true,
    searchUrl: '/swm-services/sourcesegregations/_search?code={code}',
  },
};
export default dat;
