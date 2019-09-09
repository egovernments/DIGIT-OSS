import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Upload from 'material-ui-upload/Upload';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { brown500, red500, white } from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import DataTable from '../common/Table';
import Api from '../../api/pTAPIS';

var flag = 0;
const styles = {
  errorStyle: {
    color: red500,
  },
  underlineStyle: {
    borderColor: brown500,
  },
  underlineFocusStyle: {
    borderColor: brown500,
  },
  floatingLabelStyle: {
    color: brown500,
  },
  floatingLabelFocusStyle: {
    color: brown500,
  },
  customWidth: {
    width: 100,
  },
  checkbox: {
    marginBottom: 16,
    marginTop: 24,
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
  },
  iconFont: {
    fontSize: 17,
  },
  radioButton: {
    marginBottom: 16,
  },
  actionWidth: {
    width: 160,
  },
  reducePadding: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  noPadding: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  noMargin: {
    marginBottom: 0,
  },
};

//Create Class for Create and update property
class CruProperty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addButton: false,
      addOwner: true,
      addFloor: true,
      addRoom: false,
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
    };
  }

  componentWillMount() {
    //call boundary service fetch wards,location,zone data
    //var dropDownSearch = ['propertytypes','apartments', 'departments', 'floortypes', 'rooftypes', 'walltypes', 'woodtypes', 'structureclasses', 'occupancies'];
    var currentThis = this;

    Api.commonApiPost('property/propertytypes/_search')
      .then(res => {
        console.log(res);
        currentThis.setState({ propertytypes: res.propertyTypes });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('property/apartments/_search')
      .then(res => {
        console.log(res);
        currentThis.setState({ apartments: res.apartments });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('property/departments/_search')
      .then(res => {
        console.log(res);
        currentThis.setState({ departments: res.departments });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('property/floortypes/_search')
      .then(res => {
        console.log(res);
        currentThis.setState({ floortypes: res.floorTypes });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('property/rooftypes/_search')
      .then(res => {
        console.log(res);
        currentThis.setState({ rooftypes: res.roofTypes });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('property/walltypes/_search')
      .then(res => {
        console.log(res);
        currentThis.setState({ walltypes: res.walltypes });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('property/woodtypes/_search')
      .then(res => {
        console.log(res);
        currentThis.setState({ woodtypes: res.woodTypes });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('property/structureclasses/_search')
      .then(res => {
        console.log(res);
        currentThis.setState({ structureclasses: res.structureClasses });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('property/occupancies/_search')
      .then(res => {
        console.log(res);
        currentThis.setState({ occupancies: res.occupancies });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('property/usages/_search')
      .then(res => {
        console.log(res);
        currentThis.setState({ usages: res.usageMasters });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'WARD',
      hierarchyTypeName: 'REVANUE',
    })
      .then(res => {
        console.log(res);
        currentThis.setState({ ward: res.Boundary });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'LOCALITY',
      hierarchyTypeName: 'LOCATION',
    })
      .then(res => {
        console.log(res);
        currentThis.setState({ locality: res.Boundary });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'ZONE',
      hierarchyTypeName: 'REVANUE',
    })
      .then(res => {
        console.log(res);
        currentThis.setState({ zone: res.Boundary });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'BLOCK',
      hierarchyTypeName: 'REVANUE',
    })
      .then(res => {
        console.log(res);
        currentThis.setState({ block: res.Boundary });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'STREET',
      hierarchyTypeName: 'REVANUE',
    })
      .then(res => {
        console.log(res);
        currentThis.setState({ street: res.Boundary });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'REVANUE',
      hierarchyTypeName: 'REVANUE',
    })
      .then(res => {
        console.log(res);
        currentThis.setState({ street: res.Boundary });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
      boundaryTypeName: 'ELECTION',
      hierarchyTypeName: 'ADMINISTRATION',
    })
      .then(res => {
        console.log(res);
        currentThis.setState({ election: res.Boundary });
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    let { initForm } = this.props;
    initForm();
  }

  componentWillUnmount() {}

  onFileLoad = e => console.log(e.target.result);

  componentWillUpdate() {}

  componentDidUpdate(prevProps, prevState) {}

  search = e => {};

  handleCheckBoxChange = prevState => {
    this.setState(prevState => {
      prevState.cAddressDiffPAddress.checked = !prevState.cAddressDiffPAddress.checked;
    });
  };

  render() {
    let {
      owners,
      cruProperty,
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
    } = this.props;

    let { search } = this;

    let cThis = this;

    console.log(cruProperty);

    const renderOption = function(list, isCode) {
      if (list) {
        return list.map(item => {
          return <MenuItem key={item.id} value={isCode ? item.code : item.id} primaryText={item.name} />;
        });
      }
    };

    const createProperty = () => {
      /*  let properties:[
          owners:cruProperty.owners,
          propertyDetail: {
            floors:cruProperty.floors
          }
      ];*/
      console.log(cruProperty);
      Api.commonApiPost('properties/_create', {}, {})
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    };

    const ownerForm = () => (
      <Row>
        <Col xs={12} md={3} sm={6}>
          <TextField
            hintText="eg- 434345456545"
            floatingLabelText="Aadhar No"
            errorText={
              fieldErrors.owner ? (
                fieldErrors.owner.aadhaarNumber ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.owner.aadhaarNumber}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.owner ? cruProperty.owner.aadhaarNumber : ''}
            onChange={e => {
              handleChangeNextOne(e, 'owner', 'aadhaarNumber', true, /^\d{12}$/g);
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <Col xs={12} md={3} sm={6}>
          <TextField
            hintText="eg- 9999888877"
            floatingLabelText="Mobile No"
            errorText={
              fieldErrors.owner ? (
                fieldErrors.owner.mobileNumber ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.owner.mobileNumber}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.owner ? cruProperty.owner.mobileNumber : ''}
            onChange={e => {
              handleChangeNextOne(e, 'owner', 'mobileNumber', true, /^\d{10}$/g);
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <Col xs={12} md={3} sm={6}>
          <TextField
            hintText="eg- Joe Doe"
            floatingLabelText="Owner Name"
            errorText={
              fieldErrors.owner ? (
                fieldErrors.owner.name ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.owner.name}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.name ? cruProperty.owner.name : ''}
            onChange={e => {
              handleChangeNextOne(e, 'owner', 'name', true, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <Col xs={12} md={3} sm={6}>
          <SelectField
            floatingLabelText="Gender"
            errorText={
              fieldErrors.owner ? (
                fieldErrors.owner.gender ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.owner.gender}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.owner ? cruProperty.owner.gender : ''}
            onChange={(event, index, value) => {
              var e = {
                target: {
                  value: value,
                },
              };
              handleChangeNextOne(e, 'owner', 'gender', true, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          >
            <MenuItem value={1} primaryText="Male" />
            <MenuItem value={2} primaryText="Female" />
            <MenuItem value={3} primaryText="Others" />
          </SelectField>
        </Col>
        <Col xs={12} md={3} sm={6}>
          <TextField
            hintText="eg- example@example.com"
            floatingLabelText="Email"
            errorText={
              fieldErrors.owner ? (
                fieldErrors.owner.emailId ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.owner.emailId}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.owner ? cruProperty.owner.emailId : ''}
            onChange={e => {
              handleChangeNextOne(e, 'owner', 'emailId', false, /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <Col xs={12} md={3} sm={6}>
          <SelectField
            hintText="eg- Father"
            floatingLabelText="Guardian Relation"
            errorText={
              fieldErrors.owner ? (
                fieldErrors.owner.gaurdianRelation ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.owner.gaurdianRelation}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.owner ? cruProperty.owner.gaurdianRelation : ''}
            onChange={(event, index, value) => {
              var e = {
                target: {
                  value: value,
                },
              };
              handleChangeNextOne(e, 'owner', 'gaurdianRelation', true, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          >
            <MenuItem value={1} primaryText="Father" />
            <MenuItem value={2} primaryText="Husband" />
            <MenuItem value={3} primaryText="Mother" />
            <MenuItem value={4} primaryText="Others" />
          </SelectField>
        </Col>
        <Col xs={12} md={3} sm={6}>
          <TextField
            hintText="eg- Guardian name"
            floatingLabelText="Guardian"
            errorText={
              fieldErrors.owner ? (
                fieldErrors.owner.gaurdian ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.owner.gaurdian}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.owner ? cruProperty.owner.gaurdian : ''}
            onChange={e => handleChangeNextOne(e, 'owner', 'gaurdian', false, '')}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>

        <Col xs={12} md={3} sm={6}>
          <SelectField
            floatingLabelText="Owner type"
            errorText={
              fieldErrors.owner ? (
                fieldErrors.owner.ownerType ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.owner.ownerType}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.owner ? cruProperty.owner.ownerType : ''}
            onChange={(event, index, value) => {
              var e = {
                target: {
                  value: value,
                },
              };
              handleChangeNextOne(e, 'owner', 'ownerType', false, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          >
            <MenuItem value={1} primaryText="Ex-Service man" />
            <MenuItem value={2} primaryText="Freedom Fighter" />
            <MenuItem value={3} primaryText="Freedom figher's wife" />
          </SelectField>
        </Col>

        <Col xs={12} md={3} sm={6}>
          <TextField
            hintText="eg- 100"
            floatingLabelText="Percentage of ownership"
            errorText={
              fieldErrors.owner ? (
                fieldErrors.owner.ownerShipPercentage ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.owner.ownerShipPercentage}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.owner ? cruProperty.owner.ownerShipPercentage : ''}
            onChange={e => handleChangeNextOne(e, 'owner', 'ownerShipPercentage', false, /^\d{3}$/g)}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>

        <Col xs={12} md={3} sm={6}>
          <br />
          <br />
          <RadioButtonGroup
            name="ownerRadio"
            defaultSelected={cruProperty.owner ? cruProperty.owner.ownerTypeRadio : ''}
            onChange={(e, v) => {
              var e = {
                target: {
                  value: v,
                },
              };
              handleChangeNextOne(e, 'owner', 'ownerTypeRadio', true, '');
            }}
          >
            <RadioButton value="isPrimaryOwner" label="Primary owner" style={styles.radioButton} />
            <RadioButton value="isSecondaryOwner" label="Secondary owner" style={styles.radioButton} />
          </RadioButtonGroup>
        </Col>

        <Col xs={12}>
          <br />
          {(editIndex == -1 || editIndex == undefined) && (
            <RaisedButton
              type="button"
              label="Add"
              backgroundColor={brown500}
              labelColor={white}
              onClick={() => {
                this.props.addNestedFormData('owners', 'owner');
                this.props.resetObject('owner');
              }}
            />
          )}
          {editIndex > -1 && (
            <RaisedButton
              type="button"
              label="Save"
              backgroundColor={brown500}
              labelColor={white}
              onClick={() => {
                this.props.updateObject('owners', 'owner', editIndex);
                this.props.resetObject('owner');
                isEditIndex(-1);
              }}
            />
          )}
        </Col>
      </Row>
    );

    const unitForm = () => (
      <div className="unitsList">
        <br />
        <Col xs={12} md={12}>
          <strong>Units</strong>
        </Col>
        <div className="clearfix" />
        <br />

        <Col xs={12} md={3} sm={6}>
          {(editIndex == -1 || editIndex == undefined) &&
            true && (
              <RaisedButton
                type="button"
                label="Add Unit"
                backgroundColor={brown500}
                labelColor={white}
                onClick={() => {
                  this.props.addNestedFormDataTwo('floor', 'units', 'unit');
                  this.props.resetObject('unit');
                }}
              />
            )}
          {editIndex > -1 &&
            true && (
              <RaisedButton
                type="button"
                label="Save Unit"
                backgroundColor={brown500}
                labelColor={white}
                onClick={() => {
                  this.props.updateNestedObject('floor', 'units', 'unit', editIndex);
                  this.props.resetObject('unit');
                  isEditIndex(-1);
                }}
              />
            )}
        </Col>
      </div>
    );

    const roomForm = () => (
      <div>
        <Col xs={12} md={3} sm={6}>
          <SelectField
            floatingLabelText="Floor Number"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.floorNo ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.floorNo}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.floorNo : ''}
            onChange={(event, index, value) => {
              var e = {
                target: {
                  value: value,
                },
              };
              handleChangeNextOne(e, 'unit', 'floorNo', true, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          >
            <MenuItem value={1} primaryText="Ground floor" />
            <MenuItem value={2} primaryText=" Basement-2" />
            <MenuItem value={3} primaryText=" Basement-1" />
          </SelectField>
        </Col>
        <Col xs={12} md={3} sm={6}>
          <TextField
            floatingLabelText="Unit Number"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.unitNo ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.unitNo}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.unitNo : ''}
            onChange={e => {
              handleChangeNextOne(e, 'unit', 'unitNo', true, /^\d{3}$/g);
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <Col xs={12} md={3} sm={6}>
          <SelectField
            floatingLabelText="Construction type"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.constructionType ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.constructionType}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.constructionType : ''}
            onChange={(event, index, value) => {
              var e = {
                target: {
                  value: value,
                },
              };
              handleChangeNextOne(e, 'unit', 'constructionType', true, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          >
            {renderOption(this.state.structureclasses)}
          </SelectField>
        </Col>
        <Col xs={12} md={3} sm={6}>
          <SelectField
            floatingLabelText="Usage type"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.usage ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.usage}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.usage : ''}
            onChange={(event, index, value) => {
              var e = {
                target: {
                  value: value,
                },
              };
              handleChangeNextOne(e, 'unit', 'usage', true, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          >
            {renderOption(this.state.usages)}
          </SelectField>
        </Col>
        <Col xs={12} md={3} sm={6}>
          <SelectField
            floatingLabelText="Usage sub type"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.usageSubType ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.usageSubType}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.usageSubType : ''}
            onChange={(event, index, value) => {
              var e = {
                target: {
                  value: value,
                },
              };
              handleChangeNextOne(e, 'unit', 'usageSubType', true, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          >
            {renderOption(this.state.usages)}
          </SelectField>
        </Col>
        <Col xs={12} md={3} sm={6}>
          <TextField
            floatingLabelText="Firm Name"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.firmName ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.firmName}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.firmName : ''}
            onChange={e => {
              handleChangeNextOne(e, 'unit', 'firmName', false, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <Col xs={12} md={3} sm={6}>
          <SelectField
            floatingLabelText="Occupancy"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.occupancyType ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.occupancyType}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.occupancyType : ''}
            onChange={(event, index, value) => {
              var e = {
                target: {
                  value: value,
                },
              };
              handleChangeNextOne(e, 'unit', 'occupancyType', true, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          >
            {renderOption(this.state.occupancies)}
          </SelectField>
        </Col>
        <Col xs={12} md={3} sm={6}>
          <TextField
            floatingLabelText="Occupant Name"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.occupierName ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.occupierName}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.occupierName : ''}
            onChange={e => {
              handleChangeNextOne(e, 'unit', 'occupierName', false, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <div className="clearfix" />
        <Col xs={12} md={3} sm={6}>
          <TextField
            floatingLabelText="Annual Rent"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.annualRent ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.annualRent}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.annualRent : ''}
            onChange={e => {
              handleChangeNextOne(e, 'unit', 'annualRent', false, /^\d{9}$/g);
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <Col xs={12} md={3} sm={6}>
          <TextField
            floatingLabelText="Manual ARV"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.manualArv ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.manualArv}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.manualArv : ''}
            onChange={e => {
              handleChangeNextOne(e, 'unit', 'manualArv', false, /^\d{9}$/g);
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <Col xs={12} md={3} sm={6}>
          <DatePicker
            floatingLabelText="Construction Date"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.constructionDate ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.constructionDate}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            onChange={(event, date) => {
              var e = {
                target: {
                  value: date,
                },
              };
              handleChangeNextOne(e, 'unit', 'constructionDate', true, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <Col xs={12} md={3} sm={6}>
          <DatePicker
            floatingLabelText="Effective From Date"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.effectiveDate ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.effectiveDate}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            onChange={(event, date) => {
              var e = {
                target: {
                  value: date,
                },
              };
              handleChangeNextOne(e, 'unit', 'effectiveDate', true, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <Col xs={12} md={3} sm={6}>
          <SelectField
            floatingLabelText="Unstructured land"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.unstructuredLand ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.unstructuredLand}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.unstructuredLand : ''}
            onChange={(event, index, value) => {
              var e = {
                target: {
                  value: value,
                },
              };
              handleChangeNextOne(e, 'unit', 'unstructuredLand', true, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          >
            <MenuItem value={1} primaryText="Yes" />
            <MenuItem value={2} primaryText="No" />
          </SelectField>
        </Col>
        <Col xs={12} md={3} sm={6}>
          <TextField
            floatingLabelText="Length"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.length ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.length}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.length : ''}
            onChange={e => {
              handleChangeNextOne(e, 'unit', 'length', false, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <Col xs={12} md={3} sm={6}>
          <TextField
            floatingLabelText="Breadth"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.width ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.width}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.width : ''}
            onChange={e => {
              handleChangeNextOne(e, 'unit', 'width', false, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <Col xs={12} md={3} sm={6}>
          <TextField
            floatingLabelText="Plinth Area"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.plinthArea ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.plinthArea}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.plinthArea : ''}
            onChange={e => {
              handleChangeNextOne(e, 'unit', 'plinthArea', true, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <div className="clearfix" />
        <Col xs={12} md={3} sm={6}>
          <TextField
            floatingLabelText="Occupancy Certificate Number"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.occupancyCertiNumber ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.occupancyCertiNumber}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.occupancyCertiNumber : ''}
            onChange={e => {
              handleChangeNextOne(e, 'unit', 'occupancyCertiNumber', false, /^\d[a-zA-Z0-9]{9}$/g);
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <Col xs={12} md={3} sm={6}>
          <TextField
            floatingLabelText="Building Permission number"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.bpaNo ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.bpaNo}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.bpaNo : ''}
            onChange={e => {
              handleChangeNextOne(e, 'unit', 'bpaNo', false, /^\d[a-zA-Z0-9]{14}$/g);
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <Col xs={12} md={3} sm={6}>
          <DatePicker
            floatingLabelText="Building Permission Date"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.bpaDate ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.bpaDate}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            onChange={(event, date) => {
              var e = {
                target: {
                  value: date,
                },
              };
              handleChangeNextOne(e, 'unit', 'bpaDate', false, '');
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <Col xs={12} md={3} sm={6}>
          <TextField
            floatingLabelText="Plinth area in Building plan"
            errorText={
              fieldErrors.unit ? (
                fieldErrors.unit.plinthAreaBuildingPlan ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.plinthAreaBuildingPlan}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.unit ? cruProperty.unit.plinthAreaBuildingPlan : ''}
            onChange={e => {
              handleChangeNextOne(e, 'unit', 'plinthAreaBuildingPlan', false, /^\d{6}$/g);
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          />
        </Col>
        <div className="clearfix" />
        <br />

        <Col xs={12} md={3} sm={6}>
          {(editIndex == -1 || editIndex == undefined) &&
            true && (
              <RaisedButton
                type="button"
                label="Save Room Details"
                backgroundColor={brown500}
                labelColor={white}
                onClick={() => {
                  this.props.addNestedFormDataTwo('floor', 'units', 'unit');
                  this.props.resetObject('unit');
                }}
              />
            )}
          {editIndex > -1 &&
            true && (
              <RaisedButton
                type="button"
                label="Save Room"
                backgroundColor={brown500}
                labelColor={white}
                onClick={() => {
                  this.props.updateNestedObject('floor', 'units', 'unit', editIndex);
                  this.props.resetObject('unit');
                  isEditIndex(-1);
                }}
              />
            )}
        </Col>
      </div>
    );

    let todayDate = new Date();

    //console.log(bpaDate, constructionDate, effectiveDate );

    const flatForm = () => {
      return (
        <div>
          <Col xs={12} md={3} sm={6}>
            <SelectField
              floatingLabelText="Floor Number"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.floorNo ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.floorNo}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.floorNo : ''}
              onChange={(event, index, value) => {
                var e = {
                  target: {
                    value: value,
                  },
                };
                handleChangeNextOne(e, 'floor', 'floorNo', true, '');
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            >
              <MenuItem value={1} primaryText="Ground floor" />
              <MenuItem value={2} primaryText=" Basement-2" />
              <MenuItem value={3} primaryText=" Basement-1" />
            </SelectField>
          </Col>
          <Col xs={12} md={3} sm={6}>
            <TextField
              floatingLabelText="Unit Number"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.unitNo ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.unit.unitNo}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.unitNo : ''}
              onChange={e => {
                handleChangeNextOne(e, 'floor', 'unitNo', true, /^\d{3}$/g);
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            />
          </Col>
          <Col xs={12} md={3} sm={6}>
            <SelectField
              floatingLabelText="Construction type"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.constructionType ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.constructionType}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.constructionType : ''}
              onChange={(event, index, value) => {
                var e = {
                  target: {
                    value: value,
                  },
                };
                handleChangeNextOne(e, 'floor', 'constructionType', true, '');
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            >
              {renderOption(this.state.structureclasses)}
            </SelectField>
          </Col>
          <Col xs={12} md={3} sm={6}>
            <SelectField
              floatingLabelText="Usage type"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.usage ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.usage}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.usage : ''}
              onChange={(event, index, value) => {
                var e = {
                  target: {
                    value: value,
                  },
                };
                handleChangeNextOne(e, 'floor', 'usage', true, '');
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            >
              {renderOption(this.state.usages)}
            </SelectField>
          </Col>
          <Col xs={12} md={3} sm={6}>
            <SelectField
              floatingLabelText="Usage sub type"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.usageSubType ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.usageSubType}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.usageSubType : ''}
              onChange={(event, index, value) => {
                var e = {
                  target: {
                    value: value,
                  },
                };
                handleChangeNextOne(e, 'floor', 'usageSubType', true, '');
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            >
              {renderOption(this.state.usages)}
            </SelectField>
          </Col>
          <Col xs={12} md={3} sm={6}>
            <TextField
              floatingLabelText="Firm Name"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.firmName ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.firmName}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.firmName : ''}
              onChange={e => {
                handleChangeNextOne(e, 'floor', 'firmName', false, '');
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            />
          </Col>
          <Col xs={12} md={3} sm={6}>
            <SelectField
              floatingLabelText="Occupancy"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.occupancyType ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.occupancyType}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.occupancyType : ''}
              onChange={(event, index, value) => {
                var e = {
                  target: {
                    value: value,
                  },
                };
                handleChangeNextOne(e, 'floor', 'occupancyType', true, '');
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            >
              {renderOption(this.state.occupancies)}
            </SelectField>
          </Col>
          <Col xs={12} md={3} sm={6}>
            <TextField
              floatingLabelText="Occupant Name"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.occupierName ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.occupierName}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.occupierName : ''}
              onChange={e => {
                handleChangeNextOne(e, 'floor', 'occupierName', false, '');
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            />
          </Col>
          <div className="clearfix" />
          <Col xs={12} md={3} sm={6}>
            <TextField
              floatingLabelText="Annual Rent"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.annualRent ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.annualRent}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.annualRent : ''}
              onChange={e => {
                handleChangeNextOne(e, 'floor', 'annualRent', false, /^\d{9}$/g);
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            />
          </Col>
          <Col xs={12} md={3} sm={6}>
            <TextField
              floatingLabelText="Manual ARV"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.manualArv ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.manualArv}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.manualArv : ''}
              onChange={e => {
                handleChangeNextOne(e, 'floor', 'manualArv', false, /^\d{9}$/g);
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            />
          </Col>
          <Col xs={12} md={3} sm={6}>
            <DatePicker
              floatingLabelText="Construction Date"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.constructionDate ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.constructionDate}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              defaultDate={
                cruProperty.floor ? (cruProperty.floor.constructionDate ? new Date(cruProperty.floor.constructionDate) : new Date()) : new Date()
              }
              onChange={(event, date) => {
                var e = {
                  target: {
                    value: date,
                  },
                };
                handleChangeNextOne(e, 'floor', 'constructionDate', true, '');
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            />
          </Col>
          <Col xs={12} md={3} sm={6}>
            <DatePicker
              floatingLabelText="Effective From Date"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.effectiveDate ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.effectiveDate}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              defaultDate={
                cruProperty.floor ? (cruProperty.floor.effectiveDate ? new Date(cruProperty.floor.effectiveDate) : new Date()) : new Date()
              }
              onChange={(event, date) => {
                var e = {
                  target: {
                    value: date,
                  },
                };
                handleChangeNextOne(e, 'floor', 'effectiveDate', true, '');
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            />
          </Col>
          <Col xs={12} md={3} sm={6}>
            <SelectField
              floatingLabelText="Unstructured land"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.unstructuredLand ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.unstructuredLand}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.unstructuredLand : ''}
              onChange={(event, index, value) => {
                var e = {
                  target: {
                    value: value,
                  },
                };
                handleChangeNextOne(e, 'floor', 'unstructuredLand', true, '');
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            >
              <MenuItem value={1} primaryText="Yes" />
              <MenuItem value={2} primaryText="No" />
            </SelectField>
          </Col>
          <Col xs={12} md={3} sm={6}>
            <TextField
              floatingLabelText="Length"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.length ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.length}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.length : ''}
              onChange={e => {
                handleChangeNextOne(e, 'floor', 'length', false, '');
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            />
          </Col>
          <Col xs={12} md={3} sm={6}>
            <TextField
              floatingLabelText="Breadth"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.width ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.width}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.width : ''}
              onChange={e => {
                handleChangeNextOne(e, 'floor', 'width', false, '');
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            />
          </Col>
          <Col xs={12} md={3} sm={6}>
            <TextField
              floatingLabelText="Plinth Area"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.plinthArea ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.plinthArea}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.plinthArea : ''}
              onChange={e => {
                handleChangeNextOne(e, 'floor', 'plinthArea', true, '');
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            />
          </Col>
          <div className="clearfix" />
          <Col xs={12} md={3} sm={6}>
            <TextField
              floatingLabelText="Occupancy Certificate Number"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.occupancyCertiNumber ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.occupancyCertiNumber}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.occupancyCertiNumber : ''}
              onChange={e => {
                handleChangeNextOne(e, 'floor', 'occupancyCertiNumber', false, /^\d[a-zA-Z0-9]{9}$/g);
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            />
          </Col>
          <Col xs={12} md={3} sm={6}>
            <TextField
              floatingLabelText="Building Permission number"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.bpaNo ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.bpaNo}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.bpaNo : ''}
              onChange={e => {
                handleChangeNextOne(e, 'floor', 'bpaNo', false, /^\d[a-zA-Z0-9]{14}$/g);
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            />
          </Col>
          <Col xs={12} md={3} sm={6}>
            <DatePicker
              floatingLabelText="Building Permission Date"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.bpaDate ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.bpaDate}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              defaultDate={cruProperty.floor ? (cruProperty.floor.bpaDate ? new Date(cruProperty.floor.bpaDate) : new Date()) : new Date()}
              onChange={(event, date) => {
                var e = {
                  target: {
                    value: date,
                  },
                };
                handleChangeNextOne(e, 'floor', 'bpaDate', false, '');
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            />
          </Col>
          <Col xs={12} md={3} sm={6}>
            <TextField
              floatingLabelText="Plinth area in Building plan"
              errorText={
                fieldErrors.floor ? (
                  fieldErrors.floor.plinthAreaBuildingPlan ? (
                    <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.plinthAreaBuildingPlan}</span>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              }
              value={cruProperty.floor ? cruProperty.floor.plinthAreaBuildingPlan : ''}
              onChange={e => {
                handleChangeNextOne(e, 'floor', 'plinthAreaBuildingPlan', false, /^\d{6}$/g);
              }}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
            />
          </Col>
        </div>
      );
    };

    const floorForm = () => (
      <Row>
        <Col xs={12} md={3} sm={6}>
          <SelectField
            floatingLabelText="Unit Type"
            errorText={
              fieldErrors.floor ? (
                fieldErrors.floor.unitType ? (
                  <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floor.unitType}</span>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            }
            value={cruProperty.floor ? cruProperty.floor.unitType : ''}
            onChange={(event, index, value) => {
              var e = {
                target: {
                  value: value,
                },
              };
              handleChangeNextOne(e, 'floor', 'unitType', true, '');
              if (value == 2) {
                this.setState({ addRoom: false });
                this.setState({ addFloor: false });
                this.setState({ addFloor: true });
              }
            }}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineFocusStyle}
          >
            <MenuItem value={1} primaryText="Flat" />
            <MenuItem value={2} primaryText="Room" />
          </SelectField>
        </Col>
        {(cruProperty.floor ? (cruProperty.floor.unitType == 1 ? true : false) : false) && (
          <Col xs={12} md={3} sm={6}>
            <RaisedButton
              type="button"
              label="Add Room"
              style={{ marginTop: 28 }}
              backgroundColor={brown500}
              labelColor={white}
              onClick={() => {
                this.setState({ addRoom: true });
                this.setState({ addFloor: false });
                this.setState({ addFloor: true });
              }}
            />
          </Col>
        )}
        <div className="clearfix" />
        <hr />
        {this.state.addRoom && roomForm()}
        {!this.state.addRoom && flatForm()}
        <br />
        <Col xs={12} style={{ textAlign: 'center' }}>
          <br />
          {(editIndex == -1 || editIndex == undefined) && (
            <RaisedButton
              type="button"
              label="Add Floor"
              backgroundColor={brown500}
              labelColor={white}
              onClick={() => {
                //  this.props.addNestedFormData("floor","units");
                this.props.addNestedFormData('floors', 'floor');
                this.props.resetObject('floor');
              }}
            />
          )}
          {editIndex > -1 && (
            <RaisedButton
              type="button"
              label="Save"
              backgroundColor={brown500}
              labelColor={white}
              onClick={() => {
                this.props.updateObject('floors', 'floor', editIndex);
                this.props.resetObject('floor');
                isEditIndex(-1);
              }}
            />
          )}
        </Col>
      </Row>
    );

    return (
      <div className="cruProperty">
        <form
          onSubmit={e => {
            search(e);
          }}
        >
          <Card>
            <CardHeader title={<strong style={{ color: brown500 }}>Owner Details</strong>} style={styles.reducePadding} />
            <CardText style={styles.reducePadding}>
              <Card>
                <CardText style={styles.reducePadding}>
                  <Grid fluid>
                    <Row>
                      <Col xs={12} md={12}>
                        <Row>
                          <Table
                            id="cruPropertyTable"
                            style={{
                              color: 'black',
                              fontWeight: 'normal',
                              marginBottom: 0,
                            }}
                            bordered
                            responsive
                          >
                            <thead
                              style={{
                                backgroundColor: '#f2851f',
                                color: 'white',
                              }}
                            >
                              <tr>
                                <th>#</th>
                                <th>Adhar Number</th>
                                <th>Mobile Number</th>
                                <th>Owner Name</th>
                                <th>Gender</th>
                                <th>Email</th>
                                <th>Gaurdian Relation</th>
                                <th>Owner Type Radio</th>
                                <th>Gaurdian</th>
                                <th>Owner Type</th>
                                <th>Percentage of Ownership</th>
                                <th style={styles.actionWidth}>
                                  <FloatingActionButton
                                    mini={true}
                                    className="pull-right"
                                    onClick={() => {
                                      this.setState((prevState, props) => ({
                                        addOwner: !prevState.addOwner,
                                      }));
                                      this.props.resetObject('owner');
                                      this.props.resetObject('floor');
                                      isEditIndex(-1);
                                    }}
                                  >
                                    <i className="material-icons" style={styles.iconFont}>
                                      {!this.state.addOwner ? 'add_box' : 'remove_circle'}
                                    </i>
                                  </FloatingActionButton>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {cruProperty.owners &&
                                cruProperty.owners.map(function(i, index) {
                                  if (i) {
                                    return (
                                      <tr key={index}>
                                        <td>{index}</td>
                                        <td>{i.aadhaarNumber}</td>
                                        <td>{i.mobileNumber}</td>
                                        <td>{i.name}</td>
                                        <td>{i.gender}</td>
                                        <td>{i.emailId}</td>
                                        <td>{i.gaurdianRelation}</td>
                                        <td>{i.ownerTypeRadio}</td>
                                        <td>{i.gaurdian}</td>
                                        <td>{i.ownerType}</td>
                                        <td>{i.ownerShipPercentage}</td>
                                        <td style={styles.actionWidth}>
                                          <FloatingActionButton
                                            mini={true}
                                            style={styles.floatButtonMargin}
                                            onClick={() => {
                                              cThis.setState({
                                                addOwner: true,
                                              });
                                              editObject('owner', i);
                                              isEditIndex(index);
                                            }}
                                          >
                                            <i className="material-icons" style={styles.iconFont}>
                                              mode_edit
                                            </i>
                                          </FloatingActionButton>
                                          <FloatingActionButton
                                            mini={true}
                                            style={styles.floatButtonMargin}
                                            onClick={() => {
                                              deleteObject('owners', index);
                                              isEditIndex(-1);
                                            }}
                                          >
                                            <i className="material-icons" style={styles.iconFont}>
                                              delete
                                            </i>
                                          </FloatingActionButton>
                                        </td>
                                      </tr>
                                    );
                                  }
                                })}
                            </tbody>
                          </Table>
                        </Row>
                      </Col>
                      {this.state.addOwner && ownerForm()}
                    </Row>
                  </Grid>
                </CardText>
              </Card>
            </CardText>
          </Card>
          <Card>
            <CardHeader style={styles.reducePadding} title={<strong style={{ color: brown500 }}>Create New Property</strong>} />
            <CardText style={styles.reducePadding}>
              <Card>
                <CardText style={styles.noPadding}>
                  <Grid fluid>
                    <Row>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Category of ownership"
                          errorText={fieldErrors.ownerShip ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.ownerShip}</span> : ''}
                          value={cruProperty.ownerShip ? cruProperty.ownerShip : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'ownerShip', false, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          {renderOption(this.state.propertytypes)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        {cruProperty.ownerShip === 1 && (
                          <SelectField
                            floatingLabelText="Property type"
                            errorText={
                              fieldErrors.propertyType ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.propertyType}</span> : ''
                            }
                            value={cruProperty.propertyType ? cruProperty.propertyType : ''}
                            onChange={(event, index, value) => {
                              var e = {
                                target: {
                                  value: value,
                                },
                              };
                              handleChange(e, 'propertyType', false, '');
                            }}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineFocusStyle}
                          >
                            {renderOption(this.state.propertytypes)}
                          </SelectField>
                        )}
                        {cruProperty.ownerShip === 3 && (
                          <SelectField
                            floatingLabelText="Property type"
                            errorText={
                              fieldErrors.propertyType ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.propertyType}</span> : ''
                            }
                            value={cruProperty.propertyType ? cruProperty.propertyType : ''}
                            onChange={(event, index, value) => {
                              var e = {
                                target: {
                                  value: value,
                                },
                              };
                              handleChange(e, 'propertyType', false, '');
                            }}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineFocusStyle}
                          >
                            {renderOption(this.state.propertytypes)}
                          </SelectField>
                        )}
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Apartment/ Complex name"
                          errorText={
                            fieldErrors.appartment ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.appartment}</span> : ''
                          }
                          value={cruProperty.appartment ? cruProperty.appartment : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'appartment', false, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          {renderOption(this.state.apartments)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        {cruProperty.ownerShip != 1 &&
                          cruProperty.ownerShip != 3 && (
                            <SelectField
                              floatingLabelText="Department"
                              errorText={
                                fieldErrors.department ? (
                                  <span
                                    style={{
                                      position: 'absolute',
                                      bottom: -11,
                                    }}
                                  >
                                    {fieldErrors.department}
                                  </span>
                                ) : (
                                  ''
                                )
                              }
                              value={cruProperty.department ? cruProperty.department : ''}
                              onChange={(event, index, value) => {
                                var e = {
                                  target: {
                                    value: value,
                                  },
                                };
                                handleChange(e, 'department', false, '');
                              }}
                              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                              underlineStyle={styles.underlineStyle}
                              underlineFocusStyle={styles.underlineFocusStyle}
                            >
                              {renderOption(this.state.departments)}
                            </SelectField>
                          )}
                      </Col>
                    </Row>
                  </Grid>
                </CardText>
              </Card>
            </CardText>
          </Card>
          <Card>
            <CardHeader style={styles.reducePadding} title={<strong style={{ color: brown500 }}>Property Address</strong>} />
            <CardText style={styles.reducePadding}>
              <Card>
                <CardText style={styles.noPadding}>
                  <Grid fluid>
                    <Row>
                      <Col xs={12} md={3} sm={6}>
                        <TextField
                          floatingLabelText="Reference property number"
                          errorText={
                            fieldErrors.refPropertyNumber ? (
                              <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.refPropertyNumber}</span>
                            ) : (
                              ''
                            )
                          }
                          value={cruProperty.refPropertyNumber ? cruProperty.refPropertyNumber : ''}
                          onChange={e => handleChange(e, 'refPropertyNumber', false, /^\d{15}$/g)}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        />
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Locality"
                          errorText={fieldErrors.locality ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.locality}</span> : ''}
                          value={cruProperty.locality ? cruProperty.locality : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'locality', true, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          {renderOption(this.state.locality, true)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Appartment/Complex name"
                          errorText={
                            fieldErrors.locality ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.appComplexName}</span> : ''
                          }
                          value={cruProperty.locality ? cruProperty.appComplexName : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'appComplexName', true, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          {renderOption(this.state.apartments)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Zone No."
                          errorText={fieldErrors.zoneNo ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.zoneNo}</span> : ''}
                          value={cruProperty.zoneNo ? cruProperty.zoneNo : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'zoneNo', true, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          {renderOption(this.state.zone, true)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Ward No."
                          errorText={fieldErrors.wardNo ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.wardNo}</span> : ''}
                          value={cruProperty.wardNo ? cruProperty.wardNo : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'wardNo', true, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          {renderOption(this.state.ward, true)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Block No."
                          errorText={fieldErrors.blockNo ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.blockNo}</span> : ''}
                          value={cruProperty.blockNo ? cruProperty.blockNo : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'blockNo', false, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          {renderOption(this.state.block, true)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Street"
                          errorText={fieldErrors.street ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.street}</span> : ''}
                          value={cruProperty.street ? cruProperty.street : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'street', false, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          {renderOption(this.state.street, true)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Revenue circle"
                          errorText={
                            fieldErrors.revenueCircle ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.revenueCircle}</span> : ''
                          }
                          value={cruProperty.revenueCircle ? cruProperty.revenueCircle : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'revenueCircle', false, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          {renderOption(this.state.revanue, true)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Election ward"
                          errorText={
                            fieldErrors.electionCard ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.electionCard}</span> : ''
                          }
                          value={cruProperty.electionCard ? cruProperty.electionCard : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'electionWard', true, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          {renderOption(this.state.election, true)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <TextField
                          floatingLabelText="Door No."
                          errorText={fieldErrors.doorNo ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.doorNo}</span> : ''}
                          value={cruProperty.doorNo ? cruProperty.doorNo : ''}
                          onChange={e => handleChange(e, 'doorNo', true, '')}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        />
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <TextField
                          floatingLabelText="Pin"
                          errorText={fieldErrors.pin ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.pin}</span> : ''}
                          value={cruProperty.pin ? cruProperty.pin : ''}
                          onChange={e => handleChange(e, 'pin', false, '')}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        />
                      </Col>
                      <Col xs={12} md={12}>
                        <Checkbox
                          label="Is correspondence address different from property address?"
                          style={styles.checkbox}
                          defaultChecked={cruProperty.cAddressDiffPAddress}
                          onCheck={(e, i, v) => {
                            var e = {
                              target: {
                                value: i,
                              },
                            };
                            handleChange(e, 'cAddressDiffPAddress', false, '');
                          }}
                        />
                      </Col>
                      {cruProperty.cAddressDiffPAddress && (
                        <div className="addMoreAddress">
                          <Col xs={12} md={3} sm={6}>
                            <TextField
                              floatingLabelText="Door No."
                              errorText={
                                fieldErrors.cDoorno ? (
                                  <span
                                    style={{
                                      position: 'absolute',
                                      bottom: -11,
                                    }}
                                  >
                                    {fieldErrors.cDoorno}
                                  </span>
                                ) : (
                                  ''
                                )
                              }
                              value={cruProperty.cDoorno ? cruProperty.cDoorno : ''}
                              onChange={e => handleChange(e, 'cDoorno', true, '')}
                              multiLine={true}
                              rows={2}
                              rowsMax={4}
                              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                              underlineStyle={styles.underlineStyle}
                              underlineFocusStyle={styles.underlineFocusStyle}
                            />
                          </Col>
                          <Col xs={12} md={3} sm={6}>
                            <TextField
                              floatingLabelText="Address 1"
                              errorText={
                                fieldErrors.addressTwo ? (
                                  <span
                                    style={{
                                      position: 'absolute',
                                      bottom: -11,
                                    }}
                                  >
                                    {fieldErrors.addressTwo}
                                  </span>
                                ) : (
                                  ''
                                )
                              }
                              value={cruProperty.addressTwo ? cruProperty.addressTwo : ''}
                              onChange={e => handleChange(e, 'addressTwo', true, '')}
                              multiLine={true}
                              rows={2}
                              rowsMax={4}
                              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                              underlineStyle={styles.underlineStyle}
                              underlineFocusStyle={styles.underlineFocusStyle}
                            />
                          </Col>
                          <Col xs={12} md={3} sm={6}>
                            <TextField
                              floatingLabelText="Pin"
                              errorText={
                                fieldErrors.pinTwo ? (
                                  <span
                                    style={{
                                      position: 'absolute',
                                      bottom: -11,
                                    }}
                                  >
                                    {fieldErrors.pinTwo}
                                  </span>
                                ) : (
                                  ''
                                )
                              }
                              value={cruProperty.pinTwo ? cruProperty.pinTwo : ''}
                              onChange={e => handleChange(e, 'pinTwo', true, '')}
                              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                              underlineStyle={styles.underlineStyle}
                              underlineFocusStyle={styles.underlineFocusStyle}
                            />
                          </Col>
                        </div>
                      )}
                    </Row>
                  </Grid>
                </CardText>
              </Card>
            </CardText>
          </Card>
          <Card>
            <CardHeader style={styles.reducePadding} title={<strong style={{ color: brown500 }}>Amenities</strong>} />
            <CardText style={styles.reducePadding}>
              <Card>
                <CardText style={styles.noPadding}>
                  <Grid fluid>
                    <Row>
                      <Col xs={12} md={3} sm={6}>
                        <Checkbox
                          label="Lift"
                          style={styles.checkbox}
                          defaultChecked={cruProperty.lift}
                          onCheck={(e, i, v) => {
                            var e = {
                              target: {
                                value: i,
                              },
                            };
                            handleChange(e, 'lift', false, '');
                          }}
                        />
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <Checkbox
                          label="Toilet"
                          style={styles.checkbox}
                          defaultChecked={cruProperty.toilet}
                          onCheck={(e, i, v) => {
                            var e = {
                              target: {
                                value: i,
                              },
                            };
                            handleChange(e, 'toilet', false, '');
                          }}
                        />
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <Checkbox
                          label="water tap"
                          style={styles.checkbox}
                          defaultChecked={cruProperty.waterTap}
                          onCheck={(e, i, v) => {
                            var e = {
                              target: {
                                value: i,
                              },
                            };
                            handleChange(e, 'waterTap', false, '');
                          }}
                        />
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <Checkbox
                          label="electricity"
                          style={styles.checkbox}
                          defaultChecked={cruProperty.electricity}
                          onCheck={(e, i, v) => {
                            var e = {
                              target: {
                                value: i,
                              },
                            };
                            handleChange(e, 'electricity', false, '');
                          }}
                        />
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <Checkbox
                          label="Attached bathroom"
                          style={styles.checkbox}
                          defaultChecked={cruProperty.attachedBathroom}
                          onCheck={(e, i, v) => {
                            var e = {
                              target: {
                                value: i,
                              },
                            };
                            handleChange(e, 'attachedBathroom', false, '');
                          }}
                        />
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <Checkbox
                          label="Cable connection"
                          style={styles.checkbox}
                          defaultChecked={cruProperty.cableConnection}
                          onCheck={(e, i, v) => {
                            var e = {
                              target: {
                                value: i,
                              },
                            };
                            handleChange(e, 'cableConnection', false, '');
                          }}
                        />
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <Checkbox
                          label="Water harvesting"
                          style={styles.checkbox}
                          defaultChecked={cruProperty.waterHarvesting}
                          onCheck={(e, i, v) => {
                            var e = {
                              target: {
                                value: i,
                              },
                            };
                            handleChange(e, 'waterHarvesting', false, '');
                          }}
                        />
                      </Col>
                    </Row>
                  </Grid>
                </CardText>
              </Card>
            </CardText>
          </Card>
          <Card>
            <CardHeader style={styles.reducePadding} title={<strong style={{ color: brown500 }}>Assessment details</strong>} />
            <CardText style={styles.reducePadding}>
              <Card>
                <CardText style={styles.noPadding}>
                  <Grid fluid>
                    <Row>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Reason for Creation"
                          errorText={
                            fieldErrors.reasonForCreation ? (
                              <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.reasonForCreation}</span>
                            ) : (
                              ''
                            )
                          }
                          value={cruProperty.reasonForCreation ? cruProperty.reasonForCreation : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'reasonForCreation', true, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                          id="creationReason"
                        >
                          <MenuItem value={1} primaryText="New Property" />
                          <MenuItem value={2} primaryText="Bifurcation" />
                        </SelectField>
                      </Col>

                      {cruProperty.reasonForCreation == 2 && (
                        <Col xs={12} md={3} sm={6}>
                          <TextField
                            floatingLabelText="Parent UPIC No."
                            errorText={
                              fieldErrors.parentUpicNo ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.parentUpicNo}</span> : ''
                            }
                            value={cruProperty.parentUpicNo ? cruProperty.parentUpicNo : ''}
                            onChange={e => {
                              handleChange(e, 'parentUpicNo', true, '');
                            }}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineFocusStyle}
                            id="upicNumber"
                          />
                        </Col>
                      )}
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Property Type"
                          errorText={
                            fieldErrors.assessmentPropertyType ? (
                              <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.assessmentPropertyType}</span>
                            ) : (
                              ''
                            )
                          }
                          value={cruProperty.assessmentPropertyType ? cruProperty.assessmentPropertyType : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'assessmentPropertyType', true, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          {renderOption(this.state.propertytypes)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Property Sub-type"
                          errorText={
                            fieldErrors.assessmentPropertySubType ? (
                              <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.assessmentPropertySubType}</span>
                            ) : (
                              ''
                            )
                          }
                          value={cruProperty.assessmentPropertySubType ? cruProperty.assessmentPropertySubType : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'assessmentPropertySubType', true, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          <MenuItem value={1} primaryText="Options" />
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Assessment Department"
                          errorText={
                            fieldErrors.assessmentDepartment ? (
                              <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.assessmentDepartment}</span>
                            ) : (
                              ''
                            )
                          }
                          value={cruProperty.assessmentDepartment ? cruProperty.assessmentDepartment : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'assessmentDepartment', false, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          <MenuItem value={1} primaryText="Options" />
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <TextField
                          floatingLabelText="Extent of Site (Sq. Mtrs)"
                          errorText={
                            fieldErrors.extentOfSite ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.extentOfSite}</span> : ''
                          }
                          value={cruProperty.extentOfSite ? cruProperty.extentOfSite : ''}
                          onChange={e => {
                            handleChange(e, 'extentOfSite', true, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        />
                      </Col>
                    </Row>
                  </Grid>
                </CardText>
              </Card>
            </CardText>
          </Card>
          <Card>
            <CardHeader style={styles.reducePadding} title={<strong style={{ color: brown500 }}>Construction Types</strong>} />
            <CardText style={styles.reducePadding}>
              <Card>
                <CardText style={styles.noPadding}>
                  <Grid fluid>
                    <Row>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Floor Type"
                          errorText={fieldErrors.floorType ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.floorType}</span> : ''}
                          value={cruProperty.floorType ? cruProperty.floorType : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'floorType', true, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          {renderOption(this.state.floortypes)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Roof Type"
                          errorText={fieldErrors.roofType ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.roofType}</span> : ''}
                          value={cruProperty.roofType ? cruProperty.roofType : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'roofType', true, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          {renderOption(this.state.rooftypes)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Wall Type"
                          errorText={fieldErrors.wallType ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.wallType}</span> : ''}
                          value={cruProperty.wallType ? cruProperty.wallType : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'wallType', false, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          {renderOption(this.state.walltypes)}
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Wood Type"
                          errorText={fieldErrors.woodType ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.woodType}</span> : ''}
                          value={cruProperty.woodType ? cruProperty.woodType : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'woodType', false, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          {renderOption(this.state.woodtypes)}
                        </SelectField>
                      </Col>
                    </Row>
                  </Grid>
                </CardText>
              </Card>
            </CardText>
          </Card>
          <Card>
            <CardHeader style={styles.reducePadding} title={<strong style={{ color: brown500 }}>Floor Details</strong>} />
            <CardText style={styles.reducePadding}>
              <Card>
                <CardText style={styles.reducePadding}>
                  <Grid fluid>
                    <Row>
                      <Col xs={12}>
                        <FloatingActionButton
                          mini={true}
                          className="pull-right"
                          onClick={() => {
                            this.setState((prevState, props) => ({
                              addFloor: !prevState.addFloor,
                            }));
                            this.props.resetObject('floor');
                            this.props.resetObject('owner');
                            isEditIndex(-1);
                          }}
                        >
                          <i className="material-icons" style={styles.iconFont}>
                            {!this.state.addFloor ? 'add_box' : 'remove_circle'}
                          </i>
                        </FloatingActionButton>
                        <br />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} md={12}>
                        <Row>
                          <Table
                            id="cruPropertyTable"
                            style={{
                              color: 'black',
                              fontWeight: 'normal',
                              marginBottom: 0,
                            }}
                            bordered
                            responsive
                          >
                            <thead
                              style={{
                                backgroundColor: '#f2851f',
                                color: 'white',
                              }}
                            >
                              <tr>
                                <th>#</th>
                                <th>Floor Number</th>
                                <th>Construction Type</th>
                                <th>Usage Type</th>
                                <th>Usage Sub Type</th>
                                <th>Firm Name</th>
                                <th>Occupancy</th>
                                <th>Occupant Name</th>
                                <th>Annual Rent</th>
                                <th>Manual ARV</th>
                                <th>Construction Date</th>
                                <th>Effective From Date</th>
                                <th>Unstructured land</th>
                                <th>Length</th>
                                <th>Breadth</th>
                                <th>Plinth Area</th>
                                <th>Occupancy Certificate Number</th>
                                <th>Building Permission Number</th>
                                <th>Building Permission Date</th>
                                <th>Plinth Area In Building Plan</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cruProperty.floors &&
                                cruProperty.floors.map(function(i, index) {
                                  if (i) {
                                    return (
                                      <tr key={index}>
                                        <td>{index}</td>
                                        <td>{i.floorNo}</td>
                                        <td>{i.constructionType}</td>
                                        <td>{i.usageType}</td>
                                        <td>{i.usageSubType}</td>
                                        <td>{i.firmName}</td>
                                        <td>{i.occupancy}</td>
                                        <td>{i.occupantName}</td>
                                        <td>{i.annualRent}</td>
                                        <td>{i.manualArv}</td>
                                        <td>{i.constructionDate}</td>
                                        <td>{i.effectiveDate}</td>
                                        <td>{i.unstructuredLand}</td>
                                        <td>{i.length}</td>
                                        <td>{i.breadth}</td>
                                        <td>{i.plinthArea}</td>
                                        <td>{i.occupancyCertiNumber}</td>
                                        <td>{i.buildingPermissionNo}</td>
                                        <td>{i.buildingPermissionDate}</td>
                                        <td>{i.plinthAreaBuildingPlan}</td>
                                        <td>
                                          <FloatingActionButton
                                            mini={true}
                                            style={styles.floatButtonMargin}
                                            onClick={() => {
                                              editObject('floor', i);
                                              isEditIndex(index);
                                            }}
                                          >
                                            <i className="material-icons">mode_edit</i>
                                          </FloatingActionButton>
                                          <FloatingActionButton
                                            mini={true}
                                            style={styles.floatButtonMargin}
                                            onClick={() => {
                                              deleteObject('floors', index);
                                              isEditIndex(-1);
                                            }}
                                          >
                                            <i className="material-icons">delete</i>
                                          </FloatingActionButton>
                                        </td>
                                      </tr>
                                    );
                                  }
                                })}
                            </tbody>
                          </Table>

                          <Table
                            id="cruPropertyTable"
                            style={{
                              color: 'black',
                              fontWeight: 'normal',
                              marginBottom: 0,
                            }}
                            bordered
                            responsive
                          >
                            <thead
                              style={{
                                backgroundColor: '#f2851f',
                                color: 'white',
                              }}
                            >
                              <tr>
                                <th>#</th>
                                <th>Unit Number</th>
                                <th>Unit Type</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cruProperty.floor &&
                                cruProperty.floor.units &&
                                cruProperty.floor.units.map(function(i, index) {
                                  if (i) {
                                    return (
                                      <tr key={index}>
                                        <td>{index}</td>
                                        <td>{i.unitNo}</td>
                                        <td>{i.unitType}</td>
                                        <td>
                                          <FloatingActionButton
                                            mini={true}
                                            style={styles.floatButtonMargin}
                                            onClick={() => {
                                              cThis.setState({
                                                addFloor: true,
                                              });
                                              editObject('unit', i);
                                              isEditIndex(index);
                                            }}
                                          >
                                            <i className="material-icons" style={styles.iconFont}>
                                              mode_edit
                                            </i>
                                          </FloatingActionButton>
                                          <FloatingActionButton
                                            mini={true}
                                            style={styles.floatButtonMargin}
                                            onClick={() => {
                                              deleteNestedObject('floor', 'units', index);
                                              isEditIndex(-1);
                                            }}
                                          >
                                            <i className="material-icons">delete</i>
                                          </FloatingActionButton>
                                        </td>
                                      </tr>
                                    );
                                  }
                                })}
                            </tbody>
                          </Table>
                        </Row>
                      </Col>
                    </Row>
                    {this.state.addFloor && floorForm()}
                  </Grid>
                </CardText>
              </Card>
            </CardText>
          </Card>
          {false && (
            <Card>
              <CardHeader style={styles.reducePadding} title={<strong style={{ color: brown500 }}>Document Upload</strong>} />
              <CardText style={styles.reducePadding}>
                <Card>
                  <CardText style={styles.noPadding}>
                    <Grid fluid>
                      <Row>
                        <Col xs={12} md={12}>
                          <Row>
                            <FlatButton label="Choose Document" labelPosition="before" style={styles.uploadButton} containerElement="label">
                              <Upload onFileLoad={this.onFileLoad} style={styles.uploadInput} />
                            </FlatButton>
                          </Row>
                        </Col>
                      </Row>
                    </Grid>
                  </CardText>
                </Card>
              </CardText>
            </Card>
          )}
          <Card>
            <CardHeader style={styles.reducePadding} title={<strong style={{ color: brown500 }}>Workflow</strong>} />
            <CardText style={styles.reducePadding}>
              <Card>
                <CardText style={styles.noPadding}>
                  <Grid fluid>
                    <Row>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Department Name"
                          errorText={
                            fieldErrors.workflowDepartment ? (
                              <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.workflowDepartment}</span>
                            ) : (
                              ''
                            )
                          }
                          value={cruProperty.workflowDepartment ? cruProperty.workflowDepartment : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'workflowDepartment', false, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          <MenuItem value={4} primaryText="Options" />
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Designation Name"
                          errorText={
                            fieldErrors.workflowDesignation ? (
                              <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.workflowDesignation}</span>
                            ) : (
                              ''
                            )
                          }
                          value={cruProperty.workflowDesignation ? cruProperty.workflowDesignation : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'workflowDesignation', false, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          <MenuItem value={4} primaryText="Options" />
                        </SelectField>
                      </Col>
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          floatingLabelText="Approver Name"
                          errorText={
                            fieldErrors.approverName ? <span style={{ position: 'absolute', bottom: -11 }}>{fieldErrors.approverName}</span> : ''
                          }
                          value={cruProperty.approverName ? cruProperty.approverName : ''}
                          onChange={(event, index, value) => {
                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChange(e, 'approverName', false, '');
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                        >
                          <MenuItem value={4} primaryText="Options" />
                        </SelectField>
                      </Col>
                    </Row>
                  </Grid>
                </CardText>
              </Card>
            </CardText>
          </Card>
          <Card>
            <CardText style={{ textAlign: 'center' }}>
              <RaisedButton
                type="button"
                label="Create Property"
                backgroundColor={brown500}
                labelColor={white}
                onClick={() => {
                  createProperty();
                }}
              />
            </CardText>
          </Card>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cruProperty: state.form.form,
  fieldErrors: state.form.fieldErrors,
  editIndex: state.form.editIndex,
  addRoom: state.form.addRoom,
});

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
});

export default connect(mapStateToProps, mapDispatchToProps)(CruProperty);
