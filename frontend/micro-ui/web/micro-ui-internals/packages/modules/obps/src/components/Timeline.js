import React from "react";
import { useTranslation } from "react-i18next";
import { TickMark } from "@egovernments/digit-ui-react-components";

let actions = [];

const getAction = (flow) => {
  switch (flow) {
    case "STAKEHOLDER":
      actions = ["BPA_LICENSE_DETAILS_LABEL", "BPA_NEW_ADDRESS_HEADER_DETAILS", "BPA_DOC_DETAILS_SUMMARY", "BPA_STEPPER_SUMMARY_HEADER"];
      break;
    case "OCBPA":
      actions = ["BPA_BASIC_AND_PLOT_DETAILS_LABEL", "BPA_SCRUTINY_DETAILS", "BPA_DOCUMENT_AND_NOC_DETAILS_LABEL", "BPA_STEPPER_SUMMARY_HEADER"];
      break;
    default:
      actions = [
        "BPA_STEPPER_SCRUTINY_DETAILS_HEADER",
        "BPA_OWNER_AND_DOCUMENT_DETAILS_LABEL",
        "BPA_NOC_DETAILS_SUMMARY",
        "BPA_STEPPER_SUMMARY_HEADER",
      ];
  }
};
const Timeline = ({ currentStep = 1, flow = "" }) => {
  const { t } = useTranslation();
  const isMobile = window.Digit.Utils.browser.isMobile();
  getAction(flow);
  return (
    <div className="timeline-container" style={isMobile ? {} : { margin: "0 8px 15px" }}>
      {actions.map((action, index, arr) => (
        <div className="timeline-checkpoint" key={index}>
          <div className="timeline-content">
            <span className={`circle ${index <= currentStep - 1 && "active"}`}>{index < currentStep - 1 ? <TickMark /> : index + 1}</span>
            <span className="secondary-color">{t(action)}</span>
          </div>
          {index < arr.length - 1 && <span className={`line ${index < currentStep - 1 && "active"}`}></span>}
        </div>
      ))}
    </div>
  );
};

export default Timeline;
