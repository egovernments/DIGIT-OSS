import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Card, CardHeader } from 'material-ui/Card';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { translate } from '../../../common/common';
import { PageLoadingIndicator, CustomizedAxisTick, CustomizedLineChartLegend, CustomizedYAxisLabel, CustomTooltip, getTenantId } from './ReportUtils';
import Api from '../../../../api/api';
import _ from 'lodash';
import moment from 'moment';

const TOP5_REPORT_MONTH_LIMIT = 6; //Last month count including current month

export default class Top5ComplaintTypes extends Component {
  constructor() {
    super();
    this.state = {
      isFetchingData: true,
    };
  }

  getLastMonthNumbers = lastMonthLimit => {
    var lastMonthsNo = [];
    for (let i = 1; i <= lastMonthLimit; i++) {
      lastMonthsNo.push(
        parseInt(
          moment()
            .add(i - lastMonthLimit, 'months')
            .format('MM')
        )
      );
    }
    return lastMonthsNo;
  };

  componentDidMount() {
    let topFiveComplaintsData;
    let legends;
    Promise.all([Api.commonApiPost('pgr/dashboard/complainttype/topfive', {}, { tenantId: getTenantId() })]).then(
      responses => {
        try {
          let monthWiseData = _.groupBy(responses[0].data, 'month');
          legends = responses[0].legends;

          let lastMonths = this.getLastMonthNumbers(TOP5_REPORT_MONTH_LIMIT);

          topFiveComplaintsData = lastMonths.map(month => {
            let dataArry = legends.map(legend => {
              let complaintTypeObj = monthWiseData[month] && monthWiseData[month].find(cType => cType.ComplaintType === legend.complaintTypeName);
              return {
                name: legend.complaintTypeName,
                count: (complaintTypeObj && complaintTypeObj.count) || 0,
              };
            });

            return { name: month, data: dataArry || [] };
          });
        } catch (e) {
          console.log('error', e);
        } finally {
          this.setState({
            isFetchingData: false,
            topFiveComplaintsData,
            legends,
          });
        }
      },
      err => {
        console.log('error', err);
        this.setState({ isFetchingData: false });
      }
    );
  }

  render() {
    if (this.state.isFetchingData) {
      return <PageLoadingIndicator />;
    }

    const data = this.state.topFiveComplaintsData || [];
    const legends = this.state.legends || [];

    const COLORS = ['#64B5F6', '#BA68C8', '#99CC00', '#FFBB33', '#EF6C00'];

    return (
      <div>
        <Grid fluid={true}>
          <br />
          <Card>
            <CardHeader title={translate('pgr.dashboard.top5.complaint.types')} />
            <ResponsiveContainer width="100%" aspect={4.0 / 1.0}>
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis tick={<CustomizedAxisTick isMonthNumber={true} />} dataKey="name" />
                <YAxis name="Number of complaints" label={<CustomizedYAxisLabel posY={-20} title="Number of complaints" />} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  content={<CustomizedLineChartLegend colors={COLORS} legends={legends} legendNameKey="complaintTypeName" />}
                  layout="horizontal"
                  verticalAlign="top"
                  align="left"
                />
                <Line connectNulls={true} type="monotone" name="data[0].name" dataKey="data[0].count" stroke={COLORS[0]} fill={COLORS[0]} />
                <Line connectNulls={true} type="monotone" name="data[1].name" dataKey="data[1].count" stroke={COLORS[1]} fill={COLORS[1]} />
                <Line connectNulls={true} type="monotone" name="data[2].name" dataKey="data[2].count" stroke={COLORS[2]} fill={COLORS[2]} />
                <Line connectNulls={true} type="monotone" name="data[3].name" dataKey="data[3].count" stroke={COLORS[3]} fill={COLORS[3]} />
                <Line connectNulls={true} type="monotone" name="data[4].name" dataKey="data[4].count" stroke={COLORS[4]} fill={COLORS[4]} />
              </LineChart>
            </ResponsiveContainer>
            <br />
          </Card>
        </Grid>
      </div>
    );
  }
}
