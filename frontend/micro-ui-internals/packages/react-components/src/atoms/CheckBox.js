import React from "react";
import { CheckSvg } from "./svgindex";

const CheckBox = ({ onChange, label, ref, ...props }) => {
  const userType = Digit.SessionStorage.get("userType");
  return (
    <div className="checkbox-wrap">
      <input type="checkbox" className={userType === "employee" ? "input-emp" : ""} onChange={onChange} value={label} {...props} ref={ref} />
      <p className="" className={userType === "employee" ? "custom-checkbox-emp" : "custom-checkbox"}>
        {/* <img src={check} alt="" /> */}
        <CheckSvg />
      </p>
      <p className="label">{label}</p>
    </div>
  );
};

export default CheckBox;
