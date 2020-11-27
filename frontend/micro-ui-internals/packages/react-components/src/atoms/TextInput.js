import React from "react";

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

export default TextInput;
