// import JkInbox from "@jagankumar-egov/react-tour/components/Inbox";
import Tooltip from '@material-ui/core/Tooltip';
import commonConfig from "config/common.js";
import JkInbox from "egov-inbox/components/Inbox";
import LoadingIndicator from "egov-ui-framework/ui-molecules/LoadingIndicator";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { addWflowFileUrl, getLocaleLabels, orderWfProcessInstances, transformById } from "egov-ui-framework/ui-utils/commons";
import ServiceList from "egov-ui-kit/common/common/ServiceList";
import { fetchLocalizationLabel, resetFetchRecords } from "egov-ui-kit/redux/app/actions";
import { httpRequest } from "egov-ui-kit/utils/api";
import { getLocale, getLocalization, getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import Label from "egov-ui-kit/utils/translationNode";
import { TaskDialog } from "egov-workflow/ui-molecules-local";
import React, { Component } from "react";
import { connect } from "react-redux";
import FilterDialog from "./components/FilterDialog";
import "./index.css";

let localizationLabels = transformById(
  JSON.parse(getLocalization(`localization_${getLocale()}`)),
  "code"
);
class Inbox extends Component {
  state = {
    dialogOpen: false,
    actionList: [],
    hasWorkflow: false,
    filterPopupOpen: false
  };
  constructor(props){
    super(props);
    /* RAIN-7250 Always Navigate to new UI Incase user clicks on Home  */
    window.location.href="/digit-ui/employee";
  }
  componentDidMount = () => {
    const { fetchLocalizationLabel } = this.props
    const tenantId = getTenantId();
    fetchLocalizationLabel(getLocale(), tenantId, tenantId);
  }
  componentWillUnmount = () => {
    const { resetFetchRecords } = this.props
    resetFetchRecords();
  }
  onDialogClose = () => {
    this.setState({
      dialogOpen: false,
    });
  };

  componentWillReceiveProps(nextProps) {
    const { menu } = nextProps;
    const workflowList = menu && menu.filter((item) => item.name === "rainmaker-common-workflow");
    if (workflowList && workflowList.length > 0) {
      this.setState({
        hasWorkflow: true,
      });
    } else {
      this.setState({
        hasWorkflow: false,
      });
    }

    const list = menu && menu.filter((item) => item.url === "card");
    this.setState({
      actionList: list,
    });
  }

  handleClose = () => {
    this.setState({ filterPopupOpen: false });
  };

  onPopupOpen = () => {
    this.setState({ filterPopupOpen: true });
  }
  getProcessIntanceData = async (pid) => {
    const tenantId = getTenantId();
    const queryObject = [
      { key: "businessIds", value: pid },
      { key: "history", value: true },
      { key: "tenantId", value: tenantId },
    ];
    const payload = await httpRequest("egov-workflow-v2/egov-wf/process/_search?", "", queryObject);
    const processInstances = payload && payload.ProcessInstances.length > 0 && orderWfProcessInstances(payload.ProcessInstances);
    return processInstances;
  };

  onHistoryClick = async (moduleNumber) => {
    const { prepareFinalObject } = this.props;
    const processInstances = await this.getProcessIntanceData(moduleNumber);
    let exclamationMarkIndex;
    if (processInstances && processInstances.length > 0) {
      processInstances.map((data, index) => {
        if (data.assigner && data.assigner.roles && data.assigner.roles.length > 0) {
          data.assigner.roles.map(role => {
            if (role.code === "AUTO_ESCALATE") return exclamationMarkIndex = index - 1;
          })
        }
      });
      if (exclamationMarkIndex) processInstances[exclamationMarkIndex].isExclamationMark = true;
    }
    if (processInstances && processInstances.length > 0) {
      await addWflowFileUrl(processInstances, prepareFinalObject);
      this.setState({
        dialogOpen: true,
      });
    } else {
      console.error("ERROR")
    }
  };


  render() {
    const { name, history, setRoute, menu, Loading, inboxLoading, inbox, loaded, mdmsGetLoading, errorMessage = "", error = false, ProcessInstances } = this.props;
    const { hasWorkflow } = this.state;
    const a = menu ? menu.filter(item => item.url === "quickAction") : [];
    const downloadMenu = a.map((obj, index) => {
      return {
        labelName: obj.displayName,
        labelKey: `ACTION_TEST_${obj.displayName.toUpperCase().replace(/[._:-\s\/]/g, "_")}`,
        link: () => {
          if (obj.navigationURL === "tradelicence/apply") {
            this.props.setRequiredDocumentFlag();
          }
          if (obj.navigationURL && obj.navigationURL.includes('digit-ui')) {
            window.location.href = obj.navigationURL;
            return;
          } else {
            setRoute(obj.navigationURL)
          }
        }
      }
    })
    const { isLoading } = Loading;
    const buttonItems = {
      label: { labelName: "Take Action", labelKey: "INBOX_QUICK_ACTION" },
      rightIcon: "arrow_drop_down",
      props: { variant: "outlined", style: { marginLeft: 5, marginRight: 15, marginTop: 10, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "40px", width: "200px" } },
      menu: downloadMenu
    }
    let user = { ...JSON.parse(localStorage.getItem("user-info")), auth: localStorage.getItem("token") };
    return (
      <div>
        <div className="rainmaker-topHeader" style={{ marginTop: 15, justifyContent: "space-between" }}>
          {mdmsGetLoading && <LoadingIndicator></LoadingIndicator>}
          <div className="rainmaker-topHeader flex">
            <Label className="landingPageHeader flex-child" label={"CS_LANDING_PAGE_WELCOME_TEXT"} />
            <Label className="landingPageUser flex-child" label={name} />,
          </div>
          <div className="quick-action-button">
            <MenuButton data={buttonItems} />
          </div>
        </div>
        <div className={"inbox-service-list"}>
          <ServiceList history={history} />
        </div>
        {hasWorkflow && inboxLoading && <div>
          <div className="jk-spinner-wrapper">
            <div className="jk-inbox-loader"></div>
          </div>
          <div className="jk-spinner-wrapper">
            <Label label={"CS_INBOX_LOADING_MSG"} />
          </div>
        </div>}
        {!hasWorkflow && !mdmsGetLoading && errorMessage != "" && error && <div>
          <div className="jk-spinner-wrapper">
            <Label label={errorMessage} />
          </div>
        </div>}

        {hasWorkflow && <JkInbox user={{ ...user, permanentCity: commonConfig.tenantId }}
          historyClick={this.onHistoryClick}
          t={(key) => {
            return getLocaleLabels("", key, localizationLabels);
          }}
          historyComp={<div onClick={() => { }} style={{ cursor: "pointer" }}>
            <i class="material-icons">history</i>
          </div>}
          esclatedComp={<Tooltip title={getLocaleLabels("COMMON_INBOX_TAB_ESCALATED", "COMMON_INBOX_TAB_ESCALATED", localizationLabels)} placement="top">
            <span> <i class="material-icons" style={{ color: "rgb(244, 67, 54)" }}>error</i> </span>
          </Tooltip>}
        >

        </JkInbox>}
        {/* {hasWorkflow && !inboxLoading && loaded && <TableData onPopupOpen={this.onPopupOpen} workflowData={inbox} />} */}
        <FilterDialog popupOpen={this.state.filterPopupOpen} popupClose={this.handleClose} />
        <TaskDialog open={this.state.dialogOpen} onClose={this.onDialogClose} history={ProcessInstances} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, app, screenConfiguration } = state;
  const { menu, inbox, actionMenuFetch } = app;
  const { loading: inboxLoading, loaded } = inbox || { };
  const { userInfo } = auth;
  const name = auth && userInfo.name;
  const { preparedFinalObject } = screenConfiguration;
  const { Loading = { }, workflow } = preparedFinalObject;
  const { isLoading } = Loading;
  const { ProcessInstances } = workflow || [];
  const { loading: mdmsGetLoading = false, errorMessage = "", error } = actionMenuFetch;
  return { name, menu, Loading, isLoading, inboxLoading, inbox, loaded, mdmsGetLoading, errorMessage, error, ProcessInstances };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRoute: url => dispatch(setRoute(url)),
    fetchLocalizationLabel: (locale, tenantId, module) => dispatch(fetchLocalizationLabel(locale, tenantId, module)),
    setRequiredDocumentFlag: () => dispatch(prepareFinalObject("isRequiredDocuments", true)),
    resetFetchRecords: () => dispatch(resetFetchRecords()),
    prepareFinalObject: (path, value) => dispatch(prepareFinalObject(path, value)),
  };
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(Inbox);
