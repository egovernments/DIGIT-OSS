var dat ={
'swm.search': {

  preApiCalls: [
    // {
    //   url: "/tenant/v1/tenant/_search",
    //   jsonPath: "ulbs",
    //   jsExpForDD: {
    //     key: "$..tenant.*.code",
    //     value: "$..tenant.*.name",
    //   }
    // },
    {
      url: "/egov-location/location/v11/boundarys/_search?&hierarchyTypeCode=REVENUE&boundaryType=Ward",
      jsonPath: "ward",
      jsExpForDD: {
        key: "$.TenantBoundary.*.boundary.*.code",
        value: "$.TenantBoundary.*.boundary.*.name",
      }
    },
      /* {
          url: "/egov-location/location/v11/boundarys/_search?&hierarchyTypeCode=REVENUE&boundaryType=Zone",
         jsonPath: "zone",
        jsExpForDD: {
          key: "$.TenantBoundary.*.boundary.*.code",
          value: "$.TenantBoundary.*.boundary.*.name",
      }
    }*/
  ],

    numCols: 4,
    useTimestamp: true,
    objectName: 'Population',
    title: 'swm.populationmaster.search.title',
    url: '/egov-mdms-service/v1/_get?tenantId=default&moduleName=swm&masterName=Population',

    groups: [

      {

        name: 'populationLocation',
        label: 'swm.toiletmaster.create.populationLocation',
        fields: [
          // {
          //   "type": "boundary",
          //   "label": "",
          //   "hierarchyType": "REVENUE",
          //   "jsonPath": 'location.code',
          //   "isRequired": false,
          //   "patternErrorMsg": "",
          //   "multiple": true,
          //   "fullWidth": true,
          // },
           {
            name: 'Ward',
            label: 'swm.populationmaster.create.ward',
            jsonPath: 'ward',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-location/location/v11/boundarys/_search?&hierarchyTypeCode=REVENUE&boundaryType=Ward|$.TenantBoundary.*.boundary.*.code|$.TenantBoundary.*.boundary.*.name',
         depedants:[{
          jsonPath:'zone',
          type: 'dropDown',
          pattern:'/egov-location/location/v11/boundarys/_search?&hierarchyTypeCode=REVENUE&codes={ward}|$.TenantBoundary.*.boundary.*.children.*.name|$.TenantBoundary.*.boundary.*.children.*.name'
         }],

          },
          {
            name: 'Zone', 
            label: 'swm.populationmaster.create.Zone',
            type: 'singleValueList',
            jsonPath: 'zone',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            url: ''
          },
           ],
      }, 
    {
    name: 'PopulationDetails',
    label: 'swm.populationmaster.create.group.title.PopulationDetails',
    jsonPath: '',
    fields:[
        //   {
        //     name : 'ulb',
        //     label : 'swm.populationmaster.create.ulb',
        //     type: 'autoCompelete',
        //     jsonPath: "ulb.code",
        //     isRequired: false,
        //     isDisabled: false,
        //     //defaultValue:'Autocomplete',
        //     patternErrorMsg: '',
        //     url: '/egov-mdms-service/v1/_get?&moduleName=tenant&masterName=tenants|$..tenants.*.code|$..tenants.*.name',
        // },
          {
            name: 'Census',
            label: 'swm.populationmaster.create.Census',
            type: 'singleValueList',
            isCurrentYear: true,
            jsonPath: 'censusYear',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=CensusYear|$..code|$..name',
          },
           {
            name: 'PopulationFrom',
            label: 'swm.populationmaster.search.populationfrom',
            type: 'number',
            jsonPath: 'population >',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            isNumber:true,
          },
            {
            name: 'PopulationTo',
            label: 'swm.populationmaster.search.populationto',
            type: 'number',
            jsonPath: 'population <',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
             isNumber:true,
          },
             {
            name: 'GarbageFrom',
            label: 'swm.populationmaster.search.garbagefrom',
            type: 'number',
            jsonPath: 'garbageToBeCollected >',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            isNumber:true,
          },
            {
            name: 'GarbageTo',
            label: 'swm.populationmaster.search.garbageto',
            type: 'number',
            jsonPath: 'garbageToBeCollected <',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            isNumber:true,
          },
      // name : 'ulb',
      // label : 'swm.populationmaster.create.ulb',
      // jsonPath: "MasterMetaData.masterData[0].ulb.code",
      // type : 'singleValueList',
      // isRequired: true,
      // isDisabled: false,
      // defaultValue: 'Autocomplete',
      // url: '/egov-mdms-service/v1/_get?&moduleName=tenant&masterName=tenants|$..tenants.*.code|$..tenants.*.name',
      // patternErrorMsg: '',

        ], 
      },
        
   
    ],
    result: {
      header: [
        {
          label: 'swm.populationmaster.create.Census',
        },
        {
          label: 'swm.populationmaster.create.populationEstimate',
        },
        {
            label: 'swm.populationmaster.create.GarbageToCollect',
        },
        // {
        //     label: 'swm.populationmaster.create.ulb',
        // },
       {
            label: 'swm.populationmaster.create.ward',
        },
       {
            label: 'swm.populationmaster.create.Zone',
        },
      ],
      values: [
      'censusYear',
        'population',
      'garbageToBeCollected',
        // { jsonPath: 'ulb.code', reduxObject: "ulbs", isObj: true, cToN: true },
        { jsonPath: 'ward', reduxObject: "ward", isObj: true, cToN: true },
        { jsonPath: 'zone', reduxObject: "zone", isObj: true, cToN: true },
      //'ulb.code',
      ],
      resultPath: 'MdmsRes.swm.Population',
      rowClickUrlUpdate: '/update/swm/population/{code}',
      rowClickUrlView: '/view/swm/population/{code}',
      isMasterScreen: true
    },
    },
'swm.view': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'Population',
    title: 'swm.populationmaster.create.title',
    url: '/egov-mdms-service/v1/_search?code={code}',
    groups:[
    {
        name: 'PopulationDetails',
        label: 'swm.populationmaster.create.group.title.PopulationDetails',
        jsonPath: '',
        fields:[
        // {
        //     name : 'ulb',
        //     label : 'swm.populationmaster.create.ulb',
        //     jsonPath: 'MdmsRes.swm.Population["0"].ulb.code',
        //     type : 'label',
        //     isRequired: true,
        //     isDisabled: false,
        //     defaultValue:'Autocomplete',
        //     url: '/egov-mdms-service/v1/_get?&moduleName=tenant&masterName=tenants|$..tenants.*.code|$..tenants.*.name',
        //     patternErrorMsg: '',
        // },
        {
          name: 'Ward',
          label: 'swm.populationmaster.create.ward',
          jsonPath: 'MdmsRes.swm.Population["0"].ward',
          type: 'label',
          isRequired: false,
          isDisabled: false,
          patternErrorMsg: '',
          defaultValue:'Autocomplete',
          url: '/egov-location/location/v11/boundarys/_search?tenantId=default&hierarchyTypeCode=REVENUE&boundaryType=Ward|$.TenantBoundary.*.boundary.*.code|$.TenantBoundary.*.boundary.*.name'
        },
        {
          name: 'Zone', 
          label: 'swm.populationmaster.create.Zone',
          type: 'label',
          jsonPath: 'MdmsRes.swm.Population["0"].zone',
          isRequired: false,
          isDisabled: false,
          patternErrorMsg: '',
          defaultValue:'Autocomplete',
          url: '/egov-location/location/v11/boundarys/_search?tenantId=default&hierarchyTypeCode=REVENUE&boundaryType=Zone|$.TenantBoundary.*.boundary.*.code|$.TenantBoundary.*.boundary.*.name'
        },
          {
            name: 'Census',
            label: 'swm.populationmaster.create.Census',
            type: 'label',
            jsonPath: 'MdmsRes.swm.Population["0"].censusYear',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
           {
            name: 'populationEstimate',
            label: 'swm.populationmaster.create.populationEstimate',
            type: 'label',
            jsonPath: 'MdmsRes.swm.Population["0"].population',
            isRequired: true,
            isDisabled: false, 
            patternErrorMsg: '',
          },
          {
            name: 'GarbageToCollect',
            label: 'swm.populationmaster.create.GarbageToCollect',
            type: 'label',
            jsonPath: 'MdmsRes.swm.Population["0"].garbageToBeCollected',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          
        ],  
    }, 
      // {

      //   name: 'populationLocation',
      //   label: 'swm.toiletmaster.create.populationLocation',
      //   fields: [
      //     // {
      //     //   "type": "boundary",
      //     //   "label": "",
      //     //   "hierarchyType": "REVENUE",
      //     //   "jsonPath": 'MdmsRes.swm.Population["0"].location.code',
      //     //   "isRequired": true,
      //     //   "patternErrorMsg": "",
      //     //   "multiple": true,
      //     //   "fullWidth": true,
      //     // },
      //      {
      //       name: 'Ward',
      //       label: 'swm.populationmaster.create.ward',
      //       jsonPath: 'MdmsRes.swm.Population["0"].ward',
      //       type: 'label',
      //       isRequired: false,
      //       isDisabled: false,
      //       patternErrorMsg: '',
      //       defaultValue:'Autocomplete',
      //       url: '/egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName?&boundaryTypeName=WARD&hierarchyTypeName=REVENUE|$.Boundary.*.boundaryNum|$.Boundary.*.name'
      //     },
      //     {
      //       name: 'Zone', 
      //       label: 'swm.populationmaster.create.Zone',
      //       type: 'label',
      //       jsonPath: 'MdmsRes.swm.Population["0"].zone',
      //       isRequired: false,
      //       isDisabled: false,
      //       patternErrorMsg: '',
      //       defaultValue:'Autocomplete',
      //       url: '/egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName?&boundaryTypeName=ZONE&hierarchyTypeName=REVENUE|$.Boundary.*.boundaryNum|$.Boundary.*.name'
      //     },
          
      //   ],
      // },

      
    ], 
},

'swm.update': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'Population',
    title: 'swm.populationmaster.create.title',
    url: '/egov-mdms-create/v1/_update',
    searchUrl: '/egov-mdms-service/v1/_search?code={code}',
    idJsonPath: 'MasterMetaData.masterData[0].code',
    groups:[
    {
        name: 'PopulationDetails',
        label: 'swm.populationmaster.create.group.title.PopulationDetails',
        jsonPath: '',
        fields:[
        // {
        //     name : 'ulb',
        //     label : 'swm.populationmaster.create.ulb',
        //     jsonPath: "MasterMetaData.masterData[0].ulb.code",
        //     type : 'autoCompelete',
        //     isRequired: true,
        //     isDisabled: false,
        //    // defaultValue:'Autocomplete',
        //     url: '/egov-mdms-service/v1/_get?&moduleName=tenant&masterName=tenants|$..tenants.*.code|$..tenants.*.name',
        //     patternErrorMsg: '',
        // },
        {
          name: 'Ward',
          label: 'swm.populationmaster.create.ward',
          jsonPath: 'MasterMetaData.masterData[0].ward',
          type: 'singleValueList',
          isRequired: true,
          isDisabled: false,
          patternErrorMsg: '',
          url: '/egov-location/location/v11/boundarys/_search?tenantId=default&hierarchyTypeCode=REVENUE&boundaryType=Ward|$.TenantBoundary.*.boundary.*.code|$.TenantBoundary.*.boundary.*.name',
       depedants:[{
          jsonPath:'MasterMetaData.masterData[0].zone',
          type: 'dropDown',
          pattern:'/egov-location/location/v11/boundarys/_search?&hierarchyTypeCode=REVENUE&codes={MasterMetaData.masterData[0].ward}|$.TenantBoundary.*.boundary.*.children.*.name|$.TenantBoundary.*.boundary.*.children.*.name'
         }],

        },
        {
          name: 'Zone', 
          label: 'swm.populationmaster.create.Zone',
          type: 'singleValueList',
          jsonPath: 'MasterMetaData.masterData[0].zone',
          isRequired: true,
          isDisabled: false,
          patternErrorMsg: '',
          url: ''
        },
        {
            name: 'Census',
            label: 'swm.populationmaster.create.Census',
            type: 'singleValueList',
            isCurrentYear: true,
            jsonPath: 'MasterMetaData.masterData[0].censusYear',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=CensusYear|$..code|$..name',
          },
          
           {
            name: 'populationEstimate',
            label: 'swm.populationmaster.create.populationEstimate',
            type: 'number',
            jsonPath: "MasterMetaData.masterData[0].population",
            isRequired: true,
            isDisabled: false, 
            patternErrorMsg: '',
            isNumber:true,
          },
          {
            name: 'GarbageToCollect',
            label: 'swm.populationmaster.create.GarbageToCollect',
            type: 'number',
            jsonPath: "MasterMetaData.masterData[0].garbageToBeCollected",
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            isNumber:true,
          },
        ],  
    }, 
      {
        name: 'populationLocation',
        label: 'swm.toiletmaster.create.populationLocation',
        hide: true,
        fields: [
          // {
          //   "type": "boundary",
          //   "label": "",
          //   "hierarchyType": "REVENUE",
          //   "jsonPath": 'MasterMetaData.masterData[0].location.code',
          //   "isRequired": true,
          //   "patternErrorMsg": "",
          //   "multiple": true,
          //   "fullWidth": true,
          // },
          {
            name: 'code',
            jsonPath: 'MasterMetaData.masterData[0].code',
            defaultValue: 'Population-' + new Date().getTime(),
            isRequired: true,
            type: 'text',
            hide: true,
          },
          {
            name: 'tenantId',
            jsonPath: 'MasterMetaData.masterData[0].tenantId',
            type: 'text',
            defaultValue: localStorage.getItem("tenantId"),
            hide: true
          },
          {
            name: 'moduleName',
            jsonPath: 'MasterMetaData.moduleName',
            type: 'text',
            defaultValue: 'swm',
            hide: true
          },
          {
            name: 'masterName',
            jsonPath: 'MasterMetaData.masterName',
            type: 'text',
            defaultValue: 'Population',
            hide: true
          },
        ],
      },
      
    ], 
  tenantIdRequired: true,
  isMDMSScreen: true,
},


'swm.create': {
    numCols: 4,
    useTimestamp: true,
  objectName: 'MasterMetaData',
  idJsonPath: 'MdmsRes.swm.Population[0].code',
    title: 'swm.populationmaster.create.title',
    groups:[
    {
    name: 'PopulationDetails',
    label: 'swm.populationmaster.create.group.title.PopulationDetails',
    jsonPath: '',
    fields:[
        // {
        //     name : 'ulb',
        //     label : 'swm.populationmaster.create.ulb',
        //     jsonPath: "MasterMetaData.masterData[0].ulb.code",
        //     type : 'autoCompelete',
        //     isRequired: true,
        //     isDisabled: false,
        //     url: '/egov-mdms-service/v1/_get?&moduleName=tenant&masterName=tenants|$..tenants.*.code|$..tenants.*.name',
        //     patternErrorMsg: '',
        // },
        {
          name: 'Ward',
          label: 'swm.populationmaster.create.ward',
          jsonPath: 'MasterMetaData.masterData[0].ward',
          type: 'singleValueList',
          isRequired: true,
          isDisabled: false,
          patternErrorMsg: '',
          url: '/egov-location/location/v11/boundarys/_search?tenantId=default&hierarchyTypeCode=REVENUE&boundaryType=Ward|$.TenantBoundary.*.boundary.*.code|$.TenantBoundary.*.boundary.*.name',
        
depedants:[{
          jsonPath:'MasterMetaData.masterData[0].zone',
          type: 'dropDown',
          pattern:'/egov-location/location/v11/boundarys/_search?&hierarchyTypeCode=REVENUE&codes={MasterMetaData.masterData[0].ward}|$.TenantBoundary.*.boundary.*.children.*.name|$.TenantBoundary.*.boundary.*.children.*.name'
         }],
        },
        {
          name: 'Zone', 
          label: 'swm.populationmaster.create.Zone',
          type: 'singleValueList',
          jsonPath: 'MasterMetaData.masterData[0].zone',
          isRequired: true,
          isDisabled: false,
          patternErrorMsg: '',
          url: ''
        },
          {
            name: 'Census',
            label: 'swm.populationmaster.create.Census',
            type: 'singleValueList',
            //  type:'text',
            isCurrentYear: true,
            jsonPath: "MasterMetaData.masterData[0].censusYear",
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=CensusYear|$..code|$..name',

          },
           {
            name: 'populationEstimate',
            label: 'swm.populationmaster.create.populationEstimate',
            //type: 'singleValueList',
            type:'number',
             jsonPath: "MasterMetaData.masterData[0].population",
            isRequired: true,
            isDisabled: false, 
            patternErrorMsg: '',
            isNumber:true,
          },
          {
            name: 'GarbageToCollect',
            label: 'swm.populationmaster.create.GarbageToCollect',
           // type: 'singleValueList',
           type:'number',
            jsonPath: "MasterMetaData.masterData[0].garbageToBeCollected",
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            isNumber:true,
          },
          
        ],  
    }, 
      // {

      //   name: 'populationLocation',
      //   label: 'swm.toiletmaster.create.populationLocation',
      //   fields: [
      //     // {
      //     //   "type": "boundary",
      //     //   "label": "",
      //     //   "hierarchyType": "REVENUE",
      //     //   "jsonPath": 'MasterMetaData.masterData[0].location.code',
      //     //   "isRequired": true,
      //     //   "patternErrorMsg": "",
      //     //   "multiple": true,
      //     //   "fullWidth": true,
      //     // },
      //       {
      //       name: 'Ward',
      //       label: 'swm.populationmaster.create.ward',
      //       jsonPath: 'MasterMetaData.masterData[0].ward',
      //       type: 'singleValueList',
      //       isRequired: true,
      //       isDisabled: false,
      //       patternErrorMsg: '',
      //       url: '/egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName?&boundaryTypeName=WARD&hierarchyTypeName=REVENUE|$.Boundary.*.boundaryNum|$.Boundary.*.name'
      //     },
      //     {
      //       name: 'Zone', 
      //       label: 'swm.populationmaster.create.Zone',
      //       type: 'singleValueList',
      //       jsonPath: 'MasterMetaData.masterData[0].zone',
      //       isRequired: true,
      //       isDisabled: false,
      //       patternErrorMsg: '',
      //       url: '/egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName?&boundaryTypeName=ZONE&hierarchyTypeName=REVENUE|$.Boundary.*.boundaryNum|$.Boundary.*.name'
      //     },
      //   ],
      // },

      {
        name: 'HideGroup',
        hide: true,
        fields: [
          {
            name: 'tenantId',
            jsonPath: 'MasterMetaData.masterData[0].tenantId',
            defaultValue: localStorage.getItem("tenantId"),
            isRequired: true,
            type: 'text',
            hide: true
          },
          {
            name: 'moduleName',
            jsonPath: 'MasterMetaData.moduleName',
            defaultValue: 'swm',
            isRequired: true,
            type: 'text',
            hide: true
          },
          {
            name: 'masterName',
            jsonPath: 'MasterMetaData.masterName',
            defaultValue: 'Population',
            isRequired: true,
            type: 'text',
            hide: true
          },
          {
            name: 'code',
            jsonPath: 'MasterMetaData.masterData[0].code',
            defaultValue: 'Population-' + new Date().getTime(),
            isRequired: true,
            type: 'text',
            hide: true
          },
        ]
      }
    ],
  url: '/egov-mdms-create/v1/_create',
  isMDMSScreen: true,
  tenantIdRequired: true 
},

};
export default dat;