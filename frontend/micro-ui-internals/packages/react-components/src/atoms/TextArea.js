import React from "react";
import PropTypes from "prop-types";

const TextArea = (props) => {
  const user_type = props.userType;

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
  userType: PropTypes.string,
  name: PropTypes.string.isRequired,
  ref: PropTypes.func,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

TextArea.defaultProps = {
  userType: "citizen",
  name: "",
  ref: undefined,
  value: "",
  onChange: undefined,
};

export default TextArea;
