import React from "react";

const Card = (props) => {
  return (
    <div className={props.className ? props.className : "card"} onClick={props.onClick} style={props.style}>
      {/* const userType = Digit.SessionStorage.get("userType");
  return (
    <div className={userType === "employee" ? "card-emp" : "card"} onClick={props.onClick}> */}
      {props.children}
    </div>
  );
};

export default Card;
