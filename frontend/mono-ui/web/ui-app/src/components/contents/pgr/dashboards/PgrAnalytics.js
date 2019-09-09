import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Snackbar from 'material-ui/Snackbar';
import Api from '../../../../api/api';
import { Tabs, Tab } from 'material-ui/Tabs';
import ActionFlightTakeoff from 'material-ui/svg-icons/action/flight-takeoff';
import { translate } from '../../../common/common';
import { BarChart, AreaChart, Area, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import PendencyReport from './PendencyReport';
import Top5ComplaintTypes from './Top5ComplaintTypes';
import GisAnalysisReport from './GisAnalysisReport';

const styles = {
  pendencyChart: {
    height: 300,
    padding: '10px 10px 5px 10px',
    marginTop: 10,
  },
  singleChart: {
    height: 400,
    padding: '10px 10px 5px 10px',
    marginTop: 10,
  },
  fullHeightGrid: {
    position: 'fixed',
    height: 'calc(100% - 102px)',
    width: '100%',
    padding: 0,
  },
  cardStyle: {
    height: '100%',
  },
};

const CustomizedAxisTick = props => {
  const { x, y, stroke, payload } = props;
  return (
    <text x={x} y={y + 15} textAnchor="middle" fill="#666">
      {payload.value}
    </text>
  );
};

const CustomizedYAxisLabel = props => {
  const { viewBox, title } = props;
  return (
    <g transform={`translate(${viewBox.x},${viewBox.y})`}>
      <text x={-(viewBox.height / 2)} y={viewBox.y + 13} textAnchor="middle" fill="#666" transform="rotate(-90)">
        {title}
      </text>
    </g>
  );
};

export default class PgrAnalytics extends Component {
  constructor() {
    super();
    this.state = {
      isTypeReportVisible: false,
    };
  }

  render() {
    return (
      <Tabs onChange={() => this.setState({ isTypeReportVisible: false })}>
        <Tab label={translate('pgr.dashboard.pendency')}>
          <PendencyReport styles={styles} />
        </Tab>
        {/* <Tab label={translate('pgr.dashboard.type.distribution')} onActive={()=>{
          this.setState({isTypeReportVisible:true});
        }}>
          <TypeDistributionReport styles={styles} isVisible={this.state.isTypeReportVisible}></TypeDistributionReport>
        </Tab> */}
        <Tab label={translate('pgr.dashboard.top5.complaint.types')}>
          <Top5ComplaintTypes styles={styles} />
        </Tab>
        <Tab label={translate('pgr.dashboard.gisanalysis')}>
          <GisAnalysisReport />
        </Tab>
      </Tabs>
    );
  }
}
