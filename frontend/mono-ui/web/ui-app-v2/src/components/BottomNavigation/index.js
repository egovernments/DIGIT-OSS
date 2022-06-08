import React from "react";
import PropTypes from "prop-types";
import { BottomNavigation as MaterialUiBottomNavigation, BottomNavigationItem } from "material-ui/BottomNavigation";
import "./index.css";

const BottomNavigation = ({ className, style = {}, options, handleChange, selectedIndex, id }) => (
  <MaterialUiBottomNavigation className={`${className} bottom-navigation`} style={style} selectedIndex={selectedIndex}>
    {options.map((item, index) => (
      <BottomNavigationItem id={item.id} key={index} label={item.label} icon={item.icon} onClick={() => handleChange(index)} />
    ))}
  </MaterialUiBottomNavigation>
);

BottomNavigation.propTypes = {
  style: PropTypes.object,
  selectedIndex: PropTypes.number,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
      icon: PropTypes.node,
      route: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleChange: PropTypes.func,
};

export default BottomNavigation;
