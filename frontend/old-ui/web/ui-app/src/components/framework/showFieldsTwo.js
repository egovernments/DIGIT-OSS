import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';

import UiTextField from './components/UiTextField';
import UiSelectField from './components/UiSelectField';
import UiButton from './components/UiButton';
import UiCheckBox from './components/UiCheckBox';
import UiEmailField from './components/UiEmailField';
import UiMobileNumber from './components/UiMobileNumber';
import UiTextArea from './components/UiTextArea';
import UiMultiSelectField from './components/UiMultiSelectField';
import UiNumberField from './components/UiNumberField';
import UiDatePicker from './components/UiDatePicker';
import UiMultiFileUpload from './components/UiMultiFileUpload';
import UiSingleFileUpload from './components/UiSingleFileUpload';
import UiAadharCard from './components/UiAadharCard';
import UiPanCard from './components/UiPanCard';
import UiLabel from './components/UiLabel';
import UiRadioButton from './components/UiRadioButton';
import UiTextSearch from './components/UiTextSearch';
import UiDocumentList from './components/UiDocumentList';
import FloatingActionButton from 'material-ui/FloatingActionButton';

//lodash
import _ from 'lodash';

//api
import Api from '../../api/api';

//json evalutor

import jp from 'jsonpath';

//utility
import { fileUpload, getInitiatorPosition } from './utility/utility';

// functions
const getPath = (mockData, moduleName, actionName, value) => {
  return getFromGroup(mockData[moduleName + '.' + actionName].groups, value);
};

const getFromGroup = function(groups, value) {
  for (var i = 0; i < groups.length; i++) {
    if (groups[i].children) {
      for (var j = 0; j < groups[i].children.length; i++) {
        if (groups[i].children[j].jsonPath == value) {
          return 'groups[' + i + '].children[' + j + '].groups';
        } else {
          return 'groups[' + i + '].children[' + j + '][' + getFromGroup(groups[i].children[j].groups) + ']';
        }
      }
    }
  }
};

const incrementIndexValue = (formData, group, jsonPath) => {
  var length = _.get(formData, jsonPath) ? _.get(formData, jsonPath).length : 0;
  var _group = JSON.stringify(group);
  var regexp = new RegExp(jsonPath + '\\[\\d{1}\\]', 'g');
  _group = _group.replace(regexp, jsonPath + '[' + (length + 1) + ']');
  return JSON.parse(_group);
};

const getNewSpecs = (moduleName, actionName, group, updatedSpecs, path) => {
  let groupsArray = _.get(updatedSpecs[moduleName + '.' + actionName], path);
  groupsArray.push(group);
  _.set(updatedSpecs[moduleName + '.' + actionName], path, groupsArray);
  return updatedSpecs;
};

const checkIfHasShowHideFields = (jsonPath, val) => {
  let _mockData = { ...this.props.mockData };
  let { moduleName, actionName, setMockData } = this.props;
  for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
    for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
      if (
        jsonPath == _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath &&
        _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields &&
        _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields.length
      ) {
        for (let k = 0; k < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields.length; k++) {
          if (val == _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].ifValue) {
            for (let y = 0; y < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide.length; y++) {
              _mockData = this.hideField(
                moduleName,
                actionName,
                _mockData,
                _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide[y]
              );
            }

            for (let z = 0; z < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length; z++) {
              _mockData = this.showField(
                moduleName,
                actionName,
                _mockData,
                _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show[z]
              );
            }
          } else {
            for (let y = 0; y < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide.length; y++) {
              _mockData = this.hideField(
                moduleName,
                actionName,
                _mockData,
                _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide[y],
                true
              );
            }

            for (let z = 0; z < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length; z++) {
              _mockData = this.showField(
                moduleName,
                actionName,
                _mockData,
                _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show[z],
                true
              );
            }
          }
        }
      }
    }
  }

  return _mockData;
};

const hideField = (moduleName, actionName, _mockData, hideObject, reset) => {
  if (hideObject.isField) {
    for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
      for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
        if (hideObject.name == _mockData[moduleName + '.' + actionName].groups[i].fields[j].name) {
          _mockData[moduleName + '.' + actionName].groups[i].fields[j].hide = reset ? false : true;
        }
      }
    }
  } else {
    for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
      if (hideObject.name == _mockData[moduleName + '.' + actionName].groups[i].name) {
        _mockData[moduleName + '.' + actionName].groups[i].hide = reset ? false : true;
      }
    }
  }

  return _mockData;
};

const showField = (moduleName, actionName, _mockData, showObject, reset) => {
  if (showObject.isField) {
    for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
      for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
        if (showObject.name == _mockData[moduleName + '.' + actionName].groups[i].fields[j].name) {
          _mockData[moduleName + '.' + actionName].groups[i].fields[j].hide = reset ? true : false;
        }
      }
    }
  } else {
    for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
      if (showObject.name == _mockData[moduleName + '.' + actionName].groups[i].name) {
        _mockData[moduleName + '.' + actionName].groups[i].hide = reset ? true : false;
      }
    }
  }

  return _mockData;
};

//components
const RenderField = props => {
  let { item, screen, fieldErrors, handler, ui, useTimestamp, getVal, autoComHandler } = props;
  if (screen == 'view') {
    item.type = 'label';
  }
  switch (item.type) {
    case 'text':
      return <UiTextField ui={ui} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} />;
      break;
    case 'singleValueList':
      return <UiSelectField ui={ui} useTimestamp={useTimestamp} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} />;
      break;
    case 'multiValueList':
      return <UiSingleFileUpload ui={ui} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} />;
      break;
    case 'number':
      return <UiNumberField ui={ui} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} />;
      break;
    case 'textarea':
      return <UiTextArea ui={ui} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} />;
      break;
    case 'mobileNumber':
      return <UiMobileNumber ui={ui} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} />;
      break;
    case 'checkbox':
      return <UiCheckBox ui={ui} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} />;
      break;
    case 'email':
      return <UiEmailField ui={ui} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} />;
      break;
    case 'button':
      return <UiButton ui={ui} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} />;
      break;
    case 'datePicker':
      return <UiDatePicker ui={ui} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} />;
      break;
    case 'singleFileUpload':
      return <UiSingleFileUpload ui={ui} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} />;
      break;

    case 'multiFileUpload':
      return <UiMultiSelectField ui={ui} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} />;
    case 'pan':
      return <UiPanCard ui={ui} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} />;
    case 'aadhar':
      return <UiAadharCard ui={ui} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} />;
    case 'label':
      return <UiLabel getVal={getVal} item={item} />;
    case 'radio':
      return <UiRadioButton ui={ui} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} />;
    case 'textSearch':
      return <UiTextSearch ui={ui} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} autoComHandler={autoComHandler} />;
    case 'documentList':
      return <UiDocumentList ui={ui} getVal={getVal} item={item} fieldErrors={fieldErrors} handler={handler} />;
  }
};

// class RenderGroups extends Component {
//   constructor(props) {
//       super(props)
//   }
//
//   render()
//   {
//     return (<div> abc </div>)
//   }
// }

const RenderGroups = props => {
  let {
    groups,
    noCols,
    uiFramework,
    useTimestamp,
    jsonPath,
    screen,
    handleChange,
    fieldErrors,
    formData,
    getVal,
    changeExpanded,
    groupStatus,
    addNewCard,
    removeCard,
    autoComHandler,
  } = props;
  switch (uiFramework) {
    case 'google':
      return groups.map((group, groupIndex) => {
        return (
          <Card
            style={{ display: group.hide ? 'none' : 'block' }}
            className="uiCard"
            key={groupIndex}
            expanded={groupStatus[group.name] ? false : true}
            onExpandChange={() => {
              changeExpanded(group.name);
            }}
          >
            <CardHeader title={group.label} showExpandableButton={true} actAsExpander={true} />
            <CardText style={{ padding: 0 }} expandable={true}>
              <Grid>
                <Row>
                  {group.fields.map((field, fieldIndex) => {
                    if (!field.isHidden) {
                      return (
                        <Col key={fieldIndex} xs={12} md={noCols}>
                          {/*renderField(field, self.props.screen)*/}
                          <RenderField
                            field={field}
                            screen={''}
                            handler={handleChange}
                            fieldErrors={fieldErrors}
                            ui={uiFramework}
                            formData={formData}
                            getVal={getVal}
                            autoComHandler={autoComHandler}
                          />
                        </Col>
                      );
                    }
                  })}
                </Row>
                {group.multiple && (
                  <Row
                    style={{
                      visibility: groupIndex == groups.length - 1 ? 'initial' : 'hidden',
                    }}
                  >
                    <Col xsOffset={8} mdOffset={10} xs={4} md={2}>
                      <FloatingActionButton
                        mini={true}
                        onClick={() => {
                          addNewCard(group, jsonPath);
                        }}
                      >
                        <span className="glyphicon glyphicon-plus" />
                      </FloatingActionButton>
                    </Col>
                  </Row>
                )}
                {group.multiple && (
                  <Row
                    style={{
                      visibility: groupIndex < groups.length - 1 ? 'initial' : 'hidden',
                    }}
                  >
                    <Col xsOffset={8} mdOffset={10} xs={4} md={2}>
                      <FloatingActionButton
                        mini={true}
                        secondary={true}
                        onClick={() => {
                          removeCard(jsonPath, groupIndex);
                        }}
                      >
                        <span className="glyphicon glyphicon-minus" />
                      </FloatingActionButton>
                    </Col>
                  </Row>
                )}
              </Grid>
              <div style={{ marginLeft: '15px' }}>
                {group.children && group.children.length
                  ? group.children.map(function(child) {
                      return (
                        <RenderGroups
                          groups={groups}
                          getVal={getVal}
                          addNewCard={addNewCard}
                          removeCard={removeCard}
                          changeExpanded={changeExpanded}
                          noCols={noCols}
                          uiFramework={uiFramework ? uiFramework : 'google'}
                          useTimestamp={useTimestamp}
                          jsonPath={jsonPath ? jsonPath : ''}
                          fieldErrors={fieldErrors}
                          handleChange={handleChange}
                        />
                      );
                    })
                  : ''}
              </div>
            </CardText>
          </Card>
        );
      });
      break;
  }
};

class ShowFields extends Component {
  constructor(props) {
    super(props);
    this.state = { groupStatus: {} };
  }

  //handling auto complete in depedants
  autoComHandler = (autoObject, path) => {
    let self = this;
    var value = this.getVal(path);
    if (!value) return;
    var url = autoObject.autoCompleteUrl.split('?')[0];
    var hashLocation = window.location.hash;
    var query = {
      [autoObject.autoCompleteUrl.split('?')[1].split('=')[0]]: value,
    };
    let { mockData } = this.props;
    Api.commonApiPost(url, query, {}, false, mockData[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].useTimestamp).then(
      function(res) {
        var formData = { ...self.props.formData };
        for (var key in autoObject.autoFillFields) {
          _.set(formData, key, _.get(res, autoObject.autoFillFields[key]));
        }
        self.props.setFormData(formData);
      },
      function(err) {
        console.log(err);
      }
    );
  };

  checkCustomFields = (formData, cb) => {
    var self = this;
    if (
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].customFields &&
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].customFields.initiatorPosition
    ) {
      var jPath = self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].customFields.initiatorPosition;
      getInitiatorPosition(function(err, pos) {
        if (err) {
          self.toggleSnackbarAndSetText(true, err.message);
        } else {
          _.set(formData, jPath, pos);
          cb(formData);
        }
      });
    } else {
      cb(formData);
    }
  };

  getVal = path => {
    let { formData } = this.props;
    return _.get(formData, path) || '';
  };

  handleChange = (e, property, isRequired, pattern, requiredErrMsg = 'Required', patternErrMsg = 'Pattern Missmatch') => {
    let { getVal } = this;
    let { handleChange, mockData, setDropDownData, setMockData } = this.props;
    let hashLocation = window.location.hash;
    let obj = mockData[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`];
    // console.log(obj);
    let depedants = jp.query(obj, `$.groups..fields[?(@.jsonPath=="${property}")].depedants.*`);
    setMockData(checkIfHasShowHideFields(property, e.target.value));
    handleChange(e, property, isRequired, pattern, requiredErrMsg, patternErrMsg);

    _.forEach(depedants, function(value, key) {
      if (value.type == 'dropDown') {
        let splitArray = value.pattern.split('?');
        let context = '';
        let id = {};
        // id[splitArray[1].split("&")[1].split("=")[0]]=e.target.value;
        for (var j = 0; j < splitArray[0].split('/').length; j++) {
          context += splitArray[0].split('/')[j] + '/';
        }

        let queryStringObject = splitArray[1].split('|')[0].split('&');
        for (var i = 0; i < queryStringObject.length; i++) {
          if (i) {
            if (queryStringObject[i].split('=')[1].search('{') > -1) {
              if (
                queryStringObject[i]
                  .split('=')[1]
                  .split('{')[1]
                  .split('}')[0] == property
              ) {
                id[queryStringObject[i].split('=')[0]] = e.target.value || '';
              } else {
                id[queryStringObject[i].split('=')[0]] = getVal(
                  queryStringObject[i]
                    .split('=')[1]
                    .split('{')[1]
                    .split('}')[0]
                );
              }
            } else {
              id[queryStringObject[i].split('=')[0]] = queryStringObject[i].split('=')[1];
            }
          }
        }

        Api.commonApiPost(context, id).then(
          function(response) {
            let keys = jp.query(response, splitArray[1].split('|')[1]);
            let values = jp.query(response, splitArray[1].split('|')[2]);
            let dropDownData = [];
            for (var k = 0; k < keys.length; k++) {
              let obj = {};
              obj['key'] = keys[k];
              obj['value'] = values[k];
              dropDownData.push(obj);
            }
            setDropDownData(value.jsonPath, dropDownData);
          },
          function(err) {
            console.log(err);
          }
        );
        // console.log(id);
        // console.log(context);
      } else if (value.type == 'textField') {
        let object = {
          target: {
            value: eval(eval(value.pattern)),
          },
        };
        handleChange(object, value.jsonPath, value.isRequired, value.rg, value.requiredErrMsg, value.patternErrMsg);
      }
    });
  };

  addNewCard = (group, jsonPath) => {
    let { setMockData, mockData, metaData, moduleName, actionName, formData } = this.props;
    group = JSON.parse(JSON.stringify(group));
    //Increment the values of indexes
    var grp = _.get(metaData[moduleName + '.' + actionName], getPath(mockData, moduleName, actionName, jsonPath) + '[0]');
    group = incrementIndexValue(formData, grp, jsonPath);
    //Push to the path
    var updatedSpecs = getNewSpecs(
      moduleName,
      actionName,
      group,
      JSON.parse(JSON.stringify(mockData)),
      getPath(mockData, moduleName, actionName, jsonPath)
    );
    //Create new mock data
    setMockData(updatedSpecs);
  };

  removeCard = (jsonPath, index) => {
    //Remove at that index and update upper array values
    let { mockData, setMockData, formData } = this.props;
  };

  changeExpanded = name => {
    this.setState({
      groupStatus: {
        [name]: !this.state.groupStatus[name],
      },
    });
  };

  render() {
    let { groups, noCols, uiFramework, useTimestamp, fieldErrors, jsonPath } = this.props;
    let { handleChange, getVal, changeExpanded, addNewCard, removeCard, autoComHandler } = this;
    return;
    <RenderGroups
      groups={groups}
      getVal={getVal}
      addNewCard={addNewCard}
      removeCard={removeCard}
      changeExpanded={changeExpanded}
      noCols={noCols}
      uiFramework={uiFramework ? uiFramework : 'google'}
      useTimestamp={useTimestamp}
      jsonPath={jsonPath ? jsonPath : ''}
      fieldErrors={fieldErrors}
      handleChange={handleChange}
    />;
  }
}

//  {/*<RenderGroups />*/}
const mapStateToProps = state => ({
  metaData: state.framework.metaData,
  // mockData: state.framework.mockData,
  // moduleName:state.framework.moduleName,
  // actionName:state.framework.actionName,
  formData: state.frameworkForm.form,
  fieldErrors: state.frameworkForm.fieldErrors,
  // isFormValid: state.frameworkForm.isFormValid
});

const mapDispatchToProps = dispatch => ({
  initForm: requiredFields => {
    dispatch({
      type: 'SET_REQUIRED_FIELDS',
      requiredFields,
    });
  },
  setMetaData: metaData => {
    dispatch({ type: 'SET_META_DATA', metaData });
  },
  setMockData: mockData => {
    dispatch({ type: 'SET_MOCK_DATA', mockData });
  },
  setFormData: data => {
    dispatch({ type: 'SET_FORM_DATA', data });
  },
  setModuleName: moduleName => {
    dispatch({ type: 'SET_MODULE_NAME', moduleName });
  },
  setActionName: actionName => {
    dispatch({ type: 'SET_ACTION_NAME', actionName });
  },
  handleChange: (e, property, isRequired, pattern, requiredErrMsg, patternErrMsg) => {
    dispatch({
      type: 'HANDLE_CHANGE_FRAMEWORK',
      property,
      value: e.target.value,
      isRequired,
      pattern,
      requiredErrMsg,
      patternErrMsg,
    });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg, isSuccess, isError) => {
    console.log(toastMsg);
    console.log(isSuccess);
    dispatch({
      type: 'TOGGLE_SNACKBAR_AND_SET_TEXT',
      snackbarState,
      toastMsg,
      isSuccess,
      isError,
    });
  },
  setDropDownData: (fieldName, dropDownData) => {
    dispatch({ type: 'SET_DROPDWON_DATA', fieldName, dropDownData });
  },
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowFields);
// export default ShowFields;
