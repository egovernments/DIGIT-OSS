var dat = {
  'swm.search': {
    beforeSubmit:
    `
    if(formData.code !== undefined){
      for(var i=0; i<dropDownData.code.length; i++){
        if(!(formData.code == dropDownData.code[i].key)){
          if(formData.code.toUpperCase() === dropDownData.code[i].value.toUpperCase()){
            formData.code = dropDownData.code[i].key;
            break;
          }
        }
      }
    }
    
    `,
    preApiCalls:[
      {
        url:"/egov-mdms-service/v1/_get",
        jsonPath:"processingSite.codeTwo",
        qs:{
          moduleName:"swm",
          masterName:"ProcessingSite"
        },
        jsExpForDD:{
          key:"$.MdmsRes.swm.ProcessingSite[*].code",
          value:"$..name",
        }
      },
    ],
    numCols: 4,
    useTimestamp: true,
    objectName: 'DumpingGround',
    url: '/egov-mdms-service/v1/_search',
    title: 'swm.create.page.title.dumpingGrounds',
    groups: [
      {
        name: 'DumpingGround',
        label: 'swm.dumpingground.search.title',
        fields: [
          {
            name: 'DumpingGroundName',
            jsonPath: 'code',
            label: 'swm.dumpingGround.create.dumpingGroundName',
            pattern: '',
            type: 'autoCompelete',
            isDisabled: false,
            defaultValue: '',
            patternErrMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=DumpingGround|$..DumpingGround.*.code|$..DumpingGround.*.name'
          },
          {
            name: 'DumpingGroundULB',
            jsonPath: 'ulbs[0].code',
            label: 'swm.create.ulbNames',
            pattern: '',
            type: 'singleValueList',
            isDisabled: false,
            defaultValue: '',
            patternErrMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=tenant&masterName=tenants|$..tenants.*.code|$..tenants.*.name',
          }
        ]
      },
    ],
    result: {
      header: [
        {
          label: 'swm.dumpingGround.create.dumpingGroundName',
        },
        {
          label: 'swm.ProcessingSiteDetails.create.isProcessingSitename',
        },
        {
          label: 'swm.ProcessingSiteDetails.create.DistancefromProcessingSite',
        },
        {
          label: 'swm.ProcessingSiteDetails.create.ProcessingSitename',
        },
      ],
      values: [
        'name',
        'isProcessingSite',
        'distanceFromProcessingSite',
        {jsonPath:'processingSite.code', reduxObject:"processingSite.codeTwo", isObj:true, cToN:true},

      ],
      resultPath: 'MdmsRes.swm.DumpingGround',
      rowClickUrlUpdate: '/update/swm/dumpingground/{code}',
      rowClickUrlView: '/view/swm/dumpingground/{code}',
      isMasterScreen: true
    },
  },
  'swm.create': {
    numCols: 3,
    useTimestamp: true,
    objectName: 'MasterMetaData',
    idJsonPath: 'MdmsRes.swm.DumpingGround[0].code',
    title: 'swm.create.page.title.dumpingGround',
    groups: [

      {
        name: 'LocationDetails',
        label: 'swm.collectionpoints.create.group.title.LocationDetails',
        jsonPath: "MasterMetaData.masterData[0].siteDetails.location",
        fields: [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "MasterMetaData.masterData[0].siteDetails.location.code",
            "isRequired": true,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
          }
        ],
      },
      {
        name: 'ULBs',
        label: 'swm.dumpingGround.create.ulbs',
        fields: [
          {
            name: 'ulbs',
            label: 'swm.create.ulbNames',
            jsonPath: 'MasterMetaData.masterData[0].ulbs',
            type: 'multiValueList',
            pattern: '',
            isRequired: true,
            isDisabled: false,
            maxLength: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=tenant&masterName=tenants|$..tenants.*.code|$..tenants.*.name',
            minLength: '',
            patternErrMsg: '',
            // mdms: {
            //   "moduleName": "swm",
            //   "masterName": "DumpingGround",
            //   "filter": "",
            //   "key": "$.ulbs.[*].code",
            //   "value": "$.ulbs.[*].name",
            // },
            hasATOAATransform: true,
            aATransformInfo: {
              to: 'MasterMetaData.masterData[0].ulbs',
              key: 'code'
            }
          },

        ]
      },

      {
        name: 'BankGuaranteeDetails',
        label: 'swm.create.page.title.bankGuaranteeDetails',
        fields: [
          {
            name: 'mpcbAuthorisation',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.mpcbAuthorisation',
            label: 'swm.dumpingGround.create.mpcbAuthorisation',
            pattern: '',
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            defaultValue: false,
            url: '',
          },

          {
            name: 'bankGuarantee',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.bankGuarantee',
            label: 'swm.dumpingGround.create.bankGuarantee',
            pattern: '',
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
            showHideFields: [
              {
                ifValue: true,
                hide: [],
                show: [
                  {
                    name: 'bankName',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'bankValidityFrom',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'bankValidityTo',
                    isGroup: false,
                    isField: true,
                  },
                ],
              },
            ],
          },

          {
            name: 'dummy',
            jsonPath: '',
            label: 'swm.dumpingGround.create.dummy',
            pattern: '',
            type: 'textArea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 500,
            minLength: 10,
            patternErrMsg: '',
            url: '',
          },

          {
            name: 'dummy',
            jsonPath: '',
            label: 'swm.dumpingGround.create.dummy',
            pattern: '',
            type: 'textArea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 500,
            minLength: 10,
            patternErrMsg: '',
            url: '',
          },

          {
            name: 'bankName',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.bankName',
            label: 'swm.dumpingGround.create.bankName',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            hide: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },

          {
            name: 'bankValidityFrom',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.bankValidityFrom',
            label: 'swm.dumpingGround.create.bankValidityFrom',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            hide: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },

          {
            name: 'bankValidityTo',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.bankValidityTo',
            label: 'swm.dumpingGround.create.bankValidityTo',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            hide: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },
        ]
      },
      {
        name: 'DumpingGroundDetails',
        label: 'swm.dumpingGround.create.group.title.DumpingGroundDetails',
        fields: [
          {
            name: 'dumpingGroundName',
            jsonPath: 'MasterMetaData.masterData[0].name',
            label: 'swm.dumpingGround.create.dumpingGroundName',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },

          {
            name: 'dumpingGroundArea',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.area',
            label: 'swm.dumpingGround.create.dumpingGroundArea',
            pattern: '^\\b[1-9]\\b|\\b([1-4][0-9])\\b|\\b50\\b$',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrMsg: 'Area of dumping ground is between 1-50(Sq.Km)',
            url: '',
          },

          {
            name: 'dumpingGroundCapacity',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.capacity',
            label: 'swm.dumpingGround.create.dumpingGroundCapacity',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: '5',
            minLength: '1',
            patternErrMsg: 'Capacity of dumping ground (tons / day): between 0 and 50000',
            url: '',
          },

          {
            name: 'dumpingGroundAddress',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.address',
            label: 'swm.dumpingGround.create.dumpingGroundAddress',
            pattern: '.{15,300}$',
            type: 'textarea',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: 300,
            minLength: 15,
            fullWidth: true,
            patternErrMsg: 'Address shall be of minimum 15 And maximum 300 Characters',
            url: '',
          },
          {
            name: 'searchLocation',
            jsonPathAddress: '',
            jsonPathLng: 'MasterMetaData.masterData[0].siteDetails.longitude',
            jsonPathLat: 'MasterMetaData.masterData[0].siteDetails.latitude',
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
            name: 'dumpingGroundLatitude',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.latitude',
            label: 'swm.dumpingGround.create.dumpingGroundLatitude',
            pattern: '^-{0,1}((90|90.[0]{1,20}|[0-9]|[1-8][0-9])|(89|[0-9]|[1-8][0-9])[.]{1}[0-9]{1,20}){1}$',
            type: 'text',
            isRequired: true,
            isDisabled: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: 'Latitude measurements range from -90° to +90°',
            url: '',
          },
          {
            name: 'dumpingGroundLongitude',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.longitude',
            label: 'swm.dumpingGround.create.dumpingGroundLongitude',
            pattern: '^-{0,1}((180|180.[0]{1,20}|[0-9]|([0-9][0-9])|([1][0-7][0-9]))|(179|[0-9]|([0-9][0-9])|([1][0-7][0-9]))[.]{1}[0-9]{1,20}){1}$',
            type: 'text',
            isRequired: true,
            isDisabled: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: 'Longitude measurements range from -180° to +180°',
            url: '',
          },
        ]
      },
      {
        name: 'isprocessingsitetoo',
        fields: [
          {
            name: 'dumpingGroundisProcessingSite',
            jsonPath: 'MasterMetaData.masterData[0].isProcessingSite',
            label: 'swm.dumpingGround.create.isProcessingSite',
            pattern: '',
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            defaultValue: false,
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            fullWidth:true,
            url: '',
            showHideFields: [
              {
                ifValue: true,
                show: [],
                hide: [
                  {
                    name: 'processingSite.code',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'distanceFromProcessingSite',
                    isGroup: false,
                    isField: true,
                  }
                ],
              },
              {
                ifValue: false,
                hide: [],
                show: [
                  {
                    name: 'processingSite.code',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'distanceFromProcessingSite',
                    isGroup: false,
                    isField: true,
                  }
                ],
              },
            ]
          },
                // hide: [
                  
                // ],
              
          {
            name: 'dummy',
            jsonPath: '',
            label: 'swm.dumpingGround.create.dummy',
            pattern: '',
            type: 'textArea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 500,
            minLength: 10,
            patternErrMsg: '',
            url: '',
          },
          {
            name: 'dummy',
            jsonPath: '',
            label: 'swm.dumpingGround.create.dummy',
            pattern: '',
            type: 'textArea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 500,
            minLength: 10,
            patternErrMsg: '',
            url: '',
          },
          {
            name: 'dummy',
            jsonPath: '',
            label: 'swm.dumpingGround.create.dummy',
            pattern: '',
            type: 'textArea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 500,
            minLength: 10,
            patternErrMsg: '',
            url: '',
          },
          {
            name: 'processingSite.code',
            jsonPath: 'MasterMetaData.masterData[0].processingSite.code',
            label: 'swm.dumpingGround.create.dumpingGroundProcessingSite',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            hide: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=ProcessingSite|$..ProcessingSite.*.code|$..ProcessingSite.*.name'
          },
          {
            name: 'distanceFromProcessingSite',
            jsonPath: 'MasterMetaData.masterData[0].distanceFromProcessingSite',
            label: 'swm.dumpingGround.create.distance',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            hide: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },
        ]
      },
      {
        name: 'wasteType',
        label: 'swm.create.page.title.wasteType',
        fields: [
          {
            name: 'WasteType',
            label: 'MdmsMetadata.masterData.swm.WasteSubType.wasteType',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.wasteTypes',
            type: 'multiValueList',
            pattern: '^null|$',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=WasteType|$..code|$..name',
            minLength: 1,
            patternErrMsg: 'may not be null',
            hasATOAATransform: true,
            aATransformInfo: {
              to: 'MasterMetaData.masterData[0].siteDetails.wasteTypes',
              key: 'code'
            }
          },
        ]
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
            defaultValue: 'DumpingGround',
            isRequired: true,
            type: 'text',
            hide: true
          },
          {
            name: 'code',
            jsonPath: 'MasterMetaData.masterData[0].code',
            defaultValue: 'DumpingGround-' + new Date().getTime(),
            isRequired: true,
            type: 'text',
            hide: true
          },
        ]
      }
    ],
    url: 'egov-mdms-create/v1/_create',
    isMDMSScreen: true,
    tenantIdRequired: true,
  },
  'swm.view': {
    preApiCalls:[

      {
        url:"/tenant/v1/tenant/_search",
        jsonPath:"sourceSegregations[0]-ulb-code",
        jsExpForDD:{
          key:"$..tenant.*.code",
          value:"$..tenant.*.name",
        }
      },
      {
        url:"egov-mdms-service/v1/_get",
        jsonPath:"sourceSegregations[0]-ulb-wasteType",
        qs:{
          moduleName:"swm",
          masterName:"WasteType"
        },
        jsExpForDD:{
          key:"$..code",
          value:"$..name",
        }
      }
    ],
    numCols: 3,
    useTimestamp: true,
    objectName: 'DumpingGround',
    groups: [
      {
        name: 'LocationDetails',
        label: 'swm.collectionpoints.create.group.title.LocationDetails',
        fields: [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "MdmsRes.swm.DumpingGround[0].siteDetails.location.code",
            "isRequired": false,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
          }
        ],
      },
      {
        name: 'ULBs',
        label: 'swm.dumpingGround.create.ulbs',
        fields: [
          {
            name: 'ulbs',
            label: 'swm.create.ulbNames',
            jsonPath: 'MdmsRes.swm.DumpingGround[0].ulbs',
            type: 'multiValueList',
            pattern: '',
            isRequired: false,
            isDisabled: false,
            maxLength: '',
            minLength: '',
            nextLine: true,
            url: '/egov-mdms-service/v1/_get?&moduleName=tenant&masterName=tenants|$..code|$..name',
            patternErrMsg: '',
            // mdms: {
            //   "moduleName": "swm",
            //   "masterName": "DumpingGround",
            //   "filter": "",
            //   "key": "$.ulbs.[*].code",
            //   "value": "$.ulbs.[*].name",
            // },
            hasATOAATransform: true,
            aATransformInfo: {
              to: 'MdmsRes.swm.DumpingGround[0].ulbs.code',
              key: 'code'
            },
            reduxObject:"sourceSegregations[0]-ulb-code",
            cToN:true
          },

        ]
      },
      {
        name: 'BankGuaranteeDetails',
        label: 'swm.create.page.title.bankGuaranteeDetails',
        fields: [
          {
            name: 'mpcbAuthorisation',
            jsonPath: 'MdmsRes.swm.DumpingGround[0].siteDetails.mpcbAuthorisation',
            label: 'swm.dumpingGround.create.mpcbAuthorisation',
            pattern: '',
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },
          {
            name: 'bankGuarantee',
            jsonPath: 'MdmsRes.swm.DumpingGround[0].siteDetails.bankGuarantee',
            label: 'swm.dumpingGround.create.bankGuarantee',
            pattern: '',
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
              showHideFields: [
              {
                ifValue: true,
                hide: [],
                show: [
                  {
                    name: 'bankName',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'bankValidityFrom',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'bankValidityTo',
                    isGroup: false,
                    isField: true,
                  },
                ],
              },
            ],
          },
          {
            name: 'bankName',
            jsonPath: 'MdmsRes.swm.DumpingGround[0].siteDetails.bankName',
            label: 'swm.dumpingGround.create.bankName',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            hide: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },
          {
            name: 'bankValidityFrom',
            jsonPath: 'MdmsRes.swm.DumpingGround[0].siteDetails.bankValidityFrom',
            label: 'swm.dumpingGround.create.bankValidityFrom',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            hide: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },
          {
            name: 'bankValidityTo',
            jsonPath: 'MdmsRes.swm.DumpingGround[0].siteDetails.bankValidityTo',
            label: 'swm.dumpingGround.create.bankValidityTo',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            hide: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },
        ]
      },
      {
        name: 'DumpingGroundDetails',
        label: 'swm.dumpingGround.create.group.title.DumpingGroundDetails',
        fields: [
          {
            name: 'dumpingGroundName',
            jsonPath: 'MdmsRes.swm.DumpingGround[0].name',
            label: 'swm.dumpingGround.create.dumpingGroundName',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },
          {
            name: 'dumpingGroundArea',
            jsonPath: 'MdmsRes.swm.DumpingGround[0].siteDetails.area',
            label: 'swm.dumpingGround.create.dumpingGroundArea',
            pattern: '^\\b[0-9]\\b|\\b([1-4][0-9])\\b|\\b50\\b$',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrMsg: 'Invalid Value',
            url: '',
          },
          {
            name: 'dumpingGroundCapacity',
            jsonPath: 'MdmsRes.swm.DumpingGround[0].siteDetails.capacity',
            label: 'swm.dumpingGround.create.dumpingGroundCapacity',
            //pattern: '^([1-9][0-9]{0,3}|10000|0|[1-4][0-9]{0,4}|50000)$',
            pattern:'',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            maxLength: '5',
            minLength: '1',
            defaultValue: '',
            patternErrMsg: 'Invalid Value',
            url: '',
          },
          {
            name: 'dumpingGroundAddress',
            jsonPath: 'MdmsRes.swm.DumpingGround[0].siteDetails.address',
            label: 'swm.dumpingGround.create.dumpingGroundAddress',
            pattern: '([a-zA-Z0-9_-\\s]){15,500}$',
            type: 'textarea',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: 500,
            minLength: 15,
            fullWidth: true,
            patternErrMsg: '',
            url: '',
          },
          {
            name: 'dumpingGroundLatitude',
            jsonPath: 'MdmsRes.swm.DumpingGround[0].siteDetails.latitude',
            label: 'swm.dumpingGround.create.dumpingGroundLatitude',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },
          {
            name: 'dumpingGroundLongitude',
            jsonPath: 'MdmsRes.swm.DumpingGround[0].siteDetails.longitude',
            label: 'swm.dumpingGround.create.dumpingGroundLongitude',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },
          {
            name: 'dumpingGroundisProcessingSite',
            jsonPath: 'MdmsRes.swm.DumpingGround[0].isProcessingSite',
            label: 'swm.dumpingGround.create.isProcessingSite',
            pattern: '',
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            defaultValue: 'No',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
            /*showHideFields: [
              {
                ifValue: false,
                hide: [],
                show: [
                  {
                    name: 'dumpingGroundProcessingPlant',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'dumpingGroundDistance',
                    isGroup: false,
                    isField: true,
                  },
                ],
              },
            ],*/
            // showHideFields: [
            //   {
            //     ifValue: true,
            //     show: [],
            //     hide: [
            //       {
            //         name: 'dumpingGroundProcessingPlant',
            //         isGroup: false,
            //         isField: true,
            //       },
            //       {
            //         name: 'dumpingGroundDistance',
            //         isGroup: false,
            //         isField: true,
            //       },
            //     ],
            //   },
            // ],
          },
          {
            name: 'processingSite.code',
            jsonPath: 'MdmsRes.swm.DumpingGround[0].processingSite.code',
            label: 'swm.dumpingGround.create.dumpingGroundProcessingSite',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=ProcessingSite|$..ProcessingSite.*.code|$..ProcessingSite.*.name',
          },
          {
            name: 'distanceFromProcessingSite',
            jsonPath: 'MdmsRes.swm.DumpingGround[0].distanceFromProcessingSite',
            label: 'swm.dumpingGround.create.distance',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            //hide: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },

        ]
      },
      {
        name: 'wasteType',
        label: 'swm.create.page.title.wasteType',
        fields: [
          {
            name: 'WasteType',
            label: 'MdmsMetadata.masterData.swm.WasteSubType.wasteType',
            jsonPath: 'MdmsRes.swm.DumpingGround[0].siteDetails.wasteTypes',
            type: 'multiValueList',
            pattern: '^null|$',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            nextLine: true,
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=WasteType|$..code|$..name',
            patternErrMsg: 'may not be null',
            hasATOAATransform: true,
            aATransformInfo: {
              to: 'MdmsRes.swm.DumpingGround[0].siteDetails.wasteTypes',
              key: 'code'
            },
            reduxObject:"sourceSegregations[0]-ulb-wasteType",
            cToN:true
          },
        ]
      },
    ],
    tenantIdRequired: true,
    url: '/egov-mdms-service/v1/_search?code={code}',
  },
  'swm.update': {
    numCols: 3,
    useTimestamp: true,
    objectName: 'DumpingGround',
    idJsonPath: 'MasterMetaData.masterData[0].code',
    groups: [

      {
        name: 'LocationDetails',
        label: 'swm.collectionpoints.create.group.title.LocationDetails',
        fields: [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "MasterMetaData.masterData[0].siteDetails.location.code",
            "isRequired": true,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
          }
        ],
      },
      {
        name: 'ULBs',
        label: 'swm.dumpingGround.create.ulbs',
        fields: [
          {
            name: 'ulbs',
            label: 'swm.create.ulbNames',
            jsonPath: 'MasterMetaData.masterData[0].ulbs',
            type: 'multiValueList',
            pattern: '',
            isRequired: true,
            isDisabled: false,
            maxLength: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=tenant&masterName=tenants|$..tenants.*.code|$..tenants.*.name',
            minLength: '',
            patternErrMsg: '',
            hasATOAATransform: true,
            aATransformInfo: {
              to: 'MasterMetaData.masterData[0].ulbs',
              key: 'code'
            }
          },

        ]
      },
      {
        name: 'BankGuaranteeDetails',
        label: 'swm.create.page.title.bankGuaranteeDetails',
        fields: [
          {
            name: 'mpcbAuthorisation',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.mpcbAuthorisation',
            label: 'swm.dumpingGround.create.mpcbAuthorisation',
            pattern: '',
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            defaultValue: false,
            url: ''
          },

          {
            name: 'bankGuarantee',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.bankGuarantee',
            label: 'swm.dumpingGround.create.bankGuarantee',
            pattern: '',
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
               showHideFields: [
              {
                ifValue: true,
                hide: [],
                show: [
                  {
                    name: 'bankName',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'bankValidityFrom',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'bankValidityTo',
                    isGroup: false,
                    isField: true,
                  },
                ],
              },
            ],
          },

          {
            name: 'dummy',
            jsonPath: '',
            label: 'swm.dumpingGround.create.dummy',
            pattern: '',
            type: 'textArea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 500,
            minLength: 10,
            patternErrMsg: '',
            url: '',
          },

          {
            name: 'dummy',
            jsonPath: '',
            label: 'swm.dumpingGround.create.dummy',
            pattern: '',
            type: 'textArea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 500,
            minLength: 10,
            patternErrMsg: '',
            url: '',
          },

          {
            name: 'bankName',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.bankName',
            label: 'swm.dumpingGround.create.bankName',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            hide: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },

          {
            name: 'bankValidityFrom',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.bankValidityFrom',
            label: 'swm.dumpingGround.create.bankValidityFrom',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            hide: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },

          {
            name: 'bankValidityTo',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.bankValidityTo',
            label: 'swm.dumpingGround.create.bankValidityTo',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            hide: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },
        ]
      },
      {
        name: 'DumpingGroundDetails',
        label: 'swm.dumpingGround.create.group.title.DumpingGroundDetails',
        fields: [
          {
            name: 'dumpingGroundName',
            jsonPath: 'MasterMetaData.masterData[0].name',
            label: 'swm.dumpingGround.create.dumpingGroundName',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },

          {
            name: 'dumpingGroundArea',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.area',
            label: 'swm.dumpingGround.create.dumpingGroundArea',
            pattern: '^\\b[1-9]\\b|\\b([1-4][0-9])\\b|\\b50\\b$',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: 'Area of dumping ground is between 1-50(Sq.Km)',
            url: '',
          },

          {
            name: 'dumpingGroundCapacity',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.capacity',
            label: 'swm.dumpingGround.create.dumpingGroundCapacity',
            pattern: '^([1-9][0-9]{0,3}|10000|[1-4][0-9]{0,4}|50000)$',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrMsg: 'Capacity of dumping ground (tons / day): between 0 and 50000',
            url: '',
          },
          {
            name: 'dumpingGroundAddress',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.address',
            label: 'swm.dumpingGround.create.dumpingGroundAddress',
            pattern: '.{15,500}$',
            type: 'textarea',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: 300,
            minLength: 15,
            fullWidth: true,
            patternErrMsg: 'Address shall be of minimum 15 And maximum 300 Characters',
            url: '',
          },
          {
            name: 'searchLocation',
            jsonPathAddress: '',
            jsonPathLng: 'MasterMetaData.masterData[0].siteDetails.longitude',
            jsonPathLat: 'MasterMetaData.masterData[0].siteDetails.latitude',
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
            name: 'dumpingGroundLatitude',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.latitude',
            label: 'swm.dumpingGround.create.dumpingGroundLatitude',
            pattern: '^-{0,1}((90|90.[0]{1,20}|[0-9]|[1-8][0-9])|(89|[0-9]|[1-8][0-9])[.]{1}[0-9]{1,20}){1}$',
            type: 'text',
            isRequired: true,
            isDisabled: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: 'Latitude measurements range from -90° to +90°',
            url: '',
          },
          {
            name: 'dumpingGroundLongitude',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.longitude',
            label: 'swm.dumpingGround.create.dumpingGroundLongitude',
            pattern: '^-{0,1}((180|180.[0]{1,20}|[0-9]|([0-9][0-9])|([1][0-7][0-9]))|(179|[0-9]|([0-9][0-9])|([1][0-7][0-9]))[.]{1}[0-9]{1,20}){1}$',
            type: 'text',
            isRequired: true,
            isDisabled: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: 'Longitude measurements range from -180° to +180°',
            url: '',
          },
        ]
      },
      // {
      //   name: 'geocoordinates',
      //   label: 'swm.dumpingground.search.geoCoordinates',
      //   fields: [
      //     {
      //       name: 'dumpingGroundLatitude',
      //       jsonPath: 'MasterMetaData.masterData[0].siteDetails.latitude',
      //       label: 'swm.dumpingGround.create.dumpingGroundLatitude',
      //       pattern: '^-{0,1}((90|90.[0]{1,20}|[0-9]|[1-8][0-9])|(89|[0-9]|[1-8][0-9])[.]{1}[0-9]{1,20}){1}$',
      //       type: 'text',
      //       isRequired: true,
      //       isDisabled: false,
      //       defaultValue: '',
      //       maxLength: '',
      //       minLength: '',
      //       patternErrMsg: 'Latitude measurements range from -90° to +90°',
      //       url: '',
      //     },
      //     {
      //       name: 'dumpingGroundLongitude',
      //       jsonPath: 'MasterMetaData.masterData[0].siteDetails.longitude',
      //       label: 'swm.dumpingGround.create.dumpingGroundLongitude',
      //       pattern: '^-{0,1}((180|180.[0]{1,20}|[0-9]|([0-9][0-9])|([1][0-7][0-9]))|(179|[0-9]|([0-9][0-9])|([1][0-7][0-9]))[.]{1}[0-9]{1,20}){1}$',
      //       type: 'text',
      //       isRequired: true,
      //       isDisabled: false,
      //       defaultValue: '',
      //       maxLength: '',
      //       minLength: '',
      //       patternErrMsg: 'Longitude measurements range from -180° to +180°',
      //       url: '',
      //     },
      //   ]
      // },
      {
        name: 'isprocessingsitetoo',
        fields: [
          {
            name: 'dumpingGroundisProcessingSite',
            jsonPath: 'MasterMetaData.masterData[0].isProcessingSite',
            label: 'swm.dumpingGround.create.isProcessingSite',
            pattern: '',
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            defaultValue: false,
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
            showHideFields: [
              {
                ifValue: true,
                show: [],
                hide: [
                  {
                    name: 'processingSite.code',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'distanceFromProcessingSite',
                    isGroup: false,
                    isField: true,
                  },
                ],
              },
               {
                ifValue: false,
                hide: [],
                show: [
                  {
                    name: 'processingSite.code',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'distanceFromProcessingSite',
                    isGroup: false,
                    isField: true,
                  }
                ],
              }
            ],
          },
          {
            name: 'dummy',
            jsonPath: '',
            label: 'swm.dumpingGround.create.dummy',
            pattern: '',
            type: 'textArea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 500,
            minLength: 10,
            patternErrMsg: '',
            url: '',
          },
          {
            name: 'dummy',
            jsonPath: '',
            label: 'swm.dumpingGround.create.dummy',
            pattern: '',
            type: 'textArea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 500,
            minLength: 10,
            patternErrMsg: '',
            url: '',
          },
          {
            name: 'dummy',
            jsonPath: '',
            label: 'swm.dumpingGround.create.dummy',
            pattern: '',
            type: 'textArea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 500,
            minLength: 10,
            patternErrMsg: '',
            url: '',
          },
          {
            name: 'processingSite.code',
            jsonPath: 'MasterMetaData.masterData[0].processingSite.code',
            label: 'swm.dumpingGround.create.dumpingGroundProcessingSite',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=ProcessingSite|$..ProcessingSite.*.code|$..ProcessingSite.*.name'
          },

          {
            name: 'distanceFromProcessingSite',
            jsonPath: 'MasterMetaData.masterData[0].distanceFromProcessingSite',
            label: 'swm.dumpingGround.create.distance',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },
        ]
      },
      {
        name: 'wasteType',
        label: 'swm.create.page.title.wasteType',
        fields: [
          {
            name: 'WasteType',
            label: 'MdmsMetadata.masterData.swm.WasteSubType.wasteType',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.wasteTypes',
            type: 'multiValueList',
            pattern: '^null|$',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=WasteType|$..code|$..name',
            minLength: 1,
            patternErrMsg: 'may not be null',
            hasATOAATransform: true,
            aATransformInfo: {
              to: 'MasterMetaData.masterData[0].siteDetails.wasteTypes',
              key: 'code'
            }
          },
        ]
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
            defaultValue: 'DumpingGround',
            isRequired: true,
            type: 'text',
            hide: true
          },
          {
            name: 'code',
            jsonPath: 'MasterMetaData.masterData[0].code',
            defaultValue: 'DumpingGround-' + new Date().getTime(),
            isRequired: true,
            type: 'text',
            hide: true
          },
        ]
      }
    ],
    url: '/egov-mdms-create/v1/_update',
    tenantIdRequired: true,
    isMDMSScreen: true,
    searchUrl: '/egov-mdms-service/v1/_search?code={code}',
  },
};
export default dat;
