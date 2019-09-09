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
import { validate_fileupload } from '../../../../common/common';
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

class ConstructionTypes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      documentType: [],
    };
  }

  componentDidMount() {
    var currentThis = this;

    let { setLoadingStatus, toggleSnackbarAndSetText } = this.props;

    setLoadingStatus('loading');

    Api.commonApiPost('pt-property/property/documenttypes/_search')
      .then(res => {
        console.log(res);
        currentThis.setState({ documentType: res.documentType });
        setLoadingStatus('hide');
      })
      .catch(err => {
        currentThis.setState({
          documentType: [],
        });
        console.log(err);
        toggleSnackbarAndSetText(true, err.message);
        setLoadingStatus('hide');
      });
  }

  handleUploadValidation = (e, code, formats, limit) => {
    console.log(this.props.files);

    if (this.props.files.length >= limit) {
      console.log(this.props.files);
      console.log('Maximum files allowed : ' + limit);
      return;
    }

    let validFile = validate_fileupload(e.target.files, formats);

    e.target.files.createCode = code;

    if (validFile) {
      this.props.handleUpload(e);
      console.log(e.target.files.length);
    } else {
      console.log(validFile);
    }
  };

  render() {
    let {
      owners,
      constructionTypes,
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
      files,
    } = this.props;

    let { search, handleUploadValidation } = this;

    let cThis = this;

    return (
      <Card className="uiCard">
        <CardHeader
          style={styles.reducePadding}
          title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('employee.Employee.fields.documents')}</div>}
        />
        <CardText style={styles.reducePadding}>
          <Grid fluid>
            <Row style={{ paddingTop: 8, paddingBottom: 4 }}>
              <Col xs={12} md={6}>
                {this.state.documentType.length == 0 && <div>{translate('pt.create.groups.documentUpload.noFilesToUpload')}</div>}
                {this.state.documentType.length != 0 &&
                  this.state.documentType.map((item, index) => (
                    <Row style={{ margin: '10px 0' }}>
                      <Col xs={12} md={6}>
                        {item.code}
                      </Col>
                      <Col xs={12} md={6}>
                        <input
                          type="file"
                          accept="image/*"
                          name={item.name}
                          onChange={e => handleUploadValidation(e, item.name, ['jpg', 'jpeg', 'png'], 3)}
                        />
                      </Col>
                    </Row>
                  ))}
              </Col>
              <Col xs={12} md={9} style={{ display: 'flex', flexWrap: 'wrap' }}>
                {this.state.files.map((e, i) => (
                  <Chip key={i} style={styles.chip}>
                    {e}
                  </Chip>
                ))}
              </Col>
            </Row>
          </Grid>
        </CardText>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  constructionTypes: state.form.form,
  fieldErrors: state.form.fieldErrors,
  editIndex: state.form.editIndex,
  addRoom: state.form.addRoom,
  files: state.form.files,
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
  handleUpload: e => {
    dispatch({ type: 'FILE_UPLOAD', files: e.target.files });
  },

  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ConstructionTypes);
