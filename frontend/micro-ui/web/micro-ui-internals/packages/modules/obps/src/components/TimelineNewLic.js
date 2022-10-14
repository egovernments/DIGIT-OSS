import React from "react";
import { useTranslation } from "react-i18next";
import { TickMark } from "@egovernments/digit-ui-react-components";

let actions = [];

const getAction = (flow) => {
   
 switch(flow){
   case "NEWLICENSE": actions = [
   
    // 'BPA_NEW_ADDRESS_HEADER_DETAILS',
    'Step1',
    'Step2',
    'Step3',
    'Step4',
    'Step5',
    ]
    //   break;
    // case "OCBPA": actions = [
    //   'BPA_BASIC_AND_PLOT_DETAILS_LABEL',
    //   'BPA_SCRUTINY_DETAILS',
    //   'BPA_DOCUMENT_AND_NOC_DETAILS_LABEL',
    //   'BPA_STEPPER_SUMMARY_HEADER',
    // ];
    //   break;
    // default: actions = [
    //   'Step1',
    //   'Step2',
    //   'Step3',
    //   'Step4',
    //   'Step5',
    // ]
 }
}
const Timeline = ({ currentStep = 1, flow="" }) => {
  const { t } = useTranslation();
  const isMobile = window.Digit.Utils.browser.isMobile();
  getAction(flow);
  return (
    <div className="timeline-container" style={isMobile?{}:{marginRight:"auto"}} >
      {actions.map((action, index, arr) => (
        <div className="timeline-checkpoint" key={index}>
          <div className="timeline-content">
            <span className={`circle ${index <= currentStep - 1 && 'active'}`}>{index < currentStep - 1 ? <TickMark /> : index + 1}</span>
            <span className="secondary-color">{t(action)}</span>
          </div>
          {index < arr.length - 1 && <span className={`line ${index < currentStep - 1 && 'active'}`}></span>}
        </div>
      ))}
    </div>
  )
}

export default Timeline; 