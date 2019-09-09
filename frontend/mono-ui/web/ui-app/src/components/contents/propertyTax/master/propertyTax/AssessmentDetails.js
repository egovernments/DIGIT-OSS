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

class AssessmentDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      propertytypes: [],
      propertySubType: [],
      reasonForCreation: [],
      departments: [],
      usages: [],
      subUsage: [],
    };
  }

  componentDidMount() {
    //call boundary service fetch wards,location,zone data
    var currentThis = this;

    let { toggleSnackbarAndSetText } = this.props;

    Api.commonApiPost('pt-property/property/propertytypes/_search', {}, {}, false, true)
      .then(res => {
        console.log(res);
        currentThis.setState({ propertytypes: res.propertyTypes });
      })
      .catch(err => {
        currentThis.setState({
          propertytypes: [],
        });
        toggleSnackbarAndSetText(true, err.message);
        console.log(err);
      });

    Api.commonApiPost('pt-property/property/usages/_search')
      .then(res => {
        console.log(res);
        currentThis.setState({ usages: res.usageMasters });
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.propertySubTypes && nextProps.propertySubTypes.length && !this.state.propertySubType.length) {
      this.setState({
        propertySubType: nextProps.propertySubTypes,
      });
    }

    if (nextProps.propertySubUsage && nextProps.propertySubUsage.length && !this.state.subUsage.length) {
      this.setState({
        subUsage: nextProps.propertySubUsage,
      });
    }
  }

  handleUsage = value => {
    let currentThis = this;

    let query = {
      parent: value,
    };

    Api.commonApiPost('pt-property/property/usages/_search', query)
      .then(res => {
        //console.log(res);
        currentThis.setState({ subUsage: res.usageMasters });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleDepartment = e => {
    let { toggleSnackbarAndSetText, setLoadingStatus } = this.props;

    setLoadingStatus('loading');

    var currentThis = this;

    currentThis.setState({
      departments: [],
    });

    this.props.assessmentDetails.department = '';

    let query = {
      category: e.target.value,
    };

    let pQuery = {
      parent: e.target.value,
    };

    Api.commonApiPost('pt-property/property/propertytypes/_search', pQuery, {}, false, true)
      .then(res => {
        res.propertyTypes.unshift({ id: -1, name: 'None' });
        console.log(res);
        currentThis.setState({ propertySubType: res.propertyTypes });
      })
      .catch(err => {
        currentThis.setState({
          propertySubType: [],
        });
        toggleSnackbarAndSetText(true, err.message);
        console.log(err);
      });

    Api.commonApiPost('pt-property/property/departments/_search', query, {}, false, true)
      .then(res => {
        res.departments.unshift({ id: -1, name: 'None' });
        console.log(res);
        currentThis.setState({
          departments: res.departments,
        });
        setLoadingStatus('hide');
      })
      .catch(err => {
        console.log(err);
        toggleSnackbarAndSetText(true, err.message);
        setLoadingStatus('hide');
      });
  };

  formatDate(date) {
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;

    return day + '/' + month + '/' + date.getFullYear();
  }

  handleAge = year => {
    /*	var query = {
		fromYear : year,
		toYear: year
	}
	var currentThis = this;
	Api.commonApiPost('/property/depreciations/_search',query).then((res)=>{
	  console.log(res);
	  currentThis.setState({structureclasses: res.structureClasses})
	}).catch((err)=> {
	  console.log(err)
	})*/
  };

  render() {
    const renderOption = function(list, listName = '') {
      if (list) {
        return list.map(item => {
          return <MenuItem key={item.id} value={item.code} primaryText={item.name} />;
        });
      }
    };

    let {
      assessmentDetails,
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

    let { search, handleDepartment } = this;

    let cThis = this;

    return (
      <Card className="uiCard">
        <CardHeader
          style={styles.reducePadding}
          title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('pt.create.groups.assessmentDetails')} </div>}
        />
        <CardText style={styles.reducePadding}>
          <Grid fluid>
            <Row>
              <Col xs={12} md={3} sm={6}>
                <SelectField
                  className="fullWidth selectOption"
                  floatingLabelText={
                    <span>
                      {translate('pt.create.groups.assessmentDetails.fields.creationReason')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  errorText={
                    fieldErrors.reasonForCreation ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.reasonForCreation}</span> : ''
                  }
                  value={assessmentDetails.reasonForCreation ? assessmentDetails.reasonForCreation : ''}
                  floatingLabelFixed={true}
                  onChange={(event, index, value) => {
                    value == -1 ? (value = '') : '';
                    if (value == 'SUBDIVISION') {
                      addDepandencyFields('parentUpicNo');
                    } else {
                      removeDepandencyFields('parentUpicNo');
                    }
                    var e = {
                      target: {
                        value: value,
                      },
                    };
                    handleChange(e, 'reasonForCreation', true, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  dropDownMenuProps={{
                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                  id="creationReason"
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                >
                  <MenuItem value={-1} primaryText="None" />
                  <MenuItem value="NEWPROPERTY" primaryText="New Property" />
                  <MenuItem value="SUBDIVISION" primaryText="Bifurcation" />
                </SelectField>
              </Col>

              {assessmentDetails.reasonForCreation == 'SUBDIVISION' && (
                <Col xs={12} md={3} sm={6}>
                  <TextField
                    className="fullWidth"
                    floatingLabelText={
                      <span>
                        {translate('pt.create.groups.assessmentDetails.fields.parentUpicNo')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={fieldErrors.parentUpicNo ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.parentUpicNo}</span> : ''}
                    value={assessmentDetails.parentUpicNo ? assessmentDetails.parentUpicNo : ''}
                    onChange={e => {
                      handleChange(e, 'parentUpicNo', true, '');
                    }}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    floatingLabelFixed={true}
                    underlineStyle={styles.underlineStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                    id="parentUpicNo"
                    maxLength={15}
                    floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  />
                </Col>
              )}
              <Col xs={12} md={3} sm={6}>
                <SelectField
                  className="fullWidth selectOption"
                  floatingLabelText={
                    <span>
                      {translate('pt.create.groups.assessmentDetails.fields.propertyType')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  errorText={fieldErrors.propertyType ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.propertyType}</span> : ''}
                  value={assessmentDetails.propertyType ? assessmentDetails.propertyType : ''}
                  floatingLabelFixed={true}
                  dropDownMenuProps={{
                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                  onChange={(event, index, value) => {
                    value == -1 ? (value = '') : '';
                    if (value == 'PTYPE_OPEN_LAND') {
                      addDepandencyFields('survayNumber');
                      addDepandencyFields('pattaNumber');
                      addDepandencyFields('vacantLandArea');
                      addDepandencyFields('marketValue');
                      addDepandencyFields('capitalValue');
                      addDepandencyFields('effectiveDate');
                      addDepandencyFields('vacantLandPlotArea');
                      addDepandencyFields('layoutApprovalAuthority');
                      addDepandencyFields('layoutPermitNumber');
                      addDepandencyFields('layoutPermitDate');
                    } else {
                      removeDepandencyFields('survayNumber');
                      removeDepandencyFields('pattaNumber');
                      removeDepandencyFields('vacantLandArea');
                      removeDepandencyFields('marketValue');
                      removeDepandencyFields('capitalValue');
                      removeDepandencyFields('effectiveDate');
                      removeDepandencyFields('vacantLandPlotArea');
                      removeDepandencyFields('layoutApprovalAuthority');
                      removeDepandencyFields('layoutPermitNumber');
                      removeDepandencyFields('layoutPermitDate');
                    }
                    var e = {
                      target: {
                        value: value,
                      },
                    };
                    handleDepartment(e);
                    handleChange(e, 'propertyType', true, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  id="propertyType"
                >
                  <MenuItem value={-1} primaryText="None" />
                  {renderOption(this.state.propertytypes)}
                </SelectField>
              </Col>
              <Col xs={12} md={3} sm={6}>
                <SelectField
                  className="fullWidth selectOption"
                  floatingLabelText={translate('pt.create.groups.assessmentDetails.fields.propertySubType')}
                  errorText={
                    fieldErrors.propertySubType ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.propertySubType}</span> : ''
                  }
                  value={assessmentDetails.propertySubType ? assessmentDetails.propertySubType : ''}
                  dropDownMenuProps={{
                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                  floatingLabelFixed={true}
                  onChange={(event, index, value) => {
                    value == -1 ? (value = '') : '';
                    var e = {
                      target: {
                        value: value,
                      },
                    };

                    handleChange(e, 'propertySubType', false, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  id="propertySubType"
                >
                  {renderOption(this.state.propertySubType)}
                </SelectField>
              </Col>
              <Col xs={12} md={3} sm={6}>
                <SelectField
                  className="fullWidth selectOption"
                  floatingLabelText={
                    <span>
                      {translate('pt.create.groups.assessmentDetails.fields.usageType')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  errorText={fieldErrors.usage ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.usage}</span> : ''}
                  value={assessmentDetails.usage ? assessmentDetails.usage : ''}
                  dropDownMenuProps={{
                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                  floatingLabelFixed={true}
                  onChange={(event, index, value) => {
                    value == -1 ? (value = '') : '';
                    var e = {
                      target: {
                        value: value,
                      },
                    };
                    this.handleUsage(value);
                    handleChange(e, 'usage', true, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  id="usage"
                >
                  <MenuItem value={-1} primaryText="None" />
                  {renderOption(this.state.usages)}
                </SelectField>
              </Col>
              <Col xs={12} md={3} sm={6}>
                <SelectField
                  className="fullWidth selectOption"
                  floatingLabelText={translate('pt.create.groups.assessmentDetails.fields.usageSubType')}
                  errorText={fieldErrors.usageSubType ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.usageSubType}</span> : ''}
                  value={assessmentDetails.usageSubType ? assessmentDetails.usageSubType : ''}
                  floatingLabelFixed={true}
                  dropDownMenuProps={{
                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                  onChange={(event, index, value) => {
                    value == -1 ? (value = '') : '';
                    var e = {
                      target: {
                        value: value,
                      },
                    };
                    handleChange(e, 'usageSubType', false, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  id="usageSubType"
                >
                  <MenuItem value={-1} primaryText="None" />
                  {renderOption(this.state.subUsage)}
                </SelectField>
              </Col>
              {(getNameByCode(this.state.propertytypes, assessmentDetails.propertyType).match('Central Government') ||
                getNameByCode(this.state.propertytypes, assessmentDetails.propertyType).match('State Government')) && (
                <Col xs={12} md={3} sm={6}>
                  <SelectField
                    className="fullWidth selectOption"
                    floatingLabelText={translate('pt.create.groups.assessmentDetails.fields.department')}
                    errorText={fieldErrors.department ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.department}</span> : ''}
                    value={assessmentDetails.department ? assessmentDetails.department : ''}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{
                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    onChange={(event, index, value) => {
                      value == -1 ? (value = '') : '';
                      var e = {
                        target: {
                          value: value,
                        },
                      };
                      handleChange(e, 'department', false, '');
                    }}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    underlineStyle={styles.underlineStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                    floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                    id="department"
                  >
                    {renderOption(this.state.departments)}
                  </SelectField>
                </Col>
              )}
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  floatingLabelText={<span>{translate('pt.create.groups.assessmentDetails.fields.extentOfSite')}</span>}
                  hintText="876"
                  errorText={fieldErrors.extentOfSite ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.extentOfSite}</span> : ''}
                  value={assessmentDetails.extentOfSite ? assessmentDetails.extentOfSite : ''}
                  floatingLabelFixed={true}
                  onChange={e => {
                    handleChange(e, 'extentOfSite', false, /^\d+$/g);
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  id="extentOfSite"
                  maxLength={8}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  floatingLabelText={
                    <span>
                      {translate('pt.create.groups.assessmentDetails.fields.sequenceNo')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  hintText="14"
                  errorText={fieldErrors.sequenceNo ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.sequenceNo}</span> : ''}
                  value={assessmentDetails.sequenceNo ? assessmentDetails.sequenceNo : ''}
                  floatingLabelFixed={true}
                  onChange={e => {
                    handleChange(e, 'sequenceNo', true, /^\d+$/g);
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  id="sequenceNo"
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  maxLength={4}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  floatingLabelText={translate('pt.create.groups.floorDetails.fields.buildingPermissionNumber')}
                  errorText={fieldErrors.bpaNo ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.bpaNo}</span> : ''}
                  value={assessmentDetails.bpaNo ? assessmentDetails.bpaNo : ''}
                  floatingLabelFixed={true}
                  onChange={e => {
                    handleChange(e, 'bpaNo', false, /^[0-9,/<>!@#\$%\^\&*\)\(+=._-]+$/g);
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  id="bpaNo"
                  maxLength={15}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  hintText="dd/mm/yyyy"
                  floatingLabelFixed={true}
                  floatingLabelText={translate('pt.create.groups.floorDetails.fields.buildingPermissionDate')}
                  errorText={fieldErrors.bpaDate ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.bpaDate}</span> : ''}
                  value={assessmentDetails.bpaDate ? assessmentDetails.bpaDate : ''}
                  onChange={(e, value) => {
                    var val = value;
                    if (value.length == 2 && !value.match('/')) {
                      val += '/';
                    } else if (value.length == 5) {
                      var a = value.split('/');
                      if (a[1].length == 2 && !a[1].match('/')) {
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
                      'bpaDate',
                      false,
                      /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
                    );
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  id="bpaDate"
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
            </Row>
          </Grid>
        </CardText>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  assessmentDetails: state.form.form,
  fieldErrors: state.form.fieldErrors,
  editIndex: state.form.editIndex,
  addRoom: state.form.addRoom,
});

const mapDispatchToProps = dispatch => ({
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
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentDetails);
