import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Api from '../../../../../api/api';
import styles from '../../../../../styles/material-ui';
import { translate } from '../../../../common/common';

var flag = 0;
var _this;

var urlChanged = false;

class receivingModeCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.addOrUpdate = this.addOrUpdate.bind(this);
    this.handleOpenNClose = this.handleOpenNClose.bind(this);
  }

  handleOpenNClose() {
    this.setState({
      open: !this.state.open,
    });

    let { initForm } = this.props;
    initForm();
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.setState({ id: this.props.match.params.id });
      var body = {};
      let _this = this;
      let { setForm } = this.props;

      Api.commonApiPost('/pgr-master/receivingmode/v1/_search', { id: this.props.match.params.id }, body)
        .then(function(response) {
          _this.setState({ data: response.ReceivingModeType[0] });
          setForm(response.ReceivingModeType[0]);
        })
        .catch(error => {});
    } else {
      let { initForm } = this.props;
      initForm();
    }
  }

  close() {
    window.open(window.location, '_self').close();
  }

  componentWillUpdate() {
    if (window.urlCheck) {
      let { initForm } = this.props;
      initForm();
      this.setState({ id: undefined });
      window.urlCheck = false;
    }
  }

  addOrUpdate(e) {
    e.preventDefault();
    this.props.setLoadingStatus('loading');
    var _this = this;

    let { changeButtonText, receivingmodeSet } = this.props;
    var body = {
      ReceivingModeType: {
        name: receivingmodeSet.name,
        code: receivingmodeSet.code,
        description: receivingmodeSet.description,
        active: receivingmodeSet.active !== undefined ? receivingmodeSet.active : true,
        tenantId: localStorage.getItem('tenantId'),
        channels: receivingmodeSet.channels,
      },
    };
    receivingmodeSet.active !== undefined ? receivingmodeSet.active : true;
    if (_this.props.match.params.id) {
      Api.commonApiPost('pgr-master/receivingmode/v1/_update', {}, body).then(
        function(response) {
          _this.setState({
            open: true,
          });
          _this.props.resetObject('receivingmodeSet');
          _this.props.setLoadingStatus('hide');
        },
        function(err) {
          _this.props.setLoadingStatus('hide');
          _this.props.toggleSnackbarAndSetText(true, err.message);
        }
      );
    } else {
      Api.commonApiPost('pgr-master/receivingmode/v1/_create', {}, body).then(
        function(response) {
          _this.setState({
            open: true,
          });
          _this.props.resetObject('receivingmodeSet');
          _this.props.setLoadingStatus('hide');
        },
        function(err) {
          _this.props.setLoadingStatus('hide');
          _this.props.toggleSnackbarAndSetText(true, err.message);
        }
      );
    }
  }

  render() {
    // this.callOnRender()
    let url = this.props.location.pathname;
    var _this = this;
    let { addOrUpdate, handleOpenNClose } = this;
    let { open } = this.state;
    let {
      handleChange,
      handleChangeNextOne,
      handleChangeNextTwo,
      isFormValid,
      isTableShow,
      receivingmodeSet,
      fieldErrors,
      isDialogOpen,
      msg,
    } = this.props;

    return (
      <div className="receivingModeCreate">
        <form
          autoComplete="off"
          onSubmit={e => {
            addOrUpdate(e);
          }}
        >
          <Card style={styles.marginStyle}>
            <CardHeader
              style={{ paddingBottom: 0 }}
              title={
                <div style={styles.headerStyle}>
                  {' '}
                  {this.props.match.params.id ? translate('pgr.lbl.update') : translate('pgr.lbl.create')} {translate('pgr.lbl.receivingmode')}
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
                      id="name"
                      errorText={fieldErrors.name ? fieldErrors.name : ''}
                      value={receivingmodeSet.name ? receivingmodeSet.name : ''}
                      maxLength="100"
                      onChange={e => {
                        handleChange(e, 'name', true, /^[a-zA-Z\s'_.]{0,100}$/, 'Please use only alphabets, space and special characters');
                      }}
                    />
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <TextField
                      className="custom-form-control-for-textfield"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('core.lbl.code') + '*'}
                      id="code"
                      errorText={fieldErrors.code ? fieldErrors.code : ''}
                      value={receivingmodeSet.code ? receivingmodeSet.code : ''}
                      maxLength="20"
                      onChange={e => {
                        handleChange(e, 'code', true, /^[A-Z0-9]{0,20}$/, 'Please use only upper case alphabets and numbers');
                      }}
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
                      id="description"
                      multiLine={true}
                      errorText={fieldErrors.description ? fieldErrors.description : ''}
                      value={receivingmodeSet.description ? receivingmodeSet.description : ''}
                      maxLength="250"
                      onChange={e => {
                        handleChange(e, 'description', false, /^.[^]{0,250}$/, translate('pgr.lbl.max') + ' 250 ' + translate('pgr.lbl.characters'));
                      }}
                    />
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <SelectField
                      className="custom-form-control-for-select"
                      hintText="Select"
                      multiple="true"
                      errorText={fieldErrors.channels ? fieldErrors.channels : ''}
                      value={receivingmodeSet.channels ? receivingmodeSet.channels : ''}
                      onChange={(e, index, value) => {
                        var e = {
                          target: {
                            value: value,
                          },
                        };
                        handleChange(e, 'channels', true, '');
                      }}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.channel') + ' *'}
                    >
                      <MenuItem value="" primaryText="Select" />
                      <MenuItem
                        value={'WEB'}
                        primaryText="WEB"
                        insetChildren={true}
                        checked={receivingmodeSet.channels && receivingmodeSet.channels.indexOf('WEB') > -1}
                      />
                      <MenuItem
                        value={'MOBILE'}
                        primaryText="MOBILE"
                        insetChildren={true}
                        checked={receivingmodeSet.channels && receivingmodeSet.channels.indexOf('MOBILE') > -1}
                      />
                    </SelectField>
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <Checkbox
                      label={translate('pgr.lbl.active')}
                      id="active"
                      style={styles.setTopMargin}
                      checked={receivingmodeSet.active !== undefined ? receivingmodeSet.active : true}
                      onCheck={(e, isInputChecked) => {
                        var e = {
                          target: {
                            value: isInputChecked,
                          },
                        };
                        handleChange(e, 'active', false, '');
                      }}
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
              label={!_this.state.id ? translate('pgr.lbl.create') : translate('pgr.lbl.update')}
              primary={true}
            />
          </div>
        </form>
        <Dialog
          title={translate('pgr.lbl.success')}
          actions={[<FlatButton label={translate('core.lbl.close')} primary={true} onTouchTap={handleOpenNClose} />]}
          modal={false}
          open={open}
          onRequestClose={handleOpenNClose}
        >
          {translate('pgr.lbl.receivingmode')}{' '}
          {this.props.match.params.id ? translate('core.lbl.updatedsuccessful') : translate('core.lbl.createdsuccessful')}
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    receivingmodeSet: state.form.form,
    fieldErrors: state.form.fieldErrors,
    isFormValid: state.form.isFormValid,
    isTableShow: state.form.showTable,
    buttonText: state.form.buttonText,
    isDialogOpen: state.form.dialogOpen,
    msg: state.form.msg,
  };
};

const mapDispatchToProps = dispatch => ({
  initForm: type => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: ['name', 'code', 'channels'],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },

  resetObject: (type, object) => {
    dispatch({
      type: 'RESET_OBJECT',
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
          current: ['name', 'code', 'channels'],
          required: ['name', 'code', 'channels'],
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
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(receivingModeCreate);
