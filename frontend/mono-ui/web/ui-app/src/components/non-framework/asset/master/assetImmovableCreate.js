import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText, CardTitle } from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import _ from 'lodash';
import ShowFields from '../../../framework/showFields';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { translate } from '../../../common/common';
import Api from '../../../../api/api';
import jp from 'jsonpath';
import UiButton from '../../../framework/components/UiButton';
import { fileUpload, getInitiatorPosition } from '../../../framework/utility/utility';
import $ from 'jquery';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import UiBackButton from '../../../framework/components/UiBackButton';
import UiGoogleMapsPolyline from '../../../framework/components/UiGoogleMapsPolyline';


var specifications = {};
var fields = [];
var groups = [];
var finArr = [];
let reqRequired = [];
let baseUrl = 'https://raw.githubusercontent.com/abhiegov/test/master/specs/';

const REGEXP_FIND_IDX = /\[(.*?)\]+/g;

class assetImmovableCreate extends Component {
  state = {
    pathname: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      customFieldsGen: {},
      hide: true,
      customArr: [],
      layerData: [],
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

  customFieldDataFun(val) {
    var self = this;
    let _value = '';
    _value = val;
    if (_value) {
      fields = _value;
      groups = [
        {
          label: 'Asset Attributes',
          name: 'assetAttributes',
          jsonPath: 'Asset.assetAttributes',
          fields,
        },
      ];

      for (var x = 0; x < fields.length; x++) {
        var formFin = {};
        formFin.key = fields[x].name;
        formFin.type = fields[x].type;
        finArr.push(formFin);
      }
      this.setState({
        hide: false,
      });
    } else {
      this.setState({
        hide: true,
      });
    }
  }

  setInitialUpdateData(form, specs, moduleName, actionName, objectName) {
    let { setMockData } = this.props;
    let _form = JSON.parse(JSON.stringify(form));
    var ind;
    for (var i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
      if (specs[moduleName + '.' + actionName].groups[i].multiple) {
        if (_form.Asset.landDetails != null) {
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
              j + 1,
              0,
              JSON.parse(_stringifiedGroup.replace(regex, specs[moduleName + '.' + actionName].groups[ind].jsonPath + '[' + j + ']'))
            );
            specs[moduleName + '.' + actionName].groups[ind + 1].index = j;
          }
        }
      }

      if (specs[moduleName + '.' + actionName].groups[ind || i].children && specs[moduleName + '.' + actionName].groups[ind || i].children.length) {
        this.setInitialUpdateChildData(form, specs[moduleName + '.' + actionName].groups[ind || i].children);
      }
    }

    setMockData(specs);
  }

  modifyData(urlId) {
    let self = this;
    let assetCheck = {};
    let specifications = require(`../../../framework/specs/asset/master/assetImmovable`).default;

    Api.commonApiPost('asset-services-maha/assets/_search', { id: urlId }, {}, false, false, false, '', '', false).then(
      function(response) {
        if (response && response.Assets && response.Assets[0] && response.Assets[0].assetAttributes) {
          for (var i = 0; i < response.Assets[0].assetAttributes.length; i++) {
            assetCheck[response.Assets[0].assetAttributes[i].key] = {
              [response.Assets[0].assetAttributes[i].type]: response.Assets[0].assetAttributes[i].value,
            };
          }
        }
        // if (response && response.Assets && response.Assets[0] && response.Assets[0].titleDocumentsAvailable) {
        //   response.Assets[0].titleDocumentsAvailable = response.Assets[0].titleDocumentsAvailable.join(',');
        // }

        response.Assets[0].assetAttributesCheck = assetCheck;
        self.props.setFormData({ Asset: response.Assets[0] });
        self.setInitialUpdateData(
          { Asset: response.Assets[0] },
          JSON.parse(JSON.stringify(specifications)),
          'asset',
          'update',
          specifications['asset.update'].objectName
        );
        // if(self.props.formData && self.props.formData.Asset && self.props.formData.Asset.assetAttributes){
        //   for (var i = 0; i < self.props.formData.Asset.assetAttributes.length; i++) {
        //     if(self.props.formData.Asset.assetAttributes[i].)
        //   }
        // }
        self.customFieldDataFun(self.state.customFieldsGen[response.Assets[0].assetCategory.id]);
        self.warrantyFunction(response.Assets[0].warrantyAvailable);
      },
      function(err) {
        console.log(err);
      }
    );
  }

  displayUI(results) {
    let { setMetaData, setModuleName, setActionName, initForm, setMockData, setFormData } = this.props;
    let hashLocation = window.location.hash;
    let self = this;
    var action = '';
    specifications = typeof results == 'string' ? JSON.parse(results) : results;
    if (this.props.match.params.id) {
      action = 'update';
    } else {
      action = 'create';
    }
    self.setState({
      action,
    });
    let obj = specifications[`asset.${action}`];
    reqRequired = [];
    self.setLabelAndReturnRequired(obj);
    initForm(reqRequired);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('asset');
    setActionName(action);

    if (self.props.match.params.id) {
      // self.modifyData(self.props.match.params.id);
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

    specifications = require(`../../../framework/specs/asset/master/assetImmovable`).default;
    self.displayUI(specifications);
  }

  componentDidMount() {
    this.initData();

    let self = this;
    var catId;
    var name, jsonPath, label, type, isRequired, isDisabled;
    var customSpecs = {};
    var depericiationValue = {};
    let cateoryObject = [];
    //  var customFieldsArray = [];
    //  var customArr;

    Api.commonApiPost(
      '/egov-mdms-service/v1/_get',
      { moduleName: 'ASSET', masterName: 'Assetconfiguration' },
      {},
      false,
      false,
      false,
      '',
      '',
      true
    ).then(function(response) {
      if (
        response &&
        response.MdmsRes &&
        response.MdmsRes.ASSET &&
        response.MdmsRes.ASSET.Assetconfiguration &&
        response.MdmsRes.ASSET.Assetconfiguration[0] &&
        response.MdmsRes.ASSET.Assetconfiguration[0].keyname == 'EnableVoucherGeneration'
      ) {
        if (response.MdmsRes.ASSET.Assetconfiguration[0].values[0].value == 'true') {
          self.props.addRequiredFields(['Asset.assetAccount']);
          self.props.addRequiredFields(['Asset.accumulatedDepreciationAccount']);
          self.props.addRequiredFields(['Asset.revaluationReserveAccount']);
          self.props.addRequiredFields(['Asset.depreciationExpenseAccount']);
        }
      }
    });

    Api.commonApiPost('/egf-masters/accountcodepurposes/_search', { name: 'Fixed Assets' }, {}, false, false, false, '', '', false).then(
      function(response) {
        if (response) {
          let keys = jp.query(response, '$..name');
          let values = jp.query(response, '$..name');
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
          //dropDownData.unshift({ key: null, value: '-- Please Select --' });
          self.props.setDropDownData('Asset.assetAccount', dropDownData);
        }
      },
      function(err) {
        console.log(err);
      }
    );

    Api.commonApiPost('/egf-masters/accountcodepurposes/_search', { name: 'Accumulated Depreciation' }, {}, false, false, false, '', '', false).then(
      function(response) {
        if (response) {
          let keys = jp.query(response, '$..name');
          let values = jp.query(response, '$..name');
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
          //dropDownData.unshift({ key: null, value: '-- Please Select --' });
          self.props.setDropDownData('Asset.accumulatedDepreciationAccount', dropDownData);
        }
      },
      function(err) {
        console.log(err);
      }
    );

    Api.commonApiPost(
      '/egf-masters/accountcodepurposes/_search',
      { name: 'Revaluation Reserve Account' },
      {},
      false,
      false,
      false,
      '',
      '',
      false
    ).then(
      function(response) {
        if (response) {
          let keys = jp.query(response, '$..name');
          let values = jp.query(response, '$..name');
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
          //dropDownData.unshift({ key: null, value: '-- Please Select --' });
          self.props.setDropDownData('Asset.revaluationReserveAccount', dropDownData);
        }
      },
      function(err) {
        console.log(err);
      }
    );

    Api.commonApiPost(
      '/egf-masters/accountcodepurposes/_search',
      { name: 'Depreciation Expense Account' },
      {},
      false,
      false,
      false,
      '',
      '',
      false
    ).then(
      function(response) {
        if (response) {
          let keys = jp.query(response, '$..name');
          let values = jp.query(response, '$..name');
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
          //dropDownData.unshift({ key: null, value: '-- Please Select --' });
          self.props.setDropDownData('Asset.depreciationExpenseAccount', dropDownData);
        }
      },
      function(err) {
        console.log(err);
      }
    );

    Api.commonApiPost(
      '/egov-mdms-service/v1/_get',
      {
        moduleName: 'ASSET',
        masterName: 'AssetCategory',
        filter:
          '%5B%3F%28+%40.isAssetAllowFromUi+%3D%3D+true+%26%26+%40.isAssetAllow+%3D%3D+true+%26%26+%40.assetCategoryType+%3D%3D+%22IMMOVABLE%22%29%5D',
      },
      {},
      false,
      false,
      false,
      '',
      '',
      true
    ).then(
      function(response) {
        if (response) {
          let keys = jp.query(response, '$.MdmsRes.ASSET.AssetCategory.*.id');
          let values = jp.query(response, '$.MdmsRes.ASSET.AssetCategory.*.name');
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
          self.props.setDropDownData('Asset.assetCategory.id', dropDownData);
        }

        for (var i = 0; i < response.MdmsRes.ASSET.AssetCategory.length; i++) {
          catId = response.MdmsRes.ASSET.AssetCategory[i].id;
          if (response.MdmsRes.ASSET.AssetCategory[i].assetFieldsDefination != null) {
            var customFieldsArray = [];
            for (var j = 0; j < response.MdmsRes.ASSET.AssetCategory[i].assetFieldsDefination.length; j++) {
              var customTemp = {};

              customTemp.name = response.MdmsRes.ASSET.AssetCategory[i].assetFieldsDefination[j].name;
              customTemp.jsonPath =
                'Asset.assetAttributesCheck.' +
                response.MdmsRes.ASSET.AssetCategory[i].assetFieldsDefination[j].name +
                '.' +
                response.MdmsRes.ASSET.AssetCategory[i].assetFieldsDefination[j].type;
              customTemp.label = response.MdmsRes.ASSET.AssetCategory[i].assetFieldsDefination[j].name;
              //added to check if the custom field has a type
              if ( response.MdmsRes.ASSET.AssetCategory[i].assetFieldsDefination[j].type) {
                  customTemp.type = response.MdmsRes.ASSET.AssetCategory[i].assetFieldsDefination[j].type;
              }else {
                  customTemp.type=null;
              }

              customTemp.isRequired = response.MdmsRes.ASSET.AssetCategory[i].assetFieldsDefination[j].isMandatory;
              customTemp.isDisabled = !response.MdmsRes.ASSET.AssetCategory[i].assetFieldsDefination[j].isActive;
              switch (customTemp.type) {
                case 'Text':
                  customTemp.type = 'text';
                  break;

                case 'Number':
                  customTemp.type = 'number';
                  break;

                case 'Select':
                  customTemp.type = 'singleValueList';
                  break;

                case null:
                  customTemp.type = 'text';
                  break;

                case 'table':
                  customTemp.type = 'table';
                  break;

                case 'image':
                  customTemp.type = 'image';
                  break;
                case 'GIS':
                  customTemp.type = 'googleMapsPolyline';
                  break;
              }

              if (customTemp.type == 'singleValueList') {
                if (
                  response.MdmsRes.ASSET.AssetCategory[i].assetFieldsDefination[j].values != null &&
                  response.MdmsRes.ASSET.AssetCategory[i].assetFieldsDefination[j].values.length
                ) {
                  var handleDropdown = response.MdmsRes.ASSET.AssetCategory[i].assetFieldsDefination[j].values;
                  var dropdownSplit = handleDropdown.split(',');
                  var valueHolder = [];
                  for (var y = 0; y < dropdownSplit.length; y++) {
                    var holder = {};
                    holder.key = dropdownSplit[y];
                    holder.value = dropdownSplit[y];
                    valueHolder.push(holder);
                  }

                  customTemp.defaultValue = valueHolder;
                } else {
                  let dropDownValue = [];
                  customTemp.url = response.MdmsRes.ASSET.AssetCategory[i].assetFieldsDefination[j].url;
                  let _value = customTemp.url.split('?');
                  let _splitUrl = _value[1].split('&');
                  let query = {};
                  for (let i = 0; i < _splitUrl.length; i++) {
                    if (_splitUrl[i].split('=')[0] == 'tenantId') {
                      continue;
                    }
                    query[_splitUrl[i].split('=')[0]] = _splitUrl[i].split('=')[1];
                  }
                  let temp = Object.assign({}, customTemp);
                  let cId = catId;
                  Api.commonApiPost(_value[0], query, {}, false, false, false, '', '', true).then(function(resp) {
                    if (resp) {
                      let keys = jp.query(resp, '$.MdmsRes.ASSET.LayerType.*.name');
                      let values = jp.query(resp, '$.MdmsRes.ASSET.LayerType.*.name');
                      let others = jp.query(resp, '$.MdmsRes.ASSET.LayerType.*');
                      var valueHolder = [];
                      var layerData = {};
                      for (var l = 0; l < keys.length; l++) {
                        var holder = {};
                        holder.key = keys[l];
                        holder.value = values[l];
                        valueHolder.push(holder);
                        layerData[keys[l]] = others[l];
                      }

                      for (var m = 0; m < customSpecs[cId].length; m++) {
                        if (customSpecs[cId][m].jsonPath == temp.jsonPath && temp.jsonPath=="Asset.assetAttributesCheck.Layer Type.Select") {
                          customSpecs[cId][m].defaultValue = valueHolder;
                          self.setState({
                            customFieldsGen: customSpecs,
                            layerData,
                          });
                          break;
                        }
                      }
                    }


                    if (resp) {
                              let keys = jp.query(resp, '$..description');
                              let values = jp.query(resp, '$..description');
                              let others = jp.query(resp, '$..*');
                              var valueHolder = [];
                              var areaUOM = {};
                              for (var l = 0; l < keys.length; l++) {
                                var holder = {};
                                holder.key = keys[l];
                                holder.value = values[l];
                                valueHolder.push(holder);
                                areaUOM[keys[l]] = others[l];
                              }

                              for (var m = 0; m < customSpecs[cId].length; m++) {
                                //console.log("temp.jsonPath"+temp.jsonPath);
                                if (customSpecs[cId][m].jsonPath == temp.jsonPath && temp.jsonPath=="Asset.assetAttributesCheck.Area UOM.Select") {
                                  customSpecs[cId][m].defaultValue = valueHolder;
                                  self.setState({
                                    customFieldsGen: customSpecs,
                                    areaUOM,
                                  });
                                  break;
                                }
                              }
                            }

                            if (resp) {
                                      let keys = jp.query(resp, '$..description');
                                      let values = jp.query(resp, '$..description');
                                      let others = jp.query(resp, '$..*');
                                      var valueHolder = [];
                                      var minUOM = {};
                                      for (var l = 0; l < keys.length; l++) {
                                        var holder = {};
                                        holder.key = keys[l];
                                        holder.value = values[l];
                                        valueHolder.push(holder);
                                        minUOM[keys[l]] = others[l];
                                      }

                                      for (var m = 0; m < customSpecs[cId].length; m++) {
                                        //console.log("temp.jsonPath"+temp.jsonPath);
                                        if (customSpecs[cId][m].jsonPath == temp.jsonPath && temp.jsonPath=="Asset.assetAttributesCheck.Minimum Width UOM.Select") {
                                          customSpecs[cId][m].defaultValue = valueHolder;
                                          self.setState({
                                            customFieldsGen: customSpecs,
                                            minUOM,
                                          });
                                          break;
                                        }
                                      }
                                    }

                                    if (resp) {
                                              let keys = jp.query(resp, '$..description');
                                              let values = jp.query(resp, '$..description');
                                              let others = jp.query(resp, '$..*');
                                              var valueHolder = [];
                                              var maxUOM = {};
                                              for (var l = 0; l < keys.length; l++) {
                                                var holder = {};
                                                holder.key = keys[l];
                                                holder.value = values[l];
                                                valueHolder.push(holder);
                                                maxUOM[keys[l]] = others[l];
                                              }

                                              for (var m = 0; m < customSpecs[cId].length; m++) {
                                                //console.log("temp.jsonPath"+temp.jsonPath);
                                                if (customSpecs[cId][m].jsonPath == temp.jsonPath && temp.jsonPath=="Asset.assetAttributesCheck.Maximum Width UOM.Select") {
                                                  customSpecs[cId][m].defaultValue = valueHolder;
                                                  self.setState({
                                                    customFieldsGen: customSpecs,
                                                    maxUOM,
                                                  });
                                                  break;
                                                }
                                              }
                                            }

                                            if (resp) {
                                                      let keys = jp.query(resp, '$..description');
                                                      let values = jp.query(resp, '$..description');
                                                      let others = jp.query(resp, '$..*');
                                                      var valueHolder = [];
                                                      var layerUOM = {};
                                                      for (var l = 0; l < keys.length; l++) {
                                                        var holder = {};
                                                        holder.key = keys[l];
                                                        holder.value = values[l];
                                                        valueHolder.push(holder);
                                                        layerUOM[keys[l]] = others[l];
                                                      }

                                                      for (var m = 0; m < customSpecs[cId].length; m++) {
                                                        //console.log("temp.jsonPath"+temp.jsonPath);
                                                        if (customSpecs[cId][m].jsonPath == temp.jsonPath && temp.jsonPath=="Asset.assetAttributesCheck.Layer Size UOM.Select") {
                                                          customSpecs[cId][m].defaultValue = valueHolder;
                                                          self.setState({
                                                            customFieldsGen: customSpecs,
                                                            layerUOM,
                                                          });
                                                          break;
                                                        }
                                                      }
                                                    }
                                                    if (resp) {
                                                              let keys = jp.query(resp, '$..description');
                                                              let values = jp.query(resp, '$..description');
                                                              let others = jp.query(resp, '$..*');
                                                              var valueHolder = [];
                                                              var diameterUOM = {};
                                                              for (var l = 0; l < keys.length; l++) {
                                                                var holder = {};
                                                                holder.key = keys[l];
                                                                holder.value = values[l];
                                                                valueHolder.push(holder);
                                                                diameterUOM[keys[l]] = others[l];
                                                              }

                                                              for (var m = 0; m < customSpecs[cId].length; m++) {
                                                                if (customSpecs[cId][m].jsonPath == temp.jsonPath && temp.jsonPath=="Asset.assetAttributesCheck.Diameter UOM.Select") {
                                                                  customSpecs[cId][m].defaultValue = valueHolder;
                                                                  self.setState({
                                                                    customFieldsGen: customSpecs,
                                                                    diameterUOM,
                                                                  });
                                                                  break;
                                                                }
                                                              }
                                                            }
                                                            if (resp) {
                                                                      let keys = jp.query(resp, '$..description');
                                                                      let values = jp.query(resp, '$..description');
                                                                      let others = jp.query(resp, '$..*');
                                                                      var valueHolder = [];
                                                                      var lengthUOM = {};
                                                                      for (var l = 0; l < keys.length; l++) {
                                                                        var holder = {};
                                                                        holder.key = keys[l];
                                                                        holder.value = values[l];
                                                                        valueHolder.push(holder);
                                                                        lengthUOM[keys[l]] = others[l];
                                                                      }

                                                                      for (var m = 0; m < customSpecs[cId].length; m++) {
                                                                        //console.log("temp.jsonPath"+temp.jsonPath);
                                                                        if (customSpecs[cId][m].jsonPath == temp.jsonPath && temp.jsonPath=="Asset.assetAttributesCheck.Length UOM.Select") {
                                                                          customSpecs[cId][m].defaultValue = valueHolder;
                                                                          self.setState({
                                                                            customFieldsGen: customSpecs,
                                                                            lengthUOM,
                                                                          });
                                                                          break;
                                                                        }
                                                                      }
                                                                    }
                                                                    if (resp) {
                                                                              let keys = jp.query(resp, '$..description');
                                                                              let values = jp.query(resp, '$..description');
                                                                              let others = jp.query(resp, '$..*');
                                                                              var valueHolder = [];
                                                                              var capacityUOM = {};
                                                                              for (var l = 0; l < keys.length; l++) {
                                                                                var holder = {};
                                                                                holder.key = keys[l];
                                                                                holder.value = values[l];
                                                                                valueHolder.push(holder);
                                                                                capacityUOM[keys[l]] = others[l];
                                                                              }

                                                                              for (var m = 0; m < customSpecs[cId].length; m++) {
                                                                                if (customSpecs[cId][m].jsonPath == temp.jsonPath && temp.jsonPath=="Asset.assetAttributesCheck.Capacity UOM.Select") {
                                                                                  customSpecs[cId][m].defaultValue = valueHolder;
                                                                                  self.setState({
                                                                                    customFieldsGen: customSpecs,
                                                                                    capacityUOM,
                                                                                  });
                                                                                  break;
                                                                                }
                                                                              }
                                                                            }
                                                                            if (resp) {
                                                                                      let keys = jp.query(resp, '$..description');
                                                                                      let values = jp.query(resp, '$..description');
                                                                                      let others = jp.query(resp, '$..*');
                                                                                      var valueHolder = [];
                                                                                      var floorWiseAreaUOM = {};
                                                                                      for (var l = 0; l < keys.length; l++) {
                                                                                        var holder = {};
                                                                                        holder.key = keys[l];
                                                                                        holder.value = values[l];
                                                                                        valueHolder.push(holder);
                                                                                        floorWiseAreaUOM[keys[l]] = others[l];
                                                                                      }

                                                                                      for (var m = 0; m < customSpecs[cId].length; m++) {
                                                                                        if (customSpecs[cId][m].jsonPath == temp.jsonPath && temp.jsonPath=="Asset.assetAttributesCheck.Floor Wise Area UOM.Select") {
                                                                                          customSpecs[cId][m].defaultValue = valueHolder;
                                                                                          self.setState({
                                                                                            customFieldsGen: customSpecs,
                                                                                            floorWiseAreaUOM,
                                                                                          });
                                                                                          break;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                    if (resp) {
                                                                                              let keys = jp.query(resp, '$..description');
                                                                                              let values = jp.query(resp, '$..description');
                                                                                              let others = jp.query(resp, '$..*');
                                                                                              var valueHolder = [];
                                                                                              var intakeWaterUOM = {};
                                                                                              for (var l = 0; l < keys.length; l++) {
                                                                                                var holder = {};
                                                                                                holder.key = keys[l];
                                                                                                holder.value = values[l];
                                                                                                valueHolder.push(holder);
                                                                                                intakeWaterUOM[keys[l]] = others[l];
                                                                                              }

                                                                                              for (var m = 0; m < customSpecs[cId].length; m++) {
                                                                                                //console.log("temp.jsonPath"+temp.jsonPath);
                                                                                                if (customSpecs[cId][m].jsonPath == temp.jsonPath && temp.jsonPath=="Asset.assetAttributesCheck.Intake Water UOM.Select") {
                                                                                                  customSpecs[cId][m].defaultValue = valueHolder;
                                                                                                  self.setState({
                                                                                                    customFieldsGen: customSpecs,
                                                                                                    intakeWaterUOM,
                                                                                                  });
                                                                                                  break;
                                                                                                }
                                                                                              }
                                                                                            }



                  });
                }
              }
              customFieldsArray.push(customTemp);
            }
            customSpecs[catId] = customFieldsArray;
          }
          depericiationValue[catId] = response.MdmsRes.ASSET.AssetCategory[i].depreciationRate;
          cateoryObject[catId] = response.MdmsRes.ASSET.AssetCategory[i];
          self.setState({
            customFieldsGen: customSpecs,
            depericiationValue,
            cateoryObject,
          });
        }
        self.setState(() => {
          if (self.props.match.params.id) {
            self.modifyData(self.props.match.params.id);
          }
        });
      },
      function(err) {
        console.log(err);
        if (self.props.match.params.id) {
          self.modifyData(self.props.match.params.id);
        }
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.pathname && this.state.pathname != nextProps.history.location.pathname) {
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
    Api.commonApiPost(url, query, {}, false, specifications[`asset.create`].useTimestamp).then(
      function(res) {
        var formData = { ...self.props.formData };
        for (var key in autoObject.autoFillFields) {
          _.set(formData, key, _.get(res, autoObject.autoFillFields[key]));
        }
        self.props.setFormData(formData);

        if (formData.Asset.landDetails && formData.Asset.landDetails.length) {
          let area = 0;
          for (let i = 0; i < formData.Asset.landDetails.length; i++) {
            area += Number(formData.Asset.landDetails[i].area || 0);
          }

          self.props.handleChange({ target: { value: area } }, 'Asset.totalArea', false, '', '', '');
        }
      },
      function(err) {
        console.log(err);
      }
    );
  };

  makeAjaxCall = (formData, url) => {
    let self = this;
    //delete formData.ResponseInfo;
    Api.commonApiPost(url || self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].url, '', formData, '', true).then(
      function(response) {
        if(response && response.Assets && response.Assets[0]){
        const cacheKey =  self.props.moduleName + "." + response.Assets[0].id  + '.assetImmovable.search';
        "",		 +      window.sessionStorage.setItem(cacheKey,JSON.stringify(response));
      }
        self.props.setLoadingStatus('hide');
        self.initData();
        self.props.toggleSnackbarAndSetText(
          true,
          translate(self.props.actionName == 'create' ? 'wc.create.message.success' : 'wc.update.message.success'),
          true
        );
        setTimeout(function() {
          if (self.props.actionName == 'update') {
            var hash = '/non-framework/asset/master/assetImmovableView/' + response.Assets[0].id;
          }
          if (self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].idJsonPath) {
            if (self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].ackUrl) {
              var hash =
                self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].ackUrl +
                '/' +
                encodeURIComponent(_.get(response, self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].idJsonPath));
            } else {
              if (self.props.actionName == 'update') {
                var hash = '/non-framework/asset/master/assetImmovableView/' + response.Assets[0].id;
              } else {
                var hash = '/non-framework/asset/master/assetImmovableView/' + response.Assets[0].id;
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
    var flag = 0;
    var formData = JSON.parse(JSON.stringify(this.props.formData));
    if (formData.Asset && formData.Asset.landDetails && formData.Asset.landDetails.length>0) {
      for (var y = 0; y < formData.Asset.landDetails.length; y++) {
        formData.Asset.landDetails[y].tenantId = localStorage.getItem('tenantId');
        }
      //console.log(formData);
      for (var x = 0; x < formData.Asset.landDetails.length; x++) {
        var AutoCompleteData = _.get(formData, 'Asset.landDetails[' + x + '].code');
        var CheckAutoCompleteData = _.filter(self.props.dropDownData['Asset.landDetails[' + x + '].code'], { key: AutoCompleteData });
        if (CheckAutoCompleteData.length || formData.Asset.landDetails[x].code == '' || formData.Asset.landDetails[x].code == null) {
          if (formData.Asset.landDetails[x].code == '') {
            formData.Asset.landDetails.splice(x, 1);
            x--;
          }
          flag = 1;
        } else if (!CheckAutoCompleteData.length) {
          flag = 0;
          formData.Asset.landDetails[x].code = null;
          formData.Asset.landDetails[x] = null;
          self.props.toggleSnackbarAndSetText(true, 'Please Enter Valid Land Details', false, true);
          return;
        }
      }
    } else if (formData.Asset && (!formData.Asset.landDetails || (formData.Asset.landDetails && !formData.Asset.landDetails.length >0))) {
      //console.log(formData.Asset);
      flag = 1;
      formData.Asset.landDetails = null;
    }
    if (flag == 1) {
      self.props.setLoadingStatus('loading');

      // if (formData.Asset.titleDocumentsAvailable) {
      //   formData.Asset.titleDocumentsAvailable = formData.Asset.titleDocumentsAvailable.split(',');
      // } else {
      //   formData.Asset.titleDocumentsAvailable = [];
      // }
      if (formData.Asset.assetCategory.id) {
        formData.Asset.assetCategory = self.state.cateoryObject[formData.Asset.assetCategory.id];
      }

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

      //  var createCustomObject = [];
      var createCustomObject = this.props.formData.Asset.assetAttributesCheck;
      var assetAttributes = [];
      _.forEach(createCustomObject, function(value, key) {
        var tempFinObj = {};
        tempFinObj.key = key;
        var splitObject = value;
        _.forEach(splitObject, function(value, key) {
          tempFinObj.type = key;
          tempFinObj.value = value;

          // if(tempFinObj.type == "Select"){
          // }
        });
        assetAttributes.push(tempFinObj);
      });
      if (formData && formData.Asset && formData.Asset.fundSource) {
        if (formData.Asset.fundSource.code == null || formData.Asset.fundSource.code == '') {
          delete formData.Asset.fundSource;
        }
      }

      formData.Asset.assetAttributes = assetAttributes;
      delete formData.Asset.assetAttributesCheck;

      //Check if documents, upload and get fileStoreId
      if (
        formData[self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName]['documents'] &&
        formData[self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName]['documents'].length
      ) {
        let documents = [...formData[self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName]['documents']];
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
                formData[self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].objectName]['documents'] = _docs;
                self.makeAjaxCall(formData, _url);
              }
            }
          });
        }
      } else {
        self.makeAjaxCall(formData, _url);
      }
    } else {
      self.props.toggleSnackbarAndSetText(true, 'Please Enter Valid Land Details', false, true);
    }
  };

  getVal = (path, dateBool) => {
    var _val = _.get(this.props.formData, path);
    if (dateBool && typeof _val == 'string' && _val && _val.indexOf('-') > -1) {
      var _date = _val.split('-');
      return new Date(_date[0], Number(_date[1]) - 1, _date[2]);
    }
    if(path && path=="Asset.assetAttributesCheck.Location(Point to Point).GIS"){
      //console.log(_val);
      let value=[];
      if(_val){
      _val.map((val)=>{
        value.push(`{lat:${val.lat},lng:${val.lng}}`);
      });
      _val=value;
      if(_val && _val.length &&_val.length>5){
        //_val=_val.substring(0,300)+".......";
        _val.splice(5,_val.length-5,".........")
      }
    }
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

  warrantyFunction = _value => {
    let valueWarranty = _value;
    let self = this;
    let spec = self.props.mockData;

    for (var q = 0; q < spec[`asset.${self.state.action}`].groups.length; q++) {
      if (spec[`asset.${self.state.action}`].groups[q].name == 'AssetField') {
        for (var l = 0; l < spec[`asset.${self.state.action}`].groups[q].fields.length; l++) {
          if (spec[`asset.${self.state.action}`].groups[q].fields[l].name == 'WarrantyExpiryDate') {
            if (valueWarranty == false) {
              spec[`asset.${self.state.action}`].groups[q].fields[l].isRequired = false;
              self.props.delRequiredFields(['Asset.warrantyExpiryDate']);
              self.props.setMockData(JSON.parse(JSON.stringify(spec)));
            } else if (valueWarranty == true) {
              spec[`asset.${self.state.action}`].groups[q].fields[l].isRequired = true;
              self.props.addRequiredFields(['Asset.warrantyExpiryDate']);
              self.props.setMockData(JSON.parse(JSON.stringify(spec)));
            }
          }
        }
      }
    }
  };

  affectDependants = (obj, e, property) => {
    let { handleChange, setDropDownData } = this.props;
    let { getVal, getValFromDropdownData } = this;

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
          let exp = value.valExp;
          if (dependantIdx) {
            value.jsonPath = replaceLastIdxOnJsonPath(value.jsonPath, dependantIdx);
            exp = exp && exp.replace(/\*/g, dependantIdx);
          }
          let object = {
            target: {
              value: (exp && eval(exp)) || eval(eval(value.pattern)),
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

  handleChange = (e, property, isRequired, pattern, requiredErrMsg = 'Required', patternErrMsg = 'Pattern Missmatch', expression, expErr, isDate) => {
    let { getVal } = this;
    let self = this;
    let { handleChange, mockData, setDropDownData, formData } = this.props;
    let hashLocation = window.location.hash;
    let obj = specifications[`asset.create`];

    if (property == 'Asset.location') {
      if (e.target.value != null) {
        self.handleChange({ target: { value: e.target.value } }, 'Asset.address');
      }
    }
var CheckAutoCompleteData=[];
    if (formData && formData.Asset && formData.Asset.landDetails) {
      for (var i = 0; i < formData.Asset.landDetails.length; i++) {
        if (property == 'Asset.landDetails[' + i + '].code') {
        CheckAutoCompleteData = _.filter(self.props.dropDownData['Asset.landDetails[' + i + '].code'], { key: e.target.value });
          if (e.target.value == null || e.target.value == '' || !CheckAutoCompleteData.length) {
            self.handleChange({ target: { value: " " } }, 'Asset.landDetails[' + i + '].surveyNo');
            self.handleChange({ target: { value: null } }, 'Asset.landDetails[' + i + '].area');
            }
            else{
              //console.log(formData.Asset.landDetails[i]);
                formData.Asset.landDetails[i].isEnabled = true;
            }
        }
      }
    }

    if (property == 'Asset.assetCategory.id') {
      if (self.state.depericiationValue[e.target.value]) {
        var newVal = Math.round(100 / self.state.depericiationValue[e.target.value]);
        this.props.handleChange({ target: { value: newVal } }, 'Asset.anticipatedLife', true, '', '', '');
      }
      self.customFieldDataFun(self.state.customFieldsGen[e.target.value]);
    }

    if (property == 'Asset.assetAttributesCheck.Layer Type.Select') {
      for (var i = 0; i < groups[0].fields.length; i++) {
        if ('Asset.assetAttributesCheck.Layer description(Graphical Representation Of Layers).image' == groups[0].fields[i].jsonPath) {
          groups[0].fields[i].imagePath = this.state.layerData[e.target.value].description;
          self.setState({
            hide: false,
          });
        }
      }

      self.props.handleChange(
        { target: { value: this.state.layerData[e.target.value].description } },
        'Asset.assetAttributesCheck.Layer description(Graphical Representation Of Layers).image',
        false,
        '',
        '',
        ''
      );
      self.props.handleChange(
        {
          target: {
            value: this.state.layerData[e.target.value].numberOfLayers,
          },
        },
        'Asset.assetAttributesCheck.No. Of Layers.Number',
        false,
        '',
        '',
        ''
      );
      self.props.handleChange(
        { target: { value: this.state.layerData[e.target.value].layerSize } },
        'Asset.assetAttributesCheck.Layer Size.Number',
        false,
        '',
        '',
        ''
      );
    }

    if (/Asset\.landDetails\[\d{1,2}\]\.code/.test(property)) {
      let SubProperty = property.split('.');
      SubProperty.pop();
      SubProperty = SubProperty.join('.');
      var _val = e.target.value;
      Api.commonApiPost('/asset-services-maha/assets/_search', { name: _val }, {}, false, false, false, '', '', false).then(
        function(response) {
          if (response && response.Assets && response.Assets[0] && response.Assets[0].assetAttributes) {
            if(CheckAutoCompleteData.length){
            for (var i = 0; i < response.Assets[0].assetAttributes.length; i++) {
              if (response.Assets[0].assetAttributes[i].key == 'Survey Number') {
                var _surveyNo = response.Assets[0].assetAttributes[i].value;
                self.props.handleChange({ target: { value: _surveyNo } }, SubProperty + '.surveyNo', false, '', '', '');
              } else if (response.Assets[0].assetAttributes[i].key == 'Area of Land') {
                var _area = response.Assets[0].assetAttributes[i].value;
                self.props.handleChange({ target: { value: _area } }, SubProperty + '.area', false, '', '', '');
              }
            }
          }

            setTimeout(function() {
              if (self.props.formData.Asset.landDetails && self.props.formData.Asset.landDetails.length) {
                let area = 0;
                for (let i = 0; i < self.props.formData.Asset.landDetails.length; i++) {
                  area += Number(self.props.formData.Asset.landDetails[i].area || 0);
                }
                self.props.handleChange({ target: { value: area } }, 'Asset.totalArea', false, '', '', '');
              }
            }, 500);
          }
        },
        function(err) {
          console.log(err);
        }
      );
    }

    if (property == 'Asset.warrantyAvailable') {
      self.warrantyFunction(e.target.value);
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

    this.checkIfHasShowHideFields(property, e.target.value);
    this.checkIfHasEnDisFields(property, e.target.value);
    handleChange(e, property, isRequired, pattern, requiredErrMsg, patternErrMsg);
    this.affectDependants(obj, e, property);
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
              var ind = j - 1 || 0;
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
    let {
      setMockData,
      moduleName,
      actionName,
      setFormData,
      delRequiredFields,
      addRequiredFields
    } = this.props;
    let _formData = { ...this.props.formData };
    let self = this;
    let mockData = { ...this.props.mockData };
    let notReqFields = [];
    let ReqFields = [];
    //console.log(jsonPath);
    if (!jsonPath) {
      var ind = 0;

      for (
        let i = 0;
        i < mockData[moduleName + "." + actionName].groups.length;
        i++
      ) {
        if (
          index == i &&
          groupName == mockData[moduleName + "." + actionName].groups[i].name
        ) {
          //console.log(mockData[moduleName + "." + actionName].groups[i].index);
          // console.log(
          //   mockData[moduleName + "." + actionName].groups.filter(
          //     group => group.name === groupName
          //   ).length - 1
          // );
          /* Check for last card --> Set Form Data --> Splice the groups array. */
          if (
            mockData[moduleName + "." + actionName].groups[i].index ===
            mockData[moduleName + "." + actionName].groups.filter(
              group => group.name === groupName
            ).length -
            1
          ) {
            // console.log(mockData[moduleName + '.' + actionName].groups[i].jsonPath);
            // console.log(_formData);
            if (
              _.get(
                _formData,
                mockData[moduleName + "." + actionName].groups[i].jsonPath
              )
            ) {
              var grps = [
                ..._.get(
                  _formData,
                  mockData[moduleName + "." + actionName].groups[i].jsonPath
                )
              ];
              //console.log(mockData[moduleName + "." + actionName].groups[i].index-1);
              // console.log(mockData[moduleName + "." + actionName].groups);
              grps.splice(
                mockData[moduleName + "." + actionName].groups[i].index,
                1
              );
              _.set(
                _formData,
                mockData[moduleName + "." + actionName].groups[i].jsonPath,
                grps
              );
              // console.log(_formData);
              setFormData(_formData);

              for (
                var k = 0;
                k <
                mockData[moduleName + "." + actionName].groups[i].fields.length;
                k++
              ) {
                if (
                  mockData[moduleName + "." + actionName].groups[i].fields[k]
                    .isRequired
                )
                  notReqFields.push(
                    mockData[moduleName + "." + actionName].groups[i].fields[k]
                      .jsonPath
                  );
              }

              delRequiredFields(notReqFields);

              /* Reduce Index Value */
              mockData[moduleName + "." + actionName].groups[i].index -= 1;
              /* And then splice at the end */
              mockData[moduleName + "." + actionName].groups.splice(i, 1);

              break;
            } else {
              /* Check for no json path in formData --> Splice mockData to remove the card */
              mockData[moduleName + "." + actionName].groups.splice(i, 1);
              break;
            }
          }
          /* Check for any other card --> Splice the array --> Create the form data --> Set form data */
          else {

            for (let i = 0; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
              for (var k = 0; k < mockData[moduleName + '.' + actionName].groups[i].fields.length; k++) {
                if (mockData[moduleName + '.' + actionName].groups[i].fields[k].isRequired)
                  notReqFields.push(mockData[moduleName + '.' + actionName].groups[i].fields[k].jsonPath);
              }
              delRequiredFields(notReqFields);
            }

            for (let i = 0; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
              if (index == i && groupName == mockData[moduleName + '.' + actionName].groups[i].name) {
                ind = i;
                mockData[moduleName + '.' + actionName].groups.splice(i, 1);
                break;
              }
            }



            for (let i = ind; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
              if (mockData[moduleName + '.' + actionName].groups[i].name == groupName) {
                var regexp = new RegExp(
                  mockData[moduleName + "." + actionName].groups[i].jsonPath
                    .replace(/\[/g, "\\[")
                    .replace(/\]/g, "\\]") + "\\[\\d{1}\\]",
                  "g"
                );
                //console.log(regexp);
                //console.log(mockData[moduleName + "." + actionName].groups[i].index);
                //console.log(mockData[moduleName + "." + actionName].groups[i].index);
                var stringified = JSON.stringify(mockData[moduleName + '.' + actionName].groups[i]);
                mockData[moduleName + '.' + actionName].groups[i] = JSON.parse(
                  stringified.replace(
                    regexp,
                    mockData[moduleName + "." + actionName].groups[i].jsonPath +
                    "[" +
                    (mockData[moduleName + "." + actionName].groups[i].index -
                      1) +
                    "]"
                  )
                );
              }
            }

            //console.log(mockData[moduleName + '.' + actionName].groups);

            for (let i = index; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
              if (mockData[moduleName + '.' + actionName].groups[i].name == groupName) {

                if (
                  _.get(
                    _formData,
                    mockData[moduleName + "." + actionName].groups[i].jsonPath
                  )
                ) {
                  var grps = [
                    ..._.get(
                      _formData,
                      mockData[moduleName + "." + actionName].groups[i].jsonPath
                    )
                  ];
                  //console.log(mockData[moduleName + "." + actionName].groups[i].index-1);
                  //console.log(mockData[moduleName + "." + actionName].groups);
                  grps.splice(mockData[moduleName + '.' + actionName].groups[i].index - 1, 1);

                  _.set(_formData, mockData[moduleName + '.' + actionName].groups[i].jsonPath, grps);
                  //console.log(_formData);
                  setFormData(_formData);

                  // Reduce index values
                  for (let k = ind; k < mockData[moduleName + '.' + actionName].groups.length; k++) {
                    if (mockData[moduleName + '.' + actionName].groups[k].name == groupName) {
                      mockData[moduleName + '.' + actionName].groups[k].index -= 1;
                    }
                  }
                  break;
                }
              }
            }
            for (let i = 0; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
              for (var k = 0; k < mockData[moduleName + '.' + actionName].groups[i].fields.length; k++) {
                if (mockData[moduleName + '.' + actionName].groups[i].fields[k].isRequired &&
                !mockData[moduleName + '.' + actionName].groups[i].fields[k].hide){
                  ReqFields.push(mockData[moduleName + '.' + actionName].groups[i].fields[k].jsonPath);
                }
              }
              addRequiredFields(ReqFields);
            }
          }
        }
      }

      //console.log(notReqFields);
      //console.log(mockData);
      setMockData(mockData);
    } else {
      var _groups = _.get(
        mockData[moduleName + "." + actionName],
        self.getPath(jsonPath)
      );
      _groups.splice(index, 1);
      var regexp = new RegExp("\\[\\d{1}\\]", "g");
      for (var i = index; i < _groups.length; i++) {
        var stringified = JSON.stringify(_groups[i]);
        _groups[i] = JSON.parse(stringified.replace(regexp, "[" + i + "]"));
      }

      _.set(mockData, self.getPath(jsonPath), _groups);
      setMockData(mockData);
    }
  };
  // removeCard = (jsonPath, index, groupName) => {
  //   //Remove at that index and update upper array values
  //   let { setMockData, moduleName, actionName, setFormData, delRequiredFields } = this.props;
  //   let _formData = { ...this.props.formData };
  //   let self = this;
  //   let mockData = { ...this.props.mockData };
  //   let notReqFields = [];
  //
  //   if (!jsonPath) {
  //     var ind = 0;
  //     for (let i = 0; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
  //       if (index == i && groupName == mockData[moduleName + '.' + actionName].groups[i].name) {
  //         mockData[moduleName + '.' + actionName].groups.splice(i, 1);
  //         ind = i;
  //         for (var k = 0; k < mockData[moduleName + '.' + actionName].groups[ind].fields.length; k++) {
  //           if (mockData[moduleName + '.' + actionName].groups[ind].fields[k].isRequired)
  //             notReqFields.push(mockData[moduleName + '.' + actionName].groups[ind].fields[k].jsonPath);
  //         }
  //         delRequiredFields(notReqFields);
  //         break;
  //       }
  //     }
  //
  //     for (let i = ind; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
  //       if (mockData[moduleName + '.' + actionName].groups[i].name == groupName) {
  //         var regexp = new RegExp(
  //           mockData[moduleName + '.' + actionName].groups[i].jsonPath.replace(/\[/g, '\\[').replace(/\]/g, '\\]') + '\\[\\d{1}\\]',
  //           'g'
  //         );
  //         var stringified = JSON.stringify(mockData[moduleName + '.' + actionName].groups[i]);
  //         mockData[moduleName + '.' + actionName].groups[i] = JSON.parse(
  //           stringified.replace(
  //             regexp,
  //             mockData[moduleName + '.' + actionName].groups[i].jsonPath + '[' + (mockData[moduleName + '.' + actionName].groups[i].index - 1) + ']'
  //           )
  //         );
  //
  //         if (_.get(_formData, mockData[moduleName + '.' + actionName].groups[i].jsonPath)) {
  //           var grps = [..._.get(_formData, mockData[moduleName + '.' + actionName].groups[i].jsonPath)];
  //           grps.splice(mockData[moduleName + '.' + actionName].groups[i].index - 1, 1);
  //           _.set(_formData, mockData[moduleName + '.' + actionName].groups[i].jsonPath, grps);
  //           setFormData(_formData);
  //
  //           //Reduce index values
  //           for (let k = ind; k < mockData[moduleName + '.' + actionName].groups.length; k++) {
  //             if (mockData[moduleName + '.' + actionName].groups[k].name == groupName) {
  //               mockData[moduleName + '.' + actionName].groups[k].index -= 1;
  //             }
  //           }
  //           break;
  //         }
  //       }
  //     }
  //     setMockData(mockData);
  //   } else {
  //     var _groups = _.get(mockData[moduleName + '.' + actionName], self.getPath(jsonPath));
  //     _groups.splice(index, 1);
  //     var regexp = new RegExp('\\[\\d{1}\\]', 'g');
  //     for (var i = index; i < _groups.length; i++) {
  //       var stringified = JSON.stringify(_groups[i]);
  //       _groups[i] = JSON.parse(stringified.replace(regexp, '[' + i + ']'));
  //     }
  //
  //     _.set(mockData, self.getPath(jsonPath), _groups);
  //     setMockData(mockData);
  //   }
  // };

  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors, isFormValid } = this.props;
    let { create, handleChange, getVal, addNewCard, removeCard, autoComHandler } = this;
    let customActionsAndUrl =
      !_.isEmpty(mockData[`${moduleName}.${actionName}`]) && mockData[`${moduleName}.${actionName}`].hasOwnProperty('customActionsAndUrl')
        ? mockData[`${moduleName}.${actionName}`]['customActionsAndUrl'][0].url
        : '';
    let self = this;
    //  {formData && formData.hasOwnProperty("Asset") && formData.Asset.hasOwnProperty("assetAttributes") && formData.Asset.assetAttributes.map((item,index)=>{
    // })}
    if (formData && formData.Asset && formData.Asset.landDetails) {
      for (var y = 0; y < formData.Asset.landDetails.length; y++) {
        formData.Asset.landDetails[y].isEnabled = true;
      }
    }
    //code to make the asset sub type disabled in update screen
        //console.log(`${moduleName}.${actionName}`);
        if(`${moduleName}.${actionName}` == "asset.update"){
          if(mockData &&  mockData[`${moduleName}.${actionName}`] && mockData[`${moduleName}.${actionName}`].groups
          && mockData[`${moduleName}.${actionName}`].groups[0].fields){
            //console.log(mockData[`${moduleName}.${actionName}`]);
            for(let i=0;i<mockData[`${moduleName}.${actionName}`].groups[0].fields.length;i++){
              //console.log(i);
              //console.log(mockData[`${moduleName}.${actionName}`].groups[0].fields[i].jsonPath);
              if(mockData[`${moduleName}.${actionName}`].groups[0].fields[i].jsonPath == "Asset.assetCategory.id"){
                //console.log(mockData[`${moduleName}.${actionName}`].groups[0].fields[i].jsonPath);
                mockData[`${moduleName}.${actionName}`].groups[0].fields[i].isDisabled=true;
                break;
              }

            }
          }
        }


    //console.log(formData);
    return (
      <div className="Report">
        <form
          onSubmit={e => {
            create(e);
          }}
        >
          <Row>
            <Col xs={6} md={6}>
              <div
                style={{
                  marginLeft: '16px',
                }}
              >
                <UiBackButton customUrl={customActionsAndUrl} />
              </div>
            </Col>
            <Col xs={6} md={6}>
              <div style={{ textAlign: 'right', marginRight: '16px' }}>
                <RaisedButton
                  icon={
                    <i style={{ color: 'black' }} className="material-icons">
                      backspace
                    </i>
                  }
                  label="Reset"
                  primary={false}
                  onClick={() => {
                    this.initData();
                  }}
                />{' '}
                &nbsp;&nbsp;
                {actionName == 'create' && (
                  <UiButton
                    item={{
                      label: 'Save',
                      uiType: 'submit',
                      isDisabled: isFormValid ? false : true,
                    }}
                    icon={
                      <i style={{ color: 'white' }} className="material-icons">
                        save
                      </i>
                    }
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
                    icon={
                      <i style={{ color: 'white' }} className="material-icons">
                        update
                      </i>
                    }
                    ui="google"
                  />
                )}
              </div>
            </Col>
          </Row>
          {!_.isEmpty(mockData) &&
            moduleName &&
            actionName &&
            mockData[`${moduleName}.${actionName}`] && (
              <div>
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
                  formData={formData}
                  edit={true}
                  />
                {!this.state.hide ? (
                  <ShowFields
                    groups={groups}
                    noCols={mockData[`${moduleName}.${actionName}`].numCols}
                    ui="google"
                    handler={handleChange}
                    getVal={getVal}
                    fieldErrors={fieldErrors}
                    useTimestamp={mockData[`${moduleName}.${actionName}`].useTimestamp || false}
                    addNewCard={addNewCard}
                    removeCard={removeCard}
                    autoComHandler={autoComHandler}
                    formData={formData}
                    edit={true}
                  />
                ) : (
                  ''
                )}

                <Card className="uiCard">
                  <CardText>
                    <Grid fluid>
                      <SelectField
                        className="custom-form-control-for-select"
                        floatingLabelStyle={{
                          color: '#696969',
                          fontSize: '20px',
                          'white-space': 'nowrap',
                        }}
                        labelStyle={{ color: '#5F5C57' }}
                        floatingLabelFixed={true}
                        dropDownMenuProps={{

                          targetOrigin: {
                            horizontal: 'left',
                            vertical: 'bottom',
                          },
                        }}
                        style={{ display: 'inline-block' }}
                        errorStyle={{ float: 'left' }}
                        fullWidth={true}
                        hintText="Please Select"
                        floatingLabelText={
                          <span>
                            {translate('ac.create.Asset.account.code')}{' '}
                            <span style={{ color: '#FF0000' }}>{self.props.requiredFields.indexOf('Asset.assetAccount') > -1 ? ' *' : ''}</span>
                          </span>
                        }
                        value={this.getVal('Asset.assetAccount')}
                        onChange={(event, key, value) => {
                          this.handleChange(
                            { target: { value: value } },
                            'Asset.assetAccount',
                            self.props.requiredFields.indexOf('Asset.assetAccount') > -1 ? true : false,
                            '',
                            false,
                            false,
                            false,
                            false,
                            false
                          );
                        }}
                        maxHeight={200}
                      >
                        {self.props.dropDownData &&
                          self.props.dropDownData.hasOwnProperty('Asset.assetAccount') &&
                          self.props.dropDownData['Asset.assetAccount'].map((dd, index) => (
                            <MenuItem value={dd.key} key={index} primaryText={dd.value} />
                          ))}
                      </SelectField>

                      <SelectField
                        className="custom-form-control-for-select"
                        floatingLabelStyle={{
                          color: '#696969',
                          fontSize: '20px',
                          'white-space': 'nowrap',
                        }}
                        labelStyle={{ color: '#5F5C57' }}
                        floatingLabelFixed={true}
                        dropDownMenuProps={{

                          targetOrigin: {
                            horizontal: 'left',
                            vertical: 'bottom',
                          },
                        }}
                        style={{ display: 'inline-block' }}
                        errorStyle={{ float: 'left' }}
                        fullWidth={true}
                        hintText="Please Select"
                        floatingLabelText={
                          <span>
                            {translate('ac.create.Accumulated.Depreciation.Account')}{' '}
                            <span style={{ color: '#FF0000' }}>
                              {self.props.requiredFields.indexOf('Asset.accumulatedDepreciationAccount') > -1 ? ' *' : ''}
                            </span>
                          </span>
                        }
                        value={this.getVal('Asset.accumulatedDepreciationAccount')}
                        onChange={(event, key, value) => {
                          this.handleChange(
                            { target: { value: value } },
                            'Asset.accumulatedDepreciationAccount',
                            self.props.requiredFields.indexOf('Asset.accumulatedDepreciationAccount') > -1 ? true : false,
                            '',
                            false,
                            false,
                            false,
                            false
                          );
                        }}
                        maxHeight={200}
                      >
                        {self.props.dropDownData &&
                          self.props.dropDownData.hasOwnProperty('Asset.accumulatedDepreciationAccount') &&
                          self.props.dropDownData['Asset.accumulatedDepreciationAccount'].map((dd, index) => (
                            <MenuItem value={dd.key} key={index} primaryText={dd.value} />
                          ))}
                      </SelectField>

                      <SelectField
                        className="custom-form-control-for-select"
                        floatingLabelStyle={{
                          color: '#696969',
                          fontSize: '20px',
                          'white-space': 'nowrap',
                        }}
                        labelStyle={{ color: '#5F5C57' }}
                        floatingLabelFixed={true}
                        dropDownMenuProps={{

                          targetOrigin: {
                            horizontal: 'left',
                            vertical: 'bottom',
                          },
                        }}
                        style={{ display: 'inline-block' }}
                        errorStyle={{ float: 'left' }}
                        fullWidth={true}
                        hintText="Please Select"
                        floatingLabelText={
                          <span>
                            {translate('ac.create.Revaluation.Reserve.Account')}{' '}
                            <span style={{ color: '#FF0000' }}>
                              {self.props.requiredFields.indexOf('Asset.revaluationReserveAccount') > -1 ? ' *' : ''}
                            </span>
                          </span>
                        }
                        value={this.getVal('Asset.revaluationReserveAccount')}
                        onChange={(event, key, value) => {
                          this.handleChange(
                            { target: { value: value } },
                            'Asset.revaluationReserveAccount',
                            self.props.requiredFields.indexOf('Asset.revaluationReserveAccount') > -1 ? true : false,
                            '',
                            false,
                            false,
                            false,
                            false,
                            false
                          );
                        }}
                        maxHeight={200}
                      >
                        {self.props.dropDownData &&
                          self.props.dropDownData.hasOwnProperty('Asset.revaluationReserveAccount') &&
                          self.props.dropDownData['Asset.revaluationReserveAccount'].map((dd, index) => (
                            <MenuItem value={dd.key} key={index} primaryText={dd.value} />
                          ))}
                      </SelectField>

                      <SelectField
                        className="custom-form-control-for-select"
                        floatingLabelStyle={{
                          color: '#696969',
                          fontSize: '20px',
                          'white-space': 'nowrap',
                        }}
                        labelStyle={{ color: '#5F5C57' }}
                        floatingLabelFixed={true}
                        dropDownMenuProps={{

                          targetOrigin: {
                            horizontal: 'left',
                            vertical: 'bottom',
                          },
                        }}
                        style={{ display: 'inline-block' }}
                        errorStyle={{ float: 'left' }}
                        fullWidth={true}
                        hintText="Please Select"
                        floatingLabelText={
                          <span>
                            {translate('ac.create.Depreciation.Expenses.Account')}{' '}
                            <span style={{ color: '#FF0000' }}>
                              {self.props.requiredFields.indexOf('Asset.depreciationExpenseAccount') > -1 ? ' *' : ''}
                            </span>
                          </span>
                        }
                        value={this.getVal('Asset.depreciationExpenseAccount')}
                        onChange={(event, key, value) => {
                          this.handleChange(
                            { target: { value: value } },
                            'Asset.depreciationExpenseAccount',
                            self.props.requiredFields.indexOf('Asset.depreciationExpenseAccount') > -1 ? true : false,
                            '',
                            false,
                            false,
                            false,
                            false,
                            false
                          );
                        }}
                        maxHeight={200}
                      >
                        {self.props.dropDownData &&
                          self.props.dropDownData.hasOwnProperty('Asset.depreciationExpenseAccount') &&
                          self.props.dropDownData['Asset.depreciationExpenseAccount'].map((dd, index) => (
                            <MenuItem value={dd.key} key={index} primaryText={dd.value} />
                          ))}
                      </SelectField>
                    </Grid>
                  </CardText>
                </Card>
              </div>
            )}
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
  dropDownData: state.framework.dropDownData,
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

export default connect(mapStateToProps, mapDispatchToProps)(assetImmovableCreate);
