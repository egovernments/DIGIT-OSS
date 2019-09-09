import React, { Component } from 'react';
import { connect } from 'react-redux';
import Api from '../../../api/api';
import SearchForm from './searchForm';
import ReportResult from './reportResult';
// import mockData from './mockData';

class Report extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.reportName !== this.props.match.params.reportName) {
      this.initData(nextProps.match.params.moduleName, nextProps.match.params.reportName);
    }
  }

  componentDidMount() {
    this.initData(this.props.match.params.moduleName, this.props.match.params.reportName);
    this.hasReturnUrl();
  }

  hasReturnUrl() {
    if (localStorage.getItem('returnUrl')) {
      window.localStorage.setItem('returnUrl', '');
    }
  }

  initData = (moduleName, reportName) => {
    var _this = this;
    let { setMetaData, setFlag, showTable, setForm, setReportResult } = this.props;

    var tenantId = localStorage.getItem('tenantId') ? localStorage.getItem('tenantId') : '';

    // setFlag(1);
    // showTable(false);
    // setReportResult({});
    // setMetaData(mockData);

    Api.commonApiPost('/report/' + moduleName + '/metadata/_get', {}, { tenantId: tenantId, reportName: reportName }).then(
      function(response) {
        setFlag(1);
        showTable(false);
        setReportResult({});
        setMetaData(response);
      },
      function(err) {
        alert('Try again later');
      }
    );
  };

  render() {
    let { match } = this.props;
    return (
      <div className="">
        <SearchForm match={match} />

        <ReportResult match={match} />
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  setMetaData: metaData => {
    dispatch({ type: 'SET_META_DATA', metaData });
  },
  setFlag: flag => {
    dispatch({ type: 'SET_FLAG', flag });
  },
  showTable: state => {
    dispatch({ type: 'SHOW_TABLE', state });
  },
  setReportResult: reportResult => {
    dispatch({ type: 'SHOW_TABLE', reportResult });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  toggleDailogAndSetText: (dailogState, msg) => {
    dispatch({ type: 'TOGGLE_DAILOG_AND_SET_TEXT', dailogState, msg });
  },
  setForm: (required = [], pattern = []) => {
    dispatch({
      type: 'SET_FORM',
      form: {},
      fieldErrors: {},
      isFormValid: false,
      validationData: {
        required: {
          current: [],
          required: required,
        },
        pattern: {
          current: [],
          required: pattern,
        },
      },
    });
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Report);
