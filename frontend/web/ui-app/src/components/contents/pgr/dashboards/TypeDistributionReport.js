import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import _ from 'lodash';
import { PieChart, Pie, Sector, Tooltip, Cell, Legend } from 'recharts';
import Api from '../.././../../api/api';
import { getTenantId, CustomizedLegend, RenderActiveShape, extractManipulateCityAndWardsPath } from './ReportUtils';
import GisMapView from './GisMapView';
import CommonGisReportView from './CommonGisReportView';

export default class TypeDistributionReport extends Component {
  constructor() {
    super();
    this.state = {
      isFetchingData: true,
      activeIndex: 0,
    };
  }

  componentDidMount() {
    let topTenComplaintData;
    Promise.all([Api.commonApiPost('pgr/dashboard/complainttype', { size: 10 }, { tenantId: getTenantId() })]).then(
      responses => {
        try {
          topTenComplaintData = responses[0].map(obj => {
            return {
              name: obj.ComplaintType,
              code: obj.code,
              value: obj.count,
            };
          });
        } catch (e) {
          console.log('error', e);
        } finally {
          this.setState({ isFetchingData: false, topTenComplaintData });
        }
      },
      err => {
        console.log('error', err);
        this.setState({ isFetchingData: false });
      }
    );
  }

  onPieClick = (data, idx) => {
    this.setState({ activeIndex: idx });
  };

  render() {
    const COLORS = ['#0088FE', '#00C49F', '#008F7D', '#FFBB28', '#FF8042', '#607D8B', '#9E9E9E', '#9C28B1', '#795547', '#673BB7'];

    const data = this.state.topTenComplaintData || [];
    let { isVisible, styles } = this.props;
    let TypeDistributionStyle = !isVisible ? { ...styles.fullHeightGrid, visibility: 'hidden' } : styles.fullHeightGrid;

    let params, totalComplaints;
    if (data && data.length > 0) {
      params = {
        type: 'wardwise',
        servicecode: data[this.state.activeIndex].code,
      };
      totalComplaints = data[this.state.activeIndex].value;
    }

    return (
      <Grid fluid={true} style={TypeDistributionStyle}>
        {params && <CommonGisReportView totalComplaints={totalComplaints} params={params} color={COLORS[this.state.activeIndex]} />}
        <div className="map-pie-chart">
          <PieChart width={300} height={480}>
            <Pie
              nameKey="name"
              dataKey="value"
              valueKey="value"
              data={data}
              cx={150}
              cy={100}
              activeIndex={this.state.activeIndex}
              activeShape={<RenderActiveShape />}
              onClick={this.onPieClick}
              outerRadius={80}
              fill="#8884d8"
            >
              {data && data.map((slice, index) => <Cell style={{ cursor: 'pointer' }} key={slice} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Legend
              height={280}
              content={<CustomizedLegend external={data} activeIndex={this.state.activeIndex} onClickActivePie={this.onPieClick} />}
            />
          </PieChart>
        </div>
      </Grid>
    );
  }
}
