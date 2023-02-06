import React from "react";
import { CheckSvg } from "./svgindex";
import PropTypes from "prop-types";

const CheckBox = ({ onChange, label, value, disable, ref, checked, inputRef, pageType, style, index, isLabelFirst,  ...props }) => {
  const userType = pageType || Digit.SessionStorage.get("userType");
  let wrkflwStyle = props.styles;
  if (isLabelFirst) {
    return (
      <div className="checkbox-wrap" style={wrkflwStyle ? wrkflwStyle : {}}>
        <p style={style ? style : null}> {index+1}.</p>
        <p className="label" style={{maxWidth: "80%", marginLeft: "10px"}}>
          {label}
        </p>
        <div>
          <input
            type="checkbox"
            className={userType === "employee" ? "input-emp" : ""}
            onChange={onChange}
            style={{ cursor: "pointer", left: "90%" }}
            value={value || label}
            {...props}
            ref={inputRef}
            disabled={disable}
            checked={checked}
          />
          <p className={userType === "employee" ? "custom-checkbox-emp" : "custom-checkbox"} style={disable ? { opacity: 0.5 } : {left: "90%"}}>
            <CheckSvg />
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="checkbox-wrap" style={wrkflwStyle ? wrkflwStyle : {}}>
        <div>
          <input
            type="checkbox"
            className={userType === "employee" ? "input-emp" : ""}
            onChange={onChange}
            style={{ cursor: "pointer" }}
            value={value || label}
            {...props}
            ref={inputRef}
            disabled={disable}
            // {(checked ? (checked = { checked }) : null)}
            checked={checked}
          />
          <p className={userType === "employee" ? "custom-checkbox-emp" : "custom-checkbox"} style={disable ? { opacity: 0.5 } : (props?.checkboxWidth ? {...props?.checkboxWidth} : null)}>
            {/* <img src={check} alt="" /> */}
            <CheckSvg />
          </p>
        </div>
        <p className="label" style={style ? style : null}>
          {label}
        </p>
      </div>
    );
  }
  
};

CheckBox.propTypes = {
  /**
   * CheckBox content
   */
  label: PropTypes.string.isRequired,
  /**
   * onChange func
   */
  onChange: PropTypes.func,
  /**
   * input ref
   */
  ref: PropTypes.func,
  userType: PropTypes.string,
};

CheckBox.defaultProps = {};

export default CheckBox;
