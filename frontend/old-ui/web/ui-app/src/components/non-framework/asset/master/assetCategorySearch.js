import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import _ from 'lodash';
import ShowFields from '../../../framework/showFields';

import { translate } from '../../../common/common';
import Api from '../../../../api/api';
import UiButton from '../../../framework/components/UiButton';
import UiAddButton from '../../../framework/components/UiAddButton';
import UiDynamicTable from '../../../framework/components/UiDynamicTable';
import { fileUpload, getInitiatorPosition } from '../../../framework/utility/utility';
import UiTable from '../../../framework/components/UiTable';
import jp from 'jsonpath';

var specifications = {};

let reqRequired = [];
class assetCategorySearch extends Component {
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
        disableRowClick: false,
      },
      values: [],
      selectedRecordId: '',
    };
  }

  setLabelAndReturnRequired(configObject) {
    if (configObject && configObject.groups) {
      for (var i = 0; i < configObject.groups.length; i++) {
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

  getVal = path => {
    return typeof _.get(this.props.formData, path) != 'undefined' ? _.get(this.props.formData, path) : '';
  };

  initData() {
    // let hashLocation = window.location.hash;
    try {
      // var hash = window.location.hash.split("/");
      // if(hash.length == 4 && hashLocation.split("/")[1]!="transaction") {
      //   specifications = require(`./specs/${hash[2]}/${hash[2]}`).default;
      // } else if(hashLocation.split("/")[1]!="transaction"){
      //   specifications = require(`./specs/${hash[2]}/master/${hash[3]}`).default;
      // } else {
      //   specifications = require(`./specs/${hash[2]}/transaction/${hash[3]}`).default;
      // }
      specifications = require(`../../../framework/specs/asset/master/createAssetCategroy`).default;
    } catch (e) {}
    let { setMetaData, setModuleName, setActionName, initForm, setMockData, setFormData } = this.props;
    let obj = specifications[`asset.search`];
    reqRequired = [];
    this.setLabelAndReturnRequired(obj);
    initForm(reqRequired);
    setMetaData(specifications);
    window.localStorage.setItem('specifications', JSON.stringify(specifications));
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('asset');
    setActionName('search');
    var formData = {};
    if (obj && obj.groups && obj.groups.length) this.setDefaultValues(obj.groups, formData);
    setFormData(formData);
    this.setState({
      pathname: this.props.history.location.pathname,
      showResult: false,
    });
  }

  componentDidMount() {
    // this.props.resetDropdownData();
    console.log("hello");
    this.initData();
    this.hasReturnUrl();
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.pathname && this.state.pathname != nextProps.history.location.pathname) {
      // this.props.resetDropdownData();
      console.log("hi");
      this.initData();
    }
  }

  hasReturnUrl() {
    let { search } = this;
    if (localStorage.getItem('returnUrl')) {
      search(null, true);
    }
  }

  search = (e = null, hasDefaultSearch = false) => {
    if (e) {
      e.preventDefault();
    }

    let self = this;
    self.props.setLoadingStatus('loading');
    var formData = { ...this.props.formData };
    if (hasDefaultSearch) {
      formData = window.localStorage.getItem('formData') && JSON.parse(window.localStorage.getItem('formData')) || {};
      this.props.setFormData(formData);
    }
    for (var key in formData) {
      if (formData[key] == '' || typeof formData[key] == 'undefined') delete formData[key];
    }

    var specifications = JSON.parse(window.localStorage.getItem('specifications'));
    var currentSpecification = specifications[`${self.props.match.params.moduleName}.${self.props.match.path.split('/')[1]}`];
    let { getVal, getValFromDropdownData } = self;
    var result1 = specifications['asset.search'];
    var result2 = result1['result'];
    if (formData && formData.name) {
      var _body = {
        MdmsCriteria: {
          tenantId: localStorage.getItem('tenantId'),
          moduleDetails: [
            {
              moduleName: 'ASSET',
              masterDetails: [
                {
                  name: 'AssetCategory',
                  filter: '[?(@.assetCategoryType IN [' + formData.assetCategoryType + ']' + '&& @.name IN [' + formData.name + '])]',
                },
              ],
            },
          ],
        },
      };
    } else if (formData && formData.assetCategoryType) {
      var _body = {
        MdmsCriteria: {
          tenantId: localStorage.getItem('tenantId'),
          moduleDetails: [
            {
              moduleName: 'ASSET',
              masterDetails: [
                {
                  name: 'AssetCategory',
                  filter: '[?(@.assetCategoryType IN [' + formData.assetCategoryType + '])]',
                },
              ],
            },
          ],
        },
      };
    } else {
      var _body = {
        MdmsCriteria: {
          tenantId: localStorage.getItem('tenantId'),
          moduleDetails: [
            {
              moduleName: 'ASSET',
              masterDetails: [
                {
                  name: 'AssetCategory'
                },
              ],
            },
          ],
        },
      };
    }

    console.log(_body);
    Api.commonApiPost('/egov-mdms-service/v1/_search', '', _body, {}, true, true).then(
      function(res) {
        self.props.setLoadingStatus('hide');
        console.log(res);
        console.log(currentSpecification);
        var result = result2;

        var resultList = {
          resultHeader: [{ label: 'Sr.No.' }, ...result.header],
          resultValues: [],
          disableRowClick: result.disableRowClick || false,
        };
        var specsValuesList = result.values;
        var values = _.get(res, result.resultPath);
        if (values && values.length) {
          for (var i = 0; i < values.length; i++) {
            var tmp = [i + 1];
            for (var j = 0; j < specsValuesList.length; j++) {
              let valuePath = specsValuesList[j];
              if (typeof valuePath === 'object' && valuePath.valExp) {
                tmp.push(eval(valuePath.valExp));
                continue;
              }
              if (typeof valuePath === 'object' && valuePath.isObj) {
                var childArray = [];
                if (valuePath.childArray && valuePath.childArray.length > 0) {
                  for (var k = 0; k < valuePath.childArray.length; k++) {
                    childArray.push(_.get(values[i], valuePath.childArray[k]));
                  }
                }

                tmp.push(childArray);
                continue;
              }
              // if ((resultList.resultHeader[j].label.search("Date")>-1 || resultList.resultHeader[j].label.search("date")>-1)  && !(specsValuesList[j].search("-")>-1)) {
              //   tmp.push(new Date(_.get(values[i],specsValuesList[j])).getDate()+"/"+new Date(_.get(values[i],specsValuesList[j])).getMonth()+"/"+new Date(_.get(values[i],specsValuesList[j])).getFullYear());
              // } else {
              tmp.push(_.get(values[i], valuePath));
              // }
            }
            resultList.resultValues.push(tmp);
            console.log(resultList);
          }
        }
        if (result.isAction) {
          resultList.actionItems = result.actionItems;
        }
        self.setState({
          resultList,
          values,
          showResult: true,
        });

        self.props.setFlag(1);

        window.localStorage.setItem('formData', '');
        window.localStorage.setItem('returnUrl', '');
      },
      function(err) {
        self.props.toggleSnackbarAndSetText(true, err.message, false, true);
        self.props.setLoadingStatus('hide');
      }
    );
  };

  getVal = path => {
    return _.get(this.props.formData, path) || '';
  };

  getValFromDropdownData = (fieldJsonPath, key, path) => {
    let dropdownData = this.props.dropDownData[fieldJsonPath] || [];
    let _val;
    if (!key) {
      _val = undefined;
    } else {
      _val = _.get(dropdownData.find(data => data.key == key) || [], path);
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
    let obj = specifications[`asset.search`];
    // console.log(obj);
    let depedants = jp.query(obj, `$.groups..fields[?(@.jsonPath=="${property}")].depedants.*`);
    this.checkIfHasShowHideFields(property, e.target.value);
    handleChange(e, property, isRequired, pattern, requiredErrMsg, patternErrMsg);

    _.forEach(depedants, function(value, key) {
      if (value.type == 'dropDown') {
        if (e.target.value) {
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
              // if(queryStringObject[i].split("=")[1].startsWith("^")){
              //   id[queryStringObject[i].split("=")[0]]=queryStringObject[i].split("=")[1].replace(/\^/, "");
              //   continue;
              // }
              if (queryStringObject[i].split('=')[1].search('{') > -1) {
                if (
                  queryStringObject[i]
                    .split('=')[1]
                    .split('{')[1]
                    .split('}')[0] == property
                ) {
                  console.log(
                    'replacing!!!',
                    queryStringObject[i].split('=')[1],
                    queryStringObject[i].split('=')[1].replace(/\{(.*?)\}/, e.target.value)
                  );
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
                dropDownData.unshift({
                  key: null,
                  value: '-- Please Select --',
                });
                setDropDownData(value.jsonPath, dropDownData);
              }
            },
            function(err) {
              console.log(err);
            }
          );
          // console.log(id);
          // console.log(context);
        } else {
          setDropDownData(value.jsonPath, []);
        }
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
  rowButtonClickHandler = (buttonUrl, id) => {
    let { formData } = this.props;
    if (id) {
      localStorage.setItem('returnUrl', window.location.hash.split('#/')[1]);
      localStorage.setItem('formData', JSON.stringify(formData));
      this.props.setRoute(buttonUrl + id);
    } else {
      let { selectedRecordId } = this.state;
      if (selectedRecordId) {
        localStorage.setItem('returnUrl', window.location.hash.split('#/')[1]);
        localStorage.setItem('formData', JSON.stringify(formData));
        this.props.setRoute(buttonUrl + selectedRecordId);
      }
    }
  };
  rowCheckboxClickHandler = code => {
    this.setState({
      selectedRecordId: code,
    });
  };

  rowClickHandler = index => {
    let { formData } = this.props;
    var value = this.state.values[index];
    var _url =
      window.location.hash.split('/').indexOf('update') > -1
        ? this.props.metaData[`${this.props.moduleName}.${this.props.actionName}`].result.rowClickUrlUpdate
        : this.props.metaData[`${this.props.moduleName}.${this.props.actionName}`].result.rowClickUrlView;

    //======================Check if direct URL or array====================>>
    if (typeof _url == 'object') {
      let isMatchFound = false;
      for (var i = 0; i < _url.multiple.length; i++) {
        var _key = _url.multiple[i].ifValue.split('=')[0];
        var _value = _url.multiple[i].ifValue.split('=')[1];
        if (_.get(value, _key) === _value) {
          _url = _url.multiple[i].goto;
          isMatchFound = true;
          break;
        }
      }
      if (!isMatchFound) _url = _url.default;
    }

    console.log(formData);
    localStorage.setItem('formData', JSON.stringify(formData));
    localStorage.setItem('returnUrl', window.location.hash.split('#/')[1]);

    //======================================================================>>
    if (_url.indexOf('?') > -1) {
      var url = _url.split('?')[0];
      var query = _url.split('?')[1];
      var params = query.indexOf('&') > -1 ? query.split('&') : [query];
      var queryString = '?';
      for (var i = 0; i < params.length; i++) {
        queryString +=
          (i > 0 ? '&' : '') +
          params[i].split('=')[0] +
          '=' +
          (/\{/.test(params[i])
            ? encodeURIComponent(
                _.get(
                  value,
                  params[i]
                    .split('=')[1]
                    .split('{')[1]
                    .split('}')[0]
                )
              )
            : params[i].split('=')[1]);
      }
      var key = url.split('{')[1].split('}')[0];
      url = url.replace('{' + key + '}', encodeURIComponent(_.get(value, key)));
      this.props.setRoute(url + queryString);
    } else {
      var key = _url.split('{')[1].split('}')[0];
      _url = _url.replace('{' + key + '}', encodeURIComponent(_.get(value, key)));
      this.props.setRoute(_url);
    }
  };

  rowIconClickHandler = (index, action) => {
    let { formData } = this.props;
    var value = this.state.values[index];
    var _url =
      action == 'update'
        ? this.props.metaData[`${this.props.moduleName}.${this.props.actionName}`].result.rowClickUrlUpdate
        : this.props.metaData[`${this.props.moduleName}.${this.props.actionName}`].result.rowClickUrlView;

    //======================Check if direct URL or array====================>>
    if (typeof _url == 'object') {
      let isMatchFound = false;
      for (var i = 0; i < _url.multiple.length; i++) {
        var _key = _url.multiple[i].ifValue.split('=')[0];
        var _value = _url.multiple[i].ifValue.split('=')[1];
        if (_.get(value, _key) === _value) {
          _url = _url.multiple[i].goto;
          isMatchFound = true;
          break;
        }
      }
      if (!isMatchFound) _url = _url.default;
    }

    console.log(formData);
    localStorage.setItem('formData', JSON.stringify(formData));
    localStorage.setItem('returnUrl', window.location.hash.split('#/')[1]);

    //======================================================================>>
    if (_url.indexOf('?') > -1) {
      var url = _url.split('?')[0];
      var query = _url.split('?')[1];
      var params = query.indexOf('&') > -1 ? query.split('&') : [query];
      var queryString = '?';
      for (var i = 0; i < params.length; i++) {
        queryString +=
          (i > 0 ? '&' : '') +
          params[i].split('=')[0] +
          '=' +
          (/\{/.test(params[i])
            ? encodeURIComponent(
                _.get(
                  value,
                  params[i]
                    .split('=')[1]
                    .split('{')[1]
                    .split('}')[0]
                )
              )
            : params[i].split('=')[1]);
      }
      var key = url.split('{')[1].split('}')[0];
      url = url.replace('{' + key + '}', encodeURIComponent(_.get(value, key)));

      action == 'update' && url.replace('/view', '/update');
      this.props.setRoute(url + queryString);
    } else {
      var key = _url.split('{')[1].split('}')[0];
      _url = _url.replace('{' + key + '}', encodeURIComponent(_.get(value, key)));
      action == 'update' && _url.replace('/view', '/update');
      this.props.setRoute(_url);
    }
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

  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors, isFormValid } = this.props;
    let {
      search,
      handleChange,
      getVal,
      addNewCard,
      removeCard,
      rowClickHandler,
      rowButtonClickHandler,
      rowCheckboxClickHandler,
      rowIconClickHandler,
    } = this;
    let { showResult, resultList, selectedRecordId } = this.state;
    let customActionsAndUrl =
      !_.isEmpty(mockData[`${moduleName}.${actionName}`]) && mockData[`${moduleName}.${actionName}`].hasOwnProperty('customActionsAndUrl')
        ? mockData[`${moduleName}.${actionName}`]['customActionsAndUrl'][0].url
        : '';
    // console.log(formData);
    // console.log(this.props.dropDownData);
    return (
      <div className="SearchResult">
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
                marginRight: '16px',
                marginTop: '16px',
              }}
            >
              <UiAddButton customUrl={customActionsAndUrl} />
            </div>
          </Col>
        </Row>
        <form
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
          <div
            style={{
              textAlign: 'right',
              color: '#FF0000',
              marginRight: '16px',
            }}
          >
            <i>( * ) {translate('framework.required.note')}</i>{' '}
          </div>

          <div style={{ textAlign: 'center' }}>
            <br />
            <UiButton
              icon={
                <i style={{ color: 'white' }} className="material-icons">
                  search
                </i>
              }
              item={{
                label: 'Search',
                uiType: 'submit',
                isDisabled: isFormValid ? false : true,
              }}
              ui="google"
            />&nbsp;&nbsp;
            {showResult &&
              resultList.actionItems &&
              resultList.actionItems.map((actionitem, index) => {
                return (
                  <span style={{ 'margin-right': '20px' }}>
                    <UiButton
                      item={{ label: actionitem.label, uiType: 'primary' }}
                      ui="google"
                      handler={() => {
                        rowButtonClickHandler(actionitem.url);
                      }}
                    />
                  </span>
                );
              })}
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
            {showResult && (
              <UiTable
                resultList={resultList}
                rowClickHandler={rowClickHandler}
                rowButtonClickHandler={rowButtonClickHandler}
                rowCheckboxClickHandler={rowCheckboxClickHandler}
                rowIconClickHandler={rowIconClickHandler}
                selectedValue={selectedRecordId}
              />
            )}
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
  flag: state.report.flag,
  isFormValid: state.frameworkForm.isFormValid,
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
  setFormData: data => {
    dispatch({ type: 'SET_FORM_DATA', data });
  },
  setDropDownData: (fieldName, dropDownData) => {
    // console.log(fieldName,dropDownData)
    dispatch({ type: 'SET_DROPDWON_DATA', fieldName, dropDownData });
  },
  resetDropdownData: () => {
    dispatch({ type: 'RESET_DROPDOWN_DATA' });
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(assetCategorySearch);
