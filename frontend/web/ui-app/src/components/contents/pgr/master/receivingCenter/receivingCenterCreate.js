import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Api from '../../../../../api/api';
import styles from '../../../../../styles/material-ui';
import { translate } from '../../../../common/common';

var _this;

class CreateReceivingCenter extends Component {
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
          current.setState({ data: response.ReceivingCenterType });
          setForm(response.ReceivingCenterType[0]);
        })
        .catch(error => {});
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

  submitForm = e => {
    e.preventDefault();
    this.props.setLoadingStatus('loading');
    var current = this;
    let { createReceivingCenter } = this.props;
    var body = {
      ReceivingCenterType: {
        id: this.props.createReceivingCenter.id,
        name: this.props.createReceivingCenter.name,
        code: this.props.createReceivingCenter.code,
        description: this.props.createReceivingCenter.description,
        active: createReceivingCenter.active !== undefined ? createReceivingCenter.active : true,
        iscrnrequired: !this.props.createReceivingCenter.iscrnrequired ? false : this.props.createReceivingCenter.iscrnrequired,
        orderno: this.props.createReceivingCenter.orderno,
        tenantId: localStorage.getItem('tenantId'),
      },
    };
    if (this.props.match.params.id) {
      Api.commonApiPost('/pgr-master/receivingcenter/v1/_update', {}, body)
        .then(function(response) {
          current.setState({
            open: true,
          });
          current.props.setLoadingStatus('hide');
        })
        .catch(err => {
          current.props.setLoadingStatus('hide');
          current.props.toggleSnackbarAndSetText(true, err.message);
        });
    } else {
      Api.commonApiPost('/pgr-master/receivingcenter/v1/_create', {}, body)
        .then(function(response) {
          current.setState({
            open: true,
          });
          let { initForm } = current.props;
          initForm();
          current.props.setLoadingStatus('hide');
        })
        .catch(err => {
          current.props.setLoadingStatus('hide');
          current.props.toggleSnackbarAndSetText(true, err.message);
        });
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    let {
      createReceivingCenter,
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

    return (
      <div className="createReceivingCenter">
        <form
          autoComplete="off"
          onSubmit={e => {
            submitForm(e);
          }}
        >
          <Card style={styles.marginStyle}>
            <CardHeader
              style={{ paddingBottom: 0 }}
              title={
                <div style={styles.headerStyle}>
                  {' '}
                  {this.props.match.params.id ? translate('pgr.lbl.update') : translate('pgr.lbl.create')} {translate('pgr.lbl.receivingcenter')}
                </div>
              }
            />
            <CardText style={{ padding: 0 }}>
              <Grid>
                <Row>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <TextField
                      className="custom-form-control-for-textfield"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('core.lbl.add.name') + '*'}
                      value={createReceivingCenter.name ? createReceivingCenter.name : ''}
                      errorText={fieldErrors.name ? fieldErrors.name : ''}
                      maxLength="100"
                      onChange={e =>
                        handleChange(e, 'name', true, /^[a-zA-Z\s'_.]{0,100}$/, 'Please use only alphabets, space and special characters')
                      }
                      id="name"
                    />
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <TextField
                      className="custom-form-control-for-textfield"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('core.lbl.code') + '*'}
                      value={createReceivingCenter.code ? createReceivingCenter.code : ''}
                      errorText={fieldErrors.code ? fieldErrors.code : ''}
                      maxLength="20"
                      onChange={e => handleChange(e, 'code', true, /^[A-Z0-9]{0,20}$/, 'Please use only upper case alphabets and numbers')}
                      id="code"
                      disabled={this.state.id ? true : false}
                    />
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <TextField
                      className="custom-form-control-for-textarea"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('core.lbl.description')}
                      value={createReceivingCenter.description ? createReceivingCenter.description : ''}
                      errorText={fieldErrors.description ? fieldErrors.description : ''}
                      maxLength="250"
                      onChange={e =>
                        handleChange(e, 'description', false, /^.[^]{0,250}$/, translate('pgr.lbl.max') + ' 250 ' + translate('pgr.lbl.characters'))
                      }
                      multiLine={true}
                      id="description"
                    />
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <TextField
                      className="custom-form-control-for-textfield"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.order.no') + '*'}
                      value={createReceivingCenter.orderno ? createReceivingCenter.orderno : ''}
                      errorText={fieldErrors.orderno ? fieldErrors.orderno : ''}
                      maxLength="10"
                      onChange={e => handleChange(e, 'orderno', true, /^\d{0,10}$/g, 'Please use only numbers')}
                      id="orderno"
                    />
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <Checkbox
                      label={translate('pgr.lbl.active')}
                      style={styles.setTopMargin}
                      checked={createReceivingCenter.active !== undefined ? createReceivingCenter.active : true}
                      onCheck={(e, i, v) => {
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
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <Checkbox
                      label={translate('pgr.lbl.crn')}
                      style={styles.setTopMargin}
                      checked={createReceivingCenter.iscrnrequired}
                      onCheck={(e, i, v) => {
                        var e = {
                          target: {
                            value: i,
                          },
                        };
                        handleChange(e, 'iscrnrequired', false, '');
                      }}
                      id="iscrnrequired"
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
          title={translate('pgr.lbl.success')}
          actions={<FlatButton label={translate('core.lbl.close')} primary={true} onTouchTap={this.handleClose} />}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {translate('pgr.lbl.receivingcenter')}{' '}
          {this.props.match.params.id ? translate('core.lbl.updatedsuccessful') : translate('core.lbl.createdsuccessful')}
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    createReceivingCenter: state.form.form,
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
          required: ['name', 'code', 'orderno'],
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

  resetObject: object => {
    dispatch({
      type: 'RESET_OBJECT',
      object,
    });
  },

  handleChange: (e, property, isRequired, pattern, errorMsg) => {
    dispatch({
      type: 'HANDLE_CHANGE',
      property,
      value: e.target.value,
      isRequired,
      pattern,
      errorMsg,
    });
  },

  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
  },

  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateReceivingCenter);
