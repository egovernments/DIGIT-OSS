import React from "react";
import { TextField, MobileNumberField } from "components";
import "./index.css";

const OwnerDetails = ({ form, wizardFields, handleFieldChange }) => {
  const fields = wizardFields(form.fields || {});
  return (
    <div className="owner-details-form-cont">
      <TextField id="owner-name" onChange={(e, value) => handleFieldChange("name", value)} {...fields.name} />
      <TextField id="father-or-husband-name" onChange={(e, value) => handleFieldChange("fatherHusbandName", value)} {...fields.fatherHusbandName} />
      <TextField id="aadhar-no" {...fields.aadharNumber} onChange={(e, value) => handleFieldChange("aadharNumber", value)} />
      <MobileNumberField id="mobile-no" {...fields.mobileNumber} onChange={(e, value) => handleFieldChange("mobileNumber", value)} />
      <TextField id="address" {...fields.address} onChange={(e, value) => handleFieldChange("address", value)} />
    </div>
  );
};

export default OwnerDetails;
