var dat = {
  'inventory.search': {
    numCols: 4,
    useTimestamp: true,
    objectName: '',
    url: '/inventory-services/openingbalance/_search',
    preApiCalls: [

     {
       url: "/inventory-services/stores/_search",
       jsonPath: "store.code",
       jsExpForDD: {
         key: "$..code",
         value: "$..name",
       }
     },
     ],
    groups: [
      {
        name: 'search',
        label: 'inventory.openingbalance.search.title',
        fields: [
          {
            name: 'financialYear',
            jsonPath: 'financialYear',
            label: 'inventory.financialYear',
            type: 'singleValueList',
            isDisabled: false,
            url: "/egov-mdms-service/v1/_get?tenantId=default&moduleName=egf-master&masterName=FinancialYear|$..finYearRange|$..finYearRange",
            patternErrorMsg: 'inventory.create.field.message.financialYear',
          },
          {
            name: 'store',
            pattern: '',
            label: 'inventory.store.name',
            type: 'autoCompelete',
            jsonPath: 'storeName',
            isKeyValuePair: true,
            isRequired: false,
            isDisabled: false,
            url: 'inventory-services/stores/_search?|$.stores[*].code|$.stores[*].name',
          },
        ],
      },
    ],
    result: {
      header: [
        {
          label: 'inventory.financialYear',
        },
        {
          label: 'inventory.store.name',
        },
        {
          label: 'inventory.mrnNumber',
        },
        {
          label: 'inventory.status',
        },
      ],
      values: ['financialYear',   { jsonPath: 'receivingStore.code', reduxObject: "store.code", isObj: true, cToN: true }, 'mrnNumber', 'mrnStatus'],
      resultPath: 'materialReceipt',
      rowClickUrlUpdate: '/update/inventory/openingbalance/{id}',
      rowClickUrlView: '/view/inventory/openingbalance/{id}',
    },
  },

  'inventory.create': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'materialReceipt',
    title: 'inventory.openingbalance.title',
    groups: [
      {
        name: 'openingBalance',
        label: 'inventory.create.openingBalance.title',
        fields: [
          {
            name: 'financialYear',
            jsonPath: 'materialReceipt[0].financialYear',
            label: 'inventory.financialYear',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            url: "/egov-mdms-service/v1/_get?tenantId=default&moduleName=egf-master&masterName=FinancialYear|$..finYearRange|$..finYearRange",
            patternErrorMsg: '',
          },
          {
            name: 'code',
            jsonPath: 'materialReceipt[0].receivingStore.code',
            label: 'inventory.store.name',
            pattern: '^[a-zA-Z0-9]+$',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: 50,
            minLength: 5,
            patternErrorMsg: 'inventory.create.field.message.code',
            url: 'inventory-services/stores/_search?&active=true|$.stores[*].code|$.stores[*].name',
          },
        ],
      },

      {
        name: 'Opening Balance Details',
        label: 'inventory.openingbalance.opbdetails.title',
        fields: [
          {
            type: 'tableList',
            jsonPath: 'materialReceipt[0].receiptDetails',
            tableList: {
              header: [
                {
                  label: 'inventory.materialName',
                },
                {
                  label: 'inventory.Uom',
                  style: {
                    width: '180px',
                  },
                },
                {
                  label: 'inventory.quantity',
                },
                {
                  label: 'inventory.Rate',
                },
                {
                  label: 'inventory.receiptNumber',
                },
                {
                  label: 'inventory.receiptDate',
               
                },
                {
                  label: 'inventory.lotNumber',
                },
                {
                  label: 'inventory.expiryDate',
                 
                },
              ],
              values: [
                {
                  name: 'material',
                  pattern: '',
                  type: 'autoCompelete',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].material.code',
                  displayJsonPath: 'materialReceipt[0].receiptDetails[0].material.name',
                  isRequired: true,
                  isDisabled: false,
                  url:
                    '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=Material|$.MdmsRes.inventory.Material[*].code|$.MdmsRes.inventory.Material[*].name|$.MdmsRes.inventory.Material[*].baseUom.code',
                  depedants: [
                    {
                      jsonPath: 'materialReceipt[0].receiptDetails[0].uom.code',
                      type: 'textField',
                      valExp:
                        "getValFromDropdownData('materialReceipt[0].receiptDetails[*].material.code', getVal('materialReceipt[0].receiptDetails[*].material.code'), 'others[0]')",
                    },
                    {
                      jsonPath: 'materialReceipt[0].receiptDetails[0].uom.conversionFactor',
                      type: 'textField',
                      valExp:
                        "getValFromDropdownData('materialReceipt[0].receiptDetails[*].uom.code', getVal('materialReceipt[0].receiptDetails[*].uom.code'), 'others[0]')",
                    },
                  ],
                },
                {
                  name: 'uom',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].uom.code',
                  pattern: '',
                  type: 'singleValueList',
                  isRequired: true,
                  isDisabled: true,
                  url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description|$..conversionFactor',
                  depedants: [
                    {
                      jsonPath: 'materialReceipt[0].receiptDetails[0].uom.conversionFactor',
                      type: 'textField',
                      valExp:
                        "getValFromDropdownData('materialReceipt[0].receiptDetails[*].uom.code', getVal('materialReceipt[0].receiptDetails[*].uom.code'), 'others[0]')",
                    },
                  ],
                },

                {
                  name: 'receivedQty',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].userReceivedQty',
                  pattern: '',
                  type: 'number',
                  isRequired: true,
                  isDisabled: false,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
                {
                  name: 'unitRate',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].unitRate',
                  pattern: '',
                  type: 'number',
                  isRequired: true,
                  isDisabled: false,
                  defaultValue: '',
                  maxLength: 100,
                  patternErrorMsg: 'inventory.create.field.message.code',
                },
                {
                  name: 'oldReceiptNumber',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].oldReceiptNumber',
                  pattern: '',
                  type: 'text',
                  isRequired: false,
                  isDisabled: false,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
                {
                  name: 'receivedDate',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].receivedDate',
                  pattern: '',
                  type: 'datePicker',
                  maxDate: 'today',
                  isRequired: false,
                  isDisabled: false,
                  defaultValue: '',
                  patternErrorMsg: '',
                  style:{
                    height:'6px'
                  }
                
                },
                {
                  name: 'lotNo',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].lotNo',
                  pattern: '^[a-zA-Z0-9]+$',
                  type: 'text',
                  isRequired: false,
                  isDisabled: false,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
                {
                  name: 'expiryDate',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].expiryDate',
                  pattern: '',
                  type: 'datePicker',
                  isRequired: false,
                  isDisabled: false,
                  defaultValue: '',
                  patternErrorMsg: '',
                  style: {
                    height: '6px'
                  }
                },
              ],
            },
          },
        ],
      },
    ],
    url: '/inventory-services/openingbalance/_create',
    tenantIdRequired: true,
  },
  'inventory.update': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'materialReceipt',
    title: 'inventory.openingbalance.title',
    groups: [
      {
        name: 'openingBalance',
        label: 'inventory.update.openingbalance.title',
        fields: [
          {
            name: 'financialYear',
            jsonPath: 'materialReceipt[0].financialYear',
            label: 'inventory.financialYear',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            url: "/egov-mdms-service/v1/_get?tenantId=default&moduleName=egf-master&masterName=FinancialYear|$..id|$..finYearRange",
            patternErrorMsg: '',
          },
          {
            name: 'code',
            jsonPath: 'materialReceipt[0].receivingStore.code',
            label: 'inventory.store.name',
            pattern: '^[a-zA-Z0-9]+$',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            defaultValue: '',
            maxLength: 50,
            minLength: 5,
            patternErrorMsg: 'inventory.create.field.message.code',
            url: 'inventory-services/stores/_search?&active=true|$.stores[*].code|$.stores[*].name',
          },
          {
            name: 'mrnNumber',
            label: 'inventory.mrnNumber',
            jsonPath: 'materialReceipt[0].mrnNumber',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            defaultValue: '',
            maxLength: 100,
            patternErrorMsg: 'inventory.create.field.message.code',
          },
        ],
      },

      {
        name: 'Opening Balance Details',
        label: 'inventory.openingbalance.opbdetails.title',
        fields: [
          {
            type: 'tableList',
            jsonPath: 'materialReceipt[0].receiptDetails',
            tableList: {
              header: [
                {
                  label: 'inventory.materialName',
                },

                {
                  label: 'inventory.Uom',
                },
                {
                  label: 'inventory.quantity',
                },
                {
                  label: 'inventory.Rate',
                },
                {
                  label: 'inventory.receiptNumber',
                },
                {
                  label: 'inventory.receiptDate',
                },
                {
                  label: 'inventory.lotNumber',
                },
                {
                  label: 'inventory.expiryDate',
                },
              ],
              values: [
                {
                  name: 'material',
                  pattern: '',
                  type: 'singleValueList',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].material.code',
                  displayJsonPath: 'materialReceipt[0].receiptDetails[0].material.name',
                  isRequired: true,
                  isDisabled: true,
                  url: '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=Material|$.MdmsRes.inventory.Material[*].code|$.MdmsRes.inventory.Material[*].name|$.MdmsRes.inventory.Material[*].baseUom.code',
                  depedants: [
                    {
                      jsonPath: 'materialReceipt[0].receiptDetails[0].uom.code',
                      type: 'textField',
                      valExp:
                        "getValFromDropdownData('materialReceipt[0].receiptDetails[*].material.code', getVal('materialReceipt[0].receiptDetails[*].material.code'), 'others[0]')",
                    },
                    {
                      jsonPath: 'materialReceipt[0].receiptDetails[0].uom.conversionFactor',
                      type: 'textField',
                      valExp:
                        "getValFromDropdownData('materialReceipt[0].receiptDetails[*].uom.code', getVal('materialReceipt[0].receiptDetails[*].uom.code'), 'others[0]')",
                    },
                  ],
                },
                {
                  name: 'uom',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].uom.code',
                  pattern: '',
                  type: 'singleValueList',
                  isRequired: true,
                  isDisabled: true,
                  url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description|$..conversionFactor',
                  depedants: [
                    {
                      jsonPath: 'materialReceipt[0].receiptDetails[0].uom.conversionFactor',
                      type: 'textField',
                      valExp:
                        "getValFromDropdownData('materialReceipt[0].receiptDetails[*].uom.code', getVal('receiptDetails[0].receiptDetails[*].uom.code'), 'others[0]')",
                    },
                  ],
                },

                {
                  name: 'receivedQty',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].userReceivedQty',
                  pattern: '',
                  type: 'number',
                  isRequired: true,
                  isDisabled: false,
                  defaultValue: '0',
                  patternErrorMsg: '',
                },
                {
                  name: 'unitRate',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].unitRate',
                  pattern: '',
                  type: 'number',
                  isRequired: true,
                  isDisabled: false,
                  defaultValue: '0',
                  maxLength: 100,
                  patternErrorMsg: 'inventory.create.field.message.code',
                },
                {
                  name: 'receiptNumber',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].oldReceiptNumber',
                  pattern: '',
                  type: 'text',
                  isRequired: false,
                  isDisabled: true,
                  defaultValue: '0',
                  maxLength: 100,
                  patternErrorMsg: 'inventory.create.field.message.code',
                },
                {
                  name: 'receivedDate',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].receivedDate',
                  pattern: '',
                  type: 'datePicker',
                  maxDate: 'today',
                  isRequired: false,
                  isDisabled: true,
                  defaultValue: '',
                  patternErrorMsg: '',
                  style: {
                    height: '6px'
                  }
                },
                {
                  name: 'lotNo',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].lotNo',
                  pattern: '^[a-zA-Z0-9]+$',
                  type: 'text',
                  isRequired: false,
                  isDisabled: false,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
                {
                  name: 'expiryDate',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].expiryDate',
                  pattern: '',
                  type: 'datePicker',
                  isRequired: false,
                  isDisabled: false,
                  defaultValue: '',
                  patternErrorMsg: '',
                  style: {
                    height: '6px'
                  }
                },
              ],
            },
          },
        ],
      },
    ],
    url: '/inventory-services/openingbalance/_update',
    tenantIdRequired: true,
    searchUrl: '/inventory-services/openingbalance/_search?ids={id}',
  },
  'inventory.view': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'materialReceipt',
    title: 'inventory.openingbalance.title',
    url: '/inventory-services/openingbalance/_search?ids={id}',
    groups: [
      {
        name: 'openingBalance',
        label: 'inventory.openingbalanceview.title',
        fields: [
          {
            name: 'financialYear',
            jsonPath: 'materialReceipt[0].financialYear',
            label: 'inventory.financialYear',
            pattern: '',
            type: 'singleValueList',
            isDisabled: true,
            url: "/egov-mdms-service/v1/_get?tenantId=default&moduleName=egf-master&masterName=FinancialYear|$..finYearRange|$..finYearRange",
            patternErrorMsg: '',
          },
          {
            name: 'code',
            jsonPath: 'materialReceipt[0].receivingStore.code',
            label: 'inventory.store.name',
            pattern: '^[a-zA-Z0-9]+$',
            type: 'singleValueList',
            isDisabled: true,
            defaultValue: '',
            maxLength: 50,
            minLength: 5,
            patternErrorMsg: 'inventory.create.field.message.code',
            url: 'inventory-services/stores/_search?&active=true|$.stores[*].code|$.stores[*].name',
          },
          {
            name: 'mrnNumber',
            label: 'inventory.mrnNumber',
            jsonPath: 'materialReceipt[0].mrnNumber',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            defaultValue: '',
            maxLength: 100,
            patternErrorMsg: 'inventory.create.field.message.code',
          },
        ],
      },

      {
        name: 'Opening Balance Details',
        label: 'inventory.openingbalance.opbdetails.title',
        fields: [
          {
            type: 'tableList',
            jsonPath: 'materialReceipt[0].receiptDetails',
            tableList: {
              actionsNotRequired: true,
              header: [
                {
                  label: 'inventory.materialName',
                },
                {
                  label: 'inventory.Uom',
                },
                {
                  label: 'inventory.quantity',
                },
                {
                  label: 'inventory.Rate',
                },
                {
                  label: 'inventory.receiptNumber',
                },
                {
                  label: 'inventory.receiptDate',
                },
                {
                  label: 'inventory.lotNumber',
                },
                {
                  label: 'inventory.expiryDate',
                },
              ],
              values: [
                {
                  name: 'material',
                  pattern: '',
                  type: 'singleValueList',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].material.code',
                  displayJsonPath: 'materialReceipt[0].receiptDetails[0].material.name',
                  isRequired: false,
                  isDisabled: true,
                  url: '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=Material|$.MdmsRes.inventory.Material[*].code|$.MdmsRes.inventory.Material[*].name|$.MdmsRes.inventory.Material[*].baseUom.code',
                  depedants: [
                    {
                      jsonPath: 'materialReceipt[0].receiptDetails[0].uom.code',
                      type: 'textField',
                      valExp:
                        "getValFromDropdownData('materialReceipt[0].receiptDetails[*].material.code', getVal('materialReceipt[0].receiptDetails[*].material.code'), 'others[0]')",
                    },
                    {
                      jsonPath: 'materialReceipt[0].receiptDetails[0].uom.conversionFactor',
                      type: 'textField',
                      valExp:
                        "getValFromDropdownData('materialReceipt[0].receiptDetails[*].uom.code', getVal('materialReceipt[0].receiptDetails[*].uom.code'), 'others[0]')",
                    },
                  ],
                },
                {
                  name: 'uom',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].uom.code',
                  pattern: '',
                  type: 'singleValueList',
                  isRequired: false,
                  isDisabled: true,
                  url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description|$..conversionFactor',
                  depedants: [
                    {
                      jsonPath: 'materialReceipt[0].receiptDetails[0].uom.conversionFactor',
                      type: 'textField',
                      valExp:
                        "getValFromDropdownData('materialReceipt[0].receiptDetails[*].uom.code', getVal('receiptDetails[0].receiptDetails[*].uom.code'), 'others[0]')",
                    },
                  ],
                },

                {
                  name: 'receivedQty',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].userReceivedQty',
                  pattern: '',
                  type: 'number',
                  isDisabled: true,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
                {
                  name: 'unitRate',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].unitRate',
                  pattern: '',
                  type: 'number',
                  isDisabled: true,
                  defaultValue: '0',
                  maxLength: 100,
                  patternErrorMsg: 'inventory.create.field.message.code',
                },
                {
                  name: 'receiptNumber',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].oldReceiptNumber',
                  pattern: '',
                  type: 'text',
                  isRequired: false,
                  isDisabled: false,
                  defaultValue: '0',
                  maxLength: 100,
                  patternErrorMsg: 'inventory.create.field.message.code',
                },
                {
                  name: 'receivedDate',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].receivedDate',
                  pattern: '',
                  type: 'datePicker',
                  isDisabled: true,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
                {
                  name: 'lotNo',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].lotNo',
                  pattern: '^[a-zA-Z0-9]+$',
                  type: 'text',
                  isDisabled: true,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
                {
                  name: 'expiryDate',
                  jsonPath: 'materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].expiryDate',
                  pattern: '',
                  type: 'datePicker',
                  isDisabled: true,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
              ],
            },
          },
        ],
      },
    ],
  },
};
export default dat;
