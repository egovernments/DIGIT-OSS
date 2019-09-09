import React, { Component } from 'react';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';

export default class PropertyTaxCertificate extends Component {
  render() {
    return (
      <div>
        <Card>
          <CardHeader title="Certificate" />
          <CardText>
            <Table responsive style={{ fontSize: 'bold', marginBottom: '20px' }} striped bordered condensed>
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
                      <b>Extract of Property</b> / मालमत्तेचा उतारा
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>
                    <div style={{ whiteSpace: 'pre' }}>
                      <b>Ward:</b> <b>Zone:</b> <b>Revenue Circle</b>:
                      <br />
                      <b>Apartment Name:</b>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>
                    <div>
                      <b>Property No:</b>
                      <br />
                      <b>Property Usage / Sub Usage:</b>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>
                    <div style={{ whiteSpace: 'pre' }}>
                      <b>Property Owner Name</b>
                      <br />
                      <b>& Address: </b> <b>Age of Property</b>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>
                    <div>
                      <b>Billing Name</b>
                      <br />
                      <b>& Address:</b>
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
            <Table responsive style={{ fontSize: 'bold' }} striped bordered condensed>
              <tbody>
                <tr>
                  <th>Unit No.</th>
                  <th>Floor</th>
                  <th>Owner</th>
                  <th>Usage</th>
                  <th>Occupancy</th>
                  <th>ALV</th>
                  <th>RV</th>
                  <th>Total Tax</th>
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
              </tbody>
            </Table>
          </CardText>
        </Card>
      </div>
    );
  }
}
