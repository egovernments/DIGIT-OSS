import React, { Component } from 'react';
import { connect } from 'react-redux';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import styles from '../../../../styles/material-ui';
import Api from '../../../../api/api';
import { translate, epochToDate, dataURItoBlob } from '../../../common/common';
import { Card, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import { fonts, writeMultiLanguageText, getBase64FromImageUrl } from '../../../common/pdf-generation/PdfConfig';
import PdfViewer from '../../../common/pdf-generation/PdfViewer';
import RaisedButton from 'material-ui/RaisedButton';
const constants = require('../../../common/constants');

const CONFIG_DEPT_KEY = 'default.citizen.workflow.initiator.department.name';
const DOCUMENT_NAME = 'REJECTION_LETTER';

class RejectionLetter extends Component {
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
    ])
      .then(response => {
        var cityName = response[3]['details'][this.getTenantId()]['name'];
        _this.generatePdf(response[0].image, response[1].image, response[2].TLConfiguration, cityName);
      })
      .catch(function(err) {
        _this.props.setLoadingStatus('hide');
        _this.props.errorCallback(err.message);
      });
  };

  getTenantId = () => {
    return localStorage.getItem('tenantId') || 'default';
  };

  generatePdf = (ulbLogo, stateLogo, certificateConfigDetails, ulbName) => {
    var departmentName = certificateConfigDetails[CONFIG_DEPT_KEY];
    var license = this.props.license;
    var _this = this;

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
              text: [{ text: `${ulbName}\n`, style: 'title' }, { text: departmentName, style: 'subTitle' }],
              margin: [0, 12, 0, 0],
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

        //Pdf body
        {
          text: writeMultiLanguageText('Rejection Letter / नकार पत्र'),
          alignment: 'center',
          style: 'contentTitle',
          margin: [0, 0, 0, 5],
        },

        {
          table: {
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                '',
                { text: writeMultiLanguageText('Date / दिनांक') },
                { text: ':', alignment: 'left' },
                {
                  text: `${epochToDate(new Date().getTime())}`,
                  alignment: 'left',
                },
              ],
              [
                '',
                { text: writeMultiLanguageText('No / क्रमांक') },
                { text: ':', alignment: 'left' },
                { text: `${license.applicationNumber}`, alignment: 'left' },
              ],
            ],
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 10],
        },

        {
          text: 'To,',
          bold: true,
          margin: [0, 0, 0, 2],
        },

        {
          text: writeMultiLanguageText(license.ownerName),
          bold: true,
          margin: [0, 0, 0, 10],
        },

        {
          text: writeMultiLanguageText(`Subject : ${license.applications[0].applicationType} TRADE LICENSE`),
          margin: [0, 0, 0, 2],
        },

        {
          text: [
            'Reference : Application No ',
            { text: license.applicationNumber, decoration: 'underline' },
            ' and Application Date ',
            {
              text: epochToDate(license.applicationDate),
              decoration: 'underline',
            },
          ],
          margin: [0, 0, 0, 2],
        },

        {
          text: 'Sir/Madam',
          margin: [0, 0, 0, 2],
        },

        {
          text: 'License requested to ULB has been Rejected due to following reason',
          margin: [0, 0, 0, 2],
        },

        {
          text: writeMultiLanguageText(license.approvalComments),
          margin: [0, 0, 0, 2],
        },

        {
          columns: [
            {
              width: 'auto',
              text: 'For further information visit ULB\nAuthority',
            },

            {
              width: '*',
              alignment: 'right',
              text: `\n\n\n\n\n${ulbName}`,
              bold: true,
            },
          ],
          margin: [0, 0, 10, 2],
        },
      ],
      styles: {
        title: {
          fontSize: 15,
          bold: true,
          lineHeight: 1.2,
        },
        subTitle: {
          fontSize: 13,
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

    let { setLoadingStatus } = this.props;

    var errorFunction = function(err) {
      _this.props.errorCallback(err.message);
    };

    pdfDocGenerator.getDataUrl(dataUrl => {
      this.setState({
        pdfData: dataUrl,
      });

      let formData = new FormData();
      var blob = dataURItoBlob(dataUrl);
      formData.append('file', blob, `${license.applicationNumber || 0}_Rejection_Letter.pdf`);
      formData.append('tenantId', _this.getTenantId());
      formData.append('module', constants.TRADE_LICENSE_FILE_TAG);

      Api.commonApiPost('/filestore/v1/files', {}, formData).then(function(response) {
        if (response.files && response.files.length > 0) {
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
    return (
      <PdfViewer pdfData={this.state.pdfData} title="tl.rejection.letter.title">
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

const ViewRejectionLetter = connect(mapStateToProps, mapDispatchToProps)(RejectionLetter);

export default ViewRejectionLetter;
