import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

import _ from 'lodash';
import ShowFields from './showFields';

import { translate } from '../common/common';

import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Upload from 'material-ui-upload/Upload';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { blue800, red500, white } from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import Api from '../../api/api';
import jp from 'jsonpath';
import UiButton from './components/UiButton';
import { fileUpload } from './utility/utility';
import UiTable from './components/UiTable';
import jsPDF from 'jspdf';
import Workflow from './specs/pt/Workflow';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

var specifications = {};

let reqRequired = [];

const styles = {
  errorStyle: {
    color: red500,
  },
  underlineStyle: {},
  underlineFocusStyle: {},
  floatingLabelStyle: {
    color: '#354f57',
  },
  floatingLabelFocusStyle: {
    color: '#354f57',
  },
  customWidth: {
    width: 100,
  },
  checkbox: {
    marginBottom: 0,
    marginTop: 15,
  },
  uploadButton: {
    verticalAlign: 'middle',
  },
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
  floatButtonMargin: {
    marginLeft: 20,
    fontSize: 12,
    width: 30,
    height: 30,
  },
  iconFont: {
    fontSize: 17,
    cursor: 'pointer',
  },
  radioButton: {
    marginBottom: 0,
  },
  actionWidth: {
    width: 160,
  },
  reducePadding: {
    paddingTop: 4,
    paddingBottom: 0,
  },
  noPadding: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  noMargin: {
    marginBottom: 0,
  },
  textRight: {
    textAlign: 'right',
  },
  chip: {
    marginTop: 4,
  },
};

function getPosition(objArray, id) {
  if (id == '' || id == null) {
    return false;
  }

  for (var i = 0; i < objArray.length; i++) {
    if (objArray[i].id == id) {
      return objArray[i].assignments[0].position;
    }
  }
}

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

const getNameByCode = function(object, code, property = '') {
  if (code == '' || code == null) {
    return '';
  }
  for (var i = 0; i < object.length; i++) {
    if (property == '') {
      if (object[i].code == code) {
        return object[i].name;
      }
    } else {
      if (object[i].hasOwnProperty(property)) {
        if (object[i].code == code) {
          return object[i][property];
        }
      } else {
        return '';
      }
    }
  }
  return '';
};

class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResult: [],
      buttons: [],
      employee: [],
      designation: [],
      workflowDepartment: [],
      process: [],
      forward: false,
      specialNotice: {},
      hasNotice: false,
      locality: [],
      usages: [],
      structureclasses: [],
      taxHeads: [],
    };
  }

  componentWillMount() {
    localStorage.setItem('propertyId', this.props.match.params.searchParam);
  }

  setLabelAndReturnRequired(configObject) {
    if (configObject && configObject.groups) {
      for (var i = 0; configObject && i < configObject.groups.length; i++) {
        configObject.groups[i].label = translate(configObject.groups[i].label);
        for (var j = 0; j < configObject.groups[i].fields.length; j++) {
          configObject.groups[i].fields[j].label = translate(configObject.groups[i].fields[j].label);
        }

        if (configObject.groups[i].children && configObject.groups[i].children.length) {
          for (var k = 0; k < configObject.groups[i].children.length; k++) {
            this.setLabelAndReturnRequired(configObject.groups[i].children[k]);
          }
        }
      }
    }
  }

  handleWorkFlowChange = (e, type) => {
    let currentThis = this;

    let query = {};

    let hasData = false;

    if (type == 'department' && e.target.value != '' && this.props.workflow.workflowDesignation) {
      console.log(type);
      query = {
        departmentId: e.target.value,
        designationId: this.props.workflow.workflowDesignation,
      };
      hasData = true;
    } else if (type == 'designation' && e.target.value != '' && this.props.workflow.workflowDepartment) {
      console.log(type);
      query = {
        departmentId: this.props.workflow.workflowDepartment,
        designationId: e.target.value,
      };
      hasData = true;
    } else {
      hasData = false;
    }

    if (hasData) {
      Api.commonApiPost('/hr-employee/employees/_search', query)
        .then(res => {
          currentThis.setState({ approver: res.Employee });
        })
        .catch(err => {
          currentThis.setState({
            approver: [],
          });
          console.log(err);
        });
    }
  };

  setInitialUpdateChildData(form, children) {
    let _form = JSON.parse(JSON.stringify(form));
    for (var i = 0; i < children.length; i++) {
      for (var j = 0; j < children[i].groups.length; j++) {
        if (children[i].groups[j].multiple) {
          var arr = _.get(_form, children[i].groups[j].jsonPath);
          var ind = j;
          var _stringifiedGroup = JSON.stringify(children[i].groups[j]);
          var regex = new RegExp(children[i].groups[j].jsonPath.replace('[', '[').replace(']', ']') + '\\[\\d{1}\\]', 'g');
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

  hideField(specs, moduleName, actionName, hideObject) {
    if (hideObject.isField) {
      for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
        for (let j = 0; j < specs[moduleName + '.' + actionName].groups[i].fields.length; j++) {
          if (hideObject.name == specs[moduleName + '.' + actionName].groups[i].fields[j].name) {
            specs[moduleName + '.' + actionName].groups[i].fields[j].hide = true;
            break;
          }
        }
      }
    } else {
      let flag = 0;
      for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
        if (hideObject.name == specs[moduleName + '.' + actionName].groups[i].name) {
          flag = 1;
          specs[moduleName + '.' + actionName].groups[i].hide = true;
          break;
        }
      }

      if (flag == 0) {
        for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
          if (specs[moduleName + '.' + actionName].groups[i].children && specs[moduleName + '.' + actionName].groups[i].children.length) {
            for (let j = 0; j < specs[moduleName + '.' + actionName].groups[i].children.length; j++) {
              for (let k = 0; k < specs[moduleName + '.' + actionName].groups[i].children[j].groups.length; k++) {
                if (hideObject.name == specs[moduleName + '.' + actionName].groups[i].children[j].groups[k].name) {
                  specs[moduleName + '.' + actionName].groups[i].children[j].groups[k].hide = true;
                  break;
                }
              }
            }
          }
        }
      }
    }
  }

  showField(specs, moduleName, actionName, showObject) {
    if (showObject.isField) {
      for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
        for (let j = 0; j < specs[moduleName + '.' + actionName].groups[i].fields.length; j++) {
          if (showObject.name == specs[moduleName + '.' + actionName].groups[i].fields[j].name) {
            specs[moduleName + '.' + actionName].groups[i].fields[j].hide = false;
            break;
          }
        }
      }
    } else {
      let flag = 0;
      for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
        if (showObject.name == specs[moduleName + '.' + actionName].groups[i].name) {
          flag = 1;
          specs[moduleName + '.' + actionName].groups[i].hide = false;
          break;
        }
      }

      if (flag == 0) {
        for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
          if (specs[moduleName + '.' + actionName].groups[i].children && specs[moduleName + '.' + actionName].groups[i].children.length) {
            for (let j = 0; j < specs[moduleName + '.' + actionName].groups[i].children.length; j++) {
              for (let k = 0; k < specs[moduleName + '.' + actionName].groups[i].children[j].groups.length; k++) {
                if (showObject.name == specs[moduleName + '.' + actionName].groups[i].children[j].groups[k].name) {
                  specs[moduleName + '.' + actionName].groups[i].children[j].groups[k].hide = false;
                  break;
                }
              }
            }
          }
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
                  this.hideField(specs, moduleName, actionName, specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide[a]);
                }
              }

              if (
                specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show &&
                specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length
              ) {
                for (var a = 0; a < specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length; a++) {
                  this.showField(specs, moduleName, actionName, specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show[a]);
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

  initData() {
    var current = this;

    try {
      var hash = window.location.hash.split('/');
      if (hash.length == 4) {
        specifications = require(`./specs/${hash[2]}/${hash[2]}`).default;
      } else {
        specifications = require(`./specs/${hash[2]}/master/${hash[3]}`).default;
      }
    } catch (e) {}

    let { setMetaData, setModuleName, setActionName, setMockData, workflow } = this.props;
    let hashLocation = window.location.hash;
    let self = this;
    let obj = specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`];
    self.setLabelAndReturnRequired(obj);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName(hashLocation.split('/')[2]);
    setActionName(hashLocation.split('/')[1]);
    //Get view form data
    var url = specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].url.split('?')[0];
    var hash = window.location.hash.split('/');
    var value = hash.length == 4 ? hash[3] : hash[4];
    var query = {
      [specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].url.split('?')[1].split('=')[0]]: value,
    };

    Api.commonApiPost(url, query, {}, false, specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].useTimestamp).then(
      function(res) {
        current.setState({
          searchResult: res.properties,
        });

        var workflowDetails = res.properties[0].propertyDetail.workFlowDetails;
        if (workflowDetails) {
          workflow.workflowDepartment = workflowDetails.department || null;
          workflow.workflowDesignation = workflowDetails.designation || null;
          workflow.approver = workflowDetails.assignee || null;
          workflow.initiatorPosition = workflowDetails.initiatorPosition || null;
        }

        var query = {
          id: res.properties[0].propertyDetail.stateId,
        };

        Api.commonApiPost('egov-common-workflows/process/_search', query, {}, false, true)
          .then(res => {
            console.log(res);

            current.setState({
              process: res.processInstance,
            });

            Api.commonApiPost(
              'egov-common-workflows/designations/_search?businessKey=Create Property&departmentRule=&currentStatus=' +
                res.processInstance.status +
                '&amountRule=&additionalRule=&pendingAction=&approvalDepartmentName=&designation&',
              {},
              {},
              false,
              false
            )
              .then(res => {
                for (var i = 0; i < res.length; i++) {
                  Api.commonApiPost('hr-masters/designations/_search', {
                    name: res[i].name,
                  })
                    .then(response => {
                      console.log(response);
                      response.Designation.unshift({ id: -1, name: 'None' });
                      current.setState({
                        ...current.state,
                        designation: [...current.state.designation, ...response.Designation],
                      });
                    })
                    .catch(err => {
                      current.setState({ designation: [] });
                      console.log(err);
                    });
                }
              })
              .catch(err => {
                current.setState({
                  designation: [],
                });
                console.log(err);
              });

            res.processInstance.attributes.validActions.values.map(item => {
              if (item.name == 'Forward') {
                current.setState({
                  forward: true,
                });
              }
            });

            current.setState({
              buttons: res.processInstance,
            });
          })
          .catch(err => {
            console.log(res);
            current.setState({
              buttons: [],
            });
          });

        self.props.setFormData(res);
        self.setInitialUpdateData(
          res,
          JSON.parse(JSON.stringify(specifications)),
          hashLocation.split('/')[2],
          hashLocation.split('/')[1],
          specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].objectName
        );
      },
      function(err) {}
    );
  }

  componentDidMount() {
    this.initData();
    this.props.initForm();

    var current = this;

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'LOCALITY',
      hierarchyTypeName: 'LOCATION',
    })
      .then(res => {
        current.setState({ locality: res.Boundary });
      })
      .catch(err => {
        current.setState({ locality: [] });
      });

    Api.commonApiPost('pt-property/property/structureclasses/_search')
      .then(res => {
        current.setState({ structureclasses: res.structureClasses });
      })
      .catch(err => {
        current.setState({ structureclasses: [] });
      });

    Api.commonApiPost('pt-property/property/usages/_search')
      .then(res => {
        current.setState({ usages: res.usageMasters });
      })
      .catch(err => {
        current.setState({ usages: [] });
      });

    Api.commonApiPost('egov-common-masters/departments/_search')
      .then(res => {
        res.Department.unshift({ id: -1, name: 'None' });
        current.setState({ workflowDepartment: res.Department });
      })
      .catch(err => {
        current.setState({ workflowDepartment: [] });
      });
  }

  updateInbox = (actionName, status) => {
    var currentThis = this;

    let { workflow, setLoadingStatus, toggleSnackbarAndSetText } = this.props;

    var data = this.state.searchResult;

    setLoadingStatus('loading');

    var workFlowDetails = {
      department: workflow.workflowDepartment || 'department',
      designation: workflow.workflowDesignation || 'designation',
      initiatorPosition: workflow.initiatorPosition || null,
      assignee: null,
      action: actionName,
      status: status,
    };

    if (actionName == 'Forward') {
      workFlowDetails.assignee = getPosition(this.state.approver, workflow.approver) || null;
      workFlowDetails.initiatorPosition = this.state.process.initiatorPosition || null;
      localStorage.setItem('inboxStatus', 'Forwarded');
    } else if (actionName == 'Approve') {
      workFlowDetails.assignee = this.state.process.initiatorPosition || null;
      workFlowDetails.initiatorPosition = this.state.process.initiatorPosition || null;
      localStorage.setItem('inboxStatus', 'Approved');
    } else if (actionName == 'Reject') {
      workFlowDetails.assignee = this.state.process.initiatorPosition || null;
      localStorage.setItem('inboxStatus', 'Rejected');
    } else if (actionName == 'Print Notice') {
      var body = {
        upicNo: data[0].upicNumber,
        tenantId: localStorage.getItem('tenantId') ? localStorage.getItem('tenantId') : 'default',
      };

      Api.commonApiPost('pt-property/properties/specialnotice/_generate', {}, body, false, true)
        .then(res => {
          currentThis.setState({
            specialNotice: res.notice,
            hasNotice: true,
          });

          var taxHeadsArray = [];

          if (res.notice.hasOwnProperty('taxDetails') && res.notice.taxDetails.hasOwnProperty('headWiseTaxes')) {
            res.notice.taxDetails.headWiseTaxes.map((item, index) => {
              taxHeadsArray.push(item.taxName);
            });
          }

          taxHeadsArray = taxHeadsArray.filter((item, index, array) => {
            return index == array.indexOf(item);
          });

          var query = {
            service: 'PT',
            code: taxHeadsArray,
          };

          Api.commonApiPost('/billing-service/taxheads/_search', query, {}, false, true)
            .then(res => {
              currentThis.setState({
                taxHeads: res.TaxHeadMasters,
              });
              setTimeout(() => {
                currentThis.generatePDF();
              }, 100);
            })
            .catch(err => {
              toggleSnackbarAndSetText(true, err.message);
              setLoadingStatus('hide');
              currentThis.setState({
                taxHeads: [],
              });
            });
        })
        .catch(err => {
          currentThis.setState({
            specialNotice: {},
            hasNotice: false,
          });
          setLoadingStatus('hide');
          toggleSnackbarAndSetText(true, err.message);
        });

      return false;
    }

    data[0].owners[0].tenantId = 'default';
    data[0].vltUpicNumber = null;
    data[0].gisRefNo = null;
    data[0].oldUpicNumber = null;

    data[0].propertyDetail.workFlowDetails = workFlowDetails;

    setLoadingStatus('loading');

    var body = {
      properties: data,
    };

    Api.commonApiPost('pt-property/properties/_update', {}, body, false, true)
      .then(res => {
        setLoadingStatus('hide');
        currentThis.props.history.push('/propertyTax/inbox-acknowledgement');
      })
      .catch(err => {
        console.log(err);
        setLoadingStatus('hide');
        toggleSnackbarAndSetText(true, err.message);
      });
  };

  getVal = path => {
    var val = _.get(this.props.formData, path);
    return typeof val != 'undefined' && (typeof val == 'string' || typeof val == 'number' || typeof val == 'boolean') ? val + '' : '';
  };

  generatePDF = () => {
    let { setLoadingStatus } = this.props;

    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    var cdn = `
      <!-- Latest compiled and minified CSS -->
      <link rel="stylesheet" media="all" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

      <!-- Optional theme -->
      <link rel="stylesheet" media="all" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">  
      <style>
        td {padding-top:15px !important;padding-bottom:15px !important;border-left:0px !important;border-right:0px !important;border-top:0px !important;border-bottom:0px !important;}
      </style>
      `;
    mywindow.document.write('<html><head><title> </title>');
    mywindow.document.write(cdn);
    mywindow.document.write('</head><body>');
    mywindow.document.write(document.getElementById('specialNotice').innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    setTimeout(function() {
      setLoadingStatus('hide');
      mywindow.print();
      mywindow.close();
    }, 1000);

    return true;
  };

  render() {
    const renderOption = function(list, listName = '') {
      if (list) {
        return list.map(item => {
          return <MenuItem key={item.id} value={item.id} primaryText={item.name} />;
        });
      }
    };

    var current = this;

    let { mockData, moduleName, actionName, formData, fieldErrors, workflow, handleChange } = this.props;
    let { getVal, addNewCard, removeCard, printer, handleWorkFlowChange } = this;

    const renderTable = function() {
      if (moduleName && actionName && formData && formData[objectName]) {
        var objectName = mockData[`${moduleName}.${actionName}`].objectName;
        if (formData[objectName].documents && formData[objectName].documents.length) {
          var dataList = {
            resultHeader: ['#', 'Name', 'File'],
            resultValues: [],
          };

          for (var i = 0; i < formData[objectName].documents.length; i++) {
            dataList.resultValues.push([
              i + 1,
              formData[objectName].documents[i].name || 'File',
              '<a href=/filestore/v1/files/id?tenantId=' +
                localStorage.getItem('tenantId') +
                '&fileStoreId=' +
                formData[objectName].documents[i].fileStoreId +
                '>Download</a>',
            ]);
          }

          return <UiTable resultList={dataList} />;
        }
      }
    };

    return (
      <div className="Inbox">
        <form id="printable">
          {!_.isEmpty(mockData) &&
            moduleName &&
            actionName &&
            mockData[`${moduleName}.${actionName}`] && (
              <ShowFields
                groups={mockData[`${moduleName}.${actionName}`].groups}
                noCols={mockData[`${moduleName}.${actionName}`].numCols}
                ui="google"
                handler={''}
                getVal={getVal}
                fieldErrors={fieldErrors}
                useTimestamp={mockData[`${moduleName}.${actionName}`].useTimestamp || false}
                addNewCard={''}
                removeCard={''}
                screen="view"
              />
            )}
          <br />
          {renderTable()}
          {this.state.buttons.hasOwnProperty('attributes') &&
            this.state.buttons.attributes.validActions.values.length > 0 &&
            this.state.forward && (
              <Card className="uiCard">
                <CardHeader
                  style={styles.reducePadding}
                  title={
                    <div
                      style={{
                        color: '#354f57',
                        fontSize: 18,
                        margin: '8px 0',
                      }}
                    >
                      Workflow
                    </div>
                  }
                />
                <CardText style={styles.reducePadding}>
                  <Grid fluid>
                    <Row>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          className="fullWidth selectOption"
                          floatingLabelText={
                            <span>
                              {translate('pt.create.groups.workflow.departmentName')}
                              <span style={{ color: '#FF0000' }}> *</span>
                            </span>
                          }
                          errorText={
                            fieldErrors.workflowDepartment ? (
                              <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.workflowDepartment}</span>
                            ) : (
                              ''
                            )
                          }
                          value={workflow.workflowDepartment ? workflow.workflowDepartment : ''}
                          onChange={(event, index, value) => {
                            value == -1 ? (value = '') : '';
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleWorkFlowChange(e, 'department');
                            handleChange(e, 'workflowDepartment', true, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                          floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                        >
                          {renderOption(this.state.workflowDepartment)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          className="fullWidth selectOption"
                          floatingLabelText={
                            <span>
                              {translate('pt.create.groups.workflow.designationName')}
                              <span style={{ color: '#FF0000' }}> *</span>
                            </span>
                          }
                          errorText={
                            fieldErrors.workflowDesignation ? (
                              <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.workflowDesignation}</span>
                            ) : (
                              ''
                            )
                          }
                          value={workflow.workflowDesignation ? workflow.workflowDesignation : ''}
                          onChange={(event, index, value) => {
                            value == -1 ? (value = '') : '';
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleWorkFlowChange(e, 'designation');
                            handleChange(e, 'workflowDesignation', true, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                          floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                        >
                          {renderOption(this.state.designation)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          className="fullWidth selectOption"
                          floatingLabelText={
                            <span>
                              {translate('pt.create.groups.workflow.approverName')}
                              <span style={{ color: '#FF0000' }}> *</span>
                            </span>
                          }
                          errorText={fieldErrors.approver ? <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.approver}</span> : ''}
                          value={workflow.approver ? workflow.approver : ''}
                          onChange={(event, index, value) => {
                            value == -1 ? (value = '') : '';
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'approver', true, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                          floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                        >
                          {renderOption(this.state.approver)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <TextField
                          className="fullWidth"
                          floatingLabelText={translate('pt.create.groups.workflow.comment')}
                          errorText={fieldErrors.comments ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.comments}</span> : ''}
                          value={workflow.comments ? workflow.comments : ''}
                          onChange={e => {
                            handleChange(e, 'comments', false, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                          floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                        />
                      </Col>
                    </Row>
                  </Grid>
                </CardText>
              </Card>
            )}
          <br />
        </form>
        <div style={{ textAlign: 'center' }}>
          {true && (
            <Card className="uiCard" id="specialNotice">
              <CardText>
                <Table responsive style={{ fontSize: 'bold', width: '100%' }} condensed>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: 'left' }}>ULB Logo</td>
                      <td style={{ textAlign: 'center' }}>
                        <b>Roha Municipal Council</b>
                        <br />
                      </td>
                      <td style={{ textAlign: 'right' }}>MAHA Logo</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'center' }} colSpan={3}>
                        <b>Special Notice</b>
                        <p>(मुवंई प्रांतिक महानगरपालिका अधिनियम 1949 चे अनुसूचीतील प्रकरण 8 अधिनियम 44, 45 व 46 अन्वये )</p>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right' }} colSpan={3}>
                        Date / दिनांक: {this.state.specialNotice.hasOwnProperty('noticeDate') && this.state.specialNotice.noticeDate}
                        <br />
                        Notice No. / नोटीस क्रं : {this.state.specialNotice.hasOwnProperty('noticeNumber') && this.state.specialNotice.noticeNumber}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'left' }} colSpan={3}>
                        प्रती,
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'left' }} colSpan={3}>
                        {this.state.specialNotice.hasOwnProperty('owners') &&
                          this.state.specialNotice.owners.map((owner, index) => {
                            return <span key={index}>{owner.name}</span>;
                          })}
                        <br />
                        {this.state.specialNotice.hasOwnProperty('address') ? (
                          this.state.specialNotice.address.addressNumber ? (
                            <span>{this.state.specialNotice.address.addressNumber}</span>
                          ) : (
                            ''
                          )
                        ) : (
                          ''
                        )}
                        {this.state.specialNotice.hasOwnProperty('address') ? (
                          this.state.specialNotice.address.addressLine1 ? (
                            <span>, {getNameById(this.state.locality, this.state.specialNotice.address.addressLine1)}</span>
                          ) : (
                            ''
                          )
                        ) : (
                          ''
                        )}
                        {this.state.specialNotice.hasOwnProperty('address') ? (
                          this.state.specialNotice.address.addressLine2 ? (
                            <span>, {this.state.specialNotice.address.addressLine2}</span>
                          ) : (
                            ''
                          )
                        ) : (
                          ''
                        )}
                        {this.state.specialNotice.hasOwnProperty('address') ? (
                          this.state.specialNotice.address.landmark ? (
                            <span>, {this.state.specialNotice.address.landmark}</span>
                          ) : (
                            ''
                          )
                        ) : (
                          ''
                        )}
                        {this.state.specialNotice.hasOwnProperty('address') ? (
                          this.state.specialNotice.address.city ? (
                            <span>, {this.state.specialNotice.address.city}</span>
                          ) : (
                            ''
                          )
                        ) : (
                          ''
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center' }}>
                        Subject /विषय : Special Notice – New Assessment / Special Notice – <br />Reassessment Reference / संदर्भ : आपला अर्ज क्रमांक{' '}
                        {this.state.specialNotice.hasOwnProperty('applicationNo') && this.state.specialNotice.applicationNo} दिनांक{' '}
                        {this.state.specialNotice.hasOwnProperty('applicationDate') && this.state.specialNotice.applicationDate}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3}>
                        महोद्य / महोद्या ,<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;संदर्भिय विषयांन्वये
                        कळविण्यात येते की, आपल्या मालमत्तेची नवीन / सुधारीत कर आकारणी करण्यात आलेली आहे. मालमत्ता क्रमांक{' '}
                        {this.state.specialNotice.hasOwnProperty('upicNo') && this.state.specialNotice.upicNo},{' '}
                        {this.state.specialNotice.hasOwnProperty('owners') &&
                          this.state.specialNotice.owners.map((owner, index) => {
                            return <span key={index}>{owner.name}</span>;
                          })}{' '}
                        यांच्या नावे नोंद असून, मालमत्ता कर आकारणीचा तपशील खालीलप्रमाणे आहे.
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3}>
                        <Table responsive style={{ fontSize: 'bold', width: '100%' }} bordered condensed>
                          <thead>
                            <tr>
                              <th>Floor</th>
                              <th>Unit Details</th>
                              <th>Usage</th>
                              <th>Construction</th>
                              <th>Assessable Area</th>
                              <th>ALV</th>
                              <th>RV</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.specialNotice.hasOwnProperty('floors') &&
                              this.state.specialNotice.floors.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.floorNo || ''}</td>
                                  <td>{item.unitDetails || ''}</td>
                                  <td>{getNameByCode(this.state.usages, item.usage) || ''}</td>
                                  <td>{getNameByCode(this.state.structureclasses, item.construction) || ''}</td>
                                  <td>{item.assessableArea || ''}</td>
                                  <td>{item.alv || ''}</td>
                                  <td>{item.rv || ''}</td>
                                </tr>
                              ))}
                          </tbody>
                        </Table>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3}>
                        <b>Tax Details</b>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3}>
                        <Table responsive style={{ fontSize: 'bold', width: '50%' }} bordered condensed>
                          <thead>
                            <tr>
                              <th>Tax Description</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.specialNotice.taxDetails.hasOwnProperty('headWiseTaxes') &&
                              this.state.specialNotice.taxDetails.headWiseTaxes.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>
                                      {this.state.taxHeads.length != 0 &&
                                        this.state.taxHeads.map((e, i) => {
                                          if (e.code == item.taxName) {
                                            return (
                                              <span key={i} style={{ fontWeight: 500 }}>
                                                {e.name ? e.name : 'NA'}
                                              </span>
                                            );
                                          }
                                        })}
                                    </td>
                                    <td>{item.taxValue}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </Table>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3}>
                        सदर आकारणी जर तुम्हाला मान्य नसेल तर ही नोटीस मिळाल्या पासून 1 महिन्याचे मुदतीचे आत मुख्यधिकारी यांचकडे फेर तपासणी करता अर्ज
                        करावा. जर 1 महिन्याचे आत सदरहून आकारणी विरुध्द तक्रार अर्ज प्राप्त झाला नाही तर वर नमुद केल्या प्रमाणे आकारणी कायम करण्यात
                        येईल, याची नोंद घ्यावी.
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'right' }}>
                        कर अधिक्षक,<br />
                        ULB Name
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardText>
            </Card>
          )}
          {this.state.buttons.hasOwnProperty('attributes') &&
            this.state.buttons.attributes.validActions.values.length > 0 &&
            this.state.buttons.attributes.validActions.values.map((item, index) => {
              return (
                <RaisedButton
                  key={index}
                  type="button"
                  primary={true}
                  label={item.name}
                  style={{ margin: '0 5px' }}
                  onClick={() => {
                    this.updateInbox(item.name, current.state.buttons.status);
                  }}
                />
              );
            })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  workflow: state.form.form,
  metaData: state.framework.metaData,
  mockData: state.framework.mockData,
  moduleName: state.framework.moduleName,
  actionName: state.framework.actionName,
  formData: state.frameworkForm.form,
  fieldErrors: state.frameworkForm.fieldErrors,
});

const mapDispatchToProps = dispatch => ({
  initForm: () => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: ['approver', 'workflowDesignation', 'workflowDepartment'],
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
  setFormData: data => {
    dispatch({ type: 'SET_FORM_DATA', data });
  },
  setMetaData: metaData => {
    dispatch({ type: 'SET_META_DATA', metaData });
  },
  setMockData: mockData => {
    dispatch({ type: 'SET_MOCK_DATA', mockData });
  },
  setModuleName: moduleName => {
    dispatch({ type: 'SET_MODULE_NAME', moduleName });
  },
  setActionName: actionName => {
    dispatch({ type: 'SET_ACTION_NAME', actionName });
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
});
export default connect(mapStateToProps, mapDispatchToProps)(Inbox);
