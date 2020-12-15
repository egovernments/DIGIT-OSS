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
  let value = props.text;
  if (Array.isArray(props.text)) {
    value = props.text.map((val, index) => <p key={index}>{val}</p>);
  }

  return (
    <div className={props.last ? "row last" : "row"}>
      <h2>{props.label}</h2>
      <div className="value">{value}</div>
    </div>
  );
};

export const MediaRow = (props) => {
  return (
    <div>
      <h2>{props.label}</h2>
      <span>{props.children}</span>
    </div>
  );
};

export const StatusTable = (props) => {
  const employee = Digit.SessionStorage.get("user_type") === "employee" ? true : false;
  if (props.dataObject) {
    return (
      <div className={employee ? "employee-data-table" : "data-table"}>
        {Object.keys(props.dataObject).map((name, index) => {
          if (++index === Object.keys(props.dataObject).length) {
            return <LastRow key={index} label={name} text={props.dataObject[name]} />;
          }
          return <Row key={index} label={name} text={props.dataObject[name]} />;
        })}
      </div>
    );
  } else {
    return <div className={employee ? "employee-data-table" : "data-table"}> {props.children} </div>;
  }
};
