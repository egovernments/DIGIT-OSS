import React, { Component } from 'react';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Api from '../../../../../api/api';

var value = '';
var logo = '';
export default class assetImmovableReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      logo: '',
    };
  }

  componentDidMount() {
    var self = this;
    Api.commonApiPost('tenant/v1/tenant/_search', {
      code: localStorage.getItem('tenantId') ? localStorage.getItem('tenantId') : 'default',
    }).then(
      function(res) {
        self.setState({
          value: res.tenant[0].city.name,
          logo: res.tenant[0].logoId,
        });
        console.log(value);
      },
      function(err) {
        console.log(err);
      }
    );
  }

  convertToDate = time => {
    if (time) {
      let date = new Date(time);
      return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    }
  };

  numberWithCommas = x => {
    if (x) {
      x = x.toString();
      var y = x.split('.')[1];
      x = x.split('.')[0];
      var lastThree = x.substring(x.length - 3);
      var otherNumbers = x.substring(0, x.length - 3);
      if (otherNumbers != '') lastThree = ',' + lastThree;
      var resCal = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
      var res = y == null ? resCal : resCal + '.' + y;
      return res;
    }
  };

  render() {
    let { convertToDate, numberWithCommas } = this;
    return (
      <Card className="uiCard">
        <CardHeader title="" />
        <CardText>
          <Table responsive bordered condensed>
            <tbody>
              <tr>
                <td colSpan={2} rowSpan={3} style={{ textAlign: 'center' }}>
                  <img src={this.state.logo} height="60" width="60" />
                </td>
                <td colSpan={13} style={{ textAlign: 'center' }}>
                  <b>{this.state.value}</b>
                </td>
                <td colSpan={2} rowSpan={3} style={{ textAlign: 'center' }}>
                  <img src="./temp/images/AS.png" height="60" width="60" />
                </td>
              </tr>
              <tr>
                <td colSpan={13} style={{ textAlign: 'center' }}>
                  <b>नमुना क्रमांक १६</b>
                </td>
              </tr>
              <tr>
                <td colSpan={13} style={{ textAlign: 'center' }}>
                  <b>( नियम क्रमांक ६२ , १९१ पहा )</b>
                </td>
              </tr>
            </tbody>
            <tbody>
              <td colSpan={17} style={{ textAlign: 'center' }}>
                <b>स्थावर मालमत्तांची नोंदवही</b>
              </td>
            </tbody>

            <tbody>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>मत्तेचे नाव </b>
              </td>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>{this.props.data[32] ? this.props.data[32] : ''}</b>
              </td>
              <td colSpan={5} style={{ textAlign: 'left' }}>
                <b>संपादनाची पद्धत</b>
              </td>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>{this.props.data[11] ? this.props.data[11] : ''}</b>
              </td>
            </tbody>

            <tbody>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>मत्तेचा ओळखपत्र क्रमांक</b>
              </td>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>{this.props.data[33] ? this.props.data[33] : ''}</b>
              </td>
              <td colSpan={5} style={{ textAlign: 'left' }}>
                <b> निधीचे स्रोत</b>
              </td>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>{this.props.data[42] ? this.props.data[42] : ''}</b>
              </td>
            </tbody>

            <tbody>
              <tr>
                <td colSpan={4} rowSpan={2} style={{ textAlign: 'left' }}>
                  <b>
                    मालमत्ता ज्या अन्वये संपादित केली होती, <br /> खरेदी केली होती किंवा बांधली होती,<br />
                    त्या आदेशाचा क्रमांक व दिनांक
                  </b>
                </td>
                <td colSpan={4} rowSpan={2} style={{ textAlign: 'left' }}>
                  <b>{this.props.data[34] ? this.props.data[34] : ''},</b>&nbsp;&nbsp;
                  <b>{convertToDate(this.props.data[19] ? this.props.data[19] : '')}</b>
                </td>
                <td colSpan={5} style={{ textAlign: 'left' }}>
                  <b>अधिपत्र ( होय / नाही )</b>
                </td>
                <td colSpan={4} style={{ textAlign: 'left' }}>
                  <b>{this.props.data[35] ? 'Yes' : 'No'}</b>
                </td>
              </tr>
              <tr>
                <td colSpan={5} style={{ textAlign: 'left' }}>
                  <b>असल्यास , समाप्ती दिनांक</b>
                </td>
                <td colSpan={4} style={{ textAlign: 'left' }}>
                  <b>{convertToDate(this.props.data[12] ? this.props.data[12] : '')}</b>
                </td>
              </tr>
            </tbody>

            <tbody>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>स्थान</b>
              </td>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>{this.props.data[43] ? this.props.data[43] : ''}</b>
              </td>
              <td colSpan={5} style={{ textAlign: 'left' }}>
                <b>दोषी दायित्व</b>
              </td>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>{this.props.data[13] ? this.props.data[13] + 'Y,' : ''}&nbsp;&nbsp;</b>
                <b>{this.props.data[14] ? this.props.data[14] + 'M,' : ''}&nbsp;&nbsp;</b>
                <b>{this.props.data[15] ? this.props.data[15] + 'D' : ''}</b>
              </td>
            </tbody>

            <tbody>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>प्रगतिपथावरील बांधकाम नोंदवहीचा संदर्भ क्रमांक</b>
              </td>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>{this.props.data[36] ? this.props.data[36] : ''}</b>
              </td>
              <td colSpan={5} style={{ textAlign: 'left' }}>
                <b>राखून ठेवलेली प्रतिभूती ठेव</b>
              </td>
              <td colSpan={4} style={{ textAlign: 'right' }}>
                <b>{numberWithCommas(this.props.data[16] ? this.props.data[16] : '')}</b>
              </td>
            </tbody>

            <tbody>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>मजल्यांची संख्या :</b>
              </td>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>{this.props.data[37] ? this.props.data[37] : ''}</b>
              </td>
              <td colSpan={5} style={{ textAlign: 'left' }}>
                <b>वसूल केलेली प्रतिभूति ठेव</b>
              </td>
              <td colSpan={4} style={{ textAlign: 'right' }}>
                <b>{numberWithCommas(this.props.data[17] ? this.props.data[17] : '')}</b>
              </td>
            </tbody>

            <tbody>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>जोते क्षेत्र :</b>
              </td>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>{this.props.data[2] ? this.props.data[2] : ''}</b>
              </td>
              <td colSpan={5} style={{ textAlign: 'left' }}>
                <b>दिनांक</b>
              </td>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>{convertToDate(this.props.data[18] ? this.props.data[18] : '')}</b>
              </td>
            </tbody>

            <tbody>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b> घनफळ</b>
              </td>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>{this.props.data[3] ? this.props.data[3] : ''}</b>
              </td>
              <td colSpan={5} style={{ textAlign: 'left' }}>
                <b> रक्कम रु.</b>
              </td>
              <td colSpan={4} style={{ textAlign: 'right' }}>
                <b>{numberWithCommas(this.props.data[21] ? this.props.data[21] : '')}</b>
              </td>
            </tbody>

            <tbody>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b> ज्यावर बांधकाम केले आहे अशा जमिनीचा सर्वेक्षण क्रमांक</b>
              </td>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>{this.props.data[44] ? this.props.data[44] : ''}</b>
              </td>
              <td colSpan={9} style={{ textAlign: 'center' }}>
                <b>विक्री करणे</b>
              </td>
            </tbody>

            <tbody>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b> संरचनेचा आकार</b>
              </td>
              <td colSpan={4} style={{ textAlign: 'left' }}>
                <b>L-{this.props.data[5] ? this.props.data[5] : ''},&nbsp;&nbsp;</b>
                <b>W-{this.props.data[6] ? this.props.data[6] : ''},&nbsp;&nbsp;</b>
                <b>H-{this.props.data[7] ? this.props.data[7] : ''}</b>
              </td>
              <td colSpan={9} style={{ textAlign: 'left' }}>
                <b> ज्यास मत्ता विकण्यात आली त्या व्यक्तीचे नाव</b>
              </td>
            </tbody>

            <tbody>
              <tr>
                <td colSpan={4} style={{ textAlign: 'left' }}>
                  <b>बांधण्यात आलेल्या जमिनीचे क्षेत्र</b>
                </td>
                <td colSpan={4} style={{ textAlign: 'left' }}>
                  <b>{this.props.data[8] ? this.props.data[8] : ''}</b>
                </td>
                <td rowSpan={4} colSpan={9} style={{ textAlign: 'left' }}>
                  <b>{this.props.data[39] ? this.props.data[39] : ''}</b>
                </td>
              </tr>
              <tr>
                <td colSpan={4} style={{ textAlign: 'left' }}>
                  <b> उपलब्ध शीर्ष दस्तऐवज</b>
                </td>
                <td colSpan={4} style={{ textAlign: 'left' }}>
                  <b>{this.props.data[38] ? JSON.parse(this.props.data[38]).join(',') : ''}</b>
                </td>
              </tr>
              <tr>
                <td colSpan={4} style={{ textAlign: 'left' }}>
                  <b>कोणाकडून संपादित केली</b>
                </td>
                <td colSpan={4} style={{ textAlign: 'left' }}>
                  <b>{this.props.data[9] ? this.props.data[9] : ''}</b>
                </td>
              </tr>
              <tr>
                <td colSpan={4} style={{ textAlign: 'left' }}>
                  <b> मत्तेचे अपेक्षित आयुर्मान</b>
                </td>
                <td colSpan={4} style={{ textAlign: 'left' }}>
                  <b>{this.props.data[10] ? this.props.data[10] : ''}</b>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td rowSpan={3} style={{ textAlign: 'center' }}>
                  <b>
                    संपादन / बांधकाम /<br />
                    सुधारणा केल्याचा दिनांक
                  </b>
                </td>
                <td rowSpan={3} style={{ textAlign: 'center' }}>
                  <b>प्रारंभिक डब्ल्यू डी व्ही रु.</b>
                </td>
                <td rowSpan={3} style={{ textAlign: 'center' }}>
                  <b>संपादन / बांधकाम सुधारणाऱ्याचा खर्च</b>
                </td>
                <td rowSpan={3} style={{ textAlign: 'center' }}>
                  <b>प्रमाणक क्रमांक</b>
                </td>
                <td colSpan={4} style={{ textAlign: 'center' }}>
                  <b>वजाती</b>
                </td>
                <td rowSpan={2} colSpan={4} style={{ textAlign: 'center' }}>
                  <b>पुनर्मुल्यांकन</b>
                </td>
                <td rowSpan={2} colSpan={3} style={{ textAlign: 'center' }}>
                  <b>संचयित घसारा</b>
                </td>
                <td rowSpan={3} style={{ textAlign: 'center' }}>
                  <b>अंतिम डब्ल्यू डी व्ही रु.</b>
                </td>
                <td rowSpan={3} style={{ textAlign: 'center' }}>
                  <b>विभागप्रमुखाचा शेरा ,सही</b>
                </td>
              </tr>
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>
                  <b>( हस्तांतरण / विक्री करणे )</b>
                </td>
              </tr>
              <tr>
                <td style={{ textAlign: 'center' }}>
                  <b>दिनांक </b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>संख्या / क्रमांक </b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>रक्कम रु.</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>प्रमाणक क्रमांक</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>दिनांक</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>भर घालणे रु.</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>वजा करणे रु. </b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>एकूण </b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>प्रारंभिक शिल्लक </b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>चालू वर्षाचा घसारा </b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>अखेरची घसारा रक्कम</b>
                </td>
              </tr>
            </tbody>

            <tbody>
              <tr>
                <td style={{ textAlign: 'center' }}>
                  <b>1</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>2</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>3</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>4</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>5</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>6</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>7</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>8</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>9</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>10</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>11</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>12</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>13</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>14</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>15</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>16</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>17</b>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td style={{ textAlign: 'center' }}>
                  <b>{convertToDate(this.props.data[19] ? this.props.data[19] : '')}</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>{numberWithCommas(this.props.data[20] ? this.props.data[20] : '')}</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>{numberWithCommas(this.props.data[21] ? this.props.data[21] : '')}</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>N/A</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>{convertToDate(this.props.data[26] ? this.props.data[26] : '')}</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>{this.props.data[1] ? this.props.data[1] : ''}</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>{numberWithCommas(this.props.data[24] ? this.props.data[24] : '')}</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>{this.props.data[25] ? this.props.data[25] : ''}</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>{convertToDate(this.props.data[27] ? this.props.data[27] : '')}</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>{numberWithCommas(this.props.data[28] ? this.props.data[28] : '')}</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>{numberWithCommas(this.props.data[29] ? this.props.data[29] : '')}</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>{numberWithCommas(this.props.data[49] ? this.props.data[49] : '')}</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>{numberWithCommas(this.props.data[50] ? this.props.data[50] : '')}</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>{numberWithCommas(this.props.data[51] ? this.props.data[51] : '')}</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>{numberWithCommas(this.props.data[31] ? this.props.data[31] : '')}</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>{numberWithCommas(this.props.data[23] ? this.props.data[23] : '')}</b>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b />
                </td>
              </tr>
            </tbody>
          </Table>
        </CardText>
      </Card>
    );
  }
}
