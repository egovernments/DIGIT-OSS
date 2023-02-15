import React, { Component } from "react";
import { connect } from "react-redux";
import { commonApiPost } from "egov-ui-kit/utils/api";
import SearchForm from "./searchForm";
import ReportResult from "egov-ui-kit/utils/reportResult";
import { getMetaDataUrl } from "./commons/url";
import commonConfig from "config/common.js";
import { Screen } from "modules/common";
import { getTenantId, setReturnUrl, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabLabel: "",
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.reportName !== this.props.match.params.reportName) {
      nextProps.resetForm();
      this.initData(nextProps.match.params.moduleName, nextProps.match.params.reportName);
    }
  }

  componentDidMount() {
    this.props.resetForm();
    this.initData(this.props.match.params.moduleName, this.props.match.params.reportName);
    this.hasReturnUrl();
  }

  hasReturnUrl() {
    if (localStorageGet("returnUrl")) {
      setReturnUrl("");
    }
  }

  setError = (err) => {
    err &&
      err.message &&
      this.props.toggleSnackbarAndSetText(
        true,
        { labelName: getTransformedLocale(err.message), labelKey: getTransformedLocale(err.message) },
        "error"
      );
  };

  initData = (moduleName, reportName) => {
    let { setMetaData, setFlag, showTable, setReportResult } = this.props;
    var tenantId = getTenantId() ? getTenantId() : commonConfig.tenantId;
    let urlBase = getMetaDataUrl(moduleName, reportName);
    const { setError } = this;
    urlBase &&
      commonApiPost(urlBase, {}, { tenantId: tenantId, reportName: reportName }).then(
        function (response) {
          if (response && response.reportDetails) response.reportDetails.reportName = reportName; //temp soln for custom report name
          setFlag(1);
          showTable(false);
          setReportResult({});
          setMetaData(response);
        },
        function (err) {
          setError(err ? err : "Try again later");
        }
      );
  };
  updateTabLabel = (tabLabel) => {
    this.setState({
      tabLabel,
    });
  };

  render() {
    let { match } = this.props;
    // let needDefaultSearch = options[this.props.match.params.moduleName] ? options[this.props.match.params.moduleName][0].needDefaultSearch : false;
    let needDefaultSearch = false;
    return (
      <Screen>
        <div style={{ margin: "8px" }}>
          <SearchForm match={match} needDefaultSearch={needDefaultSearch} updateTabLabel={this.updateTabLabel} />
          <ReportResult match={match} tabLabel={this.state.tabLabel} />
        </div>
      </Screen>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  setMetaData: (metaData) => {
    dispatch({ type: "SET_META_DATA", metaData });
  },
  setFlag: (flag) => {
    dispatch({ type: "SET_FLAG", flag });
  },
  showTable: (state) => {
    dispatch({ type: "SHOW_TABLE", state });
  },
  resetForm: () => {
    dispatch({ type: "RESET_FORM" });
  },
  setReportResult: (reportResult) => {
    dispatch({ type: "SHOW_TABLE", reportResult });
  },
  setLoadingStatus: (loadingStatus) => {
    dispatch({ type: "SET_LOADING_STATUS", loadingStatus });
  },
  toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
  toggleDailogAndSetText: (dailogState, msg) => {
    dispatch({ type: "TOGGLE_DAILOG_AND_SET_TEXT", dailogState, msg });
  },
  setForm: (required = [], pattern = []) => {
    dispatch({
      type: "SET_FORM",
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
