import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileDownload from 'material-ui/svg-icons/action/get-app';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import { Grid, Row, Col, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { white } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Api from '../../../api/api';
import { translate, validate_fileupload } from '../../common/common';
import Fields from '../../common/Fields';
import ViewSRN from '../../common/PGR/viewSRN';
import EmployeeDocs from '../../common/PGR/employeeDocs';
import WorkFlow from '../../common/PGR/workflow';
import styles from '../../../styles/material-ui';
import ClosureNote from './notice/ClosureNote';
import RejectionLetter from './notice/RejectionLetter';
var Rating = require('react-rating');
const constants = require('../../common/constants');

var currentThis;

class grievanceView extends Component {
  static isPrivate = false;
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      isUpdateAllowed: true,
      commentsMandat: true,
    };
  }
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.setLoadingStatus('loading');
    this.setState({
      open: false,
    });
    //this.loadSRN();
    window.location.reload();
  };

  componentDidMount() {
    currentThis = this;
    this.loadSRN();
  }

  loadSRN = () => {
    let { initForm, handleChange } = this.props;
    initForm();

    this.props.setLoadingStatus('loading');

    Api.commonApiPost('/pgr/seva/v1/_search', { serviceRequestId: currentThis.props.match.params.srn }, {}).then(
      function(response) {
        if (response.serviceRequests.length === 0) {
          currentThis.props.setLoadingStatus('hide');
          currentThis.handleError(translate('pgr.lbl.invalidcrn'));
          return false;
        }

        currentThis.setState({ srn: response.serviceRequests });

        currentThis.state.srn.map((item, index) => {
          for (var k in item) {
            if (item[k] instanceof Array) {
              item[k].map((attribValues, index) => {
                currentThis.setState({ [Object.values(attribValues)[0]]: Object.values(attribValues)[1] });
              });
            } else {
              currentThis.setState({ [k]: item[k] });
            }
          }
          if (
            localStorage.getItem('type') === 'CITIZEN' &&
            (currentThis.state.systemStatus === 'COMPLETED' || currentThis.state.systemStatus === 'REJECTED')
          ) {
            currentThis.props.ADD_MANDATORY('systemRating');
            if (currentThis.state.systemRating) {
              handleChange(Number(currentThis.state.systemRating), 'systemRating', true, '');
              currentThis.commentsTrigger('', false);
            }
          }
          if (currentThis.state.systemStatus === 'FORWARDED' && localStorage.getItem('type') === 'EMPLOYEE') {
            currentThis.props.ADD_MANDATORY('designationId');
            currentThis.props.ADD_MANDATORY('systemPositionId');
            handleChange('', 'designationId', true, '');
            handleChange('', 'systemPositionId', true, '');
          }
          handleChange(currentThis.state.systemStatus, 'systemStatus', false, '');
        });

        Api.commonApiPost('/workflow/history/v1/_search', { workflowId: currentThis.state.systemStateId }).then(
          function(response) {
            //console.log(JSON.stringify(response));
            currentThis.setState({ workflow: response });

            Api.commonApiGet('/filestore/v1/files/tag', { tag: currentThis.state.serviceRequestId }).then(
              function(response) {
                //console.log(JSON.stringify(response));
                currentThis.setState({ files: response.files });
                currentThis.SDAPI();
              },
              function(err) {
                currentThis.props.setLoadingStatus('hide');
                currentThis.handleError(err.message);
              }
            );
          },
          function(err) {
            currentThis.props.setLoadingStatus('hide');
            currentThis.handleError(err.message);
          }
        );
      },
      function(err) {
        currentThis.props.setLoadingStatus('hide');
        currentThis.handleError(err.message);
      }
    );
  };
  SDAPI = () => {
    Api.commonApiPost('/pgr/servicedefinition/v1/_search', { serviceCode: this.state.serviceCode }).then(
      function(response) {
        currentThis.setState({ SD: response.attributes });
        //ADD MANDATORY & DISPATCH based on SD
        //Required for SD
        if (response.attributes.length > 0 && localStorage.getItem('type') === 'EMPLOYEE') {
          let FormFields = response.attributes.filter(function(el) {
            return el.code !== 'CHECKLIST' && el.code !== 'DOCUMENTS';
          });
          if (FormFields.length > 0) {
            //check condition
            FormFields.map((item, index) => {
              if (item.roles.indexOf(localStorage.getItem('type')) > -1 && item.actions.indexOf(currentThis.state.systemStatus) > -1) {
                if (currentThis.state[item.code]) currentThis.props.handleChange(currentThis.state[item.code], item.code, item.required, '');
                if (item.required) currentThis.props.ADD_MANDATORY(item.code);
              }
            });
          }
        }
        currentThis.getDepartmentById();
      },
      function(err) {
        currentThis.props.setLoadingStatus('hide');
        currentThis.handleError(err.message);
      }
    );
  };
  getDepartmentById = () => {
    Api.commonApiPost('/egov-common-masters/departments/_search', { id: this.state.systemDepartmentId }).then(
      function(response) {
        currentThis.setState({ departmentName: response.Department[0].name });
        currentThis.getReceivingCenter();
      },
      function(err) {
        currentThis.props.setLoadingStatus('hide');
        currentThis.handleError(err.message);
      }
    );
  };
  getReceivingCenter() {
    if (this.state.systemReceivingCenter) {
      Api.commonApiPost('/pgr-master/receivingcenter/v1/_search', { id: this.state.systemReceivingCenter }).then(
        function(response) {
          currentThis.setState({ receivingCenterName: response.ReceivingCenterType[0].name });
          currentThis.getWardbyId();
        },
        function(err) {
          currentThis.props.setLoadingStatus('hide');
          currentThis.handleError(err.message);
        }
      );
    } else {
      currentThis.getWardbyId();
    }
  }
  getWardbyId() {
    if (this.state.systemLocationId)
      Api.commonApiGet('/egov-location/boundarys', { boundary: this.state.systemLocationId }).then(
        function(response) {
          currentThis.setState({ locationName: response.Boundary[0].name });
          currentThis.getLocation();
        },
        function(err) {
          currentThis.props.setLoadingStatus('hide');
          currentThis.handleError(err.message);
        }
      );
    else {
      currentThis.setState({ locationName: '' });
      currentThis.getLocation();
    }
  }
  getLocation() {
    if (this.state.systemChildLocationId)
      Api.commonApiGet('/egov-location/boundarys', { boundary: this.state.systemChildLocationId }).then(
        function(response) {
          currentThis.setState({ childLocationName: response.Boundary[0].name });
          currentThis.nextStatus();
        },
        function(err) {
          currentThis.props.setLoadingStatus('hide');
          currentThis.handleError(err.message);
        }
      );
    else {
      currentThis.setState({ childLocationName: '' });
      currentThis.nextStatus();
    }
  }
  nextStatus = () => {
    if (localStorage.getItem('type')) {
      Api.commonApiPost('/workflow/v1/nextstatuses/_search', { currentStatusCode: this.state.systemStatus }).then(
        function(response) {
          currentThis.setState({ nextStatus: response.statuses });
          currentThis.allServices();
        },
        function(err) {
          currentThis.props.setLoadingStatus('hide');
          currentThis.handleError(err.message);
        }
      );
    } else {
      currentThis.props.setLoadingStatus('hide');
    }
  };
  allServices = () => {
    if (localStorage.getItem('type') === 'EMPLOYEE') {
      Api.commonApiPost('/pgr-master/service/v1/_search', { type: 'all', keywords: 'complaint' }).then(
        function(response) {
          currentThis.setState({ complaintTypes: response.Service });
          //check update is enabled?
          currentThis.checkUpdateEnabled();
        },
        function(err) {
          currentThis.props.setLoadingStatus('hide');
          currentThis.handleError(err.message);
        }
      );
    } else {
      currentThis.props.setLoadingStatus('hide');
    }
  };
  checkUpdateEnabled = () => {
    Api.commonApiPost('/pgr/seva/v1/_get', { crn: currentThis.props.match.params.srn }).then(
      function(response) {
        currentThis.setState({ isUpdateAllowed: response.isUpdateAllowed });
        currentThis.getWard();
      },
      function(err) {
        currentThis.props.setLoadingStatus('hide');
        currentThis.handleError(err.message);
      }
    );
  };
  getWard = () => {
    Api.commonApiPost('/egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'Ward',
      hierarchyTypeName: 'Administration',
    }).then(
      function(response) {
        currentThis.setState({ ward: response.Boundary });
        currentThis.getLocality();
      },
      function(err) {
        currentThis.props.setLoadingStatus('hide');
        currentThis.handleError(err.message);
      }
    );
  };
  getLocality = () => {
    Api.commonApiPost('/egov-location/boundarys/childLocationsByBoundaryId', { boundaryId: this.state.systemLocationId }).then(
      function(response) {
        currentThis.setState({ locality: response.Boundary });
        currentThis.getDepartment();
      },
      function(err) {
        currentThis.props.setLoadingStatus('hide');
        currentThis.handleError(err.message);
      }
    );
  };
  getDepartment = () => {
    Api.commonApiPost('/egov-common-masters/departments/_search').then(
      function(response) {
        currentThis.setState({ department: response.Department });
        currentThis.props.setLoadingStatus('hide');
      },
      function(err) {
        currentThis.props.setLoadingStatus('hide');
        currentThis.handleError(err.message);
      }
    );
  };
  search = e => {
    e.preventDefault();
    this.props.setLoadingStatus('loading');
    let update = [...currentThis.state.srn];
    let req_obj = {};
    req_obj['serviceRequest'] = update[0];
    //console.log(JSON.stringify(req_obj));

    var dat = new Date().toLocaleDateString();
    var time = new Date().toLocaleTimeString();
    var date = dat.split('/').join('-');
    req_obj.serviceRequest['updatedDatetime'] = date + ' ' + time;

    //change status, position, ward, location in attribValues
    for (var i = 0, len = req_obj.serviceRequest.attribValues.length; i < len; i++) {
      if (req_obj.serviceRequest.attribValues[i]['key'] === 'systemStatus') {
        req_obj.serviceRequest.attribValues[i]['name'] = currentThis.props.grievanceView.systemStatus
          ? currentThis.props.grievanceView.systemStatus
          : currentThis.state.systemStatus;
      } else if (req_obj.serviceRequest.attribValues[i]['key'] === 'systemPositionId') {
        req_obj.serviceRequest.attribValues[i]['name'] = currentThis.props.grievanceView.systemPositionId
          ? currentThis.props.grievanceView.systemPositionId
          : currentThis.state.systemPositionId;
      } else if (req_obj.serviceRequest.attribValues[i]['key'] === 'systemLocationId') {
        req_obj.serviceRequest.attribValues[i]['name'] = currentThis.props.grievanceView.systemLocationId
          ? currentThis.props.grievanceView.systemLocationId
          : currentThis.state.systemLocationId;
      }
    }

    //change serviceCode in serviceRequests
    req_obj.serviceRequest.serviceCode = currentThis.props.grievanceView.serviceCode
      ? currentThis.props.grievanceView.serviceCode
      : currentThis.state.serviceCode;

    if (currentThis.props.grievanceView['systemChildLocationId']) currentThis.chckkey('systemChildLocationId', req_obj);

    if (currentThis.props.grievanceView['systemApprovalComments']) currentThis.chckkey('systemApprovalComments', req_obj);

    if (localStorage.getItem('type') === 'EMPLOYEE') {
      if (currentThis.props.grievanceView['PRIORITY']) currentThis.chckkey('PRIORITY', req_obj);
    } else if (localStorage.getItem('type') === 'CITIZEN') {
      if (currentThis.props.grievanceView['systemRating']) currentThis.chckkey('systemRating', req_obj);
    }

    if (currentThis.props.files.length > 0) {
      for (let i = 0; i < currentThis.props.files.length; i++) {
        let formData = new FormData();
        formData.append('tenantId', localStorage.getItem('tenantId'));
        formData.append('module', 'PGR');
        formData.append('file', currentThis.props.files[i]);
        Api.commonApiPost('/filestore/v1/files', {}, formData).then(
          function(response) {
            var obj = {
              key: 'employeeDocs_' + currentThis.props.files[i]['name'],
              name: response.files[0].fileStoreId,
            };
            req_obj.serviceRequest.attribValues.push(obj);
            currentThis.updateSeva(req_obj);
          },
          function(err) {
            currentThis.props.setLoadingStatus('hide');
            currentThis.handleError(err.message);
          }
        );
      }
    } else {
      currentThis.updateSeva(req_obj);
    }
  };
  chckkey = (key, req_obj) => {
    //chck approval comments exists in attribvalues
    var result = req_obj.serviceRequest.attribValues.filter(function(obj) {
      return obj.key === key;
    });

    if (result.length > 0) {
      for (var i = 0, len = req_obj.serviceRequest.attribValues.length; i < len; i++) {
        if (req_obj.serviceRequest.attribValues[i]['key'] === key) {
          req_obj.serviceRequest.attribValues[i]['name'] = currentThis.props.grievanceView[key];
        }
      }
    } else {
      if (currentThis.props.grievanceView[key]) {
        var finobj;
        finobj = {
          key: key,
          name: currentThis.props.grievanceView[key],
        };
        req_obj.serviceRequest.attribValues.push(finobj);
      }
    }
  };
  updateSeva = req_obj => {
    //console.log('Before Submit',JSON.stringify(req_obj));
    Api.commonApiPost('/pgr/seva/v1/_update', {}, req_obj).then(
      function(updateResponse) {
        // console.log('After submit',JSON.stringify(updateResponse));
        currentThis.props.setLoadingStatus('hide');
        {
          currentThis.handleOpen();
        }
      },
      function(err) {
        currentThis.props.setLoadingStatus('hide');
        currentThis.handleError(err.message);
      }
    );
  };
  handleUploadValidation = (e, formats) => {
    let validFile = validate_fileupload(e.target.files, formats);
    //console.log('is valid:', validFile);
    if (validFile === true) {
      this.props.handleFileEmpty();
      this.props.handleUpload(e);
    } else {
      this.refs.file.value = '';
      this.handleError(validFile);
    }
  };
  handleError = msg => {
    let { toggleDailogAndSetText, toggleSnackbarAndSetText } = this.props;
    toggleDailogAndSetText(true, msg);
    //toggleSnackbarAndSetText(true, "Could not able to create complaint. Try again")
  };
  loadServiceDefinition = () => {
    if (this.state.SD !== undefined && localStorage.getItem('type') === 'EMPLOYEE') {
      let FormFields = this.state.SD.filter(function(el) {
        return el.code !== 'CHECKLIST' && el.code !== 'DOCUMENTS';
      });
      if (FormFields.length > 0) {
        //check condition
        return FormFields.map((item, index) => {
          //console.log(item.roles, item.actions, this.state.systemStatus, this.state.serviceCode);
          if (item.roles.indexOf(localStorage.getItem('type')) > -1 && item.actions.indexOf(this.state.systemStatus) > -1) {
            //item.dataType = 'datetime';
            return (
              <Fields
                key={index}
                error={currentThis.props.fieldErrors[item.code]}
                obj={item}
                value={currentThis.props.grievanceView[item.code] ? currentThis.props.grievanceView[item.code] : currentThis.state[item.code]}
                handler={currentThis.props.handleChange}
              />
            );
          }
        });
      }
    }
  };
  commentsTrigger = (msg = '', boolean) => {
    if (boolean) {
      this.props.ADD_MANDATORY_LATEST(msg, 'systemApprovalComments', boolean, '', '');
      this.setState({ commentsMandat: true });
    } else {
      this.props.REMOVE_MANDATORY_LATEST(msg, 'systemApprovalComments', boolean, '', '');
      this.setState({ commentsMandat: false });
    }
  };
  printClosureNote = () => {
    this.setState({ printClosure: true });
  };
  printRejectionLetter = () => {
    this.setState({ rejectionLetter: true });
  };
  render() {
    let { search, getReceivingCenter, getLocation, loadServiceDefinition, handleUploadValidation } = this;
    let {
      handleChange,
      handleWard,
      handleLocality,
      handleDesignation,
      handleStatusChange,
      handlePosition,
      grievanceView,
      files,
      fieldErrors,
      isFormValid,
      handleUpload,
    } = this.props;
    currentThis = this;
    const actions = [<FlatButton label={translate('core.lbl.ok')} primary={true} onTouchTap={this.handleClose} />];
    if (this.state.printClosure) {
      return <ClosureNote grievance={this.state.srn} />;
    } else if (this.state.rejectionLetter) {
      return <RejectionLetter grievance={this.state.srn} />;
    } else {
      return (
        <div>
          <form autoComplete="off">
            <h3 className="application-title">
              {translate('pgr.lbl.crnformat')} : {this.state.serviceRequestId}
            </h3>
            <ViewSRN srn={this.state} />
            <EmployeeDocs srn={this.state.srn} />
            <WorkFlow workflowdetails={this.state.workflow} />
            {(this.state.isUpdateAllowed &&
              localStorage.getItem('type') === 'EMPLOYEE' &&
              this.state.systemStatus !== 'REJECTED' &&
              this.state.systemStatus !== 'COMPLETED') ||
            (localStorage.getItem('type') === 'CITIZEN' && this.state.systemStatus !== 'WITHDRAWN') ? (
              <div>
                <Card style={styles.cardMargin}>
                  <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}>{translate('pgr.lbl.actions')}</div>} />
                  <CardText style={{ padding: '8px 16px 0' }}>
                    <Row>
                      <Col xs={12} sm={4} md={3} lg={3}>
                        <SelectField
                          className="custom-form-control-for-select"
                          hintText="Select"
                          fullWidth={true}
                          floatingLabelStyle={styles.floatingLabelStyle}
                          floatingLabelFixed={true}
                          floatingLabelText={translate('pgr.lbl.change.status') + ' *'}
                          maxHeight={200}
                          value={grievanceView.systemStatus ? grievanceView.systemStatus : this.state.systemStatus}
                          dropDownMenuProps={{ targetOrigin: { horizontal: 'left', vertical: 'bottom' } }}
                          onChange={(event, key, value) => {
                            handleStatusChange(value, 'systemStatus', false, '');
                            if (localStorage.getItem('type') === constants.ROLE_CITIZEN && (value === 'REOPENED' || value === 'WITHDRAWN')) {
                              this.commentsTrigger(this.props.grievanceView.systemApprovalComments, true);
                            } else if (localStorage.getItem('type') === constants.ROLE_CITIZEN) {
                              this.commentsTrigger(this.props.grievanceView.systemApprovalComments, false);
                            }
                          }}
                        >
                          {localStorage.getItem('type') === constants.ROLE_CITIZEN ? (
                            <MenuItem value={this.state.systemStatus} primaryText="Select" />
                          ) : (
                            ''
                          )}
                          {this.state.nextStatus !== undefined
                            ? this.state.nextStatus.map((status, index) => <MenuItem value={status.code} key={index} primaryText={status.name} />)
                            : ''}
                        </SelectField>
                      </Col>
                      {localStorage.getItem('type') === 'EMPLOYEE' ? (
                        <Col xs={12} sm={4} md={3} lg={3}>
                          <SelectField
                            className="custom-form-control-for-select"
                            hintText="Select"
                            fullWidth={true}
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFixed={true}
                            floatingLabelText={translate('pgr.lbl.change.grievancetype') + ' *'}
                            maxHeight={200}
                            value={grievanceView.serviceCode ? grievanceView.serviceCode : this.state.serviceCode}
                            onChange={(event, key, value) => {
                              handleChange(value, 'serviceCode', false, '');
                            }}
                          >
                            {this.state.complaintTypes !== undefined
                              ? this.state.complaintTypes.map((ctype, index) => (
                                  <MenuItem value={ctype.serviceCode} key={index} primaryText={ctype.serviceName} />
                                ))
                              : ''}
                          </SelectField>
                        </Col>
                      ) : (
                        ''
                      )}
                      {localStorage.getItem('type') === 'EMPLOYEE' ? (
                        <Col xs={12} sm={4} md={3} lg={3}>
                          <SelectField
                            className="custom-form-control-for-select"
                            hintText="Select"
                            fullWidth={true}
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFixed={true}
                            floatingLabelText={translate('Ward') + ' *'}
                            maxHeight={200}
                            value={grievanceView.systemLocationId ? grievanceView.systemLocationId : this.state.systemLocationId}
                            onChange={(event, key, value) => {
                              handleWard(value, 'systemLocationId', false, '');
                            }}
                          >
                            {this.state.ward !== undefined
                              ? this.state.ward.map((ward, index) => <MenuItem value={ward.id} key={index} primaryText={ward.name} />)
                              : ''}
                          </SelectField>
                        </Col>
                      ) : (
                        ''
                      )}
                      {localStorage.getItem('type') === 'EMPLOYEE' ? (
                        <Col xs={12} sm={4} md={3} lg={3}>
                          <SelectField
                            className="custom-form-control-for-select"
                            hintText="Select"
                            fullWidth={true}
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFixed={true}
                            floatingLabelText={translate('core.lbl.location') + ' *'}
                            maxHeight={200}
                            value={grievanceView.systemChildLocationId ? grievanceView.systemChildLocationId : this.state.systemChildLocationId}
                            onChange={(event, key, value) => {
                              handleLocality(value, 'systemChildLocationId', true, '');
                            }}
                          >
                            {this.state.locality !== undefined
                              ? this.state.locality.map((locality, index) => <MenuItem value={locality.id} key={index} primaryText={locality.name} />)
                              : ''}
                          </SelectField>
                        </Col>
                      ) : (
                        ''
                      )}
                    </Row>
                    {localStorage.getItem('type') === 'EMPLOYEE' && grievanceView.systemStatus === 'FORWARDED' ? (
                      <Row>
                        <Col xs={12} sm={4} md={3} lg={3}>
                          <SelectField
                            className="custom-form-control-for-select"
                            hintText="Select"
                            fullWidth={true}
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFixed={true}
                            floatingLabelText={translate('pgr.lbl.frwddept')}
                            maxHeight={200}
                            value={grievanceView.departmentId}
                            onChange={(event, key, value) => {
                              handleDesignation(value, 'departmentId', false, '');
                            }}
                          >
                            <MenuItem value={0} primaryText="Select Department" />
                            {this.state.department !== undefined
                              ? this.state.department.map((department, index) => (
                                  <MenuItem value={department.id} key={index} primaryText={department.name} />
                                ))
                              : ''}
                          </SelectField>
                        </Col>
                        <Col xs={12} sm={4} md={3} lg={3}>
                          <SelectField
                            className="custom-form-control-for-select"
                            hintText="Select"
                            fullWidth={true}
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFixed={true}
                            floatingLabelText={translate('pgr.lbl.frwddesgn')}
                            maxHeight={200}
                            value={grievanceView.designationId}
                            onChange={(event, key, value) => {
                              handlePosition(grievanceView.departmentId, value, 'designationId', true, '');
                            }}
                          >
                            <MenuItem value={0} primaryText="Select Designation" />
                            {this.state.designation !== undefined
                              ? this.state.designation.map((designation, index) => (
                                  <MenuItem value={designation.id} key={index} primaryText={designation.name} />
                                ))
                              : ''}
                          </SelectField>
                        </Col>
                        <Col xs={12} sm={4} md={3} lg={3}>
                          <SelectField
                            className="custom-form-control-for-select"
                            hintText="Select"
                            fullWidth={true}
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFixed={true}
                            floatingLabelText={translate('pgr.lbl.frwdpos')}
                            maxHeight={200}
                            value={grievanceView.systemPositionId}
                            onChange={(event, key, value) => {
                              handleChange(value, 'systemPositionId', true, '');
                            }}
                          >
                            <MenuItem value={0} primaryText="Select Position" />
                            {this.state.position !== undefined
                              ? this.state.position.map((position, index) => (
                                  <MenuItem value={position.assignments[0].position} key={index} primaryText={position.name} />
                                ))
                              : ''}
                          </SelectField>
                        </Col>
                      </Row>
                    ) : (
                      ''
                    )}
                    {localStorage.getItem('type') === 'EMPLOYEE' ? <Row>{loadServiceDefinition()}</Row> : ''}
                    {localStorage.getItem('type') === 'CITIZEN' &&
                    (this.state.systemStatus === 'COMPLETED' || currentThis.state.systemStatus === 'REJECTED') ? (
                      <Row>
                        <Col xs={12} sm={4} md={3} lg={3}>
                          <h4>Feedback</h4>
                          <Rating
                            className="rating"
                            empty="glyphicon glyphicon-star-empty"
                            full="glyphicon glyphicon-star"
                            initialRate={grievanceView.systemRating}
                            onClick={(rate, event) => {
                              let { systemStatus } = this.props.grievanceView;
                              handleChange(rate, 'systemRating', true, '');
                              if (systemStatus === 'WITHDRAWN' || systemStatus === 'REOPENED') {
                                this.commentsTrigger(this.props.grievanceView.systemApprovalComments, true);
                              } else {
                                this.commentsTrigger(this.props.grievanceView.systemApprovalComments, false);
                              }
                            }}
                          />
                        </Col>
                      </Row>
                    ) : (
                      ''
                    )}
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <TextField
                          className="custom-form-control-for-textarea"
                          floatingLabelStyle={styles.floatingLabelStyle}
                          floatingLabelFixed={true}
                          floatingLabelText={translate('core.lbl.comments') + ' *'}
                          fullWidth={true}
                          multiLine={true}
                          rows={2}
                          rowsMax={4}
                          value={grievanceView.systemApprovalComments ? grievanceView.systemApprovalComments : ''}
                          maxLength="500"
                          onChange={(event, newValue) => {
                            handleChange(newValue, 'systemApprovalComments', this.state.commentsMandat, /^.[^]{0,500}$/);
                          }}
                          errorText={fieldErrors.systemApprovalComments ? fieldErrors.systemApprovalComments : ''}
                        />
                      </Col>
                    </Row>
                    {localStorage.getItem('type') === 'EMPLOYEE' ? (
                      <Row>
                        <Col xs={12} sm={4} md={3} lg={3}>
                          <h4>{translate('core.documents')}</h4>
                        </Col>
                        <Col xs={12} sm={4} md={3} lg={3}>
                          <div className="input-group">
                            <input
                              type="file"
                              className="form-control"
                              ref="file"
                              onChange={e =>
                                handleUploadValidation(e, ['doc', 'docx', 'xls', 'xlsx', 'rtf', 'pdf', 'jpeg', 'jpg', 'png', 'txt', 'zip', 'dxf'])
                              }
                            />
                            {files.length > 0 ? (
                              <span
                                className="input-group-addon"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  this.refs.file.value = '';
                                  this.props.handleFileEmpty();
                                }}
                              >
                                <i className="glyphicon glyphicon-trash specific" />
                              </span>
                            ) : (
                              ''
                            )}
                          </div>
                        </Col>
                      </Row>
                    ) : (
                      ''
                    )}
                    <div style={{ textAlign: 'center' }}>
                      <RaisedButton
                        style={{ margin: '15px 5px' }}
                        onTouchTap={e => search(e)}
                        disabled={!isFormValid}
                        label="Submit"
                        primary={true}
                      />
                    </div>
                  </CardText>
                </Card>
              </div>
            ) : (
              ''
            )}
            <div style={{ textAlign: 'center' }}>
              {this.state.systemStatus === 'COMPLETED' ? (
                <RaisedButton
                  style={{ margin: '15px 5px' }}
                  onTouchTap={e => this.printClosureNote()}
                  label={translate('pgr.print.ClosureNote')}
                  primary={true}
                />
              ) : (
                ''
              )}
              {this.state.systemStatus === 'REJECTED' ? (
                <RaisedButton
                  style={{ margin: '15px 5px' }}
                  onTouchTap={e => this.printRejectionLetter()}
                  label={translate('pgr.print.rejectionLetter')}
                  primary={true}
                />
              ) : (
                ''
              )}
            </div>
          </form>
          <Dialog actions={actions} modal={true} open={this.state.open} onRequestClose={this.handleClose}>
            {translate('pgr.msg.success.grievanceupdated')}
          </Dialog>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return { grievanceView: state.form.form, files: state.form.files, fieldErrors: state.form.fieldErrors, isFormValid: state.form.isFormValid };
};

const mapDispatchToProps = dispatch => ({
  initForm: () => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: ['systemApprovalComments'],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },
  ADD_MANDATORY_LATEST: (value, property, isRequired, pattern, errorMsg) => {
    // console.log(value, property, isRequired, pattern);
    dispatch({ type: 'ADD_MANDATORY_LATEST', property, value, isRequired, pattern });
  },
  REMOVE_MANDATORY_LATEST: (value, property, isRequired, pattern, errorMsg) => {
    // console.log(value, property, isRequired, pattern);
    dispatch({ type: 'REMOVE_MANDATORY_LATEST', property, value, isRequired, pattern });
  },
  ADD_MANDATORY: property => {
    dispatch({ type: 'ADD_MANDATORY', property, value: '', isRequired: true, pattern: '' });
  },
  handleChange: (value, property, isRequired, pattern) => {
    // console.log(value, property, isRequired, pattern);
    dispatch({ type: 'HANDLE_CHANGE', property, value, isRequired, pattern });
  },
  handleStatusChange: (value, property, isRequired, pattern) => {
    if (value === 'FORWARDED') {
      dispatch({ type: 'ADD_MANDATORY', property: 'designationId', value: '', isRequired: true, pattern: '' });
      dispatch({ type: 'ADD_MANDATORY', property: 'systemPositionId', value: '', isRequired: true, pattern: '' });
      dispatch({ type: 'HANDLE_CHANGE', property: 'departmentId', value: 0, isRequired: false, pattern: '' });
      dispatch({ type: 'HANDLE_CHANGE', property: 'designationId', value: 0, isRequired: true, pattern: '' });
      dispatch({ type: 'HANDLE_CHANGE', property: 'systemPositionId', value: 0, isRequired: true, pattern: '' });
    } else {
      dispatch({ type: 'REMOVE_MANDATORY', property: 'designationId', value: '', isRequired: false, pattern: '' });
      dispatch({ type: 'REMOVE_MANDATORY', property: 'systemPositionId', value: '', isRequired: false, pattern: '' });
      dispatch({ type: 'HANDLE_CHANGE', property: 'departmentId', value: 0, isRequired: false, pattern: '' });
      dispatch({ type: 'HANDLE_CHANGE', property: 'designationId', value: 0, isRequired: false, pattern: '' });
      dispatch({ type: 'HANDLE_CHANGE', property: 'systemPositionId', value: 0, isRequired: false, pattern: '' });
    }
    dispatch({ type: 'HANDLE_CHANGE', property, value, isRequired, pattern });
  },
  handleWard: (value, property, isRequired, pattern) => {
    Api.commonApiPost('/egov-location/boundarys/childLocationsByBoundaryId', { boundaryId: value }).then(
      function(response) {
        currentThis.setState({ locality: response.Boundary });
        currentThis.setState({ childLocationId: '' });
        dispatch({ type: 'ADD_MANDATORY', property: 'systemChildLocationId', value: '', isRequired: true, pattern: '' });
        dispatch({ type: 'HANDLE_CHANGE', property: 'systemChildLocationId', value: '', isRequired: true, pattern: '' });
        dispatch({ type: 'HANDLE_CHANGE', property, value, isRequired, pattern });
      },
      function(err) {
        currentThis.handleError(err.message);
      }
    );
  },
  handleLocality: (value, property, isRequired, pattern) => {
    dispatch({ type: 'ADD_MANDATORY', property: 'systemChildLocationId', value: '', isRequired: true, pattern: '' });
    dispatch({ type: 'HANDLE_CHANGE', property, value, isRequired, pattern });
  },
  handleDesignation: (value, property, isRequired, pattern) => {
    if (value === 0) {
      currentThis.setState({ designation: [] });
      currentThis.setState({ position: [] });
      dispatch({ type: 'REMOVE_MANDATORY', property: 'designationId', value: '', isRequired: false, pattern: '' });
      dispatch({ type: 'REMOVE_MANDATORY', property: 'systemPositionId', value: '', isRequired: false, pattern: '' });
      dispatch({ type: 'HANDLE_CHANGE', property: 'departmentId', value: 0, isRequired: false, pattern: '' });
      dispatch({ type: 'HANDLE_CHANGE', property: 'designationId', value: '', isRequired: false, pattern: '' });
      dispatch({ type: 'HANDLE_CHANGE', property: 'systemPositionId', value: '', isRequired: false, pattern: '' });
    } else {
      Api.commonApiPost('/hr-masters/designations/_search').then(
        function(response) {
          currentThis.setState({ designation: response.Designation });
          dispatch({ type: 'ADD_MANDATORY', property: 'designationId', value: '', isRequired: true, pattern: '' });
          dispatch({ type: 'ADD_MANDATORY', property: 'systemPositionId', value: '', isRequired: true, pattern: '' });
          dispatch({ type: 'HANDLE_CHANGE', property: 'designationId', value: '', isRequired: true, pattern: '' });
          dispatch({ type: 'HANDLE_CHANGE', property: 'systemPositionId', value: '', isRequired: true, pattern: '' });
          dispatch({ type: 'HANDLE_CHANGE', property, value, isRequired, pattern });
        },
        function(err) {
          currentThis.handleError(err.message);
        }
      );
    }
  },
  handlePosition: (dep, value, property, isRequired, pattern) => {
    if (property === 'designationId' && value === 0) {
      dispatch({ type: 'HANDLE_CHANGE', property: 'systemPositionId', value: 0, isRequired, pattern });
    } else {
      let des = value;
      if (dep && des) {
        Api.commonApiPost('/hr-employee/employees/_search', { departmentId: dep, designationId: des }).then(
          function(response) {
            currentThis.setState({ position: response.Employee });
            dispatch({ type: 'HANDLE_CHANGE', property, value, isRequired, pattern });
          },
          function(err) {
            currentThis.handleError(err.message);
          }
        );
      } else {
        currentThis.setState({ position: [] });
      }
    }
  },
  handleUpload: e => {
    dispatch({ type: 'FILE_UPLOAD', files: e.target.files[0] });
  },
  handleFileEmpty: () => {
    dispatch({ type: 'FILE_EMPTY' });
  },
  toggleDailogAndSetText: (dailogState, msg) => {
    dispatch({ type: 'TOGGLE_DAILOG_AND_SET_TEXT', dailogState, msg });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(grievanceView);
