var dat = {
    'works.search': {
      numCols: 6,
      useTimestamp: true,
      objectName: 'RemarksRequest',
      url: '/works-masters/v1/remarks/_search',
      groups: [
        {
          name: 'remarkMasterSearch',
          label: 'works.remarks.search.title',
          fields: [
            {
              name: 'typeOfDocument',
              jsonPath: 'typeOfDocument',
              label: 'works.remarks.label.typeOfDocument',
              type: 'singleValueList',
              isRequired: false,
              isDisabled: false,
              url: '/egov-mdms-service/v1/_get?&moduleName=Works&masterName=TypeOfDocument|$..code|$..name',
              patternErrorMsg: 'works.remarks.error.message.typeOfDocument',
            },
            {
                name: 'remarksType',
                jsonPath: 'remarksType',
                label: 'works.remarks.label.remarksType',
                type: 'singleValueList',
                isRequired: false,
                isDisabled: false,
                url: '/egov-mdms-service/v1/_get?&moduleName=Works&masterName=RemarksType|$..code|$..name',
                patternErrorMsg: 'works.remarks.error.message.remarksType',
            },
            {
                name: 'remarksDescription',
                jsonPath: 'remarksDescription',
                label: 'works.remarks.label.remarksDescription',
                type: 'text',
                isRequired: false,
                isDisabled: false,
                patternErrorMsg: 'works.remarks.error.message.remarksDescription',
            },
          ],
        },
      ],
      result: {
        header: [
          {
            label: 'works.search.result.documenttype',
          },
          {
            label: 'works.search.result.remarkstype',
          },
          {
            label: 'works.search.result.remarksDescription',
          },
          {
            label: 'works.search.result.editable',
          },
        ],
        values: ['typeOfDocument', 'remarksType', 'remarksDetails[0].remarksDescription', 'remarksDetails[0].editable'],
        resultIdKey: 'id',
        resultPath: 'remarks',
        rowClickUrlUpdate: '/update/works/remarks/{id}',
        rowClickUrlView: '/view/works/remarks/{id}',
      },
    },
    'works.create': {
      numCols: 12/2,
      useTimestamp: true,
      objectName: 'remarks',
      idJsonPath: 'remarks[0].id',
      injectData: [
        {
          jsonPath: 'remarks[0].remarksDetails[0].tenantId',
          value: localStorage.getItem('tenantId'),
        },
        {
          jsonPath: 'remarks[0].remarksDetails[0].tenantId',
          value: localStorage.getItem('tenantId'),
        },
      ],
      groups: [
        {
          name: 'remarkMasterCreate',
          label: 'works.remarks.create.title',
          fields: [
            {
                name: 'typeOfDocument',
                jsonPath: 'remarks[0].typeOfDocument',
                label: 'works.remarks.label.typeOfDocument',
                type: 'singleValueList',
                isRequired: true,
                isDisabled: false,
                defaultValue: '',
                maxLength: 100,
                minLength: 1,
                url: '/egov-mdms-service/v1/_get?&moduleName=Works&masterName=TypeOfDocument|$..code|$..name',
                patternErrorMsg: 'works.remarks.error.message.typeOfDocument',
            },
            
            {
                name: 'remarksType',
                jsonPath: 'remarks[0].remarksType',
                label: 'works.remarks.label.remarksType',
                type: 'singleValueList',
                isRequired: true,
                isDisabled: false,
                defaultValue: '',
                maxLength: 100,
                minLength: 1,
                url: '/egov-mdms-service/v1/_get?&moduleName=Works&masterName=RemarksType|$..code|$..name',
                patternErrorMsg: 'works.remarks.error.message.remarksType',
            },
          ],
        },
        {
            name: 'Remarks Details',
            label: 'works.remarks.details.label.title',
            fields: [
              {
                type: 'tableList',
                jsonPath: 'remarks[0].remarksDetails',
                tableList: {
                  header: [
                    {
                        label: 'works.remarks.details.label.remarksDescription',
                    },
                    {
                        label: 'works.remarks.details.label.editable',
                    },
                  ],
                  values: [
                    {
                        name: 'remarksDescription',
                        pattern: '',
                        type: 'text',
                        jsonPath: 'remarks[0].remarksDetails[0].remarksDescription',
                        displayJsonPath: 'remarks[0].remarksDetails[0].remarksDescription',
                        isRequired: true,
                        isDisabled: false,
                    },
                    {
                        name: 'editable',
                        pattern: '',
                        type: 'checkbox',
                        defaultValue: false,
                        jsonPath: 'remarks[0].remarksDetails[0].editable',
                        displayJsonPath: 'remarks[0].remarksDetails[0].editable',
                        isRequired: false,
                        isDisabled: false,
                    },
                  ],
                },
              },
            ],
        },
      ],
      url: '/works-masters/v1/remarks/_create',
      tenantIdRequired: true,
    },
    'works.view': {
      numCols: 12/2,
      useTimestamp: true,
      objectName: 'remarks',
      idJsonPath: 'remarks[0].id',
      injectData: [
        {
          jsonPath: 'remarks[0].remarksDetails[0].tenantId',
          value: localStorage.getItem('tenantId'),
        },
        {
          jsonPath: 'remarks[0].remarksDetails[0].tenantId',
          value: localStorage.getItem('tenantId'),
        },
      ],
      groups: [
        {
          name: 'remarkMasterView',
          label: 'works.remarks.view.title',
          fields: [
            {
                name: 'code',
                jsonPath: 'remarks[0].typeOfDocument',
                label: 'works.remarks.label.typeOfDocument',
                type: 'singleValueList',
                isRequired: true,
                isDisabled: true,
                defaultValue: '',
                maxLength: 100,
                minLength: 1,
                url: '/egov-mdms-service/v1/_get?&moduleName=Works&masterName=TypeOfDocument|$..code|$..name',
                patternErrorMsg: 'works.remarks.error.message.typeOfDocument',
            },
            
            {
                name: 'code',
                jsonPath: 'remarks[0].remarksType',
                label: 'works.remarks.label.remarksType',
                type: 'singleValueList',
                isRequired: true,
                isDisabled: true,
                defaultValue: '',
                maxLength: 100,
                minLength: 1,
                url: '/egov-mdms-service/v1/_get?&moduleName=Works&masterName=RemarksType|$..code|$..name',
                patternErrorMsg: 'works.remarks.error.message.remarksType',
            },
          ],
        },
        {
            name: 'Remarks Details',
            label: 'works.remarks.details.label.title',
            fields: [
              {
                type: 'tableList',
                jsonPath: 'remarks[0].remarksDetails[0]',
                tableList: {
                  header: [
                    
                    {
                        label: 'works.remarks.details.label.remarksDescription',
                    },
                    {
                        label: 'works.remarks.details.label.editable',
                    },
                  ],
                  values: [
                    {
                        name: 'remarksDescription',
                        pattern: '',
                        type: 'text',
                        jsonPath: 'remarks[0].remarksDetails[0].remarksDescription',
                        displayJsonPath: 'remarks[0].remarksDetails[0].remarksDescription',
                        isRequired: true,
                        isDisabled: true,
                    },
                    {
                        name: 'editable',
                        pattern: '',
                        type: 'checkbox',
                        jsonPath: 'remarks[0].remarksDetails[0].editable',
                        displayJsonPath: 'remarks[0].remarksDetails[0].editable',
                        isRequired: false,
                        isDisabled: true,
                    },
                  ],
                },
              },
            ],
        },
      ],
      url: '/works-masters/v1/remarks/_search?ids={id}',
      tenantIdRequired: true,
    },
    'works.update': {
      numCols: 12/2,
      useTimestamp: true,
      objectName: 'remarks',
      idJsonPath: 'remarks[0].id',
      injectData: [
        {
          jsonPath: 'remarks[0].remarksDetails[0].tenantId',
          value: localStorage.getItem('tenantId'),
        },
        {
          jsonPath: 'remarks[0].remarksDetails[0].tenantId',
          value: localStorage.getItem('tenantId'),
        },
      ],
      groups: [
        {
          name: 'remarkMasterUpdate',
          label: 'works.remarks.update.title',
          fields: [
            {
                name: 'typeOfDocument',
                jsonPath: 'remarks[0].typeOfDocument',
                label: 'works.remarks.label.typeOfDocument',
                type: 'singleValueList',
                isRequired: true,
                isDisabled: false,
                defaultValue: '',
                maxLength: 100,
                minLength: 1,
                url: '/egov-mdms-service/v1/_get?&moduleName=Works&masterName=TypeOfDocument|$..code|$..name',
                patternErrorMsg: 'works.remarks.error.message.typeOfDocument',
            },
            
            {
                name: 'remarksType',
                jsonPath: 'remarks[0].remarksType',
                label: 'works.remarks.label.remarksType',
                type: 'singleValueList',
                isRequired: true,
                isDisabled: false,
                defaultValue: '',
                maxLength: 100,
                minLength: 1,
                url: '/egov-mdms-service/v1/_get?&moduleName=Works&masterName=RemarksType|$..code|$..name',
                patternErrorMsg: 'works.remarks.error.message.remarksType',
            },
          ],
        },
        {
            name: 'Remarks Details',
            label: 'works.remarks.details.label.title',
            fields: [
              {
                type: 'tableList',
                jsonPath: 'remarks[0].remarksDetails[0]',
                tableList: {
                  header: [
                    
                    {
                        label: 'works.remarks.details.label.remarksDescription',
                    },
                    {
                        label: 'works.remarks.details.label.editable',
                    },
                  ],
                  values: [
                    
                    {
                        name: 'remarksDescription',
                        pattern: '',
                        type: 'text',
                        jsonPath: 'remarks[0].remarksDetails[0].remarksDescription',
                        displayJsonPath: 'remarks[0].remarksDetails[0].remarksDescription',
                        isRequired: true,
                        isDisabled: false,
                    },
                    {
                        name: 'editable',
                        pattern: '',
                        type: 'checkbox',
                        jsonPath: 'remarks[0].remarksDetails[0].editable',
                        displayJsonPath: 'remarks[0].remarksDetails[0].editable',
                        isRequired: false,
                        isDisabled: false,
                    },
                  ],
                },
              },
            ],
        },
      ],
      url: '/works-masters/v1/remarks/_update',
      tenantIdRequired: true,
      searchUrl: '/works-masters/v1/remarks/_search?ids={ids}',
    },
  };
  export default dat;
  