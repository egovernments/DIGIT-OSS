import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

import _ from 'lodash';
import ShowFields from '../../../framework/showFields';

import { translate } from '../../../common/common';
import Api from '../../../../api/api';
import jp from 'jsonpath';
import UiButton from '../../../framework/components/UiButton';
import { fileUpload, getFullDate, int_to_words } from '../../../framework/utility/utility';
import UiTable from '../../../framework/components/UiTable';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import $ from 'jquery';
import axios from 'axios';
import CommentDoc from '../Components/CommentDoc';
var specifications = {};

let reqRequired = [];
class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openAddFee: false,
      openPayFee: false,
      feeAmount: 0,
      stateFieldErrors: {},
      role: '',
      showReceipt: false,
      ServiceRequest: {},
      status: '',
      documents: [],
      comments: '',
      RequestInfo: {},
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

      if (specs[moduleName + '.' + actionName].groups[ind || i].children && specs[moduleName + '.' + actionName].groups[ind || i].children.length) {
        this.setInitialUpdateChildData(form, specs[moduleName + '.' + actionName].groups[ind || i].children);
      }
    }

    setMockData(specs);
  }

  initData() {
    specifications = require('../../../framework/specs/citizenService/tl/TradeLicense').default;

    let { setMetaData, setModuleName, setActionName, setMockData } = this.props;
    let self = this;
    let obj = specifications['tl.view'];
    self.setLabelAndReturnRequired(obj);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('tl');
    setActionName('create');
    //Get view form data
    var url = specifications['tl.view'].url.split('?')[0];
    var hash = window.location.hash.split('/');
    var query = {
      acknowledgementNumber: this.props.match.params.ackNo,
    };

    this.setState({
      RequestInfo: {
        apiId: 'org.egov.pt',
        ver: '1.0',
        ts: new Date().getTime(),
        action: 'asd',
        did: '4354648646',
        key: 'xyz',
        msgId: '654654',
        requesterId: '61',
        authToken: localStorage.token,
        userInfo: JSON.parse(localStorage.userRequest),
      },
    });

    var instance = axios.create({
      baseURL: window.location.origin,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ZWdvdi11c2VyLWNsaWVudDplZ292LXVzZXItc2VjcmV0',
      },
    });

    var params = new URLSearchParams();
    params.append('username', 'murali');
    params.append('password', '12345678');
    params.append('grant_type', 'password');
    params.append('scope', 'read');
    params.append('tenantId', window.localStorage.getItem('tenantId'));

    if (self.props.match.params.status == 'pay') {
      let metaData = JSON.parse(localStorage.getItem('metaData')),
        paymentGateWayRes = JSON.parse(localStorage.getItem('paymentGateWayResponse'));
      self.props.setLoadingStatus('loading');
      //DO WHATEVER YOU WANT TO DO AFTER PAYMENT & THEN CALL GENERATERECEIPT() FUNCTION
      let response = JSON.parse(localStorage.response);
      if (this.props.match.params.paymentGateWayRes == 'success') {
        Api.commonApiPost(
          '/citizen-services/v1/pgresponse/_validate',
          {},
          { PGResponse: paymentGateWayRes },
          null,
          metaData['tl.view'].useTimestamp,
          false,
          null,
          JSON.parse(localStorage.userRequest)
        ).then(
          function(res) {
            self.props.setLoadingStatus('hide');
            self.generateReceipt(response.ServiceRequest, response.Receipt);
          },
          function(err) {
            self.props.toggleSnackbarAndSetText(true, err.message, false, true);
            self.props.setLoadingStatus('hide');
          }
        );
      }
    } else {
      Api.commonApiPost(
        '/citizen-services/v1/requests/_search',
        { consumerCode: decodeURIComponent(self.props.match.params.ackNo) },
        {},
        null,
        true
      ).then(
        function(res2) {
          Api.commonApiPost('/tl-masters/category/v1/_search', { type: 'subcategory' }, {}, null, true).then(
            function(res3) {
              if (res3 && res3.categories && res3.categories.length && res2 && res2.serviceReq && res2.serviceReq[0]) {
                for (var i = 0; i < res3.categories.length; i++) {
                  if (res3.categories[i].id == res2.serviceReq[0].moduleObject.licenses[0].subCategoryId) {
                    res2.serviceReq[0].moduleObject.licenses[0].subCategoryName = res3.categories[i].name;
                  }
                }
              }

              if (res2 && res2.serviceReq && res2.serviceReq[0] && res2.serviceReq[0] && res2.serviceReq[0].moduleObject) {
                res2.serviceReq[0].moduleObject.licenses[0].validityYears =
                  res2.serviceReq[0].moduleObject.licenses[0].validityYears +
                  (res2.serviceReq[0].moduleObject.licenses[0].validityYears == 1 ? ' Year' : ' Years');
                res2.serviceReq[0].moduleObject.licenses[0].serviceRequestId = decodeURIComponent(self.props.match.params.ackNo);
              }

              self.setState({
                ServiceRequest: res2 && res2.serviceReq && res2.serviceReq[0] ? res2.serviceReq[0] : {},
                status: res2 && res2.serviceReq && res2.serviceReq[0] ? res2.serviceReq[0].status : '',
              });
              self.props.setFormData(res2 && res2.serviceReq && res2.serviceReq[0] ? res2.serviceReq[0].moduleObject : {});
              self.setInitialUpdateData(
                res2 && res2.serviceReq && res2.serviceReq[0] ? res2.serviceReq[0].moduleObject : {},
                JSON.parse(JSON.stringify(specifications)),
                'tl',
                'view',
                'licenses'
              );
            },
            function(err) {
              if (res2 && res2.serviceReq && res2.serviceReq[0] && res2.serviceReq[0] && res2.serviceReq[0].moduleObject) {
                res2.serviceReq[0].moduleObject.licenses[0].validityYears =
                  res2.serviceReq[0].moduleObject.licenses[0].validityYears +
                  (res2.serviceReq[0].moduleObject.licenses[0].validityYears == 1 ? ' Year' : ' Years');
                res2.serviceReq[0].moduleObject.licenses[0].serviceRequestId = decodeURIComponent(self.props.match.params.ackNo);
              }

              self.setState({
                ServiceRequest: res2 && res2.serviceReq && res2.serviceReq[0] ? res2.serviceReq[0] : {},
                status: res2 && res2.serviceReq && res2.serviceReq[0] ? res2.serviceReq[0].status : '',
              });
              self.props.setFormData(res2 && res2.serviceReq && res2.serviceReq[0] ? res2.serviceReq[0].moduleObject : {});
              self.setInitialUpdateData(
                res2 && res2.serviceReq && res2.serviceReq[0] ? res2.serviceReq[0].moduleObject : {},
                JSON.parse(JSON.stringify(specifications)),
                'tl',
                'view',
                'licenses'
              );
            }
          );
        },
        function(err) {}
      );
    }
  }

  componentDidMount() {
    this.initData();
    this.setState({
      role: localStorage.type,
    });
  }

  getVal = (path, dateBool) => {
    var val = _.get(this.props.formData, path);

    if (dateBool && val && ((val + '').length == 13 || (val + '').length == 12) && new Date(Number(val)).getTime() > 0) {
      var _date = new Date(Number(val));
      return ('0' + _date.getDate()).slice(-2) + '/' + ('0' + (_date.getMonth() + 1)).slice(-2) + '/' + _date.getFullYear();
    }

    return typeof val != 'undefined' && (typeof val == 'string' || typeof val == 'number' || typeof val == 'boolean')
      ? val === true ? 'Yes' : val === false ? 'NA' : val + ''
      : '';
  };

  printer = () => {
    window.print();
  };

  openAddFeeModal = () => {
    this.setState({
      openAddFee: !this.state.openAddFee,
    });
  };

  openPayFeeModal = () => {
    this.setState({
      openPayFee: !this.state.openPayFee,
    });
  };

  generateReceipt(ServiceRequest, Receipt) {
    let self = this;
    var paymentGateWayRes = JSON.parse(localStorage.getItem('paymentGateWayResponse'));
    Receipt[0]['onlinePayment'] = {
      // "receiptHeader" : "",
      paymentGatewayName: paymentGateWayRes['paymentMethod'],
      transactionDate: new Date().getTime(),
      transactionAmount: Receipt[0]['Bill'][0]['billDetails'][0]['amountPaid'],
      transactionNumber: paymentGateWayRes['transactionId'],
      authorisationStatusCode: '0300',
      status: paymentGateWayRes['status'],
      remarks: 'Online Payment is done successfully',
      // "callBackUrl" : "",
      tenantId: localStorage.getItem('tenantId'),
      // "auditDetails" : {
      // }
    };
    ServiceRequest.backendServiceDetails = [
      {
        url: 'http://collection-services:8080/collection-services/receipts/_create',
        request: {
          RequestInfo: self.state.RequestInfo,
          Receipt: Receipt,
        },
      },
    ];

    Api.commonApiPost(
      '/citizen-services/v1/requests/_update',
      {},
      { serviceReq: ServiceRequest },
      null,
      true,
      false,
      null,
      JSON.parse(localStorage.userRequest)
    ).then(
      function(res) {
        self.props.setLoadingStatus('hide');
        //self.openPayFeeModal();
        self.setState({
          showReceipt: true,
          Receipt: res.serviceReq && res.serviceReq.backendServiceDetails ? res.serviceReq.backendServiceDetails[0].response.Receipt : [],
        });

        localStorage.removeItem('ack');
        $('html, body').animate({ scrollTop: 0 }, 'fast');
      },
      function(err) {
        self.props.setLoadingStatus('hide');
        self.props.toggleSnackbarAndSetText(true, err.message, false, true);
      }
    );
  }

  makePayment = (res, fee) => {
    //DO EVERYTHING FOR MAKING PAYMENT HERE
    let { serviceRequest, RequestInfo, documents } = this.state;
    let self = this;
    let { formData, metaData } = this.props;
    self.props.setLoadingStatus('loading');

    window.localStorage.setItem('serviceRequest', JSON.stringify(serviceRequest));
    window.localStorage.setItem('RequestInfo', JSON.stringify(RequestInfo));
    window.localStorage.setItem('documents', JSON.stringify(documents));
    window.localStorage.setItem('formData', JSON.stringify(formData));
    window.localStorage.setItem('moduleName', this.props.match.params.id);
    window.localStorage.setItem('metaData', JSON.stringify(metaData));
    window.localStorage.setItem('workflow', 'fireNoc');
    window.localStorage.setItem('ack', this.props.match.params.ackNo);

    var PGRequest = {
      billNumber: res.serviceReq.serviceRequestId,
      returnUrl: window.location.origin + '/citizen-services/v1/pgresponse',
      date: new Date().getTime(),
      biller: JSON.parse(localStorage.userRequest).name,
      amount: fee || 20,
      billService: res.serviceReq.serviceCode,
      serviceRequestId: res.serviceReq.serviceRequestId,
      consumerCode: res.serviceReq.serviceRequestId,
      tenantId: localStorage.tenantId,
      amountPaid: fee || 20,
      uid: JSON.parse(localStorage.userRequest).id,
    };

    Api.commonApiPost(
      '/citizen-services/v1/pgrequest/_create',
      {},
      { PGRequest },
      null,
      self.props.metaData['tl.create'].useTimestamp,
      false,
      null,
      JSON.parse(localStorage.userRequest)
    ).then(
      function(res) {
        self.props.setLoadingStatus('hide');

        var newForm = $('<form>', {
          action: 'http://115.124.122.117:8080/mahaulb/getHashKeyBeforePayment',
          methot: 'post',
          target: '_top',
        })
          .append(
            $('<input>', {
              name: 'billNumber',
              value: res.PGRequest.billNumber,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'billService',
              value: res.PGRequest.billService,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'amount',
              // 'value': 1,
              value: res.PGRequest.amountPaid,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'returnUrl',
              value: res.PGRequest.retrunUrl,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'date',
              value: res.PGRequest.date,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'biller',
              value: res.PGRequest.biller,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'serviceRequestId',
              value: res.PGRequest.serviceRequestId,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'tenantId',
              value: res.PGRequest.tenantId,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'amountPaid',
              value: res.PGRequest.amountPaid,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'requestHash',
              value: res.PGRequest.requestHash,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'mobileNo',
              value: '7795929033',
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'email',
              value: res.PGRequest.email,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'consumerCode',
              value: res.PGRequest.consumerCode,
              type: 'hidden',
            })
          )
          .append(
            $('<input>', {
              name: 'uid',
              value: res.PGRequest.uid,
              type: 'hidden',
            })
          );
        $(document.body).append(newForm);
        newForm.submit();
      },
      function(err) {
        self.props.toggleSnackbarAndSetText(true, err.message, false, true);
        self.props.setLoadingStatus('hide');
      }
    );
  };

  payFee = () => {
    //Update service request and generate bill and create receipt
    let self = this;
    var ServiceRequest = { ...this.state.ServiceRequest };
    var DemandBillQuery = `?businessService=BP&tenantId=${localStorage.getItem('tenantId')}&consumerCode=` + ServiceRequest.serviceRequestId;
    var fee = ServiceRequest.additionalFee;
    ServiceRequest.additionalFee = 12345;
    ServiceRequest.backendServiceDetails = [
      {
        url: 'http://billing-service:8080/billing-service/bill/_generate' + DemandBillQuery,
        request: {
          RequestInfo: self.state.RequestInfo,
        },
      },
    ];

    self.props.setLoadingStatus('loading');
    Api.commonApiPost(
      '/citizen-services/v1/requests/_update',
      {},
      { serviceReq: ServiceRequest },
      null,
      true,
      false,
      null,
      JSON.parse(localStorage.userRequest)
    ).then(
      function(res) {
        if (
          res.serviceReq &&
          res.serviceReq.backendServiceDetails &&
          res.serviceReq.backendServiceDetails[0] &&
          res.serviceReq.backendServiceDetails[0].response.Bill
        ) {
          let Receipt = [];
          Receipt[0] = { Bill: [] };
          Receipt[0]['Bill'] = res.serviceReq.backendServiceDetails[0].response.Bill;
          Receipt[0]['Bill'][0]['paidBy'] = Receipt[0]['Bill'][0].payeeName;
          Receipt[0]['tenantId'] = window.localStorage.getItem('tenantId');
          Receipt[0]['instrument'] = {
            tenantId: window.localStorage.getItem('tenantId'),
            amount: fee,
            instrumentType: { name: 'Online' },
          };
          Receipt[0]['Bill'][0]['billDetails'][0]['amountPaid'] = fee;
          setTimeout(function() {
            localStorage.setItem('response', JSON.stringify({ ServiceRequest, Receipt }));
            self.makePayment(res, fee);
          }, 3000);
        } else {
          self.props.setLoadingStatus('hide');
          self.props.toggleSnackbarAndSetText(true, "Oops! Something isn't right. Please try again later. ", false, true);
        }
      },
      function(err) {
        self.props.setLoadingStatus('hide');
        self.props.toggleSnackbarAndSetText(true, err.message, false, true);
      }
    );
  };

  generatePDF = () => {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
    var cdn = `
      <!-- Latest compiled and minified CSS -->
      <link rel="stylesheet" media="all" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

      <!-- Optional theme -->
      <link rel="stylesheet" media="all" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">  `;
    mywindow.document.write('<html><head><title> </title>');
    mywindow.document.write(cdn);
    mywindow.document.write('</head><body>');
    mywindow.document.write(document.getElementById('DownloadReceipt').innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    setTimeout(function() {
      mywindow.print();
      mywindow.close();
    }, 1000);

    return true;
  };

  updateStatusAndComments = ServiceRequest => {
    let self = this;
    let formData = { ...this.props.formData };

    ServiceRequest.backendServiceDetails = null;
    if (this.state.comments) {
      if (!ServiceRequest.comments) ServiceRequest.comments = [];
      ServiceRequest.comments.push({
        from: JSON.parse(localStorage.userRequest).userName,
        to: '',
        text: this.state.comments,
        timeStamp: new Date().getTime(),
      });
    }

    if (self.state.feeAmount) {
      ServiceRequest.additionalFee = self.state.feeAmount;
      let DemandRequest = {};
      DemandRequest['Demands'] = Object.assign([], self.props.metaData['tl.create'].feeDetails);
      DemandRequest['Demands'][0].tenantId = localStorage.getItem('tenantId');
      DemandRequest['Demands'][0].businessService = 'BP';
      DemandRequest['Demands'][0].consumerCode = self.state.ServiceRequest.serviceRequestId;
      DemandRequest['Demands'][0].owner.id = JSON.parse(localStorage.userRequest).id;
      DemandRequest['Demands'][0].taxPeriodFrom = 1491004800000;
      DemandRequest['Demands'][0].taxPeriodTo = 1522540799000;
      DemandRequest['Demands'][0].demandDetails[0].taxHeadMasterCode = 'FIRE_PROV_FIRE_NOC_FEE';
      DemandRequest['Demands'][0].demandDetails[0].taxAmount = self.state.feeAmount;
      ServiceRequest.backendServiceDetails = [
        {
          url: 'http://billing-service:8080/billing-service/demand/_create?tenantId=' + localStorage.tenantId,
          request: {
            RequestInfo: self.state.RequestInfo,
            ...DemandRequest,
          },
        },
      ];
    }

    if (this.state.status) {
      ServiceRequest.status = this.state.status;
    }

    //Make Update Service Request Call passing water connection object
    self.props.setLoadingStatus('loading');
    Api.commonApiPost(
      '/citizen-services/v1/requests/_update',
      {},
      { serviceReq: ServiceRequest },
      null,
      true,
      false,
      null,
      JSON.parse(localStorage.userRequest)
    ).then(
      function(res) {
        self.props.setLoadingStatus('hide');
        self.props.toggleSnackbarAndSetText(true, 'Updated successfully.', true, false);
        $('#fileInput').val('');
        self.setState({
          ServiceRequest: res.serviceReq,
          comments: '',
          feeAmount: '',
          documents: [],
        });
      },
      function(err) {
        self.props.setLoadingStatus('hide');
        self.props.toggleSnackbarAndSetText(true, err.message, false, true);
      }
    );
  };

  update = () => {
    let self = this,
      ServiceRequest = { ...this.state.ServiceRequest };
    self.props.setLoadingStatus('loading');
    //return console.log(self.state.documents[0]);
    if (self.state.documents && self.state.documents.length) {
      let _docs = [];
      let documents = self.state.documents;
      let counter = documents.length,
        breakOut = 0;
      for (let i = 0; i < documents.length; i++) {
        fileUpload(documents[i], 'wc', function(err, res) {
          if (breakOut == 1) return;
          if (err) {
            breakOut = 1;
            self.props.setLoadingStatus('hide');
            self.props.toggleSnackbarAndSetText(true, err, false, true);
          } else {
            _docs.push({
              from: JSON.parse(localStorage.userRequest).userName,
              timeStamp: new Date().getTime(),
              filePath: res.files[0].fileStoreId,
              name: documents[i].name,
              uploadedbyrole: localStorage.type,
            });
            counter--;
            if (counter == 0 && breakOut == 0) {
              if (!ServiceRequest.documents) ServiceRequest.documents = [];
              ServiceRequest.documents = ServiceRequest.documents.concat(_docs);
              self.updateStatusAndComments(ServiceRequest);
            }
          }
        });
      }
    } else {
      self.updateStatusAndComments(ServiceRequest);
    }
  };

  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors } = this.props;
    let { handleChange, getVal, addNewCard, removeCard, printer } = this;
    let self = this;

    return (
      <div className="Report">
        <div style={{ textAlign: 'center' }}>
          <h3> Trade License </h3>
        </div>
        {self.state.showReceipt ? <br /> : ''}
        {!self.state.showReceipt ? (
          <form id="printable">
            <Card className="uiCard">
              <CardHeader
                style={{ paddingTop: 4, paddingBottom: 0 }}
                title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>Process Application</div>}
              />
              <CardText style={{ paddingTop: 0, paddingBottom: 0 }}>
                <Grid style={{ paddingTop: 0 }}>
                  <Row>
                    {self.state.role != 'CITIZEN' ? (
                      <Col xs={12} md={6}>
                        <SelectField
                          floatingLabelStyle={{
                            color: '#696969',
                            fontSize: '20px',
                            'white-space': 'nowrap',
                          }}
                          labelStyle={{ color: '#5F5C57' }}
                          floatingLabelFixed={true}
                          dropDownMenuProps={{
                            targetOrigin: {
                              horizontal: 'left',
                              vertical: 'bottom',
                            },
                          }}
                          errorStyle={{ float: 'left' }}
                          fullWidth={true}
                          floatingLabelText={
                            <span>
                              Status <span style={{ color: '#FF0000' }}>{' *'}</span>
                            </span>
                          }
                          value={self.state.status}
                          onChange={(event, key, value) => {
                            self.setState({
                              status: value,
                            });
                          }}
                          maxHeight={200}
                        >
                          <MenuItem value={'CREATED'} primaryText={'Created'} />
                          <MenuItem value={'APPROVED'} primaryText={'Approved'} />
                          <MenuItem value={'INPROGRESS'} primaryText={'In Progress'} />
                          <MenuItem value={'REJECTED'} primaryText={'Rejected'} />
                        </SelectField>
                      </Col>
                    ) : (
                      ''
                    )}
                    <Col xs={12} md={6}>
                      <input
                        type="file"
                        multiple
                        style={{ marginTop: '40px' }}
                        onChange={e => {
                          self.setState({
                            documents: e.target.files || [],
                          });
                        }}
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <TextField
                        floatingLabelStyle={{
                          color: '#696969',
                          fontSize: '20px',
                          'white-space': 'nowrap',
                        }}
                        fullWidth={true}
                        floatingLabelText={'Add Comments'}
                        floatingLabelFixed={true}
                        value={self.state.comments}
                        inputStyle={{ color: '#5F5C57' }}
                        errorStyle={{ float: 'left' }}
                        onChange={e => {
                          self.setState({
                            comments: e.target.value,
                          });
                        }}
                      />
                    </Col>
                    {self.state.role != 'CITIZEN' &&
                    self.state.ServiceRequest &&
                    (!self.state.ServiceRequest.additionalFee || self.state.ServiceRequest.additionalFee == 0) ? (
                      <Col xs={12} md={6}>
                        <TextField
                          floatingLabelStyle={{
                            color: '#696969',
                            fontSize: '20px',
                            'white-space': 'nowrap',
                          }}
                          fullWidth={true}
                          type="number"
                          floatingLabelText={'Add Fee'}
                          floatingLabelFixed={true}
                          value={self.state.additionalFee}
                          inputStyle={{ color: '#5F5C57' }}
                          errorStyle={{ float: 'left' }}
                          onChange={e => {
                            self.setState({
                              feeAmount: e.target.value,
                            });
                          }}
                        />
                      </Col>
                    ) : (
                      ''
                    )}
                  </Row>
                </Grid>
              </CardText>
            </Card>
            <div style={{ textAlign: 'center' }}>
              <RaisedButton
                primary={true}
                label={'Update'}
                onClick={() => {
                  self.update();
                }}
              />&nbsp;&nbsp;&nbsp;&nbsp;
              {self.state.role == 'CITIZEN' &&
              self.state.ServiceRequest &&
              (self.state.ServiceRequest.additionalFee > 0 && self.state.ServiceRequest.additionalFee != 12345) ? (
                <RaisedButton primary={true} label={'Pay Fee'} onClick={self.openPayFeeModal} />
              ) : (
                ''
              )}
            </div>
            <CommentDoc ServiceRequest={self.state.ServiceRequest} getFullDate={getFullDate} showRemarks={true} />
            {!_.isEmpty(mockData) &&
              mockData['tl.view'] && (
                <ShowFields
                  groups={mockData['tl.view'].groups}
                  noCols={mockData['tl.view'].numCols}
                  ui="google"
                  handler={''}
                  getVal={getVal}
                  fieldErrors={fieldErrors}
                  useTimestamp={mockData['tl.view'].useTimestamp || false}
                  addNewCard={''}
                  removeCard={''}
                  screen="view"
                />
              )}
          </form>
        ) : self.state.Receipt && self.state.Receipt[0] ? (
          <Row id="allCertificates">
            <Col md={10} mdOffset={1}>
              <Card id="DownloadReceipt">
                <CardHeader title={<strong>Receipt for: Fire NOC</strong>} />
                <CardText>
                  <Table responsive style={{ fontSize: 'bold' }} id="ReceiptForWcAPartOne1" bordered condensed>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: 'left' }}>
                          <img src="./temp/images/headerLogo.png" height="60" width="60" />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <b>Roha Municipal Council</b>
                          <br />
                          Building Plan Department
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <img src="./temp/images/AS.png" height="60" width="60" />
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left' }}>
                          Receipt Number :{' '}
                          {self.state.Receipt[0].Bill[0].billDetails[0].receiptNumber
                            ? self.state.Receipt[0].Bill[0].billDetails[0].receiptNumber
                            : 'NA'}
                        </td>
                        <td style={{ textAlign: 'center' }}>Receipt For : Fire NOC</td>
                        <td style={{ textAlign: 'right' }}>Receipt Date: {getFullDate(self.state.Receipt[0].Bill[0].billDetails[0].receiptDate)}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'left' }}>
                          Service Request Number : {self.state.Receipt[0].Bill[0].billDetails[0].consumerCode}
                          <br />
                          Applicant Name : {JSON.parse(localStorage.userRequest).name || self.state.Receipt[0].Bill[0].payeeName}
                          <br />
                          Amount :{' '}
                          {self.state.Receipt[0].Bill[0].billDetails[0].totalAmount
                            ? 'Rs.' + self.state.Receipt[0].Bill[0].billDetails[0].totalAmount + '/-'
                            : 'NA'}
                          <br />
                        </td>
                      </tr>
                    </tbody>
                  </Table>

                  <Table id="ReceiptForWcAPartTwo" responsive bordered condensed>
                    <tbody>
                      <tr>
                        <td colSpan={2}>Bill Reference No.& Date</td>
                        <td colSpan={6}>Details</td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          {self.state.Receipt[0].Bill[0].billDetails[0].billNumber +
                            '-' +
                            getFullDate(self.state.Receipt[0].Bill[0].billDetails[0].receiptDate)}
                        </td>
                        <td colSpan={6}>Application for Fire NOC</td>
                      </tr>

                      <tr>
                        <td colSpan={8}>Amount in words: Rs. {int_to_words(self.state.Receipt[0].Bill[0].billDetails[0].totalAmount)}</td>
                      </tr>
                      <tr>
                        <td colSpan={8}>Payment Mode</td>
                      </tr>
                      <tr>
                        <td>Mode</td>
                        <td>Amount</td>
                        <td>Transaction No</td>
                        <td>Transaction Date</td>
                        {true && <td colSpan={4}>Bank Name</td>}
                      </tr>
                      <tr>
                        <td>Online</td>
                        <td>{self.state.Receipt[0].Bill[0].billDetails[0].totalAmount}</td>
                        {self.state.Receipt[0].instrument.instrumentType.name == 'Online' ? (
                          <td> {self.state.Receipt[0].transactionId} </td>
                        ) : (
                          <td> {self.state.Receipt[0].transactionId} </td>
                        )}

                        {self.state.Receipt[0].instrument.instrumentType.name == 'Online' ? (
                          <td> {getFullDate(self.state.Receipt[0].Bill[0].billDetails[0].receiptDate)} </td>
                        ) : (
                          <td> {getFullDate(self.state.Receipt[0].Bill[0].billDetails[0].receiptDate)}</td>
                        )}

                        <td colSpan={4}>
                          {self.state.Receipt[0].instrument.instrumentType.name == 'Online' ||
                          self.state.Receipt[0].instrument.instrumentType.name == 'Cash'
                            ? 'NA'
                            : self.state.Receipt[0].instrument.bank.name}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <span style={{ textAlign: 'right' }}>{translate('This is computer generated receipt no authorised signature required')}</span>
                </CardText>
              </Card>
              <br />
              <div style={{ textAlign: 'center' }}>
                <RaisedButton primary={true} label="Download" onClick={self.generatePDF} />
              </div>
              <div className="page-break" />
            </Col>
          </Row>
        ) : (
          ''
        )}
        <Dialog title="Add Fee Amount" modal={false} open={self.state.openAddFee} onRequestClose={self.openAddFeeModal} autoScrollBodyContent={true}>
          <div style={{ textAlign: 'center' }}>
            <Row>
              <Col xs={12} md={12}>
                <TextField
                  type="number"
                  value={self.state.feeAmount}
                  fullWidth={true}
                  value={self.state.feeAmount}
                  errorText={self.state.stateFieldErrors.feeAmount}
                  inputStyle={{ color: '#5F5C57' }}
                  errorStyle={{ float: 'left' }}
                  onChange={e => {
                    self.setState({
                      feeAmount: e.target.value,
                    });

                    if (e.target.value) {
                      self.setState({
                        stateFieldErrors: {
                          ...self.state.stateFieldErrors,
                          feeAmount: '',
                        },
                      });
                    }
                  }}
                />
                <br />
                <br />
              </Col>
            </Row>
          </div>
          <UiButton handler={self.openAddFeeModal} item={{ label: 'Cancel', uiType: 'button' }} ui="google" />&nbsp;&nbsp;
          <UiButton handler={self.addFee} item={{ label: 'Add', uiType: 'button' }} ui="google" />
        </Dialog>
        <Dialog title="Pay Fee Amount" modal={false} open={self.state.openPayFee} onRequestClose={self.openPayFeeModal} autoScrollBodyContent={true}>
          <div style={{ textAlign: 'center' }}>
            <h4>Amount to be paid: Rs {self.state.ServiceRequest.additionalFee || 20}</h4>
            <br />
          </div>
          <UiButton handler={self.openPayFeeModal} item={{ label: 'Cancel', uiType: 'button' }} ui="google" />&nbsp;&nbsp;
          <UiButton handler={self.payFee} item={{ label: 'Pay', uiType: 'button' }} ui="google" />
        </Dialog>
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
export default connect(mapStateToProps, mapDispatchToProps)(Report);
