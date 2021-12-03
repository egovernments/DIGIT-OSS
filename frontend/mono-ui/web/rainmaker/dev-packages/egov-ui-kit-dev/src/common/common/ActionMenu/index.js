import React, { Component } from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import ActionMenuComp from "../ActionMenu/components";
import "./index.css";
import { fetchActionItems, updateActiveRoute } from "egov-ui-kit/redux/app/actions";
import { getUserInfo, getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";

class ActionMenu extends Component {
  componentDidMount = async () => {
    let userInfo = JSON.parse(getUserInfo());
    let { fetchActionMenu } = this.props;
    const roles = get(userInfo, "roles");
    let roleCodes = roles
      ? roles.map((role) => {
          if (role.tenantId == getTenantId()) {
            return role.code;
          }
        })
      : [];

      const bpaRolesArray = ["BPA_ARCHITECT", "BPA_ENGINEER", "BPA_BUILDER", "BPA_STRUCTURALENGINEER", "BPA_TOWNPLANNER", "BPA_SUPERVISOR"];
      
      let citizenRoles = ["CITIZEN"];
      if (process.env.REACT_APP_NAME === "Citizen") {
        let rolesArray = ["CITIZEN"];
        roles.map(data => { if(bpaRolesArray.includes(data.code)) return rolesArray.push(data.code); })
        if (rolesArray.length > 1) citizenRoles = rolesArray;
        else citizenRoles
      }
      roleCodes=process.env.REACT_APP_NAME === "Citizen" ? citizenRoles :roleCodes ;
      
    await fetchActionMenu(
      {
        roleCodes: roleCodes,
        tenantId: commonConfig.tenantId,
        actionMaster: "actions-test",
        enabled: true,
      },
      {
        ts: new Date().getTime(),
      }
    );
  };

  render() {
    let { actionListArr, activeRoutePath, updateActiveRoute, toggleDrawer, menuDrawerOpen } = this.props;
    let transformedRole = "";
    // actionListArr.push({url:"https://www.google.com",navigationURL:"newTab",path:"test.new tab"});
    return actionListArr && actionListArr.length > 0 ? (
      <ActionMenuComp
        role={transformedRole}
        actionListArr={actionListArr}
        activeRoutePath={activeRoutePath}
        toggleDrawer={toggleDrawer}
        menuDrawerOpen={menuDrawerOpen}
        updateActiveRoute={updateActiveRoute}
      />
    ) : null;
  }
}

const mapStateToProps = ({ app }) => {
  const actionListArr = app.menu || [];
  const activeRoutePath = app.activeRoutePath;
  actionListArr.map(item=>{if(item.id==2024){
    item.path= "bill-amend"
  }})
  return { actionListArr, activeRoutePath };
};

const mapDispatchToProps = (dispatch) => ({
  handleToggle: (showMenu) => dispatch({ type: "MENU_TOGGLE", showMenu }),
  setRoute: (route) => dispatch({ type: "SET_ROUTE", route }),
  fetchActionMenu: (role, ts) => dispatch(fetchActionItems(role, ts)),
  updateActiveRoute: (routepath, routeName) => dispatch(updateActiveRoute(routepath, routeName)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionMenu);
