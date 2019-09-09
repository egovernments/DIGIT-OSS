var dat = {
  'swm.search' : {
     numCols: 4,
      useTimestamp: true,
      objectName: 'vendorPaymentDetails',
      url: '/swm-services/vendorpaymentdetails/_search',
      title:'swm.search.page.title.vendorpaymentdetails',
      groups: [
        {
          name:'vendorPaymentSearch',
          label: 'swm.vendorpayment.search.vendorPaymentSearch',
          fields: [
            {
              name: 'vendorName',
              jsonPath: 'vendorNo',
              label: 'swm.vendorpayment.create.vendorName',
              type: 'singleValueList',
              isRequired: false,
              isDisabled: false,
              patternErrorMsg: '',
              defaultValue: '',
              url: 'swm-services/vendors/_search?|$.vendors.*.vendorNo|$.vendors.*.name',
              depedants: [
                {
                  jsonPath: 'contractNo',
                  type: 'dropDown',
                  pattern:
                    "swm-services/vendorcontracts/_search?&vendorNo={vendorNo}|$.vendorContracts.*.contractNo|$.vendorContracts.*.contractNo",
                }
              ]
            },
            {
              name: ' contractno',
              jsonPath: 'contractNo',
              label: 'swm.vendorpayment.create.contractno',
              pattern: '',
              type: 'singleValueList',
              isRequired: false,
              isDisabled: false,
              defaultValue: '',
              depedants: [
                {
                  jsonPath: 'paymentNo',
                  type: 'dropDown',
                  pattern:
                    "swm-services/vendorpaymentdetails/_search?&contractNo={contractNo}|$.vendorPaymentDetails.*.paymentNo|$.vendorPaymentDetails.*.invoiceNo",
                }
              ],
            },
            {
              name: 'invoiceno',
              jsonPath: 'paymentNo',
              label: 'swm.vendorpayment.create.invoiceNo',
              pattern: '',
              type: 'singleValueList',
              isRequired: false,
              isDisabled: false,
              defaultValue: '',
              patternErrorMsg: '',
            },
            {
              name: 'invoicefromdate',
              jsonPath: 'invoiceFromDate',
              label: 'swm.vendorpayment.create.invoiveFromDate',
              pattern: '',
              type: 'datePicker',
              isRequired: false,
              isDisabled: false,
              defaultValue: '',
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'invoicetodate',
              jsonPath: 'invoiceToDate',
              label: 'swm.vendorpayment.create.invoiceToDate',
              pattern: '',
              type: 'datePicker',
              isRequired: false,
              isDisabled: false,
              defaultValue: '',
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'fromAmt',
              jsonPath: 'fromAmount',
              label: 'swm.vendorpayment.create.fromAmt',
              pattern: '',
              type: 'text',
              isRequired: false,
              isDisabled: false,
              defaultValue: '',
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'toAmt',
              jsonPath: 'toAmount',
              label: 'swm.vendorpayment.create.toAmt',
              pattern: '',
              type: 'text',
              isRequired: false,
              isDisabled: false,
              defaultValue: '',
              patternErrorMsg: '',
              url: '',
            }
          ]
        }
      ],
      result: {
        header: [
          {
            label: 'swm.vendorpayment.create.vendorName',
          },
          {
            label: 'swm.vendorpayment.create.contractno',
          },
          {
            label: 'swm.vendorpayment.create.invoiceNo',
          },
          {
            label: 'swm.vendorpayment.create.invoiceDate',
            isDate:true
          },
          {
            label:  'swm.vendorpayment.create.invoiceAmt',
          }
        ],
        values: [
          'vendorContract.vendor.name',
          'vendorContract.contractNo',
          'invoiceNo',
          'invoiceDate',
          'vendorInvoiceAmount',
        ],
        resultPath: 'vendorPaymentDetails',
        rowClickUrlUpdate: '/update/swm/vendorpaymentdetails/{paymentNo}',
        rowClickUrlView: '/view/swm/vendorpaymentdetails/{paymentNo}',
      }
  },
  'swm.create': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'vendorPaymentDetails',
    idJsonPath: 'vendorPaymentDetails[0].paymentNo',
    title: 'swm.vendorpayment.create.title',
    groups: [
      {
        name: 'vendorPayment',
        label: '',
        fields: [
          {
            name: 'vendorName',
            jsonPath: 'vendorNo',
            label: 'swm.vendorpayment.create.vendorName',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: 'swm-services/vendors/_search?|$.vendors.*.vendorNo|$.vendors.*.name',
            depedants: [
              {
                jsonPath: 'vendorPaymentDetails[0].vendorContract.contractNo',
                type: 'dropDown',
                pattern:
                  "swm-services/vendorcontracts/_search?&vendorNo={vendorNo}|$.vendorContracts.*.contractNo|$.vendorContracts.*.contractNo",
              }
            ],
          },
          {
            name: 'contractno',
            jsonPath: 'vendorPaymentDetails[0].vendorContract.contractNo',
            label: 'swm.vendorpayment.create.contractno',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            depedants: [
              {
                jsonPath: 'vendorPaymentDetails[0].vendorContract.contractNo',
                type: 'autoFill',
                pattern:
                  "swm-services/vendorcontracts/_search?&contractNo={vendorPaymentDetails[0].vendorContract.contractNo}",
                  autoFillFields: {
                  'vendorPaymentDetails[0].approvalAmmount':'vendorContracts[0].paymentAmount',
                  }
                }
            ],
          },
          {
            name: 'approvalAmmount',
            jsonPath: 'vendorPaymentDetails[0].approvalAmmount',
            label: 'swm.vendorpayment.create.approvalAmmount',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
        ],
      },
      {
        name: 'invoiceDetails',
        label: 'swm.vendorpayment.create.group.title.invoiceDetails',
        fields: [
          {
            name: 'invoiceNo',
            jsonPath: 'vendorPaymentDetails[0].invoiceNo',
            label: 'swm.vendorpayment.create.invoiceNo',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url:'',
          },
          {
            name: 'invoiceDate',
            jsonPath: 'vendorPaymentDetails[0].invoiceDate',
            label: 'swm.vendorpayment.create.invoiceDate',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url:'',
          },
          {
            name: 'invoiceAmt',
            jsonPath: 'vendorPaymentDetails[0].vendorInvoiceAmount',
            label: 'swm.vendorpayment.create.invoiceAmt',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url:'',
          },
          {
            name: 'fromDate',
            jsonPath: 'vendorPaymentDetails[0].fromDate',
            label: 'swm.vendorpayment.create.serviceFromDate',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url:'',
          },
          {
            name: 'toDate',
            jsonPath: 'vendorPaymentDetails[0].toDate',
            label: 'swm.vendorpayment.create.serviceToDate',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url:'',
          },
        ],
      },
      {
        name: 'documentsUpload',
        label: 'swm.vendorpayment.create.group.title.documentsUpload',
        fields: [
          {
            name: 'UploadDocument',
            jsonPath: 'vendorPaymentDetails[0].documents',
            label: 'legal.create.sectionApplied',
            type: 'fileTable',
            isRequired: false,
            isDisabled: false,
            patternErrMsg: '',
            fileList: {
              name: 'name',
              id: 'fileStoreId',
            },
            fileCount: 3
          }
        ]
      }
    ],
    url: '/swm-services/vendorpaymentdetails/_create',
    tenantIdRequired: true
  },
  'swm.update': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'vendorPaymentDetails',
    idJsonPath: 'vendorPaymentDetails[0].paymentNo',
    title: 'swm.vendorpayment.create.title',
    groups: [
      {
        name: 'vendorPayment',
        label: '',
        fields: [
          {
            name: 'vendorName',
            jsonPath: 'vendorPaymentDetails[0].vendorContract.vendor.vendorNo',
            label: 'swm.vendorpayment.create.vendorName',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: 'swm-services/vendors/_search?|$.vendors.*.vendorNo|$.vendors.*.name',
            depedants: [
              {
                jsonPath: 'vendorPaymentDetails[0].vendorContract.contractNo',
                type: 'dropDown',
                pattern:
                  "swm-services/vendorcontracts/_search?&vendorNo={vendorPaymentDetails[0].vendorContract.vendor.vendorNo}|$.vendorContracts.*.contractNo|$.vendorContracts.*.contractNo",
              }
            ],
          },
          {
            name: 'contractno',
            jsonPath: 'vendorPaymentDetails[0].vendorContract.contractNo',
            label: 'swm.vendorpayment.create.contractno',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            depedants: [
              {
                jsonPath: 'vendorPaymentDetails[0].vendorContract.contractNo',
                type: 'autoFill',
                pattern:
                  "swm-services/vendorcontracts/_search?&contractNo={vendorPaymentDetails[0].vendorContract.contractNo}",
                  autoFillFields: {
                    'vendorPaymentDetails[0].vendorContract.paymentAmount':'vendorContracts[0].paymentAmount',
                  }
                }
            ],
          },
          {
            name: 'approvalAmmount',
            jsonPath: 'vendorPaymentDetails[0].vendorContract.paymentAmount',
            label: 'swm.vendorpayment.create.approvalAmmount',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
        ],
      },
      {
        name: 'invoiceDetails',
        label: 'swm.vendorpayment.create.group.title.invoiceDetails',
        fields: [
          {
            name: 'invoiceNo',
            jsonPath: 'vendorPaymentDetails[0].invoiceNo',
            label: 'swm.vendorpayment.create.invoiceNo',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url:'',
          },
          {
            name: 'invoiceDate',
            jsonPath: 'vendorPaymentDetails[0].invoiceDate',
            label: 'swm.vendorpayment.create.invoiceDate',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url:'',
          },
          {
            name: 'invoiceAmt',
            jsonPath: 'vendorPaymentDetails[0].vendorInvoiceAmount',
            label: 'swm.vendorpayment.create.invoiceAmt',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url:'',
          },
           {
            name: 'fromDate',
            jsonPath: 'vendorPaymentDetails[0].fromDate',
            label: 'swm.vendorpayment.create.serviceFromDate',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url:'',
          },
           {
            name: 'toDate',
            jsonPath: 'vendorPaymentDetails[0].toDate',
            label: 'swm.vendorpayment.create.serviceToDate',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url:'',
          },
        ],
      },
      {
        name: 'documentsUpload',
        label: 'swm.vendorpayment.create.group.title.documentsUpload',
        fields: [
          {
            name: 'UploadDocument',
            jsonPath: 'vendorPaymentDetails[0].documents',
            label: 'legal.create.sectionApplied',
            type: 'fileTable',
            isRequired: false,
            isDisabled: false,
            patternErrMsg: '',
            fileList: {
              name: 'name',
              id: 'fileStoreId',
            },
            fileCount: 3,
          },
        ]
      },
    ],
    url: '/swm-services/vendorpaymentdetails/_update',
    tenantIdRequired: true,
    searchUrl: '/swm-services/vendorpaymentdetails/_search?paymentNo={paymentNo}',
  },
  'swm.view': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'vendorPaymentDetails',
    title: 'swm.vendorpayment.create.title',
    groups: [
      {
        name: 'vendorPayment',
        label: '',
        fields: [
          {
            name: 'vendorName',
            jsonPath: 'vendorPaymentDetails[0].vendorContract.vendor.name',
            label: 'swm.vendorpayment.create.vendorName',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: 'swm-services/vendors/_search?|$.vendors.*.vendorNo|$.vendors.*.name',
          },
          {
            name: 'contractno',
            jsonPath: 'vendorPaymentDetails[0].vendorContract.contractNo',
            label: 'swm.vendorpayment.create.contractno',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'approvalAmmount',
            jsonPath: 'vendorPaymentDetails[0].vendorContract.paymentAmount',
            label: 'swm.vendorpayment.create.approvalAmmount',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
        ],
      },
      {
        name: 'invoiceDetails',
        label: 'swm.vendorpayment.create.group.title.invoiceDetails',
        fields: [
          {
            name: 'invoiceNo',
            jsonPath: 'vendorPaymentDetails[0].invoiceNo',
            label: 'swm.vendorpayment.create.invoiceNo',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url:'',
          },
          {
            name: 'invoiceDate',
            jsonPath: 'vendorPaymentDetails[0].invoiceDate',
            label: 'swm.vendorpayment.create.invoiceDate',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url:'',
          },
          {
            name: 'invoiceAmt',
            jsonPath: 'vendorPaymentDetails[0].vendorInvoiceAmount',
            label: 'swm.vendorpayment.create.invoiceAmt',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url:'',
          },
           {
            name: 'fromDate',
            jsonPath: 'vendorPaymentDetails[0].fromDate',
            label: 'swm.vendorpayment.create.serviceFromDate',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url:'',
          },
           {
            name: 'toDate',
            jsonPath: 'vendorPaymentDetails[0].toDate',
            label: 'swm.vendorpayment.create.serviceToDate',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url:'',
          },
        ],
      },
      {
        name: 'documentsUpload',
        label: 'wc.create.groups.fileDetailsDownload.title',
        fields: [
          {
            name: 'UploadDocument',
            jsonPath: 'vendorPaymentDetails[0].documents',
            label: 'legal.create.sectionApplied',
            type: 'fileTable',
            isRequired: false,
            isDisabled: false,
            patternErrMsg: '',
            fileList: {
              name: 'name',
              id: 'fileStoreId',
            },
            fileCount: 3,
          },
        ]
      },
    ],
    tenantIdRequired: true,
    url: '/swm-services/vendorpaymentdetails/_search?paymentNo={paymentNo}',
  },
};
export default dat;