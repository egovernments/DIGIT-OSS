import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';

import RaisedButton from 'material-ui/RaisedButton';

import _ from 'lodash';
import ShowFields from '../../../../framework/showFields';

import { translate } from '../../../../common/common';
import Api from '../../../../../api/api';
import UiButton from '../../../../framework/components/UiButton';
import UiDynamicTable from '../../../../framework/components/UiDynamicTable';
import { fileUpload } from '../../../../framework/utility/utility';
import UiTable from '../../../../framework/components/UiTable';
import IconButton from 'material-ui/IconButton';
// import "jspdf";
// import "jspdf-autotable";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

var specifications = {};

let reqRequired = [];
class Report extends Component {
  state = {
    pathname: '',
    pdfData: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      showResult: false,
      resultList: {
        resultHeader: [],
        resultValues: [],
      },
      values: [],
    };
  }

  setLabelAndReturnRequired(configObject) {
    if (configObject && configObject.groups) {
      for (var i = 0; i < configObject.groups.length; i++) {
        configObject.groups[i].label = translate(configObject.groups[i].label);
        for (var j = 0; j < configObject.groups[i].fields.length; j++) {
          configObject.groups[i].fields[j].label = translate(configObject.groups[i].fields[j].label);
          if (configObject.groups[i].fields[j].isRequired) reqRequired.push(configObject.groups[i].fields[j].jsonPath);
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
    var val = _.get(this.props.formData, path);
    if (val && ((val + '').length == 13 || (val + '').length == 12) && new Date(Number(val)).getTime() > 0) {
      var _date = new Date(Number(val));
      return ('0' + _date.getDate()).slice(-2) + '/' + ('0' + (_date.getMonth() + 1)).slice(-2) + '/' + _date.getFullYear();
    }

    return typeof val != 'undefined' ? val : '';
  };

  initData() {
    let self = this;
    let hashLocation = window.location.hash;
    specifications = require('../../../../framework/specs/collection/master/receipt').default;
    let { setMetaData, setModuleName, setActionName, initForm, setMockData, setFormData } = this.props;
    let obj = specifications[`collection.view`];

    Api.commonApiPost(
      obj.url,
      {
        transactionId: this.props.match.params.hasOwnProperty('id') ? this.props.match.params.id : '',
        receiptDetailsRequired: true,
      },
      {},
      null,
      obj.useTimestamp
    ).then(
      function(res) {
        // console.log(res);
        self.handleChange({ target: { value: res.Receipt } }, 'Receipt', false, '', '');
        self.props.setLoadingStatus('hide');
        var resultList = {
          resultHeader: [{ label: '#' }, ...obj.result.header],
          resultValues: [],
        };
        var specsValuesList = obj.result.values;
        var values = _.get(res, obj.result.resultPath);
        if (values && values.length) {
          for (var i = 0; i < values.length; i++) {
            var tmp = [i + 1];
            for (var j = 0; j < specsValuesList.length; j++) {
              tmp.push(_.get(values[i], specsValuesList[j]));
            }
            resultList.resultValues.push(tmp);
          }
        }
        self.setState({
          resultList,
          values,
          showResult: true,
        });

        self.props.setFlag(1);
      },
      function(err) {
        self.props.toggleSnackbarAndSetText(true, err.message, false, true);
        self.props.setLoadingStatus('hide');
      }
    );
    // try {
    //   var hash = window.location.hash.split("/");
    //   if(hash.length == 4 && hashLocation.split("/")[1]!="transaction") {
    //     specifications = require(`./specs/${hash[2]}/${hash[2]}`).default;
    //   } else if(hashLocation.split("/")[1]!="transaction"){
    //     specifications = require(`./specs/${hash[2]}/master/${hash[3]}`).default;
    //   } else {
    //     specifications = require(`./specs/${hash[2]}/transaction/${hash[3]}`).default;
    //   }
    // } catch(e) {}

    reqRequired = [];
    this.setLabelAndReturnRequired(obj);
    initForm(reqRequired);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('collection');
    setActionName('view');
    var formData = {};
    if (obj && obj.groups && obj.groups.length) this.setDefaultValues(obj.groups, formData);
    setFormData(formData);
    this.setState({
      pathname: this.props.history.location.pathname,
    });
  }

  componentDidMount() {
    this.initData();
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.pathname != nextProps.history.location.pathname) {
      this.initData();
    }
  }

  // search = (e) => {
  //   e.preventDefault();
  //   let self = this;
  //   self.props.setLoadingStatus('loading');
  //   var formData = {...this.props.formData};
  //   for(var key in formData) {
  //     if(formData[key] !== "" && typeof formData[key] == "undefined")
  //       delete formData[key];
  //   }
  //
  //   Api.commonApiPost(self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].url, formData, {}, null, self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].useTimestamp).then(function(res){
  //     self.props.setLoadingStatus('hide');
  //     var resultList = {
  //       resultHeader: [{label: "#"}, ...self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.header],
  //       resultValues: []
  //     };
  //     var specsValuesList = self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.values;
  //     var values = _.get(res, self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].result.resultPath);
  //     if(values && values.length) {
  //       for(var i=0; i<values.length; i++) {
  //         var tmp = [i+1];
  //         for(var j=0; j<specsValuesList.length; j++) {
  //           tmp.push(_.get(values[i], specsValuesList[j]));
  //         }
  //         resultList.resultValues.push(tmp);
  //       }
  //     }
  //     self.setState({
  //       resultList,
  //       values,
  //       showResult: true
  //     });
  //
  //     self.props.setFlag(1);
  //   }, function(err) {
  //     self.props.toggleSnackbarAndSetText(true, err.message, false, true);
  //     self.props.setLoadingStatus('hide');
  //   })
  // }

  handleChange = (e, property, isRequired, pattern, requiredErrMsg = 'Required', patternErrMsg = 'Pattern Missmatch') => {
    let { handleChange } = this.props;
    handleChange(e, property, isRequired, pattern, requiredErrMsg, patternErrMsg);
  };

  rowClickHandler = index => {
    var value = this.state.values[index];
    var _url =
      window.location.hash.split('/').indexOf('update') > -1
        ? this.props.metaData[`${this.props.moduleName}.${this.props.actionName}`].result.rowClickUrlUpdate
        : this.props.metaData[`${this.props.moduleName}.${this.props.actionName}`].result.rowClickUrlView;
    var key = _url.split('{')[1].split('}')[0];
    _url = _url.replace('{' + key + '}', _.get(value, key));
    this.props.setRoute(_url);
  };

  getPurposeTotal = (purpose = '', item = []) => {
    let sum = 0;
    _.forEach(_.filter(item, { purpose: purpose }), (value, key) => {
      sum += value.creditAmount;
    });
    return sum;
  };

  getTotal = (item = []) => {
    let sum = 0;
    _.forEach(item, (value, key) => {
      sum += value.creditAmount;
    });
    return sum;
  };

  getGrandTotal = (purpose = '', item = []) => {
    let sum = 0;
    if (purpose) {
      _.forEach(item, (value, key) => {
        _.forEach(_.filter(value.billAccountDetails, { purpose: purpose }), (value1, key1) => {
          sum += value1.creditAmount;
        });
      });
    } else {
      _.forEach(item, (value, key) => {
        _.forEach(value.billAccountDetails, (value1, key1) => {
          sum += value1.creditAmount;
        });
      });
    }

    return sum;
  };

  int_to_words = int => {
    if (int === 0) return 'zero';

    var ONES = [
      '',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen',
    ];
    var TENS = ['', '', 'twenty', 'thirty', 'fourty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    var SCALE = [
      '',
      'thousand',
      'million',
      'billion',
      'trillion',
      'quadrillion',
      'quintillion',
      'sextillion',
      'septillion',
      'octillion',
      'nonillion',
    ];

    // Return string of first three digits, padded with zeros if needed
    function get_first(str) {
      return ('000' + str).substr(-3);
    }

    // Return string of digits with first three digits chopped off
    function get_rest(str) {
      return str.substr(0, str.length - 3);
    }

    // Return string of triplet convereted to words
    function triplet_to_words(_3rd, _2nd, _1st) {
      return (
        (_3rd == '0' ? '' : ONES[_3rd] + ' hundred ') +
        (_1st == '0' ? TENS[_2nd] : (TENS[_2nd] && TENS[_2nd] + '-') || '') +
        (ONES[_2nd + _1st] || ONES[_1st])
      );
    }

    // Add to words, triplet words with scale word
    function add_to_words(words, triplet_words, scale_word) {
      return triplet_words ? triplet_words + ((scale_word && ' ' + scale_word) || '') + ' ' + words : words;
    }

    function iter(words, i, first, rest) {
      if (first == '000' && rest.length === 0) return words;
      return iter(add_to_words(words, triplet_to_words(first[0], first[1], first[2]), SCALE[i]), ++i, get_first(rest), get_rest(rest));
    }

    return iter('', 0, get_first(String(int)), get_rest(String(int)));
  };

  print = () => {
    window.print();
  };

  generatePdf = () => {
    let { tenantInfo, formData } = this.props;
    let { getVal, getGrandTotal, getTotal, getPurposeTotal } = this;

    let x = 5,
      y = 5,
      w = 200,
      h = 90,
      rectGap = 10,
      originalX = 5,
      originalY = 10,
      dublicateX = 5,
      dublicateY = 5,
      triplicateX = 5,
      triplicateY = 5;

    var doc = new jsPDF();
    // doc.rect(x, y, w, h)
    // doc.rect(x, (h*1)+rectGap, w, h)
    // doc.rect(x, (h*2)+rectGap+5, w, h)
    if (localStorage.getItem('type') != 'EMPLOYEE') {
      doc.setFontSize(14);
      doc.setFontType('bold');
      doc.text(originalX + 100, originalY + 5, translate(tenantInfo[0].city.name), 'center');
      doc.text(originalX + 170, originalY + 5, 'Original');
      doc.setFontType('normal');
      doc.setFontSize(10);
      doc.text(originalX + 100, originalY + 10, 'Receipt', 'center');

      var elem = document.getElementById('basic-table1');
      var res = doc.autoTableHtmlToJson(elem);
      doc.autoTable(res.columns, res.data, {
        showHeader: 'never',
        startY: originalY + 12,
      });

      elem = document.getElementById('basic-table2');
      res = doc.autoTableHtmlToJson(elem);
      doc.autoTable(res.columns, res.data, {
        startY: doc.autoTable.previous.finalY,
        theme: 'grid',
      });

      elem = document.getElementById('basic-table3');
      res = doc.autoTableHtmlToJson(elem);
      doc.autoTable(res.columns, res.data, {
        showHeader: 'never',
        startY: doc.autoTable.previous.finalY,
      });
      doc.autoPrint();
      var res = doc.output('datauristring');
      // doc.save('Receipt-' + getVal("Receipt[0].transactionId") + '.pdf');
    } else {
      doc.setFontSize(14);
      doc.setFontType('bold');
      doc.text(originalX + 100, originalY + 5, translate(tenantInfo[0].city.name), 'center');
      doc.text(originalX + 170, originalY + 5, 'Original');
      doc.setFontType('normal');
      doc.setFontSize(10);
      doc.text(originalX + 100, originalY + 10, 'Receipt', 'center');

      var elem = document.getElementById('basic-table1');
      var res = doc.autoTableHtmlToJson(elem);
      doc.autoTable(res.columns, res.data, {
        showHeader: 'never',
        startY: originalY + 12,
      });

      elem = document.getElementById('basic-table2');
      res = doc.autoTableHtmlToJson(elem);
      doc.autoTable(res.columns, res.data, {
        startY: doc.autoTable.previous.finalY,
        theme: 'grid',
      });

      elem = document.getElementById('basic-table3');
      res = doc.autoTableHtmlToJson(elem);
      doc.autoTable(res.columns, res.data, {
        showHeader: 'never',
        startY: doc.autoTable.previous.finalY,
      });
      //1 r
      doc.setLineWidth(0.5);
      doc.line(doc.autoTable.previous.finalX + 12.5, 25, 210, 25);

      doc.setFontSize(14);
      doc.setFontType('bold');
      doc.text(originalX + 100, doc.autoTable.previous.finalY + 25, translate(tenantInfo[0].city.name), 'center');
      doc.text(originalX + 170, doc.autoTable.previous.finalY + 25, 'Duplicate');
      doc.setFontType('normal');
      doc.setFontSize(10);
      doc.text(originalX + 100, doc.autoTable.previous.finalY + 30, 'Receipt', 'center');

      var elem = document.getElementById('basic-table1');
      var res = doc.autoTableHtmlToJson(elem);
      doc.autoTable(res.columns, res.data, {
        showHeader: 'never',
        startY: doc.autoTable.previous.finalY + 32,
      });

      elem = document.getElementById('basic-table2');
      res = doc.autoTableHtmlToJson(elem);
      doc.autoTable(res.columns, res.data, {
        startY: doc.autoTable.previous.finalY,
        theme: 'grid',
      });

      elem = document.getElementById('basic-table3');
      res = doc.autoTableHtmlToJson(elem);
      doc.autoTable(res.columns, res.data, {
        showHeader: 'never',
        startY: doc.autoTable.previous.finalY,
      });

      doc.setLineWidth(0.5);
      doc.line(doc.autoTable.previous.finalX + 12.5, 25, 210, 25);

      doc.setFontSize(14);
      doc.setFontType('bold');
      doc.text(originalX + 100, doc.autoTable.previous.finalY + 25, translate(tenantInfo[0].city.name), 'center');
      doc.text(originalX + 170, doc.autoTable.previous.finalY + 25, 'Triplicate');
      doc.setFontType('normal');
      doc.setFontSize(10);
      doc.text(originalX + 100, doc.autoTable.previous.finalY + 30, 'Receipt', 'center');

      var elem = document.getElementById('basic-table1');
      var res = doc.autoTableHtmlToJson(elem);
      doc.autoTable(res.columns, res.data, {
        showHeader: 'never',
        startY: doc.autoTable.previous.finalY + 32,
      });

      elem = document.getElementById('basic-table2');
      res = doc.autoTableHtmlToJson(elem);
      doc.autoTable(res.columns, res.data, {
        startY: doc.autoTable.previous.finalY,
        theme: 'grid',
      });

      elem = document.getElementById('basic-table3');
      res = doc.autoTableHtmlToJson(elem);
      doc.autoTable(res.columns, res.data, {
        showHeader: 'never',
        startY: doc.autoTable.previous.finalY,
      });

      // doc.setFontSize(14);
      // doc.setFontType("bold");
      // doc.text(originalX+100, doc.autoTable.previous.finalY+25, "Receipt"+" Duplicate" , 'center');
      // doc.setFontType("normal");
      // doc.text(originalX+100, doc.autoTable.previous.finalY+30,translate(tenantInfo[0].city.name), 'center');
      // doc.setFontSize(10);
      //
      // var elem = document.getElementById("basic-table1");
      // var res = doc.autoTableHtmlToJson(elem);
      // doc.autoTable(res.columns, res.data, {showHeader:"never",startY: doc.autoTable.previous.finalY+37,columnStyles: {
      //       "Payee Name": {fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold'}
      //   }});
      //
      // elem = document.getElementById("basic-table2");
      // res = doc.autoTableHtmlToJson(elem);
      // doc.autoTable(res.columns, res.data, {startY: doc.autoTable.previous.finalY,theme: "striped"});
      //
      //
      // //duplicate
      // doc.setFontSize(14);
      // doc.setFontType("bold");
      // doc.text(originalX+100, doc.autoTable.previous.finalY+25, "Receipt"+" Triplicate" , 'center');
      // doc.setFontType("normal");
      // doc.text(originalX+100, doc.autoTable.previous.finalY+30,translate(tenantInfo[0].city.name), 'center');
      // doc.setFontSize(10);
      //
      // var elem = document.getElementById("basic-table1");
      // var res = doc.autoTableHtmlToJson(elem);
      // doc.autoTable(res.columns, res.data, {showHeader:"never",startY:doc.autoTable.previous.finalY+ 37,columnStyles: {
      //       "Payee Name": {fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold'}
      //   }});
      //
      // elem = document.getElementById("basic-table2");
      // res = doc.autoTableHtmlToJson(elem);
      // doc.autoTable(res.columns, res.data, {startY:doc.autoTable.previous.finalY,theme: "striped"});
      doc.autoPrint();
      var res = doc.output('datauristring');

      // doc.save('Receipt-' + getVal("Receipt[0].transactionId") + '.pdf');
    }
    this.setState({
      pdfData: res,
    });
  };

  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors, isFormValid, tenantInfo } = this.props;
    let {
      search,
      handleChange,
      getVal,
      addNewCard,
      removeCard,
      rowClickHandler,
      getPurposeTotal,
      getTotal,
      getGrandTotal,
      int_to_words,
      print,
      generatePdf,
    } = this;
    let { showResult, resultList, pdfData } = this.state;
    // console.log(tenantInfo);
    // console.log(formData);
    return (
      <div className="SearchResult">
        {pdfData != undefined && (
          <div style={{ visibility: 'hidden', position: 'absolute', zIndex: '-2' }}>
            <iframe src={this.state.pdfData} height="200" width="300" />
          </div>
        )}

        {formData.hasOwnProperty('Receipt') && (
          <div>
            {' '}
            <Card className="uiCard" id="receipt">
              <CardHeader title={''} />
              <CardText>
                <Grid>
                  <Row>
                    <Col style={{ textAlign: 'center' }} xs={12} md={12}>
                      <h4>
                        <strong> {translate(tenantInfo[0].city.name)} </strong>
                      </h4>
                      <br />
                      <span>{translate('collection.pay.receipt')}</span>
                    </Col>{' '}
                  </Row>

                  <br />

                  <Row className="show-grid" style={{ display: 'none' }}>
                    <Table responsive id="basic-table1">
                      <thead>
                        <tr>
                          <th>{translate('collection.pay.key')}</th>
                          <th>{translate('collection.pay.value')}</th>
                          {/*<th>Address</th>
                              <th>Transaction Id</th>*/}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <strong>{translate('collection.reciept.id')}</strong> - {getVal('Receipt[0].transactionId')}
                          </td>

                          <td>
                            <strong>{translate('wc.create.receiptDate')}</strong> - {getVal('Receipt[0].Bill[0].billDetails[0].receiptDate')}
                          </td>

                          {/*<td></td>
                          <td></td>*/}
                        </tr>
                        <tr>
                          <td>
                            <strong>{translate('collection.reciept.name')}</strong> - {getVal('Receipt[0].Bill[0].paidBy')}
                          </td>

                          <td>
                            <strong>{translate('wc.create.groups.applicantDetails.address')}</strong> - {getVal('Receipt[0].Bill[0].payeeAddress')}
                          </td>

                          {/*<td></td>
                            <td></td>*/}
                        </tr>
                        {/*  <tr>
                            <td><strong>Address</strong> - {getVal("Receipt[0].Bill[0].payeeAddress")}</td>
                            <td> </td>
                            <td></td>
                            <td></td>


                        </tr>
                        <tr>
                            <td><strong>Transaction Id</strong> - {getVal("Receipt[0].transactionId")}</td>
                            <td></td>
                            <td></td>
                            <td></td>

                        </tr>*/}
                      </tbody>
                    </Table>
                  </Row>
                  <Row>
                    <Col xs={12} md={3}>
                      <strong>{translate('collection.reciept.name')} - </strong>
                      {getVal('Receipt[0].Bill[0].paidBy')}{' '}
                    </Col>
                    {/*<Col xs={12} md={3}><strong>Receipt Date - </strong>{getVal("Receipt[0].instrument") && getVal("Receipt[0].instrument.transactionDate").split("-")[2]+"-"+getVal("Receipt[0].instrument.transactionDate").split("-")[1]+"-"+getVal("Receipt[0].instrument.transactionDate").split("-")[0]} </Col>*/}
                    <Col xs={12} md={3}>
                      <strong>{translate('wc.create.receiptDate')} - </strong>
                      {getVal('Receipt[0].Bill[0].billDetails[0].receiptDate')}{' '}
                    </Col>
                    <Col xs={12} md={3}>
                      <strong>{translate('wc.create.groups.applicantDetails.address')} - </strong>
                      {getVal('Receipt[0].Bill[0].payeeAddress')}{' '}
                    </Col>
                    <Col xs={12} md={3} style={{ textAlign: 'right' }}>
                      <strong>{translate('collection.reciept.id')} - </strong>
                      {getVal('Receipt[0].transactionId')}{' '}
                    </Col>
                  </Row>
                  <br />

                  <Row>
                    <Col className="text-center" xs={12} md={12}>
                      {showResult && (
                        <Table bordered condensed responsive id="basic-table2" className="table-striped">
                          <thead>
                            <tr>
                              <th>{translate('collection.create.serviceType')}</th>
                              <th>{translate('collection.create.receiptNumber')}</th>
                              <th>{translate('collection.create.consumerCode')}</th>
                              {/*<th>{translate("collection.search.period")}</th>*/}
                              {getGrandTotal('ARREAR_AMOUNT', formData.Receipt[0].Bill[0].billDetails) > 0 && (
                                <th style={{ textAlign: 'right' }}>{translate('collection.search.arrears')}</th>
                              )}
                              {getGrandTotal('CURRENT_AMOUNT', formData.Receipt[0].Bill[0].billDetails) > 0 && (
                                <th style={{ textAlign: 'right' }}>{translate('collection.search.current')}</th>
                              )}
                              {getGrandTotal('OTHERS', formData.Receipt[0].Bill[0].billDetails) > 0 && (
                                <th style={{ textAlign: 'right' }}>{translate('collection.search.interest')}</th>
                              )}
                              {getGrandTotal('REBATE', formData.Receipt[0].Bill[0].billDetails) > 0 && (
                                <th style={{ textAlign: 'right' }}>{translate('collection.search.rebate')}</th>
                              )}
                              {getGrandTotal('ADVANCE_AMOUNT', formData.Receipt[0].Bill[0].billDetails) > 0 && (
                                <th style={{ textAlign: 'right' }}>{translate('collection.create.advance')}</th>
                              )}
                              {getGrandTotal('ARREAR_LATEPAYMENT_CHARGES', formData.Receipt[0].Bill[0].billDetails) > 0 && (
                                <th style={{ textAlign: 'right' }}>{translate('collection.create.arrearLatePayment')}</th>
                              )}
                              {getGrandTotal('CURRENT_LATEPAYMENT_CHARGES', formData.Receipt[0].Bill[0].billDetails) > 0 && (
                                <th style={{ textAlign: 'right' }}>{translate('collection.create.currentLatePayment')}</th>
                              )}
                              {getGrandTotal('CHEQUE_BOUNCE_PENALTY', formData.Receipt[0].Bill[0].billDetails) > 0 && (
                                <th style={{ textAlign: 'right' }}>{translate('collection.create.checkLatePayment')}</th>
                              )}
                              <th style={{ textAlign: 'right' }}>{translate('collection.create.total')}</th>

                              {/*resultList.resultHeader && resultList.resultHeader.length && resultList.resultHeader.map((item, i) => {
                          return (
                            <th  key={i}>{translate(item.label)}</th>
                          )
                        })*/}
                            </tr>
                          </thead>
                          <tbody>
                            {formData.Receipt[0].Bill[0].billDetails.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>{item.businessService} </td>
                                  <td>{item.receiptNumber} </td>
                                  <td>{item.consumerCode} </td>
                                  {/*<td>{item.period} </td>*/}
                                  {getGrandTotal('ARREAR_AMOUNT', formData.Receipt[0].Bill[0].billDetails) > 0 && (
                                    <td style={{ textAlign: 'right' }}>{getPurposeTotal('ARREAR_AMOUNT', item.billAccountDetails)}</td>
                                  )}
                                  {getGrandTotal('CURRENT_AMOUNT', formData.Receipt[0].Bill[0].billDetails) > 0 && (
                                    <td style={{ textAlign: 'right' }}>{getPurposeTotal('CURRENT_AMOUNT', item.billAccountDetails)}</td>
                                  )}
                                  {getGrandTotal('OTHERS', formData.Receipt[0].Bill[0].billDetails) > 0 && (
                                    <td style={{ textAlign: 'right' }}>{getPurposeTotal('OTHERS', item.billAccountDetails)}</td>
                                  )}
                                  {getGrandTotal('REBATE', formData.Receipt[0].Bill[0].billDetails) > 0 && (
                                    <td style={{ textAlign: 'right' }}>{getPurposeTotal('REBATE', item.billAccountDetails)}</td>
                                  )}
                                  {getGrandTotal('ADVANCE_AMOUNT', formData.Receipt[0].Bill[0].billDetails) > 0 && (
                                    <td style={{ textAlign: 'right' }}>{getPurposeTotal('ADVANCE_AMOUNT', item.billAccountDetails)}</td>
                                  )}
                                  {getGrandTotal('ARREAR_LATEPAYMENT_CHARGES', formData.Receipt[0].Bill[0].billDetails) > 0 && (
                                    <td style={{ textAlign: 'right' }}>{getPurposeTotal('ARREAR_LATEPAYMENT_CHARGES', item.billAccountDetails)}</td>
                                  )}
                                  {getGrandTotal('CURRENT_LATEPAYMENT_CHARGES', formData.Receipt[0].Bill[0].billDetails) > 0 && (
                                    <td style={{ textAlign: 'right' }}>{getPurposeTotal('CURRENT_LATEPAYMENT_CHARGES', item.billAccountDetails)}</td>
                                  )}
                                  {getGrandTotal('CHEQUE_BOUNCE_PENALTY', formData.Receipt[0].Bill[0].billDetails) > 0 && (
                                    <td style={{ textAlign: 'right' }}>{getPurposeTotal('CHEQUE_BOUNCE_PENALTY', item.billAccountDetails)}</td>
                                  )}
                                  <td style={{ textAlign: 'right' }}>{getTotal(item.billAccountDetails)}</td>
                                </tr>
                              );
                            })}
                            <tr>
                              <td />
                              <td />
                              <td />
                              {/*<td></td>*/}
                              {getGrandTotal('ARREAR_AMOUNT', formData.Receipt[0].Bill[0].billDetails) > 0 && <td />}
                              {getGrandTotal('CURRENT_AMOUNT', formData.Receipt[0].Bill[0].billDetails) > 0 && <td />}
                              {getGrandTotal('OTHERS', formData.Receipt[0].Bill[0].billDetails) > 0 && <td />}
                              {getGrandTotal('REBATE', formData.Receipt[0].Bill[0].billDetails) > 0 && <td />}
                              {getGrandTotal('ADVANCE_AMOUNT', formData.Receipt[0].Bill[0].billDetails) > 0 && <td />}
                              {getGrandTotal('ARREAR_LATEPAYMENT_CHARGES', formData.Receipt[0].Bill[0].billDetails) > 0 && <td />}
                              {getGrandTotal('CURRENT_LATEPAYMENT_CHARGES', formData.Receipt[0].Bill[0].billDetails) > 0 && <td />}
                              {getGrandTotal('CHEQUE_BOUNCE_PENALTY', formData.Receipt[0].Bill[0].billDetails) > 0 && <td />}
                              <td style={{ textAlign: 'right' }}>
                                <strong>{getGrandTotal('', formData.Receipt[0].Bill[0].billDetails)}</strong>
                              </td>
                            </tr>

                            {/*resultList.hasOwnProperty("resultValues") && resultList.resultValues.map((item, i) => {
                            return (
                              <tr key={i} onClick={() => {rowClickHandler(i)}}>
                                {
                                  item.map((item2, i2)=>{
                                    return (
                                      <td  key={i2}>{item2?item2:""}</td>
                                    )
                                })}
                              </tr>
                              )

                          })*/}
                          </tbody>
                        </Table>
                      )}
                      {showResult && (
                        <Table responsive id="basic-table3">
                          <thead style={{ display: 'none' }}>
                            <tr>
                              <th>key</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                {translate('collection.reciept.amount')} -{' '}
                                <strong>{int_to_words(getGrandTotal('', formData.Receipt[0].Bill[0].billDetails)).toUpperCase() + ' ONLY'}</strong>
                              </td>
                            </tr>
                            {formData.Receipt[0].instrument &&
                              formData.Receipt[0].instrument.instrumentType.name != 'Cash' && (
                                <tr>
                                  <td>
                                    Cheque/DD No <strong>{formData.Receipt[0].instrument.transactionNumber}</strong> drawn on{' '}
                                    <strong>{formData.Receipt[0].instrument.bank.name}</strong>,{' '}
                                    <strong>{formData.Receipt[0].instrument.branchName}</strong> Dated{' '}
                                    <strong>{formData.Receipt[0].instrument.transactionDate}</strong>
                                    <br />
                                    Cheque/DD payments are subject to realisation
                                  </td>
                                </tr>
                              )}
                          </tbody>
                        </Table>
                      )}
                    </Col>
                  </Row>
                </Grid>
              </CardText>
            </Card>
            <Grid>
              <Row>
                <Col className="text-center" xs={12} md={12}>
                  <span style={{ fontSize: '20px' }} className="glyphicon glyphicon-print" onClick={e => generatePdf()} />
                </Col>
              </Row>
            </Grid>
          </div>
        )}
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
  tenantInfo: state.common.tenantInfo,
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
});
export default connect(mapStateToProps, mapDispatchToProps)(Report);

// <form onSubmit={(e) => {
//   search(e)
// }}>
// {!_.isEmpty(mockData) && moduleName && actionName && <ShowFields groups={mockData[`${moduleName}.${actionName}`].groups} noCols={mockData[`${moduleName}.${actionName}`].numCols} ui="google" handler={handleChange} getVal={getVal} fieldErrors={fieldErrors} useTimestamp={mockData[`${moduleName}.${actionName}`].useTimestamp || false} addNewCard={""} removeCard={""}/>}
//   <div style={{"textAlign": "center"}}>
//     <br/>
//     <UiButton item={{"label": "Search", "uiType":"submit", "isDisabled": isFormValid ? false : true}} ui="google"/>
//     <br/>
//     {showResult && <UiTable resultList={resultList} rowClickHandler={rowClickHandler}/>}
//   </div>
// </form>

// const input = document.getElementById('receipt');
// html2canvas(input)
//   .then((canvas) => {
//     const imgData = canvas.toDataURL('image/jpeg');
//     const pdf = new jsPDF();
//     pdf.addImage(imgData, 'JPEG', 0, 0, 210,130);
//     pdf.save("receipt.pdf");
//   });

//manual row priting machnisam

//
//
//
//
// var columns = [];
//
// columns.push({title:translate("collection.create.serviceType"),dataKey:translate("collection.create.serviceType")});
// columns.push({title:translate("collection.create.receiptNumber"),dataKey:translate("collection.create.receiptNumber")})
// columns.push({title:translate("collection.create.consumerCode"),dataKey:translate("collection.create.consumerCode")})
// columns.push({title:translate("collection.search.period"),dataKey:translate("collection.search.period")})
// getGrandTotal("ARREAR_AMOUNT",formData.Receipt[0].Bill[0].billDetails)>0 && columns.push({title:translate("collection.search.arrears"),dataKey:translate("collection.search.arrears")})
// getGrandTotal("CURRENT_AMOUNT",formData.Receipt[0].Bill[0].billDetails)>0 && columns.push({title:translate("collection.search.current"),dataKey:translate("collection.search.current")})
// getGrandTotal("OTHERS",formData.Receipt[0].Bill[0].billDetails)>0 && columns.push({title:translate("collection.search.interest"),dataKey:translate("collection.search.interest")})
// getGrandTotal("REBATE",formData.Receipt[0].Bill[0].billDetails)>0 && columns.push({title:translate("collection.search.rebate"),dataKey:translate("collection.search.rebate")})
// getGrandTotal("ADVANCE_AMOUNT",formData.Receipt[0].Bill[0].billDetails)>0 && columns.push({title:translate("collection.create.advance"),dataKey:translate("collection.create.advance")})
// getGrandTotal("ARREAR_LATEPAYMENT_CHARGES",formData.Receipt[0].Bill[0].billDetails)>0 && columns.push({title:translate("collection.create.arrearLatePayment"),dataKey:translate("collection.create.arrearLatePayment")})
// getGrandTotal("CURRENT_LATEPAYMENT_CHARGES",formData.Receipt[0].Bill[0].billDetails)>0 && columns.push({title:translate("collection.create.currentLatePayment"),dataKey:translate("collection.create.currentLatePayment")})
// getGrandTotal("CHEQUE_BOUNCE_PENALTY",formData.Receipt[0].Bill[0].billDetails)>0 && columns.push({title:translate("collection.create.checkLatePayment"),dataKey:translate("collection.create.checkLatePayment")})
// columns.push({title:translate("collection.create.total"),dataKey:translate("collection.create.total")})
//
// var rows = [];
// var billDetails=formData.Receipt[0].Bill[0].billDetails;
// for (var i = 0; i < billDetails.length; i++) {
//   let temp={};
//   temp[translate("collection.create.serviceType")]=billDetails[i].businessService;
//   temp[translate("collection.create.receiptNumber")]=billDetails[i].receiptNumber;
//   temp[translate("collection.create.consumerCode")]=billDetails[i].consumerCode;
//   temp[translate("collection.search.period")]=billDetails[i].period;
//   if(getGrandTotal("ARREAR_AMOUNT",formData.Receipt[0].Bill[0].billDetails)>0) temp[translate("collection.search.arrears")]=getPurposeTotal("ARREAR_AMOUNT",billDetails[i].billAccountDetails);
//   if(getGrandTotal("CURRENT_AMOUNT",formData.Receipt[0].Bill[0].billDetails)>0) temp[translate("collection.search.current")]=getPurposeTotal("CURRENT_AMOUNT",billDetails[i].billAccountDetails);
//   if(getGrandTotal("OTHERS",formData.Receipt[0].Bill[0].billDetails)>0) temp[translate("collection.search.interest")]=getPurposeTotal("OTHERS",billDetails[i].billAccountDetails);
//   if(getGrandTotal("REBATE",formData.Receipt[0].Bill[0].billDetails)>0) temp[translate("collection.search.rebate")]=getPurposeTotal("REBATE",billDetails[i].billAccountDetails);
//   if(getGrandTotal("ADVANCE_AMOUNT",formData.Receipt[0].Bill[0].billDetails)>0) temp[translate("collection.create.advance")]=getPurposeTotal("ADVANCE_AMOUNT",billDetails[i].billAccountDetails);
//   if(getGrandTotal("ARREAR_LATEPAYMENT_CHARGES",formData.Receipt[0].Bill[0].billDetails)>0) temp[translate("collection.create.arrearLatePayment")]=getPurposeTotal("ARREAR_LATEPAYMENT_CHARGES",billDetails[i].billAccountDetails);
//   if(getGrandTotal("CURRENT_LATEPAYMENT_CHARGES",formData.Receipt[0].Bill[0].billDetails)>0) temp[translate("collection.create.currentLatePayment")]=getPurposeTotal("CURRENT_LATEPAYMENT_CHARGES",billDetails[i].billAccountDetails);
//   if(getGrandTotal("CHEQUE_BOUNCE_PENALTY",formData.Receipt[0].Bill[0].billDetails)>0) temp[translate("collection.create.checkLatePayment")]=getPurposeTotal("CHEQUE_BOUNCE_PENALTY",billDetails[i].billAccountDetails);
//   temp[translate("collection.create.total")]=getTotal(billDetails[i].billAccountDetails);
//   rows.push(temp);
// }
// rows.push({});

// doc.setFontType("bold");
// doc.text(originalX+10, originalY+16,"Payee Name:");
// doc.setFontType("normal");
// doc.text(originalX+32, originalY+16,getVal("Receipt[0].Bill[0].payeeName"));
// // doc.setFontType("bold");
// doc.text(originalX+148, originalY+16,"Receipt Date:");
// doc.setFontType("normal");
// doc.text(originalX+170, originalY+16,getVal("Receipt[0].instrument") && getVal("Receipt[0].instrument.transactionDate").split("-")[2]+"-"+getVal("Receipt[0].instrument.transactionDate").split("-")[1]+"-"+getVal("Receipt[0].instrument.transactionDate").split("-")[0]);
// // doc.setFontType("bold");
// doc.text(originalX+10, originalY+20,"Address:");
// doc.setFontType("normal");
// doc.text(originalX+25, originalY+20,getVal("Receipt[0].Bill[0].payeeAddress"));

// doc.autoTable(columns, rows, {
//       theme: 'grid',
//       startY: 75,
//       drawRow: function (row, data) {
//           // Colspan
//           doc.setFontStyle('bold');
//           doc.setFontSize(10);
//           if (row.index === billDetails.length) {
//               // doc.setTextColor(200, 0, 0);
//               doc.rect(data.settings.margin.left, row.y, data.table.width, 20, 'S');
//               doc.autoTableText(getGrandTotal("",formData.Receipt[0].Bill[0].billDetails).toString(), data.settings.margin.left + data.table.width / 2, row.y + row.height / 2, {
//                   halign: 'right',
//                   valign: 'middle'
//               });
//               data.cursor.y += 20;
//           } else if (row.index === 5) {
//               doc.rect(data.settings.margin.left, row.y, data.table.width, 20, 'S');
//               doc.autoTableText("Other Groups", data.settings.margin.left + data.table.width / 2, row.y + row.height / 2, {
//                   halign: 'center',
//                   valign: 'middle'
//               });
//               data.cursor.y += 20;
//           }
//
//           // if (row.index % 5 === 0) {
//           //     var posY = row.y + row.height * 6 + data.settings.margin.bottom;
//           //     if (posY > doc.internal.pageSize.height) {
//           //         data.addPage();
//           //     }
//           // }
//       },
//       // drawCell: function (cell, data) {
//       //     // Rowspan
//       //     if (data.column.dataKey === 'id') {
//       //         if (data.row.index % 5 === 0) {
//       //             doc.rect(cell.x, cell.y, data.table.width, cell.height * 5, 'S');
//       //             doc.autoTableText(data.row.index / 5 + 1 + '', cell.x + cell.width / 2, cell.y + cell.height * 5 / 2, {
//       //                 halign: 'center',
//       //                 valign: 'middle'
//       //             });
//       //         }
//       //         return false;
//       //     }
//       // }
//   });
//
//   doc.save('Receipt-' + getVal("Receipt[0].transactionId") + '.pdf');
