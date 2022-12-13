import React from "react";
import { useTranslation } from "react-i18next";
import { TickMark } from "@egovernments/digit-ui-react-components";

let actions = [];

const getAction = (flow) => {
  switch (flow) {
    case "NEWLICENSE":
      actions = [
        // 'BPA_NEW_ADDRESS_HEADER_DETAILS',
        "Applicant Info",
        "Application Purpose",
        "Land Schedule",
        "Details of Applied Land",
        "Fees and Charges",
      ];
  }
};
const Timeline = ({ currentStep = 1, flow = "", setCheck, changeSteps }) => {
  const { t } = useTranslation();
  const isMobile = window.Digit.Utils.browser.isMobile();
  getAction(flow);
  return (
    <div className="timeline-container" style={isMobile ? {} : { marginRight: "auto" }}>
      {actions.map((action, index, arr) => (
        <div style={{ cursor: "pointer" }} onClick={() => changeSteps(index + 1)} className="timeline-checkpoint" key={index}>
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
