import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { translate } from '../../common/common';
import Api from '../../../api/api';
import UiButton from '../../framework/components/UiButton';
import UiDynamicTable from '../../framework/components/UiDynamicTable';
import UiTable from '../../framework/components/UiTable';
import { fileUpload, getFullDate } from '../../framework/utility/utility';
import Dialog from 'material-ui/Dialog';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import FlatButton from 'material-ui/FlatButton';
import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.html5.js'; // HTML 5 file export
import 'datatables.net-buttons/js/buttons.flash.js'; // Flash file export
import jszip from 'jszip/dist/jszip';
import 'datatables.net-buttons/js/buttons.flash.js';
import 'datatables.net-buttons-bs';
import html2canvas from 'html2canvas';
import axios from 'axios';
import jp from 'jsonpath';

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

class ReceiptDownload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Receipt: [],
      Property: {},
    };
  }

  componentDidMount() {
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
    var BS = this.props.match.params.page == 'extract' ? 'PT' : this.props.match.params.page == 'watercharge' ? 'WC' : 'PT';
    var CC = this.props.match.params.cc;
    let self = this;
    self.props.setLoadingStatus('loading');
    instance
      .post('/user/oauth/token', params)
      .then(function(response) {
        localStorage.setItem('request-temp', JSON.stringify(response.data.UserRequest));
        localStorage.setItem('auth-token-temp', response.data.access_token);

        Api.commonApiPost(
          '/collection-services/receipts/_search',
          { consumerCode: CC, businessService: BS },
          {},
          null,
          true,
          false,
          localStorage.getItem('auth-token-temp')
        ).then(function(res) {
          if (self.props.match.params.page == 'extract') {
            Api.commonApiPost(
              'pt-property/properties/_search',
              { upicNumber: CC },
              {},
              null,
              true,
              false,
              localStorage.getItem('auth-token-temp')
            ).then(
              function(res2) {
                let Property = {};
                self.props.setLoadingStatus('hide');
                if (res2 && res2.properties && res2.properties[0] ? res2.properties[0] : {}) {
                  Property = res2.properties[0];
                  self.setState({
                    Receipt: res.Receipt,
                    Property: Property,
                    Type: self.props.match.params.type,
                  });
                }
              },
              function(err) {
                self.props.setLoadingStatus('hide');
                self.setState({
                  Receipt: res.Receipt,
                  Type: self.props.match.params.type,
                });
              }
            );
          } else {
            self.props.setLoadingStatus('hide');
            self.setState({
              Receipt: res.Receipt,
              Type: self.props.match.params.type,
            });
          }
        });
      })
      .catch(function(response) {
        self.props.setLoadingStatus('hide');
      });
  }

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
    mywindow.document.write(document.getElementById('allCertificates').innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    setTimeout(function() {
      mywindow.print();
      mywindow.close();
    }, 1000);

    return true;
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

  render() {
    let self = this;
    let { Receipt } = this.state;
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

    return (
      <div>
        <br />
        {self.state.Receipt && self.state.Receipt[0] ? (
          <div id="allCertificates">
            {Receipt && Receipt[0] ? (
              <Col md={12}>
                <Card>
                  <CardHeader
                    title={<strong>Receipt for: {this.props.match.params.page == 'watercharge' ? 'Water Charge' : 'Property Tax'}</strong>}
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
                            {this.props.match.params.page == 'watercharge' ? (
                              <span>Water Department</span>
                            ) : (
                              <span>Assessment Department / करनिर्धारण विभाग</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <img src="./temp/images/AS.png" height="60" width="60" />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'left' }}>
                            Receipt Number: {Receipt[0].Bill[0].billDetails[0].receiptNumber ? Receipt[0].Bill[0].billDetails[0].receiptNumber : 'NA'}
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            Receipt For: {this.props.match.params.page == 'watercharge' ? 'Water Charges' : 'Property Tax'}
                          </td>
                          <td style={{ textAlign: 'right' }}>Receipt Date: {getFullDate(Receipt[0].Bill[0].billDetails[0].receiptDate)}</td>
                        </tr>
                        <tr>
                          <td colSpan={3} style={{ textAlign: 'left' }}>
                            {this.props.match.params.page == 'watercharge' ? 'Consumer code' : 'Assessment number'} :{' '}
                            {Receipt[0].Bill[0].billDetails[0].consumerCode}
                            <br />
                            Owner Name : {Receipt[0].Bill[0].payeeName}
                            <br />
                            Amount :{' '}
                            {Receipt[0].Bill[0].billDetails[0].totalAmount ? 'Rs. ' + Receipt[0].Bill[0].billDetails[0].totalAmount + '/-' : 'NA'}
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
                          <td>{Receipt[0].Bill[0].billDetails[0].billNumber + '-' + getFullDate(Receipt[0].Bill[0].billDetails[0].receiptDate)}</td>
                          <td>{self.props.match.params.page == 'watercharge' ? 'Water' : 'Property'} No dues</td>
                          <td>00</td>
                          <td>{Receipt[0].Bill[0].billDetails[0].amountPaid}</td>
                          <td>00</td>
                          <td>{Receipt[0].Bill[0].billDetails[0].amountPaid}</td>
                          <td>00</td>
                          <td>00</td>
                        </tr>

                        <tr>
                          <td colSpan={4}>
                            Amount Paid (in words): Rupees{' '}
                            {self
                              .int_to_words(Receipt[0].Bill[0].billDetails[0].amountPaid)
                              .charAt(0)
                              .toUpperCase() + self.int_to_words(Receipt[0].Bill[0].billDetails[0].amountPaid).slice(1)}{' '}
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
                          <td>{Receipt[0].Bill[0].billDetails[0].amountPaid}</td>
                          {Receipt[0].instrument.instrumentType.name == 'Cash' ? (
                            <td colSpan={2}>NA</td>
                          ) : (
                            <td colSpan={2}>{this.state.serviceRequest.serviceRequestId}</td>
                          )}

                          {Receipt[0].instrument.instrumentType.name == 'Cash' ? (
                            <td colSpan={2}>NA</td>
                          ) : (
                            <td colSpan={2}>{getFullDate(Receipt[0].Bill[0].billDetails[0].receiptDate)}</td>
                          )}

                          {Receipt[0].instrument.instrumentType.name == 'Cash' ? (
                            <td colSpan={2}>NA</td>
                          ) : (
                            <td colSpan={2}>{Receipt[0].instrument.bank.name}</td>
                          )}
                        </tr>
                      </tbody>
                    </Table>
                  </CardText>
                </Card>
                <div style={{ 'page-break-after': 'always' }} />
              </Col>
            ) : (
              ''
            )}
            <span>
              {self.props.match.params.type == 'paytax' ? (
                ''
              ) : (
                <Col md={12}>
                  {self.props.match.params.page == 'extract' ? (
                    <Card>
                      <CardHeader title={<strong>{'Certificate for: Property Extract'}</strong>} />
                      <CardText>
                        <Table responsive style={{ fontSize: 'bold', marginBottom: '20px' }} id="CertificateForWc" bordered condensed>
                          <tbody>
                            <tr>
                              <td style={{ textAlign: 'left' }} colSpan={2}>
                                <img src="./temp/images/headerLogo.png" height="60" width="60" />
                              </td>
                              <td style={{ textAlign: 'center' }} colSpan={4}>
                                <b>Roha Municipal Council</b>
                                <br />
                                <span>Property Tax Department / करनिर्धारण विभाग</span>
                              </td>
                              <td style={{ textAlign: 'right' }} colSpan={2}>
                                <img src="./temp/images/AS.png" height="60" width="60" />
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={8}>
                                <div style={{ textAlign: 'center' }}>
                                  <b>Extract Certificate</b> / मालमत्तेचा उतारा
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={8}>
                                <div style={{ whiteSpace: 'pre' }}>
                                  <b>Ward:</b> Election Ward 1 <b>Zone: -</b> <b>Revenue Circle</b>:
                                  <br />
                                  <b>Apartment Name: Vars Apt</b>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={8}>
                                <div>
                                  <b>Property No:</b> {Receipt[0].Bill[0].billDetails[0].consumerCode}
                                  <br />
                                  <b>Property Usage / Sub Usage:</b>{' '}
                                  {this.state.Property && this.state.Property.usage ? this.state.Property.usage : 'NA'}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={8}>
                                <div style={{ whiteSpace: 'pre' }}>
                                  <b>Property Owner Name</b>:{' '}
                                  {this.state.Property && this.state.Property.owners ? this.state.Property.owners[0].name : 'NA'}
                                  <br />
                                  <b>& Address: </b> {getAddress(this.state.Property)} <b>Age of Property</b>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={8}>
                                <div>
                                  <b>Billing Name</b>: {Receipt[0].Bill[0].payeeName}
                                  <br />
                                  <b>& Address:</b> {Receipt[0].Bill[0].payeeAddress ? Receipt[0].Bill[0].payeeAddress : 'NA'}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <b>Unit No</b>
                              </td>
                              <td>
                                <b>Floor</b>
                              </td>
                              <td>
                                <b>Owner</b>
                              </td>
                              <td>
                                <b>Usage</b>
                              </td>
                              <td>
                                <b>Occupancy</b>
                              </td>
                              <td>
                                <b>ALV</b>
                              </td>
                              <td>
                                <b>RV</b>
                              </td>
                              <td>
                                <b>Total Tax</b>
                              </td>
                            </tr>
                            {this.state.Property && this.state.Property.propertyDetail && this.state.Property.propertyDetail.floors
                              ? renderProperty(this.state.Property.propertyDetail.floors)
                              : 'No Data Available'}
                          </tbody>
                        </Table>
                      </CardText>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader
                        title={
                          <strong>
                            {'Certificate for: ' + (this.props.match.params.page == 'propertytax' ? 'Property Tax' : 'Water Charges') + ' No due'}
                          </strong>
                        }
                      />
                      <CardText>
                        <Table id="CertificateForWc" responsive style={{ fontSize: 'bold' }} bordered condensed>
                          <tbody>
                            <tr>
                              <td style={{ textAlign: 'left' }}>
                                <img src="./temp/images/headerLogo.png" height="60" width="60" />
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <b>Roha Municipal Council</b>
                                <br />
                                {this.props.match.params.page == 'propertytax' ? (
                                  <span>Property Tax Department / करनिर्धारण विभाग</span>
                                ) : (
                                  <span>Water Department</span>
                                )}
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <img src="./temp/images/AS.png" height="60" width="60" />
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={3}>
                                <div style={{ textAlign: 'center' }}>
                                  No Due Certificate / थकबाकी नसल्याचे प्रमाणपत्र<br />
                                  (मुवंई प्रांतिक महानगरपालिका अधिनियम 1949 चे अनुसूचीतील प्रकरण 8 अधिनियम 44, 45 व 46 अन्वये)
                                </div>
                                <br />
                                <div style={{ textAlign: 'right' }}>
                                  Date / दिनांक :{Receipt[0].Bill[0].billDetails[0].billDate
                                    ? getFullDate(Receipt[0].Bill[0].billDetails[0].billDate, true)
                                    : Receipt[0].Bill[0].billDetails[0].receiptDate
                                      ? getFullDate(Receipt[0].Bill[0].billDetails[0].receiptDate, true)
                                      : '-'}{' '}
                                  <br />
                                  Certificate No. / प्रमाणपत्र क्रं : {this.props.match.params.sid.replace('SRN', 'CERT')}
                                </div>
                                <br />
                                <div style={{ textAlign: 'left' }}>
                                  प्रती,<br />
                                  {Receipt[0].Bill[0].payeeName}
                                  <br />
                                  {Receipt[0].Bill[0].payeeAddress ? Receipt[0].Bill[0].payeeAddress : 'Roha'}
                                </div>
                                <br />
                                <div style={{ textAlign: 'center' }}>
                                  Subject /विषय : सन 2017 - 18 थकबाकी नसल्याचे प्रमाणपत्र मिळणेबाबत.<br />
                                  Reference / संदर्भ : {this.props.match.params.sid} आपला अर्ज क्रमांक{' '}
                                  {Receipt[0].Bill[0].billDetails[0].applicationNo} दिनांक{' '}
                                  {getFullDate(Receipt[0].Bill[0].billDetails[0].receiptDate)}
                                </div>
                                <br />
                                <div style={{ textAlign: 'left' }}>महोद्य / महोद्या ,</div>
                                <br />
                                <div style={{ textAlign: 'center' }}>
                                  संदर्भिय विषयांन्वये प्रमाणित करण्यात येते की,{' '}
                                  {this.props.match.params.id != 'pt' ? 'पाणी क्रमांक' : 'मालमत्ता क्रमांक'},
                                  {Receipt[0].Bill[0].billDetails[0].consumerCode} यांच्या नावे नोंद असून, सन 2017-18{' '}
                                  {this.props.match.params.page != 'propertytax'
                                    ? 'पर्यंतचा संपुर्ण पाणी रक्कम भरलेली असून, कोणतीही थकबाकी येणे नाही.'
                                    : 'पर्यंतचा संपुर्ण मालमत्ता कराची रक्कम भरलेली असून, कोणतीही थकबाकी येणे नाही.'}
                                </div>
                                <br />
                                <div style={{ textAlign: 'right' }}>
                                  कर अधिक्षक,<br />
                                  Roha Municipal Council
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </CardText>
                    </Card>
                  )}
                </Col>
              )}
            </span>
          </div>
        ) : (
          ''
        )}

        <div style={{ textAlign: 'center' }}>
          {Receipt && Receipt[0] ? (
            <RaisedButton
              primary={true}
              label="Download"
              onClick={() => {
                self.generatePDF();
              }}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(ReceiptDownload);
