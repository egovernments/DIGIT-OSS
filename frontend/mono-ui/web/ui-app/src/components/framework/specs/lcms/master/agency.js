var dat = {
  'lcms.search': {
    hidesearch:true,
    numCols: 4,
    title: 'advocates.search.document.title.agency',
    useTimestamp: true,
    objectName: '',
    url: '/lcms-services/legalcase/advocate/agency/_search?isIndividual=false',
    customActionsAndUrl: [
      {
        actionName: 'Add',
        url: '/create/lcms/advocate',
      },
    ],
    groups: [
      {
        name: 'applicantType',
        label: 'advocates.create.group.title.agencySearch',
        fields: [
          {
            name: 'agencOrganizationName',
            jsonPath: 'agencyName',
            label: 'advocates.create.agencOrganizationName',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            defaultValue:'',
          },
        ],
      },
    ],
    result: {
      disableRowClick: false,
      isAction: true,
      /* actionItems: [
            {
              label: "Update Agency",
              url: "/update/legal/updateagency/"
            }
          ],*/
      header: [
       /* {
          label: 'legal.search.result.actionLabels',
          isChecked: true,
          checkedItem: {
            jsonPath: 'checkedRow',
            label: '',
          },
        },*/
        {
          label: 'legal.search.result.agencyName',
        },
        {
          label: 'legal.search.result.agencyAddress',
        },
        {
          label: 'reports.lcms.status',
        },
      ],
      values: [ 'name', 'agencyAddress','status'],
      resultPath: 'agencies',
      resultIdKey: 'code',
      rowClickUrlUpdate: '/update/lcms/updateagency/{code}',
      rowClickUrlView: '/view/lcms/updateagency/{code}',
      //"rowClickUrlUpdate": "/update/legalcase/{id}",
      //"rowClickUrlView": "/view/legalcase/{id}"
    },
  },
};
export default dat;
