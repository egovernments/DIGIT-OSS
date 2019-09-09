var dat = {
  'egf.create': {
    numCols: 12 / 3,
    url: '/egf-voucher/vouchers/_create',
    tenantIdRequired: true,
    idJsonPath: 'vouchers[0].code',
    useTimestamp: false,
    objectName: 'vouchers',
    groups: [
      {
        label: 'Create Journal Voucher',
        name: 'createJournalVoucher',
        fields: [
          {
            name: 'voucherDate',
            jsonPath: 'vouchers[0].voucherDate',
            label: 'Voucher Date',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            maxDate: 'today',
            isDisabled: false,
            requiredErrMsg: '', //Remove required messages
            patternErrMsg: '',
          },
          {
            name: 'voucherType',
            jsonPath: 'vouchers[0].type',
            label: 'Voucher Type',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            defaultValue: [
              {
                key: 'JOURNAL VOUCHER',
                value: 'JOURNAL VOUCHER',
              },
              {
                key: 'STANDARD_VOUCHER_TYPE_CONTRA',
                value: 'STANDARD_VOUCHER_TYPE_CONTRA',
              },
              {
                key: 'STANDARD_VOUCHER_TYPE_PAYMENT',
                value: 'STANDARD_VOUCHER_TYPE_PAYMENT',
              },
              {
                key: 'STANDARD_VOUCHER_TYPE_RECEIPT',
                value: 'STANDARD_VOUCHER_TYPE_RECEIPT',
              },
              {
                key: 'STANDARD_VOUCHER_TYPE_JOURNAL',
                value: 'STANDARD_VOUCHER_TYPE_JOURNAL',
              },
            ],
          },
          {
            name: 'name',
            jsonPath: 'vouchers[0].name',
            label: 'Voucher Sub-Type',
            pattern: '',

            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: 'Length minimum is 3 and maximum is 100',
            defaultValue: [
              {
                key: 'Journal Voucher',
                value: 'Journal Voucher',
              },
            ],
          },
          {
            name: 'fund',
            jsonPath: 'vouchers[0].fund.id',
            label: 'Fund',
            pattern: '',
            type: 'singleValueListMultiple',
            url: '/egf-master/funds/_search?&sortBy=code|$..id|$..code,$..name',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'department',
            jsonPath: 'vouchers[0].department.id',
            label: 'Department',
            pattern: '',
            type: 'singleValueList',
            url: '/egov-common-masters/departments/_search?|$..id|$..name',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'function',
            jsonPath: 'vouchers[0].function.id',
            label: 'Function',
            pattern: '',
            type: 'singleValueListMultiple',
            url: '/egf-master/functions/_search?&sortBy=code|$.functions[*].id|$.functions[*].name',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'Description',
            jsonPath: 'vouchers[0].description',
            label: 'Description',
            pattern: '^[s.]*([^s.][s.]*){0,250}$',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
        ],
      },
    ],
  },
  'egf.search': {
    numCols: 12 / 3,
    url: '/egf-voucher/vouchers/_search',
    tenantIdRequired: true,
    useTimestamp: false,
    objectName: 'vouchers',
    groups: [
      {
        label: 'Search Voucher',
        name: 'searchVoucher',
        fields: [
          {
            name: 'type',
            jsonPath: 'type',
            label: 'Voucher Type',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            defaultValue: [
              {
                key: 'JOURNAL VOUCHER',
                value: 'JOURNAL VOUCHER',
              },
              {
                key: 'STANDARD_VOUCHER_TYPE_CONTRA',
                value: 'STANDARD_VOUCHER_TYPE_CONTRA',
              },
              {
                key: 'STANDARD_VOUCHER_TYPE_PAYMENT',
                value: 'STANDARD_VOUCHER_TYPE_PAYMENT',
              },
              {
                key: 'STANDARD_VOUCHER_TYPE_RECEIPT',
                value: 'STANDARD_VOUCHER_TYPE_RECEIPT',
              },
              {
                key: 'STANDARD_VOUCHER_TYPE_JOURNAL',
                value: 'STANDARD_VOUCHER_TYPE_JOURNAL',
              },
            ],
          },
        ],
      },
    ],
    result: {
      header: [
        { label: 'Voucher Number' },
        { label: 'Voucher Date' },
        { label: 'Fund' },
        { label: 'Function' },
        { label: 'Department' },
        { label: 'Description' },
      ],
      values: ['voucherNumber', 'voucherDate', 'fund[0].name', 'function[0].name', 'department[0].name', 'description'],
      resultPath: 'vouchers',
      rowClickUrlUpdate: '/update/tl/CreateLegacyLicense/{id}',
      rowClickUrlView: '/non-framework/tl/transaction/viewLicense/{id}',
    },
  },
};

export default dat;
