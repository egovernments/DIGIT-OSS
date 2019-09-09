import React from "react";
import { Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import "./index.css";

const ptSteps = [
  "PT_PROPERTY_ADDRESS_SUB_HEADER",
  "PT_ASSESMENT_INFO_SUB_HEADER",
  "PT_OWNER_INFORMATION_FORM_HEADING",
  "PT_REVIEW_PAY_FORM_HEADING",
  "PT_PAYMENT_DETAILS",
];

const WizardComponent = ({
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
}) => {
  return (
    <div className={`wizard-cont active-step-${selected}`}>
      {/*<BreadCrumbsForm onTabClick={onTabClick} selected={selected} formValidIndexArray={formValidIndexArray} />*/}
      <Stepper
        activeStep={selected}
        alternativeLabel
        style={{
          background: "inherit",
        }}
        className="stepper-container"
      >
        {ptSteps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>
                <Label label={label} />
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {header}
      <div className="wizard-content clearfix">{content}</div>
      {footer}
      <div id="tax-wizard-buttons" className="wizard-footer col-sm-10" style={{ textAlign: "right" }}>
        <div className="button-container col-xs-6" style={{ float: "right" }}>
          <Button
            label={<Label buttonLabel={true} label={backLabel} color="#fe7a51" />}
            onClick={() => {
              selected - 1 === -1 ? history.push("/property-tax") : onTabClick(selected - 1);
            }}
            labelStyle={{ letterSpacing: 0.7, padding: 0, color: "#fe7a51" }}
            buttonStyle={{ border: "1px solid #fe7a51" }}
            style={{ marginRight: 45, width: "36%" }}
          />
          <Button
            label={<Label buttonLabel={true} label={nextLabel} color="#fff" />}
            style={{ width: "36%" }}
            backgroundColor="#fe7a51"
            labelStyle={{ letterSpacing: 0.7, padding: 0, color: "#fff" }}
            buttonStyle={{ border: 0 }}
            onClick={
              selected === 4
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
