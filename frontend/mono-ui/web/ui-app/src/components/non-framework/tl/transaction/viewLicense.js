import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Grid, Row, Col } from 'react-bootstrap';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import _ from 'lodash';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FileInput from '../utils/FileInput';
import WorkFlow from '../workflow/WorkFlow';
import { translate, epochToDate, dateToEpoch, validate_fileupload } from '../../../common/common';
import Api from '../../../../api/api';
import styles from '../../../../styles/material-ui';
import ViewPrintCertificate from './PrintCertificate';
import ViewRejectionLetter from './RejectionLetter';
import YesOrNoDialog from '../utils/YesOrNoDialog';
import NewTradeLicenseForm from './NewTradeLicenseForm';
const constants = require('../../../common/constants');

var self;

class ViewLicense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      fieldInspection: false,
      isPrintCertificate: false,
      isEditMode: false,
      isEditModeReadyForSubmission: false,
      printCertificateStateValues: {
        isProceedToPrintCertificate: false,
        item: {},
        state: {},
      },
      isRejectionLetterShow: false,
      rejectionLetterStateValues: {
        isProceedToRejection: false,
        item: {},
        state: {},
      },
      showYesOrNoDialog: false,
    };
  }
  componentDidMount() {
    let { initForm } = this.props;
    initForm();
    // console.log(this.props.match.params.inbox, this.props.match.params.id);
    this.initData(this.props.match.params.id, this.props.match.params.inbox);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id || this.props.match.params.inbox !== nextProps.match.params.inbox) {
      // console.log(nextProps.match.params.inbox, nextProps.match.params.id);
      this.initData(nextProps.match.params.id, nextProps.match.params.inbox);
    }
  }

  getTenantId = () => {
    return localStorage.getItem('tenantId') || 'default';
  };

  initData = (id, inbox) => {
    let { setForm, setLoadingStatus } = this.props;
    // console.log('Inbox:',inbox);
    setLoadingStatus('loading');
    if (inbox) this.setState({ workflowEnabled: true });
    else this.setState({ workflowEnabled: false });
    Api.commonApiPost('/tl-services/license/v1/_search', { ids: id }, {}, false, true).then(
      function(response) {
        //TODO add try and catch block
        if (response.licenses.length > 0) {
          setLoadingStatus('hide');
          self.setState({ license: response.licenses[0] });
          setForm(response.licenses[0]);

          if (!response.licenses[0].isLegacy) {
            self.getEmployees();
            self.history();
            // console.log(response.licenses[0].applications[0].statusName);
            self.setState({ fieldInspection: false });
            if (response.licenses[0].applications[0].statusName == 'Scrutiny Completed') self.setState({ fieldInspection: true });
            else if (response.licenses[0].applications[0].statusName == 'Rejected') {
              //if workflow enabled && from inbox then enable edit mode
              var isEditMode = self.state.workflowEnabled && inbox;
              self.setState({ isEditMode });
            }

            if (response.licenses[0].applications[0].fieldInspectionReport) {
              //Get field inspection file
              Api.commonApiPost(
                'tl-services/noticedocument/v1/_search',
                {
                  applicationNumber: response.licenses[0].applicationNumber,
                  documentType: 'FIELD_INSPECTION',
                  sortBy: 'createdtime',
                },
                {},
                false,
                true
              ).then(
                function(response) {
                  // console.log(response.NoticeDocument);
                  self.setState(
                    {
                      noticeResponse: response.NoticeDocument,
                    },
                    setLoadingStatus('hide')
                  );
                },
                function(err) {
                  setLoadingStatus('hide');
                  self.handleError(err.message);
                }
              );
            }
          }
        } else {
          self.handleError(translate('tl.view.license.notexist'));
        }
      },
      function(err) {
        setLoadingStatus('hide');
        self.handleError(err.message);
      }
    );
  };

  handleError = msg => {
    let { toggleDailogAndSetText, setLoadingStatus } = this.props;
    setLoadingStatus('hide');
    toggleDailogAndSetText(true, msg);
  };

  getSupportDocumentsJsonObject = () => {
    let _this = this;
    return new Promise(function(resolve, reject) {
      let documentTypes = _this.tlForm.state.documentTypes;
      let { files, viewLicense } = _this.props;
      var supportDocuments = [];

      var uploadSupportDocuments = files.filter(field => field.files.length > 0) || [];
      var existingSupportDocuments = _.remove(uploadSupportDocuments, function(field) {
        return field.files[0].fileStoreId;
      });

      let findExistingDoc = documentTypeId => {
        return viewLicense.applications
          .find(application => application.applicationType === 'NEW')
          .supportDocuments.find(doc => doc.documentTypeId === documentTypeId);
      };

      for (let i = 0; i < existingSupportDocuments.length; i++) {
        let fileField = existingSupportDocuments[i];
        // let documentType = documentTypes.find((doc)=>doc.id === fileField.code);
        let existingDoc = findExistingDoc(fileField.code);
        existingDoc['comments'] = viewLicense[`${fileField.code}_comments`];
        supportDocuments.push(existingDoc);
      }

      if (uploadSupportDocuments && uploadSupportDocuments.length > 0) {
        let formData = new FormData();
        formData.append('tenantId', localStorage.getItem('tenantId'));
        formData.append('module', constants.TRADE_LICENSE_FILE_TAG);
        uploadSupportDocuments.map((field, index) => {
          field.files.map(file => {
            formData.append('file', file);
          });
        });

        Api.commonApiPost('/filestore/v1/files', {}, formData).then(
          function(response) {
            response.files.map((file, index) => {
              let fileField = uploadSupportDocuments[index];
              let documentType = documentTypes.find(doc => doc.id === fileField.code);
              let existingDoc = findExistingDoc(fileField.code);
              let doc = {};

              if (existingDoc) {
                doc = { ...existingDoc };
                doc['fileStoreId'] = file.fileStoreId;
                doc['comments'] = viewLicense[`${fileField.code}_comments`];
              } else {
                doc['id'] = null;
                doc['applicationId'] = null;
                doc['documentTypeId'] = fileField.code;
                doc['fileStoreId'] = file.fileStoreId;
                doc['tenantId'] = _this.getTenantId();
                doc['comments'] = viewLicense[`${fileField.code}_comments`];
                doc['auditDetails'] = documentType.auditDetails;
                doc['documentTypeName'] = documentType.name;
              }

              supportDocuments.push(doc);
            });
            resolve(supportDocuments);
          },
          function(err) {
            console.log(err);
            reject(err);
          }
        );
      } else {
        resolve(supportDocuments);
      }
    });
  };

  cancelTradeLicenseConfirmPromise = () => {
    let _self = this;
    return new Promise(function(resolve, reject) {
      let handleNo = function() {
        reject();
      };
      let handleYes = function() {
        resolve();
      };
      _self.setState({ showYesOrNoDialog: true, handleYes, handleNo });
    });
  };

  noticeGenerationErrorHandle = error => {
    this.setState({ isPrintCertificate: false });
    this.handleError(error);
  };

  rejectionLetterErrorHandle = error => {
    this.setState({ isRejectionLetterShow: false });
    this.handleError(error);
  };

  ceritificateSuccessHandle = () => {
    let printCertificateStateValues = this.state.printCertificateStateValues;
    this.setState({
      printCertificateStateValues: {
        ...printCertificateStateValues,
        isProceedToPrintCertificate: true,
      },
    });
    this.updateWorkFlow(this.state.printCertificateStateValues.item, this.state.printCertificateStateValues.state);
  };

  rejectionLetterSuccessHandle = () => {
    let rejectionLetterStateValues = {
      ...this.state.rejectionLetterStateValues,
    };
    this.setState({
      rejectionLetterStateValues: {
        ...rejectionLetterStateValues,
        isProceedToRejection: true,
      },
    });
    this.updateWorkFlow(this.state.rejectionLetterStateValues.item, this.state.rejectionLetterStateValues.state);
  };

  renderFeeDetails = () => {
    let { viewLicense } = this.props;
    if (viewLicense.applications && viewLicense.applications[0].feeDetails && viewLicense.applications[0].feeDetails.length > 0) {
      return (
        <div>
          <Card>
            <CardHeader
              style={{ paddingBottom: 0 }}
              title={<div style={styles.headerStyle}>{translate('tl.create.licenses.groups.FeeDetails')}</div>}
            />
            <CardText style={{ padding: '8px 16px 0' }}>
              <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <TableRow>
                    <TableHeaderColumn>{translate('tl.create.license.table.financialYear')}</TableHeaderColumn>
                    <TableHeaderColumn>{translate('tl.create.license.table.amountoptional')}</TableHeaderColumn>
                    <TableHeaderColumn>{translate('tl.create.license.table.paid')}</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  {viewLicense.applications[0].feeDetails.map((fee, index) => {
                    return (
                      <TableRow selectable={false} key={index}>
                        <TableRowColumn>{fee.financialYear}</TableRowColumn>
                        <TableRowColumn style={{ textAlign: 'right' }}>{fee.amount}</TableRowColumn>
                        <TableRowColumn>{fee.paid ? 'Yes' : 'No'}</TableRowColumn>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardText>
          </Card>
          <br />
        </div>
      );
    }
  };
  renderLicenseObj = () => {
    let { viewLicense } = this.props;
    return (
      viewLicense.licenseData &&
      Object.keys(viewLicense.licenseData).map(function(key, index) {
        return (
          <Col xs={12} sm={6} md={4} lg={3}>
            <ListItem primaryText={key} secondaryText={<p style={styles.customColumnStyle}>{viewLicense.licenseData[key].toString()}</p>} />
          </Col>
        );
      })
    );
  };
  supportDocuments = () => {
    let { viewLicense } = this.props;
    if (viewLicense.applications && viewLicense.applications[0].supportDocuments && viewLicense.applications[0].supportDocuments.length > 0) {
      return (
        <div>
          <Card>
            <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}>{translate('tl.table.title.supportDocuments')}</div>} />
            <CardText style={{ padding: '8px 16px 0' }}>
              <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <TableRow>
                    <TableHeaderColumn>#</TableHeaderColumn>
                    <TableHeaderColumn>{translate('tl.create.license.table.documentName')}</TableHeaderColumn>
                    <TableHeaderColumn>{translate('tl.create.license.table.comments')}</TableHeaderColumn>
                    <TableHeaderColumn>{translate('tl.create.license.table.file')}</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  {viewLicense.applications[0].supportDocuments.map((docs, index) => {
                    return (
                      <TableRow selectable={false} key={index}>
                        <TableRowColumn>{index + 1}</TableRowColumn>
                        <TableRowColumn>{docs.documentTypeName}</TableRowColumn>
                        <TableRowColumn>{docs.comments}</TableRowColumn>
                        <TableRowColumn>
                          <a
                            href={'/filestore/v1/files/id?fileStoreId=' + docs.fileStoreId + '&tenantId=' + localStorage.getItem('tenantId')}
                            download
                          >
                            Download
                          </a>
                        </TableRowColumn>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardText>
          </Card>
          <br />
        </div>
      );
    }
  };
  getEmployees = () => {
    Api.commonApiPost('hr-employee/employees/_search').then(
      response => {
        self.setState({ employees: response.Employee });
      },
      function(err) {
        self.handleError(err.message);
      }
    );
  };
  history = () => {
    let { viewLicense } = this.props;
    if (Object.keys(viewLicense).length && viewLicense.applications[0].state_id) {
      Api.commonApiPost('egov-common-workflows/history', { workflowId: viewLicense.applications[0].state_id }, {}, false, true).then(
        response => {
          // console.log(response);
          self.setState({ tasks: response.tasks });
        },
        function(err) {
          self.handleError(err.message);
        }
      );
    }
  };
  showHistory = () => {
    if (this.state.tasks && this.state.employees && this.state.tasks.length > 0) {
      return (
        <div>
          <Card>
            <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}>{translate('tl.view.workflow.history.title')}</div>} />
            <CardText style={{ padding: '8px 16px 0' }}>
              <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <TableRow>
                    <TableHeaderColumn style={styles.customColumnStyle}>{translate('tl.view.workflow.history.date')}</TableHeaderColumn>
                    <TableHeaderColumn style={styles.customColumnStyle} className="hidden-xs">
                      {translate('tl.view.workflow.history.updatedby')}
                    </TableHeaderColumn>
                    <TableHeaderColumn style={styles.customColumnStyle}>{translate('tl.view.workflow.history.status')}</TableHeaderColumn>
                    <TableHeaderColumn style={styles.customColumnStyle}>{translate('tl.view.workflow.history.currentowner')}</TableHeaderColumn>
                    <TableHeaderColumn style={styles.customColumnStyle}>{translate('tl.view.workflow.history.comments')}</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  {this.state.tasks.map((task, index) => {
                    let userObj = this.state.employees.find(x => x.assignments[0].position === task.owner.id);
                    return (
                      <TableRow selectable={false} key={index}>
                        <TableRowColumn style={styles.customColumnStyle}>{task.lastupdatedSince}</TableRowColumn>
                        <TableRowColumn style={styles.customColumnStyle} className="hidden-xs">
                          {task.senderName}
                        </TableRowColumn>
                        <TableRowColumn style={styles.customColumnStyle}>
                          {task.status} {task.action ? ` - ${task.action}` : ''}
                        </TableRowColumn>
                        <TableRowColumn style={styles.customColumnStyle}>{userObj ? userObj.name : ''}</TableRowColumn>
                        <TableRowColumn style={styles.customColumnStyle}>{task.comments}</TableRowColumn>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardText>
          </Card>
          <br />
        </div>
      );
    }
  };
  fieldInspection = () => {
    let { viewLicense } = this.props;
    // console.log('field inspection:', this.state.fieldInspection);
    if (viewLicense.applications && this.state.fieldInspection) {
      return (
        <div>
          <Card>
            <CardHeader style={styles.cardHeaderPadding} title={<div style={styles.headerStyle}>{translate('tl.view.fieldInspection.title')}</div>} />
            <CardText style={styles.cardTextPadding}>
              <Row>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFixed={true}
                    floatingLabelText={
                      <span>
                        {translate('tl.create.licenses.groups.TradeDetails.tradeValueForUOM')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    value={viewLicense.quantity ? viewLicense.quantity : ''}
                    id="quantity"
                    errorText={this.props.fieldErrors.quantity ? this.props.fieldErrors.quantity : ''}
                    maxLength="13"
                    onChange={(event, value) =>
                      this.props.handleChange(value, 'quantity', false, /^\d{0,10}(\.\d{1,2})?$/, translate('error.license.number.decimal'))
                    }
                  />
                </Col>
                <Col xs={12} sm={6} md={4} lg={6}>
                  <TextField
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFixed={true}
                    floatingLabelText={
                      <span>
                        {translate('tl.view.fieldInspection.fieldInspectionreport')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    multiLine={true}
                    id="fieldInspectionreport"
                    value={viewLicense.fieldInspectionReport ? viewLicense.fieldInspectionReport : ''}
                    maxLength="500"
                    onChange={(event, value) => this.props.handleChange(value, 'fieldInspectionReport', false, /^.[^]{0,500}$/)}
                  />
                </Col>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <div>&nbsp;&nbsp;&nbsp;</div>
                  <FileInput id="inspectionfile" fileInputOnChange={this.fileInputOnChange} file={this.props.files[0]} label="Upload File" />
                </Col>
              </Row>
            </CardText>
          </Card>
          <br />
        </div>
      );
    }
  };
  fileInputOnChange = (e, doc) => {
    e.preventDefault();
    var files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    if (!files) return;

    //validate file input
    let validationResult = validate_fileupload(files, constants.TRADE_LICENSE_FILE_FORMATS_ALLOWED);

    // console.log('validationResult', validationResult);
    //
    if (typeof validationResult === 'string' || !validationResult) {
      this.props.toggleDailogAndSetText(true, validationResult);
      return;
    }

    var existingFile = this.props.files ? this.props.files.find(file => file.code == 'FIELD_INSPECTION') : undefined;
    if (existingFile && existingFile.files && existingFile.files.length > 0) {
      this.props.removeFile({
        isRequired: false,
        code: 'FIELD_INSPECTION',
        name: existingFile.files[0].name,
      });
    }
    this.props.addFile({
      isRequired: false,
      code: 'FIELD_INSPECTION',
      files: [...files],
    });
  };
  collection = () => {
    let { viewLicense } = this.props;
    let userRequest = JSON.parse(localStorage.getItem('userRequest'));
    // console.log(JSON.stringify(userRequest.roles));
    let roleObj = userRequest ? userRequest.roles.find(role => role.name === 'Collection Operator') : '';
    //console.log('ROLE ---------->', 'Collection Operator',userRequest.roles);
    if (
      !viewLicense.isLegacy &&
      this.state.workflowEnabled &&
      viewLicense.applications &&
      viewLicense.applications[0].state_id &&
      roleObj &&
      (viewLicense.applications[0].statusName == 'Final approval Completed' || viewLicense.applications[0].statusName == 'Acknowledged')
    ) {
      let status = viewLicense.applications[0].statusName;
      return (
        <div className="text-center">
          {status == 'Acknowledged' ? (
            <RaisedButton
              label={translate('tl.view.collect.application.fee')}
              primary={true}
              onClick={e => {
                this.props.setRoute('/transaction/collection/collection/TLAPPLNFEE/' + encodeURIComponent(viewLicense.applicationNumber));
              }}
            />
          ) : (
            <RaisedButton
              label={translate('tl.view.collect.license.fee')}
              primary={true}
              onClick={e => {
                this.props.setRoute('/transaction/collection/collection/TRADELICENSE/' + encodeURIComponent(viewLicense.applicationNumber));
              }}
            />
          )}
        </div>
      );
    }
  };
  updateWorkFlow = (item, state) => {
    // console.log('came to workflow');
    let { setLoadingStatus, viewLicense } = this.props;
    if ((item.key === 'Reject' || item.key === 'Cancel') && (state.approvalComments === undefined || !state.approvalComments.trim())) {
      self.handleError(`${translate('tl.view.workflow.comments.mandatory') + item.key}`);
      return;
    }

    //Rejection Letter
    if (item.key === 'Cancel' && !this.state.rejectionLetterStateValues.isProceedToRejection) {
      //Cancel Confirm Dialog
      this.cancelTradeLicenseConfirmPromise().then(
        () => {
          //Pressed yes
          self.setState({
            showYesOrNoDialog: false,
            isRejectionLetterShow: true,
            rejectionLetterStateValues: { item, state },
          });
        },
        () => {
          //Pressed No
          self.setState({ showYesOrNoDialog: false });
        }
      );
      return;
    }

    //Print Certificate
    if (item.key === 'Print Certificate' && !this.state.printCertificateStateValues.isProceedToPrintCertificate) {
      this.setState({
        isPrintCertificate: true,
        printCertificateStateValues: { item, state },
      });
      return;
    }

    // console.log(!state.departmentId, !state.designationId, !state.positionId);
    if (item.key === 'Forward' || item.key === 'Submit') {
      if (this.state.fieldInspection) {
        // console.log(viewLicense.quantity, viewLicense.fieldInspectionReport);
        if (viewLicense.quantity === undefined || !viewLicense.quantity.toString().trim()) {
          self.handleError(translate('tl.view.licenses.groups.TradeValuefortheUOM.mandatory'));
          return;
        } else if (viewLicense.fieldInspectionReport === undefined || !viewLicense.fieldInspectionReport.trim()) {
          self.handleError(translate('tl.view.fieldInspection.fieldInspectionreport.mandatory'));
          return;
        }
      }
      //validate pattern for UOM
      var pattern = /^\d{0,10}(\.\d{1,2})?$/;
      if (this.state.fieldInspection && viewLicense.quantity) {
        if (pattern.test(viewLicense.quantity)) {
          // console.log('pattern passed for quantity');
        } else {
          self.handleError(`${translate('tl.view.licenses.groups.TradeValuefortheUOM') + ' - ' + translate('error.license.number.decimal')}`);
          return;
        }
      }
      if (!state.departmentId || !state.designationId || !state.positionId) {
        if (!state.departmentId) self.handleError(translate('tl.view.workflow.department.mandatory'));
        else if (!state.designationId) self.handleError(translate('tl.view.workflow.designation.mandatory'));
        else self.handleError(translate('tl.view.workflow.approver.mandatory'));
        return;
      }
    }

    if (this.state.isEditMode && item.key === 'Forward' && !this.state.isEditModeReadyForSubmission) {
      setLoadingStatus('loading');
      this.getSupportDocumentsJsonObject().then(
        supportDocuments => {
          this.setState({
            supportDocuments,
            isEditModeReadyForSubmission: true,
          });
          this.updateWorkFlow(item, state);
        },
        err => {
          setLoadingStatus('hide');
          //error
          this.handleError(err);
        }
      );
      return;
    }

    setLoadingStatus('loading');
    let departmentObj = state.workFlowDepartment.find(x => x.id === state.departmentId);
    let designationObj = state.workFlowDesignation.find(x => x.id === state.designationId);
    // console.log('update the workflow:', this.state.departmentId, this.state.designationId, this.state.positionId, this.state.approvalComments);
    let workFlowDetails = {
      department: departmentObj ? departmentObj.name : null,
      designation: designationObj ? designationObj.name : null,
      assignee: state.positionId ? state.positionId.split('~')[0] : item.key === 'Approve' ? state.process.initiatorPosition : null,
      action: item.key,
      status: state.process.status,
      comments: state.approvalComments || '',
      senderName: '',
      details: '',
      stateId: state.stateId,
    };
    // console.log('Workflow details from response:',this.state.obj.applications[0].workFlowDetails);
    let finalObj =
      (this.state.isEditMode || this.state.fieldInspection) && item.key === 'Forward' ? { ...this.props.viewLicense } : { ...this.state.license };

    finalObj['adhaarNumber'] = finalObj['adhaarNumber'] || null;
    finalObj['propertyAssesmentNo'] = finalObj['propertyAssesmentNo'] || null;
    finalObj['remarks'] = finalObj['remarks'] || null;
    finalObj['application'] = finalObj.applications[0];

    if (this.state.isEditMode && item.key === 'Forward') {
      finalObj['application']['supportDocuments'] = this.state.supportDocuments;
      finalObj['tradeCommencementDate'] = dateToEpoch(finalObj.tradeCommencementDate);
      finalObj['agreementDate'] = finalObj.agreementDate ? dateToEpoch(finalObj.agreementDate) : null;
    }

    if (this.state.fieldInspection && item.key !== 'Reject') {
      finalObj['application']['fieldInspectionReport'] = viewLicense.fieldInspectionReport;
    }

    finalObj['application']['workFlowDetails'] = workFlowDetails;

    delete finalObj['applications'];
    delete finalObj['departmentId'];
    delete finalObj['designationId'];
    delete finalObj['positionId'];
    delete finalObj['approvalComments'];
    delete finalObj['fieldInspectionReport'];

    let finalArray = [];
    finalArray.push(finalObj);
    // console.log('updated copied response:', JSON.stringify(finalArray));
    Api.commonApiPost('tl-services/license/v1/_update', {}, { licenses: finalArray }, false, true).then(
      function(response) {
        //update workflow
        var message;
        if (item.key === 'Forward' || item.key === 'Submit') {
          message = `License updated successfully and forwarded to ${state.positionId.split('~')[1]} - ${designationObj.name}`;
        } else if (item.key === 'Reject' || item.key === 'Cancel') {
          message = `License ${item.key}ed successfully`;
        } else if (item.key === 'Approve') {
          message = `License ${item.key}d successfully`;
        }
        //notice documents upload
        let FI = self.props.files.find(file => file.code === 'FIELD_INSPECTION');
        // console.log(viewLicense.applications[0].statusName);
        if (!_.isEmpty(FI) && viewLicense.applications[0].statusName === 'Scrutiny Completed') {
          // console.log(FI, FI.files[0]);
          let formData = new FormData();
          formData.append('tenantId', localStorage.getItem('tenantId'));
          formData.append('module', 'TL');
          formData.append('file', FI.files[0]);
          // console.log(formData);
          Api.commonApiPost('/filestore/v1/files', {}, formData).then(
            function(response) {
              var noticearray = [];
              var noticeObj = {};
              noticeObj['licenseId'] = finalArray[0].id;
              noticeObj['tenantId'] = localStorage.getItem('tenantId');
              noticeObj['documentName'] = 'FIELD_INSPECTION';
              noticeObj['fileStoreId'] = response.files[0].fileStoreId;
              noticearray.push(noticeObj);
              Api.commonApiPost('tl-services/noticedocument/v1/_create', {}, { NoticeDocument: noticearray }, false, true).then(
                function(response) {
                  setLoadingStatus('hide');
                  self.setState({ updatedmessage: message });
                  self.handleOpen();
                },
                function(err) {
                  setLoadingStatus('hide');
                  self.handleError(err.message);
                }
              );
            },
            function(err) {
              setLoadingStatus('hide');
              self.handleError(err.message);
            }
          );
        } else {
          setLoadingStatus('hide');
          self.setState({ updatedmessage: message });
          if (!self.state.isPrintCertificate) self.handleOpen();
        }
      },
      function(err) {
        setLoadingStatus('hide');
        self.setState({ isEditModeReadyForSubmission: false });
        self.handleError(err.message);
      }
    );
  };
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    let { viewLicense, setRoute } = this.props;
    this.setState({ open: false, isEditMode: false });
    setRoute('/non-framework/tl/transaction/viewLicense/' + viewLicense.id);
  };
  render() {
    self = this;
    let { handleError } = this;
    let { viewLicense, fieldErrors, isFormValid, handleChange } = this.props;

    let tlFormEditOrViewMode;
    let supportDocumentsViewMode;

    const actions = [<FlatButton label={translate('core.lbl.ok')} primary={true} onClick={this.handleClose} />];

    if (this.state.isPrintCertificate) {
      return (
        <ViewPrintCertificate
          license={this.props.viewLicense}
          successCallback={this.ceritificateSuccessHandle}
          errorCallback={this.noticeGenerationErrorHandle}
        />
      );
    } else if (this.state.isRejectionLetterShow) {
      return (
        <ViewRejectionLetter
          ref="rejectionLetter"
          license={this.props.viewLicense}
          successCallback={this.rejectionLetterSuccessHandle}
          errorCallback={this.rejectionLetterErrorHandle}
        />
      );
    }

    if (!this.state.isEditMode) {
      supportDocumentsViewMode = this.supportDocuments();

      tlFormEditOrViewMode = (
        <div>
          <Card>
            <CardHeader
              style={styles.cardHeaderPadding}
              title={<div style={styles.headerStyle}>{translate('tl.create.licenses.groups.TradeOwnerDetails')}</div>}
            />
            <CardText style={styles.cardTextPadding}>
              <List style={styles.zeroPadding}>
                <Row>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeOwnerDetails.AadharNumber')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.adhaarNumber ? viewLicense.adhaarNumber : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeOwnerDetails.Mobile Number')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.mobileNumber ? viewLicense.mobileNumber : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeOwnerDetails.TradeOwnerName')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.ownerName ? viewLicense.ownerName : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeOwnerDetails.gender')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.ownerGender ? viewLicense.ownerGender : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeOwnerDetails.FatherSpouseName')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.fatherSpouseName ? viewLicense.fatherSpouseName : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.TradeOwnerDetails.groups.EmailID')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.emailId ? viewLicense.emailId : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeOwnerDetails.TradeOwnerAddress')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.ownerAddress ? viewLicense.ownerAddress : 'N/A'}</p>}
                    />
                  </Col>
                </Row>
              </List>
            </CardText>
          </Card>
          <br />
          <Card>
            <CardHeader
              style={styles.cardHeaderPadding}
              title={<div style={styles.headerStyle}>{translate('tl.create.licenses.groups.TradeLocationDetails')}</div>}
            />
            <CardText style={styles.cardTextPadding}>
              <List style={styles.zeroPadding}>
                <Row>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeLocationDetails.PropertyAssessmentNo')}
                      secondaryText={
                        <p style={styles.customColumnStyle}>{viewLicense.propertyAssesmentNo ? viewLicense.propertyAssesmentNo : 'N/A'}</p>
                      }
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeLocationDetails.Locality')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.localityName ? viewLicense.localityName : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeLocationDetails.adminWardId')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.adminWardName ? viewLicense.adminWardName : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeLocationDetails.revenueWardId')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.revenueWardName ? viewLicense.revenueWardName : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeLocationDetails.OwnershipType')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.ownerShipType ? viewLicense.ownerShipType : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeLocationDetails.TradeAddress')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.tradeAddress ? viewLicense.tradeAddress : 'N/A'}</p>}
                    />
                  </Col>
                </Row>
              </List>
            </CardText>
          </Card>
          <br />
          <Card>
            <CardHeader
              style={styles.cardHeaderPadding}
              title={<div style={styles.headerStyle}>{translate('tl.create.licenses.groups.TradeDetails')}</div>}
            />
            <CardText style={styles.cardTextPadding}>
              <List style={styles.zeroPadding}>
                <Row>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeDetails.TradeTitle')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.tradeTitle ? viewLicense.tradeTitle : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeDetails.TradeType')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.tradeType ? viewLicense.tradeType : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeDetails.TradeCategory')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.category ? viewLicense.category : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeDetails.TradeSubCategory')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.subCategory ? viewLicense.subCategory : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeDetails.UOM')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.uom ? viewLicense.uom : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeDetails.tradeValueForUOM')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.quantity ? viewLicense.quantity : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.validity')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.validityYears ? viewLicense.validityYears : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeDetails.Remarks')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.remarks ? viewLicense.remarks : 'N/A'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.create.licenses.groups.TradeDetails.TradeCommencementDate')}
                      secondaryText={
                        <p style={styles.customColumnStyle}>
                          {viewLicense.tradeCommencementDate ? epochToDate(viewLicense.tradeCommencementDate) : 'N/A'}
                        </p>
                      }
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('License valid from Date')}
                      secondaryText={
                        <p style={styles.customColumnStyle}>
                          {viewLicense.licenseValidFromDate ? epochToDate(viewLicense.licenseValidFromDate) : 'N/A'}
                        </p>
                      }
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('License Expiry Date')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.expiryDate ? epochToDate(viewLicense.expiryDate) : 'N/A'}</p>}
                    />
                  </Col>
                  {viewLicense.isLegacy ? this.renderLicenseObj() : ''}
                </Row>
              </List>
            </CardText>
          </Card>
          {viewLicense.isPropertyOwner ? <br /> : null}
          {viewLicense.isPropertyOwner ? (
            <Card>
              <CardHeader
                style={styles.cardHeaderPadding}
                title={<div style={styles.headerStyle}>{translate('tl.view.licenses.groups.agreementDetails')}</div>}
              />
              <CardText style={styles.cardTextPadding}>
                <List style={styles.zeroPadding}>
                  <Row>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <ListItem
                        primaryText={translate('tl.create.licenses.groups.agreementDetails.agreementDate')}
                        secondaryText={
                          <p style={styles.customColumnStyle}>{viewLicense.agreementDate ? epochToDate(viewLicense.agreementDate) : 'N/A'}</p>
                        }
                      />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <ListItem
                        primaryText={translate('tl.create.licenses.groups.agreementDetails.agreementNo')}
                        secondaryText={<p style={styles.customColumnStyle}>{viewLicense.agreementNo ? viewLicense.agreementNo : 'N/A'}</p>}
                      />
                    </Col>
                  </Row>
                </List>
              </CardText>
            </Card>
          ) : (
            ''
          )}
        </div>
      );
    } else {
      tlFormEditOrViewMode = (
        <NewTradeLicenseForm
          ref={tlForm => {
            this.tlForm = tlForm;
          }}
          hasDefaultFormData={true}
          form={this.props.viewLicense}
          {...this.props}
        />
      );
    }

    return (
      <Grid fluid={true}>
        <h3 className="text-center">
          {viewLicense.isLegacy
            ? translate('tl.view.groups.title')
            : this.state.workflowEnabled ? translate('tl.view.trade.title') : translate('tl.view.groups.title')}
        </h3>

        <Card>
          <CardHeader style={styles.cardHeaderPadding} title={<div style={styles.headerStyle}>{translate('applicantDetails.title')}</div>} />
          <CardText style={styles.cardTextPadding}>
            <List style={styles.zeroPadding}>
              <Row>
                {!viewLicense.isLegacy ? (
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.search.result.groups.applicationNumber')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.applicationNumber}</p>}
                    />
                  </Col>
                ) : (
                  ''
                )}
                {!viewLicense.isLegacy ? (
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.search.groups.applicationStatus')}
                      secondaryText={
                        <p style={styles.customColumnStyle}>
                          {viewLicense.applications && viewLicense.applications[0].statusName ? viewLicense.applications[0].statusName : 'N/A'}
                        </p>
                      }
                    />
                  </Col>
                ) : (
                  ''
                )}
                {!viewLicense.isLegacy ? (
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.search.result.groups.applicationDate')}
                      secondaryText={<p style={styles.customColumnStyle}>{epochToDate(viewLicense.applicationDate)}</p>}
                    />
                  </Col>
                ) : (
                  ''
                )}
                <Col xs={12} sm={6} md={4} lg={3}>
                  <ListItem
                    primaryText={translate('tl.search.groups.licenseNumber')}
                    secondaryText={<p style={styles.customColumnStyle}>{viewLicense.licenseNumber ? viewLicense.licenseNumber : 'N/A'}</p>}
                  />
                </Col>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <ListItem
                    primaryText={translate('tl.search.groups.status')}
                    secondaryText={<p style={styles.customColumnStyle}>{viewLicense.statusName ? viewLicense.statusName : 'N/A'}</p>}
                  />
                </Col>
                {viewLicense.isLegacy ? (
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('tl.search.groups.oldLicenseNumber')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewLicense.oldLicenseNumber ? viewLicense.oldLicenseNumber : 'N/A'}</p>}
                    />
                  </Col>
                ) : (
                  ''
                )}
              </Row>
            </List>
          </CardText>
        </Card>

        <br />
        {tlFormEditOrViewMode}

        <br />

        {viewLicense.isLegacy ? this.renderFeeDetails() : ''}
        {supportDocumentsViewMode}

        {!viewLicense.isLegacy && viewLicense.applications && viewLicense.applications[0].fieldInspectionReport ? (
          <div>
            <Card>
              <CardHeader
                style={styles.cardHeaderPadding}
                title={<div style={styles.headerStyle}>{translate('tl.view.fieldInspection.title')}</div>}
              />
              <CardText style={styles.cardTextPadding}>
                <List style={styles.zeroPadding}>
                  <Row>
                    <Col xs={12} sm={4} md={3} lg={3}>
                      <ListItem
                        primaryText={translate('tl.view.fieldInspection.fieldInspectionreport')}
                        secondaryText={
                          <p style={styles.customColumnStyle}>
                            {viewLicense.applications[0].fieldInspectionReport ? viewLicense.applications[0].fieldInspectionReport : 'N/A'}
                          </p>
                        }
                      />
                    </Col>
                    {this.state.noticeResponse &&
                      this.state.noticeResponse.map((notice, index) => (
                        <Col xs={12} sm={4} md={3} lg={3} key={index}>
                          <ListItem
                            primaryText={translate('Document')}
                            secondaryText={
                              <p style={styles.customColumnStyle}>
                                <a
                                  href={'/filestore/v1/files/id?fileStoreId=' + notice.fileStoreId + '&tenantId=' + localStorage.getItem('tenantId')}
                                  download
                                >
                                  File {index + 1}
                                </a>
                              </p>
                            }
                          />
                        </Col>
                      ))}
                  </Row>
                </List>
              </CardText>
            </Card>
            <br />{' '}
          </div>
        ) : (
          ''
        )}

        {!viewLicense.isLegacy ? this.showHistory() : ''}
        {!viewLicense.isLegacy && this.state.workflowEnabled && this.state.fieldInspection ? this.fieldInspection() : ''}
        {!viewLicense.isLegacy &&
        this.state.workflowEnabled &&
        viewLicense.applications &&
        viewLicense.applications[0].state_id &&
        viewLicense.applications[0].statusName != 'Acknowledged' &&
        viewLicense.applications[0].statusName != 'Final approval Completed' &&
        viewLicense.applications[0].statusName != 'License Issued' ? (
          <div>
            <Card>
              <CardHeader style={styles.cardHeaderPadding} title={<div style={styles.headerStyle}>{translate('tl.view.workflow.title')}</div>} />
              <CardText style={styles.cardTextPadding}>
                <WorkFlow
                  viewLicense={viewLicense}
                  isFormValid={this.props.isFormValid}
                  handleChange={handleChange}
                  handleError={handleError}
                  setLoadingStatus={this.props.setLoadingStatus}
                  updateWorkFlow={this.updateWorkFlow}
                />
              </CardText>
            </Card>
            <br />
          </div>
        ) : (
          ''
        )}
        {this.collection()}
        <Dialog title={translate('tl.view.success')} actions={actions} modal={true} open={this.state.open}>
          {this.state.updatedmessage}
        </Dialog>

        <YesOrNoDialog
          msg={translate('tl.cancel.confirm.msg')}
          show={this.state.showYesOrNoDialog}
          yesBtnTxt={translate('tl.cancel.confirm.yes')}
          noBtnTxt={translate('tl.cancel.confirm.no')}
          handleYes={this.state.handleYes || ''}
          handleNo={this.state.handleNo || ''}
        />

        {/*<div className="text-center">
            <RaisedButton style={{margin:'15px 5px'}} label="License Certificate" primary={true} onClick={(e)=>{this.generatePdf()}}/>
          </div>*/}
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state.form.form);
  return {
    viewLicense: state.form.form || {},
    files: state.form.files,
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
  ADD_MANDATORY_LATEST: (value, property, isRequired, pattern, errorMsg) => {
    dispatch({
      type: 'ADD_MANDATORY_LATEST',
      property,
      value,
      isRequired,
      pattern,
    });
  },
  REMOVE_MANDATORY_LATEST: (value, property, isRequired, pattern, errorMsg) => {
    dispatch({
      type: 'REMOVE_MANDATORY_LATEST',
      property,
      value,
      isRequired,
      pattern,
    });
  },
  toggleDailogAndSetText: (dailogState, msg) => {
    dispatch({ type: 'TOGGLE_DAILOG_AND_SET_TEXT', dailogState, msg });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  handleChange: (value, property, isRequired, pattern, errorMsg) => {
    dispatch({
      type: 'HANDLE_CHANGE',
      property,
      value,
      isRequired,
      pattern,
      errorMsg,
    });
  },
  addFile: action => {
    dispatch({
      type: 'FILE_UPLOAD_BY_CODE',
      isRequired: action.isRequired,
      code: action.code,
      files: action.files,
    });
  },
  removeFile: action => {
    dispatch({
      type: 'FILE_REMOVE_BY_CODE',
      isRequired: action.isRequired,
      code: action.code,
      name: action.name,
    });
  },
  setForm: data => {
    dispatch({
      type: 'SET_FORM',
      data,
      isFormValid: false,
      fieldErrors: {},
      files: [],
      validationData: {
        required: {
          current: [],
          required: ['departmentId', 'designationId', 'positionId'],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },
  addMandatoryFields: fields => {
    dispatch({ type: 'ADD_MANDATORY_FIELDS', fields: fields });
  },
  handleChange: (value, property, isRequired, pattern, errorMsg) => {
    dispatch({
      type: 'HANDLE_CHANGE',
      property,
      value,
      isRequired,
      pattern,
      errorMsg,
    });
  },
  addFile: action => {
    dispatch({
      type: 'FILE_UPLOAD_BY_CODE',
      isRequired: action.isRequired,
      code: action.code,
      files: action.files,
    });
  },
  removeFile: action => {
    dispatch({
      type: 'FILE_REMOVE_BY_CODE',
      isRequired: action.isRequired,
      code: action.code,
      name: action.name,
    });
  },
  toggleDailogAndSetText: (dailogState, msg) => {
    dispatch({ type: 'TOGGLE_DAILOG_AND_SET_TEXT', dailogState, msg });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
});

//export default connect(mapStateToProps, mapDispatchToProps)(viewLicense);

const viewLicense = connect(mapStateToProps, mapDispatchToProps)(ViewLicense);

export default viewLicense;
