import React from "react";
import { Card, Button, Divider } from "components";
import { Icon } from "egov-ui-kit/components";
import Label from "egov-ui-kit/utils/translationNode";
const IconStyle = {
  margin: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  height: "inherit",
};
const labelStyle = {
  letterSpacing: 1.2,
  fontWeight: "600",
  lineHeight: "40px",
};
const buttonStyle = {
  float: 'right',
  lineHeight: "35px",
  height: "35px",
  backgroundColor: "rgb(242, 242, 242)",
  boxShadow: "none",
  border: "1px solid rgb(254, 122, 81)",
  borderRadius: "2px",
  outline: "none",
  alignItems: "right",
};
const HistoryCard = ({ header, backgroundColor = 'rgb(242, 242, 242)', items = [], onHeaderClick, errorMessage }) => {

  return (
    <div>
      {items && <Card style={{ backgroundColor, boxShadow: 'none' }}
        textChildren={
          <div >
            <div className="pt-rf-title rainmaker-displayInline" onClick={() => onHeaderClick()} style={{ justifyContent: "space-between", margin: '5px 0px 5px 0px' ,cursor: 'pointer' }}>
              <div className="rainmaker-displayInline" style={{ alignItems: "center", marginLeft: '13px' }}>
                {header && <Label
                  labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                  label={header}
                  fontSize="18px"
                />}
              </div>
              <span style={{ alignItems: "right", cursor: 'pointer' }} > <div style={IconStyle}>
                <Icon action="hardware" name="keyboard-arrow-down" color="#484848" onClick={() => onHeaderClick()} />
              </div></span>
            </div>
            <div>
              <div className="rainmaker-displayInline" style={{ alignItems: "center", marginLeft: '13px' }}>
                {errorMessage && <Label
                  labelStyle={{ letterSpacing: "0.67px", color: "red", fontWeight: "400", lineHeight: "19px" }}
                  label={errorMessage}
                  fontSize="16px"
                />}
              </div>
            </div>
            <div>
              {
                items
              }
            </div>
          </div>
        }
      />}
    </div>
  );
};

export default HistoryCard;
