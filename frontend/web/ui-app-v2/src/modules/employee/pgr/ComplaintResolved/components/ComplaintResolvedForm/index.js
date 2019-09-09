import React from "react";
import { Button } from "components";
import ImageUpload from "modules/common/common/ImageUpload";
import TextArea from "modules/common/pgr/ReOpenComplaint/components/TextArea";

const ComplaintResolvedForm = ({ formKey, form, handleFieldChange }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <div>
      <ImageUpload module="rainmaker-pgr" formKey={formKey} fieldKey="media" />
      <div style={{ padding: "24px 16px 350px 1px" }}>
        <TextArea onChange={(e, value) => handleFieldChange("textarea", value)} {...fields.textarea} />
      </div>

      <div className="col-lg-offset-2 col-md-offset-2 col-lg-8 col-md-8 btn-without-bottom-nav">
        <Button id={"complaint-resolved-mark-resolved"} {...submit} primary={true} fullWidth={true} />
      </div>
    </div>
  );
};

export default ComplaintResolvedForm;
