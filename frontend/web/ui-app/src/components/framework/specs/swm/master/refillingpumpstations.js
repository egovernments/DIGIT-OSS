var dat = {
  'swm.search': {
    numCols: 3,
    useTimestamp: true,
    objectName: 'refillingPumpStations',
    url: '/swm-services/refillingpumpstations/_search',
    title:'swm.search.page.title.refillingpumpstations',
    groups: [
      {
        name: 'search',
        label: 'swm.search.refillingPumpStations.title',
        fields: [
          {
            name: 'name',
            jsonPath: 'name',
            label: 'swm.refillingpumpstations.create.name',
            type: 'autoCompelete',
            isRequired: false,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: 'swm-services/refillingpumpstations/_search?|$..refillingPumpStations.*.name|$..refillingPumpStations.*.name',
          },
          {
            name: 'code',
            jsonPath: 'typeOfPumpCode',
            label: 'swm.refillingpumpstations.typeOfPump.name',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=OilCompany|$..code|$..name',
          },
          {
            name: 'name',
            jsonPath: 'typeOfFuelCode',
            label: 'swm.refillingpumpstations.typeOfFuel.code',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=FuelType|$..code|$..name'
          },
        ],
      },
    ],
    result: {
      header: [
        {
          label: 'swm.refillingpumpstations.create.name',
        },
        {
          label: 'swm.refillingpumpstations.typeOfPump.name',
        },
        {
          label: 'swm.refillingpumpstations.typeOfFuel',
        },
        {
          label: 'swm.refillingpumpstations.quantity',
        },
        {
          label: 'swm.collectionpoints.create.colony',
        },
      ],
      values: [
      'name',
      'typeOfPump.name', 
      'fuelTypes',
      'quantity',
      'location.name'],
      resultPath: 'refillingPumpStations',
      rowClickUrlUpdate: '/update/swm/refillingpumpstations/{code}',
      rowClickUrlView: '/view/swm/refillingpumpstations/{code}',
    },
  },
  'swm.create': {
    numCols: 3,
    useTimestamp: true,
    objectName: 'refillingPumpStations',
    idJsonPath: 'refillingPumpStations[0].code',
    title: 'swm.refillingpumpstations.create.title',
    groups: [
      {
        name: 'LocationDetails',
        label: 'swm.refillingpumpstations.create.group.title.RefillingPumpLocation',
        fields: [
           {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "refillingPumpStations[0].location.code",
            "isRequired": true,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
          }
        ],
      },
      {
        name: 'RefillingPumpName',
        label: 'swm.refillingpumpstations.create.group.title.RefillingPumpName',
        fields: [

         {
            name: 'name',
            jsonPath: 'refillingPumpStations[0].typeOfPump.code',
            label: 'swm.refillingpumpstations.typeOfPump.name',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=OilCompany|$..code|$..name',
          },
          {
            name: 'name',
            jsonPath: 'refillingPumpStations[0].name',
            label: 'swm.refillingpumpstations.create.name',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
          },
         
          {
            name: 'name',
            jsonPath: 'refillingPumpStations[0].remarks',
            label: 'legacylegal.create.remarks',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            maxLength: 300,
            minLength: 15,
            pattern:'.{15,300}$',
            patternErrMsg: 'swm.vendorcontracts.create.description.errormsg',
          },
        ],
      },
      {
        name: 'FuelDetails',
        label: 'swm.refillingpumpstations.create.group.title.FuelDetails',
        fields: [
          {
            name: 'name',
            jsonPath: 'refillingPumpStations[0].fuelTypes[0].code',
            label: 'swm.refillingpumpstations.typeOfFuel',
            type: 'multiValueList',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=FuelType|$..code|$..name',
            hasATOAATransform: true,
            aATransformInfo: {
              to: 'refillingPumpStations[0].fuelTypes',
              key: 'code'
            }
          },
          {
            name: 'name',
            jsonPath: 'refillingPumpStations[0].quantity',
            label: 'swm.refillingpumpstations.quantity',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            pattern: '^([1-9][0-9]{0,3}|10000)$',
            patternErrMsg: 'Value of Quantity shall be between 0 and 10000 litres',
          },
        ],
      },
    ],
    url: '/swm-services/refillingpumpstations/_create',
    tenantIdRequired: true,
  },
  'swm.view': {
    numCols: 3,
    useTimestamp: true,
    objectName: 'refillingpumpstations',
    groups: [
      {
        name: 'LocationDetails',
        label: 'swm.refillingpumpstations.create.group.title.RefillingPumpLocation',
        fields: [
         {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "refillingPumpStations[0].location.code",
            "isRequired": true,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
          }
        ],
      },
      {
        name: 'RefillingPumpName',
        label: 'swm.refillingpumpstations.create.group.title.RefillingPumpName',
        fields: [
          {
            name: 'name',
            jsonPath: 'refillingPumpStations[0].typeOfPump.name',
            label: 'swm.refillingpumpstations.typeOfPump.name',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
          },

          {
            name: 'name',
            jsonPath: 'refillingPumpStations[0].name',
            label: 'swm.refillingpumpstations.create.name',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
          },
          
          {
            name: 'name',
            jsonPath: 'refillingPumpStations[0].remarks',
            label: 'legacylegal.create.remarks',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
          },
        ],
      },
      {
        name: 'FuelDetails',
        label: 'swm.refillingpumpstations.create.group.title.FuelDetails',
        fields: [
          {
            name: 'name',
            jsonPath: 'refillingPumpStations[0].fuelTypes',
            label: 'swm.refillingpumpstations.typeOfFuel',
            type: 'multiValueList',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=FuelType|$..code|$..name',
            hasATOAATransform: true,
            aATransformInfo: {
              to: 'refillingPumpStations[0].fuelTypes',
              key: 'code'
            },
          },
          {
            name: 'name',
            jsonPath: 'refillingPumpStations[0].quantity',
            label: 'swm.refillingpumpstations.quantity',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
          },
        ],
      },
    ],
    tenantIdRequired: true,
    url: '/swm-services/refillingpumpstations/_search?code={code}',
  },
  'swm.update': {
    numCols: 3,
    useTimestamp: true,
    objectName: 'refillingpumpstations',
    idJsonPath: 'refillingPumpStations[0].code',
    title: 'swm.refillingpumpstations.create.title',
    groups: [
      {
        name: 'LocationDetails',
        label: 'swm.refillingpumpstations.create.group.title.RefillingPumpLocation',
        fields: [
           {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "refillingPumpStations[0].location.code",
            "isRequired": true,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
          }
        ],
      },
      {
        name: 'RefillingPumpName',
        label: 'swm.refillingpumpstations.create.group.title.RefillingPumpName',
        fields: [

        {
            name: 'name',
            jsonPath: 'refillingPumpStations[0].typeOfPump.code',
            label: 'swm.refillingpumpstations.typeOfPump.name',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=OilCompany|$..code|$..name',
          },
          {
            name: 'name',
            jsonPath: 'refillingPumpStations[0].name',
            label: 'swm.refillingpumpstations.create.name',
            type: 'text',
            isRequired: true,
            isDisabled: true,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
          },
          
          {
            name: 'name',
            jsonPath: 'refillingPumpStations[0].remarks',
            label: 'legacylegal.create.remarks',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            maxLength: 300,
            minLength: 15,
            pattern:'.{15,300}$',
            patternErrMsg: 'swm.vendorcontracts.create.description.errormsg',
          },
        ],
      },
      {
        name: 'FuelDetails',
        label: 'swm.refillingpumpstations.create.group.title.FuelDetails',
        fields: [
          {
            name: 'name',
            jsonPath: 'refillingPumpStations[0].fuelTypes',
            label: 'swm.refillingpumpstations.typeOfFuel',
            type: 'multiValueList',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=FuelType|$..code|$..name',
            hasATOAATransform: true,
            aATransformInfo: {
              to: 'refillingPumpStations[0].fuelTypes',
              key: 'code'
            }
          },
          {
            name: 'name',
            jsonPath: 'refillingPumpStations[0].quantity',
            label: 'swm.refillingpumpstations.quantity',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            maxLength: 128,
            minLength: 1,
            pattern: '^([1-9][0-9]{0,3}|10000)$',
            patternErrMsg: 'Value of Quantity shall be between 0 and 10000 litres',
          },
        ],
      },
    ],
    url: '/swm-services/refillingpumpstations/_update',
    tenantIdRequired: true,
    searchUrl: '/swm-services/refillingpumpstations/_search?code={code}',
  },
};
export default dat;