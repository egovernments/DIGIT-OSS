import React from "react";
import { Button } from "components";
import { Question } from "modules/common";
import { TextArea } from "modules/common";

const RequestReassignForm = ({ form, onSubmit, options, ontextAreaChange, handleOptionChange, optionSelected, commentValue }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <div>
      <div className="custom-padding-for-screens">
        <div className="request-reaasign-question">
          <Question options={options} label={"ES_REASSIGN_REQUEST_QUESTION"} handleChange={handleOptionChange} valueSelected={optionSelected} />
        </div>
        <div className="request-reaasign-textArea">
          <TextArea onChange={ontextAreaChange} value={commentValue} {...fields.textarea} />
        </div>
      </div>
      <div className="responsive-action-button-cont">
        <Button
          onClick={onSubmit}
          className="responsive-action-button"
          id="requestreassign-submit-action"
          primary={true}
          {...submit}
          fullWidth={true}
        />
      </div>
    </div>
  );
};

export default RequestReassignForm;
