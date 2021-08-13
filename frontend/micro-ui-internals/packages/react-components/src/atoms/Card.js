import React from "react";
import { useLocation } from "react-router-dom";

const Card = ({ onClick, style, children, className, ReactRef, ...props }) => {
  const { pathname } = useLocation();
  const classname = Digit.Hooks?.fsm.useRouteSubscription(pathname) || "";
  const info = Digit.UserService?.getUser()?.info || null;
  const userType = info?.type || "CITIZEN";
  const isEmployee = classname === "employee" || userType === "EMPLOYEE";
  return (
    <div
      className={`${isEmployee ? "employeeCard" : "card"} ${className ? className : ""}`}
      onClick={onClick}
      style={style}
      {...props}
      ref={ReactRef}
    >
      {children}
    </div>
  );
};

export default Card;
