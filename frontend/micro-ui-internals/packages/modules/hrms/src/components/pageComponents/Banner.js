import React, { useEffect, useState } from "react";
import { CardLabel, LabelFieldPair } from "@egovernments/digit-ui-react-components";
const HRBanner = ({ t, config }) => {
  return (
    <LabelFieldPair>
      {config?.texts?.nosideText!==true && <CardLabel className="card-label-smaller" style={{ color: "white" }}>
        .
      </CardLabel>}
      <span className="form-field" style={config?.texts?.nosideText!==true ? { color: "gray" }:{ color: "gray" ,  width:"100%" ,marginTop: "-20px"}}>
        {t(config?.texts?.header)}
      </span>
    </LabelFieldPair>
  );
};
export default HRBanner;
