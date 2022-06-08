var dat = {
    'inventory.search': {
        numCols: 3,
        useTimestamp: true,
        title:'inventory.materialType.master.title',
        objectName: 'MaterialType',
        url: '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=MaterialType',
        groups: [
            {
                name: 'materialTypeDetails',
                label: 'Search Material type',
                fields: [
                    {
                        name: 'materialTypeName',
                        jsonPath: 'name',
                        label: 'inventory.materialType.name',
                        pattern: '',
                        type: 'singleValueList',
                        isRequired: false,
                        isDisabled: false,
                        defaultValue: '',
                        maxLength: 100,
                        minLength: 1,
                        url: "/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=MaterialType|$..code|$..name",

                    },
                    {
                        name: 'parentMaterialTypeName',
                        jsonPath: 'code',
                        label: 'inventory.materialType.parentName',
                        pattern: '',
                        type: 'singleValueList',
                        isRequired: false,
                        isDisabled: false,
                        defaultValue: '',
                        maxLength: 128,
                        minLength: 1,
                        patternErrorMsg: '',
                        url: "/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=MaterialType&filter=%5B%3F%28%40.isParent%3D%3Dfalse%29%5D|$..code|$..name",

                    },
                    {
                        name: 'active',
                        pattern: '',
                        type: 'checkbox',
                        defaultValue: true,
                        label: 'inventory.materialType.isActive',
                        jsonPath: 'active',
                        isRequired: false,
                        isDisabled: false,
                    },
                ]
            },
        ],
        result: {
            disableRowClick: true,
            isAction: true,
            actionItems: [
                {
                    label: 'Map to Store',
                    url: '/update/inventory/materialtypestoremapping/',
                }
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
                    label: 'inventory.materialType.name',
                },
                {
                    label: 'inventory.materialType.description',
                },
                {
                    label: 'inventory.materialType.parentName',
                },
                {
                    label: 'inventory.materialType.isActive',
                },
            ],
            values: [
                'code',
                'name',
                
                'description',
                'parent',
                
                
                'active',
            ],
            resultPath: 'MdmsRes.inventory.MaterialType',
            resultIdKey: 'code',
            rowClickUrlUpdate: '/update/inventory/materialtype/{code}',
            rowClickUrlView: '/view/inventory/materialtype/{code}',
            isMasterScreen: true,
        },
      
    },
    'inventory.create': {
        numCols: 4,
        useTimestamp: true,
        url: '/egov-mdms-create/v1/_create',
        title: 'inventory.materialType.master.title',
        idJsonPath: 'MdmsRes.inventory.MaterialType[0].code',
        moduleName: 'inventory',
        masterName: 'MaterialType',
        objectName: 'MasterMetaData',
     
        groups: [
            {
                name: 'Add Material',
                label: 'inventory.create.group.title.addmaterialType',
                fields: [
                 
                
                    {
                        name: 'code',
                        jsonPath: 'MasterMetaData.masterData[0].code',
                        label: 'inventory.materialType.code',
                        type: 'text',
                        isRequired: true,
                        isDisabled: false,
                        patternErrorMsg: '',
                        url: '',
                    },
                 
                    {
                        name: 'name',
                        jsonPath: 'MasterMetaData.masterData[0].name',
                        label: 'inventory.material.materialtype',
                        type: 'text',
                        isRequired: true,
                        isDisabled: false,
                        patternErrorMsg: '',
                        url: '',
                    },
                   
                    {
                        name: 'description',
                        jsonPath: 'MasterMetaData.masterData[0].description',
                        label: 'inventory.materialType.description',
                        type: 'textarea',
                        isRequired: true,
                        isDisabled: false,
                        maxLength: 1000,
                        patternErrorMsg: '',
                     },
                    {
                        name: 'ParentType',
                        pattern: '',
                        type: 'checkbox',
                        defaultValue: false,
                        label: 'inventory.materialType.parentType',
                        jsonPath: 'MasterMetaData.masterData[0].isParent',
                        isRequired: false,
                        isDisabled: false,
                        showHideFields: [
                            {
                                ifValue: true,
                                hide: [],
                                show: [
                                    {
                                        name: 'parent',
                                        isGroup: false,
                                        isField: true,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        name: 'active',
                        pattern: '',
                        type: 'checkbox',
                        defaultValue: true,
                        label: 'inventory.materialType.isActive',
                        jsonPath: 'MasterMetaData.masterData[0].active',
                        isRequired: false,
                        isDisabled: false,
                    },
                    {
                        name: 'parent',
                        jsonPath: 'MasterMetaData.masterData[0].parent',
                        label: 'inventory.materialType.parentName',
                        type: 'singleValueList',
                        isRequired: false,
                        isDisabled: false,
                        hide:true,
                        url: '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=MaterialType|$..code|$..name',
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
                        defaultValue: 'MaterialType',
                        hide: true
                    },
                    
                 
                ],
            }
        ],
          
        resultPath: 'MdmsRes.inventory.MaterialType',
        rowClickUrlUpdate: '/update/inventory/materialtype/{code}',
        rowClickUrlView: '/view/inventory/materialtype/{code}',
   
        tenantIdRequired: true,
    },
    'inventory.view': {
        numCols: 4,
        useTimestamp: true,
        title: 'inventory.materialType.master.title',
        // moduleName: 'inventory',
        // masterName: 'MaterialType',
        objectName: 'MaterialType',
        groups: [
            {
                name: 'View Material',
                label: 'inventory.create.group.title.viewmaterialType',
                fields: [

                    {
                        name: 'code',
                        jsonPath: 'MdmsRes.inventory.MaterialType[0].code',
                        label: 'inventory.materialType.code',
                        type: 'text',
                        isRequired: true,
                        isDisabled: false,
                        patternErrorMsg: '',
                        url: '',
                    },

                    {
                        name: 'name',
                        jsonPath:'MdmsRes.inventory.MaterialType[0].name',
                        label: 'inventory.materialType.name',
                        type: 'text',
                        isRequired: true,
                        isDisabled: false,
                        patternErrorMsg: '',
                        url: '',
                    },

               
                
                    {
                        name: 'active',
                        pattern: '',
                        type: 'checkbox',
                        defaultValue: true,
                        label: 'inventory.materialType.isActive',
                        jsonPath: 'MdmsRes.inventory.MaterialType[0].active',
                        isRequired: false,
                        isDisabled: false,
                    },
                    {
                        name: 'description',
                        jsonPath: 'MdmsRes.inventory.MaterialType[0].description',
                        label: 'inventory.materialType.description',
                        type: 'textarea',
                        isRequired: true,
                        isDisabled: false,
                        maxLength: 1000,
                        patternErrorMsg: '',
                    },
                    {
                        name: 'parentMaterialname',
                        jsonPath: 'MdmsRes.inventory.MaterialType[0].parent',
                        label: 'inventory.materialType.parentName',
                        type: 'singleValueList',
                        isRequired: true,
                        isDisabled: false,
                        patternErrorMsg: '',
                        url: '',
                    },
                 
                      ],
                    }
                ],
        tenantIdRequired: true,
        url: '/egov-mdms-service/v1/_search?code={code}',
   },
    'inventory.update': {
        numCols: 4,
        useTimestamp: true,
        url: '/egov-mdms-create/v1/_update',
        title: 'inventory.materialType.master.title',
        searchUrl: '/egov-mdms-service/v1/_search?code={code}',
        idJsonPath: 'MasterMetaData.masterData[0].code',
        objectName: 'MaterialType',

        groups: [
            {
                name: 'Add Material',
                label: 'inventory.create.group.title.updatematerialType',
                fields: [


                    {
                        name: 'code',
                        jsonPath: 'MasterMetaData.masterData[0].code',
                        label: 'inventory.materialType.code',
                        type: 'text',
                        isRequired: true,
                        isDisabled: true,
                        patternErrorMsg: '',
                        url: '',
                    },

                    {
                        name: 'name',
                        jsonPath: 'MasterMetaData.masterData[0].name',
                        label: 'inventory.materialType.name',
                        type: 'text',
                        isRequired: true,
                        isDisabled: false,
                        patternErrorMsg: '',
                        url: '',
                    },

                    {
                        name: 'description',
                        jsonPath: 'MasterMetaData.masterData[0].description',
                        label: 'inventory.materialType.description',
                        type: 'textarea',
                        isRequired: true,
                        isDisabled: false,
                        maxLength: 1000,
                        patternErrorMsg: '',
                    },
                    {
                        name: 'ParentType',
                        pattern: '',
                        type: 'checkbox',
                        defaultValue: false,
                        label: 'inventory.materialType.parentType',
                        jsonPath: 'MasterMetaData.masterData[0].isParent',
                        isRequired: false,
                        isDisabled: false,
                        showHideFields: [
                            {
                                ifValue: true,
                                hide: [],
                                show: [
                                    {
                                        name: 'parent',
                                        isGroup: false,
                                        isField: true,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        name: 'active',
                        pattern: '',
                        type: 'checkbox',
                        defaultValue: true,
                        label: 'inventory.materialType.isActive',
                        jsonPath: 'MasterMetaData.masterData[0].active',
                        isRequired: false,
                        isDisabled: false,
                    },
                    {
                        name: 'parent',
                        jsonPath: 'MasterMetaData.masterData[0].parent',
                        label: 'inventory.materialType.parentName',
                        type: 'singleValueList',
                        isRequired: false,
                        isDisabled: false,
                        hide: true,
                        url: '/egov-mdms-service/v1/_get?&moduleName=inventory&masterName=MaterialType|$..code|$..name',
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
                        defaultValue: 'MaterialType',
                        hide: true
                    },


                ],
            }
        ],


        tenantIdRequired: true,
        isMDMSScreen: true,
    },
};
export default dat;
