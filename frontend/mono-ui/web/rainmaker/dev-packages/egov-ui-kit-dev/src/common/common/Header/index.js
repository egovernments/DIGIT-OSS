import React, { Component } from "react";
import { connect } from "react-redux";
import IconButton from "material-ui/IconButton";
import { Icon } from "components";
import AppBar from "./components/AppBar";
import LogoutDialog from "./components/LogoutDialog";
import SortDialog from "./components/SortDialog";
import NavigationDrawer from "./components/NavigationDrawer";
import { logout } from "egov-ui-kit/redux/auth/actions";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import get from "lodash/get";
import "./index.css";
import { updateActiveRoute } from "egov-ui-kit/redux/app/actions";
import commonConfig from "config/common.js";
import { getTenantId, getUserInfo, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";

// get userInfo role
class Header extends Component {
  state = {
    toggleMenu: false,
    logoutPopupOpen: false,
    sortPopOpen: false,
    right: false,
    left: false,
    ulbLogo: "",
  };

  componentDidMount = () => {
    const { updateActiveRoute } = this.props;
    const menupath = localStorageGet("menuPath");
    const menuName = localStorageGet("menuName");
    updateActiveRoute(menupath, menuName);
  };

  componentWillReceiveProps = (nextProps) => {
    const { role, userInfo } = this.props;
    const permanentCity = get(nextProps, "userInfo.permanentCity");
    if (get(userInfo ,"permanentCity") !== get(nextProps, "userInfo.permanentCity")) {
      const tenantId = role.toLowerCase() === "citizen" ? (permanentCity?permanentCity:commonConfig.tenantId) : getTenantId();
      const ulbLogo = `https://s3.ap-south-1.amazonaws.com/pb-egov-assets/${tenantId}/logo.png`;
      this.setState({ ulbLogo });
    }
   
  }

  _handleToggleMenu = () => {
    const { toggleMenu } = this.state;
    this.setState({
      toggleMenu: !toggleMenu,
    });
  };

  //header related actions
  _onUpdateMenuStatus = (status) => {
    this.setState({
      toggleMenu: status,
    });
  };

  _handleBackNavigation = () => {
    this.props.history.goBack();
  };

  _handleBackToHome= () => {
    this.props.history.push('/');
  };


  _logout = () => {
    this._closeLogoutDialog();
    this.props.logout();
  };

  _closeLogoutDialog = () => {
    this.setState({
      logoutPopupOpen: false,
    });
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

  _appBarProps = () => {
    const { isHomeScreen, hideBackButton } = this.props.options;
    const isComplaintType = /(complaint-type)\/?$/.test(window.location.pathname);

    const style = { overflowX: "hidden", width: "initial", overflowY: "hidden" };
    if (isComplaintType) {
      style.boxShadow = "none";
    }

    const iconElementLeft = (
      <div className="appbar-left-icon">
        <IconButton id="icon-hamburger">
          {isHomeScreen ? (
            <Icon id="icon-hamburger" action="custom" name="hamburger" />
          ) : hideBackButton ? null : (
            <Icon id="back-navigator" action="navigation" name="arrow-back" />
          )}
        </IconButton>
      </div>
    );

    let  onLeftIconButtonClick = isHomeScreen ? this._handleToggleMenu : hideBackButton ? null : this._handleBackNavigation;
    const onToolBarIconClick = this._handleToggleMenu;
    let pathname=window.location.pathname;
    onLeftIconButtonClick= pathname&&(pathname.includes('/property-tax')||pathname.includes('/home'))?this._handleBackToHome:onLeftIconButtonClick;
    return { style, iconElementLeft, onLeftIconButtonClick, onToolBarIconClick, isHomeScreen };
  };

  _handleItemClick = (item, toggleMenu) => {
    const { route } = item;
    // close the navigation bar
    toggleMenu && this._handleToggleMenu();
    //updating route poth in reducerxxxx
    if (item.path) {
      this.props.updateActiveRoute(item.path, item.path);
    }
    // this logic is a bit shaky!! might break in future
    switch (route.slice(1)) {
      case "logout":
        this.setState({
          logoutPopupOpen: true,
        });
        break;
      case "language-selection":
        break;
      default:
        this.props.history.push(route);
        break;
    }
  };

  render() {
    const { toggleMenu, logoutPopupOpen, sortPopOpen } = this.state;
    const { _onUpdateMenuStatus, _handleItemClick, _logout, _closeLogoutDialog, _appBarProps, closeSortDialog, onSortClick } = this;
    const appBarProps = _appBarProps();
    const {
      className,
      role,
      cities,
      name,
      history,
      title,
      headerTitle,
      titleAddon,
      fetchLocalizationLabel,
      userInfo,
      isHomeScreen,
      defaultTitle,
      refreshButton,
      sortButton,
      searchButton,
      helpButton,
      notificationButton,
      activeRoutePath,
      hasLocalisation,
      notificationsCount,
      isUserSetting = true,
      msevaLogo,
      headerStyle
    } = this.props;
    const tenantId = role.toLowerCase() === "citizen" ? userInfo.permanentCity : getTenantId();
    const currentCity = cities.filter((item) => item.code === tenantId);
    const ulbLogo =
      currentCity.length > 0 ? get(currentCity[0], "logoId") : "https://s3.ap-south-1.amazonaws.com/pb-egov-assets/pb.amritsar/logo.png";
    return (
      <div style={headerStyle}>
        <AppBar
          className={className}
          title={title ? title : headerTitle}
          ulbName={name}
          defaultTitle={defaultTitle}
          titleAddon={titleAddon}
          role={role}
          ulbLogo={isUserSetting === false ? msevaLogo : ulbLogo}
          {...appBarProps}
          fetchLocalizationLabel={fetchLocalizationLabel}
          userInfo={userInfo}
          refreshButton={refreshButton}
          sortButton={sortButton}
          searchButton={searchButton}
          helpButton={helpButton}
          notificationButton={notificationButton}
          sortDialogOpen={onSortClick}
          history={this.props.history}
          handleItemClick={_handleItemClick}
          activeRoutePath={activeRoutePath}
          hasLocalisation={hasLocalisation}
          notificationsCount={notificationsCount}
          isUserSetting={isUserSetting}
        />
        <NavigationDrawer
          handleItemClick={_handleItemClick}
          onUpdateMenuStatus={_onUpdateMenuStatus}
          toggleMenu={toggleMenu}
          history={history}
          cities={cities}
          userInfo={userInfo}
          fetchLocalizationLabel={fetchLocalizationLabel}
          role={role && role === "citizen" ? "citizen" : "employee"}
          isCSR={role === "csr" ? true : false}
          isCSR={role === "pgr-admin" ? true : false}
          openSecondary={window.innerWidth >= 768 ? true : false}
          width={300}
          containerStyle={{ zIndex: 1999 }}
          isUserSetting={isUserSetting}
        />
        <LogoutDialog
          logoutPopupOpen={logoutPopupOpen}
          closeLogoutDialog={_closeLogoutDialog}
          logout={_logout}
          oktext={"CORE_LOGOUTPOPUP_LOGOUT"}
          canceltext={"CORE_LOGOUTPOPUP_CANCEL"}
          title={"CORE_COMMON_LOGOUT"}
          body={"CORE_LOGOUTPOPUP_CONFIRM"}
        />
        <SortDialog sortPopOpen={sortPopOpen} closeSortDialog={closeSortDialog} />
      </div>
    );
  }
}

const getUlbGradeLabel = (ulbGrade) => {
  if (ulbGrade) {
    let ulbWiseHeaderName = ulbGrade.toUpperCase();
    if (ulbWiseHeaderName.indexOf(" ") > 0) {
      ulbWiseHeaderName = ulbWiseHeaderName.split(" ").join("_");
    }
    return "ULBGRADE" + "_" + ulbWiseHeaderName;
  }
};

const mapStateToProps = (state, ownProps) => {
  const cities = state.common.cities || [];
  const notificationsCount = get(state.app, "notificationsCount");
  const { role } = ownProps;
  const tenantId = role && role.toLowerCase() === "citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
  const userTenant = cities.filter((item) => item.code === tenantId);
  const ulbGrade = userTenant && get(userTenant[0], "city.ulbGrade");
  const name = userTenant && get(userTenant[0], "code");
  const defaultTitle = ulbGrade && getUlbGradeLabel(ulbGrade);
  const screenKey = window.location.pathname.split("/").pop();
  const headerTitle = get(state.screenConfiguration.screenConfig, `${screenKey}.components.div.children.header.children.key.props.labelKey`);
  return { cities, defaultTitle, name, headerTitle, notificationsCount };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    fetchLocalizationLabel: (locale,tenants,tenant) => dispatch(fetchLocalizationLabel(locale,tenants,tenant)),
    updateActiveRoute: (routepath, menuName) => dispatch(updateActiveRoute(routepath, menuName)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
