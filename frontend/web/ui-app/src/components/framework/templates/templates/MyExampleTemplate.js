import React, { Component } from 'react';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';

export default class MyExampleTemplate extends Component {
  render() {
    return (
      <Card className="uiCard">
        <CardHeader title="Certificate" />
        <CardText>
          <Table responsive style={{ fontSize: 'bold' }} bordered condensed>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left' }}>
                  <img src="./temp/images/headerLogo.png" height="60" width="60" />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <b>Roha Municipal Council</b>
                  <br /> Water Department
                </td>
                <td style={{ textAlign: 'right' }}>
                  <img src="./temp/images/AS.png" height="60" width="60" />
                </td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>Receipt Number : 123</td>
                <td style={{ textAlign: 'center' }}>Receipt For : Application Fee</td>
                <td style={{ textAlign: 'right' }}>Receipt Date: 12/02/2017</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ textAlign: 'left' }}>
                  Service Request Number: 21212<br /> Applicant Name: John Doe<br /> Amount : Rs. 20<br />
                </td>
              </tr>
            </tbody>
          </Table>

          <Table responsive bordered condensed>
            <tbody>
              <tr>
                <td colSpan={2}>Bill Reference No.& Date</td>
                <td colSpan={8}>Details</td>
              </tr>
              <tr>
                <td colSpan={2}>123 - 22/11/2017</td>
                <td colSpan={8}>Application for New Water Connection</td>
              </tr>

              <tr>
                <td colSpan={10}>Amount in words: Rs. Twenty only</td>
              </tr>
              <tr>
                <td colSpan={10}>Payment Mode</td>
              </tr>
              <tr>
                <td>Mode</td>
                <td>Amount</td>
                <td>Transaction No</td>
                <td>Transaction Date</td>
                {true && <td colSpan={6}>Bank Name</td>}
              </tr>
              <tr>
                <td>Online</td>
                <td>300</td>

                <td> 24 </td>
                <td>Text</td>

                <td colSpan={6}>Somebank</td>
              </tr>
            </tbody>
          </Table>
        </CardText>
      </Card>
    );
  }
}
