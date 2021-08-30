import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
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
import { translate } from '../../../../common/common';
import Api from '../../../../../api/api';

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

class PropertyAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locality: [],
      apartments: [],
      zone: [],
      ward: [],
      block: [],
      street: [],
      revanue: [],
      election: [],
    };
  }

  componentDidMount() {
    //call boundary service fetch wards,location,zone data
    var currentThis = this;

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'LOCALITY',
      hierarchyTypeName: 'LOCATION',
    })
      .then(res => {
        console.log(res);
        res.Boundary.unshift({ id: -1, name: 'None' });
        currentThis.setState({ locality: res.Boundary });
      })
      .catch(err => {
        currentThis.setState({
          locality: [],
        });
        console.log(err);
      });

    Api.commonApiPost('pt-property/property/apartment/_search', {}, {}, false, true)
      .then(res => {
        console.log(res);
        currentThis.setState({ apartments: res.apartments });
      })
      .catch(err => {
        currentThis.setState({
          apartments: [],
        });
        console.log(err);
      });

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'STREET',
      hierarchyTypeName: 'LOCATION',
    })
      .then(res => {
        console.log(res);
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
        console.log(res);
        res.Boundary.unshift({ id: -1, name: 'None' });
        currentThis.setState({ election: res.Boundary });
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
            boundaryTypeName: 'WARD',
            hierarchyTypeName: res1.appConfigurations[0].values[0],
          })
            .then(res => {
              console.log(res);
              res.Boundary.unshift({ id: -1, name: 'None' });
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
              console.log(res);
              res.Boundary.unshift({ id: -1, name: 'None' });
              currentThis.setState({ block: res.Boundary });
            })
            .catch(err => {
              console.log(err);
            });

          Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
            boundaryTypeName: 'ZONE',
            hierarchyTypeName: res1.appConfigurations[0].values[0],
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

          Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
            boundaryTypeName: 'REVENUE',
            hierarchyTypeName: res1.appConfigurations[0].values[0],
          })
            .then(res => {
              console.log(res);
              res.Boundary.unshift({ id: -1, name: 'None' });
              currentThis.setState({ revanue: res.Boundary });
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          currentThis.setState({
            zone: [],
            revanue: [],
            block: [],
            ward: [],
          });
        }
      })
      .catch(err => {
        currentThis.setState({
          zone: [],
          revanue: [],
          block: [],
          ward: [],
        });
      });

    this.props.initForm();
  }

  render() {
    const renderOption = function(list, isCode) {
      if (list) {
        return list.map(item => {
          return <MenuItem key={item.id} value={isCode ? item.code : item.id} primaryText={item.name} />;
        });
      }
    };

    let {
      propertyAddress,
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
      addFloors,
    } = this.props;

    let { search } = this;

    let cThis = this;

    return (
      <Card className="uiCard">
        <CardHeader
          style={styles.reducePadding}
          title={
            <div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>
              {translate('pt.create.groups.propertyAddress.fields.propertyAddress')}
            </div>
          }
        />
        <CardText style={styles.reducePadding}>
          <Grid fluid>
            <Row>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  floatingLabelText={translate('pt.create.groups.propertyAddress.fields.referancePropertyNumber')}
                  hintText="000001111122222"
                  errorText={
                    fieldErrors.refPropertyNumber ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.refPropertyNumber}</span> : ''
                  }
                  value={propertyAddress.refPropertyNumber ? propertyAddress.refPropertyNumber : ''}
                  onChange={e => handleChange(e, 'refPropertyNumber', false, /^[a-zA-Z0-9]*$/g)}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelFixed={true}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  id="refPropertyNumber"
                  maxLength={15}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <SelectField
                  className="fullWidth selectOption"
                  floatingLabelText={translate('pt.create.groups.propertyAddress.fields.appartment')}
                  errorText={
                    fieldErrors.appComplexName ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.appComplexName}</span> : ''
                  }
                  value={propertyAddress.appComplexName ? propertyAddress.appComplexName : ''}
                  onChange={(event, index, value) => {
                    value == -1 ? (value = '') : '';
                    var e = {
                      target: {
                        value: value,
                      },
                    };
                    handleChange(e, 'appComplexName', false, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelFixed={true}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  id="appComplexName"
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  dropDownMenuProps={{
                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                >
                  <MenuItem value={-1} primaryText="None" />
                  {renderOption(this.state.apartments)}
                </SelectField>
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  floatingLabelText={
                    <span>
                      {translate('pt.create.groups.propertyAddress.fields.doorNo')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  hintText="301"
                  errorText={fieldErrors.doorNo ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.doorNo}</span> : ''}
                  value={propertyAddress.doorNo ? propertyAddress.doorNo : ''}
                  onChange={e => handleChange(e, 'doorNo', true, /^[^-\s]+$/g)}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelFixed={true}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  maxLength={12}
                  id="doorNo"
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <SelectField
                  className="fullWidth selectOption"
                  floatingLabelText={translate('pt.create.groups.propertyAddress.fields.locality')}
                  errorText={fieldErrors.locality ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.locality}</span> : ''}
                  value={propertyAddress.locality ? propertyAddress.locality : ''}
                  onChange={(event, index, value) => {
                    value == -1 ? (value = '') : '';
                    var e = {
                      target: {
                        value: value,
                      },
                    };
                    handleChange(e, 'locality', false, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelFixed={true}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  id="locality"
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  dropDownMenuProps={{
                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                >
                  {renderOption(this.state.locality, true)}
                </SelectField>
              </Col>
              <Col xs={12} md={3} sm={6}>
                <SelectField
                  className="fullWidth selectOption"
                  floatingLabelText={translate('pt.create.groups.propertyAddress.fields.electionWard')}
                  errorText={fieldErrors.electionWard ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.electionWard}</span> : ''}
                  value={propertyAddress.electionWard ? propertyAddress.electionWard : ''}
                  onChange={(event, index, value) => {
                    value == -1 ? (value = '') : '';
                    var e = {
                      target: {
                        value: value,
                      },
                    };
                    handleChange(e, 'electionWard', false, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelFixed={true}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  id="electionWard"
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  dropDownMenuProps={{
                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                >
                  {renderOption(this.state.election, true)}
                </SelectField>
              </Col>
              <Col xs={12} md={3} sm={6}>
                <SelectField
                  className="fullWidth selectOption"
                  floatingLabelText={
                    <span>
                      {translate('pt.create.groups.propertyAddress.fields.zoneNo')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  errorText={fieldErrors.zoneNo ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.zoneNo}</span> : ''}
                  value={propertyAddress.zoneNo ? propertyAddress.zoneNo : ''}
                  onChange={(event, index, value) => {
                    value == -1 ? (value = '') : '';
                    var e = {
                      target: {
                        value: value,
                      },
                    };
                    handleChange(e, 'zoneNo', true, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelFixed={true}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  id="zoneNo"
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  dropDownMenuProps={{
                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                >
                  {renderOption(this.state.zone, true)}
                </SelectField>
              </Col>
              <Col xs={12} md={3} sm={6}>
                <SelectField
                  className="fullWidth selectOption"
                  floatingLabelText={
                    <span>
                      {translate('pt.create.groups.propertyAddress.fields.wardNo')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  errorText={fieldErrors.wardNo ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.wardNo}</span> : ''}
                  value={propertyAddress.wardNo ? propertyAddress.wardNo : ''}
                  onChange={(event, index, value) => {
                    value == -1 ? (value = '') : '';
                    var e = {
                      target: {
                        value: value,
                      },
                    };
                    handleChange(e, 'wardNo', true, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelFixed={true}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  id="wardNo"
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  dropDownMenuProps={{
                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                >
                  {renderOption(this.state.ward, true)}
                </SelectField>
              </Col>
              <Col xs={12} md={3} sm={6}>
                <SelectField
                  className="fullWidth selectOption"
                  floatingLabelText={translate('pt.create.groups.propertyAddress.fields.blockNo')}
                  errorText={fieldErrors.blockNo ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.blockNo}</span> : ''}
                  value={propertyAddress.blockNo ? propertyAddress.blockNo : ''}
                  onChange={(event, index, value) => {
                    value == -1 ? (value = '') : '';
                    var e = {
                      target: {
                        value: value,
                      },
                    };
                    handleChange(e, 'blockNo', false, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelFixed={true}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  id="blockNo"
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  dropDownMenuProps={{
                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                >
                  {renderOption(this.state.block, true)}
                </SelectField>
              </Col>
              <Col xs={12} md={3} sm={6}>
                <SelectField
                  className="fullWidth selectOption"
                  floatingLabelText={translate('pt.create.groups.propertyAddress.fields.street')}
                  errorText={fieldErrors.street ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.street}</span> : ''}
                  value={propertyAddress.street ? propertyAddress.street : ''}
                  onChange={(event, index, value) => {
                    value == -1 ? (value = '') : '';
                    var e = {
                      target: {
                        value: value,
                      },
                    };
                    handleChange(e, 'street', false, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelFixed={true}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  id="street"
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  dropDownMenuProps={{
                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                >
                  {renderOption(this.state.street, true)}
                </SelectField>
              </Col>
              <Col xs={12} md={3} sm={6}>
                <SelectField
                  className="fullWidth selectOption"
                  floatingLabelText={translate('pt.create.groups.propertyAddress.fields.revenueCircle')}
                  errorText={fieldErrors.revenueCircle ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.revenueCircle}</span> : ''}
                  value={propertyAddress.revenueCircle ? propertyAddress.revenueCircle : ''}
                  onChange={(event, index, value) => {
                    value == -1 ? (value = '') : '';
                    var e = {
                      target: {
                        value: value,
                      },
                    };
                    handleChange(e, 'revenueCircle', false, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelFixed={true}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  id="revenueCircle"
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  dropDownMenuProps={{
                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                >
                  {renderOption(this.state.revanue, true)}
                </SelectField>
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  floatingLabelText={
                    <span>
                      {translate('pt.create.groups.propertyAddress.fields.pin')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  hintText="400050"
                  errorText={fieldErrors.pin ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.pin}</span> : ''}
                  value={propertyAddress.pin ? propertyAddress.pin : ''}
                  onChange={e => handleChange(e, 'pin', true, /^\d{6}$/g)}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  id="pin"
                  underlineStyle={styles.underlineStyle}
                  floatingLabelFixed={true}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  maxLength={6}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  floatingLabelText={
                    <span>
                      {translate('pt.create.groups.propertyAddress.fields.totalFloors')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  errorText={fieldErrors.totalFloors ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.totalFloors}</span> : ''}
                  value={propertyAddress.totalFloors ? propertyAddress.totalFloors : ''}
                  onChange={(e, value) => {
                    addFloors(value);
                    handleChange(e, 'totalFloors', true, /^\d+$/g);
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  id="totalFloors"
                  underlineStyle={styles.underlineStyle}
                  floatingLabelFixed={true}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  maxLength={2}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  floatingLabelText={<span>{translate('pt.create.groups.propertyAddress.fields.plotNo')}</span>}
                  errorText={fieldErrors.plotNo ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.plotNo}</span> : ''}
                  value={propertyAddress.plotNo ? propertyAddress.plotNo : ''}
                  onChange={(e, value) => {
                    handleChange(e, 'plotNo', false, /^\d+$/g);
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  id="plotNo"
                  underlineStyle={styles.underlineStyle}
                  floatingLabelFixed={true}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  floatingLabelText={<span>{translate('pt.create.groups.propertyAddress.fields.ctsNo')}</span>}
                  errorText={fieldErrors.ctsNo ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.ctsNo}</span> : ''}
                  value={propertyAddress.ctsNo ? propertyAddress.ctsNo : ''}
                  onChange={(e, value) => {
                    handleChange(e, 'ctsNo', false, /^\d+$/g);
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  id="ctsNo"
                  underlineStyle={styles.underlineStyle}
                  floatingLabelFixed={true}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  floatingLabelText={<span>{translate('pt.create.groups.propertyAddress.fields.landMark')}</span>}
                  errorText={fieldErrors.landMark ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.landMark}</span> : ''}
                  value={propertyAddress.landMark ? propertyAddress.landMark : ''}
                  onChange={(e, value) => {
                    handleChange(e, 'landMark', false, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  id="landMark"
                  underlineStyle={styles.underlineStyle}
                  floatingLabelFixed={true}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={12}>
                <Checkbox
                  label={translate('pt.create.groups.propertyAddress.fields.isCorrespondanceAddressDifferentFromAddress')}
                  style={styles.checkbox}
                  defaultChecked={propertyAddress.cAddressDiffPAddress}
                  onCheck={(e, i, v) => {
                    if (i) {
                      addDepandencyFields('cDoorno');
                      addDepandencyFields('addressTwo');
                    } else {
                      removeDepandencyFields('cDoorno');
                      removeDepandencyFields('addressTwo');
                    }
                    var e = {
                      target: {
                        value: i,
                      },
                    };
                    handleChange(e, 'cAddressDiffPAddress', false, '');
                  }}
                  id="cAddressDiffPAddress"
                />
              </Col>
              {propertyAddress.cAddressDiffPAddress && (
                <div className="addMoreAddress" style={{ width: '100%' }}>
                  <Col xs={12} md={3} sm={6}>
                    <TextField
                      className="fullWidth"
                      floatingLabelText={
                        <span>
                          {translate('pt.create.groups.propertyAddress.fields.doorNo')}
                          <span style={{ color: '#FF0000' }}> *</span>
                        </span>
                      }
                      hintText="302"
                      errorText={fieldErrors.cDoorno ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.cDoorno}</span> : ''}
                      value={propertyAddress.cDoorno ? propertyAddress.cDoorno : ''}
                      onChange={e => handleChange(e, 'cDoorno', true, '')}
                      id="cDoorno"
                      floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                      underlineStyle={styles.underlineStyle}
                      floatingLabelFixed={true}
                      underlineFocusStyle={styles.underlineFocusStyle}
                      maxLength={12}
                      floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                    />
                  </Col>
                  <Col xs={12} md={3} sm={6}>
                    <TextField
                      className="fullWidth"
                      floatingLabelText={
                        <span>
                          {translate('pt.create.groups.propertyAddress.fields.address1')}
                          <span style={{ color: '#FF0000' }}> *</span>
                        </span>
                      }
                      errorText={
                        fieldErrors.correspondenceAddress ? (
                          <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.correspondenceAddress}</span>
                        ) : (
                          ''
                        )
                      }
                      value={propertyAddress.correspondenceAddress ? propertyAddress.correspondenceAddress : ''}
                      onChange={e => handleChange(e, 'correspondenceAddress', true, '')}
                      hintText="Address"
                      id="addressTwo"
                      floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                      underlineStyle={styles.underlineStyle}
                      floatingLabelFixed={true}
                      underlineFocusStyle={styles.underlineFocusStyle}
                      maxLength={128}
                      floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                    />
                  </Col>
                  <Col xs={12} md={3} sm={6}>
                    <TextField
                      className="fullWidth"
                      floatingLabelText={translate('pt.create.groups.propertyAddress.fields.pin')}
                      hintText="400050"
                      id="pinTwo"
                      errorText={
                        fieldErrors.correspondencePincode ? (
                          <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.correspondencePincode}</span>
                        ) : (
                          ''
                        )
                      }
                      value={propertyAddress.correspondencePincode ? propertyAddress.correspondencePincode : ''}
                      onChange={e => handleChange(e, 'correspondencePincode', false, /^\d{6}$/g)}
                      floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                      underlineStyle={styles.underlineStyle}
                      floatingLabelFixed={true}
                      underlineFocusStyle={styles.underlineFocusStyle}
                      maxLength={6}
                      floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                    />
                  </Col>
                </div>
              )}
            </Row>
          </Grid>
        </CardText>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  propertyAddress: state.form.form,
  fieldErrors: state.form.fieldErrors,
  editIndex: state.form.editIndex,
  addRoom: state.form.addRoom,
});

const mapDispatchToProps = dispatch => ({
  initForm: () => {
    dispatch({
      type: 'SET_FLOOR_NUMBER',
      noOfFloors: 0,
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

  isAddRoom: room => {
    dispatch({
      type: 'ADD_ROOM',
      room,
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

  addFloors: noOfFloors => {
    dispatch({
      type: 'FLOOR_NUMBERS',
      noOfFloors,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PropertyAddress);
