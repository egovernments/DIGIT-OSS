import React from "react";
import PropTypes from "prop-types";
import { Tabs as MaterialUiTabs, Tab } from "material-ui/Tabs";

const tabItemContainerStyle = {
  position: "relative",
  zIndex: 1101,
  left: 0,
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 4px 4px 0px, rgba(0, 188, 209, 0.12) 0px 1px 4px 0px",
};

const inkBarStyle = {
  zIndex: 1101,
  backgroundColor: "#f89a3f",
};

const Tabs = ({ tabs = [] }) => {
  const renderTabs = () => {
    return tabs.map((tab, index) => {
      const { route, label, children } = tab;
      return (
        <Tab key={index} data-route={route} label={label}>
          {children}
        </Tab>
      );
    });
  };

  return (
    <MaterialUiTabs tabItemContainerStyle={tabItemContainerStyle} inkBarStyle={inkBarStyle}>
      {renderTabs()}
    </MaterialUiTabs>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.array,
  onActive: PropTypes.func,
};
export default Tabs;
