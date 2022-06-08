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

class VacantLand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      propertytypes: [],
      apartments: [],
      departments: [],
    };
  }

  componentDidMount() {
    //call boundary service fetch wards,location,zone data
    var currentThis = this;
  }

  render() {
    const renderOption = function(list, listName = '') {
      if (list) {
        return list.map(item => {
          return <MenuItem key={item.id} value={item.id} primaryText={item.name} />;
        });
      }
    };

    let {
      owners,
      vacantLand,
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
    } = this.props;

    let { search } = this;

    let cThis = this;

    return (
      <div>
        <Card className="uiCard">
          <CardHeader
            style={styles.reducePadding}
            title={
              <div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>
                {translate('pt.create.groups.vacantLand.fields.vacantLandDetails')}
              </div>
            }
          />
          <CardText style={styles.reducePadding}>
            <Grid fluid>
              <Row>
                <Col xs={12} md={3} sm={6}>
                  <TextField
                    hintText=""
                    floatingLabelText={
                      <span>
                        {translate('pt.create.groups.propertyAddress.fields.surveyNumber')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={fieldErrors.survayNumber ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.survayNumber}</span> : ''}
                    value={vacantLand.survayNumber ? vacantLand.survayNumber : ''}
                    onChange={e => {
                      handleChange(e, 'survayNumber', true, /^([0-9]|[a-z])+([0-9a-z]+){3}$/i);
                    }}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    id="survayNumber"
                    underlineStyle={styles.underlineStyle}
                    floatingLabelFixed={true}
                    underlineFocusStyle={styles.underlineFocusStyle}
                    className="fullWidth"
                    maxLength={64}
                    floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  />
                </Col>
                <Col xs={12} md={3} sm={6}>
                  <TextField
                    hintText=""
                    floatingLabelText={
                      <span>
                        {translate('pt.create.groups.propertyAddress.fields.pattaNumber')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={fieldErrors.pattaNumber ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.pattaNumber}</span> : ''}
                    value={vacantLand.pattaNumber ? vacantLand.pattaNumber : ''}
                    onChange={e => {
                      handleChange(e, 'pattaNumber', true, /^([0-9]|[a-z])+([0-9a-z]+){3}$/i);
                    }}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    underlineStyle={styles.underlineStyle}
                    floatingLabelFixed={true}
                    underlineFocusStyle={styles.underlineFocusStyle}
                    className="fullWidth"
                    id="pattaNumber"
                    maxLength={64}
                    floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  />
                </Col>
                <Col xs={12} md={3} sm={6}>
                  <TextField
                    hintText=""
                    floatingLabelText={
                      <span>
                        {translate('pt.create.groups.propertyAddress.fields.vacantLandArea')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={
                      fieldErrors.vacantLandArea ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.vacantLandArea}</span> : ''
                    }
                    value={vacantLand.vacantLandArea ? vacantLand.vacantLandArea : ''}
                    onChange={e => {
                      handleChange(e, 'vacantLandArea', true, /^\d{3,64}$/g);
                    }}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    underlineStyle={styles.underlineStyle}
                    floatingLabelFixed={true}
                    underlineFocusStyle={styles.underlineFocusStyle}
                    className="fullWidth"
                    id="vacantLandArea"
                    maxLength={64}
                    floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  />
                </Col>
                <Col xs={12} md={3} sm={6}>
                  <TextField
                    hintText=""
                    floatingLabelText={
                      <span>
                        {translate('pt.create.groups.propertyAddress.fields.marketValue')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={fieldErrors.marketValue ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.marketValue}</span> : ''}
                    value={vacantLand.marketValue ? vacantLand.marketValue : ''}
                    onChange={e => {
                      handleChange(e, 'marketValue', true, /^([0-9]|[a-z])+([0-9a-z]+){3}$/i);
                    }}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    underlineStyle={styles.underlineStyle}
                    floatingLabelFixed={true}
                    underlineFocusStyle={styles.underlineFocusStyle}
                    id="marketValue"
                    className="fullWidth"
                    maxLength={64}
                    floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  />
                </Col>
                <Col xs={12} md={3} sm={6}>
                  <TextField
                    hintText=""
                    floatingLabelText={
                      <span>
                        {translate('pt.create.groups.propertyAddress.fields.capitalValue')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={fieldErrors.capitalValue ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.capitalValue}</span> : ''}
                    value={vacantLand.capitalValue ? vacantLand.capitalValue : ''}
                    onChange={e => {
                      handleChange(e, 'capitalValue', true, /^([0-9]|[a-z])+([0-9a-z]+){3}$/i);
                    }}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    underlineStyle={styles.underlineStyle}
                    floatingLabelFixed={true}
                    underlineFocusStyle={styles.underlineFocusStyle}
                    id="capitalValue"
                    className="fullWidth"
                    maxLength={64}
                    floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  />
                </Col>
                <Col xs={12} md={3} sm={6}>
                  <TextField
                    className="fullWidth"
                    hintText="dd/mm/yyyy"
                    floatingLabelFixed={true}
                    floatingLabelText={
                      <span>
                        {translate('pt.create.groups.propertyAddress.fields.effectiveDate')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={
                      fieldErrors.occupancyDate ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.occupancyDate}</span> : ''
                    }
                    value={vacantLand.occupancyDate ? vacantLand.occupancyDate : ''}
                    onChange={(e, value) => {
                      var val = value;
                      if (value.length == 2 && !value.match('/')) {
                        val += '/';
                      } else if (value.length == 5) {
                        var a = value.split('/');
                        if (!a[1].match('/')) {
                          val += '/';
                        }
                      }
                      var e = {
                        target: {
                          value: val,
                        },
                      };
                      handleChange(
                        e,
                        'occupancyDate',
                        true,
                        /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
                      );
                    }}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    underlineStyle={styles.underlineStyle}
                    id="occupancyDate"
                    underlineFocusStyle={styles.underlineFocusStyle}
                    floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  />
                </Col>
                <Col xs={12} md={3} sm={6}>
                  <TextField
                    hintText=""
                    floatingLabelText={
                      <span>
                        {translate('pt.create.groups.propertyAddress.fields.vacantLandPlotArea')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={
                      fieldErrors.vacantLandPlotArea ? (
                        <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.vacantLandPlotArea}</span>
                      ) : (
                        ''
                      )
                    }
                    value={vacantLand.vacantLandPlotArea ? vacantLand.vacantLandPlotArea : ''}
                    onChange={e => {
                      handleChange(e, 'vacantLandPlotArea', true, '');
                    }}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    id="vacantLandPlotArea"
                    underlineStyle={styles.underlineStyle}
                    floatingLabelFixed={true}
                    underlineFocusStyle={styles.underlineFocusStyle}
                    className="fullWidth"
                    floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  />
                </Col>
                <Col xs={12} md={3} sm={6}>
                  <SelectField
                    className="fullWidth selectOption"
                    hintText=""
                    floatingLabelText={
                      <span>
                        {translate('pt.create.groups.propertyAddress.fields.layoutApprovalAuthority')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={
                      fieldErrors.layoutApprovalAuthority ? (
                        <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.layoutApprovalAuthority}</span>
                      ) : (
                        ''
                      )
                    }
                    value={vacantLand.layoutApprovalAuthority ? vacantLand.layoutApprovalAuthority : ''}
                    dropDownMenuProps={{
                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    onChange={(event, index, value) => {
                      var e = {
                        target: {
                          value: value,
                        },
                      };
                      handleChange(e, 'layoutApprovalAuthority', true, '');
                    }}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    id="layoutApprovalAuthority"
                    underlineStyle={styles.underlineStyle}
                    floatingLabelFixed={true}
                    underlineFocusStyle={styles.underlineFocusStyle}
                    floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  >
                    <MenuItem value={1} primaryText="Options" />
                  </SelectField>
                </Col>
                <Col xs={12} md={3} sm={6}>
                  <TextField
                    hintText=""
                    floatingLabelText={
                      <span>
                        {translate('pt.create.groups.propertyAddress.fields.layoutPermitNumber')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={
                      fieldErrors.layoutPermitNumber ? (
                        <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.layoutPermitNumber}</span>
                      ) : (
                        ''
                      )
                    }
                    value={vacantLand.layoutPermitNumber ? vacantLand.layoutPermitNumber : ''}
                    onChange={e => {
                      handleChange(e, 'layoutPermitNumber', true, /^([0-9]|[a-z])+([0-9a-z]+){3}$/i);
                    }}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    id="layoutPermitNumber"
                    underlineStyle={styles.underlineStyle}
                    floatingLabelFixed={true}
                    underlineFocusStyle={styles.underlineFocusStyle}
                    className="fullWidth"
                    maxLength={64}
                    floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  />
                </Col>

                <Col xs={12} md={3} sm={6}>
                  <TextField
                    className="fullWidth"
                    hintText="dd/mm/yyyy"
                    floatingLabelFixed={true}
                    floatingLabelText={
                      <span>
                        {translate('pt.create.groups.propertyAddress.fields.layoutPermitDate')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={
                      fieldErrors.layoutPermitDate ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.layoutPermitDate}</span> : ''
                    }
                    value={vacantLand.layoutPermitDate ? vacantLand.layoutPermitDate : ''}
                    onChange={(e, value) => {
                      var val = value;
                      if (value.length == 2 && !value.match('/')) {
                        val += '/';
                      } else if (value.length == 5) {
                        var a = value.split('/');
                        if (!a[1].match('/')) {
                          val += '/';
                        }
                      }

                      var e = {
                        target: {
                          value: val,
                        },
                      };
                      handleChange(
                        e,
                        'layoutPermitDate',
                        true,
                        /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
                      );
                    }}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    underlineStyle={styles.underlineStyle}
                    id="layoutPermitDate"
                    underlineFocusStyle={styles.underlineFocusStyle}
                    floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  />
                </Col>
              </Row>
            </Grid>
          </CardText>
        </Card>
        <Card className="uiCard">
          <CardHeader
            style={styles.reducePadding}
            title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('pt.create.groups.surroundingBoundaries')}</div>}
          />
          <CardText style={styles.reducePadding}>
            <Grid fluid>
              <Row>
                <Col xs={12} md={3} sm={6}>
                  <TextField
                    hintText=""
                    floatingLabelText={translate('pt.create.groups.propertyAddress.fields.northBoundedBy')}
                    errorText={fieldErrors.north ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.north}</span> : ''}
                    value={vacantLand.north ? vacantLand.north : ''}
                    onChange={e => {
                      handleChange(e, 'north', false, /^([0-9]|[a-z])+([0-9a-z]+)$/i);
                    }}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    id="north"
                    underlineStyle={styles.underlineStyle}
                    floatingLabelFixed={true}
                    underlineFocusStyle={styles.underlineFocusStyle}
                    className="fullWidth"
                    maxLength={256}
                    floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  />
                </Col>
                <Col xs={12} md={3} sm={6}>
                  <TextField
                    hintText=""
                    floatingLabelText={translate('pt.create.groups.propertyAddress.fields.southBoundedBy')}
                    errorText={fieldErrors.south ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.south}</span> : ''}
                    value={vacantLand.south ? vacantLand.south : ''}
                    onChange={e => {
                      handleChange(e, 'south', false, /^([0-9]|[a-z])+([0-9a-z]+)$/i);
                    }}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    underlineStyle={styles.underlineStyle}
                    floatingLabelFixed={true}
                    underlineFocusStyle={styles.underlineFocusStyle}
                    className="fullWidth"
                    id="south"
                    maxLength={256}
                    floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  />
                </Col>
                <Col xs={12} md={3} sm={6}>
                  <TextField
                    hintText=""
                    floatingLabelText={translate('pt.create.groups.propertyAddress.fields.eastBoundedBy')}
                    errorText={fieldErrors.east ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.east}</span> : ''}
                    value={vacantLand.east ? vacantLand.east : ''}
                    onChange={e => {
                      handleChange(e, 'east', false, /^([0-9]|[a-z])+([0-9a-z]+)$/i);
                    }}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    id="east"
                    underlineStyle={styles.underlineStyle}
                    floatingLabelFixed={true}
                    underlineFocusStyle={styles.underlineFocusStyle}
                    className="fullWidth"
                    maxLength={256}
                    floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  />
                </Col>
                <Col xs={12} md={3} sm={6}>
                  <TextField
                    hintText=""
                    floatingLabelText={translate('pt.create.groups.propertyAddress.fields.westBoundedBy')}
                    errorText={fieldErrors.west ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.west}</span> : ''}
                    value={vacantLand.west ? vacantLand.west : ''}
                    onChange={e => {
                      handleChange(e, 'west', false, /^([0-9]|[a-z])+([0-9a-z]+)$/i);
                    }}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    underlineStyle={styles.underlineStyle}
                    id="west"
                    underlineFocusStyle={styles.underlineFocusStyle}
                    className="fullWidth"
                    maxLength={256}
                    floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  />
                </Col>
              </Row>
            </Grid>
          </CardText>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  vacantLand: state.form.form,
  fieldErrors: state.form.fieldErrors,
  editIndex: state.form.editIndex,
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

  isAddRoom: room => {
    dispatch({
      type: 'ADD_ROOM',
      room,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(VacantLand);
