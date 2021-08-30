var dat = {
  'perfManagement.create': {
    numCols: 12 / 2,
    url: 'perfmanagement/v1/kpivalue/_create',
    useTimestamp: true,
    objectName: 'kpiValues',
    tenantIdRequired: true,
    groups: [
      {
        label: 'Key Performance Indicator Master',
        name: 'kpi',
        fields: [
          {
            name: 'kpiselect',
            jsonPath: 'kpiValues[0].KPI.code',
            label: 'KPI',
            url: '/perfmanagement/v1/kpimaster/_search?tenantId=|$.KPIs.*.code|$.KPIs.*.name',
            isRequired: true,
            pattern: '',
            type: 'singleValueList',
            isDisabled: false,
            requiredErrMsg: '',
            depedants: [
              {
                jsonPath: 'kpiValues[0].financialYear',
                type: 'textField',
                pattern: 'kpiValues[0].KPI.code|KPIs|code|financialYear',
                hasFromDropDownOriginalData: true,
              },
              {
                jsonPath: 'kpiValues[0].documents',
                type: 'documentList',
                pattern: '/perfmanagement/v1/kpimaster/_getDocumentForKpi?tenantId=default&kpiCode={KPIs}',
              },
              {
                jsonPath: 'kpiValues[0].targetType',
                type: 'radio',
                pattern: 'kpiValues[0].KPI.code|KPIs|code|targetType',
                hasFromDropDownOriginalData: true,
              },
            ],
          },
          {
            name: 'kpiDateBlock',
            jsonPath: 'kpiValues[0].financialYear',
            label: 'Financial Year',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            requiredErrMsg: '',
            patternErrMsg: 'Length is more than 250',
          },
          {
            name: 'kpitype',
            jsonPath: 'kpiValues[0].targetType',
            label: 'perfManagement.create.KPIs.groups.kpitype',
            pattern: '',
            type: 'radio',
            isRequired: false,
            isDisabled: true,
            requiredErrMsg: '',
            patternErrMsg: '',
            values: [
              {
                label: 'perfManagement.update.KPIs.groups.updatekpitype.text',
                value: 'TEXT',
              },
              {
                label: 'perfManagement.create.KPIs.groups.kpitype.value',
                value: 'VALUE',
              },
              {
                label: 'perfManagement.create.KPIs.groups.kpitype.objective',
                value: 'OBJECTIVE',
              },
            ],
            defaultValue: true,
            showHideFields: [
              {
                ifValue: 'OBJECTIVE',

                hide: [
                  {
                    name: 'kpiTargetBlock',
                    isGroup: true,
                    isField: false,
                  },
                  {
                    name: 'kpiTargetTextBlock',
                    isGroup: true,
                    isField: false,
                  },
                ],
                show: [
                  {
                    name: 'kpiTargetRadioBlock',
                    isGroup: true,
                    isField: false,
                  },
                ],
              },
              {
                ifValue: 'VALUE',
                hide: [
                  {
                    name: 'kpiTargetRadioBlock',
                    isGroup: true,
                    isField: false,
                  },
                  {
                    name: 'kpiTargetTextBlock',
                    isGroup: true,
                    isField: false,
                  },
                ],
                show: [
                  {
                    name: 'kpiTargetBlock',
                    isGroup: true,
                    isField: false,
                  },
                ],
              },
              {
                ifValue: 'TEXT',
                hide: [
                  {
                    name: 'kpiTargetRadioBlock',
                    isGroup: true,
                    isField: false,
                  },
                  {
                    name: 'kpiTargetBlock',
                    isGroup: true,
                    isField: false,
                  },
                ],
                show: [
                  {
                    name: 'kpiTargetTextBlock',
                    isGroup: true,
                    isField: false,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'Text',
        name: 'kpiTargetTextBlock',
        hide: false,
        multiple: false,
        fields: [
          {
            name: 'kpiTargetText',
            jsonPath: 'kpiValues[0].targetDescription',
            label: '',
            pattern: '',
            type: 'text',
            isDisabled: false,
            requiredErrMsg: '',
          },
        ],
      },
      {
        label: 'perfManagement.update.KPIs.groups.updatekpiTargetBlock',
        name: 'kpiTargetBlock',
        hide: true,
        multiple: false,
        fields: [
          {
            name: 'kpiTarget',
            jsonPath: 'kpiValues[0].targetValue',
            label: '',
            pattern: '[0-9]',
            type: 'text',
            isDisabled: false,
            patternErrMsg: 'Please enter a valid number',
            requiredErrMsg: '',
          },
        ],
      },
      {
        label: 'perfManagement.create.KPIs.groups.kpiTargetRadioBlock',
        name: 'kpiTargetRadioBlock',
        hide: true,
        multiple: false,
        fields: [
          {
            name: 'kpiTargetRadio',
            jsonPath: 'kpiValues[0].targetValue',
            label: '',
            pattern: '',
            type: 'radio',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            values: [
              {
                label: 'perfManagement.create.KPIs.groups.kpiTargetRadioBlock.yes',
                value: 1,
              },
              {
                label: 'perfManagement.create.KPIs.groups.kpiTargetRadioBlock.no',
                value: 2,
              },
              {
                label: 'perfManagement.create.KPIs.groups.kpiTargetRadioBlock.inprogress',
                value: 3,
              },
            ],
          },
        ],
      },

      {
        name: 'UploadDocument',
        label: 'legal.create.group.title.UploadDocument',
        fields: [
          {
            name: 'File',
            jsonPath: 'kpiValues[0].documents',
            type: 'documentList',
            pathToArray: 'documentTypes',
            displayNameJsonPath: 'name',
            url: '/tl-masters/documenttype/v2/_search',
            autoFillFields: [
              {
                name: 'documentTypeId',
                jsonPath: 'id',
              },
            ],
          },
        ],
      },
    ],
  },
  'perfManagement.search': {
    numCols: 12 / 2,
    url: 'perfmanagement/v1/kpivalue/_search',
    useTimestamp: true,
    objectName: 'kpiValues',
    groups: [
      {
        name: 'searchkpiCode',
        jsonPath: 'kpiCode',
        label: 'kpiCode',
        pattern: '',
        type: 'text',
        isDisabled: false,
        requiredErrMsg: '',
      },
    ],
    result: {
      header: [{ label: 'Document' }, { label: 'Financial Year' }, { label: 'KPI Name' }],
      values: ['name', 'code', 'targetValue'],
      resultPath: 'KPIs',
      rowClickUrlUpdate: '/update/perfManagement/actualKpiCreate/{code}',
      //"rowClickUrlUpdate": "/create/perfManagement/actualKpiCreate/{code}"
    },
  },
};
export default dat;
