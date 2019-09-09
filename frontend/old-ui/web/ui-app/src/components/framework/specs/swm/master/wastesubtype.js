var dat = {
    'swm.search': {
      beforeSubmit:
      `
      if(formData.name !== undefined){
        
        for(var i=0; i<dropDownData.name.length; i++){
          if(!(formData.name == dropDownData.name[i].key)){
            if(formData.name.toUpperCase() === dropDownData.name[i].value.toUpperCase()){
              formData.name = dropDownData.name[i].key;
              break;
            }
          }
        }
      }
      `,
      preApiCalls:[
        {
          url:"/egov-mdms-service/v1/_get",
          jsonPath:"wasteType.codeTwo",
          qs:{
            moduleName:"swm",
            masterName:"WasteType"
          },
          jsExpForDD:{
            key:"$..code",
            value:"$..name",
          }
        },
      ],
      numCols: 3,
      useTimestamp: true,
      objectName: 'WasteSubType',
      url: '/egov-mdms-service/v1/_search',
      title: 'lcms.create.group.title.wasteSubTypeDetails',
      groups: [
        {
          name:'wastesubTypeDetails',
          label: 'lcms.search.group.title.wasteSubTypeDetails',
          fields: [

           {
              name: 'wasteType',
              label: 'MdmsMetadata.masterData.swm.WasteSubType.wasteType',
              jsonPath: 'wasteType.code',
              type: 'singleValueList',
              pattern: '',
              isRequired: false,
              isDisabled: false,
              maxLength: 128,
              url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=WasteType|$..code|$..name',
              minLength: 1,
              patternErrMsg: '',
            },
            {
              name: 'wastesubTypeName',
              jsonPath: 'name',
              label: 'MdmsMetadata.masterData.swm.WasteSubType.name',
              pattern: '',
              type: 'autoCompelete',
              url:'/egov-mdms-service/v1/_get?&moduleName=swm&masterName=WasteSubType|$..WasteSubType.*.name|$..WasteSubType.*.name',
              isRequired: false,
              isDisabled: false,
              defaultValue: '',
              maxLength: 100,
              minLength: 1,
            },
            // {
            //   name: 'wastesubTypeCode',
            //   jsonPath: 'code',
            //   label: 'MdmsMetadata.masterData.swm.WasteSubType.code',
            //   pattern: '',
            //   type: 'autoCompelete',
            //   url:'/egov-mdms-service/v1/_get?&moduleName=swm&masterName=WasteSubType|$..WasteSubType.*.code|$..WasteSubType.*.code',
            //   isRequired: false,
            //   isDisabled: false,
            //   defaultValue: '',
            //   maxLength: 128,
            //   minLength: 1,
            //   patternErrorMsg: '',
            // },

           
          ]
        },
      ],
      result: {
        header: [
          {
            label: 'MdmsMetadata.masterData.swm.WasteSubType.name',
          },
      /*     {
            label: 'MdmsMetadata.masterData.swm.WasteSubType.code',
          }, */
          {
              label: 'MdmsMetadata.masterData.swm.WasteSubType.wasteType',
          } 
        ],
        values: [
          'name',
         /*  'code', */
          {jsonPath:'wasteType.code',reduxObject:"wasteType.codeTwo",isObj:true,cToN:true}
      
        ],
        resultPath: 'MdmsRes.swm.WasteSubType',
        rowClickUrlUpdate: '/update/swm/wastesubtype/{code}',
        rowClickUrlView: '/view/swm/wastesubtype/{code}',
        isMasterScreen: true
      },
    },
    'swm.create': {
      numCols: 3,
      useTimestamp: true,
      objectName: 'MasterMetaData',
      idJsonPath: 'MdmsRes.swm.WasteSubType[0].code',
      title: 'lcms.create.group.title.wasteSubTypeDetailss',
      groups: [
        {
          name:'wastesubTypeDetails',
          fields: [
            {
              name: 'wasteType',
              label: 'MdmsMetadata.masterData.swm.WasteSubType.wasteType',
              jsonPath: 'MasterMetaData.masterData[0].wasteType.code',
              type: 'singleValueList',
              pattern: '^null|$',
              isRequired: true,
              isDisabled: false,
              maxLength: 128,
              url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=WasteType|$..code|$..name',
              minLength: 1,
              patternErrMsg: 'may not be null',
            },

            {
              name: 'wastesubTypeName',
              jsonPath: 'MasterMetaData.masterData[0].name',
              label: 'MdmsMetadata.masterData.swm.WasteSubType.name',
              pattern: '',
              type: 'text',
              isRequired: true,
              isDisabled: false,
              defaultValue: '',
              maxLength: 100,
              minLength: 1,
            },
            {
              name: 'wastesubTypeCode',
              jsonPath: 'MasterMetaData.masterData[0].code',
              label: 'MdmsMetadata.masterData.swm.WasteSubType.code',
              pattern: '',
              type: 'text',
              isRequired: true,
              isDisabled: false,
              defaultValue: '',
              maxLength: 128,
              minLength: 1,
              patternErrorMsg: '',
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
              defaultValue: 'WasteSubType',
              hide: true
            },
          ]
        },       
      ],
      url: '/egov-mdms-create/v1/_create',
      tenantIdRequired: true
    },
    'swm.view': {
      numCols: 4,
      useTimestamp: true,
      objectName: 'WasteSubType',
      title: 'lcms.create.group.title.wasteSubTypeDetailss',
      groups: [
        {
          name:'wastesubTypeDetails',
          label: 'lcms.view.group.title.wasteSubTypeDetails',
          fields: [
            {
              name: 'wastesubTypeName',
              jsonPath: 'MdmsRes.swm.WasteSubType[0].name',
              label: 'MdmsMetadata.masterData.swm.WasteSubType.name',
              pattern: '',
              type: 'text',
              isRequired: true,
              isDisabled: false,
              defaultValue: '',
              maxLength: 100,
              minLength: 1,
            },
            {
              name: 'wastesubTypeCode',
              jsonPath: 'MdmsRes.swm.WasteSubType[0].code',
              label: 'MdmsMetadata.masterData.swm.WasteSubType.code',
              pattern: '',
              type: 'text',
              isRequired: true,
              isDisabled: false,
              defaultValue: '',
              maxLength: 128,
              minLength: 1,
              patternErrorMsg: '',
            },
            {
              name: 'wasteType',
              label: 'MdmsMetadata.masterData.swm.WasteSubType.wasteType',
              jsonPath: 'MdmsRes.swm.WasteSubType[0].wasteType.code',
              type: 'text',
              pattern: '^null|$',
              isRequired: true,
              isDisabled: false,
              maxLength: 128,
              url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=WasteType|$..code|$..name',
              minLength: 1,
              patternErrMsg: 'may not be null',
            }  
          ]
        }, 
      ],
      tenantIdRequired: true,
      url: '/egov-mdms-service/v1/_search?code={code}',
    },
    'swm.update': {
      numCols: 3,
      useTimestamp: true,
      objectName: 'WasteSubType',
      idJsonPath : 'MasterMetaData.masterData[0].code',
      title: 'lcms.create.group.title.wasteSubTypeDetailss',
      groups: [
        {
          name:'wastesubTypeDetails',
          label: 'lcms.update.group.title.wasteSubTypeDetails',
          fields: [
            {
              name: 'wastesubTypeName',
              jsonPath: 'MasterMetaData.masterData[0].name',
              label: 'MdmsMetadata.masterData.swm.WasteSubType.name',
              pattern: '',
              type: 'text',
              isRequired: true,
              isDisabled: false,
              defaultValue: '',
              maxLength: 100,
              minLength: 1,
            },
            {
              name: 'wastesubTypeCode',
              jsonPath: 'MasterMetaData.masterData[0].code',
              label: 'MdmsMetadata.masterData.swm.WasteSubType.code',
              pattern: '',
              type: 'text',
              isRequired: true,
              isDisabled: true,
              defaultValue: '',
              maxLength: 128,
              minLength: 1,
              patternErrorMsg: '',
            },
            {
              name: 'wasteType',
              label: 'MdmsMetadata.masterData.swm.WasteSubType.wasteType',
              jsonPath: 'MasterMetaData.masterData[0].wasteType.code',
              type: 'singleValueList',
              pattern: '^null|$',
              isRequired: true,
              isDisabled: false,
              maxLength: 128,
              url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=WasteType|$..WasteType.*.code|$..WasteType.*.name',
              minLength: 1,
              patternErrMsg: 'may not be null',
            },
            {
              name: 'tenantId',
              jsonPath: 'MasterMetaData.masterData[0].wasteType.tenantId',
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
              defaultValue: 'WasteSubType',
              hide: true
            },
          ]
        },
        
      ],
      url: '/egov-mdms-create/v1/_update',
      tenantIdRequired: true,
      isMDMSScreen: true,
      searchUrl: '/egov-mdms-service/v1/_search?code={code}',
    },
  };
  export default dat;