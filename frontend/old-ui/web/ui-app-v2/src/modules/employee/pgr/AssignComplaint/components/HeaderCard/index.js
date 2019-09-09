import React from "react";
import { Card, Icon } from "components";
import Label from "utils/translationNode";

const addressStyle = {
  display: "inline-block",
};

const iconStyle = {
  display: "inline-block",
  width: 24,
  height: 24,
  marginRight: 7,
  marginTop: -3,
};

const headerStyle = {
  letterSpacing: "0.7px",
};

const HeaderCard = ({ complaint }) => {
  let transformedcomplaint = "";
  if (complaint && complaint.header) {
    transformedcomplaint = "SERVICEDEFS." + complaint.header.toUpperCase();
  }
  return (
    <Card
      textChildren={[
        <Label
          key={1}
          label={transformedcomplaint}
          dark={true}
          bold={true}
          fontSize={16}
          labelStyle={headerStyle}
          containerStyle={{ marginBottom: 10 }}
        />,
        <div key={2} style={{ display: "flex", alignItems: "flex-start" }}>
          <Icon action="maps" name="place" style={iconStyle} color={"#969696"} />
          <Label containerStyle={addressStyle} dark={true} label={complaint && complaint.address} />
        </div>,
      ]}
    />
  );
};

export default HeaderCard;
