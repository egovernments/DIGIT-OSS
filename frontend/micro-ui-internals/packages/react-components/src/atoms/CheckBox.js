import React from "react";
import { CheckSvg } from "./svgindex";

const CheckBox = ({ onChange, label, ref, ...props }) => {
  return (
    <div className="checkbox-wrap">
      <input type="checkbox" onChange={onChange} value={label} {...props} ref={ref} />
      <p className="custom-checkbox">
        {/* <img src={check} alt="" /> */}
        <CheckSvg />
      </p>
      <p className="label">{label}</p>
    </div>
  );
};

export default CheckBox;
