import React, { Component } from 'react';
import GenericChart from './genericchart';
import { withStyles } from '@material-ui/styles';
import style from './layOutStyle';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import CustomizedExpansionPanels from '../common/CustomizedExpansionPanels';

class ChartRow extends Component {
	constructor(props) {
		super(props);
	}
	setViewAll = (visualCode) =>{
        this.props.setViewAll(visualCode);
    }
	render() {
		let { strings } = this.props;
		let { classes, rowData, displayName, filters, page,Gfilter,row } = this.props;		
		if(isMobile){	
			return (		
				<div className="container-fluid" style={{ padding: '0px', margin: '0px' }}>
					{
						displayName &&
						<div className={classes.tab}><div className={classes.header}>{strings[rowData.name]}</div></div>
					}
					<CustomizedExpansionPanels key={11} gFilter={Gfilter} chartData={rowData} filters={filters} page={page} setViewAll={this.setViewAll.bind(this)}/>
				</div>
			);
		}else{
			return (
				<div className="container-fluid" style={{ padding: '0px', margin: '0px' }}>
					{
						displayName &&
						<div className={classes.tab}><div className={classes.header}>{strings[rowData.name]}</div></div>
					}
					<GenericChart key={rowData.id} row={row} gFilter={Gfilter} chartData={rowData} filters={filters} page={page} setViewAll={this.setViewAll.bind(this)}/>
				</div>
			);
		}
	}
}

const mapStateToProps = (state) => ({
	strings: state.lang
  });

export default withStyles(style)(connect(mapStateToProps)(ChartRow));
