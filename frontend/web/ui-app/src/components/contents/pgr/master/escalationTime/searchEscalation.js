import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import DataTable from '../../../../common/Table';
import Api from '../../../../../api/api';
import styles from '../../../../../styles/material-ui';
import { translate } from '../../../../common/common';

import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.html5.js'; // HTML 5 file export
import 'datatables.net-buttons/js/buttons.flash.js'; // Flash file export
import jszip from 'jszip/dist/jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

var flag = 0;

const getNameById = function(object, id, property = '') {
  if (id == '' || id == null) {
    return '';
  }
  for (var i = 0; i < object.length; i++) {
    if (property == '') {
      if (object[i].id == id) {
        if (object[i].serviceName) {
          return object[i].serviceName;
        } else {
          return object[i].name;
        }
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

const getNameByServiceCode = function(object, id, property = '') {
  if (id == '' || id == null) {
    return '';
  }
  for (var i = 0; i < object.length; i++) {
    if (property == '') {
      if (object[i].id == id) {
        return object[i].serviceName;
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

class SearchEscalation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      designationSource: [],
      grievanceTypeSource: [],
      designationDataSourceConfig: {
        text: 'name',
        value: 'id',
      },
      serviceDataSourceConfig: {
        text: 'serviceName',
        value: 'id',
      },
      isSearchClicked: false,
      resultList: [],
    };
  }

  componentWillMount() {
    let { initForm, setLoadingStatus } = this.props;

    setLoadingStatus('loading');

    $('#searchTable').DataTable({
      dom: 'lBfrtip',
      buttons: [],
      bDestroy: true,
    });

    initForm();
  }

  componentDidMount() {
    let self = this;

    let { setLoadingStatus } = this.props;

    Api.commonApiPost('/pgr-master/service/v1/_search', {
      keywords: 'complaint',
    }).then(
      function(response) {
        setLoadingStatus('hide');
        self.setState({
          grievanceTypeSource: response.Service,
        });
      },
      function(err) {
        self.setState({
          grievanceTypeSource: [],
        });
      }
    );

    Api.commonApiPost('/hr-masters/designations/_search').then(
      function(response) {
        self.setState({
          designationSource: response.Designation,
        });
      },
      function(err) {
        self.setState({
          designationSource: [],
        });
      }
    );
  }

  componentWillUnmount() {
    $('#searchTable')
      .DataTable()
      .destroy(true);
  }

  componentWillUpdate() {
    $('#searchTable')
      .dataTable()
      .fnDestroy();
  }

  componentDidUpdate() {
    $('#searchTable').DataTable({
      dom: '<"col-md-4"l><"col-md-4"B><"col-md-4"f>rtip',
      buttons: ['excel', 'pdf'],
      bDestroy: true,
    });
  }

  submitForm = e => {
    let { setLoadingStatus, toggleSnackbarAndSetText } = this.props;
    setLoadingStatus('loading');
    e.preventDefault();

    let current = this;

    let { searchEscalation } = this.props;

    var query = {};

    if (searchEscalation.designation && searchEscalation.serviceType) {
      query = {
        designation: searchEscalation.designation.id,
        serviceId: searchEscalation.serviceType.id,
      };
    } else if (searchEscalation.serviceType) {
      query = {
        serviceId: searchEscalation.serviceType.id,
      };
    } else if (searchEscalation.designation) {
      query = {
        designation: searchEscalation.designation.id,
      };
    } else {
    }

    Api.commonApiPost('/workflow/escalation-hours/v1/_search', query, {})
      .then(function(response) {
        setLoadingStatus('hide');
        flag = 1;
        current.setState({
          resultList: response.EscalationTimeType,
          isSearchClicked: true,
        });
      })
      .catch(error => {
        setLoadingStatus('hide');
        toggleSnackbarAndSetText(true, error.message);
        current.setState({
          resultList: [],
          isSearchClicked: false,
        });
      });
  };

  render() {
    var current = this;

    let { isFormValid, searchEscalation, fieldErrors, handleChange, handleAutoCompleteKeyUp } = this.props;

    let { submitForm } = this;

    let { isSearchClicked, resultList } = this.state;

    const renderBody = function() {
      if (resultList && resultList.length)
        return resultList.map(function(val, i) {
          return (
            <tr key={i}>
              <td>{getNameByServiceCode(current.state.grievanceTypeSource, val.grievanceType.id)}</td>
              <td>{getNameById(current.state.designationSource, val.designation)}</td>
              <td>{val.noOfHours}</td>
            </tr>
          );
        });
    };

    const viewTable = function() {
      if (isSearchClicked)
        return (
          <Card style={styles.marginStyle}>
            <CardHeader title={<strong style={{ color: '#5a3e1b' }}> Search Result </strong>} />
            <CardText>
              <Table id="searchTable" style={{ color: 'black', fontWeight: 'normal' }} bordered responsive className="table-striped">
                <thead>
                  <tr>
                    <th>{translate('pgr.lbl.grievance.type')}</th>
                    <th>{translate('pgr.lbl.designation')}</th>
                    <th>{translate('pgr.noof.hours')}</th>
                  </tr>
                </thead>
                <tbody>{renderBody()}</tbody>
              </Table>
            </CardText>
          </Card>
        );
    };

    return (
      <div className="searchEscalation">
        <form
          autoComplete="off"
          onSubmit={e => {
            submitForm(e);
          }}
        >
          <Card style={styles.marginStyle}>
            <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}>{translate('pgr.lbl.escalationtime')}</div>} />
            <CardText>
              <Grid>
                <Row>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <AutoComplete
                      className="custom-form-control-for-textfield"
                      listStyle={{ maxHeight: 200, overflow: 'auto' }}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.grievance.type')}
                      fullWidth={true}
                      filter={function filter(searchText, key) {
                        return key.toLowerCase().includes(searchText.toLowerCase());
                      }}
                      dataSource={this.state.grievanceTypeSource}
                      dataSourceConfig={this.state.serviceDataSourceConfig}
                      onKeyUp={e => {
                        handleAutoCompleteKeyUp(e, 'grievanceType');
                      }}
                      value={searchEscalation.serviceType ? searchEscalation.serviceType : ''}
                      ref="serviceType"
                      onNewRequest={(chosenRequest, index) => {
                        if (index === -1) {
                          this.refs['serviceType'].setState({ searchText: '' });
                        } else {
                          var e = {
                            target: {
                              value: chosenRequest,
                            },
                          };
                          handleChange(e, 'serviceType', false, '');
                        }
                      }}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <AutoComplete
                      className="custom-form-control-for-textfield"
                      listStyle={{ maxHeight: 200, overflow: 'auto' }}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.designation')}
                      fullWidth={true}
                      filter={function filter(searchText, key) {
                        return key.toLowerCase().includes(searchText.toLowerCase());
                      }}
                      dataSource={this.state.designationSource}
                      dataSourceConfig={this.state.designationDataSourceConfig}
                      onKeyUp={e => {
                        handleAutoCompleteKeyUp(e, 'designation');
                      }}
                      value={searchEscalation.designation ? searchEscalation.designation : ''}
                      ref="designation"
                      onNewRequest={(chosenRequest, index) => {
                        if (index === -1) {
                          this.refs['designation'].setState({ searchText: '' });
                        } else {
                          var e = {
                            target: {
                              value: chosenRequest,
                            },
                          };
                          handleChange(e, 'designation', false, '');
                        }
                      }}
                    />
                  </Col>
                </Row>
              </Grid>
            </CardText>
          </Card>
          <div style={{ textAlign: 'center' }}>
            <RaisedButton style={{ margin: '15px 5px' }} type="submit" label={translate('core.lbl.search')} primary={true} />
          </div>
          {viewTable()}
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    searchEscalation: state.form.form,
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

  handleAutoCompleteKeyUp: (e, type) => {
    dispatch({
      type: 'HANDLE_CHANGE',
      property: type,
      value: e.target.value,
      isRequired: true,
      pattern: '',
    });
  },

  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchEscalation);
