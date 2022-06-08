let criteria = '[' + encodeURIComponent('?') + '(@.moduleType' + encodeURIComponent('==\'MBHeader\'') + ')]';

var dat = {
  'works.search': {
    numCols: 6,
    useTimestamp: true,
    objectName: 'RemarksRequest',
    url: '/works-measurementbook/v1/measurementbooks/_search',
    groups: [
      {
        name: 'search',
        label: 'works.measurementbook.search.title',
        fields: [
            {
                name: 'measurementbooks[0].mbRefNo',
                jsonPath: 'measurementbooks[0].mbRefNo',
                label: 'works.measurementbook.label.mbRefNumberLike',
                type: 'autoCompelete',
                isRequired: false,
                isDisabled: false,
                url: "/works-measurementbook/v1/measurementbooks/_search?|$.measurementBooks.*.mbRefNo|$.measurementBooks.*.mbRefNo",
                autoCompleteDependancy: {
                    autoCompleteUrl: "/works-measurementbook/v1/measurementbooks/_search?mbRefNumberLike={measurementbooks[0].mbRefNo}",
                    autoFillFields: {
                    },
                },
            },
            // {
            //     name: 'loaNumbers',
            //     jsonPath: 'measurementbooks[0].loaNumbers',
            //     label: 'works.measurementbook.label.loaNumbers',
            //     type: 'autoCompelete',
            //     isRequired: false,
            //     isDisabled: false,
            //     url: "/works-measurementbook/v1/letterofacceptances/_search|$.measurementBooks.*.mbRefNo|$.measurementBooks.*.mbRefNo",
            //     autoCompleteDependancy: {
            //         autoCompleteUrl: "/works-measurementbook/v1/letterofacceptances/_search?loaNumberLike={measurementbooks[0].loaNumbers}",
            //         autoFillFields: {
            //         },
            //     },
            // },
            {
                name: 'fromDate',
                jsonPath: 'fromDate',
                label: 'works.measurementbook.label.fromDate',
                type: 'datePicker',
                isRequired: false,
                isDisabled: false,
                maxLength: 128,
                minLength: 1,
                patternErrorMsg: '',
            },
            {
                name: 'toDate',
                jsonPath: 'toDate',
                label: 'works.measurementbook.label.toDate',
                type: 'datePicker',
                isRequired: false,
                isDisabled: false,
                maxLength: 128,
                minLength: 1,
                patternErrorMsg: '',
            },
            // {
            //     name: 'contractorNames',
            //     jsonPath: 'measurementbooks[0].contractorNames[0]',
            //     label: 'works.measurementbook.label.contractorNames',
            //     type: 'autoCompelete',
            //     isRequired: false,
            //     isDisabled: false,
            //     url: "/works-masters/v1/contractors/_search|$.measurementBooks.*.contractorNames|$.measurementBooks.*.contractorNames",
            //     autoCompleteDependancy: {
            //         autoCompleteUrl: "/works-masters/v1/contractors/_search?name={measurementbooks[0].contractorNames[0]}",
            //         autoFillFields: {
            //         },
            //     },
            // },
            // {
            //     name: 'department',
            //     jsonPath: 'department',
            //     label: 'works.measurementbook.label.department',
            //     type: 'multiValueList',
            //     isRequired: false,
            //     isDisabled: false,
            //     patternErrorMsg: '',
            //     url: '/egov-mdms-service/v1/_get?&moduleName=Works&masterName=TypeOfDocument|$..code|$..name',
            // },
            // {
            //     name: 'detailedEstimateNumberLike',
            //     jsonPath: 'measurementbooks[0].detailedEstimateNumber[0]',
            //     label: 'works.measurementbook.label.detailedEstimateNumberLike',
            //     type: 'autoCompelete',
            //     isRequired: false,
            //     isDisabled: false,
            //     url: "/works-estimate/v1/detailedestimates/_search|$.measurementBooks.*.contractorNames|$.measurementBooks.*.contractorNames",
            //     autoCompleteDependancy: {
            //         autoCompleteUrl: "/works-estimate/v1/detailedestimates/_search?name={measurementbooks[0].detailedEstimateNumber[0]}",
            //         autoFillFields: {
            //         },
            //     },
            // },
            // {
            //     name: 'createdBy',
            //     jsonPath: 'createdBy',
            //     label: 'works.measurementbook.label.createdBy',
            //     type: 'singleValueList',
            //     isRequired: false,
            //     isDisabled: false,
            //     patternErrorMsg: '',
            //     url: "swm-services/routes/_search?|$.routes.*.code|$.routes.*.name"
            // },
            {
                name: 'statuses',
                jsonPath: 'statuses',
                label: 'works.measurementbook.label.statuses',
                type: 'multiValueList',
                isRequired: false,
                isDisabled: false,
                patternErrorMsg: '',
                url: `/egov-mdms-service/v1/_get?&moduleName=works&masterName=WorksStatus&filter=${criteria}|$..code|$..description`,
            },
            // {
            //     name: 'workOrderNumberLike',
            //     jsonPath: 'workOrderNumberLike',
            //     label: 'works.measurementbook.label.workOrderNumberLike',
            //     type: 'autoCompelete',
            //     isRequired: false,
            //     isDisabled: false,
            //     url: "/works-estimate/v1/detailedestimates/_search|$.measurementBooks.*.contractorNames|$.measurementBooks.*.contractorNames",
            //     autoCompleteDependancy: {
            //         autoCompleteUrl: "/works-estimate/v1/detailedestimates/_search?name={measurementbooks[0].detailedEstimateNumber[0]}",
            //         autoFillFields: {
            //         },
            //     },
            // },
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
  