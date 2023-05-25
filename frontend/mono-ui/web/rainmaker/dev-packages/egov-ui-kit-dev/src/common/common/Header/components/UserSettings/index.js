import { DropDown, Icon, Image, List } from "components";
import { getTransformedLocale, getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import emptyFace from "egov-ui-kit/assets/images/download.png";
import { getLocale, getTenantId, setTenantId, getUserInfo, setStoredModulesList, setModule } from "egov-ui-kit/utils/localStorageUtils";
import React, { Component } from "react";
import LogoutDialog from "../LogoutDialog";
import { getQueryArg } from "egov-ui-kit/utils/commons";
import { CommonMenuItems } from "../NavigationDrawer/commonMenuItems";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { connect } from "react-redux";
import get from "lodash/get";
import { setRoute, setLocalizationLabels } from "egov-ui-kit/redux/app/actions";

import "./index.css";

class UserSettings extends Component {
  state = {
    languageSelected: getLocale(),
    displayAccInfo: false,
    tenantSelected: getTenantId(),
    tempTenantSelected: getTenantId(),
    open: false,
  };
  style = {
    baseStyle: {
      background: "#ffffff",
      height: "65px",
      marginRight: "30px",
      width: "98px",
      marginBottom: "24px",
    },
    label: {
      color: "#5F5C57",
      fontSize: "12px",
      paddingRight: "0px",
    },
    arrowIconStyle: {
      marginTop: "7px",
      marginLeft: "10px",
    },
    iconStyle: {
      marginRight: "30px",
    },
    listStyle: {
      display: "block",
    },
    listInnerDivStyle: {
      padding: "10px",
      display: "flex",
      alignItems: "center",
    },
    baseTenantStyle: {
      background: "#ffffff",
      height: "65px",
      marginRight: "30px",
      width: "102px",
      marginBottom: "24px",
    },
  };

  onChange = (event, index, value) => {
    this.setState({ ...this.state, languageSelected: value });
    this.props.fetchLocalizationLabel(value);
  };

  handleTenantChange = () => {
    let tenantSelected = this.state.tempTenantSelected;
    this.setState({ ...this.state, tenantSelected: tenantSelected });
    setTenantId(tenantSelected);
    this.props.setRoute("/");
  };

  onTenantChange = (event, index, value) => {
    if (location.pathname.includes("/inbox")) {
      this.setState({ ...this.state, tenantSelected: value });
      setTenantId(value);
      this.props.setRoute("/");
    } else {
      this.setState({ ...this.state, open: true, tempTenantSelected: value });
    }
  };

  handleClose = () => {
    this.setState({ ...this.state, open: false });
  };
  onLanguageChange = (event, index, value) => {
    //const {setRote} = this.props;
    this.setState({ languageSelected: value });
    let tenantId = getTenantId();

    if (process.env.REACT_APP_NAME === "Citizen") {
      const tenantInfo=getQueryArg(window.location.href, "tenantId")
      const userInfo = JSON.parse(getUserInfo());
      tenantId = userInfo && userInfo.permanentCity;
      tenantId = tenantInfo?tenantInfo:tenantId;
    }
    var resetList=[];
    var newList =JSON.stringify(resetList);
    setStoredModulesList(newList);
    let locale= getLocale();
    let resultArray=[];
    setLocalizationLabels(locale, resultArray);
    this.props.fetchLocalizationLabel(value, tenantId, tenantId);
  };

  // onUserChange = (event, index, value) => {
  //   const { setRoute } = this.props;


  //   setRoute(value);
  // }

  toggleAccInfo() {
    this.setState({
      displayAccInfo: !this.state.displayAccInfo,
    });
  }

  handleClose = event => {
    // if (this.anchorEl.contains(event.target)) {
    //   return;
    // }
    this.setState({ displayAccInfo: false });
  };

  render() {
    const { languageSelected, displayAccInfo, tenantSelected, open } = this.state;
    const { style } = this;
    const { onIconClick, userInfo, handleItemClick, hasLocalisation, languages, fetchLocalizationLabel, isUserSetting } = this.props;

    /**
     * Get All tenant id's from (user info -> roles) to populate dropdown
     */
    let tenantIdsList = get(userInfo, "roles", []).map((role) => {
      return role.tenantId;
    });
    tenantIdsList = [...new Set(tenantIdsList)];
    tenantIdsList = tenantIdsList.map((tenantId) => {
      return { value: tenantId, label: getLocaleLabels(tenantId, "TENANT_TENANTS_" + getTransformedLocale(tenantId)) };
    });

    return (
      <div className="userSettingsContainer">
        {isUserSetting && <LogoutDialog
          logoutPopupOpen={open}
          closeLogoutDialog={this.handleClose}
          logout={this.handleTenantChange}
          oktext={"CORE_CHANGE_TENANT_OK"}
          canceltext={"CORE_CHANGE_TENANT_CANCEL"}
          title={"CORE_CHANGE_TENANT"}
          body={"CORE_CHANGE_TENANT_DESCRIPTION"}
        />}
        {process.env.REACT_APP_NAME === "Employee" && isUserSetting && (
          <DropDown
            onChange={this.onTenantChange}
            listStyle={style.listStyle}
            style={style.baseTenantStyle}
            labelStyle={style.label}
            dropDownData={tenantIdsList}
            value={tenantSelected}
            underlineStyle={{ borderBottom: "none" }}
          />
        )}
        {hasLocalisation && (
          <DropDown
            onChange={this.onLanguageChange}
            listStyle={style.listStyle}
            style={style.baseStyle}
            labelStyle={style.label}
            dropDownData={languages}
            value={languageSelected}
            underlineStyle={{ borderBottom: "none" }}
          />
        )}

        {/* 
        <div>
          <Image width={"33px"} circular={true} source={userInfo.photo || emptyFace} />
          <DropDown
            onChange={this.onUserChange}
            listStyle={style.listStyle}
            style={style.baseStyle}
            labelStyle={style.label}
            dropDownData={CommonMenuItems}
            value={displayAccInfo}
            underlineStyle={{ borderBottom: "none" }}
          />
        </div> */}

        {/* <Icon action="social" name="notifications" color="#767676" style={style.iconStyle} /> */}
        <ClickAwayListener onClickAway={this.handleClose}>
          {isUserSetting && <div
            onClick={() => {
              this.toggleAccInfo();
            }}
            className="userSettingsInnerContainer"
          >
            <Image width={"33px"} circular={true} source={userInfo.photo || emptyFace} />
            <Icon action="navigation" name="arrow-drop-down" color="#767676" style={style.arrowIconStyle} />

            <div className="user-acc-info">
              {displayAccInfo ? (
                <List
                  opem
                  onItemClick={(item) => {
                    handleItemClick(item, false);
                  }}
                  innerDivStyle={style.listInnerDivStyle}
                  className="drawer-list-style"
                  items={CommonMenuItems}
                  listContainerStyle={{ background: "#ffffff" }}
                  listItemStyle={{ borderBottom: "1px solid #e0e0e0" }}
                />
              ) : (
                  ""
                )}
            </div>
          </div>}
        </ClickAwayListener>
      </div>
    );
  }
}

const mapStateToProps = ({ app,common }) => {
  const {locale}=app;
  const { stateInfoById } = common;
  let languages = get(stateInfoById, "0.languages", []);
  return { languages ,locale};
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRoute: (route) => dispatch(setRoute(route)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSettings);
