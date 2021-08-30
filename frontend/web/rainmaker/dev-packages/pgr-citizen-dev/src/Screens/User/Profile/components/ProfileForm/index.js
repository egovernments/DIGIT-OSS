import React from "react";
import Field from "egov-ui-kit/utils/field";
import { Button } from "components";
import { CityPicker } from "modules/common";
import { ProfileSection } from "modules/common";

const ProfileForm = ({ form, handleFieldChange, onClickAddPic, img, profilePic }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <div>
      <div className="profile-card-container">
        <div>
          <div style={{ padding: 0 }} className="col-xs-12 col-sm-4 col-md-4 col-lg-4 profile-profilesection">
            <ProfileSection img={profilePic || img} onClickAddPic={onClickAddPic} />
          </div>
          <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8 profileFormContainer">
            <Field fieldKey="name" field={fields.name} handleFieldChange={handleFieldChange} />
            <CityPicker onChange={handleFieldChange} fieldKey="city" field={fields.city} />
            <Field fieldKey="email" field={fields.email} handleFieldChange={handleFieldChange} />
          </div>
        </div>
      </div>
      <div className="responsive-action-button-cont">
        <Button className="responsive-action-button" {...submit} primary={true} fullWidth={true} />
      </div>
    </div>
  );
};

export default ProfileForm;
