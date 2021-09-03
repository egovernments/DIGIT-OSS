import React from "react";
import { useTranslation } from "react-i18next";

let isStakeholderFlow = window.location.href.includes("stakeholder");
let actions = [];

if(isStakeholderFlow)
{
  actions = [
    'BPA_LICENSE_DET_CAPTION',
    'BPA_NEW_ADDRESS_HEADER_DETAILS',
    'BPA_DOC_DETAILS_SUMMARY',
    'BPA_STEPPER_SUMMARY_HEADER',
  ]
}
else{
actions = [
  'BPA_STEPPER_SCRUTINY_DETAILS_HEADER',
  'BPA_OWNER_AND_DOCUMENT_DETAILS_LABEL',
  'BPA_NOC_DETAILS_SUMMARY',
  'BPA_STEPPER_SUMMARY_HEADER',
]
}
const Timeline = ({ currentStep = 1 }) => {
  const { t } = useTranslation();
  return (
    <div className="timeline-container">
      {actions.map((action, index, arr) => (
        <div className="timeline-checkpoint" key={index}>
          <div className="timeline-content">
            <span className={`circle ${index <= currentStep - 1 && 'active'}`}>{index + 1}</span>
            <span className="secondary-color">{t(action)}</span>
          </div>
          {index < arr.length - 1 && <span className={`line ${index < currentStep - 1 && 'active'}`}></span>}
        </div>
      ))}
    </div>
  )
}

export default Timeline; 