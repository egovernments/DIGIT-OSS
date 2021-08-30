var dat = {
  // "collection.create": {
  // 	"numCols": 12/3,
  // 	"url": "/collectionms/masters/categorytype/_create",
  // 	"tenantIdRequired": true,
  // 	"idJsonPath": "CategoryTypes[0].code",
  // 	"objectName": "CategoryType",
  // 	"groups": [
  // 		{
  // 			"label": "collection.create.categorytype.title",
  // 			"name": "createCategoryType",
  // 			"fields": [
  // 					{
  // 						"name": "name",
  // 						"jsonPath": "CategoryType.name",
  // 						"label": "collection.create.categorytype",
  // 						"pattern": "^[\s.]*([^\s.][\s.]*){0,100}$",
  // 						"type": "text",
  // 						"isRequired": true,
  // 						"isDisabled": false,
  // 						"requiredErrMsg": "",
  // 						"patternErrMsg": "Length is more than 100"
  // 					},
  // 					{
  // 						"name": "description",
  // 						"jsonPath": "CategoryType.description",
  // 						"label": "collection.create.description",
  // 						"pattern": "^[\s.]*([^\s.][\s.]*){0,250}$",
  // 						"type": "text",
  // 						"isRequired": false,
  // 						"isDisabled": false,
  // 						"requiredErrMsg": "",
  // 						"patternErrMsg": "Length is more than 250"
  // 					},
  // 					{
  // 						"name": "Active",
  // 						"jsonPath": "CategoryType.active",
  // 						"label": "collection.create.active",
  // 						"pattern": "",
  // 						"type": "checkbox",
  // 						"isRequired": false,
  // 						"defaultValue":true,
  // 						"isDisabled": false,
  // 						"requiredErrMsg": "",
  // 						"patternErrMsg": ""
  // 					}
  // 			]
  // 		}
  // 	]
  // },
  'collection.search': {
    numCols: 12 / 3,
    url: '/collection-services/receipts/_search',
    tenantIdRequired: true,
    useTimestamp: true,
    objectName: '',
    groups: [
      {
        label: 'collection.search.categorytype.title',
        name: 'createCategoryType',
        fields: [
          {
            name: 'transactionId',
            jsonPath: 'transactionId',
            label: 'collection.create.transactionId',
            pattern: '^[0-9a-zA-Z]{10,16}$',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: 'Enter Valid Transaction Id between 10 and 16 Characters',
          },
          {
            name: 'receiptNumber',
            jsonPath: 'receiptNumbers',
            label: 'collection.create.receiptNumber',
            pattern: '[0-9a-zA-Z]{4,18}',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: 'Enter Valid Receipt Number (ex: 08/2017-18/000418) between 4 and 18 Characters',
          },
          {
            name: 'manualReceiptNumber',
            jsonPath: 'manualReceiptNumbers',
            label: 'collection.create.manualReceiptNumber',
            pattern: '[0-9a-zA-Z]{4,18}',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: 'Enter valid Manual Receipt Number between 4 and 18 Characters',
          },
          {
            name: 'serviceType',
            jsonPath: 'businessCode',
            label: 'collection.create.serviceType',
            pattern: '',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            url: 'collection-services/receipts/_getDistinctBusinessDetails?tenantId=default|$..code|$..name',
          },
          {
            name: 'fromDate',
            jsonPath: 'fromDate',
            label: 'collection.create.fromDate',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'toDate',
            jsonPath: 'toDate',
            label: 'collection.create.toDate',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'collectedBy',
            jsonPath: 'collectedBy',
            label: 'collection.create.collectedBy',
            pattern: '',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            url: 'collection-services/receipts/_getDistinctCollectedBy?tenantId=default|$.user.*.id|$.user.*.name',
          },
          {
            name: 'status',
            jsonPath: 'status',
            label: 'collection.create.status',
            pattern: '',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            url: 'collection-services/receipts/_status?tenantId=default|$..key|$..object',
            defaultValue: [],
          },
          {
            name: 'modeOfPayment',
            jsonPath: 'paymentType',
            label: 'collection.create.modeOfPayment',
            pattern: '',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            url: '',
            requiredErrMsg: '',
            patternErrMsg: '',
            defaultValue: [
              {
                key: 'Cash',
                value: 'Cash',
              },
              {
                key: 'Cheque',
                value: 'Cheque',
              },
              {
                key: 'DD',
                value: 'DD',
              },
              {
                key: 'Online',
                value: 'Online',
              },
              // {
              //   "key": "4",
              //   "value": "Credit/Debit Card"
              // },
              // {
              //   "key": "5",
              //   "value": "Direct Bank"
              // },
              // {
              //   "key": "6",
              //   "value": "SBI MOPS Bank Callan"
              // }
            ],
          },
        ],
      },
    ],
    result: {
      header: [
        { label: 'collection.create.transactionId' },
        { label: 'collection.create.receiptNumber' },
        { label: 'collection.create.manualReceiptNumber' },
        { label: 'collection.search.receiptDate', isDate: true },
        { label: 'collection.create.serviceType' },
        { label: 'collection.search.billNumber' },
        { label: 'collection.search.billDescription' },
        { label: 'collection.search.paidBy' },
        { label: 'collection.search.amount' },
        { label: 'collection.create.modeOfPayment' },
        { label: 'collection.create.status' },
      ],
      values: [
        'transactionId',
        'Bill[0].billDetails[0].receiptNumber',
        'Bill[0].billDetails[0].manualReceiptNumber',
        'Bill[0].billDetails[0].receiptDate',
        'Bill[0].billDetails[0].businessService',
        'Bill[0].billDetails[0].billNumber',
        'Bill[0].billDetails[0].billDescription',
        'Bill[0].paidBy',
        'Bill[0].billDetails[0].amountPaid',
        'instrument.instrumentType.name',
        'Bill[0].billDetails[0].status',
      ],
      resultPath: 'Receipt',
      rowClickUrlUpdate: '/update/collection/categoryType/{id}',
      rowClickUrlView: '/non-framework/collection/receipt/view/{transactionId}',
    },
  },
  'collection.view': {
    numCols: 12 / 3,
    url: '/collection-services/receipts/_search',
    tenantIdRequired: true,
    useTimestamp: true,
    objectName: '',
    // "groups": [
    // 	{
    // 		"label": "collection.view.categorytype.title",
    // 		"name": "viewCategoryType",
    // 		"fields": [
    // 				{
    // 					"name": "name",
    // 					"jsonPath": "CategoryTypes[0].name",
    // 					"label": "collection.create.categorytype",
    // 					"pattern": "",
    // 					"type": "text",
    // 					"isRequired": true,
    // 					"isDisabled": false,
    // 					"requiredErrMsg": "",
    // 					"patternErrMsg": ""
    // 				},
    // 				{
    // 					"name": "description",
    // 					"jsonPath": "CategoryTypes[0].description",
    // 					"label": "collection.create.description",
    // 					"pattern": "",
    // 					"type": "text",
    // 					"isRequired": false,
    // 					"isDisabled": false,
    // 					"requiredErrMsg": "",
    // 					"patternErrMsg": ""
    // 				},
    // 				{
    // 					"name": "Active",
    // 					"jsonPath": "CategoryTypes[0].active",
    // 					"label": "collection.create.active",
    // 					"pattern": "",
    // 					"type": "checkbox",
    // 					"isRequired": false,
    // 					"isDisabled": false,
    // 					"requiredErrMsg": "",
    // 					"patternErrMsg": ""
    // 				}
    // 		]
    // 	}
    // ],
    result: {
      header: [
        { label: 'collection.create.serviceType' },
        { label: 'collection.search.receiptDate' },
        { label: 'collection.create.consumerCode' },
        { label: 'collection.search.period' },
        { label: 'collection.search.arrears' },
        { label: 'collection.search.current' },
        { label: 'collection.search.interest' },
        { label: 'collection.create.rebate' },
        { label: 'collection.create.advance' },
        { label: 'collection.create.arrearLatePayment' },
        { label: 'collection.create.arrearLatePayment' },
        { label: 'collection.create.currentLatePayment' },
        { label: 'collection.create.checkLatePayment' },
        { label: 'collection.create.total' },
      ],
      values: ['businessService', 'receiptDate', 'consumerCode', 'period', 'billDescription', 'status', 'amountPaid', 'collectionType', 'status'],
      resultPath: 'Receipt[0].Bill[0].billDetails',
      rowClickUrlUpdate: '/update/collection/categoryType/{id}',
      rowClickUrlView: '/view/collection/receipt/{id}',
    },
  },
  // "collection.update": {
  // 	"numCols": 12/3,
  // 	"searchUrl": "/collectionms/masters/categorytype/_search?id={id}",
  // 	"url":"/collectionms/masters/categorytype/{CategoryType.code}/_update",
  // 	"isResponseArray":true,
  // 	"tenantIdRequired": true,
  // 	"useTimestamp": true,
  // 	"objectName": "CategoryType",
  // 	"groups": [
  // 		{
  // 			"label": "collection.update.categorytype.title",
  // 			"name": "createCategoryType",
  // 			"fields": [
  // 					{
  // 						"name": "name",
  // 						"jsonPath": "CategoryType.name",
  // 						"label": "collection.create.categorytype",
  // 						"pattern": "^[\s.]*([^\s.][\s.]*){0,100}",
  // 						"type": "text",
  // 						"isRequired": true,
  // 						"isDisabled": false,
  // 						"requiredErrMsg": "",
  // 						"patternErrMsg": "Length is more than 100"
  // 					},
  // 					{
  // 						"name": "description",
  // 						"jsonPath": "CategoryType.description",
  // 						"label": "collection.create.description",
  // 						"pattern": "^[\s.]*([^\s.][\s.]*){0,250}",
  // 						"type": "text",
  // 						"isRequired": false,
  // 						"isDisabled": false,
  // 						"requiredErrMsg": "",
  // 						"patternErrMsg": "Length is more than 250"
  // 					},
  // 					{
  // 						"name": "Active",
  // 						"jsonPath": "CategoryType.active",
  // 						"label": "collection.create.active",
  // 						"pattern": "",
  // 						"type": "checkbox",
  // 						"isRequired": false,
  // 						"isDisabled": false,
  // 						"requiredErrMsg": "",
  // 						"patternErrMsg": ""
  // 					}
  // 			]
  // 		}
  // 	]
  // }
};

export default dat;
