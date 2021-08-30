import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import _ from 'lodash';
import ShowFields from '../../framework/showFields';

import { translate } from '../../common/common';
import Api from '../../../api/api';
import UiButton from '../../framework/components/UiButton';
import UiDynamicTable from '../../framework/components/UiDynamicTable';
import { fileUpload } from '../../framework/utility/utility';
import UiTable from '../../framework/components/UiTable';
import { getFullDate } from '../../framework/utility/utility';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import jp from 'jsonpath';
import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.html5.js'; // HTML 5 file export
import 'datatables.net-buttons/js/buttons.flash.js'; // Flash file export
import jszip from 'jszip/dist/jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import 'datatables.net-buttons/js/buttons.flash.js';
import 'datatables.net-buttons-bs';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

var specifications = {};

const nameMap = {
  PT_NODUES: 'Property Tax No Dues',
  WC_NODUES: 'Water Charges No Dues',
  CREATED: 'Created',
  WATER_NEWCONN: 'New Water Connection',
  BPA_FIRE_NOC: 'Fire NOC',
};

let reqRequired = [];
class Report extends Component {
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
    specifications = require('../../framework/specs/citizenService/wc/search').default;
    let { setMetaData, setModuleName, setActionName, initForm, setMockData, setFormData } = this.props;
    let obj = specifications['wc.search'];
    reqRequired = [];
    this.setLabelAndReturnRequired(obj);
    initForm(reqRequired);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('wc');
    setActionName('search');
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

  componentWillMount() {
    $('#searchTable').DataTable({
      dom: '<"col-md-4"l><"col-md-4"B><"col-md-4"f>rtip',
      buttons: ['excel', 'pdf', 'copy', 'csv', 'print'],
      bDestroy: true,
      language: {
        emptyTable: 'No Records',
      },
    });
  }

  componentDidUpdate() {
    $('#searchTable').DataTable({
      dom: '<"col-md-4"l><"col-md-4"B><"col-md-4"f>rtip',
      buttons: ['excel', 'pdf', 'copy', 'csv', 'print'],
      ordering: false,
      bDestroy: true,
      language: {
        emptyTable: 'No Records',
      },
    });
  }

  componentWillUpdate() {
    let { flag } = this.props;
    if (flag == 1) {
      flag = 0;
      $('#searchTable')
        .dataTable()
        .fnDestroy();
    }
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

        var ServiceRequest = [];
        if (res.serviceReq) {
          for (var i = 0; i < res.serviceReq.length; i++) {
            if (res.serviceReq[i].serviceCode == 'WATER_NEWCONN' || res.serviceReq[i].serviceCode == 'BPA_FIRE_NOC') {
              ServiceRequest.push(res.serviceReq[i]);
            }
          }
        }

        self.setState({
          resultList: ServiceRequest,
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
    let { handleChange, mockData, setDropDownData, formData } = this.props;
    let hashLocation = window.location.hash;
    let obj = specifications['wc.search'];
    // console.log(obj);
    let depedants = jp.query(obj, `$.groups..fields[?(@.jsonPath=="${property}")].depedants.*`);
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

        if (id.categoryId == '' || id.categoryId == null) {
          formData.tradeSubCategory = '';
          setDropDownData(value.jsonPath, []);
          console.log(value.jsonPath);
          console.log('helo', formData);
          return false;
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
              dropDownData.unshift({ key: null, value: '-- Please Select --' });
              setDropDownData(value.jsonPath, dropDownData);
            }
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
  };

  rowClickHandler = item => {
    if (item.serviceCode == 'WATER_NEWCONN') {
      var _url = '/non-framework/citizenServices/view/update/wc/' + encodeURIComponent(item.serviceRequestId);
    } else {
      var _url = '/non-framework/citizenServices/fireNoc/update/view/' + encodeURIComponent(item.serviceRequestId) + '/success';
    }

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
            mockData['wc.search'] && (
              <ShowFields
                groups={mockData['wc.search'].groups}
                noCols={mockData['wc.search'].numCols}
                ui="google"
                handler={handleChange}
                getVal={getVal}
                fieldErrors={fieldErrors}
                useTimestamp={mockData['wc.search'].useTimestamp || false}
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
            {showResult && (
              <Card className="uiCard">
                <CardHeader title={<strong> {translate('ui.table.title')} </strong>} />
                <CardText>
                  <Table id="searchTable">
                    <thead>
                      <tr>
                        <th>Service Request No.</th>
                        <th>Service Name</th>
                        <th>Status</th>
                        <th>Applied On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultList && resultList.length
                        ? resultList.map((item, key) => {
                            return (
                              <tr
                                key={key}
                                onClick={() => {
                                  rowClickHandler(item);
                                }}
                              >
                                <td>{item.serviceRequestId}</td>
                                <td>{nameMap[item.serviceCode] || item.serviceCode}</td>
                                <td>{nameMap[item.status] || item.status}</td>
                                <td>{item.auditDetails ? getFullDate(item.auditDetails.createdDate) : '-'}</td>
                              </tr>
                            );
                          })
                        : ''}
                    </tbody>
                  </Table>
                </CardText>
              </Card>
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
});
export default connect(mapStateToProps, mapDispatchToProps)(Report);
