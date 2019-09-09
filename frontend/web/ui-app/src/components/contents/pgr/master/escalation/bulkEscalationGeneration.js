import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
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

const style = {
  chip: {
    margin: 4,
    cursor: 'pointer',
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

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

class BulkEscalationGeneration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positionSource: [],
      dataSourceConfig: {
        text: 'name',
        value: 'id',
      },
      serviceCode: [],
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

    Api.commonApiPost('pgr-master/service/v1/_search', {
      keywords: 'complaint',
    }).then(
      function(response) {
        self.setState({
          serviceCode: response.Service,
        });
      },
      function(err) {
        self.setState({
          serviceCode: [],
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
      language: {
        emptyTable: 'No Records',
      },
    });
  }

  updateToPosition = () => {
    let { setLoadingStatus, toggleSnackbarAndSetText, toggleDailogAndSetText, bulkEscalationGeneration } = this.props;

    var current = this;

    var body = {
      escalationHierarchy: [],
    };

    setLoadingStatus('loading');

    if (bulkEscalationGeneration.serviceCode) {
      for (let i = 0; i < bulkEscalationGeneration.serviceCode.length; i++) {
        var Data = {
          serviceCode: bulkEscalationGeneration.serviceCode[i],
          tenantId: localStorage.getItem('tenantId'),
          fromPosition: bulkEscalationGeneration.fromPosition,
          toPosition: bulkEscalationGeneration.toPosition,
        };
        body.escalationHierarchy.push(Data);
      }
    }

    Api.commonApiPost('/pgr-master/escalation-hierarchy/v1/_update/', {}, body)
      .then(function(response) {
        setLoadingStatus('hide');
        toggleDailogAndSetText(true, translate('core.lbl.bulkcreated'));
        let query = {
          fromPosition: bulkEscalationGeneration.fromPosition,
          serviceCode: bulkEscalationGeneration.serviceCode,
        };

        Api.commonApiPost('/pgr-master/escalation-hierarchy/v1/_search', query, {})
          .then(function(response) {
            setLoadingStatus('hide');
            if (response.escalationHierarchies[0] != null) {
              flag = 1;
              current.setState({
                searchResult: response.escalationHierarchies,
                isSearchClicked: true,
              });
            } else {
              current.setState({
                noData: true,
              });
            }
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

  submitForm = e => {
    e.preventDefault();

    let self = this;

    let { setLoadingStatus, toggleSnackbarAndSetText } = this.props;

    setLoadingStatus('loading');

    let searchSet = {
      fromPosition: this.props.bulkEscalationGeneration.fromPosition,
      serviceCode: this.props.bulkEscalationGeneration.serviceCode,
    };

    Api.commonApiPost('/pgr-master/escalation-hierarchy/v1/_search', searchSet).then(
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

  handleOpenChips = (chips, title, chipType) => {
    this.setState({
      handleOpenChips: true,
      chipsTitle: title,
      chips: chips,
      chipType: chipType,
    });
  };

  handleCloseChips = () => {
    this.setState({ handleOpenChips: false });
  };

  presentChips = () => {
    let { serviceCode, chips, chipType } = this.state;
    if (chipType === 'grievanceType') {
      return (
        chips &&
        chips.map(serviceId => {
          let obj = serviceCode.find(service => {
            return service.serviceCode == serviceId;
          });
          return <Chip style={style.chip}>{obj.serviceName}</Chip>;
        })
      );
    }
  };

  renderComplaintTypeChips = () => {
    let { bulkEscalationGeneration } = this.props;
    let { serviceCode } = this.state;
    let servicearray = bulkEscalationGeneration.serviceCode ? [...bulkEscalationGeneration.serviceCode].splice(0, 2) : [];
    bulkEscalationGeneration.serviceCode && [...bulkEscalationGeneration.serviceCode].length > 2 ? servicearray.push('More >') : '';
    return servicearray.map(serviceId => {
      let obj = serviceCode.find(service => {
        return service.serviceCode == serviceId;
      });
      if (obj) {
        return <Chip style={style.chip}>{obj.serviceName}</Chip>;
      } else {
        return (
          <Chip
            style={style.chip}
            onClick={e => {
              this.handleOpenChips(bulkEscalationGeneration.serviceCode, translate('pgr.lbl.grievance.type'), 'grievanceType');
            }}
          >
            {serviceId}
          </Chip>
        );
      }
    });
  };

  render() {
    let { isFormValid, bulkEscalationGeneration, fieldErrors, handleChange, handleAutoCompleteKeyUp } = this.props;

    let self = this;

    let { submitForm } = this;

    let { isSearchClicked, searchResult } = this.state;

    const renderBody = function() {
      if (searchResult && searchResult.length)
        return searchResult.map(function(val, i) {
          return (
            <tr key={i}>
              <td>{getNameByServiceCode(self.state.serviceCode, val.serviceCode)}</td>
              <td>{getNameById(self.state.positionSource, val.fromPosition)}</td>
              <td>{getNameById(self.state.positionSource, val.toPosition)}</td>
            </tr>
          );
        });
    };

    const viewTable = function() {
      if (isSearchClicked)
        return (
          <Card style={styles.marginStyle}>
            <CardHeader title={<strong style={{ color: '#5a3e1b' }}>{translate('pgr.lbl.escalation.overwrite')}</strong>} />
            <CardText>
              <Table id="searchTable" style={{ color: 'black', fontWeight: 'normal' }} bordered responsive className="table-striped">
                <thead style={{ backgroundColor: '#f2851f', color: 'white' }}>
                  <tr>
                    <th>{translate('pgr.lbl.grievance.type')}</th>
                    <th>{translate('pgr.lbl.fromposition')}</th>
                    <th>{translate('core.position.to')}</th>
                  </tr>
                </thead>
                <tbody>{renderBody()}</tbody>
              </Table>
            </CardText>
            <div style={{ textAlign: 'center' }}>
              <RaisedButton
                style={{ margin: '15px 5px' }}
                type="button"
                label={translate('pgr.lbl.overwrite')}
                primary={true}
                onClick={() => {
                  self.updateToPosition();
                }}
              />
            </div>
          </Card>
        );
    };

    return (
      <div className="bulkEscalationGeneration">
        <form
          autoComplete="off"
          onSubmit={e => {
            submitForm(e);
          }}
        >
          <Card style={styles.marginStyle}>
            <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}> {translate('pgr.lbl.bueg')} </div>} />
            <CardText>
              <Grid>
                <Row>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <AutoComplete
                      className="custom-form-control-for-textfield"
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.fromposition') + ' *'}
                      fullWidth={true}
                      filter={function filter(searchText, key) {
                        return key.toLowerCase().includes(searchText.toLowerCase());
                      }}
                      dataSource={this.state.positionSource}
                      dataSourceConfig={this.state.dataSourceConfig}
                      onKeyUp={e => {
                        handleAutoCompleteKeyUp(e, 'fromPosition');
                      }}
                      value={bulkEscalationGeneration.fromPosition ? bulkEscalationGeneration.fromPosition : ''}
                      ref="fromPosition"
                      onNewRequest={(chosenRequest, index) => {
                        if (index === -1) {
                          this.refs['fromPosition'].setState({
                            searchText: '',
                          });
                        } else {
                          var e = {
                            target: {
                              value: chosenRequest.id,
                            },
                          };
                          handleChange(e, 'fromPosition', true, '');
                        }
                      }}
                    />
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <SelectField
                      className="custom-form-control-for-select"
                      hintText="Select"
                      multiple={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.grievance.type') + ' *'}
                      fullWidth={true}
                      maxHeight={200}
                      value={bulkEscalationGeneration.serviceCode ? bulkEscalationGeneration.serviceCode : ''}
                      onChange={(e, index, values) => {
                        var e = {
                          target: {
                            value: values,
                          },
                        };
                        handleChange(e, 'serviceCode', true, '');
                      }}
                    >
                      <MenuItem value="" primaryText="Select" />
                      {this.state.serviceCode &&
                        this.state.serviceCode.map((item, index) => (
                          <MenuItem
                            value={item.serviceCode}
                            key={index}
                            insetChildren={true}
                            primaryText={item.serviceName}
                            checked={bulkEscalationGeneration.serviceCode && bulkEscalationGeneration.serviceCode.indexOf(item.serviceCode) > -1}
                          />
                        ))}
                    </SelectField>
                    <div style={style.wrapper}>{this.renderComplaintTypeChips()}</div>
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <AutoComplete
                      className="custom-form-control-for-textfield"
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('core.position.to') + ' *'}
                      fullWidth={true}
                      filter={function filter(searchText, key) {
                        return key.toLowerCase().includes(searchText.toLowerCase());
                      }}
                      dataSource={this.state.positionSource}
                      dataSourceConfig={this.state.dataSourceConfig}
                      onKeyUp={e => {
                        handleAutoCompleteKeyUp(e, 'toPosition');
                      }}
                      value={bulkEscalationGeneration.toPosition ? bulkEscalationGeneration.toPosition : ''}
                      ref="toPosition"
                      onNewRequest={(chosenRequest, index) => {
                        if (index === -1) {
                          this.refs['toPosition'].setState({ searchText: '' });
                        } else {
                          var e = {
                            target: {
                              value: chosenRequest.id,
                            },
                          };
                          handleChange(e, 'toPosition', true, '');
                        }
                      }}
                    />
                  </Col>
                </Row>
              </Grid>
            </CardText>
          </Card>
          <div style={{ textAlign: 'center' }}>
            <RaisedButton style={{ margin: '15px 5px' }} type="submit" disabled={!isFormValid} label={translate('core.lbl.submit')} primary={true} />
          </div>
          {viewTable()}
        </form>
        <Dialog
          title={this.state.chipsTitle}
          actions={[<FlatButton label={translate('core.lbl.close')} primary={false} onTouchTap={this.handleCloseChips} />]}
          open={this.state.handleOpenChips}
          onRequestClose={this.handleCloseChips}
        >
          <div style={style.wrapper}>{this.state.handleOpenChips && this.presentChips()}</div>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    bulkEscalationGeneration: state.form.form,
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
          required: ['fromPosition', 'grievanceType', 'toPosition'],
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

  handleAutoCompleteKeyUp: (e, type) => {
    dispatch({
      type: 'HANDLE_CHANGE',
      property: type,
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

export default connect(mapStateToProps, mapDispatchToProps)(BulkEscalationGeneration);
