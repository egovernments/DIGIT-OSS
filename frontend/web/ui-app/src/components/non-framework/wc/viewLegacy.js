import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';
import ShowFields from '../../framework/showFields';
import { translate } from '../../common/common';
import Api from '../../../api/api';
import jp from 'jsonpath';
import UiButton from '../../framework/components/UiButton';
import UiDynamicTable from '../../framework/components/UiDynamicTable';
import { fileUpload } from '../../framework/utility/utility';
import UiTable from '../../framework/components/UiTable';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Grid, Row, Col, DropdownButton, Table, ListGroup, ListGroupItem } from 'react-bootstrap';

var specifications = {};

let reqRequired = [];

var CONST_API_GET_FILE = 'filestore/v1/files/id';
class Report extends Component {
  constructor(props) {
    super(props);
  }

  setLabelAndReturnRequired(configObject) {
    if (configObject && configObject.groups) {
      for (var i = 0; configObject && i < configObject.groups.length; i++) {
        configObject.groups[i].label = translate(configObject.groups[i].label);
        for (var j = 0; j < configObject.groups[i].fields.length; j++) {
          configObject.groups[i].fields[j].label = translate(configObject.groups[i].fields[j].label);
        }

        if (configObject.groups[i].children && configObject.groups[i].children.length) {
          for (var k = 0; k < configObject.groups[i].children.length; k++) {
            this.setLabelAndReturnRequired(configObject.groups[i].children[k]);
          }
        }
      }
    }
  }

  setInitialUpdateChildData(form, children) {
    let _form = JSON.parse(JSON.stringify(form));
    for (var i = 0; i < children.length; i++) {
      for (var j = 0; j < children[i].groups.length; j++) {
        if (children[i].groups[j].multiple) {
          var arr = _.get(_form, children[i].groups[j].jsonPath);
          var ind = j;
          var _stringifiedGroup = JSON.stringify(children[i].groups[j]);
          var regex = new RegExp(children[i].groups[j].jsonPath.replace('[', '[').replace(']', ']') + '\\[\\d{1}\\]', 'g');
          for (var k = 1; k < arr.length; k++) {
            j++;
            children[i].groups[j].groups.splice(
              ind + 1,
              0,
              JSON.parse(_stringifiedGroup.replace(regex, children[i].groups[ind].jsonPath + '[' + k + ']'))
            );
            children[i].groups[j].groups[ind + 1].index = ind + 1;
          }
        }

        if (children[i].groups[j].children && children[i].groups[j].children.length) {
          this.setInitialUpdateChildData(form, children[i].groups[j].children);
        }
      }
    }
  }

  hideField(specs, moduleName, actionName, hideObject) {
    if (hideObject.isField) {
      for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
        for (let j = 0; j < specs[moduleName + '.' + actionName].groups[i].fields.length; j++) {
          if (hideObject.name == specs[moduleName + '.' + actionName].groups[i].fields[j].name) {
            specs[moduleName + '.' + actionName].groups[i].fields[j].hide = true;
            break;
          }
        }
      }
    } else {
      let flag = 0;
      for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
        if (hideObject.name == specs[moduleName + '.' + actionName].groups[i].name) {
          flag = 1;
          specs[moduleName + '.' + actionName].groups[i].hide = true;
          break;
        }
      }

      if (flag == 0) {
        for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
          if (specs[moduleName + '.' + actionName].groups[i].children && specs[moduleName + '.' + actionName].groups[i].children.length) {
            for (let j = 0; j < specs[moduleName + '.' + actionName].groups[i].children.length; j++) {
              for (let k = 0; k < specs[moduleName + '.' + actionName].groups[i].children[j].groups.length; k++) {
                if (hideObject.name == specs[moduleName + '.' + actionName].groups[i].children[j].groups[k].name) {
                  specs[moduleName + '.' + actionName].groups[i].children[j].groups[k].hide = true;
                  break;
                }
              }
            }
          }
        }
      }
    }

    return specs;
  }

  showField(specs, moduleName, actionName, showObject) {
    if (showObject.isField) {
      for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
        for (let j = 0; j < specs[moduleName + '.' + actionName].groups[i].fields.length; j++) {
          if (showObject.name == specs[moduleName + '.' + actionName].groups[i].fields[j].name) {
            specs[moduleName + '.' + actionName].groups[i].fields[j].hide = false;
            break;
          }
        }
      }
    } else {
      let flag = 0;
      for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
        if (showObject.name == specs[moduleName + '.' + actionName].groups[i].name) {
          flag = 1;
          specs[moduleName + '.' + actionName].groups[i].hide = false;
          break;
        }
      }

      if (flag == 0) {
        for (let i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
          if (specs[moduleName + '.' + actionName].groups[i].children && specs[moduleName + '.' + actionName].groups[i].children.length) {
            for (let j = 0; j < specs[moduleName + '.' + actionName].groups[i].children.length; j++) {
              for (let k = 0; k < specs[moduleName + '.' + actionName].groups[i].children[j].groups.length; k++) {
                if (showObject.name == specs[moduleName + '.' + actionName].groups[i].children[j].groups[k].name) {
                  specs[moduleName + '.' + actionName].groups[i].children[j].groups[k].hide = false;
                  break;
                }
              }
            }
          }
        }
      }
    }

    return specs;
  }

  setInitialUpdateData(form, specs, moduleName, actionName, objectName) {
    let { setMockData } = this.props;
    let _form = JSON.parse(JSON.stringify(form));
    var ind;
    for (var i = 0; i < specs[moduleName + '.' + actionName].groups.length; i++) {
      if (specs[moduleName + '.' + actionName].groups[i].multiple) {
        var arr = _.get(_form, specs[moduleName + '.' + actionName].groups[i].jsonPath);
        ind = i;
        var _stringifiedGroup = JSON.stringify(specs[moduleName + '.' + actionName].groups[i]);
        var regex = new RegExp(
          specs[moduleName + '.' + actionName].groups[i].jsonPath.replace(/\[/g, '\\[').replace(/\]/g, '\\]') + '\\[\\d{1}\\]',
          'g'
        );
        if (arr != null) {
          for (var j = 1; j < arr.length; j++) {
            i++;
            specs[moduleName + '.' + actionName].groups.splice(
              ind + 1,
              0,
              JSON.parse(_stringifiedGroup.replace(regex, specs[moduleName + '.' + actionName].groups[ind].jsonPath + '[' + j + ']'))
            );
            specs[moduleName + '.' + actionName].groups[ind + 1].index = ind + 1;
          }
        }
      }

      for (var j = 0; j < specs[moduleName + '.' + actionName].groups[i].fields.length; j++) {
        if (
          specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields &&
          specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields.length
        ) {
          for (var k = 0; k < specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields.length; k++) {
            if (
              specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].ifValue ==
              _.get(form, specs[moduleName + '.' + actionName].groups[i].fields[j].jsonPath)
            ) {
              if (
                specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide &&
                specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide.length
              ) {
                for (var a = 0; a < specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide.length; a++) {
                  specs = this.hideField(
                    specs,
                    moduleName,
                    actionName,
                    specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide[a]
                  );
                }
              }

              if (
                specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show &&
                specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length
              ) {
                for (var a = 0; a < specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length; a++) {
                  specs = this.showField(
                    specs,
                    moduleName,
                    actionName,
                    specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show[a]
                  );
                }
              }
            }
          }
        }
      }

      if (specs[moduleName + '.' + actionName].groups[ind || i].children && specs[moduleName + '.' + actionName].groups[ind || i].children.length) {
        this.setInitialUpdateChildData(form, specs[moduleName + '.' + actionName].groups[ind || i].children);
      }
    }

    setMockData(specs);
  }

  initData() {
    specifications = require(`../../framework/specs/wc/master/legacy`).default;

    let { setMetaData, setModuleName, setActionName, setMockData } = this.props;

    let self = this;
    let obj = specifications['wc.view'];
    self.setLabelAndReturnRequired(obj);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('wc');
    setActionName('view');
    //Get view form data
    var url = specifications[`wc.view`].url.split('?')[0];
    var query = {
      consumerNumber: decodeURIComponent(this.props.match.params.id),
    };
    var hideCard;
    Api.commonApiPost(url, query, {}, false, specifications[`wc.view`].useTimestamp).then(
      function(res) {
        if (res.Connection[0].withProperty == true || res.Connection[0].withProperty == 'true') {
          hideCard = JSON.parse(JSON.stringify(specifications));

          hideCard['wc.view'].groups[1].multiple = false;
          self.props.setMockData(hideCard);
        }
        self.props.setFormData(res);
        self.setInitialUpdateData(res, hideCard || JSON.parse(JSON.stringify(specifications)), 'wc', 'view', specifications[`wc.view`].objectName);
      },
      function(err) {}
    );
  }

  componentDidMount() {
    var currentThis = this;
    currentThis.initData();
    //=======================BASED ON APP CONFIG==========================//
    // Api.commonApiPost('/wcms/masters/waterchargesconfig/_search', {
    //   name: "HIERACHYTYPEFORWC"
    // }).then((res1) => {
    //   if(res1.WaterConfigurationValue && res1.WaterConfigurationValue[0] && res1.WaterConfigurationValue[0].value && res1.WaterConfigurationValue[0].value) {
    //
    //     Api.commonApiPost('egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {boundaryTypeName:"ZONE", hierarchyTypeName:res1.WaterConfigurationValue[0].value}).then((response)=>{
    //       if(response) {
    //         let keys=jp.query(response,"$.Boundary.*.code");
    //         let values=jp.query(response,"$.Boundary.*.name");
    //         let dropDownData=[];
    //         for (var k = 0; k < keys.length; k++) {
    //             let obj={};
    //             obj["key"]=keys[k];
    //             obj["value"]=values[k];
    //             dropDownData.push(obj);
    //         }
    //
    //         dropDownData.sort(function(s1, s2) {
    //           return (s1.value < s2.value) ? -1 : (s1.value > s2.value) ? 1 : 0;
    //         });
    //         dropDownData.unshift({key: null, value: "-- Please Select --"});
    //         console.log(dropDownData);
    //       currentThis.props.setDropDownData("Connection[0].connectionLocation.revenueBoundary.code", dropDownData);
    //       currentThis.props.setDropDownData("Connection[0].property.zone", dropDownData);
    //       }
    //     }).catch((err)=> {
    //       console.log(err)
    //     })
    //   }
    //
    // }).catch((err) => {
    //     console.log(err);
    // })
  }

  getVal = (path, isDate) => {
    var val = _.get(this.props.formData, path);

    if (isDate && val && ((val + '').length == 13 || (val + '').length == 12) && new Date(Number(val)).getTime() > 0) {
      var _date = new Date(Number(val));
      return ('0' + _date.getDate()).slice(-2) + '/' + ('0' + (_date.getMonth() + 1)).slice(-2) + '/' + _date.getFullYear();
    } else if (isDate && val === 0) {
      return 'NA';
    }

    return typeof val != 'undefined' && (typeof val == 'string' || typeof val == 'number' || typeof val == 'boolean') ? val + '' : '';
  };

  printer = () => {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    var cdn = `
     <!-- Latest compiled and minified CSS -->
     <link rel="stylesheet" media="all" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

     <!-- Optional theme -->
     <link rel="stylesheet" media="all" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">  `;
    mywindow.document.write('<html><head><title> </title>');
    mywindow.document.write(cdn);
    mywindow.document.write('</head><body>');
    mywindow.document.write(document.getElementById('printable').innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    setTimeout(function() {
      mywindow.print();
      mywindow.close();
    }, 1000);

    return true;
  };

  dcbButton = () => {
    this.props.setRoute('/wc/addDemand/' + encodeURIComponent(this.props.formData.Connection[0].consumerNumber));
  };

  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors } = this.props;
    let { handleChange, getVal, addNewCard, removeCard, printer, dcbButton } = this;

    console.log(formData);

    const renderFiles = function() {
      {
        return (
          formData &&
          formData.Connection &&
          formData.Connection[0] &&
          formData.Connection[0].documents &&
          formData.Connection[0].documents.length &&
          formData.Connection[0].documents.map(function(v, i) {
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{v.name}</td>
                <td>
                  <a
                    href={window.location.origin + '/' + CONST_API_GET_FILE + '?tenantId=' + localStorage.tenantId + '&fileStoreId=' + v.fileStoreId}
                    target="_blank"
                  >
                    {translate('wc.craete.file.Download')}
                  </a>
                </td>
              </tr>
            );
          })
        );
      }
    };

    const renderDocuments = function() {
      if (
        formData &&
        formData.hasOwnProperty('Connection') &&
        formData.Connection.length > 0 &&
        formData.Connection[0] &&
        formData.Connection[0].documents.length > 0
      ) {
        {
          return (
            formData &&
            formData.Connection &&
            formData.Connection[0] &&
            formData.Connection[0].documents &&
            formData.Connection[0].documents.length &&
            formData.Connection.map(function(v, i) {
              return (
                <Card className="uiCard">
                  <CardHeader
                    title={
                      <div
                        style={{
                          color: '#354f57',
                          fontSize: 18,
                          margin: '8px 0',
                        }}
                      >
                        {translate('tl.table.title.supportDocuments')}
                      </div>
                    }
                  />
                  <CardText>
                    <Table bordered responsive className="table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>{translate('tl.create.license.table.documentName')}</th>
                          <th>{translate('tl.create.license.table.file')}</th>
                        </tr>
                      </thead>
                      <tbody>{renderFiles()}</tbody>
                    </Table>
                  </CardText>
                </Card>
              );
            })
          );
        }
      }
    };

    const renderTable = function() {
      if (moduleName && actionName && formData && formData[objectName]) {
        var objectName = mockData[`${moduleName}.${actionName}`].objectName;
        if (formData[objectName].documents && formData[objectName].documents.length) {
          var dataList = {
            resultHeader: ['#', 'Name', 'File'],
            resultValues: [],
          };

          for (var i = 0; i < formData[objectName].documents.length; i++) {
            dataList.resultValues.push([
              i + 1,
              formData[objectName].documents[i].name || 'File',
              '<a href=/filestore/v1/files/id?tenantId=' +
                localStorage.getItem('tenantId') +
                '&fileStoreId=' +
                formData[objectName].documents[i].fileStoreId +
                '>Download</a>',
            ]);
          }

          return <UiTable resultList={dataList} />;
        }
      }
    };
    return (
      <div className="Report">
        <form id="printable">
          {!_.isEmpty(mockData) &&
            mockData['wc.view'] && (
              <ShowFields
                groups={mockData['wc.view'].groups}
                noCols={mockData['wc.view'].numCols}
                ui="google"
                handler={''}
                getVal={getVal}
                fieldErrors={fieldErrors}
                useTimestamp={mockData['wc.view'].useTimestamp || false}
                addNewCard={''}
                removeCard={''}
                screen="view"
              />
            )}
          <br />
          {renderTable()}
          {renderDocuments()}
          <br />
        </form>

        <div style={{ textAlign: 'center' }}>
          <RaisedButton
            label="Print"
            primary={true}
            onClick={e => {
              printer();
            }}
          />&nbsp;
          {this.props.formData &&
            this.props.formData.Connection &&
            this.props.formData.Connection[0] &&
            this.props.formData.Connection[0].isLegacy &&
            this.props.formData.Connection[0].billingType == 'NONMETERED' && (
              <RaisedButton
                label="Add/ Edit DCB"
                primary={true}
                onClick={e => {
                  dcbButton();
                }}
              />
            )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  metaData: state.framework.metaData,
  mockData: state.framework.mockData,
  moduleName: state.framework.moduleName,
  actionName: state.framework.actionName,
  formData: state.frameworkForm.form,
  fieldErrors: state.frameworkForm.fieldErrors,
});

const mapDispatchToProps = dispatch => ({
  setFormData: data => {
    dispatch({ type: 'SET_FORM_DATA', data });
  },
  setMetaData: metaData => {
    dispatch({ type: 'SET_META_DATA', metaData });
  },
  setMockData: mockData => {
    dispatch({ type: 'SET_MOCK_DATA', mockData });
  },
  setModuleName: moduleName => {
    dispatch({ type: 'SET_MODULE_NAME', moduleName });
  },
  setActionName: actionName => {
    dispatch({ type: 'SET_ACTION_NAME', actionName });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
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
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Report);
