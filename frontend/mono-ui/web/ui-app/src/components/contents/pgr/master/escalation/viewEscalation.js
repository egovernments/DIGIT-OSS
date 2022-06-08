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

const getNameByServiceCode = function(object, serviceCode, property = '') {
  if (serviceCode == '' || serviceCode == null) {
    return '';
  }
  for (var i = 0; i < object.length; i++) {
    if (property == '') {
      if (object[i].serviceCode == serviceCode) {
        return object[i].serviceName;
      }
    } else {
      if (object[i].hasOwnProperty(property)) {
        if (object[i].serviceCode == serviceCode) {
          return object[i][property];
        }
      } else {
        return '';
      }
    }
  }
  return '';
};

class ViewEscalation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positionSource: [],
      grievanceTypeSource: [],
      positionDataSourceConfig: {
        text: 'name',
        value: 'id',
      },
      serviceDataSourceConfig: {
        text: 'serviceName',
        value: 'id',
      },
      isSearchClicked: false,
      searchResult: [],
    };
  }

  componentWillMount() {
    let { initForm } = this.props;
    initForm();
    $('#searchTable').DataTable({
      dom: 'lBfrtip',
      buttons: [],
      bDestroy: true,
    });
  }

  componentDidMount() {
    let self = this;
    Api.commonApiPost('/hr-masters/positions/_search').then(
      function(response) {
        self.setState({
          positionSource: response.Position,
        });
      },
      function(err) {
        self.setState({
          positionSource: [],
        });
      }
    );

    Api.commonApiPost('/pgr/services/v1/_search', { type: 'all' }).then(
      function(response) {
        self.setState({
          grievanceTypeSource: response.complaintTypes,
        });
      },
      function(err) {
        self.setState({
          grievanceTypeSource: [],
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
    $('#searchTable').DataTable({
      dom: '<"col-md-4"l><"col-md-4"B><"col-md-4"f>rtip',
      buttons: ['excel', 'pdf'],
      bDestroy: true,
    });
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

    let self = this;

    let searchSetFrom = {
      fromPosition: this.props.viewEscalation.position,
      serviceCode: this.props.viewEscalation.grievanceType,
    };

    Api.commonApiPost('/pgr-master/escalation-hierarchy/v1/_search', searchSetFrom).then(
      function(response) {
        setLoadingStatus('hide');
        flag = 1;
        self.setState({
          searchResult: response.escalationHierarchies,
          isSearchClicked: true,
        });
      },
      function(err) {
        setLoadingStatus('hide');
        toggleSnackbarAndSetText(true, err.message);
      }
    );
  };

  render() {
    let self = this;

    let { isFormValid, viewEscalation, fieldErrors, handleChange, handleAutoCompleteKeyUp } = this.props;

    let { submitForm } = this;

    let { isSearchClicked, searchResult } = this.state;

    const renderBody = function() {
      if (searchResult && searchResult.length)
        return searchResult.map(function(val, i) {
          return (
            <tr key={i}>
              <td>{getNameByServiceCode(self.state.grievanceTypeSource, val.serviceCode)}</td>
              <td>{getNameById(self.state.positionSource, val.fromPosition)}</td>
              <td>{getNameById(self.state.positionSource, val.toPosition)}</td>
            </tr>
          );
        });
    };

    const viewTable = function() {
      if (isSearchClicked)
        return (
          <Card>
            <CardHeader title={<strong style={{ color: '#5a3e1b' }}> {translate('pgr.searchresult')} </strong>} />
            <CardText>
              <Table id="searchTable" style={{ color: 'black', fontWeight: 'normal' }} bordered responsive className="table-striped">
                <thead style={{ backgroundColor: '#f2851f', color: 'white' }}>
                  <tr>
                    <th>{translate('pgr.lbl.grievance.type')}</th>
                    <th>{translate('pgr.lbl.fromposition')}</th>
                    <th>{translate('pgr.lbl.toposition')}</th>
                  </tr>
                </thead>
                <tbody>{renderBody()}</tbody>
              </Table>
            </CardText>
          </Card>
        );
    };

    return (
      <div className="viewEscalation">
        <form
          autoComplete="off"
          onSubmit={e => {
            submitForm(e);
          }}
        >
          <Card style={styles.marginStyle}>
            <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}> {translate('pgr.lbl.searchesc')} </div>} />
            <CardText>
              <Card>
                <CardText>
                  <Grid>
                    <Row>
                      <Col xs={12} md={6}>
                        <AutoComplete
                          className="custom-form-control-for-textfield"
                          hintText={translate('pgr.lbl.grievance.type')}
                          fullWidth={true}
                          filter={function filter(searchText, key) {
                            return key.toLowerCase().includes(searchText.toLowerCase());
                          }}
                          dataSource={this.state.grievanceTypeSource}
                          dataSourceConfig={this.state.serviceDataSourceConfig}
                          onKeyUp={e => {
                            handleAutoCompleteKeyUp(e, 'grievanceType');
                          }}
                          value={viewEscalation.grievanceType ? viewEscalation.grievanceType : ''}
                          onNewRequest={(chosenRequest, index) => {
                            var e = {
                              target: {
                                value: chosenRequest.serviceCode,
                              },
                            };
                            handleChange(e, 'grievanceType', false, '');
                          }}
                        />
                      </Col>
                      <Col xs={12} md={6}>
                        <AutoComplete
                          className="custom-form-control-for-textfield"
                          hintText={translate('pgr.lbl.position')}
                          fullWidth={true}
                          filter={function filter(searchText, key) {
                            return key.toLowerCase().includes(searchText.toLowerCase());
                          }}
                          dataSource={this.state.positionSource}
                          dataSourceConfig={this.state.positionDataSourceConfig}
                          onKeyUp={e => {
                            handleAutoCompleteKeyUp(e, 'position');
                          }}
                          value={viewEscalation.position ? viewEscalation.position : ''}
                          onNewRequest={(chosenRequest, index) => {
                            var e = {
                              target: {
                                value: chosenRequest.id,
                              },
                            };
                            handleChange(e, 'position', false, '');
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
            </CardText>
          </Card>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    viewEscalation: state.form.form,
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewEscalation);
