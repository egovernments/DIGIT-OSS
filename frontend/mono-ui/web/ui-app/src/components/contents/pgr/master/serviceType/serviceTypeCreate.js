import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Api from '../../../../../api/api';
import styles from '../../../../../styles/material-ui';
import { translate } from '../../../../common/common';

var _this;

class ServiceTypeCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      data: '',
      nomineeFieldsDefination: [],
      isCustomFormVisible: true,
      showMsg: true,
      category: [],
      isCustomFormVisible: false,
      assetFieldsDefination: [],
      open: false,
      editIndex: -1,
      isDataType: false,
    };
    this.showCustomFieldForm = this.showCustomFieldForm.bind(this);
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

      Api.commonApiPost('/pgr-master/service/v1/_search', { id: this.props.match.params.id, keywords: 'complaint' }, body).then(
        function(response) {
          current.setState({ data: response.Service });
          setForm(response.Service[0]);
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

  componentDidMount() {
    let self = this;
    Api.commonApiPost('/pgr-master/serviceGroup/v1/_search', {
      keyword: 'complaint',
    }).then(
      function(response) {
        self.setState({
          category: response.ServiceGroups,
        });
      },
      function(err) {
        self.setState({
          category: [],
        });
      }
    );
  }

  componentWillUpdate() {
    if (window.urlCheck) {
      let { initForm } = this.props;
      initForm();
      this.setState({ id: undefined });
      window.urlCheck = false;
    }
  }

  componentDidUpdate() {
    var keyword;
    var pgr = this.props.location.pathname.match('pgr');

    if (pgr) {
      keyword = 'Complaint';
    } else {
      keyword = 'Complaint';
    }
  }
  submitForm = e => {
    e.preventDefault();
    this.props.setLoadingStatus('loading');
    var current = this;

    let keyword;
    let pgr = this.props.location.pathname.match('pgr');

    if (pgr) {
      //console.log(this.props.location.pathname, pgr);
      keyword = 'Complaint';
    } else {
      keyword = 'Deliverable';
    }

    var body = {
      Service: {
        serviceCode: this.props.createServiceType.serviceCode,
        serviceName: this.props.createServiceType.serviceName,
        description: this.props.createServiceType.description,
        localName: this.props.createServiceType.localName,
        active: this.props.createServiceType.active !== undefined ? this.props.createServiceType.active : true,
        type: this.props.createServiceType.type,
        keywords: ['complaint'],
        category: this.props.createServiceType.category,
        hasFinancialImpact: this.props.createServiceType.hasFinancialImpact,
        attributes: [
          {
            variable: true,
            code: 'PRIORITY',
            dataType: 'singlevaluelist',
            required: true,
            dataTypeDescription: null,
            description: 'pgr.priority',
            groupCode: 'pgr.group',
            url: null,
            roles: ['EMPLOYEE'],
            actions: ['UPDATE'],
            attribValues: [
              {
                key: 'PRIORITY-1',
                name: 'pgr.priority.one',
                isActive: true,
              },
              {
                key: 'PRIORITY-2',
                name: 'pgr.priority.two',
                isActive: true,
              },
              {
                key: 'PRIORITY-3',
                name: 'pgr.priority.three',
                isActive: true,
              },
            ],
          },
        ],
        slaHours: parseInt(this.props.createServiceType.slaHours),
        metadata: this.props.createServiceType.metadata,
        tenantId: localStorage.getItem('tenantId'),
      },
    };
    if (this.props.match.params.id) {
      Api.commonApiPost('/pgr-master/service/v1/_update', {}, body).then(
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
      Api.commonApiPost('/pgr-master/service/v1/_create', {}, body).then(
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
    }
  };

  showCustomFieldForm(isShow) {
    this.setState({ isCustomFormVisible: isShow });
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    var _this = this;

    let {
      dataTypes,
      attributes,
      createServiceType,
      fieldErrors,
      isFormValid,
      isTableShow,
      handleUpload,
      deleteObject,
      files,
      isEditIndex,
      handleChange,
      handleMap,
      handleChangeNextOne,
      handleChangeNextTwo,
      buttonText,
    } = this.props;

    let { submitForm, showCustomFieldForm, renderDelEvent, addAsset, handleOpenNClose } = this;
    let { nomineeFieldsDefination, isCustomFormVisible, showMsg, customField, assetFieldsDefination, isDataType, editIndex } = this.state;

    const viewTypes = function() {
      //if( (createServiceType.attribute.datatype=="Single value list" || createServiceType.attribute.datatype == "Multi select") && (createServiceType.attribute.dataType!=undefined)) {
      return (
        <div>
          <Row>
            <Col xs={12} sm={4} md={3} lg={3}>
              <TextField
                className="custom-form-control-for-textfield"
                fullWidth={true}
                floatingLabelText="Key"
                value={createServiceType.dataType ? createServiceType.dataType.attributesKey : ''}
                errorText={fieldErrors.dataTypes ? fieldErrors.dataType.attributesKey : ''}
                onChange={e => handleChangeNextOne(e, 'dataType', 'attributesKey', false, '')}
                id="attributesKey"
              />
            </Col>
            <Col xs={12} sm={4} md={3} lg={3}>
              <TextField
                className="custom-form-control-for-textfield"
                fullWidth={true}
                floatingLabelText={translate('core.lbl.add.name')}
                value={createServiceType.dataType ? createServiceType.dataType.attributesName : ''}
                errorText={fieldErrors.dataType ? fieldErrors.dataType.attributesName : ''}
                onChange={e => handleChangeNextOne(e, 'dataType', 'attributesName', false, '')}
                id="attributesName"
              />
            </Col>
            <Col xs={12} sm={4} md={3} lg={3} style={styles.textRight}>
              <br />
              {(editIndex == -1 || editIndex == undefined) && (
                <RaisedButton
                  type="button"
                  label={translate('pgr.lbl.add')}
                  primary="true"
                  onClick={() => {
                    _this.props.addNestedFormData('dataTypes', 'dataType');
                    _this.props.resetObject('dataType');
                  }}
                />
              )}
              {editIndex > -1 && (
                <RaisedButton
                  type="button"
                  label={translate('core.lbl.save')}
                  onClick={() => {
                    this.props.updateObject('owners', 'owner', editIndex);
                    this.props.resetObject('owner');
                    isEditIndex(-1);
                  }}
                />
              )}
            </Col>
          </Row>

          <Col xs={12} md={12}>
            <Row>
              {createServiceType.dataTypes && (
                <div>
                  {' '}
                  <br />
                  <Table
                    id="createServiceTypeTable"
                    style={{
                      color: 'black',
                      fontWeight: 'normal',
                      marginBottom: 0,
                    }}
                    bordered
                    responsive
                  >
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Key</th>
                        <th>{translate('core.lbl.add.name')}</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {createServiceType.dataTypes &&
                        createServiceType.dataTypes.map(function(i, index) {
                          if (i) {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{i.attributesKey}</td>
                                <td>{i.attributesName}</td>
                                <td>
                                  <i
                                    className="material-icons"
                                    style={styles.iconFont}
                                    onClick={() => {
                                      deleteObject('dataTypes', index);
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
        </div>
      ); //}
    };
    const showAddNewBtn = function() {
      return (
        <RaisedButton
          style={{ margin: '15px 5px' }}
          type="button"
          primary="true"
          onClick={() => {
            showCustomFieldForm(true);
          }}
          float="right"
          label={translate('pgr.lbl.create')}
        />
      );
    };

    const promotionFunc = function() {
      if (createServiceType.metadata == 'true' || createServiceType.metadata == true) {
        return (
          <div className="form-section">
            <h3 style={styles.headerStyle}>Attributes</h3>
            <div className="row" style={{ paddingRight: '18px' }}>
              {showAddNewBtn()}
            </div>

            <Col xs={12} md={12}>
              <Row>
                {createServiceType.attributes && (
                  <div>
                    {' '}
                    <br />
                    <Table
                      id="createServiceTypeTable"
                      style={{
                        color: 'black',
                        fontWeight: 'normal',
                        marginBottom: 0,
                      }}
                      bordered
                      responsive
                    >
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Code</th>
                          <th>Datatype</th>
                          <th>Description</th>
                          <th>Datatype Description</th>
                          <th>Variable</th>
                          <th>Required</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {createServiceType.attributes &&
                          createServiceType.attributes.map(function(i, index) {
                            if (i) {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{i.code}</td>
                                  <td>{i.dataType}</td>
                                  <td>{i.datatypeDescription}</td>
                                  <td>{i.description}</td>
                                  <td>{i.variable}</td>
                                  <td>{i.required}</td>

                                  <td>
                                    <i
                                      className="material-icons"
                                      style={styles.iconFont}
                                      onClick={() => {
                                        deleteObject('attributes', index);
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

            {showCustomFieldAddForm()}
          </div>
        );
      }
    };
    const showCustomFieldAddForm = function() {
      if (isCustomFormVisible) {
        return (
          <div>
            <Col xs={12} sm={4} md={3} lg={3}>
              <TextField
                className="custom-form-control-for-textfield"
                fullWidth={true}
                floatingLabelText={translate('core.lbl.code')}
                value={createServiceType.attribute ? createServiceType.attribute.code : ''}
                errorText={fieldErrors.attribute ? fieldErrors.attribute.code : ''}
                onChange={e => handleChangeNextOne(e, 'attribute', 'code', false, '')}
                id="attributesName"
              />
            </Col>
            <Col xs={12} sm={4} md={3} lg={3}>
              <TextField
                className="custom-form-control-for-textfield"
                fullWidth={true}
                floatingLabelText="Group Code"
                value={createServiceType.attribute ? createServiceType.attribute.groupCode : ''}
                errorText={fieldErrors.attribute ? fieldErrors.attribute.groupCode : ''}
                onChange={e => handleChangeNextOne(e, 'attribute', 'groupCode', false, '')}
                id="groupCode"
              />
            </Col>
            <Col xs={12} sm={4} md={3} lg={3}>
              <TextField
                className="custom-form-control-for-textfield"
                fullWidth={true}
                floatingLabelText="Datatype Description"
                value={createServiceType.attribute ? createServiceType.attribute.datatypeDescription : ''}
                errorText={fieldErrors.attribute ? fieldErrors.attribute.datatypeDescription : ''}
                onChange={e => handleChangeNextOne(e, 'attribute', 'datatypeDescription', false, '')}
                id="datatypeDescription"
              />
            </Col>
            <Col xs={12} sm={4} md={3} lg={3}>
              <TextField
                className="custom-form-control-for-textfield"
                fullWidth={true}
                floatingLabelText={translate('core.lbl.description')}
                value={createServiceType.attribute ? createServiceType.attribute.description : ''}
                errorText={fieldErrors.attribute ? fieldErrors.attribute.description : ''}
                onChange={e => handleChangeNextOne(e, 'attribute', 'description', false, '')}
                id="description"
              />
            </Col>

            <Col xs={12} sm={4} md={3} lg={3}>
              <SelectField
                className="custom-form-control-for-select"
                hintText="Select"
                floatingLabelText={translate('core.error.required')}
                fullWidth={true}
                value={createServiceType.attribute ? createServiceType.attribute.required : ''}
                onChange={(e, index, values) => {
                  var e = {
                    target: {
                      value: values,
                    },
                  };

                  handleChangeNextOne(e, 'attribute', 'required', false, '');
                }}
              >
                <MenuItem value={true} primaryText={'True'} />
                <MenuItem value={false} primaryText={'False'} />
              </SelectField>
            </Col>

            <Col xs={12} sm={4} md={3} lg={3}>
              <SelectField
                className="custom-form-control-for-select"
                hintText="Select"
                floatingLabelText="Variable"
                fullWidth={true}
                value={createServiceType.attribute ? createServiceType.attribute.variable : ''}
                onChange={(e, index, values) => {
                  var e = {
                    target: {
                      value: values,
                    },
                  };

                  handleChangeNextOne(e, 'attribute', 'variable', false, '');
                }}
              >
                <MenuItem value={true} primaryText={'True'} />
                <MenuItem value={false} primaryText={'False'} />
              </SelectField>
            </Col>
            <Col xs={12} sm={4} md={3} lg={3}>
              <SelectField
                className="custom-form-control-for-select"
                hintText="Select"
                floatingLabelText="Data Type"
                fullWidth={true}
                value={createServiceType.attribute ? createServiceType.attribute.dataType : ''}
                onChange={(e, index, values) => {
                  var e = {
                    target: {
                      value: values,
                    },
                  };

                  handleChangeNextOne(e, 'attribute', 'dataType', false, '');
                }}
              >
                <MenuItem value={'Single value list'} primaryText={'Single value list'} />
                <MenuItem value={'Text'} primaryText={'Text'} />
                <MenuItem value={'Multi select'} primaryText={'Multi select'} />
                <MenuItem value={'Date'} primaryText={'Date'} />
                <MenuItem value={'File'} primaryText={'File'} />
                <MenuItem value={'Table'} primaryText={'Table'} />
                <MenuItem value={'Email'} primaryText={'Email'} />
                <MenuItem value={'Number'} primaryText={'Number'} />
              </SelectField>
            </Col>
            {createServiceType.attribute &&
              (createServiceType.attribute.dataType == 'Single value list' || createServiceType.attribute.dataType == 'Multi select') &&
              viewTypes()}
            <div className="clearfix" />
            {(editIndex == -1 || editIndex == undefined) && (
              <RaisedButton
                type="button"
                label="Add Attribute"
                primary="true"
                onClick={() => {
                  if (createServiceType.dataTypes !== undefined) {
                    createServiceType.attribute.attributes = [];
                    createServiceType.dataTypes.forEach(function(d) {
                      createServiceType.attribute.attributes.push({
                        key: d.attributesKey,
                        name: d.attributesName,
                      });
                    });
                  }
                  _this.props.addNestedFormData('attributes', 'attribute');
                  _this.props.resetObject('attribute');
                  _this.props.resetObject('dataTypes');
                }}
              />
            )}
            {editIndex > -1 && (
              <RaisedButton
                type="button"
                label={translate('core.lbl.save')}
                onClick={() => {
                  this.props.updateObject('owners', 'owner', editIndex);
                  this.props.resetObject('owner');
                  isEditIndex(-1);
                }}
              />
            )}
          </div>
        );
      }
    };
    const showNoteMsg = function() {
      if (showMsg) {
        return <p className="text-danger">ALl mandatory field are required.</p>;
      } else return '';
    };

    return (
      <div className="createServiceType">
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
                  {this.state.id != '' ? translate('pgr.lbl.update') : translate('pgr.lbl.create')} {translate('pgr.lbl.grievance.type')}
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
                      floatingLabelText={translate('core.lbl.code') + ' *'}
                      value={createServiceType.serviceCode ? createServiceType.serviceCode : ''}
                      errorText={fieldErrors.serviceCode ? fieldErrors.serviceCode : ''}
                      maxLength="20"
                      onChange={(e, value) =>
                        handleChange(value, 'serviceCode', true, /^[A-Z0-9]{0,20}$/, 'Please use only upper case alphabets and numbers')
                      }
                      id="serviceCode"
                      disabled={this.state.id ? true : false}
                    />
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <TextField
                      className="custom-form-control-for-textfield"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('core.lbl.add.name') + ' *'}
                      value={createServiceType.serviceName ? createServiceType.serviceName : ''}
                      errorText={fieldErrors.serviceName ? fieldErrors.serviceName : ''}
                      maxLength="100"
                      onChange={(e, value) =>
                        handleChange(value, 'serviceName', true, /^[a-zA-Z\s'_.]{0,100}$/, 'Please use only alphabets, space and special characters')
                      }
                      id="serviceName"
                    />
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <TextField
                      className="custom-form-control-for-textfield"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.service.localName')}
                      value={createServiceType.localName ? createServiceType.localName : ''}
                      errorText={fieldErrors.localName ? fieldErrors.localName : ''}
                      onChange={(e, value) => handleChange(value, 'localName', false, '', 'Please use only numbers')}
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
                      value={createServiceType.description ? createServiceType.description : ''}
                      errorText={fieldErrors.description ? fieldErrors.description : ''}
                      maxLength="250"
                      onChange={(e, value) =>
                        handleChange(
                          value,
                          'description',
                          false,
                          /^.[^]{0,250}$/,
                          translate('pgr.lbl.max') + ' 250 ' + translate('pgr.lbl.characters')
                        )
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
                      floatingLabelText={translate('pgr.lbl.slahour') + ' *'}
                      value={createServiceType.slaHours ? createServiceType.slaHours : ''}
                      errorText={fieldErrors.slaHours ? fieldErrors.slaHours : ''}
                      maxLength="4"
                      onChange={(e, value) => handleChange(value, 'slaHours', true, /^\d{0,4}$/g, 'Please use only numbers')}
                      id="slaHours"
                    />
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <SelectField
                      className="custom-form-control-for-select"
                      hintText="Select"
                      maxHeight={200}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('core.category') + ' *'}
                      fullWidth={true}
                      value={createServiceType.category ? createServiceType.category : ''}
                      onChange={(e, index, value) => {
                        handleChange(value, 'category', true, '');
                      }}
                      errorText={fieldErrors.category ? fieldErrors.category : ''}
                    >
                      <MenuItem value="" primaryText="Select" />
                      {this.state.category.map((item, index) => <MenuItem value={item.id} key={index} primaryText={item.name} />)}
                    </SelectField>
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <Checkbox
                      label={translate('pgr.lbl.active')}
                      style={styles.setTopMargin}
                      checked={createServiceType.active !== undefined ? createServiceType.active : true}
                      onCheck={(e, value) => {
                        handleChange(value, 'active', false, '');
                      }}
                      id="active"
                    />
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <Checkbox
                      label={translate('pgr.lbl.finimpact')}
                      style={styles.setTopMargin}
                      checked={createServiceType.hasFinancialImpact || false}
                      onCheck={(e, i, v) => {
                        handleChange(i, 'hasFinancialImpact', false, '');
                      }}
                      id="hasFinancialImpact"
                    />
                  </Col>
                  {/*<Col xs={12} md={3} sm={6}>

                                                                 <Checkbox
                                                                   label="Attributes"
                                                                   style={styles.metadata}
                                                                   checked = {createServiceType.metadata || false}
                                                                   onCheck = {(e, i, v) => { console.log(createServiceType.metadata, i);

                                                                     var e = {
                                                                       target: {
                                                                         value:i
                                                                       }
                                                                     }
                                                                     handleChange(e, "metadata", false, '')
                                                                   }}
                                                                   id="metadata"
                                                                 />
                                                             </Col>*/}
                  {/*promotionFunc()*/}
                </Row>
              </Grid>
            </CardText>
          </Card>
          <div style={{ textAlign: 'center' }}>
            <RaisedButton
              style={{ margin: '15px 5px' }}
              type="submit"
              primary="true"
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
          {translate('pgr.lbl.grievance.type')}{' '}
          {this.state.id != '' ? translate('core.lbl.updatedsuccessful') : translate('core.lbl.createdsuccessful')}
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    createServiceType: state.form.form,
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
          required: ['serviceName', 'serviceCode', 'category', 'slaHours'],
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
          current: ['serviceName', 'serviceCode', 'category', 'slaHours'],
          required: ['serviceName', 'serviceCode', 'category', 'slaHours'],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },

  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
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

  handleChange: (value, property, isRequired, pattern, errorMsg) => {
    dispatch({
      type: 'HANDLE_CHANGE',
      property,
      value,
      isRequired,
      pattern,
      errorMsg,
    });
  },
  isEditIndex: index => {
    dispatch({
      type: 'EDIT_INDEX',
      index,
    });
  },

  addNestedFormData: (formArray, formData) => {
    dispatch({
      type: 'PUSH_ONE',
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

  resetObject: object => {
    dispatch({
      type: 'RESET_OBJECT',
      object,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceTypeCreate);
