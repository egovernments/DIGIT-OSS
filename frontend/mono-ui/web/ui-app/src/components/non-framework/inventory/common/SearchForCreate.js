import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

import _ from 'lodash';
import ShowFields from '../../../framework/showFields';

import { translate } from '../../../common/common';
import Api from '../../../../api/api';
import UiButton from '../../../framework/components/UiButton';
import UiDynamicTable from '../../../framework/components/UiDynamicTable';
import { fileUpload } from '../../../framework/utility/utility';
import CustomUiTable from './components/CustomUiTable';
import jp from 'jsonpath';

var specifications = {};

let reqRequired = [];

const REGEXP_MATCH_PARAM = /\{(.*?)\}/g; // i.e /somecontext/action/"{code}"

export default class SearchForCreate extends Component {
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
        isMultipleSelection: false,
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
    //let hashLocation = window.location.hash;
    // try {
    //   var hash = window.location.hash.split("/");
    //   if(hash.length == 4 && hashLocation.split("/")[1]!="transaction") {
    //     specifications = require(`./specs/${hash[2]}/${hash[2]}`).default;
    //   } else if(hashLocation.split("/")[1]!="transaction"){
    //     specifications = require(`./specs/${hash[2]}/master/${hash[3]}`).default;
    //   } else {
    //     specifications = require(`./specs/${hash[2]}/transaction/${hash[3]}`).default;
    //   }
    // } catch(e) {}

    specifications = this.props.templateObj;
    let { setMetaData, setModuleName, setActionName, initForm, setMockData, setFormData, setTableSelectionData } = this.props;
    let obj = specifications[this.props.actionKey];
    reqRequired = [];
    this.setLabelAndReturnRequired(obj);
    initForm(reqRequired);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('inventory');
    setActionName('search');
    var formData = {};
    if (obj && obj.groups && obj.groups.length) this.setDefaultValues(obj.groups, formData);
    setFormData(formData);
    setTableSelectionData([]);

    this.setState({
      pathname: this.props.history.location.pathname,
      showResult: false,
    });
  }

  componentDidMount() {
    this.props.resetDropdownData();
    this.initData();
    this.hasReturnUrl();
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.pathname && this.state.pathname != nextProps.history.location.pathname) {
      this.props.resetDropdownData();
      this.initData();
    }
  }

  hasReturnUrl() {
    let { search } = this;
    if (localStorage.getItem('returnUrl')) {
      search(null, true);
    }
  }

  view = () => {
    let { moduleName, actionName, metaData, formData, setRoute, tableSelectionData } = this.props;
    let obj = metaData[`${moduleName}.${actionName}`];
    localStorage.setItem('formData', JSON.stringify(formData));
    localStorage.setItem('returnUrl', window.location.hash.split('#/')[1]);
    if (tableSelectionData && tableSelectionData.length === 1) {
      let url = obj.result['rowClickUrlView'].replace(REGEXP_MATCH_PARAM, encodeURIComponent(tableSelectionData[0]));
      setRoute(url);
    }
  };

  update = () => {
    let { moduleName, actionName, metaData, setRoute, tableSelectionData } = this.props;
    let obj = metaData[`${moduleName}.${actionName}`];
    if (tableSelectionData && tableSelectionData.length === 1) {
      let url = obj.result['rowClickUrlUpdate'].replace(REGEXP_MATCH_PARAM, encodeURIComponent(tableSelectionData[0]));
      setRoute(url);
    }
  };

  delete = () => {
    let self = this;
    let { moduleName, actionName, metaData, setRoute, tableSelectionData, setLoadingStatus } = this.props;
    let obj = metaData[`${moduleName}.${actionName}`];
    let resultIdKey = obj.result.resultIdKey;

    let deleteRequestBodyParams = obj.result.rowClickUrlDelete.body;

    Object.keys(deleteRequestBodyParams).map(key => {
      if (typeof deleteRequestBodyParams[key] === 'function') deleteRequestBodyParams[key] = deleteRequestBodyParams[key]();
    });

    if (tableSelectionData && tableSelectionData.length > 0) {
      let inActiveDatas = this.state.values.filter(value => tableSelectionData.indexOf(value[resultIdKey]) > -1).map(value => {
        value = { ...value, ...deleteRequestBodyParams };
        return value;
      });

      setLoadingStatus('loading');

      let formData = {
        [obj.result.resultPath]: inActiveDatas,
      };

      Api.commonApiPost(obj.result.rowClickUrlDelete.url, '', formData, '', true).then(function(response) {
        setLoadingStatus('hide');
        self.search();
      });
    }
  };

  search = e => {
    e && e.preventDefault();
    let self = this;
    self.props.setLoadingStatus('loading');
    self.props.setTableSelectionData([]);
    var formData = { ...this.props.formData };
    for (var key in formData) {
      if (formData[key] == '' || typeof formData[key] == 'undefined') delete formData[key];
    }

    self.setState({
      showResult: false,
    });

    Api.commonApiPost(
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].url,
      formData,
      {},
      null,
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].useTimestamp
    ).then(
      function(res) {
        self.props.setLoadingStatus('hide');
        var resultList = {
          resultHeader: [
            { label: 'Select' },
            { label: '#' },
            ...self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.header,
          ],
          resultValues: [],
        };
        var specsValuesList = self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.values;
        var values = _.get(res, self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.resultPath);
        let { getVal, getValFromDropdownData } = self;
        let resultIdKey = self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.resultIdKey;
        let isMutlipleSelection = self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.isMultipleSelection || false;

        if (values && values.length) {
          for (var i = 0; i < values.length; i++) {
            var tmp = [_.get(values[i], resultIdKey), i + 1];
            for (var j = 0; j < specsValuesList.length; j++) {
              let valuePath = specsValuesList[j];
              if (typeof valuePath === 'object' && valuePath.type === 'checkbox') {
                let val = _.get(values[i], valuePath.valuePath);
                tmp.push({
                  ...valuePath,
                  value: (valuePath.mappingValues && valuePath.mappingValues[val]) || val,
                });
                continue;
              } else if (typeof valuePath === 'object' && valuePath.valExp) {
                tmp.push(eval(valuePath.valExp));
                continue;
              }

              tmp.push(_.get(values[i], specsValuesList[j]) || '');
            }
            resultList.resultValues.push(tmp);
          }
        }

        resultList['isMultipleSelection'] = isMutlipleSelection;

        self.setState({
          resultList,
          values,
          showResult: true,
        });

        window.localStorage.setItem('formData', '');
        window.localStorage.setItem('returnUrl', '');

        self.props.setFlag(1);
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
    let _val = _.get(dropdownData.find(data => data.key == key) || [], path);
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
    let { getVal, getValFromDropdownData } = this;
    let { handleChange, mockData, setDropDownData } = this.props;
    let hashLocation = window.location.hash;
    let obj = specifications[this.props.actionKey];
    let depedants = jp.query(obj, `$.groups..fields[?(@.jsonPath=="${property}")].depedants.*`);
    let fieldObj = jp.query(obj, `$.groups..fields[?(@.jsonPath=="${property}")]`);

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

  rowClickHandler = index => {
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

  resetForm = () => {
    let { moduleName, actionName, metaData, setFormData, setTableSelectionData } = this.props;
    let obj = metaData[`${moduleName}.${actionName}`];
    var formData = {};
    if (obj && obj.groups && obj.groups.length) this.setDefaultValues(obj.groups, formData);
    setFormData(formData);
    setTableSelectionData([]);
    this.setState({
      pathname: this.props.history.location.pathname,
      showResult: false,
    });
  };

  redirectToUrl = urlKeyFromMockData => {
    let { moduleName, actionName, metaData, setRoute } = this.props;
    let obj = metaData[`${moduleName}.${actionName}`];
    setRoute(obj.result[urlKeyFromMockData]);
  };

  renderFieldGroupForCustomButtons = buttonObj => {
    return (
      <ShowFields
        groups={buttonObj.groups}
        noCols={buttonObj.noCols || 4}
        ui="google"
        handler={this.handleChange}
        getVal={this.getVal}
        fieldErrors={this.props.fieldErrors}
        useTimestamp={buttonObj.useTimestamp || false}
        addNewCard={''}
        removeCard={''}
      />
    );
  };

  escapeRegExp = str => {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  };

  onClickCustomButton = buttonObj => {
    let { moduleName, actionName, metaData, setRoute, tableSelectionData } = this.props;
    // let obj = metaData[`${moduleName}.${actionName}`];
    // let resultIdKey = obj.result.resultIdKey;

    let url = buttonObj.redirectUrl;
    let values = {};

    //console.log('buttonObj', buttonObj);
    if (buttonObj.groups && buttonObj.groups.length > 0) {
      let fields = jp.query(buttonObj.groups[0].fields, '$..[?(@.isRequired)]');
      //let jsonPaths = jp.query(fields, "$..jsonPath");
      let errorFields = [];
      for (let i = 0; i < fields.length; i++) {
        let value = this.getVal(fields[i].jsonPath);
        if (!value) errorFields.push(translate(fields[i].label));
        else {
          values[fields[i].jsonPath] = value;
          // let regexp = new RegExp(`{${this.escapeRegExp(fields[i].jsonPath)}}`);
          // url = url.replace(regexp, encodeURIComponent(value));
        }
      }
      if (errorFields.length > 0) {
        this.props.toggleSnackbarAndSetText(translate(buttonObj.validationMessage).replace(/\{(.*?)\}/g, errorFields.join(',')));
        return false;
      }
    }

    values[buttonObj.selectionParamName] = tableSelectionData;
    url = url.replace(/\{0\}/g, encodeURIComponent(JSON.stringify(values)));
    setRoute(url);
  };

  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors, isFormValid, tableSelectionData } = this.props;
    let { search, handleChange, getVal, addNewCard, removeCard, rowClickHandler } = this;
    let { showResult, resultList } = this.state;

    //let isEnableUpdateViewBtn = tableSelectionData && tableSelectionData.length === 1 || false;
    let isEnableCustomButtons = (tableSelectionData && tableSelectionData.length > 0) || false;

    let customButtons = mockData[`${moduleName}.${actionName}`] && mockData[`${moduleName}.${actionName}`].customButtons;

    return (
      <div className="SearchResult">
        <form
          onSubmit={e => {
            search(e);
          }}
        >
          <div style={{ textAlign: 'right', color: '#FF0000', margin: '15px' }}>
            <i>( * ) {translate('framework.required.note')}</i>
          </div>
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
                isDisabled: isFormValid ? false : true,
              }}
              ui="google"
            />&nbsp;&nbsp;
            <UiButton item={{ label: 'Reset', uiType: 'button', primary: false }} ui="google" handler={this.resetForm} />&nbsp;&nbsp;
            {customButtons &&
              customButtons.filter(button => !button.groups).map((button, idx) => {
                return (
                  <span key={idx}>
                    <UiButton
                      handler={e => {
                        this.onClickCustomButton(button);
                      }}
                      item={{
                        label: button.buttonText,
                        uiType: 'button',
                        isDisabled: !isEnableCustomButtons,
                      }}
                      ui="google"
                    />&nbsp;&nbsp;
                  </span>
                );
              })}
            {/* <UiButton item={{"label": "View", "uiType":"button", "primary": true, "isDisabled":!isEnableUpdateViewBtn}} ui="google" handler={this.view}/>&nbsp;&nbsp;
            <UiButton item={{"label": "Update", "uiType":"button", "primary": true, "isDisabled":!isEnableUpdateViewBtn}} ui="google" handler={this.update}/>&nbsp;&nbsp;
            <UiButton item={{"label": "Delete", "uiType":"button", "primary": true, "isDisabled":!isEnableDeleteBtn}} ui="google" handler={this.delete} />&nbsp;&nbsp;
            <UiButton item={{"label": "Add", "uiType":"button", "primary": true}} ui="google" handler={this.redirectToUrl.bind(this, "rowClickUrlAdd")}/> */}
            <br />
            {showResult && <CustomUiTable resultList={resultList} rowClickHandler={rowClickHandler} />}
            {isEnableCustomButtons &&
              customButtons &&
              customButtons.filter(button => button.groups).map((button, idx) => {
                return [
                  this.renderFieldGroupForCustomButtons(button),
                  <UiButton
                    key={idx}
                    handler={e => {
                      this.onClickCustomButton(button);
                    }}
                    item={{
                      label: button.buttonText,
                      uiType: 'button',
                      isDisabled: !isEnableCustomButtons,
                    }}
                    ui="google"
                  />,
                  <br />,
                ];
              })}
          </div>
        </form>
      </div>
    );
  }
}
