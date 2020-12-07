import React from "react";

const Card = (props) => {
  const userType = Digit.SessionStorage.get("userType");
  return (
    <div className={userType === "employee" ? "card-emp" : "card"} onClick={props.onClick}>
      {props.children}
    </div>
  );
};

export default Card;
