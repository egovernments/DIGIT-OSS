import React from "react";
import { Button } from "components";
import RatingsComponent from "../Ratings";
import TextAreaComponent from "../TextArea";
import CheckBoxGroup from "../CheckBoxGroup";

const FeedbackForm = ({ form, handleFieldChange, onCheck, checkBoxValue, onSubmit }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <div>
      {
        <div className="feedback-main-container">
          <div className="feedback-form">
            <RatingsComponent onChange={(value) => handleFieldChange("rating", value)} />
            <CheckBoxGroup selected={checkBoxValue} onCheck={onCheck} />
            <TextAreaComponent onChange={(e, value) => handleFieldChange("comments", value)} {...fields.comments} />
          </div>
        </div>
      }
      <div className="responsive-action-button-cont">
        <Button onClick={onSubmit} className="responsive-action-button" {...submit} primary={true} fullWidth={true} />
      </div>
    </div>
  );
};

export default FeedbackForm;
