import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

import _ from 'lodash';
import ShowFields from '../../framework/showFields';
import { translate } from '../../common/common';
import Api from '../../../api/api';

import UiButton from '../../framework/components/UiButton';
import { fileUpload, getInitiatorPosition } from '../../framework/utility/utility';
import UiDynamicTable from '../../framework/components/uiDynamicTable2';
import UiTable from '../../framework/components/UiTable';

import jp from 'jsonpath';
import $ from 'jquery';

var count = 0;

var specifications = {};
let reqRequired = [];
class Transaction extends Component {
  state = {
    pathname: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      showResult: false,
      resultList: {
        resultHeader: [],
        resultValues: [],
      },
      values: [],
    };
  }

  setLabelAndReturnRequired(configObject) {
    if (configObject && configObject.groups) {
      for (var i = 0; i < configObject.groups.length; i++) {
        configObject.groups[i].label = translate(configObject.groups[i].label);
        for (var j = 0; j < configObject.groups[i].fields.length; j++) {
          configObject.groups[i].fields[j].label = translate(configObject.groups[i].fields[j].label);
          if (configObject.groups[i].fields[j].isRequired) reqRequired.push(configObject.groups[i].fields[j].jsonPath);
        }

        if (configObject.groups[i].children && configObject.groups[i].children.length) {
          for (var k = 0; k < configObject.groups[i].children.length; k++) {
            this.setLabelAndReturnRequired(configObject.groups[i].children[k]);
          }
        }
      }
    }
  }

  getVal = path => {
    return typeof _.get(this.props.formData, path) != 'undefined' ? _.get(this.props.formData, path) : '';
  };

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

  // initData() {
  //   let hashLocation = window.location.hash;
  //   try {
  //     var hash = window.location.hash.split("/");
  //     if(hash.length == 4 && hashLocation.split("/")[1]!="transaction") {
  //       specifications = require(`./specs/${hash[2]}/${hash[2]}`).default;
  //     } else if(hashLocation.split("/")[1]!="transaction"){
  //       specifications = require(`./specs/${hash[2]}/master/${hash[3]}`).default;
  //     } else {
  //       specifications = require(`./specs/${hash[2]}/transaction/${hash[3]}`).default;
  //     }
  //   } catch(e) {}
  //   let { setMetaData, setModuleName, setActionName, initForm, setMockData, setFormData } = this.props;
  //   let obj = specifications[`${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`];
  //   var formData = {};
  //   if(obj && obj.groups && obj.groups.length) this.setDefaultValues(obj.groups, formData);
  //   reqRequired = [];
  //   this.setLabelAndReturnRequired(obj);
  //   initForm(reqRequired);
  //   setMetaData(specifications);
  //   for (var i = 0; i < specifications["asset.transaction"].groups[0].fields.length; i++) {
  //         specifications["asset.transaction"].groups[0].fields[i].isDisabled=false;
  //   }
  //   setMockData(JSON.parse(JSON.stringify(specifications)));
  //   setModuleName(hashLocation.split("/")[2]);
  //   setActionName(hashLocation.split("/")[1]);
  //   setFormData(formData);
  //   this.setState({
  //     pathname:this.props.history.location.pathname,
  //     showResult:false
  //   })

  // console.log(this.props.match);
  // if (this.props.match.params.businessService && decodeURIComponent(this.props.match.params.consumerCode)) {
  //   // count++;
  //   // if (count==1) {
  //     // alert("hai")
  //
  //     for (var i = 0; i < specifications["asset.transaction"].groups[0].fields.length; i++) {
  //       specifications["asset.transaction"].groups[0].fields[i].isDisabled=true;
  //     }
  //     setMockData(JSON.parse(JSON.stringify(specifications)));
  //
  //     this.props.handleChange({target:{value:this.props.match.params.businessService}},"businessService",true,false);
  //     this.props.handleChange({target:{value:decodeURIComponent(this.props.match.params.consumerCode)}},"consumerCode",true,false);
  //     this.search(null,this.props.match.params.businessService,decodeURIComponent(this.props.match.params.consumerCode));
  //     // console.log($("#payTax").length);
  //     // $("#payTax").submit();
  //
  //   // }
  //   // console.log(this.props.match.params.businessService + "- "+decodeURIComponent(this.props.match.params.consumerCode));
  // }
  // }

  initData() {
    let self = this;
    specifications = require(`../../framework/specs/asset/transaction/revaluationAsset`).default;

    let { setMetaData, setModuleName, setActionName, initForm, setMockData, setFormData } = this.props;
    let obj = specifications['asset.transaction'];
    var formData = {};
    if (obj && obj.groups && obj.groups.length) this.setDefaultValues(obj.groups, formData);
    reqRequired = [];
    this.setLabelAndReturnRequired(obj);
    initForm(reqRequired);
    setMetaData(specifications);
    for (var i = 0; i < specifications['asset.transaction'].groups[0].fields.length; i++) {
      specifications['asset.transaction'].groups[0].fields[i].isDisabled = false;
    }
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('asset');
    setActionName('transaction');
    setFormData(formData);
    this.setState({
      pathname: this.props.history.location.pathname,
      showResult: false,
    });
  }

  componentDidMount() {
    let self = this;
    this.initData();

    // var defaultDate = new Date();
    // console.log(defaultDate);
    // let findefaultDate = ('0' + defaultDate.getDate()).slice(-2) + '/'
    //        + ('0' + (defaultDate.getMonth()+1)).slice(-2) + '/'
    //        + defaultDate.getFullYear();
    //        console.log(defaultDate);
    var d = new Date();
    var n = d.getTime();
    self.props.handleChange({ target: { value: n } }, 'Revaluation.revaluationDate');
  }


  search = () => {
    let self = this;
    self.props.setLoadingStatus('loading');
    var formData = { ...this.props.formData };
    console.log(formData);
     if(formData && formData.hasOwnProperty("revaluation")){
       console.log(formData['assetCategoryType']);
    formData['assetCategoryType']=formData.revaluation.assetCategoryType;
    formData['assetCategory']=formData.revaluation.assetCategory;
    formData['assetSubCategory']=formData.revaluation.assetSubCategory;
    delete formData.revaluation;

   }
   //code to handle "-- Please select --" selection of assetCategoryType
   if(formData && formData.hasOwnProperty("assetCategoryType") && formData.assetCategoryType==""){
     delete formData.assetCategoryType;
   }
   if(formData && formData.hasOwnProperty("department") && formData.department==""){
     delete formData.department;
   }
    if(formData && formData.hasOwnProperty("assetCategory") && formData.hasOwnProperty("assetSubCategory") && formData.assetCategory==""){
    delete formData.assetCategory;
    delete formData.assetSubCategory;
  }
  console.log(formData);
    Api.commonApiPost('/asset-services-maha/assets/_search', formData, {}, null, true).then(
      function(res) {
        self.props.setLoadingStatus('hide');
        self.props.handleChange({ target: { value: res.Assets } }, 'Revaluation.Assets', false, false);
        self.props.handleChange({ target: { value: localStorage.getItem('tenantId') } }, 'Revaluation.tenantId', false, false);

        var resultList = {
          resultHeader: self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.header,
          resultValues: [],
        };

        let objectPath = self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.resultPath;
        let tableObjectPath = self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.tableResultPath;
        var values = _.get(res, objectPath);
        // var specsValuesList = self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.values;
        let headers = Object.assign([], resultList.resultHeader);

        if (values && values.length) {
          for (var i = 0; i < values.length; i++) {
            var tmp = [];
            for (var j = 0; j < headers.length; j++) {
              tmp.push(
                Object.assign({}, headers[j], {
                  jsonPath: tableObjectPath + '[' + i + '].' + headers[j].jsonPath,
                })
              );

              // tmp.push(_.get(values[i], specsValuesList[j]));
            }
            resultList.resultValues.push(tmp);
          }
        }

        self.setState({
          resultList,
          showResult: true,
        });

        self.props.setFlag(1);
      },
      function(err) {
        self.props.toggleSnackbarAndSetText(true, err.message, false, true);
        self.setState({
          showResult: false,
        });
        self.props.setLoadingStatus('hide');
      }
    );
  };

  getVal = (path, isDate) => {
    var val = _.get(this.props.formData, path);

    if (isDate && val && ((val + '').length == 13 || (val + '').length == 12) && new Date(Number(val)).getTime() > 0) {
      var _date = new Date(Number(val));
      return ('0' + _date.getDate()).slice(-2) + '/' + ('0' + (_date.getMonth() + 1)).slice(-2) + '/' + _date.getFullYear();
    }
    return typeof val != 'undefined' ? val : '';
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

  handleChange = (e, property, isRequired, pattern, requiredErrMsg = 'Required', patternErrMsg = 'Pattern Missmatch', expression, expErr, isDate) => {
    let { getVal, getValFromDropdownData } = this;
    let self = this;
    let { handleChange, mockData, setDropDownData, formData } = this.props;
    let hashLocation = window.location.hash;
    let obj = specifications[`asset.transaction`];

    if (property == 'Revaluation.valueAfterRevaluation') {
      for (var i = 0; i < formData.Revaluation.Assets.length; i++) {
        console.log('i');
        if (formData.Revaluation.Assets[i].isRadio == true) {
          console.log(formData.Revaluation.Assets[i].currentValue);
          var revaluationAmount = e.target.value - formData.Revaluation.Assets[i].currentValue;
          console.log(revaluationAmount);
          handleChange({ target: { value: revaluationAmount } }, 'Revaluation.revaluationAmount');
        }
      }
    }

    console.log(property);
    if (property.search('isRadio') != -1) {
      let _indexVal = property.split('[')[1].split(']')[0];
      if (formData.Revaluation.Assets && self.props.formData.Revaluation.Assets.length) {
        for (var i = 0; i < formData.Revaluation.Assets.length; i++) {
          if (_indexVal != i) {
            formData.Revaluation.Assets[i].isRadio = false;
          }
        }
        self.props.setMockData(formData);
      }
    }

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
    if (depedants.length === 0)
      depedants = jp.query(obj, `$.groups..fields[?(@.type=="tableList")].tableList.values[?(@.jsonPath == "${property}")].depedants.*`);

    this.checkIfHasShowHideFields(property, e.target.value);
    this.checkIfHasEnDisFields(property, e.target.value);
    handleChange(e, property, isRequired, pattern, requiredErrMsg, patternErrMsg);
console.log("depedent dropdown");
    _.forEach(depedants, function(value, key) {
      if (value.type == 'dropDown') {
        console.log(value.jsonPath);
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
                id[queryStringObject[i].split('=')[0]] = queryStringObject[i].split('=')[1].replace(/\{(.*?)\}/, e.target.value) || '';
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
      } else if (value.type == 'textField') {
        try {
          let object = {
            target: {
              value: (value.valExp && eval(value.valExp)) || eval(eval(value.pattern)),
            },
          };
          handleChange(object, value.jsonPath, value.isRequired, value.rg, value.requiredErrMsg, value.patternErrMsg);
        } catch (ex) {
          console.log('ex', ex);
        }
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

  rowClickHandler = index => {
    var value = this.state.values[index];
    var _url =
      window.location.hash.split('/').indexOf('update') > -1
        ? this.props.metaData[`${this.props.moduleName}.${this.props.actionName}`].result.rowClickUrlUpdate
        : this.props.metaData[`${this.props.moduleName}.${this.props.actionName}`].result.rowClickUrlView;
    var key = _url.split('{')[1].split('}')[0];
    _url = _url.replace('{' + key + '}', _.get(value, key));
    this.props.setRoute(_url);
  };
  resetForm = () => {
    let { moduleName, actionName, metaData, setFormData } = this.props;
    let obj = metaData[`${moduleName}.${actionName}`];
    var formData = {};
    if (obj && obj.groups && obj.groups.length) this.setDefaultValues(obj.groups, formData);
    setFormData(formData);
    this.setState({
      pathname: this.props.history.location.pathname,
      showResult: false,
    });
  };
  // rowButtonClickHandler = (buttonUrl, id) => {
  //   let { formData } = this.props;
  //   if (id) {
  //     localStorage.setItem('returnUrl', window.location.hash.split('#/')[1]);
  //     localStorage.setItem('formData', JSON.stringify(formData));
  //     this.props.setRoute(buttonUrl + id);
  //   } else {
  //     let { selectedRecordId } = this.state;
  //     if (selectedRecordId) {
  //       localStorage.setItem('returnUrl', window.location.hash.split('#/')[1]);
  //       localStorage.setItem('formData', JSON.stringify(formData));
  //       this.props.setRoute(buttonUrl + selectedRecordId);
  //     }
  //   }
  // };

  create = e => {
    let self = this;
    e.preventDefault();
    var formData = { ...this.props.formData };
     if(formData && formData.hasOwnProperty("revaluation")){
    formData['assetCategoryType']=formData.revaluation.assetCategoryType;
    formData['assetCategory']=formData.revaluation.assetCategory;
    formData['assetSubCategory']=formData.revaluation.assetSubCategory;
    delete formData.revaluation;
  }
    // delete formData.Assets;
    for (var i = 0; i < formData.Revaluation.Assets.length; i++) {
      if (formData.Revaluation.Assets[i].isRadio == true) {
        formData.Revaluation.assetId = formData.Revaluation.Assets[i].id;
        console.log(formData.Revaluation['assetId']);
      }
    }

    if (formData.Revaluation['assetId']) {
      console.log(formData.Revaluation['assetId']);

      if (
        !formData.Revaluation.valueAfterRevaluation ||
        formData.Revaluation.valueAfterRevaluation == null ||
        formData.Revaluation.valueAfterRevaluation == ''
      ) {
        self.props.toggleSnackbarAndSetText(true, 'Please enter Valuation Amount', false, true);

        if (!formData.Revaluation.orderDate || formData.Revaluation.orderDate == null || formData.Revaluation.orderDate == '') {
          self.props.toggleSnackbarAndSetText(true, 'Please enter Order Date', false, true);
        }

        if (!formData.Revaluation.orderNumber || formData.Revaluation.orderNumber == null || formData.Revaluation.orderNumber == '') {
          self.props.toggleSnackbarAndSetText(true, 'Please enter Order No.', false, true);
        }

        if (!formData.Revaluation.revaluationDate || formData.Revaluation.revaluationDate == null || formData.Revaluation.revaluationDate == '') {
          self.props.toggleSnackbarAndSetText(true, 'Please enter Revaluation Date', false, true);
        }
      } else {
        self.props.setLoadingStatus('loading');

        var amountValidation = true;
        var amountValidationMsg = '';
        console.log(formData);

        if (formData && formData.hasOwnProperty('Revaluation') && formData.Revaluation.hasOwnProperty('revaluationAmount')) {
          var negNumber = formData.Revaluation.revaluationAmount;
          if (negNumber >= 0) {
            console.log('positive');
            formData.Revaluation.typeOfChange = 'INCREASED';
            console.log(formData.Revaluation.typeOfChange);
          } else {
            var posReVal = Math.abs(negNumber);
            console.log(posReVal);
            formData.Revaluation.typeOfChange = 'DECREASED';
            console.log(formData.Revaluation.typeOfChange);
            this.props.handleChange({ target: { value: posReVal } }, 'Revaluation.revaluationAmount');
          }
        }

        //delete formData.Revaluation.Assets;

        console.log(formData);

        Api.commonApiPost('/asset-services-maha/assets/revaluation/_create', '', formData, '', true).then(
          function(response) {
            self.props.setLoadingStatus('hide');
            self.initData();
            self.props.toggleSnackbarAndSetText(
              true,
              translate(self.props.actionName == 'transaction' ? 'wc.create.message.success' : 'wc.update.message.success'),
              true
            );
          },
          function(err) {
            self.props.setLoadingStatus('hide');
            self.props.toggleSnackbarAndSetText(true, err.message);
          }
        );
      }
    } else {
      self.props.toggleSnackbarAndSetText(true, 'Please Select a Record', false, true);
    }
  };

  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors, isFormValid, match } = this.props;
    let { search, handleChange, getVal, addNewCard, removeCard, rowClickHandler, create } = this;
    let { showResult, resultList } = this.state;

    return (
      <div className="SearchResult">
        <form
          id="payTax"
          onSubmit={e => {
            search(e);
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
                addNewCard={''}
                removeCard={''}
              />
            )}
          <div style={{ textAlign: 'center' }}>
            <br />
            <UiButton
              item={{
                label: 'Search',
                uiType: 'submit',
                isDisabled: isFormValid ? (match.params.businessService && match.params.consumerCode ? true : false) : true,
              }}
              ui="google"
            />
            <UiButton
              icon={
                <i style={{ color: 'black' }} className="material-icons">
                  backspace
                </i>
              }
              item={{ label: 'Reset', uiType: 'button', primary: false }}
              ui="google"
              handler={this.resetForm}
            />&nbsp;&nbsp;
            <br />
            <br />
            </div>


        </form>

        {showResult && <UiDynamicTable resultList={resultList} ui="google" handler={handleChange} getVal={getVal} fieldErrors={fieldErrors} />}

        <br />
        {showResult &&
          !_.isEmpty(mockData) && (
            <ShowFields
              groups={mockData[`${moduleName}.${actionName}`].transaction}
              noCols={mockData[`${moduleName}.${actionName}`].numCols}
              ui="google"
              handler={handleChange}
              getVal={getVal}
              fieldErrors={fieldErrors}
              useTimestamp={mockData[`${moduleName}.${actionName}`].useTimestamp || false}
              addNewCard={''}
              removeCard={''}
            />
          )}
        <div style={{ textAlign: 'center' }}>
          <br />
          {showResult && (
            <UiButton
              handler={create}
              item={{
                label: 'Create',
                uiType: 'button',
                isDisabled: isFormValid ? false : true,
              }}
              ui="google"
            />
          )}
          <br />
        </div>
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
  flag: state.report.flag,
  isFormValid: state.frameworkForm.isFormValid,
});

const mapDispatchToProps = dispatch => ({
  initForm: (reqRequired, patRequired) => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: reqRequired,
        },
        pattern: {
          current: [],
          required: patRequired,
        },
      },
    });
  },
  setMetaData: metaData => {
    dispatch({ type: 'SET_META_DATA', metaData });
  },
  setMockData: mockData => {
    dispatch({ type: 'SET_MOCK_DATA', mockData });
  },
  setModuleName: moduleName => {
    dispatch({ type: 'SET_MODULE_NAME', moduleName });
  },
  setActionName: actionName => {
    dispatch({ type: 'SET_ACTION_NAME', actionName });
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
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
  setFlag: flag => {
    dispatch({ type: 'SET_FLAG', flag });
  },
  delRequiredFields: requiredFields => {
    dispatch({ type: 'DEL_REQUIRED_FIELDS', requiredFields });
  },
  addRequiredFields: requiredFields => {
    dispatch({ type: 'ADD_REQUIRED_FIELDS', requiredFields });
  },
  removeFieldErrors: key => {
    dispatch({ type: 'REMOVE_FROM_FIELD_ERRORS', key });
  },
  addFieldErrors: (key, value) => {
    dispatch({ type: 'ADD_TO_FIELD_ERRORS', key, value });
  },
  setFormData: data => {
    dispatch({ type: 'SET_FORM_DATA', data });
  },
  setDropDownData: (fieldName, dropDownData) => {
    dispatch({ type: 'SET_DROPDWON_DATA', fieldName, dropDownData });
  },
  setFormStatus: status => {
    dispatch({ type: 'CHANGE_FORM_STATUS', status });
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
