import React from 'react';
import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';
import TableChart from './TableChart';
import _ from 'lodash';
import getChartOptions from '../../actions/getChartOptions';
import ChartsAPI from '../../actions/charts/chartsAPI'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import APITransport from '../../actions/apitransport/apitransport';
import DonutChart from './DonutChart';
import HorizontalBarChart from './HorizontalBarChart'
import { getTenantId } from '../../utils/commons';

class ChartType extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: null, unit: this.props.GFilterData['Denomination'] }
    }

    componentDidMount() {
        this.callAPI();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            unit: this.props.GFilterData['Denomination']
        })
    }

    callAPI() {
        let code = this.props.chartData[0]['id'] || "";

        let filters = this.props.filters
        if(this.props.page && this.props.page.includes('ulb')) {
            if(!filters['tenantId']) {
              let tenentFilter = []
              tenentFilter.push(`${getTenantId()}`)
              filters['tenantId'] = tenentFilter
            }
          }

        let requestBody = getChartOptions(code, filters || {});
        let chartsAPI = new ChartsAPI(2000, 'dashboard', code, requestBody && requestBody.dataoption ? requestBody.dataoption : '');
        this.props.APITransport(chartsAPI);
    }
    render() {
        let chartKey = _.chain(this.props).get('chartData').first().get('id').value();
        let chartType = _.chain(this.props).get('chartData').first().get('chartType').toUpper().value();
        let data = _.chain(this.props).get('chartsGData').get(chartKey).get('data').value();
        if (data) {
            switch (chartType) {
                case 'PIE':
                    return <PieChart chartData={data}
                        label={this.props.label}
                        unit={this.state.unit}
                        GFilterData={this.props.GFilterData}
                        dimensions={this.props.dimensions}
                        section={this.props.section}
                    />
                case 'DONUT':
                    return <DonutChart chartData={data}
                        label={this.props.label}
                        unit={this.state.unit}
                        GFilterData={this.props.GFilterData}
                        dimensions={this.props.dimensions}
                        section={this.props.section}
                    />
                case 'LINE':
                    return <LineChart chartData={data}
                        label={this.props.label}
                        unit={this.state.unit}
                        GFilterData={this.props.GFilterData}
                        dimensions={this.props.dimensions}
                        section={this.props.section}
                    />
                case 'BAR':
                    return <BarChart chartData={data}
                        label={this.props.label}
                        unit={this.state.unit}
                        GFilterData={this.props.GFilterData}
                        dimensions={this.props.dimensions}
                        section={this.props.section}
                    />
                case 'HORIZONTALBAR':
                    return <HorizontalBarChart chartData={data}
                        label={this.props.label}
                        unit={this.state.unit}
                        GFilterData={this.props.GFilterData}
                        dimensions={this.props.dimensions}
                        section={this.props.section}
                    />
                case 'TABLE':
                    return <TableChart chartData={data}
                        chartKey={chartKey}
                        chartParent={this.props.chartData}
                        unit={this.state.unit}
                        GFilterData={this.props.GFilterData}
                        filters={this.props.filters}
                        dimensions={this.props.dimensions}
                        section={this.props.section}
                        label={this.props.label}
                        page={this.props.page}
                    />
                default:
                    return false;
            }
        }
        return <div > Loading... </div>
    }
}
const mapStateToProps = (state) => {
    return {
        dashboardConfigData: state.firstReducer.dashboardConfigData,
        GFilterData: state.GFilterData,
        chartsGData: state.chartsData
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        APITransport: APITransport,
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChartType);