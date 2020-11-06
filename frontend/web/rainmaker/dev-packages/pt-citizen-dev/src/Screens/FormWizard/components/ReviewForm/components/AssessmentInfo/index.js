import React from "react";
import { Card } from "components";
import Label from "egov-ui-kit/utils/translationNode";

const AssessmentInfo = ({ icon, editIcon, component }) => {
  return (
    <Card
      textChildren={
        <div>
          {/* <div className="pt-rf-title">
            <span className="pt-rf-icon">{icon}</span>
            <span className="pt-rf-title-text">Assessment Info</span>
            <span className="pt-rf-edit-icon">{editIcon}</span>
          </div> */}
          <div className="pt-rf-title rainmaker-displayInline" style={{ justifyContent: "space-between" }}>
            <div className="rainmaker-displayInline" style={{ alignItems: "center" }}>
              <span className="pt-rf-icon">{icon}</span>
              <Label className="pt-rf-title-text" label="PT_ASSESMENT_INFO_SUB_HEADER" />
            </div>
            <span style={{ alignItems: "right" }}>{editIcon}</span>
          </div>
          <div className="pt-review-form col-xs-12">{component}</div>
        </div>
      }
    />
  );
};

export default AssessmentInfo;
