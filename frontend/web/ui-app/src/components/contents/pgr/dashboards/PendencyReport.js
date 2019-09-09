import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Card, CardHeader } from 'material-ui/Card';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { translate } from '../../../common/common';
import { PageLoadingIndicator, CustomizedAxisTick, CustomizedYAxisLabel, getTenantId } from './ReportUtils';
import Api from '../../../../api/api';

export default class PendencyReport extends Component {
  constructor() {
    super();
    this.state = {
      isFetchingData: true,
    };
  }

  componentDidMount() {
    const mappingKeys = [
      { interval1: '< 2 days' },
      { interval2: '2 - 5 days' },
      { interval3: '5 - 10 days' },
      { interval4: '10 - 30 days' },
      { interval5: '> 30 days' },
    ];

    let ageWiseData;

    Promise.all([Api.commonApiPost('pgr/dashboard/ageing', { range: '2,5,10,30' }, { tenantId: getTenantId() })]).then(
      responses => {
        try {
          let responseData = responses[0][0];
          ageWiseData = mappingKeys.map(keyObj => {
            let key = Object.keys(keyObj)[0];
            let name = keyObj[key];
            let noOfComplaints = parseInt(responseData[key]) || 0;
            return { name, noOfComplaints };
          });
        } catch (e) {
          console.log('error', e);
        } finally {
          this.setState({ isFetchingData: false, ageWiseData });
        }
      },
      err => {
        console.log('error', err);
        this.setState({ isFetchingData: false });
      }
    );
  }

  render() {
    let styles = this.props.styles;

    const data = this.state.ageWiseData || [];

    return (
      <div>
        {this.state.isFetchingData && <PageLoadingIndicator />}
        <Grid fluid={true}>
          <Row>
            <Col md={12} lg={12} sm={12} xs={12}>
              <br />
              <Card style={styles.cardStyle}>
                <CardHeader title={translate('pgr.dashboar.chart.agewise')} />
                <ResponsiveContainer width="100%" aspect={4.0 / 1.0}>
                  <BarChart data={data} margin={{ top: 5, right: 30, left: 15, bottom: 15 }}>
                    <XAxis tick={<CustomizedAxisTick />} dataKey="name" />
                    <YAxis name="Number of complaints" label={<CustomizedYAxisLabel title="Number of complaints" />} />
                    <Tooltip cursor={{ fillOpacity: 0 }} />
                    <Bar name="Number of complaints" dataKey="noOfComplaints" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
