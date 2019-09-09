import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import { brown500, red500, white, orange800 } from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Fields from '../../common/Fields';
import Api from '../../../api/api';
import { translate, validate_fileupload } from '../../common/common';
import FormSection from './FormSection';
import _ from 'lodash';
const constants = require('../../common/constants');

class NewServiceRequest extends Component {
  constructor() {
    super();
    this.prepareAndSubmitRequest = this.prepareAndSubmitRequest.bind(this);
    this.state = {
      ack: '',
      openDialog: false,
    };
  }

  handleOpen = () => {
    this.setState({ openDialog: true });
  };

  handleRefresh = () => {
    this.setState({ openDialog: false });
    window.location.reload();
  };

  isGroupExists = (groupCode, groupsArray) => {
    return groupsArray.find(group => group.code === groupCode);
  };

  extractRequiredFieldsFromAttribValues = objArry => {
    let requiredFields = [];
    objArry.map(obj => {
      obj.attribValues.map(attribValue => {
        if (attribValue.required) requiredFields.push(attribValue.key);
      });
    });
    return requiredFields;
  };

  fieldGrouping = response => {
    let userType = localStorage.getItem('type');

    /*response.attributes=[{
        variable:true,
        code:"firstName",
        dataType:"string",
        description:'core.lbl.add.name',
        required:true,
        groupCode:null,
        roles:[],
        actions:[],
        constraints:null,
        attribValues:[]
      },
      {
        variable:true,
        code:"phone",
        dataType:"integer",
        description:'core.lbl.mobilenumber',
        required:true,
        groupCode:null,
        roles:[],
        actions:[],
        constraints:null,
        attribValues:[]
      },
      {
        variable:true,
        code:"email",
        dataType:"string",
        description:'core.lbl.email.compulsory',
        required:false,
        groupCode:null,
        roles:[],
        actions:[],
        constraints:null,
        attribValues:[]
      }, ...response.attributes];*/

    //Filter form fields based on current role and action
    /*let formFields = response.attributes.filter((field) => (field.roles.indexOf(userType) > -1
                      && field.actions.indexOf(STATUS_NEW) > -1) ||
                      (field.roles.length == 0 && field.actions.length ==0) ||
                      (field.roles.length == 0 > -1 && field.actions.indexOf(STATUS_NEW) > -1) ||
                      (field.roles.indexOf(userType) > -1 && field.actions.length ==0));*/

    //grouping fields based on order property
    let fieldsGroupByOrder = _.groupBy(response.attributes, function(attribute) {
      return attribute.order;
    });

    let fieldsSortedByOrder = [];
    Object.keys(fieldsGroupByOrder).map(key => {
      fieldsGroupByOrder[key].map(field => {
        fieldsSortedByOrder.push(field);
      });
    });

    let formFields = fieldsSortedByOrder.filter(
      field => field.variable && field.code != constants.CITIZEN_SERVICES_CHECKLIST_CODE && field.code != constants.CITIZEN_SERVICES_DOCUMENTS_CODE
    );

    let checkLists = fieldsSortedByOrder.filter(field => field.code === constants.CITIZEN_SERVICES_CHECKLIST_CODE);

    let documents = fieldsSortedByOrder.filter(field => field.code === constants.CITIZEN_SERVICES_DOCUMENTS_CODE);

    let formSections = [];

    //pushing custom fields
    if (formFields && formFields.length > 0) {
      formSections.push({ fields: formFields });
    }
    //pushing checklists
    if (checkLists && checkLists.length > 0) {
      formSections.push({
        fields: checkLists,
        name: constants.LABEL_CHECKLIST,
      });
    }
    //pushing documents
    if (documents && documents.length > 0) {
      formSections.push({ fields: documents, name: constants.LABEL_DOCUMENTS });
    }

    let requiredFields = [
      ...formFields.filter(field => field.required),
      ...this.extractRequiredFieldsFromAttribValues(checkLists),
      ...this.extractRequiredFieldsFromAttribValues(documents),
    ];

    this.props.initForm(requiredFields);

    this.setState({
      formSections,
    });

    //Basic fields with out any groups
    /*let commonFields = formFields.filter((field) => !field.groupCode ||
                         !this.isGroupExists(field.groupCode, response.groups));

      let formSections = [{fields : commonFields}];

      let requiredFields = [commonFields.map((field)=> field.code)];

      this.props.initForm(requiredFields);

      response.groups.map((group)=>{
         let fields = formFields.filter((field) => field.groupCode == group.code);

         let constraintObj = group.constraints.find((constraint) => constraint.action == STATUS_NEW
                       && constraint.role == userType);

         let constraint = "";

        if(constraintObj){
          constraint = constraintObj.constraint;
        }

        if(fields.length > 0){
            formSections.push({
              ...group,
              constraint,
              fields
            });
        }
      });*/
  };

  renderFormSection = () => {
    if (this.state.formSections && this.state.formSections.length > 0) {
      return this.state.formSections.map((section, index) => {
        return (
          <FormSection
            key={index}
            fields={section.fields}
            name={section.name}
            values={this.props.form}
            constraint={section.constraint}
            errors={this.props.fieldErrors}
            addFile={this.props.addFile}
            removeFile={this.props.removeFile}
            files={this.props.files}
            dialogOpener={this.props.toggleDailogAndSetText}
            handler={this.props.handleChange}
          />
        );
      });
    } else return [];
  };

  componentWillMount() {
    //console.log('service code', this.props.match.params.serviceCode);
    /*let response=JSON.parse(`{ "responseInfo": null, "tenantId": "default", "serviceCode": "NOC", "attributes": [ { "variable": true, "code": "NOCNAME", "dataType": "string", "required": true, "dataTypeDescription": null, "description": "core.noc.name", "url": null, "order": null, "groupCode": "group1", "roles": [], "actions": [], "constraints": null, "attribValues": [] }, { "variable": true, "code": "NOCMOBILE", "dataType": "integer", "required": true, "dataTypeDescription": null, "description": "core.noc.mobileno", "url": null, "order": null, "groupCode": "group1", "roles": [], "actions": [], "constraints": null, "attribValues": [] }, { "variable": true, "code": "NOCSG", "dataType": "singlevaluelist", "required": true, "dataTypeDescription": null, "description": "core.noc.servicegroup", "url": "/pgr-master/serviceGroup/v1/_search?keyword=complaint&pageSize=500", "order": null, "groupCode": "group1", "roles": [], "actions": [], "constraints": null, "attribValues": [] }, { "variable": true, "code": "NOCLOC", "dataType": "string", "required": true, "dataTypeDescription": null, "description": "core.noc.location", "url": "egov-location/boundarys/getLocationByLocationName?locationName=", "order": null, "groupCode": "group1", "roles": [], "actions": [], "constraints": null, "attribValues": [] }, { "variable": true, "code": "NOCSGMVS", "dataType": "multivaluelist", "required": true, "dataTypeDescription": null, "description": "core.noc.multilist", "url": "/pgr-master/serviceGroup/v1/_search?keyword=complaint&pageSize=500", "order": null, "groupCode": "group1", "roles": [], "actions": [], "constraints": null, "attribValues": [] }, { "variable": true, "code": "NOCAGE", "dataType": "integer", "required": true, "dataTypeDescription": null, "description": "core.noc.age", "url": null, "order": 1, "groupCode": "group1", "roles": [], "actions": [], "constraints": null, "attribValues": [] }, { "variable": true, "code": "NOCFEES", "dataType": "integer", "required": false, "dataTypeDescription": null, "description": "core.noc.fees", "url": null, "order": 0, "groupCode": null, "roles": [], "actions": [], "constraints": null, "attribValues": [] }, { "variable": true, "code": "NOCDATE", "dataType": "date", "required": false, "dataTypeDescription": null, "description": "core.noc.date", "url": null, "order": 2, "groupCode": null, "roles": [], "actions": [], "constraints": null, "attribValues": [] }, { "variable": true, "code": "NOCENDDATE", "dataType": "datetime", "required": true, "dataTypeDescription": null, "description": "core.noc.enddate", "url": null, "order": 4, "groupCode": null, "roles": [], "actions": [], "constraints": null, "attribValues": [] }, { "variable": true, "code": "NOCSTATUS", "dataType": "singlevaluelist", "required": true, "dataTypeDescription": null, "description": "core.noc.status", "url": null, "order": 3, "groupCode": null, "roles": [], "actions": [], "constraints": null, "attribValues": [ { "key": "NOCSTATUSAPPROVED", "name": "core.noc.status.approved", "isActive": true }, { "key": "NOCSTATUSREJECTED", "name": "core.noc.status.rejected", "isActive": true } ] }, { "variable": true, "code": "NOCSLIMIT", "dataType": "multivaluelist", "required": false, "dataTypeDescription": null, "description": "core.noc.limit", "url": null, "groupCode": null, "roles": [], "order": 5, "actions": [], "constraints": null, "attribValues": [ { "key": "NOCLIMITONE", "name": "core.noc.limit.one", "isActive": true }, { "key": "NOCLIMITTWO", "name": "core.noc.limit.two", "isActive": true }, { "key": "NOCLIMITTHREE", "name": "core.noc.limit.three", "isActive": true }, { "key": "NOCLIMITFOUR", "name": "core.noc.limit.four", "isActive": false } ] }, { "variable": true, "code": "NOCFILE", "dataType": "file", "required": true, "dataTypeDescription": null, "description": "core.noc.file", "url": null, "order": 7, "groupCode": null, "roles": [], "actions": [], "constraints": null, "attribValues": [] }, { "variable": true, "code": "NOCMULTIFILE", "dataType": "multifile", "required": false, "dataTypeDescription": null, "description": "core.noc.multifile", "url": null, "order": 6, "groupCode": null, "roles": [], "actions": [], "constraints": null, "attribValues": [] }, { "variable": true, "code": "NOCLONG", "dataType": "long", "required": false, "dataTypeDescription": null, "description": "core.noc.long", "url": null, "groupCode": null, "roles": [], "actions": [], "constraints": null, "attribValues": [] }, { "variable": true, "code": "NOC", "dataType": "textarea", "required": false, "dataTypeDescription": null, "description": "core.noc.textarea", "url": null, "groupCode": null, "roles": [], "actions": [], "constraints": null, "attribValues": [] }, { "variable": true, "order": 8, "code": "NOCHK", "dataType": "checkbox", "required": true, "dataTypeDescription": null, "description": "core.noc.checkbox", "url": null, "groupCode": null, "roles": [], "actions": [], "constraints": null, "attribValues": [] }, { "variable": true, "code": "NORG", "dataType": "radiogroup", "required": true, "dataTypeDescription": null, "description": "core.noc.radio", "url": null, "groupCode": null, "roles": [], "actions": [], "constraints": null, "attribValues": [ { "key": "NOCRADIO1", "name": "core.noc.radio.one", "isActive": true }, { "key": "NOCRADIO2", "name": "core.noc.radio.two", "isActive": true } ] }, { "variable": true, "code": "CHECKLIST", "dataType": "checkbox", "required": true, "dataTypeDescription": null, "description": "core.noc.checklist", "url": null, "groupCode": null, "roles": [], "actions": [], "constraints": null, "attribValues": [ { "key": "NOCCHECKLIST1", "name": "core.noc.checklist.one", "isActive": true }, { "key": "NOCCHECKLIST2", "name": "core.noc.checklist.two", "isActive": true, "required": true } ] }, { "variable": true, "code": "DOCUMENTS", "dataType": "", "required": true, "dataTypeDescription": null, "description": "core.noc.checklist", "url": null, "groupCode": null, "roles": [], "actions": [], "constraints": null, "attribValues": [ { "key": "NOCDOC1", "name": "core.noc.doc.one", "isActive": true }, { "key": "NOCDOC2", "name": "core.noc.doc.two", "isActive": true }, { "key": "NOCDOC3", "name": "core.noc.doc.three", "isActive": true }, { "key": "NOCDOC4", "name": "core.noc.doc.four", "isActive": true, "required": true } ] } ] }`);*/

    /*this.fieldGrouping(response);*/

    this.setState({
      pageTitle: this.props.match.params.serviceName.replace(/~/g, '/'),
    });
    this.props.setLoadingStatus('loading');

    var _this = this;
    Api.commonApiPost('/pgr-master/servicedefinition/v1/_search', {
      serviceCode: this.props.match.params.serviceCode,
      keywords: constants.CITIZEN_SERVICES_KEYWORD,
    }).then(
      function(response) {
        _this.props.setLoadingStatus('hide');
        _this.fieldGrouping(response[0]);
      },
      function(err) {
        _this.props.setLoadingStatus('hide');
      }
    );
  }

  getAttribValuesFromFields = form => {
    //setting default attribValues
    let attribValues = [
      { key: 'systemStatus', name: constants.CITIZEN_SERVICES_STATUS_NEW },
      { key: 'keyword', name: constants.CITIZEN_SERVICES_KEYWORD },
    ];

    Object.keys(this.props.form).map(key => {
      var name = this.props.form[key];
      if (name instanceof Array) {
        name.map(value => {
          attribValues.push({ key, name: value });
        });
      } else attribValues.push({ key, name });
    });
    return attribValues;
  };

  prepareAndSubmitRequest = () => {
    let userType = localStorage.getItem('type');
    let serviceRequest = {};
    this.props.setLoadingStatus('loading');
    let _this = this;
    serviceRequest['serviceCode'] = this.props.match.params.serviceCode;
    serviceRequest['attribValues'] = this.getAttribValuesFromFields(this.props.form);

    console.log('serviceRequest', serviceRequest);

    if (userType === constants.ROLE_CITIZEN) {
      var tenantId = localStorage.getItem('tenantId') ? localStorage.getItem('tenantId') : 'default';
      var userRequest = {};
      userRequest['id'] = [localStorage.getItem('id')];
      userRequest['tenantId'] = tenantId;
      serviceRequest['tenantId'] = tenantId;

      //for getting citizen profile details to get name, mobile, email
      Api.commonApiPost('/user/v1/_search', {}, userRequest).then(
        function(userResponse) {
          if (!userResponse) return;

          let user = userResponse.user[0];
          serviceRequest['firstName'] = user.name;
          serviceRequest['phone'] = user.mobileNumber;
          serviceRequest['email'] = user.emailId || '';

          if (_this.props.files && _this.props.files.length > 0) {
            _this.uploadFilesAndRaiseRequest(serviceRequest, _this.props.files, tenantId);
          } else {
            console.log('files is not there');
            _this.raiseRequest(serviceRequest);
          }
        },
        function(err) {
          _this.props.setLoadingStatus('hide');
        }
      );
    }
  };

  uploadFilesAndRaiseRequest = (serviceRequest, files, tenantId) => {
    let fileAttribValues = []; //store filestoreId by code
    var _this = this;
    let formData = new FormData();
    formData.append('tenantId', tenantId);
    formData.append('module', constants.CITIZEN_SERVICES_FILE_TAG);
    files.map(field => {
      var fileAttribValue = { key: field.code, name: '' };
      field.files.map(file => {
        fileAttribValues.push(fileAttribValue);
        formData.append('file', file);
      });
    });

    Api.commonApiPost('/filestore/v1/files', {}, formData).then(
      function(fileResponse) {
        fileResponse.files.map((file, index) => {
          fileAttribValues[index] = {
            ...fileAttribValues[index],
            name: file.fileStoreId,
          };
        });
        serviceRequest['attribValues'] = [...serviceRequest.attribValues, ...fileAttribValues];
        _this.raiseRequest(serviceRequest);
      },
      function(err) {
        _this.props.setLoadingStatus('hide');
      }
    );
  };

  raiseRequest = serviceRequest => {
    var _this = this;
    console.log('raising request...', serviceRequest);
    Api.commonApiPost('/pgr/seva/v1/_create', {}, { serviceRequest }).then(
      function(response) {
        _this.props.setLoadingStatus('hide');
        console.log('request submitted succesfully', response);
        var srn = response.serviceRequests[0].serviceRequestId;
        var ack = `${translate('csv.lbl.underprocess')}. ${translate('pgr.lbl.srn')} is ${srn}. ${translate('pgr.msg.future.reference')}.`;
        _this.setState({ ack, openDialog: true });
      },
      function(err) {
        _this.props.setLoadingStatus('hide');
        _this.props.toggleDailogAndSetText(true, err.message);
      }
    );
  };

  render() {
    const formSections = this.renderFormSection();

    const actions = [<FlatButton label={translate('core.lbl.ok')} primary={true} onTouchTap={this.handleRefresh} />];

    return (
      <Grid fluid={true}>
        <h1 className="application-title">{this.state.pageTitle}</h1>
        {formSections}
        <br />
        <Row>
          <Col xs={12} className="text-center">
            <RaisedButton
              label={translate('core.lbl.submit')}
              fullWidth={false}
              onClick={this.prepareAndSubmitRequest}
              primary={true}
              disabled={!this.props.isFormValid}
            />
          </Col>
        </Row>
        <Dialog actions={actions} modal={false} open={this.state.openDialog} onRequestClose={this.handleRefresh}>
          {this.state.ack}
        </Dialog>
      </Grid>
    );
  }
}

export default NewServiceRequest;
