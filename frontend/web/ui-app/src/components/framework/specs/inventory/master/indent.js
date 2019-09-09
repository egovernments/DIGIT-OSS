var dat = {
  'inventory.search': {
    numCols: 4,
    useTimestamp: true,
    objectName: '',
    url: '/inventory-services/indents/_search',
    groups: [
      {
        name: 'search',
        label: 'inventory.search.title',
        fields: [
          {
            name: 'indentNumber',
            jsonPath: 'indentNumber',
            label: 'inventory.indent.number',
            type: 'text',
            isDisabled: false,
            patternErrorMsg: 'inventory.create.field.message.indentNumber',
          },

          {
            name: 'indentDate',
            jsonPath: 'indentDate',
            label: 'inventory.indent.date',
            type: 'datePicker',
            isDisabled: false,
            patternErrorMsg: 'inventory.create.field.message.indentDate',
            maxDate: 'today',
            minDate: 'today-365',
          },

          {
            name: 'indentPurpose',
            jsonPath: 'indentPurpose',
            label: 'inventory.indent.purpose',
            type: 'singleValueList',
            isDisabled: false,
            patternErrorMsg: 'inventory.create.field.message.indentPurpose',
            defaultValue: [
              { key: null, value: '-- Please Select --' },
              {
                key: 'Consumption',
                value: 'Consumption',
              },
              {
                key: 'Repairs and Maintenance',
                value: 'Repairs and Maintenance',
              },
              {
                key: 'Capital',
                value: 'Capital',
              },
            ],
          },
          {
            name: 'inventoryType',
            jsonPath: 'inventoryType',
            label: 'inventory.inventory.type',
            pattern: '',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            defaultValue: [
              { key: null, value: '-- Please Select --' },
              {
                key: 'Asset',
                value: 'Asset',
              },
              {
                key: 'Consumable',
                value: 'Consumable',
              },
            ],

            patternErrorMsg: '',
          },
          {
            name: 'issueStore',
            jsonPath: 'issueStore',
            label: 'inventory.indenting.store',
            type: 'singleValueList',
            isDisabled: false,
            patternErrorMsg: 'inventory.create.field.message.issueStore',
            url: 'inventory-services/stores/_search?|$.stores[*].code|$.stores[*].name',
          },
        ],
      },
    ],
    result: {
      header: [
        {
          label: 'inventory.indent.number',
        },
        {
          label: 'inventory.indent.date',
          isDate:true
        },
        {
          label: 'inventory.indenting.store',
        },
        {
          label: 'inventory.indent.purpose',
        },

        {
          label: 'inventory.indent.status',
        },
      ],
      values: ['indentNumber', 'indentDate', 'issueStore.name', 'indentPurpose', 'indentStatus'],

      resultIdKey: 'indentNumber',
      resultPath: 'indents',
      rowClickUrlUpdate: '/update/inventory/indent/{indentNumber}',
      rowClickUrlView: '/view/inventory/indent/{indentNumber}',
      rowClickUrlAdd: '/create/inventory/indent',
    },
  },
  'inventory.create': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'indents',
      preApiCalls:[
      {
        url:"/hr-employee/employees/_search?&id={}&isPrimary=true",
        jsonPath:"indents[0].designation",
        defaultValue: JSON.parse(localStorage.getItem('userRequest')).id,
        dependentUrl:'/hr-masters/designations/_search',
        dependantPath:'Designation',
        dependentKey:'id',
        jsExpForDD:{
          key:"$.Employee[0].assignments[0].designation",
          value:"$.Employee[0].assignments[0].designation",
        }
      }
    ],
    groups: [
      {
        name: 'indent',
        label: 'inventory.create.group.title.indent',
        fields: [
          {
            name: 'name',
            jsonPath: 'indents[0].issueStore.code',
            label: 'inventory.store.name',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: 'inventory.create.field.message.store.name',
            url: 'inventory-services/stores/_search?|$.stores[*].code|$.stores[*].name',
          },
          {
            name: 'indentDate',
            jsonPath: 'indents[0].indentDate',
            label: 'inventory.indent.date',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'indentNumber',
            jsonPath: 'indents[0].indentNumber',
            label: 'inventory.indent.number',
            pattern: '',
            type: 'text',
            isHidden: true,
            isRequired: false,
            isDisabled: true,
            defaultValue: '',
            maxLength: 64,
            patternErrorMsg: '',
          },
          {
            name: 'indentPurpose',
            jsonPath: 'indents[0].indentPurpose',
            label: 'inventory.indent.purpose',
            pattern: '',
            type: 'singleValueList',
            defaultValue: [
              { key: null, value: '-- Please Select --' },
              {
                key: 'Consumption',
                value: 'Consumption',
              },
              {
                key: 'Repairs and Maintenance',
                value: 'Repairs and Maintenance',
              },
              {
                key: 'Capital',
                value: 'Capital',
              },
            ],
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            depedants: [
              {
                jsonPath: 'indents[0].indentDetails[0].asset.code',
                type: 'tableList',
                name: 'asset',
                pattern: 'Repairs and Maintenance'
              },
              {
                jsonPath: 'indents[0].indentDetails[0].projectCode.code',
                type: 'tableList',
                name: 'projectcode',
                pattern: 'Capital'
              }
            ],
          },

          {
            name: 'indentType',
            jsonPath: 'indents[0].indentType',
            label: 'inventory.indent.type',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            isHidden: true,
            defaultValue: 'Indent',
            patternErrorMsg: '',
          },
          {
            name: 'inventoryType',
            jsonPath: 'indents[0].inventoryType',
            label: 'inventory.inventory.type',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: [
              { key: null, value: '-- Please Select --' },
              {
                key: 'Asset',
                value: 'Asset',
              },
              {
                key: 'Consumable',
                value: 'Consumable',
              },
            ],

            patternErrorMsg: '',
          },
          {
            name: 'expectedDeliveryDate',
            jsonPath: 'indents[0].expectedDeliveryDate',
            label: 'inventory.expecteddeliverydate',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'indentStatus',
            jsonPath: 'indents[0].indentStatus',
            label: 'inventory.indent.status',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: 'Created',
            patternErrorMsg: '',
          },
          {
            name: 'narration',
            jsonPath: 'indents[0].narration',
            label: 'inventory.narration',
            pattern: '',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 1000,
            patternErrorMsg: '',
          },

          {
            name: 'materialHandOverTo',
            jsonPath: 'indents[0].materialHandOverTo',
            label: 'inventory.materialhandoverto',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: JSON.parse(localStorage.getItem('userRequest')).name,
            maxLength: 128,
            patternErrorMsg: '',
            /*depedants:[
            {
              jsonPath:'indents[0].designation',
              type: 'autoCompelete',
              pattern:"/hr-employee/employees/_search?tenantId=default&id={localStorage.getItem('id')}&isPrimary=true",
              autoFillFields:{
                'indents[0].designation':'Employee[0].assignments[0].designation',
              },
            },
            ],*/

          },

         /* {
            name: 'name',
            jsonPath: 'indents[0].desig.code',
            label: 'inventory.store.name',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            isHidden: true,
            defaultValue: '',
            patternErrorMsg: 'inventory.create.field.message.store.name',
            url: '/hr-masters/designations/_search?&|$.Designation[*].code|$.Designation[*].name',
          },*/

          {
            name: 'designation',
            jsonPath: 'indents[0].designation',
            label: 'inventory.designation',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
           // url: '/hr-masters/designations/_search?&|$.Designation[*].code|$.Designation[*].name',
          },
        ],
      },

      {
        name: 'Indent Details',
        label: 'inventory.create.group.title.indentdetails',
        fields: [
          {
            type: 'tableList',
            jsonPath: 'indents[0].indentDetails',
            tableList: {
              header: [
                {
                  label: 'Material Name',
                },
                {
                  label: 'Material Descr.',
                },
                {
                  label: 'Uom',
                  style: {
                    width: '180px',
                  },
                },
                {
                  label: 'Asset Code',
                },
                {
                  label: 'Project Code',
                },
                {
                  label: 'Qty Required',
                },
                /* {
                  label: 'Qty Received',
                },*/
              ],
              values: [
                {
                  name: 'material',
                  pattern: '',
                  type: 'autoCompelete',
                  jsonPath: 'indents[0].indentDetails[0].material.code',
                  isRequired: true,
                  isDisabled: false,
                  url:
                    '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=Material|$.MdmsRes.inventory.Material[*].code|$.MdmsRes.inventory.Material[*].name|$.MdmsRes.inventory.Material[*].description|$.MdmsRes.inventory.Material[*].baseUom.uomCategory',
                  depedants: [
                    {
                      jsonPath: 'indents[0].indentDetails[0].material.description',
                      type: 'textField',
                      valExp:
                        "getValFromDropdownData('indents[0].indentDetails[*].material.code', getVal('indents[0].indentDetails[*].material.code'), 'others[0]')",
                    },

                    {
                      jsonPath: 'indents[0].indentDetails[0].material.baseUom.uomCategory',
                      type: 'textField',

                      valExp:
                        "getValFromDropdownData('indents[0].indentDetails[*].material.code', getVal('indents[0].indentDetails[*].material.code'), 'others[1]')",
                    },

                    {
                      jsonPath: 'indents[0].indentDetails[0].uom.code',
                      type: 'dropDown',
                      indexReplace:true,
                      pattern:
                        '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom&filter=+%5B%3F%28%40.uomCategory%3D%3D%27{indents[0].indentDetails[0].material.baseUom.uomCategory}%27%29%5D|$..code|$..description',
                    },
                  ],
                },




                {
                  name: 'materialDescription',
                  jsonPath: 'indents[0].indentDetails[0].material.description',
                  pattern: '',
                  type: 'text',
                  isRequired: false,
                  isDisabled: true,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
                {
                  name: 'uom',
                  jsonPath: 'indents[0].indentDetails[0].uom.code',
                  pattern: '',
                  type: 'singleValueList',
                  isRequired: true,
                  isDisabled: false,
                  url: '',
                },

                {
                  name: 'asset',
                  jsonPath: 'indents[0].indentDetails[0].asset.code',
                  pattern: '',
                  type: 'autoCompelete',
                  isRequired: false,
                  isDisabled: false,
                  defaultValue: '',
                  patternErrorMsg: '',
                  url: '/asset-services-maha/assets/_search?&|$.Assets.*.code|$.Assets.*.name',
                },
                {
                  name: 'projectcode',
                  jsonPath: 'indents[0].indentDetails[0].projectCode.code',
                  pattern: '[a-zA-Z0-9-\\\\]+',
                  type: 'text',
                  isRequired: false,
                  isDisabled: false,
                  defaultValue: '',
                  maxLength: 100,
                  patternErrorMsg: 'inventory.create.field.message.code',
                  // url: '/works-estimate/v1/projectcodes/_search?&|$..code|$..name',
                },
                {
                  name: 'userQuantity ',
                  jsonPath: 'indents[0].indentDetails[0].userQuantity',
                  pattern: '',
                  type: 'number',
                  isRequired: true,
                  isDisabled: false,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
                /*{
                  name: 'recvQuantity',
                  jsonPath: 'indents[0].indentDetails[0].userQuantity',
                  pattern: '',
                  type: 'number',
                  isRequired: true,
                  isDisabled: false,
                  defaultValue: '',
                  patternErrorMsg: '',
                },*/
              ],
            },
          },
        ],
      },
    ],
    url: '/inventory-services/indents/_create',
    tenantIdRequired: true,
  },
  'inventory.view': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'indents',
    groups: [
      {
        name: 'indent',
        label: 'inventory.view.group.title.indent',
        fields: [
          {
            name: 'name',
            jsonPath: 'indents[0].issueStore.code',
            label: 'inventory.store.name',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: 'inventory.create.field.message.store.name',
            url: 'inventory-services/stores/_search?|$.stores[*].code|$.stores[*].name',
          },
          {
            name: 'indentDate',
            jsonPath: 'indents[0].indentDate',
            label: 'inventory.indent.date',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'indentNumber',
            jsonPath: 'indents[0].indentNumber',
            label: 'inventory.indent.number',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            defaultValue: '',
            maxLength: 64,
            patternErrorMsg: '',
          },
          {
            name: 'indentPurpose',
            jsonPath: 'indents[0].indentPurpose',
            label: 'inventory.indent.purpose',
            pattern: '',
            type: 'singleValueList',
            defaultValue: [
              { key: null, value: '-- Please Select --' },
              {
                key: 'Consumption',
                value: 'Consumption',
              },
              {
                key: 'Repairs and Maintenance',
                value: 'Repairs and Maintenance',
              },
              {
                key: 'Capital',
                value: 'Capital',
              },
            ],
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            depedants: [
              {
                jsonPath: 'indents[0].indentDetails[0].asset.code',
                type: 'tableList',
                name: 'asset',
                pattern: 'Repairs and Maintenance'
              },
              {
                jsonPath: 'indents[0].indentDetails[0].projectCode.code',
                type: 'tableList',
                name: 'projectcode',
                pattern: 'Capital'
              }
            ],
          },

          {
            name: 'inventoryType',
            jsonPath: 'indents[0].inventoryType',
            label: 'inventory.inventory.type',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: [
              { key: null, value: '-- Please Select --' },
              {
                key: 'Asset',
                value: 'Asset',
              },
              {
                key: 'Consumable',
                value: 'Consumable',
              },
            ],

            patternErrorMsg: '',
          },
          {
            name: 'expectedDeliveryDate',
            jsonPath: 'indents[0].expectedDeliveryDate',
            label: 'inventory.expecteddeliverydate',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
           {
            name: 'indentStatus',
            jsonPath: 'indents[0].indentStatus',
            label: 'inventory.indent.status',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: 'Created',
            patternErrorMsg: '',
          },
          {
            name: 'narration',
            jsonPath: 'indents[0].narration',
            label: 'inventory.narration',
            pattern: '',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 1000,
            patternErrorMsg: '',
          },

          {
            name: 'materialHandOverTo',
            jsonPath: 'indents[0].materialHandOverTo',
            label: 'inventory.materialhandoverto',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 128,
            patternErrorMsg: '',
          },
          {
            name: 'designation',
            jsonPath: 'indents[0].designation',
            label: 'inventory.designation',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
        ],
      },

      {
        name: 'Indent Details',
        label: 'inventory.create.group.title.indentdetails',
        fields: [
          {
            type: 'tableList',
            jsonPath: 'indents[0].indentDetails',
            tableList: {
              actionsNotRequired: true,
              header: [
                {
                  label: 'Material Name',
                },
                {
                  label: 'Material Descr.',
                },
                {
                  label: 'Uom',
                },
                {
                  label: 'Asset Code',
                },
                {
                  label: 'Project Code',
                },
                {
                  label: 'Qty Required',
                },
                 {
                  label: 'Qty Received',
                },
              ],
              values: [
                {
                  name: 'material',
                  pattern: '',
                  type: 'autoCompelete',
                  jsonPath: 'indents[0].indentDetails[0].material.code',
                  isRequired: true,
                  isDisabled: false,
                  url:
                    '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=Material|$.MdmsRes.inventory.Material[*].code|$.MdmsRes.inventory.Material[*].name|$.MdmsRes.inventory.Material[*].description|$.MdmsRes.inventory.Material[*].baseUom.uomCategory',
                  depedants: [
                    {
                      jsonPath: 'indents[0].indentDetails[0].material.description',
                      type: 'textField',
                      valExp:
                        "getValFromDropdownData('indents[0].indentDetails[*].material.code', getVal('indents[0].indentDetails[*].material.code'), 'others[0]')",
                    },

                    {
                      jsonPath: 'indents[0].indentDetails[0].material.baseUom.uomCategory',
                      type: 'textField',
                      valExp:
                        "getValFromDropdownData('indents[0].indentDetails[*].material.code', getVal('indents[0].indentDetails[*].material.code'), 'others[1]')",
                    },

                    {
                      jsonPath: 'indents[0].indentDetails[0].uom.code',
                      type: 'dropDown',
                      pattern:
                        '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom&filter=+%5B%3F%28%40.uomCategory%3D%3D%27{indents[0].indentDetails[0].material.baseUom.uomCategory}%27%29%5D|$..code|$..description',
                    },
                  ],
                },
                {
                  name: 'materialDescription',
                  jsonPath: 'indents[0].indentDetails[0].material.description',
                  pattern: '',
                  type: 'text',
                  isRequired: false,
                  isDisabled: true,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
                {
                  name: 'materialDescription',
                  jsonPath: 'indents[0].indentDetails[0].material.description',
                  pattern: '',
                  type: 'text',
                  isRequired: false,
                  isDisabled: true,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
                {
                  name: 'uom',
                  jsonPath: 'indents[0].indentDetails[0].uom.code',
                  pattern: '',
                  type: 'singleValueList',
                  isRequired: true,
                  isDisabled: false,
                  url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description',
                },

                {
                  name: 'asset',
                  jsonPath: 'indents[0].indentDetails[0].asset.code',
                  pattern: '',
                  type: 'text',
                  isRequired: false,
                  isDisabled: false,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
                {
                  name: 'projectcode',
                  jsonPath: 'indents[0].indentDetails[0].projectCode.code',
                  pattern: '[a-zA-Z0-9-\\\\]+',
                  type: 'text',
                  isRequired: false,
                  isDisabled: false,
                  defaultValue: '',
                  maxLength: 100,
                  patternErrorMsg: 'inventory.create.field.message.code',
                },
                 {
                  name: 'userQuantity ',
                  jsonPath: 'indents[0].indentDetails[0].userQuantity ',
                  pattern: '',
                  type: 'number',
                  isRequired: true,
                  isDisabled: false,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
                /*{
                  name: 'recvQuantity',
                  jsonPath: 'indents[0].indentDetails[0].userQuantity',
                  pattern: '',
                  type: 'number',
                  isRequired: true,
                  isDisabled: false,
                  defaultValue: '',
                  patternErrorMsg: '',
                },*/
              ],
            },
          },
        ],
      },
    ],
    tenantIdRequired: true,
    url: '/inventory-services/indents/_search?indentNumber={indentNumber}',
  },
  'inventory.update': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'indents',
    groups: [
      {
        name: 'indent',
        label: 'inventory.update.group.title.indent',
        fields: [
          {
            name: 'name',
            jsonPath: 'indents[0].issueStore.code',
            label: 'inventory.store.name',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: 'inventory.create.field.message.store.name',
            url: 'inventory-services/stores/_search?|$.stores[*].code|$.stores[*].name',
          },
          {
            name: 'indentDate',
            jsonPath: 'indents[0].indentDate',
            label: 'inventory.indent.date',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'indentNumber',
            jsonPath: 'indents[0].indentNumber',
            label: 'inventory.indent.number',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            defaultValue: '',
            maxLength: 64,
            patternErrorMsg: '',
          },
          {
            name: 'indentPurpose',
            jsonPath: 'indents[0].indentPurpose',
            label: 'inventory.indent.purpose',
            pattern: '',
            type: 'singleValueList',
            defaultValue: [
              { key: null, value: '-- Please Select --' },
              {
                key: 'Consumption',
                value: 'Consumption',
              },
              {
                key: 'Repairs and Maintenance',
                value: 'Repairs and Maintenance',
              },
              {
                key: 'Capital',
                value: 'Capital',
              },
            ],
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            depedants: [
              {
                jsonPath: 'indents[0].indentDetails[0].asset.code',
                type: 'tableList',
                name: 'asset',
                pattern: 'Repairs and Maintenance'
              },
              {
                jsonPath: 'indents[0].indentDetails[0].projectCode.code',
                type: 'tableList',
                name: 'projectcode',
                pattern: 'Capital'
              }
            ],
          },
       {
            name: 'indentType',
            jsonPath: 'indents[0].indentType',
            label: 'inventory.indent.type',
            pattern: '',
            type: 'text',
            isRequired: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'inventoryType',
            jsonPath: 'indents[0].inventoryType',
            label: 'inventory.inventory.type',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: [
              { key: null, value: '-- Please Select --' },
              {
                key: 'Asset',
                value: 'Asset',
              },
              {
                key: 'Consumable',
                value: 'Consumable',
              },
            ],

            patternErrorMsg: '',
          },
          {
            name: 'expectedDeliveryDate',
            jsonPath: 'indents[0].expectedDeliveryDate',
            label: 'inventory.expecteddeliverydate',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
           {
            name: 'indentStatus',
            jsonPath: 'indents[0].indentStatus',
            label: 'inventory.indent.status',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: 'Created',
            patternErrorMsg: '',
          },
          {
            name: 'narration',
            jsonPath: 'indents[0].narration',
            label: 'inventory.narration',
            pattern: '',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 1000,
            patternErrorMsg: '',
          },

          {
            name: 'materialHandOverTo',
            jsonPath: 'indents[0].materialHandOverTo',
            label: 'inventory.materialhandoverto',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 128,
            patternErrorMsg: '',
          },
          {
            name: 'designation',
            jsonPath: 'indents[0].designation',
            label: 'inventory.designation',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
        ],
      },

      {
        name: 'Indent Details',
        label: 'inventory.create.group.title.indentdetails',
        fields: [
          {
            type: 'tableList',
            jsonPath: 'indents[0].indentDetails',
            tableList: {
              header: [
                {
                  label: 'Material Name',
                },
                {
                  label: 'Material Descr.',
                },
                {
                  label: 'Uom',
                },
                {
                  label: 'Asset Code',
                },
                {
                  label: 'Project Code',
                },
                {
                  label: 'Qty Required',
                },
                 /*{
                  label: 'Qty Received',
                },*/
              ],
              values: [
                {
                  name: 'material',
                  pattern: '',
                  type: 'autoCompelete',
                  jsonPath: 'indents[0].indentDetails[0].material.code',
                  isRequired: true,
                  isDisabled: false,
                  url:
                    '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=Material|$.MdmsRes.inventory.Material[*].code|$.MdmsRes.inventory.Material[*].name|$.MdmsRes.inventory.Material[*].description|$.MdmsRes.inventory.Material[*].baseUom.uomCategory',
                  depedants: [
                    {
                      jsonPath: 'indents[0].indentDetails[0].material.description',
                      type: 'textField',
                      valExp:
                        "getValFromDropdownData('indents[0].indentDetails[*].material.code', getVal('indents[0].indentDetails[*].material.code'), 'others[0]')",
                    },

                    {
                      jsonPath: 'indents[0].indentDetails[0].material.baseUom.uomCategory',
                      type: 'textField',
                      valExp:
                        "getValFromDropdownData('indents[0].indentDetails[*].material.code', getVal('indents[0].indentDetails[*].material.code'), 'others[1]')",
                    },

                    {
                      jsonPath: 'indents[0].indentDetails[0].uom.code',
                      type: 'dropDown',
                      pattern:
                        '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom&filter=+%5B%3F%28%40.uomCategory%3D%3D%27{indents[0].indentDetails[0].material.baseUom.uomCategory}%27%29%5D|$..code|$..description',
                    },
                  ],
                },
                {
                  name: 'materialDescription',
                  jsonPath: 'indents[0].indentDetails[0].material.description',
                  pattern: '',
                  type: 'text',
                  isRequired: false,
                  isDisabled: true,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
                {
                  name: 'id',
                  jsonPath: 'indents[0].indentDetails[0].id',
                  label: 'inventory.indent.type',
                  pattern: '',
                  type: 'text',
                  isRequired: false,
                  isHidden: true,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
                {
                  name: 'uom',
                  jsonPath: 'indents[0].indentDetails[0].uom.code',
                  pattern: '',
                  type: 'singleValueList',
                  isRequired: true,
                  isDisabled: false,
                  url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description',
                },

                {
                  name: 'asset',
                  jsonPath: 'indents[0].indentDetails[0].asset.code',
                  pattern: '',
                  type: 'text',
                  isRequired: false,
                  isDisabled: false,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
                {
                  name: 'projectcode',
                  jsonPath: 'indents[0].indentDetails[0].projectCode.code',
                  pattern: '[a-zA-Z0-9-\\\\]+',
                  type: 'text',
                  isRequired: false,
                  isDisabled: false,
                  defaultValue: '',
                  maxLength: 100,
                  patternErrorMsg: 'inventory.create.field.message.code',
                },
                {
                  name: 'userQuantity',
                  jsonPath: 'indents[0].indentDetails[0].userQuantity',
                  pattern: '',
                  type: 'number',
                  isRequired: true,
                  isDisabled: false,
                  defaultValue: '',
                  patternErrorMsg: '',
                },
               /* {
                  name: 'recvQuantity',
                  jsonPath: 'indents[0].indentDetails[0].userQuantity',
                  pattern: '',
                  type: 'number',
                  isRequired: true,
                  isDisabled: false,
                  defaultValue: '',
                  patternErrorMsg: '',
                },*/
              ],
            },
          },
        ],
      },
    ],
    url: '/inventory-services/indents/_update',
    tenantIdRequired: true,
    searchUrl: '/inventory-services/indents/_search?indentNumber={indentNumber}',
  },
};
export default dat;
