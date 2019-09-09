import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
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
var _this;

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

class viewOrUpdateServiceType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      categorySource: [],
      modify: false,
    };
    this.handleNavigation = this.handleNavigation.bind(this);
    this.setInitialState = this.setInitialState.bind(this);
  }

  setInitialState(_state) {
    this.setState(_state);
  }

  componentWillMount() {}

  componentWillUpdate() {
    if (flag == 1) {
      flag = 0;
      $('#searchTable')
        .dataTable()
        .fnDestroy();
    }
  }

  componentWillUnmount() {
    $('#searchTable')
      .DataTable()
      .destroy(true);
  }

  componentDidUpdate() {
    if (this.state.modify) {
      var t = $('#searchTable').DataTable({
        dom: '<"col-md-4"l><"col-md-4"B><"col-md-4"f>rtip',
        buttons: ['excel', 'pdf'],
        bDestroy: true,
        order: [],
        columnDefs: [{ orderable: false, targets: 0 }],
      });

      t
        .on('order.dt search.dt', function() {
          t
            .column(0, { search: 'applied', order: 'applied' })
            .nodes()
            .each(function(cell, i) {
              cell.innerHTML = i + 1;
            });
        })
        .draw();
    }
  }

  componentDidMount() {
    let { initForm } = this.props;
    initForm();
    var _this = this,
      count = 2,
      _state = {};

    _this.props.setLoadingStatus('loading');
    const checkCountAndSetState = function(key, res) {
      _state[key] = res;
      count--;
      if (count == 0) {
        _this.props.setLoadingStatus('hide');
        _this.setInitialState({ ..._state, modify: true });
      }
    };

    Api.commonApiPost('/pgr-master/service/v1/_search', { keywords: 'complaint' }, {})
      .then(function(response) {
        checkCountAndSetState('data', response.Service);
      })
      .catch(error => {
        checkCountAndSetState('data', []);
      });

    Api.commonApiPost('/pgr-master/serviceGroup/v1/_search', {
      keyword: 'complaint',
    }).then(
      function(response) {
        checkCountAndSetState('categorySource', response.ServiceGroups);
      },
      function(err) {
        checkCountAndSetState('categorySource', []);
      }
    );
  }

  handleNavigation = (type, id) => {
    this.props.history.push(type + id);
  };

  render() {
    let { handleNavigation } = this;
    let { categorySource } = this.state;
    let {
      serviceTypeCreate,
      fieldErrors,
      isFormValid,
      isTableShow,
      handleUpload,
      files,
      handleChange,
      handleMap,
      handleChangeNextOne,
      handleChangeNextTwo,
      buttonText,
    } = this.props;

    let url = this.props.location.pathname;

    return (
      <div className="serviceTypeCreate">
        <Card style={styles.marginStyle}>
          <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}>{translate('pgr.lbl.grievance.type')}</div>} />
          <CardText style={{ padding: 0 }}>
            <Grid>
              <Row>
                <Col xs={12} md={12}>
                  <Table id="searchTable" bordered responsive className="table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{translate('core.lbl.add.name')}</th>
                        <th>{translate('core.lbl.code')}</th>
                        <th>{translate('pgr.service.localName')}</th>
                        <th>{translate('core.category')}</th>
                        <th>{translate('pgr.lbl.active')}</th>
                        <th>{translate('core.lbl.description')}</th>
                        <th>{translate('pgr.lbl.slahour')}</th>
                        <th>{translate('pgr.lbl.finimpact')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.data &&
                        this.state.data.map((e, i) => {
                          return (
                            <tr
                              key={i}
                              onClick={() => {
                                if (url == '/pgr/viewOrUpdateServiceType/view') {
                                  handleNavigation('/pgr/viewServiceType/view/', e.id);
                                } else {
                                  handleNavigation('/pgr/serviceTypeCreate/edit/', e.id);
                                }
                              }}
                            >
                              <td>{i + 1}</td>
                              <td>{e.serviceName}</td>
                              <td>{e.serviceCode}</td>
                              <td>{e.localName}</td>
                              <td>{getNameById(categorySource, e.category)}</td>

                              <td>{e.active ? 'Yes' : 'No'}</td>
                              <td>{e.description}</td>
                              <td>{e.slaHours}</td>
                              <td>{e.hasFinancialImpact ? 'Yes' : 'No'}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Grid>
          </CardText>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    serviceTypeCreate: state.form.form,
    files: state.form.files,
    fieldErrors: state.form.fieldErrors,
    isFormValid: state.form.isFormValid,
    isTableShow: state.form.showTable,
    buttonText: state.form.buttonText,
  };
};

const mapDispatchToProps = dispatch => ({
  initForm: () => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: ['name', 'code', 'channel', 'description'],
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

  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(viewOrUpdateServiceType);
