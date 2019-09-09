var dat = {
  'legal.search': {
    numCols: 4,
    title: 'advocatepayment.search.document.title',
    useTimestamp: true,
    objectName: 'advocatePayments',
    url: '/lcms-services/legalcase/advocatepayment/_search',
    groups: [
      {
        name: 'search',
        label: '',
        fields: [
          {
            name: 'fromDate',
            jsonPath: 'fromDate',
            label: 'legal.create.fromDate',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: 'advocatepayment.create.field.message.fromDate',
          },
          {
            name: 'toDate',
            jsonPath: 'toDate',
            label: 'legal.create.toDate',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: 'advocatepayment.create.field.message.toDate',
          },
          {
            name: 'advocateName',
            jsonPath: 'advocateName',
            label: 'legal.create.advocateName',
            type: 'singleValueList',
            isKeyOtherPair: 'agencyName',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: 'advocatepayment.create.field.message.advocateName',
            url: '/lcms-services/legalcase/advocate/_search?tenantId=default|$..code|$..name',
          },
        ],
      },
    ],
    result: {
      disableRowClick: true,
      isAction: true,
      actionItems: [
        {
          label: 'Add Resolution',
          url: '/update/legal/advpaymentresolve/',
        },
        {
          label: 'Make Payment',
          url: '/update/legal/advmakepayment/',
        },
      ],
      header: [
        {
          label: 'legal.search.result.actionLabels',
          isChecked: true,
          checkedItem: {
            jsonPath: 'checkedRow',
            label: '',
          },
        },
        {
          label: 'legal.create.code',
        },
        {
          label: 'legal.create.advocateName',
        },
        {
          label: 'advocatepayment.create.demandDate',
          isDate: true,
        },
        {
          label: 'advocatepayment.create.instrumentNumber',
        },
        {
          label: 'advocatepayment.create.InstrumentDate',
          isDate: true,
        },
        {
          label: 'legal.create.modeOfPayment',
        },
        {
          label: 'advocatepayment.create.amountClaimed',
        },
        {
          label: 'advocatepayment.create.amountRecived',
        },
      ],
      values: [
        'code',
        'code',
        'advocate.name',
        'demandDate',
        'instrumentNumber',
        'instrumentDate',
        'modeOfPayment',
        'amountClaimed',
        'amountRecived',
      ],
      resultPath: 'advocatePayments',
      rowClickUrlUpdate: '/update/legal/advpaymentdetails/{code}',
      rowClickUrlView: '/view/legal/advpaymentdetails/{code}',
    },
  },
  'legal.create': {
    numCols: 4,
    title: 'advocatepayment.create.document.title',
    useTimestamp: true,
    objectName: 'advocatePayments',
    groups: [
      {
        name: 'AdvocatePaymentDetails',
        label: '',
        fields: [
          {
            name: 'advocateName',
            jsonPath: 'advocatePayments[0].advocate.code',
            label: 'advocatepayment.create.advocateName',
            type: 'singleValueList',
            isKeyOtherPair: 'agencyName',
            isRequired: false,
            isDisabled: false,
            url: '/lcms-services/legalcase/advocate/_search?tenantId=default|$..code|$..name',
            patternErrorMsg: '',
            depedants: [
              {
                jsonPath: 'advocatePayments[0].advocate.pan',
                type: 'autoFill',
                pattern: '/lcms-services/legalcase/advocate/_search?tenantId=default&code={advocatePayments[0].advocate.code}|$..pan|$..pan',
                autoFillFields: {
                  'advocatePayments[0].advocate.pan': 'advocates[0].pan',
                },
              },
              {
                jsonPath: 'advocatePayments[0].advocate.bankName',
                type: 'autoFill',
                pattern:
                  '/lcms-services/legalcase/advocate/_search?tenantId=default&code={advocatePayments[0].advocate.code}|$..bankName|$..bankName',
                autoFillFields: {
                  'advocatePayments[0].advocate.bankName': 'advocates[0].bankName',
                },
              },
              {
                jsonPath: 'advocatePayments[0].advocate.bankBranch',
                type: 'autoFill',
                pattern:
                  '/lcms-services/legalcase/advocate/_search?tenantId=default&code={advocatePayments[0].advocate.code}|$..bankBranch|$..bankBranch',
                autoFillFields: {
                  'advocatePayments[0].advocate.bankBranch': 'advocates[0].bankBranch',
                },
              },
              {
                jsonPath: 'advocatePayments[0].advocate.bankAccountNo',
                type: 'autoFill',
                pattern:
                  '/lcms-services/legalcase/advocate/_search?tenantId=default&code={advocatePayments[0].advocate.code}|$..bankAccountNo|$..bankAccountNo',
                autoFillFields: {
                  'advocatePayments[0].advocate.bankAccountNo': 'advocates[0].bankAccountNo',
                },
              },
            ],
          },
          {
            name: 'demandDate',
            jsonPath: 'advocatePayments[0].demandDate',
            label: 'advocatepayment.create.demandDate',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'bankName',
            jsonPath: 'advocatePayments[0].advocate.bankName',
            label: 'advocatepayment.create.bankName',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'panNo',
            jsonPath: 'advocatePayments[0].advocate.pan',
            label: 'advocatepayment.create.panNo',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: 'The PAN structure is as follows: AAAPL1234C .',
          },
          {
            name: 'bankBranch',
            jsonPath: 'advocatePayments[0].advocate.bankBranch',
            label: 'advocatepayment.create.bankBranch',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'amountClaimed',
            jsonPath: 'advocatePayments[0].amountClaimed',
            label: 'advocatepayment.create.amountClaimed',
            type: 'number',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'bankAccountNo',
            jsonPath: 'advocatePayments[0].advocate.bankAccountNo',
            label: 'advocatepayment.create.bankAccountNo',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'amountRecived',
            jsonPath: 'advocatePayments[0].amountRecived',
            label: 'advocatepayment.create.amountRecived',
            type: 'number',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          // {
          //   name: "voucherNumber",
          //   jsonPath: "advocatePayments[0].voucherNo",
          //   label: "advocatepayment.create.voucherNumber",
          //   type: "number",
          //   isRequired: false,
          //   isDisabled: false,
          //   patternErrorMsg: ""
          // },{
          //     name: "modeOfPayment",
          //     jsonPath: "advocatePayments[0].modeOfPayment",
          //     label: "legal.create.modeOfPayment",
          //     type: "singleValueList",
          //     isRequired: true,
          //     isDisabled: false,
          //     patternErrorMsg: "",
          //     // url: "/egov-mdms-service/v1/_get?&moduleName=lcms&masterName=stamp|$..code|$..name"
          //     defaultValue: [{
          //     "key": "Cash",
          //     "value": "Cash"
          //   }, {
          //     "key": "Cheque",
          //     "value": "Cheque"
          //   }, {
          //     "key": "DD",
          //     "value": "DD"
          //   }]
          //   },
          //   {
          //   name: "instrumentNumber",
          //   jsonPath: "advocatePayments[0].instrumentNumber",
          //   label: "advocatepayment.create.instrumentNumber",
          //   type: "datePicker",
          //   isRequired: false,
          //   isDisabled: false,
          //   patternErrorMsg: ""
          // },
          //   {
          //   name: "InstrumentDate",
          //   jsonPath: "advocatePayments[0].instrumentDate",
          //   label: "advocatepayment.create.InstrumentDate",
          //   type: "datePicker",
          //   isRequired: false,
          //   isDisabled: false,
          //   patternErrorMsg: ""
          // },
          {
            name: 'totalAmount',
            pattern: '',
            label: 'legal.create.amount',
            type: 'number',
            hide: true,
            jsonPath: '',
            isRequired: false,
            isDisabled: false,
          },
          {
            name: 'invoiceDocument',
            jsonPath: 'advocatePayments[0].invoiceDoucment.fileStoreId',
            label: 'legal.create.uploadInvoice',
            type: 'singleFileUpload',
            pattern: '',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            type: 'tableList',
            jsonPath: 'advocatePayments[0].advocateCharges',
            tableList: {
              header: [
                {
                  label: 'legal.create.charge',
                },
                {
                  label: 'legal.create.case',
                },
                {
                  label: 'legal.create.amount',
                },
              ],
              values: [
                {
                  name: 'charge',
                  pattern: '',
                  type: 'singleValueList',
                  jsonPath: 'advocatePayments[0].advocateCharges[0].charge',
                  isRequired: true,
                  isDisabled: false,
                  defaultValue: [
                    {
                      key: 'CF',
                      value: 'Consultation Fee',
                    },
                    {
                      key: 'SF',
                      value: 'Sitting Fee',
                    },
                    {
                      key: 'HF',
                      value: 'Hearing Fee',
                    },
                  ],
                },
                {
                  name: 'case',
                  pattern: '',
                  type: 'singleValueList',
                  jsonPath: 'advocatePayments[0].advocateCharges[0].caseDetails.summonReferenceNo',
                  isRequired: false,
                  isDisabled: false,
                  url: '/lcms-services/legalcase/caseno/_search?|$..summonReferenceNo|$..caseNo',
                  //  "/lcms-services/legalcase/case/_search?|$..summon.summonReferenceNo|$..summon.caseNo"
                },
                {
                  name: 'amount',
                  pattern: '',
                  type: 'number',
                  jsonPath: 'advocatePayments[0].advocateCharges[0].amount',
                  isRequired: false,
                  isDisabled: false,
                  dependency: 'advocatePayments[0].amountClaimed',
                },
              ],
            },
          },
          {
            name: 'advocateLabel',
            jsonPath: '',
            label: 'legal.create.paymentNote',
            type: 'label',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            defaultValue: ' ',
          },
        ],
      },
    ],
    url: '/lcms-services/legalcase/advocatepayment/_create',
    tenantIdRequired: true,
  },
  'legal.update': {
    numCols: 4,
    title: 'advocatepayment.update.document.title',
    useTimestamp: true,
    objectName: 'advocatePayments',
    searchUrl: '/lcms-services/legalcase/advocatepayment/_search',
    groups: [
      {
        name: 'AdvocatePaymentDetails',
        label: 'advocatepayment.create.group.title.AdvocatePaymentDetails',
        fields: [
          {
            name: 'advocateName',
            jsonPath: 'advocatePayments[0].advocate.name',
            label: 'advocatepayment.create.advocateName',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            url: '/lcms-services/legalcase/advocate/_search?tenantId=default|$..code|$..name',
            patternErrorMsg: '',
          },
          {
            name: 'demandDate',
            jsonPath: 'advocatePayments[0].demandDate',
            label: 'advocatepayment.create.demandDate',
            type: 'datePicker',
            isRequired: true,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'bankName',
            jsonPath: 'advocatePayments[0].advocate.bankName',
            label: 'advocatepayment.create.bankName',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'panNo',
            jsonPath: 'advocatePayments[0].advocate.pan',
            label: 'advocatepayment.create.panNo',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: 'The PAN structure is as follows: AAAPL1234C .',
          },
          {
            name: 'bankBranch',
            jsonPath: 'advocatePayments[0].advocate.bankBranch',
            label: 'advocatepayment.create.bankBranch',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'amountClaimed',
            jsonPath: 'advocatePayments[0].amountClaimed',
            label: 'advocatepayment.create.amountClaimed',
            type: 'number',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'bankAccountNo',
            jsonPath: 'advocatePayments[0].advocate.bankAccountNo',
            label: 'advocatepayment.create.bankAccountNo',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'amountRecived',
            jsonPath: 'advocatePayments[0].amountRecived',
            label: 'advocatepayment.create.amountRecived',
            type: 'number',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          // {
          //   name: "voucherNumber",
          //   jsonPath: "advocatePayments[0].voucherNo",
          //   label: "advocatepayment.create.voucherNumber",
          //   type: "number",
          //   isRequired: false,
          //   isDisabled: false,
          //   patternErrorMsg: ""
          // },{
          //     name: "modeOfPayment",
          //     jsonPath: "advocatePayments[0].modeOfPayment",
          //     label: "legal.create.modeOfPayment",
          //     type: "singleValueList",
          //     isRequired: true,
          //     isDisabled: false,
          //     patternErrorMsg: "",
          //     // url: "/egov-mdms-service/v1/_get?&moduleName=lcms&masterName=stamp|$..code|$..name"
          //     defaultValue: [{
          //     "key": "Cash",
          //     "value": "Cash"
          //   }, {
          //     "key": "Cheque",
          //     "value": "Cheque"
          //   }, {
          //     "key": "DD",
          //     "value": "DD"
          //   }]
          //   },
          //   {
          //   name: "instrumentNumber",
          //   jsonPath: "advocatePayments[0].instrumentNumber",
          //   label: "advocatepayment.create.instrumentNumber",
          //   type: "datePicker",
          //   isRequired: false,
          //   isDisabled: false,
          //   patternErrorMsg: ""
          // },
          //   {
          //   name: "InstrumentDate",
          //   jsonPath: "advocatePayments[0].instrumentDate",
          //   label: "advocatepayment.create.InstrumentDate",
          //   type: "datePicker",
          //   isRequired: false,
          //   isDisabled: false,
          //   patternErrorMsg: ""
          // },
          {
            name: 'totalAmount',
            pattern: '',
            label: 'legal.create.amount',
            type: 'number',
            hide: true,
            jsonPath: '',
            isRequired: false,
            isDisabled: true,
          },
          {
            name: 'invoiceDocument',
            jsonPath: 'advocatePayments[0].invoiceDoucment.fileStoreId',
            label: 'legal.create.downloadInvoice',
            type: 'singleFileUpload',
            pattern: '',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            readonly: true,
          },
          {
            type: 'tableList',
            jsonPath: 'advocatePayments[0].advocateCharges',
            tableList: {
              header: [
                {
                  label: 'legal.create.charge',
                },
                {
                  label: 'legal.create.case',
                },
                {
                  label: 'legal.create.amount',
                },
              ],
              values: [
                {
                  name: 'charge',
                  pattern: '',
                  type: 'singleValueList',
                  jsonPath: 'advocatePayments[0].advocateCharges[0].charge',
                  isRequired: true,
                  isDisabled: true,
                  defaultValue: [
                    {
                      key: 'CF',
                      value: 'Consultation Fee',
                    },
                    {
                      key: 'SF',
                      value: 'Sitting Fee',
                    },
                    {
                      key: 'HF',
                      value: 'Hearing Fee',
                    },
                  ],
                },
                {
                  name: 'case',
                  pattern: '',
                  type: 'singleValueList',
                  jsonPath: 'advocatePayments[0].advocateCharges[0].caseDetails.summonReferenceNo',
                  isRequired: false,
                  isDisabled: true,
                  url: '/lcms-services/legalcase/caseno/_search?|$..summonReferenceNo|$..caseNo',
                  // "/lcms-services/legalcase/case/_search?|$..summon.summonReferenceNo|$..summon.caseNo"
                },
                {
                  name: 'amount',
                  pattern: '',
                  type: 'number',
                  jsonPath: 'advocatePayments[0].advocateCharges[0].amount',
                  isRequired: false,
                  isDisabled: true,
                },
              ],
            },
          },
          {
            name: 'advocateLabel',
            jsonPath: '',
            label: 'legal.create.paymentNote',
            type: 'label',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            defaultValue: ' ',
          },
        ],
      },
    ],
    url: '/lcms-services/legalcase/advocatepayment/_update',
    tenantIdRequired: true,
  },
};
export default dat;
