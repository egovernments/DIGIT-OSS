import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

import _ from 'lodash';
import ShowFields from '../../../framework/showFields';

import { translate } from '../../../common/common';
import Api from '../../../../api/api';
import jp from 'jsonpath';
import UiButton from '../../../framework/components/UiButton';
import { fileUpload, getInitiatorPosition, getFullDate } from '../../../framework/utility/utility';
import Dialog from 'material-ui/Dialog';
import axios from 'axios';
import { Step, Stepper, StepButton, StepLabel } from 'material-ui/Stepper';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import $ from 'jquery';

var specifications = {};
let reqRequired = [];
let baseUrl = 'https://raw.githubusercontent.com/abhiegov/test/master/specs/';

let documents = [
  {
    from: '',
    timeStamp: new Date().getTime(),
    filePath: '',
    name: 'Application on builder Letter head',
    remarks: '',
  },
  {
    from: '',
    timeStamp: new Date().getTime(),
    filePath: '',
    name: 'Application on architect letter head',
    remarks: '',
  },
  {
    from: '',
    timeStamp: new Date().getTime(),
    filePath: '',
    name: 'D.G. Certifiacte',
    remarks: '',
  },
  {
    from: '',
    timeStamp: new Date().getTime(),
    filePath: '',
    name: 'Rs.100 stamp paper agreement',
    remarks: '',
  },
  {
    from: '',
    timeStamp: new Date().getTime(),
    filePath: '',
    name: 'Agency certificate',
    remarks: '',
  },
  {
    from: '',
    timeStamp: new Date().getTime(),
    filePath: '',
    name: 'Building permission certificate',
    remarks: '',
  },
  {
    from: '',
    timeStamp: new Date().getTime(),
    filePath: '',
    name: 'Lift certificate',
    remarks: '',
  },
  {
    from: '',
    timeStamp: new Date().getTime(),
    filePath: '',
    name: 'Architectural plan',
    remarks: '',
  },
  {
    from: '',
    timeStamp: new Date().getTime(),
    filePath: '',
    name: 'Copy of initials/amended NOC issued by fire brigade department',
    remarks: '',
  },
];

class Report extends Component {
  state = {
    pathname: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      serviceRequest: {},
      stepIndex: 0,
      RequestInfo: {},
    };
  }

  setLabelAndReturnRequired(configObject) {
    if (configObject && configObject.groups) {
      for (var i = 0; configObject && i < configObject.groups.length; i++) {
        configObject.groups[i].label = translate(configObject.groups[i].label);
        for (var j = 0; j < configObject.groups[i].fields.length; j++) {
          configObject.groups[i].fields[j].label = translate(configObject.groups[i].fields[j].label);
          if (configObject.groups[i].fields[j].isRequired && !configObject.groups[i].fields[j].hide && !configObject.groups[i].hide)
            reqRequired.push(configObject.groups[i].fields[j].jsonPath);
        }

        if (configObject.groups[i].children && configObject.groups[i].children.length) {
          for (var k = 0; k < configObject.groups[i].children.length; k++) {
            this.setLabelAndReturnRequired(configObject.groups[i].children[k]);
          }
        }
      }
    }
  }

  setDefaultValues(groups, dat) {
    for (var i = 0; i < groups.length; i++) {
      for (var j = 0; j < groups[i].fields.length; j++) {
        if (
          typeof groups[i].fields[j].defaultValue == 'string' ||
          typeof groups[i].fields[j].defaultValue == 'number' ||
          typeof groups[i].fields[j].defaultValue == 'boolean'
        ) {
          //console.log(groups[i].fields[j].name + "--" + groups[i].fields[j].defaultValue);
          _.set(dat, groups[i].fields[j].jsonPath, groups[i].fields[j].defaultValue);
        }

        if (groups[i].fields[j].children && groups[i].fields[j].children.length) {
          for (var k = 0; k < groups[i].fields[j].children.length; k++) {
            this.setDefaultValues(groups[i].fields[j].children[k].groups);
          }
        }
      }
    }
  }

  setInitialUpdateChildData(form, children) {
    let _form = JSON.parse(JSON.stringify(form));
    for (var i = 0; i < children.length; i++) {
      for (var j = 0; j < children[i].groups.length; j++) {
        if (children[i].groups[j].multiple) {
          var arr = _.get(_form, children[i].groups[j].jsonPath);
          var ind = j;
          var _stringifiedGroup = JSON.stringify(children[i].groups[j]);
          var regex = new RegExp(children[i].groups[j].jsonPath.replace(/\[/g, '\\[').replace(/\]/g, '\\]') + '\\[\\d{1}\\]', 'g');
          for (var k = 1; k < arr.length; k++) {
            j++;
            children[i].groups[j].groups.splice(
              ind + 1,
              0,
              JSON.parse(_stringifiedGroup.replace(regex, children[i].groups[ind].jsonPath + '[' + k + ']'))
            );
            children[i].groups[j].groups[ind + 1].index = ind + 1;
          }
        }

        if (children[i].groups[j].children && children[i].groups[j].children.length) {
          this.setInitialUpdateChildData(form, children[i].groups[j].children);
        }
      }
    }
  }

  setInitialUpdateData(form, specs, moduleName, actionName, objectName) {
    let { setMockData } = this.props;
    let _form = JSON.parse(JSON.stringify(form));
    var ind;
    for (var i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
      if (specs[moduleName + '.' + actionName].groups[i].multiple) {
        var arr = _.get(_form, specs[moduleName + '.' + actionName].groups[i].jsonPath);
        ind = i;
        var _stringifiedGroup = JSON.stringify(specs[moduleName + '.' + actionName].groups[i]);
        var regex = new RegExp(
          specs[moduleName + '.' + actionName].groups[i].jsonPath.replace(/\[/g, '\\[').replace(/\]/g, '\\]') + '\\[\\d{1}\\]',
          'g'
        );
        for (var j = 1; j < arr.length; j++) {
          i++;
          specs[moduleName + '.' + actionName].groups.splice(
            ind + 1,
            0,
            JSON.parse(_stringifiedGroup.replace(regex, specs[moduleName + '.' + actionName].groups[ind].jsonPath + '[' + j + ']'))
          );
          specs[moduleName + '.' + actionName].groups[ind + 1].index = j;
        }
      }

      if (specs[moduleName + '.' + actionName].groups[ind || i].children && specs[moduleName + '.' + actionName].groups[ind || i].children.length) {
        this.setInitialUpdateChildData(form, specs[moduleName + '.' + actionName].groups[ind || i].children);
      }
    }

    setMockData(specs);
  }

  displayUI(results) {
    let { setMetaData, setModuleName, setActionName, initForm, setMockData, setFormData } = this.props;
    let hashLocation = window.location.hash;
    let self = this;

    specifications = typeof results == 'string' ? JSON.parse(results) : results;
    let obj = specifications['fn.create'];
    reqRequired = [];
    self.setLabelAndReturnRequired(obj);
    initForm(reqRequired);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('fn');
    setActionName('create');

    /*if(hashLocation.split("/").indexOf("update") == 1) {
      var url = specifications[`${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`].searchUrl.split("?")[0];
      var id = self.props.match.params.id || self.props.match.params.master;
      var query = {
        [specifications[`${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`].searchUrl.split("?")[1].split("=")[0]]: id
      };
      Api.commonApiPost(url, query, {}, false, specifications[`${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`].useTimestamp).then(function(res){
          if(specifications[`${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`].isResponseArray) {
            var obj = {};
            _.set(obj, specifications[`${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`].objectName, jp.query(res, "$..[0]")[0]);
            self.props.setFormData(obj);
            self.setInitialUpdateData(obj, JSON.parse(JSON.stringify(specifications)), hashLocation.split("/")[2], hashLocation.split("/")[1], specifications[`${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`].objectName);
          } else {
            self.props.setFormData(res);
            self.setInitialUpdateData(res, JSON.parse(JSON.stringify(specifications)), hashLocation.split("/")[2], hashLocation.split("/")[1], specifications[`${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`].objectName);
          }
      }, function(err){

      })

    } else {*/
    var formData = {};
    if (obj && obj.groups && obj.groups.length) self.setDefaultValues(obj.groups, formData);
    setFormData(formData);
    //}
    this.props.handleChange({ target: { value: documents } }, 'Documents');

    this.setState({
      pathname: this.props.history.location.pathname,
    });
  }

  initData() {
    var hash = window.location.hash.split('/');
    let endPoint = '';
    let self = this;
    specifications = require('../../../framework/specs/citizenService/bp/fireNoc').default;
    self.displayUI(specifications);
    if (self.props.match.params.status == 'pay') {
      let metaData = JSON.parse(localStorage.getItem('metaData')),
        paymentGateWayRes = JSON.parse(localStorage.getItem('paymentGateWayResponse'));
      self.props.setLoadingStatus('loading');
      //DO WHATEVER YOU WANT TO DO AFTER PAYMENT & THEN CALL GENERATERECEIPT() FUNCTION
      let response = JSON.parse(localStorage.response);
      if (this.props.match.params.paymentGateWayRes == 'success') {
        // paymentGateWayRes["status"]="failed";
        Api.commonApiPost(
          '/citizen-services/v1/pgresponse/_validate',
          {},
          { PGResponse: paymentGateWayRes },
          null,
          metaData['fn.create'].useTimestamp,
          false,
          null,
          JSON.parse(localStorage.userRequest)
        ).then(
          function(res) {
            self.props.setLoadingStatus('hide');
            self.generateReceipt(response);
          },
          function(err) {
            self.props.toggleSnackbarAndSetText(true, err.message, false, true);
            self.props.setLoadingStatus('hide');
          }
        );
      }
    }
  }

  componentDidMount() {
    this.initData();
    this.setState({
      RequestInfo: {
        apiId: 'org.egov.pt',
        ver: '1.0',
        ts: new Date().getTime(),
        action: 'asd',
        did: '4354648646',
        key: 'xyz',
        msgId: '654654',
        requesterId: '61',
        authToken: localStorage.token,
        userInfo: JSON.parse(localStorage.userRequest),
      },
    });

    for (var i = 0; i < documents.length; i++) {
      documents[i].from = JSON.parse(localStorage.userRequest).userName;
      documents[i].uploadedbyrole = 'CITIZEN';
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.pathname != nextProps.history.location.pathname) {
      this.initData();
    }
  }

  autoComHandler = (autoObject, path) => {
    let self = this;
    var value = this.getVal(path);
    if (!value) return;
    var url = autoObject.autoCompleteUrl.split('?')[0];
    var hashLocation = window.location.hash;
    var query = {
      [autoObject.autoCompleteUrl.split('?')[1].split('=')[0]]: value,
    };
    Api.commonApiPost(url, query, {}, false, specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].useTimestamp).then(
      function(res) {
        var formData = { ...self.props.formData };
        for (var key in autoObject.autoFillFields) {
          _.set(formData, key, _.get(res, autoObject.autoFillFields[key]));
        }
        self.props.setFormData(formData);
      },
      function(err) {
        console.log(err);
      }
    );
  };

  makeAjaxCall = (formData, url) => {
    let self = this;
    delete formData.ResponseInfo;
    //return console.log(formData);
    Api.commonApiPost(url || self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].url, '', formData, '', true).then(
      function(response) {
        self.props.setLoadingStatus('hide');
        self.initData();
        self.props.toggleSnackbarAndSetText(
          true,
          translate(self.props.actionName == 'create' ? 'wc.create.message.success' : 'wc.update.message.success'),
          true
        );
        setTimeout(function() {
          if (self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].idJsonPath) {
            if (self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].ackUrl) {
              var hash =
                self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].ackUrl +
                '/' +
                encodeURIComponent(_.get(response, self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].idJsonPath));
            } else {
              if (self.props.actionName == 'update') {
                var hash = window.location.hash.replace(/(\#\/create\/|\#\/update\/)/, '/view/');
              } else {
                var hash =
                  window.location.hash.replace(/(\#\/create\/|\#\/update\/)/, '/view/') +
                  '/' +
                  encodeURIComponent(_.get(response, self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].idJsonPath));
              }
            }

            self.props.setRoute(hash);
          }
        }, 1500);
      },
      function(err) {
        self.props.setLoadingStatus('hide');
        self.props.toggleSnackbarAndSetText(true, err.message);
      }
    );
  };

  //Needs to be changed later for more customfields
  checkCustomFields = (formData, cb) => {
    var self = this;
    if (
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].customFields &&
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].customFields.initiatorPosition
    ) {
      var jPath = self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].customFields.initiatorPosition;
      getInitiatorPosition(function(err, pos) {
        if (err) {
          self.toggleSnackbarAndSetText(true, err.message);
        } else {
          _.set(formData, jPath, pos);
          cb(formData);
        }
      });
    } else {
      cb(formData);
    }
  };

  create = e => {
    let self = this,
      _url;
    e.preventDefault();
    var formData = { ...this.props.formData };
    // console.log(this.props.formData);
    var ServiceRequest = {
      tenantId: localStorage.getItem('tenantId'),
      serviceRequestId: null,
      serviceCode: 'BPA_FIRE_NOC',
      lat: 12,
      lang: 23,
      address: 'address',
      addressId: 'addressId',
      email: 'email',
      deviceId: 'deviceId',
      accountId: 'accountId',
      firstName: '',
      lastName: 'firstName',
      phone: 'phone',
      description: '',
      consumerCode: '',
      attributeValues: [
        {
          key: 'tenantId',
          value: localStorage.getItem('tenantId'),
        },
      ],
      status: 'CREATED',
      assignedTo: 'assignedTo',
      comments: [],
      moduleObject: this.props.formData,
      backendServiceDetails: null,
      Documents: this.props.formData.Documents,
    };

    console.log(ServiceRequest);

    self.props.setLoadingStatus('loading');

    if (
      self.props.moduleName &&
      self.props.actionName &&
      self.props.metaData &&
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].tenantIdRequired
    ) {
      if (!formData[self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName])
        formData[self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName] = {};

      if (formData[self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName].constructor == Array) {
        for (var i = 0; i < formData[self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName].length; i++) {
          formData[self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName][i]['tenantId'] =
            localStorage.getItem('tenantId') || 'default';
        }
      } else
        formData[self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName]['tenantId'] =
          localStorage.getItem('tenantId') || 'default';
    }

    if (/\{.*\}/.test(self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].url)) {
      _url = self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].url;
      var match = _url.match(/\{.*\}/)[0];
      var jPath = match.replace(/\{|}/g, '');
      _url = _url.replace(match, _.get(formData, jPath));
    }

    //Check if documents, upload and get fileStoreId
    if (formData['Documents'] && formData['Documents'].length) {
      let documents = [...formData['Documents']];
      let _docs = [];
      let counter = documents.length,
        breakOut = 0;
      for (let i = 0; i < documents.length; i++) {
        fileUpload(documents[i].fileStoreId, self.props.moduleName, function(err, res) {
          if (breakOut == 1) return;
          if (err) {
            breakOut = 1;
            self.props.setLoadingStatus('hide');
            self.props.toggleSnackbarAndSetText(true, err, false, true);
          } else {
            _docs.push({
              ...documents[i],
              filePath: res.files[0].fileStoreId,
            });
            counter--;
            if (counter == 0 && breakOut == 0) {
              formData['Documents'] = _docs;
              // self.makeAjaxCall(formData, _url);
              Api.commonApiPost(
                '/citizen-services/v1/requests/_create',
                {},
                { serviceReq: ServiceRequest },
                null,
                true,
                false,
                null,
                JSON.parse(localStorage.userRequest)
              ).then(
                function(res) {
                  // self.generateReceipt(res);
                  self.props.setLoadingStatus('hide');
                },
                function(err) {
                  self.props.setLoadingStatus('hide');
                  self.props.toggleSnackbarAndSetText(true, err.message, false, true);
                }
              );
            }
          }
        });
      }
    } else {
      Api.commonApiPost(
        '/citizen-services/v1/requests/_create',
        {},
        { serviceReq: ServiceRequest },
        null,
        true,
        false,
        null,
        JSON.parse(localStorage.userRequest)
      ).then(
        function(res) {
          // self.generateReceipt(res);
          self.props.setLoadingStatus('hide');
        },
        function(err) {
          self.props.setLoadingStatus('hide');
          self.props.toggleSnackbarAndSetText(true, err.message, false, true);
        }
      );
      // self.makeAjaxCall(formData, _url);
    }
  };

  getVal = (path, dateBool) => {
    var _val = _.get(this.props.formData, path);
    if (dateBool && typeof _val == 'string' && _val && _val.indexOf('-') > -1) {
      var _date = _val.split('-');
      return new Date(_date[0], Number(_date[1]) - 1, _date[2]);
    }

    return typeof _val != 'undefined' ? _val : '';
  };

  hideField = (_mockData, hideObject, reset) => {
    let { moduleName, actionName, setFormData, delRequiredFields, removeFieldErrors, addRequiredFields } = this.props;
    let _formData = { ...this.props.formData };
    if (hideObject.isField) {
      for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
        for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
          if (hideObject.name == _mockData[moduleName + '.' + actionName].groups[i].fields[j].name) {
            _mockData[moduleName + '.' + actionName].groups[i].fields[j].hide = reset ? false : true;
            if (!reset) {
              _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
              setFormData(_formData);
              //Check if required is true, if yes remove from required fields
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
                delRequiredFields([_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath]);
                removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
              }
            } else if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
              addRequiredFields([_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath]);
            }

            break;
          }
        }
      }
    } else {
      let flag = 0;
      for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
        if (hideObject.name == _mockData[moduleName + '.' + actionName].groups[i].name) {
          flag = 1;
          _mockData[moduleName + '.' + actionName].groups[i].hide = reset ? false : true;
          if (!reset) {
            var _rReq = [];
            for (var j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
              _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
                _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
                removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
              }
            }
            delRequiredFields(_rReq);
            setFormData(_formData);
          } else {
            var _rReq = [];
            for (var j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired)
                _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
            }
            addRequiredFields(_rReq);
          }
          break;
        }
      }

      if (flag == 0) {
        for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
          if (_mockData[moduleName + '.' + actionName].groups[i].children && _mockData[moduleName + '.' + actionName].groups[i].children.length) {
            for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].children.length; j++) {
              for (let k = 0; k < _mockData[moduleName + '.' + actionName].groups[i].children[j].groups.length; k++) {
                if (hideObject.name == _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].name) {
                  _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].hide = reset ? false : true;
                  if (!reset) {
                    var _rReq = [];
                    for (let a = 0; a < _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields.length; a++) {
                      _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].jsonPath, '');
                      if (_mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].isRequired) {
                        _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].jsonPath);
                        removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].jsonPath);
                      }
                    }
                    delRequiredFields(_rReq);
                    setFormData(_formData);
                  } else {
                    var _rReq = [];
                    for (let a = 0; a < _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields.length; a++) {
                      if (_mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].isRequired)
                        _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].jsonPath);
                    }
                    addRequiredFields(_rReq);
                  }
                }
              }
            }
          }
        }
      }
    }

    return _mockData;
  };

  showField = (_mockData, showObject, reset) => {
    let { moduleName, actionName, setFormData, delRequiredFields, removeFieldErrors, addRequiredFields } = this.props;
    let _formData = { ...this.props.formData };
    if (showObject.isField) {
      for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
        for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
          if (showObject.name == _mockData[moduleName + '.' + actionName].groups[i].fields[j].name) {
            _mockData[moduleName + '.' + actionName].groups[i].fields[j].hide = reset ? true : false;
            if (!reset) {
              _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
              setFormData(_formData);
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
                addRequiredFields([_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath]);
              }
            } else if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
              delRequiredFields([_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath]);
              removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
            }
            break;
          }
        }
      }
    } else {
      let flag = 0;
      for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
        if (showObject.name == _mockData[moduleName + '.' + actionName].groups[i].name) {
          flag = 1;
          _mockData[moduleName + '.' + actionName].groups[i].hide = reset ? true : false;
          if (!reset) {
            var _rReq = [];
            for (var j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
              _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired)
                _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
            }

            addRequiredFields(_rReq);
            setFormData(_formData);
          } else {
            var _rReq = [];
            for (var j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
                _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
                removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
              }
            }
            delRequiredFields(_rReq);
          }
          break;
        }
      }

      if (flag == 0) {
        for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
          if (_mockData[moduleName + '.' + actionName].groups[i].children && _mockData[moduleName + '.' + actionName].groups[i].children.length) {
            for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].children.length; j++) {
              for (let k = 0; k < _mockData[moduleName + '.' + actionName].groups[i].children[j].groups.length; k++) {
                if (showObject.name == _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].name) {
                  _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].hide = reset ? true : false;
                  /*if(!reset) {

                  } else {

                  }*/
                }
              }
            }
          }
        }
      }
    }

    return _mockData;
  };

  enField = (_mockData, enableStr, reset) => {
    let { moduleName, actionName, setFormData } = this.props;
    let _formData = { ...this.props.formData };
    for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
      for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
        if (enableStr == _mockData[moduleName + '.' + actionName].groups[i].fields[j].name) {
          _mockData[moduleName + '.' + actionName].groups[i].fields[j].isDisabled = reset ? true : false;
          if (!reset) {
            _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
            setFormData(_formData);
          }
          break;
        }
      }
    }

    return _mockData;
  };

  disField = (_mockData, disableStr, reset) => {
    let { moduleName, actionName, setFormData } = this.props;
    let _formData = { ...this.props.formData };
    for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
      for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
        if (disableStr == _mockData[moduleName + '.' + actionName].groups[i].fields[j].name) {
          _mockData[moduleName + '.' + actionName].groups[i].fields[j].isDisabled = reset ? false : true;
          if (!reset) {
            _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
            setFormData(_formData);
          }

          break;
        }
      }
    }

    return _mockData;
  };

  checkIfHasEnDisFields = (jsonPath, val) => {
    let _mockData = { ...this.props.mockData };
    let { moduleName, actionName, setMockData } = this.props;
    for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
      for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
        if (
          jsonPath == _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath &&
          _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields &&
          _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields.length
        ) {
          for (let k = 0; k < _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields.length; k++) {
            if (val == _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].ifValue) {
              for (let y = 0; y < _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].disable.length; y++) {
                _mockData = this.disField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].disable[y]);
              }

              for (let z = 0; z < _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].enable.length; z++) {
                _mockData = this.enField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].enable[z]);
              }
            } else {
              for (let y = 0; y < _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].disable.length; y++) {
                _mockData = this.disField(
                  _mockData,
                  _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].disable[y],
                  true
                );
              }

              for (let z = 0; z < _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].enable.length; z++) {
                _mockData = this.enField(
                  _mockData,
                  _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].enable[z],
                  true
                );
              }
            }
          }
        }
      }
    }

    setMockData(_mockData);
  };

  checkIfHasShowHideFields = (jsonPath, val) => {
    let _mockData = { ...this.props.mockData };
    let { moduleName, actionName, setMockData } = this.props;
    for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
      for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
        if (
          jsonPath == _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath &&
          _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields &&
          _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields.length
        ) {
          for (let k = 0; k < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields.length; k++) {
            if (val == _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].ifValue) {
              for (let y = 0; y < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide.length; y++) {
                _mockData = this.hideField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide[y]);
              }

              for (let z = 0; z < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length; z++) {
                _mockData = this.showField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show[z]);
              }
            } else {
              for (let y = 0; y < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide.length; y++) {
                _mockData = this.hideField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide[y], true);
              }

              for (let z = 0; z < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length; z++) {
                _mockData = this.showField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show[z], true);
              }
            }
          }
        }
      }
    }

    setMockData(_mockData);
  };

  handleChange = (e, property, isRequired, pattern, requiredErrMsg = 'Required', patternErrMsg = 'Pattern Missmatch') => {
    let { getVal } = this;
    let { handleChange, mockData, setDropDownData } = this.props;
    let hashLocation = window.location.hash;
    let obj = specifications['fn.create'];
    // console.log(obj);
    let depedants = jp.query(obj, `$.groups..fields[?(@.jsonPath=="${property}")].depedants.*`);
    this.checkIfHasShowHideFields(property, e.target.value);
    this.checkIfHasEnDisFields(property, e.target.value);
    handleChange(e, property, isRequired, pattern, requiredErrMsg, patternErrMsg);

    _.forEach(depedants, function(value, key) {
      if (value.type == 'dropDown') {
        let splitArray = value.pattern.split('?');
        let context = '';
        let id = {};
        // id[splitArray[1].split("&")[1].split("=")[0]]=e.target.value;
        for (var j = 0; j < splitArray[0].split('/').length; j++) {
          context += splitArray[0].split('/')[j] + '/';
        }

        let queryStringObject = splitArray[1].split('|')[0].split('&');
        for (var i = 0; i < queryStringObject.length; i++) {
          if (i) {
            if (queryStringObject[i].split('=')[1].search('{') > -1) {
              if (
                queryStringObject[i]
                  .split('=')[1]
                  .split('{')[1]
                  .split('}')[0] == property
              ) {
                id[queryStringObject[i].split('=')[0]] = e.target.value || '';
              } else {
                id[queryStringObject[i].split('=')[0]] = getVal(
                  queryStringObject[i]
                    .split('=')[1]
                    .split('{')[1]
                    .split('}')[0]
                );
              }
            } else {
              id[queryStringObject[i].split('=')[0]] = queryStringObject[i].split('=')[1];
            }
          }
        }

        Api.commonApiPost(context, id).then(
          function(response) {
            if (response) {
              let keys = jp.query(response, splitArray[1].split('|')[1]);
              let values = jp.query(response, splitArray[1].split('|')[2]);
              let dropDownData = [];
              for (var k = 0; k < keys.length; k++) {
                let obj = {};
                obj['key'] = keys[k];
                obj['value'] = values[k];
                dropDownData.push(obj);
              }

              dropDownData.sort(function(s1, s2) {
                return s1.value < s2.value ? -1 : s1.value > s2.value ? 1 : 0;
              });
              dropDownData.unshift({ key: null, value: '-- Please Select --' });
              setDropDownData(value.jsonPath, dropDownData);
            }
          },
          function(err) {
            console.log(err);
          }
        );
        // console.log(id);
        // console.log(context);
      } else if (value.type == 'textField') {
        let object = {
          target: {
            value: eval(eval(value.pattern)),
          },
        };
        handleChange(object, value.jsonPath, value.isRequired, value.rg, value.requiredErrMsg, value.patternErrMsg);
      }
    });
  };

  incrementIndexValue = (group, jsonPath) => {
    let { formData } = this.props;
    var length = _.get(formData, jsonPath) ? _.get(formData, jsonPath).length : 0;
    var _group = JSON.stringify(group);
    var regexp = new RegExp(jsonPath + '\\[\\d{1}\\]', 'g');
    _group = _group.replace(regexp, jsonPath + '[' + (length + 1) + ']');
    return JSON.parse(_group);
  };

  getNewSpecs = (group, updatedSpecs, path) => {
    let { moduleName, actionName } = this.props;
    let groupsArray = _.get(updatedSpecs[moduleName + '.' + actionName], path);
    groupsArray.push(group);
    _.set(updatedSpecs[moduleName + '.' + actionName], path, groupsArray);
    return updatedSpecs;
  };

  getPath = value => {
    let { mockData, moduleName, actionName } = this.props;
    const getFromGroup = function(groups) {
      for (var i = 0; i < groups.length; i++) {
        if (groups[i].children) {
          for (var j = 0; j < groups[i].children.length; i++) {
            if (groups[i].children[j].jsonPath == value) {
              return 'groups[' + i + '].children[' + j + '].groups';
            } else {
              return 'groups[' + i + '].children[' + j + '][' + getFromGroup(groups[i].children[j].groups) + ']';
            }
          }
        }
      }
    };

    return getFromGroup(mockData[moduleName + '.' + actionName].groups);
  };

  addNewCard = (group, jsonPath, groupName) => {
    let self = this;
    let { setMockData, metaData, moduleName, actionName, setFormData, formData } = this.props;
    let mockData = { ...this.props.mockData };
    if (!jsonPath) {
      for (var i = 0; i < metaData[moduleName + '.' + actionName].groups.length; i++) {
        if (groupName == metaData[moduleName + '.' + actionName].groups[i].name) {
          var _groupToBeInserted = {
            ...metaData[moduleName + '.' + actionName].groups[i],
          };
          for (var j = mockData[moduleName + '.' + actionName].groups.length - 1; j >= 0; j--) {
            if (groupName == mockData[moduleName + '.' + actionName].groups[j].name) {
              var regexp = new RegExp(
                mockData[moduleName + '.' + actionName].groups[j].jsonPath.replace(/\[/g, '\\[').replace(/\]/g, '\\]') + '\\[\\d{1}\\]',
                'g'
              );
              var stringified = JSON.stringify(_groupToBeInserted);
              var ind = mockData[moduleName + '.' + actionName].groups[j].index || 0;
              //console.log(ind);
              _groupToBeInserted = JSON.parse(
                stringified.replace(regexp, mockData[moduleName + '.' + actionName].groups[i].jsonPath + '[' + (ind + 1) + ']')
              );
              _groupToBeInserted.index = ind + 1;
              mockData[moduleName + '.' + actionName].groups.splice(j + 1, 0, _groupToBeInserted);
              //console.log(mockData[moduleName + "." + actionName].groups);
              setMockData(mockData);
              var temp = { ...formData };
              self.setDefaultValues(mockData[moduleName + '.' + actionName].groups, temp);
              setFormData(temp);
              break;
            }
          }
          break;
        }
      }
    } else {
      group = JSON.parse(JSON.stringify(group));
      //Increment the values of indexes
      var grp = _.get(metaData[moduleName + '.' + actionName], self.getPath(jsonPath) + '[0]');
      group = this.incrementIndexValue(grp, jsonPath);
      //Push to the path
      var updatedSpecs = this.getNewSpecs(group, JSON.parse(JSON.stringify(mockData)), self.getPath(jsonPath));
      //Create new mock data
      setMockData(updatedSpecs);
    }
  };

  removeCard = (jsonPath, index, groupName) => {
    //Remove at that index and update upper array values
    let { setMockData, moduleName, actionName, setFormData } = this.props;
    let _formData = { ...this.props.formData };
    let self = this;
    let mockData = { ...this.props.mockData };

    if (!jsonPath) {
      var ind = 0;
      for (let i = 0; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
        if (index == i && groupName == mockData[moduleName + '.' + actionName].groups[i].name) {
          mockData[moduleName + '.' + actionName].groups.splice(i, 1);
          ind = i;
          break;
        }
      }

      for (let i = ind; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
        if (mockData[moduleName + '.' + actionName].groups[i].name == groupName) {
          var regexp = new RegExp(
            mockData[moduleName + '.' + actionName].groups[i].jsonPath.replace(/\[/g, '\\[').replace(/\]/g, '\\]') + '\\[\\d{1}\\]',
            'g'
          );
          //console.log(regexp);
          //console.log(mockData[moduleName + "." + actionName].groups[i].index);
          //console.log(mockData[moduleName + "." + actionName].groups[i].index);
          var stringified = JSON.stringify(mockData[moduleName + '.' + actionName].groups[i]);
          mockData[moduleName + '.' + actionName].groups[i] = JSON.parse(
            stringified.replace(
              regexp,
              mockData[moduleName + '.' + actionName].groups[i].jsonPath + '[' + (mockData[moduleName + '.' + actionName].groups[i].index - 1) + ']'
            )
          );

          if (_.get(_formData, mockData[moduleName + '.' + actionName].groups[i].jsonPath)) {
            var grps = [..._.get(_formData, mockData[moduleName + '.' + actionName].groups[i].jsonPath)];
            //console.log(mockData[moduleName + "." + actionName].groups[i].index-1);
            grps.splice(mockData[moduleName + '.' + actionName].groups[i].index - 1, 1);
            //console.log(grps);
            _.set(_formData, mockData[moduleName + '.' + actionName].groups[i].jsonPath, grps);
            //console.log(_formData);
            setFormData(_formData);
          }
        }
      }
      //console.log(mockData[moduleName + "." + actionName].groups);
      setMockData(mockData);
    } else {
      var _groups = _.get(mockData[moduleName + '.' + actionName], self.getPath(jsonPath));
      _groups.splice(index, 1);
      var regexp = new RegExp('\\[\\d{1}\\]', 'g');
      for (var i = index; i < _groups.length; i++) {
        var stringified = JSON.stringify(_groups[i]);
        _groups[i] = JSON.parse(stringified.replace(regexp, '[' + i + ']'));
      }

      _.set(mockData, self.getPath(jsonPath), _groups);
      setMockData(mockData);
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  openPaymentPopup = () => {
    this.setState({ open: true });
  };

  makePayment = res => {
    //DO EVERYTHING FOR MAKING PAYMENT HERE
    let { serviceRequest, RequestInfo, documents } = this.state;
    let self = this;
    let { formData, metaData } = this.props;
    self.props.setLoadingStatus('loading');

    window.localStorage.setItem('serviceRequest', JSON.stringify(serviceRequest));
    window.localStorage.setItem('RequestInfo', JSON.stringify(RequestInfo));
    window.localStorage.setItem('documents', JSON.stringify(documents));
    window.localStorage.setItem('formData', JSON.stringify(formData));
    window.localStorage.setItem('moduleName', this.props.match.params.id);
    window.localStorage.setItem('metaData', JSON.stringify(metaData));
    window.localStorage.setItem('workflow', 'fireNoc');

    var PGRequest = {
      billNumber: res.serviceReq.serviceRequestId,
      returnUrl: window.location.origin + '/citizen-services/v1/pgresponse',
      date: new Date().getTime(),
      biller: JSON.parse(localStorage.userRequest).name,
      amount: 20,
      billService: res.serviceReq.serviceCode,
      serviceRequestId: res.serviceReq.serviceRequestId,
      consumerCode: res.serviceReq.serviceRequestId,
      tenantId: localStorage.tenantId,
      amountPaid: 20,
      uid: JSON.parse(localStorage.userRequest).id,
    };

    Api.commonApiPost(
      '/citizen-services/v1/pgrequest/_create',
      {},
      { PGRequest },
      null,
      self.props.metaData['fn.create'].useTimestamp,
      false,
      null,
      JSON.parse(localStorage.userRequest)
    ).then(
      function(res) {
        self.props.setLoadingStatus('hide');

        var newForm = $('<form>', {
          action: 'http://115.124.122.117:8080/mahaulb/getHashKeyBeforePayment',
          methot: 'post',
          target: '_top',
        })
          .append(
            $('<input>', {
              name: 'billNumber',
              value: res.PGRequest.billNumber,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'billService',
              value: res.PGRequest.billService,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'amount',
              // 'value': 1,
              value: res.PGRequest.amountPaid,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'returnUrl',
              value: res.PGRequest.retrunUrl,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'date',
              value: res.PGRequest.date,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'biller',
              value: res.PGRequest.biller,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'serviceRequestId',
              value: res.PGRequest.serviceRequestId,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'tenantId',
              value: res.PGRequest.tenantId,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'amountPaid',
              value: res.PGRequest.amountPaid,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'requestHash',
              value: res.PGRequest.requestHash,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'mobileNo',
              value: '7795929033',
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'email',
              value: res.PGRequest.email,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'consumerCode',
              value: res.PGRequest.consumerCode,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'uid',
              value: res.PGRequest.uid,
              type: 'hidden',
            })
          );
        $(document.body).append(newForm);
        newForm.submit();
      },
      function(err) {
        self.props.toggleSnackbarAndSetText(true, err.message, false, true);
        self.props.setLoadingStatus('hide');
      }
    );
  };

  generateReceipt = response => {
    let ServiceRequest = response.serviceReq,
      self = this;
    var AllResponses = [...ServiceRequest.backendServiceDetails];
    var paymentGateWayRes = JSON.parse(localStorage.getItem('paymentGateWayResponse'));
    ServiceRequest.status = 'CREATED';
    var BillReceiptObject = [];
    BillReceiptObject[0] = { Bill: [] };
    BillReceiptObject[0]['Bill'] = AllResponses[1].response.Bill;
    BillReceiptObject[0]['Bill'][0]['paidBy'] = BillReceiptObject[0]['Bill'][0].payeeName;
    BillReceiptObject[0]['tenantId'] = localStorage.getItem('tenantId');
    BillReceiptObject[0]['instrument'] = {
      tenantId: localStorage.getItem('tenantId'),
      amount: 20,
      instrumentType: { name: 'Online' },
    };

    BillReceiptObject[0]['Bill'][0]['billDetails'][0]['amountPaid'] = 20;

    BillReceiptObject[0]['onlinePayment'] = {
      // "receiptHeader" : "",
      paymentGatewayName: paymentGateWayRes['paymentMethod'],
      transactionDate: new Date().getTime(),
      transactionAmount: BillReceiptObject[0]['Bill'][0]['billDetails'][0]['amountPaid'],
      transactionNumber: paymentGateWayRes['transactionId'],
      authorisationStatusCode: '0300',
      status: paymentGateWayRes['status'],
      remarks: 'Online Payment is done successfully',
      // "callBackUrl" : "",
      tenantId: localStorage.getItem('tenantId'),
      // "auditDetails" : {
      // }
    };
    ServiceRequest.backendServiceDetails = [
      {
        url: 'http://collection-services:8080/collection-services/receipts/_create',
        request: {
          RequestInfo: self.state.RequestInfo,
          Receipt: BillReceiptObject,
        },
      },
    ];

    Api.commonApiPost(
      '/citizen-services/v1/requests/_update',
      {},
      { serviceReq: ServiceRequest },
      null,
      true,
      false,
      null,
      JSON.parse(localStorage.userRequest)
    ).then(
      function(res) {
        self.props.setLoadingStatus('hide');
        self.handleClose();
        self.setState({
          stepIndex: 1,
          Receipt: res.serviceReq.backendServiceDetails[0].response.Receipt,
        });
        $('html, body').animate({ scrollTop: 0 }, 'fast');
      },
      function(err) {
        self.props.setLoadingStatus('hide');
        self.props.toggleSnackbarAndSetText(true, err.message, false, true);
      }
    );
  };

  pay = () => {
    //Create SR
    //Create new connection
    //Demand search & create if not there
    //Bill generate
    //Create receipt
    //Update SR
    //Update WC
    let self = this;
    var { formData } = this.props;
    var ConnectionObject = { ...self.state.formData };
    var DemandBillQuery = `?businessService=CS&tenantId=${localStorage.getItem('tenantId')}&consumerCode=`;
    let DemandRequest = {};
    DemandRequest['Demands'] = Object.assign([], self.props.metaData['fn.create'].feeDetails);
    DemandRequest['Demands'][0].tenantId = localStorage.getItem('tenantId');
    DemandRequest['Demands'][0].consumerCode = '';
    DemandRequest['Demands'][0].owner.id = JSON.parse(localStorage.userRequest).id;
    DemandRequest['Demands'][0].taxPeriodFrom = 1491004800000;
    DemandRequest['Demands'][0].taxPeriodTo = 1522540799000;
    DemandRequest['Demands'][0].demandDetails[0].taxHeadMasterCode = 'FIRE_PROV_FIRE_NOC_FEE';
    var ServiceRequest = {
      tenantId: localStorage.getItem('tenantId'),
      serviceRequestId: null,
      serviceCode: 'BPA_FIRE_NOC',
      lat: 12,
      lang: 23,
      address: 'address',
      addressId: 'addressId',
      email: 'email',
      deviceId: 'deviceId',
      accountId: 'accountId',
      firstName: JSON.parse(localStorage.userRequest).name || '',
      lastName: 'firstName',
      phone: 'phone',
      description: '',
      consumerCode: '',
      attributeValues: [
        {
          key: 'tenantId',
          value: localStorage.getItem('tenantId'),
        },
      ],
      status: 'CREATED',
      assignedTo: 'assignedTo',
      comments: [],
      backendServiceDetails: [
        {
          url: 'http://billing-service:8080/billing-service/demand/_create?tenantId=' + localStorage.tenantId,
          request: {
            RequestInfo: self.state.RequestInfo,
            ...DemandRequest,
          },
        },
        {
          url: 'http://billing-service:8080/billing-service/bill/_generate' + DemandBillQuery,
          request: {
            RequestInfo: self.state.RequestInfo,
          },
        },
      ],
      moduleObject: formData,
      Documents: formData.Documents,
    };

    self.props.setLoadingStatus('loading');
    //Check if documents, upload and get fileStoreId
    if (formData['Documents'] && formData['Documents'].length) {
      let documents = [...formData['Documents']];
      let _docs = [];
      let counter = documents.length,
        breakOut = 0;
      for (let i = 0; i < documents.length; i++) {
        if (documents[i].filePath && documents[i].filePath.constructor == File) {
          fileUpload(documents[i].filePath, self.props.moduleName, function(err, res) {
            if (breakOut == 1) return;
            if (err) {
              breakOut = 1;
              self.props.setLoadingStatus('hide');
              self.props.toggleSnackbarAndSetText(true, err, false, true);
            } else {
              _docs.push({
                ...documents[i],
                filePath: res.files[0].fileStoreId,
              });
              counter--;
              if (counter == 0 && breakOut == 0) {
                ServiceRequest.documents = [];
                for (var k = 0; k < _docs.length; k++) {
                  if (_docs[k].filePath) ServiceRequest.documents.push(_docs[k]);
                }
                //ServiceRequest.documents=_docs;
                formData['Documents'] = _docs;
                Api.commonApiPost(
                  '/citizen-services/v1/requests/_create',
                  {},
                  { serviceReq: ServiceRequest },
                  null,
                  true,
                  false,
                  null,
                  JSON.parse(localStorage.userRequest)
                ).then(
                  function(res) {
                    //self.generateReceipt(res);
                    localStorage.setItem('response', JSON.stringify(res));
                    self.props.setLoadingStatus('hide');
                    self.makePayment(res);
                  },
                  function(err) {
                    self.props.setLoadingStatus('hide');
                    self.props.toggleSnackbarAndSetText(true, err.message, false, true);
                  }
                );
              }
            }
          });
        } else {
          _docs.push(documents[i]);
          counter--;
          if (counter == 0 && breakOut == 0) {
            ServiceRequest.documents = [];
            for (var k = 0; k < _docs.length; k++) {
              if (_docs[k].filePath) ServiceRequest.documents.push(_docs[k]);
            }
            formData['Documents'] = _docs;
            Api.commonApiPost(
              '/citizen-services/v1/requests/_create',
              {},
              { serviceReq: ServiceRequest },
              null,
              true,
              false,
              null,
              JSON.parse(localStorage.userRequest)
            ).then(
              function(res) {
                //self.generateReceipt(res);
                localStorage.setItem('response', JSON.stringify(res));
                self.props.setLoadingStatus('hide');
                self.makePayment(res);
              },
              function(err) {
                self.props.setLoadingStatus('hide');
                self.props.toggleSnackbarAndSetText(true, err.message, false, true);
              }
            );
          }
        }
      }
    } else {
      Api.commonApiPost(
        '/citizen-services/v1/requests/_create',
        {},
        { serviceReq: ServiceRequest },
        null,
        true,
        false,
        null,
        JSON.parse(localStorage.userRequest)
      ).then(
        function(res) {
          //self.generateReceipt(res);
          localStorage.setItem('response', JSON.stringify(res));
          self.props.setLoadingStatus('hide');
          self.makePayment(res);
        },
        function(err) {
          self.props.setLoadingStatus('hide');
          self.props.toggleSnackbarAndSetText(true, err.message, false, true);
        }
      );
      // self.makeAjaxCall(formData, _url);
    }

    // self.props.setLoadingStatus("loading");
    // Api.commonApiPost("/citizen-services/v1/requests/_create", {}, {"serviceReq": ServiceRequest}, null, true, false, null, JSON.parse(localStorage.userRequest)).then(function(res){
    //   self.generateReceipt(res);
    // }, function(err){
    //   self.props.setLoadingStatus("hide");
    //   self.props.toggleSnackbarAndSetText(true, err.message, false, true);
    // })

    //Mock Data
    /*let self = this;
    self.handleClose();
    self.setState({
      stepIndex: 1
    });
    $('html, body').animate({ scrollTop: 0 }, 'fast');*/
  };

  generatePDF = () => {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
    var cdn = `
      <!-- Latest compiled and minified CSS -->
      <link rel="stylesheet" media="all" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

      <!-- Optional theme -->
      <link rel="stylesheet" media="all" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">  `;
    mywindow.document.write('<html><head><title> </title>');
    mywindow.document.write(cdn);
    mywindow.document.write('</head><body>');
    mywindow.document.write(document.getElementById('DownloadReceipt').innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    setTimeout(function() {
      mywindow.print();
      mywindow.close();
    }, 1000);

    return true;
  };

  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors, isFormValid } = this.props;
    let { create, handleChange, getVal, addNewCard, removeCard, autoComHandler, handleClose } = this;
    let { open, stepIndex } = this.state;
    let self = this;
    console.log(formData);
    const getStepContent = function(stepIndex) {
      switch (stepIndex) {
        case 0:
          return (
            <form
              onSubmit={e => {
                create(e);
              }}
            >
              {!_.isEmpty(mockData) &&
                mockData['fn.create'] && (
                  <ShowFields
                    groups={mockData['fn.create'].groups}
                    noCols={mockData['fn.create'].numCols}
                    ui="google"
                    handler={handleChange}
                    getVal={getVal}
                    fieldErrors={fieldErrors}
                    useTimestamp={mockData['fn.create'].useTimestamp || false}
                    addNewCard={addNewCard}
                    removeCard={removeCard}
                    autoComHandler={autoComHandler}
                  />
                )}
              <Row>
                <Col md={12}>
                  <Card className="uiCard">
                    <CardHeader title="Upload Documents" />
                    <CardText>
                      <Table responsive style={{ fontSize: 'bold' }} bordered condensed>
                        <thead>
                          <tr>
                            <th>Sr.No</th>
                            <th>Documents Name</th>
                            <th>Attach Documents</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documents.length > 0 &&
                            documents.map((item, key) => {
                              return (
                                <tr key={key}>
                                  <td>{key + 1}</td>
                                  <td>{item.name}</td>
                                  <td>
                                    <input
                                      type="file"
                                      onChange={e => {
                                        handleChange(
                                          {
                                            target: {
                                              value: e.target.files[0],
                                            },
                                          },
                                          'Documents[' + key + '].filePath',
                                          false,
                                          '^.{0,200}$',
                                          '',
                                          ''
                                        );
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <TextField
                                      floatingLabelStyle={{
                                        color: '#696969',
                                        fontSize: '20px',
                                        'white-space': 'nowrap',
                                      }}
                                      inputStyle={{ color: '#5F5C57' }}
                                      floatingLabelFixed={true}
                                      style={{ display: 'inline-block' }}
                                      errorStyle={{ float: 'left' }}
                                      fullWidth={true}
                                      multiLine={true}
                                      rows={1}
                                      maxLength={''}
                                      value={getVal('Documents[' + key + '].remarks')}
                                      errorText={fieldErrors['']}
                                      onChange={e => {
                                        if (e.target.value) {
                                          e.target.value = e.target.value.replace(/^\s*/, '');
                                          if (e.target.value[e.target.value.length - 1] == ' ' && e.target.value[e.target.value.length - 2] == ' ')
                                            return;
                                        }
                                        handleChange(e, 'Documents[' + key + '].remarks', false, '^.{0,200}$', '', '');
                                      }}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </Table>
                    </CardText>
                  </Card>
                  <Card className="uiCard">
                    <CardHeader
                      style={{ paddingTop: 4, paddingBottom: 0 }}
                      title={
                        <div
                          style={{
                            color: '#354f57',
                            fontSize: 18,
                            margin: '8px 0',
                          }}
                        >
                          Application Fee
                        </div>
                      }
                    />}
                    <CardText>
                      <Grid>
                        <Row>
                          <Col xs={12} md={4}>
                            <span style={{ fontSize: '15px' }}>Fee to be paid(Rs.)</span>
                            <br />
                            20
                          </Col>
                        </Row>
                      </Grid>
                    </CardText>
                  </Card>
                </Col>
              </Row>
              <div style={{ textAlign: 'center' }}>
                <br />
                <RaisedButton
                  label="Pay"
                  primary={true}
                  onClick={e => {
                    self.pay();
                  }}
                />
                <br />
              </div>
            </form>
          );
        case 1:
          return (
            <Row id="allCertificates">
              <Col md={6} mdOffset={3}>
                {self.state.Receipt && self.state.Receipt[0] ? (
                  <Card id="DownloadReceipt">
                    <CardHeader title={<strong>Receipt for: Application Fee</strong>} />
                    <CardText>
                      <Table responsive style={{ fontSize: 'bold' }} id="ReceiptForWcAPartOne1" bordered condensed>
                        <tbody>
                          <tr>
                            <td style={{ textAlign: 'left' }}>
                              <img src="./temp/images/headerLogo.png" height="60" width="60" />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <b>Roha Municipal Council</b>
                              <br />
                              Building Plan Department
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <img src="./temp/images/AS.png" height="60" width="60" />
                            </td>
                          </tr>
                          <tr>
                            <td style={{ textAlign: 'left' }}>
                              Receipt Number :{' '}
                              {self.state.Receipt[0].Bill[0].billDetails[0].receiptNumber
                                ? self.state.Receipt[0].Bill[0].billDetails[0].receiptNumber
                                : 'NA'}
                            </td>
                            <td style={{ textAlign: 'center' }}>Receipt For : Application Fee</td>
                            <td style={{ textAlign: 'right' }}>
                              Receipt Date: {getFullDate(self.state.Receipt[0].Bill[0].billDetails[0].receiptDate)}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3} style={{ textAlign: 'left' }}>
                              Service Request Number: {self.state.Receipt[0].Bill[0].billDetails[0].consumerCode}
                              <br />
                              Applicant Name : {self.state.Receipt[0].Bill[0].payeeName}
                              <br />
                              Amount : Rs. 20<br />
                            </td>
                          </tr>
                        </tbody>
                      </Table>

                      <Table id="ReceiptForWcAPartTwo" responsive bordered condensed>
                        <tbody>
                          <tr>
                            <td colSpan={2}>Bill Reference No.& Date</td>
                            <td colSpan={8}>Details</td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              {self.state.Receipt[0].Bill[0].billDetails[0].billNumber +
                                '-' +
                                getFullDate(self.state.Receipt[0].Bill[0].billDetails[0].receiptDate)}
                            </td>
                            <td colSpan={8}>Application for Fire NOC</td>
                          </tr>

                          <tr>
                            <td colSpan={10}>Amount in words: Rs. Twenty only</td>
                          </tr>
                          <tr>
                            <td colSpan={10}>Payment Mode</td>
                          </tr>
                          <tr>
                            <td>Mode</td>
                            <td>Amount</td>
                            <td>Transaction No</td>
                            <td>Transaction Date</td>
                            {true && <td colSpan={6}>Bank Name</td>}
                          </tr>
                          <tr>
                            <td>Online</td>
                            <td>{self.state.Receipt[0].Bill[0].billDetails[0].totalAmount}</td>
                            {self.state.Receipt[0].instrument.instrumentType.name == 'Online' ? (
                              <td> {self.state.Receipt[0].transactionId} </td>
                            ) : (
                              <td> {self.state.Receipt[0].transactionId} </td>
                            )}

                            {self.state.Receipt[0].instrument.instrumentType.name == 'Online' ? (
                              <td> {getFullDate(self.state.Receipt[0].Bill[0].billDetails[0].receiptDate)} </td>
                            ) : (
                              <td> {getFullDate(self.state.Receipt[0].Bill[0].billDetails[0].receiptDate)}</td>
                            )}

                            <td colSpan={6}>
                              {self.state.Receipt[0].instrument.instrumentType.name == 'Cash' ||
                              self.state.Receipt[0].instrument.instrumentType.name == 'Online'
                                ? 'NA'
                                : self.state.Receipt[0].instrument.bank.name}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </CardText>
                  </Card>
                ) : (
                  ''
                )}
                <br />
                <div style={{ textAlign: 'center' }}>
                  <RaisedButton primary={true} label="Download" onClick={self.generatePDF} />
                </div>
              </Col>
              <div className="page-break" />
            </Row>
          );
        case 2:
          return 'This is the bit I really care about!';
        default:
          return "You're a long way from home sonny jim!";
      }
    };

    return (
      <div className="Report">
        <div style={{ textAlign: 'center' }}>
          <h3> Fire NOC </h3>
        </div>
        <Stepper linear={false} activeStep={stepIndex}>
          <Step>
            <StepLabel>Create</StepLabel>
          </Step>
          <Step>
            <StepLabel>Download</StepLabel>
          </Step>
        </Stepper>
        {getStepContent(stepIndex)}
        <Dialog title="Payment Gateway - Mock" modal={false} open={open} onRequestClose={handleClose} autoScrollBodyContent={true}>
          <div style={{ textAlign: 'center' }}>
            <h4>Amount to be paid: Rs 20</h4>
            <br />
          </div>
          <UiButton handler={this.handleClose} item={{ label: 'Cancel', uiType: 'button' }} ui="google" />
          {'  '}
          <UiButton handler={this.pay} item={{ label: 'Pay & Proceed', uiType: 'button' }} ui="google" />
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  metaData: state.framework.metaData,
  mockData: state.framework.mockData,
  moduleName: state.framework.moduleName,
  actionName: state.framework.actionName,
  formData: state.frameworkForm.form,
  fieldErrors: state.frameworkForm.fieldErrors,
  isFormValid: state.frameworkForm.isFormValid,
  requiredFields: state.frameworkForm.requiredFields,
});

const mapDispatchToProps = dispatch => ({
  initForm: requiredFields => {
    dispatch({
      type: 'SET_REQUIRED_FIELDS',
      requiredFields,
    });
  },
  setMetaData: metaData => {
    dispatch({ type: 'SET_META_DATA', metaData });
  },
  setMockData: mockData => {
    dispatch({ type: 'SET_MOCK_DATA', mockData });
  },
  setFormData: data => {
    dispatch({ type: 'SET_FORM_DATA', data });
  },
  setModuleName: moduleName => {
    dispatch({ type: 'SET_MODULE_NAME', moduleName });
  },
  setActionName: actionName => {
    dispatch({ type: 'SET_ACTION_NAME', actionName });
  },
  handleChange: (e, property, isRequired = false, pattern = '', requiredErrMsg = '', patternErrMsg = '') => {
    dispatch({
      type: 'HANDLE_CHANGE_FRAMEWORK',
      property,
      value: e.target.value,
      isRequired,
      pattern,
      requiredErrMsg,
      patternErrMsg,
    });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg, isSuccess, isError) => {
    dispatch({
      type: 'TOGGLE_SNACKBAR_AND_SET_TEXT',
      snackbarState,
      toastMsg,
      isSuccess,
      isError,
    });
  },
  setDropDownData: (fieldName, dropDownData) => {
    dispatch({ type: 'SET_DROPDWON_DATA', fieldName, dropDownData });
  },
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
  delRequiredFields: requiredFields => {
    dispatch({ type: 'DEL_REQUIRED_FIELDS', requiredFields });
  },
  addRequiredFields: requiredFields => {
    dispatch({ type: 'ADD_REQUIRED_FIELDS', requiredFields });
  },
  removeFieldErrors: key => {
    dispatch({ type: 'REMOVE_FROM_FIELD_ERRORS', key });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Report);
