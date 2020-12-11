import React from "react";

const Card = (props) => {
  const userType = Digit.SessionStorage.get("userType");
  return (
    <div
      className={props.className ? props.className : userType === "employee" ? "employeeCard" : "card"}
      onClick={props.onClick}
      style={props.style}
    >
      {props.children}
    </div>
  );
};

export default Card;
