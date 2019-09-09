import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import _ from 'lodash';
import ShowFields from '../../../framework/showFields';

import { translate } from '../../../common/common';
import Api from '../../../../api/api';
import jp from 'jsonpath';
import UiButton from '../../../framework/components/UiButton';
import { fileUpload, getInitiatorPosition } from '../../../framework/utility/utility';
import $ from 'jquery';

var flag = 0;
var flags = 0;
var flag1 = 0;
var flag2 = 0;
var flag3 = 0;
var tradeCatVal = '';
var tradeSubVal = '';
var tradeLicenseVal = '';

var specifications = {};
let reqRequired = [];
let baseUrl = 'https://raw.githubusercontent.com/abhiegov/test/master/specs/';
class LegacyLicenseCreate extends Component {
  state = {
    pathname: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      validityYear: '',
      checkBoxDisable: false,
    };

    this.handleOpen = () => {
      this.setState({ open: true });
    };

    this.handleClose = () => {
      this.setState({ open: false });
    };

    this.handleOpenSub = () => {
      this.setState({ openSub: true });
    };

    this.handleCloseSub = () => {
      this.setState({ openSub: false });
    };

    this.handleOpenLicense = () => {
      this.setState({ openLicense: true });
    };

    this.handleCloseLicense = () => {
      this.setState({ openLicense: false });
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
    let obj = specifications[`tl.create`];
    reqRequired = [];
    self.setLabelAndReturnRequired(obj);
    initForm(reqRequired);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('tl');
    setActionName('create');

    if (hashLocation.split('/').indexOf('update') == 1) {
      var url = specifications[`tl.update`].searchUrl.split('?')[0];
      var id = self.props.match.params.id || self.props.match.params.master;
      var query = {
        [specifications[`tl.update`].searchUrl.split('?')[1].split('=')[0]]: id,
      };
      Api.commonApiPost(url, query, {}, false, specifications[`tl.update`].useTimestamp).then(
        function(res) {
          if (specifications[`tl.update`].isResponseArray) {
            var obj = {};
            _.set(obj, specifications[`tl.update`].objectName, jp.query(res, '$..[0]')[0]);
            self.props.setFormData(obj);
            self.setInitialUpdateData(obj, JSON.parse(JSON.stringify(specifications)), 'tl', 'update', specifications[`tl.update`].objectName);
          } else {
            self.props.setFormData(res);
            self.setInitialUpdateData(res, JSON.parse(JSON.stringify(specifications)), 'tl', 'update', specifications[`tl.update`].objectName);
          }
        },
        function(err) {}
      );
    } else {
      var formData = {};
      if (obj && obj.groups && obj.groups.length) self.setDefaultValues(obj.groups, formData);
      setFormData(formData);
    }

    this.setState({
      pathname: this.props.history.location.pathname,
    });
  }

  initData() {
    var hash = window.location.hash.split('/');
    let endPoint = '';
    let self = this;

    // try {
    //   if(hash.length == 3 || (hash.length == 4 && hash.indexOf("update") > -1)) {
    //     specifications = require(`./specs/${hash[2]}/${hash[2]}`).default;
    //   } else {
    //     specifications = require(`./specs/${hash[2]}/master/${hash[3]}`).default;
    //   }
    // } catch(e) {
    //   console.log(e);
    // }
    specifications = require(`../../../framework/specs/tl/master/CreateLegacyLicense`).default;
    self.displayUI(specifications);
  }

  componentDidMount() {
    this.initData();
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
          translate(self.props.actionName == 'create' ? response.responseInfo.status : 'wc.update.message.success'),
          true
        );
        setTimeout(function() {
          if (self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].idJsonPath) {
            if (self.props.actionName == 'update') {
              var hash = '/update/tl/CreateLegacyLicense/';
            } else {
              var hash =
                '/non-framework/tl/transaction/viewLicense' +
                '/' +
                _.get(response, self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].idJsonPath);
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
    e.preventDefault();
    let isFormValid = true;
    let self = this,
      _url;
    var formData = { ...this.props.formData };
    var feeCheck = true;

    if (formData.licenses[0].adhaarNumber == '') formData.licenses[0].adhaarNumber = null;
    console.log(formData);
    for (var i = 0; i < formData.licenses[0].feeDetails.length; i++) {
      var financialYear = formData.licenses[0].feeDetails[i].financialYear;
      if (formData.licenses[0].feeDetails[i].amount == 0 || formData.licenses[0].feeDetails[i].amount == '') {
        self.props.toggleSnackbarAndSetText(true, 'Please enter amount greater than 0 for the year ' + financialYear, false, true);
        feeCheck = false;
      }
    }

    if (feeCheck) {
      if (formData.licenses[0].isPropertyOwner) {
        if (!formData.licenses[0].agreementDate || !formData.licenses[0].agreementNo) {
          isFormValid = false;
        }
      }

      if (isFormValid) {
        self.props.setLoadingStatus('loading');

        formData.licenses[0]['tenantId'] = localStorage.getItem('tenantId') || 'default';

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
        if (
          formData[self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName][0]['supportDocuments'] &&
          formData[self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName][0]['supportDocuments'].length
        ) {
          let supportDocuments = [
            ...formData[self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName][0]['supportDocuments'],
          ];
          let _docs = [];
          let counter = supportDocuments.length,
            breakOut = 0;
          for (let i = 0; i < supportDocuments.length; i++) {
            fileUpload(supportDocuments[i].fileStoreId, self.props.moduleName, function(err, res) {
              if (breakOut == 1) return;
              if (err) {
                breakOut = 1;
                self.props.setLoadingStatus('hide');
                self.props.toggleSnackbarAndSetText(true, err, false, true);
              } else {
                if (res.files[0].fileStoreId)
                  _docs.push({
                    ...supportDocuments[i],
                    fileStoreId: res.files[0].fileStoreId,
                  });
                counter--;
                if (counter == 0 && breakOut == 0) {
                  formData[self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName][0]['supportDocuments'] = _docs;
                  self.makeAjaxCall(formData, _url);
                }
              }
            });
          }
        } else {
          feeCheck = false;
          self.makeAjaxCall(formData, _url);
        }
      } else {
        self.props.toggleSnackbarAndSetText(true, 'Please enter required field', false, true);
      }
    } else {
      for (var i = 0; i < formData.licenses[0].feeDetails.length; i++) {
        //var financialYear= formData.licenses[0].feeDetails[i].financialYear;
        //self.props.toggleSnackbarAndSetText(true, "Please enter amount greater than 0 for all the year " + formData.licenses[0].feeDetails[i].financialYear, false, true);
      }
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

  //Start Point of API Call to Populate Validity Year and UOMID
  populateValidtyYear = category => {
    let self = this;

    //    console.log(self.props.formData.licenses[0].category);
    if (self.props.formData.licenses[0].category == '' || self.props.formData.licenses[0].category == null) {
      self.props.handleChange({ target: { value: null } }, 'licenses[0].subCategory');
    }

    Api.commonApiPost('/tl-masters/category/v1/_search', {
      codes: category,
      type: 'subcategory',
    }).then(
      function(response) {
        self.handleChange({ target: { value: null } }, 'licenses[0].validityYears');
        self.handleChange({ target: { value: null } }, 'licenses[0].uomName');
        self.handleChange({ target: { value: null } }, 'licenses[0].uom', true);
      },
      function(err) {
        console.log(err);
      }
    );
  };
  //End Point of API Call to Populate Validity Year and UOMID

  disablePaid = (index, validiFromYear) => {
    var getStartYeardisable = new Date(Number(validiFromYear)).getFullYear();
    var curDate = new Date();
    var currentDate = curDate.getFullYear();
    //var fixedDate = new Date().getFullYear();
    let self = this;

    console.log(getStartYeardisable);
    //alert(index);
    if (getStartYeardisable > currentDate - 6) {
      index == 1 ? self.handleChange({ target: { value: true } }, 'licenses[0].feeDetails[0].disabled', true, '') : '';
    }
  };

  //***Start Fee Details Calculations***
  calculateFeeDetails = (licenseValidFromDate, validityYear) => {
    var getStartYear = new Date(Number(licenseValidFromDate)).getFullYear();
    var getStartMonth = new Date(Number(licenseValidFromDate)).getMonth();
    var curDate = new Date();
    var currentDate = curDate.getFullYear();
    var fixedDate = curDate.getFullYear();
    var currentMonth = curDate.getMonth();
    var FeeDetails = [];
    var startYear = getStartYear;
    var Validity = validityYear;

    let self = this;

    console.log(self.getVal('licenses[0].licenseValidFromDate'));

    self.handleChange({ target: { value: [] } }, 'licenses[0].feeDetails');

    if (new Date(Number(licenseValidFromDate)).getMonth() >= 3) {
      for (var i = startYear; i <= fixedDate; i = i + validityYear) {
        if (i > fixedDate - 6) {
          console.log(getStartMonth);
          let feeDetails = {
            financialYear: i + '-' + (i + 1).toString().slice(-2),
            amount: '',
            paid: false,
            disabled: false,
          };

          FeeDetails.push(feeDetails);
          console.log(i);
        }
      }

      var feeYear = FeeDetails[0].financialYear.split('-');
      if (getStartYear == feeYear[0]) {
        FeeDetails[0].paid = true;
        FeeDetails[0].disabled = true;
      }
    } else {
      for (var i = startYear; i <= fixedDate + 1; i = i + validityYear) {
        if (i > fixedDate - 6) {
          let feeDetails = {
            financialYear: i - 1 + '-' + i.toString().slice(-2),
            amount: '',
            paid: false,
            disabled: false,
          };
          FeeDetails.push(feeDetails);
          console.log(i);
        }
      }

      var feeYear = FeeDetails[0].financialYear.split('-');
      if (getStartYear == parseInt(feeYear[0]) + 1) {
        FeeDetails[0].paid = true;
        FeeDetails[0].disabled = true;
      }
    }

    //  if(i != 0 && FeeDetails[i - 1].paid && FeeDetails[i].paid){
    //    FeeDetails[i - 1].disabled=true;
    //  }

    self.handleChange({ target: { value: FeeDetails } }, 'licenses[0].feeDetails');
  };

  //***End Fee Details Calculations***

  noChange = () => {
    let self = this;
    this.setState({ open: false });
    flag1 = 1;
    var e = { target: { value: tradeCatVal } };
    console.log(tradeCatVal);
    this.handleChange(e, 'licenses[0].category');
  };

  yesCatChange = () => {
    let self = this;

    this.setState({ open: false });
    flag = 1;
    console.log(tradeCatVal);
    tradeCatVal = this.props.formData.licenses[0].category;
    console.log(this.props.formData.licenses[0].category);
  };

  noSubChange = () => {
    let self = this;
    this.setState({ openSub: false });
    flag2 = 1;
    var e = { target: { value: tradeSubVal } };
    this.handleChange(e, 'licenses[0].subCategory');
  };

  yesSubChange = () => {
    let self = this;
    this.setState({ openSub: false });
    flags = 1;
    tradeSubVal = this.props.formData.licenses[0].subCategory;
    console.log(this.props.formData.licenses[0].subCategory);
  };

  noLicenseChange = () => {
    let self = this;
    this.setState({ openLicense: false });
    flag3 = 1;
    var e = { target: { value: tradeLicenseVal } };
    this.handleChange(e, 'licenses[0].licenseValidFromDate');
  };

  yesLicenseChange = () => {
    let self = this;
    this.setState({ openLicense: false });
    flags = 1;
    tradeLicenseVal = this.props.formData.licenses[0].licenseValidFromDate;
  };

  handlePopUp = (type, jsonPath, value) => {
    if (type == 'tradeCategory') {
      if (this.getVal('licenses[0].feeDetails') && flag != 0 && tradeCatVal != value) {
        console.log(tradeCatVal);
        console.log(value);
        this.handleOpen();
      } else {
        console.log('hi', value);
        flag = 1;
        tradeCatVal = value;

        console.log(tradeCatVal);
      }
    }
  };

  handlePopUpsub = (type, jsonPath, value) => {
    if (type == 'tradeSubCategory') {
      if (this.getVal('licenses[0].feeDetails') && flags != 0 && tradeSubVal != value) {
        console.log(tradeSubVal);
        this.handleOpenSub();
      } else {
        flags = 1;
        tradeSubVal = value;

        console.log(value);
      }
    }
  };

  handlePopUpLicense = (type, jsonPath, value) => {
    if (type == 'tradeLicense') {
      if (
        this.getVal('licenses[0].feeDetails') &&
        flag != 0 &&
        tradeLicenseVal != value &&
        ((value + '').length == 12 || (value + '').length == 13)
      ) {
        console.log('hello', value);
        this.handleOpenLicense();
      } else {
        console.log('hi', value);
        flag = 1;
        tradeLicenseVal = value;

        console.log(value);
      }
    }
  };

  handleChange = (e, property, isRequired = false, pattern = '', requiredErrMsg = 'Required', patternErrMsg = 'Pattern Missmatch', index) => {
    let { getVal } = this;
    let self = this;
    let { handleChange, mockData, setDropDownData, formData } = this.props;
    let hashLocation = window.location.hash;
    let { validityYear } = this.state;
    let obj = specifications[`tl.create`];

    console.log(e);

    if (property == 'licenses[0].category' && flag1 == 0) {
      this.handlePopUp('tradeCategory', 'licenses[0].category', e.target.value);
    }
    if (property == 'licenses[0].subCategory' && flag2 == 0) {
      this.handlePopUpsub('tradeSubCategory', 'licenses[0].subCategory', e.target.value);
    }
    if (property == 'licenses[0].licenseValidFromDate' && flag3 == 0 && ((e.target.value + '').length == 12 || (e.target.value + '').length == 13)) {
      this.handlePopUpLicense('tradeLicense', 'licenses[0].licenseValidFromDate', e.target.value);
    }

    flag1 = 0;
    flag2 = 0;
    flag3 = 0;

    if (property == 'licenses[0].category') {
      this.populateValidtyYear();
    }

    if (property == 'licenses[0].subCategory') {
      console.log(e.target.value);
      Api.commonApiPost('/tl-masters/category/v1/_search', {
        codes: e.target.value,
        type: 'subcategory',
      }).then(
        function(response) {
          handleChange({ target: { value: response.categories[0].validityYears } }, 'licenses[0].validityYears');
          self.setState({
            validityYear: response.categories[0].validityYears,
          });

          handleChange(
            {
              target: {
                value: _.filter(response.categories[0].details, {
                  feeType: 'LICENSE',
                })[0].uomName,
              },
            },
            'licenses[0].uomName'
          );
          handleChange(
            {
              target: {
                value: _.filter(response.categories[0].details, {
                  feeType: 'LICENSE',
                })[0].uom,
              },
            },
            'licenses[0].uom',
            true
          );

          if (
            (self.props.formData.licenses[0].licenseValidFromDate && (self.props.formData.licenses[0].licenseValidFromDate + '').length == 12) ||
            (self.props.formData.licenses[0].licenseValidFromDate + '').length == 13
          ) {
            self.calculateFeeDetails(self.props.formData.licenses[0].licenseValidFromDate, response.categories[0].validityYears);
          }
        },
        function(err) {
          console.log(err);
        }
      );
    }

    //***Start Point To Populate Fee Details Section***
    if (
      (property == 'licenses[0].licenseValidFromDate' || property == 'licenses[0].subCategory') &&
      getVal('licenses[0].licenseValidFromDate') &&
      self.state.validityYear
    ) {
      if ((e.target.value + '').length == 12 || (e.target.value + '').length == 13) {
        console.log(e.target.value);
        self.calculateFeeDetails(e.target.value, self.state.validityYear);
      }
    }
    //***End Point To Populate Fee Details Section***

    console.log(e.target.value);
    console.log(this.props.formData.licenses[0].adhaarNumber);
    // if(property == "licenses[0].adhaarNumber" && e.target.value == ""){
    //   delete e.target;
    // //console.log(this.props.formData.licenses[0].adhaarNumber.length);
    // //handleChange({target:{value:null}}, "licenses[0].adhaarNumber");
    //   //this.props.formData.licenses[0].adhaarNumber = null;
    //
    //   //console.log(this.props.formData.licenses[0].adhaarNumber);
    //   //return false;
    // }

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
            let keys = jp.query(response, splitArray[1].split('|')[1]);
            let values = jp.query(response, splitArray[1].split('|')[2]);
            let dropDownData = [];
            for (var k = 0; k < keys.length; k++) {
              let obj = {};
              obj['key'] = keys[k];
              obj['value'] = values[k];
              dropDownData.push(obj);
            }
            dropDownData.unshift({ key: null, value: '-- Please Select --' });
            setDropDownData(value.jsonPath, dropDownData);
          },
          function(err) {
            console.log(err);
          }
        );
        // console.log(id);
        // console.log(context);
      } else if (value.type == 'documentList') {
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
            console.log(response);
            handleChange({ target: { value: response.documentTypes } }, 'licenses[0].supportDocuments');
            console.log(formData.licenses[0].supportDocuments);
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

    if (property == 'licenses[0].subCategory') {
      console.log('doccheck');
      Api.commonApiPost('tl-masters/documenttype/v2/_search').then(
        function(response) {
          console.log(response);
          console.log('docs');
        },
        function(err) {
          console.log(err);
        }
      );
    }
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

  render() {
    console.log(this.props.formData.licenses);
    const actions = [
      <FlatButton label="No" primary={true} onClick={this.noChange} />,
      <FlatButton label="Yes" primary={true} keyboardFocused={true} onClick={this.yesCatChange} />,
    ];

    const actionsSub = [
      <FlatButton label="No" primary={true} onClick={this.noSubChange} />,
      <FlatButton label="Yes" primary={true} keyboardFocused={true} onClick={this.yesSubChange} />,
    ];

    const actionsLicense = [
      <FlatButton label="No" primary={true} onClick={this.noLicenseChange} />,
      <FlatButton label="Yes" primary={true} keyboardFocused={true} onClick={this.yesLicenseChange} />,
    ];

    let { resultList, rowClickHandler, showDataTable, showHeader } = this.props;
    let { mockData, moduleName, actionName, formData, fieldErrors, isFormValid } = this.props;
    let { create, handleChange, getVal, addNewCard, removeCard, autoComHandler } = this;

    const renderNote = function() {
      if (
        formData &&
        formData.hasOwnProperty('licenses') &&
        formData.licenses[0].hasOwnProperty('feeDetails') &&
        formData.licenses[0].feeDetails.hasOwnProperty('financialYear')
      ) {
        var firstFinYear = formData.licenses[0].feeDetails[0].financialYear;
        console.log(firstFinYear);
      }
    };

    return (
      <div className="Report">
        <h3 style={{ textAlign: 'center' }}>{translate('tl.create.legacyTradeLicense')}</h3>
        <form
          onSubmit={e => {
            create(e);
          }}
        >
          {!_.isEmpty(mockData) &&
            moduleName &&
            actionName &&
            mockData[`${moduleName}.${actionName}`] && (
              <ShowFields
                groups={mockData[`${moduleName}.${actionName}`].groups}
                noCols={mockData[`${moduleName}.${actionName}`].numCols}
                ui="google"
                handler={handleChange}
                getVal={getVal}
                fieldErrors={fieldErrors}
                useTimestamp={mockData[`${moduleName}.${actionName}`].useTimestamp || false}
                addNewCard={addNewCard}
                removeCard={removeCard}
                autoComHandler={autoComHandler}
              />
            )}
          <div style={{ textAlign: 'center' }}>
            <Card className="uiCard">
              <CardHeader title={<strong>Fee Details</strong>} />
              <CardText>
                <Table
                  id={showDataTable == undefined ? 'searchTable' : showDataTable ? 'searchTable' : ''}
                  bordered
                  responsive
                  className="table-striped"
                >
                  <thead>
                    <tr>
                      <th>{translate('tl.create.license.table.financialYear')}</th>
                      <th>{translate('tl.create.license.table.amount')}</th>
                      <th>{translate('tl.create.license.table.isPaid')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData &&
                      formData.hasOwnProperty('licenses') &&
                      formData.licenses[0].hasOwnProperty('feeDetails') &&
                      formData.licenses[0].feeDetails.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.financialYear}</td>
                            <td>
                              <TextField
                                inputStyle={{ textAlign: 'right' }}
                                value={getVal('licenses[0].feeDetails[' + index + '].amount')}
                                errorText={fieldErrors['licenses[0].feeDetails[' + index + '].amount']}
                                onChange={e =>
                                  handleChange(
                                    e,
                                    'licenses[0].feeDetails[' + index + '].amount',
                                    true,
                                    '^[0-9]{1,10}(\\.[0-9]{0,2})?$',
                                    '',
                                    'Number max 10 degits with 2 decimal'
                                  )
                                }
                              />
                            </td>
                            <td>
                              <Checkbox
                                disabled={item.disabled || (index != 0 && !formData.licenses[0].feeDetails[index - 1].paid)}
                                checked={getVal('licenses[0].feeDetails[' + index + '].paid')}
                                onCheck={(obj, bol) => {
                                  handleChange({ target: { value: bol } }, 'licenses[0].feeDetails[' + index + '].paid', false, '');
                                  bol
                                    ? handleChange({ target: { value: true } }, 'licenses[0].feeDetails[' + (index - 1) + '].disabled', true, '')
                                    : handleChange({ target: { value: false } }, 'licenses[0].feeDetails[' + (index - 1) + '].disabled', false, '');
                                  this.disablePaid(index, formData.licenses[0].licenseValidFromDate);
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </CardText>

              <Card>
                <CardText style={{ textAlign: 'left' }}>
                  {renderNote()}
                  Note: License fee amount before Financial Year 2012-13 can be consolidated and entered in Financial Year 2012-13 amount field.
                </CardText>
              </Card>
            </Card>

            <Dialog title="Dialog With Actions" actions={actions} modal={false} open={this.state.open} onRequestClose={this.handleClose}>
              This will reset Fee Details. Do you want to proceed?
            </Dialog>

            <Dialog title="Dialog With Actions" actions={actionsSub} modal={false} open={this.state.openSub} onRequestClose={this.handleCloseSub}>
              This will reset Fee Details. Do you want to proceed?
            </Dialog>

            <Dialog
              title="Dialog With Actions"
              actions={actionsLicense}
              modal={false}
              open={this.state.openLicense}
              onRequestClose={this.handleCloseLicense}
            >
              This will reset Fee Details. Do you want to proceed?
            </Dialog>

            <br />
            {actionName == 'create' && (
              <UiButton
                item={{
                  label: 'Create',
                  uiType: 'submit',
                  isDisabled: isFormValid ? false : true,
                }}
                ui="google"
              />
            )}
            {actionName == 'update' && (
              <UiButton
                item={{
                  label: 'Update',
                  uiType: 'submit',
                  isDisabled: isFormValid ? false : true,
                }}
                ui="google"
              />
            )}
            <br />
          </div>
        </form>
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
  handleChange: (e, property, isRequired = false, pattern = '', requiredErrMsg = 'Required', patternErrMsg = 'Pattern Missmatch') => {
    console.log('hi');
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

export default connect(mapStateToProps, mapDispatchToProps)(LegacyLicenseCreate);
