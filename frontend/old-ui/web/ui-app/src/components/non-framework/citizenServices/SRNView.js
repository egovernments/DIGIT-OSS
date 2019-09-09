import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import UiButton from '../../framework/components/UiButton';
import { translate } from '../../common/common';
import Api from '../../../api/api';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { getFullDate } from '../../framework/utility/utility';

let nameMap = {
  CREATED: 'Created',
  WATER_NEWCONN: 'New Water Connection',
  CANCELLED: 'Request Cancelled',
  REJECTED: 'Rejected',
  BPA_FIRE_NOC: 'Fire NOC',
  INPROGRESS: 'In Progress',
  APPROVED: 'Approved',
  PT_EXTRACT: 'Property Extract',
  WC_PAYTAX: 'Water Charge Tax Payment',
  PT_PAYTAX: 'Property Tax Payment',
  ESTIMATIONNOTICEGENERATED: 'Estimation Notice Generated',
  VERIFIED: 'Verified',
  ESTIMATIONAMOUNTCOLLECTED: 'Estimation Amount Collected',
  WORKORDERGENERATED: 'Work Order Generated',
  SANCTIONED: 'Sanctioned',
  TL_NEWCONN: 'New Trade License',
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

// const getFullDate = function(dat,isTimeStamp=false) {
//   if(!dat) return "-";
//   var _date = new Date(dat);
//   if (isTimeStamp) {
//     return ('0' + _date.getDate()).slice(-2) + '/'
//                  + ('0' + (_date.getMonth()+1)).slice(-2) + '/'
//                  + _date.getFullYear() + " "
//                  + ('0' + _date.getHours()).slice(-2) + ":"
//                  + ('0' + _date.getMinutes()).slice(-2) + ":"
//                  + ('0' + _date.getSeconds()).slice(-2)
//   } else {
//     return ('0' + _date.getDate()).slice(-2) + '/'
//                  + ('0' + (_date.getMonth()+1)).slice(-2) + '/'
//                  + _date.getFullYear()
//   }
//
//
// }

class CertificateView extends Component {
  static isPrivate = false;
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      ServiceRequest: {},
      statuses: ['APPROVED', 'SANCTIONED'],
      serviceCodes: ['TL_NEWCONN', 'WATER_NEWCONN', 'BPA_FIRE_NOC', 'WC_NODUES', 'PT_NODUES'],
      Receipt: [],
      openSecondDialog: false,
    };
  }

  getProperty = cb => {
    let self = this;
    Api.commonApiPost(
      'pt-property/properties/_search',
      { upicNumber: this.props.match.params.srn },
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

  componentDidMount() {
    let srn = decodeURIComponent(this.props.match.params.srn);
    let self = this;
    self.props.setLoadingStatus('loading');
    Api.commonApiPost('/citizen-services/v1/requests/anonymous/_search', { serviceRequestId: srn }, {}, false, true).then(
      function(res) {
        self.props.setLoadingStatus('hide');
        if (res && res.serviceReq && res.serviceReq.length && self.state.serviceCodes.indexOf(res.serviceReq[0].serviceCode) > -1) {
          self.getProperty(function(property) {
            self.setState({
              ServiceRequest: res.serviceReq[0],
              Receipt: res.receiptDetails.Receipt,
              openSecondDialog: self.props.match.params.isCertificate == 'true' ? true : false,
              Property: property,
            });
            // console.log(res2);
            // self.handleNext();
          });

          // self.setState({
          // 	ServiceRequest: res.serviceReq[0],
          // 	Receipt:res.receiptDetails.Receipt,
          // 	openSecondDialog:self.props.match.params.isCertificate=="true"?true:false
          // })
        } else {
          self.setState({
            open: true,
          });
        }
      },
      function(err) {
        self.props.setLoadingStatus('hide');
        self.setState({
          open: true,
        });
      }
    );
  }

  handleClose = () => {
    this.props.setRoute('/' + (localStorage.getItem('tenantId') || 'default'));
  };

  handleCloseTwo = () => {
    this.setState({
      openSecondDialog: false,
    });
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

  render() {
    let self = this;
    let { open, ServiceRequest, Receipt, openSecondDialog } = this.state;
    let { handleClose, generatePdf, handleCloseTwo } = this;
    // console.log(Receipt);
    return (
      <div>
        <Card className="uiCard">
          <CardHeader
            title={
              self.props.match.params.isCertificate == 'true'
                ? 'Certificate '
                : 'Application Info - ' + decodeURIComponent(self.props.match.params.srn)
            }
          />
          <CardText>
            <Grid>
              <Row>
                <Col xs={12} sm={4} md={3}>
                  <Col style={{ textAlign: 'left' }} xs={12}>
                    <label>
                      <span style={{ fontWeight: 500, fontSize: '13px' }}>
                        {self.props.match.params.isCertificate == 'true' ? 'Certificate ' : 'Application '} Date
                      </span>
                    </label>
                  </Col>
                  <Col style={{ textAlign: 'left' }} xs={12}>
                    {ServiceRequest.auditDetails && ServiceRequest.auditDetails.createdDate
                      ? getFullDate(ServiceRequest.auditDetails.createdDate)
                      : '-'}
                  </Col>
                </Col>
                <Col xs={12} sm={4} md={3}>
                  <Col style={{ textAlign: 'left' }} xs={12}>
                    <label>
                      <span style={{ fontWeight: 500, fontSize: '13px' }}>
                        {self.props.match.params.isCertificate == 'true' ? 'Certificate ' : 'Application '} Type
                      </span>
                    </label>
                  </Col>
                  <Col style={{ textAlign: 'left' }} xs={12}>
                    {nameMap[ServiceRequest.serviceCode] || ServiceRequest.serviceCode || '-'}
                  </Col>
                </Col>
                <Col xs={12} sm={4} md={3}>
                  <Col style={{ textAlign: 'left' }} xs={12}>
                    <label>
                      <span style={{ fontWeight: 500, fontSize: '13px' }}>Applicant Name</span>
                    </label>
                  </Col>
                  <Col style={{ textAlign: 'left' }} xs={12}>
                    {ServiceRequest.firstName || '-'}
                  </Col>
                </Col>
                <Col xs={12} sm={4} md={3}>
                  <Col style={{ textAlign: 'left' }} xs={12}>
                    <label>
                      <span style={{ fontWeight: 500, fontSize: '13px' }}>
                        {self.props.match.params.isCertificate == 'true' ? 'Certificate ' : 'Application '} Status
                      </span>
                    </label>
                  </Col>
                  <Col style={{ textAlign: 'left' }} xs={12}>
                    {nameMap[ServiceRequest.status] || ServiceRequest.status || '-'}
                  </Col>
                </Col>
              </Row>
            </Grid>
          </CardText>
        </Card>
        {self.state.statuses.indexOf(ServiceRequest.status) > -1 ? (
          <Card className="uiCard">
            <CardHeader
              title={
                self.props.match.params.isCertificate == 'true'
                  ? 'Certificate '
                  : 'Application Info - ' + decodeURIComponent(self.props.match.params.srn)
              }
            />
            <CardText>
              <Table responsive style={{ fontSize: 'bold' }} bordered condensed>
                <thead>
                  <tr>
                    <th>By</th>
                    <th>Date</th>
                    <th>File Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ServiceRequest && ServiceRequest.documents && ServiceRequest.documents.length ? (
                    ServiceRequest.documents.map(function(v, i) {
                      if (v.uploadedbyrole == 'EMPLOYEE' && v.isFinal)
                        return (
                          <tr key={i}>
                            <td>{v.from}</td>
                            <td>{getFullDate(v.timeStamp)}</td>
                            <td>{v.name}</td>
                            <td>
                              <a
                                target="_blank"
                                href={'/filestore/v1/files/id?tenantId=' + localStorage.getItem('tenantId') + '&fileStoreId=' + v.filePath}
                              >
                                Download
                              </a>
                            </td>
                          </tr>
                        );
                    })
                  ) : (
                    <tr>
                      <td style={{ textAlign: 'center' }} colSpan={4}>
                        No documents uploaded!
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </CardText>
          </Card>
        ) : (
          ''
        )}

        <Dialog
          title=""
          modal={false}
          open={openSecondDialog}
          actions={<FlatButton label="View" primary={true} onClick={this.handleCloseTwo} />}
          onRequestClose={handleCloseTwo}
        >
          <div>
            {'The certificate number ' + self.props.match.params.srn + ' was generated from the system. Please click here to view the certificate'}
          </div>
        </Dialog>

        <Dialog
          title="Not Found"
          modal={false}
          open={open}
          actions={<FlatButton label="Ok" primary={true} onClick={this.handleClose} />}
          onRequestClose={handleClose}
        >
          <div>{self.props.match.params.isCertificate == 'true' ? 'Certificate not found' : 'Application number'} not found.</div>
        </Dialog>
        <div id="allCertificates">
          {self.props.match.params.isCertificate == 'true' &&
            (ServiceRequest.serviceCode == 'PT_NODUES' || ServiceRequest.serviceCode == 'WC_NODUES') &&
            Receipt.length > 0 && (
              <Card className="uiCard">
                <CardHeader
                  title={
                    self.props.match.params.isCertificate == 'true'
                      ? 'Certificate '
                      : 'Application Info - ' + decodeURIComponent(self.props.match.params.srn)
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
                          {ServiceRequest.serviceCode == 'PT_NODUES' ? (
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
                            Certificate No. / प्रमाणपत्र क्रं : {ServiceRequest.serviceRequestId.replace('SRN', 'CERT')}
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
                            Reference / संदर्भ : {ServiceRequest ? ServiceRequest.serviceRequestId : ''} आपला अर्ज क्रमांक{' '}
                            {Receipt[0].Bill[0].billDetails[0].applicationNo} दिनांक {getFullDate(Receipt[0].Bill[0].billDetails[0].receiptDate)}
                          </div>
                          <br />
                          <div style={{ textAlign: 'left' }}>महोद्य / महोद्या ,</div>
                          <br />
                          <div style={{ textAlign: 'center' }}>
                            संदर्भिय विषयांन्वये प्रमाणित करण्यात येते की, {this.props.match.params.id != 'pt' ? 'पाणी क्रमांक' : 'मालमत्ता क्रमांक'},
                            {Receipt[0].Bill[0].billDetails[0].consumerCode} यांच्या नावे नोंद असून, सन 2017-18{' '}
                            {this.props.match.params.id != 'pt'
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

                  <span style={{ textAlign: 'right' }}>{translate('This is computer generated receipt no authorised signature required')}</span>
                </CardText>
              </Card>
            )}

          {self.props.match.params.isCertificate == 'true' &&
            ServiceRequest.serviceCode == 'PT_EXTRACT' &&
            Receipt.length > 0 && (
              <Card>
                <CardHeader
                  title={
                    <strong>
                      {'Certificate for: ' + (ServiceRequest.serviceCode == 'PT_EXTRACT' ? 'Property Tax' : 'Water Charge') + ' Extract'}
                    </strong>
                  }
                />
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
                          {ServiceRequest.serviceCode == 'PT_EXTRACT' ? (
                            <span>Property Tax Department / करनिर्धारण विभाग</span>
                          ) : (
                            <span>Water Department</span>
                          )}
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
                            <b>Property Usage / Sub Usage:</b> {this.state.Property && this.state.Property.usage ? this.state.Property.usage : 'NA'}
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
                  <span style={{ textAlign: 'right' }}>{translate('This is computer generated receipt no authorised signature required')}</span>
                </CardText>
              </Card>
            )}
        </div>

        {self.props.match.params.isCertificate == 'true' &&
          (ServiceRequest.serviceCode == 'PT_EXTRACT' || ServiceRequest.serviceCode == 'PT_NODUES' || ServiceRequest.serviceCode == 'WC_NODUES') && (
            <div style={{ textAlign: 'center' }}>
              <br />
              <UiButton
                handler={() => {
                  generatePdf('Receipt');
                }}
                item={{
                  label: 'Download',
                  uiType: 'button',
                  isDisabled: false,
                }}
                ui="google"
              />
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  formData: state.frameworkForm.form,
});

const mapDispatchToProps = dispatch => ({
  setMockData: mockData => {
    dispatch({ type: 'SET_MOCK_DATA', mockData });
  },
  setFormData: data => {
    dispatch({ type: 'SET_FORM_DATA', data });
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

export default connect(mapStateToProps, mapDispatchToProps)(CertificateView);
