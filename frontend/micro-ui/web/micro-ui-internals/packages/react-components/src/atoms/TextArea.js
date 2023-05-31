import React from "react";
import PropTypes from "prop-types";

const TextArea = (props) => {
  const user_type = Digit.SessionStorage.get("userType");

  return (
    <React.Fragment>
    <textarea
      placeholder={props.placeholder}
      name={props.name}
      ref={props.inputRef}
      style={props.style}
      id={props.id}
      value={props.value}
      onChange={props.onChange}
      className={`${user_type !== "citizen" ? "employee-card-textarea" : "card-textarea"} ${props.disable && "disabled"} ${
        props?.className ? props?.className : ""
      }`}
      minLength={props.minlength}
      maxLength={props.maxlength} 
      autoComplete="off"
      disabled={props.disabled}
      pattern={props?.validation && props.ValidationRequired ? props?.validation?.pattern : props.pattern}
    ></textarea>
    {  <p className="cell-text">{props.hintText}</p>}
    </React.Fragment>
  );
};

TextArea.propTypes = {
  userType: PropTypes.string,
  name: PropTypes.string.isRequired,
  ref: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
};

TextArea.defaultProps = {
  ref: undefined,
  onChange: undefined,
};

export default TextArea;
