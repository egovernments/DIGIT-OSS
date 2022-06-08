import React, { Component } from 'react';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';

export default class WaterReceipt extends Component {
  render() {
    let { getVal } = this.props;

    return (
      <div>
        <Card id="receipt">
          <CardHeader title="Receipt" />
          <CardText>
            <Table responsive style={{ fontSize: 'bold' }} id="ReceiptForWcAPartOne" striped bordered condensed>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'left' }}>
                    <img src="./temp/images/headerLogo.png" height="30" width="30" />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <b>Roha Municipal Council</b>
                    <br />
                    Department
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <img src="./temp/images/AS.png" height="30" width="30" />
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'left' }}>Receipt Number</td>
                  <td style={{ textAlign: 'center' }}>Receipt For</td>
                  <td style={{ textAlign: 'right' }}>Receipt Date</td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ textAlign: 'left' }}>
                    Connection No : ______________<br />
                    Consumer Owner Name : _________________<br />
                    Amount : ______________<br />
                    Consumer Address :_________________________________<br />
                    Received From : _________________<br />
                  </td>
                </tr>
              </tbody>
            </Table>

            <Table id="ReceiptForWcAPartTwo" responsive striped bordered condensed>
              <tbody>
                <tr>
                  <td rowSpan={2}>Bill Reference No.& Date</td>
                  <td rowSpan={2}>Details</td>
                  <td colSpan={2}>Demand</td>
                  <td colSpan={2}>Payment Received</td>
                  <td colSpan={2}>Balance</td>
                </tr>
                <tr>
                  <td>Arrears</td>
                  <td>Current</td>
                  <td>Arrears</td>
                  <td>Current</td>
                  <td>Arrears</td>
                  <td>Current</td>
                </tr>
                <tr>
                  <td>12134566 12-12-2011</td>
                  <td>Water No dues</td>
                  <td>10</td>
                  <td>19</td>
                  <td>20</td>
                  <td>32</td>
                  <td>20</td>
                  <td>22</td>
                </tr>
                <tr>
                  <td>12134566 12-12-2011</td>
                  <td>Water No dues</td>
                  <td>10</td>
                  <td>19</td>
                  <td>20</td>
                  <td>32</td>
                  <td>20</td>
                  <td>22</td>
                </tr>
                <tr>
                  <td colSpan={4}>Amount in words :</td>
                  <td colSpan={4}>Total Outstanding after collection</td>
                </tr>
                <tr>
                  <td colSpan={8}>Payment Mode</td>
                </tr>
                <tr>
                  <td>Mode</td>
                  <td>Amount</td>
                  <td colSpan={2}>Cheque / DD No.</td>
                  <td colSpan={2}>Cheque / DD Date.</td>
                  <td colSpan={4}>Bank Name</td>
                </tr>
                <tr>
                  <td>Cheque</td>
                  <td>4100</td>
                  <td colSpan={2}>12123232322</td>
                  <td colSpan={2}>12-12-2017</td>
                  <td colSpan={2}>HDFC</td>
                </tr>
              </tbody>
            </Table>
          </CardText>
        </Card>
      </div>
    );
  }
}
