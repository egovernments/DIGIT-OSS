import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Row, Col, Table, DropdownButton, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import { brown500, red500, white, orange800 } from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import { List, ListItem } from 'material-ui/List';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { translate } from '../../../common/common';
import Api from '../../../../api/api';

const $ = require('jquery');

var flag = 0;
const styles = {
  errorStyle: {
    color: red500,
  },
  underlineStyle: {
    borderColor: brown500,
  },
  underlineFocusStyle: {
    borderColor: brown500,
  },
  floatingLabelStyle: {
    color: brown500,
  },
  floatingLabelFocusStyle: {
    color: brown500,
  },
  customWidth: {
    width: 100,
  },
  bold: {
    margin: '15px 0',
  },
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

const getNameByCode = function(object, code, property = '') {
  if (code == '' || code == null) {
    return '';
  }
  for (var i = 0; i < object.length; i++) {
    if (property == '') {
      if (object[i].code == code) {
        return object[i].name;
      }
    } else {
      if (object[i].hasOwnProperty(property)) {
        if (object[i].code == code) {
          return object[i][property];
        }
      } else {
        return '';
      }
    }
  }
  return '';
};

class ViewProperty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resultList: [],
      unitType: [{ code: 'FLAT', name: 'Flat' }, { code: 'ROOM', name: 'Room' }],
      floorNumber: [
        { code: 1, name: 'Basement-3' },
        { code: 2, name: 'Basement-2' },
        { code: 3, name: 'Basement-1' },
        { code: 4, name: 'Ground Floor' },
      ],
      gaurdianRelation: [
        { code: 'FATHER', name: 'Father' },
        { code: 'HUSBAND', name: 'Husband' },
        { code: 'MOTHER', name: 'Mother' },
        { code: 'OTHERS', name: 'Others' },
      ],
      gender: [{ code: 'MALE', name: 'Male' }, { code: 'FEMALE', name: 'Female' }, { code: 'OTHERS', name: 'Others' }],
      ownerType: [
        { code: 'Ex_Service_man', name: 'Ex-Service man' },
        { code: 'Freedom_Fighter', name: 'Freedom Fighter' },
        { code: 'Freedom_fighers_wife', name: "Freedom figher's wife" },
      ],
      propertytypes: [],
      propertysubtypes: [],
      apartments: [],
      departments: [],
      floortypes: [],
      rooftypes: [],
      walltypes: [],
      woodtypes: [],
      structureclasses: [],
      occupancies: [],
      ward: [],
      locality: [],
      zone: [],
      block: [],
      street: [],
      revanue: [],
      election: [],
      usages: [],
      creationReason: [{ code: 'NEWPROPERTY', name: 'New Property' }, { code: 'SUBDIVISION', name: 'Bifurcation' }],
      demands: [],
      revenueBoundary: [],
      adminBoundary: [],
      locationBoundary: [],
    };
  }

  componentWillMount() {}

  componentDidMount() {
    var currentThis = this;

    let { showTable, changeButtonText, propertyTaxSearch, setLoadingStatus, toggleSnackbarAndSetText } = this.props;

    setLoadingStatus('loading');

    var query;

    if (this.props.match.params.type) {
      query = {
        propertyId: this.props.match.params.searchParam,
      };
    } else {
      query = {
        upicNumber: this.props.match.params.searchParam,
      };
    }

    Api.commonApiPost('pt-property/properties/_search', query, {}, false, true)
      .then(res => {
        setLoadingStatus('hide');
        if (res.hasOwnProperty('Errors')) {
          toggleSnackbarAndSetText(true, 'Server returned unexpected error. Please contact system administrator.');
        } else {
          var userRequest = JSON.parse(localStorage.getItem('userRequest'));
          if (res.hasOwnProperty('properties') && res.properties.length > 0) {
            if (res.properties[0].boundary.revenueBoundary.code) {
              var revenueQuery = {
                'Boundary.code': res.properties[0].boundary.revenueBoundary.code,
                'Boundary.tenantId': userRequest.tenantId,
              };
              Api.commonApiGet('egov-location/boundarys', revenueQuery)
                .then(res => {
                  console.log(res);
                  currentThis.setState({
                    revenueBoundary: res.Boundary[0],
                  });
                })
                .catch(err => {
                  console.log(err);
                });
            }

            if (res.properties[0].boundary.locationBoundary.code) {
              var locationQuery = {
                'Boundary.code': res.properties[0].boundary.locationBoundary.code,
                'Boundary.tenantId': userRequest.tenantId,
              };

              Api.commonApiGet('egov-location/boundarys', locationQuery)
                .then(res => {
                  currentThis.setState({
                    locationBoundary: res.Boundary[0],
                  });
                })
                .catch(err => {
                  console.log(err);
                });
            }

            if (res.properties[0].boundary.adminBoundary.code) {
              var adminQuery = {
                'Boundary.code': res.properties[0].boundary.adminBoundary.code,
                'Boundary.tenantId': userRequest.tenantId,
              };

              Api.commonApiGet('egov-location/boundarys', adminQuery)
                .then(res => {
                  currentThis.setState({
                    adminBoundary: res.Boundary[0],
                  });
                })
                .catch(err => {
                  console.log(err);
                });
            }

            //get propertySubType
            var ptQuery = {
              parent: res.properties[0].propertyDetail.propertyType,
            };
            Api.commonApiPost('pt-property/property/propertytypes/_search', ptQuery, {}, false, true)
              .then(res => {
                currentThis.setState({ propertysubtypes: res.propertyTypes });
                console.log('Property Sub Type', res);
              })
              .catch(err => {
                currentThis.setState({
                  propertysubtypes: [],
                });
              });
          }

          var units = [];
          var floors = res.properties[0].propertyDetail.floors;

          for (var i = 0; i < floors.length; i++) {
            for (var j = 0; j < floors[i].units.length; j++) {
              floors[i].units[j].floorNo = floors[i].floorNo;
              units.push(floors[i].units[j]);
            }
          }

          res.properties[0].propertyDetail.floors = units;

          currentThis.setState({
            resultList: res.properties,
          });

          var tQuery = {
            businessService: 'PT',
            consumerCode: res.properties[0].upicNumber || res.properties[0].propertyDetail.applicationNo,
          };

          Api.commonApiPost('billing-service/demand/_search', tQuery, {})
            .then(res => {
              currentThis.setState({ demands: res.Demands });
            })
            .catch(err => {
              currentThis.setState({ demands: [] });
              console.log(err);
            });
        }
      })
      .catch(err => {
        setLoadingStatus('hide');
        console.log(err);
        currentThis.setState({
          resultList: [],
        });
      });

    Api.commonApiPost('pt-property/property/propertytypes/_search', {}, {}, false, true)
      .then(res => {
        currentThis.setState({ propertytypes: res.propertyTypes });
      })
      .catch(err => {
        currentThis.setState({
          propertytypes: [],
        });
      });

    Api.commonApiPost('pt-property/property/departments/_search', {}, {}, false, true)
      .then(res => {
        currentThis.setState({
          departments: res.departments,
        });
      })
      .catch(err => {
        console.log(err);
        console.log(err);
      });

    Api.commonApiPost('pt-property/property/floortypes/_search', {}, {}, false, true)
      .then(res => {
        res.floorTypes.unshift({ code: -1, name: 'None' });
        currentThis.setState({ floortypes: res.floorTypes });
      })
      .catch(err => {
        currentThis.setState({
          floortypes: [],
        });
        console.log(err);
      });

    Api.commonApiPost('pt-property/property/rooftypes/_search', {}, {}, false, true)
      .then(res => {
        currentThis.setState({ rooftypes: res.roofTypes });
      })
      .catch(err => {
        currentThis.setState({
          rooftypes: [],
        });
        console.log(err.message);
      });

    Api.commonApiPost('pt-property/property/walltypes/_search', {}, {}, false, true)
      .then(res => {
        currentThis.setState({ walltypes: res.wallTypes });
      })
      .catch(err => {
        currentThis.setState({
          walltypes: [],
        });
        console.log(err.message);
      });

    Api.commonApiPost('pt-property/property/woodtypes/_search', {}, {}, false, true)
      .then(res => {
        currentThis.setState({ woodtypes: res.woodTypes });
      })
      .catch(err => {
        currentThis.setState({
          woodtypes: [],
        });
      });

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'LOCALITY',
      hierarchyTypeName: 'LOCATION',
    })
      .then(res => {
        currentThis.setState({ locality: res.Boundary });
      })
      .catch(err => {
        currentThis.setState({
          locality: [],
        });
        console.log(err.message);
      });

    Api.commonApiPost('pt-property/property/apartment/_search', {}, {}, false, true)
      .then(res => {
        currentThis.setState({ apartments: res.apartments });
      })
      .catch(err => {
        currentThis.setState({
          apartments: [],
        });
        console.log(err.message);
      });

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'STREET',
      hierarchyTypeName: 'LOCATION',
    })
      .then(res => {
        currentThis.setState({ street: res.Boundary });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'WARD',
      hierarchyTypeName: 'ADMINISTRATION',
    })
      .then(res => {
        currentThis.setState({ election: res.Boundary });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('pt-property/property/structureclasses/_search')
      .then(res => {
        currentThis.setState({ structureclasses: res.structureClasses });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('pt-property/property/occuapancies/_search')
      .then(res => {
        currentThis.setState({ occupancies: res.occuapancyMasters });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('pt-property/property/usages/_search')
      .then(res => {
        currentThis.setState({ usages: res.usageMasters });
      })
      .catch(err => {
        console.log(err);
      });

    //=======================BASED ON APP CONFIG==========================//
    Api.commonApiPost('pt-property/property/appconfiguration/_search', {
      keyName: 'PT_RevenueBoundaryHierarchy',
    })
      .then(res1 => {
        if (res1.appConfigurations && res1.appConfigurations[0] && res1.appConfigurations[0].values && res1.appConfigurations[0].values[0]) {
          Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
            boundaryTypeName: 'ZONE',
            hierarchyTypeName: res1.appConfigurations[0].values[0],
          })
            .then(res => {
              currentThis.setState({ zone: res.Boundary });
            })
            .catch(err => {
              currentThis.setState({
                zone: [],
              });
              console.log(err);
            });

          Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
            boundaryTypeName: 'WARD',
            hierarchyTypeName: res1.appConfigurations[0].values[0],
          })
            .then(res => {
              currentThis.setState({ ward: res.Boundary });
            })
            .catch(err => {
              currentThis.setState({
                ward: [],
              });
              console.log(err);
            });

          Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
            boundaryTypeName: 'BLOCK',
            hierarchyTypeName: res1.appConfigurations[0].values[0],
          })
            .then(res => {
              currentThis.setState({ block: res.Boundary });
            })
            .catch(err => {
              console.log(err);
            });

          Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
            boundaryTypeName: 'REVENUE',
            hierarchyTypeName: res1.appConfigurations[0].values[0],
          })
            .then(res => {
              currentThis.setState({ revanue: res.Boundary });
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          currentThis.setState({
            zone: [],
            ward: [],
            block: [],
            revanue: [],
          });
        }
      })
      .catch(err => {
        currentThis.setState({
          zone: [],
          ward: [],
          block: [],
          revanue: [],
        });
      });
    //====================================================================//

    var temp = this.state.floorNumber;

    for (var i = 5; i <= 34; i++) {
      var label = 'th';
      if (i - 4 == 1) {
        label = 'st';
      } else if (i - 4 == 2) {
        label = 'nd';
      } else if (i - 4 == 3) {
        label = 'rd';
      }
      var commonFloors = {
        code: i,
        name: i - 4 + label + ' Floor',
      };
      temp.push(commonFloors);
    }

    this.setState({
      floorNumber: temp,
    });
  }

  componentWillUnmount() {}

  componentWillUpdate() {}

  componentDidUpdate(prevProps, prevState) {}

  getBoundary = bId => {
    var userRequest = JSON.parse(localStorage.getItem('userRequest'));

    var query = {
      'Boundary.code': bId,
      'Boundary.tenantId': userRequest.tenantId,
    };

    Api.commonApiGet('egov-location/boundarys', query)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    let { resultList } = this.state;

    var totalAmount = 0;
    var taxCollected = 0;

    let currentThis = this;

    return (
      <div className="viewProperty">
        {resultList.length != 0 &&
          resultList.map((item, index) => {
            return (
              <Grid fluid key={index}>
                <br />
                <Card className="uiCard">
                  <CardHeader
                    style={{ paddingBottom: 0 }}
                    title={<div style={styles.headerStyle}>{translate('pt.create.groups.ownerDetails')}</div>}
                  />
                  <CardText>
                    <Col xs={12} md={12}>
                      <Table
                        id="floorDetailsTable"
                        style={{
                          color: 'black',
                          fontWeight: 'normal',
                          marginBottom: 0,
                        }}
                        bordered
                        responsive
                      >
                        <thead>
                          <th>#</th>
                          <th>{translate('pt.create.groups.ownerDetails.fields.aadhaarNumber')}</th>
                          <th>{translate('pt.create.groups.ownerDetails.fields.phoneNumber')}</th>
                          <th>{translate('pt.create.groups.ownerDetails.fields.ownerName')}</th>
                          <th>{translate('pt.create.groups.ownerDetails.fields.gender')}</th>
                          <th>{translate('pt.create.groups.ownerDetails.fields.email')}</th>
                          <th>{translate('pt.create.groups.ownerDetails.fields.pan')}</th>
                          <th>{translate('pt.create.groups.ownerDetails.fields.guardian')}</th>
                          <th>{translate('pt.create.groups.ownerDetails.fields.primaryOwner')}</th>
                          <th>{translate('pt.create.groups.ownerDetails.fields.percentageOfOwnerShip')}</th>
                        </thead>
                        <tbody>
                          {item.owners.length != 0 &&
                            item.owners.map((owner, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td> {owner.aadhaarNumber ? owner.aadhaarNumber : translate('pt.search.searchProperty.fields.na')}</td>
                                  <td> {owner.mobileNumber ? owner.mobileNumber : translate('pt.search.searchProperty.fields.na')}</td>
                                  <td>{owner.name ? owner.name : translate('pt.search.searchProperty.fields.na')}</td>
                                  <td>
                                    {' '}
                                    {owner.gender
                                      ? getNameByCode(currentThis.state.gender, owner.gender)
                                      : translate('pt.search.searchProperty.fields.na')}
                                  </td>
                                  <td>{owner.emailId ? owner.emailId : translate('pt.search.searchProperty.fields.na')}</td>
                                  <td>{owner.pan ? owner.pan : translate('pt.search.searchProperty.fields.na')}</td>
                                  <td>{owner.fatherOrHusbandName ? owner.fatherOrHusbandName : translate('pt.search.searchProperty.fields.na')}</td>
                                  <td>{owner.isPrimaryOwner ? 'Yes' : 'No'}</td>
                                  <td>{owner.ownerShipPercentage ? owner.ownerShipPercentage : translate('pt.search.searchProperty.fields.na')}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </Table>
                    </Col>
                    <div className="clearfix" />
                  </CardText>
                </Card>
                <Card className="uiCard">
                  <CardHeader
                    style={{ paddingBottom: 0 }}
                    title={<div style={styles.headerStyle}>{translate('pt.create.groups.propertyDetails')}</div>}
                  />
                  <CardText>
                    <Col md={12} xs={12}>
                      <Row>
                        {item.channel == 'DATA_ENTRY' && (
                          <Col xs={12} md={3} style={styles.bold}>
                            <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.oldPropertyNo')}</div>
                            {item.oldUpicNumber || translate('pt.search.searchProperty.fields.na')}
                          </Col>
                        )}
                        {item.channel == 'DATA_ENTRY' && (
                          <Col xs={12} md={3} style={styles.bold}>
                            <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyNo')}</div>
                            {item.upicNumber || translate('pt.search.searchProperty.fields.na')}
                          </Col>
                        )}
                        <Col xs={12} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.assessmentDetails.fields.propertyType')}</div>
                          {getNameByCode(this.state.propertytypes, item.propertyDetail.propertyType) ||
                            translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.registrationDocNo')}</div>
                          {item.propertyDetail.regdDocNo || translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.assessmentDetails.fields.creationReason')}</div>
                          {getNameByCode(this.state.creationReason, item.creationReason) || translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>
                            {translate('pt.create.groups.propertyAddress.fields.AssessmentNumberOfParentProperty')}
                          </div>
                          {translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.effectiveDate')}</div>
                          {item.occupancyDate ? item.occupancyDate.split(' ')[0] : translate('pt.search.searchProperty.fields.na')}
                        </Col>

                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.appartment')}</div>
                          {getNameByCode(this.state.apartments, item.propertyDetail.apartment) || translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.registrationDocDate')}</div>
                          {item.propertyDetail.regdDocDate
                            ? item.propertyDetail.regdDocDate.split(' ')[0]
                            : translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.assessmentDate')}</div>
                          {item.assessmentDate ? item.assessmentDate.split(' ')[0] : translate('pt.search.searchProperty.fields.na')}
                        </Col>
                      </Row>
                    </Col>
                    <div className="clearfix" />
                  </CardText>
                </Card>

                <Card className="uiCard">
                  <CardHeader
                    style={{ paddingBottom: 0 }}
                    title={<div style={styles.headerStyle}>{translate('pt.create.groups.propertyAddress.fields.addressDetails')}</div>}
                  />
                  <CardText>
                    <Col md={12} xs={12}>
                      <Row>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.referancePropertyNumber')}</div>
                          {translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.doorNo')}</div>
                          {item.address.addressNumber}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.propertyAddress')}</div>
                          {item.address.addressNumber ? item.address.addressNumber + ', ' : ''}
                          {item.address.addressLine1 ? getNameByCode(this.state.locality, item.address.addressLine1) + ', ' : ''}
                          {item.address.addressLine2 ? item.address.addressLine2 + ', ' : ''}
                          {item.address.landmark ? item.address.landmark + ', ' : ''}
                          {item.address.city ? item.address.city : ''}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.zoneNo')}</div>
                          {this.state.revenueBoundary.name || translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.blockNo')}</div>
                          NA
                        </Col>

                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.electionWard')}</div>
                          {getNameByCode(this.state.election, item.boundary.adminBoundary.code) || translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('employee.Employee.fields.correspondenceAddress')}</div>

                          {item.owners.length != 0 &&
                            item.owners.map((owner, index) => {
                              if (owner.isPrimaryOwner) {
                                return owner.correspondenceAddress;
                              } else return 'NA';
                            })}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.wardNo')}</div>
                          NA
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.locality')}</div>
                          {getNameByCode(this.state.locality, item.address.addressLine1) || translate('pt.search.searchProperty.fields.na')}
                        </Col>

                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.ebBlock')}</div>
                          {translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.blockNo')}</div>
                          {translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.street')}</div>
                          {translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.revenueCircle')}</div>
                          {translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.pin')}</div>
                          {item.address.pincode || translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.totalFloors')}</div>
                          {item.propertyDetail.noOfFloors || translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.plotNo')}</div>
                          {item.address.plotNo || translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.ctsNo')}</div>
                          {item.address.surveyNo || translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.landMark')}</div>
                          {item.address.landmark || translate('pt.search.searchProperty.fields.na')}
                        </Col>
                      </Row>
                    </Col>
                    <div className="clearfix" />
                  </CardText>
                </Card>

                <Card className="uiCard">
                  <CardHeader
                    style={{ paddingBottom: 0 }}
                    title={<div style={styles.headerStyle}>{translate('pt.create.groups.assessmentDetails')}</div>}
                  />
                  <CardText>
                    <Col md={12} xs={12}>
                      <Row>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.assessmentDetails.fields.creationReason')}</div>
                          {getNameByCode(this.state.creationReason, item.creationReason) || translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.assessmentDetails.fields.propertyType')}</div>
                          {getNameByCode(this.state.propertytypes, item.propertyDetail.propertyType) ||
                            translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.assessmentDetails.fields.propertySubType')}</div>
                          {getNameByCode(this.state.propertysubtypes, item.propertyDetail.category) ||
                            translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.assessmentDetails.fields.usageType')}</div>
                          {getNameByCode(this.state.usages, item.propertyDetail.usage) || translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.assessmentDetails.fields.usageSubType')}</div>
                          {translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.assessmentDetails.fields.extentOfSite')}</div>
                          {item.propertyDetail.sitalArea || translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.assessmentDetails.fields.sequenceNo')}</div>
                          {item.sequenceNo || translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.floorDetails.fields.buildingPermissionNumber')}</div>
                          {item.propertyDetail.bpaNo || translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.floorDetails.fields.buildingPermissionDate')}</div>
                          {item.propertyDetail.bpaDate ? item.propertyDetail.bpaDate.split(' ')[0] : translate('pt.search.searchProperty.fields.na')}
                        </Col>
                      </Row>
                    </Col>
                    <div className="clearfix" />
                  </CardText>
                </Card>
                <Card className="uiCard">
                  <CardHeader
                    style={{ paddingBottom: 0 }}
                    title={<div style={styles.headerStyle}>{translate('pt.create.groups.propertyFactors')}</div>}
                  />
                  <CardText>
                    <Col md={12} xs={12}>
                      <Row>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyFactors.fields.toiletFactor')}</div>
                          {item.propertyDetail.hasOwnProperty('factors')
                            ? item.propertyDetail.factors != null && item.propertyDetail.factors.length != 0
                              ? item.propertyDetail.factors[0].value || translate('pt.search.searchProperty.fields.na')
                              : translate('pt.search.searchProperty.fields.na')
                            : translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyFactors.fields.roadFactor')}</div>
                          {item.propertyDetail.hasOwnProperty('factors')
                            ? item.propertyDetail.factors != null && item.propertyDetail.factors.length != 0
                              ? item.propertyDetail.factors[1].value || translate('pt.search.searchProperty.fields.na')
                              : translate('pt.search.searchProperty.fields.na')
                            : translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyFactors.fields.liftFactor')}</div>
                          {item.propertyDetail.hasOwnProperty('factors')
                            ? item.propertyDetail.factors != null && item.propertyDetail.factors.length != 0
                              ? item.propertyDetail.factors[2].value || translate('pt.search.searchProperty.fields.na')
                              : translate('pt.search.searchProperty.fields.na')
                            : translate('pt.search.searchProperty.fields.na')}
                        </Col>
                        <Col xs={4} md={3} style={styles.bold}>
                          <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyFactors.fields.parkingFactor')}</div>
                          {item.propertyDetail.hasOwnProperty('factors')
                            ? item.propertyDetail.factors != null && item.propertyDetail.factors.length != 0
                              ? item.propertyDetail.factors[3].value || translate('pt.search.searchProperty.fields.na')
                              : translate('pt.search.searchProperty.fields.na')
                            : translate('pt.search.searchProperty.fields.na')}
                        </Col>
                      </Row>
                    </Col>
                    <div className="clearfix" />
                  </CardText>
                </Card>
                <Card className="uiCard">
                  <CardHeader
                    style={{ paddingBottom: 0 }}
                    title={<div style={styles.headerStyle}>{translate('pt.create.groups.floorDetails')}</div>}
                  />
                  <CardText>
                    <Col xs={12} md={12}>
                      <Table
                        id="floorDetailsTable"
                        style={{
                          color: 'black',
                          fontWeight: 'normal',
                          marginBottom: 0,
                        }}
                        bordered
                        responsive
                      >
                        <thead style={{ backgroundColor: '#607b84', color: 'white' }}>
                          <tr>
                            <th>#</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.floorNumber')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.unitType')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.unitNumber')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.constructionClass')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.usageType')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.usageSubType')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.firmName')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.occupancy')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.occupantName')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.annualRent')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.manualArv')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.constructionStartDate')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.constructionEndDate')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.effectiveFromDate')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.unstructuredLand')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.length')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.breadth')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.plinthArea')}</th>
                            <th>{translate('pt.create.groups.floorDetails.fields.occupancyCertificateNumber')}</th>
                            <th>{translate('pt.create.groups.propertyAddress.fields.buildingCost')}</th>
                            <th>{translate('pt.create.groups.propertyAddress.fields.landCost')}</th>
                            <th>{translate('pt.create.groups.propertyAddress.fields.carpetArea')}</th>
                            <th>{translate('pt.create.groups.propertyAddress.fields.assessableArea')}</th>
                            <th>{translate('pt.create.groups.propertyAddress.fields.exemptedArea')}</th>
                            <th>{translate('pt.create.groups.assessmentDetails.fields.isLegal')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.propertyDetail.floors.length != 0 &&
                            item.propertyDetail.floors.map(function(i, index) {
                              if (i) {
                                return (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                      {getNameByCode(currentThis.state.floorNumber, parseInt(i.floorNo) + 1) ||
                                        translate('pt.search.searchProperty.fields.na')}
                                    </td>
                                    <td>
                                      {getNameByCode(currentThis.state.unitType, i.unitType) || translate('pt.search.searchProperty.fields.na')}
                                    </td>
                                    <td>{i.unitNo || translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>
                                      {getNameByCode(currentThis.state.structureclasses, i.structure) ||
                                        translate('pt.search.searchProperty.fields.na')}
                                    </td>
                                    <td>{getNameByCode(currentThis.state.usages, i.usage) || translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>
                                      {getNameByCode(currentThis.state.usages, i.usageSubType) || translate('pt.search.searchProperty.fields.na')}
                                    </td>
                                    <td>{i.firmName || translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>
                                      {getNameByCode(currentThis.state.occupancies, i.occupancyType) ||
                                        translate('pt.search.searchProperty.fields.na')}
                                    </td>
                                    <td>{i.occupierName || translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>{i.annualRent || translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>{parseFloat(i.manualArv).toString() || translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>
                                      {i.constructionStartDate
                                        ? i.constructionStartDate.split(' ')[0]
                                        : translate('pt.search.searchProperty.fields.na')}
                                    </td>
                                    <td>
                                      {i.constCompletionDate ? i.constCompletionDate.split(' ')[0] : translate('pt.search.searchProperty.fields.na')}
                                    </td>
                                    <td>{i.occupancyDate ? i.occupancyDate.split(' ')[0] : translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>{(i.isStructured == true ? 'Yes' : i.isStructured) || translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>{parseFloat(i.length) || translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>{parseFloat(i.width) || translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>{i.builtupArea || translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>{i.occupancyCertiNumber || translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>{i.buildingCost || translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>{i.landCost || translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>{i.carpetArea || translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>{i.assessableArea || translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>{i.exemptionArea || translate('pt.search.searchProperty.fields.na')}</td>
                                    <td>{i.isAuthorised ? 'Yes' : 'No'}</td>
                                  </tr>
                                );
                              }
                            })}
                        </tbody>
                      </Table>
                    </Col>
                    <div className="clearfix" />
                  </CardText>
                </Card>
                {item.channel == 'DATA_ENTRY' && (
                  <Card className="uiCard">
                    <CardHeader
                      style={{ paddingBottom: 0 }}
                      title={<div style={styles.headerStyle}>{translate('pt.create.groups.constructionDetails')}</div>}
                    />
                    <CardText>
                      <Col md={12} xs={12}>
                        <Row>
                          <Col xs={4} md={3} style={styles.bold}>
                            <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.currentAssessmentDate')}</div>
                            {item.propertyDetail.hasOwnProperty('assessmentDates') && item.propertyDetail.assessmentDates != null
                              ? item.propertyDetail.assessmentDates[1] != undefined
                                ? item.propertyDetail.assessmentDates[1].date || translate('pt.search.searchProperty.fields.na')
                                : translate('pt.search.searchProperty.fields.na')
                              : translate('pt.search.searchProperty.fields.na')}
                          </Col>
                          <Col xs={4} md={3} style={styles.bold}>
                            <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.firstAssessmentDate')}</div>
                            {item.propertyDetail.hasOwnProperty('assessmentDates') && item.propertyDetail.assessmentDates != null
                              ? item.propertyDetail.assessmentDates[0] != undefined
                                ? item.propertyDetail.assessmentDates[0].date || translate('pt.search.searchProperty.fields.na')
                                : translate('pt.search.searchProperty.fields.na')
                              : translate('pt.search.searchProperty.fields.na')}
                          </Col>
                          <Col xs={4} md={3} style={styles.bold}>
                            <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.revisedAssessmentDate')}</div>
                            {item.propertyDetail.hasOwnProperty('assessmentDates') && item.propertyDetail.assessmentDates != null
                              ? item.propertyDetail.assessmentDates[2] != undefined
                                ? item.propertyDetail.assessmentDates[2].date || translate('pt.search.searchProperty.fields.na')
                                : translate('pt.search.searchProperty.fields.na')
                              : translate('pt.search.searchProperty.fields.na')}
                          </Col>
                          <Col xs={4} md={3} style={styles.bold}>
                            <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.propertyAddress.fields.lastAssessmentDate')}</div>
                            {item.propertyDetail.hasOwnProperty('assessmentDates') && item.propertyDetail.assessmentDates != null
                              ? item.propertyDetail.assessmentDates[3] != undefined
                                ? item.propertyDetail.assessmentDates[3].date || translate('pt.search.searchProperty.fields.na')
                                : translate('pt.search.searchProperty.fields.na')
                              : translate('pt.search.searchProperty.fields.na')}
                          </Col>
                          <Col xs={4} md={3} style={styles.bold}>
                            <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.constructionDetails.fields.certificateNumber')}</div>
                            {item.propertyDetail.hasOwnProperty('builderDetails') && item.propertyDetail.builderDetails != null
                              ? item.propertyDetail.builderDetails.certificateNumber || translate('pt.search.searchProperty.fields.na')
                              : translate('pt.search.searchProperty.fields.na')}
                          </Col>
                          <Col xs={4} md={3} style={styles.bold}>
                            <div style={{ fontWeight: 500 }}>
                              {translate('pt.create.groups.constructionDetails.fields.certificateCompletionDate')}
                            </div>
                            {item.propertyDetail.hasOwnProperty('builderDetails') && item.propertyDetail.builderDetails != null
                              ? item.propertyDetail.builderDetails.certificateCompletionDate || translate('pt.search.searchProperty.fields.na')
                              : translate('pt.search.searchProperty.fields.na')}
                          </Col>
                          <Col xs={4} md={3} style={styles.bold}>
                            <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.constructionDetails.fields.certificateReceivedDate')}</div>
                            {item.propertyDetail.hasOwnProperty('builderDetails') && item.propertyDetail.builderDetails != null
                              ? item.propertyDetail.builderDetails.certificateReceiveDate || translate('pt.search.searchProperty.fields.na')
                              : translate('pt.search.searchProperty.fields.na')}
                          </Col>
                          <Col xs={4} md={3} style={styles.bold}>
                            <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.constructionDetails.fields.agencyName')}</div>
                            {item.propertyDetail.hasOwnProperty('builderDetails') && item.propertyDetail.builderDetails != null
                              ? item.propertyDetail.builderDetails.agencyName || translate('pt.search.searchProperty.fields.na')
                              : translate('pt.search.searchProperty.fields.na')}
                          </Col>
                          <Col xs={4} md={3} style={styles.bold}>
                            <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.constructionDetails.fields.licenseType')}</div>
                            {item.propertyDetail.hasOwnProperty('builderDetails') && item.propertyDetail.builderDetails != null
                              ? item.propertyDetail.builderDetails.licenseType || translate('pt.search.searchProperty.fields.na')
                              : translate('pt.search.searchProperty.fields.na')}
                          </Col>
                          <Col xs={4} md={3} style={styles.bold}>
                            <div style={{ fontWeight: 500 }}>{translate('pt.create.groups.constructionDetails.fields.licenseNumber')}</div>
                            {item.propertyDetail.hasOwnProperty('builderDetails') && item.propertyDetail.builderDetails != null
                              ? item.propertyDetail.builderDetails.licenseNumber || translate('pt.search.searchProperty.fields.na')
                              : translate('pt.search.searchProperty.fields.na')}
                          </Col>
                        </Row>
                      </Col>
                      <div className="clearfix" />
                    </CardText>
                  </Card>
                )}
                <Card className="uiCard">
                  <CardHeader
                    style={{ paddingBottom: 0 }}
                    title={<div style={styles.headerStyle}>{translate('pt.create.groups.propertyAddress.taxDetails')}</div>}
                  />
                  <CardText>
                    <Col xs={4} md={12}>
                      {currentThis.state.demands.length == 0 ? (
                        <p style={{ textAlign: 'center' }}>No demand available</p>
                      ) : (
                        <Table
                          id="TaxCalculationTable"
                          style={{
                            color: 'black',
                            fontWeight: 'normal',
                            marginBottom: 0,
                          }}
                          bordered
                          responsive
                        >
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>{translate('pt.create.groups.propertyAddress.propertyTax')}</th>
                              <th>{translate('pt.create.groups.propertyAddress.educationCess')}</th>
                              <th>{translate('pt.create.groups.propertyAddress.libraryCess')}</th>
                              <th>{translate('pt.create.groups.propertyAddress.totalTax')}</th>
                              <th>{translate('pt.create.groups.propertyAddress.totalTaxDue')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentThis.state.demands.length != 0 &&
                              currentThis.state.demands.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                      {item.hasOwnProperty('demandDetails') &&
                                        item.demandDetails.length != 0 &&
                                        item.demandDetails.map((i, index) => {
                                          if (i.taxHeadMasterCode == 'PT_TAX') {
                                            return <span key={index}>{i.taxAmount}</span>;
                                          }
                                        })}
                                    </td>
                                    <td>
                                      {item.hasOwnProperty('demandDetails') &&
                                        item.demandDetails.length != 0 &&
                                        item.demandDetails.map((i, index) => {
                                          if (i.taxHeadMasterCode == 'EDU_CESS') {
                                            return <span key={index}>{i.taxAmount}</span>;
                                          }
                                        })}
                                    </td>
                                    <td>
                                      {item.hasOwnProperty('demandDetails') &&
                                        item.demandDetails.length != 0 &&
                                        item.demandDetails.map((i, index) => {
                                          if (i.taxHeadMasterCode == 'LIB_CESS') {
                                            return <span key={index}>{i.taxAmount}</span>;
                                          }
                                        })}
                                    </td>
                                    <td>
                                      {item.hasOwnProperty('demandDetails') &&
                                        item.demandDetails.length != 0 &&
                                        item.demandDetails.map((i, index) => {
                                          totalAmount += parseFloat(i.taxAmount);
                                          taxCollected += parseFloat(i.collectionAmount);
                                        })}
                                      {totalAmount}
                                    </td>
                                    <td>{totalAmount - taxCollected}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </Table>
                      )}
                      <div className="clearfix" />
                    </Col>
                    <div className="clearfix" />
                  </CardText>
                </Card>
                {item.upicNumber ? (
                  <div style={{ textAlign: 'center', paddingTop: 10 }}>
                    <RaisedButton
                      type="button"
                      primary={true}
                      label={translate('pt.create.button.viewdcb')}
                      style={{ margin: '0 5px' }}
                      onClick={() => {
                        this.props.history.push('/propertyTax/view-dcb/' + item.upicNumber);
                      }}
                    />
                  </div>
                ) : null}

                <div style={{ textAlign: 'center', paddingTop: 10 }}>
                  <RaisedButton
                    type="button"
                    primary={true}
                    label={translate('pt.search.searchProperty')}
                    style={{ margin: '0 5px' }}
                    onClick={() => {
                      this.props.history.push('/propertyTax/search/');
                    }}
                  />
                </div>
              </Grid>
            );
          })}
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewProperty);
