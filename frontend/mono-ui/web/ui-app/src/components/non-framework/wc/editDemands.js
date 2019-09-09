import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText, CardTitle } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Upload from 'material-ui-upload/Upload';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { blue800, red500, white } from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import { translate } from '../../common/common';
import Api from '../../../api/api';

var flag = 0;
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

class AddDemand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taxHeads: [],
      demands: [],
      hasError: false,
      errorMsg: 'Invalid',
      DemandDetailBeans: [],
      searchData: [],
      locality: [],
      zone: [],
      subUsageType: [],
    };
  }

  componentDidMount() {
    //call boundary service fetch wards,location,zone data
    var currentThis = this;

    let { toggleSnackbarAndSetText, initForm, setLoadingStatus } = this.props;
    setLoadingStatus('loading');
    initForm();

    var getDemands = {
      consumerNumber: decodeURIComponent(this.props.match.params.upicNumber),
    };

    Api.commonApiPost('wcms-connection/connection/_search', getDemands, {}, false, true)
      .then(res => {
        currentThis.setState({
          searchData: res,
        });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('wcms-connection/connection/getLegacyDemandDetailBeanListByExecutionDate', getDemands, {}, false, true)
      .then(res => {
        currentThis.setState({
          DemandDetailBeans: res.DemandDetailBeans,
        });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'LOCALITY',
      hierarchyTypeName: 'LOCATION',
    })
      .then(res => {
        console.log(res);
        currentThis.setState({ locality: res.Boundary });
      })
      .catch(err => {
        currentThis.setState({
          locality: [],
        });
        console.log(err);
      });
    //=======================BASED ON APP CONFIG==========================//
    Api.commonApiPost('/wcms/masters/waterchargesconfig/_search', {
      name: 'HIERACHYTYPEFORWC',
    })
      .then(res1 => {
        if (
          res1.WaterConfigurationValue &&
          res1.WaterConfigurationValue[0] &&
          res1.WaterConfigurationValue[0].value &&
          res1.WaterConfigurationValue[0].value
        ) {
          Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
            boundaryTypeName: 'ZONE',
            hierarchyTypeName: res1.WaterConfigurationValue[0].value,
          })
            .then(res => {
              console.log(res);
              res.Boundary.unshift({ id: -1, name: 'None' });
              currentThis.setState({ zone: res.Boundary });
            })
            .catch(err => {
              currentThis.setState({
                zone: [],
              });
              console.log(err);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  submitDemand = () => {
    let self = this;
    var body = {
      DemandDetailBeans: Object.assign([], this.state.DemandDetailBeans),
    };

    self.props.setLoadingStatus('loading');
    Api.commonApiPost(
      'wcms-connection/connection/_leacydemand',
      {
        consumerNumber: decodeURIComponent(self.props.match.params.upicNumber),
        executionDate:
          self.state.searchData &&
          self.state.searchData.Connection &&
          self.state.searchData.Connection[0] &&
          self.state.searchData.Connection[0].executionDate,
      },
      body,
      false,
      true
    )
      .then(res => {
        self.props.setLoadingStatus('hide');
        self.props.toggleSnackbarAndSetText(true, translate('wc.update.message.success'), true, false);
        self.props.history.push('/searchconnection/wc');
      })
      .catch(err => {
        self.props.setLoadingStatus('hide');
        self.props.toggleSnackbarAndSetText(true, err.message, false, true);
      });
  };

  render() {
    let {
      addDemand,
      fieldErrors,
      isFormValid,
      handleChange,
      handleChangeNextOne,
      handleChangeNextTwo,
      deleteObject,
      deleteNestedObject,
      editObject,
      editIndex,
      isEditIndex,
      isAddRoom,
      addDepandencyFields,
      removeDepandencyFields,
    } = this.props;

    let { search, handleDepartment, getTaxHead, validateCollection } = this;
    let { DemandDetailBeans, searchData } = this.state;

    let cThis = this;

    const handleChangeSrchRslt = function(e, name, ind) {
      var _emps = Object.assign([], DemandDetailBeans);
      if (name == 'collectionAmount' && Number(_emps[ind]['taxAmount']) < Number(e.target.value)) {
        return cThis.props.toggleSnackbarAndSetText(true, translate('wc.create.error'), false, true);
      }

      _emps[ind][name] = e.target.value;
      cThis.setState({
        ...cThis.state,
        DemandDetailBeans: _emps,
      });
    };
    const getNameById = function(object, id, property = '') {
      if (id == '' || id == null) {
        return '';
      }
      for (var i = 0; i < object.length; i++) {
        if (property == '') {
          if (object[i].id == id) {
            return object[i].name;
          }
        } else {
          if (object[i].hasOwnProperty(property)) {
            if (object[i].id == id) {
              return object[i][property];
            }
          } else {
            return '';
          }
        }
      }
      return '';
    };
    const getNameByIde = function(object, id, property = '') {
      if (id == '' || id == null) {
        return '';
      }
      for (var i = 0; i < object.length; i++) {
        if (property == '') {
          if (object[i].id == id) {
            return object[i].name;
          }
        } else {
          if (object[i].hasOwnProperty(property)) {
            if (object[i].id == id) {
              return object[i][property];
            }
          } else {
            return '';
          }
        }
      }
      return '';
    };

    const showfields = () => {
      if (DemandDetailBeans.length > 0) {
        return DemandDetailBeans.map((item, index) => {
          return (
            <tr key={index}>
              <td data-label={translate('wc.create.demands.taxPeriod')}>{item.taxPeriod}</td>
              <td data-label={translate('wc.create.demands.taxHeadMasterCode')}>{item.taxHeadMasterCode}</td>
              <td data-label={translate('wc.create.demands.taxAmount')}>
                <TextField
                  type="number"
                  id={item.id}
                  name="taxAmount"
                  value={item.taxAmount}
                  onChange={e => {
                    handleChangeSrchRslt(e, 'taxAmount', index);
                  }}
                />
              </td>
              <td data-label={translate('wc.create.demands.collectionAmount')}>
                <TextField
                  type="number"
                  id={item.id}
                  name="collectionAmount"
                  value={item.collectionAmount}
                  onChange={e => {
                    handleChangeSrchRslt(e, 'collectionAmount', index);
                  }}
                />
              </td>
            </tr>
          );
        });
      }
    };

    const getValue = function(jPath) {
      if (
        cThis.state.searchData &&
        cThis.state.searchData.Connection &&
        cThis.state.searchData.Connection[0] &&
        cThis.state.searchData.Connection[0].withProperty
      ) {
        return (
          <div>
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.consumerNumber')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].consumerNumber}
                  </label>
                </span>
              </Col>

              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.nameOfApplicant')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].property &&
                      cThis.state.searchData.Connection[0].property.propertyOwner[0] &&
                      cThis.state.searchData.Connection[0].property.propertyOwner[0].name}
                  </label>
                </span>
              </Col>

              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.address')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].property &&
                      cThis.state.searchData.Connection[0].property.address}
                  </label>
                </span>
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.mobileNumber')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].property &&
                      cThis.state.searchData.Connection[0].property.propertyOwner[0] &&
                      cThis.state.searchData.Connection[0].property.propertyOwner[0].mobileNumber}
                  </label>
                </span>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.email')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].property &&
                      cThis.state.searchData.Connection[0].property.propertyOwner[0] &&
                      cThis.state.searchData.Connection[0].property.propertyOwner[0].emailId}
                  </label>
                </span>
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.adharNumber')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].property &&
                      cThis.state.searchData.Connection[0].property.propertyOwner[0] &&
                      cThis.state.searchData.Connection[0].property.propertyOwner[0].aadhaarNumber}
                  </label>
                </span>
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.locality')}</span>
                  </label>
                  <br />
                  <label>
                    {getNameById(
                      cThis.state.locality,
                      cThis.state.searchData &&
                        cThis.state.searchData.Connection &&
                        cThis.state.searchData.Connection[0] &&
                        cThis.state.searchData.Connection[0].property &&
                        cThis.state.searchData.Connection[0].property.locality
                    )}
                  </label>
                </span>
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.zone')}</span>
                  </label>
                  <br />
                  <label>
                    {getNameById(
                      cThis.state.zone,
                      cThis.state.searchData &&
                        cThis.state.searchData.Connection &&
                        cThis.state.searchData.Connection[0] &&
                        cThis.state.searchData.Connection[0].property &&
                        cThis.state.searchData.Connection[0].property.zone
                    )}
                  </label>
                </span>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.noOfFloors')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].property &&
                      cThis.state.searchData.Connection[0].property.NoOfFlats}
                  </label>
                </span>
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.connectionDetails.connectionType')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].connectionType}
                  </label>
                </span>
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.connectionDetails.usageType')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].usageTypeName}
                  </label>
                </span>
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.connectionDetails.subUsageType')}</span>
                  </label>
                  <br />
                  <label>
                    {
                      (cThis.state.subUsageType,
                      cThis.state.searchData &&
                        cThis.state.searchData.Connection &&
                        cThis.state.searchData.Connection[0] &&
                        cThis.state.searchData.Connection[0] &&
                        cThis.state.searchData.Connection[0].subUsageTypeName)
                    }
                  </label>
                </span>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.propertyTaxDue')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].property.propertyTaxDue}
                  </label>
                </span>
              </Col>
            </Row>
          </div>
        );
      } else {
        return (
          <div>
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.consumerNumber')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].consumerNumber}
                  </label>
                </span>
              </Col>

              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.nameOfApplicant')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].connectionOwners &&
                      cThis.state.searchData.Connection[0].connectionOwners[0].name}
                  </label>
                </span>
              </Col>

              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.address')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].address &&
                      cThis.state.searchData.Connection[0].address.addressLine1}
                  </label>
                </span>
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.mobileNumber')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].connectionOwners &&
                      cThis.state.searchData.Connection[0].connectionOwners[0].mobileNumber}
                  </label>
                </span>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.email')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].connectionOwners &&
                      cThis.state.searchData.Connection[0].connectionOwners[0].emailId}
                  </label>
                </span>
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.adharNumber')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].connectionOwners &&
                      cThis.state.searchData.Connection[0].connectionOwners[0].aadhaarNumber}
                  </label>
                </span>
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.locality')}</span>
                  </label>
                  <br />
                  <label>
                    {getNameById(
                      cThis.state.locality,
                      cThis.state.searchData &&
                        cThis.state.searchData.Connection &&
                        cThis.state.searchData.Connection[0] &&
                        cThis.state.searchData.Connection[0].connectionLocation &&
                        cThis.state.searchData.Connection[0].connectionLocation.locationBoundary &&
                        cThis.state.searchData.Connection[0].connectionLocation.locationBoundary.id
                    )}
                  </label>
                </span>
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.applicantDetails.zone')}</span>
                  </label>
                  <br />
                  <label>
                    {getNameById(
                      cThis.state.zone,
                      cThis.state.searchData &&
                        cThis.state.searchData.Connection &&
                        cThis.state.searchData.Connection[0] &&
                        cThis.state.searchData.Connection[0].connectionLocation &&
                        cThis.state.searchData.Connection[0].connectionLocation.revenueBoundary &&
                        cThis.state.searchData.Connection[0].connectionLocation.revenueBoundary.id
                    )}
                  </label>
                </span>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.connectionDetails.connectionType')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].connectionType}
                  </label>
                </span>
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.connectionDetails.usageType')}</span>
                  </label>
                  <br />
                  <label>
                    {cThis.state.searchData &&
                      cThis.state.searchData.Connection &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0] &&
                      cThis.state.searchData.Connection[0].usageTypeName}
                  </label>
                </span>
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                <span>
                  <label>
                    <span style={{ fontWeight: '500' }}>{translate('wc.create.groups.connectionDetails.subUsageType')}</span>
                  </label>
                  <br />
                  <label>
                    {
                      (cThis.state.subUsageType,
                      cThis.state.searchData &&
                        cThis.state.searchData.Connection &&
                        cThis.state.searchData.Connection[0] &&
                        cThis.state.searchData.Connection[0] &&
                        cThis.state.searchData.Connection[0].subUsageTypeName)
                    }
                  </label>
                </span>
              </Col>
            </Row>
          </div>
        );
      }
    };

    return (
      <div>
        <Card className="uiCard">
          <CardTitle
            style={styles.reducePadding}
            title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('wc.create.demand.applicantParticular')}</div>}
            subtitle={<div style={{ color: '#354f57', fontSize: 15, margin: '8px 0' }}>{translate('wc.create.demand.basicDetails')}</div>}
          />
          <br />
          <CardText style={styles.reducePadding}>
            <Grid fluid>
              {getValue(cThis.state.searchData && cThis.state.searchData.Connection && cThis.state.searchData.Connection[0])}
              <br />
              <br />
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
                    <th style={{ textAlign: 'center' }}>{translate('wc.create.demand.tax')}</th>
                    <th style={{ textAlign: 'center' }}>{translate('wc.create.demands')}</th>
                    <th style={{ textAlign: 'center' }}>{translate('pt.create.groups.addDemand.fields.collection')}</th>
                  </tr>
                </thead>
                <tbody>{showfields(cThis.state.searchData && cThis.state.searchData.Connection && cThis.state.searchData.Connection[0])}</tbody>
              </Table>
            </Grid>
          </CardText>
        </Card>
        <div style={{ textAlign: 'center' }}>
          <br />
          {this.state.hasError && (
            <p style={{ color: 'Red', textAlign: 'center' }}>
              Collection entered should be equal to or less than the Demand<br />
            </p>
          )}

          <RaisedButton
            type="button"
            label="Update"
            disabled={this.state.hasError}
            primary={true}
            onClick={() => {
              this.submitDemand();
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  addDemand: state.form.form,
  fieldErrors: state.form.fieldErrors,
  editIndex: state.form.editIndex,
  addRoom: state.form.addRoom,
});

const mapDispatchToProps = dispatch => ({
  initForm: () => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: [],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },
  handleChange: (e, property, isRequired, pattern) => {
    dispatch({
      type: 'HANDLE_CHANGE',
      property,
      value: e.target.value,
      isRequired,
      pattern,
    });
  },

  handleChangeNextOne: (e, property, propertyOne, isRequired, pattern) => {
    dispatch({
      type: 'HANDLE_CHANGE_NEXT_ONE',
      property,
      propertyOne,
      value: e.target.value,
      isRequired,
      pattern,
    });
  },
  addNestedFormData: (formArray, formData) => {
    dispatch({
      type: 'PUSH_ONE',
      formArray,
      formData,
    });
  },

  addNestedFormDataTwo: (formObject, formArray, formData) => {
    dispatch({
      type: 'PUSH_ONE_ARRAY',
      formObject,
      formArray,
      formData,
    });
  },

  deleteObject: (property, index) => {
    dispatch({
      type: 'DELETE_OBJECT',
      property,
      index,
    });
  },

  deleteNestedObject: (property, propertyOne, index) => {
    dispatch({
      type: 'DELETE_NESTED_OBJECT',
      property,
      propertyOne,
      index,
    });
  },

  editObject: (objectName, object, isEditable) => {
    dispatch({
      type: 'EDIT_OBJECT',
      objectName,
      object,
      isEditable,
    });
  },

  resetObject: object => {
    dispatch({
      type: 'RESET_OBJECT',
      object,
    });
  },

  updateObject: (objectName, object) => {
    dispatch({
      type: 'UPDATE_OBJECT',
      objectName,
      object,
    });
  },

  updateNestedObject: (objectName, objectArray, object) => {
    dispatch({
      type: 'UPDATE_NESTED_OBJECT',
      objectName,
      objectArray,
      object,
    });
  },

  isEditIndex: index => {
    dispatch({
      type: 'EDIT_INDEX',
      index,
    });
  },

  addDepandencyFields: property => {
    dispatch({
      type: 'ADD_REQUIRED',
      property,
    });
  },

  removeDepandencyFields: property => {
    dispatch({
      type: 'REMOVE_REQUIRED',
      property,
    });
  },

  isAddRoom: room => {
    dispatch({
      type: 'ADD_ROOM',
      room,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(AddDemand);
