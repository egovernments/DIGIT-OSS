import React, { Component } from 'react';
import { connect } from 'react-redux';

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
import RaisedButton from 'material-ui/RaisedButton';
import Api from '../../../../api/api';
import { translate } from '../../../common/common';
import OwnerDetails from './propertyTax/OwnerDetails';
import CreateNewProperty from './propertyTax/CreateNewProperty';
import PropertyAddress from './propertyTax/PropertyAddress';
import Amenities from './propertyTax/Amenities';
import AssessmentDetails from './propertyTax/AssessmentDetails';
import ConstructionTypes from './propertyTax/ConstructionTypes';
import FloorDetails from './propertyTax/FloorDetails';
import DocumentUpload from './propertyTax/DocumentUpload';
import Workflow from './propertyTax/Workflow';
import VacantLand from './propertyTax/vacantLand';
import PropertyFactors from './propertyTax/PropertyFactors';
import UpicNumber from './propertyTax/UpicNumber';
import ConstructionDetails from './propertyTax/ConstructionDetails';

var flag = 0;
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

//Create Class for Create and update property
class DataEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addButton: false,
      addOwner: true,
      addFloor: false,
      addRoom: false,
      files: [],
      propertytypes: [],
      apartments: [],
      departments: [],
      floortypes: [],
      rooftypes: [],
      walltypes: [],
      woodtypes: [],
      structureclasses: [],
      occupancies: [],
      ward: [],
      locality: [],
      zone: [],
      block: [],
      street: [],
      revanue: [],
      election: [],
      usages: [],
      tenant: [],
      appConfig: [],
      ack: '',
    };
  }

  componentWillMount() {}

  componentDidMount() {
    let { initForm } = this.props;
    initForm();

    var currentThis = this;

    Api.commonApiPost('pt-property/property/propertytypes/_search', {}, {}, false, true)
      .then(res => {
        currentThis.setState({ propertytypes: res.propertyTypes });
      })
      .catch(err => {
        currentThis.setState({
          propertytypes: [],
        });
      });

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'WARD',
      hierarchyTypeName: 'ADMINISTRATION',
    })
      .then(res => {
        //console.log(res);
        currentThis.setState({ election: res.Boundary });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'STREET',
      hierarchyTypeName: 'LOCATION',
    })
      .then(res => {
        //console.log(res);
        currentThis.setState({ street: res.Boundary });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'LOCALITY',
      hierarchyTypeName: 'LOCATION',
    })
      .then(res => {
        //console.log(res);
        currentThis.setState({ locality: res.Boundary });
      })
      .catch(err => {
        currentThis.setState({
          locality: [],
        });
        console.log(err);
      });

    Api.commonApiPost('pt-property/property/appconfiguration/_search', {
      keyName: 'PT_RevenueBoundaryHierarchy',
    })
      .then(res1 => {
        if (res1.appConfigurations && res1.appConfigurations[0] && res1.appConfigurations[0].values && res1.appConfigurations[0].values[0]) {
          Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
            boundaryTypeName: 'ZONE',
            hierarchyTypeName: res1.appConfigurations[0].values[0],
          })
            .then(res => {
              //console.log(res);
              currentThis.setState({ zone: res.Boundary });
            })
            .catch(err => {
              currentThis.setState({
                zone: [],
              });
              console.log(err);
            });

          Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
            boundaryTypeName: 'BLOCK',
            hierarchyTypeName: res1.appConfigurations[0].values[0],
          })
            .then(res => {
              //console.log(res);
              currentThis.setState({ block: res.Boundary });
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          currentThis.setState({
            block: [],
            zone: [],
          });
        }
      })
      .catch(err => {
        currentThis.setState({
          block: [],
          zone: [],
        });
      });
    var userRequest = JSON.parse(localStorage.getItem('userRequest'));

    var tenantQuery = {
      code: userRequest.tenantId || 'default',
    };

    Api.commonApiPost('tenant/v1/tenant/_search', tenantQuery)
      .then(res => {
        currentThis.setState({ tenant: res.tenant });
      })
      .catch(err => {
        currentThis.setState({ tenant: [] });
      });

    var appQuery = {
      keyName: 'GuidanceBoundary',
    };

    Api.commonApiPost('pt-property/property/appconfiguration/_search', appQuery)
      .then(res => {
        currentThis.setState({ appConfig: res.appConfigurations });
      })
      .catch(err => {
        currentThis.setState({ appConfig: [] });
        console.log(err);
      });
  }

  componentWillUnmount() {}

  componentWillUpdate() {}

  componentDidUpdate(prevProps, prevState) {}

  search = e => {};

  dataEntryCreateRequest = () => {
    let { toggleSnackbarAndSetText, dataEntry } = this.props;

    let currentThis = this;

    var appConfigQuery = '';

    if (this.state.appConfig.length == 1) {
      if (this.state.appConfig[0].values[0] == 'Zone') {
        appConfigQuery = {
          guidanceValueBoundary1: dataEntry.zoneNo,
        };
      } else if (this.state.appConfig[0].values[0] == 'Ward') {
        appConfigQuery = {
          guidanceValueBoundary1: dataEntry.wardNo,
        };
      }
    } else if (this.state.appConfig.length == 2) {
      if (this.state.appConfig[0].values[0] == 'Zone') {
        appConfigQuery = {
          guidanceValueBoundary1: dataEntry.zoneNo,
          guidanceValueBoundary2: dataEntry.wardNo,
        };
      } else {
        appConfigQuery = {
          guidanceValueBoundary1: dataEntry.wardNo,
          guidanceValueBoundary2: dataEntry.zoneNo,
        };
      }
    }

    Api.commonApiPost('pt-property/property/guidancevalueboundary/_search', appConfigQuery)
      .then(res => {
        if (res.guidanceValueBoundaries.length > 0) {
          currentThis.dataEntryTax(res.guidanceValueBoundaries[0].id);
        } else {
          toggleSnackbarAndSetText(true, 'There is no guidance value boundary defined');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  dataEntryTax = guidanceValue => {
    let { dataEntry, setLoadingStatus, toggleSnackbarAndSetText } = this.props;

    setLoadingStatus('loading');

    var userRequest = JSON.parse(localStorage.getItem('userRequest'));

    var numberOfFloors = '';
    var builtupArea = 0;
    if (dataEntry && dataEntry.hasOwnProperty('floorsArr') && dataEntry.hasOwnProperty('floors')) {
      numberOfFloors = dataEntry.floorsArr.length;
      for (let i = 0; i < dataEntry.floors.length; i++) {
        builtupArea += dataEntry.floors[i].builtupArea;
      }
    }

    if (dataEntry && dataEntry.hasOwnProperty('owners')) {
      for (var i = 0; i < dataEntry.owners.length; i++) {
        dataEntry.owners[i].locale = userRequest.locale || 'en_IN';
        dataEntry.owners[i].type = 'CITIZEN';
        dataEntry.owners[i].active = true;
        dataEntry.owners[i].tenantId = userRequest.tenantId;
        dataEntry.owners[i].salutation = null;
        dataEntry.owners[i].pan = null;
        dataEntry.owners[i].roles = [{ code: 'CITIZEN', name: 'Citizen' }];

        if (dataEntry.owners[i].isPrimaryOwner == 'PrimaryOwner') {
          dataEntry.owners[i].isPrimaryOwner = true;
          dataEntry.owners[i].issecondaryowner = false;
        } else {
          dataEntry.owners[i].isPrimaryOwner = false;
          dataEntry.owners[i].issecondaryowner = true;
        }

        if (!dataEntry.owners[i].hasOwnProperty('ownershippercentage') || dataEntry.owners[i].ownershippercentage == '') {
          dataEntry.owners[i].ownershippercentage = null;
        }

        if (dataEntry.owners[i].hasOwnProperty('aadhaarNumber') && dataEntry.owners[i].aadhaarNumber == '') {
          dataEntry.owners[i].aadhaarNumber = null;
        }

        if (!dataEntry.owners[i].hasOwnProperty('ownerType') || dataEntry.owners[i].ownerType == '') {
          dataEntry.owners[i].ownerType = null;
        }

        if (!dataEntry.owners[i].hasOwnProperty('emailId') || dataEntry.owners[i].emailId == '') {
          dataEntry.owners[i].emailId = null;
        }
      }

      for (var key in dataEntry.owners[i]) {
        if (dataEntry.owners[i].hasOwnProperty(key) && dataEntry.owners[i][key] == '') {
          delete dataEntry.owners[i][key];
        }
      }
    }

    var vacantLand = null;

    if (dataEntry.propertyType == 'PTYPE_OPEN_LAND') {
      vacantLand = {
        surveyNumber: dataEntry.survayNumber || null,
        pattaNumber: dataEntry.pattaNumber || null,
        marketValue: dataEntry.marketValue || null,
        capitalValue: dataEntry.capitalValue || null,
        layoutApprovedAuth: dataEntry.layoutApprovalAuthority || null,
        layoutPermissionNo: dataEntry.layoutPermitNumber || null,
        layoutPermissionDate: dataEntry.layoutPermitDate || null,
        resdPlotArea: null,
        nonResdPlotArea: null,
        auditDetails: {
          createdBy: userRequest.userName,
          lastModifiedBy: userRequest.userName,
          createdTime: date,
          lastModifiedTime: date,
        },
      };

      dataEntry.floorsArr = null;
      dataEntry.floors = null;
      dataEntry.floor = null;
    } else {
      vacantLand = null;
    }

    var date = new Date().getTime();

    var currentThis = this;
    var body = {
      properties: [
        {
          occupancyDate: dataEntry.occupancyDate,
          tenantId: userRequest.tenantId,
          oldUpicNumber: dataEntry.oldUpicNumber,
          vltUpicNumber: null,
          sequenceNo: dataEntry.sequenceNo || null,
          creationReason: dataEntry.reasonForCreation || null,
          address: {
            tenantId: userRequest.tenantId,
            longitude: null,
            surveyNo: dataEntry.ctsNo || null,
            plotNo: dataEntry.plotNo || null,
            addressNumber: dataEntry.doorNo || null,
            addressLine1: dataEntry.locality || null,
            addressLine2: null,
            landmark: dataEntry.landMark || null,
            city: currentThis.state.tenant[0].city.name || null,
            pincode: dataEntry.pin || null,
            detail: null,
            auditDetails: {
              createdBy: userRequest.userName,
              lastModifiedBy: userRequest.userName,
              createdTime: date,
              lastModifiedTime: date,
            },
          },
          owners: dataEntry.owners || null,
          propertyDetail: {
            source: 'MUNICIPAL_RECORDS',
            regdDocNo: 'rdn2',
            regdDocDate: '15/02/2017',
            reason: 'CREATE',
            status: 'ACTIVE',
            isVerified: true,
            verificationDate: '25/05/2017',
            isExempted: false,
            propertyType: dataEntry.propertyType || null,
            category: dataEntry.propertySubType || null,
            usage: dataEntry.usage || null,
            subUsage: dataEntry.usageSubType || null,
            department: dataEntry.department || null,
            apartment: null,
            siteLength: 12,
            siteBreadth: 15,
            sitalArea: dataEntry.extentOfSite || null,
            totalBuiltupArea: builtupArea,
            undividedShare: null,
            noOfFloors: dataEntry.totalFloors,
            isSuperStructure: null,
            bpaNo: dataEntry.bpaNo || null,
            bpaDate: dataEntry.bpaDate || null,
            landOwner: null,
            floorType: dataEntry.propertyType != 'PTYPE_OPEN_LAND' ? dataEntry.floorType || null : null,
            woodType: dataEntry.propertyType != 'PTYPE_OPEN_LAND' ? dataEntry.woodType || null : null,
            roofType: dataEntry.propertyType != 'PTYPE_OPEN_LAND' ? dataEntry.roofType || null : null,
            wallType: dataEntry.propertyType != 'PTYPE_OPEN_LAND' ? dataEntry.wallType || null : null,
            floors: dataEntry.floorsArr || null,
            factors: [
              {
                name: 'TOILET',
                value: dataEntry.toiletFactor || null,
              },
              {
                name: 'ROAD',
                value: dataEntry.roadFactor || null,
              },
              {
                name: 'LIFT',
                value: dataEntry.liftFactor || null,
              },
              {
                name: 'PARKING',
                value: dataEntry.parkingFactor || null,
              },
            ],
            documents: [],
            stateId: null,
            assessmentDates: [
              {
                name: 'FIRSTASSESSMENT',
                date: dataEntry.firstAssessmentDate || null,
              },
              {
                name: 'CURRENTASSESSMENT',
                date: dataEntry.currentAssessmentDate || null,
              },
              {
                name: 'REVISEDASSESSMENT',
                date: dataEntry.revisedAssessmentDate || null,
              },
              {
                name: 'LASTASSESSMENT',
                date: dataEntry.lastAssessmentDate || null,
              },
            ],
            builderDetails: {
              certificateNumber: dataEntry.certificateNumber || null,
              certificateCompletionDate: dataEntry.certificateCompletionDate || null,
              certificateReceiveDate: dataEntry.certificateReceivedDate || null,
              agencyName: dataEntry.agencyName || null,
              licenseType: dataEntry.licenseType || null,
              licenseNumber: dataEntry.licenseNumber || null,
            },
            workFlowDetails: {
              department: dataEntry.workflowDepartment || null,
              designation: dataEntry.workflowDesignation || null,
              assignee: dataEntry.approver || null,
              action: 'no',
              status: null,
            },
            auditDetails: {
              createdBy: userRequest.userName,
              lastModifiedBy: userRequest.userName,
              createdTime: date,
              lastModifiedTime: date,
            },
          },
          vacantLand: vacantLand,

          gisRefNo: null,
          isAuthorised: null,
          boundary: {
            revenueBoundary: {
              code: dataEntry.zoneNo || null,
              name: getNameByCode(currentThis.state.zone, dataEntry.zoneNo) || null,
            },
            locationBoundary: {
              code: dataEntry.street || dataEntry.locality || null,
              name:
                getNameByCode(currentThis.state.street, dataEntry.street) || getNameByCode(currentThis.state.locality, dataEntry.locality) || null,
            },
            adminBoundary: {
              code: dataEntry.electionWard || null,
              name: getNameByCode(currentThis.state.election, dataEntry.electionWard) || null,
            },
            guidanceValueBoundary: guidanceValue + '',
            northBoundedBy: dataEntry.north || null,
            eastBoundedBy: dataEntry.east || null,
            westBoundedBy: dataEntry.west || null,
            southBoundedBy: dataEntry.south || null,
            auditDetails: {
              createdBy: userRequest.userName,
              lastModifiedBy: userRequest.userName,
              createdTime: date,
              lastModifiedTime: date,
            },
          },
          channel: 'DATA_ENTRY',
          auditDetails: {
            createdBy: userRequest.userName,
            lastModifiedBy: userRequest.userName,
            createdTime: date,
            lastModifiedTime: date,
          },
        },
      ],
    };

    var fileStoreArray = [];

    if (currentThis.props.files.length != 0) {
      if (currentThis.props.files.length === 0) {
        console.log('No file uploads');
      } else {
        console.log('still file upload pending', currentThis.props.files.length);

        for (let i = 0; i < currentThis.props.files.length; i++) {
          console.log(currentThis.props.files);

          let formData = new FormData();
          formData.append('tenantId', localStorage.getItem('tenantId'));
          formData.append('module', 'PT');
          formData.append('file', currentThis.props.files[i][0]);
          Api.commonApiPost('/filestore/v1/files', {}, formData).then(
            function(response) {
              var documentArray = {
                documentType: {
                  code: currentThis.props.files[i].createCode,
                },
                fileStore: '',
                auditDetails: {
                  createdBy: userRequest.userName,
                  lastModifiedBy: userRequest.userName,
                  createdTime: date,
                  lastModifiedTime: date,
                },
              };

              fileStoreArray.push(response.files[0]);
              console.log('All files succesfully uploaded');

              documentArray.documentType.name = 'Photo of Assessment ' + [i];
              documentArray.fileStore = response.files[0].fileStoreId;
              body.properties[0].propertyDetail.documents.push(documentArray);
              console.log(body);
              if (i === currentThis.props.files.length - 1) {
                console.log('All files succesfully uploaded');
                Api.commonApiPost('pt-property/properties/_create', {}, body, false, true)
                  .then(res => {
                    currentThis.setState({
                      ack: res.properties.applicationNo,
                    });
                    localStorage.setItem('upicNumber', res.properties[0].upicNumber);
                    this.props.history.push('dataEntry-acknowledgement');
                    setLoadingStatus('hide');
                  })
                  .catch(err => {
                    console.log(err);
                    setLoadingStatus('hide');
                    toggleSnackbarAndSetText(true, err.message);
                  });
              }
            },
            function(err) {
              console.log(err);
            }
          );
        }
      }
    } else {
      Api.commonApiPost('pt-property/properties/_create', {}, body, false, true)
        .then(res => {
          currentThis.setState({
            ack: res.properties.applicationNo,
          });
          localStorage.setItem('upicNumber', res.properties[0].upicNumber);
          this.props.history.push('dataEntry-acknowledgement');
          setLoadingStatus('hide');
        })
        .catch(err => {
          console.log(err);
          setLoadingStatus('hide');
          toggleSnackbarAndSetText(true, err.message);
        });
    }
  };

  createActivate = () => {
    let { isFormValid, dataEntry } = this.props;

    console.log(dataEntry);

    let notValidated = true;

    if (dataEntry.hasOwnProperty('propertyType') && dataEntry.propertyType == 'PTYPE_OPEN_LAND') {
      if (isFormValid && (dataEntry.owners ? (dataEntry.owners.length == 0 ? false : true) : false)) {
        notValidated = false;
      } else {
        notValidated = true;
      }
    } else {
      if (
        isFormValid &&
        (dataEntry.floors ? (dataEntry.floors.length == 0 ? false : true) : false) &&
        (dataEntry.owners ? (dataEntry.owners.length == 0 ? false : true) : false)
      ) {
        notValidated = false;
      } else {
        notValidated = true;
      }
    }

    return notValidated;
  };

  render() {
    let {
      dataEntry,
      fieldErrors,
      isFormValid,
      handleChange,
      handleChangeNextOne,
      handleChangeNextTwo,
      deleteObject,
      deleteNestedObject,
      editObject,
      editIndex,
      isEditIndex,
      isAddRoom,
      files,
      handleChangeOwner,
    } = this.props;

    let { search, dataEntryTax, cThis, dataEntryCreateRequest } = this;

    if (this.props.files.length != 0) {
      console.log(this.props.files[0].length);
    }

    console.log(isFormValid);

    const renderOption = function(list, listName = '') {
      if (list) {
        return list.map(item => {
          return <MenuItem key={item.id} value={item.id} primaryText={item.name} />;
        });
      }
    };

    return (
      <div className="dataEntry">
        <h3 style={{ padding: 15 }}>{translate('pt.create.groups.createDataEntry')}</h3>
        <form
          onSubmit={e => {
            search(e);
          }}
        >
          <UpicNumber />
          <OwnerDetails />
          <PropertyAddress />
          <AssessmentDetails />
          <PropertyFactors />
          {getNameByCode(this.state.propertytypes, dataEntry.propertyType) == 'Open Land' ? (
            <div>
              <VacantLand />
            </div>
          ) : (
            <div>
              <FloorDetails />
            </div>
          )}
          <ConstructionDetails />
          <div style={{ textAlign: 'center' }}>
            <br />
            <RaisedButton
              type="button"
              id="createDataEntry"
              label="Create"
              disabled={this.createActivate()}
              primary={true}
              onClick={() => {
                dataEntryCreateRequest();
              }}
            />
            <div className="clearfix" />
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dataEntry: state.form.form,
  fieldErrors: state.form.fieldErrors,
  editIndex: state.form.editIndex,
  addRoom: state.form.addRoom,
  files: state.form.files,
  isFormValid: state.form.isFormValid,
});

const mapDispatchToProps = dispatch => ({
  initForm: () => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: [
            'reasonForCreation',
            'propertyType',
            'pin',
            'usage',
            'doorNo',
            'zoneNo',
            'wardNo',
            'sequenceNo',
            'oldUpicNumber',
            'totalFloors',
            'currentAssessmentDate',
            'firstAssessmentDate',
            'lastAssessmentDate',
          ],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
      validatePropertyOwner: {
        required: {
          current: [],
          required: ['name', 'gender'],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
      validatePropertyFloor: {
        required: {
          current: [],
          required: [
            'floorNo',
            'unitType',
            'unitNo',
            'structure',
            'usage',
            'occupancyType',
            'constCompletionDate',
            'occupancyDate',
            'isStructured',
            'builtupArea',
            'carpetArea',
          ],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
      isPrimaryOwner: 'PrimaryOwner',
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

  handleChangeNextOne: (e, property, propertyOne, isRequired, pattern) => {
    dispatch({
      type: 'HANDLE_CHANGE_NEXT_ONE',
      property,
      propertyOne,
      value: e.target.value,
      isRequired,
      pattern,
    });
  },
  addNestedFormData: (formArray, formData) => {
    dispatch({
      type: 'PUSH_ONE',
      formArray,
      formData,
    });
  },

  addNestedFormDataTwo: (formObject, formArray, formData) => {
    dispatch({
      type: 'PUSH_ONE_ARRAY',
      formObject,
      formArray,
      formData,
    });
  },

  deleteObject: (property, index) => {
    dispatch({
      type: 'DELETE_OBJECT',
      property,
      index,
    });
  },

  deleteNestedObject: (property, propertyOne, index) => {
    dispatch({
      type: 'DELETE_NESTED_OBJECT',
      property,
      propertyOne,
      index,
    });
  },

  editObject: (objectName, object, isEditable) => {
    dispatch({
      type: 'EDIT_OBJECT',
      objectName,
      object,
      isEditable,
    });
  },

  resetObject: object => {
    dispatch({
      type: 'RESET_OBJECT',
      object,
      validatePropertyOwner: {
        required: {
          current: [],
          required: ['name', 'gender'],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
      validatePropertyFloor: {
        required: {
          current: [],
          required: [
            'floorNo',
            'unitType',
            'unitNo',
            'structure',
            'usage',
            'occupancyType',
            'constCompletionDate',
            'occupancyDate',
            'isStructured',
            'builtupArea',
            'carpetArea',
          ],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },

  updateObject: (objectName, object) => {
    dispatch({
      type: 'UPDATE_OBJECT',
      objectName,
      object,
    });
  },

  updateNestedObject: (objectName, objectArray, object) => {
    dispatch({
      type: 'UPDATE_NESTED_OBJECT',
      objectName,
      objectArray,
      object,
    });
  },

  handleChangeOwner: (e, property, propertyOne, isRequired, pattern) => {
    dispatch({
      type: 'HANDLE_CHANGE_OWNER',
      property,
      propertyOne,
      value: e.target.value,
      isRequired,
      pattern,
    });
  },

  handleChangeFloor: (e, property, propertyOne, isRequired, pattern) => {
    dispatch({
      type: 'HANDLE_CHANGE_FLOOR',
      property,
      propertyOne,
      value: e.target.value,
      isRequired,
      pattern,
    });
  },

  isEditIndex: index => {
    dispatch({
      type: 'EDIT_INDEX',
      index,
    });
  },

  isAddRoom: room => {
    dispatch({
      type: 'ADD_ROOM',
      room,
    });
  },

  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DataEntry);
