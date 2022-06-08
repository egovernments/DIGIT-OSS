var dat = {
  'lcms.create': {
    numCols: 4,
    title: 'advocates.search.document.title',
    useTimestamp: true,
    objectName: 'agencies',
    groups: [
      {
        name: 'personalDetails',
        label: 'advocates.create.group.title.personalDetails',
        fields: [
          {
            name: 'advocateTitle',
            jsonPath: 'title',
            label: 'advocates.create.advocateTitle',
            type: 'windowsSingleValueList',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            defaultValue: [{ key: 'Mr', value: 'Mr' }, { key: 'Mrs', value: 'Mrs' }, { key: 'Ms', value: 'Ms' }, { key: 'Miss', value: 'Miss' }],
          },
          {
            name: 'firstName',
            jsonPath: 'firstName',
            label: 'advocates.create.firstName',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'secondName',
            jsonPath: 'secondName',
            label: 'advocates.create.secondName',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'lastName',
            jsonPath: 'lastName',
            label: 'advocates.create.lastName',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'aadharNumber',
            jsonPath: 'aadhar',
            label: 'advocates.create.aadharNumber',
            pattern: '',
            type: 'aadhar',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: ' The UID number is as follows:412521475850 : all 12 digits',
          },
          {
            name: 'gender',
            jsonPath: 'gender',
            label: 'advocates.create.gender',
            pattern: '',
            type: 'windowsSingleValueList',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            defaultValue: [{ key: 'Male', value: 'Male' }, { key: 'Female', value: 'Female' }],
          },
          {
            name: 'age',
            jsonPath: 'age',
            label: 'advocates.create.age',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'dob',
            jsonPath: 'dob',
            label: 'advocates.create.dob',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'address',
            jsonPath: 'address',
            label: 'advocates.create.address',
            pattern: '',
            type: 'textarea',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'mobileNumber',
            jsonPath: 'mobileNumber',
            label: 'advocates.create.mobileNumber',
            pattern: '',
            type: 'mobileNumber',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: 'The Phone number structure is as follows: 999XXXX999 ',
          },
          {
            name: 'contactNumber',
            jsonPath: 'contactNo',
            label: 'advocates.create.contactNumber',
            pattern: '',
            type: 'mobileNumber',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: 'The Phone number structure is as follows: 999XXXX999 ',
          },
          {
            name: 'email',
            jsonPath: 'emailId',
            label: 'advocates.create.email',
            pattern: '',
            type: 'email',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: 'Email should be in format e.g - abc@abc.com',
          },
          {
            name: 'panNumber',
            jsonPath: 'pan',
            label: 'advocates.create.panNumber',
            pattern: '',
            type: 'pan',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: ' The PAN structure is as follows: AAAPL1234C .',
          },
          {
            name: 'VATTinNumber',
            jsonPath: 'vatTinNo',
            label: 'advocates.create.VATTinNumber',
            pattern: '',
            type: 'text',
            maxLength: '15',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
        ],
      },
      {
        name: 'bankDetails',
        label: 'advocates.create.group.title.bankDetails',
        fields: [
          {
            name: 'bankName',
            jsonPath: 'bankName',
            label: 'advocates.create.bankName',
            pattern: '',
            type: 'windowsSingleValueList',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=lcms&masterName=bank|$..name|$..name',
            depedants: [
              {
                jsonPath: 'bankBranch',
                type: 'dropDown',
                pattern:
                  "/egov-mdms-service/v1/_get?&moduleName=lcms&masterName=bankBranch&filter=%5B%3F%28%40.bankName%3D%3D'{bankName}'%29%5D|$..branch|$..branch",
              },
            ],
          },
          {
            name: 'bankBranch',
            jsonPath: 'bankBranch',
            label: 'advocates.create.bankBranch',
            pattern: '',
            type: 'windowsSingleValueList',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            // url:"/egov-mdms-service/v1/_get?&moduleName=lcms&masterName=bankBranch|$..branch|$..branch"
          },
          {
            name: 'bankAcc',
            jsonPath: 'bankAccountNo',
            label: 'advocates.create.bankAcc',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'IFSCCode',
            jsonPath: 'ifscCode',
            label: 'advocates.create.IFSCCode',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'MICRCode',
            jsonPath: 'micr',
            label: 'advocates.create.MICRCode',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
        ],
      },

      // {
      //   "name": "action",
      //   "label": "advocates.create.group.title.action",
      //   "fields": [
      //     {
      //       "name": "actionType",
      //       "jsonPath": "status",
      //       "label": "advocates.create.actionType",
      //       "type": "radio",
      //       "isRequired": true,
      //       "isDisabled": false,
      //       "patternErrorMsg": "",
      //       "values": [
      //         {
      //           "label": "advocates.create.active",
      //           "value": "active"
      //         },
      //         {
      //           "label": "advocates.create.inactive",
      //           "value": "inactive"
      //         },
      //         {
      //           "label": "advocates.create.terminate",
      //           "value": "terminate"
      //         }
      //       ],
      //       "defaultValue": "active",
      //       "enableDisableFields": [
      //         {
      //           "ifValue": "active",
      //           "enable": [],
      //           "disable": ["terminationDate",
      //           "inActivationDate",
      //           "reasonOfTermination"]
      //         },{
      //           "ifValue": "inactive",
      //           "enable": [
      //             "inActivationDate",
      //             "reasonOfTermination"
      //           ],
      //           "disable": [
      //             "terminationDate"
      //           ]
      //         },
      //         {
      //           "ifValue": "terminate",
      //           "enable": [
      //             "terminationDate",
      //             "reasonOfTermination"
      //           ],
      //           "disable": [
      //             "inActivationDate"
      //           ]
      //         }
      //       ]
      //     },
      //     {
      //       "name": "inActivationDate",
      //       "jsonPath": "inActiveDate",
      //       "label": "advocates.create.inActivationDate",
      //       "pattern": "",
      //       "type": "datePicker",
      //       "isRequired": false,
      //       "isDisabled": true,
      //       "requiredErrMsg": "",
      //       "patternErrMsg": ""
      //     },
      //     {
      //       "name": "terminationDate",
      //       "jsonPath": "terminationDate",
      //       "label": "advocates.create.terminationDate",
      //       "pattern": "",
      //       "type": "datePicker",
      //       "isRequired": false,
      //       "isDisabled": true,
      //       "requiredErrMsg": "",
      //       "patternErrMsg": ""
      //     },
      //     {
      //       name: "reasonOfTermination",
      //       jsonPath: "agencies[0].reasonOfTermination",
      //       label: "advocates.create.reasonOfTerminationOrDeactivation",
      //       type: "textarea",
      //       fullWidth: true,
      //       isRequired: true,
      //       isDisabled: true,
      //       patternErrorMsg: ""
      //     }
      //   ]
      // }
    ],
  },
};
export default dat;
