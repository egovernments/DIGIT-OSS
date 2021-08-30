var _ = require('lodash');

var isRoleCitizen = true;

// Collection Legacy receipt creator
isRoleCitizen = !_.some(JSON.parse(localStorage.getItem('userRequest')).roles, {
  code: 'LEGACY_RECEIPT_CREATOR',
});

var cashOrMops = {
  name: 'FloorDetailsComponent',
  version: 'v1', //Maps to parent version
  level: 1,
  jsonPath: 'collection.modeOfPayment',
  groups: [
    {
      label: 'Cash',
      name: 'cash',
      multiple: false, //If true, its an array
      children: [],
      fields: [
        {
          name: 'paidBy',
          jsonPath: 'collection.modeOfPayment.paidBy',
          label: 'Paid By',
          pattern: '',
          type: 'text',
          isRequired: true,
          isDisabled: false,
          requiredErrMsg: '', //Remove required messages
          patternErrMsg: '',
        },
      ],
    },
  ],
};

var chequeOrDD = {
  name: 'chequeOrDD',
  version: 'v1', //Maps to parent version
  level: 1,
  jsonPath: 'collection.modeOfPayment',
  groups: [
    {
      label: 'Cheque Or DD',
      name: 'chequeOrDD',
      multiple: false, //If true, its an array
      children: [],
      hide: false,
      fields: [
        {
          name: 'chequeOrDDNumber',
          jsonPath: 'Receipt[0].instrument.transactionNumber',
          label: 'Cheque/DD Number',
          pattern: '^[0-9]{6}$',
          type: 'text',
          isRequired: true,
          isDisabled: false,
          requiredErrMsg: '',
          patternErrMsg: 'Cheque/DD number should be 6 digit numeric number',
        },
        {
          name: 'chequeOrDDDate',
          jsonPath: 'Receipt[0].instrument.transactionDateInput',
          label: 'Cheque/DD Date',
          pattern: '/^([0-9]{2})/([0-9]{2})/([0-9]{4})$/',
          type: 'datePicker',
          isRequired: true,
          isDisabled: false,
          requiredErrMsg: '',
          patternErrMsg: 'Cheque/DD date should accept up-to previous 90 days or current date',
        },
        {
          name: 'chequeOrDDBankName',
          jsonPath: 'Receipt[0].instrument.bank.id',
          label: 'Cheque/DD Bank Name',
          pattern: '',
          type: 'autoCompelete',
          isRequired: true,
          isDisabled: false,
          requiredErrMsg: '',
          patternErrMsg: '',
          url: 'egf-masters/banks/_search?|$..id|$..name',
        },
        {
          name: 'chequeOrDDBranchName',
          jsonPath: 'Receipt[0].instrument.branchName',
          label: 'Cheque/DD Branch Name',
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
};

// var creditOrDebitCard={
//   "name": "FloorDetailsComponent",
//   "version": "v1", //Maps to parent version
//   "level": 1,
//   "jsonPath": "connection.floors",
//   "groups": [{
//     "label": "wc.create.groups.floorDetails.title",
//     "name": "FloorDetails",
//     "multiple": false, //If true, its an array
//     "children": [],
//     "fields": [{
//         "name": "FloorNo",
//         "jsonPath": "connection.floors[0].floorNo",
//         "label": "wc.create.groups.floorDetails.floorNo",
//         "pattern": "",
//         "type": "number",
//         "isRequired": true,
//         "isDisabled": false,
//         "requiredErrMsg": "", //Remove required messages
//         "patternErrMsg": ""
//       },
//       {
//         "name": "FloorName",
//         "jsonPath": "connection.floors[0].floorName",
//         "label": "wc.create.groups.floorDetails.floorName",
//         "pattern": "",
//         "type": "text",
//         "isRequired": false,
//         "isDisabled": false,
//         "requiredErrMsg": "", //Remove required messages
//         "patternErrMsg": ""
//       }
//     ]
//   }]
// }

// var directBank={
//   "name": "FloorDetailsComponent",
//   "version": "v1", //Maps to parent version
//   "level": 1,
//   "jsonPath": "connection.floors",
//   "groups": [{
//     "label": "wc.create.groups.floorDetails.title",
//     "name": "FloorDetails",
//     "multiple": false, //If true, its an array
//     "children": [],
//     "fields": [{
//         "name": "FloorNo",
//         "jsonPath": "connection.floors[0].floorNo",
//         "label": "wc.create.groups.floorDetails.floorNo",
//         "pattern": "",
//         "type": "number",
//         "isRequired": true,
//         "isDisabled": false,
//         "requiredErrMsg": "", //Remove required messages
//         "patternErrMsg": ""
//       },
//       {
//         "name": "FloorName",
//         "jsonPath": "connection.floors[0].floorName",
//         "label": "wc.create.groups.floorDetails.floorName",
//         "pattern": "",
//         "type": "text",
//         "isRequired": false,
//         "isDisabled": false,
//         "requiredErrMsg": "", //Remove required messages
//         "patternErrMsg": ""
//       }
//     ]
//   }]
// }

var dat = {
  'playground.create': {
    numCols: 3,
    url: '/billing-service/bill/_generate',
    tenantIdRequired: true,
    objectName: 'Collection',
    useTimestamp: true,
    groups: [
      {
        label: 'Pay tax',
        name: 'createDocumentType',
        fields: [
          {
            name: 'mobile',
            jsonPath: 'mobileNumber',
            label: 'Mobile',
            pattern: '^[0-9]{10,10}$',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: 'Mobile Number must be of 10 digits',
          },
          {
            name: 'email',
            jsonPath: 'email',
            label: 'Email',
            pattern: '^[a-zA-Z0-9_.]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: 'Enter Valid EmailID',
          },
          {
            name: 'businessService',
            jsonPath: 'businessService',
            label: 'Billing service name',
            pattern: '',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            url: '/egov-common-masters/businessDetails/_search?tenantId=default|$..code|$..name',
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'consumerCode',
            jsonPath: 'consumerCode',
            label: 'Consumer Code',
            pattern: '^.{0,30}$',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: 'Enter valid Consumer Code',
          },
        ],
      },
    ],
    result: {
      header: [
        {
          name: 'businessService',
          jsonPath: 'businessService',
          label: 'Billing Service Name',
          pattern: '',
          type: 'label',
          isRequired: true,
          isDisabled: false,
          requiredErrMsg: '',
          patternErrMsg: '',
          url: 'egov-common-masters/businessDetails/_search?|$..code|$..name',
          isLabel: false,
        },
        {
          name: 'consumerCode',
          jsonPath: 'consumerCode',
          label: 'Consumer code',
          pattern: '',
          type: 'label',
          isRequired: true,
          isDisabled: false,
          requiredErrMsg: '',
          patternErrMsg: '',
          isLabel: false,
          hyperLink: '',
        },
        {
          name: 'totalAmount',
          jsonPath: 'totalAmount',
          label: 'Amount Due (Rs)',
          pattern: '',
          type: 'label',
          isRequired: true,
          isDisabled: false,
          requiredErrMsg: '',
          patternErrMsg: '',
          isLabel: false,
          textAlign: 'right',
        },
        {
          name: 'minimumAmount',
          jsonPath: 'minimumAmount',
          label: 'Minimum amount payable (Rs)',
          pattern: '',
          type: 'label',
          isRequired: true,
          isDisabled: false,
          requiredErrMsg: '',
          patternErrMsg: '',
          isLabel: false,
          textAlign: 'right',
        },
        {
          name: 'amountPaid',
          jsonPath: 'amountPaid',
          label: 'Amount paid (Rs)',
          pattern: '^\\d+(\\.\\d+)?$',
          type: 'text',
          isRequired: true,
          isDisabled: false,
          requiredErrMsg: 'Amount paid should be above minimum amount',
          patternErrMsg: '',
          isLabel: false,
          textAlign: 'right',
        },
      ],
      // "values": ["businessService", "consumerCode", "totalAmount","minimumAmount","bill"],
      resultPath: 'Bill[0].billDetails',
      tableResultPath: 'Receipt[0].Bill[0].billDetails',

      // "rowClickUrlUpdate": "/update/wc/pipeSize/{id}",
      // "rowClickUrlView": "/view/wc/pipeSize/{id}"
    },
    transaction: [
      {
        label: 'Payment',
        name: 'paymentMode',
        children: [chequeOrDD],
        fields: [
          // {
          // 	"name": "totalAmountPaid",
          // 	"jsonPath": "Receipt[0].instrument.amount",
          // 	"label": "Total Amount Paid",
          // 	"pattern": "",
          // 	"type": "label",
          // 	"isRequired": false,
          // 	"isDisabled": false,
          // 	"isHidden": false,
          // 	"defaultValue": "",
          // 	"requiredErrMsg": "",
          // 	"patternErrMsg": ""
          // },
          {
            name: 'modeOfPayment',
            jsonPath: 'Receipt[0].instrument.instrumentType.name',
            label: 'Mode Of Payment',
            pattern: '',
            type: 'radio',
            isRequired: true,
            isDisabled: false,
            url: '',
            requiredErrMsg: '',
            patternErrMsg: '',
            values: [
              {
                label: 'Cash',
                value: 'Cash',
              },
              {
                label: 'Cheque',
                value: 'Cheque',
              },
              {
                label: 'DD',
                value: 'DD',
              },
            ],
            defaultValue: 'Cash',
          },
          {
            name: 'paidBy',
            jsonPath: 'Receipt[0].Bill[0].paidBy',
            label: 'Paid By',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '', //Remove required messages
            patternErrMsg: '',
          },
          {
            name: 'manualReceiptNumber',
            jsonPath: 'Receipt[0].Bill[0].billDetails[0].manualReceiptNumber',
            label: 'Manual receipt number',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '', //Remove required messages
            patternErrMsg: '',
            isHidden: isRoleCitizen,
          },
          {
            name: 'manualReceiptDate',
            jsonPath: 'Receipt[0].Bill[0].billDetails[0].receiptDate',
            label: 'Manual receipt date',
            pattern: '/^([0-9]{2})/([0-9]{2})/([0-9]{4})$/',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '', //Remove required messages
            patternErrMsg: '',
            isHidden: isRoleCitizen,
          },
        ],
      },
    ],
  },
};

export default dat;
