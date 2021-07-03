import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import ChartRow from './chartrow';
import { withStyles } from '@material-ui/core';
import style from './layOutStyle';
import getFilterObj from '../../actions/getFilterObj';
import { isMobile } from 'react-device-detect';

class PageLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }
    getMobilechartRowData(chartRowData){
        let mobileChartData = []
        chartRowData.map((vizData, j) =>{
            for(var i=0; i < vizData.vizArray.length; i++){
                mobileChartData.push(vizData.vizArray[i]);
            }
        })
        return mobileChartData;
    }
    setViewAll = (visualCode) =>{
        this.props.setViewAll(visualCode);
    }
    render() {
        let { classes, chartRowData, displayName, page } = this.props;
        let filters = getFilterObj(this.props.GFilterData, this.props.mdmsData, page);
        if(isMobile){
           chartRowData = this.getMobilechartRowData(chartRowData);
            return (
                <div className={`${classes.root}`} >

                    {
                        <ChartRow key={11} row={11} rowData={chartRowData} Gfilter={this.props.GFilterData} displayName={displayName[1]} filters={filters} page={page} setViewAll={this.setViewAll.bind(this)}/>
                    }
                </div>); 
        }else{
            return (
                <div className={`${classes.root}`} >
                    {
                        chartRowData.map((vizData, j) =>
                            <ChartRow key={j} row={j} rowData={vizData} Gfilter={this.props.GFilterData} displayName={displayName[j]} filters={filters} page={page} setViewAll={this.setViewAll.bind(this)}/>)
                    }
                </div>);
        }
    }
}

const mapStateToProps = (state) => {
    return {
        mdmsData:state.mdmsData,
        GFilterData: state.GFilterData
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators({
    }, dispatch)
}
export default withRouter(withStyles(style)(connect(mapStateToProps, mapDispatchToProps)(PageLayout)));

