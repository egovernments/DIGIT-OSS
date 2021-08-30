var dat = {
  'tl.create': {
    numCols: 12 / 2,
    url: '/tl-masters/penaltyrate/v1/_create',
    useTimestamp: true,
    tenantIdRequired: true,
    objectName: 'penaltyRatesOne',
    groups: [
      {
        label: 'tl.create.penaltyRates.title',
        name: 'createpenaltyRatesOne',
        fields: [
          {
            name: 'applicationType',
            jsonPath: 'penaltyRatesOne.applicationType',
            label: 'tl.search.groups.penaltyRates.applicationtype',
            pattern: '',
            type: 'singleValueList',
            url: '',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            defaultValue: [
              {
                key: null,
                value: '--Please Select--',
              },
              {
                key: 'NEW',
                value: 'NEW',
              },
              {
                key: 'RENEW',
                value: 'RENEW',
              },
            ],
          },
        ],
      },
    ],
  },
  'tl.search': {
    numCols: 12 / 1,
    url: '/tl-masters/penaltyrate/v1/_search',
    tenantIdRequired: true,
    useTimestamp: true,
    objectName: 'penaltyRates',
    groups: [
      {
        label: 'tl.search.groups.penaltyRates.title',
        name: 'createPenaltyRates',
        fields: [
          {
            name: 'applicationType',
            jsonPath: 'applicationType',
            label: 'tl.create.groups.penaltyRates.applicationtype',
            pattern: '',
            type: 'singleValueList',
            url: '',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            defaultValue: [
              {
                key: null,
                value: '--Please Select--',
              },
              {
                key: 'NEW',
                value: 'NEW',
              },
              {
                key: 'RENEW',
                value: 'RENEW',
              },
            ],
          },
        ],
      },
    ],
    result: {
      header: [
        { label: 'tl.create.groups.penaltyRates.applicationtype' },
        { label: 'tl.create.groups.penaltyRates.fromDays' },
        { label: 'tl.create.groups.penaltyRates.toDays' },
        { label: 'tl.create.groups.penaltyRates.range' },
      ],
      values: ['applicationType', 'fromRange', 'toRange', 'rate'],
      resultPath: 'penaltyRates',
      rowClickUrlUpdate: '/non-framework/tl/masters/update/updatePenaltyRates/{id}?applicationType={applicationType}',
      rowClickUrlView: '/non-framework/tl/masters/view/viewPenaltyRates/{id}?applicationType={applicationType}',
    },
  },
  'tl.view': {
    numCols: 12 / 2,
    url: '/tl-masters/penaltyrate/v1/_search?ids={id}&applicationType={applicationType}',
    tenantIdRequired: true,
    useTimestamp: true,
    objectName: 'penaltyRates[0]',
    groups: [
      {
        label: 'tl.view.groups.penaltyRates.title',
        name: 'viewCategoryType',
        fields: [
          {
            name: 'applicationType',
            jsonPath: 'penaltyRates[0].applicationType',
            label: 'tl.view.groups.penaltyRates.applicationtype',
            pattern: '',
            type: 'text',
            url: '',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
        ],
      },
    ],
  },
  'tl.update': {
    numCols: 12 / 2,
    searchUrl: '/tl-masters/penaltyrate/v1/_search?ids={id}&applicationType={applicationType}',
    url: '/tl-masters/penaltyrate/v1/_update',
    tenantIdRequired: true,
    useTimestamp: true,
    objectName: 'penaltyRates[0]',
    groups: [
      {
        label: 'tl.update.groups.penaltyRates.title',
        name: 'updateCategoryType',
        fields: [
          {
            name: 'applicationType',
            jsonPath: 'penaltyRates[0].applicationType',
            label: 'tl.update.groups.penaltyRates.applicationtype',
            pattern: '',
            type: 'singleValueList',
            url: '',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            defaultValue: [
              {
                key: null,
                value: '--Please Select--',
              },
              {
                key: 'NEW',
                value: 'NEW',
              },
              {
                key: 'RENEW',
                value: 'RENEW',
              },
            ],
          },
        ],
      },
    ],
  },
};

export default dat;
