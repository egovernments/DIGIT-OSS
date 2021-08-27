import React from "react";

const AppContainer = (props) => {
  return (
    <React.Fragment>
      <div className="app-container" style={props.style}>
        {props.children}
      </div>
    </React.Fragment>
  );
};

export default AppContainer;
