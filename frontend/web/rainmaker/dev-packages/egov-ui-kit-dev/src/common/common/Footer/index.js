import React, { Component } from "react";
import { connect } from "react-redux";
import { BottomNavigation, Icon } from "components";
import { navigationItems } from "./navigationItems";
import { setBottomNavigationIndex } from "egov-ui-kit/redux/app/actions";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

class Footer extends Component {
  state = {
    selectedIndex: 0,
  };

  _onTabChange = (tabIndex, role = "citizen") => {
    const route = navigationItems[role][tabIndex].route;
    this.props.setBottomNavigationIndex(tabIndex);
    if (route.length) this.props.history.push(route);
  };

  _bottomNavigationOptions = (role = "citizen") => {
    return navigationItems[role].map((item) => {
      const { label, icon } = item;
      const { action, name } = icon;
      return {
        ...item,
        label: <Label className="citizen-footer-text" fontSize="12px" label={label} color="#969696" />,
        icon: <Icon action={action} name={name} />,
      };
    });
  };

  render() {
    const { bottomNavigationIndex, role } = this.props;
    const { _onTabChange, _bottomNavigationOptions } = this;
    const options = _bottomNavigationOptions(role);
    return <BottomNavigation selectedIndex={bottomNavigationIndex} options={options} handleChange={(index) => _onTabChange(index, role)} />;
  }
}

const mapStateToProps = (state) => {
  const { bottomNavigationIndex } = state.app;
  return { bottomNavigationIndex };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomNavigationIndex: (index) => dispatch(setBottomNavigationIndex(index)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);
