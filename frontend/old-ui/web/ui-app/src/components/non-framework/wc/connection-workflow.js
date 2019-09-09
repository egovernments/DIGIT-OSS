import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import _ from 'lodash';
import ShowFields from '../../framework/showFields';
import SelectField from 'material-ui/SelectField';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import { translate, epochToDate, dataURItoBlob } from '../../common/common';
import Api from '../../../api/api';
import { fonts, getBase64FromImageUrl } from '../../common/pdf-generation/PdfConfig';
import jp from 'jsonpath';
import PdfViewer from '../../common/pdf-generation/PdfViewer';
import UiButton from '../../framework/components/UiButton';
import { fileUpload, getInitiatorPosition } from '../../framework/utility/utility';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import { Card, CardHeader, CardText, CardTitle } from 'material-ui/Card';
import $ from 'jquery';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

var CONST_API_GET_FILE = '/filestore/v1/files/id';
var specifications = {};
let reqRequired = [];
let baseUrl = 'https://raw.githubusercontent.com/abhiegov/test/master/specs/';
const DOCUMENT_TYPE = 'ESTIMATIONNOTICE';
const DOCUMENT_TYPE2 = 'WORKORDERNOTICE';
let AckNumber = '';

const defaultMat = {
  name: '',
  quantity: '',
  size: '',
  amountDetails: '',
};

// const generateEstNotice = function(connection, tenantInfo) {
// 	var doc = new jsPDF();
//
// 	doc.setFont("courier");
// 	doc.setFontType("bold");
// 	doc.setFontSize(20);
// 	doc.text(105, 10, (tenantInfo && tenantInfo.city && tenantInfo.city.name ? tenantInfo.city.name : "Roha Municipal Council") , null, null, 'center');
// 	doc.setFontSize(15);
// 	doc.setFontType("normal");
// 	doc.text(105, 20, 'Water Department', null, null, 'center');
// 	doc.text(105, 30, 'Letter Of Intimation', null, null, 'center');
// 	doc.setFontType("bold");
// 	doc.text(200, 40, 'Date: ________', null, null, 'right');
// 	doc.text(200, 50, 'No.: ________', null, null, 'right');
// 	doc.setFontType("bold");
// 	doc.setFontSize(20);
// 	doc.text(10, 60, "To,");
// 	doc.text(10, 70, "Applicant");
// 	doc.setFont("times");
// 	doc.setFontType("normal");
// 	doc.setFontSize(15);
// 	doc.text(10, 82, "Subject: Letter of Intimation for New Water Connection");
// 	doc.text(10, 90, "Reference: Application No: " + connection.consumerNumber + " and Application Date " + (connection.executionDate ? new Date(connection.executionDate) : ""));
// 	doc.text(10, 98, "Sir/Madam");
// 	doc.setFontType("bold");
// 	doc.text(35, 98, connection.property.nameOfApplicant + "  has applied for New Water Connection for Water No. ")
// 	doc.text(10, 106, "Water No. " + connection.consumerNumber + ". Requested to New Water Connection has been approved. Kindly pay the");
// 	doc.text(10, 114, "charges which are mentioned below within __ days.")
// 	doc.text(10, 122, "If not paid Application will be rejected or Penalty will be levied.");
// 	doc.text(10, 140, "Road Cutting Charges:    " + connection.estimationCharge[0].roadCutCharges);
// 	doc.text(10, 148, "Security Charges:             " + connection.estimationCharge[0].specialSecurityCharges);
// 	doc.text(10, 156, "Supervision Charges:       " + connection.estimationCharge[0].supervisionCharges);
// 	doc.setFontType("normal");
// 	doc.text(200, 190, 'Signing Authority', null, null, 'right');
// 	//doc.text(182, 198, 'अधिक्', null, null, 'right');
// 	doc.setFontType("bold");
// 	doc.setFontSize(20);
// 	doc.text(163, 210, (tenantInfo && tenantInfo.city && tenantInfo.city.name ? tenantInfo.city.name : "Roha Municipal Council"), null, null, 'center');
// 	doc.save("SN" + connection.consumerNumber + ".pdf");
// }
//
// const generateWO = function(connection, tenantInfo) {
// 	var doc = new jsPDF();
//
// 	doc.setFont("courier");
// 	doc.setFontType("bold");
// 	doc.setFontSize(20);
// 	doc.text(105, 10, (tenantInfo && tenantInfo.city && tenantInfo.city.name ? tenantInfo.city.name : "Roha Municipal Council"), null, null, 'center');
// 	doc.setFontSize(15);
// 	doc.setFontType("normal");
// 	doc.text(105, 20, 'Water Department', null, null, 'center');
// 	doc.text(105, 30, 'Letter Of Intimation', null, null, 'center');
// 	doc.setFontType("bold");
// 	doc.text(200, 40, 'Date: ________', null, null, 'right');
// 	doc.text(200, 50, 'No.: ________', null, null, 'right');
// 	doc.setFontType("bold");
// 	doc.setFontSize(20);
// 	doc.text(10, 60, "To,");
// 	doc.text(10, 70, "Applicant");
// 	doc.setFont("times");
// 	doc.setFontType("normal");
// 	doc.setFontSize(15);
// 	doc.text(10, 82, "Subject: Approval Order");
// 	doc.text(10, 90, "Reference: Application No: " + connection.consumerNumber + " and Application Date " + (connection.executionDate ? new Date(connection.executionDate) : ""));
// 	doc.text(10, 98, "Sir/Madam");
// 	doc.setFontType("bold");
// 	doc.text(35, 98, connection.property.nameOfApplicant + " has applied for New <Service name> has been approved.")
// 	doc.text(10, 106, connection.plumberName + " assigned for the work.");
// 	doc.text(10, 114, "Allotted Water Connection No. " + connection.consumerNumber)
//
// 	doc.setFontType("normal");
// 	doc.text(200, 190, 'Signing Authority', null, null, 'right');
// 	doc.setFontType("bold");
// 	doc.setFontSize(20);
// 	doc.text(163, 210, ' Roha Muncipal Council', null, null, 'center');
// 	doc.save("SN" + connection.consumerNumber + ".pdf");
// }

class Report extends Component {
  state = {
    pathname: '',
    pdfData: undefined,
  };
  constructor(props) {
    super(props);
    this.state = {
      workflow: [],
      buttons: [],
      departments: [],
      designations: [],
      employees: [],
      initiatorPosition: '',
      hide: false,
      disable: false,
      pipeSize: {},
      downloadReady: false,
    };
  }

  setLabelAndReturnRequired(configObject) {
    if (configObject && configObject.groups) {
      for (var i = 0; configObject && i < configObject.groups.length; i++) {
        configObject.groups[i].label = translate(configObject.groups[i].label);
        for (var j = 0; j < configObject.groups[i].fields.length; j++) {
          configObject.groups[i].fields[j].label = translate(configObject.groups[i].fields[j].label);
          if (configObject.groups[i].fields[j].isRequired && !configObject.groups[i].fields[j].hide && !configObject.groups[i].hide)
            reqRequired.push(configObject.groups[i].fields[j].jsonPath);
        }

        if (configObject.groups[i].children && configObject.groups[i].children.length) {
          for (var k = 0; k < configObject.groups[i].children.length; k++) {
            this.setLabelAndReturnRequired(configObject.groups[i].children[k]);
          }
        }
      }
    }
  }

  setDefaultValues(groups, dat) {
    for (var i = 0; i < groups.length; i++) {
      for (var j = 0; j < groups[i].fields.length; j++) {
        if (
          typeof groups[i].fields[j].defaultValue == 'string' ||
          typeof groups[i].fields[j].defaultValue == 'number' ||
          typeof groups[i].fields[j].defaultValue == 'boolean'
        ) {
          //console.log(groups[i].fields[j].name + "--" + groups[i].fields[j].defaultValue);
          _.set(dat, groups[i].fields[j].jsonPath, groups[i].fields[j].defaultValue);
        }

        if (groups[i].fields[j].children && groups[i].fields[j].children.length) {
          for (var k = 0; k < groups[i].fields[j].children.length; k++) {
            this.setDefaultValues(groups[i].fields[j].children[k].groups);
          }
        }
      }
    }
  }

  setInitialUpdateChildData(form, children) {
    let _form = JSON.parse(JSON.stringify(form));
    for (var i = 0; i < children.length; i++) {
      for (var j = 0; j < children[i].groups.length; j++) {
        if (children[i].groups[j].multiple) {
          var arr = _.get(_form, children[i].groups[j].jsonPath);
          var ind = j;
          var _stringifiedGroup = JSON.stringify(children[i].groups[j]);
          var regex = new RegExp(children[i].groups[j].jsonPath.replace(/\[/g, '\\[').replace(/\]/g, '\\]') + '\\[\\d{1}\\]', 'g');
          for (var k = 1; k < arr.length; k++) {
            j++;
            children[i].groups[j].groups.splice(
              ind + 1,
              0,
              JSON.parse(_stringifiedGroup.replace(regex, children[i].groups[ind].jsonPath + '[' + k + ']'))
            );
            children[i].groups[j].groups[ind + 1].index = ind + 1;
          }
        }

        if (children[i].groups[j].children && children[i].groups[j].children.length) {
          this.setInitialUpdateChildData(form, children[i].groups[j].children);
        }
      }
    }
  }

  setInitialUpdateData(form, specs, moduleName, actionName, objectName) {
    let { setMockData } = this.props;
    let _form = JSON.parse(JSON.stringify(form));
    var ind;
    for (var i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
      if (specs[moduleName + '.' + actionName].groups[i].multiple) {
        var arr = _.get(_form, specs[moduleName + '.' + actionName].groups[i].jsonPath);
        ind = i;
        var _stringifiedGroup = JSON.stringify(specs[moduleName + '.' + actionName].groups[i]);
        var regex = new RegExp(
          specs[moduleName + '.' + actionName].groups[i].jsonPath.replace(/\[/g, '\\[').replace(/\]/g, '\\]') + '\\[\\d{1}\\]',
          'g'
        );
        for (var j = 1; j < arr.length; j++) {
          i++;
          specs[moduleName + '.' + actionName].groups.splice(
            ind + 1,
            0,
            JSON.parse(_stringifiedGroup.replace(regex, specs[moduleName + '.' + actionName].groups[ind].jsonPath + '[' + j + ']'))
          );
          specs[moduleName + '.' + actionName].groups[ind + 1].index = ind + 1;
        }
      }

      for (var j = 0; j < specs[moduleName + '.' + actionName].groups[i].fields.length; j++) {
        if (
          specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields &&
          specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields.length
        ) {
          for (var k = 0; k < specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields.length; k++) {
            if (
              specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].ifValue ==
              _.get(form, specs[moduleName + '.' + actionName].groups[i].fields[j].jsonPath)
            ) {
              if (
                specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide &&
                specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide.length
              ) {
                for (var a = 0; a < specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide.length; a++) {
                  this.hideField(specs, specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide[a]);
                }
              }

              if (
                specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show &&
                specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length
              ) {
                for (var a = 0; a < specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length; a++) {
                  this.showField(specs, specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show[a]);
                }
              }
            }
          }
        }
      }

      if (specs[moduleName + '.' + actionName].groups[ind || i].children && specs[moduleName + '.' + actionName].groups[ind || i].children.length) {
        this.setInitialUpdateChildData(form, specs[moduleName + '.' + actionName].groups[ind || i].children);
      }
    }

    setMockData(specs);
  }

  depedantValue(groups) {
    let self = this;
    for (let i = 0; i < groups.length; i++) {
      for (let j = 0; j < groups[i].fields.length; j++) {
        if (groups[i].fields[j].depedants && groups[i].fields[j].depedants.length) {
          for (let k = 0; k < groups[i].fields[j].depedants.length; k++) {
            if (groups[i].fields[j].depedants[k].type == 'dropDown') {
              let splitArray = groups[i].fields[j].depedants[k].pattern.split('?');
              let context = '';
              let id = {};
              // id[splitArray[1].split("&")[1].split("=")[0]]=e.target.value;
              for (let p = 0; p < splitArray[0].split('/').length; p++) {
                context += splitArray[0].split('/')[p] + '/';
              }

              let queryStringObject = splitArray[1].split('|')[0].split('&');
              for (let m = 0; m < queryStringObject.length; m++) {
                if (m) {
                  if (queryStringObject[m].split('=')[1].search('{') > -1) {
                    id[queryStringObject[m].split('=')[0]] = self.getVal(
                      queryStringObject[m]
                        .split('=')[1]
                        .split('{')[1]
                        .split('}')[0]
                    );
                  } else {
                    id[queryStringObject[m].split('=')[0]] = queryStringObject[m].split('=')[1];
                  }
                }
              }

              // if(id.categoryId == "" || id.categoryId == null){
              //   formData.tradeSubCategory = "";
              //   setDropDownData(value.jsonPath, []);
              //   console.log(value.jsonPath);
              //   console.log("helo", formData);
              //   return false;
              // }
              Api.commonApiPost(context, id).then(
                function(response) {
                  if (response) {
                    let keys = jp.query(response, splitArray[1].split('|')[1]);
                    let values = jp.query(response, splitArray[1].split('|')[2]);
                    let dropDownData = [];
                    for (let t = 0; t < keys.length; t++) {
                      let obj = {};
                      obj['key'] = keys[t];
                      obj['value'] = values[t];
                      dropDownData.push(obj);
                    }
                    dropDownData.sort(function(s1, s2) {
                      return s1.value < s2.value ? -1 : s1.value > s2.value ? 1 : 0;
                    });
                    dropDownData.unshift({
                      key: null,
                      value: '-- Please Select --',
                    });
                    self.props.setDropDownData(groups[i].fields[j].depedants[k].jsonPath, dropDownData);
                  }
                },
                function(err) {
                  console.log(err);
                }
              );
            }
          }
        }

        if (groups[i].fields[j].children && groups[i].fields[j].children.length) {
          for (var k = 0; k < groups[i].fields[j].children.length; k++) {
            self.depedantValue(groups[i].fields[j].children[k].groups);
          }
        }
      }
    }
  }

  displayUI(results) {
    let { setMetaData, setModuleName, setActionName, initForm, setMockData, setFormData } = this.props;
    let hashLocation = window.location.hash;
    let self = this;
    let count = 4;
    const stopLoader = function() {
      count--;
      if (count == 0) self.props.setLoadingStatus('hide');
    };

    self.props.setLoadingStatus('loading');
    specifications = typeof results == 'string' ? JSON.parse(results) : results;
    let obj = specifications['wc.create'];
    reqRequired = [];
    self.setLabelAndReturnRequired(obj);
    initForm(reqRequired);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('wc');
    setActionName('create');

    this.setState({
      pathname: this.props.history.location.pathname,
    });

    //Get connection and set form data
    Api.commonApiPost('/wcms-connection/connection/_search', { stateId: self.props.match.params.stateId }, {}, null, true).then(
      function(res) {
        if (res && res.Connection && res.Connection[0]) {
          AckNumber = res.Connection[0].acknowledgementNumber;
          //Fetch category type
          //     Api.commonApiPost("/wcms/masters/usagetypes/_search", {}, {}, null, true).then(function(res23){
          //         if(res23) {
          //           let keys=jp.query(res23, "$..code");
          //           let values=jp.query(res23, "$..name");
          //           let dropDownData=[];
          //           for (var k = 0; k < keys.length; k++) {
          //               let obj={};
          //               obj["key"]=keys[k];
          //               obj["value"]=values[k];
          //               dropDownData.push(obj);
          //           }
          //           self.props.setDropDownData("Connection[0].usageType", dropDownData);
          //         }
          //     }, function(err) {
          //
          //     })
          //
          //     Api.commonApiPost("/wcms/masters/pipesizes/_search", {}, {}, null, true).then(function(res24){
          //       if(res24) {
          //         let keys = jp.query(res24, "$..sizeInMilimeter");
          //         let values = jp.query(res24, "$..sizeInInch");
          //         let dropDownData=[];
          //         for (var k = 0; k < keys.length; k++) {
          //             let obj={};
          //             obj["key"]=keys[k];
          //             obj["value"]=values[k];
          //             dropDownData.push(obj);
          //         }
          //         self.props.setDropDownData("Connection[0].hscPipeSizeType", dropDownData);
          //       }
          //     }, function(err) {
          //
          //     })
          //
          //
          //
          // if(res.Connection[0].usageType) {
          //   Api.commonApiPost("/wcms/masters/usagetypes/_search", {parent: res.Connection[0].usageType}, {}, null, true).then(function(res25){
          //     if(res25) {
          //       let keys=jp.query(res25, "$..code");
          //       let values=jp.query(res25, "$..name");
          //       let dropDownData=[];
          //       for (var k = 0; k < keys.length; k++) {
          //           let obj={};
          //           obj["key"]=keys[k];
          //           obj["value"]=values[k];
          //           dropDownData.push(obj);
          //       }
          //       self.props.setDropDownData("Connection[0].subUsageType", dropDownData);
          //     }
          //   }, function(err) {
          //
          //   })
          // }
          self.depedantValue(obj.groups);

          res.Connection[0].estimationCharge = [
            {
              estimationCharges: 0,
              supervisionCharges: 0,
              roadCutCharges: 0,
              specialSecurityCharges: 0,
              existingDistributionPipeline: 0,
              pipelineToHomeDistance: 0,
              materials: [{ ...defaultMat }],
            },
          ];
          self.props.setFormData(res);

          self.setInitialUpdateData(res, JSON.parse(JSON.stringify(specifications)), 'wc', 'create', specifications['wc.create'].objectName);
          stopLoader();
        }
      },
      function(err) {
        stopLoader();
      }
    );

    //Fetch workflow
    Api.commonApiPost('egov-common-workflows/history', { workflowId: self.props.match.params.stateId }, {}, null, true).then(
      function(res) {
        self.setState({
          workflow: res.tasks,
        });
        stopLoader();
      },
      function(err) {
        stopLoader();
      }
    );

    //Fetch buttons
    Api.commonApiPost('egov-common-workflows/process/_search', { id: self.props.match.params.stateId }, {}, null, false).then(
      function(res) {
        if (
          res &&
          res.processInstance &&
          res.processInstance.attributes &&
          res.processInstance.attributes.validActions &&
          res.processInstance.attributes.validActions.values &&
          res.processInstance.attributes.validActions.values.length
        ) {
          var flg = 0;
          for (var j = 0; j < res.processInstance.attributes.validActions.values.length; j++) {
            if (
              res.processInstance.attributes.validActions.values[j].key.toLowerCase() == 'forward' ||
              res.processInstance.attributes.validActions.values[j].key.toLowerCase() == 'submit'
            ) {
              flg = 1;
            }
          }

          self.setState({
            buttons: res.processInstance.attributes.validActions.values,
            hide: flg == 1 ? false : true,
            disable: flg == 1 ? false : true,
          });

          if (flg == 0) {
            for (var i = 0; i < specifications['wc.create'].groups.length; i++) {
              for (var j = 0; j < specifications['wc.create'].groups[i].fields.length; j++) {
                specifications['wc.create'].groups[i].fields[j].isDisabled = true;
              }
            }

            setMockData(specifications);
          }
        } else {
        }

        if (res && res.processInstance) {
          Api.commonApiPost(
            '/egov-common-workflows/designations/_search',
            {
              businessKey: 'WaterConnection',
              approvalDepartmentName: '',
              departmentRule: '',
              currentStatus: res.processInstance.status,
              additionalRule: '',
              pendingAction: '',
              designation: '',
              amountRule: '',
            },
            {},
            null,
            false
          ).then(
            function(res3) {
              if (res3 && res3.length) {
                var count = res3.length;
                for (let i = 0; i < res3.length; i++) {
                  Api.commonApiPost(
                    '/hr-masters/designations/_search',
                    {
                      name: res3[i].name,
                    },
                    {},
                    null,
                    false
                  ).then(
                    function(res2) {
                      res3[i].id = res2.Designation && res2.Designation[0] ? res2.Designation[0].id : '-';
                      count--;
                      if (count == 0) {
                        self.setState({
                          designations: res3,
                          initiatorPosition: res.processInstance.initiatorPosition,
                          status: res.processInstance.status,
                        });
                      }
                    },
                    function(err) {}
                  );
                }
              }
            },
            function(err) {}
          );
        }
        stopLoader();
      },
      function(err) {
        stopLoader();
      }
    );

    Api.commonApiPost('egov-common-masters/departments/_search', {}, {}, null, false).then(
      function(res) {
        self.setState({
          departments: res.Department,
        });
        stopLoader();
      },
      function(err) {
        stopLoader();
      }
    );
  }

  getEmployee = () => {
    let self = this;
    if (this.props.formData.Connection[0].workflowDetails.department && this.props.formData.Connection[0].workflowDetails.designation) {
      Api.commonApiPost(
        'hr-employee/employees/_search',
        {
          departmentId: this.props.formData.Connection[0].workflowDetails.department,
          designationId: this.props.formData.Connection[0].workflowDetails.designation,
        },
        {},
        null,
        false
      ).then(
        function(res) {
          self.setState({
            employees: res.Employee,
          });
        },
        function(err) {}
      );
    }
  };

  initData() {
    var hash = window.location.hash.split('/');
    let endPoint = '';
    let self = this;

    specifications = require('../../framework/specs/wc/others/workflow').default;
    self.displayUI(specifications);
  }

  // componentDidMount() {
  //     this.initData();
  // 		window.scrollTo(0,0);
  //
  // }
  componentDidMount() {
    var currentThis = this;
    currentThis.initData();
    //=======================BASED ON APP CONFIG==========================//
    Api.commonApiPost('/wcms/masters/waterchargesconfig/_search', {
      name: 'HIERACHYTYPEFORWC',
    })
      .then(res1 => {
        if (
          res1.WaterConfigurationValue &&
          res1.WaterConfigurationValue[0] &&
          res1.WaterConfigurationValue[0].value &&
          res1.WaterConfigurationValue[0].value
        ) {
          Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
            boundaryTypeName: 'ZONE',
            hierarchyTypeName: res1.WaterConfigurationValue[0].value,
          })
            .then(response => {
              if (response) {
                let keys = jp.query(response, '$.Boundary.*.code');
                let values = jp.query(response, '$.Boundary.*.name');
                let dropDownData = [];
                for (var k = 0; k < keys.length; k++) {
                  let obj = {};
                  obj['key'] = keys[k];
                  obj['value'] = values[k];
                  dropDownData.push(obj);
                }

                dropDownData.sort(function(s1, s2) {
                  return s1.value < s2.value ? -1 : s1.value > s2.value ? 1 : 0;
                });
                dropDownData.unshift({
                  key: null,
                  value: '-- Please Select --',
                });
                console.log(dropDownData);
                currentThis.props.setDropDownData('Connection[0].connectionLocation.revenueBoundary.code', dropDownData);
                currentThis.props.setDropDownData('Connection[0].property.zone', dropDownData);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  getTenantId = () => {
    return localStorage.getItem('tenantId') || 'default';
  };

  doInitialStuffsForWc = () => {
    var ulbLogoPromise = getBase64FromImageUrl('./temp/images/headerLogo.png');
    var stateLogoPromise = getBase64FromImageUrl('./temp/images/AS.png');

    var _this = this;
    this.props.setLoadingStatus('loading');

    Promise.all([
      ulbLogoPromise,
      stateLogoPromise,
      Api.commonApiGet(
        'https://raw.githubusercontent.com/abhiegov/test/master/tenantDetails.json',
        { timestamp: new Date().getTime() },
        {},
        false,
        true
      ),
    ])
      .then(response => {
        var cityName = response[2]['details'][_this.getTenantId()]['name'];
        _this.generatePdfForWc(response[0].image, response[1].image, _this.props.formData.Connection, cityName);
      })
      .catch(function(err) {
        _this.props.toggleSnackbarAndSetText(true, err.message, false, true);
      });
  };

  doInitialStuffs = () => {
    console.log('fire');
    var ulbLogoPromise = getBase64FromImageUrl('./temp/images/headerLogo.png');
    var stateLogoPromise = getBase64FromImageUrl('./temp/images/AS.png');

    var _this = this;
    this.props.setLoadingStatus('loading');

    Promise.all([
      ulbLogoPromise,
      stateLogoPromise,
      Api.commonApiGet(
        'https://raw.githubusercontent.com/abhiegov/test/master/tenantDetails.json',
        { timestamp: new Date().getTime() },
        {},
        false,
        true
      ),
    ])
      .then(response => {
        var cityName = response[2]['details'][_this.getTenantId()]['name'];
        _this.generatePdf(response[0].image, response[1].image, _this.props.formData.Connection, cityName);
      })
      .catch(function(err) {
        _this.props.toggleSnackbarAndSetText(true, err.message, false, true);
        console.log(err);
      });
  };

  generatePdfForWc = (ulbLogo, stateLogo, certificateConfigDetails, ulbName) => {
    let Connection = this.props.formData.Connection;
    console.log(Connection);
    var _this = this;

    //assigning fonts
    pdfMake.fonts = fonts;

    //document defintion
    var docDefinition = {
      pageSize: 'A4',
      pageMargins: [30, 30, 30, 30],
      content: [
        //Pdf header
        {
          columns: [
            {
              width: 60,
              fit: [60, 60],
              image: ulbLogo,
              alignment: 'left',
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              width: '*',
              text: [{ text: `${ulbName}\n`, style: 'title' }, { text: `Water Department\n`, style: 'title' }],
              margin: [0, 10, 0, 0],
              alignment: 'center',
            },
            {
              width: 60,
              fit: [60, 60],
              image: stateLogo,
              alignment: 'right',
              background: 'black',
              color: 'white',
            },
          ],
          // optional space between columns
          columnGap: 0,
        },

        {
          table: {
            widths: ['*'],
            body: [[' '], [' ']],
          },
          layout: {
            hLineWidth: function(i, node) {
              return i === 0 || i === node.table.body.length ? 0 : 1;
            },
            vLineWidth: function(i, node) {
              return 0;
            },
          },
          margin: [0, 0, 0, 0],
        },

        {
          text: 'Approval Order',
          alignment: 'center',
          style: 'contentTitle',
          margin: [0, 0, 0, 5],
        },

        {
          table: {
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                '',
                { text: 'Date ' },
                { text: ':', alignment: 'left' },
                {
                  text: `${epochToDate(new Date().getTime())}`,
                  alignment: 'left',
                },
              ],
              [
                '',
                { text: 'No' },
                { text: ':', alignment: 'left' },
                {
                  text: `${Connection[0].acknowledgementNumber}`,
                  alignment: 'left',
                },
              ],
            ],
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 10],
        },

        {
          text: 'To,',
          bold: true,
          margin: [0, 0, 0, 2],
        },

        {
          text: 'Applicant',
          bold: true,
          margin: [0, 0, 0, 2],
        },
        {
          text: `Subject : Approval Order`,
          margin: [0, 0, 0, 2],
        },

        {
          text: [
            'Reference : Application No ',
            {
              text: Connection[0].acknowledgementNumber,
              decoration: 'underline',
            },
            ' and Application Date ',
            {
              text: epochToDate(Connection[0].executionDate),
              decoration: 'underline',
            },
          ],
          margin: [0, 0, 0, 2],
        },

        {
          text: 'Sir/Madam',
          margin: [0, 0, 0, 2],
        },

        {
          text: `${Connection[0].connectionOwners[0].name}} has applied for New Water Connection `,
          margin: [0, 0, 0, 2],
        },
        {
          text: ` has been approved. `,
          margin: [0, 0, 0, 2],
        },
        {
          text: `${Connection[0].plumberName} assigned for the work.`,
          margin: [0, 0, 0, 2],
        },
        {
          text: `Allotted Water Connection No. ${Connection[0].acknowledgementNumber} .`,
          margin: [0, 0, 0, 2],
        },

        {
          columns: [
            {
              width: '*',
              text: '',
            },
            {
              width: '*',
              text: `\n\n\n${ulbName}`,
              alignment: 'center',
              bold: true,
            },
          ],
        },
      ],
      styles: {
        title: {
          fontSize: 15,
          bold: true,
          lineHeight: 1.1,
        },
        subTitle: {
          fontSize: 12,
          lineHeight: 1.1,
        },
        subTitle2: {
          fontSize: 12,
        },
        contentTitle: {
          fontSize: 12,
        },
      },
      defaultStyle: {
        fontSize: 11,
      },
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    pdfDocGenerator.getDataUrl(dataUrl => {
      this.setState({
        pdfData: dataUrl,
      });

      let formData = new FormData();
      var blob = dataURItoBlob(dataUrl);
      formData.append('file', blob, `WC_${Connection[0].acknowledgementNumber || '0'} + .pdf`);
      formData.append('tenantId', localStorage.getItem('tenantId'));
      formData.append('module', 'wc');

      let { setLoadingStatus } = this.props;

      var errorFunction = function(err) {
        setLoadingStatus('hide');
        _this.props.toggleSnackbarAndSetText(true, err.message, false, true);
      };

      Api.commonApiPost('/filestore/v1/files', {}, formData).then(function(response) {
        if (response.files && response.files.length > 0) {
          //response.files[0].fileStoreId
          var ConnectionDocument = [
            {
              connectionId: Connection[0].id,
              tenantId: _this.getTenantId(),
              referenceNumber: Connection[0].acknowledgementNumber,
              documentType: DOCUMENT_TYPE2,
              fileStoreId: response.files[0].fileStoreId,
            },
          ];
          Api.commonApiPost(
            'wcms-connection/documents/_create',
            {},
            {
              ConnectionDocument: ConnectionDocument,
            },
            false,
            true
          ).then(function(response) {
            setLoadingStatus('hide');
          }, errorFunction);
        } else setLoadingStatus('hide');
      }, errorFunction);
    });
  };

  generatePdf = (ulbLogo, stateLogo, certificateConfigDetails, ulbName) => {
    let Connection = this.props.formData.Connection;
    var _this = this;

    //assigning fonts
    pdfMake.fonts = fonts;

    //document defintion
    var docDefinition = {
      pageSize: 'A4',
      pageMargins: [30, 30, 30, 30],
      content: [
        //Pdf header
        {
          columns: [
            {
              width: 60,
              fit: [60, 60],
              image: ulbLogo,
              alignment: 'left',
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              width: '*',
              text: [{ text: `${ulbName}\n`, style: 'title' }, { text: `Water Department\n`, style: 'title' }],
              margin: [0, 10, 0, 0],
              alignment: 'center',
            },
            {
              width: 60,
              fit: [60, 60],
              image: stateLogo,
              alignment: 'right',
              background: 'black',
              color: 'white',
            },
          ],
          // optional space between columns
          columnGap: 0,
        },

        {
          table: {
            widths: ['*'],
            body: [[' '], [' ']],
          },
          layout: {
            hLineWidth: function(i, node) {
              return i === 0 || i === node.table.body.length ? 0 : 1;
            },
            vLineWidth: function(i, node) {
              return 0;
            },
          },
          margin: [0, 0, 0, 0],
        },

        {
          text: 'Letter of Intimation',
          alignment: 'center',
          style: 'contentTitle',
          margin: [0, 0, 0, 5],
        },

        {
          table: {
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                '',
                { text: 'Date' },
                { text: ':', alignment: 'left' },
                {
                  text: `${epochToDate(new Date().getTime())}`,
                  alignment: 'left',
                },
              ],
              [
                '',
                { text: 'No' },
                { text: ':', alignment: 'left' },
                {
                  text: `${Connection[0].acknowledgementNumber}`,
                  alignment: 'left',
                },
              ],
            ],
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 10],
        },

        {
          text: 'To,',
          bold: true,
          margin: [0, 0, 0, 2],
        },
        {
          text: 'Applicant',
          bold: true,
          margin: [0, 0, 0, 2],
        },

        {
          text: `Subject : Letter of Intimation for New Water Connection`,
          margin: [0, 0, 0, 2],
        },

        {
          text: [
            'Reference : Application No ',
            {
              text: Connection[0].acknowledgementNumber,
              decoration: 'underline',
            },
            ' and Application Date ',
            {
              text: epochToDate(Connection[0].executionDate),
              decoration: 'underline',
            },
          ],
          margin: [0, 0, 0, 2],
        },

        {
          text: 'Sir/Madam',
          margin: [0, 0, 0, 2],
        },

        {
          text: `${Connection[0].connectionOwners[0].name} has applied for New Water Connection for `,
          margin: [0, 0, 0, 2],
        },
        {
          text: `Water No. ${Connection[0].acknowledgementNumber} . Requested to New Water Connection has been approved. `,
          margin: [0, 0, 0, 2],
        },
        {
          text: `Kindly pay the charges which are mentioned below within __ days.`,
          margin: [0, 0, 0, 2],
        },

        {
          columns: [
            {
              width: '*',
              text: '',
            },
            {
              width: '*',
              text: `\n\n\n${ulbName}`,
              alignment: 'center',
              bold: true,
            },
          ],
        },
      ],
      styles: {
        title: {
          fontSize: 15,
          bold: true,
          lineHeight: 1.1,
        },
        subTitle: {
          fontSize: 12,
          lineHeight: 1.1,
        },
        subTitle2: {
          fontSize: 12,
        },
        contentTitle: {
          fontSize: 12,
        },
      },
      defaultStyle: {
        fontSize: 11,
      },
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    pdfDocGenerator.getDataUrl(dataUrl => {
      this.setState({
        pdfData: dataUrl,
      });

      let formData = new FormData();
      var blob = dataURItoBlob(dataUrl);
      formData.append('file', blob, `WC_${Connection[0].acknowledgementNumber || '0'} + .pdf`);
      formData.append('tenantId', localStorage.getItem('tenantId'));
      formData.append('module', 'wc');

      let { setLoadingStatus } = this.props;

      var errorFunction = function(err) {
        setLoadingStatus('hide');
        _this.props.toggleSnackbarAndSetText(true, err.message, false, true);
      };

      Api.commonApiPost('/filestore/v1/files', {}, formData).then(function(response) {
        if (response.files && response.files.length > 0) {
          //response.files[0].fileStoreId
          var ConnectionDocument = [
            {
              connectionId: Connection[0].id,
              tenantId: _this.getTenantId(),
              referenceNumber: Connection[0].acknowledgementNumber,
              documentType: DOCUMENT_TYPE,
              fileStoreId: response.files[0].fileStoreId,
            },
          ];
          Api.commonApiPost(
            'wcms-connection/documents/_create',
            {},
            {
              ConnectionDocument: ConnectionDocument,
            },
            false,
            true
          ).then(function(response) {
            // alert("SUCCESS!");
            // _this.setState({
            // 	downloadReady :true
            // })
            setLoadingStatus('hide');
          }, errorFunction);
        } else setLoadingStatus('hide');
      }, errorFunction);
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.pathname != nextProps.history.location.pathname) {
      this.initData();
    }
  }

  autoComHandler = (autoObject, path) => {
    let self = this;
    var value = this.getVal(path);
    if (!value) return;
    var url = autoObject.autoCompleteUrl.split('?')[0];
    var hashLocation = window.location.hash;
    var query = {
      [autoObject.autoCompleteUrl.split('?')[1].split('=')[0]]: value,
    };
    Api.commonApiPost(url, query, {}, false, specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].useTimestamp).then(
      function(res) {
        var formData = { ...self.props.formData };
        for (var key in autoObject.autoFillFields) {
          _.set(formData, key, _.get(res, autoObject.autoFillFields[key]));
        }
        self.props.setFormData(formData);
      },
      function(err) {
        console.log(err);
      }
    );
  };

  makeAjaxCall = (formData, url) => {
    let self = this;
    delete formData.ResponseInfo;
    //return console.log(formData);
    Api.commonApiPost(url || self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].url, '', formData, '', true).then(
      function(response) {
        self.props.setLoadingStatus('hide');
        self.initData();
        self.props.toggleSnackbarAndSetText(
          true,
          translate(self.props.actionName == 'create' ? 'wc.create.message.success' : 'wc.update.message.success'),
          true
        );
        setTimeout(function() {
          if (self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].idJsonPath) {
            if (self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].ackUrl) {
              var hash =
                self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].ackUrl +
                '/' +
                encodeURIComponent(_.get(response, self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].idJsonPath));
            } else {
              if (self.props.actionName == 'update') {
                var hash = window.location.hash.replace(/(\#\/create\/|\#\/update\/)/, '/view/');
              } else {
                var hash =
                  window.location.hash.replace(/(\#\/create\/|\#\/update\/)/, '/view/') +
                  '/' +
                  _.get(response, self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].idJsonPath);
              }
            }

            self.props.setRoute(hash);
          }
        }, 1500);
      },
      function(err) {
        self.props.setLoadingStatus('hide');
        self.props.toggleSnackbarAndSetText(true, err.message, false, true);
      }
    );
  };

  //Needs to be changed later for more customfields
  checkCustomFields = (formData, cb) => {
    var self = this;
    if (
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].customFields &&
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].customFields.initiatorPosition
    ) {
      var jPath = self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].customFields.initiatorPosition;
      getInitiatorPosition(function(err, pos) {
        if (err) {
          self.toggleSnackbarAndSetText(true, err.message, false, true);
        } else {
          _.set(formData, jPath, pos);
          cb(formData);
        }
      });
    } else {
      cb(formData);
    }
  };

  getVal = (path, dateBool) => {
    var _val = _.get(this.props.formData, path);
    if (dateBool && typeof _val == 'string' && _val && _val.indexOf('-') > -1) {
      var _date = _val.split('-');
      return new Date(_date[0], Number(_date[1]) - 1, _date[2]);
    }

    return typeof _val != 'undefined' ? _val : '';
  };

  hideField = (_mockData, hideObject, reset) => {
    let { moduleName, actionName, setFormData, delRequiredFields, removeFieldErrors, addRequiredFields } = this.props;
    let _formData = { ...this.props.formData };
    if (hideObject.isField) {
      for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
        for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
          if (hideObject.name == _mockData[moduleName + '.' + actionName].groups[i].fields[j].name) {
            _mockData[moduleName + '.' + actionName].groups[i].fields[j].hide = reset ? false : true;
            if (!reset) {
              _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
              setFormData(_formData);
              //Check if required is true, if yes remove from required fields
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
                delRequiredFields([_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath]);
                removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
              }
            } else if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
              addRequiredFields([_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath]);
            }

            break;
          }
        }
      }
    } else {
      let flag = 0;
      for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
        if (hideObject.name == _mockData[moduleName + '.' + actionName].groups[i].name) {
          flag = 1;

          _mockData[moduleName + '.' + actionName].groups[i].hide = reset ? false : true;
          if (!reset) {
            var _rReq = [];
            for (var j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
              _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
                _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
                removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
              }
            }
            delRequiredFields(_rReq);
            setFormData(_formData);
          } else {
            var _rReq = [];
            for (var j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired)
                _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
            }
            addRequiredFields(_rReq);
          }
          break;
        }
      }

      if (flag == 0) {
        for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
          if (_mockData[moduleName + '.' + actionName].groups[i].children && _mockData[moduleName + '.' + actionName].groups[i].children.length) {
            for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].children.length; j++) {
              for (let k = 0; k < _mockData[moduleName + '.' + actionName].groups[i].children[j].groups.length; k++) {
                if (hideObject.name == _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].name) {
                  _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].hide = reset ? false : true;
                  if (!reset) {
                    var _rReq = [];
                    for (let a = 0; a < _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields.length; a++) {
                      _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].jsonPath, '');
                      if (_mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].isRequired) {
                        _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].jsonPath);
                        removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].jsonPath);
                      }
                    }
                    delRequiredFields(_rReq);
                    setFormData(_formData);
                  } else {
                    var _rReq = [];
                    for (let a = 0; a < _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields.length; a++) {
                      if (_mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].isRequired)
                        _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].jsonPath);
                    }
                    addRequiredFields(_rReq);
                  }
                }
              }
            }
          }
        }
      }
    }

    return _mockData;
  };

  showField = (_mockData, showObject, reset) => {
    let { moduleName, actionName, setFormData, delRequiredFields, removeFieldErrors, addRequiredFields } = this.props;
    let _formData = { ...this.props.formData };
    if (showObject.isField) {
      for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
        for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
          if (showObject.name == _mockData[moduleName + '.' + actionName].groups[i].fields[j].name) {
            _mockData[moduleName + '.' + actionName].groups[i].fields[j].hide = reset ? true : false;
            if (!reset) {
              _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
              setFormData(_formData);
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
                addRequiredFields([_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath]);
              }
            } else if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
              delRequiredFields([_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath]);
              removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
            }
            break;
          }
        }
      }
    } else {
      let flag = 0;
      for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
        if (showObject.name == _mockData[moduleName + '.' + actionName].groups[i].name) {
          flag = 1;
          _mockData[moduleName + '.' + actionName].groups[i].hide = reset ? true : false;
          if (!reset) {
            var _rReq = [];
            for (var j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
              _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired)
                _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
            }

            addRequiredFields(_rReq);
            setFormData(_formData);
          } else {
            var _rReq = [];
            for (var j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
                _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
                removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
              }
            }
            delRequiredFields(_rReq);
          }
          break;
        }
      }

      if (flag == 0) {
        for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
          if (_mockData[moduleName + '.' + actionName].groups[i].children && _mockData[moduleName + '.' + actionName].groups[i].children.length) {
            for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].children.length; j++) {
              for (let k = 0; k < _mockData[moduleName + '.' + actionName].groups[i].children[j].groups.length; k++) {
                if (showObject.name == _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].name) {
                  _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].hide = reset ? true : false;
                  /*if(!reset) {

                  } else {

                  }*/
                }
              }
            }
          }
        }
      }
    }

    return _mockData;
  };

  enField = (_mockData, enableStr, reset) => {
    let { moduleName, actionName, setFormData } = this.props;
    let _formData = { ...this.props.formData };
    for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
      for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
        if (enableStr == _mockData[moduleName + '.' + actionName].groups[i].fields[j].name) {
          _mockData[moduleName + '.' + actionName].groups[i].fields[j].isDisabled = reset ? true : false;
          if (!reset) {
            _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
            setFormData(_formData);
          }
          break;
        }
      }
    }

    return _mockData;
  };

  disField = (_mockData, disableStr, reset) => {
    let { moduleName, actionName, setFormData } = this.props;
    let _formData = { ...this.props.formData };
    for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
      for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
        if (disableStr == _mockData[moduleName + '.' + actionName].groups[i].fields[j].name) {
          _mockData[moduleName + '.' + actionName].groups[i].fields[j].isDisabled = reset ? false : true;
          if (!reset) {
            _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
            setFormData(_formData);
          }

          break;
        }
      }
    }

    return _mockData;
  };

  checkIfHasEnDisFields = (jsonPath, val) => {
    let _mockData = { ...this.props.mockData };
    let { moduleName, actionName, setMockData } = this.props;
    for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
      for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
        if (
          jsonPath == _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath &&
          _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields &&
          _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields.length
        ) {
          for (let k = 0; k < _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields.length; k++) {
            if (val == _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].ifValue) {
              for (let y = 0; y < _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].disable.length; y++) {
                _mockData = this.disField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].disable[y]);
              }

              for (let z = 0; z < _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].enable.length; z++) {
                _mockData = this.enField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].enable[z]);
              }
            } else {
              for (let y = 0; y < _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].disable.length; y++) {
                _mockData = this.disField(
                  _mockData,
                  _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].disable[y],
                  true
                );
              }

              for (let z = 0; z < _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].enable.length; z++) {
                _mockData = this.enField(
                  _mockData,
                  _mockData[moduleName + '.' + actionName].groups[i].fields[j].enableDisableFields[k].enable[z],
                  true
                );
              }
            }
          }
        }
      }
    }

    setMockData(_mockData);
  };

  checkIfHasShowHideFields = (jsonPath, val) => {
    let _mockData = { ...this.props.mockData };
    let { moduleName, actionName, setMockData } = this.props;
    for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
      for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
        if (
          jsonPath == _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath &&
          _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields &&
          _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields.length
        ) {
          for (let k = 0; k < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields.length; k++) {
            if (val == _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].ifValue) {
              for (let y = 0; y < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide.length; y++) {
                _mockData = this.hideField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide[y]);
              }

              for (let z = 0; z < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length; z++) {
                _mockData = this.showField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show[z]);
              }
            } else {
              for (let y = 0; y < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide.length; y++) {
                _mockData = this.hideField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide[y], true);
              }

              for (let z = 0; z < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length; z++) {
                _mockData = this.showField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show[z], true);
              }
            }
          }
        }
      }
    }

    setMockData(_mockData);
  };

  handleChange = (e, property, isRequired, pattern, requiredErrMsg = 'Required', patternErrMsg = 'Pattern Missmatch') => {
    let { getVal } = this;
    let { handleChange, mockData, setDropDownData } = this.props;
    let hashLocation = window.location.hash;
    let obj = specifications['wc.create'];
    // console.log(obj);
    let depedants = jp.query(obj, `$.groups..fields[?(@.jsonPath=="${property}")].depedants.*`);
    this.checkIfHasShowHideFields(property, e.target.value);
    this.checkIfHasEnDisFields(property, e.target.value);

    handleChange(e, property, isRequired, pattern, requiredErrMsg, patternErrMsg);

    if (property == 'Connection[0].workflowDetails.department' || property == 'Connection[0].workflowDetails.designation') {
      this.getEmployee();
    }
    _.forEach(depedants, function(value, key) {
      if (value.type == 'dropDown') {
        let splitArray = value.pattern.split('?');
        let context = '';
        let id = {};
        // id[splitArray[1].split("&")[1].split("=")[0]]=e.target.value;
        for (var j = 0; j < splitArray[0].split('/').length; j++) {
          context += splitArray[0].split('/')[j] + '/';
        }

        let queryStringObject = splitArray[1].split('|')[0].split('&');
        for (var i = 0; i < queryStringObject.length; i++) {
          if (i) {
            if (queryStringObject[i].split('=')[1].search('{') > -1) {
              if (
                queryStringObject[i]
                  .split('=')[1]
                  .split('{')[1]
                  .split('}')[0] == property
              ) {
                id[queryStringObject[i].split('=')[0]] = e.target.value || '';
              } else {
                id[queryStringObject[i].split('=')[0]] = getVal(
                  queryStringObject[i]
                    .split('=')[1]
                    .split('{')[1]
                    .split('}')[0]
                );
              }
            } else {
              id[queryStringObject[i].split('=')[0]] = queryStringObject[i].split('=')[1];
            }
          }
        }

        Api.commonApiPost(context, id).then(
          function(response) {
            let keys = jp.query(response, splitArray[1].split('|')[1]);
            let values = jp.query(response, splitArray[1].split('|')[2]);
            let dropDownData = [];
            for (var k = 0; k < keys.length; k++) {
              let obj = {};
              obj['key'] = keys[k];
              obj['value'] = values[k];
              dropDownData.push(obj);
            }
            setDropDownData(value.jsonPath, dropDownData);
          },
          function(err) {
            console.log(err);
          }
        );
        // console.log(id);
        // console.log(context);
      } else if (value.type == 'textField') {
        let object = {
          target: {
            value: eval(eval(value.pattern)),
          },
        };
        handleChange(object, value.jsonPath, value.isRequired, value.rg, value.requiredErrMsg, value.patternErrMsg);
      }
    });
  };

  incrementIndexValue = (group, jsonPath) => {
    let { formData } = this.props;
    var length = _.get(formData, jsonPath) ? _.get(formData, jsonPath).length : 0;
    var _group = JSON.stringify(group);
    var regexp = new RegExp(jsonPath + '\\[\\d{1}\\]', 'g');
    _group = _group.replace(regexp, jsonPath + '[' + (length + 1) + ']');
    return JSON.parse(_group);
  };

  getNewSpecs = (group, updatedSpecs, path) => {
    let { moduleName, actionName } = this.props;
    let groupsArray = _.get(updatedSpecs[moduleName + '.' + actionName], path);
    groupsArray.push(group);
    _.set(updatedSpecs[moduleName + '.' + actionName], path, groupsArray);
    return updatedSpecs;
  };

  getPath = value => {
    let { mockData, moduleName, actionName } = this.props;
    const getFromGroup = function(groups) {
      for (var i = 0; i < groups.length; i++) {
        if (groups[i].children) {
          for (var j = 0; j < groups[i].children.length; i++) {
            if (groups[i].children[j].jsonPath == value) {
              return 'groups[' + i + '].children[' + j + '].groups';
            } else {
              return 'groups[' + i + '].children[' + j + '][' + getFromGroup(groups[i].children[j].groups) + ']';
            }
          }
        }
      }
    };

    return getFromGroup(mockData[moduleName + '.' + actionName].groups);
  };

  addNewCard = (group, jsonPath, groupName) => {
    let self = this;
    let { setMockData, metaData, moduleName, actionName, setFormData, formData } = this.props;
    let mockData = { ...this.props.mockData };
    if (!jsonPath) {
      for (var i = 0; i < metaData[moduleName + '.' + actionName].groups.length; i++) {
        if (groupName == metaData[moduleName + '.' + actionName].groups[i].name) {
          var _groupToBeInserted = {
            ...metaData[moduleName + '.' + actionName].groups[i],
          };
          for (var j = mockData[moduleName + '.' + actionName].groups.length - 1; j >= 0; j--) {
            if (groupName == mockData[moduleName + '.' + actionName].groups[j].name) {
              var regexp = new RegExp(
                mockData[moduleName + '.' + actionName].groups[j].jsonPath.replace(/\[/g, '\\[').replace(/\]/g, '\\]') + '\\[\\d{1}\\]',
                'g'
              );
              var stringified = JSON.stringify(_groupToBeInserted);
              var ind = mockData[moduleName + '.' + actionName].groups[j].index || 0;
              //console.log(ind);
              _groupToBeInserted = JSON.parse(
                stringified.replace(regexp, mockData[moduleName + '.' + actionName].groups[i].jsonPath + '[' + (ind + 1) + ']')
              );
              _groupToBeInserted.index = ind + 1;
              mockData[moduleName + '.' + actionName].groups.splice(j + 1, 0, _groupToBeInserted);
              //console.log(mockData[moduleName + "." + actionName].groups);
              setMockData(mockData);
              var temp = { ...formData };
              self.setDefaultValues(mockData[moduleName + '.' + actionName].groups, temp);
              setFormData(temp);
              break;
            }
          }
          break;
        }
      }
    } else {
      group = JSON.parse(JSON.stringify(group));
      //Increment the values of indexes
      var grp = _.get(metaData[moduleName + '.' + actionName], self.getPath(jsonPath) + '[0]');
      group = this.incrementIndexValue(grp, jsonPath);
      //Push to the path
      var updatedSpecs = this.getNewSpecs(group, JSON.parse(JSON.stringify(mockData)), self.getPath(jsonPath));
      //Create new mock data
      setMockData(updatedSpecs);
    }
  };

  removeCard = (jsonPath, index, groupName) => {
    //Remove at that index and update upper array values
    let { setMockData, moduleName, actionName, setFormData } = this.props;
    let _formData = { ...this.props.formData };
    let self = this;
    let mockData = { ...this.props.mockData };

    if (!jsonPath) {
      var ind = 0;
      for (let i = 0; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
        if (index == i && groupName == mockData[moduleName + '.' + actionName].groups[i].name) {
          mockData[moduleName + '.' + actionName].groups.splice(i, 1);
          ind = i;
          break;
        }
      }

      for (let i = ind; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
        if (mockData[moduleName + '.' + actionName].groups[i].name == groupName) {
          var regexp = new RegExp(
            mockData[moduleName + '.' + actionName].groups[i].jsonPath.replace(/\[/g, '\\[').replace(/\]/g, '\\]') + '\\[\\d{1}\\]',
            'g'
          );
          //console.log(regexp);
          //console.log(mockData[moduleName + "." + actionName].groups[i].index);
          //console.log(mockData[moduleName + "." + actionName].groups[i].index);
          var stringified = JSON.stringify(mockData[moduleName + '.' + actionName].groups[i]);
          mockData[moduleName + '.' + actionName].groups[i] = JSON.parse(
            stringified.replace(
              regexp,
              mockData[moduleName + '.' + actionName].groups[i].jsonPath + '[' + (mockData[moduleName + '.' + actionName].groups[i].index - 1) + ']'
            )
          );

          if (_.get(_formData, mockData[moduleName + '.' + actionName].groups[i].jsonPath)) {
            var grps = [..._.get(_formData, mockData[moduleName + '.' + actionName].groups[i].jsonPath)];
            //console.log(mockData[moduleName + "." + actionName].groups[i].index-1);
            grps.splice(mockData[moduleName + '.' + actionName].groups[i].index - 1, 1);
            //console.log(grps);
            _.set(_formData, mockData[moduleName + '.' + actionName].groups[i].jsonPath, grps);
            //console.log(_formData);
            setFormData(_formData);
          }
        }
      }
      //console.log(mockData[moduleName + "." + actionName].groups);
      setMockData(mockData);
    } else {
      var _groups = _.get(mockData[moduleName + '.' + actionName], self.getPath(jsonPath));
      _groups.splice(index, 1);
      var regexp = new RegExp('\\[\\d{1}\\]', 'g');
      for (var i = index; i < _groups.length; i++) {
        var stringified = JSON.stringify(_groups[i]);
        _groups[i] = JSON.parse(stringified.replace(regexp, '[' + i + ']'));
      }

      _.set(mockData, self.getPath(jsonPath), _groups);
      setMockData(mockData);
    }
  };

  addMaterial = e => {
    e.preventDefault();
    var formData = { ...this.props.formData };
    formData.Connection[0].estimationCharge[0].materials.push({
      ...defaultMat,
    });
    this.props.setFormData(formData);
  };

  removeMaterial = (e, ind) => {
    e.preventDefault();
    var formData = { ...this.props.formData };
    formData.Connection[0].estimationCharge[0].materials.splice(ind, 1);
    this.props.setFormData(formData);
  };

  getPosition = id => {
    var tempEmploye = {};
    for (var i = 0; i < this.state.employees.length; i++) {
      if (this.state.employees[i].id == id) {
        tempEmploye = this.state.employees[i];
      }
    }

    if (tempEmploye && tempEmploye.assignments) {
      return tempEmploye.assignments[0].position;
    } else {
      return '';
    }
  };

  initiateWF = action => {
    let self = this;
    var formData = { ...this.props.formData };
    formData.Connection[0].acknowledgementNumber = AckNumber;
    if (formData.Connection[0].hscPipeSizeType) {
      formData.Connection[0].hscPipeSizeType = self.state.pipeSize[formData.Connection[0].hscPipeSizeType] || formData.Connection[0].hscPipeSizeType;
    }

    // if(!self.state.disable && (!formData.Connection[0].estimationCharge[0].materials[0].name || !formData.Connection[0].estimationCharge[0].roadCutCharges || !formData.Connection[0].estimationCharge[0].specialSecurityCharges)) {
    //   return self.props.toggleSnackbarAndSetText(true, translate("wc.create.workflow.fields"), false, true);
    // }

    if (!formData.Connection[0].workflowDetails) formData.Connection[0].workflowDetails = {};

    if (!self.state.hide && !formData.Connection[0].workflowDetails.assignee) {
      return self.props.toggleSnackbarAndSetText(true, translate('wc.create.workflow.fields'), false, true);
    }

    if (action.key.toLowerCase() == 'reject' && !formData.Connection[0].workflowDetails.comments) {
      return self.props.toggleSnackbarAndSetText(true, translate('wc.create.workflow.comment'), false, true);
    }

    if (!self.state.hide) formData.Connection[0].workflowDetails.assignee = this.getPosition(formData.Connection[0].workflowDetails.assignee);
    formData.Connection[0].workflowDetails.action = action.key;
    formData.Connection[0].workflowDetails.status = this.state.status;

    self.props.setLoadingStatus('loading');
    delete formData.ResponseInfo;
    delete formData.Connection[0].estimationCharge;
    delete formData.Connection[0].meter;
    var objFormData = {
      Connection: formData.Connection[0],
    };
    Api.commonApiPost('/wcms-connection/connection/_update', {}, objFormData, null, true).then(
      function(res) {
        self.props.setLoadingStatus('hide');
        if (action.key.toLowerCase() == 'approve' && formData.Connection[0].status == 'VERIFIED') {
          console.log('hit');
          self.doInitialStuffs();
          // generateEstNotice(res.Connection[0], self.props.tenantInfo ? self.props.tenantInfo[0] : "");
        } else if (action.key.toLowerCase() == 'Generate workOrder' && formData.Connection[0].status == 'WORKORDERGENERATED') {
          self.doInitialStuffsForWc();
          // generateWO(res.Connection[0], self.props.tenantInfo ? self.props.tenantInfo[0] : "");
        } else if (action.key.toLowerCase() == 'print' && formData.Connection[0].status == 'APPROVED') {
          self.doInitialStuffs();
          // generateWO(res.Connection[0], self.props.tenantInfo ? self.props.tenantInfo[0] : "");
        }
        self.props.toggleSnackbarAndSetText(true, 'Forward Successfully!', true, false);
        setTimeout(function() {
          //self.props.setRoute("/wc/acknowledgement/" + encodeURIComponent(res.Connection[0].acknowledgementNumber)+ "/"+ res.Connection[0].status);
        }, 5000);
      },
      function(err) {
        self.props.setLoadingStatus('hide');
        self.props.toggleSnackbarAndSetText(true, err.message, false, true);
      }
    );
  };

  calcAmt = i => {
    if (
      this.props.formData.Connection[0].estimationCharge[0].materials[i].quantity &&
      this.props.formData.Connection[0].estimationCharge[0].materials[i].size &&
      this.props.formData.Connection[0].estimationCharge[0].materials[i].rate
    ) {
      var val =
        Number(this.props.formData.Connection[0].estimationCharge[0].materials[i].quantity) *
        Number(this.props.formData.Connection[0].estimationCharge[0].materials[i].size) *
        Number(this.props.formData.Connection[0].estimationCharge[0].materials[i].rate);
      this.handleChange({ target: { value: val } }, 'Connection[0].estimationCharge[0].materials[' + i + '].amountDetails', false, '');
      var sum = 0;
      for (var j = 0; j < this.props.formData.Connection[0].estimationCharge[0].materials.length; j++) {
        if (this.props.formData.Connection[0].estimationCharge[0].materials[j].amountDetails)
          sum += Number(this.props.formData.Connection[0].estimationCharge[0].materials[j].amountDetails);
      }

      this.handleChange({ target: { value: sum } }, 'Connection[0].estimationCharge[0].estimationCharges', false, '');
      this.handleChange({ target: { value: parseInt(sum * (15 / 100)) } }, 'Connection[0].estimationCharge[0].supervisionCharges', false, '');
    }
  };

  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors, isFormValid } = this.props;
    let { create, handleChange, getVal, addNewCard, removeCard, autoComHandler } = this;
    let self = this;
    // const renderEstimateBody = function() {
    // 	{return formData && formData.Connection && formData.Connection[0] && formData.Connection[0].estimationCharge && formData.Connection[0].estimationCharge[0].materials && formData.Connection[0].estimationCharge[0].materials.map(function(v, i){
    // 		return (
    // 			<tr>
    // 				<td>
    // 					{i+1}
    // 				</td>
    // 				<td>
    // 					<TextField
    // 						disabled = {self.state.disable}
    // 						value={formData.Connection[0].estimationCharge[0].materials[i].name}
    // 						onChange={(e) => {
    // 							handleChange(e, "Connection[0].estimationCharge[0].materials[" + i + "].name", false, "")
    // 						}}/>
    // 				</td>
    // 				<td>
    // 					<TextField
    // 						disabled = {self.state.disable}
    // 						value={formData.Connection[0].estimationCharge[0].materials[i].quantity}
    // 						onChange={(e) => {
    // 							handleChange(e, "Connection[0].estimationCharge[0].materials[" + i + "].quantity", false, "")
    // 							self.calcAmt(i);
    // 						}}/>
    // 				</td>
    // 				<td>
    // 					<TextField
    // 						disabled = {self.state.disable}
    // 						value={formData.Connection[0].estimationCharge[0].materials[i].size}
    // 						onChange={(e) => {
    // 							handleChange(e, "Connection[0].estimationCharge[0].materials[" + i + "].size", false, "")
    // 							self.calcAmt(i);
    // 						}}/>
    // 				</td>
    // 				<td>
    // 					<TextField
    // 						disabled = {self.state.disable}
    // 						value={formData.Connection[0].estimationCharge[0].materials[i].rate}
    // 						onChange={(e) => {
    // 							handleChange(e, "Connection[0].estimationCharge[0].materials[" + i + "].rate", false, "")
    // 							self.calcAmt(i);
    // 						}}/>
    // 				</td>
    // 				<td>
    // 					<TextField
    // 						disabled = {self.state.disable}
    // 						value={formData.Connection[0].estimationCharge[0].materials[i].amountDetails}
    // 						disabled={true}
    // 						onChange={(e) => {
    // 							handleChange(e, "Connection[0].estimationCharge[0].materials[" + i + "].amountDetails", false, "")
    // 						}}/>
    // 				</td>
    // 				<td>
    // 					{(i == formData.Connection[0].estimationCharge[0].materials.length-1) && <span onClick={(e) => {self.addMaterial(e)}} className="glyphicon glyphicon-plus"></span>}
    // 					{(i < formData.Connection[0].estimationCharge[0].materials.length-1) && <span onClick={(e) => {self.removeMaterial(e)}} className="glyphicon glyphicon-trash"></span>}
    // 				</td>
    // 			</tr>
    // 		)
    // 	})}
    // }

    const renderWorkflowHistory = function() {
      {
        return (
          self.state.workflow &&
          self.state.workflow.map(function(v, i) {
            return (
              <tr key={i}>
                <td>{v.createdDate}</td>
                <td>{v.senderName}</td>
                <td>{v.status}</td>
                <td>{v.owner.name || '-'}</td>
                <td>{v.comments}</td>
              </tr>
            );
          })
        );
      }
    };

    const renderFiles = function() {
      {
        return (
          formData &&
          formData.Connection &&
          formData.Connection[0] &&
          formData.Connection[0].documents &&
          formData.Connection[0].documents.length &&
          formData.Connection[0].documents.map(function(v, i) {
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{v.name}</td>
                <td>
                  <a
                    href={window.location.origin + '/' + CONST_API_GET_FILE + '?tenantId=' + localStorage.tenantId + '&fileStoreId=' + v.fileStoreId}
                    target="_blank"
                  >
                    Download
                  </a>
                </td>
              </tr>
            );
          })
        );
      }
    };
    if (self.state.downloadReady) {
      return (
        <PdfViewer pdfData={this.state.pdfData} title="tl.rejection.letter.title">
          <div className="text-center">
            <RaisedButton href={this.state.pdfData} download label={translate('tl.download')} download primary={true} />
          </div>
        </PdfViewer>
      );
    }

    return (
      <div className="Report">
        {!_.isEmpty(mockData) &&
          moduleName &&
          actionName && (
            <ShowFields
              groups={mockData[`${moduleName}.${actionName}`].groups}
              noCols={mockData[`${moduleName}.${actionName}`].numCols}
              ui="google"
              handler={handleChange}
              getVal={getVal}
              fieldErrors={fieldErrors}
              useTimestamp={mockData[`${moduleName}.${actionName}`].useTimestamp || false}
              addNewCard={addNewCard}
              removeCard={removeCard}
              autoComHandler={autoComHandler}
            />
          )}
        <Card className="uiCard">
          <CardHeader
            title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('employee.Employee.fields.documents')}</div>}
          />
          <CardText>
            <Table bordered responsive className="table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{translate('wc.create.name')}</th>
                  <th>{translate('employee.Assignment.fields.action')}</th>
                </tr>
              </thead>
              <tbody>{renderFiles()}</tbody>
            </Table>
          </CardText>
        </Card>

        <Card className="uiCard">
          <CardHeader
            title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('wc.create.workflow.applicationHistory')}</div>}
          />
          <CardText>
            <Table bordered responsive className="table-striped">
              <thead>
                <tr>
                  <th>{translate('employee.ServiceHistory.fields.date')}</th>
                  <th>{translate('wc.create.workflow.UpdatedBy')}</th>
                  <th>{translate('collection.create.status')}</th>
                  <th>{translate('wc.create.workflow.currentOwner')}</th>
                  <th>{translate('reports.common.comments')}</th>
                </tr>
              </thead>
              <tbody>{renderWorkflowHistory()}</tbody>
            </Table>
          </CardText>
        </Card>
        <Card className="uiCard">
          <CardHeader
            title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('wc.create.workflow.workflowDetails')}</div>}
          />
          <CardText>
            {!self.state.hide && (
              <Row>
                <Col xs={12} md={3}>
                  <SelectField
                    dropDownMenuProps={{
                      animated: true,
                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelFixed={true}
                    floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
                    floatingLabelText={
                      <span>
                        {translate('employee.Assignment.fields.department')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    value={
                      formData.Connection && formData.Connection[0] && formData.Connection[0].workflowDetails
                        ? formData.Connection[0].workflowDetails.department
                        : ''
                    }
                    onChange={(event, key, value) => {
                      handleChange({ target: { value } }, 'Connection[0].workflowDetails.department', true, '');
                    }}
                  >
                    {self.state.departments &&
                      self.state.departments.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                      })}
                  </SelectField>
                </Col>
                <Col xs={12} md={3}>
                  <SelectField
                    floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{
                      animated: true,
                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={
                      <span>
                        {translate('employee.Assignment.fields.designation')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    value={
                      formData.Connection && formData.Connection[0] && formData.Connection[0].workflowDetails
                        ? formData.Connection[0].workflowDetails.designation
                        : ''
                    }
                    onChange={(event, key, value) => {
                      handleChange({ target: { value } }, 'Connection[0].workflowDetails.designation', true, '');
                    }}
                  >
                    {self.state.designations &&
                      self.state.designations.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                      })}
                  </SelectField>
                </Col>
                <Col xs={12} md={3}>
                  <SelectField
                    floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{
                      animated: true,
                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={
                      <span>
                        {translate('wc.create.groups.approvalDetails.fields.approver')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    value={
                      formData.Connection && formData.Connection[0] && formData.Connection[0].workflowDetails
                        ? formData.Connection[0].workflowDetails.assignee
                        : ''
                    }
                    onChange={(event, key, value) => {
                      handleChange({ target: { value } }, 'Connection[0].workflowDetails.assignee', true, '');
                    }}
                  >
                    {self.state.employees &&
                      self.state.employees.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                      })}
                  </SelectField>
                </Col>
              </Row>
            )}
            <Row>
              <Col xs={12} md={12}>
                <TextField
                  floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
                  floatingLabelFixed={true}
                  type="text"
                  multiple={true}
                  fullWidth={true}
                  rows={3}
                  floatingLabelText={translate('wc.create.groups.approvalDetails.fields.comments')}
                  value={
                    formData.Connection && formData.Connection[0] && formData.Connection[0].workflowDetails
                      ? formData.Connection[0].workflowDetails.comments
                      : ''
                  }
                  onChange={e => {}}
                />
              </Col>
            </Row>
          </CardText>
        </Card>
        <br />

        <div style={{ textAlign: 'center' }}>
          {self.state.buttons &&
            self.state.buttons.map(function(v, i) {
              return (
                <span>
                  <RaisedButton
                    onClick={e => {
                      self.initiateWF(v);
                    }}
                    label={v.name}
                    primary={true}
                  />&nbsp;&nbsp;
                </span>
              );
            })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  metaData: state.framework.metaData,
  mockData: state.framework.mockData,
  moduleName: state.framework.moduleName,
  actionName: state.framework.actionName,
  formData: state.frameworkForm.form,
  fieldErrors: state.frameworkForm.fieldErrors,
  isFormValid: state.frameworkForm.isFormValid,
  requiredFields: state.frameworkForm.requiredFields,
  tenantInfo: state.common.tenantInfo,
});

const mapDispatchToProps = dispatch => ({
  initForm: requiredFields => {
    dispatch({
      type: 'SET_REQUIRED_FIELDS',
      requiredFields,
    });
  },
  setMetaData: metaData => {
    dispatch({ type: 'SET_META_DATA', metaData });
  },
  setMockData: mockData => {
    dispatch({ type: 'SET_MOCK_DATA', mockData });
  },
  setFormData: data => {
    dispatch({ type: 'SET_FORM_DATA', data });
  },
  setModuleName: moduleName => {
    dispatch({ type: 'SET_MODULE_NAME', moduleName });
  },
  setActionName: actionName => {
    dispatch({ type: 'SET_ACTION_NAME', actionName });
  },
  handleChange: (e, property, isRequired, pattern, requiredErrMsg, patternErrMsg) => {
    dispatch({
      type: 'HANDLE_CHANGE_FRAMEWORK',
      property,
      value: e.target.value,
      isRequired,
      pattern,
      requiredErrMsg,
      patternErrMsg,
    });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg, isSuccess, isError) => {
    dispatch({
      type: 'TOGGLE_SNACKBAR_AND_SET_TEXT',
      snackbarState,
      toastMsg,
      isSuccess,
      isError,
    });
  },
  setDropDownData: (fieldName, dropDownData) => {
    dispatch({ type: 'SET_DROPDWON_DATA', fieldName, dropDownData });
  },
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
  delRequiredFields: requiredFields => {
    dispatch({ type: 'DEL_REQUIRED_FIELDS', requiredFields });
  },
  addRequiredFields: requiredFields => {
    dispatch({ type: 'ADD_REQUIRED_FIELDS', requiredFields });
  },
  removeFieldErrors: key => {
    dispatch({ type: 'REMOVE_FROM_FIELD_ERRORS', key });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Report);
