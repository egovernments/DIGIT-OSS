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
import { translate } from '../../../../common/common';
import Dialog from 'material-ui/Dialog';
import Api from '../../../../../api/api';

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

const getNameById = (object, code, property = '') => {
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

var totalFloors = [];

var temp = [];

class FloorDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unitType: [{ code: -1, name: 'None' }, { code: 'FLAT', name: 'Flat' }, { code: 'ROOM', name: 'Room' }],
      floorNumber: [
        { code: -1, name: 'None' },
        { code: 1, name: 'Basement-3' },
        { code: 2, name: 'Basement-2' },
        { code: 3, name: 'Basement-1' },
        { code: 4, name: 'Ground Floor' },
      ],
      rooms: [],
      structureclasses: [],
      occupancies: [],
      usages: [],
      subUsage: [],
      hasLengthWidth: false,
      roomInFlat: [{ code: 1, name: 'Yes' }, { code: 2, name: 'No' }],
      newFloorError: false,
      negativeValue: false,
      occupantNames: [],
      dialogOpen: false,
    };
  }

  componentDidMount() {
    //call boundary service fetch wards,location,zone data
    var currentThis = this;
    this.props.initForm();

    Api.commonApiPost('pt-property/property/structureclasses/_search')
      .then(res => {
        console.log(res);
        res.structureClasses.unshift({ code: -1, name: 'None' });
        currentThis.setState({ structureclasses: res.structureClasses });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('pt-property/property/occuapancies/_search')
      .then(res => {
        console.log(res);
        res.occuapancyMasters.unshift({ code: -1, name: 'None' });
        currentThis.setState({ occupancies: res.occuapancyMasters });
      })
      .catch(err => {
        console.log(err);
      });

    Api.commonApiPost('pt-property/property/usages/_search')
      .then(res => {
        console.log(res);
        res.usageMasters.unshift({ code: -1, name: 'None' });
        currentThis.setState({ usages: res.usageMasters });
      })
      .catch(err => {
        console.log(err);
      });

    var temp = this.state.floorNumber;

    for (var i = 5; i <= 34; i++) {
      var label = 'th';
      if (i - 4 == 1) {
        label = 'st';
      } else if (i - 4 == 2) {
        label = 'nd';
      } else if (i - 4 == 3) {
        label = 'rd';
      }
      var commonFloors = {
        code: i,
        name: i - 4 + label + ' Floor',
      };
      temp.push(commonFloors);
    }

    this.setState({
      floorNumber: temp,
    });

    this.createFloorObject();
  }

  createFloorObject = () => {
    let { floorDetails } = this.props;

    floorDetails.floorsArr = [];

    var allRooms = floorDetails.floors;

    if (!allRooms) {
      return false;
    }

    for (var i = 0; i < allRooms.length; i++) {
      for (var key in allRooms[i]) {
        if (allRooms[i].hasOwnProperty(key) && allRooms[i][key] == '') {
          delete allRooms[i][key];
        }
      }

      allRooms = allRooms.filter((item, index, array) => {
        return item != undefined;
      });
    }

    if (allRooms) {
      for (var i = 0; i < allRooms.length; i++) {
        if (!allRooms[i].hasOwnProperty('isAuthorised')) {
          allRooms[i].isAuthorised = true;
        }
        if (allRooms[i].isStructured == 'YES') {
          allRooms[i].isStructured = true;
        } else {
          allRooms[i].isStructured = false;
        }
      }
    }

    var rooms = allRooms.filter(function(item, index, array) {
      if (!item.hasOwnProperty('flatNo')) {
        return item;
      }
    });

    rooms.map((item, index) => {
      var floor = {
        floorNo: '',
        units: [],
      };
      floor.floorNo = item.floorNo;
      floor.units.push(item);
      floorDetails.floorsArr.push(floor);
    });

    var flats = allRooms.filter(function(item, index, array) {
      if (item.hasOwnProperty('flatNo')) {
        return item;
      }
    });

    var flatNos = flats.map(function(item, index, array) {
      return item.flatNo;
    });

    flatNos = flatNos.filter(function(item, index, array) {
      return index == array.indexOf(item);
    });

    var floorNos = flats.map(function(item, index, array) {
      return item.floorNo;
    });

    floorNos = floorNos.filter(function(item, index, array) {
      return index == array.indexOf(item);
    });

    var flatsArray = [];

    for (var i = 0; i < flatNos.length; i++) {
      var local = {
        units: [],
      };
      for (var j = 0; j < flats.length; j++) {
        if (flats[j].flatNo == flatNos[i]) {
          local.units.push(flats[j]);
        }
      }
      flatsArray.push(local);
    }

    var finalFloors = [];
    for (let j = 0; j < floorNos.length; j++) {
      var local = {
        flats: [],
      };
      for (let k = 0; k < flatsArray.length; k++) {
        for (let l = 0; l < flatsArray[k].units.length; l++) {
          if (flatsArray[k].units[l].floorNo == floorNos[j]) {
            for (let m = 0; m < flatNos.length; m++) {
              if (flatNos[m] == flatsArray[k].units[l].flatNo) {
                local.flats.push(flatsArray[k].units[l]);
              }
            }
          }
        }
      }
      finalFloors.push(local);
    }

    var finalFlats = [];

    for (let x = 0; x < finalFloors.length; x++) {
      var temp = finalFloors[x].flats;
      for (var i = 0; i < finalFloors[x].flats.length; i++) {
        var local = {
          units: [],
        };
        for (var j = 0; j < temp.length; j++) {
          if (temp[j].flatNo == finalFloors[x].flats[i].flatNo) {
            local.units.push(temp[j]);
          }
        }
        finalFlats.push(local);
      }
    }

    finalFlats = finalFlats.map((item, index) => {
      return JSON.stringify(item);
    });

    finalFlats = finalFlats.filter((item, index, array) => {
      return index == array.indexOf(item);
    });

    finalFlats = finalFlats.map((item, index) => {
      return JSON.parse(item);
    });

    finalFlats.map((item, index) => {
      let floor = {
        floorNo: '',
        units: [],
      };

      item.unitNo = item.units[0].unitNo;
      item.unitType = item.units[0].unitType;
      item.assessableArea = item.units[0].assessableArea;
      item.usage = item.units[0].usage;
      item.occupancyDate = item.units[0].occupancyDate;
      item.structure = item.units[0].structure;
      item.builtupArea = item.units[0].builtupArea;
      item.occupancyType = item.units[0].occupancyType;

      floor.floorNo = item.units[0].floorNo;
      floor.units.push(item);
      floorDetails.floorsArr.push(floor);
    });
  };

  formatDate(date) {
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;

    return day + '/' + month + '/' + date.getFullYear();
  }

  getSmallestDate = DateArray => {
    let { handleChange } = this.props;

    var SmallestDate = new Date(DateArray[0]);

    for (var i = 1; i < DateArray.length; i++) {
      var TempDate = new Date(DateArray[i]);
      if (TempDate < SmallestDate) SmallestDate = TempDate;
    }

    var date = new Date(SmallestDate).getDate() < 10 ? '0' + new Date(SmallestDate).getDate() : new Date(SmallestDate).getDate();
    var month = new Date(SmallestDate).getMonth() + 1 < 10 ? '0' + (new Date(SmallestDate).getMonth() + 1) : new Date(SmallestDate).getMonth() + 1;

    var e = {
      target: {
        value: date + '/' + month + '/' + new Date(SmallestDate).getFullYear(),
      },
    };

    handleChange(e, 'occupancyDate', false, '');
    return SmallestDate;
  };

  componentDidUpdate() {}

  calcArea = (e, type) => {
    let { floorDetails, handleChangeNextOne, handleChangeFloor } = this.props;

    let f = {
      target: {
        value: '',
      },
    };

    let hasLW = false;

    if (floorDetails.hasOwnProperty('floor')) {
      if (type == 'length' && floorDetails.floor.hasOwnProperty('width')) {
        f.target.value = parseFloat(e.target.value) * parseFloat(floorDetails.floor.width);

        if (!f.target.value) {
          hasLW = false;
        } else {
          hasLW = true;
        }

        handleChangeFloor(f, 'floor', 'builtupArea', true, '');
      } else if (type == 'width' && floorDetails.floor.hasOwnProperty('length')) {
        f.target.value = parseFloat(floorDetails.floor.length) * parseFloat(e.target.value);

        if (!f.target.value) {
          hasLW = false;
        } else {
          hasLW = true;
        }

        handleChangeFloor(f, 'floor', 'builtupArea', true, '');
      }
    }

    this.setState({
      hasLengthWidth: hasLW,
    });
  };

  handleAge = year => {
    let { handleChangeNextOne } = this.props;

    let yr = year.split('/');

    if (yr[2] != undefined && yr[2].length == 4) {
      var query = {
        year: yr[2],
      };

      var currentThis = this;
      Api.commonApiPost('pt-property/property/depreciations/_search', query)
        .then(res => {
          if (res.depreciations.length != 0) {
            let e = {
              target: {
                value: res.depreciations[0].code,
              },
            };
            handleChangeNextOne(e, 'floor', 'age', false, '');
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  calcAssessableArea = (e, type) => {
    let { floorDetails, handleChangeNextOne, handleChangeFloor } = this.props;

    let f = {
      target: {
        value: '',
      },
    };

    if (floorDetails.hasOwnProperty('floor')) {
      if (type == 'exempted' && floorDetails.floor.hasOwnProperty('carpetArea')) {
        if (parseFloat(floorDetails.floor.carpetArea) < parseFloat(e.target.value)) {
          this.setState({
            negativeValue: true,
          });
        } else {
          this.setState({
            negativeValue: false,
          });
          f.target.value = String(parseFloat(floorDetails.floor.carpetArea) - parseFloat(e.target.value));
          handleChangeNextOne(f, 'floor', 'assessableArea', false, '');
        }
      } else if (type == 'carpet') {
        if (floorDetails.floor.hasOwnProperty('exemptionArea')) {
          if (parseFloat(e.target.value) < parseFloat(floorDetails.floor.exemptionArea)) {
            this.setState({
              negativeValue: true,
            });
          } else {
            this.setState({
              negativeValue: false,
            });
            f.target.value = String(parseFloat(e.target.value) - parseFloat(floorDetails.floor.exemptionArea));
            handleChangeNextOne(f, 'floor', 'assessableArea', false, '');
          }
        } else {
          f.target.value = parseFloat(e.target.value);

          handleChangeNextOne(f, 'floor', 'assessableArea', false, '');
        }
      }
    }
  };

  checkFloors = val => {
    let { floorDetails, noOfFloors } = this.props;

    totalFloors = totalFloors.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
    });

    if (noOfFloors === undefined) {
      this.setState({
        newFloorError: true,
      });
      return false;
    } else {
      this.setState({
        newFloorError: false,
      });
    }

    if (noOfFloors == totalFloors.length) {
      var index = totalFloors.indexOf(val);
      console.log(index);
      if (index == -1) {
        this.setState({
          newFloorError: true,
        });
      } else {
        this.setState({
          newFloorError: false,
        });
      }
    }
  };

  getFloors = () => {
    totalFloors = [];
    var alldate = [];
    let { floorDetails, noOfFloors } = this.props;
    var allRooms = floorDetails.floors;

    allRooms.map((item, index) => {
      totalFloors.push(item.floorNo);

      var d = item.occupancyDate.split('/');
      d = d[2] + '-' + d[1] + '-' + d[0];
      alldate.push(d);
    });

    this.getSmallestDate(alldate);
  };

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  setOccupantName = item => {
    temp = [];
    console.log(item);

    var a = item.split(',');

    for (var i = 0; i < a.length; i++) {
      if (temp.indexOf(a[i]) == -1) {
        temp.push(a[i]);
      }
    }

    this.setState({
      occupantNames: temp,
    });

    var e = {
      target: {
        value: temp.toString(),
      },
    };

    this.props.handleChangeNextOne(e, 'floor', 'occupierName', false, /^[a-zA-Z,\s]+$/g);
  };

  deleteOccupantName = index => {
    temp.splice(index, 1);

    this.setState({
      occupantNames: temp,
    });

    var e = {
      target: {
        value: temp.toString(),
      },
    };

    this.props.handleChangeNextOne(e, 'floor', 'occupierName', false, /^[a-zA-Z,\s]+$/g);
  };

  handleUsage = value => {
    let current = this;

    let query = {
      parent: value,
    };

    Api.commonApiPost('pt-property/property/usages/_search', query)
      .then(res => {
        res.usageMasters.unshift({ code: -1, name: 'None' });
        current.setState({ subUsage: res.usageMasters });
      })
      .catch(err => {
        current.setState({ subUsage: [] });
        console.log(err);
      });
  };

  render() {
    var _this = this;

    console.log(this.state.floorNumber);

    const renderOption = function(list, listName = '') {
      if (list) {
        return list.map(item => {
          return <MenuItem key={item.code} value={item.code} primaryText={item.name} />;
        });
      }
    };

    let {
      floorDetails,
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
      toggleDailogAndSetText,
      setLoadingStatus,
      toggleSnackbarAndSetText,
      handleChangeFloor,
      isFloorValid,
      noOfFloors,
      validateDates,
      isDatesValid,
    } = this.props;

    let { calcAssessableArea, handleAge, checkFloors, handleUsage } = this;
    let cThis = this;

    const occupantNames = () => {
      return (
        <div>
          <Col xs={12} md={12}>
            <Row>
              <Col xs={12} md={6}>
                <TextField
                  className="fullWidth"
                  hintText="Mano, Ranjan"
                  floatingLabelFixed={true}
                  floatingLabelText={translate('pt.create.groups.floorDetails.fields.occupantName')}
                  errorText={
                    fieldErrors.floor ? (
                      fieldErrors.floor.occupierName ? (
                        <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.occupierName}</span>
                      ) : (
                        ''
                      )
                    ) : (
                      ''
                    )
                  }
                  value={floorDetails.floor ? floorDetails.floor.occupierName : ''}
                  onChange={e => {
                    handleChangeFloor(e, 'floor', 'occupierName', false, /^[a-zA-Z,\s]+$/g);
                  }}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                />
              </Col>
              <Col xs={12} md={6}>
                <RaisedButton
                  type="button"
                  label={translate('pt.create.groups.propertyAddress.addName')}
                  disabled={floorDetails.floor && floorDetails.floor.occupierName && floorDetails.occupantName != '' ? false : true}
                  primary={true}
                  onClick={() => {
                    this.setOccupantName(floorDetails.floor.occupierName);
                  }}
                />
              </Col>
            </Row>
          </Col>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.occupantNames.length != 0 &&
                this.state.occupantNames.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item}</td>
                      <td>
                        <div
                          className="material-icons"
                          onClick={() => {
                            this.deleteOccupantName(index);
                          }}
                        >
                          delete
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      );
    };

    const showDialog = () => {
      return (
        <Dialog
          title="Occupant Names"
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleDialogClose}
          style={{ height: 'auto' }}
          autoScrollBodyContent={true}
        >
          {occupantNames()}
        </Dialog>
      );
    };

    return (
      <Card className="uiCard">
        {showDialog()}
        <CardHeader
          style={styles.reducePadding}
          title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('pt.create.groups.floorDetails')}</div>}
        />
        <CardText>
          <Grid fluid>
            <Row>
              <Col xs={12} md={12}>
                <Row>
                  <Row>
                    <Col xs={12} md={3} sm={6}>
                      <SelectField
                        className="fullWidth selectOption"
                        floatingLabelFixed={true}
                        floatingLabelText={
                          <span>
                            {translate('pt.create.groups.floorDetails.fields.floorNumber')}
                            <span style={{ color: '#FF0000' }}> *</span>
                          </span>
                        }
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.floorNo ? (
                              <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.floor.floorNo}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.floorNo : ''}
                        dropDownMenuProps={{
                          targetOrigin: {
                            horizontal: 'left',
                            vertical: 'bottom',
                          },
                        }}
                        onChange={(event, index, value) => {
                          value == -1 ? (value = '') : '';
                          var e = {
                            target: {
                              value: value,
                            },
                          };
                          checkFloors(value);
                          handleChangeFloor(e, 'floor', 'floorNo', true, '');
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        id="floorNo"
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      >
                        {renderOption(_this.state.floorNumber)}
                      </SelectField>
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <SelectField
                        className="fullWidth selectOption"
                        floatingLabelText={
                          <span>
                            {translate('pt.create.groups.floorDetails.fields.unitType')}
                            <span style={{ color: '#FF0000' }}> *</span>
                          </span>
                        }
                        floatingLabelFixed={true}
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.unitType ? (
                              <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.floor.unitType}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.unitType : ''}
                        dropDownMenuProps={{
                          targetOrigin: {
                            horizontal: 'left',
                            vertical: 'bottom',
                          },
                        }}
                        onChange={(event, index, value) => {
                          value == -1 ? (value = '') : '';
                          var e = {
                            target: {
                              value: value,
                            },
                          };

                          if (floorDetails.hasOwnProperty('floor')) {
                            floorDetails.floor.electricMeterNo = null;
                            floorDetails.floor.waterMeterNo = null;
                            floorDetails.floor.exemptionReason = null;
                            floorDetails.floor.rentCollected = null;
                          }

                          handleChangeFloor(e, 'floor', 'unitType', true, '');
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        id="unitType"
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      >
                        {renderOption(_this.state.unitType)}
                      </SelectField>
                    </Col>
                    {(floorDetails.floor ? (floorDetails.floor.unitType == 'FLAT' ? true : false) : false) && (
                      <Col xs={12} md={3} sm={6}>
                        <SelectField
                          className="fullWidth selectOption"
                          floatingLabelFixed={true}
                          floatingLabelText={translate('pt.create.groups.floorDetails.fields.isRoomFlat')}
                          errorText={
                            fieldErrors.roomInFlat ? (
                              fieldErrors.floor.roomInFlat ? (
                                <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.floor.roomInFlat}</span>
                              ) : (
                                ''
                              )
                            ) : (
                              ''
                            )
                          }
                          value={floorDetails.floor ? floorDetails.floor.roomInFlat : ''}
                          dropDownMenuProps={{
                            targetOrigin: {
                              horizontal: 'left',
                              vertical: 'bottom',
                            },
                          }}
                          onChange={(event, index, value) => {
                            value == -1 ? (value = '') : '';

                            if (value == 1) {
                              if (floorDetails.floor.hasOwnProperty('flatNo')) {
                                floorDetails.floor.flatNo = '';
                              }
                              this.props.addFloorDepandencyFields('flatNo');
                            } else {
                              this.props.removeFloorDepandencyFields('flatNo');
                              if (floorDetails.floor.hasOwnProperty('flatNo')) {
                                delete floorDetails.floor.flatNo;
                              }
                            }

                            var e = {
                              target: {
                                value: value,
                              },
                            };
                            handleChangeFloor(e, 'floor', 'roomInFlat', false, '');
                            if (value == 2) {
                              this.setState({ addRoom: false });
                            }
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          id="roomInFlat"
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                          floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                        >
                          {renderOption(_this.state.roomInFlat)}
                        </SelectField>
                      </Col>
                    )}
                    {(floorDetails.floor ? (floorDetails.floor.roomInFlat == '1' ? true : false) : false) && (
                      <Col xs={12} md={3} sm={6}>
                        <TextField
                          className="fullWidth"
                          hintText="201"
                          floatingLabelFixed={true}
                          floatingLabelText={
                            <span>
                              {translate('pt.create.groups.floorDetails.fields.flatNo')}
                              <span style={{ color: '#FF0000' }}> *</span>
                            </span>
                          }
                          errorText={
                            fieldErrors.floor ? (
                              fieldErrors.floor.flatNo ? (
                                <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.flatNo}</span>
                              ) : (
                                ''
                              )
                            ) : (
                              ''
                            )
                          }
                          value={floorDetails.floor ? floorDetails.floor.flatNo : ''}
                          onChange={e => {
                            handleChangeFloor(e, 'floor', 'flatNo', true, /^\d+$/g);
                          }}
                          id="flatNo"
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                          maxLength={3}
                          floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                        />
                      </Col>
                    )}
                    <Col xs={12} md={3} sm={6}>
                      <TextField
                        className="fullWidth"
                        floatingLabelText={
                          <span>
                            {translate('pt.create.groups.floorDetails.fields.unitNumber')}
                            <span style={{ color: '#FF0000' }}> *</span>
                          </span>
                        }
                        floatingLabelFixed={true}
                        hintText="102"
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.unitNo ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.unitNo}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.unitNo : ''}
                        onChange={e => {
                          handleChangeFloor(e, 'floor', 'unitNo', true, /^[a-zA-Z0-9]*$/g);
                        }}
                        id="unitNo"
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        maxLength={3}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      />
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <SelectField
                        className="fullWidth selectOption"
                        floatingLabelFixed={true}
                        floatingLabelText={
                          <span>
                            {translate('pt.create.groups.floorDetails.fields.constructionClass')}
                            <span style={{ color: '#FF0000' }}> *</span>
                          </span>
                        }
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.structure ? (
                              <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.floor.structure}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.structure : ''}
                        dropDownMenuProps={{
                          targetOrigin: {
                            horizontal: 'left',
                            vertical: 'bottom',
                          },
                        }}
                        onChange={(event, index, value) => {
                          value == -1 ? (value = '') : '';
                          var e = {
                            target: {
                              value: value,
                            },
                          };
                          handleChangeFloor(e, 'floor', 'structure', true, '');
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        id="structure"
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      >
                        {renderOption(this.state.structureclasses)}
                      </SelectField>
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <SelectField
                        className="fullWidth selectOption"
                        floatingLabelFixed={true}
                        floatingLabelText={
                          <span>
                            {translate('pt.create.groups.floorDetails.fields.usageType')}
                            <span style={{ color: '#FF0000' }}> *</span>
                          </span>
                        }
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.usage ? (
                              <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.floor.usage}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.usage : ''}
                        dropDownMenuProps={{
                          targetOrigin: {
                            horizontal: 'left',
                            vertical: 'bottom',
                          },
                        }}
                        onChange={(event, index, value) => {
                          value == -1 ? (value = '') : '';
                          var e = {
                            target: {
                              value: value,
                            },
                          };
                          handleUsage(e.target.value);
                          handleChangeFloor(e, 'floor', 'usage', true, '');
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        id="floorUsage"
                        underlineFocusStyle={styles.underlineFocusStyle}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      >
                        {renderOption(this.state.usages)}
                      </SelectField>
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <SelectField
                        className="fullWidth selectOption"
                        floatingLabelFixed={true}
                        floatingLabelText={translate('pt.create.groups.floorDetails.fields.usageSubType')}
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.usageSubType ? (
                              <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.floor.usageSubType}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.usageSubType : ''}
                        dropDownMenuProps={{
                          targetOrigin: {
                            horizontal: 'left',
                            vertical: 'bottom',
                          },
                        }}
                        onChange={(event, index, value) => {
                          value == -1 ? (value = '') : '';
                          var e = {
                            target: {
                              value: value,
                            },
                          };
                          handleChangeFloor(e, 'floor', 'usageSubType', false, '');
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        id="floorUsageSubType"
                        underlineFocusStyle={styles.underlineFocusStyle}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      >
                        {renderOption(this.state.subUsage)}
                      </SelectField>
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <TextField
                        className="fullWidth"
                        floatingLabelFixed={true}
                        floatingLabelText={translate('pt.create.groups.floorDetails.fields.firmName')}
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.firmName ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.firmName}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.firmName : ''}
                        onChange={e => {
                          handleChangeFloor(e, 'floor', 'firmName', false, '');
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        id="firmName"
                        underlineFocusStyle={styles.underlineFocusStyle}
                        maxLength={20}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      />
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <SelectField
                        className="fullWidth selectOption"
                        floatingLabelFixed={true}
                        floatingLabelText={
                          <span>
                            {translate('pt.create.groups.floorDetails.fields.occupancy')}
                            <span style={{ color: '#FF0000' }}> *</span>
                          </span>
                        }
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.occupancyType ? (
                              <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.floor.occupancyType}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.occupancyType : ''}
                        dropDownMenuProps={{
                          targetOrigin: {
                            horizontal: 'left',
                            vertical: 'bottom',
                          },
                        }}
                        onChange={(event, index, value) => {
                          value == -1 ? (value = '') : '';
                          var e = {
                            target: {
                              value: value,
                            },
                          };
                          handleChangeFloor(e, 'floor', 'occupancyType', true, '');
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        id="occupancyType"
                        underlineFocusStyle={styles.underlineFocusStyle}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      >
                        {renderOption(this.state.occupancies)}
                      </SelectField>
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <Row>
                        <Col xs={12} md={9}>
                          <TextField
                            className="fullWidth"
                            floatingLabelFixed={true}
                            floatingLabelText={translate('pt.create.groups.floorDetails.fields.occupantName')}
                            errorText={
                              fieldErrors.floor ? (
                                fieldErrors.floor.occupierName ? (
                                  <span
                                    style={{
                                      position: 'absolute',
                                      bottom: -13,
                                    }}
                                  >
                                    {fieldErrors.floor.occupierName}
                                  </span>
                                ) : (
                                  ''
                                )
                              ) : (
                                ''
                              )
                            }
                            value={floorDetails.floor ? floorDetails.floor.occupierName : ''}
                            onChange={e => {
                              handleChangeFloor(e, 'floor', 'occupierName', false, /^[a-zA-Z,\s]+$/g);
                            }}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            underlineStyle={styles.underlineStyle}
                            id="occupierName"
                            underlineFocusStyle={styles.underlineFocusStyle}
                            maxLength={4000}
                            floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                          />
                        </Col>
                        <Col xs={12} md={3}>
                          <FloatingActionButton
                            mini={true}
                            id="addOccupierName"
                            disabled={
                              floorDetails.floor ? (floorDetails.floor.occupierName && floorDetails.floor.occupierName != '' ? false : true) : true
                            }
                            onClick={() => {
                              if (floorDetails.hasOwnProperty('floor') && floorDetails.floor.hasOwnProperty('occupierName')) {
                                this.handleDialogOpen();
                                this.setOccupantName(floorDetails.floor.occupierName);
                              }
                            }}
                            style={{ marginTop: 15 }}
                          >
                            <i className="material-icons">add</i>
                          </FloatingActionButton>
                        </Col>
                      </Row>
                    </Col>
                    {(floorDetails.floor ? !getNameById(this.state.occupancies, floorDetails.floor.occupancyType).match('Owner') : true) && (
                      <Col xs={12} md={3} sm={6}>
                        <TextField
                          className="fullWidth"
                          floatingLabelText={translate('pt.create.groups.floorDetails.fields.annualRent')}
                          hintText="15000"
                          errorText={
                            fieldErrors.floor ? (
                              fieldErrors.floor.annualRent ? (
                                <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.annualRent}</span>
                              ) : (
                                ''
                              )
                            ) : (
                              ''
                            )
                          }
                          value={floorDetails.floor ? floorDetails.floor.annualRent : ''}
                          onChange={e => {
                            handleChangeFloor(e, 'floor', 'annualRent', false, /^\d{1,64}$/g);
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          floatingLabelFixed={true}
                          underlineFocusStyle={styles.underlineFocusStyle}
                          id="annualRent"
                          maxLength={9}
                          floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                        />
                      </Col>
                    )}
                    {window.location.href.match('dataEntry') && (
                      <Col xs={12} md={3} sm={6}>
                        <TextField
                          className="fullWidth"
                          floatingLabelText={translate('pt.create.groups.floorDetails.fields.Arv')}
                          errorText={
                            fieldErrors.floor ? (
                              fieldErrors.floor.arv ? (
                                <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.arv}</span>
                              ) : (
                                ''
                              )
                            ) : (
                              ''
                            )
                          }
                          value={floorDetails.floor ? floorDetails.floor.arv : ''}
                          onChange={e => {
                            handleChangeFloor(e, 'floor', 'arv', false, /^[0-9]*$/g);
                          }}
                          id="arv"
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          floatingLabelFixed={true}
                          underlineFocusStyle={styles.underlineFocusStyle}
                          maxLength={10}
                          floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                        />
                      </Col>
                    )}
                    <Col xs={12} md={3} sm={6}>
                      <TextField
                        className="fullWidth"
                        floatingLabelText={translate('pt.create.groups.floorDetails.fields.manualArv')}
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.manualArv ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.manualArv}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.manualArv : ''}
                        onChange={e => {
                          handleChangeFloor(e, 'floor', 'manualArv', false, /^[0-9]*$/g);
                        }}
                        id="manualArv"
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        floatingLabelFixed={true}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        maxLength={10}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      />
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <TextField
                        className="fullWidth"
                        hintText="dd/mm/yyyy"
                        floatingLabelFixed={true}
                        floatingLabelText={translate('pt.create.groups.floorDetails.fields.constructionStartDate')}
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.constructionStartDate ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.constructionStartDate}</span>
                            ) : isDatesValid.error ? (
                              isDatesValid.type == 'constructionStartDate' ? (
                                <span style={{ position: 'absolute', bottom: -13 }}>This should be less/equal to const. end date</span>
                              ) : (
                                ''
                              )
                            ) : (
                              ''
                            )
                          ) : isDatesValid.error ? (
                            isDatesValid.type == 'constructionStartDate' ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>This should be less/equal to const. end date</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={
                          floorDetails.floor
                            ? floorDetails.floor.constructionStartDate ? floorDetails.floor.constructionStartDate.split(' ')[0] : ''
                            : ''
                        }
                        onChange={(e, value) => {
                          var val = value;
                          if (value.length == 2 && !value.match('/')) {
                            val += '/';
                          } else if (value.length == 5) {
                            var a = value.split('/');
                            if (!a[1].match('/')) {
                              val += '/';
                            }
                          }

                          var e = {
                            target: {
                              value: val,
                            },
                          };
                          handleChangeFloor(
                            e,
                            'floor',
                            'constructionStartDate',
                            false,
                            /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
                          );
                          validateDates(e, 'floor', 'constructionStartDate');
                        }}
                        id="constructionStartDate"
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      />
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <TextField
                        className="fullWidth"
                        hintText="dd/mm/yyyy"
                        floatingLabelFixed={true}
                        floatingLabelText={
                          <span>
                            {translate('pt.create.groups.floorDetails.fields.constructionEndDate')}
                            <span style={{ color: '#FF0000' }}> *</span>
                          </span>
                        }
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.constCompletionDate ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.constCompletionDate}</span>
                            ) : isDatesValid.error ? (
                              isDatesValid.type == 'constCompletionDate' ? (
                                <span style={{ position: 'absolute', bottom: -13 }}>This should be more/equal to const. start date</span>
                              ) : (
                                ''
                              )
                            ) : (
                              ''
                            )
                          ) : isDatesValid.error ? (
                            isDatesValid.type == 'constCompletionDate' ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>This should be more/equal to const start date</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={
                          floorDetails.floor
                            ? floorDetails.floor.constCompletionDate ? floorDetails.floor.constCompletionDate.split(' ')[0] : ''
                            : ''
                        }
                        onChange={(e, value) => {
                          var val = value;
                          if (value.length == 2 && !value.match('/')) {
                            val += '/';
                          } else if (value.length == 5) {
                            var a = value.split('/');
                            if (!a[1].match('/')) {
                              val += '/';
                            }
                          }

                          var e = {
                            target: {
                              value: val,
                            },
                          };
                          handleAge(e.target.value);
                          handleChangeFloor(
                            e,
                            'floor',
                            'constCompletionDate',
                            true,
                            /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
                          );
                          validateDates(e, 'floor', 'constCompletionDate');
                        }}
                        id="constCompletionDate"
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      />
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <TextField
                        className="fullWidth"
                        hintText="dd/mm/yyyy"
                        floatingLabelFixed={true}
                        floatingLabelText={
                          <span>
                            {translate('pt.create.groups.floorDetails.fields.effectiveFromDate')}
                            <span style={{ color: '#FF0000' }}> *</span>
                          </span>
                        }
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.occupancyDate ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.occupancyDate}</span>
                            ) : isDatesValid.error ? (
                              isDatesValid.type == 'occupancyDate' ? (
                                <span style={{ position: 'absolute', bottom: -13 }}>This should be less/equal to const. start date</span>
                              ) : (
                                ''
                              )
                            ) : (
                              ''
                            )
                          ) : isDatesValid.error ? (
                            isDatesValid.type == 'occupancyDate' ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>This should be less/equal to const start date</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? (floorDetails.floor.occupancyDate ? floorDetails.floor.occupancyDate.split(' ')[0] : '') : ''}
                        onChange={(e, value) => {
                          var val = value;
                          if (value.length == 2 && !value.match('/')) {
                            val += '/';
                          } else if (value.length == 5) {
                            var a = value.split('/');
                            if (!a[1].match('/')) {
                              val += '/';
                            }
                          }

                          var e = {
                            target: {
                              value: val,
                            },
                          };
                          handleChangeFloor(
                            e,
                            'floor',
                            'occupancyDate',
                            true,
                            /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
                          );
                          validateDates(e, 'floor', 'occupancyDate');
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        id="occupancyDate"
                        underlineFocusStyle={styles.underlineFocusStyle}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      />
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <SelectField
                        className="fullWidth selectOption"
                        floatingLabelText={
                          <span>
                            {translate('pt.create.groups.floorDetails.fields.unstructuredLand')}
                            <span style={{ color: '#FF0000' }}> *</span>
                          </span>
                        }
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.isStructured ? (
                              <span style={{ position: 'absolute', bottom: -41 }}>{fieldErrors.floor.isStructured}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.isStructured : ''}
                        dropDownMenuProps={{
                          targetOrigin: {
                            horizontal: 'left',
                            vertical: 'bottom',
                          },
                        }}
                        onChange={(event, index, value) => {
                          value == -1 ? (value = '') : '';

                          var e = {
                            target: {
                              value: value,
                            },
                          };
                          handleChangeFloor(e, 'floor', 'isStructured', true, '');
                          var f = {
                            target: {
                              value: '',
                            },
                          };
                          handleChangeFloor(f, 'floor', 'width', false, /^[0-9.]+$/);
                          handleChangeFloor(f, 'floor', 'length', false, /^[0-9.]+$/);
                          handleChangeFloor(f, 'floor', 'builtupArea', true, /^[0-9.]+$/);
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        id="isStructured"
                        underlineStyle={styles.underlineStyle}
                        floatingLabelFixed={true}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      >
                        <MenuItem value={-1} primaryText="None" />
                        <MenuItem value="YES" primaryText="Yes" />
                        <MenuItem value="NO" primaryText="No" />
                      </SelectField>
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <TextField
                        className="fullWidth"
                        floatingLabelText={translate('pt.create.groups.floorDetails.fields.length')}
                        hintText="12.50"
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.length ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.length}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.length : ''}
                        onChange={e => {
                          handleChangeFloor(e, 'floor', 'length', false, /^[0-9.]+$/);
                          cThis.calcArea(e, 'length');
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        id="length"
                        underlineStyle={styles.underlineStyle}
                        floatingLabelFixed={true}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        maxLength={6}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                        disabled={
                          floorDetails.hasOwnProperty('floor') && floorDetails.floor != null
                            ? floorDetails.floor.isStructured == 'YES' ? true : false
                            : false
                        }
                      />
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <TextField
                        className="fullWidth"
                        hintText="15.25"
                        floatingLabelText={translate('pt.create.groups.floorDetails.fields.breadth')}
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.width ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.width}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.width : ''}
                        onChange={e => {
                          handleChangeFloor(e, 'floor', 'width', false, /^[0-9.]+$/);
                          cThis.calcArea(e, 'width');
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        id="width"
                        underlineStyle={styles.underlineStyle}
                        floatingLabelFixed={true}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        maxLength={6}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                        disabled={
                          floorDetails.hasOwnProperty('floor') && floorDetails.floor != null
                            ? floorDetails.floor.isStructured == 'YES' ? true : false
                            : false
                        }
                      />
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <TextField
                        className="fullWidth"
                        floatingLabelText={
                          <span>
                            {translate('pt.create.groups.floorDetails.fields.plinthArea')}
                            <span style={{ color: '#FF0000' }}> *</span>
                          </span>
                        }
                        hintText="27.75"
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.builtupArea ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.builtupArea}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.builtupArea : ''}
                        onChange={e => {
                          handleChangeFloor(e, 'floor', 'builtupArea', true, /^[0-9.]+$/);
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        id="builtupArea"
                        underlineStyle={styles.underlineStyle}
                        floatingLabelFixed={true}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        maxLength={5}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                        disabled={
                          floorDetails.hasOwnProperty('floor') && floorDetails.floor != null
                            ? floorDetails.floor.isStructured == 'NO' ? true : false
                            : false
                        }
                      />
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <TextField
                        className="fullWidth"
                        floatingLabelText={
                          <span>
                            {translate('pt.create.groups.propertyAddress.fields.carpetArea')}
                            <span style={{ color: '#FF0000' }}> *</span>
                          </span>
                        }
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.carpetArea ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.carpetArea}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.carpetArea : ''}
                        onChange={e => {
                          calcAssessableArea(e, 'carpet');
                          handleChangeFloor(e, 'floor', 'carpetArea', true, '');
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        id="carpetArea"
                        underlineStyle={styles.underlineStyle}
                        floatingLabelFixed={true}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        maxLength={5}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      />
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <TextField
                        className="fullWidth"
                        floatingLabelText={translate('pt.create.groups.propertyAddress.fields.exemptedArea')}
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.exemptionArea ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.exemptionArea}</span>
                            ) : this.state.negativeValue ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>{translate('pt.create.groups.propertyAddress.invalidValue')}</span>
                            ) : (
                              ''
                            )
                          ) : this.state.negativeValue ? (
                            <span style={{ position: 'absolute', bottom: -13 }}>{translate('pt.create.groups.propertyAddress.invalidValue')}</span>
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.exemptionArea : ''}
                        onChange={e => {
                          calcAssessableArea(e, 'exempted');
                          handleChangeFloor(e, 'floor', 'exemptionArea', false, /^[0-9]+$/i);
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        id="exemptionArea"
                        underlineStyle={styles.underlineStyle}
                        floatingLabelFixed={true}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        maxLength={5}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      />
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <TextField
                        className="fullWidth"
                        floatingLabelText={translate('pt.create.groups.floorDetails.fields.occupancyCertificateNumber')}
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.occupancyCertiNumber ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.occupancyCertiNumber}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.occupancyCertiNumber : ''}
                        onChange={e => {
                          handleChangeFloor(e, 'floor', 'occupancyCertiNumber', false, /^[0-9,/<>!@#\$%\^\&*\)\(+=._-]+$/g);
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        id="occupancyCertiNumber"
                        underlineStyle={styles.underlineStyle}
                        floatingLabelFixed={true}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        maxLength={10}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      />
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <TextField
                        className="fullWidth"
                        floatingLabelText={translate('pt.create.groups.propertyAddress.fields.buildingCost')}
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.buildingCost ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.buildingCost}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.buildingCost : ''}
                        onChange={e => {
                          handleChangeFloor(e, 'floor', 'buildingCost', false, /^[0-9]+$/i);
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        id="buildingCost"
                        underlineStyle={styles.underlineStyle}
                        floatingLabelFixed={true}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        maxLength={10}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      />
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <TextField
                        className="fullWidth"
                        floatingLabelText={translate('pt.create.groups.propertyAddress.fields.landCost')}
                        errorText={
                          fieldErrors.floor ? (
                            fieldErrors.floor.landCost ? (
                              <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.floor.landCost}</span>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )
                        }
                        value={floorDetails.floor ? floorDetails.floor.landCost : ''}
                        onChange={e => {
                          handleChangeFloor(e, 'floor', 'landCost', false, /^[0-9]+$/i);
                        }}
                        id="landCost"
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        floatingLabelFixed={true}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        maxLength={10}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      />
                    </Col>
                    <Col xs={12} md={3} sm={6}>
                      <Checkbox
                        label={
                          <span>
                            {translate('pt.create.groups.assessmentDetails.fields.isLegal')}
                            <span style={{ color: '#FF0000' }}> *</span>
                          </span>
                        }
                        style={styles.checkbox}
                        defaultChecked={true}
                        onCheck={(e, i, v) => {
                          var e = {
                            target: {
                              value: i,
                            },
                          };
                          handleChangeFloor(e, 'floor', 'isAuthorised', false, '');
                        }}
                        id="isAuthorised"
                      />
                    </Col>
                    <Col xs={12} md={12}>
                      {this.state.negativeValue && (
                        <p style={{ marginTop: 15, color: 'red' }}>{translate('pt.create.groups.propertyAddress.exemptedAreaError')}</p>
                      )}
                      {this.state.newFloorError && (
                        <p style={{ marginTop: 15, color: 'red' }}>{translate('pt.create.groups.propertyAddress.totalFloorsError')}</p>
                      )}
                    </Col>
                    <Col xs={12} md={12} style={{ textAlign: 'right', float: 'right' }}>
                      <br />
                      {(editIndex == -1 || editIndex == undefined) && (
                        <RaisedButton
                          type="button"
                          label={translate('pt.create.groups.propertyAddress.addRoom')}
                          id="addRoom"
                          disabled={!isFloorValid || this.state.newFloorError || this.state.negativeValue || isDatesValid.error}
                          primary={true}
                          onClick={() => {
                            this.props.addNestedFormData('floors', 'floor');

                            this.props.resetObject('floor', false);
                            this.props.resetObject('owner', false);

                            setTimeout(() => {
                              _this.createFloorObject();
                              _this.getFloors();
                            }, 300);
                          }}
                        />
                      )}
                      {editIndex > -1 && (
                        <RaisedButton
                          type="button"
                          label={translate('pt.create.groups.propertyAddress.updateRoom')}
                          id="updateRoom"
                          disabled={!isFloorValid || this.state.newFloorError || this.state.negativeValue || isDatesValid.error}
                          primary={true}
                          onClick={() => {
                            this.props.updateObject('floors', 'floor', editIndex);
                            this.props.resetObject('floor', false);
                            this.props.resetObject('owner', false);

                            isEditIndex(-1);

                            setTimeout(() => {
                              _this.createFloorObject();
                              _this.getFloors();
                            }, 300);
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                  {floorDetails.floors &&
                    floorDetails.floors.length != 0 && (
                      <div className="col-md-12 col-xs-12">
                        {' '}
                        <br />
                        <Table
                          id="floorDetailsTable"
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
                              backgroundColor: '#607b84',
                              color: 'white',
                            }}
                          >
                            <tr>
                              <th>#</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.floorNumber')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.unitType')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.unitNumber')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.constructionClass')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.usageType')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.usageSubType')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.firmName')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.occupancy')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.occupantName')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.annualRent')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.manualArv')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.constructionStartDate')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.constructionEndDate')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.effectiveFromDate')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.unstructuredLand')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.length')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.breadth')}</th>
                              <th>{translate('pt.create.groups.propertyAddress.fields.carpetArea')}</th>
                              <th>{translate('pt.create.groups.propertyAddress.fields.exemptedArea')}</th>
                              <th>{translate('pt.create.groups.propertyAddress.fields.buildingCost')}</th>
                              <th>{translate('pt.create.groups.propertyAddress.fields.landCost')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.plinthArea')}</th>
                              <th>{translate('pt.create.groups.floorDetails.fields.occupancyCertificateNumber')}</th>
                              <th>{translate('pt.create.groups.assessmentDetails.fields.isLegal')}</th>
                              <th style={{ minWidth: 70 }} />
                            </tr>
                          </thead>
                          <tbody>
                            {floorDetails.floors &&
                              floorDetails.floors.map(function(i, index) {
                                if (i) {
                                  return (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>{getNameById(_this.state.floorNumber, i.floorNo) || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>{getNameById(_this.state.unitType, i.unitType) || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>{i.unitNo || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>
                                        {getNameById(_this.state.structureclasses, i.structure) || translate('pt.search.searchProperty.fields.na')}
                                      </td>
                                      <td>{getNameById(_this.state.usages, i.usage) || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>{getNameById(_this.state.subUsage, i.usageSubType) || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>{i.firmName || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>
                                        {getNameById(_this.state.occupancies, i.occupancyType) || translate('pt.search.searchProperty.fields.na')}
                                      </td>
                                      <td>{i.occupierName || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>{i.annualRent || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>{i.manualArv || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>
                                        {i.constructionStartDate
                                          ? i.constructionStartDate.split(' ')[0]
                                          : translate('pt.search.searchProperty.fields.na')}
                                      </td>
                                      <td>
                                        {i.constCompletionDate
                                          ? i.constCompletionDate.split(' ')[0]
                                          : translate('pt.search.searchProperty.fields.na')}
                                      </td>
                                      <td>{i.occupancyDate ? i.occupancyDate.split(' ')[0] : translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>{i.isStructured ? 'Yes' : 'No'}</td>
                                      <td>{i.length || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>{i.width || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>{i.carpetArea || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>{i.exemptionArea || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>{i.buildingCost || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>{i.landCost || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>{i.builtupArea || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>{i.occupancyCertiNumber || translate('pt.search.searchProperty.fields.na')}</td>
                                      <td>{i.isAuthorised ? 'Yes' : 'No'}</td>
                                      <td>
                                        <i
                                          className="material-icons"
                                          style={styles.iconFont}
                                          id="editRoom"
                                          onClick={() => {
                                            if (i.isStructured) {
                                              i.isStructured = 'YES';
                                            } else {
                                              i.isStructured = 'NO';
                                            }
                                            editObject('floor', i, true);
                                            cThis.props.setForm();
                                            toggleSnackbarAndSetText(true, 'Edit room details and update.');
                                            isEditIndex(index);
                                          }}
                                        >
                                          mode_edit
                                        </i>
                                        <i
                                          className="material-icons"
                                          style={styles.iconFont}
                                          id="deleteRoom"
                                          onClick={() => {
                                            deleteObject('floors', index);
                                            isEditIndex(-1);
                                            setTimeout(() => {
                                              _this.createFloorObject();
                                            }, 300);
                                          }}
                                        >
                                          delete
                                        </i>
                                      </td>
                                    </tr>
                                  );
                                }
                              })}
                          </tbody>
                        </Table>
                      </div>
                    )}
                </Row>
              </Col>
            </Row>
          </Grid>
        </CardText>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  floorDetails: state.form.form,
  fieldErrors: state.form.fieldErrors,
  editIndex: state.form.editIndex,
  addRoom: state.form.addRoom,
  isFloorValid: state.form.isFloorValid,
  noOfFloors: state.form.noOfFloors,
  isDatesValid: state.form.isDatesValid,
});

const mapDispatchToProps = dispatch => ({
  initForm: () => {
    dispatch({
      type: 'SET_FLOOR_NUMBER',
      noOfFloors: 0,
      isDatesValid: {
        error: false,
        type: '',
      },
    });
  },

  setForm: () => {
    dispatch({
      type: 'SET_FLOOR_STATE',
      validatePropertyFloor: {
        required: {
          current: [
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

  deleteNestedObject: (property, position, propertyOne, subPosition) => {
    dispatch({
      type: 'DELETE_NESTED_OBJECT',
      property,
      position,
      propertyOne,
      subPosition,
    });
  },

  editObject: (objectName, object, isSectionValid) => {
    dispatch({
      type: 'EDIT_OBJECT',
      objectName,
      object,
      isSectionValid,
    });
  },

  resetObject: (object, isSectionValid) => {
    var ownerRequired = [];
    if (window.location.href.match('dataEntry')) {
      ownerRequired = ['name', 'gender'];
    } else {
      ownerRequired = ['mobileNumber', 'name', 'gender'];
    }
    dispatch({
      type: 'RESET_OBJECT',
      object,
      isSectionValid,
      validatePropertyOwner: {
        required: {
          current: [],
          required: ownerRequired,
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

  updateNestedObject: (property, position, propertyOne, subPosition) => {
    dispatch({
      type: 'UPDATE_NESTED_OBJECT',
      property,
      position,
      propertyOne,
      subPosition,
    });
  },

  isEditIndex: index => {
    dispatch({
      type: 'EDIT_INDEX',
      index,
    });
  },

  addFloorDepandencyFields: property => {
    dispatch({
      type: 'ADD_FLOOR_REQUIRED',
      property,
    });
  },

  removeFloorDepandencyFields: property => {
    dispatch({
      type: 'REMOVE_FLOOR_REQUIRED',
      property,
    });
  },

  validateDates: (e, property, propertyOne) => {
    dispatch({
      type: 'VALIDATE_DATES',
      value: e.target.value,
      property,
      propertyOne,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(FloorDetails);
