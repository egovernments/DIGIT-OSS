import React from "react";
import PropTypes from "prop-types";

const TextArea = (props) => {
  const user_type = Digit.SessionStorage.get("user_type") === "employee" ? true : false;

  return (
    <textarea
      name={props.name}
      ref={props.inputRef}
      value={props.value}
      onChange={props.onChange}
      className={user_type ? "employee-card-textarea" : "card-textarea"}
    ></textarea>
  );
};

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  ref: PropTypes.func,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

TextArea.defaultProps = {
  name: "",
  ref: undefined,
  value: "",
  onChange: undefined,
};

export default TextArea;
