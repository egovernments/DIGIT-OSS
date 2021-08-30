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
    numCols: 4,
    useTimestamp: true,
    objectName: 'ProcessingSite',
    url: '/swm-services/dumpingground/_search',
    title: 'swm.create.page.title.processingsites',
    groups: [
      {
        name: 'ProcessingSite',
        label: 'swm.processingsite.search.title',
        fields: [

          {
            name: 'ProcessingSiteName',
            jsonPath: 'code',
            label: 'swm.ProcessingSiteDetails.create.ProcessingSitename',
            pattern: '',
            type: 'autoCompelete',
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=ProcessingSite|$..ProcessingSite.*.code|$..ProcessingSite.*.name',
          }
        ]
      }
    ],
    result: {
      header: [
        {
            label : 'swm.processingplant.create.name',
        },
        {
            label : 'swm.processingplant.create.address',
        },
        {
          label: 'swm.processingplant.create.area',
        },
        {
          label: 'swm.processingplant.create.capacity',
        }
      ],
      values: [
        'name',
        'siteDetails.address',
        'siteDetails.area',
        'siteDetails.capacity'
      ],
      resultPath: 'MdmsRes.swm.ProcessingSite',
      rowClickUrlUpdate: '/update/swm/processingsite/{code}',
      rowClickUrlView: '/view/swm/processingsite/{code}',
      isMasterScreen: true
    },
  },
  'swm.create': {
    numCols: 3,
    useTimestamp: true,
    objectName: 'MasterMetaData',
    //idJsonPath: 'MasterMetaData.masterData[0].code',
    idJsonPath: 'MdmsRes.swm.ProcessingSite[0].code',
    title: 'swm.create.page.title.processingsite',
    groups: [
      {
        name: 'LocationDetails',
        label: 'swm.create.group.title.LocationDetails',
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
        name: 'BankGuaranteeDetails',
        label: 'swm.create.page.title.bankGuaranteeDetails',
        fields: [
          {
            name: 'mpcbAuthorisation',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.mpcbAuthorisation',
            label: 'swm.processingplant.create.mpcbAuthorization',
            pattern: '',
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            defaultValue: false,
            url: '',
          },
          {
            name: 'bankGuarantee',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.bankGuarantee',
            label: 'swm.processingplant.create.BankGuarantee',
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
                  }
                ],
              },
            ]
          },
          {
            name: 'dummy',
            jsonPath: '',
            label: 'swm.processingsite.create.dummy',
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
            label: 'swm.processingsite.create.dummy',
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
            label: 'swm.processingplant.create.BankName',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            hide: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'bankValidityFrom',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.bankValidityFrom',
            label: 'swm.processingplant.create.BankGuaranteeFrom',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            hide: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'bankValidityTo',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.bankValidityTo',
            label: 'swm.processingplant.create.BankGuaranteeTo',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            hide: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
          },
        ]
      },
      {
        name: 'ProcessingSiteDetails',
        label: 'swm.processingplant.create.title.ProcessingSiteDeatils',
        fields: [
          {
            name: 'ProcessingSiteName',
            jsonPath: 'MasterMetaData.masterData[0].name',
            label: 'swm.ProcessingSiteDetails.create.ProcessingSitename',
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
            name: 'ProcessingSiteArea',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.area',
            label: 'swm.ProcessingSiteDetails.create.Area',
            pattern: '^\\b[1-9]\\b|\\b([1-4][0-9])\\b|\\b50\\b$',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            maxLength: '5',
            minLength: '1',
            defaultValue: '',
            patternErrMsg: 'Area shall be in between 1-50(Sq.Km)',
            url: '',
          },
          {
            name: 'ProcessingSiteCapacity',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.capacity',
            label: 'swm.processingplant.create.ProcessingSiteCapacity',
            pattern: '^([1-9][0-9]{0,3}|10000|[1-4][0-9]{0,4}|50000)$',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrMsg: 'Capacity of dumping ground (tons / day): between 0 and 50000',
            url: '',
          },
          {
            name: 'ProcessingSiteAddress',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.address',
            label: 'swm.processingplant.create.ProcessingSiteAddress',
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
        ]
      },
      {
        name: 'geoCoordinates',
        label: 'swm.dumpingground.search.geoCoordinates',
        fields: [
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
            name: 'ProcessingSiteLatitude',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.latitude',
            label: 'swm.processingplant.create.Latitude',
            pattern: '^-{0,1}((90|90.[0]{1,20}|[0-9]|[1-8][0-9])|(89|[0-9]|[1-8][0-9])[.]{1}[0-9]{1,20}){1}$',
            type: 'text',
            isRequired: true,
            isDisabled: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: 'Latitude measurements range from - 90° to +90°',
            url: '',
          },
          {
            name: 'ProcessingSiteLongitude',
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
        ],
      },
      {
        name: 'wasteType',
        label: 'swm.processingsite.create.page.title.wasteType',
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
            patternErrorMsg: 'may not be null',
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
            defaultValue: 'ProcessingSite',
            isRequired: true,
            type: 'text',
            hide: true
          },
          {
            name: 'code',
            jsonPath: 'MasterMetaData.masterData[0].code',
            defaultValue: 'ProcessingSite-' + new Date().getTime(),
            isRequired: true,
            type: 'text',
            hide: true
          },
        ]
      }
    ],
    url: 'egov-mdms-create/v1/_create',
    tenantIdRequired: true,
    isMDMSScreen:true
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
    objectName: 'ProcessingSite',
    groups: [
      {
        name: 'LocationDetails',
        label: 'swm.collectionpoints.create.group.title.LocationDetails',
        fields: [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "MdmsRes.swm.ProcessingSite[0].siteDetails.location.code",
            "isRequired": false,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
          }
        ],
      },
      {
        name: 'BankGuaranteeDetails',
        label: 'swm.create.page.title.bankGuaranteeDetails',
        fields: [
          {
            name: 'mpcbAuthorisation',
            jsonPath: 'MdmsRes.swm.ProcessingSite[0].siteDetails.mpcbAuthorisation',
            label: 'swm.processingplant.create.mpcbAuthorization',
            pattern: '',
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'bankGuarantee',
            jsonPath: 'MdmsRes.swm.ProcessingSite[0].siteDetails.bankGuarantee',
            label: 'swm.processingplant.create.BankGuarantee',
            pattern: '',
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'bankName',
            jsonPath: 'MdmsRes.swm.ProcessingSite[0].siteDetails.bankName',
            label: 'swm.processingplant.create.BankName',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            fullWidth:true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'bankValidityFrom',
            jsonPath: 'MdmsRes.swm.ProcessingSite[0].siteDetails.bankValidityFrom',
            label: 'swm.processingplant.create.BankGuaranteeFrom',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'bankValidityTo',
            jsonPath: 'MdmsRes.swm.ProcessingSite[0].siteDetails.bankValidityTo',
            label: 'swm.processingplant.create.BankGuaranteeTo',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
          },
        ]
      },
      {
        name: 'ProcessingSiteDetails',
        label: 'swm.processingplant.create.group.title.ProcessingSiteDetails',
        fields: [
          {
            name: 'ProcessingSiteName',
            jsonPath: 'MdmsRes.swm.ProcessingSite[0].name',
            label: 'swm.processingplant.create.ProcessingSiteName',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'ProcessingSiteArea',
            jsonPath: 'MdmsRes.swm.ProcessingSite[0].siteDetails.area',
            label: 'swm.processingplant.create.ProcessingSiteArea',
            pattern: '^\\b[0-9]\\b|\\b([1-4][0-9])\\b|\\b50\\b$',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: 'Invalid Value',
            url: '',
          },
          {
            name: 'ProcessingSiteCapacity',
            jsonPath: 'MdmsRes.swm.ProcessingSite[0].siteDetails.capacity',
            label: 'swm.processingplant.create.ProcessingSiteCapacity',
            pattern: '^([1-9][0-9]{0,3}|10000|0|[1-4][0-9]{0,4}|50000)$',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrMsg: 'Invalid Value',
            url: '',
          },
          {
            name: 'ProcessingSiteAddress',
            jsonPath: 'MdmsRes.swm.ProcessingSite[0].siteDetails.address',
            label: 'swm.processingplant.create.ProcessingSiteAddress',
            pattern: '',
            type: 'textarea',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: 500,
            minLength: 15,
            fullWidth: true,
            patternErrorMsg: '',
            url: '',
          },
        ]
      },
      {
        name: 'geoCoordinates',
        label: 'swm.dumpingground.search.geoCoordinates',
        fields: [
          {
            name: 'ProcessingSiteLatitude',
            jsonPath: 'MdmsRes.swm.ProcessingSite[0].siteDetails.latitude',
            label: 'swm.processingplant.create.Latitude',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'ProcessingSiteLongitude',
            jsonPath: 'MdmsRes.swm.ProcessingSite[0].siteDetails.longitude',
            label: 'swm.dumpingGround.create.dumpingGroundLongitude',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
          },

        ]
      },
      {
        name: 'wasteType',
        label: 'swm.processingsite.create.page.title.wasteType',
        fields: [
          {
            name: 'WasteType',
            label: 'MdmsMetadata.masterData.swm.WasteSubType.wasteType',
            jsonPath: 'MdmsRes.swm.ProcessingSite[0].siteDetails.wasteTypes',
            type: 'multiValueList',
            pattern: '^null|$',
            isRequired: false,
            isDisabled: false,
            maxLength: 128,
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=WasteType|$..code|$..name',
            minLength: 1,
            nextLine: true,
            patternErrorMsg: 'may not be null',
            hasATOAATransform: true,
            aATransformInfo: {
              to: 'MdmsRes.swm.ProcessingSite[0].siteDetails.wasteTypes',
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
    objectName: 'ProcessingSite',
    idJsonPath: 'MasterMetaData.masterData[0].code',
    groups: [
      {
        name: 'LocationDetails',
        label: 'swm.processingplant.create.title.LocationDetails',
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
        name: 'BankGuaranteeDetails',
        label: 'swm.processingplant.create.BankGuaranteeDetails',
        fields: [
          {
            name: 'mpcbAuthorisation',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.mpcbAuthorisation',
            label: 'swm.processingplant.create.mpcbAuthorization',
            pattern: '',
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            defaultValue: false,
            url: '',
          },
          {
            name: 'bankGuarantee',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.bankGuarantee',
            label: 'swm.processingplant.create.BankGuarantee',
            pattern: '',
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
            showHideFields: [
              {
                ifValue: true,
                hide: [],
                show: [
                  {
                    name: 'bankName',
                    isGroup: false,
                    isField: true
                  },
                  {
                    name: 'bankValidityFrom',
                    isGroup: false,
                    isField: true
                  },
                  {
                    name: 'bankValidityTo',
                    isGroup: false,
                    isField: true
                  }
                ]
              }
            ]
          },
          {
            name: 'bankName',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.bankName',
            label: 'swm.processingplant.create.BankName',
            pattern: '',
            type: 'text',
            hide: true,
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'bankValidityFrom',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.bankValidityFrom',
            label: 'swm.processingplant.create.BankGuarantee',
            pattern: '',
            type: 'datePicker',
            hide: true,
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: '',
            url: '',
          },
          {
            name: 'bankValidityTo',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.bankValidityTo',
            label: 'swm.processingplant.create.BankGuaranteeTo',
            pattern: '',
            type: 'datePicker',
            hide: true,
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
          },
        ]
      },
      {
        name: 'ProcessingSiteDeatils',
        label: 'swm.processingplant.create.title.ProcessingSiteDeatils',
        fields: [
          {
            name: 'ProcessingSiteName',
            jsonPath: 'MasterMetaData.masterData[0].name',
            label: 'swm.processingplant.create.ProcessingSiteName',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'ProcessingSiteArea',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.area',
            label: 'swm.processingplant.create.ProcessingSiteArea',
            pattern: '^\\b[1-9]\\b|\\b([1-4][0-9])\\b|\\b50\\b$',
            type: 'number',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: 'Area shall be in between 1-50(Sq.Km)',
            url: '',
          },
          {
            name: 'ProcessingSiteCapacity',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.capacity',
            label: 'swm.processingplant.create.ProcessingSiteCapacity',
            pattern: '^([1-9][0-9]{0,3}|10000|[1-4][0-9]{0,4}|50000)$',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            patternErrMsg: 'Capacity of dumping ground (tons / day): between 0 and 50000',
            url: '',
          },
          {
            name: 'ProcessingSiteAddress',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.address',
            label: 'swm.processingplant.create.ProcessingSiteAddress',
            pattern: '.{15,500}$',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 300,
            minLength: 15,
            fullWidth: true,
            patternErrMsg: 'Address shall be of minimum 15 And maximum 300 Characters',
            url: '',
          },
        ]
      },
      {
        name: 'geoCoordinates',
        label: 'swm.dumpingground.search.geoCoordinates',
        fields: [
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
            name: 'ProcessingSiteLatitude',
            jsonPath: 'MasterMetaData.masterData[0].siteDetails.latitude',
            label: 'swm.dumpingGround.create.dumpingGroundLatitude',
            pattern: '^-{0,1}((90|90.[0]{1,20}|[0-9]|[1-8][0-9])|(89|[0-9]|[1-8][0-9])[.]{1}[0-9]{1,20}){1}$',
            type: 'text',
            isRequired: true,
            isDisabled: true,
            defaultValue: '',
            maxLength: '',
            minLength: '',
            patternErrMsg: 'Latitude measurements range from - 90° to +90°',
            url: '',
          },
          {
            name: 'ProcessingSiteLongitude',
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
          }
        ]
      },
      {
        name: 'wasteType',
        label: 'swm.processingsite.create.page.title.wasteType',
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
            patternErrorMsg: 'may not be null',
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
            defaultValue: 'ProcessingSite',
            isRequired: true,
            type: 'text',
            hide: true
          },
          {
            name: 'code',
            jsonPath: 'MasterMetaData.masterData[0].code',
            defaultValue: 'ProcessingSite-' + new Date().getTime(),
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