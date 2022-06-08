import React from "react";
import { TextField } from "components";

const TaxAssessmentDetailsTwo = ({ wizardFields, form, handleFieldChange }) => {
  const fields = wizardFields(form.fields || {});

  return (
    <div className="tax-assessment-details-cont-2">
      <TextField {...fields.builtUpArea1} onChange={(e, value) => handleFieldChange("builtUpArea1", value)} id="built-up-area-1" />
      <TextField {...fields.builtUpArea2} onChange={(e, value) => handleFieldChange("buildUpArea2", value)} id="built-up-area-2" />
    </div>
  );
};

export default TaxAssessmentDetailsTwo;
