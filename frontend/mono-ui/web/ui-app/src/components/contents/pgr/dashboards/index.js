import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import Api from '../../../../api/api';
import RaisedButton from 'material-ui/RaisedButton';
import styles from '../../../../styles/material-ui';
import { translate } from '../../../common/common';
import moment from 'moment';
var self;

const style = {
  positioned: {
    transition: 'all 0.75s ease-in-out',
    right: 23,
    margin: 12,
  },
  absolutePosition: {
    position: 'absolute',
    top: 80,
  },
  fixedPosition: {
    position: 'fixed',
    zIndex: 1,
    top: 10,
  },
  chartContainerStyle: {
    width: '100%',
    height: 230,
  },
};

const COLORS = ['#0088FE', '#00C49F', '#008F7D', '#FFBB28', '#FF8042'];

const CustomizedAxisTick = props => {
  const { x, y, stroke, payload } = props;
  return (
    <text style={{ fontSize: 12 }} x={x} y={y + 15} textAnchor="middle" fill="#666">
      {payload.value}
    </text>
  );
};

const renderActiveShape = props => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, percent, ComplaintType, value } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#333">{`${ComplaintType} : ${value} (${(
        percent * 100
      ).toFixed(2)}%)`}</text>
    </g>
  );
};

class charts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }

  componentDidMount() {
    self = this;

    window.addEventListener(
      'scroll',
      function(event) {
        if (this.scrollY >= 65) {
          // console.log('make it fixed');
          self.setState({ buttonFixed: true });
        } else {
          // console.log('make it absolute');
          self.setState({ buttonFixed: false });
        }
      },
      false
    );

    let { setLoadingStatus, toggleDailogAndSetText } = this.props;
    setLoadingStatus('loading');

    //get last 7 days
    let last7days = [],
      last7months = [];
    let dateFrom = moment()
      .subtract(7, 'd')
      .format('YYYY-MM-DD');
    for (let i = 1; i <= 7; i++) {
      let obj = {};
      obj['REGISTERED'] = 0;
      obj['RESOLVED'] = 0;
      obj['name'] = `${moment(dateFrom)
        .add(i, 'days')
        .format('dddd')
        .toUpperCase()}-${moment(dateFrom)
        .add(i, 'days')
        .format('DD')}`;
      last7days.push(obj);
    }

    //get last months
    let monthFrom = moment()
      .subtract(7, 'month')
      .format('YYYY-MM-DD');
    for (let i = 1; i <= 7; i++) {
      let obj = {};
      obj['REGISTERED'] = 0;
      obj['name'] = `${moment(monthFrom)
        .add(i, 'months')
        .format('MMM')
        .toUpperCase()}-${moment(monthFrom)
        .add(i, 'months')
        .format('YYYY')}`;
      last7months.push(obj);
    }

    Promise.all([
      Api.commonApiPost('/pgr/dashboard', {}), //last 7 months
      Api.commonApiPost('/pgr/dashboard', { type: 'weekly' }), //last 7 days
      Api.commonApiPost('/pgr/dashboard/complainttype', { size: 5 }), //top complainttype
    ])
      .then(response => {
        try {
          response[0].map(data => {
            let values = Object.values(data);
            let index = last7months
              .map(function(o) {
                return o.name;
              })
              .indexOf(values[2]);
            last7months[index]['REGISTERED'] = values[0];
            last7months[index]['RESOLVED'] = values[1];
            return last7months;
          });

          let weeklyReportResponse = response[1];

          last7days = last7days.map(day => {
            let resolvedObj = weeklyReportResponse.find(d => day.name === d.name && d.RESOLVED > 0);
            let registeredObj = weeklyReportResponse.find(d => day.name === d.name && d.REGISTERED > 0);
            let RESOLVED = (resolvedObj && resolvedObj.RESOLVED) || 0;
            let REGISTERED = (registeredObj && registeredObj.REGISTERED) || 0;
            console.log(day.name, { name: day.name, RESOLVED, REGISTERED });
            return { name: day.name, RESOLVED, REGISTERED };
          });

          self.setState({
            last7months: last7months,
            last7days: last7days,
            topComplaintType: response[2],
          });

          setLoadingStatus('hide');
        } catch (e) {
          setLoadingStatus('hide');
        }
      })
      .catch(reason => {
        setLoadingStatus('hide');
        toggleDailogAndSetText(true, 'Error');
      });
  }

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  trimDayName = data => {
    return data.map(day => {
      let name = day.name.split('-');
      let modifiedObj = { ...day, name: name[0].substr(0, 3) + '-' + name[1] };
      return modifiedObj;
    });
  };

  render() {
    let { buttonFixed } = this.state;
    let last7Days = this.trimDayName(this.state.last7days || []);

    return (
      <Grid fluid={true}>
        <RaisedButton
          label={translate('pgr.dashboard.analytics')}
          primary={true}
          onClick={e => {
            this.props.setRoute('/pgr/analytics');
          }}
          style={Object.assign(style.positioned, buttonFixed ? style.fixedPosition : style.absolutePosition)}
        />
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card style={styles.cardMargin}>
              <CardHeader title={translate('pgr.dashboard.7daystitle')} />
              <ResponsiveContainer width="100%" aspect={4.0 / 2.0}>
                <AreaChart margin={{ top: 10, right: 30, left: 30, bottom: 0 }} data={last7Days} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis tick={<CustomizedAxisTick />} dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Area type="monotone" dataKey="REGISTERED" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="RESOLVED" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
              <br />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card style={styles.cardMargin}>
              <CardHeader title={translate('pgr.dashboard.7monthstitle')} />7
              <ResponsiveContainer width="100%" aspect={4.0 / 2.0}>
                <LineChart margin={{ top: 10, right: 30, left: 5, bottom: 0 }} data={this.state.last7months}>
                  <XAxis tick={<CustomizedAxisTick />} dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="REGISTERED" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
              <br />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card style={styles.cardMargin}>
              <CardHeader style={styles.cardHeaderPadding} title={translate('pgr.dashboard.complaintshare')} />
              <CardText>
                <ResponsiveContainer width="100%" aspect={4.0 / 1.0}>
                  <PieChart margin={{ bottom: 30 }}>
                    <Pie
                      dataKey="count"
                      activeIndex={this.state.activeIndex}
                      data={this.state.topComplaintType}
                      activeShape={renderActiveShape}
                      onMouseEnter={this.onPieEnter}
                      fill="#8884d8"
                    >
                      {this.state.topComplaintType &&
                        this.state.topComplaintType.map((data, index) => <Cell key={data} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardText>
            </Card>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  toggleDailogAndSetText: (dailogState, msg) => {
    dispatch({ type: 'TOGGLE_DAILOG_AND_SET_TEXT', dailogState, msg });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
});

export default connect(mapStateToProps, mapDispatchToProps)(charts);
