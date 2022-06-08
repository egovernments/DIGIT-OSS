import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import Api from '../../../../../api/api';
import styles from '../../../../../styles/material-ui';
import DataTable from '../../../../common/Table';
import { translate } from '../../../../common/common';

const $ = require('jquery');
$.DataTable = require('datatables.net');
const dt = require('datatables.net-bs');

const buttons = require('datatables.net-buttons-bs');
require('datatables.net-buttons/js/buttons.colVis.js'); // Column visibility
require('datatables.net-buttons/js/buttons.html5.js'); // HTML 5 file export
require('datatables.net-buttons/js/buttons.flash.js'); // Flash file export
require('datatables.net-buttons/js/buttons.print.js'); // Print view button

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

var _this = 0;
var flag = 0;
let searchTextPos = '';
const getNameById = function(source, id, text) {
  // console.log(source, id, text);
  let type = source.find(x => x.id == id);
  // console.log(id, text);
  if (text) {
    var value = text.split('.');
    if (value.length > 1) {
      var obj = {};
      return type ? type[value[0]][value[1]] : '';
    } else return type ? type[text] : '';
  } else {
    return '';
  }
};

class routerGeneration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [],
      typeList: [],
      boundaryTypeList: [],
      boundariesList: [],
      positionSource: [],
      boundaryInitialList: [],
      positionSourceConfig: {
        text: 'name',
        value: 'id',
      },
      isSearchClicked: false,
      resultList: [],
      open: false,
      open2: false,
    };

    this.search = this.search.bind(this);
    this.setInitialState = this.setInitialState.bind(this);
    this.loadGrievanceType = this.loadGrievanceType.bind(this);
    this.loadBoundaries = this.loadBoundaries.bind(this);
    this.save = this.save.bind(this);
    this.handleOpenNClose = this.handleOpenNClose.bind(this);
    this.handleOpenNClose2 = this.handleOpenNClose2.bind(this);
  }

  setInitialState(_state) {
    this.setState(_state);
  }

  handleOpenNClose() {
    this.setState({
      open: !this.state.open,
    });
  }

  handleOpenNClose2() {
    this.setState({
      open2: !this.state.open2,
    });
  }

  loadGrievanceType(value) {
    var self = this;
    self.props.handleChange({ target: { value: '' } }, 'serviceId', true, '');
    Api.commonApiPost('pgr-master/service/v1/_search', {
      type: 'category',
      categoryId: value,
    }).then(
      function(response) {
        self.setState({ typeList: response.Service });
      },
      function(err) {}
    );
  }

  loadBoundaries(value) {
    var self = this;
    self.props.handleChange({ target: { value: '' } }, 'boundaryId', true, '');
    Api.commonApiPost('/egov-location/boundarys/getByBoundaryType', {
      boundaryTypeId: value,
      'Boundary.tenantId': localStorage.getItem('tenantId'),
    }).then(
      function(response) {
        self.setState({ boundariesList: response.Boundary });
      },
      function(err) {}
    );
  }

  componentWillUpdate() {
    if (flag == 1) {
      flag = 0;
      $('#searchTable')
        .dataTable()
        .fnDestroy();
    }
  }

  componentWillMount() {
    $('#searchTable').DataTable({
      dom: 'lBfrtip',
      buttons: [],
      ordering: false,
      bDestroy: true,
    });
  }

  componentDidUpdate() {
    $('#searchTable').DataTable({
      dom: 'lBfrtip',
      buttons: [],
      ordering: false,
      bDestroy: true,
      language: {
        emptyTable: 'No Records',
      },
    });
  }

  componentWillUnmount() {
    $('#searchTable')
      .DataTable()
      .destroy(true);
  }

  componentDidMount() {
    var self = this,
      count = 4,
      _state = {};
    self.props.initForm();
    self.props.setLoadingStatus('loading');
    const checkCountAndCall = function(key, res) {
      _state[key] = res;
      count--;
      if (count == 0) {
        self.setInitialState(_state);
        self.props.setLoadingStatus('hide');
      }
    };

    Api.commonApiPost('/pgr-master/serviceGroup/v1/_search', {
      keyword: 'complaint',
    }).then(
      function(response) {
        checkCountAndCall('categoryList', response.ServiceGroups);
      },
      function(err) {
        checkCountAndCall('categoryList', []);
      }
    );

    Api.commonApiPost('egov-location/boundarytypes/getByHierarchyType', {
      hierarchyTypeName: 'ADMINISTRATION',
    }).then(
      function(response) {
        checkCountAndCall('boundaryTypeList', response ? response.BoundaryType : []);
      },
      function(err) {
        checkCountAndCall('boundaryTypeList', []);
      }
    );

    Api.commonApiPost('/hr-masters/positions/_search').then(
      function(response) {
        checkCountAndCall('positionSource', response ? response.Position : []);
      },
      function(err) {
        checkCountAndCall('positionSource', []);
      }
    );

    Api.commonApiGet('/egov-location/boundarys', {
      'Boundary.tenantId': localStorage.getItem('tenantId'),
    }).then(
      function(response) {
        checkCountAndCall('boundaryInitialList', response ? response.Boundary : []);
      },
      function(err) {
        checkCountAndCall('boundaryInitialList', []);
      }
    );
  }

  search(e) {
    e.preventDefault();
    var self = this;
    var searchSet = Object.assign({}, self.props.routerCreateSet);
    self.props.setLoadingStatus('loading');
    Api.commonApiPost('/workflow/router/v1/_search', searchSet).then(
      function(response) {
        flag = 1;
        self.setState({
          resultList: response.RouterTypRes,
          isSearchClicked: true,
        });
        self.props.setLoadingStatus('hide');
      },
      function(err) {
        self.props.setLoadingStatus('hide');
        self.props.toggleSnackbarAndSetText(true, err.message);
      }
    );
  }

  save(e) {
    if (e) {
      e.preventDefault();
      this.setState({
        open: true,
      });
    } else {
      var self = this;
      this.setState(
        {
          open: false,
        },
        function() {
          var routerType = {
            position: self.props.routerCreateSet.position,
            active: true,
            id: '',
            services: [],
            boundaries: [],
            tenantId: localStorage.getItem('tenantId'),
          };

          for (var i = 0; i < self.props.routerCreateSet.serviceId.length; i++) {
            routerType.services.push(self.props.routerCreateSet.serviceId[i]);
          }

          console.log(self.props.routerCreateSet);
          for (var i = 0; i < self.props.routerCreateSet.boundaryId.length; i++) {
            routerType.boundaries.push(self.props.routerCreateSet.boundaryId[i]);
          }

          self.props.setLoadingStatus('loading');
          Api.commonApiPost('/workflow/router/v1/_create', {}, { router: routerType }).then(
            function(response) {
              self.props.initForm();
              searchTextPos = '';
              self.setState({
                resultList: [],
                isSearchClicked: false,
                flag: 1,
                boundariesList: [],
                open2: true,
              });
              self.props.setLoadingStatus('hide');
            },
            function(err) {
              self.props.setLoadingStatus('hide');
              self.props.toggleSnackbarAndSetText(true, err.message);
            }
          );
        }
      );
    }
  }

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
    let { typeList, boundariesList, chips, chipType } = this.state;
    if (chipType === 'grievanceType') {
      return (
        chips &&
        chips.map(serviceId => {
          let obj = typeList.find(service => {
            return service.id == serviceId;
          });
          return <Chip style={style.chip}>{obj.serviceName}</Chip>;
        })
      );
    } else if (chipType === 'boundaryType') {
      return (
        chips &&
        chips.map(boundaryId => {
          let obj = boundariesList.find(boundary => {
            return boundary.code == boundaryId;
          });
          return <Chip style={style.chip}>{obj.name}</Chip>;
        })
      );
    }
  };

  renderComplaintTypeChips = () => {
    let { routerCreateSet } = this.props;
    let { typeList } = this.state;
    let servicearray = routerCreateSet.serviceId ? [...routerCreateSet.serviceId].splice(0, 2) : [];
    routerCreateSet.serviceId && [...routerCreateSet.serviceId].length > 2 ? servicearray.push('More >') : '';
    return servicearray.map(serviceId => {
      let obj = typeList.find(service => {
        return service.id == serviceId;
      });
      if (obj) {
        return <Chip style={style.chip}>{obj.serviceName}</Chip>;
      } else {
        return (
          <Chip
            style={style.chip}
            onClick={e => {
              this.handleOpenChips(routerCreateSet.serviceId, translate('pgr.lbl.grievance.type'), 'grievanceType');
            }}
          >
            {serviceId}
          </Chip>
        );
      }
    });
  };

  renderBoundaryChips = () => {
    let { routerCreateSet } = this.props;
    let { boundariesList } = this.state;
    let boundaryarray = routerCreateSet.boundaryId ? [...routerCreateSet.boundaryId].splice(0, 2) : [];
    routerCreateSet.boundaryId && [...routerCreateSet.boundaryId].length > 2 ? boundaryarray.push('More >') : '';
    return boundaryarray.map(boundaryId => {
      let obj = boundariesList.find(boundary => {
        return boundary.code == boundaryId;
      });
      if (obj) {
        return <Chip style={style.chip}>{obj.name}</Chip>;
      } else {
        return (
          <Chip
            style={style.chip}
            onClick={e => {
              this.handleOpenChips(routerCreateSet.boundaryId, translate('pgr.lbl.boundary'), 'boundaryType');
            }}
          >
            {boundaryId}
          </Chip>
        );
      }
    });
  };

  render() {
    _this = this;
    let { fieldErrors, routerCreateSet, handleChange, handleAutoCompleteKeyUp, isFormValid } = this.props;
    let { search, loadGrievanceType, loadBoundaries, save, handleOpenNClose, handleOpenNClose2 } = this;
    let {
      boundariesList,
      boundaryTypeList,
      typeList,
      categoryList,
      resultList,
      isSearchClicked,
      open,
      open2,
      positionSource,
      boundaryInitialList,
    } = this.state;

    const showSaveButton = function() {
      if (isSearchClicked && isFormValid) {
        return (
          <div style={{ textAlign: 'center' }}>
            <RaisedButton
              style={{ margin: '15px 5px' }}
              type="button"
              label={translate('pgr.lbl.overwrite')}
              primary={true}
              onClick={e => {
                save(e);
              }}
            />
          </div>
        );
      }
    };

    const renderBody = function() {
      if (resultList && resultList.length)
        return resultList.map(function(val, i) {
          return (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{val.service ? getNameById(typeList, val.service, 'serviceName') : ''}</td>
              <td>{val.boundary ? getNameById(boundaryInitialList, val.boundary, 'boundaryType.name') : ''}</td>
              <td>{val.boundary ? getNameById(boundaryInitialList, val.boundary, 'name') : ''}</td>
              <td>{val.position ? getNameById(positionSource, val.position, 'name') : ''}</td>
            </tr>
          );
        });
    };

    const viewTable = function() {
      if (isSearchClicked)
        return (
          <Card style={styles.marginStyle}>
            <CardHeader title={<strong style={{ color: '#5a3e1b' }}> {translate('pgr.lbl.router.overwrite')} </strong>} />
            <CardText>
              <Table id="searchTable" style={{ color: 'black', fontWeight: 'normal' }} bordered responsive className="table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{translate('pgr.lbl.grievance.type')}</th>
                    <th>{translate('pgr.lbl.boundarytype')}</th>
                    <th>{translate('pgr.lbl.boundary')}</th>
                    <th>{translate('pgr.lbl.position')}</th>
                  </tr>
                </thead>
                <tbody>{renderBody()}</tbody>
              </Table>
            </CardText>
          </Card>
        );
    };
    return (
      <div className="routerGeneration">
        <form
          autoComplete="off"
          onSubmit={e => {
            search(e);
          }}
        >
          <Card style={styles.marginStyle}>
            <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}> {translate('pgr.lbl.create.router')} </div>} />
            <CardText style={{ padding: 0 }}>
              <Grid>
                <Row>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <SelectField
                      fullWidth={true}
                      className="custom-form-control-for-select"
                      hintText="Select"
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.grievance.category') + ' *'}
                      errorText={fieldErrors.complaintTypeCategory}
                      value={routerCreateSet.complaintTypeCategory}
                      onChange={(e, i, val) => {
                        var e = { target: { value: val } };
                        loadGrievanceType(val);
                        handleChange(e, 'complaintTypeCategory', true, '');
                      }}
                    >
                      <MenuItem value="" primaryText="Select" />
                      {categoryList.map((item, index) => <MenuItem value={item.id} key={index} primaryText={item.name} />)}
                    </SelectField>
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <SelectField
                      className="custom-form-control-for-select"
                      hintText="Select"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.grievance.type') + ' *'}
                      errorText={fieldErrors.serviceId}
                      value={routerCreateSet.serviceId}
                      onChange={(e, i, val) => {
                        var e = { target: { value: val } };
                        handleChange(e, 'serviceId', true, '');
                      }}
                      multiple
                    >
                      <MenuItem value="" primaryText="Select" />
                      {typeList.map((item, index) => (
                        <MenuItem
                          value={item.id}
                          key={index}
                          insetChildren={true}
                          primaryText={item.serviceName}
                          checked={routerCreateSet.serviceId && routerCreateSet.serviceId.indexOf(item.id) > -1}
                        />
                      ))}
                    </SelectField>
                    <div style={style.wrapper}>{this.renderComplaintTypeChips()}</div>
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <SelectField
                      fullWidth={true}
                      className="custom-form-control-for-select"
                      hintText="Select"
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.boundarytype') + ' *'}
                      errorText={fieldErrors.boundaryTypeId || ''}
                      value={routerCreateSet.boundaryTypeId}
                      onChange={(e, i, val) => {
                        var e = { target: { value: val } };
                        loadBoundaries(val);
                        handleChange(e, 'boundaryTypeId', true, '');
                      }}
                    >
                      <MenuItem value="" primaryText="Select" />
                      {boundaryTypeList.map((item, index) => <MenuItem value={item.id} key={index} primaryText={item.name} />)}
                    </SelectField>
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <SelectField
                      className="custom-form-control-for-select"
                      hintText="Select"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.boundary') + ' *'}
                      errorText={fieldErrors.boundaryId || ''}
                      value={routerCreateSet.boundaryId}
                      onChange={(e, i, val) => {
                        var e = { target: { value: val } };
                        handleChange(e, 'boundaryId', true, '');
                      }}
                      multiple
                    >
                      <MenuItem value="" primaryText="Select" />
                      {boundariesList.map((item, index) => (
                        <MenuItem
                          value={item.id}
                          key={index}
                          primaryText={item.name}
                          insetChildren={true}
                          checked={routerCreateSet.boundaries && routerCreateSet.boundaries.indexOf(item.id) > -1}
                        />
                      ))}
                    </SelectField>
                    <div style={style.wrapper}>{this.renderBoundaryChips()}</div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <AutoComplete
                      className="custom-form-control-for-textfield"
                      hintText=""
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.position') + ' *'}
                      filter={AutoComplete.caseInsensitiveFilter}
                      fullWidth={true}
                      dataSource={this.state.positionSource}
                      dataSourceConfig={this.state.positionSourceConfig}
                      menuStyle={{ overflow: 'auto', maxHeight: '150px' }}
                      listStyle={{ overflow: 'auto' }}
                      onKeyUp={handleAutoCompleteKeyUp}
                      errorText={fieldErrors.position || ''}
                      value={routerCreateSet.position}
                      searchText={searchTextPos}
                      ref="position"
                      onNewRequest={(chosenRequest, index) => {
                        if (index === -1) {
                          this.refs['position'].setState({ searchText: '' });
                        } else {
                          searchTextPos = chosenRequest.name;
                          var e = {
                            target: {
                              value: chosenRequest.id,
                            },
                          };
                          handleChange(e, 'position', true, '');
                        }
                      }}
                    />
                  </Col>
                </Row>
              </Grid>
            </CardText>
          </Card>
          <div style={{ textAlign: 'center' }}>
            <RaisedButton style={{ margin: '15px 5px' }} type="submit" label={translate('core.lbl.submit')} disabled={!isFormValid} primary={true} />
          </div>
          {viewTable()}
          {showSaveButton()}
        </form>
        <Dialog
          title="Confirm"
          actions={[
            <FlatButton label={translate('core.lbl.close')} primary={false} onTouchTap={handleOpenNClose} />,
            <FlatButton
              label="Yes"
              primary={true}
              onTouchTap={() => {
                save();
              }}
            />,
          ]}
          modal={false}
          open={open}
          onRequestClose={handleOpenNClose}
        >
          {translate('pgr.lbl.alert.router')}
        </Dialog>
        <Dialog
          title={translate('pgr.lbl.success')}
          actions={[<FlatButton label={translate('core.lbl.close')} primary={true} onTouchTap={handleOpenNClose2} />]}
          modal={false}
          open={open2}
          onRequestClose={handleOpenNClose2}
        >
          {translate('pgr.lbl.router.create.success')}
        </Dialog>
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
  // console.log(state.form.form);
  return {
    routerCreateSet: state.form.form,
    fieldErrors: state.form.fieldErrors,
    isFormValid: state.form.isFormValid,
  };
};
const mapDispatchToProps = dispatch => ({
  initForm: type => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: ['complaintTypeCategory', 'serviceId', 'boundaryTypeId', 'boundaryId', 'position'],
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
  handleAutoCompleteKeyUp: e => {
    var self = _this;
    dispatch({
      type: 'HANDLE_CHANGE',
      property: 'position',
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

export default connect(mapStateToProps, mapDispatchToProps)(routerGeneration);
