import React from "react";

export const CheckPoint = (props) => {
  return (
    <div className={props.isCompleted ? "checkpoint-done" : "checkpoint"} key={props.keyValue}>
      <h2></h2>
      <header>
        {props.label}
        {props.info ? <p>{props.info}</p> : null}
      </header>
    </div>
  );
};

export const ConnectingCheckPoints = (props) => {
  if (props.children.length >= 2) {
    return (
      <React.Fragment>
        {props.children.map((child, index) => {
          return props.children.length === ++index ? (
            <div key={index}>{child}</div>
          ) : (
            <div key={index}>
              {child}
              <div className="checkpoint-connect"></div>
            </div>
          );
        })}
      </React.Fragment>
    );
  } else {
    console.warn("ConnectingCheckPoints Components need atleast 2 CheckPoint Components as children");
    return null;
  }
};
