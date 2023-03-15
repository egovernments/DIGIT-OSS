import React from 'react';
import NFormatter from '../common/numberFormater';
import getChartOptions from '../../actions/getChartOptions';
import ChartsAPI from '../../actions/charts/chartsAPI';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import APITransport from '../../actions/apitransport/apitransport';
import { withStyles } from '@material-ui/core/styles';
import style from './styles';
import Arrow_Downward from '../../images/arrows/Arrow_Downward.svg'
import Arrow_Upward from '../../images/arrows/Arrow_Upward.svg'
import moment from 'moment';
import { getTenantId, removeSignFromInsightData } from '../../utils/commons';
import { isMobile } from 'react-device-detect';

class CollectionChartRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = { data: null }
	}

	componentDidMount() {
		this.callAPI();
	}

	callAPI() {
		let code = this.props.chartData['id'] ? this.props.chartData['id'] : "";
		if (code) {
			let filters = _.cloneDeep(this.props.filters)
			if(code == 'todaysCollection'  || code == 'wstodaysCollection'){			   
	           filters['duration'] = {
	            title: "TODAY",
                startDate: (moment().startOf('day').unix()) * 1000,
                endDate: (moment().endOf('day').unix()) * 1000,
                interval: 'day'
	          }
	        }else{
	        	filters = this.props.filters
	        }

			if (this.props.page.includes('ulb')) {
				if (!filters['tenantId']) {
					let tenentFilter = []
					tenentFilter.push(`${getTenantId()}`)

					filters['tenantId'] = tenentFilter
				}
			}			
			let requestBody = getChartOptions(code, filters);
			let chartsAPI = new ChartsAPI(2000, 'dashboard', code, requestBody.dataoption);
			this.props.APITransport(chartsAPI);
		}
	}


	render() {
		const { classes } = this.props;
		let codekey = _.chain(this.props).get('chartData').get("id").value();
		let data = _.chain(this.props).get("chartsGData").get(codekey).get("data").map((d, i) => {
			return {
				"label": d.headerName,
				"valueSymbol": d.headerSymbol,
				"value": d.headerValue,
				"plots": d.plots,
				"insight_data": d.insight ? d.insight : ''
			}
		}).first().value() || null;

		if (data) {
			let insightColor = data.insight_data ? data.insight_data.colorCode === "lower_red" ? "#e54d42" : "#259b24" : '';
			let insightIcon = data.insight_data ? data.insight_data.colorCode === "lower_red" ? Arrow_Downward : Arrow_Upward : '';
			let value = "";
			if(data.insight_data.value){
				if(data.insight_data.value.includes("last year")){
					value = data.insight_data.value.replace("last year" , "LY");
				}else if(data.insight_data.value.includes("last month")){
					value = data.insight_data.value.replace("last month" , "LM");
				}
				value=removeSignFromInsightData(value);
			}
			
			return (
				<div style={{ width: "100%",height: "32px", fontSize: "20px", fontWeight: "500" }}>
					{/* <span className={classes.values}>
						
						<NFormatter value={data.value} nType={data.valueSymbol} />
						{data.insight_data &&
							<React.Fragment>
								<span style={{ marginLeft: "6vh" }}>
									<img src={insightIcon} style={{ height: "16px", color: insightColor }} />
								</span>
								<span style={{ color: insightColor, fontSize: '14px', marginLeft: "1vh" }}>{`${data.insight_data.value}`}</span>
							</React.Fragment>
						}
					</span> */}
					<div style={{ textAlign: "right",whiteSpace: "nowrap" }}>
						<div>
							<span><NFormatter value={data.value} nType={data.valueSymbol} /></span>
							{/* <NFormatter value={data.value} nType={data.valueSymbol} /> */}
						</div>
						{data.insight_data &&
						<div style={{ marginTop:"-8px",whiteSpace:"nowrap"                     ,  position: isMobile?'absolute':"unset",right: '10px'}}>
							<React.Fragment>
								<span style={{ marginLeft: "2vh",fontSize:'initial',paddingRight: "8px" }}>
									<img src={insightIcon} style={{ height: "12px", color: insightColor }} />
								</span>
								<span style={{ color: insightColor, fontSize: '14px'  }}>{value}</span>
							</React.Fragment>
						</div>
						}
					</div>
				</div>
			);
		}
		return <div></div>
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
		APITransport: APITransport
	}, dispatch)
}
export default withStyles(style)(connect(mapStateToProps, mapDispatchToProps)(CollectionChartRow));
