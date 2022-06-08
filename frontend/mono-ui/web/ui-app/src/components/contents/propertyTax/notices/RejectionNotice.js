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

const DOCUMENT_NAME = 'CREATE_REJECTION_NOTICE';

class RejectionNotice extends Component {
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
      Api.commonApiGet(
        'https://raw.githubusercontent.com/abhiegov/test/master/tenantDetails.json',
        { timestamp: new Date().getTime() },
        {},
        false,
        true
      ),
    ])
      .then(response => {
        var cityName = response[2]['details'][this.getTenantId()]['name'];
        _this.generatePdf(response[0].image, response[1].image, {}, cityName);
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
    let { serviceName, property, rejectionRemarks } = this.props;

    let ownersText = [property.owners.map(owner => owner.name)].join(', ');
    let applicationNumber = property.propertyDetail.applicationNo;

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
              text: [
                { text: `${ulbName}\n`, style: 'title' },
                ...writeMultiLanguageText('Assessment Department', {
                  fontSize: 13,
                }),
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

        //Pdf body
        {
          text: writeMultiLanguageText('Rejection Letter / नकार पत्र'),
          alignment: 'center',
          style: 'contentTitle',
          margin: [0, 0, 0, 10],
        },

        {
          table: {
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                '',
                {
                  text: [...writeMultiLanguageText('Date / दिनांक')],
                  bold: true,
                },
                { text: ':', alignment: 'left' },
                {
                  text: `${epochToDate(new Date().getTime())}`,
                  alignment: 'left',
                },
              ],
              // ['', {text : writeMultiLanguageText("No. / क्रमांक")}, {text:':', alignment:'left'}, {text:`${specialNotice.noticeNumber || '-'}`, alignment:'left'}]
            ],
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 10],
        },
        {
          text: 'To,',
          bold: true,
          margin: [0, 0, 0, 8],
        },

        {
          text: writeMultiLanguageText(ownersText),
          bold: true,
          margin: [0, 0, 0, 10],
        },

        {
          text: [{ text: 'Subject : ', bold: true }, ...writeMultiLanguageText(serviceName)],
          margin: [0, 0, 0, 18],
        },

        {
          text: [
            { text: 'Reference : ', bold: true },
            'Application No ',
            { text: applicationNumber, bold: true },
            ' and Application Date ',
            {
              text: `${epochToDate(property.auditDetails.createdTime)}`,
              bold: true,
            }, //epochToDate(license.applicationDate)
          ],
          margin: [0, 0, 0, 20],
        },

        {
          text: 'Sir/Madam,',
          margin: [0, 0, 0, 2],
        },

        {
          text: `${serviceName} requested to ULB has been Rejected due to following reason :`,
          margin: [0, 0, 0, 10],
        },

        {
          text: writeMultiLanguageText(rejectionRemarks) || 'ERROR', //writeMultiLanguageText(license.approvalComments),
          margin: [0, 0, 0, 10],
        },

        {
          columns: [
            {
              width: 'auto',
              text: 'For further information visit ULB',
            },
          ],
          margin: [0, 30, 10, 2],
        },

        {
          table: {
            widths: ['*', 'auto'],
            body: [
              [
                '',
                {
                  text: writeMultiLanguageText('\n\n\n\n\nSigning Authority\nअधिक्षक,'),
                },
              ],
              ['', { text: writeMultiLanguageText(`${ulbName}`), bold: true }],
            ],
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 10],
        },
      ],
      styles: {
        title: {
          fontSize: 15,
          bold: true,
          lineHeight: 1.2,
        },
        subTitle: {
          fontSize: 14,
          bold: true,
        },
        subTitle2: {
          fontSize: 12,
        },
        contentTitle: {
          fontSize: 13,
          bold: true,
        },
        tableHeader: {
          bold: true,
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
      formData.append('file', blob, `PT_REJECTION_${applicationNumber || '0'}.pdf`);
      formData.append('tenantId', localStorage.getItem('tenantId'));
      formData.append('module', constants.PTIS_FILE_TAG);

      let { setLoadingStatus } = this.props;

      var errorFunction = function(err) {
        setLoadingStatus('hide');
        _this.props.errorCallback(err.message);
      };

      Api.commonApiPost('/filestore/v1/files', {}, formData).then(function(response) {
        if (response.files && response.files.length > 0) {
          response.files[0].fileStoreId;
          var noticeDocument = {
            tenantId: _this.getTenantId(),
            applicationNo: applicationNumber,
            noticeType: DOCUMENT_NAME,
            noticeDate: epochToDate(new Date().getTime()),
            fileStoreId: response.files[0].fileStoreId,
          };

          Api.commonApiPost(
            'pt-property/properties/notice/_create',
            {},
            {
              notice: noticeDocument,
            },
            false,
            true
          ).then(function(response) {
            _this.props.successCallback(_this.props.action, _this.props.status);
            //setLoadingStatus('hide');
          }, errorFunction);
        } else setLoadingStatus('hide');
      }, errorFunction);
    });
  };

  render() {
    return (
      <PdfViewer pdfData={this.state.pdfData} title="pt.rejectionnotice.title">
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

const ViewRejectionNotice = connect(mapStateToProps, mapDispatchToProps)(RejectionNotice);

export default ViewRejectionNotice;
