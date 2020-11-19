import React from "react";

const Menu = (props) => {
  return (
    <div className="menu-wrap">
      {props.options.map((option, index) => {
        return (
          <div key={index}>
            <p>{option}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Menu;
