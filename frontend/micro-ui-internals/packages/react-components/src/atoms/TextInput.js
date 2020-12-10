import React from "react";
import PropTypes from "prop-types";

const TextInput = (props) => {
  return (
    <React.Fragment>
      {props.isMandatory ? (
        <input
          type="text"
          name={props.name}
          className="card-input-error"
          placeholder={props.placeholder}
          onChange={props.onChange}
          ref={props.inputRef}
          value={props.value}
        />
      ) : (
        <input
          type="text"
          name={props.name}
          className="card-input"
          placeholder={props.placeholder}
          onChange={props.onChange}
          ref={props.inputRef}
          value={props.value}
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
