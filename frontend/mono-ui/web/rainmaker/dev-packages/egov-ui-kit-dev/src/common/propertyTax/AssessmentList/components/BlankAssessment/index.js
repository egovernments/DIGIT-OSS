import React from "react";
import { Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import YearDialogue from "../../../YearDialogue";

const BlankAssessment = ({ noAssessmentMessage, button, dialogueOpen, closeDialogue, onButtonClick, history }) => {
  return (
    <div className="no-assessment-message-cont">
      <Label label={noAssessmentMessage} dark={true} fontSize={"16px"} />

      {button && (
        <Button
          className="assessment-button"
          primary={true}
          label="New Property Assessment"
          style={{
            height: 36,
            lineHeight: "auto",
            minWidth: "inherit",
          }}
          labelStyle={{
            padding: "0 12px 0 12px ",
            letterSpacing: "0.6px",
            display: "inline-block",
            height: "22px",
            lineHeight: "22px",
            fontSize: "14px",
          }}
          onClick={onButtonClick}
        />
      )}
      <YearDialogue open={dialogueOpen} history={history} closeDialogue={closeDialogue} />
    </div>
  );
};

export default BlankAssessment;
