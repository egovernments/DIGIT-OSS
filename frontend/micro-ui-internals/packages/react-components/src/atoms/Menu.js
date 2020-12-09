import React from "react";
import PropTypes from "prop-types";

const Menu = (props) => {
  return (
    <div className="menu-wrap">
      {props.options.map((option, index) => {
        return (
          <div key={index} onClick={() => props.onSelect(option)}>
            <p>{option}</p>
          </div>
        );
      })}
    </div>
  );
};

Menu.propTypes = {
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};

Menu.defaultProps = {
  options: [],
  onSelect: () => {},
};

export default Menu;
