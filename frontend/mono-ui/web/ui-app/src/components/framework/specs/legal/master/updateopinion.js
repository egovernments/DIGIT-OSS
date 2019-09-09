var dat = {
  'legal.update': {
    numCols: 6,
    url: '/lcms-services/legalcase/opinion/_update',
    tenantIdRequired: true,
    useTimestamp: true,
    objectName: 'opinions',
    searchUrl: 'lcms-services/legalcase/opinion/_search?codes={id}',
    groups: [
      {
        label: 'opinionrequest.update.group.title.OpinionRequest',
        name: 'entryType',
        fields: [
          {
            name: 'opinionRequestDate',
            jsonPath: 'opinions[0].opinionRequestDate',
            label: 'opinionrequest.update.opinionRequestDate',
            type: 'datePicker',
            isRequired: true,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'departmentName',
            jsonPath: 'opinions[0].departmentName.code',
            label: 'opinionrequest.update.departmentName',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            requiredErrMsg: '',
            patternErrMsg: '',
            url: '/egov-common-masters/departments/_search?|$..code|$..name',
          },
          {
            name: 'Case',
            jsonPath: 'opinions[0].caseDetails.summonReferenceNo',
            label: 'opinion.create.case',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
            url: '/lcms-services/legalcase/caseno/_search?|$..summonReferenceNo|$..caseNo',
          },
          {
            name: 'opinionOn',
            jsonPath: 'opinions[0].opinionOn',
            label: 'opinionrequest.update.opinionOn',
            pattern: '',
            type: 'textarea',
            fullWidth: true,
            isRequired: true,
            isDisabled: true,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
        ],
      },
      //     {
      //   "name": "UploadDocument",
      //   "label": "legal.create.group.title.UploadDocument",
      //   fields:[{
      //     "name":"UploadDocument",
      //     "jsonPath": "opinions[0].documents",
      //     "label": "legal.create.sectionApplied",
      //      "type": "fileTable",
      //       "isRequired": false,
      //       "isDisabled": true,
      //       "patternErrMsg": "",
      //       "fileList":{
      //           "name":"docName",
      //           "id":"fileStoreid"
      //       },
      //         "fileCount":3

      //   }]
      // },
      // {
      //   "label": "SCRUITNY",
      //   "name": "scruitny",
      //   "fields": [
      //     {
      //       "name": "Scruitny",
      //       "jsonPath": "",
      //       "label": "opinionrequest.update.Scruitny",
      //       "pattern": "",
      //       "type": "radio",
      //       "isRequired": true,
      //       "isDisabled": true,
      //       "requiredErrMsg": "",
      //       "patternErrMsg": "",
      //       "values": [{ "label": "opinionrequest.update.approve", "value": true }, { "label": "opinionrequest.update.reject", "value": false }],
      //       "defaultValue": true
      //     },
      //     {
      //       "name": "Forward To",
      //       "jsonPath": "ForwardTo",
      //       "label": "opinionrequest.update.ForwardTo",
      //       "pattern": "",
      //       "type": "singleValueList",
      //       "isRequired": true,
      //       "isDisabled": true,
      //       "requiredErrMsg": "",
      //       "patternErrMsg": ""
      //     },
      //     {
      //       "name": "Other Lawyer",
      //       "jsonPath": "opinions[0].additionalAdvocate",
      //       "label": "",
      //       "pattern": "",
      //       "type": "singleValueList",
      //       "isRequired": true,
      //       "isDisabled": false,
      //       "requiredErrMsg": "",
      //       "patternErrMsg": ""
      //     }
      //   ]
      // },
      {
        label: 'Opinion',
        name: 'opinion',
        fields: [
          {
            name: 'Opinionby',
            jsonPath: 'opinions[0].opinionsBy.code',
            label: 'opinionrequest.update.opinionby',
            pattern: '',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: true,
            requiredErrMsg: '',
            patternErrMsg: '',
            url: '/lcms-services/legalcase/advocate/_search?|$..code|$..name',
          },
          {
            name: 'OtherLawyer',
            jsonPath: 'opinions[0].additionalAdvocate',
            label: 'opinionrequest.update.additionalAdvocate',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            requiredErrMsg: '',
            patternErrMsg: '',
            url: '/lcms-services/legalcase/advocate/_search?|$..code|$..name',
          },
          {
            name: 'opinionDescription',
            jsonPath: 'opinions[0].opinionDescription',
            label: 'opinionrequest.update.opinionDescription',
            pattern: '',
            type: 'textarea',
            fullWidth: true,
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
        ],
      },
      {
        name: 'UploadDocument1',
        label: 'legal.create.group.title.UploadDocument',
        fields: [
          {
            name: 'UploadDocument1',
            jsonPath: 'opinions[0].documents',
            label: 'legal.create.sectionApplied',
            showDocfile: true,
            type: 'fileTable',
            isRequired: false,
            isDisabled: false,
            patternErrMsg: '',
            fileList: {
              name: 'documentName',
              id: 'fileStoreId',
            },
            //"fileCount":3
          },
        ],
      },
    ],
  },
};

export default dat;
