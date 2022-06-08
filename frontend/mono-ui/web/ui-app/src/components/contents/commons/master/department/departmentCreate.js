import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Grid, Row } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import { brown500, red500 } from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Api from '../../../../../api/api';
import { translate } from '../../../../common/common';

var flag = 0;
const styles = {
  headerStyle: {
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

class CreateDepartment extends Component {
  submitForm = e => {
    e.preventDefault();

    var current = this;

    var body = {
      Department: {
        id: this.props.CreateDepartment.id,
        name: this.props.CreateDepartment.name,
        code: this.props.CreateDepartment.code,
        active: !this.props.CreateDepartment.active ? false : this.props.CreateDepartment.active,
        tenantId: 'default',
      },
    };
    current.props.setLoadingStatus('loading');
    if (this.props.match.params.id) {
      Api.commonApiPost('/egov-common-masters/departments/v1/_update', {}, body)
        .then(function(response) {
          current.setState({
            open: true,
          });
          current.props.setLoadingStatus('hide');
        })
        .catch(err => {
          current.props.toggleSnackbarAndSetText(true, err.message);
          current.props.setLoadingStatus('hide');
        });
    } else {
      Api.commonApiPost('/egov-common-masters/departments/v1/_create', {}, body)
        .then(function(response) {
          current.props.setLoadingStatus('hide');
          current.setState({
            open: true,
          });
          let { initForm } = current.props;
          initForm();
        })
        .catch(err => {
          current.props.toggleSnackbarAndSetText(true, err.message);
          current.props.setLoadingStatus('hide');
        });
    }
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      data: '',
      open: false,
    };
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      this.setState({
        id: this.props.match.params.id,
      });
      var body = {};
      let current = this;
      let { setForm } = this.props;

      Api.commonApiPost('/pgr-master/receivingcenter/v1/_search', { id: this.props.match.params.id }, body)
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

  componentWillUpdate() {
    if (window.urlCheck) {
      let { initForm } = this.props;
      initForm();
      this.setState({ id: undefined });
      window.urlCheck = false;
    }
  }

  render() {
    let {
      CreateDepartment,
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

    console.log(CreateDepartment);

    return (
      <div className="CreateDepartment">
        <form
          autoComplete="off"
          onSubmit={e => {
            submitForm(e);
          }}
        >
          <Card style={styles.marginStyle}>
            <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}> Create/Update Department</div>} />
            <CardText style={{ padding: 0 }}>
              <Grid>
                <Row>
                  <Col xs={12} md={3} sm={6}>
                    <TextField
                      fullWidth={true}
                      floatingLabelText={translate('core.lbl.add.name') + '*'}
                      value={CreateDepartment.name ? CreateDepartment.name : ''}
                      errorText={fieldErrors.name ? fieldErrors.name : ''}
                      onChange={e => handleChange(e, 'name', true, '')}
                      id="name"
                    />
                  </Col>
                  <Col xs={12} md={3} sm={6}>
                    <TextField
                      fullWidth={true}
                      floatingLabelText={translate('core.lbl.code') + '*'}
                      value={CreateDepartment.code ? CreateDepartment.code : ''}
                      errorText={fieldErrors.code ? fieldErrors.code : ''}
                      onChange={e => handleChange(e, 'code', true, '')}
                      id="code"
                      disabled={this.state.id ? true : false}
                    />
                  </Col>

                  <Col xs={12} md={3} sm={6}>
                    {console.log(CreateDepartment.active)}
                    <Checkbox
                      label={translate('pgr.lbl.active')}
                      style={styles.checkbox}
                      checked={CreateDepartment.active || false}
                      onCheck={(e, i, v) => {
                        console.log(CreateDepartment.active, i);

                        var e = {
                          target: {
                            value: i,
                          },
                        };
                        handleChange(e, 'active', false, '');
                      }}
                      id="active"
                    />
                  </Col>
                </Row>
              </Grid>
            </CardText>
          </Card>
          <div style={{ textAlign: 'center' }}>
            <RaisedButton
              style={{ margin: '15px 5px' }}
              type="submit"
              disabled={!isFormValid}
              label={this.state.id ? translate('pgr.lbl.update') : translate('pgr.lbl.create')}
              primary={true}
            />
          </div>
        </form>
        <Dialog
          title="Data Added Successfully"
          actions={<FlatButton label={translate('core.lbl.close')} primary={true} onTouchTap={this.handleClose} />}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          Data Added Successfully
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    CreateDepartment: state.form.form,
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
          required: ['name', 'code'],
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
          current: ['name', 'code'],
          required: ['name', 'code'],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },

  resetObject: object => {
    console.log(object);
    dispatch({
      type: 'RESET_OBJECT',
      object,
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

  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
  },

  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateDepartment);
