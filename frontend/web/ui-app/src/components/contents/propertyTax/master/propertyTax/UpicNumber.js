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

class UpicNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
      upicNumber,
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
    } = this.props;

    let { search, handleUpicNumberChange } = this;

    let cThis = this;

    return (
      <Card className="uiCard">
        <CardHeader
          style={styles.reducePadding}
          title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('pt.create.groups.oldPropertyNo')} </div>}
        />
        <CardText style={styles.reducePadding}>
          <Grid fluid>
            <Row>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  hintText="1000011122"
                  floatingLabelText={
                    <span>
                      {translate('pt.create.groups.oldPropertyNo')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  errorText={fieldErrors.oldUpicNumber ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.oldUpicNumber}</span> : ''}
                  value={upicNumber.oldUpicNumber ? upicNumber.oldUpicNumber : ''}
                  onChange={e => {
                    handleChange(e, 'oldUpicNumber', true, /^[a-zA-Z0-9,/<>!@#\$%\^\&*\)\(+=._-]+$/g);
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  id="oldUpicNumber"
                  underlineStyle={styles.underlineStyle}
                  floatingLabelFixed={true}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                  maxLength={15}
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
  upicNumber: state.form.form,
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

  isAddRoom: room => {
    dispatch({
      type: 'ADD_ROOM',
      room,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UpicNumber);
