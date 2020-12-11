import React from "react";

const HeaderBar = (props) => {
  return (
    <div className="header-wrap">
      {props.start ? <div className="header-start">{props.start}</div> : null}
      {props.main ? <div className="header-content">{props.main}</div> : null}
      {props.end ? <div className="header-end">{props.end}</div> : null}
    </div>
  );
};

export default HeaderBar;
