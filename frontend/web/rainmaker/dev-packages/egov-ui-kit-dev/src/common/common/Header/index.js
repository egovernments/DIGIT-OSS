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
    const { role, updateActiveRoute, userInfo } = this.props;
    const tenantId = role.toLowerCase() === "citizen" ? userInfo.permanentCity : getTenantId();

    if (role && role.toLowerCase() !== "citizen") {
      // const menupath = localStorageGet("menuPath");
      const ulbLogo = `https://s3.ap-south-1.amazonaws.com/pb-egov-assets/${tenantId}/logo.png`;
      // updateActiveRoute(menupath);
      this.setState({ ulbLogo });
    }
    if (tenantId) {
      const ulbLogo = `https://s3.ap-south-1.amazonaws.com/pb-egov-assets/${tenantId}/logo.png`;
      this.setState({ ulbLogo });
    }
    const menupath = localStorageGet("menuPath");
    const menuName = localStorageGet("menuName");
    updateActiveRoute(menupath, menuName);
  };

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

    const onLeftIconButtonClick = isHomeScreen ? this._handleToggleMenu : hideBackButton ? null : this._handleBackNavigation;
    const onToolBarIconClick = this._handleToggleMenu;

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
      hideDigitLogo,
    } = this.props;
    return (
      <div>
        <AppBar
          className={className}
          title={title ? title : headerTitle}
          ulbName={name}
          defaultTitle={defaultTitle}
          titleAddon={titleAddon}
          role={role}
          ulbLogo={this.state.ulbLogo}
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
          hideDigitLogo={hideDigitLogo}
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
  const { hideDigitLogo } = (state.common.stateInfoById && state.common.stateInfoById.length > 0 && state.common.stateInfoById[0]) || false;
  const { role } = ownProps;
  const tenantId = role && role.toLowerCase() === "citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
  const userTenant = cities.filter((item) => item.code === tenantId);
  const ulbGrade = userTenant && get(userTenant[0], "city.ulbGrade");
  const name = userTenant && get(userTenant[0], "code");
  const defaultTitle = ulbGrade && getUlbGradeLabel(ulbGrade);
  return { cities, defaultTitle, name, hideDigitLogo };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    fetchLocalizationLabel: (locale) => dispatch(fetchLocalizationLabel(locale)),
    updateActiveRoute: (routepath, menuName) => dispatch(updateActiveRoute(routepath, menuName)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
