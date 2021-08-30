import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

import _ from 'lodash';
import ShowFields from '../../../../framework/showFields';

import { translate } from '../../../../common/common';
import Api from '../../../../../api/api';
import UiButton from '../../../../framework/components/UiButton';
import UiDynamicTable from '../../../../framework/components/UiDynamicTable';
import { fileUpload } from '../../../../framework/utility/utility';
import UiTable from '../../../../framework/components/UiTable';

var specifications = {};

let reqRequired = [];
class PayTaxCreate extends Component {
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

    specifications = require(`../../../../framework/specs/collection/transaction/collection`).default;

    let { setMetaData, setModuleName, setActionName, initForm, setMockData, setFormData } = this.props;
    let obj = specifications[`collection.transaction`];
    reqRequired = [];
    this.setLabelAndReturnRequired(obj);
    initForm(reqRequired);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('collection');
    setActionName('transaction');
    var formData = {};
    if (obj && obj.groups && obj.groups.length) this.setDefaultValues(obj.groups, formData);
    setFormData(formData);
    this.setState({
      pathname: this.props.history.location.pathname,
    });
  }

  componentDidMount() {
    this.initData();
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.pathname != nextProps.history.location.pathname) {
      this.initData();
    }
  }

  search = e => {
    e.preventDefault();
    let self = this;
    self.props.setLoadingStatus('loading');
    var formData = { ...this.props.formData };
    for (var key in formData) {
      if (formData[key] !== '' && typeof formData[key] == 'undefined') delete formData[key];
    }

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
          resultHeader: [{ label: '#' }, ...self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.header],
          resultValues: [],
        };
        var specsValuesList = self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.values;
        var values = _.get(res, self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.resultPath);
        if (values && values.length) {
          for (var i = 0; i < values.length; i++) {
            var tmp = [i + 1];
            for (var j = 0; j < specsValuesList.length; j++) {
              tmp.push(_.get(values[i], specsValuesList[j]));
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
    let { handleChange } = this.props;
    handleChange(e, property, isRequired, pattern, requiredErrMsg, patternErrMsg);

    // if(property == "businessService"){
    //     console.log("working");
    //
    // }

    // function mandatoryField(jsonPath, value){
    //   if ((jsonPath == "businessService") && ((value != "") || (value != null))){
    //     if((jsonPath=="consumerCode") && ((value == "") || (value == "null"))){
    //       console.log("Hi");
    //        return false;
    //     }
    //     else {
    //       console.log("Hello");
    //     }
    //   }
    // }
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

  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors, isFormValid } = this.props;
    let { search, handleChange, getVal, addNewCard, removeCard, rowClickHandler } = this;
    let { showResult, resultList } = this.state;
    console.log(formData);
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
            />
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
});
export default connect(mapStateToProps, mapDispatchToProps)(PayTaxCreate);
