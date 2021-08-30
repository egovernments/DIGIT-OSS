import React, { Component } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import styles from '../../../../../styles/material-ui';
import Api from '../../../../../api/api';
import { translate, dataURItoBlob, epochToDate } from '../../../../common/common';
import { fonts, getBase64FromImageUrl } from '../../../../common/pdf-generation/PdfConfig';
import PdfViewer from '../../../../common/pdf-generation/PdfViewer';
import RaisedButton from 'material-ui/RaisedButton';

export default class VakalatnamaTemplate extends Component {
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
        this.generatePdf(response[0].image, response[1].image, cityName);
      })
      .catch(function(err) {});
  };

  getTenantId = () => {
    return localStorage.getItem('tenantId') || 'default';
  };

  getAdvocateNames = array => {
    return array.map(function(obj) {
      if (obj['advocate']) {
        return obj['advocate'].name;
      } else {
        return;
      }
    });
  };

  generatePdf = (ulbLogo, stateLogo, ulbName) => {
    let { data } = this.props;
    let { getAdvocateNames } = this;
    //assigning fonts
    pdfMake.fonts = fonts;

    var addres = data.summon.courtName.address.addressLine1 ? data.summon.courtName.address.addressLine1 + ', ' : '';
    addres += data.summon.courtName.address.city ? data.summon.courtName.address.city + ', ' : '';
    addres += data.summon.courtName.address.addressLine2 ? data.summon.courtName.address.addressLine2 : '';

    // console.log(data.witness);
    //console.log(data);

    var d = new Date(data.vakalatnamaGenerationDate);
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var dayNames = [
      'First',
      'Second',
      'Third',
      'Fourth',
      'Fifth',
      'Sixth',
      'Seventh',
      'Eighth',
      'Nineth',
      'Tenth',
      'Eleventh',
      'Twelth',
      'Thirteenth',
      'Fourteenth',
      'Fifteenth',
      'Sixteenth',
      'Seventeenth',
      'Eighteenth',
      'Nineteenth',
      'Twentyth',
      'Twentyfirst',
      'Twentysecond',
      'Twentythird',
      'Twentyfourth',
      'Twentyfifth',
      'Twentysixth',
      'Twentyseventh',
      'Twentyeighth',
      'Twentyninth',
      'Thirtyth',
      'Thirtyfirst',
    ];
    var day = dayNames[d.getDate() - 1];
    var month = monthNames[d.getMonth()];
    var year = d.getFullYear();

    var vit = data.witness;

    var witnessObj = { ul: [] };
    for (var i = 0; i < vit.length; i++) {
      witnessObj.ul.push(vit[i]);
      // witnessObj.ul = vit[i].split(',');
    }

    // var fonts = {
    //   Roboto: {
    //           normal: 'Roboto-Regular.ttf',
    //           bold: 'Roboto-Medium.ttf',
    //           italics: 'Roboto-Italic.ttf',
    //           bolditalics: 'Roboto-MediumItalic.ttf'
    //   }
    // };
    //document defintion
    var docDefinition = {
      pageSize: 'A4',
      pageMargins: [30, 10, 10, 30],
      header: [],
      content: [
        { text: 'Exhibit No. ______________________', margin: [10, 20, 10, 0] , alignment: 'right'},
        {
          text: 'VAKALATNAMA',
          alignment: 'center',
          margin: [10, 10, 10, 10],
        },
        {
          columns: [
            {
              width: 100,
              columns: [
                [
                  {
                    canvas: [
                      {
                        type: 'rect',
                        x: 5,
                        y: 0,
                        w: 70,
                        h: 140,
                        lineWidth: 1,
                        lineColor: '#000000',
                      },
                    ],
                    margin: [10, 0, 10, 10],
                  },
                  {
                    canvas: [
                      {
                        type: 'rect',
                        x: 5,
                        y: 0,
                        w: 70,
                        h: 140,
                        lineWidth: 1,
                        lineColor: '#000000',
                      },
                    ],
                    margin: [10, 10, 10, 10],
                  },
                ],
              ],
            },
            [
              {
                text: [
                  { text: 'IN THE COURT OF ' },
                  {
                    text: data.summon.courtName.name ? data.summon.courtName.name : '           .',
                    alignment: 'left',
                    decoration: 'underline',
                  },
                  { text: '    AT   ', alignment: 'left' },
                  { text: addres, alignment: 'left', decoration: 'underline' },
                  { text: ' No. ', alignment: 'left' },
                  {
                    text: data.summon.caseNo + '.',
                    alignment: 'left',
                    decoration: 'underline',
                  },
                  { text: ' OF ', alignment: 'left' },
                ],
                margin: [20, 0, 0, 5],
              },
              {
                text: data.summon.plantiffName ? data.summon.plantiffName : '           .',
                alignment: 'left',
                decoration: 'underline',
                margin: [20, 0, 0, 0],
              },
              { text: ' Versus ', margin: [20, 10, 10, 10] },
              {
                text: data.summon.defendant ? data.summon.defendant : '           .',
                decoration: 'underline',
                margin: [20, 0, 0, 0],
              },
              {
                text: [
                  { text: 'I /We, the undersigned ' },
                  {
                    text: data.coName ? data.coName : '',
                    alignment: 'left',
                    decoration: 'underline',
                  },
                  { text: ' the ', alignment: 'left' },
                  {
                    text: data.summon.courtName.name ? data.summon.courtName.name : '           .',
                    alignment: 'left',
                    decoration: 'underline',
                  },
                  {
                    text: ' above mentioned hereby appoint & authorize ',
                    alignment: 'left',
                  },
                ],
                margin: [20, 20, 0, 0],
              },
              {
                text: [
                  {
                    text: data.advocateDetails && data.advocateDetails.length ? `${getAdvocateNames(data.advocateDetails)}` : '           .',
                    alignment: 'left',
                    decoration: 'underline',
                  },
                  { text: ', ' },
                ],
                margin: [20, 5, 0, 0],
              },
              {
                text: addres,
                alignment: 'left',
                decoration: 'underline',
                margin: [20, 5, 0, 0],
              },
              {
                text: ' to appear and plead for me /us as my/ our Advocate/s in the matter.',
                alignment: 'left',
                margin: [20, 5, 0, 0],
              },
              {
                text: [
                  { text: 'In witness whereof, I/We have signed below this ' },
                  { text: day, alignment: 'left' },
                  { text: ' Day of ', alignment: 'left' },
                  { text: month, alignment: 'left' },
                  { text: ', ' },
                  { text: year, alignment: 'left' },
                ],
                margin: [20, 20, 5, 20],
              },
              {
                text: [{ text: 'Witness  ' }],
                margin: [20, 0, 0, 10],
              },
              {
                ul: witnessObj.ul,
                margin: [20, 5, 5, 60],
              },
              {
                text: [
                  { text: 'Accepted and Filed on  ', alignment: 'left' },
                  {
                    text: `${epochToDate(data.vakalatnamaGenerationDate)}`,
                    alignment: 'left',
                    decoration: 'underline',
                  },
                ],
                margin: [20, 5, 5, 25],
              },
              {
                text: [{ text: 'Signature of Advocate/s  ', alignment: 'left' }],
                margin: [20, 5, 5, 5],
              },
            ],
          ],
        },
      ],
      defaultStyle: {
        fontSize: 11,
        bold: false,
      },
      styles: {
        //   boldTd: {
        //     bold: true
        // }
      },
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    pdfDocGenerator.getDataUrl(dataUrl => {
      this.setState({
        pdfData: dataUrl,
      });

      let formData = new FormData();
      var blob = dataURItoBlob(dataUrl);
      formData.append('file', blob, `LEGAL_${data.code}+_VAKALATNAMA.pdf`);
      formData.append('tenantId', localStorage.getItem('tenantId'));
      formData.append('module', 'LEGAL');

      Api.commonApiPost('/filestore/v1/files', {}, formData).then(function(response) {
        var noticeObj = {};
        noticeObj['caseNo'] = data.summon.caseNo;
        noticeObj['caseCode'] = data.code;
        noticeObj['caseRefernceNo'] = data.caseRefernceNo;
        noticeObj['summonReferenceNo'] = data.summon.summonReferenceNo;
        noticeObj['courtName'] = data.summon.courtName.name;
        noticeObj['courtAddress'] = addres;
        noticeObj['applicant'] = data.summon.plantiffName;
        noticeObj['defendant'] = data.summon.defendant;
        noticeObj['advocateName'] = data.advocateDetails[0].advocate.name;
        noticeObj['day'] = `${epochToDate(data.vakalatnamaGenerationDate)}`;
        noticeObj['witness'] = data.witness;
        noticeObj['tenantId'] = localStorage.getItem('tenantId');
        noticeObj['noticeType'] = 'CREATE_VAKALATNAMA';
        noticeObj['fileStoreId'] = response.files[0].fileStoreId;
        Api.commonApiPost('lcms-services/legalcase/notice/_create', {}, { notice: noticeObj }, false, true).then(function(response) {});
      });
    });
  };

  render() {
    return (
      <PdfViewer pdfData={this.state.pdfData}>
        <div className="text-center">
          <RaisedButton style={styles.marginStyle} href={this.state.pdfData} download label={translate('tl.download')} download primary={true} />
        </div>
      </PdfViewer>
    );
  }
}
