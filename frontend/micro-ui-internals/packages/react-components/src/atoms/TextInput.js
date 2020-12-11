import React from "react";
import PropTypes from "prop-types";

const TextInput = (props) => {
  const user_type = Digit.SessionStorage.get("user_type") === "employee" ? true : false;
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
  isMandatory: PropTypes.bool,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  ref: PropTypes.func,
  value: PropTypes.string.isRequired,
};

TextInput.defaultProps = {
  isMandatory: false,
  name: "name",
  placeholder: "Name",
  value: "",
};

export default TextInput;
