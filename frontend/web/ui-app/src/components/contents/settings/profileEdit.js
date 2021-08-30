import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link, Route } from 'react-router-dom';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import { brown500, red500, white, orange800 } from 'material-ui/styles/colors';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Api from '../../../api/commonAPIS';

var flag = 0;
const styles = {
  headerStyle: {
    color: 'rgb(90, 62, 27)',
    fontSize: 19,
  },
  marginStyle: {
    margin: '15px',
  },
  paddingStyle: {
    padding: '15px',
  },
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
    marginTop: 37,
  },
};

var _this;

class ProfileEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      data: '',
    };
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.setState({ id: this.props.match.params.id });
      var body = {};
      let current = this;
      let { setForm } = this.props;

      Api.commonApiPost('/pgr-master/receivingcenter/_search', { id: this.props.match.params.id }, body)
        .then(function(response) {
          console.log(response);
          current.setState({ data: response.ReceivingCenterType });
          setForm(response.ReceivingCenterType[0]);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      let { initForm } = this.props;
      initForm();
    }
  }

  componentDidMount() {}

  componentDidUpdate() {}

  submitForm = e => {
    e.preventDefault();

    var body = {
      ReceivingCenterType: {
        id: this.props.profileEdit.id,
        name: this.props.profileEdit.name,
        code: this.props.profileEdit.code,
        description: this.props.profileEdit.description,
        active: !this.props.profileEdit.active ? false : this.props.profileEdit.active,
        iscrnrequired: !this.props.profileEdit.iscrnrequired ? false : this.props.profileEdit.iscrnrequired,
        orderno: this.props.profileEdit.orderno,
        tenantId: 'default',
      },
    };

    if (this.props.match.params.id) {
      Api.commonApiPost('/pgr-master/receivingcenter/' + body.ReceivingCenterType.code + '/_update', {}, body)
        .then(function(response) {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      Api.commonApiPost('/pgr-master/receivingcenter/_create', {}, body)
        .then(function(response) {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  render() {
    let {
      profileEdit,
      fieldErrors,
      isFormValid,
      isTableShow,
      handleUpload,
      files,
      handleChange,
      handleMap,
      handleChangeNextOne,
      handleChangeNextTwo,
      buttonText,
    } = this.props;

    let { submitForm } = this;

    console.log(isFormValid);

    return (
      <div className="profileEdit">
        <form
          autoComplete="off"
          onSubmit={e => {
            submitForm(e);
          }}
        >
          <Card style={styles.marginStyle}>
            <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}> Account Details </div>} />
            <CardText style={{ padding: 0 }}>
              <Grid>
                <Row>
                  <Col xs={12} md={2} sm={3}>
                    <SelectField
                      style={styles.customWidth}
                      errorText={fieldErrors.title ? fieldErrors.title : ''}
                      value={profileEdit.title ? profileEdit.title : ''}
                      onChange={(event, index, value) => {
                        var e = {
                          target: {
                            value: value,
                          },
                        };
                        handleChange(e, 'title', false, '');
                      }}
                      floatingLabelText="Title "
                    >
                      <MenuItem value={1} primaryText="Mr" />
                      <MenuItem value={2} primaryText="Mrs" />
                      <MenuItem value={3} primaryText="Miss" />
                    </SelectField>
                  </Col>
                  <Col xs={12} md={6} sm={6}>
                    <TextField
                      fullWidth={true}
                      hintText="Full Name"
                      floatingLabelText="Full Name"
                      value={profileEdit.fullName ? profileEdit.fullName : ''}
                      errorText={fieldErrors.fullName ? fieldErrors.fullName : ''}
                      onChange={e => handleChange(e, 'fullName', true, '')}
                      id="fullName"
                    />
                  </Col>

                  <div className="clearfix" />

                  <Col xs={12} md={3} sm={6}>
                    <label>Gender</label>
                  </Col>

                  <Col xs={12} md={4} sm={6} mdPull={1}>
                    <RadioButtonGroup
                      name="ownerRadio"
                      defaultSelected={profileEdit.gender ? profileEdit.gender : ''}
                      onChange={(e, v) => {
                        var e = {
                          target: {
                            value: v,
                          },
                        };
                        handleChange(e, 'gender', true, '');
                      }}
                    >
                      <RadioButton value="Male" label="Male" style={styles.radioButton} className="col-md-6" />
                      <RadioButton value="Female" label="Female" style={styles.radioButton} className="col-md-6" />
                      <RadioButton value="Others" label="Others" style={styles.radioButton} className="col-md-6" />
                    </RadioButtonGroup>
                  </Col>
                  <div className="clearfix" />
                  <Col xs={12} md={3} sm={6}>
                    <TextField
                      fullWidth={true}
                      floatingLabelText="Mobile"
                      hintText="Mobile Number"
                      value={profileEdit.mobile ? profileEdit.mobile : ''}
                      errorText={fieldErrors.mobile ? fieldErrors.mobile : ''}
                      onChange={e => handleChange(e, 'mobile', true, '')}
                      id="mobile"
                    />
                  </Col>
                  <Col xs={12} md={3} sm={6}>
                    <TextField
                      fullWidth={true}
                      hintText="abc@xyz.com"
                      floatingLabelText="Email"
                      value={profileEdit.email ? profileEdit.email : ''}
                      errorText={fieldErrors.email ? fieldErrors.email : ''}
                      onChange={e => handleChange(e, 'email', true, '')}
                      id="email"
                      disabled={this.state.id ? true : false}
                    />
                  </Col>
                  <Col xs={12} md={3} sm={6}>
                    <TextField
                      fullWidth={true}
                      floatingLabelText="Alternate Contact No."
                      hintText="8080808080"
                      value={profileEdit.altContact ? profileEdit.altContact : ''}
                      errorText={fieldErrors.altContact ? fieldErrors.altContact : ''}
                      onChange={e => handleChange(e, 'altContact', false, '')}
                      multiLine={true}
                      id="altContact"
                    />
                  </Col>

                  <Col xs={12} md={3} sm={6}>
                    <DatePicker
                      floatingLabelText="DOB"
                      hintText="Full Name"
                      errorText={
                        fieldErrors.dob ? fieldErrors.dob ? <span style={{ position: 'absolute', bottom: -13 }}>{fieldErrors.dob}</span> : '' : ''
                      }
                      onChange={(event, date) => {
                        var e = {
                          target: {
                            value: date,
                          },
                        };
                        handleChange(e, 'dob', true, '');
                      }}
                      textFieldStyle={{ width: '100%' }}
                    />
                  </Col>
                  <div className="clearfix" />
                  <Col xs={12} md={3} sm={6}>
                    <TextField
                      fullWidth={true}
                      hintText="123456789012"
                      floatingLabelText="Aadhaar Number"
                      value={profileEdit.adharNumber ? profileEdit.adharNumber : ''}
                      errorText={fieldErrors.adharNumber ? fieldErrors.adharNumber : ''}
                      onChange={e => handleChange(e, 'adharNumber', true, '')}
                      id="adharNumber"
                      disabled={this.state.id ? true : false}
                    />
                  </Col>
                  <Col xs={12} md={3} sm={6}>
                    <TextField
                      fullWidth={true}
                      floatingLabelText="PAN"
                      hintText="AHWPU1117T"
                      value={profileEdit.pan ? profileEdit.pan : ''}
                      errorText={fieldErrors.pan ? fieldErrors.pan : ''}
                      onChange={e => handleChange(e, 'pan', false, '')}
                      multiLine={true}
                      id="pan"
                    />
                  </Col>

                  <Col xs={12} md={3} sm={3}>
                    <SelectField
                      fullWidth={true}
                      errorText={fieldErrors.preferredLanguage ? fieldErrors.preferredLanguage : ''}
                      value={profileEdit.preferredLanguage ? profileEdit.preferredLanguage : ''}
                      onChange={(event, index, value) => {
                        var e = {
                          target: {
                            value: value,
                          },
                        };
                        handleChange(e, 'preferredLanguage', false, '');
                      }}
                      floatingLabelText="Preferred Language "
                    >
                      <MenuItem value={1} primaryText="Hindi" />
                      <MenuItem value={2} primaryText="English" />
                    </SelectField>
                  </Col>
                </Row>
              </Grid>
            </CardText>
          </Card>
          <div style={{ textAlign: 'center' }}>
            <RaisedButton style={{ margin: '15px 5px' }} type="submit" disabled={!isFormValid} label={'Save Changes'} labelColor={white} />
            <RaisedButton style={{ margin: '15px 5px' }} label="Close" />
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    profileEdit: state.form.form,
    files: state.form.files,
    fieldErrors: state.form.fieldErrors,
    isFormValid: state.form.isFormValid,
    isTableShow: state.form.showTable,
    buttonText: state.form.buttonText,
  };
};

const mapDispatchToProps = dispatch => ({
  initForm: () => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: ['fullName', 'code', 'orderno'],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },

  setForm: data => {
    dispatch({
      type: 'SET_FORM',
      data,
      isFormValid: true,
      fieldErrors: {},
      validationData: {
        required: {
          current: ['name', 'code', 'orderno'],
          required: ['name', 'code', 'orderno'],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },

  handleChange: (e, property, isRequired, pattern) => {
    console.log('handlechange' + e + property + isRequired + pattern);
    dispatch({
      type: 'HANDLE_CHANGE',
      property,
      value: e.target.value,
      isRequired,
      pattern,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit);
