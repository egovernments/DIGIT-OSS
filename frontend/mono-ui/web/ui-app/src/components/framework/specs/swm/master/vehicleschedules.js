var dat = {
   "swm.search":{
      "numCols":4,
      "useTimestamp":true,
      "objectName":"",
      "url":"/swm-services/vehicleschedules/_search",
      "title": "swm.search.page.title.VehicleSchedules",

      "groups":[
         {
            "name":"search",
            "label":"swm.create.page.title.VehicleSchedules",
            "fields":[
               {
                  "name":"scheduledFrom",
                  "jsonPath":"scheduledFrom",
                  "label":"swm.create.scheduledFrom",
                  "pattern":"",
                  "type":"datePicker",
                  "isRequired":false,
                  "isDisabled":false,
                  "defaultValue":"",
                  "patternErrorMsg":""
               },
               {
                  "name":"scheduledTo",
                  "jsonPath":"scheduledTo",
                  "label":"swm.create.scheduledTo",
                  "pattern":"",
                  "type":"datePicker",
                  "isRequired":false,
                  "isDisabled":false,
                  "defaultValue":"",
                  "patternErrorMsg":""
               },
               {
                 "name": "routeCode",
                 "jsonPath": "routeCode",
                  "label": "swm.create.route",
                  "type": "autoCompelete",
                  "isRequired": false,
                  "isDisabled": false,
                  "maxLength": 256,
                  "minLength": 1,
                  "patternErrorMsg": "",
                  "url": "swm-services/routes/_search?|$.routes.*.code|$.routes.*.name"
               },
               {
                 "name": "regNumber",
                 "jsonPath": "regNumber",
                  "label": "swm.vehicles.create.regNumber",
                  "type": "autoCompelete",
                  "isRequired": false,
                  "isDisabled": false,
                  "defaultValue": "",
                  "maxLength": 12,
                  "minLength": 6,
                  "patternErrorMsg": '',
                  "url": "swm-services/vehicles/_search?|$.vehicles.*.regNumber|$.vehicles.*.regNumber"
               },

            ]
         }
      ],
      "result":{
         "header":[
            {
               "label":"swm.create.scheduledFrom",
               "isDate": true
            },
            {
               "label":"swm.create.scheduledTo",
               "isDate": true
            },
            {
               "label": "swm.create.route"
            },
            {
               "label": "swm.vehicles.create.regNumber"
            }
         ],
         "values":[
            "scheduledFrom",
            "scheduledTo",
            "route.name",
            "vehicle.regNumber"
         ],
         "resultPath":"vehicleSchedules",
         "rowClickUrlUpdate":"/update/swm/vehicleschedules/{transactionNo}",
         "rowClickUrlView":"/view/swm/vehicleschedules/{transactionNo}"
      }
   },
   "swm.create":{
      "numCols":4,
      "useTimestamp":true,
      "idJsonPath": 'vehicleSchedules[0].transactionNo',
      "objectName":"vehicleSchedules",
      "title": "swm.create.page.title.VehicleSchedules",
      "groups":[
         {
            "name":"createVehicleSchedules",
            "fields":[
               {
                  "name":"scheduledFrom",
                  "jsonPath":"vehicleSchedules[0].scheduledFrom",
                  "label":"swm.create.scheduledFrom",
                  "pattern":"",
                  "type":"datePicker",
                  "isRequired":true,
                  "isDisabled":false,
                  "defaultValue":"",
                  "patternErrorMsg":""
               },
               {
                  "name":"scheduledTo",
                  "jsonPath":"vehicleSchedules[0].scheduledTo",
                  "label":"swm.create.scheduledTo",
                  "pattern":"",
                  "type":"datePicker",
                  "isRequired":true,
                  "isDisabled":false,
                  "defaultValue":"",
                  "patternErrorMsg":""
               },
               {
            	  "name": "route",
            	  "jsonPath": "vehicleSchedules[0].route.code",
                  "label": "swm.create.route",
                  "type": "autoCompelete",
                  "isRequired": true,
                  "isDisabled": false,
                  "maxLength": 256,
                  "minLength": 1,
                  "patternErrorMsg": "",
                  "url": "swm-services/routes/_search?|$.routes.*.code|$.routes.*.name",
                  "autoCompleteDependancy": {
                    "autoCompleteUrl": "swm-services/routes/_search?code={vehicleSchedules[0].route.code}&excludeDumpingGround=true",
                    "autoFillFields": {
                       "vehicleSchedules[0].route.collectionType.name": "routes[0].collectionType.name",
                       "vehicleSchedules[0].route.collectionPoints": "routes[0].collectionPoints"
                     },
                  },
          	   },
               {
                 "name": "regNumber",
                 "jsonPath": "vehicleSchedules[0].vehicle.regNumber",
                  "label": "swm.vehicles.create.regNumber",
                  "type": "autoCompelete",
                  "isRequired": true,
                  "isDisabled": false,
                  "maxLength": 12,
                  "minLength": 6,
                  "patternErrorMsg": '',
                  "url": "swm-services/vehicles/_search?|$.vehicles.*.regNumber|$.vehicles.*.regNumber",
                  "autoCompleteDependancy": {
                    "autoCompleteUrl": "/swm-services/vehicles/_search?regNumber={vehicleSchedules[0].vehicle.regNumber}",
                    "autoFillFields": {
                       "vehicleSchedules[0].vehicle.vehicleType.code": "vehicles[0].vehicleType.name",
                     },
                  },
               },
               {
                  'name': 'vehicleType',
                  'jsonPath': 'vehicleSchedules[0].vehicle.vehicleType.code',
                  'label': 'swm.vehicles.create.vehicleType',
                  'pattern': '',
                  'type': 'text',
                  'isRequired': false,
                  'isDisabled': true,
                  'defaultValue': '',
                  'maxLength': 128,
                  'minLength': 1,
                  'patternErrorMsg': '',
                  'url': '',
               },
               {
                 "name": "collectionType",
                 "jsonPath": "vehicleSchedules[0].route.collectionType.name",
                  "label": "swm.create.collectionType",
                  "type": "text",
                  "isRequired": false,
                  "isDisabled": true,
                  'defaultValue': '',
                  "maxLength": 256,
                  "minLength": 1,
                  "patternErrorMsg": "",
               },
               {
                  "name":"targetedGarbage",
                  "jsonPath":"vehicleSchedules[0].targetedGarbage",
                  "label":"swm.create.targetedGarbage",
                  "type":"text",
                  "isRequired":true,
                  "isDisabled":false,
                  "defaultValue":"",
                  "maxLength": 11,
                  "minLength": 1,
                  "pattern":"^[0-9]{1,11}$",
                  "patternErrMsg": 'Please enter in digits',
               }
            ]
         },
         {
           name: 'locationsCovered',
           label: 'swm.vehiclestripsheet.create.group.title.locationsCovered',
           fields: [{
             type: "tableListTemp",
             jsonPath: "vehicleSchedules[0].route.collectionPoints",
             tableList: {
               header: [{
                   label: "swm.create.sanitationstaffschedules.colletionPoint.location"
                 },
                 {
                   label: "swm.create.sanitationstaffschedules.colletionPoint.name"
                 }
               ],
               values: [
                 {
                   "type": "boundary",
                   "label": "",
                   "hierarchyType": "REVENUE",
                   "jsonPath": "vehicleSchedules[0].route.collectionPoints[0].collectionPoint.location.code",
                   "isRequired": true,
                   "patternErrorMsg": "",
                   "multiple": true,
                   "fullWidth": true,
                   "isDisabled":true,
                   "setResponseData": true,
                   "style":{
                     overflowX:"scroll"
                   }
                 },

                 // {
                 //   name: "swm.create.sanitationstaffschedules.colletionPoint.location",
                 //   pattern: "",
                 //   type: "label",
                 //   jsonPath: "vehicleSchedules[0].route.collectionPoints[0].collectionPoint.location.name",
                 //   isDisabled: true
                 // },
                 {
                   name: "swm.create.sanitationstaffschedules.colletionPoint.name",
                   pattern: "",
                   type: "text",
                   jsonPath: "vehicleSchedules[0].route.collectionPoints[0].collectionPoint.name",
                   isDisabled: true
                 }
               ],
               actionsNotRequired: true
             },
            /* hasATOAATransform: true,
             aATransformInfo: {
               to: 'vehicleSchedules[0].route.collectionPoints',
               key: 'code',
               from: 'collectionPoint.code'
             }*/
           }],
         }
      ],
      "url":"/swm-services/vehicleschedules/_create",
      "tenantIdRequired":true
   },
"swm.view":{
       beforeSetForm:`if (res &&
         _.isArray(res.vehicleSchedules) && res.vehicleSchedules[0].route.collectionPoints && res.vehicleSchedules[0].route.collectionPoints.length>0) {
           for(var i=0;i<res.vehicleSchedules[0].route.collectionPoints.length;i++)
           {
             if(res.vehicleSchedules[0].route.collectionPoints[i].dumpingGround){
                   res.vehicleSchedules[0].route.collectionPoints.splice(i,1);
             }
           }
       }`,
      "numCols":4,
      "useTimestamp":true,
      "objectName":"vehicleSchedules",
      "idJsonPath": 'vehicleSchedules[0].code',
      "groups":[
         {
            "name":"viewVehicleSchedulesView",
            "label":"swm.create.page.title.VehicleViewSchedules",
            "fields":[
               {
                  "name":"scheduledFrom",
                  "jsonPath":"vehicleSchedules[0].scheduledFrom",
                  "label":"swm.create.scheduledFrom",
                  "pattern":"",
                  "type":"datePicker",
                  "isRequired":false,
                  "isDisabled":false,
                  "defaultValue":"",
                  "patternErrorMsg":""
               },
               {
                  "name":"scheduledTo",
                  "jsonPath":"vehicleSchedules[0].scheduledTo",
                  "label":"swm.create.scheduledTo",
                  "pattern":"",
                  "type":"datePicker",
                  "isRequired":false,
                  "isDisabled":false,
                  "defaultValue":"",
                  "patternErrorMsg":""
               },
               {
                  "name": "route",
                  "jsonPath": "vehicleSchedules[0].route.name",
                  "label": "swm.create.route",
                  "type": "autoCompelete",
                  "isRequired": false,
                  "isDisabled": false,
                  "maxLength": 256,
                  "minLength": 1,
                  "patternErrorMsg": "",
                  "url": ""
               },
               {
                  "name": "regNumber",
                  "jsonPath": "vehicleSchedules[0].vehicle.regNumber",
                  "label": "swm.vehicles.create.regNumber",
                  "type": "autoCompelete",
                  "isRequired": false,
                  "isDisabled": false,
                  "defaultValue": "",
                  "maxLength": 12,
                  "minLength": 6,
                  "patternErrorMsg": '',
                  "url": ""
               },
               {
                  "name": "vehicleType",
                  "jsonPath": "vehicleSchedules[0].vehicle.vehicleType.name",
                  "label": "swm.vehicles.create.vehicleType",
                  "pattern": "",
                  "type": "text",
                  "isRequired": false,
                  "isDisabled": true,
                  "defaultValue": "",
                  "maxLength": 128,
                  "minLength": 1,
                  "patternErrorMsg": "",
                  "url": "",
               },
               {
                  "name": "collectionType",
                  "jsonPath": "vehicleSchedules[0].route.collectionType.name",
                  "label": "swm.create.collectionType",
                  "type": "text",
                  "isRequired": false,
                  "isDisabled": true,
                  "defaultValue": "",
                  "maxLength": 256,
                  "minLength": 1,
                  "patternErrorMsg": "",
               },
               {
                  "name":"targetedGarbage",
                  "jsonPath":"vehicleSchedules[0].targetedGarbage",
                  "label":"swm.create.targetedGarbage",
                  "pattern":"",
                  "type":"number",
                  "isRequired":false,
                  "isDisabled":false,
                  "defaultValue":"",
                  "patternErrMsg":""
               }
            ]
         },
         {
           name: 'locationsCovered',
           label: 'swm.vehiclestripsheet.create.group.title.locationsCovered',
           fields: [{
             type: "tableListTemp",
             jsonPath: "vehicleSchedules[0].route.collectionPoints",
             tableList: {
               header: [{
                   label: "swm.create.sanitationstaffschedules.colletionPoint.location"
                 },
                 {
                   label: "swm.create.sanitationstaffschedules.colletionPoint.name"
                 }
               ],
               values: [
                 {
                   "type": "boundary",
                   "label": "",
                   "hierarchyType": "REVENUE",
                   "jsonPath": "vehicleSchedules[0].route.collectionPoints[0].collectionPoint.location.code",
                   "isRequired": true,
                   "patternErrorMsg": "",
                   "multiple": true,
                   "fullWidth": true,
                   "isDisabled":true
                 },

                 // {
                 //   name: "swm.create.sanitationstaffschedules.colletionPoint.location",
                 //   pattern: "",
                 //   type: "label",
                 //   jsonPath: "vehicleSchedules[0].route.collectionPoints[0].collectionPoint.location.name",
                 //   isDisabled: true
                 // },
                 {
                   name: "swm.create.sanitationstaffschedules.colletionPoint.name",
                   pattern: "",
                   type: "text",
                   jsonPath: "vehicleSchedules[0].route.collectionPoints[0].collectionPoint.name",
                   isDisabled: true
                 }
               ],
               actionsNotRequired: true
             },
             hasATOAATransform: true,
             aATransformInfo: {
               to: 'vehicleSchedules[0].route.collectionPoints',
               key: 'code',
               from: 'collectionPoint.code'
             }
           }],
         }
      ],
      "tenantIdRequired":true,
      "url":"/swm-services/vehicleschedules/_search?transactionNo={transactionNo}",
   },
"swm.update":{
       beforeSetForm:`if (res &&
         _.isArray(res.vehicleSchedules) && res.vehicleSchedules[0].route.collectionPoints && res.vehicleSchedules[0].route.collectionPoints.length>0) {
           for(var i=0;i<res.vehicleSchedules[0].route.collectionPoints.length;i++)
           {
             if(res.vehicleSchedules[0].route.collectionPoints[i].dumpingGround){
                   res.vehicleSchedules[0].route.collectionPoints.splice(i,1);
             }
           }
       }`,
      "numCols":4,
      "useTimestamp":true,
      "objectName":"vehicleSchedules",
      "idJsonPath": 'vehicleSchedules[0].code',
      title:"swm.create.page.title.VehicleSchedules",
      "groups":[
         {
            "name":"updateVehicle",
            "label":"swm.create.page.title.VehicleSchedules",
            "fields":[
               {
                  "name":"scheduledFrom",
                  "jsonPath":"vehicleSchedules[0].scheduledFrom",
                  "label":"swm.create.scheduledFrom",
                  "pattern":"",
                  "type":"datePicker",
                  "isRequired":true,
                  "isDisabled":false,
                  "defaultValue":"",
                  "patternErrorMsg":""
               },
               {
                  "name":"scheduledTo",
                  "jsonPath":"vehicleSchedules[0].scheduledTo",
                  "label":"swm.create.scheduledTo",
                  "pattern":"",
                  "type":"datePicker",
                  "isRequired":true,
                  "isDisabled":false,
                  "defaultValue":"",
                  "patternErrorMsg":""
               },
               {
                  "name": "route",
                  "jsonPath": "vehicleSchedules[0].route.code",
                  "label": "swm.create.route",
                  "type": "autoCompelete",
                  "isRequired": true,
                  "isDisabled": false,
                  "maxLength": 256,
                  "minLength": 1,
                  "patternErrorMsg": "",
                  "url": "swm-services/routes/_search?|$.routes.*.code|$.routes.*.name",
                  "autoCompleteDependancy": {
                    "autoCompleteUrl": "swm-services/routes/_search?code={vehicleSchedules[0].route.code}&excludeDumpingGround=true",
                    "autoFillFields": {
                       "vehicleSchedules[0].route.collectionType.name": "routes[0].collectionType.name",
                       "vehicleSchedules[0].route.collectionPoints": "routes[0].collectionPoints"
                     },
                  },
               },
               {
                  "name": "regNumber",
                  "jsonPath": "vehicleSchedules[0].vehicle.regNumber",
                  "label": "swm.vehicles.create.regNumber",
                  "type": "autoCompelete",
                  "isRequired": true,
                  "isDisabled": false,
                  "defaultValue": "",
                  "maxLength": 12,
                  "minLength": 6,
                  "patternErrorMsg": '',
                  "url": "swm-services/vehicles/_search?|$.vehicles.*.regNumber|$.vehicles.*.regNumber",
                  "autoCompleteDependancy": {
                    "autoCompleteUrl": "/swm-services/vehicles/_search?regNumber={vehicleSchedules[0].vehicle.regNumber}",
                    "autoFillFields": {
                       "vehicleSchedules[0].vehicle.vehicleType.name": "vehicles[0].vehicleType.name",
                     },
                  },
               },
               {
                  'name': 'vehicleType',
                  'jsonPath': 'vehicleSchedules[0].vehicle.vehicleType.name',
                  'label': 'swm.vehicles.create.vehicleType',
                  'pattern': '',
                  'type': 'text',
                  'isRequired': false,
                  'isDisabled': true,
                  'defaultValue': '',
                  'maxLength': 128,
                  'minLength': 1,
                  'patternErrorMsg': '',
                  'url': '',
               },
               {
                  "name": "collectionType",
                  "jsonPath": "vehicleSchedules[0].route.collectionType.name",
                  "label": "swm.create.collectionType",
                  "type": "text",
                  "isRequired": false,
                  "isDisabled": true,
                  'defaultValue': '',
                  "maxLength": 256,
                  "minLength": 1,
                  "patternErrorMsg": "",
               },
               {
                  "name":"targetedGarbage",
                  "jsonPath":"vehicleSchedules[0].targetedGarbage",
                  "label":"swm.create.targetedGarbage",
                  "pattern":"^[0-9]{1,11}$",
                  "type":"text",
                  "isRequired":true,
                  "isDisabled":false,
                  "defaultValue":"",
                  "maxLength": 11,
                  "minLength": 1,
                  "pattern":'',
                  "patternErrMsg": 'Please enter in digits',
               }
            ]
         },
         {
           name: 'locationsCovered',
           label: 'swm.vehiclestripsheet.create.group.title.locationsCovered',
           fields: [{
             type: "tableListTemp",
             jsonPath: "vehicleSchedules[0].route.collectionPoints",
             tableList: {
               header: [{
                   label: "swm.create.sanitationstaffschedules.colletionPoint.location"
                 },
                 {
                   label: "swm.create.sanitationstaffschedules.colletionPoint.name"
                 }
               ],
               values: [
                 {
                   "type": "boundary",
                   "label": "",
                   "hierarchyType": "REVENUE",
                   "jsonPath": "vehicleSchedules[0].route.collectionPoints[0].collectionPoint.location.code",
                   "isRequired": true,
                   "patternErrorMsg": "",
                   "multiple": true,
                   "fullWidth": true,
                   "isDisabled":true,
                   "style":{
                     overflowX:"scroll"
                   }
                 },

                // {
                //   name: "swm.create.sanitationstaffschedules.colletionPoint.location",
                //   pattern: "",
                //   type: "label",
                //   jsonPath: "vehicleSchedules[0].route.collectionPoints[0].collectionPoint.location.name",
                //   isDisabled: true
                // },
                {
                  name: "swm.create.sanitationstaffschedules.colletionPoint.name",
                  pattern: "",
                  type: "text",
                  jsonPath: "vehicleSchedules[0].route.collectionPoints[0].collectionPoint.name",
                  isDisabled: true
                }
              ],
              actionsNotRequired: true
            },
           /* hasATOAATransform: true,
            aATransformInfo: {
              to: 'vehicleSchedules[0].route.collectionPoints',
              key: 'code',
              from: 'collectionPoint.code'
            }*/
          }],
         }
      ],
      "url":"/swm-services/vehicleschedules/_update",
      "tenantIdRequired":true,
      "searchUrl":"/swm-services/vehicleschedules/_search?transactionNo={transactionNo}",
   },
};
export default dat;
