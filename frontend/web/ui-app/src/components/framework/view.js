import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import _ from 'lodash';
import ShowFields from './showFields';

import { translate } from '../common/common';
import Api from '../../api/api';
import jp from 'jsonpath';
import UiButton from './components/UiButton';
import { fileUpload, callApi, parseKeyAndValueForDD } from './utility/utility';
import UiTable from './components/UiTable';
import UiBackButton from './components/UiBackButton';
import UiEditButton from './components/UiEditButton';
// import UiLogo from './components/UiLogo';

var specifications = {};

let reqRequired = [];
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
    let { setMockData, formData } = this.props;
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
            ind + 1,
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

      //for valueBasedOn feature
      for (let j = 0; j < specs[moduleName + '.' + actionName].groups[i].fields.length; j++) {
        if (
          specs[moduleName + '.' + actionName].groups[i].fields[j].valueBasedOn &&
          specs[moduleName + '.' + actionName].groups[i].fields[j].valueBasedOn.length
        ) {
          for (let k = 0; k < specs[moduleName + '.' + actionName].groups[i].fields[j].valueBasedOn.length; k++) {
            if (this.getVal(specs[moduleName + '.' + actionName].groups[i].fields[j].valueBasedOn[k].jsonPath)) {
              _.set(
                formData,
                specs[moduleName + '.' + actionName].groups[i].fields[j].jsonPath,
                specs[moduleName + '.' + actionName].groups[i].fields[j].valueBasedOn[k].valueIfDataFound
              );
            } else {
              _.set(
                formData,
                specs[moduleName + '.' + actionName].groups[i].fields[j].jsonPath,
                !specs[moduleName + '.' + actionName].groups[i].fields[j].valueBasedOn[k].valueIfDataFound
              );
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

  filterDataFromArray = (res, item) => {
    if (res) {
      let value = this.getVal(item.queryParameter);
      if (value) {
        var filterdObject = _.filter(res[`${item.responseArray}`], function(o) {
          // let jsonObject=Json.stringify()
          var currentValue = _.get(o, item.primaryKey);
          if (currentValue == value) {
            return o;
          }
        });
        return filterdObject;
      }
      return null;
    }

    return null;
  };

  setVal = (jsonPath, value) => {
    let formData = { ...this.props.formData };
    _.set(formData, jsonPath, value);
    this.props.setFormData(formData);
  };

  shouldLoadFromCache = () => {
    let previousRoute = window.localStorage.getItem('previousRoute');
    previousRoute = previousRoute ? previousRoute : '';
    let currentRoute = window.location.hash.split('#')[1];
    previousRoute = previousRoute.replace(/create|update/, 'view');
    const shouldCache = currentRoute.indexOf(previousRoute) !== -1 ? true : false;
    return shouldCache;
  };

  loadData = async (_body, url, query, specifications, hashLocation) => {
    const cacheKey = this.props.match.params.moduleName + '.' + this.props.match.params.master + '.search';
    let res = window.sessionStorage.getItem(cacheKey);

    if (this.shouldLoadFromCache() && res) {
      res = JSON.parse(res);
    } else {
      res = await Api.commonApiPost(
        url,
        query,
        _body,
        false,
        specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].useTimestamp
      );
    }

    return res;
  };

  initData = async () => {
    try {
      var hash = window.location.hash.split('/');
      if (hash.length == 4) {
        specifications = require(`./specs/${hash[2]}/${hash[2]}`).default;
      } else {
        specifications = require(`./specs/${hash[2]}/master/${hash[3]}`).default;
      }
    } catch (e) {}

    let {
      mockData,
      moduleName,
      actionName,
      setMetaData,
      setModuleName,
      setActionName,
      setMockData,
      setDropDownData,
      setDropDownOriginalData,
    } = this.props;
    let hashLocation = window.location.hash;
    let self = this;
    let obj = specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`];
    self.setLabelAndReturnRequired(obj);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName(hashLocation.split('/')[2]);
    setActionName(hashLocation.split('/')[1]);
    //Get view form data
    var url = specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].url.split('?')[0];
    var hash = window.location.hash.split('/');
    var value = decodeURIComponent(self.props.match.params.id);
    var query = {
      [specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].url.split('?')[1].split('=')[0]]: value,
    };
    //handle 2nd parameter
    if (specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].url.split('?')[1].split('=')[2]) {
      var pval = specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].url.split('?')[1].split('=')[2];
      var pname = specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].url
        .split('?')[1]
        .split('=')[1]
        .split('&')[1];

      query = {
        [specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].url.split('?')[1].split('=')[0]]: value,
        [pname]: pval,
      };
    }

    if (window.location.href.indexOf('?') > -1) {
      var qs = window.location.href.split('?')[1];
      if (qs && qs.indexOf('=') > -1) {
        qs = qs.indexOf('&') > -1 ? qs.split('&') : [qs];
        for (var i = 0; i < qs.length; i++) {
          query[qs[i].split('=')[0]] = qs[i].split('=')[1];
        }
      }
    }

    var _body = {};
    if (url.includes('/egov-mdms-service/v1/_search')) {
      var moduleDetails = [];
      var masterDetails = [];
      let data = { moduleName: '', masterDetails: [] };
      let k = 0;
      var masterDetail = {};
      data.moduleName = hashLocation.split('/')[2];
      // console.log(data, masterDetail)
      // console.log(url.split('?')[1].split('={')[0]);
      var filterData = `[?(@.${specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].url.split('?')[1].split('={')[0]}=='${
        hashLocation.split('/')[hashLocation.split('/').length - 1]
      }')]`;
      masterDetail.filter = filterData;
      masterDetail.name = specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].objectName;
      data.masterDetails[0] = _.cloneDeep(masterDetail);
      moduleDetails.push(data);

      _body = {
        MdmsCriteria: {
          tenantId: localStorage.getItem('tenantId'),
          moduleDetails: moduleDetails,
        },
      };
      query = '';
    }
    self.props.setLoadingStatus('loading');
    if (obj && obj.preApiCalls) {
      obj.preApiCalls.forEach(async item => {
        let res = await callApi(item);
        let orgRes = Object.assign({}, res);
        if (item.type && item.type == 'text') {
          let filteredresponse = self.filterDataFromArray(res, item);
          let jsonpaths = item.jsonPath.split(',');
          if (jsonpaths && filteredresponse) {
            for (var i = 0; i < item.responsePaths.length; i++) {
              if (filteredresponse[0]) {
                var value = _.get(filteredresponse[0], item.responsePaths[i]);
                if (value) {
                  self.setVal(jsonpaths[i], value);
                }
              }
            }
          }
          self.props.setLoadingStatus('hide');
        } else {
          setDropDownData(item.jsonPath, parseKeyAndValueForDD(res, item.jsExpForDD.key, item.jsExpForDD.value));
          setDropDownOriginalData(item.jsonPath, res);
          self.props.setLoadingStatus('hide');
        }
      });
    }
    self.props.setLoadingStatus('loading');

    const res = await this.loadData(_body, url, query, specifications, hashLocation);

    var spec = specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`];
    const JP = jp;
    if (spec && spec.beforeSetForm) eval(spec.beforeSetForm);
    self.props.setFormData(res);

    self.setInitialUpdateData(
      res,
      JSON.parse(JSON.stringify(specifications)),
      hashLocation.split('/')[2],
      hashLocation.split('/')[1],
      specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`].objectName
    );

    if (spec && spec.afterSetForm) eval(spec.afterSetForm);
    self.props.setLoadingStatus('hide');
  };

  //To find last index in jsonPath for multiple cards
  indexFinder = jsonPath => {
    let matches = jsonPath.match(/(\[\d+\])/g);
    return matches.length ? parseInt(matches[matches.length - 1].replace(/[^\d]/g, '')) : -1;
  };

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

    return typeof val != 'undefined' && (typeof val == 'object' || typeof val == 'string' || typeof val == 'number' || typeof val == 'boolean')
      ? val === true ? 'Yes' : val === false ? 'No' : typeof val == 'object' ? val : val + ''
      : '';
  };

  printer = () => {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    var boostrapGridForPrint = `<style type="text/css">
      @media print{.uiCard{margin-bottom:30px!important;background-color:white!important;box-shadow:none!important;display:block!important;width:100%!important;}.uiCardHeader{width:100%!important;display:block!important;white-space:initial!important;}.uiCardHeader>div{display:block!important;width:100%;padding-right:0px;} a[href]:after{content:none!important}body{-webkit-print-color-adjust:exact!important}.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9{float:left}.col-sm-12{width:100%}.col-sm-11{width:91.66666667%}.col-sm-10{width:83.33333333%}.col-sm-9{width:75%}.col-sm-8{width:66.66666667%}.col-sm-7{width:58.33333333%}.col-sm-6{width:50%}.col-sm-5{width:41.66666667%}.col-sm-4{width:33.33333333%}.col-sm-3{width:25%}.col-sm-2{width:16.66666667%}.col-sm-1{width:8.33333333%}.col-sm-pull-12{right:100%}.col-sm-pull-11{right:91.66666667%}.col-sm-pull-10{right:83.33333333%}.col-sm-pull-9{right:75%}.col-sm-pull-8{right:66.66666667%}.col-sm-pull-7{right:58.33333333%}.col-sm-pull-6{right:50%}.col-sm-pull-5{right:41.66666667%}.col-sm-pull-4{right:33.33333333%}.col-sm-pull-3{right:25%}.col-sm-pull-2{right:16.66666667%}.col-sm-pull-1{right:8.33333333%}.col-sm-pull-0{right:auto}.col-sm-push-12{left:100%}.col-sm-push-11{left:91.66666667%}.col-sm-push-10{left:83.33333333%}.col-sm-push-9{left:75%}.col-sm-push-8{left:66.66666667%}.col-sm-push-7{left:58.33333333%}.col-sm-push-6{left:50%}.col-sm-push-5{left:41.66666667%}.col-sm-push-4{left:33.33333333%}.col-sm-push-3{left:25%}.col-sm-push-2{left:16.66666667%}.col-sm-push-1{left:8.33333333%}.col-sm-push-0{left:auto}.col-sm-offset-12{margin-left:100%}.col-sm-offset-11{margin-left:91.66666667%}.col-sm-offset-10{margin-left:83.33333333%}.col-sm-offset-9{margin-left:75%}.col-sm-offset-8{margin-left:66.66666667%}.col-sm-offset-7{margin-left:58.33333333%}.col-sm-offset-6{margin-left:50%}.col-sm-offset-5{margin-left:41.66666667%}.col-sm-offset-4{margin-left:33.33333333%}.col-sm-offset-3{margin-left:25%}.col-sm-offset-2{margin-left:16.66666667%}.col-sm-offset-1{margin-left:8.33333333%}.col-sm-offset-0{margin-left:0}.visible-xs{display:none!important}.hidden-xs{display:block!important}table.hidden-xs{display:table}tr.hidden-xs{display:table-row!important}td.hidden-xs,th.hidden-xs{display:table-cell!important}.hidden-sm,.hidden-xs.hidden-print{display:none!important}.visible-sm{display:block!important}table.visible-sm{display:table}tr.visible-sm{display:table-row!important}td.visible-sm,th.visible-sm{display:table-cell!important}}
    </style>`;
    mywindow.document.write('<html><head>');
    mywindow.document.write(boostrapGridForPrint);
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
    let { mockData, moduleName, actionName, formData, fieldErrors } = this.props;
    let { handleChange, getVal, addNewCard, removeCard, printer } = this;

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
              <UiEditButton />
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
        {/*<UiLogo src={require("../../images/logo.png")} alt="logo"/>*/}
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
  setDropDownData: (fieldName, dropDownData) => {
    dispatch({ type: 'SET_DROPDWON_DATA', fieldName, dropDownData });
  },
  setDropDownOriginalData: (fieldName, dropDownData) => {
    dispatch({ type: 'SET_ORIGINAL_DROPDWON_DATA', fieldName, dropDownData });
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
export default connect(mapStateToProps, mapDispatchToProps)(Report);
