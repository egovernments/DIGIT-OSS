import React from "react";

const LinkLabel = (props) => {
  return (
    <label className="link-label" onClick={props.onClick} style={{ ...props.style }}>
      {props.children}
    </label>
  );
};

export default LinkLabel;
