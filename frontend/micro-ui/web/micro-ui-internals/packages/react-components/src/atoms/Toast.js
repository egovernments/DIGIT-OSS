import React from "react";
import PropTypes from "prop-types";
import { RoundedCheck, DeleteBtn, ErrorIcon } from "./svgindex";
import ButtonSelector from "./ButtonSelector";

const Toast = (props) => {
  if (props.error) {
    return (
      <div className="toast-success" style={{ backgroundColor: "red", ...props.style }}>
        <ErrorIcon />
        <h2 style={{...props.labelstyle}}>{props.label}</h2>
        { props.isDleteBtn ? <DeleteBtn fill="none" className="toast-close-btn" onClick={props.onClose} /> : null }
      </div>
    );
  }

  if (props.warning) {
    return (
      <div>
        <div className="toast-success" style={props?.isWarningButtons ? { backgroundColor: "#EA8A3B", display: "block", ...props.style } : { backgroundColor: "#EA8A3B", ...props.style }}>
          {!props?.isWarningButtons ?
            <div className="toast-success" style={{ backgroundColor: "#EA8A3B", ...props.style }}>
              <ErrorIcon />
              <h2 style={{ marginLeft: "10px" }}>{props.label}</h2>
              {props.isDleteBtn ? <DeleteBtn fill="none" className="toast-close-btn" onClick={props.onClose} /> : null}
            </div> : <div style={{ display: "flex" }}>
              <ErrorIcon />
              <h2 style={{ marginLeft: "10px" }}>{props.label}</h2>
              {props.isDleteBtn ? <DeleteBtn fill="none" className="toast-close-btn" onClick={props.onClose} /> : null}
            </div>
          }
          {props?.isWarningButtons ?
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
              <ButtonSelector theme="border" label={"NO"} onSubmit={props.onNo} style={{ marginLeft: "10px" }} />
              <ButtonSelector label={"YES"} onSubmit={props.onYes} style={{ marginLeft: "10px" }} />
            </div> : null
          }
        </div>
      </div>
    );
  }

  return (
    <div className="toast-success" style={{ ...props.style }}>
      <RoundedCheck />
      <h2>{props.label}</h2>
      <DeleteBtn fill="none" className="toast-close-btn" onClick={props.onClose} />
    </div>
  );
};

Toast.propTypes = {
  label: PropTypes.string,
  onClose: PropTypes.func,
  isDleteBtn: PropTypes.string
};

Toast.defaultProps = {
  label: "",
  onClose: undefined,
  isDleteBtn: ""
};

export default Toast;
