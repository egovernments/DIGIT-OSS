import React from 'react';
import { Bar } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NFormatterFun from '../common/numberFormaterFun';
import { withStyles } from '@material-ui/core/styles';
import style from './styles';
import { isMobile } from 'react-device-detect';
import CONFIG from '../../config/configs';

const options = {
  scales: {
    xAxes: [{
        gridLines: {
            color: "rgba(0, 0, 0, 0)",
        }
    }]
},
  responsive: true,
  options: {
    responsive: true,
    
    maintainAspectRatio: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  },
  legend: {
    display: true,
    position: 'bottom',
    labels: {
      boxWidth: 10
    }
  }
};

class BarChart extends React.Component {

  constructor(props) {
    super(props);
  }
  
  callforNewData(elems) {
		
	}
  manupulateData(strings,chartData) {
    var tempdata = {
      labels: [],
      datasets: []
    };
    let color =JSON.parse(sessionStorage.getItem('CHART_COLOR_CODE')) ;
    chartData.map((d, i) => {
      let tempObj = {
        label: "",
        borderColor: color[i],
        backgroundColor: color[i],
        fill: false
      }
      let tempdataArr = [];
      let tempdatalabel = [],tempVal='';
      tempObj.label =   strings[d.headerName] || d.headerName;
      d.plots.map((d1, i) => {
        tempVal = NFormatterFun(d1.value, d1.symbol, this.props.GFilterData['Denomination']);
        tempVal = (typeof tempVal == 'string')?parseFloat(tempVal.replace(/,/g, '')):tempVal;
        tempdataArr.push(tempVal);
        tempdatalabel.push(strings[d1.name] || d1.name);
      })
      tempObj.data = tempdataArr;
      tempdata.labels = tempdatalabel;
      tempdata.datasets.push(tempObj);
    })
    return tempdata;
  }

  render() { 
    let { chartData,classes,strings } = this.props;
    let data = this.manupulateData(strings,chartData);
    if (data) {
      if (isMobile){
            return ( 
              <div className={classes.lineChart}>
                <Bar
                  style={{ fill: 'none'}}
                  data={data}
                  options={options}
                  onElementsClick={this.callforNewData.bind(this)} 
                  height={350}         
                >
                </Bar>
              </div>
            )
      }else{
        return ( 
              <div className={classes.lineChart}>
                <Bar
                  style={{ fill: 'none'}}
                  data={data}
                  options={options}
                  onElementsClick={this.callforNewData.bind(this)}
                >
                </Bar>
              </div>
            )
      }
    }
    return <div>Loading...</div>
  }
}

const mapStateToProps = (state) => {
  return {
    GFilterData: state.GFilterData,
    chartsGData: state.chartsData,
    strings: state.lang

  }
}
const mapDispatchToProps = dispatch => {
  return bindActionCreators({
  }, dispatch)
}
export default  withStyles(style)(connect(mapStateToProps, mapDispatchToProps)(BarChart));
