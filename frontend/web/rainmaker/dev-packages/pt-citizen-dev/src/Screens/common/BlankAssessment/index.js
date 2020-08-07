import React from "react";
import { Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import YearDialogue from "../YearDialogue";
import "./index.css";

const BlankAssessment = ({ noAssessmentMessage, button, dialogueOpen, closeDialogue, onButtonClick, history }) => {
  return (
    <div className="no-assessment-message-cont">
      <Label label={noAssessmentMessage} dark={true} fontSize={"16px"} />

      {button && (
        <Button
          className="assessment-button"
          primary={true}
          label={
            <Label label="PT_NO_ASSESSMENT_BUTTON" labelClassName="no-assessment-button-label-style" color="#ffffff" buttonLabel={true} dark={true} />
          }
          style={{
            height: 36,
            lineHeight: "auto",
            minWidth: "inherit",
          }}
          onClick={onButtonClick}
        />
      )}
      <YearDialogue open={dialogueOpen} history={history} closeDialogue={closeDialogue} />
    </div>
  );
};

export default BlankAssessment;
