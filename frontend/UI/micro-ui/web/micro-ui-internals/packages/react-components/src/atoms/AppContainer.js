import React from "react";

const AppContainer = (props) => {
  return (
    <React.Fragment>
      <div className={`app-container ${props.className ? props.className : ""}`} style={props.style}>
        {props.children}
      </div>
    </React.Fragment>
  );
};

export default AppContainer;
