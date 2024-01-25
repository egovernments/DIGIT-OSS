import React from "react";
import { UnMaskComponent ,WrapUnMaskComponent} from "..";

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
  if (Array.isArray(props.text) && !props?.privacy) {
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
              <span style={{ display: "inline-flex", width: "fit-content" }}>
                {/* <UnMaskComponent iseyevisible={val?.value?.includes("*")?true:false}></UnMaskComponent> */}
                <WrapUnMaskComponent  value={val?.value} iseyevisible={val?.value?.includes("*")?true:false} privacy={props?.privacy?.[index]} />

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
              {/* <UnMaskComponent iseyevisible={val?.includes("*")?true:false} privacy={props?.privacy}></UnMaskComponent> */}
              <WrapUnMaskComponent   value={val} iseyevisible={val?.includes("*")?true:false} privacy={Array.isArray(props?.privacy) ? props?.privacy?.[index] : props?.privacy} />

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

  if(Array?.isArray(props?.privacy) && Array.isArray(props?.text))
  {
    return(    
        <div style={props.rowContainerStyle} className={`${props.last ? "row last" : "row"} ${props?.className || ""}`}>
          <h2 style={labelStyle}>{props.label}</h2>
          {props?.text?.map((ob,index) => (
          <div className="value" style={index == 0 ? {...valueStyle, wordBreak: "break-word",marginLeft:"28.5%",width:"20%"} : {...valueStyle, wordBreak: "break-word",color:"grey",display:"inline",fontSize:"13px",paddingLeft:"10px"}}>
            <WrapUnMaskComponent   value={ob?.value} iseyevisible={ob?.value && ob?.value?.toString()?.includes("*")?true:false} privacy={props?.privacy?.[index]} />
            {props.caption && <div className="caption">{props.caption}</div>}
          </div>))}
          {props.actionButton ? (
            <div style={props.actionButtonStyle} className="action-button">
              {props.actionButton}
            </div>
          ) : null}
        </div>
     )  
  }
  else{
  return (
    <div style={props.rowContainerStyle} className={`${props.last ? "row last" : "row"} ${props?.className || ""}`}>
      <h2 style={labelStyle}>
        {props.label}
        {props.labelChildren && props.labelChildren}
      </h2>
      <div className="value" style={{...valueStyle/*, wordBreak: "break-word"*/}}>
        {/* {value}////
        {props?.privacy && (
          <span style={{ display: "inline-flex", width: "fit-content", marginLeft: "10px" }}>
            <UnMaskComponent iseyevisible={value?.includes("*")?true:false} privacy={Array.isArray(props?.privacy) ? props?.privacy?.[0] : props?.privacy}></UnMaskComponent>
          </span>
        )} */}
        <WrapUnMaskComponent   value={value} iseyevisible={value && value?.toString()?.includes("*")?true:false} privacy={Array.isArray(props?.privacy)?props?.privacy?.[0]:props?.privacy} />
        {props.caption && <div className="caption">{props.caption}</div>}
      </div>
      {props.actionButton ? (
        <div style={props.actionButtonStyle} className="action-button">
          {props.actionButton}
        </div>
      ) : null}
    </div>
  );
      }
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
      <div className={employee ? "employee-data-table" : "data-table"} style={props.style}>
        {props.children}
      </div>
    );
  }
};
