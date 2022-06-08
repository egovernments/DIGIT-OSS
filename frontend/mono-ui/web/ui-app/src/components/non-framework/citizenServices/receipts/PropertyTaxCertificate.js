import React, { Component } from 'react';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';

export default class WaterCertificate extends Component {
  render() {
    let { getVal } = this.props;
    return (
      <div>
        <Card>
          <CardHeader title="Certificate" />
          <CardText>
            <Table responsive style={{ fontSize: 'bold' }} striped bordered condensed>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'left' }}>
                    <img src="./temp/images/headerLogo.png" height="30" width="30" />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <b>Roha Municipal Council</b>
                    <br />
                    Property Tax Department / करनिर्धारण विभाग
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <img src="./temp/images/AS.png" height="30" width="30" />
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>
                    <div style={{ textAlign: 'center' }}>
                      <b>No Due Certificate</b> / थकबाकी नसल्याचे प्रमाणपत्र<br />
                      (मुवंई प्रांतिक महानगरपालिका अधिनियम 1949 चे अनुसूचीतील प्रकरण 8 अधिनियम 44, 45 व 46 अन्वये )
                    </div>
                    <br />
                    <div style={{ textAlign: 'right' }}>
                      <b>Date</b> / दिनांक :____________ <br />
                      <b>Certificate No.</b> / प्रमाणपत्र क्रं : ____________
                    </div>
                    <br />
                    <div style={{ textAlign: 'left' }}>
                      प्रती,<br />
                      {getVal('Receipt[0].Bill[0].payeeName')}
                      <br />
                      {getVal('Receipt[0].Bill[0].payeeAddress')}
                    </div>
                    <br />
                    <div style={{ textAlign: 'center' }}>
                      <b>Subject</b> /विषय : सन 2018 थकबाकी नसल्याचे प्रमाणपत्र मिळणेबाबत.<br />
                      <b>Reference</b> / संदर्भ : आपला अर्ज क्रमांक APPLICATION_NO दिनांक DATE
                    </div>
                    <br />
                    <div style={{ textAlign: 'left' }}>महोद्य / महोद्या ,</div>
                    <br />
                    <div style={{ textAlign: 'left' }}>
                      संदर्भिय विषयांन्वये प्रमाणित करण्यात येते की, मालमत्ता क्रमांक PROPERTYNO, OWNER यांच्या नावे नोंद असून, सन FINANCIAL_YEAR
                      पर्यंतचा संपुर्ण मालमत्ता कराची रक्कम भरलेली असून, कोणतीही थकबाकी येणे नाही.
                    </div>
                    <br />
                    <div style={{ textAlign: 'right' }}>
                      कर अधिक्षक,<br />
                      <b>ULB Name</b>
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </CardText>
        </Card>
      </div>
    );
  }
}
