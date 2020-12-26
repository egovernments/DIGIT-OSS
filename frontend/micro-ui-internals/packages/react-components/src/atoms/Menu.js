import React from "react";
import PropTypes from "prop-types";

const Menu = (props) => {
  return (
    <div className="menu-wrap">
      {props.options.map((option, index) => {
        return (
          <div key={index} onClick={() => props.onSelect(option)}>
            <p>{props.t ? props.t(`CS_ACTION_${option}`) : option}</p>
          </div>
        );
      })}
    </div>
  );
};

Menu.propTypes = {
  options: PropTypes.array,
  onSelect: PropTypes.func,
};

Menu.defaultProps = {
  options: [],
  onSelect: () => {},
};

export default Menu;
