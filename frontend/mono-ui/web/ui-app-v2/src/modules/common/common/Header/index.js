import React, { Component } from "react";
import { connect } from "react-redux";
import IconButton from "material-ui/IconButton";
import { Icon } from "components";
import AppBar from "./components/AppBar";
import LogoutDialog from "./components/LogoutDialog";
import NavigationDrawer from "./components/NavigationDrawer";
import { logout } from "redux/auth/actions";
import { fetchLocalizationLabel } from "redux/app/actions";
import "./index.css";

// get userInfo role
class Header extends Component {
  state = {
    toggleMenu: false,
    logoutPopupOpen: false,
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

  _appBarProps = () => {
    const { isHomeScreen, hideBackButton } = this.props.options;
    const isComplaintType = /(complaint-type)\/?$/.test(window.location.pathname);

    const style = { overflowX: "hidden", width: "initial", overflowY: "hidden" };
    if (isComplaintType) {
      style.boxShadow = "none";
    }

    const iconElementLeft = (
      <div>
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

    return { style, iconElementLeft, onLeftIconButtonClick, isHomeScreen };
  };

  _handleItemClick = (item, index) => {
    const { route } = item;
    // close the navigation bar
    this._handleToggleMenu();
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
    const { toggleMenu, logoutPopupOpen } = this.state;
    const { _onUpdateMenuStatus, _handleItemClick, _logout, _closeLogoutDialog, _appBarProps } = this;
    const appBarProps = _appBarProps();
    const { className, role, cities, history, title, fetchLocalizationLabel, userInfo } = this.props;
    return (
      <div>
        <AppBar className={className} title={title} role={role} {...appBarProps} fetchLocalizationLabel={fetchLocalizationLabel} />
        <NavigationDrawer
          handleItemClick={_handleItemClick}
          onUpdateMenuStatus={_onUpdateMenuStatus}
          toggleMenu={toggleMenu}
          history={history}
          cities={cities}
          userInfo={userInfo}
          fetchLocalizationLabel={fetchLocalizationLabel}
          role={role && role === "citizen" ? "citizen" : "employee"}
        />
        <LogoutDialog logoutPopupOpen={logoutPopupOpen} closeLogoutDialog={_closeLogoutDialog} logout={_logout} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const cities = state.common.cities || [];
  return { cities };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    fetchLocalizationLabel: (locale) => dispatch(fetchLocalizationLabel(locale)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
