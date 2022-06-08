import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import _ from 'lodash';
import ShowFields from './showFields';

import { translate } from '../common/common';
import Api from '../../api/api';
import UiButton from './components/UiButton';
import UiAddButton from './components/UiAddButton';
import UiDynamicTable from './components/UiDynamicTable';
import { fileUpload ,callApi,parseKeyAndValueForDD,cToN} from './utility/utility';
import UiTable from './components/UiTable';
//import UiLogo from './components/UiLogo';
import jp from 'jsonpath';

var specifications = {};
var boundaryDataOrg = [];
var boundaryDataOrgQuery = {};
let reqRequired = [];
class Search extends Component {
  state = {
    pathname: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      showResult: false,
      resultList: {
        resultHeader: [],
        resultValues: [],
        disableRowClick: false,
      },
      values: [],
      selectedRecordId: '',
      selectedRecords:[],
      orientation:"landscape"
    };
  }

  setLabelAndReturnRequired(configObject) {
    if (configObject && configObject.groups) {
      for (var i = 0; i < configObject.groups.length; i++) {
        configObject.groups[i].label = translate(configObject.groups[i].label);
        for (var j = 0; j < configObject.groups[i].fields.length; j++) {
          configObject.groups[i].fields[j].label = translate(configObject.groups[i].fields[j].label);
          if (configObject.groups[i].fields[j].isRequired && !configObject.groups[i].fields[j].hide && !configObject.groups[i].hide)
            reqRequired.push(configObject.groups[i].fields[j].jsonPath);
        }
        if (configObject.groups[i].children && configObject.groups[i].children.length) {
          for (var k = 0; k < configObject.groups[i].children.length; k++) {
            this.setLabelAndReturnRequired(configObject.groups[i].children[k]);
          }
        }
      }
    }
  }

  setDefaultValues(groups, dat) {
    for (var i = 0; i < groups.length; i++) {
      for (var j = 0; j < groups[i].fields.length; j++) {
        if (
          typeof groups[i].fields[j].defaultValue == 'string' ||
          typeof groups[i].fields[j].defaultValue == 'number' ||
          typeof groups[i].fields[j].defaultValue == 'boolean'
        ) {
          //console.log(groups[i].fields[j].name + "--" + groups[i].fields[j].defaultValue);
          _.set(dat, groups[i].fields[j].jsonPath, groups[i].fields[j].defaultValue);
          if(groups[i].fields[j].depedants&&groups[i].fields[j].depedants.length>0){
            for(var k=0;k<groups[i].fields[j].depedants.length;k++){
              if(groups[i].fields[j].depedants[k].type=='dropDown'){
                this.props.setDropDownData(groups[i].fields[j].depedants[k].jsonPath,[]);
                this.props.setDropDownOriginalData(groups[i].fields[j].depedants[k].jsonPath,[]);
              }
            }
          }
        }

        if (groups[i].fields[j].children && groups[i].fields[j].children.length) {
          for (var k = 0; k < groups[i].fields[j].children.length; k++) {
            this.setDefaultValues(groups[i].fields[j].children[k].groups);
          }
        }
      }
    }
  }

  getVal = path => {
    return typeof _.get(this.props.formData, path) != 'undefined' ? _.get(this.props.formData, path) : '';
  };

  initData() {
    let hashLocation = window.location.hash;
    try {
      var hash = window.location.hash.split('/');
      if (hash.length == 4 && hashLocation.split('/')[1] != 'transaction') {
        specifications = require(`./specs/${hash[2]}/${hash[2]}`).default;
      } else if (hashLocation.split('/')[1] != 'transaction') {
        specifications = require(`./specs/${hash[2]}/master/${hash[3]}`).default;
      } else {
        specifications = require(`./specs/${hash[2]}/transaction/${hash[3]}`).default;
      }
    } catch (e) {}
    let { setMetaData, setModuleName, setActionName, initForm, setMockData, setFormData ,setDropDownData,setDropDownOriginalData,setLoadingStatus} = this.props;
    if(specifications) {
      let obj = specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`];
    
      reqRequired = [];
      this.setLabelAndReturnRequired(obj);
      initForm(reqRequired);
      setMetaData(specifications);
      window.localStorage.setItem('specifications', JSON.stringify(specifications));
      setMockData(JSON.parse(JSON.stringify(specifications)));
      setModuleName(hashLocation.split('/')[2]);
      setActionName(hashLocation.split('/')[1]);
      var formData = {};
      if (obj && obj.groups && obj.groups.length) this.setDefaultValues(obj.groups, formData);
      setFormData(formData);

      this.setState({
        pathname: this.props.history.location.pathname,
        showResult: false,
      });
      setLoadingStatus('loading');
      if (obj && obj.preApiCalls) {
        obj.preApiCalls.forEach(async (item)=>{
          let res=await callApi(item);
          let orgRes=Object.assign({},res);
          setDropDownData(item.jsonPath,parseKeyAndValueForDD(res,item.jsExpForDD.key,item.jsExpForDD.value));
          setDropDownOriginalData(item.jsonPath,res);
        })
      }

      else if(obj && obj.preApiCallsBoundary){
        obj.preApiCallsBoundary.forEach(async (item)=>{
          let res=await callApi(item);
          this.buildBoundaryData(res, item.qs, "", false);
        })
      }
      setLoadingStatus('hide');
    }
  }

  componentDidMount() {
    // this.props.resetDropdownData();
    this.initData();
    this.hasReturnUrl();
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.pathname && this.state.pathname != nextProps.history.location.pathname) {
      // this.props.resetDropdownData();
      this.initData();
    }
  }

  hasReturnUrl() {
    let { search } = this;
    const {moduleName,master} = this.props.match.params;
    if (localStorage.getItem('returnUrl') && localStorage.getItem('returnUrl').includes(moduleName + "/" + master) ) {
      if(!localStorage.getItem('page')){
        search(null, true);
      }else{
        window.localStorage.setItem('returnUrl', '');
        window.localStorage.setItem('page', '');
      }
    }
  }

  showArrayInTable = (arr) => {
    var str = '';
    if(Array.isArray(arr)){
      arr.forEach(function(elem, index){
        if(typeof elem === "object"){
          str += JSON.stringify(elem) + ', '
          // for(let obj in elem){
          //   str += obj + ': ' + elem[obj]  + ', '
          // }
        }
        else{
          str += /*(index+1) + '. ' + */elem + ', ';
        }

      })
      return str.slice(0, -2);
    }
  }

  buildBoundaryData = (res, query, bdryCode, isBuild) => {
    boundaryDataOrg = res;
    boundaryDataOrgQuery = query;
    var jpath = '';
    var cityBdry = jp.query(boundaryDataOrg, `$.TenantBoundary[?(@.hierarchyType.name=="${query.hierarchyTypeCode}")].boundary[?(@.label=='City')]`);
    if(isBuild){
      var viewLabels = {};
      // var bdryCode = _.get(values[i], currentSpecification.jPathBoundary);
      var ddArr = [];
      var jPath = '';
      var code = bdryCode;

      var pathArr = jp.paths(cityBdry, `$..[?(@.code=='${code}')]`);
      //console.log(pathArr);
      pathArr = pathArr[0];

      if(pathArr){
        for (var j = 0; j < pathArr.length; ) {
          ddArr.push(pathArr[j] + '[' + pathArr[j + 1] + ']');
          jPath = ddArr.join('.');
          if (j > 1) {
            var code = jp.query(cityBdry, jPath + '.code');
            var label = jp.query(cityBdry, jPath + '.label');
            var name = jp.query(cityBdry, jPath + '.name');
            viewLabels[label] = name[0];
          }
          j += 2;
        }
      }


      return viewLabels;
      this.setLoadingStatus('hide');
    }
    else{
      return;
      this.setLoadingStatus('hide');
    }

  }

  tableDataBuilder = (res, currentSpecification, self) => {
    let {dropDownData}=this.props;
    if(currentSpecification && currentSpecification.beforeSetSearchResult)
    {
      eval(currentSpecification.beforeSetSearchResult);
    }
    self.props.setLoadingStatus('hide');
    var result = currentSpecification.result;
    var resultList = {
      resultHeader: [{ label: "Sr. No." }, ...result.header],
      resultValues: [],
      disableRowClick: result.disableRowClick || false,
      hidesearch: currentSpecification.hidesearch ? false : true
    };
    var specsValuesList = currentSpecification.result.values;
    var values = _.get(res, currentSpecification.result.resultPath);
    var boundaryData = [];
    var boundaryCount = 0;
    if (values && values.length) {
      if(currentSpecification.isBoundary){
        for(var i = 0; i < values.length; i++){
          if (typeof _.get(values[i], currentSpecification.jPathBoundary) != 'undefined') {
          // if(values[i].location == null || values[i].location.code == null){
            let tempBoundary = self.buildBoundaryData(boundaryDataOrg, boundaryDataOrgQuery, _.get(values[i], currentSpecification.jPathBoundary), true)
            boundaryData.push(tempBoundary);
          }
          else{
            boundaryData.push("NA");
          }

          // }
        }
      }

      for (var i = 0; i < values.length; i++) {
        var tmp = [i + 1];
        for (var j = 0; j < specsValuesList.length; j++) {
          let valuePath = specsValuesList[j];
          if (typeof valuePath === 'object' && valuePath.valExp) {
            tmp.push(eval(valuePath.valExp));
            continue;
          }
          if (typeof valuePath === 'object' && valuePath.isObj) {

            var childArray = [];
            if (valuePath.cToN) {
              tmp.push(cToN(dropDownData[valuePath.reduxObject],_.get(values[i], valuePath.jsonPath)));
              continue
            } else {
              if (valuePath.childArray && valuePath.childArray.length > 0) {
                for (var k = 0; k < valuePath.childArray.length; k++) {
                  childArray.push(_.get(values[i], valuePath.childArray[k]));
                }
              }
            }
            tmp.push(childArray);
            continue;
          }
          if(typeof valuePath === "object" && valuePath.isMultiple){
            var dataMultiple = _.get(values[i], valuePath.jsonPath);
            var tempMultiple = [];
            var tempMultipleObj = {};
            if(typeof dataMultiple != "undefined" && dataMultiple != null){
              for(var s = 0; s < dataMultiple.length; s++){
                if(Array.isArray(valuePath.name)){
                  valuePath.name.forEach(function(elem, ind){
                    (_.get(dataMultiple[s], valuePath.name) === null ||  _.get(dataMultiple[s], valuePath.name) === "") ? tempMultipleObj[elem] = "NA" : tempMultiple.push(_.get(dataMultiple[s], valuePath.name));
                  })
                  tempMultiple.push(tempMultipleObj);
                } else if(Array.isArray(_.get(dataMultiple[s], valuePath.name))){
                  var propertValue = _.get(dataMultiple[s], valuePath.name);
                  for(var m =0 ;m < propertValue.length ; m++ ){
                    if(propertValue[m].key && propertValue[m].key === valuePath.key){
                      tempMultiple.push(propertValue[m].value);
                    }
                  }
                }else{
                  (_.get(dataMultiple[s], valuePath.name) === null ||  _.get(dataMultiple[s], valuePath.name) === "") ? tempMultiple.push("NA") : tempMultiple.push(_.get(dataMultiple[s], valuePath.name));
                }
              }
            }
            
            // console.log(tempMultiple);
            var arrToStr = self.showArrayInTable(tempMultiple);
            tmp.push(arrToStr);
            continue;
          }
          if(typeof valuePath === "object" && valuePath.isBoundary){
            // console.log(boundaryData);
            typeof _.get(boundaryData[i], valuePath.name) === 'undefined' ?
            tmp.push("NA"):
            tmp.push(_.get(boundaryData[i], valuePath.name));
            continue;
          }
          tmp.push(_.get(values[i], valuePath));
        }

        //Replacing all empty strings by "NA"
        tmp = tmp.map(item =>  (typeof item === "string" ? ((item.trim().length) ? item : "NA") : (item  === null) ? "NA" : item  ))
        resultList.resultValues.push(tmp);
      }
    }

    if (result.isAction) {
      resultList.actionItems = result.actionItems;
    }
    self.setState({
      resultList,
      values,
      showResult: true,
      orientation:currentSpecification && currentSpecification.result && currentSpecification.result.orientation?currentSpecification.result.orientation:"landscape"
    });

    self.props.setFlag(1);

    window.localStorage.setItem('formData', '');
    window.localStorage.setItem('returnUrl', '');
    if(localStorage.getItem('page')){
      window.localStorage.setItem('page', '');
    }
  }

  search = (e = null, hasDefaultSearch = false) => {
    if (e) {
      e.preventDefault();
    }

    let self = this;
     self.setState({
      selectedRecordId: '',
      selectedRecords:[],
    });
    var {dropDownData,dropDownOriginalData}= this.props;
    self.props.setLoadingStatus('loading');
    var formData = { ...this.props.formData };
    if (hasDefaultSearch) {
      formData = window.localStorage.getItem('formData') && JSON.parse(window.localStorage.getItem('formData')) || {};
      this.props.setFormData(formData);
    }
    for (var key in formData) {
      if (formData[key] == '' || typeof formData[key] == 'undefined') delete formData[key];
    }

    var specifications = JSON.parse(window.localStorage.getItem('specifications'));
    var currentSpecification = specifications[`${self.props.match.params.moduleName}.${self.props.match.path.split('/')[1]}`];
    let { getVal, getValFromDropdownData } = self;

    //Master Screen search
    if(currentSpecification.result.hasOwnProperty("isMasterScreen")) {
      if (currentSpecification && currentSpecification.beforeSubmit) {
        eval(currentSpecification.beforeSubmit)
      }
      var moduleDetails = [];
      var masterDetails = [];
      let data = { moduleName: '', masterDetails: [] };
      let k = 0;
      var masterDetail = {};
      data.moduleName = self.props.match.params.moduleName;
      // console.log(formData)
      var filterData
      if(_.isEmpty(formData)) {
        filterData = null;
      }
      else {
        var str = [];
        for(var i=0; i<Object.keys(formData).length; i++) {
          /* Forming filter for ULBs search --> array based search in general */
          if(_.isArray(formData[Object.keys(formData)[i]])){
            formData[Object.keys(formData)[i]].forEach(function(elem, ind){
              if(typeof elem === "object"){
                if(!elem[Object.keys(elem)[0]]){
                  filterData = null;
                }
                else{
                  str.push(`('${formData[Object.keys(formData)[i]][ind][Object.keys(elem)[0]]}' in @.${Object.keys(formData)[i]}[*].${Object.keys(elem)[0]})`);
                }
              }
            })
          }
          /* Nested feature for single level - Enhancement required */
          else if(typeof(formData[Object.keys(formData)[i]]) === "object"){
            var level_1 = Object.keys(formData)[i];
            for(let item in formData[level_1]){
              if(_.isEmpty(formData[level_1][item])) {
                continue;
              }

              str.push(`@.${level_1}.${item}=='${formData[level_1][item]}'`);
            }
          }
          /* Normal Search */
          else{
              if(Object.keys(formData)[i].includes("<") || Object.keys(formData)[i].includes(">") ){
                str.push(`@.${Object.keys(formData)[i]}=${((typeof Object.values(formData)[i] == 'boolean')|| (typeof Object.values(formData)[i] == 'number')) ? Object.values(formData)[i] : `'${Object.values(formData)[i]}'` }`);
              }else{
                str.push(`@.${Object.keys(formData)[i]}==${typeof Object.values(formData)[i] == 'boolean' ? Object.values(formData)[i] : `'${Object.values(formData)[i]}'` }`);
              }
            
          }
        }
        str = str.join(' && ');
        if(str != '') {
         filterData = `[?(${str})]`;
        }
      }
      masterDetail.filter = filterData;
      masterDetail.name = currentSpecification.objectName;
      data.masterDetails[0] = _.cloneDeep(masterDetail);
      moduleDetails.push(data);

      var _body = {
        MdmsCriteria: {
          tenantId: localStorage.getItem('tenantId'),
          moduleDetails: moduleDetails,
        },
      };

      Api.commonApiPost('/egov-mdms-service/v1/_search', '', _body, {}, true, true)
        .then(res => {
          this.tableDataBuilder(res, currentSpecification, self);
        },
        function(err) {
          self.props.toggleSnackbarAndSetText(true, err.message, false, true);
          self.props.setLoadingStatus('hide');
        }
      );
    }
    else {
      if (currentSpecification && currentSpecification.beforeSubmit) {
        eval(currentSpecification.beforeSubmit)
      }
      Api.commonApiPost(currentSpecification.url, formData, {}, null, currentSpecification.useTimestamp).then(
        (res) => {
          // localStorage.setItem('searchRes', JSON.stringify(res));
          this.tableDataBuilder(res, currentSpecification, self);

        },
        function(err) {
          self.props.toggleSnackbarAndSetText(true, err.message, false, true);
          self.props.setLoadingStatus('hide');
        }
      );
    }

  };

 /* getVal = path => {
    return _.get(this.props.formData, path) || '';
  };*/

  getValFromDropdownData = (fieldJsonPath, key, path) => {
    let dropdownData = this.props.dropDownData[fieldJsonPath] || [];
    let _val;
    if (!key) {
      _val = undefined;
    } else {
      _val = _.get(dropdownData.find(data => data.key == key) || [], path);
    }
    return typeof _val != 'undefined' ? _val : '';
  };

  hideField = (_mockData, hideObject, reset) => {
    let { moduleName, actionName, setFormData, delRequiredFields, removeFieldErrors, addRequiredFields } = this.props;
    let _formData = { ...this.props.formData };
    if (hideObject.isField) {
      for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
        for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
          if (hideObject.name == _mockData[moduleName + '.' + actionName].groups[i].fields[j].name) {
            _mockData[moduleName + '.' + actionName].groups[i].fields[j].hide = reset ? false : true;
            if (!reset) {
              _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
              setFormData(_formData);
              //Check if required is true, if yes remove from required fields
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
                delRequiredFields([_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath]);
                removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
              }
            } else if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
              addRequiredFields([_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath]);
            }

            break;
          }
        }
      }
    } else {
      let flag = 0;
      for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
        if (hideObject.name == _mockData[moduleName + '.' + actionName].groups[i].name) {
          flag = 1;
          _mockData[moduleName + '.' + actionName].groups[i].hide = reset ? false : true;
          if (!reset) {
            var _rReq = [];
            for (var j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
              _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
                _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
                removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
              }
            }
            delRequiredFields(_rReq);
            setFormData(_formData);
          } else {
            var _rReq = [];
            for (var j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired)
                _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
            }
            addRequiredFields(_rReq);
          }
          break;
        }
      }

      if (flag == 0) {
        for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
          if (_mockData[moduleName + '.' + actionName].groups[i].children && _mockData[moduleName + '.' + actionName].groups[i].children.length) {
            for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].children.length; j++) {
              for (let k = 0; k < _mockData[moduleName + '.' + actionName].groups[i].children[j].groups.length; k++) {
                if (hideObject.name == _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].name) {
                  _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].hide = reset ? false : true;
                  if (!reset) {
                    var _rReq = [];
                    for (let a = 0; a < _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields.length; a++) {
                      _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].jsonPath, '');
                      if (_mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].isRequired) {
                        _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].jsonPath);
                        removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].jsonPath);
                      }
                    }
                    delRequiredFields(_rReq);
                    setFormData(_formData);
                  } else {
                    var _rReq = [];
                    for (let a = 0; a < _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields.length; a++) {
                      if (_mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].isRequired)
                        _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].fields[a].jsonPath);
                    }
                    addRequiredFields(_rReq);
                  }
                }
              }
            }
          }
        }
      }
    }

    return _mockData;
  };

  showField = (_mockData, showObject, reset) => {
    let { moduleName, actionName, setFormData, delRequiredFields, removeFieldErrors, addRequiredFields } = this.props;
    let _formData = { ...this.props.formData };
    if (showObject.isField) {
      for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
        for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
          if (showObject.name == _mockData[moduleName + '.' + actionName].groups[i].fields[j].name) {
            _mockData[moduleName + '.' + actionName].groups[i].fields[j].hide = reset ? true : false;
            if (!reset) {
              _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
              setFormData(_formData);
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
                addRequiredFields([_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath]);
              }
            } else if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
              delRequiredFields([_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath]);
              removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
            }
            break;
          }
        }
      }
    } else {
      let flag = 0;
      for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
        if (showObject.name == _mockData[moduleName + '.' + actionName].groups[i].name) {
          flag = 1;
          _mockData[moduleName + '.' + actionName].groups[i].hide = reset ? true : false;
          if (!reset) {
            var _rReq = [];
            for (var j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
              _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired)
                _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
            }

            addRequiredFields(_rReq);
            setFormData(_formData);
          } else {
            var _rReq = [];
            for (var j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
              if (_mockData[moduleName + '.' + actionName].groups[i].fields[j].isRequired) {
                _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
                removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath);
              }
            }

            if (_mockData[moduleName + '.' + actionName].groups[i].children && _mockData[moduleName + '.' + actionName].groups[i].children.length) {
              for (var z = 0; z < _mockData[moduleName + '.' + actionName].groups[i].children.length; z++) {
                for (var y = 0; y < _mockData[moduleName + '.' + actionName].groups[i].children[z].groups.length; y++) {
                  for (var x = 0; x < _mockData[moduleName + '.' + actionName].groups[i].children[z].groups[y].fields.length; x++) {
                    if (_mockData[moduleName + '.' + actionName].groups[i].children[z].groups[y].fields[x].isRequired) {
                      _rReq.push(_mockData[moduleName + '.' + actionName].groups[i].children[z].groups[y].fields[x].jsonPath);
                      removeFieldErrors(_mockData[moduleName + '.' + actionName].groups[i].children[z].groups[y].fields[x].jsonPath);
                    }
                  }
                }
              }
            }

            delRequiredFields(_rReq);
          }
          break;
        }
      }

      if (flag == 0) {
        for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
          if (_mockData[moduleName + '.' + actionName].groups[i].children && _mockData[moduleName + '.' + actionName].groups[i].children.length) {
            for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].children.length; j++) {
              for (let k = 0; k < _mockData[moduleName + '.' + actionName].groups[i].children[j].groups.length; k++) {
                if (showObject.name == _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].name) {
                  _mockData[moduleName + '.' + actionName].groups[i].children[j].groups[k].hide = reset ? true : false;
                  /*if(!reset) {

                  } else {

                  }*/
                }
              }
            }
          }
        }
      }
    }

    return _mockData;
  };

  checkIfHasShowHideFields = (jsonPath, val) => {
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
                _mockData = this.hideField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide[y]);
              }

              for (let z = 0; z < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length; z++) {
                _mockData = this.showField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show[z]);
              }
            } else {
              for (let y = 0; y < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide.length; y++) {
                _mockData = this.hideField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide[y], true);
              }

              for (let z = 0; z < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length; z++) {
                _mockData = this.showField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show[z], true);
              }
            }
          }
        }
      }
    }

    setMockData(_mockData);
  };

  handleChange = (e, property, isRequired, pattern, requiredErrMsg = 'Required', patternErrMsg = 'Pattern Missmatch') => {
    let { getVal } = this;
    let { handleChange, mockData, setDropDownData } = this.props;
    let hashLocation = window.location.hash;
    let obj = specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`];
    // console.log(obj);
    let depedants = jp.query(obj, `$.groups..fields[?(@.jsonPath=="${property}")].depedants.*`);
    this.checkIfHasShowHideFields(property, e.target.value);
    handleChange(e, property, isRequired, pattern, requiredErrMsg, patternErrMsg);

    _.forEach(depedants, function(value, key) {
      if (value.type == 'dropDown') {
        if (e.target.value) {
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
              // if(queryStringObject[i].split("=")[1].startsWith("^")){
              //   id[queryStringObject[i].split("=")[0]]=queryStringObject[i].split("=")[1].replace(/\^/, "");
              //   continue;
              // }
              if (queryStringObject[i].split('=')[1].search('{') > -1) {
                if (
                  queryStringObject[i]
                    .split('=')[1]
                    .split('{')[1]
                    .split('}')[0] == property
                ) {
                  console.log(
                    'replacing!!!',
                    queryStringObject[i].split('=')[1],
                    queryStringObject[i].split('=')[1].replace(/\{(.*?)\}/, e.target.value)
                  );
                  id[queryStringObject[i].split('=')[0]] = queryStringObject[i].split('=')[1].replace(/\{(.*?)\}/, e.target.value) || '';
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
              if (response) {
                let keys = jp.query(response, splitArray[1].split('|')[1]);
                let values = jp.query(response, splitArray[1].split('|')[2]);
                let dropDownData = [];
                for (var k = 0; k < keys.length; k++) {
                  let obj = {};
                  obj['key'] = keys[k];
                  obj['value'] = values[k];
                  dropDownData.push(obj);
                }

                dropDownData.sort(function(s1, s2) {
                  return s1.value < s2.value ? -1 : s1.value > s2.value ? 1 : 0;
                });
                dropDownData.unshift({
                  key: null,
                  value: '-- Please Select --',
                });
                setDropDownData(value.jsonPath, dropDownData);

              }
            },
            function(err) {
              console.log(err);
            }
          );
          // console.log(id);
          // console.log(context);
        } else {
          setDropDownData(value.jsonPath, []);
        }
      } else if (value.type == 'textField') {
        let object = {
          target: {
            value: eval(eval(value.pattern)),
          },
        };
        handleChange(object, value.jsonPath, value.isRequired, value.rg, value.requiredErrMsg, value.patternErrMsg);
      }
    });
  //  call function  to clear dependent dropdown
  };
  rowButtonClickHandler = (buttonUrl, id) => {
    let { formData } = this.props;
    let { resultList } = this.state;
    console.log(resultList);
    if (id) {
      localStorage.setItem('returnUrl', window.location.hash.split('#/')[1]);
      localStorage.setItem('formData', JSON.stringify(formData));
      this.props.setRoute(buttonUrl + id);
    } else {
      if(resultList.actionItems[0].multiSelect){
          let tableSelectionData = [...this.state.selectedRecords] || [];
          let selectedIds='';
          if(tableSelectionData.length>0){
            // for(let i=0;i<tableSelectionData.length;i++)
            // {
            //   selectedIds+=tableSelectionData[i]+',';
            // }
        //  if (selectedIds!='') {
            localStorage.setItem('returnUrl', window.location.hash.split('#/')[1]);
            localStorage.setItem('formData', JSON.stringify(formData));
            if(buttonUrl.indexOf('?')>-1){
              localStorage.setItem('bodyParams',tableSelectionData);
                buttonUrl = buttonUrl.split('?')[0];
                 this.props.setRoute(buttonUrl);
            }else{
              this.props.setRoute(buttonUrl + tableSelectionData);
            }

          // }
          }

      }
      else{
         let { selectedRecordId } = this.state;
      if (selectedRecordId) {
        localStorage.setItem('returnUrl', window.location.hash.split('#/')[1]);
        localStorage.setItem('formData', JSON.stringify(formData));
        this.props.setRoute(buttonUrl + selectedRecordId);
      }
      }

    }
  };
  rowCheckboxClickHandler = code => {
    // let multi = this.state.actionItems.multiSelect;
    //  if(multi){
        let { resultList } = this.state;
        if(resultList.actionItems[0].multiSelect){
      let tableSelectionData = [...this.state.selectedRecords] || [];
      let idx = tableSelectionData.indexOf(code);

      if (idx > -1) tableSelectionData.splice(idx, 1);
      else {
       // if (this.props.resultList.isMultipleSelection)
       tableSelectionData.push(code);
        // else tableSelectionData[0] = code;
      }
      // this.props.setTableSelectionData(tableSelectionData);
       this.setState({
      selectedRecords: tableSelectionData,
    });
   }
   else{
    this.setState({
      selectedRecordId: code,
    });
   }
  };

  rowClickHandler = index => {
    let { formData } = this.props;
    var value = this.state.values[index];
    var _url =
      window.location.hash.split('/').indexOf('update') > -1
        ? this.props.metaData[`${this.props.moduleName}.${this.props.actionName}`].result.rowClickUrlUpdate
        : this.props.metaData[`${this.props.moduleName}.${this.props.actionName}`].result.rowClickUrlView;

    //======================Check if direct URL or array====================>>
    if (typeof _url == 'object') {
      let isMatchFound = false;
      for (var i = 0; i < _url.multiple.length; i++) {
        var _key = _url.multiple[i].ifValue.split('=')[0];
        var _value = _url.multiple[i].ifValue.split('=')[1];
        if (_.get(value, _key) === _value) {
          _url = _url.multiple[i].goto;
          isMatchFound = true;
          break;
        }
      }
      if (!isMatchFound) _url = _url.default;
    }

    console.log(formData);
    localStorage.setItem('formData', JSON.stringify(formData));
    localStorage.setItem('returnUrl', window.location.hash.split('#/')[1]);

    //======================================================================>>
    if (_url.indexOf('?') > -1) {
      var url = _url.split('?')[0];
      var query = _url.split('?')[1];
      var params = query.indexOf('&') > -1 ? query.split('&') : [query];
      var queryString = '?';
      for (var i = 0; i < params.length; i++) {
        queryString +=
          (i > 0 ? '&' : '') +
          params[i].split('=')[0] +
          '=' +
          (/\{/.test(params[i])
            ? encodeURIComponent(
                _.get(
                  value,
                  params[i]
                    .split('=')[1]
                    .split('{')[1]
                    .split('}')[0]
                )
              )
            : params[i].split('=')[1]);
      }
      var key = url.split('{')[1].split('}')[0];
      url = url.replace('{' + key + '}', encodeURIComponent(_.get(value, key)));
      this.props.setRoute(url + queryString);
    } else {
      var key = _url.split('{')[1].split('}')[0];
      _url = _url.replace('{' + key + '}', encodeURIComponent(_.get(value, key)));
      this.props.setRoute(_url);
    }
  };

  rowIconClickHandler = (index, action) => {
    let { formData } = this.props;
    var value = this.state.values[index];
    var _url =
      action == 'update'
        ? this.props.metaData[`${this.props.moduleName}.${this.props.actionName}`].result.rowClickUrlUpdate
        : this.props.metaData[`${this.props.moduleName}.${this.props.actionName}`].result.rowClickUrlView;

    //======================Check if direct URL or array====================>>
    if (typeof _url == 'object') {
      let isMatchFound = false;
      for (var i = 0; i < _url.multiple.length; i++) {
        var _key = _url.multiple[i].ifValue.split('=')[0];
        var _value = _url.multiple[i].ifValue.split('=')[1];
        if (_.get(value, _key) === _value) {
          _url = _url.multiple[i].goto;
          isMatchFound = true;
          break;
        }
      }
      if (!isMatchFound) _url = _url.default;
    }

    console.log(formData);
    localStorage.setItem('formData', JSON.stringify(formData));
    localStorage.setItem('returnUrl', window.location.hash.split('#/')[1]);

    //======================================================================>>
    if (_url.indexOf('?') > -1) {
      var url = _url.split('?')[0];
      var query = _url.split('?')[1];
      var params = query.indexOf('&') > -1 ? query.split('&') : [query];
      var queryString = '?';
      for (var i = 0; i < params.length; i++) {
        queryString +=
          (i > 0 ? '&' : '') +
          params[i].split('=')[0] +
          '=' +
          (/\{/.test(params[i])
            ? encodeURIComponent(
                _.get(
                  value,
                  params[i]
                    .split('=')[1]
                    .split('{')[1]
                    .split('}')[0]
                )
              )
            : params[i].split('=')[1]);
      }
      var key = url.split('{')[1].split('}')[0];
      url = url.replace('{' + key + '}', encodeURIComponent(_.get(value, key)));

      action == 'update' && url.replace('/view', '/update');
      this.props.setRoute(url + queryString);
    } else {
      var key = _url.split('{')[1].split('}')[0];
      _url = _url.replace('{' + key + '}', encodeURIComponent(_.get(value, key)));
      action == 'update' && _url.replace('/view', '/update');
      this.props.setRoute(_url);
    }
  };

  resetForm = () => {
    let { moduleName, actionName, metaData, setFormData } = this.props;
    let obj = metaData[`${moduleName}.${actionName}`];
    var formData = {};
    if (obj && obj.groups && obj.groups.length) this.setDefaultValues(obj.groups, formData);
    setFormData(formData);
    this.setState({
      pathname: this.props.history.location.pathname,
      showResult: false,
    });
  };

  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors, isFormValid } = this.props;
    let {
      search,
      handleChange,
      getVal,
      addNewCard,
      removeCard,
      rowClickHandler,
      rowButtonClickHandler,
      rowCheckboxClickHandler,
      rowIconClickHandler,
    } = this;
    let { showResult, resultList, selectedRecordId, selectedRecords,orientation } = this.state;
    let customActionsAndUrl =
      !_.isEmpty(mockData[`${moduleName}.${actionName}`]) && mockData[`${moduleName}.${actionName}`].hasOwnProperty('customActionsAndUrl')
        ? mockData[`${moduleName}.${actionName}`]['customActionsAndUrl'][0].url
        : '';
    return (
      <div className="SearchResult">
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
          <Col xs={6} md={6}>
            <div
              style={{
                textAlign: 'right',
                marginRight: '16px',
                marginTop: '16px',
              }}
            >
              <UiAddButton customUrl={customActionsAndUrl} />
            </div>
          </Col>
        </Row>
        <form
          onSubmit={e => {
            search(e);
          }}
        >
          {!_.isEmpty(mockData) &&
            moduleName &&
            actionName &&
            mockData[`${moduleName}.${actionName}`] && (
              <ShowFields
                groups={mockData[`${moduleName}.${actionName}`].groups}
                noCols={mockData[`${moduleName}.${actionName}`].numCols}
                ui="google"
                handler={handleChange}
                getVal={getVal}
                fieldErrors={fieldErrors}
                useTimestamp={mockData[`${moduleName}.${actionName}`].useTimestamp || false}
                addNewCard={''}
                removeCard={''}
              />
            )}
          <div
            style={{
              textAlign: 'right',
              color: '#FF0000',
              marginRight: '16px',
            }}
          >
            <i>( * ) {translate('framework.required.note')}</i>{' '}
          </div>

          <div style={{ textAlign: 'center' }}>
            <br />
            <UiButton
              icon={
                <i style={{ color: 'white' }} className="material-icons">
                  search
                </i>
              }
              item={{
                label: 'Search',
                uiType: 'submit',
                isDisabled: isFormValid ? false : true,
              }}
              ui="google"
            />&nbsp;&nbsp;
            {showResult &&
              resultList.actionItems &&
              resultList.actionItems.map((actionitem, index) => {
                return (
                  <span style={{ 'margin-right': '20px' }}>
                    <UiButton
                      item={{ label: actionitem.label, uiType: 'primary' }}
                      ui="google"
                      handler={() => {
                        rowButtonClickHandler(actionitem.url);
                      }}
                    />
                  </span>
                );
              })}
            <UiButton
              icon={
                <i style={{ color: 'black' }} className="material-icons">
                  backspace
                </i>
              }
              item={{ label: 'Reset', uiType: 'button', primary: false }}
              ui="google"
              handler={this.resetForm}
            />&nbsp;&nbsp;
          {/*  <UiLogo src={require("../../images/logo.png")} alt="logo"/>
            <br />*/}
            {showResult && (
              <UiTable
                resultList={resultList}
                rowClickHandler={rowClickHandler}
                rowButtonClickHandler={rowButtonClickHandler}
                rowCheckboxClickHandler={rowCheckboxClickHandler}
                rowIconClickHandler={rowIconClickHandler}
                selectedValue={selectedRecordId}
                selectedValues={selectedRecords}
                orientation={orientation}
              />
            )}
          </div>
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
  flag: state.report.flag,
  isFormValid: state.frameworkForm.isFormValid,
  dropDownData: state.framework.dropDownData,
  dropDownOriginalData: state.framework.dropDownOriginalData,
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
    dispatch({
      type: 'TOGGLE_SNACKBAR_AND_SET_TEXT',
      snackbarState,
      toastMsg,
      isSuccess,
      isError,
    });
  },
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
  setFlag: flag => {
    dispatch({ type: 'SET_FLAG', flag });
  },
  setFormData: data => {
    dispatch({ type: 'SET_FORM_DATA', data });
  },
  setDropDownData: (fieldName, dropDownData) => {
    // console.log(fieldName,dropDownData)
    dispatch({ type: 'SET_DROPDWON_DATA', fieldName, dropDownData });
  },
  setDropDownOriginalData: (fieldName, dropDownData) => {
    dispatch({ type: 'SET_ORIGINAL_DROPDWON_DATA', fieldName, dropDownData });
  },
  resetDropdownData: () => {
    dispatch({ type: 'RESET_DROPDOWN_DATA' });
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Search);
