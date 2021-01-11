import { Icon } from "components";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { logout } from "egov-ui-kit/redux/auth/actions";
import { getModuleName, getQueryArg } from "egov-ui-kit/utils/commons";
import Label from "egov-ui-kit/utils/translationNode";
import { ActionMenu, Header } from "modules/common";
import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import SortDialog from "../common/common/Header/components/SortDialog";
import { getLocale, getStoredModulesList, getTenantId, getUserInfo, setModule, setStoredModulesList } from "../utils/localStorageUtils";
import "./index.css";
import withData from "./withData";

const withAuthorization = (options = {}) => (Component) => {
  class Wrapper extends React.Component {
    constructor(props) {
      super(props);
      if (typeof androidAppProxy !== "undefined" && window.androidAppProxy.smsReceiverRunning()) {
        window.androidAppProxy.stopSMSReceiver();
      }
    }
    state = {
      titleAddon: "",
      titleObject: [],
      sortPopOpen: false,
      menuDrawerOpen: true,
      localeFetched: false
    };
    style = {
      iconStyle: {
        height: "30px",
        width: "30px",
      },
    };

    componentWillMount() {
      const { authenticated, hasLocalisation, defaultUrl } = this.props;
      const { redirectionUrl } = options;
      if (!authenticated && !getQueryArg("", "smsLink")) {
        const baseUrl = hasLocalisation ? "/language-selection" : process.env.REACT_APP_NAME === "Citizen" ? defaultUrl.citizen : defaultUrl.employee;
        this.props.history.replace(redirectionUrl || baseUrl);
      }
    }

    citizenTenantId = () => {
      const userInfo = JSON.parse(getUserInfo());
      return userInfo.permanentCity || userInfo.tenantId;
    }

    fetchLocale = () => {
      var storedModuleList = [];
      if (getStoredModulesList() !== null) {
        storedModuleList = JSON.parse(getStoredModulesList());
      }
      if (storedModuleList.includes(getModuleName()) === false) {
        setModule(getModuleName());
        storedModuleList.push(getModuleName());
        var newList = JSON.stringify(storedModuleList);
        setStoredModulesList(newList);
        const tenantId = process.env.REACT_APP_NAME === "Citizen" ? this.citizenTenantId() : getTenantId();
        this.props.fetchLocalizationLabel(getLocale(), tenantId, tenantId, true);
        this.setState({ localeFetched: true });
      }
    }

    componentWillReceiveProps() {
      this.fetchLocale();
    }

    roleFromUserInfo = (userInfo, role) => {
      const roleCodes =
        userInfo && userInfo.roles
          ? userInfo.roles.map((role) => {
            return role.code;
          })
          : [];
      return roleCodes && roleCodes.length && roleCodes.indexOf(role) > -1 ? true : false;
    };

    renderCustomTitle = (numberOfComplaints) => {
      const titleAddon = numberOfComplaints ? `(${numberOfComplaints})` : "";
      this.setState({ titleAddon });
    };

    closeSortDialog = () => {
      this.setState({
        sortPopOpen: false,
      });
    };

    onSortClick = () => {
      this.setState({
        sortPopOpen: true,
      });
    };
    //Duplication due to lack of time for proper testing in PGR

    renderCustomTitleForPt = (obj) => {
      const { title, titleObject } = obj || {};
      if (title) {
        // const titleAddon = title ? title : "";
        this.setState({ titleAddon });
      } else if (titleObject) {
        this.setState({ titleObject });
      }
    };
    toggleDrawer(menuClick) {
      this.setState({
        menuDrawerOpen: menuClick ? true : !this.state.menuDrawerOpen,
      });
    }
    render() {
      const {
        hideHeader,
        hideFooter,
        customTitle,
        customFor,
        hideFor,
        title,
        isHomeScreen,
        hideTitle,
        titleBackground,
        hideActionMenu,
        refreshButton,
        sortButton,
        searchButton,
        helpButton,
        notificationButton,
        showNumberOfComplaints,
      } = options;
      const { history, authenticated, userInfo, complaints, hasLocalisation } = this.props;
      const { titleAddon, titleObject, menuDrawerOpen } = this.state;
      const { style } = this;
      const role = this.roleFromUserInfo(userInfo, "CITIZEN")
        ? "citizen"
        : this.roleFromUserInfo(userInfo, "GRO") || this.roleFromUserInfo(userInfo, "DGRO")
          ? "ao"
          : this.roleFromUserInfo(userInfo, "CSR")
            ? "csr"
            : this.roleFromUserInfo(userInfo, "EMPLOYEE")
              ? "employee"
              : this.roleFromUserInfo(userInfo, "PGR-ADMIN")
                ? "pgr-admin"
                : "";

      //For restricting citizen to access employee url

      if (process.env.NODE_ENV === "production") {
        const _role = role === "citizen" ? "citizen" : "employee";
        if (window.basename.slice(1).toLowerCase() !== _role) {
          this.props.logout();
        }
      }
      const getUserRole = () => {
        let { userInfo } = this.props;
        return (userInfo && userInfo.roles && userInfo.roles.length > 0 && userInfo.roles[0].code.toUpperCase()) || null;
      };
      let drawerClsName = menuDrawerOpen ? "full-menu-drawer" : "icon-menu-drawer";
      let screencls = menuDrawerOpen ? "with-full-menu" : "with-icon-menu";
      return (
        <div className="rainmaker-header-cont" style={{ position: "relative" }}>
          {!hideHeader && authenticated ? (
            <Header
              title={title}
              titleAddon={role !== hideFor && titleAddon && titleAddon}
              //titleObject={role !== hideFor && titleObject && titleObject}
              hasLocalisation={hasLocalisation}
              userInfo={userInfo}
              role={role}
              options={options}
              history={history}
              refreshButton={refreshButton}
              sortButton={sortButton}
              searchButton={searchButton}
              helpButton={helpButton}
              notificationButton={notificationButton}
              //className={isHomeScreen&&process.env.REACT_APP_NAME==="Citizen" ? "rainmaker-header-home-small-screen" : "rainmaker-header"}
              className={"rainmaker-header"}
            />
          ) : null}
          <div className=" col-xs-12" style={{ padding: 0 }}>
            {!hideActionMenu && authenticated && (
              <div>
                <div className={`col-xs-2 action-menu-drawer show-action-menu ${drawerClsName}`} id="menu-container">
                  <div className="rainmaker-action-menu">
                    <ActionMenu
                      role={role}
                      toggleDrawer={(menuItmeClick = true) => {
                        this.toggleDrawer(menuItmeClick);
                      }}
                      menuDrawerOpen={menuDrawerOpen}
                    />
                  </div>
                </div>
                <div className="col-xs-2  show-action-menu" /> {/*Dummy div for proper alignment - fixed positioning drawbacks*/}
              </div>
            )}

            <div className={`col-xs-12 col-sm-10 ${screencls}`} style={{ padding: 0 }}>
              {authenticated ? (
                <div>
                  {!hideTitle && role !== hideFor && (
                    <div>
                      <div className={"screen-title-label col-xs-8"} style={{ padding: "24px 0 8px 16px" }}>
                        <Label
                          className={titleBackground ? "title-white-background screen-title-label" : "screen-title-label"}
                          label={role === customFor ? customTitle : title}
                          containerStyle={{ marginRight: 3 }}
                          dark={true}
                          bold={true}
                          fontSize={20}
                        />
                        {titleAddon && (
                          <Label
                            className={titleBackground ? "title-white-background screen-title-label" : "screen-title-label"}
                            label={titleAddon}
                            dark={true}
                            bold={true}
                            fontSize={20}
                          />
                        )}
                        {titleObject && (
                          <div className="rainmaker-displayInline">
                            {titleObject.map((item) => {
                              return (
                                <Label
                                  className={titleBackground ? "title-white-background screen-title-label" : "screen-title-label"}
                                  label={item}
                                  dark={true}
                                  bold={true}
                                  fontSize={20}
                                  containerStyle={{ marginRight: 5 }}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {sortButton && (
                        <div className="sort-button col-xs-4" style={{ padding: "20px 20px 0px 0px" }}>
                          <div
                            className="rainmaker-displayInline"
                            style={{ cursor: "pointer", justifyContent: "flex-end" }}
                            onClick={this.onSortClick}
                          >
                            <Label
                              label="ES_SORT_BUTTON"
                              color="rgba(0, 0, 0, 0.8700000047683716)"
                              containerStyle={{ marginRight: 5 }}
                              labelStyle={{ fontWeight: 500 }}
                            />
                            <Icon style={style.iconStyle} action="action" name="swap-vert" color="#484848" />
                          </div>
                          <SortDialog sortPopOpen={this.state.sortPopOpen} closeSortDialog={this.closeSortDialog} />
                        </div>
                      )}
                    </div>
                  )}
                  <Component
                    {...this.props}
                    title={title}
                    renderCustomTitleForPt={this.renderCustomTitleForPt}
                    renderCustomTitle={this.renderCustomTitle}
                  />
                </div>
              ) : null}
            </div>
          </div>
          {/* {!hideFooter && authenticated ? (
            <div className="hidden-md hidden-sm hidden-lg">
              <Footer history={history} role={role} />
            </div>
          ) : null} */}
        </div>
      );
    }
  }

  const mapStateToProps = (state) => {
    let { authenticated, userInfo } = state.auth;
    let { stateInfoById } = state.common || [];
    let hasLocalisation = false;
    let defaultUrl = process.env.REACT_APP_NAME === "Citizen" ? "/user/register" : "/user/login";
    // userInfo = typeof userInfo === "string" ? JSON.parse(userInfo) : userInfo;
    if (stateInfoById && stateInfoById.length > 0) {
      hasLocalisation = stateInfoById[0].hasLocalisation;
      defaultUrl = stateInfoById[0].defaultUrl;
    }
    const { complaints } = state || {};
    return { authenticated, userInfo, hasLocalisation, defaultUrl };
  };
  const mapDispatchToProps = (dispatch) => {
    return {
      logout: () => dispatch(logout()),
      fetchLocalizationLabel: (locale, moduleName, tenantId, isFromModule) => dispatch(fetchLocalizationLabel(locale, moduleName, tenantId, isFromModule))
    };
  };
  return compose(
    withData,
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
  )(Wrapper);
};

export default withAuthorization;
