import React from "react";
import { Button } from "components";
import { ImageUpload } from "modules/common";
import LocationDetailsCard from "../LocationDetails";
import ComplaintTypeCard from "../ComplaintType";

const AddComplaintForm = ({ formKey, localizationLabels, handleFieldChange, form, categories }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <div className="add-complaint-main-cont form-without-button-cont-generic">
      <ImageUpload module="rainmaker-pgr" formKey={formKey} fieldKey="media" />
      <ComplaintTypeCard
        localizationLabels={localizationLabels}
        categories={categories}
        complaintType={fields.complaintType}
        handleFieldChange={handleFieldChange}
        additionalDetails={fields.additionalDetails}
      />
      <LocationDetailsCard
        formKey={formKey}
        handleFieldChange={handleFieldChange}
        landmark={fields.landmark}
        locationDetails={fields.address}
        houseNo={fields.houseNo}
        city={fields.city}
        mohalla={fields.mohalla}
      />
      {/* <AdditionalDetailsCard handleFieldChange={handleFieldChange} additionalDetails={fields.additionalDetails} /> */}
      <div className="responsive-action-button-cont ">
        <Button
          primary={true}
          fullWidth={true}
          style={{ boxShadow: "0 2px 5px 0 rgba(100, 100, 100, 0.5), 0 2px 10px 0 rgba(167, 167, 167, 0.5)" }}
          {...submit}
          className="responsive-action-button"
        />
      </div>
    </div>
  );
};

export default AddComplaintForm;
