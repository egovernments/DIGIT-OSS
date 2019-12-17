import React, { Component } from "react";
import { connect } from "react-redux";
import TableData from "./components/TableData";
import Label from "egov-ui-kit/utils/translationNode";
import ServiceList from "egov-ui-kit/common/common/ServiceList";
import FilterDialog from "./components/FilterDialog";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

const iconStyle = {
  width: "48px",
  height: "46.02px",
};

class Inbox extends Component {
  state = {
    actionList: [],
    hasWorkflow: false,
    filterPopupOpen : false
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

  render() {
    const { name, history ,setRoute , menu} = this.props;
    const { actionList, hasWorkflow } = this.state;
    const a = menu ? menu.filter(item => item.url === "quickAction") : [];
    const downloadMenu =a.map((obj,index) => {
      return {
        labelName:obj.displayName,
        labelKey:`ACTION_TEST_${obj.displayName.toUpperCase().replace(/[._:-\s\/]/g, "_")}`,
        link : () => setRoute(obj.navigationURL)
      }
    })
    const buttonItems = {
      label: "Take Action",
      rightIcon: "arrow_drop_down",
      props: { variant: "outlined", style: { marginRight: 15,
        backgroundColor:"#FE7A51",color:"#fff",border:"none",height:"48px",width :"200px" } },
      menu: downloadMenu
    }
    return (
      <div>
        <div className="rainmaker-topHeader" style={{marginTop : 30 , justifyContent : "space-between"}}>
          <div className="rainmaker-topHeader">
          <Label className="landingPageUser" label={"CS_LANDING_PAGE_WELCOME_TEXT"} />
          <Label className="landingPageUser" label={name} />
          </div>
          <div >
          <MenuButton data={buttonItems} />
          </div>
        </div>
        <div style={{margin : "16px 16px 0px 16px" }}>
          <ServiceList history={history} />
        </div>

        {hasWorkflow && <TableData onPopupOpen={this.onPopupOpen}/>}
        <FilterDialog   popupOpen={this.state.filterPopupOpen}  popupClose={this.handleClose}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, app } = state;
  const { menu } = app;
  const { userInfo } = auth;
  const name = auth && userInfo.name;

  return { name, menu };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRoute: url => dispatch(setRoute(url))
  };
}

export default connect(
  mapStateToProps,mapDispatchToProps
  )(Inbox);
