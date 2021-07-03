import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import Label from "egov-ui-kit/utils/translationNode";
import FlatButton from 'material-ui/FlatButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import { Card,  CardText, CardTitle } from 'material-ui/Card';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Dialog from 'material-ui/Dialog';
import { translate } from './components/Common';
import AutoComplete from 'material-ui/AutoComplete';
import Api from "./components/api"
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import "./index.css"

const headerStyle ={
  backgroundColor : "#607d8b" ,
  color : "#fff" ,
  padding:"10px",
  fontWeight : "500" ,
  fontSize : "14px"
}

const labelStyle = {
  color : "#ffffff"
}

const containerStyle = {
  whiteSpace : "pre"
}

const textfieldLabelStyle = {
  fontSize : "20px"
}


const datePat = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
const checkIfNoDup = function(employee, subObject) {
  if (employee['jurisdictions'].length === 0) return true;
  else {
    for (let i = 0; i < employee['jurisdictions'].length; i++) {
      if (employee['jurisdictions'][i] == subObject) return false;
    }
  }

  return true;
};

const validateDates = function(employee, subObject, editIndex) {
  if (subObject.isPrimary == 'true' || subObject.isPrimary == true) {
    for (let i = 0; i < employee['assignments'].length; i++) {
      if (employee['assignments'][i].isPrimary && (editIndex === '' || (editIndex > -1 && i != editIndex))) {
        var subFromDate = new Date(
          subObject.fromDate.split('/')[1] + '/' + subObject.fromDate.split('/')[0] + '/' + subObject.fromDate.split('/')[2]
        ).getTime();
        var fromDate = new Date(
          employee['assignments'][i].fromDate.split('/')[1] +
            '/' +
            employee['assignments'][i].fromDate.split('/')[0] +
            '/' +
            employee['assignments'][i].fromDate.split('/')[2]
        ).getTime();
        var subToDate = new Date(
          subObject.toDate.split('/')[1] + '/' + subObject.toDate.split('/')[0] + '/' + subObject.toDate.split('/')[2]
        ).getTime();
        var toDate = new Date(
          employee['assignments'][i].toDate.split('/')[1] +
            '/' +
            employee['assignments'][i].toDate.split('/')[0] +
            '/' +
            employee['assignments'][i].toDate.split('/')[2]
        ).getTime();

        if (
          (fromDate >= subFromDate && fromDate <= subToDate) ||
          (toDate >= subFromDate && toDate <= subToDate) ||
          (subFromDate >= fromDate && subFromDate <= toDate) ||
          (subToDate >= fromDate && subToDate <= toDate)
        ) {
          return false;
        }
      }
    }
  }

  return true;
};

const getNameById = function(object, id) {
  if (!id) return '';
  for (var i = 0; i < object.length; i++) {
    if (id == object[i].id) return object[i].name || object[i].code;
  }
};

const checkRequiredFields = function(type, object) {
  let errorText = {};
  switch (type) {
    case 'assignment':
      if (!object.fromDate) {
        errorText['assignments.fromDate'] = translate('ui.framework.required');
      } else if (!object.toDate) {
        errorText['assignments.toDate'] = translate('ui.framework.required');
      } else if (!object.department) {
        errorText['assignments.department'] = translate('ui.framework.required');
      } else if (!object.designation) {
        errorText['assignments.designation'] = translate('ui.framework.required');
      } else if (!object.position) {
        errorText['assignments.position'] = translate('ui.framework.required');
      } else if (
        (object.hod == true || object.hod == 'true') &&
        (!object.mainDepartments || (object.mainDepartments && object.mainDepartments.length == 0))
      ) {
        errorText['assignments.mainDepartments'] = translate('ui.framework.required');
      }
      break;
    case 'jurisdiction':
      if (!object.jurisdictionsType) {
        errorText['jurisdictions.jurisdictionsType'] = translate('ui.framework.required');
      } else if (!object.boundary) {
        errorText['jurisdictions.boundary'] = translate('ui.framework.required');
      }
      break;
    case 'serviceDet':
      if (!object.serviceInfo) {
        errorText['serviceHistory.serviceInfo'] = translate('ui.framework.required');
      } else if (!object.serviceFrom) {
        errorText['serviceHistory.serviceFrom'] = translate('ui.framework.required');
      }
      break;
    case 'probation':
      if (!object.designation) {
        errorText['probation.designation'] = translate('ui.framework.required');
      } else if (!object.declaredOn) {
        errorText['probation.declaredOn'] = translate('ui.framework.required');
      } else if (!object.orderDate) {
        errorText['probation.orderDate'] = translate('ui.framework.required');
      }
      break;
    case 'regular':
      if (!object.designation) {
        errorText['regularisation.designation'] = translate('ui.framework.required');
      } else if (!object.declaredOn) {
        errorText['regularisation.declaredOn'] = translate('ui.framework.required');
      } else if (!object.orderDate) {
        errorText['regularisation.orderDate'] = translate('ui.framework.required');
      }
      break;
    case 'edu':
      if (!object.qualification) {
        errorText['education.qualification'] = translate('ui.framework.required');
      } else if (!object.yearOfPassing) {
        errorText['education.yearOfPassing'] = translate('ui.framework.required');
      }
      break;
    case 'tech':
      if (!object.skill) {
        errorText['technical.skill'] = translate('ui.framework.required');
      }
      break;
    case 'dept':
      if (!object.test) {
        errorText['test.test'] = translate('ui.framework.required');
      } else if (!object.yearOfPassing) {
        errorText['test.yearOfPassing'] = translate('ui.framework.required');
      }
      break;
  }

  return errorText;
};

const hasFile = function(elements) {
  if (elements && elements.constructor == Array) {
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].documents && elements[i].documents.constructor == Array)
        for (var j = 0; j < elements[i].documents.length; j++) if (elements[i].documents[j].constructor == File) return true;
    }
  }
  return false;
};

const isHavingPrimary = function(employee) {
  for (var i = 0; i < employee.assignments.length; i++) {
    if (employee.assignments[i].isPrimary == 'true' || employee.assignments[i].isPrimary == true) {
      return true;
    }
  }
  return false;
};

const makeAjaxUpload = function(file, cb) {
  if (file.constructor == File) {
    let formData = new FormData();
    formData.append('jurisdictionId', getTenantId());
    formData.append('module', 'HR');
    formData.append('file', file);

    Api.commonApiPost('/filestore/v1/files', {}, formData).then(
      function(res) {
        cb(null, res);
      },
      function(err) {
        cb('');
      }
    );
  } else {
    cb(null, {
      files: [
        {
          fileStoreId: file,
        },
      ],
    });
  }
};

const uploadFiles = function(employee, cb) {
  let len;
  if (employee.user.photo && typeof employee.user.photo == 'object') {
    makeAjaxUpload(employee.user.photo[0], function(err, res) {
      if (err) {
        cb(err);
      } else {
        employee.user.photo = `${res.files[0].fileStoreId}`;
        uploadFiles(employee, cb);
      }
    });
  } else if (employee.user.signature && typeof employee.user.signature == 'object') {
    makeAjaxUpload(employee.user.signature[0], function(err, res) {
      if (err) {
        cb(err);
      } else {
        employee.user.signature = `${res.files[0].fileStoreId}`;
        uploadFiles(employee, cb);
      }
    });
  } else if (employee.documents && employee.documents.length && employee.documents[0].constructor == File) {
    let counter = employee.documents.length,
      breakout = 0;
    for (let i = 0, len = employee.documents.length; i < len; i++) {
      makeAjaxUpload(employee.documents[i], function(err, res) {
        if (breakout == 1) return;
        else if (err) {
          cb(err);
          breakout = 1;
        } else {
          counter--;
          employee.documents[i] = `${res.files[0].fileStoreId}`;
          if (counter == 0 && breakout == 0) uploadFiles(employee, cb);
        }
      });
    }
  } else if (employee.assignments.length && hasFile(employee.assignments)) {
    let counter1 = employee.assignments.length,
      breakout = 0;
    for (let i = 0; (len = employee.assignments.length), i < len; i++) {
      let counter = employee.assignments[i].documents.length;
      for (let j = 0, len1 = employee.assignments[i].documents.length; j < len1; j++) {
        makeAjaxUpload(employee.assignments[i].documents[j], function(err, res) {
          if (breakout == 1) return;
          else if (err) {
            cb(err);
            breakout = 1;
          } else {
            counter--;
            employee.assignments[i].documents[j] = `${res.files[0].fileStoreId}`;
            if (counter == 0 && breakout == 0) {
              counter1--;
              if (counter1 == 0 && breakout == 0) uploadFiles(employee, cb);
            }
          }
        });
      }
    }
  } else if (employee.serviceHistory.length && hasFile(employee.serviceHistory)) {
    let counter1 = employee.serviceHistory.length,
      breakout = 0;
    for (let i = 0; (len = employee.serviceHistory.length), i < len; i++) {
      let counter = employee.serviceHistory[i].documents.length;
      for (let j = 0, len1 = employee.serviceHistory[i].documents.length; j < len1; j++) {
        makeAjaxUpload(employee.serviceHistory[i].documents[j], function(err, res) {
          if (breakout == 1) return;
          else if (err) {
            cb(err);
            breakout = 1;
          } else {
            counter--;
            employee.serviceHistory[i].documents[j] = `${res.files[0].fileStoreId}`;
            if (counter == 0 && breakout == 0) {
              counter1--;
              if (counter1 == 0 && breakout == 0) uploadFiles(employee, cb);
            }
          }
        });
      }
    }
  } else if (employee.probation.length && hasFile(employee.probation)) {
    let counter1 = employee.probation.length,
      breakout = 0;
    for (let i = 0; (len = employee.probation.length), i < len; i++) {
      let counter = employee.probation[i].documents.length;
      for (let j = 0, len1 = employee.probation[i].documents.length; j < len1; j++) {
        makeAjaxUpload(employee.probation[i].documents[j], function(err, res) {
          if (breakout == 1) return;
          else if (err) {
            cb(err);
            breakout = 1;
          } else {
            counter--;
            employee.probation[i].documents[j] = `${res.files[0].fileStoreId}`;
            if (counter == 0 && breakout == 0) {
              counter1--;
              if (counter1 == 0 && breakout == 0) uploadFiles(employee, cb);
            }
          }
        });
      }
    }
  } else if (employee.regularisation.length && hasFile(employee.regularisation)) {
    let counter1 = employee.regularisation.length,
      breakout = 0;
    for (let i = 0; (len = employee.regularisation.length), i < len; i++) {
      let counter = employee.regularisation[i].documents.length;
      for (let j = 0, len1 = employee.regularisation[i].documents.length; j < len1; j++) {
        makeAjaxUpload(employee.regularisation[i].documents[j], function(err, res) {
          if (breakout == 1) return;
          else if (err) {
            cb(err);
            breakout = 1;
          } else {
            counter--;
            employee.regularisation[i].documents[j] = `${res.files[0].fileStoreId}`;
            if (counter == 0 && breakout == 0) {
              counter1--;
              if (counter1 == 0 && breakout == 0) uploadFiles(employee, cb);
            }
          }
        });
      }
    }
  } else if (employee.technical.length && hasFile(employee.technical)) {
    let counter1 = employee.technical.length,
      breakout = 0;
    for (let i = 0; (len = employee.technical.length), i < len; i++) {
      let counter = employee.technical[i].documents.length;
      for (let j = 0, len1 = employee.technical[i].documents.length; j < len1; j++) {
        makeAjaxUpload(employee.technical[i].documents[j], function(err, res) {
          if (breakout == 1) return;
          else if (err) {
            cb(err);
            breakout = 1;
          } else {
            counter--;
            employee.technical[i].documents[j] = `${res.files[0].fileStoreId}`;
            if (counter == 0 && breakout == 0) {
              counter1--;
              if (counter1 == 0 && breakout == 0) uploadFiles(employee, cb);
            }
          }
        });
      }
    }
  } else if (employee.education.length && hasFile(employee.education)) {
    let counter1 = employee.education.length,
      breakout = 0;
    for (let i = 0; (len = employee.education.length), i < len; i++) {
      let counter = employee.education[i].documents.length;
      for (let j = 0, len1 = employee.education[i].documents.length; j < len1; j++) {
        makeAjaxUpload(employee.education[i].documents[j], function(err, res) {
          if (breakout == 1) return;
          else if (err) {
            cb(err);
            breakout = 1;
          } else {
            counter--;
            employee.education[i].documents[j] = `${res.files[0].fileStoreId}`;
            if (counter == 0 && breakout == 0) {
              counter1--;
              if (counter1 == 0 && breakout == 0) uploadFiles(employee, cb);
            }
          }
        });
      }
    }
  } else if (employee.test.length && hasFile(employee.test)) {
    let counter1 = employee.test.length,
      breakout = 0;
    for (let i = 0; (len = employee.test.length), i < len; i++) {
      let counter = employee.test[i].documents.length;
      for (let j = 0, len1 = employee.test[i].documents.length; j < len1; j++) {
        makeAjaxUpload(employee.test[i].documents[j], function(err, res) {
          if (breakout == 1) return;
          else if (err) {
            cb(err);
            breakout = 1;
          } else {
            counter--;
            employee.test[i].documents[j] = `${res.files[0].fileStoreId}`;
            if (counter == 0 && breakout == 0) {
              counter1--;
              if (counter1 == 0 && breakout == 0) uploadFiles(employee, cb);
            }
          }
        });
      }
    }
  } else {
    cb(null, employee);
  }
};

const getBoundaryValues = function(allBoundariesList, boundary, self, ind) {
  for (var i = 0; i < allBoundariesList.length; i++) {
    if (allBoundariesList[i].id == boundary) {
      return (
        <tr key={ind}>
          <td>{allBoundariesList[i].boundaryType.name}</td>
          <td>{allBoundariesList[i].name}</td>
          <td>
            {self.state.screenType != 'view' && (
              <span
                className="glyphicon glyphicon-pencil"
                onClick={() => {
                  self.editModalOpen(ind, 'jurisdictions');
                }}
              />
            )}&nbsp;&nbsp;
            {self.state.screenType != 'view' && (
              <span
                className="glyphicon glyphicon-trash"
                onClick={() => {
                  self.delModalOpen(ind, 'jurisdictions');
                }}
              />
            )}
          </td>
        </tr>
      );
    }
  }
};

const assignmentsDefState = {
  fromDate: '',
  toDate: '',
  department: '',
  designation: '',
  position: '',
  isPrimary: false,
  fund: '',
  function: '',
  functionary: '',
  grade: '',
  hod: false,
  govtOrderNumber: '',
  documents: null,
};
const jurisDefState = {
  jurisdictionsType: '',
  boundary: '',
};
const serviceDefState = {
  serviceInfo: '',
  serviceFrom: '',
  remarks: '',
  orderNo: '',
  documents: null,
};
const probDefState = {
  designation: '',
  declaredOn: '',
  orderNo: '',
  orderDate: '',
  remarks: '',
  documents: null,
};
const regDefState = {
  designation: '',
  declaredOn: '',
  orderNo: '',
  orderDate: '',
  remarks: '',
  documents: null,
};
const eduDefState = {
  qualification: '',
  majorSubject: '',
  yearOfPassing: '',
  university: '',
  documents: null,
};
const techDefState = {
  skill: '',
  grade: '',
  yearOfPassing: '',
  remarks: '',
  documents: null,
};
const deptDefState = {
  test: '',
  yearOfPassing: '',
  remarks: '',
  documents: null,
};

class Employee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pathname: '',
      open: false,
      editIndex: '',
      isModalInvalid: true,
      autoCode: false,
      autoUName: false,
      modal: '',
      employeetypes: [],
      statuses: [],
      groups: [],
      banks: [],
      categories: [],
      maritalstatuses: [],
      bloodgroups: [],
      languages: [],
      religions: [],
      recruitmentmodes: [],
      recruitmenttypes: [],
      grades: [],
      funds: [],
      functionaries: [],
      functions: [],
      boundarytypes: [],
      designations: [],
      departments: [],
      recruitmentquotas: [],
      genders: [],
      communities: [],
      allBoundariesList: [],
      bankBranches: [],
      boundaries: [],
      positionList: [],
      positionListConfig: {
        text: 'name',
        value: 'id',
      },
      screenType: 'create',
      errorText: {},
      allPosition: [],
      subObject: {
        assignments: Object.assign({}, assignmentsDefState),
        jurisdictions: Object.assign({}, jurisDefState),
        serviceHistory: Object.assign({}, serviceDefState),
        probation: Object.assign({}, probDefState),
        regularisation: Object.assign({}, regDefState),
        education: Object.assign({}, eduDefState),
        technical: Object.assign({}, techDefState),
        test: Object.assign({}, deptDefState),
      },
    };
  }

  setInitialState = _state => {
    this.setState(_state);
  };

  loadBranches = id => {
    let self = this;
    if (!id)
      self.setState({
        bankBranches: [],
      });
    Api.commonApiPost('egf-masters/bankbranches/_search', { bank: id }).then(
      function(res) {
        self.setState({
          bankBranches: res['bankBranches'],
        });
      },
      function(err) {
        self.setState({
          bankBranches: [],
        });
      }
    );
  };

  loadBoundaries = id => {
    let self = this;
    Api.commonApiPost('egov-location/boundarys/getByBoundaryType', {
      boundaryTypeId: id,
    }).then(
      function(res) {
        self.setState({
          boundaries: res['Boundary'],
        });
      },
      function(err) {}
    );
  };

  getDate = dateStr => {
    if (dateStr && typeof dateStr == 'string') {
      if (dateStr.indexOf('/') > -1) {
        var dateArr = dateStr.split('/');
        return new Date(dateArr[2], Number(dateArr[1]) - 1, dateArr[0]);
      } else if (dateStr.indexOf('-') > -1) {
        var dateArr = dateStr.split('-');
        return new Date(dateArr[0], Number(dateArr[1]) - 1, dateArr[2]);
      }
    } else return '';
  };

  fetchURLData(url, query = {}, defaultObject, cb) {
    Api.commonApiPost(url, query).then(
      function(res) {
        cb(res);
      },
      function(err) {
        cb(defaultObject);
      }
    );
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleStateChange = (e, parent, key, isRequired, pattern) => {
    let self = this;
    let val = e.target.value,
      errorTxt =
        isRequired && (typeof val === 'undefined' || val === '')
          ? translate('ui.framework.required')
          : pattern && val && !pattern.test(val) ? translate('ui.framework.patternMessage') : '';
    let hasAllReqFields = true;
    let allFields = Object.assign({}, self.state.subObject[parent]);
    allFields[key] = val;
    switch (self.state.modal) {
      case 'assignment':
        if (
          !allFields['fromDate'] ||
          !allFields['toDate'] ||
          !allFields['department'] ||
          !allFields['designation'] ||
          !allFields['position'] ||
          (allFields['hod'] == true && !allFields['mainDepartments'])
        )
          hasAllReqFields = false;
        break;
      case 'jurisdiction':
        if (!allFields['jurisdictionsType'] || !allFields['boundary']) hasAllReqFields = false;
        break;
      case 'serviceDet':
        if (!allFields['serviceInfo'] || !allFields['serviceFrom']) hasAllReqFields = false;
        break;
      case 'probation':
      case 'regular':
        if (!allFields['designation'] || !allFields['declaredOn'] || !allFields['orderDate']) hasAllReqFields = false;
        break;
      case 'edu':
        if (!allFields['qualification'] || !allFields['yearOfPassing']) hasAllReqFields = false;
        break;
      case 'tech':
        if (!allFields['skill']) hasAllReqFields = false;
        break;
      case 'dept':
        if (!allFields['test'] || !allFields['yearOfPassing']) hasAllReqFields = false;
        break;
    }
    self.setState(
      {
        subObject: {
          [parent]: {
            ...self.state.subObject[parent],
            [key]: val,
          },
        },
        isModalInvalid: errorTxt || !hasAllReqFields,
        errorText: {
          ...self.state.errorText,
          [parent + '.' + key]: errorTxt,
        },
      },
      function() {
        self.vacantposition(parent);
      }
    );
  };

  vacantposition = parent => {
    let self = this;
    if (parent == 'assignments' && self.state.subObject[parent].designation && self.state.subObject[parent].department) {
      if (self.state.subObject[parent].isPrimary == 'true' || self.state.subObject[parent].isPrimary == true) {
        if (self.state.subObject[parent].fromDate) {
          Api.commonApiPost('hr-masters/vacantpositions/_search', {
            departmentId: self.state.subObject[parent].department,
            designationId: self.state.subObject[parent].designation,
            asOnDate: self.state.subObject[parent].fromDate,
            pageSize: 100,
          }).then(
            function(res) {
              self.setState({
                positionList: res['Position'],
              });
            },
            function(err) {}
          );
        }
      } else {
        Api.commonApiPost('hr-masters/positions/_search', {
          departmentId: self.state.subObject[parent].department,
          designationId: self.state.subObject[parent].designation,
          pageSize: 100,
        }).then(
          function(res) {
            self.setState({
              positionList: res['Position'],
            });
          },
          function(err) {}
        );
      }
    }
  };

  editModalOpen = (ind, type) => {
    let dat;
    let self = this;
    switch (type) {
      case 'assignments':
        dat = Object.assign({}, this.props.Employee.assignments[ind]);
        if (dat.hod && dat.hod.length) {
          dat.mainDepartments = [];
          for (var i = 0; i < dat.hod.length; i++) {
            dat.mainDepartments.push(dat.hod[i]['department']);
          }
          dat.hod = true;
        }
        this.setState(
          {
            open: true,
            modal: 'assignment',
            errorText: {},
            editIndex: ind,
            subObject: {
              assignments: dat,
            },
          },
          function() {
            self.vacantposition('assignments');
          }
        );
        break;
      case 'jurisdictions':
        dat = {};
        for (var i = 0; i < this.state.allBoundariesList.length; i++) {
          if (this.props.Employee.jurisdictions[ind] == this.state.allBoundariesList[i].id) {
            dat['jurisdictionsType'] = this.state.allBoundariesList[i].boundaryType.id + '';
            this.loadBoundaries(dat['jurisdictionsType']);
            dat['boundary'] = this.state.allBoundariesList[i].id;
            break;
          }
        }
        this.setState({
          open: true,
          modal: 'jurisdiction',
          errorText: {},
          editIndex: ind,
          subObject: {
            jurisdictions: dat,
          },
        });
        break;
      case 'serviceDet':
        dat = Object.assign({}, this.props.Employee.serviceHistory[ind]);
        this.setState({
          open: true,
          modal: 'serviceDet',
          errorText: {},
          editIndex: ind,
          subObject: {
            serviceHistory: dat,
          },
        });
        break;
      case 'probation':
        dat = Object.assign({}, this.props.Employee.probation[ind]);
        this.setState({
          open: true,
          modal: 'probation',
          errorText: {},
          editIndex: ind,
          subObject: {
            probation: dat,
          },
        });
        break;
      case 'regular':
        dat = Object.assign({}, this.props.Employee.regularisation[ind]);
        this.setState({
          open: true,
          modal: 'regular',
          errorText: {},
          editIndex: ind,
          subObject: {
            regularisation: dat,
          },
        });
        break;
      case 'edu':
        dat = Object.assign({}, this.props.Employee.education[ind]);
        this.setState({
          open: true,
          modal: 'edu',
          errorText: {},
          editIndex: ind,
          subObject: {
            education: dat,
          },
        });
        break;
      case 'tech':
        dat = Object.assign({}, this.props.Employee.technical[ind]);
        this.setState({
          open: true,
          errorText: {},
          modal: 'tech',
          editIndex: ind,
          subObject: {
            technical: dat,
          },
        });
        break;
      case 'dept':
        dat = Object.assign({}, this.props.Employee.jurisdictions[ind]);
        this.setState({
          open: true,
          errorText: {},
          modal: 'dept',
          editIndex: ind,
          subObject: {
            test: dat,
          },
        });
        break;
    }
  };

  delModalOpen = (ind, type) => {
    switch (type) {
      case 'assignments':
        let assignments = Object.assign([], this.props.Employee.assignments);
        assignments.splice(ind);
        this.props.handleChange({ target: { value: assignments } }, 'assignments', false, '');
        break;
      case 'jurisdictions':
        let jurisdictions = Object.assign([], this.props.Employee.jurisdictions);
        assignments.splice(ind);
        this.props.handleChange({ target: { value: jurisdictions } }, 'jurisdictions', false, '');
        break;
      case 'serviceDet':
        let serviceHistory = Object.assign([], this.props.Employee.serviceHistory);
        serviceHistory.splice(ind);
        this.props.handleChange({ target: { value: serviceHistory } }, 'serviceHistory', false, '');
        break;
      case 'probation':
        let probation = Object.assign([], this.props.Employee.probation);
        probation.splice(ind);
        this.props.handleChange({ target: { value: probation } }, 'probation', false, '');
        break;
      case 'regular':
        let regularisation = Object.assign([], this.props.Employee.regularisation);
        regularisation.splice(ind);
        this.props.handleChange({ target: { value: regularisation } }, 'regularisation', false, '');
        break;
      case 'edu':
        let education = Object.assign([], this.props.Employee.education);
        education.splice(ind);
        this.props.handleChange({ target: { value: education } }, 'education', false, '');
        break;
      case 'tech':
        let techDefState = Object.assign([], this.props.Employee.techDefState);
        techDefState.splice(ind);
        this.props.handleChange({ target: { value: techDefState } }, 'techDefState', false, '');
        break;
      case 'dept':
        let test = Object.assign([], this.props.Employee.test);
        test.splice(ind);
        this.props.handleChange({ target: { value: test } }, 'test', false, '');
        break;
    }
  };

  submitModalData = e => {
    let { editIndex } = this.state,
      self = this;
    let errorText = {};
    switch (this.state.modal) {
      case 'assignment':
        errorText = checkRequiredFields('assignment', this.state.subObject.assignments);

        if (Object.keys(errorText).length > 0) {
          return self.setState({ errorText });
        }

        if (self.getDate(this.state.subObject.assignments.fromDate).getTime() > self.getDate(this.state.subObject.assignments.toDate).getTime()) {
          return self.props.toggleSnackbarAndSetText(true, translate('employee.error.message.date'), false, "error");
        }

        let assignments = Object.assign([], this.props.Employee.assignments || []);
        var asst = { ...this.state.subObject.assignments };
        if (asst.hod == 'true' || asst.hod == true) {
          asst.hod = [];
          for (let i = 0; i < asst.mainDepartments.length; i++) {
            asst.hod.push({ department: asst.mainDepartments[i] });
          }
        }

        delete asst.mainDepartments;
        if (!validateDates(this.props.Employee, asst, editIndex)) {
          return this.props.toggleSnackbarAndSetText(true, translate('employee.error.message.assignmentDate'), false, "error");
        }

        if (this.state.editIndex === '') assignments.push(asst);
        else assignments[editIndex] = Object.assign({}, asst);
        this.props.handleChange({ target: { value: assignments } }, 'assignments', false, '');
        this.setState({
          subObject: {
            ...this.state.subObject,
            assignments: Object.assign({}, assignmentsDefState),
          },
        });
        break;
      case 'jurisdiction':
        errorText = checkRequiredFields('jurisdiction', this.state.subObject.jurisdictions);
        if (Object.keys(errorText).length > 0) {
          return self.setState({ errorText });
        }

        let jurisdictions = Object.assign([], this.props.Employee.jurisdictions || []);
        var jst = this.state.subObject.jurisdictions.boundary;
        if (!checkIfNoDup(this.props.Employee, jst)) {
          return this.props.toggleSnackbarAndSetText(true, translate('employee.error.message.dupAssignment'), false, "error");
        }

        if (this.state.editIndex === '') jurisdictions.push(jst);
        else jurisdictions[editIndex] = jst;
        this.props.handleChange({ target: { value: jurisdictions } }, 'jurisdictions', false, '');
        this.setState({
          subObject: {
            ...this.state.subObject,
            jurisdictions: Object.assign({}, jurisDefState),
          },
        });
        break;
      case 'serviceDet':
        errorText = checkRequiredFields('serviceDet', this.state.subObject.serviceHistory);
        if (Object.keys(errorText).length > 0) {
          return self.setState({ errorText });
        }

        let serviceHistory = Object.assign([], this.props.Employee.serviceHistory || []);
        if (this.state.editIndex === '') {
          serviceHistory.push(this.state.subObject.serviceHistory);
        } else {
          serviceHistory[editIndex] = Object.assign({}, this.state.subObject.serviceHistory);
        }

        this.props.handleChange({ target: { value: serviceHistory } }, 'serviceHistory', false, '');
        this.setState({
          subObject: {
            ...this.state.subObject,
            serviceHistory: Object.assign({}, serviceDefState),
          },
        });
        break;
      case 'probation':
        errorText = checkRequiredFields('probation', this.state.subObject.probation);
        if (Object.keys(errorText).length > 0) {
          return self.setState({ errorText });
        }

        let probation = Object.assign([], this.props.Employee.probation || []);
        if (this.state.editIndex === '') probation.push(this.state.subObject.probation);
        else probation[editIndex] = Object.assign({}, this.state.subObject.probation);
        this.props.handleChange({ target: { value: probation } }, 'probation', false, '');
        this.setState({
          subObject: {
            ...this.state.subObject,
            probation: Object.assign({}, probDefState),
          },
        });
        break;
      case 'regular':
        errorText = checkRequiredFields('regular', this.state.subObject.regularisation);
        if (Object.keys(errorText).length > 0) {
          return self.setState({ errorText });
        }

        let regularisation = Object.assign([], this.props.Employee.regularisation || []);
        if (this.state.editIndex === '') regularisation.push(this.state.subObject.regularisation);
        else regularisation[editIndex] = Object.assign({}, this.state.subObject.regularisation);
        this.props.handleChange({ target: { value: regularisation } }, 'regularisation', false, '');
        this.setState({
          subObject: {
            ...this.state.subObject,
            regularisation: Object.assign({}, regDefState),
          },
        });
        break;
      case 'edu':
        errorText = checkRequiredFields('edu', this.state.subObject.education);
        if (Object.keys(errorText).length > 0) {
          return self.setState({ errorText });
        }

        let education = Object.assign([], this.props.Employee.education || []);
        if (this.state.editIndex === '') education.push(this.state.subObject.education);
        else education[editIndex] = Object.assign({}, this.state.subObject.education);
        this.props.handleChange({ target: { value: education } }, 'education', false, '');
        this.setState({
          subObject: {
            ...this.state.subObject,
            education: Object.assign({}, eduDefState),
          },
        });
        break;
      case 'tech':
        errorText = checkRequiredFields('tech', this.state.subObject.technical);
        if (Object.keys(errorText).length > 0) {
          return self.setState({ errorText });
        }

        let technical = Object.assign([], this.props.Employee.technical || []);
        if (this.state.editIndex === '') technical.push(this.state.subObject.technical);
        else technical[editIndex] = Object.assign({}, this.state.subObject.technical);
        this.props.handleChange({ target: { value: technical } }, 'technical', false, '');
        this.setState({
          subObject: {
            ...this.state.subObject,
            technical: Object.assign({}, techDefState),
          },
        });
        break;
      case 'dept':
        errorText = checkRequiredFields('dept', this.state.subObject.test);
        if (Object.keys(errorText).length > 0) {
          return self.setState({ errorText });
        }

        let test = Object.assign([], this.props.Employee.test || []);
        if (this.state.editIndex === '') test.push(this.state.subObject.test);
        else test[editIndex] = Object.assign({}, this.state.subObject.test);
        this.props.handleChange({ target: { value: test } }, 'test', false, '');
        this.setState({
          subObject: {
            ...this.state.subObject,
            test: Object.assign({}, deptDefState),
          },
        });
        break;
    }

    this.handleClose();
  };

  renderContent = () => {
    let { handleChange } = this.props;
    let self = this;
    let { subObject, modal } = self.state;

    switch (modal) {
      case 'assignment':
        return (
          <form>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <label>
                  {
                    <span style={{ fontWeight: 500, }}>
                      {translate('employee.Assignment.fields.primary')}
                      <span style={{ color: '#FF0000', }}> *</span>
                    </span>
                  }{' '}
                </label>
                <RadioButtonGroup
                  name={translate('employee.Assignment.fields.primary')}
                  valueSelected={subObject.assignments.isPrimary}
                  onChange={(e, value) => {
                    self.handleStateChange({ target: { value: value } }, 'assignments', 'isPrimary');
                  }}
                >
                  <RadioButton className="radio-button-style" value={true} label={<Label label="employee.createPosition.groups.fields.outsourcepost.value1" />} />
                  <RadioButton className="radio-button-style" value={false} label={<Label label="employee.createPosition.groups.fields.outsourcepost.value2" />} />
                </RadioButtonGroup>
              </div>
              <div className="col-md-6 col-xs-12">
                <TextField className = "create-employee-text-field-cont"

                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  hintText="21/11/1993"
                  floatingLabelText={
                    <span>
                      {translate('employee.Assignment.fields.fromDate')}
                      <span style={{ color: '#FF0000'}}> *</span>
                    </span>
                  }
                  errorText={self.state.errorText['assignments.fromDate']}
                  value={subObject.assignments.fromDate}
                  onChange={e => {
                    self.handleStateChange(e, 'assignments', 'fromDate', true, datePat);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    whiteSpace: 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  hintText="21/11/1993"
                  floatingLabelText={
                    <span>
                      {translate('employee.Assignment.fields.toDate')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  errorText={self.state.errorText['assignments.toDate']}
                  value={subObject.assignments.toDate}
                  onChange={e => {
                    self.handleStateChange(e, 'assignments', 'toDate', true, datePat);
                  }}
                />
              </div>
              <div className="col-md-6 col-xs-12">
                <SelectField className="create-employee-text-field-cont"
                  dropDownMenuProps={{

                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                  errorText={self.state.errorText['assignments.department']}
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={
                    <span>
                      {translate('employee.Assignment.fields.department')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  value={subObject.assignments.department}
                  onChange={(event, key, value) => {
                    self.handleStateChange({ target: { value: value } }, 'assignments', 'department');
                  }}
                >
                  {self.state.departments &&
                    self.state.departments.map(function(v, i) {
                      return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                    })}
                </SelectField>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <SelectField className="create-employee-text-field-cont"
                  dropDownMenuProps={{

                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                  errorText={self.state.errorText['assignments.designation']}
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={
                    <span>
                      {translate('employee.Assignment.fields.designation')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  value={subObject.assignments.designation}
                  onChange={(event, key, value) => {
                    self.handleStateChange({ target: { value: value } }, 'assignments', 'designation');
                  }}
                >
                  {self.state.designations &&
                    self.state.designations.map(function(v, i) {
                      return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                    })}
                </SelectField>
              </div>
              <div className="col-md-6 col-xs-12">

                <AutoComplete className="create-employee-text-field-cont"
                  errorText={self.state.errorText['assignments.position']}
                  fullWidth={true}
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    fontWeight :500,
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={
                    <span>
                      {translate('employee.Assignment.fields.position')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  filter={AutoComplete.caseInsensitiveFilter}
                  dataSource={self.state.positionList}
                  dataSourceConfig={this.state.positionListConfig}
                  value={subObject.assignments.position}
                  onKeyUp={e => {
                    handleChange({ target: { value: '' } }, 'position', true, '');
                  }}
                  onNewRequest={(chosenRequest, index) => {
                    var e = {
                      target: {
                        value: chosenRequest.id,
                      },
                    };
                    self.handleStateChange(e, 'assignments', 'position');
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <SelectField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  dropDownMenuProps={{

                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                  floatingLabelText={translate('employee.Assignment.fields.grade')}
                  value={subObject.assignments.grade}
                  onChange={(event, key, value) => {
                    self.handleStateChange({ target: { value: value } }, 'assignments', 'grade');
                  }}
                >
                  {self.state.grades &&
                    self.state.grades.map(function(v, i) {
                      return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                    })}
                </SelectField>
              </div>
              <div className="col-md-6 col-xs-12">
                <SelectField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  dropDownMenuProps={{

                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                  floatingLabelText={translate('wc.create.groups.fields.Funtion')}
                  value={subObject.assignments.function}
                  onChange={(event, key, value) => {
                    self.handleStateChange({ target: { value: value } }, 'assignments', 'function');
                  }}
                >
                  {self.state.functions &&
                    self.state.functions.map(function(v, i) {
                      return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                    })}
                </SelectField>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <SelectField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  dropDownMenuProps={{

                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                  floatingLabelText={translate('employee.Assignment.fields.functionary')}
                  value={subObject.assignments.functionary}
                  onChange={(event, key, value) => {
                    self.handleStateChange({ target: { value: value } }, 'assignments', 'functionary');
                  }}
                >
                  {self.state.functionaries &&
                    self.state.functionaries.map(function(v, i) {
                      return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                    })}
                </SelectField>
              </div>
              <div className="col-md-6 col-xs-12">
                <SelectField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  dropDownMenuProps={{

                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                  floatingLabelText={translate('employee.Assignment.fields.fund')}
                  value={subObject.assignments.fund}
                  onChange={(event, key, value) => {
                    self.handleStateChange({ target: { value: value } }, 'assignments', 'fund');
                  }}
                >
                  {self.state.funds &&
                    self.state.funds.map(function(v, i) {
                      return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                    })}
                </SelectField>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <label style={{fontWeight : 500}}>
                  {translate('employee.Assignment.fields.hod') + ' ?'}
                  <span style={{ color: '#FF0000', }}> *</span>
                </label>
                <RadioButtonGroup
                  name={translate('employee.Assignment.fields.hod')}
                  valueSelected={subObject.assignments.hod}
                  onChange={(e, value) => {
                    self.handleStateChange({ target: { value: value } }, 'assignments', 'hod');
                  }}
                >
                  <RadioButton className="radio-button-style" value={true} label={<Label label="employee.createPosition.groups.fields.outsourcepost.value1" />} />
                  <RadioButton className="radio-button-style" value={false} label={<Label label="employee.createPosition.groups.fields.outsourcepost.value2" />} />
                </RadioButtonGroup>
              </div>
              <div className="col-md-6 col-xs-12">
                {subObject.assignments.hod && (
                  <SelectField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{

                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    errorText={self.state.errorText['assignments.mainDepartments']}
                    floatingLabelText={
                      <span>
                        {translate('employee.Assignment.fields.department')}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    multiple={true}
                    value={subObject.assignments.mainDepartments}
                    onChange={(event, key, value) => {
                      self.handleStateChange({ target: { value: value } }, 'assignments', 'mainDepartments');
                    }}
                  >
                    {self.state.departments &&
                      self.state.departments.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                      })}
                  </SelectField>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={translate('employee.Assignment.fields.govtOrderNumber')}
                  value={subObject.assignments.govtOrderNumber}
                  onChange={e => {
                    self.handleStateChange(e, 'assignments', 'govtOrderNumber');
                  }}
                />
              </div>
              <div className="col-md-6 col-xs-12">
                <label style={{ marginTop: '20px',fontWeight : 500 }}>{translate('employee.Assignment.fields.documents')}</label>
                <input type="file" />
              </div>
            </div>
          </form>
        );
      case 'jurisdiction':
        return (
          <form>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <SelectField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  dropDownMenuProps={{

                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                  errorText={self.state.errorText['jurisdictions.jurisdictionsType']}
                  floatingLabelText={
                    <span>
                      {translate('employee.Employee.fields.jurisdictionsType')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  value={subObject.jurisdictions.jurisdictionsType}
                  onChange={(event, key, value) => {
                    self.loadBoundaries(value);
                    self.handleStateChange({ target: { value: value } }, 'jurisdictions', 'jurisdictionsType');
                  }}
                >
                  {self.state.boundarytypes &&
                    self.state.boundarytypes.map(function(v, i) {
                      return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                    })}
                </SelectField>
              </div>
              <div className="col-md-6 col-xs-12">
                <SelectField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  dropDownMenuProps={{

                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                  errorText={self.state.errorText['jurisdictions.boundary']}
                  floatingLabelText={
                    <span>
                      {translate('employee.Employee.fields.jurisdictionsList')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  value={subObject.jurisdictions.boundary}
                  onChange={(event, key, value) => {
                    self.handleStateChange({ target: { value: value } }, 'jurisdictions', 'boundary');
                  }}
                >
                  {self.state.boundaries &&
                    self.state.boundaries.map(function(v, i) {
                      return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                    })}
                </SelectField>
              </div>
            </div>
          </form>
        );
      case 'serviceDet':
        return (
          <form>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  errorText={self.state.errorText['serviceHistory.serviceInfo']}
                  floatingLabelText={
                    <span>
                      {translate('employee.ServiceHistory.fields.ServiceEntryDescription')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  value={subObject.serviceHistory.serviceInfo}
                  onChange={e => {
                    self.handleStateChange(e, 'serviceHistory', 'serviceInfo');
                  }}
                />
              </div>
              <div className="col-md-6 col-xs-12">
                <TextField
                className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  hintText="21/11/1993"
                  floatingLabelText={
                    <span>
                      {translate('employee.ServiceHistory.fields.date')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  errorText={self.state.errorText['serviceHistory.serviceFrom']}
                  value={subObject.serviceHistory.serviceFrom}
                  onChange={e => {
                    self.handleStateChange(e, 'serviceHistory', 'serviceFrom', true, datePat);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={translate('employee.ServiceHistory.fields.remarks')}
                  value={subObject.serviceHistory.remarks}
                  onChange={e => {
                    self.handleStateChange(e, 'serviceHistory', 'remarks');
                  }}
                />
              </div>
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={translate('employee.ServiceHistory.fields.orderNo')}
                  value={subObject.serviceHistory.orderNo}
                  onChange={e => {
                    self.handleStateChange(e, 'serviceHistory', 'orderNo');
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <label style={{ marginTop: '20px',fontWeight : 500 }}>{translate('employee.ServiceHistory.fields.documents')}</label>
                <input type="file" />
              </div>
            </div>
          </form>
        );
      case 'probation':
        return (
          <form>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <SelectField className="create-employee-text-field-cont"
                  dropDownMenuProps={{

                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  errorText={self.state.errorText['probation.designation']}
                  floatingLabelText={
                    <span>
                      {translate('employee.Assignment.fields.designation')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  value={subObject.probation.designation}
                  onChange={(event, key, value) => {
                    self.handleStateChange({ target: { value: value } }, 'probation', 'designation');
                  }}
                >
                  {self.state.designations &&
                    self.state.designations.map(function(v, i) {
                      return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                    })}
                </SelectField>
              </div>
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"

                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  hintText="21/11/1993"
                  floatingLabelText={
                    <span>
                      {translate('employee.ServiceHistory.fields.date')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  errorText={self.state.errorText['probation.declaredOn']}
                  value={subObject.probation.declaredOn}
                  onChange={e => {
                    self.handleStateChange(e, 'probation', 'declaredOn', true, datePat);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"

                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={translate('employee.ServiceHistory.fields.orderNo')}
                  value={subObject.probation.orderNo}
                  onChange={e => {
                    self.handleStateChange(e, 'probation', 'orderNo');
                  }}
                />
              </div>
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"

                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  hintText="21/11/1993"
                  floatingLabelText={
                    <span>
                      {translate('employee.Probation.fields.orderDate')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  errorText={self.state.errorText['probation.orderDate']}
                  value={subObject.probation.orderDate}
                  onChange={e => {
                    self.handleStateChange(e, 'probation', 'orderDate', true, datePat);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"

                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={translate('employee.Probation.fields.remarks')}
                  value={subObject.probation.remarks}
                  onChange={e => {
                    self.handleStateChange(e, 'probation', 'remarks');
                  }}
                />
              </div>
              <div className="col-md-6 col-xs-12">
                <label style={{ marginTop: '20px',fontWeight : 500 }}>{translate('employee.Probation.fields.documents')}</label>
                <input type="file" multiple />
              </div>
            </div>
          </form>
        );
      case 'regular':
        return (
          <form>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <SelectField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  dropDownMenuProps={{

                    targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                  }}
                  errorText={self.state.errorText['regularisation.designation']}
                  floatingLabelText={
                    <span>
                      {translate('employee.Assignment.fields.designation')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  value={subObject.regularisation.designation}
                  onChange={(event, key, value) => {
                    self.handleStateChange({ target: { value: value } }, 'regularisation', 'designation');
                  }}
                >
                  {self.state.designations &&
                    self.state.designations.map(function(v, i) {
                      return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                    })}
                </SelectField>
              </div>
              <div style={{backgroundColor : "red"}} className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"

                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  hintText="21/11/1993"
                  floatingLabelText={
                    <span>
                      {translate('employee.Regularisation.fields.declaredOn')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  errorText={self.state.errorText['regularisation.declaredOn']}
                  value={subObject.regularisation.declaredOn}
                  onChange={e => {
                    self.handleStateChange(e, 'regularisation', 'declaredOn', true, datePat);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={translate('employee.Regularisation.fields.orderNo')}
                  value={subObject.regularisation.orderNo}
                  onChange={e => {
                    self.handleStateChange(e, 'regularisation', 'orderNo');
                  }}
                />
              </div>
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  hintText="21/11/1993"
                  floatingLabelText={
                    <span>
                      {translate('employee.Regularisation.fields.orderDate')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  errorText={self.state.errorText['regularisation.orderDate']}
                  value={subObject.regularisation.orderDate}
                  onChange={e => {
                    self.handleStateChange(e, 'regularisation', 'orderDate', true, datePat);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={translate('employee.Regularisation.fields.remarks')}
                  value={subObject.regularisation.remarks}
                  onChange={e => {
                    self.handleStateChange(e, 'regularisation', 'remarks');
                  }}
                />
              </div>
              <div className="col-md-6 col-xs-12">
                <label style={{ marginTop: '20px',fontWeight : 500 }}>{translate('employee.Regularisation.fields.documents')}</label>
                <input type="file" multiple />
              </div>
            </div>
          </form>
        );
      case 'edu':
        return (
          <form>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  errorText={self.state.errorText['education.qualification']}
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={
                    <span>
                      {translate('employee.EducationalQualification.fields.qualification')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  value={subObject.education.qualification}
                  onChange={e => {
                    self.handleStateChange(e, 'education', 'qualification');
                  }}
                />
              </div>
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={translate('employee.EducationalQualification.fields.majorSubject')}
                  value={subObject.education.majorSubject}
                  onChange={e => {
                    self.handleStateChange(e, 'education', 'majorSubject');
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  errorText={self.state.errorText['education.yearOfPassing']}
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  maxLength="4"
                  floatingLabelText={
                    <span>
                      {translate('employee.EducationalQualification.fields.yearOfPassing')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  value={subObject.education.yearOfPassing}
                  onChange={e => {
                    if (e.target.value && !/^\d*$/g.test(e.target.value)) return;
                    self.handleStateChange(e, 'education', 'yearOfPassing');
                  }}
                />
              </div>
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={translate('employee.EducationalQualification.fields.university')}
                  value={subObject.education.university}
                  onChange={e => {
                    self.handleStateChange(e, 'education', 'university');
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <label style={{ marginTop: '20px',fontWeight : 500 }}>{translate('employee.TechnicalQualification.fields.documents')}</label>
                <input type="file" multiple />
              </div>
            </div>
          </form>
        );
      case 'tech':
        return (
          <form>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  errorText={self.state.errorText['technical.skill']}
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={
                    <span>
                      {translate('employee.TechnicalQualification.fields.skill')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  value={subObject.technical.skill}
                  onChange={e => {
                    self.handleStateChange(e, 'technical', 'skill');
                  }}
                />
              </div>
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={translate('employee.TechnicalQualification.fields.grade')}
                  value={subObject.technical.grade}
                  onChange={e => {
                    self.handleStateChange(e, 'technical', 'grade');
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  maxLength="4"
                  floatingLabelText={translate('employee.TechnicalQualification.fields.yearOfPassing')}
                  value={subObject.technical.yearOfPassing}
                  onChange={e => {
                    if (e.target.value && !/^\d*$/g.test(e.target.value)) return;
                    self.handleStateChange(e, 'technical', 'yearOfPassing');
                  }}
                />
              </div>
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={translate('employee.TechnicalQualification.fields.remarks')}
                  value={subObject.technical.remarks}
                  onChange={e => {
                    self.handleStateChange(e, 'technical', 'remarks');
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <label style={{ marginTop: '20px',fontWeight : 500 }}>{translate('employee.TechnicalQualification.fields.documents')}</label>
                <input type="file" multiple />
              </div>
            </div>
          </form>
        );
      case 'dept':
        return (
          <form>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  errorText={self.state.errorText['technical.skill']}
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={
                    <span>
                      {translate('employee.DepartmentalTest.fields.test')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  value={subObject.test.test}
                  onChange={e => {
                    self.handleStateChange(e, 'test', 'test');
                  }}
                />
              </div>
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  errorText={self.state.errorText['technical.skill']}
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  maxLength="4"
                  floatingLabelText={
                    <span>
                      {translate('employee.TechnicalQualification.fields.yearOfPassing')}
                      <span style={{ color: '#FF0000' }}> *</span>
                    </span>
                  }
                  value={subObject.test.yearOfPassing}
                  onChange={e => {
                    if (e.target.value && !/^\d*$/g.test(e.target.value)) return;
                    self.handleStateChange(e, 'test', 'yearOfPassing');
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <TextField className="create-employee-text-field-cont"
                  floatingLabelStyle={{
                    color: '#696969',
                    fontSize: '20px',
                    'white-space': 'nowrap',
                    
                  }}
                  floatingLabelFixed={true}
                  floatingLabelText={translate('employee.TechnicalQualification.fields.remarks')}
                  value={subObject.test.remarks}
                  onChange={e => {
                    self.handleStateChange(e, 'test', 'remarks');
                  }}
                />
              </div>
              <div className="col-md-6 col-xs-12">
                <label style={{ marginTop: '20px',fontWeight : 500 }}>{translate('employee.TechnicalQualification.fields.documents')}</label>
                <input type="file" multiple />
              </div>
            </div>
          </form>
        );
    }
  };

  getModalTitle = () => {
    switch (this.state.modal) {
      case 'assignment':
        return <Label fontSize="24px" label="employee.field.assignments" />;
      case 'jurisdiction':
        return <Label fontSize="24px" label="employee.Employee.fields.jurisdictions" />;
      case 'serviceDet':
        return <Label fontSize="24px" label="employee.ServiceHistory.title" />;
      case 'probation':
        return <Label fontSize="24px" label="employee.Probation.title" />;
      case 'regular':
        return <Label fontSize="24px" label="employee.Regularisation.title" />;
      case 'edu':
        return <Label fontSize="24px" label="employee.EducationalQualification.title" />;
      case 'tech':
        return <Label fontSize="24px" label="employee.TechnicalQualification.title" />;
      case 'dept':
        return <Label fontSize="24px" label="employee.DepartmentalTest.title"/>;
    }
  };

  setModalOpen = type => {
    this.setState({
      open: true,
      isModalInvalid: true,
      errorText: {},
      modal: type,
      boundaries: [],
      editIndex: '',
      errorText: {},
      subObject: {
        assignments: Object.assign({}, assignmentsDefState),
        jurisdictions: Object.assign({}, jurisDefState),
        serviceHistory: Object.assign({}, serviceDefState),
        probation: Object.assign({}, probDefState),
        regularisation: Object.assign({}, regDefState),
        education: Object.assign({}, eduDefState),
        technical: Object.assign({}, techDefState),
        test: Object.assign({}, deptDefState),
      },
    });
  };

  setInitDat = (empObj, isUpdate) => {
    let self = this;
    Api.commonApiPost('hr-masters/hrconfigurations/_search', {}).then(
      function(res) {
        var autoCode = false,
          autoUName = false;
        if (
          res &&
          res['HRConfiguration'] &&
          (res['HRConfiguration']['Autogenerate_employeecode'][0] == 'N' || typeof res['HRConfiguration']['Autogenerate_employeecode'] == 'undefined')
        ) {
        } else {
          autoCode = true;
        }

        if (
          res &&
          res['HRConfiguration'] &&
          (res['HRConfiguration']['Autogenerate_username'][0] == 'N' || typeof res['HRConfiguration']['Autogenerate_username'] == 'undefined')
        ) {
        } else {
          autoUName = true;
        }

        self.setState({
          autoCode,
          autoUName,
        });

        self.props.setForm(empObj, isUpdate, autoCode, autoUName);
      },
      function(err) {
        self.props.setForm(empObj, isUpdate, false, false);
      }
    );
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.pathname != nextProps.history.location.pathname) {
      this.initDat();
    }
  }

  initDat = () => {
    let self = this;
    self.props.resetForm();
    self.setState(
      {
        pathname: self.props.history.location.pathname,
        screenType: window.location.hash.indexOf('update') > -1 ? 'update' : window.location.hash.indexOf('view') > -1 ? 'view' : 'create',
      },
      function() {
        if (self.state.screenType == 'update' || self.state.screenType == 'view') {
          Api.commonApiPost('/hr-employee/employees/' + self.props.match.params.id + '/_search', {}).then(
            function(res) {
              for (var i = 0; i < res.Employee.assignments.length; i++) {
                res.Employee.assignments[i].fromServer = true;
              }

              if (res.Employee && res.Employee.user && res.Employee.user.dob && res.Employee.user.dob.indexOf('-') > -1) {
                var dobArr = res.Employee.user.dob.split('-');
                res.Employee.user.dob = dobArr[2] + '/' + dobArr[1] + '/' + dobArr[0];
              }

              self.setInitDat(res.Employee, self.state.screenType != 'view' ? true : false);

              if (['view', 'update'].indexOf(self.state.screenType) > -1 && res.Employee.bank) {
                self.loadBranches(res.Employee.bank);
              }
            },
            function(err) {}
          );
        } else {
          self.setInitDat(
            {
              code: null,
              dateOfAppointment: '',
              dateOfJoining: '',
              dateOfRetirement: '',
              employeeStatus: '',
              recruitmentMode: '',
              recruitmentType: '',
              recruitmentQuota: '',
              retirementAge: '',
              dateOfResignation: '',
              dateOfTermination: '',
              employeeType: '',
              assignments: [],
              jurisdictions: [],
              motherTongue: '',
              religion: '',
              community: '',
              category: '',
              physicallyDisabled: false,
              medicalReportProduced: false,
              languagesKnown: [],
              maritalStatus: '',
              passportNo: null,
              gpfNo: null,
              bank: '',
              bankBranch: '',
              bankAccount: '',
              group: '',
              placeOfBirth: '',
              documents: [],
              serviceHistory: [],
              probation: [],
              regularisation: [],
              technical: [],
              education: [],
              test: [],
              user: {
                roles: [
                  {
                    code: 'EMPLOYEE',
                    name: 'EMPLOYEE',
                    tenantId: getTenantId(),
                  },
                ],
                userName: null,
                name: '',
                gender: '',
                mobileNumber: '',
                emailId: '',
                altContactNumber: '',
                pan: '',
                aadhaarNumber: '',
                permanentAddress: '',
                permanentCity: '',
                permanentPinCode: '',
                correspondenceCity: '',
                correspondencePinCode: '',
                correspondenceAddress: '',
                active: true,
                dob: '',
                locale: '',
                signature: '',
                fatherOrHusbandName: '',
                bloodGroup: null,
                identificationMark: '',
                photo: '',
                type: 'EMPLOYEE',
                password: '12345678',
                tenantId: getTenantId(),
              },
              tenantId: getTenantId(),
            },
            false
          );
        }
      }
    );

    let count = 23,
      _state = {};
    let checkCountAndSetState = function(key, res) {
      _state[key] = res;
      count--;
      if (count == 0) {
        self.setInitialState(_state);
        self.props.setLoadingStatus('hide');
      }
    };

    self.props.setLoadingStatus('loading');
    self.fetchURLData('/hr-masters/employeetypes/_search', {}, [], function(res) {
      checkCountAndSetState('employeetypes', res['EmployeeType']);
    });
    self.fetchURLData('hr-masters/positions/_search', {}, [], function(res) {
      checkCountAndSetState('allPosition', res['Position']);
    });
    self.fetchURLData('/hr-masters/hrstatuses/_search', { objectName: 'Employee Master' }, [], function(res) {
      checkCountAndSetState('statuses', res['HRStatus']);
    });
    self.fetchURLData('/hr-masters/groups/_search', {}, [], function(res) {
      checkCountAndSetState('groups', res['Group']);
    });
    self.fetchURLData('/egf-masters/banks/_search', {}, [], function(res) {
      checkCountAndSetState('banks', res['banks']);
    });
    self.fetchURLData('/egov-common-masters/categories/_search', {}, [], function(res) {
      checkCountAndSetState('categories', res['Category']);
    });
    self.fetchURLData('/hr-employee/maritalstatuses/_search', {}, [], function(res) {
      checkCountAndSetState('maritalstatuses', res['MaritalStatus']);
    });
    self.fetchURLData('/hr-employee/bloodgroups/_search', {}, [], function(res) {
      checkCountAndSetState('bloodgroups', res['BloodGroup']);
    });
    self.fetchURLData('/egov-common-masters/languages/_search', {}, [], function(res) {
      checkCountAndSetState('languages', res['Language']);
    });
    self.fetchURLData('/egov-common-masters/religions/_search', {}, [], function(res) {
      checkCountAndSetState('religions', res['Religion']);
    });
    self.fetchURLData('/hr-masters/recruitmentmodes/_search', {}, [], function(res) {
      checkCountAndSetState('recruitmentmodes', res['RecruitmentMode']);
    });
    self.fetchURLData('/hr-masters/recruitmenttypes/_search', {}, [], function(res) {
      checkCountAndSetState('recruitmenttypes', res['RecruitmentType']);
    });
    self.fetchURLData('/hr-masters/grades/_search', {}, [], function(res) {
      checkCountAndSetState('grades', res['Grade']);
    });
    self.fetchURLData('/egf-masters/funds/_search', {}, [], function(res) {
      checkCountAndSetState('funds', res['funds']);
    });
    self.fetchURLData('/egf-masters/functionaries/_search', {}, [], function(res) {
      checkCountAndSetState('functionaries', res['functionaries']);
    });
    self.fetchURLData('/egf-masters/functions/_search', {}, [], function(res) {
      checkCountAndSetState('functions', res['functions']);
    });
    self.fetchURLData('/egov-location/boundarytypes/getByHierarchyType', { hierarchyTypeName: 'ADMINISTRATION' }, [], function(res) {
      checkCountAndSetState('boundarytypes', res['BoundaryType']);
    });
    self.fetchURLData('hr-masters/designations/_search', {}, [], function(res) {
      checkCountAndSetState('designations', res['Designation']);
    });
    self.fetchURLData('egov-common-masters/departments/_search', {}, [], function(res) {
      checkCountAndSetState('departments', res['Department']);
    });
    self.fetchURLData('hr-masters/recruitmentquotas/_search', {}, [], function(res) {
      checkCountAndSetState('recruitmentquotas', res['RecruitmentQuota']);
    });
    self.fetchURLData('egov-common-masters/genders/_search', {}, [], function(res) {
      checkCountAndSetState('genders', res['Gender']);
    });
    self.fetchURLData('egov-common-masters/communities/_search', {}, [], function(res) {
      checkCountAndSetState('communities', res['Community']);
    });

    Api.commonApiGet('egov-location/boundarys', {
      'Boundary.tenantId': getTenantId(),
    }).then(
      function(res) {
        checkCountAndSetState('allBoundariesList', res['Boundary']);
      },
      function(err) {
        checkCountAndSetState('allBoundariesList', []);
      }
    );
  };

  componentDidMount() {
    this.initDat();
  }

  handleDateChange = (type, date, isRequired) => {
    let self = this;
    let _date = new Date(date);
    let name;
    switch (type) {
      case 'dob':
        name = 'user.dob';
        break;
      case 'appointmentDate':
        name = 'dateOfAppointment';
        if (self.props.Employee.dateOfRetirement) {
          var dateParts1 = self.props.Employee.dateOfRetirement.split('/');
          var newDateStr = dateParts1[1] + '/' + dateParts1[0] + '/ ' + dateParts1[2];
          var date1 = new Date(newDateStr).getTime();
          if (date > date1) return self.props.toggleSnackbarAndSetText(true, translate('employee.error.message.appDate.retDate'), false, "error");
        }

        if (self.props.Employee.dateOfTermination) {
          var dateParts1 = self.props.Employee.dateOfTermination.split('/');
          var newDateStr = dateParts1[1] + '/' + dateParts1[0] + '/ ' + dateParts1[2];
          var date1 = new Date(newDateStr).getTime();
          if (date > date1) return self.props.toggleSnackbarAndSetText(true, translate('employee.error.message.appDate.terDate'), false, "error");
        }

        if (self.props.Employee.dateOfResignation) {
          var dateParts1 = self.props.Employee.dateOfResignation.split('/');
          var newDateStr = dateParts1[1] + '/' + dateParts1[0] + '/ ' + dateParts1[2];
          var date1 = new Date(newDateStr).getTime();
          if (date > date1) return self.props.toggleSnackbarAndSetText(true, translate('employee.error.message.appDate.regDate'), false, "error");
        }

        if (self.props.Employee.dateOfJoining) {
          var dateParts1 = self.props.Employee.dateOfResignation.split('/');
          var newDateStr = dateParts1[1] + '/' + dateParts1[0] + '/ ' + dateParts1[2];
          var date1 = new Date(newDateStr).getTime();
          if (date > date1) return self.props.toggleSnackbarAndSetText(true, translate('employee.error.message.appDate.joinDate'), false, "error");
        }
        break;
      case 'joiningDate':
        name = 'dateOfJoining';
        if (self.props.Employee.dateOfAppointment) {
          var dateParts1 = self.props.Employee.dateOfAppointment.split('/');
          var newDateStr = dateParts1[1] + '/' + dateParts1[0] + '/ ' + dateParts1[2];
          var date1 = new Date(newDateStr).getTime();
          if (date < date1) return self.props.toggleSnackbarAndSetText(true, translate('employee.error.message.appDate.joinDate'), false, "error");
        }

        if (self.props.Employee.dateOfRetirement) {
          var dateParts1 = self.props.Employee.dateOfRetirement.split('/');
          var newDateStr = dateParts1[1] + '/' + dateParts1[0] + '/ ' + dateParts1[2];
          var date1 = new Date(newDateStr).getTime();
          if (date > date1) return self.props.toggleSnackbarAndSetText(true, translate('employee.error.message.retDate.joinDate'), false, "error");
        }

        if (self.props.Employee.dateOfTermination) {
          var dateParts1 = self.props.Employee.dateOfTermination.split('/');
          var newDateStr = dateParts1[1] + '/' + dateParts1[0] + '/ ' + dateParts1[2];
          var date1 = new Date(newDateStr).getTime();
          if (date > date1) return self.props.toggleSnackbarAndSetText(true, translate('employee.error.message.joinDate.terDate'), false, "error");
        }

        if (self.props.Employee.dateOfResignation) {
          var dateParts1 = self.props.Employee.dateOfTermination.split('/');
          var newDateStr = dateParts1[1] + '/' + dateParts1[0] + '/ ' + dateParts1[2];
          var date1 = new Date(newDateStr).getTime();
          if (date > date1) return self.props.toggleSnackbarAndSetText(true, translate('employee.error.message.joinDate.regDate'), false, "error");
        }
        break;
      case 'retirementDate':
        name = 'dateOfRetirement';
        if (self.props.Employee.dateOfAppointment) {
          var dateParts1 = self.props.Employee.dateOfAppointment.split('/');
          var newDateStr = dateParts1[1] + '/' + dateParts1[0] + '/ ' + dateParts1[2];
          var date1 = new Date(newDateStr).getTime();
          if (date < date1) return self.props.toggleSnackbarAndSetText(true, translate('employee.error.message.appDate.retDate'), false, "error");
        }
        if (self.props.Employee.dateOfJoining) {
          var dateParts1 = self.props.Employee.dateOfAppointment.split('/');
          var newDateStr = dateParts1[1] + '/' + dateParts1[0] + '/ ' + dateParts1[2];
          var date1 = new Date(newDateStr).getTime();
          if (date < date1) return self.props.toggleSnackbarAndSetText(true, translate('employee.error.message.retDate.joinDate'), false, "error");
        }
        break;
      case 'terminationDate':
        name = 'dateOfTermination';
        if (self.props.Employee.dateOfAppointment) {
          var dateParts1 = self.props.Employee.dateOfAppointment.split('/');
          var newDateStr = dateParts1[1] + '/' + dateParts1[0] + '/ ' + dateParts1[2];
          var date1 = new Date(newDateStr).getTime();
          if (date < date1) return self.props.toggleSnackbarAndSetText(true, translate('employee.error.message.appDate.terDate'), false, "error");
        }

        if (self.props.Employee.dateOfJoining) {
          var dateParts1 = self.props.Employee.dateOfJoining.split('/');
          var newDateStr = dateParts1[1] + '/' + dateParts1[0] + '/ ' + dateParts1[2];
          var date1 = new Date(newDateStr).getTime();
          if (date < date1) return self.props.toggleSnackbarAndSetText(true, translate('employee.error.message.joinDate.terDate'), false, "error");
        }
        break;
      case 'resignationDate':
        name = 'dateOfResignation';
        if (self.props.Employee.dateOfAppointment) {
          var dateParts1 = self.props.Employee.dateOfAppointment.split('/');
          var newDateStr = dateParts1[1] + '/' + dateParts1[0] + '/ ' + dateParts1[2];
          var date1 = new Date(newDateStr).getTime();
          if (date < date1) return self.props.toggleSnackbarAndSetText(true, translate('employee.error.message.appDate.regDate'), false,"error");
        }

        if (self.props.Employee.dateOfJoining) {
          var dateParts1 = self.props.Employee.dateOfJoining.split('/');
          var newDateStr = dateParts1[1] + '/' + dateParts1[0] + '/ ' + dateParts1[2];
          var date1 = new Date(newDateStr).getTime();
          if (date < date1) return self.props.toggleSnackbarAndSetText(true, translate('employee.error.message.joinDate.regDate'), false, "error");
        }
        break;
    }

    if (name.indexOf('.') == -1) {
      self.props.handleChange(
        {
          target: {
            value: ('0' + _date.getDate()).slice(-2) + '/' + ('0' + (_date.getMonth() + 1)).slice(-2) + '/' + _date.getFullYear(),
          },
        },
        name,
        isRequired || false,
        ''
      );
    } else {
      var _split = name.split('.');
      self.props.handleChangeNextLevel(
        {
          target: {
            value: ('0' + _date.getDate()).slice(-2) + '/' + ('0' + (_date.getMonth() + 1)).slice(-2) + '/' + _date.getFullYear(),
          },
        },
        _split[0],
        _split[1],
        isRequired || false,
        ''
      );
    }
  };

  renderEmployee() {
    let {  Employee, fieldErrors, handleChange, handleChangeNextLevel } = this.props;

    let self = this;
    return (
      <Card className="uiCard create-employee-card">
        <CardText>
          {/* <Grid> */}
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label label="employee.Employee.fields.User.name" containerStyle={{display : "inline"}} fontSize = "20px" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.name : '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={
                      <span>
                        {<Label fontSize = "20px" label="employee.Employee.fields.User.name" containerStyle={{display : "inline"}} />}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={fieldErrors['user'] && fieldErrors['user']['name']}
                    value={Employee.user ? Employee.user.name : ''}
                    onChange={e => {
                      handleChangeNextLevel(e, 'user', 'name', true, '');
                    }}
                  />
                )}
              </Col>
              <Col
                xs={12}
                sm={4}
                md={3}
                lg={3}
                style={{
                  display: self.state.screenType == 'create' && self.state.autoCode ? 'none' : 'block',
                }}
              >
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.code" containerStyle={{display : "inline"}}/>}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.code || '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    inputStyle={{ color: '#5F5C57' }}
                    floatingLabelStyle={{
                      color: self.state.screenType == 'update' || self.state.autoCode ? '#A9A9A9' : '#696969',
                      fontSize: '20px',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={
                      <span>
                        {<Label fontSize = "20px" containerStyle={{display : "inline"}} label="employee.Employee.fields.code" />}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={fieldErrors['code']}
                    value={Employee.code}
                    onChange={e => {
                      handleChange(e, 'code', true, '');
                    }}
                    disabled={self.state.screenType == 'update' || self.state.autoCode}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.employeeType" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{getNameById(self.state.employeetypes, Employee.employeeType) || '-'}</label>
                  </span>
                ) : (
                  <div ref="myField">
                    <SelectField className="create-employee-text-field-cont"
                      floatingLabelStyle={{
                        color: '#696969',
                        fontSize: '20px',
                        'white-space': 'nowrap',
                        
                      }}
                      floatingLabelFixed={true}
                      dropDownMenuProps={{

                        targetOrigin: {
                          horizontal: 'left',
                          vertical: 'bottom',
                        },
                      }}
                      floatingLabelText={
                        <span>
                          {<Label fontSize = "20px" label="employee.Employee.fields.employeeType" containerStyle={{display : "inline"}}/>}
                          <span style={{ color: '#FF0000' }}> *</span>
                        </span>
                      }
                      errorText={fieldErrors['employeeType']}
                      value={Employee.employeeType}
                      onChange={(event, key, value) => {
                        handleChange({ target: { value: value } }, 'employeeType', true, '');
                      }}
                    >
                      {self.state.employeetypes &&
                        self.state.employeetypes.map(function(v, i) {
                          return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                        })}
                    </SelectField>
                  </div>
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.employeeStatus" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{getNameById(self.state.statuses, Employee.employeeStatus) || '-'}</label>
                  </span>
                ) : (
                  <SelectField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{

                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={
                      <span>
                        {<Label fontSize = "20px" label="employee.Employee.fields.employeeStatus" containerStyle={{display : "inline"}}/>}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={fieldErrors['employeeStatus']}
                    value={Employee.employeeStatus}
                    onChange={(event, key, value) => {
                      handleChange({ target: { value: value } }, 'employeeStatus', true, '');
                    }}
                  >
                    {self.state.statuses &&
                      self.state.statuses.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.code} />;
                      })}
                  </SelectField>
                )}
              </Col>
            </Row>
            {self.state.screenType == 'view' && <br />}
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize="20px" label="employee.Employee.fields.group" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{getNameById(self.state.groups, Employee.group) || '-'}</label>
                  </span>
                ) : (
                  <SelectField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{

                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={<Label fontSize="20px" label="employee.Employee.fields.group" />}
                    errorText={fieldErrors['group']}
                    value={Employee.group}
                    onChange={(event, key, value) => {
                      handleChange({ target: { value: value } }, 'group', false, '');
                    }}
                  >
                    {self.state.groups &&
                      self.state.groups.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                      })}
                  </SelectField>
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize="20px" label="employee.Employee.fields.dateOfBirth" containerStyle={{display : "inline"}}/>}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.dob : '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    hintText="21/11/1993"
                    floatingLabelText={
                      <span>
                        {<Label fontSize="20px" label="employee.Employee.fields.dateOfBirth" containerStyle={{display : "inline"}}/>}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={fieldErrors['user'] && fieldErrors['user']['dob']}
                    value={Employee.user ? Employee.user.dob : ''}
                    onChange={e => {
                      handleChangeNextLevel(e, 'user', 'dob', true, datePat);
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label label="employee.Employee.fields.User.gender" fontSize = "20px"/>}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.gender : '-'}</label>
                  </span>
                ) : (
                  <SelectField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{

                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={
                      <span>
                        {<Label label="employee.Employee.fields.User.gender" fontSize = "20px" containerStyle={{display : "inline"}}/>}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={fieldErrors['user'] && fieldErrors['user']['gender']}
                    value={Employee.user ? Employee.user.gender : ''}
                    onChange={(event, key, value) => {
                      handleChangeNextLevel({ target: { value: value } }, 'user', 'gender', true, '');
                    }}
                  >
                    {self.state.genders &&
                      self.state.genders.map(function(v, i) {
                        return <MenuItem value={v} key={i} primaryText={v} />;
                      })}
                  </SelectField>
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize="24px" label="employee.Employee.fields.maritalStatus" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.maritalStatus || '-'}</label>
                  </span>
                ) : (
                  <SelectField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{

                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={
                      <span>
                        {<Label fontSize="24px" label="employee.Employee.fields.maritalStatus" containerStyle={{display : "inline"}}/>}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={fieldErrors['maritalStatus']}
                    value={Employee.maritalStatus}
                    onChange={(event, key, value) => {
                      handleChange({ target: { value: value } }, 'maritalStatus', true, '');
                    }}
                  >
                    {self.state.maritalstatuses &&
                      self.state.maritalstatuses.map(function(v, i) {
                        return <MenuItem value={v} key={i} primaryText={v} />;
                      })}
                  </SelectField>
                )}
              </Col>
            </Row>
            {self.state.screenType == 'view' && <br />}
            <Row>
              <Col
                xs={12}
                sm={4}
                md={3}
                lg={3}
                style={{
                  display: self.state.screenType == 'create' && self.state.autoUName ? 'none' : 'block',
                }}
              >
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.User.userName" containerStyle={{display : "inline"}}/>}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.userName : '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    inputStyle={{ color: '#5F5C57' }}
                    floatingLabelStyle={{
                      color: self.state.screenType == 'update' || self.state.autoUName ? '#A9A9A9' : '#696969',
                      fontSize: '20px',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={
                      <span>
                        {<Label label="employee.Employee.fields.User.userName" fontSize = "20px" containerStyle={{display : "inline"}}/>}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={fieldErrors['user'] && fieldErrors['user']['userName']}
                    errorText={fieldErrors['user.userName']}
                    value={Employee.user ? Employee.user.userName : ''}
                    onChange={e => {
                      handleChangeNextLevel(e, 'user', 'userName', true, '');
                    }}
                    disabled={self.state.screenType == 'update' || self.state.autoUName}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      <span style={{ fontWeight: '500' }}>{<Label fontSize = "15px" label="employee.fields.isUserActive" />}?</span>
                    </label>
                    <br />
                    <label>
                      {Employee.user && [true, 'true'].indexOf(Employee.user.active) > -1
                        ? translate('employee.createPosition.groups.fields.outsourcepost.value1')
                        : translate('employee.createPosition.groups.fields.outsourcepost.value2')}
                    </label>
                  </span>
                ) : (
                  <span>
                    <label style={{ fontSize: '15px',fontWeight: '500' }}>
                      {<Label fontSize = "15px" label="employee.fields.isUserActive" containerStyle={{display : "inline"}}/>}
                      <span style={{ color: '#FF0000', }}> *</span>
                    </label>
                    <RadioButtonGroup
                      name="isActive"
                      valueSelected={Employee.user ? Employee.user.active : ''}
                      onChange={(e, value) => {
                        handleChangeNextLevel({ target: { value: value } }, 'user', 'active', true, '');
                      }}
                    >
                      <RadioButton  className="radio-button-style" value={true} label={<Label label="employee.createPosition.groups.fields.outsourcepost.value1" />} />
                      <RadioButton className="radio-button-style" value={false} label={<Label label="employee.createPosition.groups.fields.outsourcepost.value2" />} />
                    </RadioButtonGroup>
                  </span>
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label label="employee.Employee.fields.User.mobileNumber" containerStyle={{display : "inline"}} fontSize = "20px"/>}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.mobileNumber : '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    maxLength="10"
                    floatingLabelText={
                      <span>
                        {<Label label="employee.Employee.fields.User.mobileNumber" containerStyle={{display : "inline"}} fontSize = "20px"/>}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={fieldErrors['user'] && fieldErrors['user']['mobileNumber']}
                    value={Employee.user ? Employee.user.mobileNumber : ''}
                    onChange={e => {
                      if (e.target.value && !/^\d*$/g.test(e.target.value)) return;
                      handleChangeNextLevel(e, 'user', 'mobileNumber', true, /^\d{10}$/);
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label label="employee.Employee.fields.email" fontSize = "20px"/>}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.emailId : '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.email" />}
                    errorText={fieldErrors['user'] && fieldErrors['user']['emailId']}
                    type="email"
                    value={Employee.user ? Employee.user.emailId : ''}
                    onChange={e => {
                      handleChangeNextLevel(
                        e,
                        'user',
                        'emailId',
                        false,
                        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                      );
                    }}
                  />
                )}
              </Col>
            </Row>
            {self.state.screenType == 'view' && <br />}
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      <span style={{ fontWeight: '500' }}>{<Label fontSize = "20px" label="employee.Employee.fields.fatherSpouseName" />}</span>
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.fatherOrHusbandName : '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.fatherSpouseName" />}
                    errorText={fieldErrors['user'] && fieldErrors['user']['fatherOrHusbandName']}
                    value={Employee.user ? Employee.user.fatherOrHusbandName : ''}
                    onChange={e => {
                      handleChangeNextLevel(e, 'user', 'fatherOrHusbandName', false, '');
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label label="employee.Employee.fields.User.birth" fontSize = "20px"/>}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.placeOfBirth || '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={<Label label="employee.Employee.fields.User.birth" fontSize = "20px"/>}
                    errorText={fieldErrors['placeOfBirth']}
                    value={Employee.placeOfBirth}
                    onChange={e => {
                      handleChange(e, 'placeOfBirth', false, '');
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label label="employee.Employee.fields.User.bloodGroup" fontSize = "20px"/>}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.bloodGroup : '-'}</label>
                  </span>
                ) : (
                  <SelectField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{

                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={<Label label="employee.Employee.fields.User.bloodGroup" fontSize = "20px"/>}
                    errorText={fieldErrors['user'] && fieldErrors['user']['bloodGroup']}
                    value={Employee.user ? Employee.user.bloodGroup : ''}
                    onChange={(event, key, value) => {
                      handleChangeNextLevel({ target: { value: value } }, 'user', 'bloodGroup', false, '');
                    }}
                  >
                    {self.state.bloodgroups &&
                      self.state.bloodgroups.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                      })}
                  </SelectField>
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      <span style={{ fontWeight: '500' }}>{<Label fontSize = "20px" label="employee.Employee.fields.motherTongue" />}</span>
                    </label>
                    <br />
                    <label>{getNameById(self.state.languages, Employee.motherTongue) || '-'}</label>
                  </span>
                ) : (
                  <SelectField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{

                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.motherTongue" />}
                    errorText={fieldErrors['motherTongue']}
                    value={Employee.motherTongue}
                    onChange={(event, key, value) => {
                      handleChange({ target: { value: value } }, 'motherTongue', false, '');
                    }}
                  >
                    {self.state.languages &&
                      self.state.languages.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                      })}
                  </SelectField>
                )}
              </Col>
            </Row>
            {self.state.screenType == 'view' && <br />}
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      <span style={{ fontWeight: '500' }}>{<Label fontSize = "20px" label="employee.Employee.fields.religion" />}</span>
                    </label>
                    <br />
                    <label>{getNameById(self.state.religions, Employee.religion) || '-'}</label>
                  </span>
                ) : (
                  <SelectField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{

                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.religion" />}
                    errorText={fieldErrors['religion']}
                    value={Employee.religion}
                    onChange={(event, key, value) => {
                      handleChange({ target: { value: value } }, 'religion', false, '');
                    }}
                  >
                    {self.state.religions &&
                      self.state.religions.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                      })}
                  </SelectField>
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      <span style={{ fontWeight: '500' }}>{<Label fontSize = "20px" label="employee.Employee.fields.community" />}</span>
                    </label>
                    <br />
                    <label>{getNameById(self.state.communities, Employee.community) || '-'}</label>
                  </span>
                ) : (
                  <SelectField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{

                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.community" />}
                    errorText={fieldErrors['community']}
                    value={Employee.community}
                    onChange={(event, key, value) => {
                      handleChange({ target: { value: value } }, 'community', false, '');
                    }}
                  >
                    {self.state.communities &&
                      self.state.communities.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                      })}
                  </SelectField>
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      <span style={{ fontWeight: '500' }}>{<Label fontSize = "20px" label="employee.Employee.fields.category" />}</span>
                    </label>
                    <br />
                    <label>{getNameById(self.state.categories, Employee.category) || '-'}</label>
                  </span>
                ) : (
                  <SelectField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{

                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.category" />}
                    errorText={fieldErrors['category']}
                    value={Employee.category}
                    onChange={(event, key, value) => {
                      handleChange({ target: { value: value } }, 'category', false, '');
                    }}
                  >
                    {self.state.categories &&
                      self.state.categories.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                      })}
                  </SelectField>
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      <span style={{ fontWeight: '500' }}>{<Label fontSize = "15px" label="employee.Employee.fields.physicallyDisabled" />}</span>
                    </label>
                    <br />
                    <label>
                      {translate('employee.Employee.fields.physicallyDisabled')
                        ? translate('employee.createPosition.groups.fields.outsourcepost.value1')
                        : translate('employee.createPosition.groups.fields.outsourcepost.value2')}
                    </label>
                  </span>
                ) : (
                  <span>
                    <label style={{ fontSize: '15px',fontWeight: '500' }}>{<Label fontSize = "15px" label="employee.Employee.fields.physicallyDisabled" />}</label>
                    <RadioButtonGroup
                      name={<Label fontSize = "20px" label="employee.Employee.fields.physicallyDisabled" />}
                      valueSelected={Employee.physicallyDisabled}
                      onChange={(e, value) => {
                        handleChange({ target: { value: value } }, 'physicallyDisabled', false, '');
                      }}
                    >
                      <RadioButton className="radio-button-style" value={true} label={<Label label="employee.createPosition.groups.fields.outsourcepost.value1" />} />
                      <RadioButton className="radio-button-style" value={false} label={<Label label="employee.createPosition.groups.fields.outsourcepost.value2 "/>} />
                    </RadioButtonGroup>
                  </span>
                )}
              </Col>
            </Row>
            {self.state.screenType == 'view' && <br />}
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "15px" label="employee.Employee.fields.medicalReportProduced" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>
                      {Employee.medicalReportProduced
                        ? translate('employee.createPosition.groups.fields.outsourcepost.value1')
                        : translate('employee.createPosition.groups.fields.outsourcepost.value2')}
                    </label>
                  </span>
                ) : (
                  <span>
                    <label style={{ fontSize: '15px',fontWeight: '500' }}>{<Label fontSize = "15px" label="employee.Employee.fields.medicalReportProduced" /> }</label>
                    <RadioButtonGroup
                      name={"medicalReportProduced"}
                      valueSelected={Employee.medicalReportProduced}
                      onChange={(e, value) => {
                        handleChange({ target: { value: value } }, 'medicalReportProduced', false, '');
                      }}
                    >
                      <RadioButton className="radio-button-style" value={true} label={<Label label="employee.createPosition.groups.fields.outsourcepost.value1" />} />
                      <RadioButton className="radio-button-style" value={false} label={<Label label="employee.createPosition.groups.fields.outsourcepost.value2" />} />
                    </RadioButtonGroup>
                  </span>
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.identification" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.identificationMark : '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.identification" />}
                    errorText={fieldErrors['user'] && fieldErrors['user']['identificationMark']}
                    value={Employee.user ? Employee.user.identificationMark : ''}
                    onChange={e => {
                      handleChangeNextLevel(e, 'user', 'identificationMark', false, '');
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.pan" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.pan : '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.pan" />}
                    hintText="DACPZ2154D"
                    errorText={fieldErrors['user'] && fieldErrors['user']['pan']}
                    value={Employee.user ? Employee.user.pan : ''}
                    onChange={e => {
                      handleChangeNextLevel(e, 'user', 'pan', false, /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/);
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.passportNo" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.passportNo || '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.passportNo" />}
                    errorText={fieldErrors['passportNo']}
                    value={Employee.passportNo}
                    onChange={e => {
                      handleChange(e, 'passportNo', false, '');
                    }}
                  />
                )}
              </Col>
            </Row>
            {self.state.screenType == 'view' && <br />}
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.gpfNo" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.gpfNo || '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.gpfNo" />}
                    errorText={fieldErrors['gpfNo']}
                    value={Employee.gpfNo}
                    onChange={e => {
                      handleChange(e, 'gpfNo', false, '');
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      <span style={{ fontWeight: '500' }}>{<Label label="employee.Employee.fields.User.aadhaarNumber" fontSize = "20px"/>}</span>
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.aadhaarNumber : '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    maxLength="12"
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.User.aadhaarNumber" />}
                    errorText={fieldErrors['user'] && fieldErrors['user']['aadhaarNumber']}
                    value={Employee.user ? Employee.user.aadhaarNumber : ''}
                    onChange={e => {
                      if (e.target.value && !/^\d*$/g.test(e.target.value)) return;
                      handleChangeNextLevel(e, 'user', 'aadhaarNumber', false, /^\d{12}$/);
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.bank" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{getNameById(self.state.banks, Employee.bank) || '-'}</label>
                  </span>
                ) : (
                  <SelectField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{

                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.bank" />}
                    errorText={fieldErrors['bank']}
                    value={Employee.bank}
                    onChange={(event, key, value) => {
                      self.loadBranches(value);
                      handleChange({ target: { value: value } }, 'bank', false, '');
                    }}
                  >
                    {self.state.banks &&
                      self.state.banks.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                      })}
                  </SelectField>
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.bankBranch" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{getNameById(self.state.bankBranches, Employee.bankBranch) || '-'}</label>
                  </span>
                ) : (
                  <SelectField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{

                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.bankBranch"/>}
                    errorText={fieldErrors['bankBranch']}
                    value={Employee.bankBranch}
                    onChange={(event, key, value) => {
                      handleChange({ target: { value: value } }, 'bankBranch', false, '');
                    }}
                  >
                    {self.state.bankBranches &&
                      self.state.bankBranches.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                      })}
                  </SelectField>
                )}
              </Col>
            </Row>
            {self.state.screenType == 'view' && <br />}
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      <span style={{ fontWeight: '500' }}>{<Label fontSize = "20px" label="employee.Employee.fields.bankAccount" />}</span>
                    </label>
                    <br />
                    <label>{Employee.bankAccount}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.bankAccount" />}
                    errorText={fieldErrors['bankAccount']}
                    value={Employee.bankAccount}
                    onChange={e => {
                      if (e.target.value && !/^\d*$/g.test(e.target.value)) return;
                      handleChange(e, 'bankAccount', false, '');
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      <span style={{ fontWeight: '500' }}>{<Label label="employee.Employee.fields.User.mobileNumber" fontSize = "20px"/>}</span>
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.altContactNumber : '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    maxLength="10"
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.User.mobileNumber" />}
                    errorText={fieldErrors['user'] && fieldErrors['user']['altContactNumber']}
                    value={Employee.user ? Employee.user.altContactNumber : ''}
                    onChange={e => {
                      if (e.target.value && !/^\d*$/g.test(e.target.value)) return;
                      handleChangeNextLevel(e, 'user', 'altContactNumber', false, /^\d{10}$/);
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3} />
              <Col xs={12} sm={4} md={3} lg={3} />
            </Row>
            {self.state.screenType == 'view' && <br />}
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.permanentAddress" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.permanentAddress : '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.permanentAddress" />}
                    errorText={fieldErrors['user'] && fieldErrors['user']['permanentAddress']}
                    value={Employee.user ? Employee.user.permanentAddress : ''}
                    onChange={e => {
                      handleChangeNextLevel(e, 'user', 'permanentAddress', false, '');
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.city" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.permanentCity : '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.city" />}
                    errorText={fieldErrors['user'] && fieldErrors['user']['permanentCity']}
                    value={Employee.user ? Employee.user.permanentCity : ''}
                    onChange={e => {
                      handleChangeNextLevel(e, 'user', 'permanentCity', false, '');
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.parmanentPinNumber" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.permanentPinCode : '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.parmanentPinNumber" />}
                    errorText={fieldErrors['user'] && fieldErrors['user']['permanentPinCode']}
                    value={Employee.user ? Employee.user.permanentPinCode : ''}
                    onChange={e => {
                      if (e.target.value && !/^\d*$/g.test(e.target.value)) return;
                      handleChangeNextLevel(e, 'user', 'permanentPinCode', false, '');
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3} />
            </Row>
            {self.state.screenType == 'view' && <br />}
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.correspondenceAddress" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.correspondenceAddress : '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.correspondenceAddress" />}
                    errorText={fieldErrors['user'] && fieldErrors['user']['correspondenceAddress']}
                    value={Employee.user ? Employee.user.correspondenceAddress : ''}
                    onChange={e => {
                      handleChangeNextLevel(e, 'user', 'correspondenceAddress', false, '');
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.city" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.correspondenceCity : '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.city" />}
                    errorText={fieldErrors['user.correspondenceCity']}
                    value={Employee.user ? Employee.user.correspondenceCity : ''}
                    onChange={e => {
                      handleChangeNextLevel(e, 'user', 'correspondenceCity', false, '');
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.correspondencePinNumber" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.user ? Employee.user.correspondencePinCode : '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.correspondencePinNumber" />}
                    errorText={fieldErrors['user'] && fieldErrors['user']['correspondencePinCode']}
                    value={Employee.user ? Employee.user.correspondencePinCode : ''}
                    onChange={e => {
                      if (e.target.value && !/^\d*$/g.test(e.target.value)) return;
                      handleChangeNextLevel(e, 'user', 'correspondencePinCode', false, '');
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3} />
            </Row>
            {self.state.screenType == 'view' && <br />}
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.languagesKnown" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.languagesKnown || '-'}</label>
                  </span>
                ) : (
                  <SelectField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{

                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.languagesKnown" />}
                    errorText={fieldErrors['languagesKnown']}
                    multiple={true}
                    value={Employee.languagesKnown}
                    onChange={(event, key, value) => {
                      handleChange({ target: { value: value } }, 'languagesKnown', false, '');
                    }}
                  >
                    {self.state.languages &&
                      self.state.languages.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                      })}
                  </SelectField>
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.recruitmentMode" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.recruitmentMode || '-'}</label>
                  </span>
                ) : (
                  <SelectField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{

                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.recruitmentMode" />}
                    errorText={fieldErrors['recruitmentMode']}
                    value={Employee.recruitmentMode}
                    onChange={(event, key, value) => {
                      handleChange({ target: { value: value } }, 'recruitmentMode', false, '');
                    }}
                  >
                    {self.state.recruitmentmodes &&
                      self.state.recruitmentmodes.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                      })}
                  </SelectField>
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.recruitmentType" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.recruitmentType || '-'}</label>
                  </span>
                ) : (
                  <SelectField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{

                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.recruitmentType" />}
                    errorText={fieldErrors['recruitmentType']}
                    value={Employee.recruitmentType}
                    onChange={(event, key, value) => {
                      handleChange({ target: { value: value } }, 'recruitmentType', false, '');
                    }}
                  >
                    {self.state.recruitmenttypes &&
                      self.state.recruitmenttypes.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                      })}
                  </SelectField>
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.recruitmentQuota" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.recruitmentQuota || '-'}</label>
                  </span>
                ) : (
                  <SelectField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    dropDownMenuProps={{

                      targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                    }}
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.recruitmentQuota" />}
                    errorText={fieldErrors['recruitmentQuota']}
                    value={Employee.recruitmentQuota}
                    onChange={(event, key, value) => {
                      handleChange({ target: { value: value } }, 'recruitmentQuota', false, '');
                    }}
                  >
                    {self.state.recruitmentquotas &&
                      self.state.recruitmentquotas.map(function(v, i) {
                        return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                      })}
                  </SelectField>
                )}
              </Col>
            </Row>
            {self.state.screenType == 'view' && <br />}
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.dateOfAppointment" />}

                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.dateOfAppointment}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    hintText="21/11/1993"
                    floatingLabelText={
                      <span>
                        {<Label fontSize = "20px" label="employee.Employee.fields.dateOfAppointment"/>}
                        <span style={{ color: '#FF0000' }}> *</span>
                      </span>
                    }
                    errorText={fieldErrors['dateOfAppointment']}
                    value={Employee.dateOfAppointment}
                    onChange={e => {
                      handleChange(e, 'dateOfAppointment', true, datePat);
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.dateOfJoining" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.dateOfJoining || '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    hintText="21/11/1993"
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.dateOfJoining" />}
                    errorText={fieldErrors['dateOfJoining']}
                    value={Employee.dateOfJoining}
                    onChange={e => {
                      handleChange(e, 'dateOfJoining', false, datePat);
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.retirementAge" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.retirementAge || '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    type="number"
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.retirementAge" />}
                    errorText={fieldErrors['retirementAge']}
                    value={Employee.retirementAge}
                    onChange={e => {
                      handleChange(e, 'retirementAge', false, '');
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.dateOfRetirement" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.dateOfRetirement || '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    hintText="21/11/1993"
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.dateOfRetirement" />}
                    errorText={fieldErrors['dateOfRetirement']}
                    value={Employee.dateOfRetirement}
                    onChange={e => {
                      handleChange(e, 'dateOfRetirement', false, datePat);
                    }}
                  />
                )}
              </Col>
            </Row>
            {self.state.screenType == 'view' && <br />}
            <Row>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.dateOfTermination" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.dateOfTermination || '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    hintText="21/11/1993"
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.dateOfTermination" />}
                    errorText={fieldErrors['dateOfTermination']}
                    value={Employee.dateOfTermination}
                    onChange={e => {
                      handleChange(e, 'dateOfTermination', false, datePat);
                    }}
                  />
                )}
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                {self.state.screenType == 'view' ? (
                  <span>
                    <label>
                      {/* <span style={{ fontWeight: '500' }}> */}
                      {<Label fontSize = "20px" label="employee.Employee.fields.dateOfResignation" />}
                      {/* </span> */}
                    </label>
                    <br />
                    <label>{Employee.dateOfResignation || '-'}</label>
                  </span>
                ) : (
                  <TextField className="create-employee-text-field-cont"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      'white-space': 'nowrap',
                      
                    }}
                    floatingLabelFixed={true}
                    hintText="21/11/1993"
                    floatingLabelText={<Label fontSize = "20px" label="employee.Employee.fields.dateOfResignation" />}
                    errorText={fieldErrors['dateOfResignation']}
                    value={Employee.dateOfResignation}
                    onChange={e => {
                      handleChange(e, 'dateOfResignation', false, datePat);
                    }}
                  />
                )}
              </Col>
              {self.state.screenType != 'view' ? (
                <Col xs={12} sm={4} md={3} lg={3}>
                  {/* <label style={{ marginTop: '20px',fontWeight : "500" }}> */}
                  {<Label fontSize = "15px" label="employee.Employee.fields.EmployeePhoto" />}
                  {/* </label> */}
                  <input type="file" />
                </Col>
              ) : (
                ''
              )}
              {self.state.screenType != 'view' ? (
                <Col xs={12} sm={4} md={3} lg={3}>
                  <label style={{ marginTop: '20px',fontWeight : "500" }}>{<Label fontSize = "15px" label="employee.Employee.fields.EmployeeSignature" />}</label>
                  <input type="file" />
                </Col>
              ) : (
                ''
              )}
            </Row>
            {self.state.screenType == 'view' && <br />}
            <Row>
              {self.state.screenType != 'view' ? (
                <Col xs={12} sm={4} md={3} lg={3}>
                  <label style={{ marginTop: '20px' ,fontWeight : "500"}}>{<Label fontSize = "15px" label="employee.Employee.fields.OtherAttachments" />}</label>
                  <input type="file" multiple />
                </Col>
              ) : (
                ''
              )}
            </Row>
          {/* </Grid> */}
        </CardText>
      </Card>
    );
  }

  renderAssignment() {
    let { isFormValid, Employee, fieldErrors, handleChange, handleChangeNextLevel } = this.props;
    let self = this;
    const renderAssignmentBody = function() {
      return self.props.Employee.assignments && self.props.Employee.assignments.length
        ? self.props.Employee.assignments.map(function(val, i) {
            return (
              <tr key={i}>
                <td>{val.fromDate}</td>
                <td>{val.toDate}</td>
                <td>{getNameById(self.state.departments, val.department)}</td>
                <td>{getNameById(self.state.designations, val.designation)}</td>
                <td>{getNameById(self.state.allPosition, val.position)}</td>
                <td>
                  {val.isPrimary
                    ? translate('employee.createPosition.groups.fields.outsourcepost.value1')
                    : translate('employee.createPosition.groups.fields.outsourcepost.value2')}
                </td>
                <td>{getNameById(self.state.funds, val.fund)}</td>
                <td>{getNameById(self.state.functions, val.function)}</td>
                <td>{getNameById(self.state.functionaries, val.functionary)}</td>
                <td>{getNameById(self.state.grades, val.grade)}</td>
                <td>
                  <ol>
                    {val.hod && val.hod.length
                      ? val.hod.map(function(v, i) {
                          return <li>{getNameById(self.state.departments, v.department)}</li>;
                        })
                      : ''}
                  </ol>
                </td>
                <td>{val.govtOrderNumber}</td>
                <td>{val.documents && val.documents.length}</td>
                <td>
                  {self.state.screenType != 'view' && (
                    <span
                      className="glyphicon glyphicon-pencil"
                      onClick={() => {
                        self.editModalOpen(i, 'assignments');
                      }}
                    />
                  )}&nbsp;&nbsp;
                  {self.state.screenType != 'view' &&
                    !val.fromServer && (
                      <span
                        className="glyphicon glyphicon-trash"
                        onClick={() => {
                          self.delModalOpen(i, 'assignments');
                        }}
                      />
                    )}
                </td>
              </tr>
            );
          })
        : '';
    };
    return (
      <Card className="uiCard create-employee-card">
        <CardText>
        <Table bordered responsive className="table-striped">
            <thead>
              <th style={headerStyle}>{<Label  fontSize="12px" labelStyle={labelStyle} label="employee.Assignment.fields.fromDate" />}</th>
              <th style={headerStyle}>{<Label  fontSize="12px" labelStyle={labelStyle} label="employee.Assignment.fields.toDate" />}</th>
              <th style={headerStyle}>{<Label containerStyle={containerStyle} fontSize="12px" labelStyle={labelStyle} label="employee.Assignment.fields.department" />}</th>
              <th style={headerStyle}>{<Label containerStyle={containerStyle} fontSize="12px" labelStyle={labelStyle} label="employee.Assignment.fields.designation" />}</th>
              <th style={headerStyle}>{<Label containerStyle={containerStyle} fontSize="12px" labelStyle={labelStyle} label="employee.Assignment.fields.position" />}</th>
              <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.Assignment.fields.primary" />}</th>
              <th style={headerStyle}>{<Label containerStyle={containerStyle} fontSize="12px" labelStyle={labelStyle} label="employee.Assignment.fields.fund" />}</th>
              <th style={headerStyle}>{<Label containerStyle={containerStyle} fontSize="12px" labelStyle={labelStyle} label="employee.Assignment.fields.function" />}</th>
              <th style={headerStyle}>{<Label containerStyle={containerStyle} fontSize="12px" labelStyle={labelStyle} label="employee.Assignment.fields.functionary" />}</th>
              <th style={headerStyle}>{<Label containerStyle={containerStyle} fontSize="12px" labelStyle={labelStyle} label="employee.Assignment.fields.grade" />}</th>
              <th style={headerStyle}>{<Label containerStyle={containerStyle} fontSize="12px" labelStyle={labelStyle} label="employee.Assignment.fields.hod" />}</th>
              <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.Assignment.fields.govtOrderNumber" />}</th>
              <th style={headerStyle}>{<Label containerStyle={containerStyle} fontSize="12px" labelStyle={labelStyle} label="employee.Assignment.fields.documents" />}</th>
              <th style={headerStyle}>{<Label containerStyle={containerStyle} fontSize="12px" labelStyle={labelStyle} label="reports.common.action" />}</th>
            </thead>
            <tbody>{renderAssignmentBody()}</tbody>
          </Table>
          <Row>
            <Col xsOffset={8} mdOffset={10} xs={4} md={2} style={{ textAlign: 'right' }}>
              {self.state.screenType != 'view' ? (
                <FloatingActionButton
                  style={{ marginRight: 0 }}
                  mini={true}
                  onClick={() => {
                    self.setModalOpen('assignment');
                  }}
                >
                  <span className="glyphicon glyphicon-plus" />
                </FloatingActionButton>
              ) : (
                ''
              )}
            </Col>
          </Row>
        </CardText>
      </Card>
    );
  }

  renderJurisdiction() {
    let { isFormValid, Employee, fieldErrors, handleChange, handleChangeNextLevel } = this.props;
    let self = this;
    const renderJurisdictionBody = function() {
      return self.props.Employee.jurisdictions && self.props.Employee.jurisdictions.length
        ? self.props.Employee.jurisdictions.map(function(val, i) {
            return getBoundaryValues(self.state.allBoundariesList, val, self, i);
          })
        : '';
    };
    return (
      <Card className="uiCard create-employee-card">
        <CardText>
          <Table bordered responsive className="table-striped">
            <thead>
              {/* <th style={headerStyle}>{translate('employee.jurisdiction.fields.boundaryType')}</th>
              <th style={headerStyle}>{translate('employee.jurisdiction.fields.boundary')}</th>
              <th style={headerStyle}>{translate('reports.common.action')}</th> */}

              <th style={headerStyle}>{<Label fontSize="12px" label="employee.jurisdiction.fields.boundaryType" labelStyle={labelStyle}/> }</th>
              <th style={headerStyle}>{<Label fontSize="12px" label="employee.jurisdiction.fields.boundary" labelStyle={labelStyle}/>}</th>
              <th style={headerStyle}>{<Label fontSize="12px" label="reports.common.action" labelStyle={labelStyle}/>}</th>
            </thead>
            <tbody>{renderJurisdictionBody()}</tbody>
          </Table>
          <Row>
            <Col xsOffset={8} mdOffset={10} xs={4} md={2} style={{ textAlign: 'right' }}>
              {self.state.screenType != 'view' ? (
                <FloatingActionButton
                  style={{ marginRight: 0 }}
                  mini={true}
                  onClick={() => {
                    self.setModalOpen('jurisdiction');
                  }}
                >
                  <span className="glyphicon glyphicon-plus" />
                </FloatingActionButton>
              ) : (
                ''
              )}
            </Col>
          </Row>
        </CardText>
      </Card>
    );
  }

  renderService() {
    let { isFormValid, Employee, fieldErrors, handleChange, handleChangeNextLevel } = this.props;
    let self = this;
    const renderServiceBody = function(type) {
      switch (type) {
        case 'service':
          return self.props.Employee.serviceHistory && self.props.Employee.serviceHistory.length
            ? self.props.Employee.serviceHistory.map(function(val, i) {
                return (
                  <tr key={i}>
                    <td>{val.serviceInfo}</td>
                    <td>{val.serviceFrom}</td>
                    <td>{val.remarks}</td>
                    <td>{val.orderNo}</td>
                    <td>{val.documents && val.documents.length}</td>
                    <td>
                      {self.state.screenType != 'view' && (
                        <span
                          className="glyphicon glyphicon-pencil"
                          onClick={() => {
                            self.editModalOpen(i, 'serviceDet');
                          }}
                        />
                      )}&nbsp;&nbsp;
                      {self.state.screenType != 'view' && (
                        <span
                          className="glyphicon glyphicon-trash"
                          onClick={() => {
                            self.delModalOpen(i, 'serviceDet');
                          }}
                        />
                      )}
                    </td>
                  </tr>
                );
              })
            : '';
          break;
        case 'probation':
          return self.props.Employee.probation && self.props.Employee.probation.length
            ? self.props.Employee.probation.map(function(val, i) {
                return (
                  <tr key={i}>
                    <td>{getNameById(self.state.designations, val.designation)}</td>
                    <td>{val.declaredOn}</td>
                    <td>{val.orderNo}</td>
                    <td>{val.orderDate}</td>
                    <td>{val.remarks}</td>
                    <td>{val.documents && val.documents.length}</td>
                    <td>
                      {self.state.screenType != 'view' && (
                        <span
                          className="glyphicon glyphicon-pencil"
                          onClick={() => {
                            self.editModalOpen(i, 'probation');
                          }}
                        />
                      )}&nbsp;&nbsp;
                      {self.state.screenType != 'view' && (
                        <span
                          className="glyphicon glyphicon-trash"
                          onClick={() => {
                            self.delModalOpen(i, 'probation');
                          }}
                        />
                      )}
                    </td>
                  </tr>
                );
              })
            : '';
          break;
        case 'regularization':
          return self.props.Employee.regularisation && self.props.Employee.regularisation.length
            ? self.props.Employee.regularisation.map(function(val, i) {
                return (
                  <tr key={i}>
                    <td>{val.designation}</td>
                    <td>{val.declaredOn}</td>
                    <td>{val.orderNo}</td>
                    <td>{val.orderDate}</td>
                    <td>{val.remarks}</td>
                    <td>{val.documents && val.documents.length}</td>
                    <td>
                      {self.state.screenType != 'view' && (
                        <span
                          className="glyphicon glyphicon-pencil"
                          onClick={() => {
                            self.editModalOpen(i, 'regular');
                          }}
                        />
                      )}&nbsp;&nbsp;
                      {self.state.screenType != 'view' && (
                        <span
                          className="glyphicon glyphicon-trash"
                          onClick={() => {
                            self.delModalOpen(i, 'regular');
                          }}
                        />
                      )}
                    </td>
                  </tr>
                );
              })
            : '';
          break;
      }
    };

    return (
      <div>
        <Card className="uiCard create-employee-card">
          <CardTitle title={<Label fontSize="24px" label="employee.ServiceHistory.title" />} />
          <CardText>
            <Table bordered responsive className="table-striped">
              <thead>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.ServiceHistory.fields.ServiceEntryDescription" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.ServiceHistory.fields.date" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.ServiceHistory.fields.remarks"/>}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.ServiceHistory.fields.orderNo" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.ServiceHistory.fields.documents"/>}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="reports.common.action" />}</th>
              </thead>
              <tbody>{renderServiceBody('service')}</tbody>
            </Table>
            <Row>
              <Col xsOffset={8} mdOffset={10} xs={4} md={2} style={{ textAlign: 'right' }}>
                {self.state.screenType != 'view' ? (
                  <FloatingActionButton
                    style={{ marginRight: 0 }}
                    mini={true}
                    onClick={() => {
                      self.setModalOpen('serviceDet');
                    }}
                  >
                    <span className="glyphicon glyphicon-plus" />
                  </FloatingActionButton>
                ) : (
                  ''
                )}
              </Col>
            </Row>
          </CardText>
        </Card>
        <Card className="uiCard create-employee-card">
          <CardTitle title={<Label fontSize="12px" label="employee.Probation.title" />} />
          <CardText>
            <Table bordered responsive className="table-striped">
              <thead>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.Assignment.fields.designation" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.Probation.fields.declaredOn" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.Probation.fields.orderNo" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.Probation.fields.orderDate" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.Probation.fields.remarks" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.Probation.fields.documents" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="reports.common.action" />}</th>
              </thead>
              <tbody>{renderServiceBody('probation')}</tbody>
            </Table>
            <Row>
              <Col xsOffset={8} mdOffset={10} xs={4} md={2} style={{ textAlign: 'right' }}>
                {self.state.screenType != 'view' ? (
                  <FloatingActionButton
                    style={{ marginRight: 0 }}
                    mini={true}
                    onClick={() => {
                      self.setModalOpen('probation');
                    }}
                  >
                    <span className="glyphicon glyphicon-plus" />
                  </FloatingActionButton>
                ) : (
                  ''
                )}
              </Col>
            </Row>
          </CardText>
        </Card>
        <Card className="uiCard create-employee-card">
          <CardTitle title={<Label fontSize="24px" label="employee.Regularisation.title" />} />
          <CardText>
            <Table bordered responsive className="table-striped">
              <thead>
                <th style={headerStyle}>{<Label labelStyle={labelStyle} fontSize="12px" label="employee.Assignment.fields.designation" />}</th>
                <th style={headerStyle}>{<Label labelStyle={labelStyle} fontSize="12px" label="employee.Regularisation.fields.declaredOn" />}</th>
                <th style={headerStyle}>{<Label labelStyle={labelStyle} fontSize="12px" label="employee.Probation.fields.orderNo" />}</th>
                <th style={headerStyle}>{<Label labelStyle={labelStyle} fontSize="12px" label="employee.Probation.fields.orderDate" />}</th>
                <th style={headerStyle}>{<Label labelStyle={labelStyle} fontSize="12px" label="employee.Probation.fields.remarks" />}</th>
                <th style={headerStyle}>{<Label labelStyle={labelStyle} fontSize="12px" label="employee.Probation.fields.documents" />}</th>
                <th style={headerStyle}>{<Label labelStyle={labelStyle} fontSize="12px" label="reports.common.action" />}</th>
              </thead>
              <tbody>{renderServiceBody('regularization')}</tbody>
            </Table>
            <Row>
              <Col xsOffset={8} mdOffset={10} xs={4} md={2} style={{ textAlign: 'right' }}>
                {self.state.screenType != 'view' ? (
                  <FloatingActionButton
                    style={{ marginRight: 0 }}
                    mini={true}
                    onClick={() => {
                      self.setModalOpen('regular');
                    }}
                  >
                    <span className="glyphicon glyphicon-plus" />
                  </FloatingActionButton>
                ) : (
                  ''
                )}
              </Col>
            </Row>
          </CardText>
        </Card>
      </div>
    );
  }

  renderOtherDetails() {
    let { isFormValid, Employee, fieldErrors, handleChange, handleChangeNextLevel } = this.props;
    let self = this;
    const renderOtherDetailsBody = function(type) {
      switch (type) {
        case 'edu':
          return self.props.Employee.education && self.props.Employee.education.length
            ? self.props.Employee.education.map(function(val, i) {
                return (
                  <tr key={i}>
                    <td>{val.qualification}</td>
                    <td>{val.majorSubject}</td>
                    <td>{val.yearOfPassing}</td>
                    <td>{val.university}</td>
                    <td>{val.documents && val.documents.length}</td>
                    <td>
                      {self.state.screenType != 'view' && (
                        <span
                          className="glyphicon glyphicon-pencil"
                          onClick={() => {
                            self.editModalOpen(i, 'edu');
                          }}
                        />
                      )}&nbsp;&nbsp;
                      {self.state.screenType != 'view' && (
                        <span
                          className="glyphicon glyphicon-trash"
                          onClick={() => {
                            self.delModalOpen(i, 'edu');
                          }}
                        />
                      )}
                    </td>
                  </tr>
                );
              })
            : '';
          break;
        case 'tech':
          return self.props.Employee.technical && self.props.Employee.technical.length
            ? self.props.Employee.technical.map(function(val, i) {
                return (
                  <tr key={i}>
                    <td>{val.skill}</td>
                    <td>{val.grade}</td>
                    <td>{val.yearOfPassing}</td>
                    <td>{val.remarks}</td>
                    <td>{val.documents && val.documents.length}</td>
                    <td>
                      {self.state.screenType != 'view' && (
                        <span
                          className="glyphicon glyphicon-pencil"
                          onClick={() => {
                            self.editModalOpen(i, 'tech');
                          }}
                        />
                      )}&nbsp;&nbsp;
                      {self.state.screenType != 'view' && (
                        <span
                          className="glyphicon glyphicon-trash"
                          onClick={() => {
                            self.delModalOpen(i, 'tech');
                          }}
                        />
                      )}
                    </td>
                  </tr>
                );
              })
            : '';
          break;
        case 'dept':
          return self.props.Employee.test && self.props.Employee.test.length
            ? self.props.Employee.test.map(function(val, i) {
                return (
                  <tr key={i}>
                    <td>{val.test}</td>
                    <td>{val.yearOfPassing}</td>
                    <td>{val.remarks}</td>
                    <td>{val.documents && val.documents.length}</td>
                    <td>
                      {self.state.screenType != 'view' && (
                        <span
                          className="glyphicon glyphicon-pencil"
                          onClick={() => {
                            self.editModalOpen(i, 'dept');
                          }}
                        />
                      )}&nbsp;&nbsp;
                      {self.state.screenType != 'view' && (
                        <span
                          className="glyphicon glyphicon-trash"
                          onClick={() => {
                            self.delModalOpen(i, 'dept');
                          }}
                        />
                      )}
                    </td>
                  </tr>
                );
              })
            : '';
          break;
      }
    };

    return (
      <div>
        <Card className="uiCard create-employee-card">
          <CardTitle title={<Label fontSize="24px" label="employee.EducationalQualification.title" />} />
          <CardText>
            <Table bordered responsive className="table-striped">
              <thead>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.EducationalQualification.fields.qualification" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.EducationalQualification.fields.majorSubject" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.TechnicalQualification.fields.yearOfPassing" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.EducationalQualification.fields.university" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.EducationalQualification.fields.documents" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="reports.common.action"/>}</th>
              </thead>
              <tbody>{renderOtherDetailsBody('edu')}</tbody>
            </Table>
            <Row>
              <Col xsOffset={8} mdOffset={10} xs={4} md={2} style={{ textAlign: 'right' }}>
                {self.state.screenType != 'view' ? (
                  <FloatingActionButton
                    style={{ marginRight: 0 }}
                    mini={true}
                    onClick={() => {
                      self.setModalOpen('edu');
                    }}
                  >
                    <span className="glyphicon glyphicon-plus" />
                  </FloatingActionButton>
                ) : (
                  ''
                )}
              </Col>
            </Row>
          </CardText>
        </Card>
        <Card className="uiCard create-employee-card">
          <CardTitle title={<Label fontSize="24px" label="employee.TechnicalQualification.title" />} />
          <CardText>
            <Table bordered responsive className="table-striped">
              <thead>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.TechnicalQualification.fields.skill" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.TechnicalQualification.fields.grade" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.TechnicalQualification.fields.yearOfPassing" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.TechnicalQualification.fields.remarks" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.EducationalQualification.fields.documents" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="reports.common.action" />}</th>
              </thead>
              <tbody>{renderOtherDetailsBody('tech')}</tbody>
            </Table>
            <Row>
              <Col xsOffset={8} mdOffset={10} xs={4} md={2} style={{ textAlign: 'right' }}>
                {self.state.screenType != 'view' ? (
                  <FloatingActionButton
                    style={{ marginRight: 0 }}
                    mini={true}
                    onClick={() => {
                      self.setModalOpen('tech');
                    }}
                  >
                    <span className="glyphicon glyphicon-plus" />
                  </FloatingActionButton>
                ) : (
                  ''
                )}
              </Col>
            </Row>
          </CardText>
        </Card>
        <Card className="uiCard create-employee-card">
          <CardTitle title={<Label fontSize="24px" label="employee.DepartmentalTest.title"/>} />
          <CardText>
            <Table bordered responsive className="table-striped">
              <thead>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.DepartmentalTest.fields.test" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.TechnicalQualification.fields.yearOfPassing" />}n</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.TechnicalQualification.fields.remarks" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="employee.EducationalQualification.fields.documents" />}</th>
                <th style={headerStyle}>{<Label fontSize="12px" labelStyle={labelStyle} label="reports.common.action" />}</th>
              </thead>
              <tbody>{renderOtherDetailsBody('dept')}</tbody>
            </Table>
            <Row>
              <Col xsOffset={8} mdOffset={10} xs={4} md={2} style={{ textAlign: 'right' }}>
                {self.state.screenType != 'view' ? (
                  <FloatingActionButton
                    style={{ marginRight: 0 }}
                    mini={true}
                    onClick={() => {
                      self.setModalOpen('dept');
                    }}
                  >
                    <span className="glyphicon glyphicon-plus" />
                  </FloatingActionButton>
                ) : (
                  ''
                )}
              </Col>
            </Row>
          </CardText>
        </Card>
      </div>
    );
  }

  createOrUpdate = e => {
    e.preventDefault();
    let employee = Object.assign({}, this.props.Employee);
    let self = this;
    if (employee.assignments.length == 0 || employee.jurisdictions.length == 0) {
      self.props.toggleSnackbarAndSetText(true, 'Please enter atleast one assignment and jurisdiction.');
    } else if (!isHavingPrimary(employee)) {
      self.props.toggleSnackbarAndSetText(true, 'Atleast one primary assignment is required.');
    } else {
      var __emp = Object.assign({}, employee);

      if (employee['jurisdictions'] && employee['jurisdictions'].length) {
        var empJuridictions = employee['jurisdictions'];
        employee['jurisdictions'] = [];
        for (var i = 0; i < empJuridictions.length; i++) {
          if (typeof empJuridictions[i] == 'object') employee['jurisdictions'].push(empJuridictions[i].boundary);
          else employee['jurisdictions'].push(empJuridictions[i]);
        }
      }

      if (employee['assignments'] && employee['assignments'].length) {
        for (var i = 0; i < employee['assignments'].length; i++) {
          if (employee['assignments'][i].hod == false) {
            employee['assignments'][i].hod = [];
          }
        }
      }

      if (employee.user && employee.user.dob && self.state.screenType == 'update' && employee.user.dob.indexOf('-') > -1) {
        var _date = employee.user.dob.split('-');
        employee.user.dob = _date[2] + '/' + _date[1] + '/' + _date[0];
      }

      self.props.setLoadingStatus('loading');
      uploadFiles(employee, function(err, emp) {
        if (err) {
          //Handle error
          self.props.setLoadingStatus('hide');
        } else {
          Api.commonApiPost('/hr-employee/employees/' + (self.state.screenType == 'update' ? '_update' : '_create'), {}, { Employee: employee }).then(
            function(res) {
              self.props.setLoadingStatus('hide');
              self.props.toggleSnackbarAndSetText(
                true,
                self.state.screenType == 'update' ? 'Employee updated successfully.' : 'Employee created successfully.'
              );
              setTimeout(function() {
                self.props.setRoute('/view/' + res.Employee.id);
                //window.location.reload();
              }, 1500);
            },
            function(err) {
              self.props.setLoadingStatus('hide');
              self.props.toggleSnackbarAndSetText(true, err.message);
            }
          );
        }
      });
    }
  };

  render() {
    let self = this;
    return (
      
      <div>
        <form
          onSubmit={e => {
            self.createOrUpdate(e);
          }}
        >
          <Tabs >
            <Tab label={<Label labelStyle={labelStyle} label="employee.Employee.title" />} buttonStyle={{color : "#fff"}}>
              <div>{self.renderEmployee()}</div>
            </Tab>
            <Tab label={<Label labelStyle={labelStyle} label="employee.Assignment.title" />} buttonStyle={{color : "#fff"}}>
              <div>{self.renderAssignment()}</div>
            </Tab>
            <Tab label={<Label labelStyle={labelStyle} label="employee.Jurisdictions.title" />} buttonStyle={{color : "#fff"}}>
              <div>{self.renderJurisdiction()}</div>
            </Tab>
            <Tab label={<Label labelStyle={labelStyle} label="employee.service.title" />} buttonStyle={{color : "#fff"}}>
              <div>{self.renderService()}</div>
            </Tab>
            <Tab label={<Label labelStyle={labelStyle} label="employee.other.title" />} buttonStyle={{color : "#fff"}}>
              <div>{self.renderOtherDetails()}</div>
            </Tab>
          </Tabs>
          <br />
          <div style={{ textAlign: 'center' }}>
            {self.state.screenType != 'view' ? (
               <RaisedButton type="submit" label={translate('ui.framework.submit')} primary={true} disabled={!self.props.isFormValid} />
              // <div className="responsive-action-button-cont">
              //   <Button
              //     type="submit"
              //     className="responsive-action-button"
              //     primary={true}
              //     label={<Label buttonLabel={true} label="SUBMIT" />}
              //     fullWidth={true}
              //     disabled={!self.props.isFormValid}
              //     onClick={this.handleComplaintReassigned}
              //   />
              // </div>
            ) : (
              ''
            )}
          </div>
        </form>
        <Dialog
          title={self.getModalTitle()}
          actions={[
            <FlatButton label={translate('employee.Cancel.Button')} primary={true} onClick={self.handleClose} />,
            <FlatButton
              label={translate('employee.addedit.Button')}
              primary={true}
              keyboardFocused={true}
              disabled={self.state.isModalInvalid}
              onClick={self.submitModalData}
            />,
          ]}
          modal={false}
          open={self.state.open}
          onRequestClose={self.handleClose}
          autoScrollBodyContent={true}
        >
          {self.renderContent()}
        </Dialog>
      </div>
      
    );
  }
}

const mapStateToProps = state => {
  return {
    Employee: state.formtemp.form,
    fieldErrors: state.formtemp.fieldErrors,
    isFormValid: state.formtemp.isFormValid,
  };
};

const mapDispatchToProps = dispatch => ({
  setForm: (data, isUpdate, codeAuto, unameAuto) => {
    var requiredList = [
      'name',
      'code',
      'employeeType',
      'dateOfAppointment',
      'employeeStatus',
      'maritalStatus',
      'userName',
      'mobileNumber',
      'active',
      'dob',
      'gender',
    ];
    if (codeAuto) requiredList.splice(requiredList.indexOf('code'), 1);
    if (unameAuto) requiredList.splice(requiredList.indexOf('userName'), 1);

    dispatch({
      type: 'SET_FORM',
      data,
      isFormValid: isUpdate ? true : false,
      fieldErrors: {},
      validationData: {
        required: {
          current: isUpdate ? Object.assign([], requiredList) : ['active'],
          required: Object.assign([], requiredList),
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },

  resetForm: () => {
    dispatch({ type: 'RESET_FORM' });
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

  handleChangeNextLevel: (e, property, propertyOne, isRequired, pattern) => {
    dispatch({
      type: 'HANDLE_CHANGE_NEXT_ONE',
      property,
      propertyOne,
      value: e.target.value,
      isRequired,
      pattern,
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
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Employee);

