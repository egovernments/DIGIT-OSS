import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import Api from '../.././../../api/api';
import { getTenantId, PageLoadingIndicator, extractManipulateCityAndWardsPath } from './ReportUtils';
import CommonGisReportView from './CommonGisReportView';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { translate } from '../../../common/common';

const TOP_COMPLAINTS_REPORT_LENGTH = 6;

export default class GisAnalysisReport extends Component {
  constructor() {
    super();
    this.state = {
      isFetchingData: true,
    };
  }

  componentDidMount() {
    Promise.all([
      Api.commonApiPost('pgr/dashboard/complainttype', { size: TOP_COMPLAINTS_REPORT_LENGTH }, { tenantId: getTenantId() }),
      Api.commonApiGet('egov-location/boundarys/getshapefile', { tenantId: getTenantId() }, {}),
      Api.commonApiPost('tenant/v1/tenant/_search', { code: getTenantId() }, { tenantId: getTenantId() }),
    ]).then(
      responses => {
        try {
          this.setState({
            isFetchingData: false,
            topThreeComplaints: responses[0],
            kml: responses[1],
            cityDetails: responses[2],
          });
        } catch (e) {
          console.log('error', e);
        }
      },
      err => {
        console.log('error', err);
        this.setState({ isFetchingData: false });
      }
    );
  }

  render() {
    const kml = this.state.kml;
    if (!kml) return <PageLoadingIndicator />;

    const TOP3_COLORS = ['#3F51B5', '#009688', '#607D8B', '#aa00ff', '#1976d2', '#5d4037'];

    const city = this.state.cityDetails && this.state.cityDetails.tenant[0].city;
    const cityLatLng = city && { lat: city.latitude, lng: city.longitude };

    let top3Complaints =
      this.state.topThreeComplaints &&
      this.state.topThreeComplaints.map((complaintTypeObj, idx) => {
        let params = { type: 'wardwise', servicecode: complaintTypeObj.code };
        return (
          <Col key={idx} sm={4} md={4} lg={4} xs={12}>
            <Card style={{ marginBottom: 15 }}>
              <CardHeader title={`Top ${idx + 1} - ${complaintTypeObj.ComplaintType}`} />
              <div style={{ width: '100%', height: 400 }}>
                <CommonGisReportView
                  kml={kml}
                  cityLatLng={cityLatLng}
                  totalComplaints={complaintTypeObj.count}
                  params={params}
                  color={TOP3_COLORS[idx]}
                />
              </div>
            </Card>
          </Col>
        );
      });

    return (
      <Grid fluid={true}>
        <br />

        <Row>
          <Col sm={6} md={6} lg={6} xs={12}>
            <Card>
              <CardHeader title={translate('pgr.dashboard.gis.registered.title')} />
              <div style={{ width: '100%', height: 400 }}>
                <CommonGisReportView kml={kml} cityLatLng={cityLatLng} params={{ type: 'wardwiseregistered' }} color={'#F44336'} />
              </div>
            </Card>
          </Col>
          <Col sm={6} md={6} lg={6} xs={12}>
            <Card>
              <CardHeader title={translate('pgr.dashboard.gis.redressed.title')} />
              <div style={{ width: '100%', height: 400 }}>
                <CommonGisReportView kml={kml} cityLatLng={cityLatLng} params={{ type: 'wardwiseresolved' }} color={'#4CAF50'} />
              </div>
            </Card>
          </Col>
        </Row>

        <br />
        <Row>{top3Complaints}</Row>
      </Grid>
    );
  }
}
