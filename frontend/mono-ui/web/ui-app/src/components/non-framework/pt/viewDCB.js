import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText, CardTitle } from 'material-ui/Card';
import _ from 'lodash';
import ShowFields from '../../framework/showFields';
import { translate } from '../../common/common';
import Api from '../../../api/api';
import jp from 'jsonpath';
import UiButton from '../../framework/components/UiButton';
import { fileUpload } from '../../framework/utility/utility';
import UiTable from '../../framework/components/UiTable';

var specifications = {};

let reqRequired = [];
class ViewDCB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dcbTableData: [],
      receiptTableData: [],
      headwiseData: [],
    };
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
    specifications = require(`../../framework/specs/pt/viewDCB`).default;

    let { setMetaData, setModuleName, setActionName, setMockData } = this.props;
    let self = this;
    let obj = specifications['dcb.view'];
    self.setLabelAndReturnRequired(obj);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('dcb');
    setActionName('view');

    //Get view form data

    var url = specifications[`dcb.view`].url.split('?')[0];
    var hash = window.location.hash.split('/');
    var value = self.props.match.params.searchParam;
    var query = {
      [specifications[`dcb.view`].url.split('?')[1].split('=')[0]]: value,
    };

    console.log(query);
    Api.commonApiPost(url, query, {}, false, specifications[`dcb.view`].useTimestamp).then(
      function(res) {
        self.props.setFormData(res);
        // console.log("api" + JSON.stringify(res));
        // self.setInitialUpdateData(res, JSON.parse(JSON.stringify(specifications)), 'dcb', 'view', specifications[`dcb.view`].objectName);
      },
      function(err) {}
    );
  }

  componentDidMount() {
    this.initData();

    var getDemands = {
      consumerCode: decodeURIComponent(this.props.match.params.searchParam) + '&businessService=PT&receiptRequired=true',
    };

    Api.commonApiPost('/billing-service/demand/_search', getDemands, {}, false, true)
      .then(res => {
        this.setState({
          dcbTableData: res.Demands,
          receiptTableData: res.CollectedReceipt,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getVal = (path, isDate) => {
    var val = _.get(this.props.formData, path);

    if (isDate && val && ((val + '').length == 13 || (val + '').length == 12) && new Date(Number(val)).getTime() > 0) {
      var _date = new Date(Number(val));
      return ('0' + _date.getDate()).slice(-2) + '/' + ('0' + (_date.getMonth() + 1)).slice(-2) + '/' + _date.getFullYear();
    }
    console.log(val);
    return typeof val != 'undefined' && (typeof val == 'string' || typeof val == 'number' || typeof val == 'boolean')
      ? val === true ? 'Yes' : val === false ? 'No' : val + ''
      : '';
  };

  printer = () => {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    var cdn = `
      <!-- Latest compiled and minified CSS -->
      <link rel="stylesheet" media="all" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

      <!-- Optional theme -->
      <link rel="stylesheet" media="all" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">  `;
    mywindow.document.write('<html><head><title> </title>');
    mywindow.document.write(cdn);
    mywindow.document.write('</head><body>');
    mywindow.document.write(document.getElementById('printable').innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    setTimeout(function() {
      mywindow.print();
      mywindow.close();
    }, 1000);

    return true;
  };

  calculateTax = (taxName, item) => {
    var demandDetailsArr = item.demandDetails;
    var total = 0;
    if (taxName == 'taxAmount') {
      for (var i = 0; i < demandDetailsArr.length; i++) {
        var total = total + demandDetailsArr[i].taxAmount;
      }
    } else if (taxName == 'collectionAmount') {
      for (var i = 0; i < demandDetailsArr.length; i++) {
        var total = total + demandDetailsArr[i].collectionAmount;
      }
    } else return 0;
    return total;
  };
  calculateBalance = (balanceType, item) => {
    var balance = 0;
    if (balanceType == 'tax') {
      balance = this.calculateTax('taxAmount', item) - this.calculateTax('collectionAmount', item);
    } else return 0;
    return balance;
  };
  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors } = this.props;
    let { handleChange, getVal, addNewCard, removeCard, printer } = this;
    var cthis = this;
    var demandsData = this.state.dcbTableData;

    return (
      <div className="Report">
        <form id="printable">
          {!_.isEmpty(mockData) &&
            mockData['dcb.view'] && (
              <ShowFields
                groups={mockData['dcb.view'].groups}
                noCols={mockData['dcb.view'].numCols}
                ui="google"
                handler={''}
                getVal={getVal}
                fieldErrors={fieldErrors}
                useTimestamp={mockData['dcb.view'].useTimestamp || false}
                addNewCard={''}
                removeCard={''}
                screen="view"
              />
            )}

          <br />
        </form>
        <div>
          <div style={{ color: '#354f57', fontSize: 14, marginLeft: '40%' }}>Note: Here Installment is one financial year.</div>
          <Card className="uiCard">
            <CardTitle title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('pt.create.button.viewdcb')}</div>} />
            <CardText>
              <Grid fluid>
                {demandsData && demandsData.length ? (
                  <Table
                    style={{
                      color: 'black',
                      fontWeight: 'normal',
                      marginBottom: 0,
                      minWidth: '100%',
                      width: 'auto',
                    }}
                    bordered
                    responsive
                  >
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center' }}>{translate('pt.create.groups.addDemand.fields.installment')}</th>
                        <th colSpan="2" style={{ textAlign: 'center' }}>
                          {translate('pt.create.groups.addDemand.demand')}
                        </th>
                        <th colSpan="2" style={{ textAlign: 'center' }}>
                          {translate('pt.create.groups.addDemand.fields.collection')}
                        </th>
                        <th colSpan="2" style={{ textAlign: 'center' }}>
                          {translate('pt.create.groups.addDemand.fields.balance')}
                        </th>
                      </tr>
                      <tr>
                        <th />
                        <th style={{ textAlign: 'center' }}>{translate('wc.create.demand.tax')}</th>
                        <th style={{ textAlign: 'center' }}>{translate('pt.create.groups.addDemand.fields.penalty')}</th>
                        <th style={{ textAlign: 'center' }}>{translate('wc.create.demand.tax')}</th>
                        <th style={{ textAlign: 'center' }}>{translate('pt.create.groups.addDemand.fields.penalty')}</th>
                        <th style={{ textAlign: 'center' }}>{translate('wc.create.demand.tax')}</th>
                        <th style={{ textAlign: 'center' }}>{translate('pt.create.groups.addDemand.fields.penalty')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demandsData.map(item => {
                        return (
                          <tr>
                            <td>{new Date(item.taxPeriodFrom).getFullYear() + ' - ' + new Date(item.taxPeriodTo).getFullYear()}</td>
                            <td>{this.calculateTax('taxAmount', item)}</td>
                            <td>{this.calculateTax('penalty', item)}</td>
                            <td>{this.calculateTax('collectionAmount', item)}</td>
                            <td>{this.calculateTax('penalty', item)}</td>
                            <td>{this.calculateBalance('tax', item)}</td>
                            <td>{this.calculateBalance('penalty', item)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                ) : null}
              </Grid>
            </CardText>
          </Card>
          <ReceiptTable receiptData={this.state.receiptTableData} />
          <HeadwiseDCB demandsData={this.state.dcbTableData} />
        </div>
      </div>
    );
  }
}

class HeadwiseDCB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHeadWiseDCB: false,
    };
  }
  popupHeadwiseDCB() {
    this.setState({ showHeadWiseDCB: true });
  }
  closeHeadWiseDCB() {
    this.setState({ showHeadWiseDCB: false });
  }
  printData = (itemName, item) => {
    if (itemName == 'demand') {
      item.demandDetails.map(unit => {
        return <td>{unit.taxAmount}</td>;
      });
    } else if (itemName == 'collection') {
      item.demandDetails.map(unit => {
        return <td>{unit.collectionAmount}</td>;
      });
    }
  };

  render() {
    var demandsData = this.props.demandsData;

    return (
      <div>
        <div>
          <div style={{ textAlign: 'center', paddingTop: 10 }}>
            <RaisedButton
              type="button"
              primary={true}
              label={translate('pt.create.button.viewdcb.headwisedcb')}
              style={{ margin: '0 5px' }}
              onClick={this.popupHeadwiseDCB.bind(this)}
            />
          </div>
          {this.state.showHeadWiseDCB ? (
            <div
              className="headwiseDCBTable"
              style={{
                position: 'fixed' /* Stay in place */,
                zIndex: 2 /* Sit on top */,
                left: 0,
                top: 0,
                height: '100%',
                width: '100%',
                overflow: 'auto' /* Enable scroll if needed */,
                backgroundColor: 'rgb(0,0,0)' /* Fallback color */,
                backgroundColor: 'rgba(127, 124, 124, 0.8)',
              }}
            >
              <Card className="uiCard">
                <CardTitle
                  title={
                    <div
                      style={{
                        color: '#354f57',
                        fontSize: 18,
                        margin: '8px 0',
                      }}
                    >
                      {translate('pt.create.button.viewdcb.headwisedcb')}
                    </div>
                  }
                />
                <CardText>
                  <Grid fluid>
                    {demandsData && demandsData.length ? (
                      <Table
                        style={{
                          color: 'black',
                          fontWeight: 'normal',
                          marginBottom: 0,
                          minWidth: '100%',
                          width: 'auto',
                        }}
                        bordered
                        responsive
                      >
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'center' }}>{translate('pt.create.groups.addDemand.fields.installment')}</th>
                            <th colSpan={demandsData[0].demandDetails.length} style={{ textAlign: 'center' }}>
                              {translate('pt.create.groups.addDemand.demand')}
                            </th>
                            <th colSpan={demandsData[0].demandDetails.length} style={{ textAlign: 'center' }}>
                              {translate('pt.create.groups.addDemand.fields.collection')}
                            </th>
                          </tr>
                          <tr>
                            <th />
                            {demandsData[0].demandDetails.map(item => {
                              return <th>{item.taxHeadMasterCode}</th>;
                            })}
                            {demandsData[0].demandDetails.map(item => {
                              return <th>{item.taxHeadMasterCode}</th>;
                            })}
                          </tr>
                        </thead>

                        <tbody>
                          {demandsData.map(item => {
                            return (
                              <tr>
                                <td>{new Date(item.taxPeriodFrom).getFullYear() + ' - ' + new Date(item.taxPeriodTo).getFullYear()}</td>
                                {item.demandDetails.map(obj => {
                                  return <td>{obj.taxAmount}</td>;
                                })}
                                {item.demandDetails.map(obj => {
                                  return <td>{obj.collectionAmount}</td>;
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    ) : null}
                  </Grid>
                  <div style={{ textAlign: 'center', paddingTop: 10 }}>
                    <RaisedButton
                      type="button"
                      primary={true}
                      label={translate('pt.create.button.viewdcb.close')}
                      style={{ margin: '0 5px' }}
                      onClick={this.closeHeadWiseDCB.bind(this)}
                    />
                  </div>
                </CardText>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

class ReceiptTable extends Component {
  constructor(props) {
    super(props);
  }
  totalReceiptAmount() {
    var total = 0;
    this.props.receiptData.map(item => {
      total = total + item.receiptAmount;
    });
    return total;
  }
  render() {
    var receiptData = this.props.receiptData;
    return (
      <div>
        <Card className="uiCard">
          <CardTitle
            title={
              <div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('collection.search.categorytype.collectedReceipts')}</div>
            }
          />
          <CardText>
            <Grid fluid>
              <Table
                style={{
                  color: 'black',
                  fontWeight: 'normal',
                  marginBottom: 0,
                  minWidth: '100%',
                  width: 'auto',
                }}
                bordered
                responsive
              >
                <thead>
                  <tr>
                    <th>{translate('collection.create.receiptNumber')}</th>
                    <th>{translate('collection.search.amount')}</th>
                    <th>{translate('collection.search.receiptDate')}</th>
                    <th>{translate('collection.search.period')}</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptData.map(item => {
                    return (
                      <tr>
                        <td>{item.receiptNumber}</td>
                        <td>{item.receiptAmount}</td>
                        <td>{new Date(item.receiptDate).getFullYear()}</td>
                        <td>{item.receiptAmount}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <th>{translate('reports.collection.total.amount')}</th>
                    <td>{this.totalReceiptAmount()}</td>
                  </tr>
                </tbody>
              </Table>
            </Grid>
          </CardText>
        </Card>
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
export default connect(mapStateToProps, mapDispatchToProps)(ViewDCB);
