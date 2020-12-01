import React from "react";
import { Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import "./index.css";

const ptSteps = [
  "PT_DEMAND_AND_COLLECTION",
  "PT_COMMON_SUMMARY"
];

const WizardComponent = ({
  downloadAcknowledgementForm,
  content,
  header,
  footer,
  onTabClick,
  selected,
  closeDialogue,
  dialogueOpen,
  onPayButtonClick,
  formValidIndexArray,
  updateIndex,
  backLabel,
  nextLabel,
  history,
  nextButtonEnabled,
  propertyId,
  tenantId
}) => {
  ((selected == 1 || selected == 2)
    ? ((selected == 1) ? (backLabel = 'PT_APPLICATION_BUTTON_DOWN_CONF') : (backLabel = 'PT_ASSESS_PAY_FOR_NEW_YEAR'))
    : (backLabel))


  return (
    <div className={`wizard-cont active-step-${selected}`}>
      {/*<BreadCrumbsForm onTabClick={onTabClick} selected={selected} formValidIndexArray={formValidIndexArray} />*/}

      {selected < 2 && <div><Stepper
        activeStep={selected}
        alternativeLabel
        style={{
          background: "inherit",
        }}
        className="stepper-container"
      >
        {ptSteps.map((label) => {
          return (
            <Step key={label} className="stepper-test">
              <StepLabel>
                <Label label={label} />
              </StepLabel>
            </Step>
          );
        })}
      </Stepper></div>}
      {selected < 1 && <div>{header}</div>}
      <div className="wizard-content contentdiv clearfix">{content}</div>
      {footer}
      <div id="tax-wizard-buttons" className="wizard-footer col-sm-10" style={{ textAlign: "right" }}>
        <div className="button-container col-xs-10" style={{ float: "right" }}>

        {     selected !=0 && selected != 1 && selected != 2  && <Button
            label={<Label buttonLabel={true} label={backLabel} color="#fe7a51" />}
            onClick={() => {
              selected - 1 === -1 ? history.push("/property-tax") : onTabClick(selected - 1);
            }}
            labelStyle={{ letterSpacing: 0.7, padding: 0, color: "#fe7a51" }}
            buttonStyle={{ border: "1px solid #fe7a51" }}
            style={{ marginRight: 45, width: "30%" }}
          />} 
           {selected ==2 &&<Button
            label={<Label buttonLabel={true} label={'PT_DEMAND_PAY'} color="#fe7a51" />}
            onClick={() => {              
              history.push(`../../egov-common/pay?consumerCode=${propertyId}&tenantId=${tenantId}&businessService=PT`) 
              }}
            labelStyle={{ letterSpacing: 0.7, padding: 0, color: "#fe7a51" }}
            buttonStyle={{ border: "1px solid #fe7a51" }}
            style={{ marginRight: 45, width: "30%" }}
          /> }   
   
            <Button
            label={<Label buttonLabel={true} label={nextLabel} color="#fff" />}
            style={{ width: "30%" }}
            backgroundColor="#fe7a51"
            labelStyle={{ letterSpacing: 0.7, padding: 0, color: "#fff" }}
            buttonStyle={{ border: 0 }}
            // onClick={
            //   selected === 4
            //     ? onPayButtonClick
            //     : () => {
            //         updateIndex(selected + 1);
            //       }
            // }
            onClick={
              selected === 3
                ? onPayButtonClick
                : () => {
                  updateIndex(selected + 1);
                }
            }
            disabled={!nextButtonEnabled}
          />
        </div>
      </div>
      {/*<Declaration open={dialogueOpen} closeDialogue={closeDialogue} selected={selected} updateIndex={updateIndex}/>*/}
    </div>
  );
};

export default WizardComponent;
