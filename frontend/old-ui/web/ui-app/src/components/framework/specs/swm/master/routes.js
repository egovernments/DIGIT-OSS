const routeValidation = `
  
  const calculateTotal = (property) => {
    const distArr = [];
    const garbageArr = [];
    if(property.indexOf("distance")>-1 || property.indexOf("garbageEstimate")>-1) {
      if(formData.routeStop && formData.routeStop.collectionPoints && formData.routeStop.collectionPoints.length) {
        for(var i=0; i<formData.routeStop.collectionPoints.length; i++) {
          if(formData.routeStop.collectionPoints[i].distance)
            distArr.push(formData.routeStop.collectionPoints[i].distance);
          if(formData.routeStop.collectionPoints[i].garbageEstimate)
            garbageArr.push(formData.routeStop.collectionPoints[i].garbageEstimate);
        }
      }
      if(formData.startPoint && formData.startPoint.garbageEstimate) {
        garbageArr.push(formData.startPoint.garbageEstimate);
      }
      if(formData.endPoint) {
        if(formData.endPoint.distance)
          distArr.push(formData.endPoint.distance);
        if(formData.endPoint.garbageEstimate)
          garbageArr.push(formData.endPoint.garbageEstimate);
      }
      
      let totalDist = 0, totalGarbage=0;
      distArr.forEach((i) => {
        totalDist = +(totalDist) + +(i); 
      });
      garbageArr.forEach((i) => {
        totalGarbage = +(totalGarbage)+ +(i);
      });
  
      self.setVal("routes[0].totalDistance", totalDist.toFixed(2));
      self.setVal("routes[0].totalGarbageEstimate", totalGarbage.toFixed(2));
    }
  }

  const toggleDumpingGround = (property) => {
    // let _mockData = {...self.props.mockData}
    let _mockData = Object.assign({},self.props.mockData);
    if(property.indexOf('typeOfPoint') !== -1) {
      const val = self.getVal(property);
      if(val === 'Ending Dumping Ground point') {
        var groupArr = _mockData[self.props.moduleName + "." + self.props.actionName].groups;
        for(var i=0; i<groupArr.length; i++) {
          if(groupArr[i].name == 'defineRoute') {
            for(var j=0; j<groupArr[i].fields.length; j++) {
              if(groupArr[i].fields[j].jsonPath === "endPoint.collectionPoint.code") {
                groupArr[i].fields[j].isDisabled = true;
                self.setVal('endPoint.collectionPoint.code', null);
              }
              else if(groupArr[i].fields[j].jsonPath === "endPoint.dumpingGround.code") {
                groupArr[i].fields[j].isDisabled = false;
              }
              // else if(groupArr[i].fields[j].jsonPath === "endPoint.garbageEstimate") {
              //   groupArr[i].fields[j].isDisabled = true;
              //   self.setVal('endPoint.garbageEstimate', '');
              // }
            }
          }
        }
      }
      else {
        var groupArr = _mockData[self.props.moduleName + "." + self.props.actionName].groups;
        for(var i=0; i<groupArr.length; i++) {
          if(groupArr[i].name == 'defineRoute') {
            for(var j=0; j<groupArr[i].fields.length; j++) {
              if(groupArr[i].fields[j].jsonPath === "endPoint.collectionPoint.code") {
                groupArr[i].fields[j].isDisabled = false;
              }
              else if(groupArr[i].fields[j].jsonPath === "endPoint.dumpingGround.code") {
                groupArr[i].fields[j].isDisabled = true;
                self.setVal('endPoint.dumpingGround', null);
              }
              // else if(groupArr[i].fields[j].jsonPath === "endPoint.garbageEstimate") {
              //   groupArr[i].fields[j].isDisabled = false;
              // }
            }
          }
        }
      }
      self.props.setMockData(_mockData);
    }
  }
  
  calculateTotal(property);
  toggleDumpingGround(property);
  `

const modifyFormData = `
  const setVal = (formData, jsonPath, value) => {
    _.set(formData, jsonPath, value);
  };

  const modifyFormData = () => {
    if(_formData.routes) {

      for(var i=0; i<_formData.routes[0].collectionPoints.length; i++) {
        const val = _formData.routes[0].collectionPoints[i].typeOfPoint;
        switch(val) {
          case "Starting Point":
            setVal(_formData, 'routes[0].collectionPoints['+i+'].isStartingCollectionPoint', true);
            setVal(_formData, 'routes[0].collectionPoints['+i+'].isEndingCollectionPoint', false);
            break;
          case "Route Stop":
            setVal(_formData, 'routes[0].collectionPoints['+i+'].isStartingCollectionPoint', false);
            setVal(_formData, 'routes[0].collectionPoints['+i+'].isEndingCollectionPoint', false);
            break;
          case "Ending Collection Point":
            setVal(_formData, 'routes[0].collectionPoints['+i+'].isStartingCollectionPoint', false);
            setVal(_formData, 'routes[0].collectionPoints['+i+'].isEndingCollectionPoint', true);
            break;
          case "Ending Dumping Ground point":
            setVal(_formData, 'routes[0].collectionPoints['+i+'].isStartingCollectionPoint', false);
            setVal(_formData, 'routes[0].collectionPoints['+i+'].isEndingCollectionPoint', false);
            break;
        }
      }
    }
  }

  const setStartEndPoint = () => {
    let indArr = [];
    delete _formData.routes[0]["collectionPoints"];
    _formData.routes[0].collectionPoints = [];
    _formData.routes[0].collectionPoints = _formData.routes[0].collectionPoints.concat(_formData.routeStop.collectionPoints);
    _formData.routes[0].collectionPoints.unshift(_formData.startPoint);
    _formData.routes[0].collectionPoints.push(_formData.endPoint);
    delete _formData["routeStop"];
    delete _formData["startPoint"];
    delete _formData["endPoint"];
  }
  setStartEndPoint();modifyFormData();`

const setTypeOfPointUpdate = `
  const setTypeOfPoint = (obj, res) => {
    let {mockData,moduleName, actionName} = self.props;
    if(res.endPoint.isEndingCollectionPoint == true && res.endPoint.isStartingCollectionPoint == false) {
      _.set(res, "endPoint.typeOfPoint", "Ending Collection Point");
    }
    else if(res.endPoint.isEndingCollectionPoint == false && res.endPoint.isStartingCollectionPoint == false && res.endPoint.dumpingGround && res.endPoint.dumpingGround.code) {
      _.set(res, "endPoint.typeOfPoint", "Ending Dumping Ground point");
        self.setPropertyInMockData(mockData[moduleName+'.'+actionName], "endPoint.collectionPoint.code", "isDisabled",true);
        self.setPropertyInMockData(mockData[moduleName+'.'+actionName], "endPoint.dumpingGround.code", "isDisabled",false);
        self.props.setMockData(mockData);
    }
  }
  setTypeOfPoint(obj, res);
`
const setTypeOfPointView = `
  const setTypeOfPointView = (res) => {
    // let _mockData = {...self.props.mockData};
    let _mockData = Object.assign({},self.props.mockData);
    let {moduleName, actionName} = self.props;
    if(res.routes && res.routes.length) {
      var jsonPathArr = JP.query((_mockData[moduleName+'.'+actionName]), "$.groups..fields[?(@.name=='typeOfPoint')].jsonPath");
      for(var i=0; i<res.routes[0].collectionPoints.length; i++) {
        jsonPathArr.forEach((jP) => {
          let index = self.indexFinder(jP);
          if(index == i) {
            if(res.routes[0].collectionPoints[i].isEndingCollectionPoint == false && res.routes[0].collectionPoints[i].isStartingCollectionPoint) {
              self.setVal(jP, "Starting Point");
            }
            else if(res.routes[0].collectionPoints[i].isEndingCollectionPoint == true && res.routes[0].collectionPoints[i].isStartingCollectionPoint == false) {
              self.setVal(jP, "Ending Collection Point");
            }
            else if(res.routes[0].collectionPoints[i].isEndingCollectionPoint == false && res.routes[0].collectionPoints[i].isStartingCollectionPoint == false && res.routes[0].collectionPoints[i].dumpingGround && res.routes[0].collectionPoints[i].dumpingGround.code) {
              self.setVal(jP, "Ending Dumping Ground point");
            }
            else if(res.routes[0].collectionPoints[i].isEndingCollectionPoint == false && res.routes[0].collectionPoints[i].isStartingCollectionPoint == false) {
              self.setVal( jP, "Route Stop");
            }
          }
        });
      }
    }
  }

  const getDumpingLocation=(res) => {
    var jsonPathArr = JP.query((self.props.mockData[self.props.moduleName+'.'+self.props.actionName]), "$.groups..fields[?(@.name=='dumpingGround')].jsonPath");
    jsonPathArr.forEach((item) => {
      if(self.getVal(item)) {
        var ind = self.indexFinder(item);
        let jPath = "routes[0].collectionPoints["+ind+"].dumpingGround.siteDetails.location.code"
        self.setVal("routes[0].collectionPoints["+ind+"].collectionPoint.location.code", self.getVal(jPath));
      }
    })
  }
setTypeOfPointView(res);getDumpingLocation(res);`

const getDumpingLocationUpdate = `
  const getDumpingLocation=(res) => {
    var jsonPathArr = JP.query((self.props.mockData[self.props.moduleName+'.'+self.props.actionName]), "$.groups..fields[?(@.name=='dumpingGround')].jsonPath");
    let _formData = _.cloneDeep(self.props.formData);
    jsonPathArr.forEach((item) => {
      if(_.get(res, item)) {
        _.set(_formData, "endPoint.collectionPoint.location.code", _.get(res, "endPoint.dumpingGround.siteDetails.location.code"));
        self.props.setFormData(_formData);
      }
    })
  }
getDumpingLocation(res);`

const setUpdateCards = `
  const setUpdateCards = res => {
    var indArr = [];
    res.routeStop = {};
    res.routeStop.collectionPoints = [];
    if(res.routes[0].collectionPoints) {
      for(var i=0; i<res.routes[0].collectionPoints.length; i++) {
        if(res.routes[0].collectionPoints[i].isStartingCollectionPoint 
          && res.routes[0].collectionPoints[i].isEndingCollectionPoint === false) {
          res.startPoint = res.routes[0].collectionPoints[i];
          indArr.push(i);
        }
        else if(res.routes[0].collectionPoints[i].isStartingCollectionPoint === false 
          && (res.routes[0].collectionPoints[i].isEndingCollectionPoint === true 
            || res.routes[0].collectionPoints[i].dumpingGround !== null)) {
          res.endPoint = res.routes[0].collectionPoints[i];
          indArr.push(i);
        }
        else if(res.routes[0].collectionPoints[i].isStartingCollectionPoint === false 
          && res.routes[0].collectionPoints[i].isEndingCollectionPoint === false) {
          res.routeStop.collectionPoints.push(res.routes[0].collectionPoints[i]);
          indArr.push(i);
        }
      }
      indArr.sort(function(a,b){ return b - a; });
      for(var j=0; j<indArr.length; j++) {
        res.routes[0].collectionPoints.splice(indArr[j],1);
      }
    }
    return res;
  }
setUpdateCards(res);`

var dat = {
  'swm.create': {
    afterHandleChange: routeValidation,
    beforeSubmit: modifyFormData,
    numCols: 3,
    objectName: 'routes',
    useTimestamp: true,
    idJsonPath: 'routes[0].code',
    title: 'swm.routes.create.title',
    groups: [
      {
        name: 'routeDetails',
        label: '',
        fields: [
          {
            name: 'name',
            jsonPath: 'routes[0].name',
            label: 'swm.routes.create.name',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/swm-services/routes/_search?|$.routes.*.code|$.routes.*.name',
          },
          {
            name: 'code',
            jsonPath: 'routes[0].collectionType.code',
            label: 'swm.routes.create.collectionType',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=CollectionType|$..code|$..name',
          },
        ]
      },
      {
        name: 'defineRoute1',
        label: 'swm.routes.create.startPointgroup.title',
        jsonPath: "startPoint.routes[0].collectionPoints",
        fields: [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "startPoint.collectionPoint.location.code",
            "isRequired": true,
            "patternErrorMsg": "",
            "isDisabled": false,
            "fullWidth": true,
            depedants: [
              {
                jsonPath: 'startPoint.collectionPoint.code',
                type: 'dropDown',
                pattern:
                  '/swm-services/collectionpoints/_search?&locationCode={startPoint.collectionPoint.location.code}|$..collectionPoints.*.code|$..collectionPoints.*.name',
              }
            ]
          },
          {
            name: 'typeOfPoint',
            jsonPath: 'startPoint.typeOfPoint',
            label: 'Type Of Point',
            type: 'text',
            defaultValue: 'Starting Point',
            isRequired: true,
            isDisabled: true,
          },
          {
            name: 'collectionPoint',
            jsonPath: 'startPoint.collectionPoint.code',
            label: 'Collection Points',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: ''
          },
          {
            name: 'startingCollectionPointDistance',
            jsonPath: 'startPoint.distance',
            label: 'swm.routes.create.distance',
            type: 'text',
            defaultValue: '0',
            add: true,
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'startingCollectionPointGarbageEstimate',
            jsonPath: 'startPoint.garbageEstimate',
            label: 'swm.routes.create.garbagecollection',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          }
        ],
      },
      {
        name: 'defineRoute2',
        label: 'swm.routes.create.group.title',
        jsonPath: "routeStop.collectionPoints",
        multiple: true,
        fields: [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "routeStop.collectionPoints[0].collectionPoint.location.code",
            "isRequired": true,
            "patternErrorMsg": "",
            "isDisabled": false,
            "fullWidth": true,
            depedants: [
              {
                jsonPath: 'routeStop.collectionPoints[0].collectionPoint.code',
                type: 'dropDown',
                pattern:
                  '/swm-services/collectionpoints/_search?&locationCode={routeStop.collectionPoints[0].collectionPoint.location.code}|$..collectionPoints.*.code|$..collectionPoints.*.name',
              }
            ]
          },
          {
            name: 'typeOfPoint',
            jsonPath: 'routeStop.collectionPoints[0].typeOfPoint',
            label: 'Type Of Point',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            defaultValue: 'Route Stop',
          },
          {
            name: 'collectionPoint',
            jsonPath: 'routeStop.collectionPoints[0].collectionPoint.code',
            label: 'Collection Points',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: ''
          },
          {
            name: 'startingCollectionPointDistance',
            jsonPath: 'routeStop.collectionPoints[0].distance',
            label: 'swm.routes.create.distance',
            type: 'number',
            add: true,
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'startingCollectionPointGarbageEstimate',
            jsonPath: 'routeStop.collectionPoints[0].garbageEstimate',
            label: 'swm.routes.create.garbagecollection',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          }
        ],
      },
      {
        name: 'defineRoute',
        label: 'swm.routes.create.endPointgroup.title',
        jsonPath: "endPoint.routes[0].collectionPoints",
        fields: [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "endPoint.collectionPoint.location.code",
            "isRequired": true,
            "patternErrorMsg": "",
            "isDisabled": false,
            "fullWidth": true,
            "setResponseData": true,
            depedants: [
              {
                jsonPath: 'endPoint.collectionPoint.code',
                type: 'dropDown',
                pattern:
                  '/swm-services/collectionpoints/_search?&locationCode={endPoint.collectionPoint.location.code}|$..collectionPoints.*.code|$..collectionPoints.*.name',
              },
              {
                jsonPath: 'endPoint.dumpingGround.code',
                type: 'dropDown',
                pattern:
                  '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=DumpingGround&filter%3D%5B%3F(%40.siteDetails.location.code%3D={endPoint.collectionPoint.location.code})]|$..DumpingGround.*.code|$..DumpingGround.*.name',
              }
            ]
          },
          {
            name: 'typeOfPoint',
            jsonPath: 'endPoint.typeOfPoint',
            label: 'Type Of Point',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: [
              {
                key: 'Ending Dumping Ground point',
                value: 'Dumping Ground',
              },
              {
                key: 'Ending Collection Point',
                value: 'Ending Collection Point',
              }
            ],
          },
          {
            name: 'collectionPoint',
            jsonPath: 'endPoint.collectionPoint.code',
            label: 'Collection Points',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: ''
          },
          {
            name: 'dumpingGround',
            jsonPath: 'endPoint.dumpingGround.code',
            label: 'Dumping ground',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'startingCollectionPointDistance',
            jsonPath: 'endPoint.distance',
            label: 'swm.routes.create.distance',
            type: 'number',
            add: true,
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'startingCollectionPointGarbageEstimate',
            jsonPath: 'endPoint.garbageEstimate',
            label: 'swm.routes.create.garbagecollection',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          }
        ],
      },
      {
        name: 'totalDistanceGarbageEstimate',
        label: '',
        fields: [
          {
            name: 'totalDistance',
            jsonPath: 'routes[0].totalDistance',
            label: 'Total Distance Covered(KMS)',
            type: 'number',
            total: true,
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'totalGarbageEstimate',
            jsonPath: 'routes[0].totalGarbageEstimate',
            label: 'Total Expected Garbage(TONS)',
            type: 'number',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
        ],
      },
    ],
    url: '/swm-services/routes/_create',
    tenantIdRequired: true,
  },

  'swm.update': {
    numCols: 3,
    useTimestamp: true,
    beforeSetForm: setTypeOfPointUpdate,
    afterHandleChange: routeValidation,
    beforeSetUpdateData: setUpdateCards,
    afterSetForm: getDumpingLocationUpdate,
    beforeSubmit: modifyFormData,
    objectName: 'routes',
    idJsonPath: 'routes[0].code',
    title: 'swm.routes.create.title',
    groups: [
      {
        name: 'routeDetails',
        label: '',
        fields: [
          {
            name: 'name',
            jsonPath: 'routes[0].name',
            label: 'swm.routes.create.name',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'code',
            jsonPath: 'routes[0].collectionType.code',
            label: 'swm.routes.create.collectionType',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=CollectionType|$..code|$..name',
          },
        ]
      },
      {
        name: 'defineRoute1',
        label: 'swm.routes.create.startPointgroup.title',
        jsonPath: "startPoint.routes[0].collectionPoints",
        fields: [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "startPoint.collectionPoint.location.code",
            "isRequired": true,
            "patternErrorMsg": "",
            "isDisabled": false,
            "fullWidth": true,
            depedants: [
              {
                jsonPath: 'startPoint.collectionPoint.code',
                type: 'dropDown',
                pattern:
                  '/swm-services/collectionpoints/_search?&locationCode={startPoint.collectionPoint.location.code}|$..collectionPoints.*.code|$..collectionPoints.*.name',
              }
            ]
          },
          {
            name: 'typeOfPoint',
            jsonPath: 'startPoint.typeOfPoint',
            label: 'Type Of Point',
            type: 'text',
            defaultValue: 'Starting Point',
            isRequired: false,
            isDisabled: true,
          },
          {
            name: 'collectionPoint',
            jsonPath: 'startPoint.collectionPoint.code',
            label: 'Collection Points',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: ''
          },
          {
            name: 'startingCollectionPointDistance',
            jsonPath: 'startPoint.distance',
            label: 'swm.routes.create.distance',
            type: 'text',
            defaultValue: '0',
            add: true,
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'startingCollectionPointGarbageEstimate',
            jsonPath: 'startPoint.garbageEstimate',
            label: 'swm.routes.create.garbagecollection',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          }
        ],
      },
      {
        name: 'defineRoute2',
        label: 'swm.routes.create.group.title',
        jsonPath: "routeStop.collectionPoints",
        multiple: true,
        fields: [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "routeStop.collectionPoints[0].collectionPoint.location.code",
            "isRequired": true,
            "patternErrorMsg": "",
            "isDisabled": false,
            "fullWidth": true,
            depedants: [
              {
                jsonPath: 'routeStop.collectionPoints[0].collectionPoint.code',
                type: 'dropDown',
                pattern:
                  '/swm-services/collectionpoints/_search?&locationCode={routeStop.collectionPoints[0].collectionPoint.location.code}|$..collectionPoints.*.code|$..collectionPoints.*.name',
              }
            ]
          },
          {
            name: 'typeOfPoint',
            jsonPath: 'routeStop.collectionPoints[0].typeOfPoint',
            label: 'Type Of Point',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            defaultValue: 'Route Stop',
          },
          {
            name: 'collectionPoint',
            jsonPath: 'routeStop.collectionPoints[0].collectionPoint.code',
            label: 'Collection Points',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: ''
          },
          {
            name: 'startingCollectionPointDistance',
            jsonPath: 'routeStop.collectionPoints[0].distance',
            label: 'swm.routes.create.distance',
            type: 'number',
            add: true,
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'startingCollectionPointGarbageEstimate',
            jsonPath: 'routeStop.collectionPoints[0].garbageEstimate',
            label: 'swm.routes.create.garbagecollection',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          }
        ],
      },
      {
        name: 'defineRoute',
        label: 'swm.routes.create.endPointgroup.title',
        jsonPath: "endPoint.routes[0].collectionPoints",
        fields: [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "endPoint.collectionPoint.location.code",
            "isRequired": true,
            "patternErrorMsg": "",
            "isDisabled": false,
            "fullWidth": true,
            depedants: [
              {
                jsonPath: 'endPoint.collectionPoint.code',
                type: 'dropDown',
                pattern:
                  '/swm-services/collectionpoints/_search?&locationCode={endPoint.collectionPoint.location.code}|$..collectionPoints.*.code|$..collectionPoints.*.name',
              },
              {
                jsonPath: 'endPoint.dumpingGround.code',
                type: 'dropDown',
                pattern:
                  '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=DumpingGround&filter%3D%5B%3F(%40.siteDetails.location.code%3D={endPoint.collectionPoint.location.code})]|$..DumpingGround.*.code|$..DumpingGround.*.name',
              }
            ]
          },
          {
            name: 'typeOfPoint',
            jsonPath: 'endPoint.typeOfPoint',
            label: 'Type Of Point',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: [
              {
                key: 'Ending Dumping Ground point',
                value: 'Dumping Ground',
              },
              {
                key: 'Ending Collection Point',
                value: 'Ending Collection Point',
              }
            ],
          },
          {
            name: 'collectionPoint',
            jsonPath: 'endPoint.collectionPoint.code',
            label: 'Collection Points',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: ''
          },
          {
            name: 'dumpingGround',
            jsonPath: 'endPoint.dumpingGround.code',
            label: 'Dumping ground',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'startingCollectionPointDistance',
            jsonPath: 'endPoint.distance',
            label: 'swm.routes.create.distance',
            type: 'number',
            add: true,
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'startingCollectionPointGarbageEstimate',
            jsonPath: 'endPoint.garbageEstimate',
            label: 'swm.routes.create.garbagecollection',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          }
        ],
      },
      {
        name: 'totalDistanceGarbageEstimate',
        label: '',
        fields: [
          {
            name: 'totalDistance',
            jsonPath: 'routes[0].totalDistance',
            label: 'Total Distance Covered(KMS)',
            type: 'number',
            total: true,
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
          {
            name: 'totalGarbageEstimate',
            jsonPath: 'routes[0].totalGarbageEstimate',
            label: 'Total Expected Garbage(TONS)',
            type: 'number',
            isRequired: false,
            isDisabled: true,
            patternErrorMsg: '',
          },
        ],
      },
    ],
    url: '/swm-services/routes/_update',
    tenantIdRequired: true,
    searchUrl: '/swm-services/routes/_search?code={code}',
  },

  'swm.view': {
    numCols: 3,
    afterSetForm: setTypeOfPointView,
    useTimestamp: true,
    objectName: 'routes',
    title: 'swm.routes.create.title',
    groups: [
      {
        name: 'routeDetails',
        label: '',
        fields: [
          {
            name: 'name',
            jsonPath: 'routes[0].name',
            label: 'swm.routes.create.name',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'code',
            jsonPath: 'routes[0].collectionType.code',
            label: 'swm.routes.create.collectionType',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=CollectionType|$..code|$..name',
          },
        ]
      },
      {
        name: 'defineRoute',
        label: 'swm.routes.view.group.title',
        jsonPath: "routes[0].collectionPoints",
        multiple: true,
        fields: [
          {
            "type": "boundary",
            "label": "",
            "hierarchyType": "REVENUE",
            "jsonPath": "routes[0].collectionPoints[0].collectionPoint.location.code",
            "isRequired": true,
            "patternErrorMsg": "",
            "multiple": true,
            "fullWidth": true,
            depedants: [
              {
                jsonPath: 'routes[0].routeCollectionPointMaps[0].collectionPoint.code',
                type: 'dropDown',
                pattern:
                  '/swm-services/collectionpoints/_search?&locationCode={routes[0].routeCollectionPointMaps[0].location.code}|$..code|$..name',
              },
            ]
          },
          {
            name: 'typeOfPoint',
            jsonPath: 'routes[0].collectionPoints[0].typeOfPoint',
            label: 'Type Of Point',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            defaultValue: [
              {
                key: 'Starting Point',
                value: 'Starting Point',
              },
              {
                key: 'Route Stop',
                value: 'Route Stop',
              },
              {
                key: 'Ending Dumping Ground point',
                value: 'Ending Dumping Ground point',
              },
              {
                key: 'Ending Collection Point',
                value: 'Ending Collection Point',
              }
            ],
          },
          {
            name: 'collectionPoint',
            jsonPath: 'routes[0].collectionPoints[0].collectionPoint.name',
            label: 'Collection Points',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: ''
          },
          {
            name: 'dumpingGround',
            jsonPath: 'routes[0].collectionPoints[0].dumpingGround.code',
            label: 'Dumping ground',
            type: 'singleValueList',
            isRequired: true,
            isDisabled: true,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=DumpingGround|$..DumpingGround.*.code|$..DumpingGround.*.name',
          },
          {
            name: 'startingCollectionPointDistance',
            jsonPath: 'routes[0].collectionPoints[0].distance',
            label: 'swm.routes.create.distance',
            type: 'number',
            add: true,
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'startingCollectionPointGarbageEstimate',
            jsonPath: 'routes[0].collectionPoints[0].garbageEstimate',
            label: 'swm.routes.create.garbagecollection',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          }
        ],
      },
      {
        name: 'totalDistanceGarbageEstimate',
        label: '',
        fields: [
          {
            name: 'totalDistance',
            jsonPath: 'routes[0].totalDistance',
            label: 'Total Distance Covered(KMS)',
            type: 'number',
            total: true,
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
          {
            name: 'totalGarbageEstimate',
            jsonPath: 'routes[0].totalGarbageEstimate',
            label: 'Total Expected Garbage(TONS)',
            type: 'number',
            isRequired: true,
            isDisabled: false,
            patternErrorMsg: '',
          },
        ],
      },
    ],
    url: '/swm-services/routes/_search?code={code}',
    tenantIdRequired: true,
  },

  'swm.search': {
    numCols: 4,
    useTimestamp: true,
    objectName: 'routes',
    url: 'swm-services/routes/_search',
    title: 'swm.search.page.title.routes',
    groups: [
      {
        name: 'RouteDetails',
        label: 'swm.routes.search.title',
        fields: [
          {
            name: 'name',
            jsonPath: 'code',
            label: 'swm.routes.create.name',
            type: 'autoCompelete',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/swm-services/routes/_search?|$.routes.*.code|$.routes.*.name'
          },
          {
            name: 'collectionTypeCode',
            jsonPath: 'collectionTypeCode',
            label: 'swm.routes.search.result.collectionPoint',
            type: 'autoCompelete',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=CollectionType|$..code|$..name'

          },
          {
            name: 'dumpingGroundCode',
            jsonPath: 'dumpingGroundCode',
            label: 'swm.routes.search.dumpingGroundCode',
            type: 'autoCompelete',
            isRequired: false,
            isDisabled: false,
            patternErrorMsg: '',
            url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=DumpingGround|$..DumpingGround.*.code|$..DumpingGround.*.name'
          },
        ]
      }
    ],
    result: {
      header: [
        {
          label: 'swm.routes.search.result.name',
        },
        {
          label: 'swm.routes.search.result.collectionPoint',
        },
        {
          label: 'swm.routes.search.result.totalNoOfStops',
        },
        {
          label: 'swm.routes.search.result.distance',
        },
        {
          label: 'swm.routes.search.result.garbage',
        }
      ],
      values: [
        'name',
        'collectionType.name',
        'totalNoOfStops',
        'totalDistance',
        'totalGarbageEstimate'
      ],
      resultPath: 'routes',
      rowClickUrlUpdate: '/update/swm/routes/{code}',
      rowClickUrlView: '/view/swm/routes/{code}',
    }
  }
};
export default dat;