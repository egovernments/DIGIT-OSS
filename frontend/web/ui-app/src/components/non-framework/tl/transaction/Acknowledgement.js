import React, { Component } from 'react';
import { connect } from 'react-redux';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import Api from '../../../../api/api';
import { translate, dataURItoBlob, epochToDate, epochToTime } from '../../../common/common';
import { fonts, getBase64FromImageUrl } from '../../../common/pdf-generation/PdfConfig';
import PdfViewer from '../../../common/pdf-generation/PdfViewer';
import styles from '../../../../styles/material-ui';
import RaisedButton from 'material-ui/RaisedButton';

export default class Acknowledgement extends Component {
  constructor() {
    super();
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

    let { setLoadingStatus, handleError } = this.props;
    setLoadingStatus('loading');

    Promise.all([
      ulbLogoPromise,
      stateLogoPromise,
      Api.commonApiPost('/tl-services/configurations/v1/_search', {}, { tenantId: this.getTenantId() }, false, true),
      Api.commonApiGet(
        'https://raw.githubusercontent.com/abhiegov/test/master/tenantDetails.json',
        { timestamp: new Date().getTime() },
        {},
        false,
        true
      ),
    ])
      .then(response => {
        var cityName = response[3]['details'][this.getTenantId()]['name'];
        this.generatePdf(response[0].image, response[1].image, response[2].TLConfiguration, cityName);
      })
      .catch(function(err) {
        handleError(err.message);
      });
  };

  getTenantId = () => {
    return localStorage.getItem('tenantId') || 'default';
  };

  generatePdf = (ulbLogo, stateLogo, certificateConfigDetails, ulbName) => {
    let { license } = this.props;
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
              text: [{ text: `${ulbName}\n`, style: 'title' }],
              margin: [0, 20, 0, 0],
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
          table: {
            widths: [120, 'auto', '*', 'auto', 'auto', '*'],
            body: [
              [
                { text: `${translate('tl.search.groups.applicationNumber')}` },
                { text: ':', alignment: 'left' },
                { text: `${license.applicationNumber}`, alignment: 'left' },
                { text: `${translate('tl.acknowledgement.applicantName')}` },
                { text: ':', alignment: 'left' },
                { text: `${license.ownerName}`, alignment: 'left' },
              ],
              [
                { text: `${translate('tl.acknowledgement.serviceName')}` },
                { text: ':', alignment: 'left' },
                { text: `New License`, alignment: 'left' },
                { text: `${translate('tl.acknowledgement.departmentName')}` },
                { text: ':', alignment: 'left' },
                {
                  text: `${certificateConfigDetails['default.citizen.workflow.initiator.department.name']}`,
                  alignment: 'left',
                },
              ],
              [
                { text: `${translate('tl.acknowledgement.applicationFee')}` },
                { text: ':', alignment: 'left' },
                { text: ``, alignment: 'left' },
                '',
                '',
                '',
              ],
              [
                { text: `${translate('tl.acknowledgement.applicationDate')}` },
                { text: ':', alignment: 'left' },
                {
                  text: `${epochToDate(license.applicationDate)}`,
                  alignment: 'left',
                },
                { text: `${translate('tl.acknowledgement.applicationTime')}` },
                { text: ':', alignment: 'left' },
                {
                  text: `${epochToTime(license.applicationDate)}`,
                  alignment: 'left',
                },
              ],
              [
                { text: `${translate('tl.acknowledgement.dueDate')}` },
                { text: ':', alignment: 'left' },
                { text: '', alignment: 'left' },
                { text: `${translate('tl.acknowledgement.dueTime')}` },
                { text: ':', alignment: 'left' },
                { text: '', alignment: 'left' },
              ],
            ],
          },
          layout: 'noBorders',
          margin: [0, 15, 0, 15],
        },
        { text: `${translate('tl.acknowledgement.note')}` },
        {
          columns: [
            {
              width: '*',
              text: '',
            },
            {
              width: '*',
              text: `\n\n\nSigning Authority`,
              alignment: 'center',
              bold: true,
            },
          ],
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
      formData.append('file', blob, `TL_${license.applicationNumber}+_Ack.pdf`);
      formData.append('tenantId', localStorage.getItem('tenantId'));
      formData.append('module', 'TL');

      let { setLoadingStatus, handleError } = this.props;

      var errorFunction = function(err) {
        setLoadingStatus('hide');
        handleError(err.message);
      };

      Api.commonApiPost('/filestore/v1/files', {}, formData).then(function(response) {
        var noticearray = [];
        var noticeObj = {};
        noticeObj['licenseId'] = license.id;
        noticeObj['tenantId'] = localStorage.getItem('tenantId');
        noticeObj['documentName'] = 'ACKNOWLEDGEMENT';
        noticeObj['fileStoreId'] = response.files[0].fileStoreId;
        noticearray.push(noticeObj);
        Api.commonApiPost('tl-services/noticedocument/v1/_create', {}, { NoticeDocument: noticearray }, false, true).then(function(response) {
          setLoadingStatus('hide');
        }, errorFunction);
      }, errorFunction);
    });
  };

  render() {
    let { setRoute } = this.props;
    return (
      <PdfViewer pdfData={this.state.pdfData} title="tl.ack.trade.title">
        <div className="text-center">
          <RaisedButton
            style={styles.marginStyle}
            label={translate('tl.view.title')}
            primary={true}
            onClick={e => {
              setRoute('/non-framework/tl/transaction/viewLicense/' + this.props.license.id);
            }}
          />
          <RaisedButton style={styles.marginStyle} href={this.state.pdfData} download label={translate('tl.download')} download primary={true} />
        </div>
      </PdfViewer>
    );
  }
}
