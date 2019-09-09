var dat = {
  'inventory.search': {

    preApiCalls: [
       {
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
      }, 
   
    ],

    numCols: 4,
    useTimestamp: true,
    objectName: 'Material',
    url: '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=Material',
    title: 'inventory.material.title',
    groups: [
      {
        name: 'search',
        label: 'inventory.common.searchcriteria',
        fields: [
          {
            name: 'code',
            pattern: '',
            label: 'inventory.material.name',
            type: 'autoCompelete',
            jsonPath: 'code',
     
            isRequired: false,
            isDisabled: false,
            url: '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=Material|$..code|$..name',
          },
          {
            name: 'code',
            jsonPath: 'materialType',
            label: 'inventory.material.materialtype',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=MaterialType|$..code|$..name',
          },

          
          {
            name: 'status',
            jsonPath: 'status',
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
         
            label:'inventory.material.status',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
        ],
      },
    ],
    result: {
      disableRowClick: true,
      isAction: true,
      actionItems: [
        {
          label: 'Map to Store',
          url: '/update/inventory/materialstoremapping/',
        },],
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
        label :'Material Code',
      },
        {
          label: 'Material Name',
        },
        {
          label: 'Material Type Name',
        },
        {
          label: 'Material status',
        },
      ],
      values: [

        'code',
        'code',
        'name',
        { jsonPath: 'materialType.code', reduxObject: "materialType.codeTwo", isObj: true, cToN: true },
        // 'materialType.code',
        /*{
          path: 'materialType.code',
          valExp: `getValFromDropdownData('materialType', _.get(values[i], specsValuesList[j].path), 'value')`,
        },*/
        'status',
      ],
      resultPath: 'MdmsRes.inventory.Material',
      resultIdKey: 'code',
      rowClickUrlUpdate: '/update/inventory/material/{code}',
      rowClickUrlView: '/view/inventory/material/{code}',
      isMasterScreen: true,

      //rowClickUrlAdd: '/create/inventory/material',
      /*rowClickUrlDelete: {
        url: 'inventory-services/materials/_update',
        body: {
          status: 'Inactive',
          inActiveDate: function() {
            return new Date().getTime();
          },
        },
      },*/
    },
  },
  'inventory.create': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'Material',
    url: '/egov-mdms-create/v1/_create',
    idJsonPath: 'MdmsRes.inventory.Material["0"].code',
    moduleName: 'inventory',
    masterName: 'Material',
    objectName: 'MasterMetaData',
    title: 'inventory.material.title',
    groups: [
      {
        name: 'Add Material',
        label: 'inventory.create.group.title.addmaterial',
        fields: [
          
        {
            name: 'code',
            jsonPath: 'MasterMetaData.masterData[0].code',
            label: 'Material Code',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: ''
          },




          {
            name: 'oldCode',
            jsonPath: 'MasterMetaData.masterData[0].oldCode',
            label: 'inventory.material.oldcode',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            maxLength: 50,
            patternErrorMsg: '',
          },

          


          {
            name: 'MaterialType',
            jsonPath: 'MasterMetaData.masterData[0].materialType.code',
            label: 'inventory.material.materialtype',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=MaterialType|$..code|$..name',
          },
          {
            name: 'name',
            jsonPath: 'MasterMetaData.masterData[0].name',
            label: 'inventory.material.name',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            maxLength: 50,
            patternErrorMsg: '',
          },
          {
            name: 'description',
            jsonPath: 'MasterMetaData.masterData[0].description',
            label: 'inventory.material.description',
            type: 'textarea',
            isRequired: true,
            isDisabled: false,
            maxLength: 1000,
            patternErrorMsg: '',
          },
          {
            name: 'name',
            jsonPath: 'MasterMetaData.masterData[0].baseUom.code',
            label: 'inventory.material.baseuom',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description',
          },
          {
            name: 'status',
            jsonPath: 'MasterMetaData.masterData[0].status',
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
         
            label:'inventory.material.status',
            type: 'singleValueList',
          },



          {
            name: 'inventoryType',
            jsonPath: 'MasterMetaData.masterData[0].inventoryType',
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
            isDisabled: false,
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
            jsonPath: 'MasterMetaData.masterData[0].assetCategory.code',
            label: 'inventory.material.assetcategory',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            hide: true,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?tenantId=default&moduleName=ASSET&masterName=AssetCategory|$..code|$..name',
          },

         
        ],
      },
     
      {
        name: 'Puchasing Information',
        label: 'inventory.material.purchasinginfo',
        fields: [
          {
            name: 'code',
            jsonPath: 'MasterMetaData.masterData[0].purchaseUom.code',
            label: 'inventory.material.purchaseuom',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description',
          },
          {
            name: 'accountcode',
            pattern: '',
            type: 'singleValueList',
            jsonPath: 'MasterMetaData.masterData[0].expenseAccount.glcode',
            label: 'inventory.material.expenseacctcode',
            isRequired: false,
            isDisabled: false,
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
            jsonPath: 'MasterMetaData.masterData[0].materialClass',
            label: 'inventory.material.usageclass',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
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
            jsonPath: 'MasterMetaData.masterData[0].stockingUom.code',
            label: 'inventory.material.stockinguom',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description',
          },
          /*{
            name: 'minQuantity',
            jsonPath: 'MdmsRes.inventory.Material[0].minQuantity',
            label: 'inventory.material.minqty',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'maxQuantity',
            jsonPath: 'MdmsRes.inventory.Material[0].maxQuantity',
            label: 'inventory.material.maxqty',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'reorderLevel',
            jsonPath: 'MdmsRes.inventory.Material[0].reorderLevel',
            label: 'inventory.material.reorderlevel',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },MdmsRes.inventory.Material[0]
            name: 'reorderQuantity',
            jsonPath: 'MdmsRes.inventory.Material[0].reorderQuantity',
            label: 'inventory.material.reorderqty',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },*/
          {
            name: 'materialControlType',
            jsonPath: 'MasterMetaData.masterData[0].lotControl',
            label: 'inventory.material.lot',
            type: 'checkbox',
            defaultValue: true,
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'serialNumberMandatory',
            jsonPath: 'MasterMetaData.masterData[0].serialNumber',
            label: 'inventory.material.serialno',
            defaultValue: true,
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'shelfLifeControlType',
            jsonPath: 'MasterMetaData.masterData[0].shelfLifeControl',
            label: 'inventory.material.shelflife',
            defaultValue: true,
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'scrapable',
            jsonPath: 'MasterMetaData.masterData[0].scrapable',
            label: 'inventory.material.scrapable',
            defaultValue: true,
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
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
            jsonPath: 'MasterMetaData.masterData[0].model',
            label: 'inventory.material.model',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'manufacturePartNo',
            jsonPath: 'MasterMetaData.masterData[0].manufacturePartNo',
            label: 'inventory.material.manufactureno',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'techincalSpecs',
            jsonPath: 'MasterMetaData.masterData[0].techincalSpecs',
            label: 'inventory.material.technicalspecification',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'termsOfDelivery',
            jsonPath: 'MasterMetaData.masterData[0].termsOfDelivery',
            label: 'inventory.material.termsofdelivery',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
                        name: 'tenantId',
                        jsonPath: 'MasterMetaData.masterData[0].tenantId',
                        type: 'text',
                        defaultValue: localStorage.getItem("tenantId"),
                        hide: true
                    },
                   
                    {
                        name: 'moduleName',
                        jsonPath: 'MasterMetaData.moduleName',
                        type: 'text',
                        defaultValue: 'inventory',
                        hide: true
                    },
                    {
                        name: 'masterName',
                        jsonPath: 'MasterMetaData.masterName',
                        type: 'text',
                        defaultValue: 'Material',
                        hide: true
                    },
        ],
      },
    ],
  
    tenantIdRequired: true,
  },
  'inventory.view': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'Material',
    url: '/egov-mdms-service/v1/_search?code={code}',
    title: 'inventory.material.title',
    groups: [
      {
        name: 'View Material',
        label: 'inventory.create.group.title.viewmaterial',
        fields: [
          {
            name: 'code',
            jsonPath: 'MdmsRes.inventory.Material[0].code',
            label: 'inventory.material.code',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            maxLength: 50,
            patternErrorMsg: '',
          },
          {
            name: 'oldCode',
            jsonPath: 'MdmsRes.inventory.Material[0].oldCode',
            label: 'inventory.material.oldcode',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            maxLength: 50,
            patternErrorMsg: '',
          },
          {
            name: 'code',
            jsonPath: 'MdmsRes.inventory.Material[0].materialType.code',
            label: 'inventory.material.materialtype',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=MaterialType|$..code|$..name',
          },
          {
            name: 'name',
            jsonPath: 'MdmsRes.inventory.Material[0].name',
            label: 'inventory.material.name',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            maxLength: 50,
            patternErrorMsg: '',
          },
          {
            name: 'description',
            jsonPath: 'MdmsRes.inventory.Material[0].description',
            label: 'inventory.material.description',
            type: 'textarea',
            isRequired: true,
            isDisabled: false,
            maxLength: 1000,
            patternErrorMsg: '',
          },
          {
            name: 'name',
            jsonPath: 'MdmsRes.inventory.Material[0].baseUom.code',
            label: 'inventory.material.baseuom',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description',
          },
          {
            name: 'inventoryType',
            jsonPath: 'MdmsRes.inventory.Material[0].inventoryType',
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
            isDisabled: false,
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
            jsonPath: 'MdmsRes.inventory.Material[0].assetCategory.code',
            label: 'inventory.material.assetcategory',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            hide: true,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?tenantId=default&moduleName=ASSET&masterName=AssetCategory|$..code|$..name',
          },
          {
            name: 'status',
            jsonPath: 'MdmsRes.inventory.Material[0].status',
            label: 'inventory.material.status',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            maxLength: 50,
            patternErrorMsg: '',
          },
        ],
      },
     
      {
        name: 'Puchasing Information',
        label: 'inventory.material.purchasinginfo',
        fields: [
          {
            name: 'code',
            jsonPath: 'MdmsRes.inventory.Material[0].purchaseUom.code',
            label: 'inventory.material.purchaseuom',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description',
          },
          {
            name: 'accountcode',
            pattern: '',
            type: 'singleValueList',
            jsonPath: 'MdmsRes.inventory.Material[0].expenseAccount.glcode',
            label: 'inventory.material.expenseacctcode',
            isRequired: false,
            isDisabled: false,
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
            jsonPath: 'MdmsRes.inventory.Material[0].materialClass',
            label: 'inventory.material.usageclass',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
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
            jsonPath: 'MdmsRes.inventory.Material[0].stockingUom.code',
            label: 'inventory.material.stockinguom',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egf-master/chartofaccounts/_search?|$.chartOfAccounts[*].glcode|$.chartOfAccounts[*].name',
          },
        /*  {
            name: 'minQuantity',
            jsonPath: 'MdmsRes.inventory.Material[0].minQuantity',
            label: 'inventory.material.minqty',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'maxQuantity',
            jsonPath: 'MdmsRes.inventory.Material[0].maxQuantity',
            label: 'inventory.material.maxqty',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'reorderLevel',
            jsonPath: 'MdmsRes.inventory.Material[0].reorderLevel',
            label: 'inventory.material.reorderlevel',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'reorderQuantity',
            jsonPath: 'MdmsRes.inventory.Material[0].reorderQuantity',
            label: 'inventory.material.reorderqty',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },*/
          {
            name: 'materialControlType',
            jsonPath: 'MdmsRes.inventory.Material[0].lotControl',
            label: 'inventory.material.lot',
            type: 'checkbox',
            defaultValue: true,
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'serialNumberMandatory',
            jsonPath: 'MdmsRes.inventory.Material[0].serialNumber',
            label: 'inventory.material.serialno',
            defaultValue: true,
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'shelfLifeControlType',
            jsonPath: 'MdmsRes.inventory.Material[0].shelfLifeControl',
            label: 'inventory.material.shelflife',
            defaultValue: true,
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'scrapable',
            jsonPath: 'MdmsRes.inventory.Material[0].scrapable',
            label: 'inventory.material.scrapable',
            defaultValue: true,
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
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
            jsonPath: 'MdmsRes.inventory.Material[0].model',
            label: 'inventory.material.model',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'manufacturePartNo',
            jsonPath: 'MdmsRes.inventory.Material[0].manufacturePartNo',
            label: 'inventory.material.manufactureno',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'techincalSpecs',
            jsonPath: 'MdmsRes.inventory.Material[0].techincalSpecs',
            label: 'inventory.material.technicalspecification',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'termsOfDelivery',
            jsonPath: 'MdmsRes.inventory.Material[0].termsOfDelivery',
            label: 'inventory.material.termsofdelivery',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
        ],
      },
    ],
    tenantIdRequired: true,
    
  },
  'inventory.update': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'Material',
    url: '/egov-mdms-create/v1/_update',
    title: 'inventory.material.title',
    searchUrl:'/egov-mdms-service/v1/_search?code={code}', 
    idJsonPath : 'MasterMetaData.masterData[0].code',
    groups: [
      {
        name: 'Update Material',
        label: 'inventory.create.group.title.updatematerial',
        fields: [
          {
            name: 'code',
            jsonPath: 'MasterMetaData.masterData[0].code',
            label: 'inventory.material.code',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            maxLength: 50,
            patternErrorMsg: '',
          },
          

          {
            name: 'oldCode',
            jsonPath: 'MasterMetaData.masterData[0].oldCode',
            label: 'inventory.material.oldcode',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            maxLength: 50,
            patternErrorMsg: '',
          },

          


          {
            name: 'MaterialType',
            jsonPath: 'MasterMetaData.masterData[0].materialType.code',
            label: 'inventory.material.materialtype',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=MaterialType|$..code|$..name',
          },
          {
            name: 'name',
            jsonPath: 'MasterMetaData.masterData[0].name',
            label: 'inventory.material.name',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            maxLength: 50,
            patternErrorMsg: '',
          },
          {
            name: 'description',
            jsonPath: 'MasterMetaData.masterData[0].description',
            label: 'inventory.material.description',
            type: 'textarea',
            isRequired: true,
            isDisabled: false,
            maxLength: 1000,
            patternErrorMsg: '',
          },
          {
            name: 'name',
            jsonPath: 'MasterMetaData.masterData[0].baseUom.code',
            label: 'inventory.material.baseuom',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description',
          },
          {
            name: 'status',
            jsonPath: 'MasterMetaData.masterData[0].status',
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
         
            label:'inventory.material.status',
            type: 'singleValueList',
          },



          {
            name: 'inventoryType',
            jsonPath: 'MasterMetaData.masterData[0].inventoryType',
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
            isDisabled: false,
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
            jsonPath: 'MasterMetaData.masterData[0].assetCategory.code',
            label: 'inventory.material.assetcategory',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            hide: true,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?tenantId=default&moduleName=ASSET&masterName=AssetCategory|$..code|$..name',
          },

         
        ],
      },
    
      {
        name: 'Puchasing Information',
        label: 'inventory.material.purchasinginfo',
        fields: [
          {
            name: 'code',
            jsonPath: 'MasterMetaData.masterData[0].purchaseUom.code',
            label: 'inventory.material.purchaseuom',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description',
          },
          {
            name: 'accountcode',
            pattern: '',
            type: 'singleValueList',
            jsonPath: 'MasterMetaData.masterData[0].expenseAccount.glcode',
            label: 'inventory.material.expenseacctcode',
            isRequired: false,
            isDisabled: false,
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
            jsonPath: 'MasterMetaData.masterData[0].materialClass',
            label: 'inventory.material.usageclass',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
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
            jsonPath: 'MasterMetaData.masterData[0].stockingUom.code',
            label: 'inventory.material.stockinguom',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Uom|$..code|$..description',
          },
          
          {
            name: 'materialControlType',
            jsonPath: 'MasterMetaData.masterData[0].lotControl',
            label: 'inventory.material.lot',
            type: 'checkbox',
            defaultValue: true,
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'serialNumberMandatory',
            jsonPath: 'MasterMetaData.masterData[0].serialNumber',
            label: 'inventory.material.serialno',
            defaultValue: true,
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'shelfLifeControlType',
            jsonPath: 'MasterMetaData.masterData[0].shelfLifeControl',
            label: 'inventory.material.shelflife',
            defaultValue: true,
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'scrapable',
            jsonPath: 'MasterMetaData.masterData[0].scrapable',
            label: 'inventory.material.scrapable',
            defaultValue: true,
            type: 'checkbox',
            isRequired: false,
            isDisabled: false,
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
            jsonPath: 'MasterMetaData.masterData[0].model',
            label: 'inventory.material.model',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'manufacturePartNo',
            jsonPath: 'MasterMetaData.masterData[0].manufacturePartNo',
            label: 'inventory.material.manufactureno',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'techincalSpecs',
            jsonPath: 'MasterMetaData.masterData[0].techincalSpecs',
            label: 'inventory.material.technicalspecification',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'termsOfDelivery',
            jsonPath: 'MasterMetaData.masterData[0].termsOfDelivery',
            label: 'inventory.material.termsofdelivery',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
                        name: 'tenantId',
                        jsonPath: 'MasterMetaData.masterData[0].tenantId',
                        type: 'text',
                        defaultValue: localStorage.getItem("tenantId"),
                        hide: true
                    },
                   
                    {
                        name: 'moduleName',
                        jsonPath: 'MasterMetaData.moduleName',
                        type: 'text',
                        defaultValue: 'inventory',
                        hide: true
                    },
                    {
                        name: 'masterName',
                        jsonPath: 'MasterMetaData.masterName',
                        type: 'text',
                        defaultValue: 'Material',
                        hide: true
                    },
        ],
      },
    ],
    
    tenantIdRequired: true,
    isMDMSScreen: true,
  },
};
export default dat;
