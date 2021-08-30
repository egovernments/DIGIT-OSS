import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import _ from 'lodash';
import ShowFields from '../../../framework/showFields';

import { translate } from '../../../common/common';
import Api from '../../../../api/api';
import jp from 'jsonpath';
import UiButton from '../../../framework/components/UiButton';
import { fileUpload, getInitiatorPosition } from '../../../framework/utility/utility';
import $ from 'jquery';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import UiTable from '../../../framework/components/UiTable';
import UiBackButton from '../../../framework/components/UiBackButton';
import UiEditButton from '../../../framework/components/UiEditButton';

var specifications = {};
const styles = {
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

var CONST_API_GET_FILE = 'filestore/v1/files/id';
let reqRequired = [];
class assetMovableView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responseHolder: '',
    };
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
        for (var j = 1; j < arr.length; j++) {
          i++;
          specs[moduleName + '.' + actionName].groups.splice(
            j + 1,
            0,
            JSON.parse(_stringifiedGroup.replace(regex, specs[moduleName + '.' + actionName].groups[ind].jsonPath + '[' + j + ']'))
          );
          specs[moduleName + '.' + actionName].groups[ind + 1].index = ind + 1;
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
                  this.hideField(specs, moduleName, actionName, specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide[a]);
                }
              }

              if (
                specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show &&
                specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length
              ) {
                for (var a = 0; a < specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length; a++) {
                  this.showField(specs, moduleName, actionName, specs[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show[a]);
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
  shouldLoadFromCache = () => {
     let previousRoute = window.localStorage.getItem('previousRoute');
     previousRoute = previousRoute ? previousRoute : '';
     let currentRoute = window.location.hash.split('#')[1];
     console.log(previousRoute);
     previousRoute = previousRoute.replace(/assetMovableCreate|update/, 'assetMovableView');
     console.log(previousRoute);
     console.log(currentRoute);
     const shouldCache = currentRoute.indexOf(previousRoute) !== -1 ? true : false;
     console.log(shouldCache);
    return shouldCache;
   };
   loadData = async (url,query, specifications, hashLocation) => {
     const cacheKey = 'asset' + '.' + this.props.match.params.id + '.assetMovable.search';
     console.log(cacheKey);
     let res = window.sessionStorage.getItem(cacheKey);
     console.log(res);
     let loadFromCache=this.shouldLoadFromCache();
     console.log(loadFromCache);
     if (loadFromCache && res) {
       console.log("inside if");
       res = JSON.parse(res);
       console.log(res);
     } else {
       console.log("inside else");
       // res = await Api.commonApiPost(
       //   url,
       //   query,
       //   _body,
       //   false,
       //   specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].useTimestamp
       // );
      res =Api.commonApiPost(url, query, {}, false, specifications['asset.view'].useTimestamp);
     }

     return res;
   };
   initData = async () => {
     // try {
     //   var hash = window.location.hash.split("/");
     //   if(hash.length == 4) {
     //     specifications = require(`./specs/${hash[2]}/${hash[2]}`).default;
     //   } else {
     //     specifications = require(`./specs/${hash[2]}/master/${hash[3]}`).default;
     //   }
     // } catch(e) {
     //
     // }

     specifications = require(`../../../framework/specs/asset/master/assetMovable`).default;

     let { setMetaData, setModuleName, setActionName, setMockData } = this.props;
     let hashLocation = window.location.hash;
     let self = this;
     let obj = specifications['asset.view'];
     self.setLabelAndReturnRequired(obj);
     setMetaData(specifications);
     setMockData(JSON.parse(JSON.stringify(specifications)));
     setModuleName('asset');
     setActionName('view');
     //Get view form data
     var url = specifications['asset.view'].url.split('?')[0];
     var hash = window.location.hash.split('/');
     var value = self.props.match.params.id;
     var query = {
       [specifications['asset.view'].url.split('?')[1].split('=')[0]]: value,
     };

     if (window.location.href.indexOf('?') > -1) {
       var qs = window.location.href.split('?')[1];
       if (qs && qs.indexOf('=') > -1) {
         qs = qs.indexOf('&') > -1 ? qs.split('&') : [qs];
         for (var i = 0; i < qs.length; i++) {
           query[qs[i].split('=')[0]] = qs[i].split('=')[1];
         }
       }
     }
const res = await this.loadData(url,query, specifications, hashLocation);
     // Api.commonApiPost(url, query, {}, false, specifications['asset.view'].useTimestamp).then(
     //   function(res) {
         self.props.setFormData(res);
     //   },
     //   function(err) {}
     // );
   }

  // initData() {
  //   // try {
  //   //   var hash = window.location.hash.split("/");
  //   //   if(hash.length == 4) {
  //   //     specifications = require(`./specs/${hash[2]}/${hash[2]}`).default;
  //   //   } else {
  //   //     specifications = require(`./specs/${hash[2]}/master/${hash[3]}`).default;
  //   //   }
  //   // } catch(e) {
  //   //
  //   // }
  //
  //   specifications = require(`../../../framework/specs/asset/master/assetMovable`).default;
  //
  //   let { setMetaData, setModuleName, setActionName, setMockData } = this.props;
  //   let hashLocation = window.location.hash;
  //   let self = this;
  //   let obj = specifications['asset.view'];
  //   self.setLabelAndReturnRequired(obj);
  //   setMetaData(specifications);
  //   setMockData(JSON.parse(JSON.stringify(specifications)));
  //   setModuleName('asset');
  //   setActionName('view');
  //   //Get view form data
  //   var url = specifications['asset.view'].url.split('?')[0];
  //   var hash = window.location.hash.split('/');
  //   var value = self.props.match.params.id;
  //   var query = {
  //     [specifications['asset.view'].url.split('?')[1].split('=')[0]]: value,
  //   };
  //
  //   if (window.location.href.indexOf('?') > -1) {
  //     var qs = window.location.href.split('?')[1];
  //     if (qs && qs.indexOf('=') > -1) {
  //       qs = qs.indexOf('&') > -1 ? qs.split('&') : [qs];
  //       for (var i = 0; i < qs.length; i++) {
  //         query[qs[i].split('=')[0]] = qs[i].split('=')[1];
  //       }
  //     }
  //   }
  //
  //   Api.commonApiPost(url, query, {}, false, specifications['asset.view'].useTimestamp).then(
  //     function(res) {
  //       self.props.setFormData(res);
  //     },
  //     function(err) {}
  //   );
  // }

  componentDidMount() {
    this.initData();
  }

  getVal = (path, isDate) => {
    var val = _.get(this.props.formData, path);
    let self = this;
    let spec = self.props.mockData;
    if (this.props.mockData) {
      for (var q = 0; q < spec[`asset.view`].groups.length; q++) {
        for (var l = 0; l < spec[`asset.view`].groups[q].fields.length; l++) {
          if (spec[`asset.view`].groups[q].fields[l].jsonPath == path && spec[`asset.view`].groups[q].fields[l].isComma) {
            // var stringVal = val;
            if (val != null || val != undefined) {
              let _commaVal = val.toString();
              var y = _commaVal.split('.')[1];
              _commaVal = _commaVal.split('.')[0];
              var lastThree = _commaVal.substring(_commaVal.length - 3);
              var otherNumbers = _commaVal.substring(0, _commaVal.length - 3);
              if (otherNumbers != '') lastThree = ',' + lastThree;
              var resCal = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
              var res = y == null ? resCal : resCal + '.' + y;
              return res;
            }
          }
        }
      }
    }

    if (isDate && val && ((val + '').length == 13 || (val + '').length == 12) && new Date(Number(val)).getTime() > 0) {
      var _date = new Date(Number(val));
      return ('0' + _date.getDate()).slice(-2) + '/' + ('0' + (_date.getMonth() + 1)).slice(-2) + '/' + _date.getFullYear();
    }

    return typeof val != 'undefined' && (typeof val == 'string' || typeof val == 'number' || typeof val == 'boolean')
      ? (val === true || val === 'true' ? 'Yes' : val === 'false' || val === false ? 'No' : val) + ''
      : '';
  };

  dateConversion = date => {
    var finOpeningDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    return finOpeningDate;
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

  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors, date, match } = this.props;
    let { handleChange, getVal, addNewCard, removeCard, printer, feeMatrices } = this;
    let customActionsAndUrl =
      !_.isEmpty(mockData[`${moduleName}.${actionName}`]) && mockData[`${moduleName}.${actionName}`].hasOwnProperty('customActionsAndUrl')
        ? mockData[`${moduleName}.${actionName}`]['customActionsAndUrl'][0].url
        : '';
    let self = this;
    var mappingObject;

    const renderOpeningValues = function() {
      let self = this;
      if (formData && formData.hasOwnProperty('Assets') && formData.Assets[0].hasOwnProperty('openingDate')) {
        var varopeningDate = new Date(formData.Assets[0].openingDate);
        var vargrossValue = formData.Assets[0].grossValue;
        let finOpeningDate =
          ('0' + varopeningDate.getDate()).slice(-2) + '/' + ('0' + (varopeningDate.getMonth() + 1)).slice(-2) + '/' + varopeningDate.getFullYear();
        return (
          <CardText>
            <Col xs={12} md={3}>
              <Col style={{ textAlign: 'left' }}>
                <label>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{translate('ac.create.Opening.date')}</span>
                </label>
              </Col>
              <Col style={{ textAlign: 'left' }}>
                <label>
                  <span style={{ fontWeight: 400, fontSize: '13px' }}>{finOpeningDate}</span>
                </label>
              </Col>
            </Col>
            <Col xs={12} md={3}>
              <Col style={{ textAlign: 'left' }}>
                <label>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{translate('ac.create.Opening.Written.down.Value')}</span>
                </label>
              </Col>
              <Col style={{ textAlign: 'left' }}>
                <label>
                  <span style={{ fontWeight: 400, fontSize: '13px' }}>{vargrossValue}</span>
                </label>
              </Col>
            </Col>
          </CardText>
        );
      }
    };

    const renderGrid = function() {
      if (formData && formData.hasOwnProperty('Assets') && formData.Assets[0].hasOwnProperty('transactionHistory')) {
        if (!self.state.responseHolder)
          Api.commonApiPost('/asset-services-maha/assets/_search', {
            id: formData.Assets[0].id,
            isTransactionHistoryRequired: true,
          }).then(
            function(response) {
              if (
                response &&
                response.hasOwnProperty('Assets') &&
                response.Assets[0].hasOwnProperty('transactionHistory') &&
                response.Assets[0].transactionHistory != null
              ) {
                self.setState({
                  responseHolder: response.Assets[0].transactionHistory,
                });
              }
            },
            function(err) {
              console.log(err);
            }
          );
        mappingObject = self.state.responseHolder;
        if (mappingObject != null) {
          return (
            <div>
              <CardText>
                <Table bordered responsive className="table-striped">
                  <thead>
                    <tr>
                      <th>{translate('S.No.')}</th>
                      <th>{translate('Transaction Date')}</th>
                      <th>{translate('WDV before transaction (Rs.)')}</th>
                      <th>{translate('Transaction Type')}</th>
                      <th>{translate('Transaction Amount(Rs.)')}</th>
                      <th>{translate('Closing WDV(Rs.)')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappingObject &&
                      mappingObject.map(function(item, index) {
                        let date = new Date(item.transactionDate);
                        let finDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{finDate}</td>
                            <td>{item.valueBeforeTransaction}</td>
                            <td>{item.transactionType}</td>
                            <td>{item.transactionAmount}</td>
                            <td>{item.valueAfterTransaction}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </CardText>
            </div>
          );
        }
      }
    };
    const renderBody = function() {
      // if (formData && formData.hasOwnProperty('Assets') && formData.Assets[0].hasOwnProperty('titleDocumentsAvailable')) {
      //   if(typeof(formData.Assets[0].titleDocumentsAvailable)=='object'){
      //   formData.Assets[0].titleDocumentsAvailable=formData.Assets[0].titleDocumentsAvailable.join(',');
      //   //console.log(formData.Assets[0].titleDocumentsAvailable);
      // }
      // }
      if (formData && formData.hasOwnProperty('Assets') && formData.Assets[0].hasOwnProperty('assetAttributes')) {
        var createCustomObject = formData.Assets[0].assetAttributes;
        var disArray = [];
        _.forEach(createCustomObject, function(value, key) {
          var temp = {};
          if(value.type == "Image"){
            temp.imagePath = value.value;
          } else {
            temp.value = value.value;
          }
          temp.label = value.key;
          disArray.push(temp);
        });
        return (
          <div>
            <Card className="uiCard">
              <CardHeader title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('as.assetAttributes')}</div>} />
              <CardText>
                <Row>
                  {disArray.map(function(item, index) {
                    return (
                      <Col xs={12} md={3}>
                        <Col style={{ textAlign: 'left' }}>
                          <label>
                            <span style={{ fontWeight: 600, fontSize: '13px' }}>{item.label}</span>
                          </label>
                        </Col>
                        <Col style={{ textAlign: 'left' }}>
                          <label>
                            <span style={{ fontWeight: 500, fontSize: '13px' }}>
                              {item.value ? (typeof item.value == 'object' ? item.value[Object.keys(item.value)[0]] : item.value) : (item.imagePath ? <img src={item.imagePath} width={item.width || '20%'} height={item.height || '60%'} /> : "NA") }
                            </span>
                          </label>
                        </Col>
                      </Col>
                    );
                  })}
                </Row>
              </CardText>
            </Card>
          </div>
        );
      }
    };

    return (
      <div className="Report">
        <Row>
          <Col xs={6} md={6}>
            <h3 style={{ paddingLeft: 15, marginBottom: '0' }}>
              {!_.isEmpty(mockData) &&
              moduleName &&
              actionName &&
              mockData[`${moduleName}.${actionName}`] &&
              mockData[`${moduleName}.${actionName}`].title
                ? translate(mockData[`${moduleName}.${actionName}`].title)
                : ''}
            </h3>
          </Col>
        </Row>

        <Row>
          <Col xs={6} md={6}>
            <div
              style={{
                marginLeft: '16px',
              }}
            >
              <UiBackButton />
            </div>
          </Col>
          <Col xs={6} md={6}>
            <div style={{ textAlign: 'right', marginRight: '16px' }}>
              <UiButton
                item={{ label: 'Print', uiType: 'view' }}
                ui="google"
                icon={
                  <i style={{ color: 'white' }} className="material-icons">
                    print
                  </i>
                }
                handler={printer}
              />{' '}
              &nbsp;&nbsp;
              <UiEditButton customUrl={'/non-framework/asset/master/assetMovableCreate/' + (!_.isEmpty(match) ? match.params.id : '')} />
            </div>
          </Col>
        </Row>
        <form id="printable">
          {!_.isEmpty(mockData) &&
            mockData['asset.view'] && (
              <ShowFields
                groups={mockData['asset.view'].groups}
                noCols={mockData['asset.view'].numCols}
                ui="google"
                handler={''}
                getVal={getVal}
                fieldErrors={fieldErrors}
                useTimestamp={mockData['asset.view'].useTimestamp || false}
                addNewCard={''}
                removeCard={''}
                screen="view"
              />
            )}
          <div />
          <div>{renderBody()}</div>
          <Card className="uiCard">
            <CardHeader title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }} />} />
            <CardText>
              <label>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>{translate('ac.create.Asset.account.code')}</span>
              </label>
              <br />
              <label>
                <span style={{ fontWeight: 500, fontSize: '13px' }}>
                  {formData.Assets && formData.Assets[0] && formData.Assets[0].assetAccount ? formData.Assets[0].assetAccount : ''}
                </span>
              </label>
              <br />
              <br />
              <label>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>{translate('ac.create.Accumulated.Depreciation.Account')}</span>
              </label>
              <br />
              <label>
                <span style={{ fontWeight: 500, fontSize: '13px' }}>
                  {formData.Assets && formData.Assets[0] && formData.Assets[0].accumulatedDepreciationAccount
                    ? formData.Assets[0].accumulatedDepreciationAccount
                    : ''}
                </span>
              </label>
              <br />
              <br />
              <label>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>{translate('ac.create.Revaluation.Reserve.Account')}</span>
              </label>
              <br />
              <label>
                <span style={{ fontWeight: 500, fontSize: '13px' }}>
                  {formData.Assets && formData.Assets[0] && formData.Assets[0].revaluationReserveAccount
                    ? formData.Assets[0].revaluationReserveAccount
                    : ''}
                </span>
              </label>
              <br />
              <br />
              <label>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>{translate('ac.create.Depreciation.Expenses.Account')}</span>
              </label>
              <br />
              <label>
                <span style={{ fontWeight: 500, fontSize: '13px' }}>
                  {formData.Assets && formData.Assets[0] && formData.Assets[0].depreciationExpenseAccount
                    ? formData.Assets[0].depreciationExpenseAccount
                    : ''}
                </span>
              </label>
              <br />
              <br />
            </CardText>
          </Card>
        </form>
        <div>
          <Card className="uiCard">
            <CardText>{renderOpeningValues()}</CardText>
            <CardText>{renderGrid()}</CardText>
          </Card>
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
});
export default connect(mapStateToProps, mapDispatchToProps)(assetMovableView);
