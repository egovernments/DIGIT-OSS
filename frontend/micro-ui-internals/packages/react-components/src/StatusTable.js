import React from "react";

export const LastRow = (props) => {
  return (
    <div className="row-last">
      <h2>{props.label}</h2>
      <p>{props.text}</p>
    </div>
  );
};

export const Row = (props) => {
  return (
    <div>
      <h2>{props.label}</h2>
      <p>{props.text}</p>
    </div>
  );
};

export const StatusTable = (props) => {
  if (props.dataObject) {
    return (
      <div className="data-table">
        {Object.keys(props.dataObject).map((name, index) => {
          if (++index === Object.keys(props.dataObject).length) {
            return <LastRow key={index} label={name} text={props.dataObject[name]} />;
          }
          return <Row key={index} label={name} text={props.dataObject[name]} />;
        })}
      </div>
    );
  } else {
    return <div className="data-table"> {props.children} </div>;
  }
};
