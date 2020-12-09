import React from "react";

const Card = (props) => {
  const employee = Digit.SessionStorage.get("user_type") === "employee" ? true : false;
  return (
    <div className={employee ? "employeeCard" : "card"} onClick={props.onClick}>
      {/* const userType = Digit.SessionStorage.get("userType");
  return (
    <div className={userType === "employee" ? "card-emp" : "card"} onClick={props.onClick}> */}
      {props.children}
    </div>
  );
};

export default Card;
