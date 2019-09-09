var dat = {
  'perfManagement.search': {
    numCols: 12 / 2,
    url: '/perfmanagement/v1/kpivalue/_search',
    useTimestamp: true,
    objectName: 'kpiValues',
    groups: [
      {
        label: 'Search Key Performance Indicator',
        name: 'kpi',
        fields: [
          {
            name: 'kpiDepartment',
            jsonPath: 'departmentId',
            label: 'perfManagement.create.KPIs.groups.kpiDepartment',
            isRequired: true,
            pattern: '',
            type: 'singleValueList',
            url: 'egov-mdms-service/v1/_get?tenantId=default&moduleName=common-masters&masterName=Department|$..id|$..name',
            isDisabled: false,
            requiredErrMsg: '',
          },
          {
            name: 'kpiDate',
            jsonPath: 'finYear',
            label: 'perfManagement.create.KPIs.groups.kpiDate',
            isRequired: true,
            pattern: '',
            type: 'singleValueList',
            url: 'egf-master/financialyears/_search?tenantId=default|$.financialYears.*.finYearRange|$.financialYears.*.finYearRange',
            isDisabled: false,
            requiredErrMsg: '',
          },
        ],
      },
    ],
    result: {
      header: [{ label: 'Department' }, { label: 'Financial Year' }, { label: 'KPI Name' }, { label: 'Instructions' }, { label: 'Target Value' }],
      values: ['kpi.department', 'kpi.financialYear', 'kpi.name', 'kpi.instructions', 'kpi.targetDescription'],
      resultPath: 'kpiValues',
      rowClickUrlUpdate: '/update/perfManagement/actualKpiUpdate/{kpi.code}?finYear={kpi.financialYear}',
      rowClickUrlView: '/view/perfManagement/actualKpiUpdate/{kpi.code}?finYear={kpi.financialYear}',
    },
  },
  'perfManagement.update': {
    numCols: 12 / 2,
    searchUrl: '/perfmanagement/v1/kpivalue/_search?kpiCodes={code}&finYear={kpi.financialYear}',
    url: 'perfmanagement/v1/kpivalue/_update',
    tenantIdRequired: true,
    useTimestamp: true,
    objectName: 'kpiValues',
    groups: [
      {
        label: 'Update Actual Key Performance Indicator',
        name: 'kpiDate',
        fields: [
          {
            name: 'updateActualKpiDepartment',
            jsonPath: 'kpiValues[0].kpi.code',
            label: 'KPI Code',
            isRequired: false,
            pattern: '',
            type: 'text',
            isDisabled: true,
            requiredErrMsg: '',
          },
          {
            name: 'updateFinYear',
            jsonPath: 'kpiValues[0].kpi.financialYear',
            label: 'Financial Year',
            isRequired: true,
            pattern: '',
            type: 'text',
            isDisabled: true,
            requiredErrMsg: '',
          },
          {
            name: 'updateActualKpiName',
            jsonPath: 'kpiValues[0].kpi.name',
            label: 'KPI Name',
            isRequired: true,
            pattern: '',
            type: 'text',
            isDisabled: true,
            requiredErrMsg: '',
          },
          {
            name: 'kpitype',
            jsonPath: 'kpiValues[0].kpi.targetType',
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
                  {
                    name: 'kpiActualBlock',
                    isGroup: true,
                    isField: false,
                  },
                  {
                    name: 'kpiActualTextBlock',
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
                  {
                    name: 'kpiActualRadioBlock',
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
                  {
                    name: 'kpiActualRadioBlock',
                    isGroup: true,
                    isField: false,
                  },
                  {
                    name: 'kpiActualTextBlock',
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
                  {
                    name: 'kpiActualBlock',
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
                  {
                    name: 'kpiActualRadioBlock',
                    isGroup: true,
                    isField: false,
                  },
                  {
                    name: 'kpiActualBlock',
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
                  {
                    name: 'kpiActualTextBlock',
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
        label: 'Target Value',
        name: 'kpiTargetTextBlock',
        hide: "`${this.props.getVal('kpiValues[0].kpi.targetType')!='TEXT'?true:false}`",
        multiple: false,
        fields: [
          {
            name: 'kpiTargetText',
            jsonPath: 'kpiValues[0].kpi.targetDescription',
            label: '',
            pattern: '',
            type: 'text',
            isDisabled: true,
            requiredErrMsg: '',
          },
        ],
      },
      {
        label: 'perfManagement.create.KPIs.groups.kpiTargetBlock',
        name: 'kpiTargetBlock',
        hide: "`${this.props.getVal('kpiValues[0].kpi.targetType')!='VALUE'?true:false}`",
        multiple: false,
        fields: [
          {
            name: 'kpiTarget',
            jsonPath: 'kpiValues[0].kpi.targetDescription',
            label: '',
            pattern: '[0-9]',
            type: 'text',
            isDisabled: true,
            patternErrMsg: 'Please enter a valid number',
            requiredErrMsg: '',
          },
        ],
      },

      {
        label: 'perfManagement.create.KPIs.groups.kpiTargetRadioBlock',
        name: 'kpiTargetRadioBlock',
        hide: "`${this.props.getVal('kpiValues[0].kpi.targetType')!='OBJECTIVE'?true:false}`",
        multiple: false,
        fields: [
          {
            name: 'kpiTargetRadio',
            jsonPath: 'kpiValues[0].kpi.targetValue',
            label: '',
            pattern: '',
            type: 'radio',
            isRequired: false,
            isDisabled: true,
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
        name: 'kpiInstructions',
        label: 'Instruction to Achieve Target',
        fields: [
          {
            name: 'updateActualKpiInstruction',
            jsonPath: 'kpiValues[0].kpi.instructions',
            label: '',
            pattern: '',
            type: 'textarea',
            fullWidth: true,
            isDisabled: true,
            requiredErrMsg: '',
          },
        ],
      },
      {
        label: 'Actual Value',
        name: 'kpiActualTextBlock',
        hide: "`${this.props.getVal('kpiValues[0].kpi.targetType')!='TEXT'?true:false}`",
        multiple: false,
        fields: [
          {
            name: 'kpiActualText',
            jsonPath: 'kpiValues[0].kpi.actualValue',
            label: '',
            pattern: '',
            type: 'text',
            isDisabled: false,
            requiredErrMsg: '',
          },
        ],
      },
      {
        label: 'perfManagement.create.KPIs.groups.kpiTargetBlock',
        name: 'kpiActualBlock',
        hide: "`${this.props.getVal('kpiValues[0].kpi.targetType')!='VALUE'?true:false}`",
        multiple: false,
        fields: [
          {
            name: 'kpiActual',
            //"hide":false,
            jsonPath: 'kpiValues[0].resultValue',
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
        name: 'kpiActualRadioBlock',
        hide: "`${this.props.getVal('kpiValues[0].kpi.targetType')!='OBJECTIVE'?true:false}`",
        multiple: false,
        fields: [
          {
            name: 'kpiActualRadio',
            //"hide":true,
            jsonPath: 'kpiValues[0].resultValue',
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
            //  "jsonPath": "kpiValues[0].documents",
            // "type": "documentList",
            // "pathToArray": "kpiValues[0].documents",
            // "displayNameJsonPath": "documents",
            //"url": "/tl-masters/documenttype/v2/_search?|$..code|$..code",
            url: '/perfmanagement/v1/kpimaster/_getDocumentForKpi?kpiCode=CODEEGOV',
            //$.kpiValues.*.kpi.code
            //"url": "/perfmanagement/v1/kpimaster/_getDocumentForKpi?|$.kpiValues.*.kpi.code|$.kpiValues.*.kpi.code"
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

  'perfManagement.view': {
    numCols: 12 / 2,
    url: '/perfmanagement/v1/kpivalue/_search?kpiCodes={code}&finYear={kpi.financialYear}',
    useTimestamp: true,
    objectName: 'KPIs',
    groups: [
      {
        label: 'Actual Key Performance Indicator',
        name: 'viewKPI',
        fields: [
          {
            name: 'viewkpiDepartment',
            jsonPath: 'kpiValues[0].kpi.code',
            label: 'KPI Code',
            pattern: '',
            type: 'text',
            isDisabled: false,
            requiredErrMsg: '',
          },
          {
            name: 'viewkpiDate',
            jsonPath: 'kpiValues[0].kpi.financialYear',
            label: 'Financial Year',
            isRequired: true,
            pattern: '',
            type: 'singleValueList',
            isDisabled: false,
            requiredErrMsg: '',
          },

          {
            name: 'updateActualKpiName',
            jsonPath: 'kpiValues[0].kpi.name',
            label: 'KPI Name',
            isRequired: true,
            pattern: '',
            type: 'text',
            isDisabled: true,
            requiredErrMsg: '',
          },
          {
            name: 'updateActualKpiTarget',
            jsonPath: 'kpiValues[0].kpi.targetDescription',
            label: 'Target Value',
            pattern: '',
            type: 'text',
            isDisabled: true,
            requiredErrMsg: '',
          },
          {
            name: 'updateActualKpiInstruction',
            jsonPath: 'kpiValues[0].kpi.instructions',
            label: 'Instruction to Achieve Target',
            pattern: '',
            type: 'textarea',
            fullWidth: true,
            isDisabled: true,
            requiredErrMsg: '',
          },
          {
            name: 'updateActualKpiActual',
            jsonPath: 'kpiValues[0].resultDescription',
            label: 'Actual Value',
            pattern: '',
            type: 'number',
            isDisabled: false,
            requiredErrMsg: '',
          },
        ],
      },
    ],
  },
};
export default dat;
