import React from "react";

const TextInput = (props) => {
  console.log("props:::::ref::::", props);
  return (
    <React.Fragment>
      {props.isMandatory ? (
        <input
          type="text"
          name={props.name}
          className="card-input-error"
          style={{ ...props.style }}
          placeholder={props.placeholder}
          onChange={props.onChange}
          ref={props.inputRef}
        />
      ) : (
        <input
          type="text"
          name={props.name}
          className="card-input"
          style={{ ...props.style }}
          placeholder={props.placeholder}
          onChange={props.onChange}
          ref={props.inputRef}
        />
      )}
    </React.Fragment>
  );
};

export default TextInput;
