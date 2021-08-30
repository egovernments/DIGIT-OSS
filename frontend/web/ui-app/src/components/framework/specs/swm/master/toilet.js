const saveOnLocal =`
     let _mockData = { ...self.props.mockData }
    let formData = { ...self.props.formData }
    var groupArr = _mockData[self.props.moduleName + "." + self.props.actionName].groups;
    groupArr.map((data) => {
      data.fields.map((innerData) => {
        if (!!innerData.acceptCode) {
          console.log(formData.MasterMetaData)
          if (!_.isEmpty(formData) && formData.MasterMetaData.masterData[0] != 'undefined') {
            if (formData.MasterMetaData.masterData[0].hasOwnProperty('toiletType')) {
              formData.MasterMetaData.masterData[0].code = innerData.defaultValue + formData.MasterMetaData.masterData[0].toiletType.code + '-' + new Date().getTime()
            }

          }

        }

      })})
`
var dat={
  'swm.search': {
    preApiCalls: [
      {
        url: "/egov-mdms-service/v1/_get",
        jsonPath: "ToiletType",
        qs: {
          moduleName: "swm",
          masterName: "ToiletType"
        },
        jsExpForDD: {
          key: "$..code",
          value: "$..name",
        }
      },
    ],

    numCols: 4,
    useTimestamp: true,
    objectName: 'Toilet',
    title: 'swm.toiletmaster.search.title',
    url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=Toilet',

    groups: [
      {

        name: 'populationLocation',
        label: 'swm.create.group.title.LocationDetails',
        fields: [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": 'location.code',
            "isRequired": false,
            "patternErrorMsg": "",
            "multiple": true,
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
      {
        name: 'ToiletName',
        fields: [
          {
            name: 'code',
            label: 'swm.toiletmaster.create.toiletName',
            jsonPath: 'code',
            type: 'autoCompelete',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=Toilet|$..Toilet.*.code|$..Toilet.*.name',
            patternErrorMsg: '',
          },
        /*  
          {
            name: 'ToiletLocations',
            label: 'swm.toiletmaster.create.ToiletLocations',
            jsonPath: 'location.code',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
           // url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=Toilet|$..Toilet.*.location.code|$..Toilet.*.name',
            patternErrorMsg: '',
          }, */

          {
            name: 'isPublictoilet',
            jsonPath: 'toiletType.code',
            type: 'singleValueList',
            label: 'swm.create.PublicsToilet',
            styleObj: { display: '-webkit-box' },
            isDisabled: false,
            patternErrorMsg: '',
            url: "/egov-mdms-service/v1/_get?&moduleName=swm&masterName=ToiletType|$..code|$..name",

          },

        ],
      },
    ],
    result: {
      header: [
        {
          label: 'swm.toiletmaster.create.toiletName',
        },
      
        {
          label: 'swm.toiletmaster.create.SeatsCount',
        },
        {
          label: 'swm.toiletmaster.create.toiletAddress',
        },
        {
          label: 'swm.create.PublicsToilet',
        },

      ],
      values: [
        'name',
        'seatCount',
        'address',
        
        { jsonPath: 'toiletType.code', reduxObject: "ToiletType", isObj: true, cToN: true },

      ],
      resultPath: 'MdmsRes.swm.Toilet',
      resultIdKey: 'code',
      rowClickUrlUpdate: '/update/swm/toilet/{code}',
      rowClickUrlView: '/view/swm/toilet/{code}',
      isMasterScreen: true


    },
  },

'swm.create': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'MasterMetaData',
    idJsonPath: 'MdmsRes.swm.Toilet[0].code',
    title: 'swm.toiletmaster.create.title',
    afterHandleChange: saveOnLocal,// localStorage.setItem('toiletCode', 'MasterMetaData.masterData[0].toiletType.code'),
    groups:[
    {
    name: 'PublicToilet',
      
    fields:[

      {
        name: 'isPublictoilet',
        jsonPath: 'MasterMetaData.masterData[0].toiletType.code',
        type: 'singleValueList',
        label: 'swm.create.PublicsToilet',
        styleObj: { display: '-webkit-box' },
        isDisabled: false,
        patternErrorMsg: '',
        saveDataOnLocal:true,
        url: "/egov-mdms-service/v1/_get?&moduleName=swm&masterName=ToiletType|$..code|$..name",
        },
        {
            name : 'toiletName',
            label : 'swm.toiletmaster.create.toiletName',
            jsonPath: 'MasterMetaData.masterData[0].name',
            type : 'text',
            isRequired: true,
            isDisabled: false,
            defaultValue:'',
            url :'',
            patternErrorMsg: '',
        },
        {
            name: 'toiletAddress',
            label: 'swm.toiletmaster.create.toiletAddress',
            jsonPath: 'MasterMetaData.masterData[0].address',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
        ],  
    },
    {

        name: 'toiletLocation',
        label: 'swm.create.group.title.LocationDetails',
        fields: [
        {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": 'MasterMetaData.masterData[0].location.code',
            "isRequired": true,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
          },
          ],
      },
      {
        name: 'GeoCordinates',
        label: 'swm.toiletmaster.create.title.GeoCordinates',
        fields: [
          {
            name: 'searchLocation',
            jsonPathAddress: '',
            jsonPathLng: 'MasterMetaData.masterData[0].longitude',
            jsonPathLat: 'MasterMetaData.masterData[0].latitude',
            label: 'ac.create.Location',
            pattern: '',
            type: 'googleMaps',
            url: '',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            hideTextarea: true
          },
          {
            name: 'Latitude',
            label: 'swm.toiletmaster.create.Latitude',
            type: 'text',
            jsonPath: "MasterMetaData.masterData[0].latitude",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
            url: '',
          },

          {
            name: 'Longitude',
            label: 'swm.toiletmaster.create.Longitude',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
            jsonPath: "MasterMetaData.masterData[0].longitude",
            url: '',
          },
        ],
      },
      {
        name: 'toiletmaster',
        jsonPath: '',
        fields:[
        {
            name: 'SeatCount',
            jsonPath: 'MasterMetaData.masterData[0].seatCount',
            label: 'swm.toiletmaster.create.title.SeatCount',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '',
          },
        ],
      },
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
            defaultValue: 'Toilet',
            isRequired: true,
            type: 'text',
            hide: true
          },
          {
            name: 'code',
            jsonPath: 'MasterMetaData.masterData[0].code',
            defaultValue: 'MH-'+localStorage.getItem("tenantId") +'-' ,  
            isRequired: true,
            type: 'text',
            hide: true,
            acceptCode:true,
          },
        ]
      }
    ], 
  url: 'egov-mdms-create/v1/_create',
  isMDMSScreen: true,
  tenantIdRequired: true,
},
'swm.update': {
    numCols: 3,
    useTimestamp: true,
    objectName: 'Toilet',
    title: 'swm.toiletmaster.create.title',
    url: '/egov-mdms-create/v1/_update',
    searchUrl: '/egov-mdms-service/v1/_search?code={code}',
    idJsonPath: 'MasterMetaData.masterData[0].code',

    groups:[
    {
      name: 'PublicToilet',
  
      fields:[
        // {
        //     name: 'isPublictoilet',
        //     jsonPath: 'MdmsRes.swm.Toilet["0"].publicToilet',
        //     type: 'radio',
        //     styleObj: { display: '-webkit-box' },
        //     isRequired: false,
        //     isDisabled: false,
        //     patternErrorMsg: '',
        //     values: [
        //       {
        //         label: 'swm.create.PublicsToilet',
        //         value: true,
        //       },
        //     ],
        //     defaultValue: false,
        //   },

        {
          name: 'isPublictoilet',
          jsonPath: 'MasterMetaData.masterData[0].toiletType.code',
          type: 'singleValueList',
          label: 'swm.create.PublicsToilet',
          styleObj: { display: '-webkit-box' },
          isRequired: false,
          isDisabled: false,
          patternErrorMsg: '',
          defaultValue: false,
          url: "/egov-mdms-service/v1/_get?&moduleName=swm&masterName=ToiletType|$..code|$..name",
        },
        {
            name : 'toiletName',
            label : 'swm.toiletmaster.create.toiletName',
            jsonPath: "MasterMetaData.masterData[0].name",
            type : 'text',
            isRequired: true,
            isDisabled: false,
            defaultValue:'',
            url :'',
            patternErrorMsg: '',
        },
        {
            name: 'toiletAddress',
            label: 'swm.toiletmaster.create.toiletAddress',
            jsonPath: "MasterMetaData.masterData[0].address",
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
        ],  
    }, 
    {
        name: 'toiletLocation',
        label: 'swm.create.group.title.LocationDetails',
        fields: [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": 'MasterMetaData.masterData[0].location.code',
            "isRequired": true,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
          },
      /*     {
            name: 'toiletZone',
            jsonPath: 'toilet.voucher',
            label: 'swm.toiletmaster.create.toiletZone',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'toiletStreet',
            jsonPath: 'toilet.amount',
            label: 'swm.toiletmaster.create.toiletStreet',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'toiletSociety',
            jsonPath: 'toilet.Society',
            label: 'swm.toiletmaster.create.toiletSociety',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '',
          }, */
   
          ],
      },
      {
        name: 'GeoCordinates',
        label: 'swm.toiletmaster.create.title.GeoCordinates',
        fields: [
          {
            name: 'searchLocation',
            jsonPathAddress: '',
            jsonPathLng: 'MasterMetaData.masterData[0].longitude',
            jsonPathLat: 'MasterMetaData.masterData[0].latitude',
            label: 'ac.create.Location',
            pattern: '',
            type: 'googleMaps',
            url: '',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            hideTextarea: true
          },
          {
            name: 'Latitude',
            label: 'swm.toiletmaster.create.Latitude',
            type: 'text',
            jsonPath: "MasterMetaData.masterData[0].latitude",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
            url: '',
          },

          {
            name: 'Longitude',
            label: 'swm.toiletmaster.create.Longitude',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
            jsonPath: "MasterMetaData.masterData[0].longitude",
            url: '',
          },
        ],
      },
      {
        name: 'toiletmaster',
        jsonPath: '',
        fields:[
        {
            name: 'SeatCount',
            jsonPath: 'MasterMetaData.masterData[0].seatCount',
            label: 'swm.toiletmaster.create.title.SeatCount',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '',
          },
        ],
      },
      
    ], 
 tenantIdRequired: true,
 isMDMSScreen: true,
},
'swm.view': {
  preApiCalls: [
    {
      url: "egov-mdms-service/v1/_get",
      jsonPath: "ToiletType",
      qs: {
        moduleName: "swm",
        masterName: "ToiletType"
      },
      jsExpForDD: {
        key: "$..code",
        value: "$..name",
      }
    }
  ],

    numCols: 3,
    useTimestamp: true,
    objectName: 'Toilet',
    title: 'swm.toiletmaster.create.title',
    //searchUrl: '/egov-mdms-service/v1/_search?code={code}',
    groups:[
    {
    name: 'PublicToilet',
    jsonPath: '',
    fields:[
          {
            name: 'ToiletID',
            label: 'swm.toiletmaster.view.toiletId',
            jsonPath: 'MdmsRes.swm.Toilet[0].code',
            type: 'label',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            url: '',
            patternErrorMsg: '',
          },
          {
    
            name: 'isPublictoilet',
            jsonPath: 'MdmsRes.swm.Toilet[0].toiletType.code',
            type: 'label',
            label: 'swm.create.PublicsToilet',
            styleObj: { display: '-webkit-box' },
            isDisabled: false,
            patternErrorMsg: '',
            url: "/egov-mdms-service/v1/_get?&moduleName=swm&masterName=ToiletType|$..code|$..name",
            reduxObject: "ToiletType",
            cToN: true 
          },
          {
            name : 'toiletName',
            label : 'swm.toiletmaster.create.toiletName',
            jsonPath: 'MdmsRes.swm.Toilet["0"].name',
            type : 'label',
            isRequired: true,
            isDisabled: false,
            defaultValue:'',
            url :'',
            patternErrorMsg: '',
        },
        {
            name: 'toiletAddress',
            label: 'swm.toiletmaster.create.toiletAddress',
            jsonPath: "MdmsRes.swm.Toilet[0].address",
            type: 'label',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
        ],  
    }, 
    {

        name: 'toiletLocation',
        label: 'swm.create.group.title.LocationDetails',
        fields: [
        {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": 'MdmsRes.swm.Toilet[0].location.code',
            "isRequired": true,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
          },
        // {
        //     name: 'toiletward',
        //     jsonPath: 'toilet.ward',
        //     label: 'swm.toiletmaster.create.toiletWard',
        //     pattern: '',
        //     type: 'label',
        //     isRequired: true,
        //     isDisabled: false,
        //     patternErrorMsg: '',
        //     url: '',
        //   },
        //   {
        //     name: 'toiletZone',
        //     jsonPath: 'toilet.voucher',
        //     label: 'swm.toiletmaster.create.toiletZone',
        //     pattern: '',
        //     type: 'label',
        //     isRequired: true,
        //     isDisabled: false,
        //     patternErrorMsg: '',
        //     url: '',
        //   },
        //   {
        //     name: 'toiletStreet',
        //     jsonPath: 'toilet.amount',
        //     label: 'swm.toiletmaster.create.toiletStreet',
        //     pattern: '',
        //     type: 'label',
        //     isRequired: true,
        //     isDisabled: false,
        //     patternErrorMsg: '',
        //     url: '',
        //   },
        //   {
        //     name: 'toiletSociety',
        //     jsonPath: 'toilet.Society',
        //     label: 'swm.toiletmaster.create.toiletSociety',
        //     pattern: '',
        //     type: 'label',
        //     isRequired: true,
        //     isDisabled: false,
        //     patternErrorMsg: '',
        //     url: '',
        //   },
          ],
      },
      {
        name: 'GeoCordinates',
        label: 'swm.toiletmaster.create.title.GeoCordinates',
        fields: [{
          name: 'Latitude',
          label: 'swm.toiletmaster.create.Latitude',
          type: 'googleMaps',
          jsonPath: 'MdmsRes.swm.Toilet["0"].latitude',
          isRequired: false,
          isDisabled: false,
          patternErrorMsg: '',
          url: '', 
          hideTextarea: true
        },
          /* {
            name: 'Latitude',
            label: 'swm.toiletmaster.create.Latitude',
            type: 'label',
            jsonPath: 'MdmsRes.swm.Toilet["0"].latitude',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            url: '',
          },
 */
          {
            name: 'Longitude',
            label: 'swm.toiletmaster.create.Longitude',
            pattern: '',
            type: 'label',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            jsonPath: 'MdmsRes.swm.Toilet["0"].longitude',
            url: '',
          },
        ],
      },
      {
        name: 'toiletmaster',
        jsonPath: '',
        fields:[
        {
            name: 'SeatCount',
            jsonPath: 'MdmsRes.swm.Toilet["0"].seatCount',
            label: 'swm.toiletmaster.create.title.SeatCount',
            pattern: '',
            type: 'label',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
        ],
      },
      
    ], 
     tenantIdRequired: true,
     url: '/egov-mdms-service/v1/_search?code={code}',
},
};
export default dat;