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
import { translate } from '../../../common/common';
import Api from '../../../../api/api';

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

class AddDemand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taxHeads: [],
      taxPeriod: [],
      demands: [],
      hasError: false,
      errorMsg: 'Invalid',
    };
  }

  componentDidMount() {
    //call boundary service fetch wards,location,zone data
    var currentThis = this;

    let { toggleSnackbarAndSetText, initForm, setLoadingStatus } = this.props;

    initForm();

    var getDemands = {
      upicNumber: this.props.match.params.upicNumber,
    };

    setLoadingStatus('loading');

    Api.commonApiPost('pt-property/properties/_preparedcb', getDemands, {}, false, true)
      .then(res => {
        console.log('search', res);

        currentThis.setState({
          demands: res.Demands,
        });

        res.Demands.map((demand, index) => {
          let periodQuery = {
            fromDate: demand.taxPeriodFrom,
            toDate: demand.taxPeriodTo,
            service: 'PT',
          };

          Api.commonApiPost('/billing-service/taxperiods/_search', periodQuery, {}, false, true)
            .then(res => {
              setLoadingStatus('hide');
              currentThis.setState({
                taxPeriod: [...currentThis.state.taxPeriod, res.TaxPeriods[0]],
              });
            })
            .catch(err => {
              setLoadingStatus('hide');
              toggleSnackbarAndSetText(true, err.message);
              console.log(err);
            });
        });

        res.Demands[0].demandDetails.map((item, i) => {
          setLoadingStatus('loading');
          var query = {
            service: 'PT',
            code: item.taxHeadMasterCode,
          };

          Api.commonApiPost('/billing-service/taxheads/_search', query, {}, false, true)
            .then(res => {
              setLoadingStatus('hide');
              currentThis.setState({
                taxHeads: [...currentThis.state.taxHeads, res.TaxHeadMasters[0]],
              });
            })
            .catch(err => {
              console.log(err);
              setLoadingStatus('hide');
              toggleSnackbarAndSetText(true, err.message);
            });
        });
      })
      .catch(err => {
        console.log(err);
        setLoadingStatus('hide');
        toggleSnackbarAndSetText(true, err.message);
      });
  }

  getTaxHeads = taxHead => {};

  submitDemand = () => {
    var data = this.state.demands.slice();

    let { addDemand, setLoadingStatus } = this.props;
    setLoadingStatus('loading');
    let current = this;

    for (var key in addDemand) {
      for (var demand in addDemand[key]) {
        if (key.match('demand') && (addDemand[key][demand] == null || addDemand[key][demand] == '' || addDemand[key][demand] == 0)) {
          delete addDemand[key][demand];
        }
        if (key.match('collection') && (addDemand[key][demand] == null || addDemand[key][demand] == '')) {
          addDemand[key][demand] = 0;
        }
      }
      if (Object.keys(addDemand[key]).length === 0 && addDemand[key].constructor === Object) {
        delete addDemand[key];
      }
    }

    data.map((demand, index) => {
      if (addDemand.hasOwnProperty('demands' + index)) {
        demand.businessService = 'PT';
        demand.demandDetails.map((item, i) => {
          if (addDemand['demands' + index].hasOwnProperty('demand' + i)) {
            item.taxAmount = addDemand['demands' + index]['demand' + i];
            item.collectionAmount = addDemand['collections' + index]['collection' + i];
          } else {
            delete data[index].demandDetails[i];
          }
        });
      } else {
        delete data[index];
      }
    });

    data = data.filter(function(element) {
      return element !== undefined;
    });

    for (var i = 0; i < data.length; i++) {
      data[i].demandDetails = data[i].demandDetails.filter(function(element) {
        return element !== undefined;
      });
    }

    var body = {
      Demands: data,
    };

    Api.commonApiPost('billing-service/demand/_update', {}, body, false, true)
      .then(res => {
        setLoadingStatus('hide');
        current.props.history.replace('/propertyTax/demand-acknowledgement');
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const renderOption = function(list, listName = '') {
      if (list) {
        return list.map(item => {
          return <MenuItem key={item.id} value={item.code} primaryText={item.name} />;
        });
      }
    };

    let {
      addDemand,
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
      addDepandencyFields,
      removeDepandencyFields,
      hasDemandError,
      validateCollection,
    } = this.props;

    let { search, handleDepartment, getTaxHead } = this;

    let cThis = this;

    const showfields = () => {
      if (this.state.demands.length != 0) {
        return this.state.demands.map((demand, index) => {
          return (
            <tr key={index}>
              <td className="lastTdBorder">
                <div style={{ width: '50px' }}>
                  {this.state.taxPeriod.length != 0 &&
                    this.state.taxPeriod.map((code, index) => {
                      if (demand.taxPeriodFrom == code.fromDate && demand.taxPeriodTo == code.toDate) {
                        return <span>{code.code}</span>;
                      }
                    })}
                </div>
              </td>
              {demand.demandDetails.map((detail, i) => {
                if (!addDemand.hasOwnProperty('demands' + index)) {
                  var e = {
                    target: {
                      value: detail.taxAmount,
                    },
                  };
                  handleChangeNextOne(e, 'demands' + index, 'demand' + i, false, '');
                }

                if (demand.demandDetails.length - 1 == i) {
                  return (
                    <td key={i} className="lastTdBorder">
                      <div style={{ width: '50px' }}>
                        <TextField
                          className="fullWidth"
                          floatingLabelText={<span style={{ fontSize: '14px' }}>{translate('pt.create.groups.addDemand.demand')}</span>}
                          type="text"
                          value={(addDemand['demands' + index] ? addDemand['demands' + index]['demand' + i] : detail.taxAmount) || ''}
                          onChange={e => {
                            if (e.target.value && !/^\d*$/g.test(e.target.value)) return;
                            handleChangeNextOne(e, 'demands' + index, 'demand' + i, false, '');
                            validateCollection();
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                          floatingLabelFixed={true}
                          floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                        />
                      </div>
                    </td>
                  );
                } else {
                  return (
                    <td key={i}>
                      <div style={{ width: '50px' }}>
                        <TextField
                          className="fullWidth"
                          floatingLabelText={<span style={{ fontSize: '14px' }}>{translate('pt.create.groups.addDemand.demand')}</span>}
                          type="text"
                          value={(addDemand['demands' + index] ? addDemand['demands' + index]['demand' + i] : detail.taxAmount) || ''}
                          onChange={e => {
                            if (e.target.value && !/^\d*$/g.test(e.target.value)) return;
                            handleChangeNextOne(e, 'demands' + index, 'demand' + i, false, '');
                            validateCollection();
                          }}
                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          floatingLabelFixed={true}
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle}
                          floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                        />
                      </div>
                    </td>
                  );
                }
              })}
              {demand.demandDetails.map((detail, i) => {
                if (!addDemand.hasOwnProperty('collections' + index)) {
                  var e = {
                    target: {
                      value: detail.collectionAmount,
                    },
                  };
                  handleChangeNextOne(e, 'collections' + index, 'collection' + i, false, '');
                }
                return (
                  <td key={i}>
                    <div style={{ width: '50px' }}>
                      <TextField
                        className="fullWidth"
                        floatingLabelText={<span style={{ fontSize: '14px' }}>{translate('pt.create.groups.addDemand.collection')}</span>}
                        value={addDemand['collections' + index] ? addDemand['collections' + index]['collection' + i] : ''}
                        type="text"
                        onChange={e => {
                          if (e.target.value && !/^\d*$/g.test(e.target.value)) return;
                          handleChangeNextOne(e, 'collections' + index, 'collection' + i, false, '');
                          validateCollection();
                        }}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        floatingLabelFixed={true}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        floatingLabelStyle={{ color: 'rgba(0,0,0,0.5)' }}
                      />
                    </div>
                  </td>
                );
              })}
            </tr>
          );
        });
      }
    };

    const showSubHeading = () => {
      if (this.state.demands.length != 0) {
        return this.state.demands[0].demandDetails.map((detail, index) => {
          if (this.state.demands[0].demandDetails.length - 1 == index) {
            return (
              <td key={index} className="lastTdBorder">
                <div style={{ width: '50px' }}>
                  {cThis.state.taxHeads.length != 0 &&
                    cThis.state.taxHeads.map((e, i) => {
                      if (e.code == detail.taxHeadMasterCode) {
                        return (
                          <span key={i} style={{ fontWeight: 500 }}>
                            {e.name ? e.name : 'NA'}
                          </span>
                        );
                      }
                    })}
                </div>
              </td>
            );
          } else {
            return (
              <td key={index}>
                <div style={{ width: '50px' }}>
                  {cThis.state.taxHeads.length != 0 &&
                    cThis.state.taxHeads.map((e, i) => {
                      if (e.code == detail.taxHeadMasterCode) {
                        return (
                          <span key={i} style={{ fontWeight: 500 }}>
                            {e.name ? e.name : 'NA'}
                          </span>
                        );
                      }
                    })}
                </div>
              </td>
            );
          }
        });
      }
    };

    return (
      <div>
        <Card className="uiCard">
          <CardHeader
            style={styles.reducePadding}
            title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('pt.create.demands.addDemand')}</div>}
          />
          <CardText style={styles.reducePadding}>
            <Grid fluid>
              <Row>
                <Col xs={12}>
                  <h5>
                    Assessment Number : <span style={{ fontWeight: 400 }}>{this.props.match.params.upicNumber}</span>
                  </h5>
                  <br />
                  <Table
                    style={{
                      color: 'black',
                      fontWeight: 'normal',
                      marginBottom: 0,
                      minWidth: '100%',
                      width: 'auto',
                    }}
                    bordered
                    responsive
                  >
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center' }}>{translate('pt.create.groups.addDemand.period')}</th>
                        <th
                          colSpan={
                            this.state.demands.length != 0 &&
                            this.state.demands[0].hasOwnProperty('demandDetails') &&
                            this.state.demands[0].demandDetails.length
                          }
                          style={{ textAlign: 'center' }}
                        >
                          {translate('pt.create.groups.addDemand.demand')}
                        </th>
                        <th
                          colSpan={
                            this.state.demands.length != 0 &&
                            this.state.demands[0].hasOwnProperty('demandDetails') &&
                            this.state.demands[0].demandDetails.length
                          }
                          style={{ textAlign: 'center' }}
                        >
                          {translate('pt.create.groups.addDemand.collection')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td width="100" className="lastTdBorder" />
                        {showSubHeading()}
                        {showSubHeading()}
                      </tr>
                      {showfields()}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Grid>
          </CardText>
        </Card>
        <div style={{ textAlign: 'center' }}>
          <br />
          {hasDemandError && (
            <p style={{ color: 'Red', textAlign: 'center' }}>
              {translate('pt.create.groups.addDemand.demandError')}
              <br />
            </p>
          )}
          <RaisedButton
            type="button"
            label={translate('pgr.lbl.update')}
            disabled={hasDemandError}
            primary={true}
            onClick={() => {
              this.submitDemand();
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  addDemand: state.form.form,
  fieldErrors: state.form.fieldErrors,
  editIndex: state.form.editIndex,
  addRoom: state.form.addRoom,
  hasDemandError: state.form.hasDemandError,
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

  validateCollection: () => {
    dispatch({
      type: 'VALIDATE_COLLECTION',
    });
  },

  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddDemand);
