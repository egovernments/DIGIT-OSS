var dat = {
  'inventory.search': {

    preApiCalls: [
      /* {
        url: "/egov-mdms-service/v1/_get",
        jsonPath: "materialType.codeTwo",
        qs: {
          moduleName: "inventory",
          masterName: "MaterialType"
        },
        jsExpForDD: {
          key: "$..code",
          value: "$..name",
        }
      }, */
      {
        url: "/inventory-services/stores/_search",
        jsonPath: "store.code",
        jsExpForDD: {
          key: "$..code",
          value: "$..name",
        }
      },

      {
         url: "/inventory-services/materials/_search",
         jsonPath: "material.value",
        qs: {
          moduleName: "inventory",
          masterName: "Material"
        },
         jsExpForDD: {
           key: "$..code",
           value: "$..name",
         } 
 
       }
    ],

    numCols: 4,
    useTimestamp: true,
    objectName: 'materialStoreMappings',
    title:'inventory.materialStoreMap.master.title',
    url: '/inventory-services/materialstoremapping/_search',
    customActionsAndUrl: [
      {
        actionName: 'Add',
        url: '/search/inventory/material/',
      },
    ],
    groups: [
      {
        name: 'search',
        label: 'inventory.common.searchcriteria',
        fields: [
          {
            name: 'code',
            pattern: '',
            label: 'inventory.materialName',
            type: 'autoCompelete',
            jsonPath: 'material',
            displayJsonPath: 'materialName',
            isRequired: false,
            isDisabled: false,
            url: '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=Material|$.MdmsRes.inventory.Material[*].code|$.MdmsRes.inventory.Material[*].name',
          },

          {
            name: 'store',
            pattern: '',
            label: 'inventory.store.name',
            type: 'singleValueList',
            jsonPath: 'store',
            isRequired: false,
            isDisabled: false,
            url: 'inventory-services/stores/_search?|$.stores[*].code|$.stores[*].name',
          },
          // {
          //   name: 'isActive',
          //   jsonPath: 'active',
          //   label: 'inventory.active',
          //   type: 'checkbox',
          //   defaultValue: true,
          //   isRequired: false,
          //   isDisabled: false,
          //   patternErrorMsg: '',
          // },
        ],
      },
    ],
    result: {
      header: [
        {
          label: 'inventory.materialName',
        },
        // {
        //   label: 'inventory.material.materialtype',

        // },
        {
          label: 'inventory.store.name',

        },
        {
          label:'inventory.active'
        }
      ],
      values: [
       { jsonPath: 'material.code', reduxObject: "material", isObj: true, cToN: true },

        //'material.code',
        // { jsonPath: 'materials.materialType.code', reduxObject: "materialType.codeTwo", isObj: true, cToN: true },
        { jsonPath: 'store.code', reduxObject: "store.code", isObj: true, cToN: true },
        // 'storeMapping[0].store.code'
        'active'

      ],
      resultPath: 'materialStoreMappings',
      resultIdKey: 'code',
      rowClickUrlUpdate: '/update/inventory/materialstoremapping/{material.code}',
      rowClickUrlView: '/view/inventory/materialstoremapping/{material.code}',
      rowClickUrlAdd: '/create/inventory/materialstoremapping',
      rowClickUrlDelete: '',
    },
  },
  'inventory.update': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'materials',
    url: '/inventory-services/materials/_update',
    title: 'inventory.materialStoreMap.master.title',
    searchUrl: '/inventory-services/materials/_search?code={code}',

    groups: [
      {
        name: 'Update Material',
        label: 'inventory.create.group.title.updatematerial',
        fields: [
          {
            name: 'code',
            jsonPath: 'materials[0].code',
            label: 'inventory.material.code',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            maxLength: 50,
            patternErrorMsg: '',
          },


          {
            name: 'oldCode',
            jsonPath: 'materials[0].oldCode',
            label: 'inventory.material.oldcode',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            maxLength: 50,
            patternErrorMsg: '',
          },




          {
            name: 'MaterialType',
            jsonPath: 'materials[0].materialType.code',
            label: 'inventory.material.materialtype',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=MaterialType|$..code|$..name',
          },
          {
            name: 'name',
            jsonPath: 'materials[0].name',
            label: 'inventory.material.name',
            type: 'text',
            isRequired: true,
            isDisabled: true,
            maxLength: 50,
            patternErrorMsg: '',
          },
          {
            name: 'description',
            jsonPath: 'materials[0].description',
            label: 'inventory.material.description',
            type: 'textarea',
            isRequired: true,
            isDisabled: true,
            maxLength: 1000,
            patternErrorMsg: '',
          },
          {
            name: 'name',
            jsonPath: 'materials[0].baseUom.code',
            label: 'inventory.material.baseuom',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description',
          },
          {
            name: 'status',
            jsonPath: 'materials[0].status',
            defaultValue: [
              {
                key: 'Active',
                value: 'Active',
              },
              {
                key: 'Inactive',
                value: 'Inactive',
              },
            ],

            label: 'inventory.material.status',
            type: 'singleValueList',
          },



          {
            name: 'inventoryType',
            jsonPath: 'materials[0].inventoryType',
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
            label: 'inventory.material.inventorytype',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            patternErrorMsg: '',
            showHideFields: [
              {
                ifValue: 'Asset',
                hide: [],
                show: [
                  {
                    name: 'assetCategory',
                    isGroup: false,
                    isField: true,
                  },
                ],
              },
            ],
          },

          {
            name: 'assetCategory',
            jsonPath: 'materials[0].assetCategory.code',
            label: 'inventory.material.assetcategory',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            hide: true,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?tenantId=default&moduleName=ASSET&masterName=AssetCategory|$..code|$..name',
          },


        ],
      },
      {
        name: 'Material Map To Store',
        label: 'inventory.material.maptostore',
        fields: [
          {
            name: 'department',
            pattern: '',
            type: 'singleValueList',
            jsonPath: 'departmentMaster',
            isRequired: false,
            isDisabled: false,
            hide: true,
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Department|$..code|$..name',
          },

          {
            type: 'tableList',
            jsonPath: 'materials[0].storeMapping',
            tableList: {
              header: [
                {
                  label: 'Store Name',
                },
                {
                  label: 'Department Name',
                },
                {
                  label: 'Account Code',
                },
                {
                  label: 'Active',
                },
              ],
              values: [
                {
                  name: 'store',
                  pattern: '',
                  type: 'singleValueList',
                  jsonPath: 'materials[0].storeMapping[0].store.code',
                  isRequired: true,
                  isDisabled: false,
                  url: 'inventory-services/stores/_search?|$.stores[*].code|$.stores[*].name|$.stores[*].department',

                  depedants: [
                    {
                      jsonPath: 'materials[0].storeMapping[0].store.department.code',
                      type: 'autoFill',
                      pattern: "inventory-services/stores/_search?&codes={materials[0].storeMapping[0].store.code}",
                      autoFillFields: {
                        'materials[0].storeMapping[0].store.department.code': 'stores[0].department.code',
                      }, // "getValFromDropdownData('materials[0].storeMapping[*].store.code', getVal('materials[0].storeMapping[*].store.code'), 'others[0].code')",
                    },
                 
                  ], 


                
                },
                {
                  name: 'department',
                  pattern: '',
                  type: 'singleValueList',
                  jsonPath: 'materials[0].storeMapping[0].store.department.code',
                  url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Department|$..code|$..name',
                  isRequired: false,
                  isDisabled: true
                },
                {
                  name: 'accountcode',
                  pattern: '',
                  type: 'singleValueList',
                  jsonPath: 'materials[0].storeMapping[0].chartofAccount.glcode',
                  isRequired: true,
                  isDisabled: false,
                  url: '/egf-master/chartofaccounts/_search?|$.chartOfAccounts[*].glcode|$.chartOfAccounts[*].name',
                },
                {
                  name: 'active',
                  pattern: '',
                  type: 'checkbox',
                  defaultValue: true,
                  label: '',
                  jsonPath: 'materials[0].storeMapping[0].active',
                  isRequired: false,
                  isDisabled: false,
                },
              ],
            },
          },
        ],
      },
      {
        name: 'Puchasing Information',
        label: 'inventory.material.purchasinginfo',
        fields: [
          {
            name: 'code',
            jsonPath: 'materials[0].purchaseUom.code',
            label: 'inventory.material.purchaseuom',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description',
          },
          {
            name: 'accountcode',
            pattern: '',
            type: 'singleValueList',
            jsonPath: 'materials[0].expenseAccount.glcode',
            label: 'inventory.material.expenseacctcode',
            isRequired: false,
            isDisabled: true,
            url: '/egf-master/chartofaccounts/_search?|$.chartOfAccounts[*].glcode|$.chartOfAccounts[*].name',
          },
        ],
      },
      {
        name: 'Stocking Information',
        label: 'inventory.material.stockinginfo',
        fields: [
          {
            name: 'materialClass',
            jsonPath: 'materials[0].materialClass',
            label: 'inventory.material.usageclass',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            patternErrorMsg: '',
            defaultValue: [
              { key: null, value: '-- Please Select --' },
              {
                key: 'HighUsage',
                value: 'High usage',
              },
              {
                key: 'MediumUsage',
                value: 'Medium usage',
              },
              {
                key: 'LowUsage',
                value: 'Low usage',
              },
            ],
          },
          {
            name: 'name',
            jsonPath: 'materials[0].stockingUom.code',
            label: 'inventory.material.stockinguom',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description',
          },

          {
            name: 'materialControlType',
            jsonPath: 'materials[0].lotControl',
            label: 'inventory.material.lot',
            type: 'checkbox',
            defaultValue: true,
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'minQuantity',
            jsonPath: 'materials[0].minQuantity',
            label: 'inventory.material.minqty',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'maxQuantity',
            jsonPath: 'materials[0].maxQuantity',
            label: 'inventory.material.maxqty',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'reorderLevel',
            jsonPath: 'materials[0].reorderLevel',
            label: 'inventory.material.reorderlevel',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'reorderQuantity',
            jsonPath: 'materials[0].reorderQuantity',
            label: 'inventory.material.reorderqty',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'serialNumberMandatory',
            jsonPath: 'materials[0].serialNumber',
            label: 'inventory.material.serialno',
            defaultValue: true,
            type: 'checkbox',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'shelfLifeControlType',
            jsonPath: 'materials[0].shelfLifeControl',
            label: 'inventory.material.shelflife',
            defaultValue: true,
            type: 'checkbox',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'scrapable',
            jsonPath: 'materials[0].scrapable',
            label: 'inventory.material.scrapable',
            defaultValue: true,
            type: 'checkbox',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
        ],
      },
      {
        name: 'Specification',
        label: 'inventory.material.specification',
        fields: [
          {
            name: 'model',
            jsonPath: 'materials[0].model',
            label: 'inventory.material.model',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'manufacturePartNo',
            jsonPath: 'materials[0].manufacturePartNo',
            label: 'inventory.material.manufactureno',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'techincalSpecs',
            jsonPath: 'materials[0].techincalSpecs',
            label: 'inventory.material.technicalspecification',
            type: 'textarea',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'termsOfDelivery',
            jsonPath: 'materials[0].termsOfDelivery',
            label: 'inventory.material.termsofdelivery',
            type: 'textarea',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },

        ],
      },
    ],

    tenantIdRequired: true

  },

  'inventory.view': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'materials',

    title: 'inventory.materialStoreMap.master.title',
    url: '/inventory-services/materials/_search?code={code}',

    groups: [
      {
        name: 'View Material',
        label: 'inventory.create.group.title.viewmaterial',
        fields: [
          {
            name: 'code',
            jsonPath: 'materials[0].code',
            label: 'inventory.material.code',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            maxLength: 50,
            patternErrorMsg: '',
          },


          {
            name: 'oldCode',
            jsonPath: 'materials[0].oldCode',
            label: 'inventory.material.oldcode',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            maxLength: 50,
            patternErrorMsg: '',
          },




          {
            name: 'MaterialType',
            jsonPath: 'materials[0].materialType.code',
            label: 'inventory.material.materialtype',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=MaterialType|$..code|$..name',
          },
          {
            name: 'name',
            jsonPath: 'materials[0].name',
            label: 'inventory.material.name',
            type: 'text',
            isRequired: true,
            isDisabled: true,
            maxLength: 50,
            patternErrorMsg: '',
          },
          {
            name: 'description',
            jsonPath: 'materials[0].description',
            label: 'inventory.material.description',
            type: 'textarea',
            isRequired: true,
            isDisabled: true,
            maxLength: 1000,
            patternErrorMsg: '',
          },
          {
            name: 'name',
            jsonPath: 'materials[0].baseUom.code',
            label: 'inventory.material.baseuom',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description',
          },
          {
            name: 'status',
            jsonPath: 'materials[0].status',
            defaultValue: [
              {
                key: 'Active',
                value: 'Active',
              },
              {
                key: 'Inactive',
                value: 'Inactive',
              },
            ],

            label: 'inventory.material.status',
            type: 'singleValueList',
          },



          {
            name: 'inventoryType',
            jsonPath: 'materials[0].inventoryType',
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
            label: 'inventory.material.inventorytype',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            patternErrorMsg: '',
            showHideFields: [
              {
                ifValue: 'Asset',
                hide: [],
                show: [
                  {
                    name: 'assetCategory',
                    isGroup: false,
                    isField: true,
                  },
                ],
              },
            ],
          },

          {
            name: 'assetCategory',
            jsonPath: 'materials[0].assetCategory.code',
            label: 'inventory.material.assetcategory',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            hide: true,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?tenantId=default&moduleName=ASSET&masterName=AssetCategory|$..code|$..name',
          },


        ],
      },
      {
        name: 'Material Map To Store',
        label: 'inventory.material.maptostore',
        fields: [
          

          {
            type: 'tableList',
            jsonPath: 'materials[0].storeMapping',
            tableList: {
              actionsNotRequired: true,
              header: [
                {
                  label: 'Store Name',
                },
                {
                  label: 'Department Name',
                },
                {
                  label: 'Account Code',
                },
                {
                  label: 'Active',
                },
              ],
              values: [
                {
                  name: 'store',
                  pattern: '',
                  type: 'singleValueList',
                  jsonPath: 'materials[0].storeMapping[0].store.code',
                  isRequired: true,
                  isDisabled: false,
                  url: 'inventory-services/stores/_search?|$.stores[*].code|$.stores[*].name|$.stores[*].department',
                  depedants: [
                    {
                      jsonPath: 'materials[0].storeMapping[0].store.department.code',
                      type: 'autoFill',
                      pattern: "inventory-services/stores/_search?&codes={materials[0].storeMapping[0].store.code}",
                      autoFillFields: {
                        'materials[0].storeMapping[0].store.department.code': 'stores[0].department.code',
                      }, // "getValFromDropdownData('materials[0].storeMapping[*].store.code', getVal('materials[0].storeMapping[*].store.code'), 'others[0].code')",
                    },

                  ], 
                },
                {
                  name: 'department',
                  pattern: '',
                  type: 'singleValueList',
                  jsonPath: 'materials[0].storeMapping[0].store.department.code',
                  url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Department|$..code|$..name',
                  isRequired: false,
                  isDisabled: true
                },
                {
                  name: 'accountcode',
                  pattern: '',
                  type: 'singleValueList',
                  jsonPath: 'materials[0].storeMapping[0].chartofAccount.glcode',
                  isRequired: true,
                  isDisabled: false,
                  url: '/egf-master/chartofaccounts/_search?|$.chartOfAccounts[*].glcode|$.chartOfAccounts[*].name',
                },
                {
                  name: 'active',
                  pattern: '',
                  type: 'checkbox',
                  defaultValue: true,
                  label: '',
                  jsonPath: 'materials[0].storeMapping[0].active',
                  isRequired: false,
                  isDisabled: false,
                },
              ],
            },
          },
        ],
      },
      {
        name: 'Puchasing Information',
        label: 'inventory.material.purchasinginfo',
        fields: [
          {
            name: 'code',
            jsonPath: 'materials[0].purchaseUom.code',
            label: 'inventory.material.purchaseuom',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description',
          },
          {
            name: 'accountcode',
            pattern: '',
            type: 'singleValueList',
            jsonPath: 'materials[0].expenseAccount.glcode',
            label: 'inventory.material.expenseacctcode',
            isRequired: false,
            isDisabled: true,
            url: '/egf-master/chartofaccounts/_search?|$.chartOfAccounts[*].glcode|$.chartOfAccounts[*].name',
          },
        ],
      },
      {
        name: 'Stocking Information',
        label: 'inventory.material.stockinginfo',
        fields: [
          {
            name: 'materialClass',
            jsonPath: 'materials[0].materialClass',
            label: 'inventory.material.usageclass',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            patternErrorMsg: '',
            defaultValue: [
              { key: null, value: '-- Please Select --' },
              {
                key: 'HighUsage',
                value: 'High usage',
              },
              {
                key: 'MediumUsage',
                value: 'Medium usage',
              },
              {
                key: 'LowUsage',
                value: 'Low usage',
              },
            ],
          },
          {
            name: 'name',
            jsonPath: 'materials[0].stockingUom.code',
            label: 'inventory.material.stockinguom',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description',
          },

          {
            name: 'materialControlType',
            jsonPath: 'materials[0].lotControl',
            label: 'inventory.material.lot',
            type: 'checkbox',
            defaultValue: true,
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'minQuantity',
            jsonPath: 'materials[0].minQuantity',
            label: 'inventory.material.minqty',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'maxQuantity',
            jsonPath: 'materials[0].maxQuantity',
            label: 'inventory.material.maxqty',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'reorderLevel',
            jsonPath: 'materials[0].reorderLevel',
            label: 'inventory.material.reorderlevel',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'reorderQuantity',
            jsonPath: 'materials[0].reorderQuantity',
            label: 'inventory.material.reorderqty',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'serialNumberMandatory',
            jsonPath: 'materials[0].serialNumber',
            label: 'inventory.material.serialno',
            defaultValue: true,
            type: 'checkbox',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'shelfLifeControlType',
            jsonPath: 'materials[0].shelfLifeControl',
            label: 'inventory.material.shelflife',
            defaultValue: true,
            type: 'checkbox',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'scrapable',
            jsonPath: 'materials[0].scrapable',
            label: 'inventory.material.scrapable',
            defaultValue: true,
            type: 'checkbox',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
        ],
      },
      {
        name: 'Specification',
        label: 'inventory.material.specification',
        fields: [
          {
            name: 'model',
            jsonPath: 'materials[0].model',
            label: 'inventory.material.model',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'manufacturePartNo',
            jsonPath: 'materials[0].manufacturePartNo',
            label: 'inventory.material.manufactureno',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'techincalSpecs',
            jsonPath: 'materials[0].techincalSpecs',
            label: 'inventory.material.technicalspecification',
            type: 'textarea',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'termsOfDelivery',
            jsonPath: 'materials[0].termsOfDelivery',
            label: 'inventory.material.termsofdelivery',
            type: 'textarea',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },

        ],
      },
    ],

    tenantIdRequired: true

  },

  /* 
  'inventory.view': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'materials',
    groups: [
      {
        name: 'Material Map To Store',
        label: 'inventory.create.group.title.Material Map To Store',
        fields: [
          {
            type: 'tableList',
            jsonPath: '',
            tableList: {
              header: [
                {
                  label: 'Material',
                },
                {
                  label: 'Store Name',
                },
                {
                  label: 'Department Name',
                },
                {
                  label: 'Account Code',
                },
                {
                  label: 'Active',
                },
              ],
              values: [
                {
                  name: 'material',
                  pattern: '',
                  type: 'autocompelete',
                  jsonPath: 'materialStoreMappings[0].material.code',
                  isRequired: true,
                  isDisabled: false,
                  url:
                    '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=Material|$.MdmsRes.inventory.Material[*].code|$.MdmsRes.inventory.Material[*].name',
                },
                {
                  name: 'store',
                  pattern: '',
                  type: 'singleValueList',
                  jsonPath: 'materialStoreMappings[0].store.code',
                  isRequired: true,
                  isDisabled: false,
                  url: 'inventory-services/stores/_search?|$.stores[*].code|$.stores[*].name|$.stores[*].department',
                  depedants: [
                    {
                      jsonPath: 'materialStoreMappings[0].department.name',
                      type: 'textField',
                      valExp:
                        "getValFromDropdownData('materialStoreMappings[*].store.code', getVal('materialStoreMappings[*].store.code'), 'others.code')",
                    },
                  ],
                },
                {
                  name: 'department',
                  pattern: '',
                  type: 'text',
                  jsonPath: 'materialStoreMappings[0].department.name',
                  isRequired: true,
                  isDisabled: true,
                },
                {
                  name: 'accountcode',
                  pattern: '',
                  type: 'singleValueList',
                  jsonPath: 'materialStoreMappings[0].chartofAccount.glCode',
                  isRequired: true,
                  isDisabled: false,
                  url: '/egf-master/chartofaccounts/_search?|$.chartOfAccounts[*].glcode|$.chartOfAccounts[*].name',
                },
                {
                  name: 'active',
                  pattern: '',
                  type: 'checkbox',
                  defaultValue: true,
                  label: '',
                  jsonPath: 'materialStoreMappings[0].active',
                  isRequired: false,
                  isDisabled: false,
                },
              ],
            },
          },
        ],
      },
    ],
    tenantIdRequired: true,
    url: '/inventory-services/materials/_search?code={code}',
  },
  
 */

};

export default dat;

