import React from "react";

const CardHeader = (props) => {
  return <header className="card-header" style={props.styles ? props.styles : {}}>{props.children}</header>;
};

export default CardHeader;
