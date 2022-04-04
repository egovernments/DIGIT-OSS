import React from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import axios from 'axios';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeTheName } from '../src/actions/firstAction';
import { updateLanguage } from './actions/languageChange';
import './App.css';
import variables from './styles/variables';
import { fetchLocalisationRequest, getLocaleLabels, getTenantId } from './utils/commons';
import Layout from './utils/Layout';
import { loadUlbLogo } from './utils/block';

const theme = createMuiTheme({
  overrides: {
    typography: {
      useNextVariants: true,
      fontFamily: variables.primaryFont
    },
    MuiMenu: {
      paper: {
        backgroundColor: 'white',
        fontFamily: variables.primaryFont,
        height: 'auto',
        color: variables.black
      }
    }
  }
});


let dataL = {
  "en": {
    "DSS_OVERVIEW": "Overview",
    "DSS_TOTAL_COLLECTION": "Total Collection",
    "DSS_TARGET_COLLECTION": "Target Collection",
    "DSS_TARGET_ACHIEVED": "Target Achievement",
    "DSS_TOTAL_CUMULATIVE_COLLECTION": "Total Cumulative Collection",
    "DSS_TOP_PERFORMING_ULBS": "Top 3 Performing ULBs",
    "DSS_BOTTOM_PERFORMING_ULBS": "Bottom 3 Performing ULBs",
    "DSS_TOTAL_CUMULATIVE_COLLECTION:_DEPARTMENT_WISE": "Total Cumulative Collection: Service Wise",
    "DSS_TOTAL_APPLICATION": "Total Applications",
    "DSS_CLOSED_APPLICATION": "Closed Applications",
    "DSS_SLA_ACHIEVED": "SLA Achievement",
    "DSS_CITIZEN_REGISTERED": "Citizen Registered",
    "DSS_TOTAL_APPLICATION_&_CLOSED_APPLICATION": "Total Applications & Closed Applications",
    "DSS_TOTAL_APPLICATIONS:_DEPARTMENT_WISE": "Total Applications: Service Wise",
    "DSS_PT_TOP_3_PERFORMING_ULBS": "Top 3 Performing ULBs",
    "DSS_PT_BOTTOM_3_PERFORMING_ULBS": "Bottom 3 Performing ULBs",
    "DSS_PT_COLLECTION_BY_USAGE_TYPE": "Collection by Usage type",
    "DSS_PT_DEMAND_&_COLLECTION_INDEX": "Key Performance Indicator",
    "DSS_PT_TOTAL_PROPERTIES_ASSESSED": "Total Properties Assessed",
    "DSS_PT_TOTAL_ASSESSMENTS": "Total Assessments",
    "DSS_PT_TOTAL_ACTIVE_ULBS": "Total Active ULBs",
    "DSS_PT_PROPERTIES_BY_USAGE_TYPE": "Properties by Usage Type",
    "DSS_PT_CUMULATIVE_PROPERTIES_ASSESSED": "Total Cumulative Properties Assessed",
    "DSS_PT_DEMAND_COLLECTION_BOUNDARY": "Boundary",
    "DSS_PT_DEMAND_COLLECTION_USAGETYPE": "Usage Type",
    "DSS_PT_DEMAND_COLLECTION": "Key Performance Indicator",
    "DSS_PT_TAX_HEAD_BREAKUP_REVENUE": "Tax Heads Breakups",
    "DSS_TL_LICENSE_ISSUED": "Total License Issued",
    "DSS_TL_CUMULATIVE_LICENSE_ISSUED": "Total Cumulative License Issued",
    "DSS_TL_LICENSE_BY_TYPE": "License by Type",
    "DSS_TL_LICENSE_BY_STATUS": "Trade License by Status",
    "DSS_COMPLETION_RATE": "Completion Rate",
    "DSS_REVENUE": "Revenue",
    "DSS_SERVICE": "Service",
    "DSS_PGR_TOTAL_COMPLAINTS": "Total Complaints",
    "DSS_PGR_CLOSED_COMPLAINTS": "Closed Complaints",
    "DSS_TOTAL_CUMULATIVE_CLOSED_COMPLAINTS": "Cumulative Closed Complaints",
    "DSS_PGR_COMPLAINTS_BY_STATUS": "Complaint By Status",
    "DSS_PGR_COMPLAINTS_BY_CHANNEL": "Complaint By Channel",
    "DSS_PGR_COMPLAINTS_BY_CATEGORY": "Complaint By Category",
    "DSS_PGR_COMPLAINTS_BY_TENANT": "Complaint By Tenant",
    "DSS_PGR_COMPLAINTS_BY_DISTRICT": "Complaint By District",
    "DSS_PGR_COMPLAINTS_BY_DEPARTMENT": "Complaint By Department",
    "DSS_DOWNLOAD": 'DOWNLOAD',
    "DSS_SHARE": 'SHARE',
    "DSS_MOBILE_DOWNLOAD": 'Download',
    "DSS_MOBILE_SHARE": 'Share',
    "DSS_APPLY": "APPLY",
    "DSS_CLEAR_ALL": "CLEAR",
    "DSS_DATE_RANGE": "Date Range",
    "DSS_DDRS": "DDRs",
    "DSS_ULBS": "ULBS",
    "DSS_SERVICES": "Services",
    "DSS_DENOMINATION": "Denomination",
    "DSS_PDF": "PDF",
    "DSS_IMAGE": "Image",
    "DSS_MORE_ACTIONS": "DSS_MORE_ACTIONS",
    "DSS_VIEW_ALL": "VIEW_ALL",
    "DSS_BACK_TO_MY_DASHBOARD": "Back to MyDashboard",
    "DSS_ROWS": "Rows",
    "DSS_SELECT": "SELECT",
    "DSS_CANCEL": "CANCEL",
    "DSS_TODAY": "Today",
    "DSS_THIS_WEEK": "This Week",
    "DSS_THIS_MONTH": "This Month",
    "DSS_THIS_QUARTER": "This Quarter",
    "DSS_CUSTOM": "Custom",
    "DSS_FY": "FY",
    "DSS_RANK": "Rank",
    "DSS_NO_DATA_AVAILABLE": "No Data Available",
    "DSS_TOTAL_COLLECTION_TODAY": "Today's Collection",
    "DSS_PT_TAX_HEAD": "Tax Heads",
    "DSS_TL_TAX_HEAD_BREAKUP": "Tax Heads Breakups",
    "DSS_TOTAL_COMPLAINTS_BY_SOURCE": "Total Complaints by Source",
    "DSS_TOTAL_COMPLAINTS_STATUS": "Total Complaints by Status",
    "DSS_PGR_COMPLETION_RATE": "Completion Rate",
    "DSS_PROPERTY_TAX": "Property Tax",
    "DSS_TRADE_LICENCE": "Trade License",
    "DSS_COMPLAINS": 'Complaints',
    "DSS_OVERVIEW_DASHBOARD": "Overview",
    "DSS_HOME_DASHBOARD": "State Urban Real-Time Executive (SURE) Dashboard",
    "DSS_PROPERTY_TAX_DASHBOARD": "Property Tax (SURE) Dashboard",
    "DSS_TRADE_LICENSE_DASHBOARD": "Trade License (SURE) Dashboard",
    "DSS_PGR_DASHBOARD": "PGR (SURE) Dashboard"
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    localStorage.setItem("lang", JSON.stringify(dataL));
    this.changeTheName = this.changeTheName.bind(this);
    this.state = {
      language: 'en'
    }
  }
 
  loadLocalisation = () => {
    let language = localStorage.getItem("Employee.locale")||'en_IN';
    let localisationLabels = JSON.parse(localStorage.getItem(`localization_${language}`)) || [];
    if (localisationLabels.length == 0 || localisationLabels.filter(localisation => localisation.module == "rainmaker-dss").length == 0) {
      let localisationRequest = fetchLocalisationRequest(language);
      axios.post(localisationRequest.reqUrl, localisationRequest.reqBody, localisationRequest.reqHeaders)
        .then(response => {
          localStorage.setItem(`localization_${language}`,JSON.stringify(response.data.messages));
          this.setLocalisation(response.data.messages);
        })
        .catch(error => {
        });
    } else {
      this.setLocalisation(localisationLabels);
    }
  }

  setLocalisation = (localisationLabels = []) => {
    let data = _.chain(localisationLabels)
      .map(i => { return { key: i.code, value: i.message } })
      .flatten().value();
    let newIndex = _.chain(data)
      .keyBy('key')
      .mapValues('value')
      .value();
    let dataL = {
      'en': newIndex,
      'hi': {}
    }
    getLocaleLabels("check",dataL?.en);
    this.props.updateLanguage(dataL);
  }

  componentDidMount() {
    document.title = "DSS Dashboard";
    this.loadLocalisation();
    loadUlbLogo(getTenantId());
    // if(process.env.NODE_ENV==="development"){
      // localStorage.setItem("Employee.token","25f8252c-683c-4bda-a065-7180dea56a6b")
      // localStorage.setItem("tenant-id","pg.citya")
    // }
  }

  changeTheName = (e) => {
    this.props.changeTheName();
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Layout />
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoaded: state.firstReducer.isLoaded,
  apistatus: state.apistatus,
  strings: state.lang

});


const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    changeTheName: changeTheName,
    updateLanguage: updateLanguage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
