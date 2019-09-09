import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import DataTable from '../../../../common/Table';
import Api from '../../../../../api/api';
import styles from '../../../../../styles/material-ui';
import { translate } from '../../../../common/common';

const $ = require('jquery');
$.DataTable = require('datatables.net');
const dt = require('datatables.net-bs');

const buttons = require('datatables.net-buttons-bs');

require('datatables.net-buttons/js/buttons.colVis.js'); // Column visibility
require('datatables.net-buttons/js/buttons.html5.js'); // HTML 5 file export
require('datatables.net-buttons/js/buttons.flash.js'); // Flash file export
require('datatables.net-buttons/js/buttons.print.js'); // Print view button

var flag = 0;

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

class DefineEscalationTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grievanceTypeSource: [],
      designation: [],
      dataSourceConfig: {
        text: 'serviceName',
        value: 'id',
      },
      isSearchClicked: false,
      resultList: [],
      noData: false,
      escalationForm: {},
      editIndex: -1,
    };
  }

  componentWillMount() {
    let { initForm } = this.props;
    initForm();

    $('#searchTable').DataTable({
      dom: 'lBfrtip',
      buttons: ['excel', 'pdf', 'print'],
      ordering: false,
      bDestroy: true,
    });
  }

  componentDidMount() {
    let { setLoadingStatus } = this.props;
    setLoadingStatus('loading');

    let self = this;
    Api.commonApiPost('/pgr-master/service/v1/_search', {
      keywords: 'complaint',
    }).then(
      function(response) {
        self.setState({
          grievanceTypeSource: response.Service,
        });
        setLoadingStatus('hide');
      },
      function(err) {
        self.setState({
          grievanceTypeSource: [],
        });
        setLoadingStatus('hide');
      }
    );

    Api.commonApiPost('/hr-masters/designations/_search').then(
      function(response) {
        self.setState({
          designation: response.Designation,
        });
      },
      function(err) {
        self.setState({
          designation: [],
        });
      }
    );
  }

  componentWillUpdate() {
    $('#searchTable')
      .dataTable()
      .fnDestroy();
  }

  componentDidUpdate() {
    if (flag == 1) {
      flag = 0;
      $('#searchTable').DataTable({
        dom: 'lBfrtip',
        buttons: [],
        bDestroy: true,
      });
    }
  }

  componentWillUnmount() {
    $('#searchTable')
      .DataTable()
      .destroy(true);
  }

  submitForm = e => {
    let { setLoadingStatus, toggleSnackbarAndSetText } = this.props;

    setLoadingStatus('loading');

    e.preventDefault();
    let current = this;

    let query = {
      id: this.props.defineEscalationTime.grievanceType.id,
    };

    Api.commonApiPost('workflow/escalation-hours/v1/_search', query, {})
      .then(function(response) {
        if (response.EscalationTimeType[0] != null && response.EscalationTimeType[0].id != null) {
          flag = 1;
          current.setState({
            resultList: response.EscalationTimeType,
            isSearchClicked: true,
            noData: false,
          });
        } else {
          current.setState({
            noData: true,
            resultList: [],
            isSearchClicked: false,
          });
        }
        setLoadingStatus('hide');
      })
      .catch(error => {
        current.setState({
          resultList: [],
          isSearchClicked: false,
        });
        setLoadingStatus('hide');
        toggleSnackbarAndSetText(true, error.message);
      });
  };

  addEscalation = () => {
    let { setLoadingStatus, toggleDailogAndSetText, toggleSnackbarAndSetText, emptyProperty } = this.props;
    setLoadingStatus('loading');

    var current = this;
    var body = {
      EscalationTimeType: {
        grievancetype: {
          id: this.props.defineEscalationTime.grievanceType.id,
        },
        noOfHours: this.props.defineEscalationTime.noOfHours,
        designation: this.props.defineEscalationTime.designation,
        tenantId: localStorage.getItem('tenantId') ? localStorage.getItem('tenantId') : 'default',
      },
    };

    Api.commonApiPost('workflow/escalation-hours/v1/_create', {}, body)
      .then(function(response) {
        let msg = `${translate('pgr.lbl.escalationstime')} ${translate('core.lbl.createdsuccessful')}`;
        toggleDailogAndSetText(true, msg);
        emptyProperty('noOfHours');
        emptyProperty('designation');
        let searchquery = {
          id: current.props.defineEscalationTime.grievanceType.id,
        };

        Api.commonApiPost('workflow/escalation-hours/v1/_search', searchquery, {})
          .then(function(response) {
            if (response.EscalationTimeType[0] != null) {
              flag = 1;
              current.setState({
                resultList: response.EscalationTimeType,
                isSearchClicked: true,
                noData: false,
              });
            } else {
              current.setState({
                noData: true,
              });
            }
            setLoadingStatus('hide');
          })
          .catch(error => {
            setLoadingStatus('hide');
            toggleSnackbarAndSetText(true, error.message);
          });
      })
      .catch(error => {
        setLoadingStatus('hide');
        toggleSnackbarAndSetText(true, error.message);
      });
  };

  updateEscalation = () => {
    let { setLoadingStatus, toggleDailogAndSetText, toggleSnackbarAndSetText, emptyProperty } = this.props;
    setLoadingStatus('loading');

    var current = this;
    var body = {
      EscalationTimeType: {
        id: this.props.defineEscalationTime.id,
        grievancetype: {
          id: this.props.defineEscalationTime.grievanceType.id,
        },
        noOfHours: this.props.defineEscalationTime.noOfHours,
        designation: this.props.defineEscalationTime.designation,
        tenantId: localStorage.getItem('tenantId') ? localStorage.getItem('tenantId') : 'default',
      },
    };

    Api.commonApiPost('workflow/escalation-hours/v1/_update', {}, body)
      .then(function(response) {
        let searchquery = {
          id: current.props.defineEscalationTime.grievanceType.id,
        };
        let msg = `${translate('pgr.lbl.escalationstime')} ${translate('core.lbl.updatedsuccessful')}`;
        toggleDailogAndSetText(true, msg);
        emptyProperty('noOfHours');
        emptyProperty('designation');

        Api.commonApiPost('workflow/escalation-hours/v1/_search', searchquery, {})
          .then(function(response) {
            if (response.EscalationTimeType[0] != null) {
              flag = 1;
              current.setState({
                resultList: response.EscalationTimeType,
                isSearchClicked: true,
                noData: false,
              });
            } else {
              current.setState({
                noData: true,
              });
            }
            setLoadingStatus('hide');
          })
          .catch(error => {
            setLoadingStatus('hide');
            toggleSnackbarAndSetText(true, error.message);
          });

        current.setState(prevState => {
          prevState.editIndex = -1;
        });
      })
      .catch(error => {
        setLoadingStatus('hide');
        toggleSnackbarAndSetText(true, error.message);
      });
  };

  editObject = index => {
    this.props.setForm(this.state.resultList[index]);
  };

  deleteObject = index => {
    this.setState({
      resultList: [...this.state.resultList.slice(0, index), ...this.state.resultList.slice(index + 1)],
    });
  };

  render() {
    var current = this;

    let { isFormValid, defineEscalationTime, fieldErrors, handleChange, handleAutoCompleteKeyUp } = this.props;

    let { submitForm, localHandleChange, addEscalation, deleteObject, editObject, updateEscalation } = this;

    let { isSearchClicked, resultList, escalationForm, designation, editIndex } = this.state;

    const renderBody = function() {
      if (resultList && resultList.length)
        return resultList.map(function(val, i) {
          return (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{getNameById(current.state.designation, val.designation)}</td>
              <td>{val.noOfHours}</td>
              <td>
                <RaisedButton
                  style={{ margin: '0 3px' }}
                  label={translate('pgr.lbl.edit')}
                  primary={true}
                  onClick={() => {
                    editObject(i);
                    current.setState({ editIndex: i });
                  }}
                />
                {false && (
                  <RaisedButton
                    style={{ margin: '0 3px' }}
                    label={translate('pgr.lbl.delete')}
                    disabled={editIndex < 0 ? false : true}
                    primary={true}
                    onClick={() => {
                      deleteObject(i);
                    }}
                  />
                )}
              </td>
            </tr>
          );
        });
    };

    const viewTable = function() {
      if (isSearchClicked)
        return (
          <Card style={styles.marginStyle}>
            <CardText>
              <Row>
                <Col xs={12} sm={4} md={3} lg={3}>
                  <SelectField
                    className="custom-form-control-for-select"
                    hintText="Select"
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFixed={true}
                    floatingLabelText={translate('pgr.lbl.designation')}
                    fullWidth={true}
                    value={defineEscalationTime.designation ? defineEscalationTime.designation : ''}
                    onChange={(e, index, value) => {
                      var e = {
                        target: {
                          value: value,
                        },
                      };
                      handleChange(e, 'designation', true, '');
                    }}
                  >
                    <MenuItem value="" primaryText="Select" />
                    {current.state.designation &&
                      current.state.designation.map((e, i) => {
                        return <MenuItem key={i} value={e.id} primaryText={e.name} />;
                      })}
                  </SelectField>
                </Col>
                <Col xs={12} sm={4} md={3} lg={3}>
                  <TextField
                    className="custom-form-control-for-textfield"
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFixed={true}
                    floatingLabelText={translate('pgr.noof.hours')}
                    value={defineEscalationTime.noOfHours ? defineEscalationTime.noOfHours : ''}
                    errorText={fieldErrors.noOfHours ? fieldErrors.noOfHours : ''}
                    maxLength={4}
                    onChange={e => {
                      handleChange(e, 'noOfHours', true, /^\d{0,4}$/g, 'Please use only numbers');
                    }}
                    id="noOfHours"
                  />
                </Col>
              </Row>
              <div className="text-center">
                {editIndex < 0 && (
                  <RaisedButton
                    style={{ margin: '15px 5px' }}
                    disabled={!isFormValid}
                    label={translate('pgr.lbl.add')}
                    primary={true}
                    onClick={() => {
                      addEscalation();
                    }}
                  />
                )}
                {editIndex >= 0 && (
                  <RaisedButton
                    style={{ margin: '15px 5px' }}
                    disabled={!isFormValid}
                    label={translate('pgr.lbl.update')}
                    primary={true}
                    onClick={() => {
                      updateEscalation();
                    }}
                  />
                )}
              </div>
            </CardText>
            <CardText>
              <Table id="searchTable" style={{ color: 'black', fontWeight: 'normal' }} bordered responsive className="table-striped">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>{translate('pgr.lbl.designation')}</th>
                    <th>{translate('pgr.noof.hours')}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>{renderBody()}</tbody>
              </Table>
            </CardText>
          </Card>
        );
    };

    return (
      <div className="defineEscalationTime">
        <form
          autoComplete="off"
          onSubmit={e => {
            submitForm(e);
          }}
        >
          <Card style={styles.marginStyle}>
            <CardHeader
              style={{ paddingBottom: 0 }}
              title={
                <div style={styles.headerStyle}>
                  {' '}
                  {translate('pgr.lbl.create')} / {translate('pgr.lbl.update')} {translate('pgr.lbl.escalationstime')}
                </div>
              }
            />
            <CardText>
              <Grid>
                <Row>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <AutoComplete
                      className="custom-form-control-for-textfield"
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.grievance.type')}
                      fullWidth={true}
                      filter={function filter(searchText, key) {
                        return key.toLowerCase().includes(searchText.toLowerCase());
                      }}
                      dataSource={this.state.grievanceTypeSource}
                      dataSourceConfig={this.state.dataSourceConfig}
                      onKeyUp={handleAutoCompleteKeyUp}
                      errorText={fieldErrors.grievanceType ? fieldErrors.grievanceType : ''}
                      value={defineEscalationTime.grievanceType ? defineEscalationTime.grievanceType : ''}
                      ref="grievanceType"
                      onNewRequest={(chosenRequest, index) => {
                        if (index === -1) {
                          this.refs['grievanceType'].setState({
                            searchText: '',
                          });
                        } else {
                          var e = {
                            target: {
                              value: chosenRequest,
                            },
                          };
                          handleChange(e, 'grievanceType', true, '');
                        }
                      }}
                    />
                  </Col>
                </Row>
              </Grid>
            </CardText>
          </Card>
          <div style={{ textAlign: 'center' }}>
            <RaisedButton
              style={{ margin: '15px 5px' }}
              type="submit"
              disabled={defineEscalationTime.grievanceType ? false : true}
              label={translate('core.lbl.search')}
              primary={true}
            />
          </div>
          {this.state.noData && (
            <Card className="text-center" style={styles.marginStyle}>
              <CardHeader title={<strong style={{ color: '#5a3e1b', paddingLeft: 90 }}>{translate('pgr.lbl.escdetail')}</strong>} />
              <CardText>
                <RaisedButton
                  style={{ margin: '10px 0' }}
                  label={translate('pgr.lbl.addesc')}
                  primary={true}
                  onClick={() => {
                    this.setState({
                      isSearchClicked: true,
                      noData: false,
                    });
                  }}
                />
              </CardText>
            </Card>
          )}
          {viewTable()}
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    defineEscalationTime: state.form.form,
    fieldErrors: state.form.fieldErrors,
    isFormValid: state.form.isFormValid,
  };
};

const mapDispatchToProps = dispatch => ({
  initForm: () => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: ['designation', 'noOfHours', 'grievanceType'],
        },
        pattern: {
          current: [],
          required: ['noOfHours'],
        },
      },
    });
  },

  setForm: data => {
    dispatch({
      type: 'SET_FORM',
      data,
      isFormValid: true,
      fieldErrors: {},
      validationData: {
        required: {
          current: ['designation', 'noOfHours'],
          required: ['designation', 'noOfHours'],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },

  handleChange: (e, property, isRequired, pattern, errorMsg) => {
    dispatch({
      type: 'HANDLE_CHANGE',
      property,
      value: e.target.value,
      isRequired,
      pattern,
      errorMsg,
    });
  },

  emptyProperty: property => {
    dispatch({
      type: 'EMPTY_PROPERTY',
      property,
      isFormValid: false,
      validationData: {
        required: {
          current: ['grievanceType'],
          required: ['designation', 'noOfHours', 'grievanceType'],
        },
        pattern: {
          current: [],
          required: ['noOfHours'],
        },
      },
    });
  },

  handleAutoCompleteKeyUp: e => {
    dispatch({
      type: 'HANDLE_CHANGE',
      property: 'addressId',
      value: '',
      isRequired: true,
      pattern: '',
    });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  toggleDailogAndSetText: (dailogState, msg) => {
    dispatch({ type: 'TOGGLE_DAILOG_AND_SET_TEXT', dailogState, msg });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DefineEscalationTime);
