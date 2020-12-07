import React from "react";

const Card = (props) => {
  const employee = Digit.SessionStorage.get("user_type") === "employee" ? true : false;
  return (
    <div className={employee ? "employeeCard" : "card"} onClick={props.onClick}>
      {props.children}
    </div>
  );
};

export default Card;
