import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import UiTable from '../../../../framework/components/UiTable';

import _ from 'lodash';
import ShowFields from '../../../../framework/showFields';

import { translate } from '../../../../common/common';
import Api from '../../../../../api/api';
import jp from 'jsonpath';
import UiButton from '../../../../framework/components/UiButton';
import { fileUpload, getInitiatorPosition } from '../../../../framework/utility/utility';
import $ from 'jquery';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';

var specifications = {};

let reqRequired = [];
class penaltyRatesUpdateSearch extends Component {
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
    console.log('checkformdata');
    let hashLocation = window.location.hash;
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

    specifications = require(`../../../../framework/specs/tl/master/LicensePenaltyRates`).default;

    let { setMetaData, setModuleName, setActionName, initForm, setMockData, setFormData } = this.props;
    let obj = specifications[`tl.search`];
    reqRequired = [];
    this.setLabelAndReturnRequired(obj);
    initForm(reqRequired);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('tl');
    setActionName('search');
    var formData = {};
    if (obj && obj.groups && obj.groups.length) this.setDefaultValues(obj.groups, formData);
    console.log(formData);
    setFormData(formData);
    console.log(formData);
    // this.props.ResetDropdownData();

    this.setState({
      pathname: this.props.history.location.pathname,
      showResult: false,
    });
  }

  componentDidMount() {
    // this.props.ResetDropdownData();
    this.initData();
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.pathname && this.state.pathname != nextProps.history.location.pathname) {
      this.initData();
      this.props.ResetDropdownData();
    }
  }

  // componentWillUnmount()
  // {
  //   this.props.ResetDropdownData();
  // }

  search = e => {
    e.preventDefault();
    let self = this;
    self.props.setLoadingStatus('loading');
    var formData = { ...this.props.formData };
    for (var key in formData) {
      if (formData[key] !== '' && typeof formData[key] == 'undefined') delete formData[key];
    }
    console.log(formData);
    Api.commonApiPost(
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].url,
      formData,
      {},
      null,
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].useTimestamp
    ).then(
      function(res) {
        self.props.setLoadingStatus('hide');
        console.log(res.penaltyRates);
        localStorage.setItem('penaltyResult', JSON.stringify(res.penaltyRates));
        console.log(localStorage.penaltyResult);
        var resultList = {
          resultHeader: [{ label: '#' }, ...self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.header],
          resultValues: [],
        };

        var specsValuesList = self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.values;
        var values = _.get(res, self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.resultPath);
        if (values && values.length) {
          for (var i = 0; i < values.length; i++) {
            var tmp = [i + 1];
            for (var j = 0; j < specsValuesList.length; j++) {
              // if ((resultList.resultHeader[j].label.search("Date")>-1 || resultList.resultHeader[j].label.search("date")>-1)  && !(specsValuesList[j].search("-")>-1)) {
              //   tmp.push(new Date(_.get(values[i],specsValuesList[j])).getDate()+"/"+new Date(_.get(values[i],specsValuesList[j])).getMonth()+"/"+new Date(_.get(values[i],specsValuesList[j])).getFullYear());
              // } else {
              tmp.push(_.get(values[i], specsValuesList[j]));
              // }
            }
            resultList.resultValues.push(tmp);
          }
        }
        self.setState({
          resultList,
          values,
          showResult: true,
        });

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

  handleChange = (e, property, isRequired, pattern, requiredErrMsg = 'Required', patternErrMsg = 'Pattern Missmatch') => {
    let { getVal } = this;
    let { handleChange, mockData, setDropDownData } = this.props;
    let hashLocation = window.location.hash;
    let obj = specifications[`tl.search`];
    // console.log(obj);
    let depedants = jp.query(obj, `$.groups..fields[?(@.jsonPath=="${property}")].depedants.*`);
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
    console.log(value);
    //  var _url = window.location.hash.split("/").indexOf("update") > -1 ? this.props.metaData[`${this.props.moduleName}.${this.props.actionName}`].result.rowClickUrlUpdate : this.props.metaData[`${this.props.moduleName}.${this.props.actionName}`].result.rowClickUrlView;
    //
    //  if(_url.indexOf("?") > -1) {
    //    var url = _url.split("?")[0];
    //    var query = _url.split("?")[1];
    //    var params = query.indexOf("&") > -1 ? query.split("&") : [query];
    //    var queryString = "?";
    //    for(var i=0; i< params.length; i++) {
    //      queryString += (i>0?'&':'') + params[i].split("=")[0] + "=" +  (/\{/.test(params[i]) ? encodeURIComponent(_.get(value, params[i].split("=")[1].split("{")[1].split("}")[0])) : params[i].split("=")[1]);
    //    }
    //    var key = url.split("{")[1].split("}")[0];
    //    url = url.replace("{" + key + "}", encodeURIComponent(_.get(value, key)));

    //  console.log(queryString.split("=")[1]);
    //  if(queryString.split("=")[1] == null){
    //    queryString = "";
    //  }
    // console.log(url);
    var qs = '/non-framework/tl/masters/update/updatePenaltyRates/' + value.id + '?applicationType=' + value.applicationType;
    console.log(qs);
    var qsr = qs.replace('?applicationType=null', '');
    console.log(qsr);
    this.props.setRoute(qsr);
    //  } else {
    //      var key = _url.split("{")[1].split("}")[0];
    //      _url = _url.replace("{" + key + "}", encodeURIComponent(_.get(value, key)));
    //      this.props.setRoute(_url.replace("?applicationType=null",""));
    //  }
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
    let { search, handleChange, getVal, addNewCard, removeCard, rowClickHandler } = this;
    let { showResult, resultList } = this.state;
    console.log(formData);
    // console.log(this.props.dropDownData);
    return (
      <div className="SearchResult">
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
            <UiButton item={{ label: 'Reset', uiType: 'button', primary: false }} ui="google" handler={this.resetForm} />
            <br />
            {showResult && <UiTable resultList={resultList} rowClickHandler={rowClickHandler} />}
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
    console.log(fieldName, dropDownData);
    dispatch({ type: 'SET_DROPDWON_DATA', fieldName, dropDownData });
  },
  ResetDropdownData: () => {
    dispatch({ type: 'RESET_DROPDOWN_DATA' });
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(penaltyRatesUpdateSearch);
