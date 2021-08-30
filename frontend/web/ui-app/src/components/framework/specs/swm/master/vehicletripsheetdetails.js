var dat = {
  "swm.search": {
    numCols: 4,
    useTimestamp: true,
    objectName: "vehicleTripSheetDetails",
    url: "/swm-services/vehicletripsheetdetails/_search",
    title: 'swm.search.page.title.vehicletripsheetdetails',
    groups: [
    {
      name: "vehicleTripEntrySearch",
      label: "swm.vehiclestripsheet.search.vehicleTripEntrySearch",
      fields: [{
          name: "regNumber",
          jsonPath: "regNumber",
          label: "swm.vehiclestripsheet.create.regNumber",
          pattern: "",
          type: "autoCompelete",
          isRequired: false,
          isDisabled: false,
          defaultValue: "",
          patternErrorMsg: "",
          url: "swm-services/vehicles/_search?|$.vehicles.*.regNumber|$.vehicles.*.regNumber"
        },
        {
          name: "routeName",
          jsonPath: "routeCode",
          label: "swm.vehiclestripsheet.search.routeName",
          pattern: "",
          type: "autoCompelete",
          isRequired: false,
          isDisabled: false,
          defaultValue: "",
          patternErrorMsg: "",
          url: "/swm-services/routes/_search?|$.routes.*.code|$.routes.*.name"
        },
        {
          name: " tripStartdate",
          jsonPath: "tripStartDate",
          label: "swm.vehiclestripsheet.search.tripStartDate",
          pattern: "",
          type: "datePicker",
          isRequired: false,
          isDisabled: false,
          defaultValue: "",
          url: ""
        },
        {
          name: "tripEndDate",
          jsonPath: "tripEndDate",
          label: "swm.vehiclestripsheet.search.tripEndDate",
          pattern: "",
          type: "datePicker",
          isRequired: false,
          isDisabled: false,
          defaultValue: "",
          patternErrorMsg: "",
          url: ""
        }
      ]
    }],
    result: {
      header: [{
          label: "swm.vehiclestripsheet.create.regNumber"
        },
        {
          label: "swm.vehiclestripsheet.search.routeName"
        },
        {
          label: "swm.vehiclestripsheet.search.tripStartDate",
          isDate: true
        },
        {
          label: "swm.vehiclestripsheet.search.tripEndDate",
          isDate: true
        },
        {
          label: "swm.vehiclestripsheet.search.wieght",
        }
      ],
      values: [
        "vehicle.regNumber",
        "route.name",
        "tripStartDate",
        "tripEndDate",
        "garbageWeight"
      ],
      resultPath: "vehicleTripSheetDetails",
      rowClickUrlUpdate: "/update/swm/vehicletripsheetdetails/{tripNo}",
      rowClickUrlView: "/view/swm/vehicletripsheetdetails/{tripNo}"
      //isMasterScreen: true
    }
  },
  "swm.create": {
    beforeHandleChange:`if((property=="vehicleTripSheetDetails[0].route.code") && ((formData.vehicleTripSheetDetails[0].vehicle && !formData.vehicleTripSheetDetails[0].vehicle.regNumber) || !formData.vehicleTripSheetDetails[0].tripStartDate ||  !formData.vehicleTripSheetDetails[0].tripEndDate))
    {
      alert("Please enter values for Vehicle Registration No, Scheduled Date From and Scheduled Date To before selecting route");
      shouldHandleChange=false;
    }
    `,
    beforeSubmit: `
    var oneDay = 24*60*60*1000;
    var startDate=new Date(formData.vehicleTripSheetDetails[0].tripStartDate);
    var toDate=new Date(formData.vehicleTripSheetDetails[0].tripEndDate);
    var curDate=new Date();
    var result=(startDate.getDate()==curDate.getDate() && startDate.getMonth()==curDate.getMonth() && startDate.getYear()==curDate.getYear());
    if(result)
    {
      var endDate = (toDate.getDate()==curDate.getDate() && toDate.getMonth()==curDate.getMonth() && toDate.getYear()==curDate.getYear());
      if(!endDate){
        alert("Please Select To date as Current Date");
        shouldSubmit=false;
      }
    }
    
    if(formData.vehicleTripSheetDetails[0].tripEndDate<formData.vehicleTripSheetDetails[0].tripStartDate || Math.round(Math.abs((formData.vehicleTripSheetDetails[0].tripEndDate - formData.vehicleTripSheetDetails[0].tripStartDate)/(oneDay)))>1)
    {
      alert("The difference between from date and to date should be less than 1 day");
      shouldSubmit=false;
    }
    if(formData.vehicleTripSheetDetails[0].route.dumpingGround && 
      formData.vehicleTripSheetDetails[0].route.dumpingGround.name && 
      (!formData.vehicleTripSheetDetails[0].inTime || 
        !formData.vehicleTripSheetDetails[0].outTime || 
        !parseFloat(formData.vehicleTripSheetDetails[0].entryWeight) || 
        !parseFloat(formData.vehicleTripSheetDetails[0].exitWeight)))
    {
      alert("Please enter values for In Time, Out Time, Entry Weight and Exit Weight");
      shouldSubmit=false;
    }
    if(parseFloat(formData.vehicleTripSheetDetails[0].entryWeight)<parseFloat(formData.vehicleTripSheetDetails[0].exitWeight))
    {
      alert("Entry weight should be greatet than exit weight");
      shouldSubmit=false;
    }
    if(parseFloat(formData.vehicleTripSheetDetails[0].garbageWeight)>parseFloat(formData.vehicleTripSheetDetails[0].route.totalGarbageEstimateTwo))
    {
      alert("Total weight of garbage should equal or less than DumpingGround Capacity of value " + formData.vehicleTripSheetDetails[0].route.totalGarbageEstimateTwo);
      shouldSubmit=false;
    }

    if(formData && _.isArray(formData.vehicleTripSheetDetails)){
      if(formData.vehicleTripSheetDetails[0].entryWeight && formData.vehicleTripSheetDetails[0].exitWeight){
        var garbage = (formData.vehicleTripSheetDetails[0].entryWeight) - (formData.vehicleTripSheetDetails[0].exitWeight);
        if(garbage.toString().split('.')[1] && garbage.toString().split('.')[1].length>2){
          formData.vehicleTripSheetDetails[0].garbageWeight = garbage.toFixed(2);
        }
      }
    }

    `,
    numCols: 4,
    useTimestamp: true,
    objectName: "vehicleTripSheetDetails",
    idJsonPath: "vehicleTripSheetDetails[0].tripNo",
    title: 'swm.vehiclestripsheet.create.title',
    groups: [
      {
        name: "VehicleDetails",
        label: "",
        fields: [{
            name: "regNumber",
            jsonPath: "vehicleTripSheetDetails[0].vehicle.regNumber",
            label: "swm.vehiclestripsheet.create.regNumber",
            type: "autoCompelete",
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: "",
            url: "swm-services/vehicles/_search?|$.vehicles.*.regNumber|$.vehicles.*.regNumber",
            autoCompleteDependancy: {
              autoCompleteUrl: "/swm-services/vehicles/_search?regNumber={vehicleTripSheetDetails[0].vehicle.regNumber}",
              autoFillFields: {
                "vehicleTripSheetDetails[0].vehicle.vendor.name": "vehicles[0].vendor.name"
              }
            },
            defaultValue: "",
            depedants: [
              {
                jsonPath: "vehicleTripSheetDetails[0].route.code",
                type: "dropDown",
                pattern:
                  "/swm-services/vehicleschedules/_search?tenantId=default&fromTripSheet=true&regNumber={vehicleTripSheetDetails[0].vehicle.regNumber}&scheduledFrom={vehicleTripSheetDetails[0].tripStartDate}&scheduledTo={vehicleTripSheetDetails[0].tripEndDate}|$.vehicleSchedules[*].route.code|$.vehicleSchedules[*].route.name"
              }
            ]
          },
          {
            name: "ulbOwnedVehicle",
            dependentJsonPath: "vehicleTripSheetDetails[0].vehicle.vendor.name",
            label: "swm.vehiclestripsheet.create.ulbOwnedVehicle",
            type: "checkbox",
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: ""
          },
          {
            name: "vendorName",
            jsonPath: "vehicleTripSheetDetails[0].vehicle.vendor.name",
            label: "swm.vehiclestripsheet.create.vendorName",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: ""
          },
          {
              name: "scheduledDateFrom",
              jsonPath: "vehicleTripSheetDetails[0].tripStartDate",
              label: "swm.vehiclestripsheet.create.scheduledDateFrom",
              type: "datePicker",
              isRequired: true,
              isDisabled: false,
              patternErrorMsg: "",
              maxDate: 'today',
              depedants: [
                {
                  jsonPath: "vehicleTripSheetDetails[0].route.code",
                  type: "dropDown",
                  pattern:
                    "/swm-services/vehicleschedules/_search?tenantId=default&fromTripSheet=true&regNumber={vehicleTripSheetDetails[0].vehicle.regNumber}&scheduledFrom={vehicleTripSheetDetails[0].tripStartDate}&scheduledTo={vehicleTripSheetDetails[0].tripEndDate}|$.vehicleSchedules[*].route.code|$.vehicleSchedules[*].route.name",

                }
              ]
            },
            {
              name: "scheduledDateTo",
              jsonPath: "vehicleTripSheetDetails[0].tripEndDate",
              label: "swm.vehiclestripsheet.create.scheduledDateTo",
              type: "datePicker",
              isRequired: true,
              isDisabled: false,
              patternErrorMsg: "",
              maxDate: 'today',
              depedants: [
                {
                  jsonPath: "vehicleTripSheetDetails[0].route.code",
                  type: "dropDown",
                  pattern:
                    "/swm-services/vehicleschedules/_search?tenantId=default&fromTripSheet=true&regNumber={vehicleTripSheetDetails[0].vehicle.regNumber}&scheduledFrom={vehicleTripSheetDetails[0].tripStartDate}&scheduledTo={vehicleTripSheetDetails[0].tripEndDate}|$.vehicleSchedules[*].route.code|$.vehicleSchedules[*].route.name"

                }
              ]
            },
          {
            name: "route",
            jsonPath: "vehicleTripSheetDetails[0].route.code",
            label: "swm.vehiclestripsheet.create.route",
            type: "singleValueList",
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: "",
            url: "",//swm-services/routes/_search?|$.routes.*.code|$.routes.*.name
            autoCompleteDependancy: [{
                autoCompleteUrl: "/swm-services/routes/_search?code={vehicleTripSheetDetails[0].route.code}&excludeDumpingGround=true",
                autoFillFields: {
                  "vehicleTripSheetDetails[0].route.collectionType.name": "routes[0].collectionType.name",
                  "vehicleTripSheetDetails[0].route.collectionPoints": "routes[0].collectionPoints",
                  "vehicleTripSheetDetails[0].route.totalDistance": "routes[0].totalDistance",
                  "vehicleTripSheetDetails[0].route.totalGarbageEstimate": "routes[0].totalGarbageEstimate"
                }
              },
              {
                autoCompleteUrl: "/swm-services/routes/_search?code={vehicleTripSheetDetails[0].route.code}&isEndingDumpingGround=true",
                autoFillFields: {
                  "vehicleTripSheetDetails[0].route.dumpingGround.name": "routes[0].collectionPoints[0].dumpingGround.name",
                  "vehicleTripSheetDetails[0].route.totalGarbageEstimateTwo": "routes[0].collectionPoints[0].dumpingGround.siteDetails.capacity"
                }
              }
            ]
            // url:'swm-services/routes/_search?|$.routes.*.code|$.routes.*.name',
            // autoCompleteDependancy: {
            //   autoCompleteUrl: '/swm-services/routes/_search?code={vehicleTripSheetDetails[0].route.code}',
            //   autoFillFields: {
            //     'vehicleTripSheetDetails[0].dumpingGroundName': ''
            //   },
            // },
          },
          {
            name: "dumpingGroundName",
            jsonPath: "vehicleTripSheetDetails[0].route.dumpingGround.name",
            label: "swm.vehiclestripsheet.create.dumpingGroundName",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: ""
          },
          {
            name: "totalDistanceCovered",
            jsonPath: "vehicleTripSheetDetails[0].route.totalDistance",
            label: "swm.vehiclestripsheet.create.totalDistanceCovered",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: "",
            defaultValue: ""
          },
          {
            name: "collectionType",
            jsonPath: "vehicleTripSheetDetails[0].route.collectionType.name",
            label: "swm.vehiclestripsheet.create.collectionType",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: "",
            defaultValue: ""
          },
          {
            name: "totalGarbageEstimate",
            jsonPath: "vehicleTripSheetDetails[0].route.totalGarbageEstimate",
            label: "swm.vehiclestripsheet.create.totalGarbageEstimate",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: "",
            defaultValue: ""
          },
          {
            name: "totalGarbageEstimateTwo",
            jsonPath: "vehicleTripSheetDetails[0].route.totalGarbageEstimateTwo",
            label: "swm.vehiclestripsheet.create.totalGarbageEstimateTwo",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: "",
            defaultValue: "",
            isHidden:true,
            hide:true
          }
        ]
      },
      {
        name: 'locationsCovered',
        label: 'swm.vehiclestripsheet.create.group.title.locationsCovered',
        fields: [{
          type: "tableListTemp",
          jsonPath: "vehicleTripSheetDetails[0].route.collectionPoints",
          tableList: {
            header: [{
                label: "swm.create.sanitationstaffschedules.colletionPoint.location"
              },
              {
                label: "swm.create.sanitationstaffschedules.colletionPoint.name"
              }
            ],
            values: [{
              "type": "boundary",
              "label": "",
              "hierarchyType": "REVENUE",
              "jsonPath": "vehicleTripSheetDetails[0].route.collectionPoints[0].collectionPoint.location.code",
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
          //   type: "text",
          //   jsonPath: "vehicleTripSheetDetails[0].route.collectionPoints[0].collectionPoint.location.name",
          //   isDisabled: true
          // },
              {
                name: "swm.create.sanitationstaffschedules.colletionPoint.name",
                pattern: "",
                type: "text",
                jsonPath: "vehicleTripSheetDetails[0].route.collectionPoints[0].collectionPoint.name",
                isDisabled: true
              }
            ],
            actionsNotRequired: true
          },
          hasATOAATransform: true,
          aATransformInfo: {
            to: 'vehicleTripSheetDetails[0].collectionPoints',
            key: 'code',
            from: 'collectionPoint.code'
          }
        }],
      },
      {
        name: "tripSheetDetails",
        label: "swm.vehiclestripsheet.create.group.title.tripSheetDetails",
        fields: [
          {
            name: "inTime",
            jsonPath: "vehicleTripSheetDetails[0].inTime",
            label: "swm.vehiclestripsheet.create.inTime",
            type: "timePicker",
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: "",
            defaultValue: ""
          },
          {
            name: "outTime",
            jsonPath: "vehicleTripSheetDetails[0].outTime",
            label: "swm.vehiclestripsheet.create.outTime",
            type: "timePicker",
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: "",
            defaultValue: ""
          },
          {
            name: "entryWeight",
            jsonPath: "vehicleTripSheetDetails[0].entryWeight",
            label: "swm.vehiclestripsheet.create.entryWeight",
            type: "text",
            isRequired: false,
            isDisabled: false,
            patternErrMsg: "",
            defaultValue: "",
            depedants: [{
              jsonPath: "vehicleTripSheetDetails[0].garbageWeight",
              type: "textField",
              pattern: "`${parseFloat(getVal('vehicleTripSheetDetails[0].entryWeight')) && parseFloat(getVal('vehicleTripSheetDetails[0].exitWeight')) ? (parseFloat(getVal('vehicleTripSheetDetails[0].entryWeight')) - parseFloat(getVal('vehicleTripSheetDetails[0].exitWeight'))).toFixed(2):0}`",
              rg: "",
              isRequired: false,
              requiredErrMsg: "",
              patternErrMsg: ""
            }]
          },
          {
            name: "exitWeight",
            jsonPath: "vehicleTripSheetDetails[0].exitWeight",
            label: "swm.vehiclestripsheet.create.exitWeight",
            type: "text",
            isRequired: false,
            isDisabled: false,
            patternErrMsg: "",
            defaultValue: "",
            depedants: [{
              jsonPath: "vehicleTripSheetDetails[0].garbageWeight",
              type: "textField",
              pattern: "`${parseFloat(getVal('vehicleTripSheetDetails[0].entryWeight')) && parseFloat(getVal('vehicleTripSheetDetails[0].exitWeight')) ? (parseFloat(getVal('vehicleTripSheetDetails[0].entryWeight')) - parseFloat(getVal('vehicleTripSheetDetails[0].exitWeight'))).toFixed(2):0}`",
              rg: "",
              isRequired: false,
              requiredErrMsg: "",
              patternErrMsg: ""
            }]
          },
          {
            name: "garbageWeight",
            jsonPath: "vehicleTripSheetDetails[0].garbageWeight",
            label: "swm.vehiclestripsheet.create.garbageWeight",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: "",
            defaultValue: ""
          }
        ]
      }
    ],
    url: "/swm-services/vehicletripsheetdetails/_create",
    tenantIdRequired: true
  },
  "swm.update": {
    beforeHandleChange:`if((property=="vehicleTripSheetDetails[0].route.code") && (!formData.vehicleTripSheetDetails[0].vehicle.regNumber || !formData.vehicleTripSheetDetails[0].tripStartDate ||  !formData.vehicleTripSheetDetails[0].tripEndDate))
    {
      alert("Please enter values for Vehicle Registration No, Scheduled Date From and Scheduled Date To before selecting route");
      shouldHandleChange=false;
    }
    `,
    beforeSetForm:`if (res &&
      _.isArray(res.vehicleTripSheetDetails) && res.vehicleTripSheetDetails[0].route.collectionPoints && res.vehicleTripSheetDetails[0].route.collectionPoints.length>0) {
        for(var i=0;i<res.vehicleTripSheetDetails[0].route.collectionPoints.length;i++)
        {
          if(res.vehicleTripSheetDetails[0].route.collectionPoints[i].dumpingGround){
            res.vehicleTripSheetDetails[0].route.dumpingGround={};
            res.vehicleTripSheetDetails[0].route.dumpingGround.name=res.vehicleTripSheetDetails[0].route.collectionPoints[i].dumpingGround.name;
            res.vehicleTripSheetDetails[0].route.totalGarbageEstimateTwo=res.vehicleTripSheetDetails[0].route.collectionPoints[i].dumpingGround.siteDetails.capacity;
            res.vehicleTripSheetDetails[0].route.collectionPoints.splice(i,1)
          }
        }
    }
    
    if(res && _.isArray(res.vehicleTripSheetDetails)){
      if(res.vehicleTripSheetDetails[0].entryWeight && res.vehicleTripSheetDetails[0].exitWeight){
        var garbage = (res.vehicleTripSheetDetails[0].entryWeight) - (res.vehicleTripSheetDetails[0].exitWeight);
        if(garbage.toString().split('.')[1] && garbage.toString().split('.')[1].length>2){
          res.vehicleTripSheetDetails[0].garbageWeight = garbage.toFixed(2);
        }
      }
    }
    `,
    beforeSubmit: `var oneDay = 24*60*60*1000;
    var startDate=new Date(formData.vehicleTripSheetDetails[0].tripStartDate);
    var toDate=new Date(formData.vehicleTripSheetDetails[0].tripEndDate);
    var curDate=new Date();
    var result=(startDate.getDate()==curDate.getDate() && startDate.getMonth()==curDate.getMonth() && startDate.getYear()==curDate.getYear());
    if(result)
    {
      var endDate = (toDate.getDate()==curDate.getDate() && toDate.getMonth()==curDate.getMonth() && toDate.getYear()==curDate.getYear());
      if(!endDate){
        alert("Please Select To date as Current Date");
        shouldSubmit=false;
      }
    }
    if(formData.vehicleTripSheetDetails[0].tripEndDate<formData.vehicleTripSheetDetails[0].tripStartDate || Math.round(Math.abs((formData.vehicleTripSheetDetails[0].tripEndDate - formData.vehicleTripSheetDetails[0].tripStartDate)/(oneDay)))>1)
    {
      alert("The difference between from date and to date should be less than 1 day");
      shouldSubmit=false;
    }
    if(formData.vehicleTripSheetDetails[0].route.dumpingGround && formData.vehicleTripSheetDetails[0].route.dumpingGround.name && (!formData.vehicleTripSheetDetails[0].inTime || !formData.vehicleTripSheetDetails[0].outTime || !parseFloat(formData.vehicleTripSheetDetails[0].entryWeight) || !parseFloat(formData.vehicleTripSheetDetails[0].exitWeight)))
    {
      alert("Please enter values for In Time, Out Time, Entry Weight and Exit Weight");
      shouldSubmit=false;
    }
    if(parseFloat(formData.vehicleTripSheetDetails[0].entryWeight)<parseFloat(formData.vehicleTripSheetDetails[0].exitWeight))
    {
      alert("Entry weight should be greater than exit weight");
      shouldSubmit=false;
    }
    if(parseFloat(formData.vehicleTripSheetDetails[0].garbageWeight)>parseFloat(formData.vehicleTripSheetDetails[0].route.totalGarbageEstimateTwo))
    {
      alert("Total weight of garbage should equal or lessthan dumping ground capacity");
      shouldSubmit=false;
    }
    `,
    numCols: 4,
    useTimestamp: true,
    objectName: "vehicleTripSheetDetails",
    title: 'swm.vehiclestripsheet.create.title',
    idJsonPath: "vehicleTripSheetDetails[0].tripNo",
    groups: [{
        name: "VehicleDetails",
        label: "",
        fields: [{
            name: "regNumber",
            jsonPath: "vehicleTripSheetDetails[0].vehicle.regNumber",
            label: "swm.vehiclestripsheet.create.regNumber",
            type: "autoCompelete",
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: "",
            url: "swm-services/vehicles/_search?|$.vehicles.*.regNumber|$.vehicles.*.regNumber",
            autoCompleteDependancy: {
              autoCompleteUrl: "/swm-services/vehicles/_search?regNumber={vehicleTripSheetDetails[0].vehicle.regNumber}",
              autoFillFields: {
                "vehicleTripSheetDetails[0].vehicle.vendor.name": "vehicles[0].vendor.name"
              }
            },
            depedants: [
              {
                jsonPath: "vehicleTripSheetDetails[0].route.code",
                type: "dropDown",
                pattern:
                  "/swm-services/vehicleschedules/_search?tenantId=default&fromTripSheet=true&regNumber={vehicleTripSheetDetails[0].vehicle.regNumber}&scheduledFrom={vehicleTripSheetDetails[0].tripStartDate}&scheduledTo={vehicleTripSheetDetails[0].tripEndDate}|$.vehicleSchedules[*].route.code|$.vehicleSchedules[*].route.name"
              }
            ]
          },
          {
            name: "ulbOwnedVehicle",
            dependentJsonPath: "vehicleTripSheetDetails[0].vehicle.vendor.name",
            label: "swm.vehiclestripsheet.create.ulbOwnedVehicle",
            type: "checkbox",
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: ""
          },
          {
            name: "vendorName",
            jsonPath: "vehicleTripSheetDetails[0].vehicle.vendor.name",
            label: "swm.vehiclestripsheet.create.vendorName",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: ""
          },
          {
              name: "scheduledDateFrom",
              jsonPath: "vehicleTripSheetDetails[0].tripStartDate",
              label: "swm.vehiclestripsheet.create.scheduledDateFrom",
              type: "datePicker",
              isRequired: true,
              isDisabled: false,
              patternErrorMsg: "",
              depedants: [
                {
                  jsonPath: "vehicleTripSheetDetails[0].route.code",
                  type: "dropDown",
                  pattern:
                    "/swm-services/vehicleschedules/_search?tenantId=default&fromTripSheet=true&regNumber={vehicleTripSheetDetails[0].vehicle.regNumber}&scheduledFrom={vehicleTripSheetDetails[0].tripStartDate}&scheduledTo={vehicleTripSheetDetails[0].tripEndDate}|$.vehicleSchedules[*].route.code|$.vehicleSchedules[*].route.name"
                }
              ]
            },
            {
              name: "scheduledDateTo",
              jsonPath: "vehicleTripSheetDetails[0].tripEndDate",
              label: "swm.vehiclestripsheet.create.scheduledDateTo",
              type: "datePicker",
              isRequired: true,
              isDisabled: false,
              patternErrorMsg: "",
              maxDate: 'today',
              depedants: [
                {
                  jsonPath: "vehicleTripSheetDetails[0].route.code",
                  type: "dropDown",
                  pattern:
                    "/swm-services/vehicleschedules/_search?tenantId=default&fromTripSheet=true&regNumber={vehicleTripSheetDetails[0].vehicle.regNumber}&scheduledFrom={vehicleTripSheetDetails[0].tripStartDate}&scheduledTo={vehicleTripSheetDetails[0].tripEndDate}|$.vehicleSchedules[*].route.code|$.vehicleSchedules[*].route.name"
                }
              ]
            },
          {
            name: "route",
            jsonPath: "vehicleTripSheetDetails[0].route.code",
            label: "swm.vehiclestripsheet.create.route",
            type: "singleValueList",
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: "",
            maxDate: 'today',
            url: "swm-services/routes/_search?|$.routes.*.code|$.routes.*.name",
            autoCompleteDependancy: [{
                autoCompleteUrl: "/swm-services/routes/_search?code={vehicleTripSheetDetails[0].route.code}&excludeDumpingGround=true",
                autoFillFields: {
                  "vehicleTripSheetDetails[0].route.collectionType.name": "routes[0].collectionType.name",
                  "vehicleTripSheetDetails[0].route.collectionPoints": "routes[0].collectionPoints",
                  "vehicleTripSheetDetails[0].route.totalDistance": "routes[0].totalDistance",
                  "vehicleTripSheetDetails[0].route.totalGarbageEstimate": "routes[0].totalGarbageEstimate"
                }
              },
              {
                autoCompleteUrl: "/swm-services/routes/_search?code={vehicleTripSheetDetails[0].route.code}&isEndingDumpingGround=true",
                autoFillFields: {
                  "vehicleTripSheetDetails[0].route.dumpingGround.name": "routes[0].collectionPoints[0].dumpingGround.name",
                  "vehicleTripSheetDetails[0].route.totalGarbageEstimateTwo": "routes[0].collectionPoints[0].dumpingGround.siteDetails.capacity"
                }
              }
            ]
            // url:'swm-services/routes/_search?|$.routes.*.code|$.routes.*.name',
            // autoCompleteDependancy: {
            //   autoCompleteUrl: '/swm-services/routes/_search?code={vehicleTripSheetDetails[0].route.code}',
            //   autoFillFields: {
            //     'vehicleTripSheetDetails[0].dumpingGroundName': ''
            //   },
            // },
          },
          {
            name: "dumpingGroundName",
            jsonPath: "vehicleTripSheetDetails[0].route.dumpingGround.name",
            label: "swm.vehiclestripsheet.create.dumpingGroundName",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: ""
          },
          {
            name: "totalDistanceCovered",
            jsonPath: "vehicleTripSheetDetails[0].route.totalDistance",
            label: "swm.vehiclestripsheet.create.totalDistanceCovered",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: "",
            defaultValue: ""
          },
          {
            name: "collectionType",
            jsonPath: "vehicleTripSheetDetails[0].route.collectionType.name",
            label: "swm.vehiclestripsheet.create.collectionType",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: "",
            defaultValue: ""
          },
          {
            name: "totalGarbageEstimate",
            jsonPath: "vehicleTripSheetDetails[0].route.totalGarbageEstimate",
            label: "swm.vehiclestripsheet.create.totalGarbageEstimate",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: "",
            defaultValue: ""
          },
          {
            name: "totalGarbageEstimateTwo",
            jsonPath: "vehicleTripSheetDetails[0].route.totalGarbageEstimateTwo",
            label: "swm.vehiclestripsheet.create.totalGarbageEstimateTwo",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: "",
            defaultValue: "",
            isHidden:true,
            hide:true
          }
        ]
      },
      {
        name: 'locationsCovered',
        label: 'swm.vehiclestripsheet.create.group.title.locationsCovered',
        fields: [{
          type: "tableListTemp",
          jsonPath: "vehicleTripSheetDetails[0].route.collectionPoints",
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
                "jsonPath": "vehicleTripSheetDetails[0].route.collectionPoints[0].collectionPoint.location.code",
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
              //   type: "text",
              //   jsonPath: "vehicleTripSheetDetails[0].route.collectionPoints[0].collectionPoint.location.name",
              //   isDisabled: true
              // },
              {
                name: "swm.create.sanitationstaffschedules.colletionPoint.name",
                pattern: "",
                type: "text",
                jsonPath: "vehicleTripSheetDetails[0].route.collectionPoints[0].collectionPoint.name",
                isDisabled: true
              }
            ],
            actionsNotRequired: true
          },
          hasATOAATransform: true,
          aATransformInfo: {
            to: 'vehicleTripSheetDetails[0].collectionPoints',
            key: 'code',
            from: 'collectionPoint.code'
          }
        }],
      },
      {
        name: "tripSheetDetails",
        label: "swm.vehiclestripsheet.create.group.title.tripSheetDetails",
        fields: [
          {
            name: "inTime",
            jsonPath: "vehicleTripSheetDetails[0].inTime",
            label: "swm.vehiclestripsheet.create.inTime",
            type: "timePicker",
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: "",
            defaultValue: ""
          },
          {
            name: "outTime",
            jsonPath: "vehicleTripSheetDetails[0].outTime",
            label: "swm.vehiclestripsheet.create.outTime",
            type: "timePicker",
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: "",
            defaultValue: ""
          },
          {
            name: "entryWeight",
            jsonPath: "vehicleTripSheetDetails[0].entryWeight",
            label: "swm.vehiclestripsheet.create.entryWeight",
            type: "text",
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: "",
            defaultValue: "",
            depedants: [{
              jsonPath: "vehicleTripSheetDetails[0].garbageWeight",
              type: "textField",
              pattern: "`${parseFloat(getVal('vehicleTripSheetDetails[0].entryWeight')) && parseFloat(getVal('vehicleTripSheetDetails[0].exitWeight')) ? (parseFloat(getVal('vehicleTripSheetDetails[0].entryWeight')) - parseFloat(getVal('vehicleTripSheetDetails[0].exitWeight'))).toFixed(2):0}`",
              rg: "",
              isRequired: false,
              requiredErrMsg: "",
              patternErrMsg: ""
            }]
          },
          {
            name: "exitWeight",
            jsonPath: "vehicleTripSheetDetails[0].exitWeight",
            label: "swm.vehiclestripsheet.create.exitWeight",
            type: "text",
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: "",
            defaultValue: "",
            depedants: [{
              jsonPath: "vehicleTripSheetDetails[0].garbageWeight",
              type: "textField",
              pattern: "`${parseFloat(getVal('vehicleTripSheetDetails[0].entryWeight')) && parseFloat(getVal('vehicleTripSheetDetails[0].exitWeight')) ? (parseFloat(getVal('vehicleTripSheetDetails[0].entryWeight')) - parseFloat(getVal('vehicleTripSheetDetails[0].exitWeight'))).toFixed(2):0}`",
              rg: "",
              isRequired: false,
              requiredErrMsg: "",
              patternErrMsg: ""
            }]
          },
          {
            name: "garbageWeight",
            jsonPath: "vehicleTripSheetDetails[0].garbageWeight",
            label: "swm.vehiclestripsheet.create.garbageWeight",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: "",
            defaultValue: ""
          }
        ]
      }
    ],
    url: "/swm-services/vehicletripsheetdetails/_update",
    tenantIdRequired: true,
    searchUrl: "/swm-services/vehicletripsheetdetails/_search?tripNo={tripNo}"
  },
  "swm.view": {
    beforeSetForm:
    `if (res &&
      _.isArray(res.vehicleTripSheetDetails) && res.vehicleTripSheetDetails[0].route.collectionPoints && res.vehicleTripSheetDetails[0].route.collectionPoints.length>0) {
        for(var i=0;i<res.vehicleTripSheetDetails[0].route.collectionPoints.length;i++)
        {
          if(res.vehicleTripSheetDetails[0].route.collectionPoints[i].dumpingGround){
            res.vehicleTripSheetDetails[0].route.dumpingGround={};
            res.vehicleTripSheetDetails[0].route.dumpingGround.name=res.vehicleTripSheetDetails[0].route.collectionPoints[i].dumpingGround.name;
            res.vehicleTripSheetDetails[0].route.collectionPoints.splice(i,1);
          }
        }
    }
    if(res && _.isArray(res.vehicleTripSheetDetails)){
      if(res.vehicleTripSheetDetails[0].entryWeight && res.vehicleTripSheetDetails[0].exitWeight){
        var garbage = (res.vehicleTripSheetDetails[0].entryWeight) - (res.vehicleTripSheetDetails[0].exitWeight);
        if(garbage.toString().split('.')[1] && garbage.toString().split('.')[1].length>2){
          res.vehicleTripSheetDetails[0].garbageWeight = garbage.toFixed(2);
        }
      }
    }
    `,
    numCols: 4,
    useTimestamp: true,
    objectName: "vehicleTripSheetDetails",
    title: "swm.vehiclestripsheet.create.title",
    searchUrl: "/swm-services/vehicletripsheetdetails/_search?tripNo={tripNo}",
    groups: [
      {
        name: "VehicleDetails",
        label: "",
        fields: [
          {
            name: "tripNo",
            label: "swm.vehiclestripsheet.create.tripNo",
            type: "text",
            jsonPath: "vehicleTripSheetDetails[0].tripNo",
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: ""
          },
          {
            name: "regNumber",
            jsonPath: "vehicleTripSheetDetails[0].vehicle.regNumber",
            label: "swm.vehiclestripsheet.create.regNumber",
            type: "autoCompelete",
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: "",
            url: "swm-services/vehicles/_search?|$.vehicles.*.regNumber|$.vehicles.*.regNumber",
            autoCompleteDependancy: {
              autoCompleteUrl: "/swm-services/vehicles/_search?regNumber={vehicleTripSheetDetails[0].vehicle.regNumber}",
              autoFillFields: {
                "vehicleTripSheetDetails[0].vendorName": "vehicles[0].vendor.name"
              }
            }
          },
          {
            name: "ulbOwnedVehicle",
            dependentJsonPath: "vehicleTripSheetDetails[0].vehicle.vendor.name",
            label: "swm.vehiclestripsheet.create.ulbOwnedVehicle",
            type: "checkbox",
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: ""
          },
          {
            name: "vendorName",
            jsonPath: "vehicleTripSheetDetails[0].vehicle.vendor.name",
            label: "swm.vehiclestripsheet.create.vendorName",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: ""
          },
          {
            name: "route",
            jsonPath: "vehicleTripSheetDetails[0].route.code",
            label: "swm.vehiclestripsheet.create.route",
            type: "autoCompelete",
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: "",
            url: "swm-services/routes/_search?|$.routes.*.code|$.routes.*.name",
            autoCompleteDependancy: {
              autoCompleteUrl: "/swm-services/routes/_search?code={vehicleTripSheetDetails[0].route.code}&excludeDumpingGround=true",
              autoFillFields: {
                "vehicleTripSheetDetails[0].collectionType": "routes[0].collectionType.name",
                "vehicleTripSheetDetails[0].collectionPoints": "routes[0].collectionPoints",
                "vehicleTripSheetDetails[0].totalDistanceCovered": "routes[0].totalDistance",
                "vehicleTripSheetDetails[0].totalGarbageEstimate": "routes[0].totalGarbageEstimate"
              }
            }
            // url:'swm-services/routes/_search?|$.routes.*.code|$.routes.*.name',
            // autoCompleteDependancy: {
            //   autoCompleteUrl: '/swm-services/routes/_search?code={vehicleTripSheetDetails[0].route.code}',
            //   autoFillFields: {
            //     'vehicleTripSheetDetails[0].dumpingGroundName': ''
            //   },
            // },
          },
          {
            name: "dumpingGroundName",
            jsonPath: "vehicleTripSheetDetails[0].route.dumpingGround.name",
            label: "swm.vehiclestripsheet.create.dumpingGroundName",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: ""
          },
          {
            name: "totalDistanceCovered",
            jsonPath: "vehicleTripSheetDetails[0].route.totalDistance",
            label: "swm.vehiclestripsheet.create.totalDistanceCovered",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: "",
            defaultValue: ""
          },
          {
            name: "collectionType",
            jsonPath: "vehicleTripSheetDetails[0].route.collectionType.name",
            label: "swm.vehiclestripsheet.create.collectionType",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: "",
            defaultValue: ""
          },
          {
            name: "totalGarbageEstimate",
            jsonPath: "vehicleTripSheetDetails[0].route.totalGarbageEstimate",
            label: "swm.vehiclestripsheet.create.totalGarbageEstimate",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: "",
            defaultValue: ""
          },
        ]
      },
      {
        name: 'locationsCovered',
        label: 'swm.vehiclestripsheet.create.group.title.locationsCovered',
        fields: [{
          type: "tableListTemp",
          jsonPath: "vehicleTripSheetDetails[0].route.collectionPoints",
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
                "jsonPath": "vehicleTripSheetDetails[0].route.collectionPoints[0].collectionPoint.location.code",
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
              //   jsonPath: "vehicleTripSheetDetails[0].route.collectionPoints[0].collectionPoint.location.name",
              //   isDisabled: true
              // },
              {
                name: "swm.create.sanitationstaffschedules.colletionPoint.name",
                pattern: "",
                type: "label",
                jsonPath: "vehicleTripSheetDetails[0].route.collectionPoints[0].collectionPoint.name",
                isDisabled: true
              }
            ],
            actionsNotRequired: true
          },
          hasATOAATransform: true,
          aATransformInfo: {
            to: 'vehicleTripSheetDetails[0].collectionPoints',
            key: 'code',
            from: 'collectionPoint.code'
          }
        }],
      },
      {
        name: "tripSheetDetails",
        label: "swm.vehiclestripsheet.create.group.title.tripSheetDetails",
        fields: [{
            name: "scheduledDateFrom",
            jsonPath: "vehicleTripSheetDetails[0].tripStartDate",
            label: "swm.vehiclestripsheet.create.scheduledDateFrom",
            type: "datePicker",
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: ""
          },
          {
            name: "scheduledDateTo",
            jsonPath: "vehicleTripSheetDetails[0].tripEndDate",
            label: "swm.vehiclestripsheet.create.scheduledDateTo",
            type: "datePicker",
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: ""
          },
          {
            name: "inTime",
            jsonPath: "vehicleTripSheetDetails[0].inTime",
            label: "swm.vehiclestripsheet.create.inTime",
            type: "timePicker",
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: "",
            defaultValue: ""
          },
          {
            name: "outTime",
            jsonPath: "vehicleTripSheetDetails[0].outTime",
            label: "swm.vehiclestripsheet.create.outTime",
            type: "timePicker",
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: "",
            defaultValue: ""
          },
          {
            name: "entryWeight",
            jsonPath: "vehicleTripSheetDetails[0].entryWeight",
            label: "swm.vehiclestripsheet.create.entryWeight",
            type: "text",
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: "",
            defaultValue: "",
            // depedants: [{
            //   jsonPath: "vehicleTripSheetDetails[0].garbageWeight",
            //   type: "textField",
            //   pattern: "`${parseFloat(getVal('vehicleTripSheetDetails[0].entryWeight')) && parseFloat(getVal('vehicleTripSheetDetails[0].exitWeight')) ? (parseFloat(getVal('vehicleTripSheetDetails[0].entryWeight')) - parseFloat(getVal('vehicleTripSheetDetails[0].exitWeight'))).toFixed(2):0}`",
            //   rg: "",
            //   isRequired: false,
            //   requiredErrMsg: "",
            //   patternErrMsg: ""
            // }]
          },
          {
            name: "exitWeight",
            jsonPath: "vehicleTripSheetDetails[0].exitWeight",
            label: "swm.vehiclestripsheet.create.exitWeight",
            type: "text",
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: "",
            defaultValue: "",
            // depedants: [{
            //   jsonPath: "vehicleTripSheetDetails[0].garbageWeight",
            //   type: "textField",
            //   pattern: "`${parseFloat(getVal('vehicleTripSheetDetails[0].entryWeight')) && parseFloat(getVal('vehicleTripSheetDetails[0].exitWeight')) ? (parseFloat(getVal('vehicleTripSheetDetails[0].entryWeight')) - parseFloat(getVal('vehicleTripSheetDetails[0].exitWeight'))).toFixed(2):0}`",
            //   rg: "",
            //   isRequired: false,
            //   requiredErrMsg: "",
            //   patternErrMsg: ""
            // }]
          },
          {
            name: "garbageWeight",
            jsonPath: "vehicleTripSheetDetails[0].garbageWeight",
            label: "swm.vehiclestripsheet.create.garbageWeight",
            type: "text",
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: "",
            defaultValue: ""
          }
        ]
      }
    ],
    tenantIdRequired: true,
    url: "/swm-services/vehicletripsheetdetails/_search?tripNo={tripNo}"
  }
};
export default dat;
