import React, { Component } from "react";
import { connect } from "react-redux";
import TableData from "./components/TableData";
import Label from "egov-ui-kit/utils/translationNode";
import ServiceList from "egov-ui-kit/common/common/ServiceList";
import FilterDialog from "./components/FilterDialog";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getTenantId, getLocale } from "egov-ui-kit/utils/localStorageUtils";
import LoadingIndicator from "egov-ui-framework/ui-molecules/LoadingIndicator";
import "./index.css";

class Inbox extends Component {
  state = {
    actionList: [],
    hasWorkflow: false,
    filterPopupOpen: false
  };

  componentDidMount = () => {
    const {fetchLocalizationLabel} = this.props
    const tenantId = getTenantId();
    fetchLocalizationLabel(getLocale(), tenantId, tenantId);
  }

 
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

  render() {
    const { name, history, setRoute, menu,Loading } = this.props;
    const { actionList, hasWorkflow } = this.state;
    const a = menu ? menu.filter(item => item.url === "quickAction") : [];
    const downloadMenu = a.map((obj, index) => {
      return {
        labelName: obj.displayName,
        labelKey: `ACTION_TEST_${obj.displayName.toUpperCase().replace(/[._:-\s\/]/g, "_")}`,
        link: () => setRoute(obj.navigationURL)
      }
    })
    const {isLoading}=Loading;
    const buttonItems = {
      label: { labelName: "Take Action", labelKey: "INBOX_QUICK_ACTION" },
      rightIcon: "arrow_drop_down",
      props: { variant: "outlined", style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "200px" } },
      menu: downloadMenu
    }
        
    return (
      <div>
        <div className="rainmaker-topHeader" style={{ marginTop: 15, justifyContent: "space-between" }}>
        {Loading&&isLoading&&<LoadingIndicator></LoadingIndicator>}
          <div className="rainmaker-topHeader flex">
            <Label className="landingPageHeader" label={"CS_LANDING_PAGE_WELCOME_TEXT"} />
            <Label className="landingPageUser" label={name} />,
          </div>
          <div className="quick-action-button">
            <MenuButton data={buttonItems} />
          </div>
        </div>
        <div style={{ margin: "16px 16px 0px 16px" }}>
          <ServiceList history={history} />
        </div>

        {hasWorkflow && <TableData onPopupOpen={this.onPopupOpen} />}
        <FilterDialog popupOpen={this.state.filterPopupOpen} popupClose={this.handleClose} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, app ,screenConfiguration} = state;
  const { menu } = app;
  const { userInfo } = auth;
  const name = auth && userInfo.name;
  const { preparedFinalObject } = screenConfiguration;
  const { Loading={}} = preparedFinalObject;
  const {isLoading}=Loading;
  return { name, menu ,Loading,isLoading};
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRoute: url => dispatch(setRoute(url)),
    fetchLocalizationLabel: (locale,tenantId,module) => dispatch(fetchLocalizationLabel(locale,tenantId,module)),
  };
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(Inbox);
