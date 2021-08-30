import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import ShowFields from '../../../framework/showFields';
import { translate } from '../../../common/common';
import Api from '../../../../api/api';
import UiButton from '../../../framework/components/UiButton';
import { fileUpload, getInitiatorPosition } from '../../../framework/utility/utility';
import jp from 'jsonpath';
import template from '../../../framework/specs/works/master/detailedEstimate';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import WorkFlow from '../workflow/WorkFlow';
import styles from '../../../../styles/material-ui';

var specifications = {};
let reqRequired = [];

class DetailedEstimate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pathname: '',
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
          _.set(dat, groups[i].fields[j].jsonPath, groups[i].fields[j].defaultValue);
        }

        if (groups[i].children && groups[i].children.length) {
          for (var k = 0; k < groups[i].children.length; k++) {
            this.setDefaultValues(groups[i].children[k].groups, dat);
          }
        }
      }
    }
  }

  depedantValue(groups) {
    let self = this;
    for (let i = 0; i < groups.length; i++) {
      for (let j = 0; j < groups[i].fields.length; j++) {
        if (groups[i].fields[j].depedants && groups[i].fields[j].depedants.length) {
          for (let k = 0; k < groups[i].fields[j].depedants.length; k++) {
            if (groups[i].fields[j].depedants[k].type == 'dropDown') {
              let splitArray = groups[i].fields[j].depedants[k].pattern.split('?');
              let context = '';
              let id = {};
              // id[splitArray[1].split("&")[1].split("=")[0]]=e.target.value;
              for (let p = 0; p < splitArray[0].split('/').length; p++) {
                context += splitArray[0].split('/')[p] + '/';
              }

              let queryStringObject = splitArray[1].split('|')[0].split('&');
              for (let m = 0; m < queryStringObject.length; m++) {
                if (m) {
                  if (queryStringObject[m].split('=')[1].search('{') > -1) {
                    id[queryStringObject[m].split('=')[0]] = self.getVal(
                      queryStringObject[m]
                        .split('=')[1]
                        .split('{')[1]
                        .split('}')[0]
                    );
                  } else {
                    id[queryStringObject[m].split('=')[0]] = queryStringObject[m].split('=')[1];
                  }
                }
              }

              // if(id.categoryId == "" || id.categoryId == null){
              //   formData.tradeSubCategory = "";
              //   setDropDownData(value.jsonPath, []);
              //   console.log(value.jsonPath);
              //   console.log("helo", formData);
              //   return false;
              // }
              Api.commonApiPost(context, id).then(
                function(response) {
                  if (response) {
                    let keys = jp.query(response, splitArray[1].split('|')[1]);
                    let values = jp.query(response, splitArray[1].split('|')[2]);
                    let dropDownData = [];
                    for (let t = 0; t < keys.length; t++) {
                      let obj = {};
                      obj['key'] = keys[t];
                      obj['value'] = values[t];
                      dropDownData.push(obj);
                    }
                    dropDownData.sort(function(s1, s2) {
                      return s1.value < s2.value ? -1 : s1.value > s2.value ? 1 : 0;
                    });
                    dropDownData.unshift({
                      key: null,
                      value: '-- Please Select --',
                    });
                    self.props.setDropDownData(groups[i].fields[j].depedants[k].jsonPath, dropDownData);
                  }
                },
                function(err) {
                  console.log(err);
                }
              );
            }
          }
        }

        if (groups[i].fields[j].children && groups[i].fields[j].children.length) {
          for (var k = 0; k < groups[i].fields[j].children.length; k++) {
            self.depedantValue(groups[i].fields[j].children[k].groups);
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

  initData() {
    let self = this;

    specifications = template;
    let { setMetaData, setModuleName, handleChange, setActionName, initForm, setMockData, setFormData } = this.props;
    let obj = specifications['works.create'];
    reqRequired = [];
    this.setLabelAndReturnRequired(obj);
    initForm(reqRequired);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('works');
    setActionName('create');
    var formData = {};
    if (obj && obj.groups && obj.groups.length) this.setDefaultValues(obj.groups, formData);
    setFormData(formData);

    Api.commonApiPost('/works-masters/v1/scheduleofrates/_search')
      .then(response => {
        if (response) {
          let keys = jp.query(response, '$.scheduleOfRates.*.code');
          let values = jp.query(response, '$.scheduleOfRates.*.scheduleCategory');
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
          console.log(dropDownData);
          self.props.setDropDownData('detailedEstimate.scheduleOfRates', dropDownData);
        }
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('/works-estimate/v1/abstractestimates/_search', {
      abstractEstimateNumbers: 'AE/ACC/000071/11/2017-18',
    })
      .then(function(response) {
        console.log('----locality----' + response.abstractEstimates[0].ward.code);
        handleChange(
          response.abstractEstimates[0].abstractEstimateDetails[0].projectCode.code,
          'detailedEstimates[0].projectCode.code',
          '',
          '',
          '',
          ''
        );
        handleChange(new Date(), 'detailedEstimates[0].estimateDate', '', '', '', '');
        handleChange(
          {
            target: {
              value: response.abstractEstimates[0].abstractEstimateNumber,
            },
          },
          'detailedEstimates[0].estimateNumber',
          '',
          '',
          '',
          ''
        );
        handleChange(response.abstractEstimates[0].abstractEstimateNumber, 'detailedEstimates[0].estimateNumber', '', '', '', '');
        handleChange(response.abstractEstimates[0].abstractEstimateDetails[0].estimateAmount, 'detailedEstimates[0].workValue', '', '', '', '');
        handleChange(response.abstractEstimates[0].department.code, 'detailedEstimates[0].department.code', '', '', '', '');
        handleChange(response.abstractEstimates[0].natureOfWork.code, 'detailedEstimates[0].natureOfWork.code', '', '', '', '');
        handleChange(response.abstractEstimates[0].ward.code, 'detailedEstimates[0].ward.code', '', '', '', '');
        handleChange(response.abstractEstimates[0].locality.code, 'detailedEstimates[0].locality.code', '', '', '', '');
        handleChange(response.abstractEstimates[0].workCategory, 'detailedEstimates[0].workCategory', '', '', '', '');
        handleChange(response.abstractEstimates[0].beneficiary, 'detailedEstimates[0].beneficiary', '', '', '', '');
        handleChange(response.abstractEstimates[0].abstractEstimateDetails[0].nameOfWork, 'detailedEstimates[0].nameOfWork', '', '', '', '');
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.initData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.pathname && this.state.pathname != nextProps.history.location.pathname) {
      this.initData();
    }
  }

  makeAjaxCall = (formData, url) => {
    let self = this;
    delete formData.ResponseInfo;
    delete formData.documents;

    // console.log(url, formData);

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

            self.props.setRoute(hash + (self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].queryString || ''));
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

  checkForOtherFiles = (formData, _url) => {
    let { mockData, actionName, moduleName } = this.props;
    let counter = 0,
      breakOut = 0,
      self = this;
    for (let i = 0; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
      for (let j = 0; j < mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
        if (
          mockData[moduleName + '.' + actionName].groups[i].fields[j].type == 'singleFileUpload' &&
          _.get(formData, mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath)
        ) {
          counter++;
          fileUpload(_.get(formData, mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath), self.props.moduleName, function(
            err,
            res
          ) {
            if (breakOut == 1) return;
            if (err) {
              breakOut = 1;
              self.props.setLoadingStatus('hide');
              self.props.toggleSnackbarAndSetText(true, err, false, true);
            } else {
              counter--;
              _.set(formData, mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, res.files[0].fileStoreId);
              if (counter == 0 && breakOut == 0) self.makeAjaxCall(formData, _url);
            }
          });
        } /*else if(mockData[moduleName + "." + actionName].groups[i].fields[j].type == "multiFileUpload") {
          let files = _.get(formData, mockData[moduleName + "." + actionName].groups[i].fields[j].jsonPath);
          if(files && files.length) {
            counter += files.length;

          }
        }*/
      }
    }

    if (counter == 0 && breakOut == 0) self.makeAjaxCall(formData, _url);
  };

  initiateWF = (action, workflowItem, isHidden, status) => {
    let formData = { ...this.props.formData };
    if (!_.get(formData.workflowItem.jsonPath.objectPath)) {
      _.set(formData, workflowItem.jsonPath.objectPath, {});
    }

    if (!isHidden && !_.get(formData, workflowItem.jsonPath.assigneePath)) {
      return this.props.toggleSnackbarAndSetText(true, translate('wc.create.workflow.fields'), false, true);
    }

    if (action.key.toLowerCase() == 'reject' && !_.get(formData, workflowItem.commentsPath)) {
      return this.props.toggleSnackbarAndSetText(true, translate('wc.create.workflow.comment'), false, true);
    }

    _.set(formData, workflowItem.jsonPath.actionPath, action.key);
    _.set(formData, workflowItem.jsonPath.statusPath, status);
    this.create();
  };

  save = () => {
    this.create('', 'save');
  };

  create = (e, action) => {
    let self = this,
      _url;
    if (e) e.preventDefault();
    self.props.setLoadingStatus('loading');
    var formData = { ...this.props.formData };
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
          let obj = formData[self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName][i];
          for (let key in obj) {
            if (_.isArray(obj[key])) {
              for (let k = 0; k < obj[key].length; k++) {
                obj[key][k]['tenantId'] = localStorage.getItem('tenantId') || 'default';
              }
            } else if (_.isObject(obj[key])) {
              obj[key]['tenantId'] = localStorage.getItem('tenantId') || 'default';
            }
          }
        }
      } else
        formData[self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName]['tenantId'] =
          localStorage.getItem('tenantId') || 'default';
    }

    _url = self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].url;

    if (/\{.*\}/.test(self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].url)) {
      _url = self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].url;

      var match = _url.match(/\{.*\}/)[0];
      var jPath = match.replace(/\{|}/g, '');
      _url = _url.replace(match, _.get(formData, jPath));
      // console.log('Modified URL:',_url);
    }

    // console.log(JSON.stringify(formData));
    let objectName = self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName;
    let data = { ...formData };
    _.set(data, 'detailedEstimates[0].workFlowDetails.assignee', 1);

    // console.log(JSON.stringify(data));

    if (data[objectName][0].documents && data[objectName][0].documents.length) {
      let documents = [...data[objectName][0].documents];
      // console.log(documents);
      let formData = new FormData();
      formData.append('tenantId', localStorage.getItem('tenantId'));
      formData.append('module', 'works');

      for (let i = 0; i < documents.length; i++) {
        if (documents[i]) {
          formData.append('file', documents[i]);
        }
      }

      Api.commonApiPost('/filestore/v1/files', {}, formData).then(
        function(res) {
          let _docs = [];
          for (let i = 0; i < res.files.length; i++) {
            _docs.push({
              tenantId: localStorage.getItem('tenantId') || 'default',
              fileStore: res.files[i].fileStoreId,
            });
          }

          data[objectName][0]['documentDetails'] = _docs;
          self.makeAjaxCall(data, _url);
          // cb(null, response);
        },
        function(err) {
          // cb(err.message);
          // })
        }
      );
    } else {
      self.makeAjaxCall(data, _url);
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

  // getValFromJPath = (jPath) => {
  //   var datas = jp.query(this.props.fromData, jPath);
  //
  //   return typeof _val != "undefined" ? _val : "";
  // }

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
    // console.log(_mockData, showObject, reset);
    let { moduleName, actionName, setFormData, delRequiredFields, removeFieldErrors, addRequiredFields } = this.props;
    let _formData = { ...this.props.formData };
    if (showObject.isField) {
      for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
        for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
          if (showObject.name == _mockData[moduleName + '.' + actionName].groups[i].fields[j].name) {
            _mockData[moduleName + '.' + actionName].groups[i].fields[j].hide = reset ? true : false;
            if (!reset) {
              // console.log(_mockData[moduleName + "." + actionName].groups[i].fields[j]);
              _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
              setFormData(_formData);
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
                // console.log('mark as required');
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

            if (_mockData[moduleName + '.' + actionName].groups[i].children && _mockData[moduleName + '.' + actionName].groups[i].children.length) {
              for (var z = 0; z < _mockData[moduleName + '.' + actionName].groups[i].children.length; z++) {
                for (var y = 0; y < _mockData[moduleName + '.' + actionName].groups[i].children[z].groups.length; y++) {
                  for (var x = 0; x < _mockData[moduleName + '.' + actionName].groups[i].children[z].groups[y].fields.length; x++) {
                    if (_mockData[moduleName + '.' + actionName].groups[i].children[z].groups[y].fields[x].isRequired) {
                      _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].children[z].groups[y].fields[x].jsonPath);
                      removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].children[z].groups[y].fields[x].jsonPath);
                    }
                  }
                }
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
    // console.log(jsonPath, val);
    let _mockData = { ...this.props.mockData };
    let { moduleName, actionName, setMockData } = this.props;
    for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
      for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
        if (
          jsonPath == _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath &&
          _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields &&
          _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields.length
        ) {
          // console.log('showHidefields matches for jsonPath');
          // console.log(_mockData[moduleName + "." + actionName].groups[i].fields[j].showHideFields);
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

  handleChange = (e, property, isRequired, pattern, requiredErrMsg = 'Required', patternErrMsg = 'Pattern Missmatch', expression, expErr, isDate) => {
    let { getVal } = this;
    let { handleChange, mockData, setDropDownData, formData } = this.props;
    let hashLocation = window.location.hash;
    let obj = specifications['works.create'];
    if (expression && e.target.value) {
      let str = expression;
      let pos = 0;
      let values = [];
      while (pos < str.length) {
        if (str.indexOf('$', pos) > -1) {
          let ind = str.indexOf('$', pos);
          let spaceInd = str.indexOf(' ', ind) > -1 ? str.indexOf(' ', ind) : str.length - 1;
          let value = str.substr(ind, spaceInd);
          if (value != '$' + property) {
            values.push(value.substr(1));
            str = str.replace(value, "getVal('" + value.substr(1, value.length) + "')");
          } else str = str.replace(value, 'e.target.value');
          pos++;
        } else {
          pos++;
        }
      }

      let _flag = 0;
      for (var i = 0; i < values.length; i++) {
        if (!getVal(values[i])) {
          _flag = 1;
        }
      }

      if (isDate && e.target.value && [12, 13].indexOf((e.target.value + '').length) == -1) {
        _flag = 1;
      }

      if (_flag == 0) {
        if (!eval(str)) {
          return this.props.toggleSnackbarAndSetText(true, translate(expErr), false, true);
        }
      }
    }
    let depedants = jp.query(obj, `$.groups..fields[?(@.jsonPath=="${property}")].depedants.*`);
    // console.log(property, depedants);
    this.checkIfHasShowHideFields(property, e.target.value);
    this.checkIfHasEnDisFields(property, e.target.value);
    handleChange(e, property, isRequired, pattern, requiredErrMsg, patternErrMsg);

    _.forEach(depedants, function(value, key) {
      if (value.type == 'dropDown') {
        // let splitArray = value.pattern.split("?");
        let splitArray1 = value.pattern.substr(0, value.pattern.indexOf('?'));
        let splitArray2 = value.pattern.substr(value.pattern.indexOf('?') + 1);
        // console.log(splitArray);
        let context = '';
        let id = {};
        for (var j = 0; j < splitArray1.split('/').length; j++) {
          context += splitArray1.split('/')[j] + '/';
        }

        let queryStringObject = splitArray2.split('|')[0].split('&');
        for (var i = 0; i < queryStringObject.length; i++) {
          if (i) {
            // console.log(queryStringObject[i]);
            if (queryStringObject[i].split('=')[1].search('{') > -1) {
              if (
                queryStringObject[i]
                  .split('=')[1]
                  .split('{')[1]
                  .split('}')[0] == property
              ) {
                let queryString = queryStringObject[i].split('=')[1];
                // console.log(queryString, queryString.length);
                let part1 = queryString.substring(0, queryString.lastIndexOf('{'));
                // console.log(queryString, queryString.length);
                let part2 = queryString.substring(queryString.lastIndexOf('}') + 1, queryString.length);
                // console.log(part1, part2);
                if (part1.length > 0) {
                  // console.log(encodeURI(`${part1}${e.target.value}${part2}`));
                  // console.log(encodeURIComponent(`${part1}${e.target.value}${part2}`));
                  id[queryStringObject[i].split('=')[0]] = `${part1}${e.target.value}${part2}`;
                } else {
                  id[queryStringObject[i].split('=')[0]] = e.target.value || '';
                }
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

        Api.commonApiPost(context, id, {}, false, false, false, '', '', value.isStateLevel).then(
          function(response) {
            if (response) {
              let keys = jp.query(response, splitArray2.split('|')[1]);
              let values = jp.query(response, splitArray2.split('|')[2]);
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
      } else if (value.type == 'textField') {
        let object = {
          target: {
            value: eval(eval(value.pattern)),
          },
        };
        handleChange(object, value.jsonPath, value.isRequired, value.rg, value.requiredErrMsg, value.patternErrMsg);
      } else if (value.type == 'autoFill') {
        let splitArray = value.pattern.split('?');
        let context = '';
        let id = {};
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
              for (let key in value.autoFillFields) {
                handleChange(
                  {
                    target: {
                      value: _.get(response, value.autoFillFields[key]),
                    },
                  },
                  key,
                  false,
                  '',
                  ''
                );
              }
            }
          },
          function(err) {
            console.log(err);
          }
        );
      }
    });
  };

  incrementIndexValue = (group, jsonPath) => {
    let { formData } = this.props;
    var length = _.get(formData, jsonPath) ? _.get(formData, jsonPath).length : 0;
    var _group = JSON.stringify(group);
    var regexp = new RegExp(jsonPath + '\\[\\d{1}\\]', 'g');
    _group = _group.replace(regexp, jsonPath + '[' + length + ']');
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
    let { setMockData, metaData, moduleName, actionName, setFormData, formData, addRequiredFields } = this.props;
    let mockData = { ...this.props.mockData };
    let reqFields = [];
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

              for (var k = 0; k < _groupToBeInserted.fields.length; k++) {
                if (_groupToBeInserted.fields[k].isRequired) {
                  reqFields.push(_groupToBeInserted.fields[k].jsonPath);
                }
              }

              if (reqFields.length) addRequiredFields(reqFields);
              mockData[moduleName + '.' + actionName].groups.splice(j + 1, 0, _groupToBeInserted);
              //console.log(mockData[moduleName + "." + actionName].groups);
              setMockData(mockData);
              var temp = { ...formData };
              self.setDefaultValues(mockData[moduleName + '.' + actionName].groups, temp);
              //console.log(temp);
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
    let { setMockData, moduleName, actionName, setFormData, delRequiredFields } = this.props;
    let _formData = { ...this.props.formData };
    let self = this;
    let mockData = { ...this.props.mockData };
    let notReqFields = [];

    if (!jsonPath) {
      var ind = 0;
      for (let i = 0; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
        if (index == i && groupName == mockData[moduleName + '.' + actionName].groups[i].name) {
          mockData[moduleName + '.' + actionName].groups.splice(i, 1);
          ind = i;
          for (var k = 0; k < mockData[moduleName + '.' + actionName].groups[ind].fields.length; k++) {
            if (mockData[moduleName + '.' + actionName].groups[ind].fields[k].isRequired)
              notReqFields.push(mockData[moduleName + '.' + actionName].groups[ind].fields[k].jsonPath);
          }
          delRequiredFields(notReqFields);
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
            //console.log(mockData[moduleName + "." + actionName].groups);
            grps.splice(mockData[moduleName + '.' + actionName].groups[i].index - 1, 1);
            _.set(_formData, mockData[moduleName + '.' + actionName].groups[i].jsonPath, grps);
            //console.log(_formData);
            setFormData(_formData);

            //Reduce index values
            for (let k = ind; k < mockData[moduleName + '.' + actionName].groups.length; k++) {
              if (mockData[moduleName + '.' + actionName].groups[k].name == groupName) {
                mockData[moduleName + '.' + actionName].groups[k].index -= 1;
              }
            }
            break;
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
    let { mockData, moduleName, actionName, formData, fieldErrors, isFormValid } = this.props;
    let { create, handleChange, getVal, addNewCard, removeCard, autoComHandler, initiateWF } = this;

    return (
      <div className="Report">
        <div style={{ padding: '0 15px' }}>
          <Row>
            <Col xs={6} md={6}>
              <h3 style={{ paddingLeft: 15, marginBottom: '0' }}>
                {!_.isEmpty(mockData) &&
                moduleName &&
                actionName &&
                mockData[`${moduleName}.${actionName}`] &&
                mockData[`${moduleName}.${actionName}`].title
                  ? translate(mockData[`${moduleName}.${actionName}`].title)
                  : ''}
              </h3>
            </Col>
            <Col xs={6} md={6}>
              <div
                style={{
                  textAlign: 'right',
                  color: '#FF0000',
                  marginTop: '15px',
                  marginRight: '15px',
                  paddingTop: '8px',
                }}
              >
                <i>( * ) {translate('framework.required.note')}</i>
              </div>
            </Col>
          </Row>
        </div>
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
                initiateWF={initiateWF}
                screen={window.location.hash.split('/').indexOf('update') == 1 ? 'update' : 'create'}
                workflowId={
                  window.location.hash.split('/').indexOf('update') == 1 ? this.props.match.params.id || this.props.match.params.master : ''
                }
              />
            )}
          <Card style={styles.marginStyle}>
            <CardHeader
              style={{ paddingTop: 4, paddingBottom: 0 }}
              title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('works.create.group.title.sor')}</div>}
            />
            <CardText>
              <SelectField
                className="custom-form-control-for-select"
                fullWidth={false}
                maxHeight={200}
                floatingLabelStyle={{ top: 0 }}
                floatingLabelFixed={true}
                dropDownMenuProps={{
                  targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                }}
                floatingLabelText={<span>{translate('works.create.scheduleCategory')} </span>}
                value={getVal('detailedEstimate.scheduleOfRates')}
                onChange={(event, key, value) => {
                  handleChange({ target: { value: value } }, 'detailedEstimates[0].estimateActivities[0].scheduleOfRate.name', false);
                }}
              >
                <MenuItem value={null} primaryText="-- Please Select --" />
                {this.state.sanctionAuthority &&
                  this.state.sanctionAuthority.map((authority, index) => <MenuItem value={authority.id} key={index} primaryText={authority.name} />)}
              </SelectField>
            </CardText>
          </Card>
          <WorkFlow formData={formData} handler={handleChange} path="detailedEstimates[0].workFlowDetails" />
          <div style={{ textAlign: 'center' }}>
            <br />
            <UiButton
              item={{
                label: 'Save',
                uiType: 'submit',
                isDisabled: isFormValid ? false : true,
              }}
              ui="google"
              handler={this.save}
            />&nbsp;&nbsp;
            {actionName == 'create' && (
              <UiButton
                item={{
                  label: 'Forward',
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
            &nbsp;&nbsp;<RaisedButton
              label="Reset"
              primary={false}
              onClick={() => {
                this.initData();
              }}
            />
            <br />
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state.framework.mockData);
  // console.log(state.frameworkForm.requiredFields);
  // console.log(state.frameworkForm.isFormValid);
  return {
    metaData: state.framework.metaData,
    mockData: state.framework.mockData,
    moduleName: state.framework.moduleName,
    actionName: state.framework.actionName,
    formData: state.frameworkForm.form,
    fieldErrors: state.frameworkForm.fieldErrors,
    isFormValid: state.frameworkForm.isFormValid,
    requiredFields: state.frameworkForm.requiredFields,
  };
};

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
  handleChange: (e, property, isRequired, pattern, requiredErrMsg, patternErrMsg) => {
    // console.log(e.target ? e.target.value : e, property, isRequired, pattern, requiredErrMsg, patternErrMsg);
    dispatch({
      type: 'HANDLE_CHANGE_FRAMEWORK',
      property,
      value: e.target ? e.target.value : e,
      isRequired,
      pattern,
      requiredErrMsg,
      patternErrMsg,
    });
    //dispatch({type:"HANDLE_CHANGE_FRAMEWORK", property,value: e.target.value, isRequired, pattern, requiredErrMsg, patternErrMsg});
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
    // console.log(requiredFields);
    dispatch({ type: 'ADD_REQUIRED_FIELDS', requiredFields });
  },
  removeFieldErrors: key => {
    dispatch({ type: 'REMOVE_FROM_FIELD_ERRORS', key });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailedEstimate);
