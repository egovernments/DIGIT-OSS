import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import { blue800, red500, white } from 'material-ui/styles/colors';
import { Grid, Row, Col, DropdownButton, Table, ListGroup, ListGroupItem } from 'react-bootstrap';
import { List, ListItem } from 'material-ui/List';

import SelectField from 'material-ui/SelectField';
import _ from 'lodash';
import ShowFields from '../../../framework/showFields';

import { translate } from '../../../common/common';
import Api from '../../../../api/api';
import jp from 'jsonpath';
import UiButton from '../../../framework/components/UiButton';
import UiTable from '../../../framework/components/UiTable';
import { fileUpload, getInitiatorPosition } from '../../../framework/utility/utility';
import $ from 'jquery';
var specifications = {};
const styles = {
  errorStyle: {
    color: red500,
  },
  underlineStyle: {},
  underlineFocusStyle: {},
  floatingLabelStyle: {
    color: '#354f57',
  },
  floatingLabelFocusStyle: {
    color: '#354f57',
  },
  customWidth: {
    width: 100,
  },
  checkbox: {
    marginBottom: 0,
    marginTop: 15,
  },
  uploadButton: {
    verticalAlign: 'middle',
  },
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
  floatButtonMargin: {
    marginLeft: 20,
    fontSize: 12,
    width: 30,
    height: 30,
  },
  iconFont: {
    fontSize: 17,
    cursor: 'pointer',
  },
  radioButton: {
    marginBottom: 0,
  },
  actionWidth: {
    width: 160,
  },
  reducePadding: {
    paddingTop: 4,
    paddingBottom: 0,
  },
  noPadding: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  noMargin: {
    marginBottom: 0,
  },
  textRight: {
    textAlign: 'right',
  },
  chip: {
    marginTop: 4,
  },
};

var CONST_API_GET_FILE = 'filestore/v1/files/id';
let reqRequired = [];
class Report extends Component {
  constructor(props) {
    super(props);
  }

  setLabelAndReturnRequired(configObject) {
    if (configObject && configObject.groups) {
      for (var i = 0; configObject && i < configObject.groups.length; i++) {
        configObject.groups[i].label = translate(configObject.groups[i].label);
        for (var j = 0; j < configObject.groups[i].fields.length; j++) {
          configObject.groups[i].fields[j].label = translate(configObject.groups[i].fields[j].label);
        }

        if (configObject.groups[i].children && configObject.groups[i].children.length) {
          for (var k = 0; k < configObject.groups[i].children.length; k++) {
            this.setLabelAndReturnRequired(configObject.groups[i].children[k]);
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
          var regex = new RegExp(children[i].groups[j].jsonPath.replace('[', '[').replace(']', ']') + '\\[\\d{1}\\]', 'g');
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

  hideField(specs, moduleName, actionName, hideObject) {
    if (hideObject.isField) {
      for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
        for (let j = 0; j < specs[moduleName + '.' + actionName].groups[i].fields.length; j++) {
          if (hideObject.name == specs[moduleName + '.' + actionName].groups[i].fields[j].name) {
            specs[moduleName + '.' + actionName].groups[i].fields[j].hide = true;
            break;
          }
        }
      }
    } else {
      let flag = 0;
      for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
        if (hideObject.name == specs[moduleName + '.' + actionName].groups[i].name) {
          flag = 1;
          specs[moduleName + '.' + actionName].groups[i].hide = true;
          break;
        }
      }

      if (flag == 0) {
        for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
          if (specs[moduleName + '.' + actionName].groups[i].children && specs[moduleName + '.' + actionName].groups[i].children.length) {
            for (let j = 0; j < specs[moduleName + '.' + actionName].groups[i].children.length; j++) {
              for (let k = 0; k < specs[moduleName + '.' + actionName].groups[i].children[j].groups.length; k++) {
                if (hideObject.name == specs[moduleName + '.' + actionName].groups[i].children[j].groups[k].name) {
                  specs[moduleName + '.' + actionName].groups[i].children[j].groups[k].hide = true;
                  break;
                }
              }
            }
          }
        }
      }
    }
  }

  showField(specs, moduleName, actionName, showObject) {
    if (showObject.isField) {
      for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
        for (let j = 0; j < specs[moduleName + '.' + actionName].groups[i].fields.length; j++) {
          if (showObject.name == specs[moduleName + '.' + actionName].groups[i].fields[j].name) {
            specs[moduleName + '.' + actionName].groups[i].fields[j].hide = false;
            break;
          }
        }
      }
    } else {
      let flag = 0;
      for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
        if (showObject.name == specs[moduleName + '.' + actionName].groups[i].name) {
          flag = 1;
          specs[moduleName + '.' + actionName].groups[i].hide = false;
          break;
        }
      }

      if (flag == 0) {
        for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
          if (specs[moduleName + '.' + actionName].groups[i].children && specs[moduleName + '.' + actionName].groups[i].children.length) {
            for (let j = 0; j < specs[moduleName + '.' + actionName].groups[i].children.length; j++) {
              for (let k = 0; k < specs[moduleName + '.' + actionName].groups[i].children[j].groups.length; k++) {
                if (showObject.name == specs[moduleName + '.' + actionName].groups[i].children[j].groups[k].name) {
                  specs[moduleName + '.' + actionName].groups[i].children[j].groups[k].hide = false;
                  break;
                }
              }
            }
          }
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
          specs[moduleName + '.' + actionName].groups[ind + 1].index = ind + 1;
        }
      }

      for (var j = 0; j < specs[moduleName + '.' + actionName].groups[i].fields.length; j++) {
        if (
          specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields &&
          specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields.length
        ) {
          for (var k = 0; k < specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields.length; k++) {
            if (
              specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].ifValue ==
              _.get(form, specs[moduleName + '.' + actionName].groups[i].fields[j].jsonPath)
            ) {
              if (
                specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide &&
                specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide.length
              ) {
                for (var a = 0; a < specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide.length; a++) {
                  this.hideField(specs, moduleName, actionName, specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide[a]);
                }
              }

              if (
                specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show &&
                specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length
              ) {
                for (var a = 0; a < specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length; a++) {
                  this.showField(specs, moduleName, actionName, specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show[a]);
                }
              }
            }
          }
        }
      }

      if (specs[moduleName + '.' + actionName].groups[ind || i].children && specs[moduleName + '.' + actionName].groups[ind || i].children.length) {
        this.setInitialUpdateChildData(form, specs[moduleName + '.' + actionName].groups[ind || i].children);
      }
    }

    setMockData(specs);
  }

  initData() {
    // try {
    //   var hash = window.location.hash.split("/");
    //   if(hash.length == 4) {
    //     specifications = require(`./specs/${hash[2]}/${hash[2]}`).default;
    //   } else {
    //     specifications = require(`./specs/${hash[2]}/master/${hash[3]}`).default;
    //   }
    // } catch(e) {
    //
    // }

    specifications = require(`../../../framework/specs/tl/master/CreateLegacyLicense`).default;

    let { setMetaData, setModuleName, setActionName, setMockData } = this.props;
    let hashLocation = window.location.hash;
    let self = this;
    let obj = specifications['tl.view'];
    self.setLabelAndReturnRequired(obj);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('tl');
    setActionName('view');
    //Get view form data
    var url = specifications['tl.view'].url.split('?')[0];
    var hash = window.location.hash.split('/');
    var value = self.props.match.params.licenseNumber;
    var query = {
      [specifications['tl.view'].url.split('?')[1].split('=')[0]]: value,
    };

    Api.commonApiPost(url, query, {}, false, specifications['tl.view'].useTimestamp).then(
      function(res) {
        self.props.setFormData(res);
        console.log(res);
        self.setInitialUpdateData(res, JSON.parse(JSON.stringify(specifications)), 'tl', 'view', specifications['tl.view'].objectName);
      },
      function(err) {}
    );
  }

  componentDidMount() {
    this.initData();
  }

  //   getVal = (path) => {
  //     console.log("hge;;");
  //     var val = _.get(this.props.formData, path);
  //
  // console.log(path);
  //     if((path != "licenses[0].adhaarNumber") && val && ((val + "").length == 13 || (val + "").length == 12) && new Date(Number(val)).getTime() > 0) {
  //       var _date = new Date(Number(val));
  //       return ('0' + _date.getDate()).slice(-2) + '/'
  //                + ('0' + (_date.getMonth()+1)).slice(-2) + '/'
  //                + _date.getFullYear();
  //     }
  //     else {
  //       return  typeof val != "undefined" && (typeof val == "string" || typeof val == "number" || typeof val == "boolean") ? (val + "") : "";
  //     }
  //   }

  getVal = (path, isDate) => {
    var val = _.get(this.props.formData, path);

    if (isDate && val && ((val + '').length == 13 || (val + '').length == 12) && new Date(Number(val)).getTime() > 0) {
      var _date = new Date(Number(val));
      return ('0' + _date.getDate()).slice(-2) + '/' + ('0' + (_date.getMonth() + 1)).slice(-2) + '/' + _date.getFullYear();
    }

    return typeof val != 'undefined' && (typeof val == 'string' || typeof val == 'number' || typeof val == 'boolean') ? val + '' : '';
  };

  printer = () => {
    window.print();
  };

  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors, date } = this.props;
    let { handleChange, getVal, addNewCard, removeCard, printer, licenses } = this;

    const renderFiles = function() {
      {
        return (
          formData &&
          formData.licenses &&
          formData.licenses[0] &&
          formData.licenses[0].supportDocuments &&
          formData.licenses[0].supportDocuments.length &&
          formData.licenses[0].supportDocuments.map(function(v, i) {
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{v.documentTypeName}</td>
                <td>{v.comments}</td>
                <td>
                  <a
                    href={window.location.origin + '/' + CONST_API_GET_FILE + '?tenantId=' + localStorage.tenantId + '&fileStoreId=' + v.fileStoreId}
                    target="_blank"
                  >
                    Download
                  </a>
                </td>
              </tr>
            );
          })
        );
      }
    };

    const renderDocuments = function() {
      if (
        formData &&
        formData.hasOwnProperty('licenses') &&
        formData.licenses.length > 0 &&
        formData.licenses[0] &&
        formData.licenses[0].supportDocuments &&
        formData.licenses[0].supportDocuments.length > 0
      ) {
        {
          return (
            formData &&
            formData.licenses &&
            formData.licenses[0] &&
            formData.licenses[0].supportDocuments &&
            formData.licenses[0].supportDocuments.length &&
            formData.licenses.map(function(v, i) {
              return (
                <Card className="uiCard">
                  <CardHeader
                    title={
                      <div
                        style={{
                          color: '#354f57',
                          fontSize: 18,
                          margin: '8px 0',
                        }}
                      >
                        {translate('tl.table.title.supportDocuments')}
                      </div>
                    }
                  />
                  <CardText>
                    <Table bordered responsive className="table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>{translate('tl.create.license.table.documentName')}</th>
                          <th>{translate('tl.create.license.table.comments')}</th>
                          <th>{translate('tl.create.license.table.file')}</th>
                        </tr>
                      </thead>
                      <tbody>{renderFiles()}</tbody>
                    </Table>
                  </CardText>
                </Card>
              );
            })
          );
        }
      }
    };

    const renderBody = function() {
      console.log(formData.licenses);
      if (
        formData &&
        formData.hasOwnProperty('licenses') &&
        formData.licenses &&
        formData.licenses[0].feeDetails &&
        formData.licenses[0].feeDetails.length > 0
      ) {
        return formData.licenses.map(function(item, i) {
          return (
            <div>
              <Card className="uiCard">
                <CardHeader
                  title={
                    <div
                      style={{
                        color: '#354f57',
                        fontSize: 18,
                        margin: '8px 0',
                      }}
                    >
                      {translate('tl.table.title.feeDetails')}
                    </div>
                  }
                />
                <CardText>
                  <Table bordered responsive className="table-striped">
                    <thead>
                      <tr>
                        <th>{translate('tl.create.license.table.financialYear')}</th>
                        <th>{translate('tl.create.license.table.amount')}</th>
                        <th>{translate('tl.create.license.table.isPaid')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData &&
                        formData.hasOwnProperty('licenses') &&
                        formData.licenses[0].hasOwnProperty('feeDetails') &&
                        formData.licenses[0].feeDetails.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{item.financialYear}</td>
                              <td>{item.amount}</td>
                              <td>{item.paid ? 'Yes' : 'No'}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </CardText>
              </Card>
              {renderDocuments()}
            </div>
          );
        });
      }
    };

    const renderTable = function() {
      if (moduleName && actionName && formData && formData[objectName]) {
        var objectName = mockData['tl.view'].objectName;
        if (formData[objectName].documents && formData[objectName].documents.length) {
          var dataList = {
            resultHeader: ['#', 'Name', 'File'],
            resultValues: [],
          };

          for (var i = 0; i < formData[objectName].documents.length; i++) {
            dataList.resultValues.push([
              i + 1,
              formData[objectName].documents[i].name || 'File',
              '<a href=/filestore/v1/files/id?tenantId=' +
                localStorage.getItem('tenantId') +
                '&fileStoreId=' +
                formData[objectName].documents[i].fileStoreId +
                '>Download</a>',
            ]);
          }

          return <UiTable resultList={dataList} />;
        }
      }
    };
    const dateFormat = function(val) {
      var _date = new Date(Number(val));
      return ('0' + _date.getDate()).slice(-2) + '/' + ('0' + (_date.getMonth() + 1)).slice(-2) + '/' + _date.getFullYear();
    };

    const renderAgreement = function() {
      if (formData && formData.hasOwnProperty('licenses') && formData.licenses.length > 0) {
        console.log(formData.licenses[0].agreementDate);

        var final = dateFormat(formData.licenses[0].agreementDate);
        console.log('final', final);

        if (formData.licenses[0].isPropertyOwner) {
          return (
            <Card className="uiCard">
              <CardHeader
                style={styles.reducePadding}
                title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('tl.view.licenses.groups.agreementDetails')}</div>}
              />
              <CardText style={styles.reducePadding}>
                <Grid fluid>
                  <Row>
                    <Col xs={12} md={4} sm={6}>
                      <Col style={{ textAlign: 'left' }} xs={12}>
                        <label>
                          <span style={{ fontWeight: 500, fontSize: '13px' }}>
                            {translate('tl.create.licenses.groups.agreementDetails.agreementDate')}
                          </span>
                        </label>
                      </Col>
                      <Col style={{ textAlign: 'left' }} xs={12}>
                        {formData.licenses[0].agreementDate ? dateFormat(formData.licenses[0].agreementDate) : 'NA'}
                      </Col>
                    </Col>
                    <Col xs={12} md={4} sm={6}>
                      <Col style={{ textAlign: 'left' }} xs={12}>
                        <label>
                          <span style={{ fontWeight: 500, fontSize: '13px' }}>
                            {translate('tl.create.licenses.groups.agreementDetails.agreementNo')}
                          </span>
                        </label>
                      </Col>
                      <Col style={{ textAlign: 'left' }} xs={12}>
                        {formData.licenses[0].agreementNo ? formData.licenses[0].agreementNo : 'NA'}
                      </Col>
                    </Col>
                  </Row>
                </Grid>
              </CardText>
            </Card>
          );
        }
      }
    };

    return (
      <div className="Report">
        <h3 style={{ textAlign: 'center' }}>{translate('tl.view.legacyTradeLicense')}</h3>
        <form id="printable">
          {!_.isEmpty(mockData) &&
            mockData['tl.view'] && (
              <ShowFields
                groups={mockData['tl.view'].groups}
                noCols={mockData['tl.view'].numCols}
                ui="google"
                handler={''}
                getVal={getVal}
                fieldErrors={fieldErrors}
                useTimestamp={mockData['tl.view'].useTimestamp || false}
                addNewCard={''}
                removeCard={''}
                screen="view"
              />
            )}

          {renderTable()}
          {renderAgreement()}

          {renderBody()}

          <div>
            <Row />
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
});

const mapDispatchToProps = dispatch => ({
  setFormData: data => {
    dispatch({ type: 'SET_FORM_DATA', data });
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
});
export default connect(mapStateToProps, mapDispatchToProps)(Report);
