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
import Api from '../../../../api/api';

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

class Workflow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      designation: [],
      workflowDepartment: [],
      approver: [],
      result: [],
    };
  }

  componentDidMount() {
    //call boundary service fetch wards,location,zone data
    var currentThis = this;

    Api.commonApiPost('egov-common-masters/departments/_search')
      .then(res => {
        console.log(res);
        res.Department.unshift({ id: -1, name: 'None' });
        currentThis.setState({ workflowDepartment: res.Department });
      })
      .catch(err => {
        currentThis.setState({
          workflowDepartment: [],
        });
        console.log(err);
      });

    var query2 = {
      propertyId: localStorage['propertyId'],
    };

    Api.commonApiPost('pt-property/properties/_search', query2, {}, false, true)
      .then(res => {
        console.log('bboom');

        if (res.hasOwnProperty('Errors')) {
          //toggleSnackbarAndSetText(true, "Something went wrong. Please try again.")
        } else {
          var query = {
            id: res.properties[0].propertyDetail.stateId,
          };

          Api.commonApiPost('egov-common-workflows/process/_search', query, {}, false, true)
            .then(res => {
              console.log('dsgdhgdfgfdgdgffdgd', res);

              Api.commonApiPost(
                'egov-common-workflows/designations/_search?businessKey=Create Property&departmentRule=&currentStatus=' +
                  res.processInstance.status +
                  '&amountRule=&additionalRule=&pendingAction=&approvalDepartmentName=&designation&',
                {},
                {},
                false,
                false
              )
                .then(res => {
                  for (var i = 0; i < res.length; i++) {
                    Api.commonApiPost('hr-masters/designations/_search', {
                      name: res[i].name,
                    })
                      .then(response => {
                        console.log(response);
                        response.Designation.unshift({ id: -1, name: 'None' });
                        currentThis.setState({
                          ...currentThis.state,
                          designation: [...currentThis.state.designation, ...response.Designation],
                        });
                      })
                      .catch(err => {
                        currentThis.setState({ designation: [] });
                        console.log(err);
                      });
                  }
                })
                .catch(err => {
                  currentThis.setState({
                    designation: [],
                  });
                  console.log(err);
                });

              console.log(res);
              currentThis.setState({
                result: res.processInstance,
              });
            })
            .catch(err => {
              console.log(res);
              currentThis.setState({
                result: [],
              });
            });
        }
      })
      .catch(err => {
        //toggleSnackbarAndSetText(true, err.message)
      });
  }

  handleWorkFlowChange = (e, type) => {
    let currentThis = this;

    let query = {};

    let hasData = false;

    if (type == 'department' && e.target.value != '' && this.props.workflow.workflowDesignation) {
      console.log(type);
      query = {
        departmentId: e.target.value,
        designationId: this.props.workflow.workflowDesignation,
      };
      hasData = true;
    } else if (type == 'designation' && e.target.value != '' && this.props.workflow.workflowDepartment) {
      console.log(type);
      query = {
        departmentId: this.props.workflow.workflowDepartment,
        designationId: e.target.value,
      };
      hasData = true;
    } else {
      hasData = false;
    }

    if (hasData) {
      Api.commonApiPost('/hr-employee/employees/_search', query)
        .then(res => {
          currentThis.setState({ approver: res.Employee });
        })
        .catch(err => {
          currentThis.setState({
            approver: [],
          });
          console.log(err);
        });
    }
  };

  onFileLoad = (e, file) => {
    console.log(file.name);
    this.setState(prevState => {
      prevState.files.push(file.name);
    });
    console.log(this.state.files);
  };

  render() {
    const renderOption = function(list, listName = '') {
      if (list) {
        return list.map(item => {
          return <MenuItem key={item.id} value={item.id} primaryText={item.name} />;
        });
      }
    };

    const renderApprover = function(list, listName = '') {
      if (list) {
        return list.map(item => {
          console.log(item);
          return <MenuItem key={item.id} value={item.assignments[0].position} primaryText={item.name} />;
        });
      }
    };

    let {
      workflow,
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

    let { search, handleWorkFlowChange } = this;

    let cThis = this;

    return (
      <Card className="uiCard">
        <CardHeader style={styles.reducePadding} title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>Workflow</div>} />
        <CardText style={styles.reducePadding}>
          <Grid fluid>
            <Row>
              <Col xs={12} md={3} sm={6}>
                <SelectField
                  className="fullWidth selectOption"
                  floatingLabelText="Department Name *"
                  errorText={
                    fieldErrors.workflowDepartment ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.workflowDepartment}</span> : ''
                  }
                  value={workflow.workflowDepartment ? workflow.workflowDepartment : ''}
                  onChange={(event, index, value) => {
                    value == -1 ? (value = '') : '';
                    var e = {
                      target: {
                        value: value,
                      },
                    };
                    handleWorkFlowChange(e, 'department');
                    handleChange(e, 'workflowDepartment', true, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                >
                  {renderOption(this.state.workflowDepartment)}
                </SelectField>
              </Col>
              <Col xs={12} md={3} sm={6}>
                <SelectField
                  className="fullWidth selectOption"
                  floatingLabelText="Designation Name *"
                  errorText={
                    fieldErrors.workflowDesignation ? (
                      <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.workflowDesignation}</span>
                    ) : (
                      ''
                    )
                  }
                  value={workflow.workflowDesignation ? workflow.workflowDesignation : ''}
                  onChange={(event, index, value) => {
                    value == -1 ? (value = '') : '';
                    var e = {
                      target: {
                        value: value,
                      },
                    };
                    handleWorkFlowChange(e, 'designation');
                    handleChange(e, 'workflowDesignation', true, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                >
                  {renderOption(this.state.designation)}
                </SelectField>
              </Col>
              <Col xs={12} md={3} sm={6}>
                <SelectField
                  className="fullWidth selectOption"
                  floatingLabelText="Approver Name *"
                  errorText={fieldErrors.approver ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.approver}</span> : ''}
                  value={workflow.approver ? workflow.approver : ''}
                  onChange={(event, index, value) => {
                    value == -1 ? (value = '') : '';
                    var e = {
                      target: {
                        value: value,
                      },
                    };
                    handleChange(e, 'approver', true, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                >
                  {renderApprover(this.state.approver)}
                </SelectField>
              </Col>
              <Col xs={12} md={3} sm={6}>
                <TextField
                  className="fullWidth"
                  floatingLabelText="Comments"
                  errorText={fieldErrors.comments ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.comments}</span> : ''}
                  value={workflow.comments ? workflow.comments : ''}
                  onChange={e => {
                    handleChange(e, 'comments', false, '');
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
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
  workflow: state.form.form,
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

export default connect(mapStateToProps, mapDispatchToProps)(Workflow);
