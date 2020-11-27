import React from "react";

const TextInput = (props) => {
  return (
    <React.Fragment>
      {props.isMandatory ? (
        <input type="text" value={props.value} className="card-input-error" placeholder={props.placeholder} onChange={props.onChange} />
      ) : (
        <input type="text" value={props.value} className="card-input" placeholder={props.placeholder} onChange={props.onChange} />
      )}
    </React.Fragment>
  );
};

export default TextInput;
