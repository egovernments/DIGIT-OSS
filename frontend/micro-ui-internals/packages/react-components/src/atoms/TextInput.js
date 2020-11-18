import React from "react";

const TextInput = (props) => {
  return (
    <React.Fragment>
      {props.isMandatory ? (
        <input type="text" className="card-input-error" style={{ ...props.style }} placeholder={props.placeholder} onChange={props.onChange} />
      ) : (
        <input type="text" className="card-input" style={{ ...props.style }} placeholder={props.placeholder} onChange={props.onChange} />
      )}
    </React.Fragment>
  );
};

export default TextInput;
