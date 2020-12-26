import React from "react";
import PropTypes from "prop-types";

const TextInput = (props) => {
  const user_type = props.userType;
  return (
    <React.Fragment>
      {props.isMandatory ? (
        <input
          type="text"
          name={props.name}
          className={user_type ? "employee-card-input-error" : "card-input-error"}
          placeholder={props.placeholder}
          onChange={props.onChange}
          ref={props.inputRef}
          value={props.value}
        />
      ) : (
        <input
          type="text"
          name={props.name}
          className={user_type ? "employee-card-input" : "card-input"}
          placeholder={props.placeholder}
          onChange={props.onChange}
          ref={props.inputRef}
          value={props.value}
          style={{ ...props.style }}
        />
      )}
    </React.Fragment>
  );
};

TextInput.propTypes = {
  userType: PropTypes.string,
  isMandatory: PropTypes.bool,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  ref: PropTypes.func,
  value: PropTypes.string,
};

TextInput.defaultProps = {
  userType: "citizen",
  isMandatory: false,
  name: "name",
  placeholder: "Name",
  value: "",
};

export default TextInput;
