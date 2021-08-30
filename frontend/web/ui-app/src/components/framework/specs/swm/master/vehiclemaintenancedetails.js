var dat = {
  'swm.search': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'vehiclemaintenancedetails',
    url: '/swm-services/vehiclemaintenancedetails/_search',
     title: 'swm.search.page.title.vehiclemaintenancedetails',
    groups: [
      {
        name: 'search',
        label: 'swm.vehiclemaintenancedetails.search.title',
        fields: [
          {
            name: 'maintenanceType',
            jsonPath: 'maintenanceType',
            label: 'swm.create.maintenanceType',
            pattern: '',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            defaultValue: [
              {
                key: 'MAINTENANCE',
                value: 'Maintenance',
              },
              {
                key: 'REPAIR',
                value: 'Repair',
              },
            ],
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
          },
          {
            name: 'regNumber',
            jsonPath: 'regNumber',
            label: 'swm.vehicles.create.regNumber',
            pattern: '',
            type: 'autoCompelete',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 12,
            minLength: 6,
            patternErrorMsg: '',
            url: 'swm-services/vehicles/_search?|$.vehicles.*.regNumber|$.vehicles.*.regNumber',
          },
	        {
            name: 'transactionNo',
            jsonPath: 'transactionNo',
            label: 'swm.vehicles.create.transactionNo',
            pattern: '',
            type: 'autoCompelete',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
            url: 'swm-services/vehiclemaintenancedetails/_search?|$.vehicleMaintenanceDetails.*.transactionNo|$.vehicleMaintenanceDetails.*.transactionNo',
          }
        ],
      },
    ],
    result: {
      header: [
        {
          label: 'swm.create.vehicleRepairdMaintenanceNumber'
        },
        {
          label: 'swm.create.actualRepairMaintenanceDate',
          isDate: true,
        },
        {
          label: 'swm.vehicles.create.regNumber',
        },
        {
          label: 'vehiclefuellingdetails.create.vehicleType',
        },
        // {
        //   label: 'swm.create.vehicleScheduledMaintenanceDate',
        //   isDate: true,
        // },
        {
          label: 'swm.create.costIncurred',
        },
        {
          label:'swm.create.vehicleReadingDuringMaintenance'
        },
        {
          label: 'swm.create.vehicleDowntimeActual'
        },
        {
          label:'swm.create.remarks'
        }
      ],
      values: [
        'transactionNo',
        'actualMaintenanceDate',
        'vehicle.regNumber',
        'vehicle.vehicleType.name', 
        // 'vehicleScheduledMaintenanceDate', 
        'costIncurred',
        'vehicleReadingDuringMaintenance',
        'vehicleDowntimeActual',
        'remarks'
      ],
      resultPath: 'vehicleMaintenanceDetails',
      rowClickUrlUpdate: '/update/swm/vehiclemaintenancedetails/{transactionNo}',
      rowClickUrlView: '/view/swm/vehiclemaintenancedetails/{transactionNo}',
    },
  },
  'swm.create': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'vehicleMaintenanceDetails',
    idJsonPath: 'vehicleMaintenanceDetails[0].transactionNo',
    title: 'swm.vehiclemaintenancedetails.create.title',

    groups: [
      {
        name: 'Selection',
        label: 'swm.create.group.title.Selection',
        fields: [
          {
            name: '',
            jsonPath: 'vehicleMaintenanceDetails[0].isScheduled',
            label: 'swm.create.isScheduled',
            type: 'checkbox',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            defaultValue: false,
            showHideFields: [
              {
                ifValue: true,
                hide: [],
                show: [
                  {
                    name: 'vehicleScheduledMaintenanceDate',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'vehicle.insuranceDetails.insuranceValidityDate',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'downtimeDefined',
                    isGroup: false,
                    isField: true,
                  },
                   {
                    name: 'downtimeforMaintenanceUom',
                    isGroup: false,
                    isField: true,
                  },
                ],
              },
            ],
          },
          {
            name: 'maintenanceType',
            jsonPath: 'vehicleMaintenanceDetails[0].maintenanceType',
            label: 'swm.create.maintenanceType',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: [
              {
                key: 'MAINTENANCE',
                value: 'Maintenance',
              },
              {
                key: 'REPAIR',
                value: 'Repair',
              },
            ],
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
          },
        ],
      },
      {
        name: 'VehicleMaintenanceDeatils',
        label: 'swm.create.group.title.VehicleMaintenanceDetails',
        fields: [
          {
            name: 'regNumber',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicle.regNumber',
            label: 'swm.vehicles.create.regNumber',
            pattern: '',
            type: 'autoCompelete',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: 12,
            minLength: 6,
            patternErrorMsg: '',
            url: 'swm-services/vehicles/_search?|$.vehicles.*.regNumber|$.vehicles.*.regNumber',
            autoCompleteDependancy: [
              {
                autoCompleteUrl: '/swm-services/vehiclemaintenances/_search?&regNumber={vehicleMaintenanceDetails[0].vehicle.regNumber}',
               
                autoFillFields: {
                  //'vehicleMaintenanceDetails[0].vehicle.vehicleType.name': 'vehicleMaintenances[0].vehicle.vehicleType.name',
                  'vehicleMaintenanceDetails[0].vehicle.insuranceDetails.insuranceValidityDate':
                    'vehicleMaintenances[0].vehicle.insuranceDetails.insuranceValidityDate',
                  'vehicleMaintenanceDetails[0].downtimeDefined': 'vehicleMaintenances[0].downtimeforMaintenance',
                  'vehicleMaintenanceDetails[0].downtimeforMaintenanceUom':'vehicleMaintenances[0].downtimeforMaintenanceUom',

                },
              },

              {
                autoCompleteUrl: '/swm-services/vehiclemaintenancedetails/_getnextscheduleddate?vehicleRegNumber={vehicleMaintenanceDetails[0].vehicle.regNumber}',
  
                autoFillFields: {
                   'vehicleMaintenanceDetails[0].vehicleScheduledMaintenanceDate': 'scheduledDate' 
                }
              },

              {
                autoCompleteUrl: '/swm-services/vehicles/_search?regNumber={vehicleMaintenanceDetails[0].vehicle.regNumber}',
                autoFillFields: {
                  'vehicleMaintenanceDetails[0].vehicle.vehicleType.name': 'vehicles[0].vehicleType.name'
                }
              },
            ],

            depedants: [
              {
                jsonPath: 'vehicleMaintenanceDetails[0].vehicleScheduledMaintenanceDate',
                type: 'date',
                pattern:
                  '/swm-services/vehiclemaintenancedetails/_getnextscheduleddate?vehicleRegNumber={vehicleMaintenanceDetails[0].vehicle.regNumber}|$..*.id|$..*.name',
              },
            ],
          },
          {
            name: 'name',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicle.vehicleType.name',
            label: 'vehiclefuellingdetails.create.vehicleType',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            defaultValue: '',
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'vehicleScheduledMaintenanceDate',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicleScheduledMaintenanceDate',
            label: 'swm.create.vehicleScheduledMaintenanceDate',
            pattern: '',
            type: 'datePicker',
            isDate: true,
            isRequired: false,
            isDisabled: true,
            hide: true,
            defaultValue: '',
            patternErrorMsg: '',
            url: '',
            isStateLevel: true,
          },
          {
            name: 'actualMaintenanceDate',
            jsonPath: 'vehicleMaintenanceDetails[0].actualMaintenanceDate',
            label: 'swm.create.actualMaintenanceDate',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'costIncurred',
            jsonPath: 'vehicleMaintenanceDetails[0].costIncurred',
            label: 'swm.create.costIncurred',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'vehicle.insuranceDetails.insuranceValidityDate',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicle.insuranceDetails.insuranceValidityDate',
            label: 'swm.create.insuranceDetails.insuranceValidityDate',
            pattern: '',
            type: 'datePicker',
            isDate: true,
            hide: true,
            isRequired: false,
            isDisabled: true,
            defaultValue: '',
            patternErrorMsg: '',
          },

          
          
          {
            name: 'vehicleReadingDuringMaintenance',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicleReadingDuringMaintenance',
            label: 'swm.create.vehicleReadingDuringMaintenance',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },

           {
            name: 'downtimeDefined',
            jsonPath: 'vehicleMaintenanceDetails[0].downtimeDefined',
            label: 'swm.create.DowntimeDefined',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            hide: true,
            defaultValue: '',
            patternErrorMsg: '',
            url: '',
          },

           {
            name: 'downtimeforMaintenanceUom',
            jsonPath: 'vehicleMaintenanceDetails[0].downtimeforMaintenanceUom',
            label: 'swm.create.downtimeforMaintenanceUom',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            hide: true,
           /* defaultValue: [
              {
                key: 'Hrs',
                value: 'Hrs',
              },
              {
                key: 'Days',
                value: 'Days',
              },
            ],*/
            maxLength: 5,
            minLength: 3,
            patternErrorMsg: '',
          },

          {
            name: 'vehicleDowntimeActual',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicleDowntimeActual',
            label: 'swm.create.vehicleDowntimeActual',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },

         
          
          {
            name: 'vehicleDownTimeActualUom',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicleDownTimeActualUom',
            label: 'swm.create.vehicleDownTimeActualUom',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: [
              {
                key: 'Hrs',
                value: 'Hrs',
              },
              {
                key: 'Days',
                value: 'Days',
              },
            ],
            patternErrorMsg: '',
          },
          {
            name: 'remarks',
            jsonPath: 'vehicleMaintenanceDetails[0].remarks',
            label: 'swm.Shift.create.remarks',
            pattern: '',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 300,
            minLength: 0,
            patternErrorMsg: '',
          },
        ],
      },
    ],
    url: '/swm-services/vehiclemaintenancedetails/_create',
    tenantIdRequired: true,
  },
  'swm.view': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'vehicleMaintenanceDetails',
    preApiCalls:[
      {
        url:"/swm-services/vehiclemaintenances/_search?",
        jsonPath:"vehicleMaintenanceDetails[0].downtimeDefined,vehicleMaintenanceDetails[0].downtimeforMaintenanceUom",
        type: 'text',
        responseArray:"vehicleMaintenances",
        primaryKey:"vehicle.regNumber",
        queryParameter:'vehicleMaintenanceDetails[0].vehicle.regNumber',
        responsePaths:[
          "downtimeforMaintenance",
          "downtimeforMaintenanceUom",
        ]
      }
    ],
    groups: [
      {
        name: 'Selection',
        label: 'swm.create.group.title.Selection',
        fields: [
          {
            name: 'isScheduled',
            jsonPath: 'vehicleMaintenanceDetails[0].isScheduled',
            label: 'swm.create.isScheduled',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
           // defaultValue: false,
            showHideFields: [
              {
                ifValue: true,
                hide: [],
                show: [
                  {
                    name: 'vehicleScheduledMaintenanceDate',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'vehicle.insuranceDetails.insuranceValidityDate',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'downtimeDefined',
                    isGroup: false,
                    isField: true,
                  },
                   {
                    name: 'downtimeforMaintenanceUom',
                    isGroup: false,
                    isField: true,
                  },
                ],
              },
            ],
          },
          {
            name: 'maintenanceType',
            jsonPath: 'vehicleMaintenanceDetails[0].maintenanceType',
            label: 'swm.create.maintenanceType',
            pattern: '',
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
        name: 'VehicleMaintenanceDeatils',
        label: 'swm.create.group.title.VehicleMaintenanceDetails',
        fields: [
	{
            name: 'transactionNo',
            jsonPath: 'vehicleMaintenanceDetails[0].transactionNo',
            label: 'swm.vehicles.create.transactionNo',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            defaultValue: '',
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'regNumber',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicle.regNumber',
            label: 'swm.vehicles.create.regNumber',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            maxLength: 12,
            minLength: 6,
            patternErrorMsg: '',
          },
          {
            name: 'name',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicle.vehicleType.name',
            label: 'vehiclefuellingdetails.create.vehicleType',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            defaultValue: '',
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'vehicleScheduledMaintenanceDate',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicleScheduledMaintenanceDate',
            label: 'swm.create.vehicleScheduledMaintenanceDate',
            pattern: '',
            hide: true,
            type: 'datePicker',
            isRequired: false,
            isDisabled: true,
            defaultValue: '',
            patternErrorMsg: '',
            url: '',
            isStateLevel: true,
          },
          {
            name: 'actualMaintenanceDate',
            jsonPath: 'vehicleMaintenanceDetails[0].actualMaintenanceDate',
            label: 'swm.create.actualMaintenanceDate',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'costIncurred',
            jsonPath: 'vehicleMaintenanceDetails[0].costIncurred',
            label: 'swm.create.costIncurred',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'insuranceValidityDate',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicle.insuranceDetails.insuranceValidityDate',
            label: 'swm.create.insuranceDetails.insuranceValidityDate',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: true,
            hide: true,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'vehicleReadingDuringMaintenance',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicleReadingDuringMaintenance',
            label: 'swm.create.vehicleReadingDuringMaintenance',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'downtimeDefined',
            jsonPath: 'vehicleMaintenanceDetails[0].downtimeDefined',
            label: 'swm.create.DowntimeDefined',
            pattern: '',
            type: 'text',
            hide: true,
            isRequired: false,
            isDisabled: true,
            defaultValue: '',
            patternErrorMsg: '',
            url: '',
          },
           {
            name: 'downtimeforMaintenanceUom',
            jsonPath: 'vehicleMaintenanceDetails[0].downtimeforMaintenanceUom',
            label: 'swm.create.downtimeforMaintenanceUom',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: true,
            hide: true,
           /* defaultValue: [
              {
                key: 'Hrs',
                value: 'Hrs',
              },
              {
                key: 'Days',
                value: 'Days',
              },
            ],*/
            maxLength: 5,
            minLength: 3,
            patternErrorMsg: '',
          },

          {
            name: 'vehicleDowntimeActual',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicleDowntimeActual',
            label: 'swm.create.vehicleDowntimeActual',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'vehicleDownTimeActualUom',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicleDownTimeActualUom',
            label: 'swm.create.vehicleDownTimeActualUom',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'remarks',
            jsonPath: 'vehicleMaintenanceDetails[0].remarks',
            label: 'swm.Shift.create.remarks',
            pattern: '',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 300,
            minLength: 0,
            patternErrorMsg: '',
          },
        ],
      },
    ],
    tenantIdRequired: true,
    url: '/swm-services/vehiclemaintenancedetails/_search?transactionNo={transactionNo}',
  },
  'swm.update': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'vehicleMaintenanceDetails',
    idJsonPath: 'vehicleMaintenanceDetails[0].transactionNo',
    title: 'swm.vehiclemaintenancedetails.create.title',
 preApiCalls:[
      {
        url:"/swm-services/vehiclemaintenances/_search?",
        jsonPath:"vehicleMaintenanceDetails[0].downtimeDefined,vehicleMaintenanceDetails[0].downtimeforMaintenanceUom",
        type: 'text',
        responseArray:"vehicleMaintenances",
        primaryKey:"vehicle.regNumber",
        queryParameter:'vehicleMaintenanceDetails[0].vehicle.regNumber',
        responsePaths:[
          "downtimeforMaintenance",
          "downtimeforMaintenanceUom",
        ]
      }
    ],

    
    groups: [
      {
        name: 'Selection',
        label: 'swm.create.group.title.Selection',
        fields: [
          {
            name: '',
            jsonPath: 'vehicleMaintenanceDetails[0].isScheduled',
            label: 'swm.create.isScheduled',
            type: 'checkbox',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            defaultValue: false,
            showHideFields: [
              {
                ifValue: true,
                hide: [],
                show: [
                  {
                    name: 'vehicleScheduledMaintenanceDate',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'vehicle.insuranceDetails.insuranceValidityDate',
                    isGroup: false,
                    isField: true,
                  },
                  {
                    name: 'downtimeDefined',
                    isGroup: false,
                    isField: true,
                  },
                   {
                    name: 'downtimeforMaintenanceUom',
                    isGroup: false,
                    isField: true,
                  },
                ],
              },
            ],
          },
          {
            name: 'maintenanceType',
            jsonPath: 'vehicleMaintenanceDetails[0].maintenanceType',
            label: 'swm.create.maintenanceType',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: [
              {
                key: 'MAINTENANCE',
                value: 'Maintenance',
              },
              {
                key: 'REPAIR',
                value: 'Repair',
              },
            ],
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
          },
        ],
      },
      {
        name: 'VehicleMaintenanceDeatils',
        label: 'swm.create.group.title.VehicleMaintenanceDetails',
        fields: [
	{
            name: 'transactionNo',
            jsonPath: 'vehicleMaintenanceDetails[0].transactionNo',
            label: 'swm.vehicles.create.transactionNo',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            defaultValue: '',
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'regNumber',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicle.regNumber',
            label: 'swm.vehicles.create.regNumber',
            pattern: '',
            type: 'autoCompelete',
            isRequired: true,
            isDisabled: true,
            defaultValue: '',
            maxLength: 12,
            minLength: 6,
            patternErrorMsg: '',
            url: 'swm-services/vehicles/_search?|$.vehicles.*.regNumber|$.vehicles.*.regNumber',
            autoCompleteDependancy: {
              autoCompleteUrl: '/swm-services/vehiclemaintenances/_search?regNumber={vehicleMaintenanceDetails[0].vehicle.regNumber}',
              autoFillFields: {
                'vehicleMaintenanceDetails[0].vehicle.vehicleType.name': 'vehicleMaintenances[0].vehicle.vehicleType.name',
                'vehicleMaintenanceDetails[0].vehicle.insuranceDetails.insuranceValidityDate':
                  'vehicleMaintenances[0].vehicle.insuranceDetails.insuranceValidityDate',
                'vehicleMaintenanceDetails[0].downtimeDefined': 'vehicleMaintenances[0].downtimeforMaintenance',
              'vehicleMaintenanceDetails[0].downtimeforMaintenanceUom':'vehicleMaintenances[0].downtimeforMaintenanceUom',
              },
            },
            depedants: [
            {
                jsonPath: 'vehicleMaintenanceDetails[0].downtime',
                type: 'autoFill',
                pattern: '/swm-services/vehiclemaintenances/_search?regNumber={vehicleMaintenanceDetails[0].vehicle.regNumber}',
                autoFillFields:{
                  'vehicleMaintenanceDetails[0].downtimeDefined':'vehicleMaintenances[0].downtimeforMaintenance',
                }
              },
              {
                jsonPath: 'vehicleMaintenanceDetails[0].vehicleScheduledMaintenanceDate',
                type: 'date',
                pattern:
                  '/swm-services/vehiclemaintenancedetails/_getnextscheduleddate?vehicleRegNumber={vehicleMaintenanceDetails[0].vehicle.regNumber}|$..*.id|$..*.name',
              },
              
            ],
          },
          {
            name: 'name',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicle.vehicleType.name',
            label: 'vehiclefuellingdetails.create.vehicleType',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            defaultValue: '',
            maxLength: 128,
            minLength: 1,
            patternErrorMsg: '',
            url: '',
          },
          {
            name: 'vehicleScheduledMaintenanceDate',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicleScheduledMaintenanceDate',
            label: 'swm.create.vehicleScheduledMaintenanceDate',
            pattern: '',
            hide: true,
            type: 'datePicker',
            isRequired: false,
            isDisabled: true,
            defaultValue: '',
            patternErrorMsg: '',
            url: '',
            isStateLevel: true,
          },
          {
            name: 'actualMaintenanceDate',
            jsonPath: 'vehicleMaintenanceDetails[0].actualMaintenanceDate',
            label: 'swm.create.actualMaintenanceDate',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'costIncurred',
            jsonPath: 'vehicleMaintenanceDetails[0].costIncurred',
            label: 'swm.create.costIncurred',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },
          {
            name: 'vehicle.insuranceDetails.insuranceValidityDate',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicle.insuranceDetails.insuranceValidityDate',
            label: 'swm.create.insuranceDetails.insuranceValidityDate',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: true,
            hide: true,
            defaultValue: '',
            patternErrorMsg: '',
          },

          

          
          {
            name: 'vehicleReadingDuringMaintenance',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicleReadingDuringMaintenance',
            label: 'swm.create.vehicleReadingDuringMaintenance',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },

          {
            name: 'downtimeDefined',
            jsonPath: 'vehicleMaintenanceDetails[0].downtimeDefined',
            label: 'swm.create.DowntimeDefined',
            pattern: '',
            type: 'text',
            hide: true,
            isRequired: false,
            isDisabled: true,
            defaultValue: '',
            patternErrorMsg: '',
            url: '',
          },
           {
            name: 'downtimeforMaintenanceUom',
            jsonPath: 'vehicleMaintenanceDetails[0].downtimeforMaintenanceUom',
            label: 'swm.create.downtimeforMaintenanceUom',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            hide: true,
           /* defaultValue: [
              {
                key: 'Hrs',
                value: 'Hrs',
              },
              {
                key: 'Days',
                value: 'Days',
              },
            ],*/
            maxLength: 5,
            minLength: 3,
            patternErrorMsg: '',
          },

          {
            name: 'vehicleDowntimeActual',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicleDowntimeActual',
            label: 'swm.create.vehicleDowntimeActual',
            pattern: '',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            defaultValue: '',
            patternErrorMsg: '',
          },



          
          {
            name: 'vehicleDownTimeActualUom',
            jsonPath: 'vehicleMaintenanceDetails[0].vehicleDownTimeActualUom',
            label: 'swm.create.vehicleDownTimeActualUom',
            pattern: '',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: [
              {
                key: 'Hrs',
                value: 'Hrs',
              },
              {
                key: 'Days',
                value: 'Days',
              },
            ],
            patternErrorMsg: '',
          },
          {
            name: 'remarks',
            jsonPath: 'vehicleMaintenanceDetails[0].remarks',
            label: 'swm.Shift.create.remarks',
            pattern: '',
            type: 'textarea',
            isRequired: false,
            isDisabled: false,
            defaultValue: '',
            maxLength: 300,
            minLength: 0,
            patternErrorMsg: '',
          },
        ],
      },
    ],
    url: '/swm-services/vehiclemaintenancedetails/_update',
    tenantIdRequired: true,
    searchUrl: '/swm-services/vehiclemaintenancedetails/_search?transactionNo={transactionNo}',
  },
};
export default dat;
