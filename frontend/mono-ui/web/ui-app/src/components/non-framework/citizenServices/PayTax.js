import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';
import ShowFields from '../../framework/showFields';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { translate } from '../../common/common';
import Api from '../../../api/api';
import UiButton from '../../framework/components/UiButton';
import UiDynamicTable from '../../framework/components/UiDynamicTable';
import UiTable from '../../framework/components/UiTable';
import { fileUpload } from '../../framework/utility/utility';
import Dialog from 'material-ui/Dialog';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import FlatButton from 'material-ui/FlatButton';
import WaterReceipt from './receipts/WaterReceipt';
import WaterCertificate from './receipts/WaterCertificate';
import PropertyTaxExtract from './receipts/PropertyTaxExtract';
import PropertyTaxCertificate from './receipts/PropertyTaxCertificate';

import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.html5.js'; // HTML 5 file export
import 'datatables.net-buttons/js/buttons.flash.js'; // Flash file export
import jszip from 'jszip/dist/jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import 'datatables.net-buttons/js/buttons.flash.js';
import 'datatables.net-buttons-bs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PDFObject from 'pdfobject';
import html2canvas from 'html2canvas';
import axios from 'axios';
import jp from 'jsonpath';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

var counter = 0;

var specifications = {};

let reqRequired = [];

const getFullDate = function(dat, isTimeStamp = false) {
  if (!dat) return '-';
  var _date = new Date(dat);
  if (isTimeStamp) {
    return (
      ('0' + _date.getDate()).slice(-2) +
      '/' +
      ('0' + (_date.getMonth() + 1)).slice(-2) +
      '/' +
      _date.getFullYear() +
      ' ' +
      ('0' + _date.getHours()).slice(-2) +
      ':' +
      ('0' + _date.getMinutes()).slice(-2) +
      ':' +
      ('0' + _date.getSeconds()).slice(-2)
    );
  } else {
    return ('0' + _date.getDate()).slice(-2) + '/' + ('0' + (_date.getMonth() + 1)).slice(-2) + '/' + _date.getFullYear();
  }
};

const getAmount = function(demands, arrearsBool) {
  var data = jp.query(demands, arrearsBool ? '$..[?(@.taxPeriodFrom < 1490985000000)]' : '$..[?(@.taxPeriodFrom >= 1490985000000)]');
  if (data.length) {
    var taxAmountArr = jp.query(data, '$..taxAmount') || [];
    var taxSum = 0;
    for (var i = 0; i < taxAmountArr.length; i++) taxSum += taxAmountArr[i];
    var collectionAmountArr = jp.query(data, '$..collectionAmount') || [];
    var collSum = 0;

    for (var i = 0; i < collectionAmountArr.length; i++) collSum += collectionAmountArr[i];
    return taxSum - collSum;
  } else return '00';
};

const getAddress = function(property) {
  if (property && property.address)
    return (
      (property.address.addressNumber ? property.address.addressNumber + ', ' : '') +
      (property.address.addressLine1 ? property.address.addressLine1 + ', ' : '') +
      (property.address.addressLine2 ? property.address.addressLine2 + '. ' : '') +
      (property.address.landmark ? 'Landmark: ' + property.address.landmark : '') +
      (property.address.city ? 'City: ' + property.address.city : '') +
      (property.address.pincode ? '- ' + property.address.pincode : '')
    );
  else return 'NA';
};

class NoDues extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showResult: true,
      resultList: {
        resultHeader: [],
        resultValues: [],
      },
      values: [],
      pathname: '',
      finished: false,
      stepIndex: 0,
      open: false,
      demands: [],
      applicationFeeDemand: [],
      serviceRequest: {},
      ReceiptOne: [],
      Receipt: [],
      TaxHeads: {},
    };
  }

  handleOpen = () => {
    let { demands, applicationFeeDemand, serviceRequest } = this.state;
    let self = this;
    let { formData, metaData } = this.props;
    self.props.setLoadingStatus('loading');

    window.localStorage.setItem('demands', JSON.stringify(demands));
    window.localStorage.setItem('applicationFeeDemand', JSON.stringify(applicationFeeDemand));
    window.localStorage.setItem('formData', JSON.stringify(formData));
    window.localStorage.setItem('serviceRequest', JSON.stringify(serviceRequest));
    window.localStorage.setItem('moduleName', this.props.match.params.id);
    window.localStorage.setItem('metaData', JSON.stringify(metaData));
    window.localStorage.setItem('workflow', 'paytax');

    if (demands.length > 0) {
      Api.commonApiPost(
        '/billing-service/bill/_generate',
        {
          businessService: this.props.match.params.id.toUpperCase(),
          consumerCode: formData.consumerCode,
        },
        {},
        null,
        self.props.metaData['noDues.search'].useTimestamp,
        false,
        localStorage.getItem('auth-token-temp')
      ).then(
        function(res) {
          self.props.setLoadingStatus('hide');

          let Receipt = [];
          Receipt[0] = { Bill: [] };
          Receipt[0]['Bill'] = res.Bill;
          Receipt[0]['Bill'][0]['paidBy'] = Receipt[0]['Bill'][0].payeeName;
          Receipt[0]['tenantId'] = window.localStorage.getItem('tenantId');
          Receipt[0]['instrument'] = {
            tenantId: window.localStorage.getItem('tenantId'),
            amount: self.getTotal(demands),
            instrumentType: { name: 'Online' },
          };

          Receipt[0]['Bill'][0]['billDetails'][0]['amountPaid'] = self.getTotal(demands);
          self.setState({
            paidBy: Receipt[0]['Bill'][0].payeeName,
          });
          console.log(Receipt);
          // Receipt.push(res.Bill);
          self.setState({
            Receipt,
          });
          console.log(Receipt);
          // self.setState({open: true});
          // self.props.setLoadingStatus('hide');
          window.localStorage.setItem('Receipt', JSON.stringify(Receipt));

          var PGRequest = {
            billNumber: Receipt[0]['Bill'][0].billDetails[0].billNumber,
            returnUrl: window.location.origin + '/citizen-services/v1/pgresponse',
            date: Receipt[0]['Bill'][0].billDetails[0].billDate,
            biller: JSON.parse(localStorage.userRequest).name,
            amount: self.getTotal(demands) + self.getTotal(applicationFeeDemand),
            billService: Receipt[0]['Bill'][0].billDetails[0].businessService,
            serviceRequestId: serviceRequest.serviceRequestId,
            consumerCode: Receipt[0]['Bill'][0].billDetails[0].consumerCode,
            tenantId: Receipt[0]['Bill'][0].tenantId,
            amountPaid: self.getTotal(demands) + self.getTotal(applicationFeeDemand),
            uid: JSON.parse(localStorage.userRequest).id,
          };

          Api.commonApiPost(
            '/citizen-services/v1/pgrequest/_create',
            {},
            { PGRequest },
            null,
            self.props.metaData['noDues.search'].useTimestamp,
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
        },
        function(err) {
          self.props.toggleSnackbarAndSetText(true, err.message, false, true);
          self.props.setLoadingStatus('hide');
        }
      );
    } else {
      self.props.setLoadingStatus('hide');
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleNext = () => {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };

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
    return typeof _.get(this.props.formData, path) != 'undefined' ? _.get(this.props.formData, path) : '';
  };

  initData() {
    let hashLocation = window.location.hash;
    // $.ajax({
    // url: "https://raw.githubusercontent.com/egovernments/egov-services/master/docs/common/framwork-specification/citizenService/pt/noDues.js?timestamp="+new Date().getTime(),
    // // dataType: 'application/javascript',
    // success: function(results)
    // {
    //     // var content = JSON.parse(results);
    //     // console.log(content[(hash[1]?hash[1]:"default")]);
    //     console.log(results.dat);
    //     // console.log(require(results).default);
    //
    //
    // },
    // error: function (results) {
    //   //Should pick our configObject
    // }})
    specifications = require(`../../framework/specs/citizenService/${this.props.match.params.id}/payTax`).default;
    let { setMetaData, setModuleName, setActionName, initForm, setMockData, setFormData } = this.props;
    let obj = specifications['noDues.search'];
    reqRequired = [];
    this.setLabelAndReturnRequired(obj);
    initForm(reqRequired);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('citizenService');
    setActionName('noDues');
    var formData = {};
    if (obj && obj.groups && obj.groups.length) this.setDefaultValues(obj.groups, formData);
    setFormData(formData);
    this.setState({
      pathname: this.props.history.location.pathname,
    });

    if (this.props.match.params.status == 'receipt') {
      this.setState({ stepIndex: 2 });
    }
    if (this.props.match.params.status == 'pay' && counter == 0) {
      counter++;
      this.setState({ stepIndex: 1 });
      this.props.setLoadingStatus('loading');
      this.pay();
    }
  }

  componentDidMount() {
    this.initData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.pathname != nextProps.history.location.pathname) {
      this.initData();
    }
  }

  createDemand = (SID, finalObject, response) => {
    let self = this;
    let { formData } = this.props;
    finalObject['businessService'] = self.props.match.params.status == 'extract' ? 'PT' : self.props.match.params.id == 'pt' ? 'PT' : 'WC';
    Api.commonApiPost(
      self.props.metaData['noDues.search'].url,
      finalObject,
      {},
      null,
      self.props.metaData['noDues.search'].useTimestamp,
      false,
      response.data.access_token
    ).then(
      function(res) {
        self.props.setLoadingStatus('hide');
        if (jp.query(res, `$..demandDetails[?(@.taxAmount > @.collectionAmount)]`).length > 0) {
          self.setState({
            demands: res.Demands,
          });
        } else {
          self.setState({
            demands: [],
          });
        }
        // finalObject["businessService"]= "CS";
        // finalObject["consumerCode"]= SID;
        // Api.commonApiPost(self.props.metaData["noDues.search"].url, finalObject, {}, null, self.props.metaData["noDues.search"].useTimestamp,false,response.data.access_token).then(function(res1){
        //   self.props.setLoadingStatus('hide');
        //   if(jp.query(res1,`$..demandDetails[?(@.taxAmount > @.collectionAmount)]`).length>0) {
        //     self.setState({
        //       applicationFeeDemand:res1.Demands
        //     });
        //   } else {
        //     self.setState({
        //       applicationFeeDemand: self.props.metaData["noDues.search"].feeDetails
        //     }, function() {
        //        let demandReq = {};
        //        demandReq["Demands"] =self.state.applicationFeeDemand;
        //        demandReq["Demands"][0].tenantId=localStorage.getItem("tenantId");
        //        demandReq["Demands"][0].consumerCode=SID;
        //        demandReq["Demands"][0].owner.id=JSON.parse(localStorage.userRequest).id;
        //        demandReq["Demands"][0].taxPeriodFrom=1491004800000;
        //        demandReq["Demands"][0].taxPeriodTo=1522540799000;
        //        demandReq["Demands"][0].demandDetails[0].taxHeadMasterCode=(self.props.match.params.status == "extract" ? "PT_EXT_OF_PROP_COPY_CHAR" : (self.props.match.params.id == "pt" ? "PT_NO_DUE_CERT_CHAR" : "WC_NO_DUE_CERT_CHAR"));
        //
        //        Api.commonApiPost("/billing-service/demand/_create", {}, demandReq, null, self.props.metaData["noDues.search"].useTimestamp,false,localStorage.getItem("auth-token-temp"), JSON.parse(localStorage["request-temp"])).then(function(res){
        //
        //        }, function(err) {
        //
        //        })
        //     });
        //   }
        //   if (res1.Demands.length>0 || res.Demands.length>0) {
        //     self.handleNext();
        //
        //   } else {
        //      self.props.toggleSnackbarAndSetText(true, "No demands for given criteria", false, true);
        //   }
        // }, function(err) {
        //   self.props.toggleSnackbarAndSetText(true, err.message, false, true);
        //   self.props.setLoadingStatus('hide');
        // })

        self.handleNext();
      },
      function(err) {
        self.props.toggleSnackbarAndSetText(true, err.message, false, true);
        self.props.setLoadingStatus('hide');
      }
    );
  };

  getTaxHeads = () => {
    let self = this;
    if (localStorage['taxheads' + self.props.match.params.id.toUpperCase()]) {
      return self.setState({
        TaxHeads: JSON.parse(localStorage['taxheads' + self.props.match.params.id.toUpperCase()]),
      });
    }

    Api.commonApiPost(
      '/billing-service/taxheads/_search',
      { service: self.props.match.params.id.toUpperCase() },
      {},
      false,
      true,
      false,
      localStorage.getItem('auth-token-temp')
    ).then(
      function(res) {
        if (res.TaxHeadMasters && res.TaxHeadMasters.length) {
          var taxheads = {};
          for (var i = 0; i < res.TaxHeadMasters.length; i++) {
            taxheads[res.TaxHeadMasters[i].code] = res.TaxHeadMasters[i].name;
          }

          localStorage.setItem('taxheads' + self.props.match.params.id.toUpperCase(), JSON.stringify(taxheads));
          return self.setState({
            TaxHeads: taxheads,
          });
        }
      },
      function(err) {}
    );
  };

  search = e => {
    e.preventDefault();
    let self = this;
    self.props.setLoadingStatus('loading');
    var formData = { ...this.props.formData };
    let finalObject = {};
    let count = 0;
    for (var variable in formData) {
      if (formData.hasOwnProperty(variable) && formData[variable] != '') {
        finalObject[variable] = formData[variable];
        count++;
      }
    }
    if (count > 1) {
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

      instance
        .post('/user/oauth/token', params)
        .then(function(response) {
          localStorage.setItem('request-temp', JSON.stringify(response.data.UserRequest));
          localStorage.setItem('auth-token-temp', response.data.access_token);
          finalObject['businessService'] = self.props.match.params.status == 'extract' ? 'PT' : self.props.match.params.id == 'pt' ? 'PT' : 'WC';
          self.getTaxHeads();
          Api.commonApiPost(
            self.props.metaData['noDues.search'].url,
            finalObject,
            {},
            null,
            self.props.metaData['noDues.search'].useTimestamp,
            false,
            response.data.access_token
          ).then(
            function(res) {
              self.props.setLoadingStatus('hide');
              if (jp.query(res, `$..demandDetails[?(@.taxAmount > @.collectionAmount)]`).length > 0) {
                let consumerCode = res.Demands[0].consumerCode;
                self.setState(
                  {
                    demands: _.filter(res.Demands, {
                      consumerCode: consumerCode,
                    }),
                  },
                  function() {
                    Api.commonApiPost(
                      '/citizen-services/v1/requests/_search',
                      {
                        userId: JSON.parse(localStorage.getItem('userRequest')).id,
                      },
                      {},
                      null,
                      true
                    ).then(
                      function(ress) {
                        let SID = '',
                          _servReq;
                        let SC = self.props.match.params.id == 'pt' ? 'PT_PAYTAX' : 'WC_PAYTAX';
                        for (let i = 0; i < ress.serviceReq.length; i++) {
                          //Status needs to be changed
                          if (SC == ress.serviceReq[i].serviceCode && ress.serviceReq[i].status == 'CREATED') {
                            SID = ress.serviceReq[i].serviceRequestId;
                            _servReq = ress.serviceReq[i];
                            break;
                          }
                        }

                        if (!SID) {
                          let request = {
                            tenantId: localStorage.getItem('tenantId'),
                            serviceRequestId: null,
                            serviceCode: self.props.match.params.id == 'pt' ? 'PT_PAYTAX' : 'WC_PAYTAX',
                            lat: 12,
                            lang: 23,
                            address: 'address',
                            addressId: 'addressId',
                            email: 'email',
                            deviceId: 'deviceId',
                            accountId: 'accountId',
                            firstName: '',
                            lastName: 'firstName',
                            phone: 'phone',
                            description: '',
                            consumerCode: formData.consumerCode,
                            attributeValues: [
                              {
                                key: 'tenantId',
                                value: localStorage.getItem('tenantId'),
                              },
                            ],
                            status: 'CREATED',
                            assignedTo: 'assignedTo',
                            comments: [],
                            backendServiceDetails: null,
                          };

                          Api.commonApiPost(
                            '/citizen-services/v1/requests/_create',
                            {},
                            { serviceReq: request },
                            null,
                            self.props.metaData['noDues.search'].useTimestamp,
                            false,
                            null,
                            JSON.parse(localStorage.userRequest)
                          ).then(
                            function(res) {
                              self.setState({
                                serviceRequest: res.serviceReq,
                              });
                            },
                            function(err) {
                              self.props.toggleSnackbarAndSetText(true, err.message, false, true);
                              self.props.setLoadingStatus('hide');
                            }
                          );
                        } else {
                          self.setState({
                            serviceRequest: _servReq,
                          });
                        }
                        self.handleNext();
                      },
                      function(err) {}
                    );
                  }
                );
              } else {
                //NO PAY DUE! RETURN SUCCESS!

                // self.setState({
                //   demands: []
                // })
                // self.handleNext();
                self.props.setLoadingStatus('hide');
                self.props.toggleSnackbarAndSetText(true, 'No demands for given criteria', false, true);
              }
            },
            function(err) {}
          );
        })
        .catch(function(response) {
          self.props.setLoadingStatus('hide');
        });
    } else {
      self.props.setLoadingStatus('hide');
      self.props.toggleSnackbarAndSetText(true, 'Please provide at least one field for search', false, true);
    }
  };

  getVal = path => {
    return _.get(this.props.formData, path) || '';
  };

  handleChange = (e, property, isRequired, pattern, requiredErrMsg = 'Required', patternErrMsg = 'Pattern Missmatch') => {
    let { handleChange } = this.props;
    handleChange(e, property, isRequired, pattern, requiredErrMsg, patternErrMsg);
  };

  rowClickHandler = index => {
    var value = this.state.values[index];
    var _url =
      window.location.hash.split('/').indexOf('update') > -1
        ? this.props.metaData['noDues.search'].result.rowClickUrlUpdate
        : this.props.metaData['noDues.search'].result.rowClickUrlView;
    var key = _url.split('{')[1].split('}')[0];
    _url = _url.replace('{' + key + '}', _.get(value, key));
    this.props.setRoute(_url);
  };

  cancel = () => {
    this.handleClose();
  };

  getProperty = cb => {
    let self = this;
    Api.commonApiPost(
      'pt-property/properties/_search',
      { upicNumber: self.props.formData.consumerCode },
      {},
      null,
      true,
      false,
      localStorage.getItem('auth-token-temp')
    ).then(
      function(res) {
        cb(res && res.properties && res.properties[0] ? res.properties[0] : {});
      },
      function(err) {
        cb({});
      }
    );
  };

  pay = () => {
    let { localStorage } = window;
    var serviceRequest = JSON.parse(localStorage.getItem('serviceRequest')),
      Receipt = JSON.parse(localStorage.getItem('Receipt')),
      applicationFeeDemand = JSON.parse(localStorage.getItem('applicationFeeDemand')),
      demands = JSON.parse(localStorage.getItem('demands')),
      formData = JSON.parse(localStorage.getItem('formData')),
      metaData = JSON.parse(localStorage.getItem('metaData')),
      paymentGateWayRes = JSON.parse(localStorage.getItem('paymentGateWayResponse'));
    this.setState({
      serviceRequest,
      Receipt,
      ReceiptOne: [],
      applicationFeeDemand,
      demands,
    });

    let self = this;
    this.handleClose();
    self.props.setLoadingStatus('loading');
    // paymentGateWayRes["status"]="failed";

    if (this.props.match.params.paymentGateWayRes == 'success') {
      Api.commonApiPost(
        '/citizen-services/v1/pgresponse/_validate',
        {},
        { PGResponse: paymentGateWayRes },
        null,
        metaData['noDues.search'].useTimestamp,
        false,
        null,
        JSON.parse(localStorage.userRequest)
      ).then(
        function(res) {
          self.props.setLoadingStatus('hide');

          serviceRequest.status = 'No Dues Generated';
          Api.commonApiPost(
            '/citizen-services/v1/requests/_update',
            {},
            { serviceReq: serviceRequest },
            null,
            self.props.metaData['noDues.search'].useTimestamp,
            false,
            null,
            JSON.parse(localStorage.userRequest)
          ).then(
            function(res) {
              self.props.setLoadingStatus('hide');

              // self.setState({
              //   receipt:res.serviceReq
              // });
              console.log(res);
              // self.handleNext();
            },
            function(err) {
              self.props.toggleSnackbarAndSetText(true, err.message, false, true);
              self.props.setLoadingStatus('hide');
            }
          );

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

          Api.commonApiPost(
            '/collection-services/receipts/_create',
            {},
            { Receipt: Receipt },
            null,
            self.props.metaData['noDues.search'].useTimestamp,
            false,
            localStorage.getItem('auth-token-temp')
          ).then(
            function(res2) {
              self.props.setLoadingStatus('hide');

              self.getProperty(function(property) {
                self.setState({
                  Receipt: res2.Receipt,
                  ReceiptOne: [],
                  Property: property,
                });
                console.log(res2);
                self.handleNext();
              });
            },
            function(err) {
              self.props.toggleSnackbarAndSetText(true, err.message, false, true);
              self.props.setLoadingStatus('hide');
            }
          );
        },
        function(err) {
          self.props.toggleSnackbarAndSetText(true, err.message, false, true);
          self.props.setLoadingStatus('hide');
        }
      );
    }
  };

  generatePdf = id => {
    /*const input = document.getElementById('CertificateForWc');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0, 210,130);
        pdf.save("receipt.pdf");
      });

    let {tenantInfo,formData}=this.props;
    let {getVal,getGrandTotal,getTotal,getPurposeTotal}=this;*/
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    var cdn = `
      <!-- Latest compiled and minified CSS -->
      <link rel="stylesheet" media="all" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

      <!-- Optional theme -->
      <link rel="stylesheet" media="all" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">  `;
    mywindow.document.write('<html><head><title> </title>');
    mywindow.document.write(cdn);
    mywindow.document.write('</head><body>');
    mywindow.document.write(document.getElementById('allCertificates').innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    setTimeout(function() {
      mywindow.print();
      mywindow.close();
    }, 1000);

    return true;
    return;

    // let x=5,y=5,w=200,h=90,rectGap=10,originalX=5,originalY=10,dublicateX=5,dublicateY=5,triplicateX=5,triplicateY=5;
    //
    // const input = document.getElementById('DownloadReceipt');
    // html2canvas(input)
    //   .then((canvas) => {
    //     const imgData = canvas.toDataURL('image/jpeg');
    //     const pdf = new jsPDF();
    //     pdf.addImage(imgData, 'JPEG', 0, 0, 210,130);
    //     pdf.save("receipt.pdf");
    //   });

    // var doc = new jsPDF();
    // doc.rect(x, y, w, h)
    // doc.rect(x, (h*1)+rectGap, w, h)
    // doc.rect(x, (h*2)+rectGap+5, w, h)
    // doc.setFontSize(14);
    // doc.setFontType("bold");
    // doc.text(originalX+100, originalY+5,translate(tenantInfo[0].city.name), 'center');
    // doc.text(originalX+170, originalY+5,"Original");
    // doc.setFontType("normal");
    // doc.setFontSize(10);
    // doc.text(originalX+100, originalY+10, "Receipt", 'center');

    // var elem = document.getElementById("ReceiptForWcAPartOne");
    // var res = doc.autoTableHtmlToJson(elem);
    // doc.autoTable(res.columns, res.data, {startY: originalY+12});
    //
    // elem = document.getElementById("ReceiptForWcAPartTwo");
    // res = doc.autoTableHtmlToJson(elem);
    // doc.autoTable(res.columns, res.data, {startY: doc.autoTable.previous.finalY});
    //
    // elem = document.getElementById("basic-table3");
    // res = doc.autoTableHtmlToJson(elem);
    // doc.autoTable(res.columns, res.data, {showHeader:"never",startY: doc.autoTable.previous.finalY});
    //
    // doc.setLineWidth(0.5)
    // doc.line(doc.autoTable.previous.finalX+12.5, 25, 210, 25)
    //
    // doc.setFontSize(14);
    // doc.setFontType("bold");
    // doc.text(originalX+100, doc.autoTable.previous.finalY+25,translate(tenantInfo[0].city.name), 'center');
    // doc.text(originalX+170, doc.autoTable.previous.finalY+25,"Duplicate");
    // doc.setFontType("normal");
    // doc.setFontSize(10);
    // doc.text(originalX+100, doc.autoTable.previous.finalY+30, "Receipt", 'center');
    //
    // var elem = document.getElementById("basic-table1");
    // var res = doc.autoTableHtmlToJson(elem);
    // doc.autoTable(res.columns, res.data, {showHeader:"never",startY: doc.autoTable.previous.finalY+32});
    //
    // elem = document.getElementById("basic-table2");
    // res = doc.autoTableHtmlToJson(elem);
    // doc.autoTable(res.columns, res.data, {startY: doc.autoTable.previous.finalY,theme: "striped"});
    //
    // elem = document.getElementById("basic-table3");
    // res = doc.autoTableHtmlToJson(elem);
    // doc.autoTable(res.columns, res.data, {showHeader:"never",startY: doc.autoTable.previous.finalY});
    //
    // doc.setLineWidth(0.5)
    // doc.line(doc.autoTable.previous.finalX+12.5, 25, 210, 25)
    //
    // doc.setFontSize(14);
    // doc.setFontType("bold");
    // doc.text(originalX+100, doc.autoTable.previous.finalY+25,translate(tenantInfo[0].city.name), 'center');
    // doc.text(originalX+170, doc.autoTable.previous.finalY+25,"Triplicate");
    // doc.setFontType("normal");
    // doc.setFontSize(10);
    // doc.text(originalX+100, doc.autoTable.previous.finalY+30, "Receipt", 'center');
    //
    // var elem = document.getElementById("basic-table1");
    // var res = doc.autoTableHtmlToJson(elem);
    // doc.autoTable(res.columns, res.data, {showHeader:"never",startY: doc.autoTable.previous.finalY+32});
    //
    // elem = document.getElementById("basic-table2");
    // res = doc.autoTableHtmlToJson(elem);
    // doc.autoTable(res.columns, res.data, {startY: doc.autoTable.previous.finalY,theme: "striped"});
    //
    // elem = document.getElementById("basic-table3");
    // res = doc.autoTableHtmlToJson(elem);
    // doc.autoTable(res.columns, res.data, {showHeader:"never",startY: doc.autoTable.previous.finalY});

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

    //
    //
    //  doc.save("Receipt"+'-' + getVal("Receipt[0].transactionId") + '.pdf');
    //
    //  doc=new jsPDF();
    //  //
    // //  var elem = document.getElementById("CertificateForWc");
    // //  var res = doc.autoTableHtmlToJson(elem);
    // //  doc.autoTable(res.columns, res.data, {startY: originalY+12});
    //  //
    //  doc.save("Receipt"+'-' + getVal("Receipt[0].transactionId") + '.pdf');

    //doc.save(id+'-' + getVal("Receipt[0].transactionId") + '.pdf');
  };

  getTotal = demands => {
    let sum = 0;

    if (typeof demands == undefined || demands.length == 0) {
      return false;
    }

    for (var i = 0; i < demands.length; i++) {
      for (var k = 0; k < demands[i].demandDetails.length; k++) {
        sum += demands[i].demandDetails[k].taxAmount - demands[i].demandDetails[k].collectionAmount;
      }
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

    var words = iter('', 0, get_first(String(int)), get_rest(String(int)));
    if (words) words = words[0].toUpperCase() + words.substring(1);
    return words;
  };

  goBackToDashboard = () => {
    this.props.setRoute('/prd/dashboard');
  };

  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors, isFormValid, match } = this.props;
    let {
      search,
      cancel,
      pay,
      handleChange,
      getVal,
      addNewCard,
      removeCard,
      rowClickHandler,
      handleClose,
      handleOpen,
      generatePdf,
      getTotal,
      int_to_words,
      goBackToDashboard,
    } = this;
    let { showResult, resultList, open, demands, Receipt, ReceiptOne, applicationFeeDemand } = this.state;
    const { finished, stepIndex } = this.state;
    const contentStyle = { margin: '0 16px' };
    let self = this;
    console.log(formData);
    console.log(demands);

    const renderProperty = function(floors) {
      if (floors.length) {
        return floors.map(function(v, i) {
          return v.units.map(function(v2, i2) {
            return (
              <tr>
                <td>{v2.unitNo || '-'}</td>
                <td>{v.floorNo || '-'}</td>
                <td>{v2.occupierName || '-'}</td>
                <td>{v2.usage || '-'}</td>
                <td>{v2.occupancyType || '-'}</td>
                <td>{v2.arv || '-'}</td>
                <td>-</td>
                <td>-</td>
              </tr>
            );
          });
        });
      } else return '';
    };

    const getStepContent = stepIndex => {
      switch (stepIndex) {
        case 0:
          return (
            <div>
              {mockData != 'undefined' &&
                mockData.hasOwnProperty('noDues.search') &&
                !_.isEmpty(mockData['noDues.search'].groups) && (
                  <div>
                    <ShowFields
                      groups={mockData['noDues.search'].groups}
                      noCols={mockData['noDues.search'].numCols}
                      ui="google"
                      handler={handleChange}
                      getVal={getVal}
                      fieldErrors={fieldErrors}
                      useTimestamp={mockData['noDues.search'].useTimestamp || false}
                      addNewCard={''}
                      removeCard={''}
                    />

                    <div style={{ textAlign: 'center' }}>
                      <UiButton
                        handler={search}
                        item={{
                          label: 'Search',
                          uiType: 'button',
                          isDisabled: isFormValid ? false : true,
                        }}
                        ui="google"
                      />
                    </div>
                  </div>
                )}
            </div>
          );
        case 1:
          return (
            <div>
              {showResult && (
                <Card>
                  <CardHeader
                    title={
                      'Payment Details' +
                      (formData.consumerCode
                        ? self.props.match.params.id == 'pt'
                          ? ' - Assessment Number: ' + formData.consumerCode
                          : ' - Consumer Number: ' + formData.consumerCode
                        : '')
                    }
                  />
                  <CardText>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Tax Period From</th>
                          <th>Tax Period To</th>
                          <th>Tax Head</th>
                          <th style={{ textAlign: 'right' }}>Outstanding Amount (Rs) </th>
                        </tr>
                      </thead>
                      <tbody>
                        {demands.length > 0 ? (
                          demands.map((item, key) => {
                            return item.demandDetails.map((itemOne, keyOne) => {
                              return (
                                <tr key={keyOne}>
                                  <td>{getFullDate(demands[key].taxPeriodFrom)}</td>
                                  <td>{getFullDate(demands[key].taxPeriodTo)}</td>

                                  <td>{self.state.TaxHeads[itemOne.taxHeadMasterCode] || itemOne.taxHeadMasterCode}</td>
                                  <td style={{ textAlign: 'right' }}>{parseInt(itemOne.taxAmount - itemOne.collectionAmount).toFixed(2)}</td>
                                </tr>
                              );
                            });
                          })
                        ) : (
                          <tr>
                            <td style={{ textAlign: 'center' }} colSpan={4}>
                              No Dues
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>

                    <Table responsive>
                      <thead>
                        {/*<tr>
                             <th colSpan={3} style={{textAlign:"left"}}><strong>Application Fees (Rs)</strong></th>
                             <th style={{textAlign:"right"}}><strong>{(applicationFeeDemand && applicationFeeDemand.length>0 && applicationFeeDemand[0].demandDetails[0].taxAmount-applicationFeeDemand[0].demandDetails[0].collectionAmount)} </strong></th>
                          </tr>*/}
                        {demands.length > 0 && (
                          <tr>
                            <th colSpan={3} style={{ textAlign: 'left' }}>
                              <strong>{translate('Total (Rs)')} </strong>
                            </th>
                            <th style={{ textAlign: 'right' }}>
                              <strong>{getTotal(demands).toFixed(2)}</strong>
                            </th>
                          </tr>
                        )}
                      </thead>
                    </Table>
                  </CardText>
                </Card>
              )}
              <div style={{ textAlign: 'center' }}>
                <br />

                <UiButton
                  handler={goBackToDashboard}
                  item={{
                    label: 'Cancel',
                    uiType: 'button',
                    isDisabled: isFormValid ? false : true,
                  }}
                  ui="google"
                />
                {'  '}
                {demands.length > 0 && (
                  <UiButton
                    handler={handleOpen}
                    item={{
                      label: 'Pay',
                      uiType: 'button',
                      isDisabled: isFormValid ? false : true,
                    }}
                    ui="google"
                  />
                )}

                <Dialog title="Payment Gateway - Mock" modal={false} open={open} onRequestClose={handleClose} autoScrollBodyContent={true}>
                  <div style={{ textAlign: 'center' }}>
                    <h4>
                      Amount to be paid: Rs{' '}
                      {getTotal(demands) +
                        (applicationFeeDemand.length > 0 &&
                          applicationFeeDemand[0].demandDetails[0].taxAmount - applicationFeeDemand[0].demandDetails[0].collectionAmount)}
                    </h4>
                    <br />
                  </div>

                  <UiButton
                    handler={cancel}
                    item={{
                      label: 'Cancel',
                      uiType: 'button',
                      isDisabled: isFormValid ? false : true,
                    }}
                    ui="google"
                  />
                  {'  '}
                  <UiButton
                    handler={pay}
                    item={{
                      label: 'Pay',
                      uiType: 'button',
                      isDisabled: isFormValid ? false : true,
                    }}
                    ui="google"
                  />
                </Dialog>
              </div>
            </div>
          );
        case 2:
          return (
            <div>
              {showResult && (
                <Grid>
                  {(Receipt || ReceiptOne) && (
                    <Row id="allCertificates">
                      {Receipt && Receipt[0] && this.state.demands && this.state.demands.length ? (
                        <Col md={12}>
                          <Card>
                            <CardHeader
                              title={<strong>Receipt for: {this.props.match.params.id == 'pt' ? 'Property Tax' : 'Water Charge'}</strong>}
                            />
                            <CardText>
                              <Table responsive style={{ fontSize: 'bold' }} id="ReceiptForWcAPartOne" bordered condensed>
                                <tbody>
                                  <tr>
                                    <td style={{ textAlign: 'left' }}>
                                      <img src="./temp/images/headerLogo.png" height="60" width="60" />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                      <b>Roha Municipal Council</b>
                                      <br />
                                      {this.props.match.params.id == 'pt' ? (
                                        <span>Assessment Department / करनिर्धारण विभाग</span>
                                      ) : (
                                        <span>Water Department</span>
                                      )}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                      <img src="./temp/images/AS.png" height="60" width="60" />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ textAlign: 'left' }}>
                                      Receipt Number :{' '}
                                      {Receipt[0].Bill[0].billDetails[0].receiptNumber ? Receipt[0].Bill[0].billDetails[0].receiptNumber : 'NA'}
                                    </td>

                                    <td style={{ textAlign: 'center' }}>
                                      Receipt For : {this.props.match.params.id == 'wc' ? 'Water Charge' : 'Property Tax'}
                                    </td>

                                    <td style={{ textAlign: 'right' }}>Receipt Date: {getFullDate(Receipt[0].Bill[0].billDetails[0].receiptDate)}</td>
                                  </tr>
                                  <tr>
                                    <td colSpan={3} style={{ textAlign: 'left' }}>
                                      {this.props.match.params.id == 'pt' ? 'Assessment number' : 'Consumer code'} :{' '}
                                      {Receipt[0].Bill[0].billDetails[0].consumerCode}
                                      <br />
                                      Owner Name : {Receipt[0].Bill[0].payeeName}
                                      <br />
                                      Amount :{' '}
                                      {Receipt[0].Bill[0].billDetails[0].totalAmount
                                        ? 'Rs. ' + Receipt[0].Bill[0].billDetails[0].totalAmount + '/-'
                                        : 'NA'}
                                      <br />
                                      <div>
                                        {'Owner Address: ' + (Receipt[0].Bill[0].payeeAddress ? Receipt[0].Bill[0].payeeAddress : 'Roha')}
                                        <br />
                                        {'Received From: ' + Receipt[0].Bill[0].paidBy}
                                        <br />
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>

                              <Table id="ReceiptForWcAPartTwo" responsive bordered condensed>
                                <tbody>
                                  <tr>
                                    <td rowSpan={2}>Bill Reference No.& Date</td>
                                    <td rowSpan={2}>Details</td>
                                    <td colSpan={2}>Demand</td>
                                    <td colSpan={2}>Payment Received</td>
                                    <td colSpan={2}>Balance</td>
                                  </tr>
                                  <tr>
                                    <td>Arrears</td>
                                    <td>Current</td>
                                    <td>Arrears</td>
                                    <td>Current</td>
                                    <td>Arrears</td>
                                    <td>Current</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      {Receipt[0].Bill[0].billDetails[0].billNumber +
                                        '-' +
                                        getFullDate(Receipt[0].Bill[0].billDetails[0].receiptDate)}
                                    </td>
                                    <td>{match.params.id == 'wc' ? 'Water Charge' : 'Property'} No dues</td>
                                    <td>{getAmount(this.state.demands, true)}</td>
                                    <td>{getAmount(this.state.demands, false)}</td>
                                    <td>{getAmount(this.state.demands, true)}</td>
                                    <td>{getAmount(this.state.demands, false)}</td>
                                    <td>00</td>
                                    <td>00</td>
                                  </tr>

                                  <tr>
                                    <td colSpan={4}>
                                      Amount in words: Rs.{' '}
                                      {int_to_words(getTotal(demands))
                                        .charAt(0)
                                        .toUpperCase() + int_to_words(getTotal(demands)).slice(1)}{' '}
                                      only
                                    </td>
                                    <td colSpan={4} />
                                  </tr>
                                  <tr>
                                    <td colSpan={8}>Payment Mode</td>
                                  </tr>
                                  <tr>
                                    <td>Mode</td>
                                    <td>Amount</td>
                                    <td colSpan={2}>Transaction No</td>
                                    <td colSpan={2}>Transaction Date</td>
                                    <td colSpan={2}>Bank Name</td>
                                  </tr>
                                  <tr>
                                    <td>Online</td>
                                    <td>{getTotal(demands)}</td>
                                    {Receipt[0].instrument.instrumentType.name == 'Online' ? (
                                      <td colSpan={2}>{Receipt[0].transactionId}</td>
                                    ) : (
                                      <td colSpan={2}>{this.state.serviceRequest.serviceRequestId}</td>
                                    )}

                                    {Receipt[0].instrument.instrumentType.name == 'Online' ? (
                                      <td colSpan={2}>{getFullDate(Receipt[0].Bill[0].billDetails[0].receiptDate)}</td>
                                    ) : (
                                      <td colSpan={2}>{getFullDate(Receipt[0].Bill[0].billDetails[0].receiptDate)}</td>
                                    )}

                                    {Receipt[0].instrument.instrumentType.name == 'Online' || Receipt[0].instrument.instrumentType.name == 'Cash' ? (
                                      <td colSpan={2}>NA</td>
                                    ) : (
                                      <td colSpan={2}>Receipt[0].instrument.bank.name</td>
                                    )}
                                  </tr>
                                </tbody>
                              </Table>
                              <span style={{ textAlign: 'right' }}>
                                {translate('This is computer generated receipt no authorised signature required')}
                              </span>
                            </CardText>
                          </Card>
                          <div style={{ 'page-break-after': 'always' }} />
                        </Col>
                      ) : (
                        ''
                      )}
                    </Row>
                  )}
                </Grid>
              )}
              <div style={{ textAlign: 'center' }}>
                <br />
                <UiButton
                  handler={() => {
                    generatePdf('Receipt');
                  }}
                  item={{
                    label: 'Download',
                    uiType: 'button',
                    isDisabled: isFormValid ? false : true,
                  }}
                  ui="google"
                />
              </div>
            </div>
          );
        default:
          return "You're a long way from home sonny jim!";
      }
    };
    return (
      <div className="SearchResult">
        {/*<div id="ReceiptDemo">

      </div>*/}
        <div style={{ textAlign: 'center' }}>
          <h3>
            {' '}
            {match.params.status != 'extract' ? (
              <span>Pay My Dues for {match.params.id == 'wc' ? 'Water Charge' : 'Property Tax'}</span>
            ) : (
              'Property Extract'
            )}
          </h3>
        </div>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Search</StepLabel>
          </Step>
          <Step>
            <StepLabel>Pay</StepLabel>
          </Step>
          <Step>
            <StepLabel>Download</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {finished ? (
            <p>
              <a
                href="#"
                onClick={event => {
                  event.preventDefault();
                  this.setState({ stepIndex: 0, finished: false });
                }}
              >
                Click here
              </a>{' '}
              to reset the example.
            </p>
          ) : (
            <div>{!_.isEmpty(mockData) && moduleName && actionName && getStepContent(stepIndex)}</div>
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
  flag: state.report.flag,
  isFormValid: state.frameworkForm.isFormValid,
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
export default connect(mapStateToProps, mapDispatchToProps)(NoDues);
