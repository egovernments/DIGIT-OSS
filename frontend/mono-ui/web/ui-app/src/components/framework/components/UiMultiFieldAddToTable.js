import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import UiTextField from './UiTextField';
import UiSelectField from './UiSelectField';
import UiSelectFieldMultiple from './UiSelectFieldMultiple';
import UiCheckBox from './UiCheckBox';
import UiEmailField from './UiEmailField';
import UiMobileNumber from './UiMobileNumber';
import UiTextArea from './UiTextArea';
import UiMultiSelectField from './UiMultiSelectField';
import UiNumberField from './UiNumberField';
import UiDatePicker from './UiDatePicker';
import UiMultiFileUpload from './UiMultiFileUpload';
import UiSingleFileUpload from './UiSingleFileUpload';
import UiAadharCard from './UiAadharCard';
import UiPanCard from './UiPanCard';
import UiLabel from './UiLabel';
import UiRadioButton from './UiRadioButton';
import UiTextSearch from './UiTextSearch';
import UiDocumentList from './UiDocumentList';
import UiAutoComplete from './UiAutoComplete';
import UiDate from './UiDate';
import UiPinCode from './UiPinCode';
import UiArrayField from './UiArrayField';
import UiFileTable from './UiFileTable';
import { translate } from '../../common/common';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';
import Api from '../../../api/api';

var dropDownData = {
  'MdmsMetadata.masterData[0].side': {
    url: '/egov-mdms-service/v1/_get?&moduleName=lcms&masterName=side|$.MdmsRes.lcms.side.*.code|$.MdmsRes.lcms.side.*.name',
  },
};

class UiMultiFieldAddToTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      currentValue: '',
      valueList: [],
      formData: {},
      disableAdd: true,
      index: -1,
      fieldErrors: {},
      isBtnDisabled: false,
      requiredFields: [],
      isInlineEdit: false,
      indexes: [],
      isAddAgain: true,
    };
  }

  componentDidMount() {
    let { item, valueList } = this.props;
    let requiredFields = [];
    let headers = [];
    for (let i = 0; i < item.values.length; i++) {
      if (item.values[i].name == 'tenantId') {
        item.values[i].isDisabled = true;
        item.values[i].hide = true;
        item.values[i].defaultValue = localStorage.getItem('tenantId');
        item.values[i].isRequired = false;
      }
      if (item.values[i].type == 'singleValueList') {
        if (dropDownData.hasOwnProperty(item.values[i].jsonPath)) {
          item.values[i].url = dropDownData[item.values[i].jsonPath].url;
        }
      } else {
        if (item.values[i].name == 'active') {
          item.values[i].defaultValue = false;
        } else {
          item.values[i].defaultValue = '';
        }
      }

      if (item.values[i].isRequired) {
        requiredFields.push(item.values[i].jsonPath);
      }
    }

    // console.log(item);
    // console.log(valueList);

    // let headers=[];
    // for (var i = 0; i < res.header.length; i++) {
    // 	headers.push(res.header[i].label.split(".")[4]);
    // }
    // headers.push("modify");

    let counter = 0;

    for (var i = 0; i < item.values.length; i++) {
      item.values[i].name != 'id' && counter++;
    }

    this.setState({
      requiredFields,
      isInlineEdit: counter < 5,
    });

    if (valueList && valueList.length) {
      this.setState({
        valueList: _.cloneDeep(valueList),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps, this.props)) {
      this.updateValueList(nextProps);
    }
  }

  updateValueList = nProps => {
    if (nProps.valueList && nProps.valueList.length && !_.isEqual(nProps.valueList, this.state.valueList)) {
      this.setState({
        valueList: _.cloneDeep(nProps.valueList),
      });
    }
  };

  handler = (e, property, isRequired, pattern, requiredErrMsg = 'Required', patternErrMsg = 'Pattern Missmatch', expression, expErr, isDate) => {
    let { formData } = this.state;
    let fieldErrors = _.cloneDeep(this.state.fieldErrors);
    let isFormValid = true;
    _.set(formData, property, e.target.value);

    //Check if required
    if (isRequired && e.target.value == '') {
      fieldErrors[property] = requiredErrMsg;
    } else {
      delete fieldErrors[property];
    }

    //Check for pattern match
    if (pattern && _.get(formData, property) && !new RegExp(pattern).test(_.get(formData, property))) {
      fieldErrors[property] = patternErrMsg ? translate(patternErrMsg) : translate('ui.framework.patternMessage');
      isFormValid = false;
    }

    //Check if any other field is required
    for (let i = 0; i < this.state.requiredFields.length; i++) {
      if (typeof _.get(formData, this.state.requiredFields[i]) == 'undefined' || _.get(formData, this.state.requiredFields[i]) == '') {
        isFormValid = false;
        break;
      }
    }

    this.setState({
      formData,
      fieldErrors,
      isBtnDisabled: !isFormValid || Object.keys(fieldErrors).length > 0,
    });
  };

  addToParent = (doNotOpen, ind) => {
    var self = this;
    let { valueList, item } = this.props;
    let formData = _.cloneDeep(this.props.formData);
    let localFormData = _.cloneDeep(this.state.formData);
    let myTableInParent = _.get(formData, this.props.item.jsonPath) || _.get(formData, 'MasterMetaData.masterData');
    let stateFormDataTable = _.get(localFormData, this.props.item.jsonPath);
    let indexes;

    // console.log(item);
    // console.log(stateFormDataTable);
    let temp = [];
    temp[0] = {};

    for (var i = 0; i < item.values.length; i++) {
      if (!stateFormDataTable[0].hasOwnProperty(item.values[i].name)) {
        if (item.values[i].name == 'active') {
          stateFormDataTable[0][item.values[i].name] = false;
          temp[0][item.values[i].name] = stateFormDataTable[0][item.values[i].name];
        } else if (item.values[i].name != 'tenantId') {
          stateFormDataTable[0][item.values[i].name] = '';
          temp[0][item.values[i].name] = stateFormDataTable[0][item.values[i].name];
        } else if (item.values[i].name === 'tenantId') {
          stateFormDataTable[0][item.values[i].name] = localStorage.getItem('tenantId');
          temp[0][item.values[i].name] = stateFormDataTable[0][item.values[i].name];
        }
      } else {
        temp[0][item.values[i].name] = stateFormDataTable[0][item.values[i].name];
      }
    }

    // formData.MasterMetaData.masterData=formData.hasOwnProperty("MdmsMetadata")?formData.MdmsMetadata.masterData:[];
    // self.props.setLoadingStatus('loading');
    var MasterMetaData = {
      tenantId: localStorage.tenantId,
      moduleName: formData.MasterMetaData.moduleName,
      masterName: formData.MasterMetaData.masterName,
      masterData: [temp[0]],
    };

    // console.log(myTableInParent);
    // console.log(stateFormDataTable);
    self.props.setLoadingStatus('loading');
    if (this.state.index == -1) {
      Api.commonApiPost('/egov-mdms-create/v1/_create', {}, { MasterMetaData: MasterMetaData }, false, true)
        .then(function(res) {
          // console.log(res);
          if (!myTableInParent) {
            temp[0].id = 1;
            self.props.handler({ target: { value: temp } }, self.props.item.jsonPath);
          } else {
            temp[0].id = myTableInParent.length + 1;
            myTableInParent.push(temp[0]);
            self.props.handler({ target: { value: myTableInParent } }, self.props.item.jsonPath);
          }
          self.props.setLoadingStatus('hide');
          self.props.toggleSnackbarAndSetText(true, 'Created Successfully . . . !', true);
          //need to clean this code
          let list = _.get(self.props.formData, self.props.item.jsonPath);

          if (typeof ind != 'undefined') {
            indexes = _.cloneDeep(self.state.indexes);
            for (let i = 0; i < indexes.length; i++) {
              if (indexes[i] == ind) {
                indexes.splice(i, 1);
                break;
              }
            }
          }

          self.setState(
            {
              valueList: list,
              formData: {},
              open: doNotOpen ? false : self.state.index > -1 ? false : true,
              index: -1,
              isAddAgain: true,
              indexes: indexes || self.state.indexes,
            },
            function() {
              if (self.props.setDisabled) self.props.setDisabled(true);
            }
          );
        })
        .catch(function(err) {
          self.props.setLoadingStatus('hide');
          self.props.toggleSnackbarAndSetText(true, err.message);
        });
    } else {
      Api.commonApiPost('/egov-mdms-create/v1/_update', {}, { MasterMetaData: MasterMetaData }, false, true)
        .then(function(res) {
          myTableInParent[self.state.index] = temp[0];
          self.props.handler({ target: { value: myTableInParent } }, self.props.item.jsonPath);
          self.props.setLoadingStatus('hide');
          self.props.toggleSnackbarAndSetText(true, 'Data Updated Successfully', true);
          let list = _.get(self.props.formData, self.props.item.jsonPath);

          if (typeof ind != 'undefined') {
            indexes = _.cloneDeep(self.state.indexes);
            for (let i = 0; i < indexes.length; i++) {
              if (indexes[i] == ind) {
                indexes.splice(i, 1);
                break;
              }
            }
          }

          self.setState(
            {
              valueList: list,
              formData: {},
              open: doNotOpen ? false : self.state.index > -1 ? false : true,
              index: -1,
              isAddAgain: true,
              indexes: indexes || self.state.indexes,
            },
            function() {
              if (self.props.setDisabled) self.props.setDisabled(true);
            }
          );
        })
        .catch(function(err) {
          self.props.setLoadingStatus('hide');
          self.props.toggleSnackbarAndSetText(true, err.message);
        });
    }
  };

  editRow = index => {
    let list = _.cloneDeep(this.state.valueList);
    let formData = {};
    _.set(formData, this.props.item.jsonPath + '[0]', list[index]);
    this.setState({
      formData,
      index,
      open: true,
    });
  };

  deleteRow = index => {
    // let formData = _.cloneDeep(this.props.formData);
    // let myTableInParent = _.get(formData, this.props.item.jsonPath);
    // if(myTableInParent) {
    //   myTableInParent.splice(index, 1);
    //   this.props.handler({ target: { value: myTableInParent } }, this.props.item.jsonPath);
    // }
    let list = _.cloneDeep(this.state.valueList);
    // list.splice(index, 1)
    this.setState(
      {
        valueList: list,
        isAddAgain: true,
        formData: {},
      },
      function() {
        if (this.props.setDisabled) this.props.setDisabled(true);
      }
    );
  };

  editInline = index => {
    let { indexes } = this.state;
    let list = _.cloneDeep(this.state.valueList);
    indexes.push(index);
    let formData = {};
    _.set(formData, this.props.item.jsonPath + '[0]', list[index]);
    this.setState({
      formData,
      index,
      indexes,
      isAddAgain: false,
    });
  };

  renderFields = (item, screen) => {
    console.log('item', item);
    if (screen == 'view' && ['documentList', 'fileTable', 'arrayText', 'arrayNumber'].indexOf(item.type) > -1) {
      if (item.type == 'datePicker') {
        item.isDate = true;
      }
      item.type = 'label';
    }

    item.label = translate(item.label);
    switch (item.type) {
      case 'text':
        return <UiTextField ui={this.props.ui} getVal={this.getVal} item={item} fieldErrors={this.state.fieldErrors} handler={this.handler} />;
      case 'textarea':
        return <UiTextArea ui={this.props.ui} getVal={this.getVal} item={item} fieldErrors={this.state.fieldErrors} handler={this.handler} />;
      case 'singleValueListMultiple':
        return (
          <UiSelectFieldMultiple
            ui={this.props.ui}
            useTimestamp={this.props.useTimestamp}
            getVal={this.getVal}
            item={item}
            fieldErrors={this.state.fieldErrors}
            handler={this.handler}
          />
        );
      case 'singleValueList':
        item.fromProps = true;
        item.animated = true;
        item.isSet = !item.isSet;
        return (
          <UiSelectField
            isSet={item.isSet}
            ui={this.props.ui}
            useTimestamp={this.props.useTimestamp}
            getVal={this.getVal}
            item={item}
            fieldErrors={this.state.fieldErrors}
            handler={this.handler}
          />
        );
      case 'multiValueList':
        return <UiMultiSelectField ui={this.props.ui} getVal={this.getVal} item={item} fieldErrors={this.state.fieldErrors} handler={this.handler} />;
      case 'autoCompelete':
        return (
          <UiAutoComplete
            ui={this.props.ui}
            getVal={this.getVal}
            item={item}
            fieldErrors={this.state.fieldErrors}
            handler={this.handler}
            autoComHandler={this.autoComHandler || ''}
          />
        );
      case 'number':
        return <UiNumberField ui={this.props.ui} getVal={this.getVal} item={item} fieldErrors={this.state.fieldErrors} handler={this.handler} />;
      case 'mobileNumber':
        return <UiMobileNumber ui={this.props.ui} getVal={this.getVal} item={item} fieldErrors={this.state.fieldErrors} handler={this.handler} />;
      case 'checkbox':
        return <UiCheckBox ui={this.props.ui} getVal={this.getVal} item={item} fieldErrors={this.state.fieldErrors} handler={this.handler} />;
      case 'email':
        return <UiEmailField ui={this.props.ui} getVal={this.getVal} item={item} fieldErrors={this.state.fieldErrors} handler={this.handler} />;
      case 'datePicker':
        return <UiDatePicker ui={this.props.ui} getVal={this.getVal} item={item} fieldErrors={this.state.fieldErrors} handler={this.handler} />;
      case 'singleFileUpload':
        return <UiSingleFileUpload ui={this.props.ui} getVal={this.getVal} item={item} fieldErrors={this.state.fieldErrors} handler={this.handler} />;
      case 'multiFileUpload':
        return <UiMultiFileUpload ui={this.props.ui} getVal={this.getVal} item={item} fieldErrors={this.state.fieldErrors} handler={this.handler} />;
      case 'pan':
        return <UiPanCard ui={this.props.ui} getVal={this.getVal} item={item} fieldErrors={this.state.fieldErrors} handler={this.handler} />;
      case 'aadhar':
        return <UiAadharCard ui={this.props.ui} getVal={this.getVal} item={item} fieldErrors={this.state.fieldErrors} handler={this.handler} />;
      case 'pinCode':
        return <UiPinCode ui={this.props.ui} getVal={this.getVal} item={item} fieldErrors={this.state.fieldErrors} handler={this.handler} />;
      case 'label':
        return <UiLabel getVal={this.getVal} item={item} />;
      case 'radio':
        return <UiRadioButton ui={this.props.ui} getVal={this.getVal} item={item} fieldErrors={this.state.fieldErrors} handler={this.handler} />;
      case 'textSearch':
        return (
          <UiTextSearch
            ui={this.props.ui}
            getVal={this.getVal}
            item={item}
            fieldErrors={this.state.fieldErrors}
            handler={this.props.handler}
            autoComHandler={this.autoComHandler}
          />
        );
    }
  };

  renderArrayField = item => {
    switch (this.props.ui) {
      case 'google':
        return (
          <div>
            <Dialog
              title={this.props.item.label}
              actions={
                <div>
                  <FlatButton
                    label={this.state.index == -1 ? translate('pt.create.groups.ownerDetails.fields.add') : translate('pgr.lbl.update')}
                    secondary={true}
                    disabled={this.state.isBtnDisabled}
                    style={{ marginTop: 39 }}
                    onClick={this.addToParent}
                  />
                  <FlatButton label={translate('pt.create.button.viewdcb.close')} primary={true} onClick={this.handleClose} />
                </div>
              }
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
              autoScrollBodyContent={true}
            >
              <Row>
                {this.props.item.values.map((v, i) => {
                  return (
                    <Col xs={12} md={6} key={i}>
                      {this.renderFields(v, this.props.screen)}
                    </Col>
                  );
                })}
              </Row>
              <br />
            </Dialog>
            <div style={{ textAlign: 'right' }}>
              <RaisedButton
                label={'Add'}
                onClick={this.handleOpen}
                disabled={!this.state.isAddAgain}
                primary={true}
                icon={
                  <i style={{ color: 'white' }} className="material-icons">
                    add
                  </i>
                }
              />
            </div>
            <br />
            <Table className="table table-striped table-bordered" responsive>
              <thead>
                <tr>
                  <th>#</th>
                  {this.props.item.header.map((v, i) => {
                    return (
                      <th className={'HideIt_' + v.label.split('.')[v.label.split('.').length - 1]} key={i}>
                        {translate(v.label)}
                      </th>
                    );
                  })}

                  <th> Action</th>
                </tr>
              </thead>
              <tbody>
                {this.state.valueList && this.state.valueList.length ? (
                  this.state.valueList.map((item, index) => {
                    if (this.state.indexes.indexOf(index) > -1 || typeof item == 'string') {
                      return (
                        <tr key={index}>
                          <td> {index + 1} </td>
                          {this.props.item.values.map((v, i) => {
                            return (
                              <td className={'HideIt_' + v.name} key={i}>
                                {this.renderFields(v)}
                              </td>
                            );
                          })}
                          <td>
                            <FlatButton
                              label={this.state.index == -1 ? translate('pt.create.groups.ownerDetails.fields.add') : translate('pgr.lbl.update')}
                              secondary={true}
                              disabled={this.state.isBtnDisabled}
                              onClick={e => {
                                this.addToParent(true, index);
                              }}
                            />
                            <br />
                            {/*<FlatButton
                              label={translate("Reset")}
                              secondary={true}
                              onClick={(e) => {this.deleteRow(index)}}/>*/}
                          </td>
                        </tr>
                      );
                    } else {
                      return (
                        <tr key={index}>
                          <td> {index + 1} </td>
                          {Object.keys(item).map(function(key, index) {
                            if (key != 'id') {
                              if (key == 'active') {
                                return <td key={index}>{item[key] ? 'Active' : 'Inactive'}</td>;
                              } else {
                                return (
                                  <td key={index} className={'HideIt_' + key}>
                                    {item[key]}
                                  </td>
                                );
                              }
                            }
                          })}

                          <td>
                            {this.state.isInlineEdit ? (
                              <IconButton
                                onClick={() => {
                                  this.editInline(index);
                                }}
                                disabled={!this.state.isAddAgain}
                              >
                                <i className="material-icons" style={{ color: '#000000' }}>
                                  border_color
                                </i>
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() => {
                                  this.editRow(index);
                                }}
                                disabled={!this.state.isAddAgain}
                              >
                                <i className="material-icons" style={{ color: '#000000' }}>
                                  mode_edit
                                </i>
                              </IconButton>
                            )}
                            {/*&nbsp;&nbsp;&nbsp;&nbsp;
                            <IconButton
                                onClick={()=>{
                                  this.deleteRow(index)
                                }}
                                disabled={!this.state.isAddAgain}>
                              <i className="material-icons text-danger">delete</i>
                            </IconButton>*/}
                          </td>
                        </tr>
                      );
                    }
                  })
                ) : (
                  <tr>
                    <td colSpan={this.props.item.header.length + 2} className="text-center">
                      No data yet! &nbsp;&nbsp;{' '}
                      <a href="javascript:void(0)" className onClick={this.handleOpen}>
                        Click here
                      </a>{' '}
                      to add.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        );
    }
  };

  handleOpen = () => {
    let { item } = this.props;
    if (this.state.isInlineEdit) {
      let list = _.cloneDeep(this.state.valueList);
      let tempObject = {};

      // for (var i = 0; i < item.values.length; i++) {
      //   if (item.values[i].name=="active") {
      //     tempObject[item.values[i].name]=false
      //   } else {
      //     tempObject[item.values[i].name]=""
      //   }
      // }
      list.push('');

      list.reverse();
      this.setState(
        {
          isBtnDisabled: true,
          index: -1,
          valueList: list,
          isAddAgain: false,
        },
        function() {
          if (this.props.setDisabled) this.props.setDisabled(false);
        }
      );
    } else
      this.setState({
        open: true,
        isBtnDisabled: true,
        index: -1,
      });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  getVal = (path, dateBool) => {
    var _val = _.get(this.state.formData, path);

    if (dateBool && typeof _val == 'string' && _val && _val.indexOf('-') > -1) {
      var _date = _val.split('-');
      return new Date(_date[0], Number(_date[1]) - 1, _date[2]);
    }
    return typeof _val != 'undefined' ? _val : '';
  };

  valueFromList = index => {
    let list = [...this.state.valueList];
    list.splice(index, 1);
    this.setState(
      {
        valueList: list,
      },
      () => {
        this.props.handler(
          {
            target: {
              value: this.state.valueList.length ? this.state.valueList : '',
            },
          },
          this.props.item.jsonPath,
          this.props.item.isRequired ? true : false,
          '',
          this.props.item.requiredErrMsg,
          this.props.item.patternErrMsg
        );
      }
    );
  };

  render() {
    // console.log(this.props);
    return <div>{this.renderArrayField(this.props.item)}</div>;
  }
}

const mapStateToProps = state => ({
  formData: state.frameworkForm.form,
});

const mapDispatchToProps = dispatch => ({
  setFormData: data => {
    dispatch({ type: 'SET_FORM_DATA', data });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg, isSuccess, isError) => {
    dispatch({
      type: 'TOGGLE_SNACKBAR_AND_SET_TEXT',
      snackbarState,
      toastMsg,
      isSuccess,
      isError,
    });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UiMultiFieldAddToTable);
