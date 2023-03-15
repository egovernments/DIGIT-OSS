import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import APITransport from '../../actions/apitransport/apitransport';
import dashboardAPI from '../../actions/dashboardAPI';
import GlobalFilter from '../common/globalFilter/index';
import { isMobile } from 'react-device-detect';
import { Card } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { updateGlobalFilterData } from '../../actions/globalFilter/GFilterAction';
import style from './styles';
import PageLayout from '../Charts/pagelayout';
import CustomizedMenus from './download';
import CustomizedShare from './share';
import FilterIcon from '@material-ui/icons/FilterList';
import Button from '@material-ui/core/Button';
import Menu from '../common/CustomMenu'
import _ from 'lodash';
import getChartOptions from '../../actions/getChartOptions';
import getFilterObj from '../../actions/getFilterObj';
import CustomTabs from '../common/Tabs/Tabs';
import ChartsAPI from '../../actions/charts/chartsAPI';
import { Typography } from '@material-ui/core';
import Cards from '../common/Cards/Cards';
import UiTable from '../common/UiTable/UiTable';
import getFinancialYearObj from '../../actions/getFinancialYearObj';
import mdmsAPI from '../../actions/mdms/mdms';
import moment from 'moment';
import { getTenantId } from '../../utils/commons';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: this.props.GFilterData,
      isFilterOpen: false,
      selectedTab: null,
      page: _.get(this.props, 'match.params.pageId'),
      viewAll: _.get(this.props, 'match.params.viewAll'),
      dontShowHeader: true
    }

  }

  componentWillReceiveProps(nextProps) {
    let newUrl = _.get(nextProps, 'match.params.viewAll');
    if (newUrl && this.state.viewAll !== newUrl) {
      this.setState({
        viewAll: newUrl
      })
    }
  }

  callDashboardAPI() {
    let dashboardApi = new dashboardAPI(20000);
    let overview = false
    if(_.toLower(this.state.page) === 'dashboard' || typeof this.state.page == 'undefined'){
      overview = true
    }else{
      this.setState({
        dontShowHeader: false
      })
    }
    this.props.APITransport(dashboardApi, this.state.page);
  }

  componentDidMount() {
    let getFYobj = getFinancialYearObj();

    let newFilterData = this.state.filter
    
    newFilterData.duration.value.startDate = getFYobj.value.startDate
    newFilterData.duration.value.endDate = getFYobj.value.endDate

    this.setState({
      filter: newFilterData
    })

    /* For fetch mdms data for filter */
    let mdmsApi = new mdmsAPI(20000);
    this.props.APITransport(mdmsApi); 
    
    this.callDashboardAPI();
  }

  callAll() {
    let { chartsData } = this.props;
    let filters = getFilterObj(this.props.GFilterData, this.props.mdmsData, this.state.page);
    let filters1;

    if(this.state.page.includes('ulb')) {
      if(!filters['tenantId']) {
        let tenentFilter = []
        tenentFilter.push(`${getTenantId()}`)
        filters['tenantId'] = tenentFilter
      }
    }
    _.each(chartsData, (k, v) => {
      let code = v,requestBody;
      if (code) {
        if(code == 'todaysCollection'  || code == 'wstodaysCollection'){
           filters1 = _.cloneDeep(filters)
           filters1['duration'] = {
              title: "TODAY",
              startDate: (moment().startOf('day').unix()) * 1000,
              endDate: (moment().endOf('day').unix()) * 1000,
              interval: 'day'
          }
          requestBody = getChartOptions(code, filters1);
        }else{
          requestBody = getChartOptions(code, filters);
        }
        
        let chartsAPI = new ChartsAPI(2000, 'dashboard', code, requestBody.dataoption);
        this.props.APITransport(chartsAPI)
      }
    })
  }

  applyFilter(filterData) {
    /**
     * next to this step dynamic properties are not avaiblable
     */
    this.setState({
      filter: filterData
    })
    this.props.updateFilterData(filterData);

  }
  applyFiltersLive(filter) {
    this.setState({
      filter: filter
    }, this.callAll())
  }
  setViewAll = (visualCode) =>{
    this.setState({
      viewAll: visualCode
    })
  }
  handleFilters() {
    // let fil = this.state.isFilterOpen
    this.setState({
      isFilterOpen: !this.state.isFilterOpen
    })
  }
  goback() {
    //let pageId = _.get(this.props, 'match.params.pageId');
    //this.props.history.push(`/${pageId}`);

    this.setState({
      viewAll: undefined
    })
  }
  tabChanged(value, v) {
    this.setState({
      selectedTab: v
    });
  }

  renderViewAll() {
    let { classes, strings } = this.props;
    let data = _.chain(this.props).get("chartsData").get(this.state.viewAll).get('data').map((d, i) => {
      let plot = d.plots[0];
      let label = _.chain(plot.name).split('.').join("_").toUpper().value();
      return {
        "fortable": (strings["TENANT_TENANTS_" + label] || label),
        "order": d.headerValue,
        "label": d.headerName + " " + d.headerValue + " : " + (strings["TENANT_TENANTS_" + label] || label),
        "value": plot.value,
        "label2": (strings[plot.label] || plot.label) + ": ",
        "color": (plot.value > 50) ? "#259b24" : "#e54d42"
      }
    }).compact().value() || [];
    if (data && data.length > 0) {
      let columnData = [];
      columnData.push({ id: 'rank', numeric: true, stickyHeader: false, disablePadding: false, label: 'Rank' })
      columnData.push({ id: 'ULBs', numeric: true, stickyHeader: false, disablePadding: false, label: 'ULBs' })
      columnData.push({ id: 'TargetAchieved', numeric: true, stickyHeader: false, disablePadding: false, label: 'Target Achieved' })
      columnData.push({ id: 'status', numeric: true, stickyHeader: false, disablePadding: false, label: 'Status' })
      let newData = _.chain(data).map((rowData, i) => {
        return {
          rank: (rowData.order),
          ULBs: rowData.fortable,
          TargetAchieved: parseFloat((rowData.value || 0)).toFixed(2) + '%',
          status: rowData.value,
        }
      }).value();


      return (<Cards style={{    maxWidth:isMobile? '85vw':'auto'}}>
        <Card style={{ overflow: 'initial'}}>
          <div className={classes.heading} onClick={this.goback.bind(this)}>
            <ArrowBack /> <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>Back</span>
          </div>
        </Card>
        <div    style={{    maxWidth:isMobile? '85vw':'auto'}}>
        <UiTable
      
          data={newData}
          columnData={columnData}
          needHash={false}
          orderBy={"rank"}
          order={(_.get(newData[0], 'rank') === 1 || false) ? 'asc' : 'desc'}
          tableType='ULB'
          noPage={false}
          needSearch={true}
          needExport={true}
          excelName={"All ULBs"}

        />
        </div>
 
      </Cards >)
    } else {
      return null;
    }

  }


  renderNormal() {
    let { dashboardConfigData, GFilterData } = this.props;
    // let displayName = [true, false, true, false];
    let tabsInitData = _.chain(dashboardConfigData).first().get("visualizations").groupBy("name").value();
    let tabs = _.map(tabsInitData, (k, v) => {
      return {
        name: v,
        key: v,
        lbl: v
      };
    });
    let defaultTab = this.state.selectedTab ? this.state.selectedTab : _.get(_.first(tabs), 'name')
    return (
      <div>

        {/* </div> */}
        {/* <div id="divToPrint"> */}


        {/* {this.state.isFilterOpen &&
          <GlobalFilter applyFilters={this.applyFilter.bind(this)} hideDepart={false} applyFiltersLive={this.applyFiltersLive.bind(this)} />
        } */}

        <CustomTabs myTabs={tabs} value={defaultTab} handleChange={this.tabChanged.bind(this)}>

        </CustomTabs>

        {
          _.map(tabsInitData, (k, v) => {
            return (<Typography
              key={v}
              component="div"
              role="tabpanel"
              hidden={(defaultTab) !== v}
              id={`simple-tabpanel-${v}`}
              aria-labelledby={`simple-tab-${v}`}
            // {...other}
            >
              <div id={(defaultTab) === v ? "div1ToPrint" : 'divNotToPrint'} className={(defaultTab) === v ? "elemClass" : 'elemClass1'}>
                <PageLayout chartRowData={k} headingTitle="Revenue" GFilterData={GFilterData} displayName={""} page={this.state.page} setViewAll={this.setViewAll.bind(this)}/>
              </div>
            </Typography>)
          })
        }
      </div>
      // </div>
    )
  }

  render() {
    let { classes, dashboardConfigData } = this.props;
    let dashboardName = dashboardConfigData && Array.isArray(dashboardConfigData) && dashboardConfigData.length >= 0 && dashboardConfigData[0] && dashboardConfigData[0].name && dashboardConfigData[0].name

    return (<div id="divToPrint" className={classes.dashboard}>
      <div className={classes.actions}>
        <span className={classes.pageHeader}>
          {this.props.strings[dashboardName] || dashboardName}
        </span>

        {isMobile && <div id="divNotToPrint" data-html2canvas-ignore="true" className={[classes.desktop, classes.posit].join(' ')}>

          <Menu type="download" bgColor="white" color="black" fileHeader="SURE Dashboard" fileName={dashboardName}></Menu>
          {!this.state.dontShowHeader && 
          <Button className={classes.btn1} data-html2canvas-ignore="true"
            onClick={this.handleFilters.bind(this)}
            fileName={dashboardName}
          >
            <FilterIcon></FilterIcon>
          </Button>
          }
        </div>
        }

        {!isMobile && <div id="divNotToPrint" className={classes.acbtn}>
          <CustomizedMenus key="download" fileName={dashboardName} fileHeader="State Wide Urban Real-Time Executive (SURE) Dashboard" />
          <CustomizedShare key="share" fileName={dashboardName} />
        </div>}
      </div>

      
      
          <div>
            <div className={classes.mobile} style={{ paddingRight: '24px' }}>
              {(this.state.isFilterOpen || !isMobile) &&
                <GlobalFilter applyFilters={this.applyFilter.bind(this)} page={this.state.page} hideDepart={this.state.page && this.state.page.toLowerCase() !== 'overview'} applyFiltersLive={this.applyFiltersLive.bind(this)} />
              }
            </div>
            <div>
              {
                this.state.viewAll ? this.renderViewAll() : this.renderNormal()
              }
            </div>
          </div>
          
      


    </div>
    )

  }
}
const mapStateToProps = (state) => {
  return {
    dashboardConfigData: state.firstReducer.dashboardConfigData,
    mdmsData: state.mdmsData,
    GFilterData: state.GFilterData,
    chartsData: state.chartsData,
    strings: state.lang
  }
}
const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    APITransport: APITransport,
    updateFilterData: updateGlobalFilterData
  }, dispatch)
}
export default withRouter(withStyles(style)(connect(mapStateToProps, mapDispatchToProps)(Dashboard)));
