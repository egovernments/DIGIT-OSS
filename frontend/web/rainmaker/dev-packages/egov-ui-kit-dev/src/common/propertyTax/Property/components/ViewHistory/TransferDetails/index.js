import React from "react";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const labelStayle = {
  color: "rgba(0, 0, 0, 0.6)",
  fontWeight: 400,
  letterSpacing: "0.5px",
  lineHeight: "14px",
  textAlign: "left",
};

const returnTransferData = (value) => {
  return Object.keys(value).map((key) => {
    return (
      <div className="flex-child" style={{textAlign:"left"}}>
        <Label label={key} fontSize="12px" labelStayle={labelStayle} />
        <span className="value">{value[key]}</span>
      </div>
    );
  });
};

const TransferDetails = ({ data }) => {
  return (
    <div className="left-line">
      {_.map(data, (value, index) => {
        return (
          <div>
            {index !== 0 && <div className="bottom-line"></div>}
            <div className="flex-container">{returnTransferData(value)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default TransferDetails;
