import React from "react";

const TextArea = (props) => {
  return <textarea onChange={props.onChange} className="card-textarea"></textarea>;
};

export default TextArea;
