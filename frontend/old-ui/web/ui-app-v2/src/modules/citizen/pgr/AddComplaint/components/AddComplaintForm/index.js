import React from "react";
import { Button } from "components";
import ImageUpload from "modules/common/common/ImageUpload";
import LocationDetailsCard from "../LocationDetails";
import AdditionalDetailsCard from "../AdditionalDetails";
import ComplaintTypeCard from "../ComplaintType";

const AddComplaintForm = ({ formKey, localizationLabels, handleFieldChange, form, categories }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <div className="add-complaint-main-cont">
      <ImageUpload module="rainmaker-pgr" formKey={formKey} fieldKey="media" />
      <ComplaintTypeCard localizationLabels={localizationLabels} categories={categories} complaintType={fields.complaintType} />
      <LocationDetailsCard formKey={formKey} handleFieldChange={handleFieldChange} landmark={fields.landmark} locationDetails={fields.address} />
      <AdditionalDetailsCard handleFieldChange={handleFieldChange} additionalDetails={fields.additionalDetails} />
      <div className="col-lg-offset-2 col-md-offset-2 col-lg-8 col-md-8 add-complaint-button-cont btn-without-bottom-nav">
        <Button
          primary={true}
          fullWidth={true}
          style={{ boxShadow: "0 2px 5px 0 rgba(100, 100, 100, 0.5), 0 2px 10px 0 rgba(167, 167, 167, 0.5)" }}
          {...submit}
          className="add-complaint-submit-button"
        />
      </div>
    </div>
  );
};

export default AddComplaintForm;
