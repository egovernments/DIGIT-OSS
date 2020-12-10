import React from "react";
import PropTypes from "prop-types";

const TextArea = (props) => {
  return <textarea name={props.name} ref={props.inputRef} value={props.value} onChange={props.onChange} className="card-textarea"></textarea>;
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
