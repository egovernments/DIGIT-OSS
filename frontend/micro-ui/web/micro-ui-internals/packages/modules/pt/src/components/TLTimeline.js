import React from "react";
import { useTranslation } from "react-i18next";
import { TickMark } from "@egovernments/digit-ui-react-components";

let actions = [];

const getAction = (flow) => {
  switch (flow) {
    case "STAKEHOLDER":
      actions = [];
      break;
    case "PT_MUTATE":
      actions = ["PT_OWNERSHIP_INFO_SUB_HEADER", "PT_MUTATION_DETAILS", "CE_DOCUMENT_DETAILS", "PT_COMMON_SUMMARY"];
      break;
    default:
      actions = ["ES_NEW_APPLICATION_PROPERTY_DETAILS", "PT_OWNERSHIP_INFO_SUB_HEADER", "CE_DOCUMENT_DETAILS", "PT_COMMON_SUMMARY"];
  }
};
const Timeline = ({ currentStep = 1, flow = "" }) => {
  const { t } = useTranslation();
  const isMobile = window.Digit.Utils.browser.isMobile();
  getAction(flow);
  return (
    <div className="timeline-container" style={isMobile ? {} : { maxWidth: "960px", minWidth: "640px", marginRight: "auto" }}>
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
