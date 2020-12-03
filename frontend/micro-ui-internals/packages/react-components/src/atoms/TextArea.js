import React from "react";

const TextArea = (props) => {
  return <textarea name={props.name} ref={props.inputRef} value={props.value} onChange={props.onChange} className="card-textarea"></textarea>;
};

export default TextArea;
