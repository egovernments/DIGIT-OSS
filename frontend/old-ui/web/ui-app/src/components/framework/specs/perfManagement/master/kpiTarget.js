var date2 = Date.now() + 365 * 24 * 60 * 60 * 1000;
let criteria = '[' + encodeURIComponent('?') + '(' + '@.startingDate<' + date2 + ')]';

var dat = {
  'perfManagement.create': {
    numCols: 12 / 2,
    url: 'perfmanagement/v1/kpitarget/_create',
    useTimestamp: true,
    objectName: 'kpiTargets',
    idJsonPath: 'kpiTargets[0]',
    tenantIdRequired: true,
    groups: [
      {
        label: 'perfManagement.create.KPIs.groups.kpiMaster',
        name: 'kpi',
        fields: [
          {
            name: 'kpiselect',
            jsonPath: 'kpiTargets[0].KPI.code',
            label: 'KPI',
            url: '/perfmanagement/v1/kpimaster/_search?tenantId=|$.KPIs.*.code|$.KPIs.*.name',
            isRequired: true,
            pattern: '',
            type: 'singleValueList',
            isDisabled: false,
            requiredErrMsg: '',
            depedants: [
              {
                jsonPath: 'kpiTargets[0].kpiCode',
                type: 'textField',
                pattern: 'kpiTargets[0].KPI.code|KPIs|code|code',
                hasFromDropDownOriginalData: true,
              },
              {
                jsonPath: 'kpiTargets[0].targetType',
                type: 'radio',
                pattern: 'kpiTargets[0].KPI.code|KPIs|code|targetType',
                hasFromDropDownOriginalData: true,
              },
            ],
          },
          {
            name: 'kpiCodeBlock',
            jsonPath: 'kpiTargets[0].kpiCode',
            label: 'perfManagement.update.KPIs.groups.updatekpiCode',
            isRequired: true,
            pattern: '',
            type: 'text',
            isDisabled: true,
            requiredErrMsg: '',
          },
          {
            name: 'kpitype',
            jsonPath: 'kpiTargets[0].targetType',
            label: 'perfManagement.create.KPIs.groups.kpitype',
            pattern: '',
            type: 'radio',
            isRequired: false,
            isDisabled: false,
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
        label: 'perfManagement.update.KPIs.groups.updatekpiTargetTextBlock',
        name: 'kpiTargetTextBlock',
        hide: "this.props.getVal('kpiTargets[0].kpi.targetType') != 'TEXT'?true:false",
        multiple: false,
        fields: [
          {
            name: 'kpiDateBlock',
            jsonPath: 'kpiTargets[0].finYear',
            label: 'perfManagement.update.KPIs.groups.updatekpiTargetFinancialYear',
            isRequired: true,
            pattern: '',
            type: 'singleValueList',
            url:
              'egov-mdms-service/v1/_get?tenantId=' +
              localStorage.tenantId.split('.')[0] +
              '&masterName=FinancialYear&moduleName=egf-master&filter=' +
              criteria +
              '|$..finYearRange|$..finYearRange',
            isDisabled: false,
            requiredErrMsg: '',
            isStateLevel: true,
          },
          {
            name: 'kpiTargetText',
            jsonPath: 'kpiTargets[0].targetDescription',
            label: 'perfManagement.update.KPIs.groups.updatekpiTargetTextBlock',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
          },
        ],
      },
      {
        label: 'perfManagement.update.KPIs.groups.updatekpiTargetBlock',
        name: 'kpiTargetBlock',
        hide: false,
        multiple: false,
        fields: [
          {
            name: 'kpiDateBlock',
            jsonPath: 'kpiTargets[0].finYear',
            label: 'perfManagement.update.KPIs.groups.updatekpiTargetFinancialYear',
            isRequired: true,
            pattern: '',
            type: 'singleValueList',
            url:
              'egov-mdms-service/v1/_get?tenantId=' +
              localStorage.tenantId.split('.')[0] +
              '&masterName=FinancialYear&moduleName=egf-master&filter=' +
              criteria +
              '|$..finYearRange|$..finYearRange',
            isDisabled: false,
            requiredErrMsg: '',
            isStateLevel: true,
          },
          {
            name: 'kpiTarget',
            jsonPath: 'kpiTargets[0].targetValue',
            label: 'perfManagement.update.KPIs.groups.updatekpiTargetTextBlock',
            pattern: '^[0-9]*$',
            isRequired: true,
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
        hide: "this.props.getVal('kpiTargets[0].kpi.targetType') != 'OBJECTIVE'?true:false",
        multiple: false,
        fields: [
          {
            name: 'kpiDateBlock',
            jsonPath: 'kpiTargets[0].finYear',
            label: 'perfManagement.update.KPIs.groups.updatekpiTargetFinancialYear',
            isRequired: true,
            pattern: '',
            type: 'singleValueList',
            url:
              'egov-mdms-service/v1/_get?tenantId=' +
              localStorage.tenantId.split('.')[0] +
              '&masterName=FinancialYear&moduleName=egf-master&filter=' +
              criteria +
              '|$..finYearRange|$..finYearRange',
            isDisabled: false,
            requiredErrMsg: '',
            isStateLevel: true,
          },
          {
            name: 'kpiTargetRadio',
            jsonPath: 'kpiTargets[0].targetValue',
            label: 'perfManagement.update.KPIs.groups.updatekpiTargetTextBlock',
            pattern: '',
            type: 'radio',
            isRequired: true,
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
    ],
  },
  'perfManagement.search': {
    numCols: 12 / 3,
    url: 'perfmanagement/v1/kpitarget/_search',
    useTimestamp: true,
    objectName: 'KPIs.kpiList',
    groups: [
      {
        label: 'perfManagement.search.KPIs.groups.kpiSearch',
        name: 'kpiSearch',
        fields: [
          {
            name: 'searchkpiDepartment',
            jsonPath: 'departmentId',
            label: 'perfManagement.search.KPIs.groups.searchkpiDepartment',
            pattern: '',
            type: 'singleValueList',
            url:
              'egov-mdms-service/v1/_get?tenantId=' +
              localStorage.tenantId.split('.')[0] +
              '&moduleName=common-masters&masterName=Department|$..id|$..name',
            isDisabled: false,
            isRequired: true,
            requiredErrMsg: '',
            isStateLevel: true,
          },
          {
            name: 'kpiCategory',
            jsonPath: 'categoryId',
            label: 'perfManagement.create.KPIs.groups.kpiCategory',
            pattern: '',
            type: 'singleValueList',
            url: '/egov-mdms-service/v1/_get?&moduleName=PM&masterName=KpiCategory|$..code|$..name',
            isDisabled: false,
            requiredErrMsg: '',
            isStateLevel: true,
          },
          {
            name: 'searchkpiCode',
            jsonPath: 'kpiCodes',
            label: 'perfManagement.search.KPIs.groups.searchkpiCode',
            pattern: '',
            type: 'text',
            isDisabled: false,
            requiredErrMsg: '',
          },
        ],
      },
    ],
    result: {
      header: [
        { label: 'perfManagement.search.KPIs.groups.searchkpiName' },
        { label: 'perfManagement.create.KPIs.groups.kpiDate' },
        { label: 'perfManagement.view.KPIs.groups.viewkpiTargetFinancialYear' },
        { label: 'perfManagement.create.KPIs.groups.type' },
        { label: 'perfManagement.search.KPIs.groups.searchkpiTarget' },
      ],
      values: ['kpi.name', 'kpi.financialYear', 'finYear', 'kpi.targetType', 'targetDescription'],
      resultPath: 'kpiTargets',
      rowClickUrlUpdate: '/update/perfManagement/kpiTarget/{kpiCode}',
      rowClickUrlView: '/view/perfManagement/kpiTarget/{kpiCode}',
    },
  },
  'perfManagement.view': {
    numCols: 12 / 2,
    url: '/perfmanagement/v1/kpitarget/_search?kpiCodes={kpiCode}',
    useTimestamp: true,
    objectName: 'kpiTargets',
    groups: [
      {
        label: 'perfManagement.view.KPIs.groups.viewKPI',
        name: 'viewKPI',
        fields: [
          {
            name: 'viewkpiDepartment',
            jsonPath: 'kpiTargets[0].kpi.department.name',
            label: 'perfManagement.view.KPIs.groups.viewkpiDepartment',
            pattern: '',
            type: 'text',
            isDisabled: false,
            requiredErrMsg: '',
            isStateLevel: true,
          },
          {
            name: 'viewkpiDate',
            jsonPath: 'kpiTargets[0].kpi.financialYear',
            label: 'perfManagement.view.KPIs.groups.viewkpiDate',
            isRequired: true,
            pattern: '',
            type: 'singleValueList',
            isDisabled: false,
            requiredErrMsg: '',
            isStateLevel: true,
          },
        ],
      },
      {
        label: '',
        name: 'viewKpiNameBlock',
        fields: [
          {
            name: 'viewkpiName',
            jsonPath: 'kpiTargets[0].kpi.name',
            label: 'perfManagement.view.KPIs.groups.viewkpiName',
            isRequired: true,
            pattern: '',
            type: 'text',
            isDisabled: false,
            requiredErrMsg: '',
          },
          {
            name: 'viewkpiCode',
            jsonPath: 'kpiTargets[0].kpi.code',
            label: 'perfManagement.view.KPIs.groups.viewkpiCode',
            isRequired: true,
            pattern: '',
            type: 'text',
            isDisabled: false,
            requiredErrMsg: '',
          },
        ],
      },

      {
        label: 'perfManagement.view.KPIs.groups.viewkpiTargetBlock',
        name: 'viewkpiTargetBlock',
        hide: false,
        multiple: false,
        fields: [
          {
            name: 'viewkpiTarget',
            //"hide": false,
            jsonPath: 'kpiTargets[0].targetDescription',
            label: '',
            pattern: '',
            type: 'text',
            isDisabled: false,
            requiredErrMsg: '',
          },
        ],
      },

      {
        label: 'perfManagement.view.KPIs.groups.viewkpiTargetRadioBlock',
        name: 'viewkpiTargetRadioBlock',
        hide: true,
        multiple: false,
        fields: [
          {
            name: 'viewkpiTargetRadio',
            jsonPath: 'kpiTargets[0].targetValue',
            label: '',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
        ],
      },
    ],
  },
  'perfManagement.update': {
    numCols: 12 / 2,
    searchUrl: 'perfmanagement/v1/kpitarget/_search?kpiCodes={kpiCode}',
    url: '/perfmanagement/v1/kpitarget/_update',
    useTimestamp: true,
    objectName: 'kpiTargets',
    idJsonPath: 'kpiTargets[0]',
    groups: [
      {
        label: '',
        name: 'updateKpi',
        fields: [
          {
            name: 'updatekpiName',
            jsonPath: 'kpiTargets[0].kpi.name',
            label: 'perfManagement.update.KPIs.groups.updatekpiName',
            isRequired: true,
            pattern: '',
            type: 'text',
            isDisabled: true,
            requiredErrMsg: '',
          },
          {
            name: 'updatekpiCode',
            jsonPath: 'kpiTargets[0].kpiCode',
            label: 'perfManagement.update.KPIs.groups.updatekpiCode',
            isRequired: true,
            pattern: '',
            type: 'text',
            isDisabled: true,
            requiredErrMsg: '',
          },
          {
            name: 'updatekpitype',
            jsonPath: 'kpiTargets[0].kpi.targetType',
            label: 'perfManagement.update.KPIs.groups.updatekpitype',
            pattern: '',
            type: 'radio',
            isRequired: false,
            isDisabled: true,
            requiredErrMsg: '',
            patternErrMsg: '',
            defaultValue: true,
            values: [
              {
                label: 'perfManagement.update.KPIs.groups.updatekpitype.text',
                value: 'TEXT',
              },
              {
                label: 'perfManagement.update.KPIs.groups.updatekpitype.value',
                value: 'VALUE',
              },
              {
                label: 'perfManagement.update.KPIs.groups.updatekpitype.objective',
                value: 'OBJECTIVE',
              },
            ],
            showHideFields: [
              {
                ifValue: 'OBJECTIVE',

                hide: [
                  {
                    name: 'updatekpiTargetBlock',
                    isGroup: true,
                    isField: false,
                  },
                  {
                    name: 'updatekpiTargetTextBlock',
                    isGroup: true,
                    isField: false,
                  },
                ],
                show: [
                  {
                    name: 'updatekpiTargetRadioBlock',
                    isGroup: true,
                    isField: false,
                  },
                ],
              },
              {
                ifValue: 'VALUE',
                hide: [
                  {
                    name: 'updatekpiTargetRadioBlock',
                    isGroup: true,
                    isField: false,
                  },
                  {
                    name: 'updatekpiTargetTextBlock',
                    isGroup: true,
                    isField: false,
                  },
                ],
                show: [
                  {
                    name: 'updatekpiTargetBlock',
                    isGroup: true,
                    isField: false,
                  },
                ],
              },
              {
                ifValue: 'TEXT',
                hide: [
                  {
                    name: 'updatekpiTargetRadioBlock',
                    isGroup: true,
                    isField: false,
                  },
                  {
                    name: 'updatekpiTargetBlock',
                    isGroup: true,
                    isField: false,
                  },
                ],
                show: [
                  {
                    name: 'updatekpiTargetTextBlock',
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
        label: '',
        name: 'updatekpiTargetTextBlock',
        hide: "this.props.getVal('kpiTargets[0].kpi.targetType') != 'TEXT'?true:false",
        multiple: false,
        fields: [
          {
            name: 'updatekpiDate',
            jsonPath: 'kpiTargets[0].finYear',
            label: 'perfManagement.update.KPIs.groups.updatekpiTargetFinancialYear',
            isRequired: "this.props.getVal('kpiTargets[0].kpi.targetType') == 'TEXT'?true:false",
            pattern: '',
            type: 'singleValueList',
            url:
              'egov-mdms-service/v1/_get?tenantId=' +
              localStorage.tenantId.split('.')[0] +
              '&masterName=FinancialYear&moduleName=egf-master&filter=' +
              criteria +
              '|$..finYearRange|$..finYearRange',
            isDisabled: false,
            requiredErrMsg: '',
            isStateLevel: true,
          },
          {
            name: 'updatekpiTarget',
            jsonPath: 'kpiTargets[0].targetDescription',
            label: 'perfManagement.update.KPIs.groups.updatekpiTargetTextBlock',
            pattern: '',
            type: 'text',
            isDisabled: false,
            isRequired: "this.props.getVal('kpiTargets[0].kpi.targetType') == 'TEXT'?true:false",
            requiredErrMsg: '',
          },
        ],
      },

      {
        label: '',
        name: 'updatekpiTargetBlock',
        hide: "this.props.getVal('kpiTargets[0].kpi.targetType') != 'VALUE'?true:false",
        multiple: false,
        fields: [
          {
            name: 'updatekpiDate',
            jsonPath: 'kpiTargets[0].finYear',
            label: 'perfManagement.update.KPIs.groups.updatekpiTargetFinancialYear',
            isRequired: "this.props.getVal('kpiTargets[0].kpi.targetType') == 'VALUE'?true:false",
            pattern: '',
            type: 'singleValueList',
            url:
              'egov-mdms-service/v1/_get?tenantId=' +
              localStorage.tenantId.split('.')[0] +
              '&masterName=FinancialYear&moduleName=egf-master&filter=' +
              criteria +
              '|$..finYearRange|$..finYearRange',
            isDisabled: false,
            requiredErrMsg: '',
            isStateLevel: true,
          },
          {
            name: 'updatekpiTargetText',
            jsonPath: 'kpiTargets[0].targetValue',
            label: 'perfManagement.update.KPIs.groups.updatekpiTargetBlock',
            pattern: '^[0-9]*$',
            type: 'text',
            isNumber: true,
            isDisabled: false,
            isRequired: "this.props.getVal('kpiTargets[0].kpi.targetType') == 'VALUE'?true:false",
            requiredErrMsg: '',
            patternErrMsg: 'perfManagement.create.KPIs.groups.kpiInputNumber',
          },
        ],
      },
      {
        label: '',
        name: 'updatekpiTargetRadioBlock',
        hide: "this.props.getVal('kpiTargets[0].kpi.targetType') != 'OBJECTIVE'?true:false",
        multiple: false,
        fields: [
          {
            name: 'updatekpiDate',
            jsonPath: 'kpiTargets[0].finYear',
            label: 'perfManagement.update.KPIs.groups.updatekpiTargetFinancialYear',
            isRequired: "this.props.getVal('kpiTargets[0].kpi.targetType') == 'OBJECTIVE'?true:false",
            pattern: '',
            type: 'singleValueList',
            url:
              'egov-mdms-service/v1/_get?tenantId=' +
              localStorage.tenantId.split('.')[0] +
              '&masterName=FinancialYear&moduleName=egf-master&filter=' +
              criteria +
              '|$..finYearRange|$..finYearRange',
            isDisabled: false,
            requiredErrMsg: '',
            isStateLevel: true,
          },
          {
            name: 'updatekpiTargetRadio',
            jsonPath: 'kpiTargets[0].targetValue',
            label: 'perfManagement.update.KPIs.groups.updatekpiTargetRadioBlock',
            pattern: '',
            type: 'radio',
            isRequired: false,
            isDisabled: false,
            isRequired: "this.props.getVal('kpiTargets[0].kpi.targetType') == 'OBJECTIVE'?true:false",
            requiredErrMsg: '',
            patternErrMsg: '',
            values: [
              {
                label: 'perfManagement.update.KPIs.groups.updatekpiTargetBlock.yes',
                value: '1',
              },
              {
                label: 'perfManagement.update.KPIs.groups.updatekpiTargetBlock.no',
                value: '2',
              },
              {
                label: 'perfManagement.update.KPIs.groups.updatekpiTargetBlock.inprogress',
                value: '3',
              },
            ],
          },
        ],
      },
    ],
  },
};
export default dat;
