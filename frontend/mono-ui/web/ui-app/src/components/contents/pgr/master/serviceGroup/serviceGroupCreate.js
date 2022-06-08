import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Api from '../../../../../api/api';
import styles from '../../../../../styles/material-ui';
import { translate } from '../../../../common/common';

var _this;

class ServiceGroupCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      data: '',
      open: false,
    };
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
      let current = this;
      let { setForm } = this.props;

      Api.commonApiPost('/pgr-master/serviceGroup/v1/_search', { id: this.props.match.params.id }, body).then(
        function(response) {
          current.setState({ data: response.ServiceGroups });
          setForm(response.ServiceGroups[0]);
        },
        function(err) {
          current.props.toggleSnackbarAndSetText(true, err.message);
          current.props.setLoadingStatus('hide');
        }
      );
    } else {
      let { initForm } = this.props;
      initForm();
    }
  }

  componentDidMount() {}

  componentWillUpdate() {
    this.initData();
  }

  initData = () => {
    if (window.urlCheck) {
      let { initForm } = this.props;
      initForm();
      this.setState({ id: undefined });
      window.urlCheck = false;
    }
  };

  componentDidUpdate() {
    this.initData();
  }
  close() {
    window.close();
  }

  submitForm = e => {
    e.preventDefault();
    this.props.setLoadingStatus('loading');
    var current = this;

    var body = {
      ServiceGroup: {
        id: this.props.createServiceGroup.id,
        name: this.props.createServiceGroup.name,
        code: this.props.createServiceGroup.code,
        description: this.props.createServiceGroup.description,
        localName: this.props.createServiceGroup.localName,
        tenantId: localStorage.getItem('tenantId'),
        keyword: 'complaint',
      },
    };

    if (this.props.match.params.id) {
      Api.commonApiPost('/pgr-master/serviceGroup/v1/_update', {}, body).then(
        function(response) {
          current.setState({
            open: true,
          });
          current.props.setLoadingStatus('hide');
        },
        function(err) {
          current.props.toggleSnackbarAndSetText(true, err.message);
          current.props.setLoadingStatus('hide');
        }
      );
    } else {
      Api.commonApiPost('/pgr-master/serviceGroup/v1/_create', {}, body).then(
        function(response) {
          current.setState({
            open: true,
          });
          current.props.resetObject('createServiceGroup');
          current.props.setLoadingStatus('hide');
        },
        function(err) {
          current.props.toggleSnackbarAndSetText(true, err.message);
          current.props.setLoadingStatus('hide');
        }
      );
    }
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    let {
      createServiceGroup,
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

    let { submitForm, handleOpenNClose } = this;

    return (
      <div className="createServiceGroup">
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
                  {this.state.id != '' ? translate('pgr.lbl.update') : translate('pgr.lbl.create')} {translate('pgr.lbl.grievance.category')}
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
                      floatingLabelText={translate('core.lbl.code') + '*'}
                      value={createServiceGroup.code ? createServiceGroup.code : ''}
                      errorText={fieldErrors.code ? fieldErrors.code : ''}
                      maxLength="20"
                      onChange={e => handleChange(e, 'code', true, /^[A-Z0-9]{0,20}$/, 'Please use only upper case alphabets and numbers')}
                      id="code"
                      disabled={this.state.id ? true : false}
                    />
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <TextField
                      className="custom-form-control-for-textfield"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('core.lbl.add.name') + '*'}
                      value={createServiceGroup.name ? createServiceGroup.name : ''}
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
                      floatingLabelText={translate('pgr.service.localName')}
                      value={createServiceGroup.localName ? createServiceGroup.localName : ''}
                      errorText={fieldErrors.localName ? fieldErrors.localName : ''}
                      maxLength="250"
                      onChange={e =>
                        handleChange(e, 'localName', false, /^.[^]{0,250}$/, translate('pgr.lbl.max') + ' 250 ' + translate('pgr.lbl.characters'))
                      }
                      id="localName"
                    />
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <TextField
                      className="custom-form-control-for-textarea"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('core.lbl.description')}
                      value={createServiceGroup.description ? createServiceGroup.description : ''}
                      errorText={fieldErrors.description ? fieldErrors.description : ''}
                      maxLength="250"
                      onChange={e =>
                        handleChange(e, 'description', false, /^.[^]{0,250}$/, translate('pgr.lbl.max') + ' 250 ' + translate('pgr.lbl.characters'))
                      }
                      multiLine={true}
                      id="description"
                    />
                  </Col>
                </Row>
              </Grid>
            </CardText>
          </Card>
          <div style={{ textAlign: 'center' }}>
            <RaisedButton
              primary={true}
              style={{ margin: '15px 5px' }}
              type="submit"
              disabled={!isFormValid}
              label={this.state.id ? translate('pgr.lbl.update') : translate('pgr.lbl.create')}
            />
          </div>
        </form>
        <Dialog
          title={translate('pgr.lbl.success')}
          actions={
            <FlatButton label={translate('core.lbl.close')} primary={true} onTouchTap={this.state.id != '' ? this.handleClose : handleOpenNClose} />
          }
          modal={false}
          open={this.state.open}
          onRequestClose={this.state.id != '' ? this.handleClose : handleOpenNClose}
        >
          {translate('pgr.lbl.grievance.category')}{' '}
          {this.state.id != '' ? translate('core.lbl.updatedsuccessful') : translate('core.lbl.createdsuccessful')}
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    createServiceGroup: state.form.form,
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

export default connect(mapStateToProps, mapDispatchToProps)(ServiceGroupCreate);
