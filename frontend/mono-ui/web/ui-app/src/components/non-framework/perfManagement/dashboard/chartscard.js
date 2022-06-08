import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Sector, Cell } from 'recharts';
import { Card, CardText, CardMedia, CardHeader, CardTitle } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {
  parseCompareSearchResponse,
  parseCompareSearchConsolidatedResponse,
  parseTenantName
} from '../apis/apis';
import {
  formatChartData,
  formatConsolidatedChartData,
} from '../apis/helpers';
import { translate } from '../../../common/common';


export default class BarChartCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataKey: null,
      showChartView: true,
      chartDataIndex: 1,
      maxChartData: 0,
    };
    this.kpis = this.props.kpis;
  }

  componentDidMount() {
    if (this.props.isReportConsolidated) {
      formatConsolidatedChartData(parseCompareSearchConsolidatedResponse(this.props.data), (data, dataKey) => {
        if (!data || !dataKey) {
        } else {
          this.setState({
            data: data,
            dataKey: dataKey,
          });
        }
      });
    } else {
      formatChartData(parseCompareSearchResponse(this.props.data), (data, dataKey) => {
        if (!data || !dataKey) {
        } else {
          this.setState({
            data: data,
            dataKey: dataKey,
            chartDataIndex: 1,
            maxChartData: data.length,
          });
        }
      });
    }
  }

  processOnClickKPIDataRepresentation = () => {
    this.props.toggleDataViewFormat('chartview');
  };

  processOnClickNextKPIData = () => {
    if (this.state.chartDataIndex < this.state.maxChartData) {
      this.setState({
        chartDataIndex: this.state.chartDataIndex + 1
      })
    } else {
      this.setState({
        chartDataIndex: this.state.maxChartData
      })
    }
  }

  processOnClickPreviousKPIData = () => {
    if (this.state.chartDataIndex > 1) {
      this.setState({
        chartDataIndex: this.state.chartDataIndex - 1
      })
    } else {
      this.setState({
        chartDataIndex: 1
      })
    }
  }

  getULBName = (code) => {
    let ulbName = parseTenantName(this.props.ulbs, code);
    if (ulbName.length == 0) {
      return code
    }
    return ulbName[0]['name']
  }

  getObjectiveValue(value) {
    switch (value) {
      case 1:
        return 'YES';
      case 2:
        return 'NO';
      case 3:
        return 'IN PROGRESS';
    
      default:
        return 'NO';
    }
  }

  getModifiedChartData = (data) => {
    if (this.props.kpiType === 'OBJECTIVE') {
      if (this.props.isReportConsolidated) {
        return data.map((item, index) => {
          return {
            ...item,
            ulbName: this.getULBName(item.ulbName),
            target: this.getObjectiveValue(item.target),
            value: this.getObjectiveValue(item.value)
          }
        })
      }
      return data.map((item, index) => {
        return {
          ...item,
          ulbName: this.getULBName(item.ulbName),
          target: this.getObjectiveValue(item.target),
          monthlyValue: this.getObjectiveValue(item.monthlyValue)
        }
      })
    }
    return data.map((item, index) => {
      return {
        ...item,
        ulbName: this.getULBName(item.ulbName)
      }
    })
  }

  getChartData = () => {
    if (this.state.data.length === 0) {
      return []
    }

    if (this.props.isReportConsolidated) {
      return this.state.data;
    }
    return this.state.data[this.state.chartDataIndex - 1].data;
  }

  getReportTitle = () => {
    if (this.props.isReportConsolidated) {
      return `${translate('perfManagement.dashboard.chart.consolidated.msg1')} ${this.props.kpis} ${translate('perfManagement.dashboard.chart.consolidated.msg2')}`
    }
    let data = this.state.data[this.state.chartDataIndex - 1]
    let ulbName = this.getULBName(data['ulbName']); 
    
    return `${translate('perfManagement.dashboard.chart.monthly.msg1')} ${this.props.kpis} ${translate('perfManagement.dashboard.chart.monthly.msg2')} ${ulbName} ${translate('perfManagement.dashboard.chart.monthly.msg3')} ${data.finYear}`
  }

  render() {
    return <div>{this.renderKPIData()}</div>;
  }

  /**
   * render
   * toggle between chart & table format
   */
  renderKPIData = () => {
    if (this.state.showChartView) {
      return this.renderReportChart();
    }
  };

  /**
   * render
   * render footnote for consolidated data
   */
  renderConsolidatedFootnote = () => {
    if (!this.props.isReportConsolidated) {
      return (
        <div />
      )
    }
    return (
      <CardText>
        <span style={{ color: '#FF0000' }}> *</span> {translate('perfManagement.dashboard.chart.monthly.msg4')}
      </CardText>
    )
  }

  /**
   * render
   * render insufficient data to draw the chart
   */
  renderInsufficientDataForChart = () => {
    return (
        <div style={{ textAlign: 'center' }}>
          <br />
          <br />
          <Card className="uiCard">
          <CardHeader title={<div style={{ fontSize: '16px' }}> {translate('perfManagement.dashboard.query.user.error.insufficientdata')} </div>} />
          </Card>
        </div>
    );
  }

  /**
   * render
   * presents chart
   */
  renderReportChart = () => {
    if (this.getChartData().length < 1) {
      return (
        this.renderInsufficientDataForChart()
      )
    }
    
    return (
      <div>
        <br />
        <br />
        <Card className="uiCard" style={{ textAlign: 'center' }}>
          <CardHeader style={{ paddingBottom: 0 }} title={<div style={{ fontSize: 16, marginBottom: '25px' }}> {this.getReportTitle()} </div>} />
          {this.renderReportNavigationButton(translate('perfManagement.dashboard.chart.type.table'))}
          {this.renderChartType()}
          {this.renderConsolidatedFootnote()}
        </Card>
      </div>
    );
  };

  /**
   * render
   * render next/prev button to navigate when report is not consolidated
   */
  renderReportNavigationButton = (label) => {
    if (this.props.isReportConsolidated || this.state.maxChartData === 1) {
      return (
        <RaisedButton
          style={{ marginLeft: '90%' }}
          label={label}
          primary={true}
          type="button"
          disabled={false}
          onClick={this.processOnClickKPIDataRepresentation}
        />
      )
    }

    return (
      <div>
        <RaisedButton
          label={translate('perfManagement.dashboard.common.prev')}
          primary={true}
          type="button"
          disabled={this.state.chartDataIndex === 1 ? true : false}
          onClick={this.processOnClickPreviousKPIData}
        />

        <RaisedButton
          style={{ marginLeft: '10px' }}
          label={translate('perfManagement.dashboard.common.next')}
          primary={true}
          type="button"
          disabled={this.state.chartDataIndex === this.state.maxChartData ? true : false}
          onClick={this.processOnClickNextKPIData}
        />

        <br />
        <RaisedButton
          style={{ marginLeft: '90%' }}
          label={label}
          primary={true}
          type="button"
          disabled={false}
          onClick={this.processOnClickKPIDataRepresentation}
        />
      </div>
    )
  }

  /**
   * render
   * render BarChart or PieChart base upon the KPITypes selected
   */
  renderChartType = () => {
    if (this.props.isReportConsolidated) {
      if (this.props.kpiType === 'VALUE') {
        return this.renderConsolidatedBarChart();
      }
      return this.renderConsolidatedPieChart();
    } else {
      if (this.props.kpiType === 'VALUE') {
        return this.renderBarChart();
      }
      return this.renderPieChart();
    }
  };

  /**
   * render
   * renders BarChart for VALUE type KPI
   */
  renderBarChart = () => {
    let data = this.getModifiedChartData(this.getChartData())

    return (
      <div style={{ marginLeft: '5%', marginTop: '10px' }}>
        <BarChart width={1200} height={500} data={data} margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
          <XAxis dataKey="name"/>
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />

          <Bar name={translate('perfManagement.dashboard.chart.targetValue')}  dataKey="target" fill="#0088FE" />
          <Bar name={translate('perfManagement.dashboard.chart.actualValue')} dataKey="monthlyValue" fill="#00C49F" />
        </BarChart>
      </div>
    );
  };

  /**
   * render
   * renders PieChart for OBJECTIVE type KPI
   */
  renderPieChart = () => {
    
    let cdata    = this.getModifiedChartData(this.getChartData())

    let data = [
      {
        name: translate('perfManagement.dashboard.chart.pie.yes'),
        value: cdata.filter(el => el.monthlyValue === 'YES').length,
      },
      {
        name: translate('perfManagement.dashboard.chart.pie.no'),
        value: cdata.filter(el => el.monthlyValue === 'NO').length,
      },
      {
        name: translate('perfManagement.dashboard.chart.pie.inprogress'),
        value: cdata.filter(el => el.monthlyValue === 'IN PROGRESS').length,
      },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
      <div style={{ marginLeft: '35%', marginTop: '10px' }}>
        <PieChart width={600} height={500} data={data} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
          <Pie dataKey={'value'} isAnimationActive={true} data={data} cx={200} cy={200} outerRadius={220} fill="#8884d8" labelLine={false}>
            {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    );
  };

  /**
   * render
   * renders BarChart for VALUE type KPI
   */
  renderConsolidatedBarChart = () => {
    let data = this.getModifiedChartData(this.getChartData())

    return (
      <div>
        <BarChart padding={'50%'} width={600} height={500} data={data} margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
          <XAxis dataKey={this.state.dataKey} />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar name={translate('perfManagement.dashboard.chart.targetValue')} dataKey="target" fill="#0088FE" />
          <Bar name={translate('perfManagement.dashboard.chart.actualValue')} dataKey="value" fill="#00C49F" />
        </BarChart>
      </div>
    );
  };

  /**
   * render
   * renders PieChart for OBJECTIVE type KPI
   */
  renderConsolidatedPieChart = () => {
    let cdata    = this.getModifiedChartData(this.getChartData())
    let data = [
      {
        name: translate('perfManagement.dashboard.chart.pie.yes'),
        value: cdata.filter(el => el.value === 'YES').length,
      },
      {
        name: translate('perfManagement.dashboard.chart.pie.no'),
        value: cdata.filter(el => el.value === 'NO').length,
      },
      {
        name: translate('perfManagement.dashboard.chart.pie.inprogress'),
        value: cdata.filter(el => el.value === 'IN PROGRESS').length,
      },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
      <div style={{ marginLeft: '35%' }}>
        <PieChart width={600} height={500} data={this.state.data} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
          <Pie dataKey={'value'} isAnimationActive={true} data={data} cx={200} cy={200} outerRadius={220} fill="#8884d8" labelLine={false}>
            {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    );
  };
}
