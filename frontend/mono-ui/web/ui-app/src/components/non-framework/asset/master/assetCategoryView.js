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
import UiImage from '../../../framework/components/UiImage';
import { fileUpload, getInitiatorPosition } from '../../../framework/utility/utility';
import $ from 'jquery';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import UiTable from '../../../framework/components/UiTable';
import UiBackButton from '../../../framework/components/UiBackButton';
import UiEditButton from '../../../framework/components/UiEditButton';

var specifications = {};

let reqRequired = [];
class assetCategoryView extends Component {
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
        if (_form.MdmsRes.ASSET.AssetCategory[0].assetFieldsDefination != null) {
          var arr = _.get(_form, specs[moduleName + '.' + actionName].groups[i].jsonPath);
          ind = i;
          var _stringifiedGroup = JSON.stringify(specs[moduleName + '.' + actionName].groups[i]);
          console.log(_stringifiedGroup);
          var regex = new RegExp(
            specs[moduleName + '.' + actionName].groups[i].jsonPath.replace(/\[/g, '\\[').replace(/\]/g, '\\]') + '\\[\\d{1}\\]',
            'g'
          );
          for (var j = 1; j < arr.length; j++) {
            i++;
            console.log(ind);
            console.log(j);
            specs[moduleName + '.' + actionName].groups.splice(
              j + 1,
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
     previousRoute = previousRoute.replace(/assetCategoryCreate|update/, 'assetCategoryView');
     console.log(previousRoute);
     console.log(currentRoute);
     const shouldCache = currentRoute.indexOf(previousRoute) !== -1 ? true : false;
     console.log(shouldCache);
    return shouldCache;
   };
   loadData = async (_body, url, specifications, hashLocation) => {
     const cacheKey = 'asset' + '.' + this.props.match.params.id + '.assetcategory.search';
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
      res =await Api.commonApiPost('/egov-mdms-service/v1/_search', '', _body, {}, true, true)
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

     specifications = require(`../../../framework/specs/asset/master/createAssetCategroy`).default;

     let { setMetaData, setModuleName, setActionName, setMockData } = this.props;
     let hashLocation = window.location.hash;
     let self = this;
     let obj = specifications[`asset.view`];
     self.setLabelAndReturnRequired(obj);
     setMetaData(specifications);
     setMockData(JSON.parse(JSON.stringify(specifications)));
     setModuleName('asset');
     setActionName('view');
     //Get view form data
     var url = specifications[`asset.view`].url.split('?')[0];
     var hash = window.location.hash.split('/');
     var value = self.props.match.params.id;
     console.log(self.props.match.params.id);
     // var query = {
     //   [specifications[`asset.view`].url.split("?")[1].split("=")[0]]: value
     // };
     //handle 2nd parameter
     // if(specifications[`asset.view`].url.split("?")[1].split("=")[2])
     //  {
     //    var pval= specifications[`asset.view`].url.split("?")[1].split("=")[2];
     //    var pname= specifications[`asset.view`].url.split("?")[1].split("=")[1].split('&')[1];
     //
     //    query = {
     //  [specifications[`asset.view`].url.split("?")[1].split("=")[0]]: value,
     //  [pname]:pval
     //    };
     //  }

     //  if(window.location.href.indexOf("?") > -1) {
     //
     //   var qs =  window.location.href.split("?")[1];
     //   if(qs && qs.indexOf("=") > -1) {
     //     qs = qs.indexOf("&") > -1 ? qs.split("&") : [qs];
     //     for(var i=0; i<qs.length; i++) {
     //       query[qs[i].split("=")[0]] = qs[i].split("=")[1];
     //     }
     //   }
     // }

     var _body = {
       MdmsCriteria: {
         tenantId: localStorage.getItem('tenantId'),
         moduleDetails: [
           {
             moduleName: 'ASSET',
             masterDetails: [
               {
                 name: 'AssetCategory',
                 filter: '[?(@.id IN [' + self.props.match.params.id + '])]',
               },
             ],
           },
         ],
       },
     };

     // Api.commonApiPost('/egov-mdms-service/v1/_search', '', _body, {}, true, true).then(
     //   function(res) {
     const res = await this.loadData(_body, url, specifications, hashLocation);
          console.log(res);
         var resHolder = res;
         console.log(resHolder);
         // self.props.setFormData(resHolder);
         // console.log(res.MdmsRes.ASSET.AssetCategory[0].parent);
         // console.log(specifications[`asset.view`].objectName);
         //self.setInitialUpdateData(res, JSON.parse(JSON.stringify(specifications)), 'asset', 'view', specifications[`asset.view`].objectName);
         if(res){
         if(res.MdmsRes.ASSET.AssetCategory[0].parent){
           Api.commonApiPost(
             '/egov-mdms-service/v1/_get',
             {
               moduleName: 'ASSET',
               masterName: 'AssetCategory',
               filter: '%5B%3F%28%40.id+%3D%3D' + res.MdmsRes.ASSET.AssetCategory[0].parent + '%29%5D',
             },
             {},
             false,
             false,
             false,
             '',
             '',
             true
           ).then(
             function(subResponse) {
               console.log(subResponse);
               //this.handleChange({ target: { value: subResponse.MdmsRes.ASSET.AssetCategory[0].name } }, 'MdmsRes.ASSET.AssetCategory[0].parent');
             //  if(subResponse.MdmsRes.ASSET && subResponse.MdmsRes.ASSET.AssetCategory && subResponse.MdmsRes.ASSET.AssetCategory[0].name){
                 resHolder.MdmsRes.ASSET.AssetCategory[0].parentName = subResponse.MdmsRes.ASSET.AssetCategory[0].name;
                 self.props.setFormData(resHolder);
               //}
               // console.log(self.props.formData.MdmsRes.ASSET.AssetCategory);
             },
             function(err) {
               console.log(err);
             }
           );
         } else{
           self.props.setFormData(resHolder);
         }

         console.log(resHolder);
         console.log(JSON.parse(JSON.stringify(specifications)));
     self.setInitialUpdateData(resHolder, JSON.parse(JSON.stringify(specifications)), 'asset', 'view', specifications[`asset.view`].objectName);
   }
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
  //   specifications = require(`../../../framework/specs/asset/master/createAssetCategroy`).default;
  //
  //   let { setMetaData, setModuleName, setActionName, setMockData } = this.props;
  //   let hashLocation = window.location.hash;
  //   let self = this;
  //   let obj = specifications[`asset.view`];
  //   self.setLabelAndReturnRequired(obj);
  //   setMetaData(specifications);
  //   setMockData(JSON.parse(JSON.stringify(specifications)));
  //   setModuleName('asset');
  //   setActionName('view');
  //   //Get view form data
  //   var url = specifications[`asset.view`].url.split('?')[0];
  //   var hash = window.location.hash.split('/');
  //   var value = self.props.match.params.id;
  //   console.log(self.props.match.params.id);
  //   // var query = {
  //   //   [specifications[`asset.view`].url.split("?")[1].split("=")[0]]: value
  //   // };
  //   //handle 2nd parameter
  //   // if(specifications[`asset.view`].url.split("?")[1].split("=")[2])
  //   //  {
  //   //    var pval= specifications[`asset.view`].url.split("?")[1].split("=")[2];
  //   //    var pname= specifications[`asset.view`].url.split("?")[1].split("=")[1].split('&')[1];
  //   //
  //   //    query = {
  //   //  [specifications[`asset.view`].url.split("?")[1].split("=")[0]]: value,
  //   //  [pname]:pval
  //   //    };
  //   //  }
  //
  //   //  if(window.location.href.indexOf("?") > -1) {
  //   //
  //   //   var qs =  window.location.href.split("?")[1];
  //   //   if(qs && qs.indexOf("=") > -1) {
  //   //     qs = qs.indexOf("&") > -1 ? qs.split("&") : [qs];
  //   //     for(var i=0; i<qs.length; i++) {
  //   //       query[qs[i].split("=")[0]] = qs[i].split("=")[1];
  //   //     }
  //   //   }
  //   // }
  //
  //   var _body = {
  //     MdmsCriteria: {
  //       tenantId: localStorage.getItem('tenantId'),
  //       moduleDetails: [
  //         {
  //           moduleName: 'ASSET',
  //           masterDetails: [
  //             {
  //               name: 'AssetCategory',
  //               filter: '[?(@.id IN [' + self.props.match.params.id + '])]',
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   };
  //
  //   Api.commonApiPost('/egov-mdms-service/v1/_search', '', _body, {}, true, true).then(
  //     function(res) {
  //       var resHolder = res;
  //
  //       // self.props.setFormData(resHolder);
  //       // console.log(res.MdmsRes.ASSET.AssetCategory[0].parent);
  //       // console.log(specifications[`asset.view`].objectName);
  //       //self.setInitialUpdateData(res, JSON.parse(JSON.stringify(specifications)), 'asset', 'view', specifications[`asset.view`].objectName);
  //       if(res.MdmsRes.ASSET.AssetCategory[0].parent){
  //         Api.commonApiPost(
  //           '/egov-mdms-service/v1/_get',
  //           {
  //             moduleName: 'ASSET',
  //             masterName: 'AssetCategory',
  //             filter: '%5B%3F%28%40.id+%3D%3D' + res.MdmsRes.ASSET.AssetCategory[0].parent + '%29%5D',
  //           },
  //           {},
  //           false,
  //           false,
  //           false,
  //           '',
  //           '',
  //           true
  //         ).then(
  //           function(subResponse) {
  //             //this.handleChange({ target: { value: subResponse.MdmsRes.ASSET.AssetCategory[0].name } }, 'MdmsRes.ASSET.AssetCategory[0].parent');
  //           //  if(subResponse.MdmsRes.ASSET && subResponse.MdmsRes.ASSET.AssetCategory && subResponse.MdmsRes.ASSET.AssetCategory[0].name){
  //               resHolder.MdmsRes.ASSET.AssetCategory[0].parentName = subResponse.MdmsRes.ASSET.AssetCategory[0].name;
  //               self.props.setFormData(resHolder);
  //             //}
  //             // console.log(self.props.formData.MdmsRes.ASSET.AssetCategory);
  //           },
  //           function(err) {
  //             console.log(err);
  //           }
  //         );
  //       } else{
  //         self.props.setFormData(resHolder);
  //       }
  //       console.log(resHolder);
  //       console.log(JSON.parse(JSON.stringify(specifications)));
  //   self.setInitialUpdateData(resHolder, JSON.parse(JSON.stringify(specifications)), 'asset', 'view', specifications[`asset.view`].objectName);
  //     },
  //     function(err) {}
  //   );
  // }

  componentDidMount() {
    this.initData();
  }
  formatAMPM = date => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  };


  getVal = (path, isDate, isTime) => {
    var val = _.get(this.props.formData, path);

    if (isDate && val && ((val + '').length == 13 || (val + '').length == 12) && new Date(Number(val)).getTime() > 0) {
      var _date = new Date(Number(val));
      return ('0' + _date.getDate()).slice(-2) + '/' + ('0' + (_date.getMonth() + 1)).slice(-2) + '/' + _date.getFullYear();
    }
    if (isTime && val && ((val + '').length == 13 || (val + '').length == 12) && new Date(Number(val)).getTime() > 0) {
      return this.formatAMPM(new Date(parseInt(val)));
    }
    console.log(val);
    return typeof val != 'undefined' && (typeof val == 'object' || typeof val == 'string' || typeof val == 'number' || typeof val == 'boolean')
      ? val === true ? 'Yes' : val === false ? 'No' : typeof val == 'object' ? val : val + ''
      : '';
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
    let { handleChange, getVal, addNewCard, removeCard, printer } = this;
    console.log(formData);
    const renderTable = function() {
      if (moduleName && actionName && formData && formData[objectName]) {
        var objectName = mockData[`${moduleName}.${actionName}`].objectName;
        let flag = 0;
        let count = 0;
        var dataList = {
          resultHeader: ['#', 'Name', 'File'],
          resultValues: [],
        };
        for (let i = 0; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
          for (let j = 0; j < mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
            if (
              mockData[moduleName + '.' + actionName].groups[i].fields[j].type == 'singleFileUpload' &&
              _.get(formData, mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath)
            ) {
              flag = 1;
              count++;
              let fileStoreId = _.get(formData, mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
              dataList.resultValues.push([
                count,
                'File',
                '<a href=/filestore/v1/files/id?tenantId=' + localStorage.getItem('tenantId') + '&fileStoreId=' + fileStoreId + '>Download</a>',
              ]);
            }
          }
        }

        if (formData[objectName].documents && formData[objectName].documents.length) {
          flag = 1;
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
        }

        if (flag == 1) {
          return <UiTable resultList={dataList} />;
        }
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
              <UiBackButton customUrl={'/non-framework/asset/master/assetCategorySearch'} />
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
              <UiEditButton customUrl={'/non-framework/asset/master/assetCategoryCreate/' + (!_.isEmpty(match) ? match.params.id : '')} />
            </div>
          </Col>
        </Row>

        <form id="printable">
          {!_.isEmpty(mockData) &&
            moduleName &&
            actionName &&
            mockData[`${moduleName}.${actionName}`] && (
              <ShowFields
                groups={mockData[`${moduleName}.${actionName}`].groups}
                noCols={mockData[`${moduleName}.${actionName}`].numCols}
                ui="google"
                handler={''}
                getVal={getVal}
                fieldErrors={fieldErrors}
                useTimestamp={mockData[`${moduleName}.${actionName}`].useTimestamp || false}
                addNewCard={''}
                removeCard={''}
                screen="view"
              />
            )}
          <br />
          {renderTable()}
          <br />
        </form>
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
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg, isSuccess, isError });
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(assetCategoryView);
