import React from "react";

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

export default Menu;
