import React from "react";
import { Card } from "components";
import Label from "egov-ui-kit/utils/translationNode";

const OwnerInfo = ({ form, icon, editIcon, component }) => {
  // const fields = form.fields || {};
  return (
    <Card
      textChildren={
        <div>
          {/* <div className="pt-rf-title">
            <span className="pt-rf-icon">{icon}</span>
            <span className="pt-rf-title-text">Owner Information</span>
            <span className="pt-rf-edit-icon">{editIcon}</span>
          </div> */}
          <div className="pt-rf-title rainmaker-displayInline" style={{ justifyContent: "space-between" }}>
            <div className="rainmaker-displayInline" style={{ alignItems: "center" }}>
              <span className="pt-rf-icon">{icon}</span>
              <Label className="pt-rf-title-text" label="PT_OWNER_INFORMATION_FORM_HEADING" />
            </div>
            <span style={{ alignItems: "right" }}>{editIcon}</span>
          </div>
          {component}
        </div>
      }
    />
  );
};

export default OwnerInfo;
