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

const DOCUMENT_NAME = 'CREATE_ACKNOWLEDGEMENT';

class NewPropertyAcknowledgement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfData: undefined,
    };
  }

  componentDidMount() {
    //window.scrollTo(0,0);
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

  getCurrentUserName = () => {
    let userObj = JSON.parse(localStorage.getItem('userRequest') || '{}');
    return userObj.name || '';
  };

  generatePdf = (ulbLogo, stateLogo, certificateConfigDetails, ulbName) => {
    let { property, localities } = this.props;
    let ownerText = property.owners[0].name; //first owner text
    let applicationNumber = property.propertyDetail.applicationNo;
    let applicationDate = epochToDate(new Date().getTime());

    let localityObj = property.address.addressLine1 ? localities.find(locality => locality.id == property.address.addressLine1) : '';
    let propertyAddress = '';

    if (property.address) {
      propertyAddress = property.address.addressNumber ? property.address.addressNumber + ', ' : '';
      propertyAddress += localityObj ? localityObj.name + ', ' : '';
      propertyAddress += property.address.addressLine2 ? property.address.addressLine2 + ', ' : '';
      propertyAddress += property.address.landmark ? property.address.landmark + ', ' : '';
      propertyAddress += property.address.city ? property.address.city : '';
    }

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
              text: [{ text: `${ulbName}`, style: 'title' }],
              margin: [0, 25, 0, 0],
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
          text: writeMultiLanguageText('New Assessment Application Acknowledgement'),
          alignment: 'center',
          style: 'contentTitle',
          margin: [0, 0, 0, 20],
        },

        {
          table: {
            widths: ['auto', '*', 'auto', 'auto'],
            body: [
              [
                { text: 'Application No : ', bold: true },
                { text: applicationNumber, alignment: 'left' },
                { text: `Application Date :`, alignment: 'left', bold: true },
                { text: applicationDate, alignment: 'left' },
              ],
              // ['', {text : writeMultiLanguageText("No. / क्रमांक")}, {text:':', alignment:'left'}, {text:`${specialNotice.noticeNumber || '-'}`, alignment:'left'}]
            ],
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 30],
        },

        {
          text: [
            'Property Tax assessment of Sri / Smt. ',
            { text: ownerText, bold: true },
            ' (First owner name) with address ',
            { text: propertyAddress, bold: true },
            ` is received on ${applicationDate}.\n\n\n\n`,
            'The connected property tax special notice can be obtained on ',
            '_________________________',
            ' duly producing this receipt.',
          ],
        },

        {
          table: {
            widths: ['*', 'auto'],
            body: [
              [
                '',
                {
                  text: writeMultiLanguageText('\n\n\n\nSignature'),
                  bold: true,
                  alignment: 'center',
                },
              ],
              [
                '',
                {
                  text: writeMultiLanguageText(this.getCurrentUserName()),
                  bold: true,
                  alignment: 'center',
                },
              ],
              [
                '',
                {
                  text: writeMultiLanguageText(`${ulbName}`),
                  bold: true,
                  alignment: 'center',
                },
              ],
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
            setLoadingStatus('hide');
          }, errorFunction);
        } else setLoadingStatus('hide');
      }, errorFunction);
    });
  };

  render() {
    let { viewLicense } = this.props;
    console.log(viewLicense);
    return (
      <PdfViewer pdfData={this.state.pdfData} title="pt.newAck.title">
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

const ViewNewPropertyAcknowledgement = connect(mapStateToProps, mapDispatchToProps)(NewPropertyAcknowledgement);

export default ViewNewPropertyAcknowledgement;
