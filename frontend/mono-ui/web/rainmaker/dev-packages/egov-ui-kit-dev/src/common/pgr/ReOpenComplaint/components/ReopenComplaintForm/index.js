import React from "react";
import { Button } from "components";
// import { Question } from "modules/common";
// import { TextArea } from "modules/common";
import Question from "../Question";
import TextArea from "../TextArea";
import { ImageUpload } from "modules/common";

const ReopenComplaintForm = ({ form, formKey, options, ontextAreaChange, handleOptionChange, optionSelected, commentValue, role }) => {
  const fields = form.fields || {};
  const submit = form.submit;

  return (
    <div>
      <div className="form-without-button-cont-generic">
        <div className="reopencomplaint-question">
          <Question options={options} label="CS_REOPEN_COMPLAINT_WHY" handleChange={handleOptionChange} valueSelected={optionSelected} />
        </div>
        {role &&
          role !== "csr" && (
            <div className="reopencomplaint-upload-photo">
              <ImageUpload module="rainmaker-pgr" formKey={formKey} fieldKey="media" />
            </div>
          )}
        <div className="reopencomplaint-textArea">
          <TextArea onChange={ontextAreaChange} value={commentValue} {...fields.textarea} />
        </div>
      </div>

      <div className="responsive-action-button-cont">
        <Button className="responsive-action-button" {...submit} primary={true} fullWidth={true} />
      </div>
    </div>
  );
};

export default ReopenComplaintForm;
