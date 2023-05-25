import React from "react";
import { Dialog, Ratings, Checkbox, TextArea, Button, Icon } from "components";
import FloatingActionButton from "material-ui/FloatingActionButton";
import Label from "egov-ui-kit/utils/translationNode";

const titleStyle = {
  textAlign: "center",
  fontSize: "16px",
  fontWeight: 500,
  padding: "28px 0 0 0",
  letterSpacing: 0.7,
  lineHeight: 1,
  color: "#484848",
};

const checkboxOptions = [
  { value: "Services", label: "Services" },
  { value: "Resolution Time", label: "Resolution Time" },
  { value: "Quality of work", label: "Quality of work" },
  { value: "Others", label: "Others" },
];

const actions = [];
const FeedbackPopup = ({ open, handleClose, submitted = false, onSubmit, selected, onCheck }) => {
  return (
    <div>
      <Dialog
        title={"Rate your experience"}
        titleStyle={titleStyle}
        open={open}
        actions={actions}
        children={
          !submitted
            ? [
                <div className="feedback-ratings-cont" key={"feedback-ratings-cont"}>
                  <Ratings className="feedback-ratings" size={40} count={5} half={false} />
                </div>,
                <span className="what-was-good" key={"feedback-subtext"}>
                  What was good?
                </span>,
                <Checkbox
                  key={"feedback-checkboxGroup"}
                  labelStyle={{ letterSpacing: "0.6px" }}
                  options={checkboxOptions}
                  containerClassName={"feedback-checkbox-cont"}
                  selected={selected}
                  onCheck={onCheck}
                />,
                <TextArea
                  key={"feedback-textarea"}
                  hintText={<Label label="CS_COMMON_COMMENTS_PLACEHOLDER" />}
                  underlineShow={true}
                  hintStyle={{ letterSpacing: "0.7px" }}
                />,
                <div key={"feedback-submit-button"} className="feedback-popup-button-cont">
                  <Button label={<Label label="CS_COMMON_SUBMIT" buttonLabel={true} />} primary={true} fullWidth={true} onClick={onSubmit} />
                </div>,
              ]
            : [
                <div className="feedback-submitted-icon-cont" key="feedback-submitted-icon-cont">
                  <FloatingActionButton className="floating-button" style={{ boxShadow: 0 }} backgroundColor={"#22b25f"}>
                    <Icon action="navigation" name="check" />
                  </FloatingActionButton>
                </div>,
                <Label
                  key="thankyou-text"
                  label="CS_FEEDBACK_SUCCESS"
                  className="feedback-thankyou-text"
                  dark={true}
                  bold={true}
                  fontSize={"16px"}
                />,
              ]
        }
        handleClose={handleClose}
        bodyStyle={{ padding: "0 12px 24px 12px", backgroundColor: "#ffffff" }}
      />
    </div>
  );
};

export default FeedbackPopup;
