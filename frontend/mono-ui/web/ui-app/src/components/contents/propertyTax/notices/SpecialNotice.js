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

const DOCUMENT_NAME = 'CREATE_SPECIALNOTICE';

class SpecialNoticeCertificate extends Component {
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

  generatePdf = (ulbLogo, stateLogo, certificateConfigDetails, ulbName) => {
    let { specialNotice, getNameByCode, floors, getNameById, locality, usages, structureclasses, taxHeads } = this.props;
    let ownersText = [specialNotice.owners.map(owner => owner.name)].join(', ');
    let propertyAddress = '-';
    let floorTableBody = [];
    let taxDetailsTableBody = [];

    if (specialNotice.address) {
      propertyAddress = specialNotice.address.addressNumber ? specialNotice.address.addressNumber + ', ' : '';
      propertyAddress += specialNotice.address.addressLine1 ? getNameById(locality, specialNotice.address.addressLine1) + ', ' : '';
      propertyAddress += specialNotice.address.addressLine2 ? specialNotice.address.addressLine2 + ', ' : '';
      propertyAddress += specialNotice.address.landmark ? specialNotice.address.landmark + ', ' : '';
      propertyAddress += specialNotice.address.city ? specialNotice.address.city + '.' : '';
    }

    if (specialNotice.floors) {
      specialNotice.floors.map((item, index) => {
        let varFloor = floors.find(floor => floor.code == item.floorNo) || 'Empty';

        floorTableBody[floorTableBody.length] = [
          varFloor.name || '',
          item.unitDetails || '',
          getNameByCode(usages, item.usage) || '',
          getNameByCode(structureclasses, item.construction) || '',
          item.assessableArea || '',
          item.alv || '',
          item.rv || '',
        ];
      });
    }

    if (specialNotice.taxDetails.headWiseTaxes) {
      specialNotice.taxDetails.headWiseTaxes.map((item, index) => {
        let tax = taxHeads.find(taxHead => taxHead.code === item.taxName) || {};
        taxDetailsTableBody[taxDetailsTableBody.length] = [tax.name || 'NA', { text: item.taxValue, alignment: 'right' }];
      });
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
              text: [
                { text: `${ulbName}\n`, style: 'title' },
                ...writeMultiLanguageText('Property Tax Department / करनिर्धारण विभाग', { fontSize: 13 }),
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
          text: writeMultiLanguageText('Special Notice'),
          alignment: 'center',
          style: 'contentTitle',
          margin: [0, 0, 0, 10],
        },

        {
          text: writeMultiLanguageText('(मुवंई प्रांतिक महानगरपालिका अधिनियम 1949 चे अनुसूचीतील प्रकरण 8 अधिनियम 44, 45 व 46 अन्वये)'),
          alignment: 'center',
          margin: [0, 0, 0, 10],
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
                { text: writeMultiLanguageText('Notice No. / नोटीस क्रं') },
                { text: ':', alignment: 'left' },
                {
                  text: `${specialNotice.noticeNumber || '-'}`,
                  alignment: 'left',
                },
              ],
            ],
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 10],
        },
        {
          text: writeMultiLanguageText('प्रती,'),
          margin: [0, 0, 0, 5],
        },

        {
          text: writeMultiLanguageText(`${ownersText}\n${propertyAddress}`),
          margin: [0, 0, 0, 10],
        },

        {
          text: writeMultiLanguageText(
            `Subject / विषय :  Special Notice – New Assessment\nReference / संदर्भ : आपला अर्ज क्रमांक ${specialNotice.applicationNo ||
              'ERROR'} दिनांक ${epochToDate(specialNotice.applicationDate) || 'ERROR'}`
          ),
          margin: [0, 0, 0, 10],
          alignment: 'center',
        },

        {
          text: writeMultiLanguageText('महोद्य / महोद्या ,'),
          margin: [0, 0, 0, 5],
        },

        {
          text: [' ', ' ', ' '],
        },

        {
          text: writeMultiLanguageText(
            `संदर्भिय विषयांन्वये कळविण्यात येते की, आपल्या मालमत्तेची नवीन / सुधारीत कर आकारणी करण्यात आलेली आहे.  मालमत्ता क्रमांक ${specialNotice.upicNo ||
              'ERROR'} - ${ownersText || 'ERROR'} यांच्या नावे नोंद असून, मालमत्ता कर आकारणीचा तपशील खालीलप्रमाणे आहे.`
          ),
          margin: [0, 0, 0, 10],
        },

        {
          style: 'tableExample',
          margin: [0, 0, 0, 10],
          table: {
            widths: ['*', '*', '*', '*', '*', '*', '*'],
            body: [
              //header
              [
                { text: 'Floor', style: 'tableHeader', alignment: 'left' },
                {
                  text: 'Unit Details',
                  style: 'tableHeader',
                  alignment: 'left',
                },
                { text: 'Usage', style: 'tableHeader', alignment: 'left' },
                {
                  text: 'Construction',
                  style: 'tableHeader',
                  alignment: 'left',
                },
                {
                  text: 'Assessable Area',
                  style: 'tableHeader',
                  alignment: 'left',
                },
                { text: 'ALV', style: 'tableHeader', alignment: 'left' },
                { text: 'RV', style: 'tableHeader', alignment: 'left' },
              ],

              ...floorTableBody,
            ],
          },
        },

        {
          text: 'Tax Details',
          margin: [0, 0, 0, 5],
        },

        {
          style: 'tableExample',
          margin: [0, 0, 0, 10],
          table: {
            widths: ['auto', 'auto'],
            body: [
              //header
              [
                {
                  text: 'Tax Description',
                  style: 'tableHeader',
                  alignment: 'left',
                },
                { text: 'Amount', style: 'tableHeader', alignment: 'left' },
              ],

              ...taxDetailsTableBody,
            ],
          },
        },

        {
          text: writeMultiLanguageText(
            'सदर आकारणी जर तुम्हाला मान्य नसेल तर ही नोटीस मिळाल्या पासून 1 महिन्याचे मुदतीचे आत मुख्यधिकारी यांचकडे फेर तपासणी करता अर्ज करावा. जर 1 महिन्याचे आत सदरहून आकारणी विरुध्द तक्रार अर्ज प्राप्त झाला नाही तर वर नमुद केल्या प्रमाणे आकारणी कायम करण्यात येईल, याची नोंद घ्यावी.'
          ),
        },

        {
          table: {
            widths: ['*', 'auto'],
            body: [['', { text: writeMultiLanguageText('\nकर अधिक्षक,') }], ['', { text: writeMultiLanguageText(`${ulbName}`), bold: true }]],
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
      formData.append('file', blob, `PT_SPCNOT_${specialNotice.noticeNumber || '0'}.pdf`);
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
            upicNumber: specialNotice.upicNo,
            tenantId: _this.getTenantId(),
            applicationNo: specialNotice.applicationNo,
            noticeNumber: specialNotice.noticeNumber,
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
      <PdfViewer pdfData={this.state.pdfData} title="pt.specialnotice.title">
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

const ViewSpecialNoticeCertificate = connect(mapStateToProps, mapDispatchToProps)(SpecialNoticeCertificate);

export default ViewSpecialNoticeCertificate;
