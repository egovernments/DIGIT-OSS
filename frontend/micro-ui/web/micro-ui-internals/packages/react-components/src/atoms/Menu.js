import React from "react";
import PropTypes from "prop-types";

const Menu = (props) => {
  const keyPrefix = props.localeKeyPrefix || "CS_ACTION";

  return (
    <div className="menu-wrap" style={props.style}>
      {props.options.map((option, index) => {
        return (
          <div key={index} onClick={() => props.onSelect(option)}>
            <p>{props.t ? props.t(Digit.Utils.locale.getTransformedLocale(option.forcedName || `${keyPrefix}_${props.optionKey ? option[props.optionKey] : option}`)) : option}</p>
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
