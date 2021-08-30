import React from "react";
import { Button } from "components";
import Question from "modules/common/pgr/ReOpenComplaint/components/Question";
import TextArea from "modules/common/pgr/ReOpenComplaint/components/TextArea";

const RejectComplaintForm = ({ form, options, ontextAreaChange, handleOptionChange, optionSelected, commentValue }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <div>
      <div className="reject-complaint-question">
        <Question options={options} label={"ES_REJECT_COMPLAINT_QUESTION"} handleChange={handleOptionChange} valueSelected={optionSelected} />
      </div>
      <div className="reject-complaint-textArea">
        <TextArea onChange={ontextAreaChange} value={commentValue} {...fields.textarea} />
      </div>

      <div className="col-lg-offset-2 col-md-offset-2 col-lg-8 col-md-8 btn-without-bottom-nav">
        <Button id="rejectcomplaint-submit-action" primary={true} {...submit} fullWidth={true} />
      </div>
    </div>
  );
};

export default RejectComplaintForm;
