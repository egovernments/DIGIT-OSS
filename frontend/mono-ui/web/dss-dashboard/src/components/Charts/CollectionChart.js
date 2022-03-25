import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import APITransport from '../../actions/apitransport/apitransport';
import CollectionChartRow from './CollectionChartRow';
import { Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import style from './styles';
import { Typography, Tooltip } from '@material-ui/core';

class CollectionChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = { data: null, filters: null }
	}

	render() {
		let { strings, classes, page } = this.props;
		let data = this.props.chartData.map((d, i) => {
			return {
				"label": d.name,
				charts: d
			}
		})

		if (data) {
			return (
				<div className={classes.collectionChart}>
					{
						data.map((d, i) => {
							let precision = 100; // 2 decimals
							let randomnum = Math.floor(Math.random() * (10 * precision - 1 * precision) + 1 * precision) / (1 * precision);
							const tool = `TIP_DSS_${d.label}`;
							return <div className={classes.collection} key={`collection-${i}`}>
								<div className={classes.collectionRow}>
									<Grid container direction="row" alignItems="center">
										<Grid item xs={7} sm={7}>
											<div className={classes.CollectionLabel}>
											<Tooltip title={strings[tool] || tool} placement="top">
											<span> {strings[d.label] || d.label}</span>
                            </Tooltip>
											</div>
										</Grid>
										<Grid item xs={5} sm={5}>
											<CollectionChartRow randomnum={randomnum} key={d.id} chartData={d.charts} filters={this.props.filters} page={page}/>
										</Grid>
									</Grid>
								</div>

							</div>
						})}
				</div>
			);
		}

		return <div>Loading...</div>
	}
}

const mapStateToProps = (state) => {
	return {
		dashboardConfigData: state.firstReducer.dashboardConfigData,
		GFilterData: state.GFilterData,
		chartsGData: state.chartsData,
		strings: state.lang
	}
}
const mapDispatchToProps = dispatch => {
	return bindActionCreators({
		APITransport: APITransport
	}, dispatch)
}
export default withStyles(style)(connect(mapStateToProps, mapDispatchToProps)(CollectionChart));