import React from "react";
import { UnMaskComponent } from "..";

export const LastRow = (props) => {
  return (
    <div styles={props.rowContainerStyle} className="row-last">
      <h2>{props.label}</h2>
      <p>{props.text}</p>
    </div>
  );
};

export const Row = (props) => {
  let value = props.text;
  let valueStyle = props.textStyle || {};
  let labelStyle = props.labelStyle || {};
  if (Array.isArray(props.text)) {
    value = props.text.map((val, index) => {
      if (val?.className) {
        return (
          <p className={val?.className} style={val?.style} key={index}>
            {val?.value}
            {/*  
              Feature :: Privacy
              privacy object set to the Mask Component
             */}
            {props?.privacy && (
              <span style={{ display: "inline-flex", width: "fit-content", marginLeft: "10px" }}>
                <UnMaskComponent privacy={props?.privacy}></UnMaskComponent>
              </span>
            )}
          </p>
        );
      }
      return (
        <p key={index}>
          {val}
          {props?.privacy && (
            <span style={{ display: "inline-flex", width: "fit-content", marginLeft: "10px" }}>
              {/*  
                Feature :: Privacy
                privacy object set to the Mask Component
              */}
              <UnMaskComponent privacy={props?.privacy}></UnMaskComponent>
            </span>
          )}
        </p>
      );
    });
  }
  // display: inline-flex;
  // width: fit-content;
  // margin-left: 10px;
  // }

  return (
    <div style={props.rowContainerStyle} className={`${props.last ? "row last" : "row"} ${props?.className || ""}`}>
      <h2 style={labelStyle}>{props.label}{props?.isMandotary && '*'}</h2>
      <div className="value" style={valueStyle}>
        {
          props?.isValueLink ? (<p className="status-value-link" onClick={props?.navigateLinkHandler}>{value}</p>) : <p>{value}</p> 
        }
        {props?.privacy && (
          <span style={{ display: "inline-flex", width: "fit-content", marginLeft: "10px" }}>
            <UnMaskComponent privacy={props?.privacy}></UnMaskComponent>
          </span>
        )}
        {props.caption && <div className="caption">{props.caption}</div>}
      </div>
      {props.actionButton ? (
        <div style={props.actionButtonStyle} className="action-button">
          {props.actionButton}
        </div>
      ) : null}
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
      <div className={employee ? "employee-data-table" : "data-table"} style={props.style}>
        {Object.keys(props.dataObject).map((name, index) => {
          if (++index === Object.keys(props.dataObject).length) {
            return <LastRow key={index} label={name} text={props.dataObject[name]} />;
          }
          return <Row key={index} label={name} text={props.dataObject[name]} />;
        })}
      </div>
    );
  } else {
    return (
      <div className={employee ? `employee-data-table ${props?.customClass ? props?.customClass : ""}` : "data-table"} style={props.style}>
        {props.children}
      </div>
    );
  }
};
