import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

import _ from 'lodash';
// import Framework from "./framework";
import ShowFields from './showFieldsTwo';

import { translate } from '../common/common';
import Api from '../../api/api';
import jp from 'jsonpath';
import UiButton from './components/UiButton';
import { fileUpload, getInitiatorPosition } from './utility/utility';
import $ from 'jquery';

var specifications = {};
let reqRequired = [];
let baseUrl = 'https://raw.githubusercontent.com/abhiegov/test/master/specs/';
class Create extends Component {
  state = {
    pathname: '',
  };

  constructor(props) {
    super(props);
  }

  setLabelAndReturnRequired(configObject) {
    if (configObject && configObject.groups) {
      for (var i = 0; configObject && i < configObject.groups.length; i++) {
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
        if (typeof groups[i].fields[j].defaultValue != 'undefined') {
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

  initData() {
    let { setMetaData, setMockData, setModuleName, setActionName, setFormData, initForm } = this.props;
    var hash = window.location.hash.split('/');
    let hashLocation = window.location.hash;
    let endPoint = '';
    let self = this;

    try {
      if (hash.length == 3 || (hash.length == 4 && hash.indexOf('update') > -1)) {
        specifications = require(`./specs/${hash[2]}/${hash[2]}`).default;
      } else {
        specifications = require(`./specs/${hash[2]}/master/${hash[3]}`).default;
      }
    } catch (e) {
      console.log(e);
    }

    specifications = typeof specifications == 'string' ? JSON.parse(specifications) : specifications;
    let obj = specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`];
    reqRequired = [];
    self.setLabelAndReturnRequired(obj);
    initForm(reqRequired);

    if (hashLocation.split('/').indexOf('update') == 1) {
      var url = specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].searchUrl.split('?')[0];
      var id = self.props.match.params.id || self.props.match.params.master;
      var query = {
        [specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].searchUrl.split('?')[1].split('=')[0]]: id,
      };
      Api.commonApiPost(url, query, {}, false, specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].useTimestamp).then(
        function(res) {
          if (specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].isResponseArray) {
            var obj = {};
            _.set(obj, specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].objectName, jp.query(res, '$..[0]')[0]);
            self.props.setFormData(obj);
          } else {
            self.props.setFormData(res);
          }
        },
        function(err) {}
      );
    } else {
      var formData = {};
      if (obj && obj.groups && obj.groups.length) self.setDefaultValues(obj.groups, formData);
      setFormData(formData);
    }

    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName(hashLocation.split('/')[2]);
    setActionName(hashLocation.split('/')[1]);

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

  makeAjaxCall = (formData, url) => {
    let self = this;
    delete formData.ResponseInfo;
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
            if (self.props.actionName == 'update') {
              var hash = window.location.hash.replace(/(\#\/create\/|\#\/update\/)/, '/view/');
            } else {
              var hash =
                window.location.hash.replace(/(\#\/create\/|\#\/update\/)/, '/view/') +
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

  create = e => {
    let self = this,
      _url;
    e.preventDefault();
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
  };

  render() {
    // let {mockData, moduleName, actionName, formData, fieldErrors, isFormValid} = this.props;
    // let {create, handleChange, getVal, addNewCard, removeCard, autoComHandler} = this;
    let { create } = this;
    let { mockData, moduleName, actionName, isFormValid } = this.props;
    return (
      <div className="Create">
        <form
          onSubmit={e => {
            create(e);
          }}
        >
          {!_.isEmpty(mockData) &&
            moduleName &&
            actionName && (
              <ShowFields
                groups={mockData[`${moduleName}.${actionName}`].groups}
                noCols={mockData[`${moduleName}.${actionName}`].numCols}
                ui="google"
                useTimestamp={mockData[`${moduleName}.${actionName}`].useTimestamp || false}
              />
            )}

          <div style={{ textAlign: 'center' }}>
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
  // metaData:state.framework.metaData,
  mockData: state.framework.mockData,
  moduleName: state.framework.moduleName,
  actionName: state.framework.actionName,
  // formData:state.frameworkForm.form,
  // fieldErrors: state.frameworkForm.fieldErrors,
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
    console.log(toastMsg);
    console.log(isSuccess);
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Create);
