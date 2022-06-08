import { withStyles } from '@material-ui/styles';
import axios from 'axios';
import _, { get } from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import APITransport from '../../actions/apitransport/apitransport';
import getChartOptions from '../../actions/getChartOptions';
import getPrevFinancialYearObj from '../../actions/getPrevFinancialYearObj';
import { getLocaleLabels, getTenantId } from '../../utils/commons';
import Chips from '../common/Chips/Chips';
import NFormatterFun from '../common/numberFormaterFun';
import SwitchButton from '../common/tableswitchs/switchButtons';
import UiTable from '../common/UiTable/UiTable';
import styles from './styles';


class TableChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter2: false,
      filterValue: {},
      data: null,
      drillCode: null,
      visualcode: null,
      tabFilterKey: null,
      drillDownId: null,
      active: null,
      drilfilters: null,
      lastYeardata: null,
      getFYObj: getPrevFinancialYearObj(),
      filterList: {},
      filterData: this.props.filters
    }
  }


  getDateFilter(value) {
    switch (_.toUpper(value)) {
      case 'TODAY':

        return {
          title: "TODAY",
          value: {
            startDate: moment(moment().subtract(1, 'day')).startOf('day').unix(),
            endDate: moment(moment().subtract(1, 'day')).endOf('day').unix(),
            interval: 'day'
          }
        }
      case 'WEEK':

        return {
          title: "WEEK",
          value: {
            startDate: moment(moment().subtract(1, 'week')).startOf('week').unix(),
            endDate: moment(moment().subtract(1, 'week')).endOf('week').unix(),
            interval: 'week'
          }
        }
      case 'MONTH':
        return {
          title: "MONTH",
          value: {
            startDate: moment(moment().subtract(1, 'month')).startOf('month').unix(),
            endDate: moment(moment().subtract(1, 'month')).endOf('month').unix(),
            interval: 'week'
          }
        }
      case 'QUARTER':
        return {
          title: "QUARTER",
          value: {
            startDate: moment(moment().subtract(1, 'quarter')).startOf('quarter').unix(),
            endDate: moment(moment().subtract(1, 'quarter')).endOf('quarter').unix(),
            interval: 'week'
          }
        }
      case 'PREVYEAR':
        return {
          title: "YEAR",
          value: {
            startDate: moment(moment().subtract(2, 'year')).startOf('year').unix(),
            endDate: moment(moment().subtract(2, 'year')).endOf('year').unix(),
            interval: 'month'
          }
        }

      default:
        return getPrevFinancialYearObj();
    }
  }

  getLastYearRequest(calledFrom, visualcode, active, filterList) {
    var newFilterData = this.state.filterData;
    var existingFilters = this.props.filters;
    var title = existingFilters.duration.title;

    var currentYear = moment().startOf('year').format('YY')

    var returnVal, prevYear;
    if (title) {
      returnVal = title.split(/[-]/g);
      prevYear = parseInt(returnVal.toString().replace(/[FY ]/g, ''));
      if (returnVal && returnVal[0].includes('FY') && Math.round(prevYear) !== Math.round(currentYear))
        title = 'PREVYEAR';
    }
    let dateFilter = this.getDateFilter(title);

    var startDate = dateFilter.value.startDate;

    for (var i = startDate.toString().length; i < 13; i++) {
      startDate = startDate.toString().concat('0');
    }
    newFilterData.duration.startDate = startDate;

    var endDate = dateFilter.value.endDate;


    for (var i = endDate.toString().length; i < 13; i++) {
      endDate = endDate.toString().concat('0');
    }
    newFilterData.duration.endDate = endDate;
    newFilterData.duration.interval = dateFilter.value.interval;

    let getAxiosOptions = getChartOptions(visualcode, newFilterData);

    if (getAxiosOptions && getAxiosOptions.url) {
      axios.post(getAxiosOptions.url, getAxiosOptions.dataoption, getAxiosOptions.options)
        .then(response => {
          let tmpState = {};
          let tempData = response.data.responseData;
          let drillCode = response.data.responseData['drillDownChartId'];
          let visualcode = response.data.responseData['visualizationCode'];
          let drilfilters = (response.data.responseData['filter'] && response.data.responseData['filter'].length > 0) ? response.data.responseData['filter'][0] : null;
          tmpState.lastYeardata = tempData;
          tmpState.drillCode = drillCode;
          tmpState.drilfilters = drilfilters;
          if (active)
            tmpState.active = active.toUpperCase();
          if (drillCode != 'none' || calledFrom == 'clickFromTab')
            tmpState.visualcode = visualcode;
          // if(filterList&&Object.values(filterList)[0].length== 2&& drillCode != 'none'){
          //   tmpState.drilfilters = {...tmpState.drilfilters ,column:get(tempData,"data[0].plots[1].name",tmpState.drilfilters.column)};
          //   tmpState.drilfilters.key=tmpState.drilfilters.column=="Ward"?"wardId":tmpState.drilfilters.key;

          // }
          tmpState.filterList = filterList;
          this.setState(tmpState);
        })
        .catch(error => {
        });
    }
  }
  


  getRequest(calledFrom, visualcode, active, filterList) {

    // this.getLastYearRequest(calledFrom, visualcode, active, filterList);
    let tempFilterList = this.state.drilfiltersNew || [];
    filterList = filterList ? filterList : this.state.filterList;
    let filters = {}, ttest = [], tempFL;
    if (!_.isEmpty(filterList, true)) {
      _.map(filterList, (k, v) => {
        if (filterList[v] && filterList[v].length > 0) {
          tempFL = filterList[v][filterList[v].length - 1];
          if (tempFL[2]['column'] == 'DDRs') {
            let tempDDR = this.props.tenantObj[tempFL[4]];
            for (var j = 0; j < tempDDR.length; j++) {
              ttest.push(tempDDR[j]);
            }
            filters[tempFL[2]['key']] = ttest;
          } else {
            filters[tempFL[2]['key']] = tempFL[4];
          }

        }
      });
    }

        /*  Fix for passing Mutiple filters in the table for 3+ level drilldowns */
    tempFilterList && Array.isArray(tempFilterList) && tempFilterList.map(filter => {
      if (filters && filters[filter.key]) {

      } else {
        let filterValue = ''
        if (filter.key == 'ulbId' && filter.column == 'ULB') {
          let filteredList = Object.values(filterList).map(filList => filList.filter(boundaryList => {
            return boundaryList && boundaryList[2] && boundaryList[2].column == "Boundary" && boundaryList[2].key == "tenantId"
          }))
          filterValue = filteredList && filteredList.length > 0 && filteredList[0] && filteredList[0].length > 0 && filteredList[0][0] && filteredList[0][0][4] || '';
        } else if (filter.key == 'wardId' && filter.column == 'Ward') {
          let filteredList = Object.values(filterList).map(filList => filList.filter(boundaryList => {
            return boundaryList && boundaryList[2] && boundaryList[2].column == "Ward" && boundaryList[2].key == "wardId"
          }))
          filterValue = filteredList && filteredList.length > 0 && filteredList[0] && filteredList[0].length > 0 && filteredList[0][0] && filteredList[0][0][4] || '';
        }
          
          if (filterValue != '') {
            filters[filter.key] = filterValue
          }

        }
      })



    var globalFilters = this.props.filters;
    globalFilters = { ...globalFilters, ...filters };

    if (this.props.page && this.props.page.includes('ulb')) {
      if (!globalFilters['tenantId']) {
        let tenentFilter = []
        tenentFilter.push(`${getTenantId()}`)
        globalFilters['tenantId'] = tenentFilter
      }
    }
    let getAxiosOptions = getChartOptions(visualcode, globalFilters);

    if (getAxiosOptions && getAxiosOptions.url) {
      axios.post(getAxiosOptions.url, getAxiosOptions.dataoption, getAxiosOptions.options)
        .then(response => {
          let tempState = {};
          let tempData = response.data.responseData;
          let drillCode = response.data.responseData['drillDownChartId'];
          let visualcode = response.data.responseData['visualizationCode'];
          let drilfilters = (response.data.responseData['filter'] && response.data.responseData['filter'].length > 0) ? response.data.responseData['filter'][0] : null;
          tempState.data = tempData;
          tempState.drillCode = drillCode;
          tempState.drilfilters = drilfilters;
          tempState.drilfiltersNew = (response.data.responseData['filter'] && response.data.responseData['filter'].length > 0) ? response.data.responseData['filter'] : null;
          if (active)
            tempState.active = active.toUpperCase();
          if (drillCode != 'none' || calledFrom == 'clickFromTab')
            tempState.visualcode = visualcode;
          tempState.filterList = filterList;
          // if(filterList&&Object.values(filterList)[0].length== 2&& drillCode != 'none'){
          //   tempState.drilfilters = {...tempState.drilfilters ,column:get(tempData,"data[0].plots[1].name",tempState.drilfilters.column)};
          //   tempState.drilfilters.key=tempState.drilfilters.column=="Ward"?"wardId":tempState.drilfilters.key;
          // }
          this.setState(tempState);
        })
        .catch(error => {
        });
    }
  }

  handleChipClick = (index, tabName, visualcode) => {
    let filterList = _.cloneDeep(this.state.filterList);
    filterList[tabName] = filterList[tabName].splice(0, index);
    if (_.isEmpty(filterList[tabName], true) && filterList[tabName].length == 0) {
      delete filterList[tabName];
    }
    if (this.state.active && tabName != this.state.active) {
      let curTabfilter = filterList[this.state.active]
      if (curTabfilter) {
        visualcode = curTabfilter[curTabfilter.length - 1][1]
      } else {
        visualcode = this.state.visualcode
      }
    }

    this.getRequest("handleChipClick", visualcode, '', filterList);
  }

  applyFilter = (visualcode, drillCode, drilfilters, tabName, rowData, event) => {
    let tempValue = rowData[drilfilters.column];
    tempValue = (typeof tempValue === 'object') ? tempValue[0] : tempValue;
    tabName = tabName.toUpperCase();
    let tempArr = [visualcode, drillCode, drilfilters, tabName, tempValue];
    let filterList = this.state.filterList;

    if (_.isEmpty(filterList, true) || typeof filterList[tabName] == "undefined") {
      filterList[tabName] = [];
    }
    var visualCodeExists = false;
    if (filterList[tabName].length > 0) {

      for (var i = 0; i < filterList[tabName].length; i++) {
        if (filterList[tabName][i][0] == visualcode) {
          // if it is exists visualCode
          filterList[tabName][i] = tempArr;
          visualCodeExists = true;
          break;
        }
      }
      // Not Exists so pushing new to exist tab
      if (!visualCodeExists) {
        filterList[tabName].push(tempArr);
      }
    } else {
      // New entry
      filterList[tabName].push(tempArr);
    }
    this.getRequest("applyFilter", drillCode, '', filterList);
  }

  getFilterObj(filters) {
    return filters;
  }

  renderChip = (tabName, chipValue) => {
    var row = [];
    for (var i = 0; i < chipValue.length; i++) {
      if (chipValue[i] && chipValue[i].length > 0) {
        let label = Array.isArray(chipValue[i]) && chipValue[i].length > 2 && chipValue[i][2] && chipValue[i][2].column || 'BOUNDARY';
        row.push(<div className="chipWrap" style={isMobile ? { margin: "2px 20px" } : {}}><Chips fromScreen="TableChart" index={i} label={label} tabName={tabName} value={chipValue[i]} handleClick={this.handleChipClick} /></div>);
      }
    }
    return row;
  }

  clickFromTab = (visualcode, active) => {
    let filterList = this.state.filterList;
    if (!_.isEmpty(filterList, true) && typeof filterList[active] !== 'undefined' && filterList[active].length > 0) {
      visualcode = filterList[active][filterList[active].length - 1][1];
    }

    this.getRequest("clickFromTab", visualcode, active);
  }


  render() {
    let { classes, chartData, chartKey, chartsData, strings, chartParent } = this.props;
    let drillCode, visualcode, tabName, drilfilters, lastYearChartData;

    if (this.props && chartData) {
      if (this.state.data) {
        chartData = this.state.data.data;
        drillCode = this.state.drillCode;
        visualcode = this.state.visualcode;
        tabName = this.state.active;
        drilfilters = this.state.drilfilters;
      }
      drillCode = drillCode ? drillCode : chartsData[this.props.chartKey]['drillDownChartId'];
      visualcode = visualcode ? visualcode : chartsData[this.props.chartKey]['visualizationCode'];
      tabName = tabName ? tabName : chartParent[0]['tabName'];
      drilfilters = drilfilters ? drilfilters : chartsData[this.props.chartKey]['filter'][0];

      let colSortRow = {};
      for (var i = 0; i < chartData.length; i++) {
        if (!chartData[i]) {
          if (chartData[i + 1]) {
            chartData.splice(0, i + 1);
            break;
          }
        }
      }
      let columnData = _.chain(chartData).first().get("plots").map((k, v) => {
        if (k.name != "S.N.") {
          colSortRow[k.name] = '';
          let yes = v < 0;
          let isNumeric = _.toLower(k.symbol) === 'amount' || _.toLower(k.symbol) === "number" || _.toLower(k.symbol) === "percentage";
          return { id: k.name, numeric: isNumeric, stickyHeader: yes, disablePadding: false, label: k.name, colType: k.symbol }
        }
      }).value();
      // small hack but need to remove from backend.
      columnData.splice(0, 1);
      let newData = [];
      let newLastYearData = [];

      if (chartData) {
        for (var i = 0; i < chartData.length; i++) {
          let newrowData = _.cloneDeep(colSortRow)
          if (chartData[i] && chartData[i]['plots']) {
            _.map(chartData[i]['plots'], a => {
              if (a.name != "S.N.") {
                if (a.symbol.toUpperCase() === 'TEXT') {
                  let label = _.chain(a.label).split('.').join("_").toUpper().value();
                  let text = null;
                  try {
                    text = strings["TENANT_TENANTS_" + label]
                  } catch {
                    text = a.label;
                  }
                  if (!text) {
                    text = a.label;
                  }
                  newrowData[a.name] = [a.label, text]
                } else if (a.symbol.toUpperCase() === 'STRING') {
                  let label = _.chain(a.strValue).split('.').join("_").toUpper().value();
                  let text = null;
                  try {
                    text = strings["TENANT_TENANTS_" + label]
                  } catch {
                    text = a.strValue;
                  }
                  if (!text) {
                    text = a.strValue;
                  }
                  newrowData[a.name] = [a.strValue, text]
                } else {
                  let val = NFormatterFun(a.value, a.symbol, this.props.GFilterData['Denomination'], false);
                  newrowData[a.name] = val
                }
              }
            });
            newData.push(newrowData)
          }
        }
      }


      if (!this.state.lastYeardata && chartData) {
        let filterList = _.cloneDeep(this.state.filterList);
        if (drillCode === 'none')
          this.getLastYearRequest('', this.state.prevDrillCode, '', filterList);
        else
          this.getLastYearRequest('', visualcode, '', filterList);
      }


      if (this.state.lastYeardata) {
        lastYearChartData = this.state.lastYeardata.data;


        colSortRow = {};
        for (var i = 0; i < lastYearChartData.length; i++) {
          if (!lastYearChartData[i]) {
            if (lastYearChartData[i + 1]) {
              lastYearChartData.splice(0, i + 1);
              break;
            }
          }
        }
        columnData = _.chain(chartData).first().get("plots").map((k, v) => {
          if (k.name != "S.N.") {
            colSortRow[k.name] = '';
            let yes = v < 0;
            let isNumeric = _.toLower(k.symbol) === 'amount' || _.toLower(k.symbol) === "number" || _.toLower(k.symbol) === "percentage";
            return { id: k.name, numeric: isNumeric, stickyHeader: yes, disablePadding: false, label: k.name, colType: k.symbol }
          }
        }).value();
        // small hack but need to remove from backend.
        columnData.splice(0, 1);
        if (lastYearChartData) {
          for (var i = 0; i < lastYearChartData.length; i++) {
            let newrowData = _.cloneDeep(colSortRow)
            if (lastYearChartData[i] && lastYearChartData[i]['plots']) {
              _.map(lastYearChartData[i]['plots'], a => {
                if (a.name != "S.N.") {
                  if (a.symbol.toUpperCase() === 'TEXT') {
                    let label = _.chain(a.label).split('.').join("_").toUpper().value();
                    let text = null;
                    try {
                      text = strings["TENANT_TENANTS_" + label]
                    } catch {
                      text = a.label;
                    }
                    if (!text) {
                      text = a.label;
                    }
                    newrowData[a.name] = [a.label, text]
                  } else {
                    let val = NFormatterFun(a.value, a.symbol, this.props.GFilterData['Denomination'], false);
                    newrowData[a.name] = val
                  }
                }
              });
              newLastYearData.push(newrowData)
            }
          }
        }
        this.state.lastYeardata = null;
      }
      this.state.prevDrillCode = drillCode;


      return (
        <div className={classes.tableChart} style={{ display: 'flex', flexDirection: 'column', marginTop: "10px" }}>
          <div className="tableHeading">
            <div className={"table-filters"}>
              <SwitchButton clickFromTab={this.clickFromTab} chartParent={chartParent} strings={strings} />

            </div>
          </div>
          {(this.state.data && !_.isEmpty(this.state.filterList, true)) &&
            <div className="row tableFilterChipWrap">
              <div className="filLabel">
                {getLocaleLabels('Filters Applied')}
              </div>
              {
                isMobile ?
                  (<div class="cutome_label_chip">
                    {_.map(this.state.filterList, (k, v) => {
                      return this.renderChip(v, k)
                    })}</div>) :
                  _.map(this.state.filterList, (k, v) => {
                    return this.renderChip(v, k)
                  })
              }
            </div>
          }
          {
            <UiTable
              column={this.state.data && this.state.data.filter && Array.isArray(this.state.data.filter) && this.state.data.filter.length > 0 && this.state.data.filter[0].column ? this.state.data.filter[0].column : (chartsData[chartKey] && Array.isArray(chartsData[chartKey].filter) && chartsData[chartKey].filter.length > 0 ? chartsData[chartKey].filter[0].column : '')}
              data={newData}
              filters={this.props.filters}
              lyData={newLastYearData}
              columnData={columnData}
              tableType='CENTERS_TABLE'
              cellClick={this.applyFilter.bind(this, visualcode, drillCode, drilfilters, tabName)}
              Gfilter={this.props.GFilterData}
              needSearch
              needHash={true}
              needExport
              excelName={strings[this.props.label] || this.props.label || "DSS"}
            />
          }
        </div>
      );
    }
    return <div>Loading...</div>
  }
}
const mapStateToProps = (state) => {
  let tenants=get(state,'tenents.MdmsRes.tenant.tenants',[]);
  const tenantObj=tenants.reduce((prev,curr)=>{
    let ddrname=curr.city.ddrName;
        if(prev[ddrname])
        {
            prev[ddrname].push(curr.code)
        }else{
            prev[ddrname]=[curr.code]
        }
        return prev;
        
    },{})
  return {
    dncData: state.DemandAndCollectionData,
    GFilterData: state.GFilterData,
    chartsData: state.chartsData,
    mdmsData: state.mdmsData,
    strings: state.lang,
    tenantObj
  }
}
const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    APITransport: APITransport
  }, dispatch)
}
export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TableChart)));
