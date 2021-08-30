import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import NewCard from '../utils/NewCard';
import SupportingDocuments from '../utils/SupportingDocuments';
import { Grid } from 'react-bootstrap';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import _ from 'lodash';
import Acknowledgement from './Acknowledgement';
import { translate, dateToEpoch } from '../../../common/common';
import Api from '../../../../api/api';
import styles from '../../../../styles/material-ui';
import NewTradeLicenseForm from './NewTradeLicenseForm';
import MsgCard from '../utils/MsgCard';
import Block from 'material-ui/svg-icons/content/block';
const constants = require('../../../common/constants');

class NewTradeLicense extends Component {
  constructor() {
    super();
    this.state = {};
  }

  getTenantId = () => {
    return localStorage.getItem('tenantId') || 'default';
  };

  getCurrentUserType = () => {
    return localStorage.getItem('type') || '';
  };

  submit = e => {
    var _this = this;
    let { setLoadingStatus } = this.props;
    setLoadingStatus('loading');

    Api.commonApiPost('/hr-employee/employees/_search', {
      id: localStorage.getItem('id'),
    }).then(
      response => {
        let assignee;
        for (var i = 0; i < response.Employee.length; i++) {
          for (var j = 0; j < response.Employee[i].assignments.length; j++) {
            if (response.Employee[i].assignments[j].isPrimary) {
              _this.renderObjToCreate(response.Employee[i].assignments[j].position);
              return;
            }
          }
        }
      },
      function(err) {
        setLoadingStatus('hide');
        _this.props.handleError(err.message);
      }
    );
  };

  getSupportDocumentsObject() {
    return this.state.documentTypes;
  }

  renderObjToCreate = assignee => {
    var _this = this;
    let { form, files, setLoadingStatus } = this.props;
    var licenseObj = {},
      licenseArray = [];
    licenseObj = { ...form };
    //adding optional fields value as undefined
    licenseObj['adhaarNumber'] = licenseObj['adhaarNumber'] || null;
    licenseObj['propertyAssesmentNo'] = licenseObj['propertyAssesmentNo'] || null;

    licenseObj['tenantId'] = localStorage.getItem('tenantId');
    licenseObj['applicationType'] = 'NEW';
    licenseObj['tradeCommencementDate'] = dateToEpoch(licenseObj.tradeCommencementDate);
    licenseObj['licenseValidFromDate'] = licenseObj.tradeCommencementDate;
    //isnotpropertyowner
    licenseObj['isPropertyOwner'] = licenseObj['isPropertyOwner'] ? licenseObj['isPropertyOwner'] : false;
    licenseObj['agreementDate'] = licenseObj.agreementDate ? dateToEpoch(licenseObj.agreementDate) : '';
    licenseObj['agreementNo'] = licenseObj.agreementNo ? licenseObj.agreementNo : '';
    licenseObj['isLegacy'] = false;
    licenseObj['active'] = true;
    licenseObj['application'] = {};
    licenseObj['application']['tenantId'] = localStorage.getItem('tenantId');
    licenseObj['application']['applicationType'] = 'NEW';
    licenseObj['application']['status'] = 4;
    licenseObj['application']['applicationDate'] = '';
    licenseObj['application']['licenseId'] = 0;
    licenseObj['application']['licenseFee'] = 0;
    licenseObj['application']['fieldInspectionReport'] = '';
    licenseObj['application']['statusName'] = 'Acknowledged';
    licenseObj['application']['workFlowDetails'] = {};
    licenseObj['application']['workFlowDetails']['department'] = null;
    licenseObj['application']['workFlowDetails']['designation'] = null;
    licenseObj['application']['workFlowDetails']['assignee'] = assignee;
    licenseObj['application']['workFlowDetails']['action'] = 'create';
    licenseObj['application']['workFlowDetails']['status  '] = 'Pending For Application processing';
    licenseObj['application']['workFlowDetails']['comments'] = '';
    let userRequest = JSON.parse(localStorage.getItem('userRequest'));
    licenseObj['application']['workFlowDetails']['senderName'] = userRequest.name;
    licenseObj['application']['workFlowDetails']['details'] = '';
    licenseObj['application']['workFlowDetails']['stateId'] = null;
    licenseObj['supportDocuments'] = [];

    var supportDocuments = [];

    //filter which file field has files
    var supportingDocuments = files ? files.filter(field => field.files.length > 0) : [];

    if (supportingDocuments && supportingDocuments.length > 0) {
      let formData = new FormData();
      formData.append('tenantId', localStorage.getItem('tenantId'));
      formData.append('module', constants.TRADE_LICENSE_FILE_TAG);
      supportingDocuments.map((field, index) => {
        field.files.map(file => {
          formData.append('file', file);
        });
      });
      Api.commonApiPost('/filestore/v1/files', {}, formData).then(
        function(response) {
          // console.log(response.files);
          response.files.map((file, index) => {
            let doc = supportingDocuments[index];
            let docs = {};
            docs['documentTypeId'] = doc.code;
            docs['fileStoreId'] = file.fileStoreId;
            docs['comments'] = form[doc.code + '_comments'];
            docs['auditDetails'] = doc.auditDetails;
            docs['documentTypeName'] = doc.name;
            supportDocuments.push(docs);
          });

          licenseObj['supportDocuments'] = supportDocuments;
          licenseArray.push(licenseObj);
          _this.createTL(licenseArray);
        },
        function(err) {
          setLoadingStatus('hide');
          _this.handleError(err.message);
        }
      );
    } else {
      licenseArray.push(licenseObj);
      _this.createTL(licenseArray);
    }
  };

  createTL = licenseArray => {
    var _this = this;
    let { setLoadingStatus } = this.props;
    Api.commonApiPost('tl-services/license/v1/_create', {}, { licenses: licenseArray }, false, true).then(
      function(response) {
        _this.getLatestLicense(response.licenses[0].id);
      },
      function(err) {
        setLoadingStatus('hide');
        _this.handleError(err.message);
      }
    );
  };

  getLatestLicense = id => {
    var self = this;
    let { setLoadingStatus } = this.props;
    let { handleError } = this;
    //set timeout
    setTimeout(function() {
      Api.commonApiPost('/tl-services/license/v1/_search', { ids: id }, {}, false, true).then(
        function(response) {
          if (response.licenses.length > 0) {
            self.setState(
              {
                showAck: true,
                licenseResponse: response.licenses[0],
              },
              setLoadingStatus('hide')
            );
          } else {
            setLoadingStatus('hide');
            handleError(translate('tl.view.license.notexist'));
          }
        },
        function(err) {
          setLoadingStatus('hide');
          handleError(err.message);
        }
      );
    }, 3000);
  };

  handleError = msg => {
    let { toggleDailogAndSetText, toggleSnackbarAndSetText } = this.props;
    toggleDailogAndSetText(true, msg);
  };

  render() {
    let { setLoadingStatus, setRoute } = this.props;

    var agreementCard = null;
    var brElement = null;

    let { isFormValid } = this.props;

    if (constants.TRADE_LICENSE_NEW_ACCESS_ROLES.indexOf(this.getCurrentUserType()) === -1) {
      return <MsgCard msg={translate('tl.msg.not.employee')} icon={<Block />} />;
    }

    if (this.state.showAck) {
      return (
        <Acknowledgement
          license={this.state.licenseResponse}
          handleError={this.handleError}
          setLoadingStatus={setLoadingStatus}
          setRoute={setRoute}
        />
      );
    }

    return (
      <Grid fluid={true}>
        <h2 className="application-title">{translate('tl.create.trade.title')}</h2>
        <NewTradeLicenseForm {...this.props} />
        <br />
        <div style={{ textAlign: 'center' }}>
          {/* <RaisedButton style={{margin:'15px 5px'}} label="Reset"/> */}
          <RaisedButton
            style={{ margin: '15px 5px' }}
            disabled={!isFormValid}
            label={translate('core.lbl.submit')}
            primary={true}
            onClick={e => this.submit()}
          />
        </div>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state.form.form);
  return {
    form: state.form.form,
    files: state.form.files,
    fieldErrors: state.form.fieldErrors,
    isFormValid: state.form.isFormValid,
  };
};

const mapDispatchToProps = dispatch => ({
  initForm: requiredArray => {
    // console.log(requiredArray);
    if (!requiredArray) requiredArray = [];

    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: requiredArray,
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
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
});

const VisibleNewTradeLicense = connect(mapStateToProps, mapDispatchToProps)(NewTradeLicense);

export default VisibleNewTradeLicense;
