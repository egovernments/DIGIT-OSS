var dat = {
  'legal.update': {
    numCols: 12,
    title: 'legal.create.group.title.eventDetails',
    useTimestamp: true,
    objectName: 'events',
    searchUrl: '/lcms-services/legalcase/event/_get?id={id}',
    customActionsAndUrl: [
      {
        actionName: 'Back',
        url: '/search/legal/summon/view',
      },
    ],
    groups: [
      {
        name: 'eventDetails',
        label: ' ',
        fields: [
          {
            name: 'Calendar',
            type: 'calendar',
            jsonPath: 'events',
            isRequired: true,
            isDisabled: false,
          },
        ],
      },
    ],
    url: '/lcms-services/legalcase/hearingdetails/_create',
    tenantIdRequired: true,
  },
};
export default dat;
