import React from "react";
import { Card } from "components";
import Label from "egov-ui-kit/utils/translationNode";

import "./index.css";

const PropertyAddress = ({ form, icon, editIcon, component }) => {
  return (
    <Card
      textChildren={
        <div style={{backgroundColor:'lightgray' }}>
          <div className="pt-rf-title rainmaker-displayInline" style={{ justifyContent: "space-between" }}>
            <div className="rainmaker-displayInline" style={{ alignItems: "center" }}>
              <span className="pt-rf-icon">{icon}</span>
              <Label className="pt-rf-title-text" label="PT_PROPERTY_ADDRESS_SUB_HEADER" />
            </div>
            <span style={{ alignItems: "right" }}>{editIcon}</span>
          </div>
          {component}
        </div>
      }
    />
  );
};

export default PropertyAddress;
