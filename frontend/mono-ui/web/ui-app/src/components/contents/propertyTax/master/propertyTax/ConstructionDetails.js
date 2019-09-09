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

class ConstructionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    //call boundary service fetch wards,location,zone data
    var currentThis = this;

    let { toggleSnackbarAndSetText } = this.props;
  }

  handleDepartment = e => {
    let { toggleSnackbarAndSetText, setLoadingStatus } = this.props;

    setLoadingStatus('loading');

    var currentThis = this;

    currentThis.setState({
      departments: [],
    });

    this.props.constructionDetails.department = '';

    let query = {
      category: e.target.value,
    };

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

  render() {
    const renderOption = function(list, listName = '') {
      if (list) {
        return list.map(item => {
          return <MenuItem key={item.id} value={item.code} primaryText={item.name} />;
        });
      }
    };

    let {
      constructionDetails,
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
          title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('pt.create.groups.constructionDetails')}</div>}
        />
        <CardText style={styles.reducePadding}>
          <Grid fluid>
            <Row>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  hintText="dd/mm/yyyy"
                  floatingLabelFixed={true}
                  floatingLabelText={
                    <span>
                      {translate('pt.create.groups.propertyAddress.fields.currentAssessmentDate')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  errorText={
                    fieldErrors.currentAssessmentDate ? (
                      <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.currentAssessmentDate}</span>
                    ) : (
                      ''
                    )
                  }
                  value={constructionDetails.currentAssessmentDate ? constructionDetails.currentAssessmentDate : ''}
                  onChange={(e, value) => {
                    var val = value;
                    if (value.length == 2 && !value.match('/')) {
                      console.log('1');
                      val += '/';
                    } else if (value.length == 5) {
                      var a = value.split('/');
                      console.log(a);
                      if (a[1].length == 2 && !a[1].match('/')) {
                        console.log('3');
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
                      'currentAssessmentDate',
                      true,
                      /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
                    );
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  id="currentAssessmentDate"
                  underlineFocusStyle={styles.underlineFocusStyle}
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
                      {translate('pt.create.groups.propertyAddress.fields.firstAssessmentDate')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  errorText={
                    fieldErrors.firstAssessmentDate ? (
                      <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.firstAssessmentDate}</span>
                    ) : (
                      ''
                    )
                  }
                  value={constructionDetails.firstAssessmentDate ? constructionDetails.firstAssessmentDate : ''}
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
                      'firstAssessmentDate',
                      true,
                      /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
                    );
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  id="firstAssessmentDate"
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  hintText="dd/mm/yyyy"
                  floatingLabelFixed={true}
                  floatingLabelText={translate('pt.create.groups.propertyAddress.fields.revisedAssessmentDate')}
                  errorText={
                    fieldErrors.revisedAssessmentDate ? (
                      <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.revisedAssessmentDate}</span>
                    ) : (
                      ''
                    )
                  }
                  value={constructionDetails.revisedAssessmentDate ? constructionDetails.revisedAssessmentDate : ''}
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
                      'revisedAssessmentDate',
                      false,
                      /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
                    );
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  id="revisedAssessmentDate"
                  underlineFocusStyle={styles.underlineFocusStyle}
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
                      {translate('pt.create.groups.propertyAddress.fields.lastAssessmentDate')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  errorText={
                    fieldErrors.lastAssessmentDate ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.lastAssessmentDate}</span> : ''
                  }
                  value={constructionDetails.lastAssessmentDate ? constructionDetails.lastAssessmentDate : ''}
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
                      'lastAssessmentDate',
                      true,
                      /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
                    );
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  id="lastAssessmentDate"
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  hintText="dd/mm/yyyy"
                  floatingLabelFixed={true}
                  floatingLabelText={translate('pt.create.groups.constructionDetails.fields.orderDate')}
                  errorText={fieldErrors.orderDate ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.orderDate}</span> : ''}
                  value={constructionDetails.orderDate ? constructionDetails.orderDate : ''}
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
                      'orderDate',
                      false,
                      /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
                    );
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  id="orderDate"
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  floatingLabelFixed={true}
                  floatingLabelText={translate('pt.create.groups.constructionDetails.fields.certificateNumber')}
                  errorText={
                    fieldErrors.certificateNumber ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.certificateNumber}</span> : ''
                  }
                  value={constructionDetails.certificateNumber ? constructionDetails.certificateNumber : ''}
                  onChange={e => {
                    handleChange(e, 'certificateNumber', false, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  id="certificateNumber"
                  maxLength={16}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  hintText="dd/mm/yyyy"
                  floatingLabelFixed={true}
                  floatingLabelText={translate('pt.create.groups.constructionDetails.fields.certificateCompletionDate')}
                  errorText={
                    fieldErrors.certificateCompletionDate ? (
                      <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.certificateCompletionDate}</span>
                    ) : (
                      ''
                    )
                  }
                  value={constructionDetails.certificateCompletionDate ? constructionDetails.certificateCompletionDate : ''}
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
                      'certificateCompletionDate',
                      false,
                      /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
                    );
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  id="certificateCompletionDate"
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  hintText="dd/mm/yyyy"
                  floatingLabelFixed={true}
                  floatingLabelText={translate('pt.create.groups.constructionDetails.fields.certificateReceivedDate')}
                  errorText={
                    fieldErrors.certificateReceivedDate ? (
                      <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.certificateReceivedDate}</span>
                    ) : (
                      ''
                    )
                  }
                  value={constructionDetails.certificateReceivedDate ? constructionDetails.certificateReceivedDate : ''}
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
                      'certificateReceivedDate',
                      false,
                      /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
                    );
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  id="certificateReceivedDate"
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  floatingLabelText={translate('pt.create.groups.constructionDetails.fields.agencyName')}
                  floatingLabelFixed={true}
                  errorText={fieldErrors.agencyName ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.agencyName}</span> : ''}
                  value={constructionDetails.agencyName ? constructionDetails.agencyName : ''}
                  onChange={e => {
                    handleChange(e, 'agencyName', false, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  id="agencyName"
                  underlineFocusStyle={styles.underlineFocusStyle}
                  maxLength={16}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  floatingLabelText={translate('pt.create.groups.constructionDetails.fields.licenseType')}
                  floatingLabelFixed={true}
                  errorText={fieldErrors.licenseType ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.licenseType}</span> : ''}
                  value={constructionDetails.licenseType ? constructionDetails.licenseType : ''}
                  onChange={e => {
                    handleChange(e, 'licenseType', false, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  maxLength={16}
                  id="licenseType"
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  floatingLabelText={translate('pt.create.groups.constructionDetails.fields.licenseNumber')}
                  floatingLabelFixed={true}
                  errorText={fieldErrors.licenseNumber ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.licenseNumber}</span> : ''}
                  value={constructionDetails.licenseNumber ? constructionDetails.licenseNumber : ''}
                  onChange={e => {
                    handleChange(e, 'licenseNumber', false, /^[0-9,<>!@#\$%\^\&*\)\(+=._-]+$/g);
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  maxLength={64}
                  id="licenseNumber"
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
  constructionDetails: state.form.form,
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
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ConstructionDetails);
