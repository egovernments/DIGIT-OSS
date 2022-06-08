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
        _this.generatePdf(response[0].image, response[1].image, cityName);
      })
      .catch(function(err) {
        _this.props.setLoadingStatus('hide');
        // _this.props.errorCallback(err.message);
      });
  };

  getTenantId = () => {
    return localStorage.getItem('tenantId') || 'default';
  };

  generatePdf = (ulbLogo, stateLogo, ulbName) => {
    let { grievance } = this.props;

    let obj = grievance[0].attribValues.find(o => o.key === 'systemApprovalComments');

    var _this = this;

    //assigning fonts
    pdfMake.fonts = fonts;

    //document defintion
    var docDefinition = {
      pageSize: 'A4',
      pageMargins: [50, 30, 50, 30],
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
              text: [{ text: `${ulbName}\n`, style: 'title' }, { text: `${translate('pgr.title.rejectionLetter')}`, style: 'subTitle' }],
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
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                '',
                { text: writeMultiLanguageText('Date / दिनांक') },
                { text: ':', alignment: 'left' },
                { text: `${epochToDate(new Date().getTime())}`, alignment: 'left' },
              ],
            ],
          },
          layout: 'noBorders',
          margin: [0, 10, 0, 10],
        },

        {
          text: 'To,',
          bold: true,
          margin: [0, 0, 0, 2],
        },

        {
          text: writeMultiLanguageText(`${grievance[0].firstName}`),
          bold: true,
          margin: [0, 0, 0, 10],
        },

        {
          text: `Subject : Ticket No. ${grievance[0].serviceRequestId}`,
          margin: [15, 0, 0, 2],
        },

        {
          text: `Dear Citizen,`,
          margin: [15, 10, 0, 2],
        },

        {
          text: writeMultiLanguageText(
            `Your Ticket No: ${grievance[0].serviceRequestId} dated ${grievance[0].requestedDatetime.split(' ')[0]} for ${
              grievance[0].serviceName
            } is rejected due to following reasons.`
          ),
          margin: [40, 5, 0, 2],
        },

        {
          text: writeMultiLanguageText(`1. ${obj.name}`),
          margin: [55, 5, 0, 2],
        },

        {
          text: 'For further information visit ULB',
          margin: [0, 20, 0, 2],
        },

        {
          columns: [
            {
              width: '*',
              alignment: 'right',
              text: `\n\nSincerely,`,
              bold: true,
            },
          ],
          margin: [0, 0, 10, 2],
        },

        {
          columns: [
            {
              width: '*',
              alignment: 'right',
              text: `\n\n\n${ulbName}`,
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

    let { setLoadingStatus } = this.props;

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    pdfDocGenerator.getDataUrl(dataUrl => {
      this.setState({
        pdfData: dataUrl,
      });
      setLoadingStatus('hide');
    });
  };

  render() {
    return (
      <PdfViewer pdfData={this.state.pdfData} title={translate('pgr.title.rejectionLetter')}>
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

export default connect(mapStateToProps, mapDispatchToProps)(RejectionLetter);
