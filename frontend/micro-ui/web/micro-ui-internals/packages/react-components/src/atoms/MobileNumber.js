import React from "react";
import PropTypes from "prop-types";

const MobileNumber = (props) => {
  const user_type = Digit.SessionStorage.get("userType");

  const onChange = (e) => {
    let val = e.target.value;
    if (isNaN(val) || [" ", "e", "E"].some((e) => val.includes(e)) || val.length > (props.maxLength || 10)) {
      val = val.slice(0, -1);
    }
    props?.onChange?.(val);
  };

  return (
    <React.Fragment>
      <div className="field-container">
        {!props.hideSpan ? (
          <span style={{ maxWidth: "50px", marginTop: "unset",border:"1px solid #464646",borderRight:"none", ...props.labelStyle }} className="citizen-card-input citizen-card-input--front">
            +91
          </span>
        ) : null}
        <div className={`text-input ${user_type === "employee"? "" : "text-mobile-input-width"} ${props.className}`}>
          <input
            type={"text"}
            name={props.name}
            id={props.id}
            className={`${user_type ? "employee-card-input" : "citizen-card-input"} ${props.disable && "disabled"} focus-visible ${props.errorStyle && "employee-card-input-error"}`}
            placeholder={props.placeholder}
            onChange={onChange}
            ref={props.inputRef}
            value={props.value}
            style={{ ...props.style }}
            // defaultValue={props.defaultValue || ""}
            minLength={props.minlength}
            maxLength={props.maxlength}
            max={props.max}
            pattern={props.pattern}
            min={props.min}
            readOnly={props.disable}
            title={props.title}
            step={props.step}
            autoFocus={props.autoFocus}
            onBlur={props.onBlur}
            autoComplete="off"
          />
        </div>
      </div>
    </React.Fragment>
  );
};

MobileNumber.propTypes = {
  userType: PropTypes.string,
  isMandatory: PropTypes.bool,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  ref: PropTypes.func,
  value: PropTypes.any,
};

MobileNumber.defaultProps = {
  isMandatory: false,
};

export default MobileNumber;
