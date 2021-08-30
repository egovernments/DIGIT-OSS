var dat = {
  'swm.search': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'vendorContracts',
    url: '/swm-services/vendorcontracts/_search',
    title:'swm.search.page.title.vendorcontracts',
    groups: [
      {
        name: 'search',
        label: 'vendorcontracts.search.title',
        fields: [
          {
            name: 'contractNumber',
            jsonPath: 'contractNo',
            label: 'vendorcontracts.create.contractNo',
            pattern: '',
            type: 'autoCompelete',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            patternErrMsg: '',
            requiredErrMsg: '',
            url: 'swm-services/vendorcontracts/_search?|$.vendorContracts.*.contractNo|$.vendorContracts.*.contractNo',
          },
          {
            name: 'vendor',
            jsonPath: 'vendorNo',
            label: 'vendorcontracts.create.vendorNo',
            type: 'singleValueList',
            isDisabled: false,
            patternErrorMsg: '',
            url: '/swm-services/vendors/_search?|$.vendors.*.vendorNo|$.vendors.*.name',
          },
          {
            name: 'contractPeriodFrom',
            jsonPath: 'contractPeriodFrom',
            label: 'vendorcontracts.create.contractPeriodFrom',
            type: 'datePicker',
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'contractPeriodto',
            jsonPath: 'contractPeriodTo',
            label: 'vendorcontracts.create.contractPeriodto',
            type: 'datePicker',
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'contractDate',
            jsonPath: 'contractDate',
            label: 'vendorcontracts.create.contractDate',
            type: 'datePicker',
            isDisabled: false,
            patternErrorMsg: '',
          },
        ],
      },
    ],
    result: {
      header: [
        {
          label: 'vendorcontracts.create.vendorNo',
        },
        {
          label: 'vendorcontracts.search.result.contractNo',
        },
        {
          label: 'vendorcontracts.search.result.contractDate',
          isDate: true,
        },
        {
          label: 'vendorcontracts.search.result.contractPeriodFrom',
          isDate: true,
        },
        {
          label: 'vendorcontracts.search.result.contractPeriodTo',
          isDate: true,
        },
        {
          label: 'vendorcontracts.search.result.securityDeposit',
        },
        {
          label: 'vendorcontracts.search.result.paymentAmount',
        },
        {
          label: 'vendorcontracts.search.result.servicesOffered',
        },
        {
          label: 'vendorcontracts.search.result.paymentTerms',
        },
        {
          label: 'vendorcontracts.search.result.remarks',
        }
      ],
      values: [
        'vendor.name',
        'contractNo',
        'contractDate',
        'contractPeriodFrom',
        'contractPeriodTo',
        'securityDeposit',
        'paymentAmount',
        'servicesOffered',
        'paymentTerms.label',
        'remarks'
      ],
      resultPath: 'vendorContracts',
      rowClickUrlUpdate: '/update/swm/vendorcontracts/{contractNo}',
      rowClickUrlView: '/view/swm/vendorcontracts/{contractNo}',
    },
  },
  'swm.create': {

    // beforeSubmit:
    // `
    // let OrignalArr = _formData.vendorContracts;
    // let getFormData = _.get(_formData, 'vendorContracts[0].vendorContracts');
    // if(getFormData){
    //   _formData.vendorContracts = OrignalArr.concat(...getFormData);
    //   let len  = _formData.vendorContracts.length;
    //   if(len > 1){
    //     _.unset(_formData, 'vendorContracts[0].vendorContracts');
    //      let getInitalVendor = _.get(_formData,'vendorContracts[0].vendor');
    //      for(var i = 1; i<len; i++){
    //        let getServiceOff = _.get(_formData, 'vendorContracts['+i+'].servicesOffered');
    //        if(_.isArray(getServiceOff)){
    //         getServiceOff =  getServiceOff.map((item) => {
    //           return ({"code" : item});
    //         });
    //        }
    //        _formData.vendorContracts[i].vendor = getInitalVendor;
    //        _formData.vendorContracts[i].servicesOffered = getServiceOff;
    //        _formData.vendorContracts[i].tenantId = localStorage.getItem("tenantId");
    //        _.unset(_formData, 'vendorContracts['+i+'].vendorContracts');
    //      }
    //   }
    // }
    // `,

    numCols: 4,
    useTimestamp: true,
    objectName: 'vendorContracts',
    idJsonPath: 'vendorContracts[0].contractNo',
    title: 'vendorcontracts.create.group.title.vendorContract',
    groups: [
      {
        name: 'VendorContractDetails',
        label: 'vendorcontracts.create.group.title.VendorContractDetails',
        jsonPath: 'vendorContracts',
        fields: [
          {
            name: 'vendor',
            jsonPath: 'vendorContracts[0].vendor.vendorNo',
            label: 'vendorcontracts.create.vendorNo',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            maxLength: 265,
            minLength: 1,
            patternErrorMsg: '',
            url: '/swm-services/vendors/_search?|$.vendors.*.vendorNo|$.vendors.*.name',
             depedants:[
            {
            "jsonPath":"vendorContracts[0].servicesOffered",
            "type":"autoFill",
            "pattern":'/swm-services/vendors/_search?&vendorNo={vendorContracts[0].vendor.vendorNo}|$..code|$..name',
            "autoFillFields":{
                "vendorContracts[0].servicesOffered":"vendors[0].servicesOffered",
                              },
            },
            // {
            //   "jsonPath":"servicesOffered",
            //   "type":"autoFill",
            //   "pattern":'/swm-services/vendors/_search?&vendorNo={vendorContracts[0].vendor.vendorNo}|$..code|$..name',
            //   "autoFillFields":{
            //       "servicesOffered":"vendors[0].servicesOffered",
            //                     },
            //   },
                        ],
          },
          {
            name: 'contractDate',
            jsonPath: 'vendorContracts[0].contractDate',
            label: 'vendorcontracts.create.contractDate',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'contractPeriodFrom',
            jsonPath: 'vendorContracts[0].contractPeriodFrom',
            label: 'vendorcontracts.create.contractPeriodFrom',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'contractPeriodTo',
            jsonPath: 'vendorContracts[0].contractPeriodTo',
            label: 'vendorcontracts.create.contractPeriodTo',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'securityDeposit',
            jsonPath: 'vendorContracts[0].securityDeposit',
            label: 'vendorcontracts.create.securityDeposit',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'paymentAmount',
            jsonPath: 'vendorContracts[0].paymentAmount',
            label: 'vendorcontracts.create.paymentAmount',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'paymentTerms',
            jsonPath: 'vendorContracts[0].paymentTerms.label',
            label: 'vendorcontracts.search.result.paymentTerms',
            pattern: '',
            type: 'radio',
            styleObj: {
              display: '-webkit-box',
              width:'30%'
            },
            url: '',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            values: [
              { label: 'Monthly', value: 'Monthly' },
              { label: 'BiMonthly', value: 'BiMonthly' },
              { label: 'Quarterly', value: 'Quarterly' },
              { label: 'Yearly', value: 'Yearly' }
            ],
            defaultValue: 'Monthly',
          },
          {
            name: 'remarks',
            jsonPath: 'vendorContracts[0].remarks',
            label: 'vendorcontracts.create.remarks',
            pattern: '.{15,300}$',
            type: 'textarea',
            fullWidth:true,
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 300,
            minLength: 15,
            patternErrMsg: 'swm.vendorcontracts.create.description.errormsg',
          },
        ],
      },

    {
        name: 'ServicesOffered',
        label: 'swm.create.servicesOffered',
        fields: [
          {
            name: 'ServicesOffered',
            label: 'swm.create.servicesOffered',
            jsonPath: 'vendorContracts[0].servicesOffered',
            type: 'multiValueList',
            pattern: '',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            url:'',
            minLength: 1,
            patternErrorMsg: '',
            mdms: {
              "moduleName": "swm",
              "masterName": "SwmProcess",
              "filter": "",
              "key": "$..code",
              "value": "$..name",
            },
            hasATOAATransform:true,
            aATransformInfo:{
              to:'vendorContracts[0].servicesOffered',
              key:'code'
            },
          },
          // {
          //   name: 'ServicesOffered',
          //   label: 'swm.create.servicesOffered',
          //   jsonPath: 'servicesOffered',
          //   hide:true,
          //   type: 'multiValueList',
          //   pattern: '',
          //   isRequired: false,
          //   isDisabled: false,
          //   maxLength: 128,
          //   url:'',
          //   minLength: 1,
          //   patternErrorMsg: '',
          //   mdms: {
          //     "moduleName": "swm",
          //     "masterName": "SwmProcess",
          //     "filter": "",
          //     "key": "$..code",
          //     "value": "$..name",
          //   },
          //   hasATOAATransform:true,
          //   aATransformInfo:{
          //     to:'servicesOffered',
          //     key:'code'
          //   },
          // },
          ],
        },
        // {

        // *** As per mutual discussion and decision, we are commenting multiple vendor functionality for this release.
        
        //   name: 'multipleContractWindow',
        //   hide: false,
        //   label: 'swm.vendorcontract.create.multiplecontract',
        //   fields: [
        //     {
        //       name: 'multipleContractWindow',
        //       jsonPath: 'vendorContracts[0]',
        //       arrayPath: 'vendorContracts',
        //       modulepath: 'swm.create',
        //       // "isExceptFirstRecord":true,
        //      // hidePrimaryRecord: true,
        //       pattern: '',
        //       type: 'window',
        //       tableConfig: {
        //         expandTable: true,
        //         header: [
        //           {
        //             label: 'vendorcontracts.create.contractDate',
        //           },
        //           {
        //             label: 'vendorcontracts.create.contractPeriodFrom',
        //           },
        //           {
        //             label: 'vendorcontracts.create.contractPeriodTo',
        //           },
        //           {
        //             label: 'vendorcontracts.create.securityDeposit',
        //           },
        //           {
        //             label: 'swm.create.servicesOffered',
        //           },
        //           {
        //             label: 'vendorcontracts.search.result.paymentTerms',
        //           },
        //           {
        //             label: 'vendorcontracts.create.remarks',
        //           },
        //         ],
        //         rows: [
        //           {
        //             displayField: 'contractDate',
        //             isDate:true
        //           },
        //           {
        //             displayField: 'contractPeriodFrom',
        //             isDate:true
        //           },
        //           {
        //             displayField: 'contractPeriodTo',
        //             isDate:true
        //           },
        //           {
        //             displayField: 'securityDeposit',
        //           },
        //           {
        //             displayField: 'servicesOffered',
        //             keyToValue:true
        //           },
        //           {
        //             displayField: 'paymentTerms',
        //           },
        //           {
        //             displayField: 'remarks',
        //           },
        //         ],
        //       },
        //       subPath: 'swm/master/addvendorcontract',
        //       isRequired: false,
        //       isDisabled: true,
        //       requiredErrMsg: '',
        //       patternErrMsg: '',
        //     },
        //   ],
        // },
    ],
    url: '/swm-services/vendorcontracts/_create',
    tenantIdRequired: true,
  },
  'swm.view': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'vendorContracts',
    groups: [
      {
        name: 'VendorContractDetails',
        label: 'vendorcontracts.create.group.title.VendorContractDetails',
        fields: [
          {
            name: 'contractNo',
            jsonPath: 'vendorContracts[0].contractNo',
            label: 'vendorcontracts.create.contractNo',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 128,
            minLength: 6,
            patternErrorMsg: '',
          },
          {
            name: 'vendor',
            jsonPath: 'vendorContracts[0].vendor.name',
            label: 'vendorcontracts.create.vendorNo',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'contractDate',
            jsonPath: 'vendorContracts[0].contractDate',
            label: 'vendorcontracts.create.contractDate',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'contractPeriodFrom',
            jsonPath: 'vendorContracts[0].contractPeriodFrom',
            label: 'vendorcontracts.create.contractPeriodFrom',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'contractPeriodTo',
            jsonPath: 'vendorContracts[0].contractPeriodTo',
            label: 'vendorcontracts.create.contractPeriodTo',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'securityDeposit',
            jsonPath: 'vendorContracts[0].securityDeposit',
            label: 'vendorcontracts.create.securityDeposit',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'paymentAmount',
            jsonPath: 'vendorContracts[0].paymentAmount',
            label: 'vendorcontracts.create.paymentAmount',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'paymentTerms',
            jsonPath: 'vendorContracts[0].paymentTerms.label',
            label: 'vendorcontracts.search.result.paymentTerms',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'remarks',
            jsonPath: 'vendorContracts[0].remarks',
            label: 'vendorcontracts.create.remarks',
            pattern: '',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 500,
            minLength: 15,
            patternErrorMsg: '',
          },
          
        ],
      },
 {
        name: 'ServicesOffered',
        label: 'swm.create.group.title.ServicesOffered',
        fields: [
          {
            name: 'ServicesOffered',
            label: 'swm.create.servicesOffered',
            jsonPath: 'vendorContracts[0].servicesOffered',
            type: 'multiValueList',
            pattern: '',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=SwmProcess|$..code|$..name',
            minLength: 1,
            patternErrorMsg: '',
            hasATOAATransform:true,
            aATransformInfo:{
              to:'vendorContracts[0].servicesOffered',
              key:'code'
            }
          },
        ],
      },

    ],
    tenantIdRequired: true,
    url: '/swm-services/vendorcontracts/_search?contractNo={contractNo}',
  },
'swm.update': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'vendorContracts',
    idJsonPath: 'vendorContracts[0].contractNo',
   title:'vendorcontracts.create.group.title.vendorContract',
    groups: [
      {
        name: 'VendorContractDetails',
        label: 'vendorcontracts.create.group.title.VendorContractDetails',
        fields: [
          {
            name: 'contractNo',
            jsonPath: 'vendorContracts[0].contractNo',
            label: 'vendorcontracts.create.contractNo',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            defaultValue: '',
            maxLength: 128,
            minLength: 6,
            patternErrorMsg: '',
          },
          {
            name: 'vendor',
            jsonPath: 'vendorContracts[0].vendor.vendorNo',
            label: 'vendorcontracts.create.vendorNo',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            maxLength: 265,
            minLength: 1,
            patternErrorMsg: '',
            url: '/swm-services/vendors/_search?|$.vendors.*.vendorNo|$.vendors.*.name',
             depedants:[
            {
            "jsonPath":"vendorContracts[0].servicesOffered",
            "type":"autoFill",
            "pattern":'/swm-services/vendors/_search?&vendorNo={vendorContracts[0].vendor.vendorNo}|$..code|$..name',
"autoFillFields":{
"vendorContracts[0].servicesOffered":"vendors[0].servicesOffered",
},
},
],
          },
          {
            name: 'contractDate',
            jsonPath: 'vendorContracts[0].contractDate',
            label: 'vendorcontracts.create.contractDate',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'contractPeriodFrom',
            jsonPath: 'vendorContracts[0].contractPeriodFrom',
            label: 'vendorcontracts.create.contractPeriodFrom',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'contractPeriodTo',
            jsonPath: 'vendorContracts[0].contractPeriodTo',
            label: 'vendorcontracts.create.contractPeriodTo',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'securityDeposit',
            jsonPath: 'vendorContracts[0].securityDeposit',
            label: 'vendorcontracts.create.securityDeposit',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'paymentAmount',
            jsonPath: 'vendorContracts[0].paymentAmount',
            label: 'vendorcontracts.create.paymentAmount',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'dummy',
            maxLength: 500,
            minLength: 10,
          },
          {
            name: 'dummy',
            maxLength: 500,
            minLength: 10,
          },
          {
            name: 'paymentTerms',
            jsonPath: 'vendorContracts[0].paymentTerms.label',
            label: 'vendorcontracts.search.result.paymentTerms',
            pattern: '',
            type: 'radio',
            styleObj: {
              display: '-webkit-box',
              width:'30%'
            },
            url: '',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            values: [
              { label: 'Monthly', value: 'Monthly' },
              { label: 'BiMonthly', value: 'BiMonthly' },
              { label: 'Quarterly', value: 'Quarterly' },
              { label: 'Yearly', value: 'Yearly' },
            ],
            defaultValue: 'Monthly',
          },
          {
            name: 'remarks',
            jsonPath: 'vendorContracts[0].remarks',
            label: 'vendorcontracts.create.remarks',
            pattern: '.{15,300}$',
            type: 'textarea',
            fullWidth:true,
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 300,
            minLength: 15,
            patternErrMsg: 'swm.vendorcontracts.create.description.errormsg',
          },
        ],
         },
         {
        name: 'ServicesOffered',
        label: 'swm.create.servicesOffered',
        fields: [
          {
            
            name: 'ServicesOffered',
            label: 'swm.create.servicesOffered',
            jsonPath: 'vendorContracts[0].servicesOffered',
            type: 'multiValueList',
            pattern: '',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            url:'',
            minLength: 1,
            patternErrorMsg: '',
            mdms: {
              "moduleName": "swm",
              "masterName": "SwmProcess",
              "filter": "",
              "key": "$..code",
              "value": "$..name",
            },
            hasATOAATransform:true,
            aATransformInfo:{
              to:'vendorContracts[0].servicesOffered',
              key:'code'
            },
           
          },
          ],
        },
    ],
    url: '/swm-services/vendorcontracts/_update',
    tenantIdRequired: true,
    searchUrl: '/swm-services/vendorcontracts/_search?contractNo={contractNo}',
  },
};
export default dat;
