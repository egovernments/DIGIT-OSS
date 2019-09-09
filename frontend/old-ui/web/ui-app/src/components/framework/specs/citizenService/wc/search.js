var dat = {
  'wc.search': {
    numCols: 4,
    url: '/citizen-services/v1/requests/_search',
    tenantIdRequired: true,
    useTimestamp: true,
    objectName: 'Donation',
    groups: [
      {
        label: 'Search Service Requests',
        name: 'createCategoryType',
        fields: [
          {
            name: 'ServiceRequestNumber',
            jsonPath: 'serviceRequestId',
            label: 'Service Request Number',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
        ],
      },
    ],
    result: {
      header: [{ label: 'Service Request Number' }, { label: 'Service Name' }, { label: 'Status' }, { label: 'Applied On' }],
      values: ['serviceRequestId', 'serviceCode', 'status', 'auditDetails.createdDate'],
      resultPath: 'serviceReq',
    },
  },
};

export default dat;
