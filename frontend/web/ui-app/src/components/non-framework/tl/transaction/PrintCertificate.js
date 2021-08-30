import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import Api from '../../../../api/api';
import { translate, epochToDate, dataURItoBlob } from '../../../common/common';
import { fonts, writeMultiLanguageText, getBase64FromImageUrl } from '../../../common/pdf-generation/PdfConfig';
import PdfViewer from '../../../common/pdf-generation/PdfViewer';
import styles from '../../../../styles/material-ui';
import RaisedButton from 'material-ui/RaisedButton';
const constants = require('../../../common/constants');

var self;

const CONFIG_DEPT_KEY = 'default.citizen.workflow.initiator.department.name';
const CONFIG_MUNICIPAL_ACT_KEY = 'default.pdf.municipal.act.section';
const DOCUMENT_NAME = 'LICENSE_CERTIFICATE';
const TL_BUSINESS_CODE = 'TRADELICENSE';

class PrintCertificate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfData: undefined,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.doInitialStuffs();
  }

  doInitialStuffs = () => {
    var ulbLogoPromise = getBase64FromImageUrl('./temp/images/headerLogo.png');
    var stateLogoPromise = getBase64FromImageUrl('./temp/images/AS.png');

    var _this = this;
    this.props.setLoadingStatus('loading');

    var { applicationNumber } = this.props.license;

    Promise.all([
      ulbLogoPromise,
      stateLogoPromise,
      Api.commonApiPost('/tl-services/configurations/v1/_search', {}, { tenantId: this.getTenantId(), pageSize: '500' }, false, true),
      Api.commonApiGet(
        'https://raw.githubusercontent.com/abhiegov/test/master/tenantDetails.json',
        { timestamp: new Date().getTime() },
        {},
        false,
        true
      ),
      Api.commonApiPost(
        '/collection-services/receipts/_search',
        { consumerCode: applicationNumber, businessCode: TL_BUSINESS_CODE },
        { tenantId: this.getTenantId(), pageSize: '500' },
        false,
        true
      ),
    ])
      .then(response => {
        var cityName = response[3]['details'][this.getTenantId()]['name'];
        _this.generatePdf(response[0].image, response[1].image, response[2].TLConfiguration, cityName, response[4].Receipt[0]);
      })
      .catch(function(err) {
        _this.props.errorCallback(err.message);
      });
  };

  getTenantId = () => {
    return localStorage.getItem('tenantId') || 'default';
  };

  getApplicationFee = (license, applicationType) => {
    var applicationFee = license.applications.find(application => application.applicationType === applicationType);
    return applicationFee && applicationFee.licenseFee ? applicationFee.licenseFee.toFixed(2) : '0.00';
  };

  generatePdf = (ulbLogo, stateLogo, certificateConfigDetails, ulbName, receiptDetails) => {
    let license = this.props.license;

    var _this = this;

    var departmentName = certificateConfigDetails[CONFIG_DEPT_KEY];
    var municipalActDetails = certificateConfigDetails[CONFIG_MUNICIPAL_ACT_KEY];
    var receiptNumber = receiptDetails.Bill[0].billDetails[0].receiptNumber;
    var receiptDate = receiptDetails.Bill[0].billDetails[0].receiptDate;

    //assigning fonts
    pdfMake.fonts = fonts;

    //document defintion
    var docDefinition = {
      pageSize: 'A4',
      pageMargins: [30, 30, 30, 30],
      content: [
        //Pdf header
        {
          columns: [
            {
              width: 60,
              fit: [60, 60],
              image: ulbLogo,
              alignment: 'left',
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              width: '*',
              text: [
                { text: `${ulbName}\n`, style: 'title' },
                { text: departmentName + '\n', style: 'subTitle' },
                { text: license.tradeType + ' LICENSE', style: 'subTitle2' },
              ],
              margin: [0, 10, 0, 0],
              alignment: 'center',
            },
            {
              width: 60,
              fit: [60, 60],
              image: stateLogo,
              alignment: 'right',
              background: 'black',
              color: 'white',
            },
          ],
          // optional space between columns
          columnGap: 0,
        },

        {
          table: {
            widths: ['*'],
            body: [[' '], [' ']],
          },
          layout: {
            hLineWidth: function(i, node) {
              return i === 0 || i === node.table.body.length ? 0 : 1;
            },
            vLineWidth: function(i, node) {
              return 0;
            },
          },
          margin: [0, 0, 0, 0],
        },

        {
          text: municipalActDetails && municipalActDetails.length > 0 ? municipalActDetails[0] : 'As per the Municipal act',
          margin: [0, 0, 0, 10],
        },

        {
          table: {
            widths: [120, 5, '*', 100, 'auto', 'auto'],
            body: [
              [
                { text: 'License Holder Name' },
                { text: ':', alignment: 'left' },
                { text: `${license.ownerName}`, alignment: 'left' },
                { text: 'License No.', alignment: 'right' },
                { text: ':', alignment: 'left' },
                { text: `${license.licenseNumber}`, alignment: 'left' },
              ],
              [
                { text: 'Business Name' },
                { text: ':', alignment: 'left' },
                { text: `${license.tradeTitle}`, alignment: 'left' },
                { text: 'Date', alignment: 'right' },
                { text: ':', alignment: 'left' },
                {
                  text: `${epochToDate(new Date().getTime())}`,
                  alignment: 'left',
                },
              ],
              [{ text: 'Business Address' }, { text: ':', alignment: 'left' }, { text: `${license.tradeAddress}`, alignment: 'left' }, '', '', ''],
            ],
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 15],
        },

        {
          style: 'tableExample',
          table: {
            headerRows: 2,
            widths: [90, '*', '*', '*', '*', '*'],
            body: [
              //header
              [
                {
                  text: 'License Type /\n Sub-Type',
                  style: 'tableHeader',
                  rowSpan: 2,
                  alignment: 'center',
                },
                {
                  text: 'Measurements',
                  style: 'tableHeader',
                  colSpan: 3,
                  alignment: 'center',
                },
                {},
                {},
                {
                  text: 'Fee Details',
                  style: 'tableHeader',
                  colSpan: 2,
                  alignment: 'center',
                },
                {},
              ],

              [
                {},
                {
                  text: 'Measuring Parameters',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'Input Values',
                  style: 'tableHeader',
                  alignment: 'right',
                },
                { text: 'Units', style: 'tableHeader', alignment: 'center' },
                { text: 'Fee Type', style: 'tableHeader', alignment: 'center' },
                {
                  text: 'Fee Amount',
                  style: 'tableHeader',
                  alignment: 'right',
                },
              ],

              //body
              [
                license.category + ' / ' + license.subCategory,
                { text: 'Fee Factor1', alignment: 'center' },
                { text: license.quantity, alignment: 'right' },
                { text: license.uom, alignment: 'center' },
                { text: 'License Fee', alignment: 'center' },
                {
                  text: this.getApplicationFee(license, 'NEW'),
                  alignment: 'right',
                },
              ],

              //footer
              [
                { text: '', colSpan: 4, border: [false, false, false, false] },
                '',
                '',
                '',
                { text: 'Total Fee', alignment: 'right' },
                {
                  text: this.getApplicationFee(license, 'NEW'),
                  alignment: 'right',
                },
              ],
            ],
          },
        },

        {
          table: {
            widths: [120, 'auto', '*', 'auto', 'auto', '*'],
            body: [
              [
                { text: 'Total License Fee' },
                { text: ':', alignment: 'left' },
                {
                  text: `${this.getApplicationFee(license, 'NEW')}`,
                  alignment: 'left',
                },
                '',
                '',
                '',
              ],
              [
                { text: 'Receipt No.' },
                { text: ':', alignment: 'left' },
                { text: `${receiptNumber}`, alignment: 'left' },
                { text: 'Receipt Date' },
                { text: ':', alignment: 'left' },
                { text: `${epochToDate(receiptDate)}`, alignment: 'left' },
              ],
              [
                { text: 'License Valid From' },
                { text: ':', alignment: 'left' },
                {
                  text: `${epochToDate(license.licenseValidFromDate)}`,
                  alignment: 'left',
                },
                { text: 'Expiry Date' },
                { text: ':', alignment: 'left' },
                {
                  text: `${epochToDate(license.expiryDate)}`,
                  alignment: 'left',
                },
              ],
            ],
          },
          layout: 'noBorders',
          margin: [0, 15, 0, 15],
        },

        {
          columns: [
            {
              width: '*',
              text: '',
            },
            {
              width: '*',
              text: `\n\n\n${ulbName}`,
              alignment: 'center',
              bold: true,
            },
          ],
        },
      ],
      styles: {
        title: {
          fontSize: 15,
          bold: true,
          lineHeight: 1.1,
        },
        subTitle: {
          fontSize: 12,
          lineHeight: 1.1,
        },
        subTitle2: {
          fontSize: 12,
        },
        contentTitle: {
          fontSize: 12,
        },
      },
      defaultStyle: {
        fontSize: 11,
      },
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    pdfDocGenerator.getDataUrl(dataUrl => {
      this.setState({
        pdfData: dataUrl,
      });

      let formData = new FormData();
      var blob = dataURItoBlob(dataUrl);
      formData.append('file', blob, `TL_${license.licenseNumber || '0'} + .pdf`);
      formData.append('tenantId', localStorage.getItem('tenantId'));
      formData.append('module', constants.TRADE_LICENSE_FILE_TAG);

      let { setLoadingStatus } = this.props;

      var errorFunction = function(err) {
        setLoadingStatus('hide');
        _this.props.errorCallback(err.message);
      };

      Api.commonApiPost('/filestore/v1/files', {}, formData).then(function(response) {
        if (response.files && response.files.length > 0) {
          //response.files[0].fileStoreId
          var noticeDocument = [
            {
              licenseId: license.id,
              tenantId: _this.getTenantId(),
              documentName: DOCUMENT_NAME,
              fileStoreId: response.files[0].fileStoreId,
            },
          ];
          Api.commonApiPost(
            'tl-services/noticedocument/v1/_create',
            {},
            {
              NoticeDocument: noticeDocument,
            },
            false,
            true
          ).then(function(response) {
            _this.props.successCallback();
            setLoadingStatus('hide');
          }, errorFunction);
        } else setLoadingStatus('hide');
      }, errorFunction);
    });
  };

  render() {
    self = this;
    let { viewLicense } = this.props;
    console.log(viewLicense);
    return (
      <PdfViewer pdfData={this.state.pdfData} title="tl.license.certificate.title">
        <div className="text-center">
          <RaisedButton style={styles.marginStyle} href={this.state.pdfData} download label={translate('tl.download')} download primary={true} />
        </div>
      </PdfViewer>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
});

const ViewPrintCertificate = connect(mapStateToProps, mapDispatchToProps)(PrintCertificate);

export default ViewPrintCertificate;
