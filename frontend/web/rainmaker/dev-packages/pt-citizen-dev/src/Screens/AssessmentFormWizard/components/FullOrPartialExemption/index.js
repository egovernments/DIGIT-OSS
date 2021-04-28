import React from "react";
import { TextField, DropDown } from "components";

const FullOrPartialExemption = ({ form, wizardFields, handleFieldChange }) => {
  const fields = wizardFields(form.fields || {});
  return (
    <div className="exemption-form-cont">
      <DropDown
        fullWidth={true}
        {...fields.propertcategoryNumber}
        onChange={(e, value) => handleFieldChange("propertcategoryNumber", value)}
        dropDownData={[{ label: "Category 1", value: "c1" }, { label: "Category 2", value: "c2" }]}
      />
      <TextField {...fields.referenceId} onChange={(e, value) => handleFieldChange("referenceId", value)} id="referenceID" />
      <TextField {...fields.proof} onChange={(e, value) => handleFieldChange("proof", value)} id="proof" />
    </div>
  );
};

export default FullOrPartialExemption;
