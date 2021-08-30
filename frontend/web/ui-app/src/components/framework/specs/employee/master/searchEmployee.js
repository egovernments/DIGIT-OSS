var dat = {
  'employee.empsearch': {
    numCols: 12 / 3,
    url: '/hr-employee/employees/_search',
    tenantIdRequired: true,
    useTimestamp: true,
    objectName: 'Employee',
    groups: [
      {
        label: 'employee.searchEmployee.title',
        name: 'EmployeeSearch',
        fields: [
          {
            name: 'Department',
            jsonPath: 'departmentId',
            label: 'employee.searchEmployee.groups.fields.department',
            pattern: '',
            type: 'singleValueList',
            url: '/egov-common-masters/departments/_search?|$..id|$..name',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'Designation',
            jsonPath: 'designationId',
            label: 'employee.searchEmployee.groups.fields.designation',
            pattern: '',
            type: 'singleValueList',
            url: '/hr-masters/designations/_search?|$..id|$..name',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'Code',
            jsonPath: 'code',
            label: 'employee.searchEmployee.groups.fields.code',
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
    result: {
      header: [
        { label: 'employee.searchEmployee.groups.fields.code' },
        { label: 'employee.searchEmployee.groups.fields.name' },
        {
          label: 'employee.searchEmployee.groups.fields.department',
          url: '/egov-common-masters/departments/_search?|$..id|$..name',
        },
        {
          label: 'employee.searchEmployee.groups.fields.designation',
          url: '/hr-masters/designations/_search?|$..id|$..name',
        },
        {
          label: 'employee.searchEmployee.groups.fields.position',
          url: '/hr-masters/positions/_search?|$..id|$..name',
        },
      ],
      values: ['code', 'name', 'assignments[0].department', 'assignments[0].designation', 'assignments[0].position'],
      resultPath: 'Employee',
      rowClickUrlUpdate: '/employee/update/{id}',
      rowClickUrlView: '/employee/view/{id}',
    },
  },
};

export default dat;
