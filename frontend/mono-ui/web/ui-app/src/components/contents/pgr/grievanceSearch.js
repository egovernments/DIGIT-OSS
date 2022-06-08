import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, DropdownButton, Table } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import { brown500, red500, white, orange800 } from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ReactPaginate from 'react-paginate';
import Snackbar from 'material-ui/Snackbar';
import ServerSideTable from '../../common/table/ServerSideTable';
import Api from '../../../api/api';
import styles from '../../../styles/material-ui';
import { translate, toLocalTime } from '../../common/common';

const getNameById = function(object, id, property = '') {
  if (!object) return;
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

const getNameByProperty = function(object, key) {
  if (object) {
    for (var i = 0; i < object.length; i++) {
      if (object[i]['key'] == key) {
        return object[i]['name'];
      }
    }
    return '';
  } else {
    return '';
  }
};

class grievanceSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationList: [],
      complaintTypeList: [],
      statusList: [],
      receiveingModeList: [],
      departmentList: [],
      boundaryList: [],
      open: false,
      resultList: [],
      isSearchClicked: false,
      pageCount: 0,
      open1: false,
    };
    this.search = this.search.bind(this);
    this.setInitialState = this.setInitialState.bind(this);
    this.handleOpenNClose = this.handleOpenNClose.bind(this);
    this.resetAndSearch = this.resetAndSearch.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
  }

  resetSearch() {
    this.props.initForm();
    this.props.changeButtonText(translate('core.lbl.more'));
    this.setState({
      pageCount: 0,
      resultList: [],
      isSearchClicked: false,
    });
  }

  handleOpenNClose() {
    this.setState({
      open: !this.state.open,
    });
  }

  resetAndSearch(e) {
    e.preventDefault();
    var self = this;
    this.setState(
      {
        pageCount: 0,
      },
      function() {
        self.search();
      }
    );
  }

  search(bool, fromIndex) {
    var self = this,
      grievanceSearchSet = this.props.grievanceSearchSet;
    if (
      !grievanceSearchSet.serviceRequestId &&
      !grievanceSearchSet.locationId &&
      !grievanceSearchSet.startDate &&
      !grievanceSearchSet.endDate &&
      !grievanceSearchSet.name &&
      !grievanceSearchSet.mobileNumber &&
      !grievanceSearchSet.emailId &&
      !grievanceSearchSet.serviceCode &&
      !grievanceSearchSet.status &&
      !grievanceSearchSet.receivingMode
    ) {
      self.setState({
        open: true,
      });
    } else {
      var searchSet = Object.assign({}, grievanceSearchSet);
      /*if(searchSet.startDate) {
  			searchSet.startDate = searchSet.startDate.toISOString().split("T")[0].split("-")[2] + "-" + searchSet.startDate.toISOString().split("T")[0].split("-")[1] + "-" + searchSet.startDate.toISOString().split("T")[0].split("-")[0];
  		}

  		if(searchSet.endDate) {
  			searchSet.endDate = searchSet.endDate.toISOString().split("T")[0].split("-")[2] + "-" + searchSet.endDate.toISOString().split("T")[0].split("-")[1] + "-" + searchSet.endDate.toISOString().split("T")[0].split("-")[0];
  		}*/

      if (searchSet.startDate) {
        searchSet.startDate =
          ('0' + searchSet.startDate.getDate()).slice(-2) +
          '-' +
          ('0' + (searchSet.startDate.getMonth() + 1)).slice(-2) +
          '-' +
          searchSet.startDate.getFullYear();
      }

      if (searchSet.endDate) {
        searchSet.endDate =
          ('0' + searchSet.endDate.getDate()).slice(-2) +
          '-' +
          ('0' + (searchSet.endDate.getMonth() + 1)).slice(-2) +
          '-' +
          searchSet.endDate.getFullYear();
      }

      if (searchSet.status) {
        searchSet.status = searchSet.status.join(',');
      }

      searchSet.sizePerPage = 10;
      searchSet.fromIndex = fromIndex ? fromIndex : 0;
      self.props.setLoadingStatus('loading');
      Api.commonApiPost('/pgr/seva/v1/_count', searchSet).then(
        function(response) {
          if (response.count) {
            Api.commonApiPost('/pgr/seva/v1/_search', searchSet).then(
              function(response1) {
                self.setState({
                  pageCount: Math.ceil(response.count / 10),
                });
                //set header and data for report
                self.createReportData(response1.serviceRequests);
                self.props.setLoadingStatus('hide');
              },
              function(err) {
                self.props.setLoadingStatus('hide');
                self.props.toggleSnackbarAndSetText(true, err.message);
              }
            );
          } else {
            self.props.setLoadingStatus('hide');
            self.setState({
              open1: true,
              resultList: [],
            });
          }
        },
        function(err) {
          self.props.setLoadingStatus('hide');
          self.props.toggleSnackbarAndSetText(true, err.message);
        }
      );
    }
  }

  createReportData = resultList => {
    var self = this;
    if (resultList.length > 0) {
      var reportData = {},
        reportActionData = [],
        reportReponseData = [];

      //Row action for each column
      var reportActionObj = {};
      reportActionObj['Grievance Number'] = '/pgr/viewGrievance/';
      reportActionObj[`${translate('pgr.lbl.grievance.type')}`] = '';
      reportActionObj[`${translate('core.lbl.add.name')}`] = '';
      reportActionObj[`${translate('core.lbl.location')}`] = '';
      reportActionObj[`${translate('core.lbl.status')}`] = '';
      reportActionObj[`${translate('core.lbl.department')}`] = '';
      reportActionObj[`${translate('pgr.lbl.registered.date')}`] = '';
      reportActionData.push(reportActionObj);

      //Row data
      resultList.map(function(val, i) {
        var reportObj = {};
        // var triColor = "#fff";
        // val.attribValues.map((item,index)=>{
        //   if(item.key =="PRIORITY"){
        //     if(item.key =="PRIORITY"){
        //       switch(item.name) {
        //         case 'PRIORITY-1':
        //           triColor = "#ff0000";
        //           break;
        //         case 'PRIORITY-2':
        //           triColor = "#00ff00";
        //           break;
        //         case 'PRIORITY-3':
        //           triColor = "#ffff00";
        //           break;
        //       }
        //     }
        //   }
        // });

        reportObj['Grievance Number'] = val.serviceRequestId;
        reportObj[`${translate('pgr.lbl.grievance.type')}`] = val.serviceName;
        reportObj[`${translate('core.lbl.add.name')}`] = val.firstName;
        reportObj[`${translate('core.lbl.location')}`] =
          getNameById(self.state.boundaryList, getNameByProperty(val.attribValues, 'systemLocationId')) +
          ' - ' +
          getNameById(self.state.boundaryList, getNameByProperty(val.attribValues, 'systemChildLocationId'));
        reportObj[`${translate('core.lbl.status')}`] = getNameByProperty(val.attribValues, 'systemStatus');
        reportObj[`${translate('core.lbl.department')}`] = getNameById(
          self.state.departmentList,
          getNameByProperty(val.attribValues, 'systemDepartmentId')
        );
        reportObj[`${translate('pgr.lbl.registered.date')}`] = val.requestedDatetime;
        reportReponseData.push(reportObj);
      });
      reportData['reportReponseData'] = reportReponseData;
      reportData['reportActionData'] = reportActionData;
      self.setState({
        resultList: reportData,
        isSearchClicked: true,
      });
    }
  };

  setInitialState(_state) {
    this.setState(_state);
  }

  componentDidMount() {
    var self = this,
      count = 6,
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

    this.props.changeButtonText(translate('core.lbl.more'));
    Api.commonApiPost('/egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'Ward',
      hierarchyTypeName: 'Administration',
    }).then(
      function(response) {
        checkCountAndCall('locationList', response.Boundary);
      },
      function(err) {
        checkCountAndCall('locationList', []);
      }
    );

    Api.commonApiPost('/pgr-master/receivingmode/v1/_search').then(
      function(response) {
        checkCountAndCall('receiveingModeList', response.ReceivingModeType);
      },
      function(err) {
        checkCountAndCall('receiveingModeList', []);
      }
    );

    Api.commonApiPost('/pgr-master/service/v1/_search', {
      keywords: 'complaint',
    }).then(
      function(response) {
        checkCountAndCall('complaintTypeList', response.Service);
      },
      function(err) {
        checkCountAndCall('complaintTypeList', []);
      }
    );

    Api.commonApiPost('/egov-common-masters/departments/_search').then(
      function(response) {
        checkCountAndCall('departmentList', response.Department);
      },
      function(err) {
        checkCountAndCall('departmentList', []);
      }
    );

    Api.commonApiGet('/egov-location/boundarys', {
      'boundary.tenantId': localStorage.getItem('tenantId'),
    }).then(
      function(response) {
        checkCountAndCall('boundaryList', response.Boundary);
      },
      function(err) {
        checkCountAndCall('boundaryList', []);
      }
    );

    Api.commonApiPost('/workflow/v1/statuses/_search').then(
      function(response) {
        checkCountAndCall('statusList', response.statuses);
      },
      function(err) {
        checkCountAndCall('statusList', []);
      }
    );
  }

  // handlePageClick(data) {
  //   let selected = data.selected;
  //   let offset = Math.ceil(selected * 10), self = this;
  //   self.setState({fromIndex: offset}, () => {
  //     self.search(true);
  //   });
  // };

  handleRequestClose() {
    this.setState({
      open1: false,
    });
  }

  checkDate = (value, name, required, pattern) => {
    if (name == 'startDate') {
      let startDate = value;
      let endDate = this.props.grievanceSearchSet.endDate;
      this.props.handleChange(value, name, required, pattern);
      this.validateDate(startDate, endDate, 'startDate'); //3rd param to denote whether field fails
    } else {
      let endDate = value;
      let startDate = this.props.grievanceSearchSet.startDate;
      this.props.handleChange(value, name, required, pattern);
      this.validateDate(startDate, endDate, 'endDate'); //3rd param to denote whether field fails
    }
  };

  validateDate = (startDate, endDate, field) => {
    if (startDate && endDate) {
      let sD = new Date(startDate);
      sD.setHours(0, 0, 0, 0);
      let eD = new Date(endDate);
      eD.setHours(0, 0, 0, 0);
      if (eD >= sD) {
        this.setState({ datefield: '' });
        this.setState({ dateError: '' });
      } else {
        this.props.handleChange('', field, false, '');
        this.setState({ datefield: field });
        this.setState({
          dateError: field === 'endDate' ? translate('pgr.lbl.dategreater') : translate('pgr.lbl.datelesser'),
        });
      }
    }
  };

  render() {
    let { search, resetAndSearch, resetSearch } = this;
    let {
      complaintTypeList,
      statusList,
      receiveingModeList,
      locationList,
      departmentList,
      boundaryList,
      isSearchClicked,
      resultList,
      pageCount,
    } = this.state;
    let { handleChange, buttonText, grievanceSearchSet, changeButtonText, isFormValid, fieldErrors } = this.props;

    const showOtherFields = function() {
      if (buttonText == translate('core.lbl.less')) {
        return (
          <Row>
            <Col xs={12} sm={4} md={3} lg={3}>
              <TextField
                className="custom-form-control-for-textfield"
                fullWidth={true}
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFixed={true}
                floatingLabelText={translate('core.lbl.fullname')}
                value={grievanceSearchSet.name}
                onChange={(e, value) => {
                  handleChange(value, 'name', false, '');
                }}
              />
            </Col>
            <Col xs={12} sm={4} md={3} lg={3}>
              <TextField
                className="custom-form-control-for-textfield"
                fullWidth={true}
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFixed={true}
                floatingLabelText={translate('core.lbl.mobilenumber')}
                errorText={fieldErrors.mobileNumber}
                value={grievanceSearchSet.mobileNumber}
                onChange={(e, value) => {
                  handleChange(value, 'mobileNumber', false, /^\d{10}$/g);
                }}
              />
            </Col>
            <Col xs={12} sm={4} md={3} lg={3}>
              <TextField
                className="custom-form-control-for-textfield"
                fullWidth={true}
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFixed={true}
                floatingLabelText={translate('core.lbl.email.compulsory')}
                errorText={fieldErrors.emailId}
                value={grievanceSearchSet.emailId}
                onChange={(e, value) => {
                  handleChange(
                    value,
                    'emailId',
                    false,
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  );
                }}
              />
            </Col>
            <Col xs={12} sm={4} md={3} lg={3}>
              <SelectField
                className="custom-form-control-for-select"
                hintText="Select"
                maxHeight={200}
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFixed={true}
                fullWidth={true}
                floatingLabelText={translate('pgr.lbl.complainttype')}
                value={grievanceSearchSet.serviceCode}
                onChange={(e, i, value) => {
                  handleChange(value, 'serviceCode', false, '');
                }}
              >
                <MenuItem value="" primaryText="Select" />
                {complaintTypeList.map((com, index) => <MenuItem value={com.serviceCode} key={index} primaryText={com.serviceName} />)}
              </SelectField>
            </Col>
            <Col xs={12} sm={4} md={3} lg={3}>
              <SelectField
                className="custom-form-control-for-select"
                hintText="Select"
                multiple={true}
                fullWidth={true}
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFixed={true}
                floatingLabelText={translate('core.lbl.status')}
                value={grievanceSearchSet.status}
                onChange={(e, i, value) => {
                  handleChange(value, 'status', false, '');
                }}
              >
                <MenuItem value="" primaryText="Select" />
                {statusList.map((stat, index) => (
                  <MenuItem
                    value={stat.code}
                    insetChildren={true}
                    key={index}
                    primaryText={stat.name}
                    checked={grievanceSearchSet.status && grievanceSearchSet.status.indexOf(stat.code) > -1}
                  />
                ))}
              </SelectField>
            </Col>
            <Col xs={12} sm={4} md={3} lg={3}>
              <SelectField
                className="custom-form-control-for-select"
                hintText="Select"
                maxHeight={200}
                fullWidth={true}
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFixed={true}
                floatingLabelText={translate('pgr.lbl.receivingmode')}
                value={grievanceSearchSet.receivingMode}
                onChange={(e, i, value) => {
                  handleChange(value, 'receivingMode', false, '');
                }}
              >
                <MenuItem value="" primaryText="Select" />
                {receiveingModeList.map((mod, index) => <MenuItem value={mod.code} key={index} primaryText={mod.name} />)}
              </SelectField>
            </Col>
          </Row>
        );
      }
    };

    return (
      <div className="grievanceCreate">
        <form
          autoComplete="off"
          onSubmit={e => {
            resetAndSearch(e);
          }}
        >
          <Card style={styles.marginStyle}>
            <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}> Search Grievance </div>} />
            <CardText style={{ padding: 0 }}>
              <Grid>
                <Row>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <TextField
                      className="custom-form-control-for-textfield"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.crnformat')}
                      value={grievanceSearchSet.serviceRequestId || ''}
                      onChange={(e, value) => {
                        handleChange(value, 'serviceRequestId', false, '');
                      }}
                    />
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <SelectField
                      className="custom-form-control-for-select"
                      hintText="Select"
                      maxHeight={200}
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('core.lbl.location')}
                      value={grievanceSearchSet.locationId}
                      onChange={(e, i, value) => {
                        handleChange(value, 'locationId', false, '');
                      }}
                    >
                      <MenuItem value="" primaryText="Select" />
                      {locationList.map((loc, index) => <MenuItem value={loc.id} key={index} primaryText={loc.name} />)}
                    </SelectField>
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <DatePicker
                      autoOk={true}
                      className="custom-form-control-for-textfield"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('core.lbl.date.fromdate')}
                      container="inline"
                      value={grievanceSearchSet.startDate}
                      formatDate={date => {
                        let dateObj = new Date(date);
                        let year = dateObj.getFullYear();
                        let month = dateObj.getMonth() + 1;
                        let dt = dateObj.getDate();
                        dt = dt < 10 ? '0' + dt : dt;
                        month = month < 10 ? '0' + month : month;
                        return dt + '-' + month + '-' + year;
                      }}
                      onChange={(e, value) => {
                        this.checkDate(value, 'startDate', false, '');
                      }}
                      errorText={this.state.datefield === 'startDate' ? this.state.dateError : ''}
                    />
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <DatePicker
                      autoOk={true}
                      className="custom-form-control-for-textfield"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('core.lbl.date.todate')}
                      container="inline"
                      value={grievanceSearchSet.endDate}
                      formatDate={date => {
                        let dateObj = new Date(date);
                        let year = dateObj.getFullYear();
                        let month = dateObj.getMonth() + 1;
                        let dt = dateObj.getDate();
                        dt = dt < 10 ? '0' + dt : dt;
                        month = month < 10 ? '0' + month : month;
                        return dt + '-' + month + '-' + year;
                      }}
                      onChange={(e, value) => {
                        this.checkDate(value, 'endDate', false, '');
                      }}
                      errorText={this.state.datefield === 'endDate' ? this.state.dateError : ''}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12}>
                    <RaisedButton
                      label={buttonText}
                      onClick={e => {
                        e.preventDefault();
                        buttonText == translate('core.lbl.more')
                          ? changeButtonText(translate('core.lbl.less'))
                          : changeButtonText(translate('core.lbl.more'));
                      }}
                    />
                  </Col>
                </Row>
                {showOtherFields()}
              </Grid>
            </CardText>
          </Card>
          <div style={{ textAlign: 'center' }}>
            <RaisedButton style={{ margin: '15px 5px' }} type="submit" primary={true} label={translate('core.lbl.search')} />
            <RaisedButton
              style={{ margin: '15px 5px' }}
              type="button"
              label={translate('core.lbl.reset')}
              onClick={e => {
                resetSearch(e);
              }}
            />
          </div>
        </form>
        {isSearchClicked ? <ServerSideTable resultSet={this.state.resultList} pageCount={this.state.pageCount} search={this.search} /> : ''}
        <Dialog
          title={translate('core.msg.criteria.required')}
          open={this.state.open}
          onRequestClose={this.handleOpenNClose}
          actions={<FlatButton label={translate('core.lbl.close')} primary={true} onTouchTap={this.handleOpenNClose} />}
        />
        <Snackbar
          open={this.state.open1}
          message={translate('pgr.lbl.noresult')}
          autoHideDuration={4000}
          style={{ textAlign: 'center' }}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    grievanceSearchSet: state.form.form,
    fieldErrors: state.form.fieldErrors,
    isFormValid: state.form.isFormValid,
    buttonText: state.form.buttonText,
  };
};
const mapDispatchToProps = dispatch => ({
  initForm: type => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: [],
        },
        pattern: {
          current: [],
          required: ['mobileNumber', 'emailId'],
        },
      },
    });
  },
  handleChange: (value, property, isRequired, pattern) => {
    dispatch({ type: 'HANDLE_CHANGE', property, value, isRequired, pattern });
  },
  changeButtonText: text => {
    dispatch({ type: 'BUTTON_TEXT', text });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(grievanceSearch);
