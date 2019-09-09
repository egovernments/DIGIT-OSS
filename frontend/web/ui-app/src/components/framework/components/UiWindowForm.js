import React, { Component } from 'react';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { translate } from '../../common/common';
import _ from 'lodash';
import ShowFields from '../showFields';
import { connect } from 'react-redux';
import jp from 'jsonpath';
import Api from '../../../api/api';
import { fileUpload, getInitiatorPosition } from '../../framework/utility/utility';
//import $ from "jquery";

var specifications = {};
var reqRequired = [];

const REGEXP_FIND_IDX = /\[(.*?)\]+/g;

class UiWindowForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      mockData: null,
      valuesObj: {},
      index: -1,
      fieldErrors: {},
      isFormValid: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.getValueFn = this.getValueFn.bind(this);
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
  create = formData => {
    let self = this,
      _url;
    // if(e) e.preventDefault();
    self.props.setLoadingStatus('loading');
    if (self.state.mockData[self.props.item.modulepath].tenantIdRequired) {
    }
    //Check if documents, upload and get fileStoreId
    let formdocumentData = formData[self.state.mockData[self.props.item.modulepath].objectName];
    let documentPath = self.state.mockData[self.props.item.modulepath].documentsPath;

    formdocumentData = (formdocumentData && formdocumentData.length && formdocumentData[0]) || formdocumentData;
    if (documentPath) {
      formdocumentData = _.get(formData, documentPath);
    }

    if (formdocumentData['documents'] && formdocumentData['documents'].length) {
      let documents = [...formdocumentData['documents']];
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
              fileStoreId: res.files[0].fileStoreId,
            });
            counter--;
            if (counter == 0 && breakOut == 0) {
              formdocumentData['documents'] = _docs;
              self.checkForOtherFiles(formData, _url);
            }
          }
        });
      }
    }
    if (/\{.*\}/.test(self.state.mockData[self.props.item.modulepath].url)) {
      _url = self.state.mockData[self.props.item.modulepath].url;
      var match = _url.match(/\{.*\}/)[0];
      var jPath = match.replace(/\{|}/g, '');
      _url = _url.replace(match, _.get(formData, jPath));
    }

    self.checkForOtherFiles(formData, _url);
  };
  checkForOtherFiles = (formData, _url) => {
    //let { mockData, actionName, moduleName } = this.props;
    let self = this;
    let fileList = {};
    this.getFileList(self.state.mockData[self.props.item.modulepath], formData, fileList);
    let counter = Object.keys(fileList).length;
    if (!counter) {
      self.makeAjaxCall(formData, _url);
    } else {
      let breakOut = 0;
      for (let key in fileList) {
        fileUpload(fileList[key], 'legal', function(err, res) {
          if (breakOut == 1) return;
          if (err) {
            breakOut = 1;
            self.props.setLoadingStatus('hide');
          } else {
            counter--;
            _.set(formData, key, res.files[0].fileStoreId);
            if (counter == 0 && breakOut == 0) self.makeAjaxCall(formData, _url);
          }
        });
      }
    }
  };

  enField = (_mockData, enableStr, reset) => {
    let { moduleName, actionName, setFormData } = this.props;
    let _formData = { ...this.props.formData };
    for (let i = 0; i < _mockData[moduleName + '.create'].groups.length; i++) {
      for (let j = 0; j < _mockData[moduleName + '.create'].groups[i].fields.length; j++) {
        if (enableStr == _mockData[moduleName + '.create'].groups[i].fields[j].name) {
          _mockData[moduleName + '.create'].groups[i].fields[j].isDisabled = reset ? true : false;
          // if (!reset) {
          //   _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
          //   setFormData(_formData);
          // }
          break;
        }
      }
    }

    return _mockData;
  };

  disField = (_mockData, disableStr, reset) => {
    let { moduleName, actionName, setFormData } = this.props;
    let _formData = { ...this.props.formData };
    for (let i = 0; i < _mockData[moduleName + '.create'].groups.length; i++) {
      for (let j = 0; j < _mockData[moduleName + '.create'].groups[i].fields.length; j++) {
        if (disableStr == _mockData[moduleName + '.create'].groups[i].fields[j].name) {
          _mockData[moduleName + '.create'].groups[i].fields[j].isDisabled = reset ? false : true;
          // if (!reset) {
          //   _.set(_formData, _mockData[moduleName + '.create'].groups[i].fields[j].jsonPath, '');
          //   setFormData(_formData);
          // }

          break;
        }
      }
    }

    return _mockData;
  };

  checkIfHasEnDisFields = (jsonPath, val) => {
    //  let _mockData = { ...this.props.mockData };
    let { mockData } = this.state;
    let { moduleName, actionName, setMockData } = this.props;
    for (let i = 0; i < mockData[moduleName + '.create'].groups.length; i++) {
      for (let j = 0; j < mockData[moduleName + '.create'].groups[i].fields.length; j++) {
        if (
          jsonPath == mockData[moduleName + '.create'].groups[i].fields[j].jsonPath &&
          mockData[moduleName + '.create'].groups[i].fields[j].enableDisableFields &&
          mockData[moduleName + '.create'].groups[i].fields[j].enableDisableFields.length
        ) {
         // console.log('Condition 1 satisfied');
          for (let k = 0; k < mockData[moduleName + '.create'].groups[i].fields[j].enableDisableFields.length; k++) {
            if (val == mockData[moduleName + '.create'].groups[i].fields[j].enableDisableFields[k].ifValue) {
            //  console.log('Value matched is:', val);
              for (let y = 0; y < mockData[moduleName + '.create'].groups[i].fields[j].enableDisableFields[k].disable.length; y++) {
                mockData = this.disField(mockData, mockData[moduleName + '.create'].groups[i].fields[j].enableDisableFields[k].disable[y]);
              }
              for (let z = 0; z < mockData[moduleName + '.create'].groups[i].fields[j].enableDisableFields[k].enable.length; z++) {
                mockData = this.enField(mockData, mockData[moduleName + '.create'].groups[i].fields[j].enableDisableFields[k].enable[z]);
              }
            }
          }
        }
      }
    }
    // for (let i = 0; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
    //   for (let j = 0; j < mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
    //     if (
    //       jsonPath == mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath &&
    //       mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields &&
    //       mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields.length
    //     ) {
    //       for (let k = 0; k < mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields.length; k++) {
    //         if (val == mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].ifValue) {
    //           for (let y = 0; y < mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].disable.length; y++) {
    //             mockData = this.disField(mockData, mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].disable[y]);
    //           }

    //           for (let z = 0; z < mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].enable.length; z++) {
    //             mockData = this.enField(mockData, mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].enable[z]);
    //           }
    //         }

    //       }
    //     }
    //   }
    // }

    // setMockData(mockData);
  };

  getFileList = (mockObject, formData, fileList = {}) => {
    for (let i = 0; i < mockObject.groups.length; i++) {
      for (let j = 0; j < mockObject.groups[i].fields.length; j++) {
        if (mockObject.groups[i].fields[j].type == 'singleFileUpload' && _.get(formData, mockObject.groups[i].fields[j].jsonPath)) {
          fileList[mockObject.groups[i].fields[j].jsonPath] = _.get(formData, mockObject.groups[i].fields[j].jsonPath);
        }
      }

      if (mockObject.groups[i].children && mockObject.groups[i].children.length) {
        for (var k = 0; k < mockObject.groups[i].children.length; k++) {
          this.getFileList(mockObject.groups[i].children[k], formData, fileList);
        }
      }
    }
  };
  makeAjaxCall = (formData, url) => {
    let self = this;
    delete formData.ResponseInfo;
    //return console.log(formData);
    Api.commonApiPost(url || self.state.mockData[self.props.item.modulepath].url, '', formData, '', true).then(
      function(response) {
        self.props.setLoadingStatus('hide');
        self.initData();
        self.setState({
          valuesObj: {},
          open: false,
          index: -1,
        });
        // self.props.toggleSnackbarAndSetText(true, translate(self.props.actionName == "create" ? "wc.create.message.success" : "wc.update.message.success"), true);
      },
      function(err) {
        self.props.setLoadingStatus('hide');
        //self.props.toggleSnackbarAndSetText(true, err.message);
      }
    );
  };

  initData() {
    var self = this;
    specifications = require(`../../framework/specs/${this.props.item.subPath}`).default;
    var result = typeof results == 'string' ? JSON.parse(specifications) : specifications;
    let obj = specifications[this.props.item.modulepath];
    reqRequired = [];
    self.setLabelAndReturnRequired(obj);
    var allReqRequired = reqRequired ? reqRequired : [];
    this.setState({
      mockData: JSON.parse(JSON.stringify(specifications)),
      reqRequired: allReqRequired,
    });
  }

  componentDidMount() {
    this.initData();
  }
  editRow = index => {
    let { item, getVal } = this.props;
    var jsonPath = item.jsonPath + '.' + item.arrayPath + '[' + index + ']';
    var data = getVal(jsonPath);
    this.setState({
      valuesObj: data,
      index: index,
      open: true,
    });
  };
  deleteRow = index => {};
  renderTable = (item, _internal_val = []) => {
    var dropDownData = _.clone(this.props.dropDownData);
   // console.log("My formData", dropDownData);
    if (item.tableConfig) {
      return (
     <Col xs={12} md={(item.tableConfig.expandTable)? 12 : 8}>
          <table className="table table-striped table-bordered" responsive>
            <thead>
              <tr>
                <th>#</th>
                {item.tableConfig.header.map((v, i) => {
                  var style = {};
                  if (v.style) {
                    style = v.style;
                  }
                  return (
                    <th style={style} key={i}>
                      {translate(v.label)}
                    </th>
                  );
                })}
                <th>{translate('reports.common.action')}</th>
              </tr>
            </thead>
            <tbody>
              {_.isArray(_internal_val) &&
                _internal_val.map((v, i) => {
                  if (item.hidePrimaryRecord && i == 0) {
                    this.props.item.style = { display: 'none' };
                  } else {
                    this.props.item.style = { display: 'table-row' };
                  }

                  return (
                    <tr style={item.style}>
                      <td>{item.hidePrimaryRecord ? i : i + 1}</td>
                      {item.tableConfig.rows.map((value, idx) => {
                      
                        var getValue = _.get(v, value.displayField);
                        
                        if(_.isArray(getValue)){
                            if(value.keyToValue && (value != null || value != undefined)){
                              var getListValue = _.get(dropDownData, value.displayField);
                              getValue =   getValue.map((item)=>{
                                var _listItem =  _.filter(getListValue, ['key', item]);
                                if(_.has(_listItem[0], 'value')){
                                  return (_listItem[0].value);
                                }
                              });
                            }
                          return <td>{(getValue.length > 0 ) ? getValue.toString(): ''}</td>;  
                        }else if(_.isObject(getValue)){
                          return <td>{getValue.label}</td>;
                        }else if (value.isDate){
                        var dateVal = _.get(v, value.displayField);
                        var _date = new Date(Number(dateVal));
                        return <td>{('0' + _date.getDate()).slice(-2) + '/' + ('0' + (_date.getMonth() + 1)).slice(-2) + '/' + _date.getFullYear()}</td>;
                       }else{
                        return <td>{_.get(v, value.displayField)}</td>;
                       }
                        //this.renderFields(_.get(v,value.displayField),value.type)}</td>);
                      })}
                      <td>
                        <div
                          className="material-icons"
                          onClick={() => {
                            this.editRow(i);
                          }}
                        >
                          edit
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Col>
      );
    } else {
      return (
        <Col xs={12} md={6}>
          <TextField
            className="cutustom-form-controll-for-textfield"
            id={item.jsonPath.split('.').join('-')}
            floatingLabelStyle={{
              color: '#A9A9A9',
              fontSize: '20px',
              whiteSpace: 'nowrap',
            }}
            inputStyle={{ color: '#5F5C57' }}
            floatingLabelFixed={true}
            maxLength={item.maxLength || ''}
            style={{ display: item.hide ? 'none' : 'inline-block' }}
            errorStyle={{ float: 'left' }}
            fullWidth={true}
            floatingLabelText={
              <span>
                {item.label} <span style={{ color: '#FF0000' }}>{item.isRequired ? ' *' : ''}</span>
              </span>
            }
            //value = {this.state.valueList.join(", ")}
            value={_internal_val && _internal_val.constructor == Array ? _internal_val.join(', ') : ''}
            disabled={true}
          />
        </Col>
      );
    }
  };

  renderField = item => {
    let val = this.props.getVal(item.jsonPath + '.' + item.arrayPath);
    if (item.displayField && val && val.constructor == Array) {
      val = jp.query(val, `$..${item.displayField}`);
    }
    if (item.isExceptFirstRecord && val && val.constructor == Array) {
      val.shift();
    }
    if (this.props.readonly === 'true') {
      return (
        <div>
          <Col xs={12}>
            <label>
              <span style={{ fontWeight: 500, fontSize: '13px' }}>{translate(item.label)}</span>
            </label>
          </Col>
          <Col xs={12}>{val && val.constructor == Array ? val.join(', ') : ''}</Col>
        </div>
      );
    } else {
      return (
        <Row>
          {this.renderTable(item, val)}

          <Col xs={12} md={6}>
            {!!item.hideAddButton ? (
              ''
            ) : (
              <FloatingActionButton
                style={{ marginTop: 39 }}
                mini={true}
                onClick={() => {
                  this.handleOpen();
                }}
              >
                <i className="material-icons">add</i>
              </FloatingActionButton>
            )}
          </Col>
        </Row>
      );
    }
  };

  renderArrayField = item => {
    let { mockData } = this.state;
    let { fieldErrors } = this.props;
    let { handleChange, getValueFn } = this;
    var self = this;
    switch (this.props.ui) {
      case 'google':
        return (
          <div>
            {this.renderField(item)}
            <Dialog
              title={this.props.item.label}
              modal={true}
              actions={[
                <FlatButton
                  label={translate('pt.create.groups.ownerDetails.fields.add')}
                  disabled={!this.state.isFormValid}
                  secondary={true}
                  style={{ marginTop: 5 }}
                  onClick={e => {
                    var oldData = self.props.getVal(self.props.item.jsonPath + '.' + self.props.item.arrayPath);
                    if (self.state.index >= 0) {
                      oldData[self.state.index] = self.state.valuesObj;
                    } else {
                      _.isArray(oldData) ? oldData.push(self.state.valuesObj) : (oldData = [self.state.valuesObj]);
                    }
                    if (self.state.mockData[self.props.item.modulepath].url) {
                      var formData = _.clone(self.props.formData);
                      _.set(formData, self.props.item.jsonPath + '.' + self.props.item.arrayPath, oldData);
                      self.create(formData);
                    } else {
                      self.props.handler(
                        { target: { value: oldData } },
                        self.props.item.jsonPath + '.' + self.props.item.arrayPath,
                        self.props.item.isRequired ? true : false,
                        '',
                        self.props.item.requiredErrMsg,
                        self.props.item.patternErrMsg
                      );
                      self.setState({
                        valuesObj: {},
                        open: false,
                        index: -1,
                        fieldErrors: {},
                        isFormValid: false,
                      });
                    }
                  }}
                />,
                <FlatButton label={translate('pt.create.button.viewdcb.close')} primary={true} onClick={this.handleClose} />,
              ]}
              modal={false}
              open={this.state.open}
              contentStyle={{ width: '80%', 'max-width': '80%' }}
              onRequestClose={this.handleClose}
              autoScrollBodyContent={true}
            >
              {' '}
              <div>
                {!_.isEmpty(mockData) &&
                  mockData[this.props.item.modulepath] && (
                    <ShowFields
                      groups={mockData[this.props.item.modulepath].groups}
                      noCols={mockData[this.props.item.modulepath].numCols}
                      ui="google"
                      handler={handleChange}
                      getVal={getValueFn}
                      fieldErrors={this.state.fieldErrors}
                      useTimestamp={mockData[this.props.item.modulepath].useTimestamp || false}
                      addNewCard={''}
                      removeCard={''}
                      valuesObj={this.state.valuesObj}
                    />
                  )}
              </div>
            </Dialog>
          </div>
        );
    }
  };

  checkValidations = (fieldErrors, property, value, isRequired, form, requiredFields, pattern, patErrMsg) => {
    let _formData = {
      ...this.props.formData,
    };
    for (var i = 0; i < requiredFields.length; i++) {
      if(_.get(_formData,requiredFields[i])){
          form[requiredFields[i]] = _.get(_formData,requiredFields[i]);
      }
    }

    let errorText = isRequired && (typeof value == 'undefined' || value === '') ? translate('ui.framework.required') : '';
    let isFormValid = true;
    // console.log(requiredFields);
    for (var i = 0; i < requiredFields.length; i++) {
      if (typeof _.get(form, requiredFields[i]) == 'undefined' || _.get(form, requiredFields[i]) === '') {
        // console.log(requiredFields[i], _.get(form, requiredFields[i]));
        isFormValid = false;
        break;
      }
    }

    if (pattern && _.get(form, property) && !new RegExp(pattern).test(_.get(form, property))) {
      // console.log(property, _.get(form, property));
      errorText = patErrMsg ? translate(patErrMsg) : translate('ui.framework.patternMessage');
      isFormValid = false;
    }

    // console.log(fieldErrors);
    for (let key in fieldErrors) {
      if (fieldErrors[key] && key != property) {
        // console.log(key, property, fieldErrors, fieldErrors[key]);
        isFormValid = false;
        break;
      }
    }

    return {
      isFormValid,
      errorText,
    };
  };
  affectDependants = (obj, e, property) => {
    let { handleChange, setDropDownData, setDropDownOriginalData, dropDownOringalData } = this.props;
    let { getVal, getValFromDropdownData, returnPathValueFunction } = this;

    const findLastIdxOnJsonPath = jsonPath => {
      var str = jsonPath.split(REGEXP_FIND_IDX);
      for (let i = str.length - 1; i > -1; i--) {
        if (str[i].match(/\d+/)) {
          return str[i];
        }
      }
      return undefined;
    };

    const replaceLastIdxOnJsonPath = (jsonPath, replaceIdx) => {
      var str = jsonPath.split(REGEXP_FIND_IDX);
      var isReplaced = false;
      for (let i = str.length - 1; i > -1; i--) {
        if (str[i].match(/\d+/)) {
          if (!isReplaced) {
            isReplaced = true;
            str[i] = `[${replaceIdx}]`;
          } else str[i] = `[${str[i]}]`;
        }
      }
      return str.join('');
    };
    let depedants = jp.query(obj, `$.groups..fields[?(@.jsonPath=="${property}")].depedants.*`);
    let dependantIdx;
    if (depedants.length === 0 && property) {
      let currentProperty = property;
      dependantIdx = findLastIdxOnJsonPath(property);
      if (dependantIdx !== undefined) currentProperty = replaceLastIdxOnJsonPath(property, 0); //RESET INDEX 0 TO FIND DEPENDANT FIELDS FROM TEMPLATE JSON
      depedants = jp.query(obj, `$.groups..fields[?(@.type=="tableList")].tableList.values[?(@.jsonPath == "${currentProperty}")].depedants.*`);

      //Changes to handle table sum
      var jpathname = property.substr(0, property.lastIndexOf('[') + 1) + '0' + property.substr(property.lastIndexOf('[') + 2);

      var dependency = jp.query(obj, `$.groups..values[?(@.jsonPath=="${jpathname}")].dependency`);
      if (dependency.length > 0) {
        let _formData = {
          ...this.props.formData,
        };
        if (_formData) {
          let field = property.substr(0, property.lastIndexOf('['));
          let last = property.substr(property.lastIndexOf(']') + 2);
          let curIndex = property.substr(property.lastIndexOf('[') + 1, 1);

          let arrval = _.get(_formData, field);
          if (arrval) {
            let len = _.get(_formData, field).length;

            let amtsum = 0;
            let svalue = '';
            for (var i = 0; i < len; i++) {
              let ifield = field + '[' + i + ']' + '.' + last;
              if (i == curIndex) {
                svalue = e.target.value;
              } else {
                svalue = _.get(_formData, ifield);
              }

              amtsum += parseInt(svalue);
            }
            if (amtsum > 0) {
              handleChange(
                {
                  target: {
                    value: amtsum,
                  },
                },
                dependency[0],
                false,
                '',
                ''
              );
            }
          }
        }
      }
    }

    _.forEach(depedants, function(value, key) {
      if (value.type == 'dropDown') {
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
                //console.log("replacing!!!", queryStringObject[i].split("=")[1], queryStringObject[i].split("=")[1].replace(/\{(.*?)\}/, e.target.value))
                id[queryStringObject[i].split('=')[0]] = queryStringObject[i].split('=')[1].replace(/\{(.*?)\}/, e.target.value) || '';
              } else {
                id[queryStringObject[i].split('=')[0]] =
                  queryStringObject[i].split('=')[1].replace(
                    /\{(.*?)\}/,
                    getVal(
                      queryStringObject[i]
                        .split('=')[1]
                        .split('{')[1]
                        .split('}')[0]
                    )
                  ) || '';
              }
            } else {
              id[queryStringObject[i].split('=')[0]] = queryStringObject[i].split('=')[1];
            }
          }
        }

        Api.commonApiPost(context, id, {}, false, false, false, '', '', value.isStateLevel).then(
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
              setDropDownOriginalData(value.jsonPath, response);
            }
          },
          function(err) {
            console.log(err);
          }
        );
      } else if (value.type == "autoFill") {
        let splitArray = value.pattern.split("?");
        let context = "";
        let id = {};
        for (var j = 0; j < splitArray[0].split("/").length; j++) {
          context += splitArray[0].split("/")[j] + "/";
        }

        let queryStringObject = splitArray[1].split("|")[0].split("&");
        for (var i = 0; i < queryStringObject.length; i++) {
          if (i) {
            if (queryStringObject[i].split("=")[1].search("{") > -1) {
              if (
                queryStringObject[i]
                  .split("=")[1]
                  .split("{")[1]
                  .split("}")[0] == property
              ) {
                id[queryStringObject[i].split("=")[0]] = e.target.value || "";
              } else {
                // id[queryStringObject[i].split("=")[0]] = getVal(
                //   replaceLastIdxOnJsonPath(
                //     queryStringObject[1]
                //       .split("=")[1]
                //       .split("{")[1]
                //       .split("}")[0],
                //     dependantIdx
                //   )
                // );
                let filterParameter = queryStringObject[i]
                  .split('=')[1]
                  .split('{')[1]
                  .split('}')[0];

                if (dependantIdx && dependantIdx != 0 && filterParameter.indexOf('[') != filterParameter.lastIndexOf('[')) {
                  filterParameter = replaceLastIdxOnJsonPath(filterParameter, dependantIdx);
                  value.jsonPath = replaceLastIdxOnJsonPath(value.jsonPath, dependantIdx);
                }

                id[queryStringObject[i].split("=")[0]] =
                  queryStringObject[i].split("=")[1].replace(
                    /\{(.*?)\}/,
                    getVal(
                      filterParameter
                    )
                  ) || "";
              }
            } else {
              id[queryStringObject[i].split("=")[0]] = queryStringObject[
                i
              ].split("=")[1];
            }
          }
        }
        Api.commonApiPost(context, id).then(
          function (response) {
            let fields = jp.query(
              obj,
              `$.groups..fields[?(@.hasATOAATransform==true)]`
            );

            if (response) {
              if (fields && fields.length > 0) {
                let splitArray = value.pattern.split('?');
                for (var i = 0; i < fields.length; i++) {
                  if (!fields[i].hasPreTransform) {
                    var keys = Object.keys(value.autoFillFields);
                    let values = _.get(response, value.autoFillFields[keys[0]]);
                    //console.log(values);
                    let keysArray = jp.query(values, splitArray[1].split('|')[1]);
                    let valuesArray = jp.query(values, splitArray[1].split('|')[2]);
                    let dropDownData = [];
                    for (var k = 0; k < keysArray.length; k++) {
                      let dropdownObject = {};
                      dropdownObject['key'] = value.convertToString ? keysArray[k].toString() : value.convertToNumber ? Number(keysArray[k]) : keysArray[k];
                      dropdownObject['value'] = valuesArray[k];
                      dropDownData.push(dropdownObject);
                    }

                    dropDownData.sort(function (s1, s2) {
                      return s1.value < s2.value ? -1 : s1.value > s2.value ? 1 : 0;
                    });

                    setDropDownData(value.jsonPath, dropDownData);

                  }
                }

              }
              else {
                for (var key in value.autoFillFields) {
                  var keyField = key.substr(0, key.lastIndexOf("["));
                  var keyLast = key.substr(key.lastIndexOf("]") + 2);
                  var propertyCurIndex = property.substr(
                    property.lastIndexOf("[") + 1,
                    1
                  );
                  var newKey = keyField + "[" + propertyCurIndex + "]." + keyLast;
                  handleChange(
                    {
                      target: {
                        value: _.get(response, value.autoFillFields[key])
                      }
                    },
                    newKey,
                    false,
                    "",
                    ""
                  );
                }
              }
            }
          },
          function (err) {
            console.log(err);
          }
        );
      }else{

      }
    });
  };

  handleChange = (e, property, isRequired, pattern, requiredErrMsg, patternErrMsg) => {
    let { handleChange, mockData, setDropDownData, formData } = this.props;
    var currentState = this.state;
    let hashLocation = window.location.hash;
    var substring = 'updateagency';
    let obj;
    if (hashLocation.indexOf(substring) !== -1) {
      obj = specifications[`${hashLocation.split('/')[2]}.create`];
    } else {
      obj = specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`];
    }

    var newObj = _.set(currentState.valuesObj, property, e.target.value);
    // this.setState({
    //   valuesObj: newObj
    // });
    //$("#title>div>div:nth-child(2)").text(this.state.valuesObj.title);
    //$("#gender>div>div:nth-child(2)").text(this.state.valuesObj.gender);
    // dispatch({type:"HANDLE_CHANGE_FRAMEWORK", property,value: e.target.value, isRequired, pattern, requiredErrMsg, patternErrMsg});
    var validationDat = this.checkValidations(
      currentState.fieldErrors,
      property,
      e.target.value,
      isRequired,
      currentState.valuesObj,
      currentState.reqRequired,
      pattern,
      patternErrMsg
    );

    this.setState({
      valuesObj: newObj,
      isFormValid: validationDat.isFormValid,
      fieldErrors: {
        ...currentState.fieldErrors,
        [property]: validationDat.errorText,
      },
    });

    //  try{
    //      handleChange(e,property, isRequired, pattern, requiredErrMsg, patternErrMsg);
    //  }
    //  catch(e){
    //    console.log('error in autocomplete . It is version issue');
    //    console.log(e);
    //  }
    this.checkIfHasEnDisFields(property, e.target.value);

    this.affectDependants(obj, e, property);
  };

 getValueFn = ( path,dateBool ) => {

    var _val = _.get(this.state.valuesObj, path);
    if (dateBool && typeof _val == "string" && _val && _val.indexOf("-") > -1) {
      var _date = _val.split("-");
      return new Date(_date[0], Number(_date[1]) - 1, _date[2]);
    }
    return typeof _val != "undefined" ? _val : "";
}

  handleOpen = () => {
    //console.log("Popup states",this.state);
    // console.log("Popup Props",this.props);
    this.setState({
      valuesObj: {},
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
      fieldErrors: {},
      isFormValid: false,
    });
  };

  render() {
    return <div>{this.renderArrayField(this.props.item)}</div>;
  }
}
const mapStateToProps = state => ({
  fieldErrors: state.frameworkForm.fieldErrors,
  formData: state.frameworkForm.form,
  mockData: state.framework.mockData,
  moduleName: state.framework.moduleName,
  actionName: state.framework.actionName,
  dropDownData: state.framework.dropDownData,
  dropDownOringalData: state.framework.dropDownOringalData,
});
const mapDispatchToProps = dispatch => ({
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
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
  setDropDownData: (fieldName, dropDownData) => {
    dispatch({ type: 'SET_DROPDWON_DATA', fieldName, dropDownData });
  },
  setDropDownOriginalData: (fieldName, dropDownData) => {
    dispatch({ type: 'SET_ORIGINAL_DROPDWON_DATA', fieldName, dropDownData });
  },
  handleChange: (e, property, isRequired, pattern, requiredErrMsg, patternErrMsg) => {
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
});

export default connect(mapStateToProps, mapDispatchToProps)(UiWindowForm);
