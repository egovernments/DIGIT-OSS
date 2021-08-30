import React from "react";
import Field from "utils/field";
import { Button, Card } from "components";
import CityPicker from "modules/common/common/CityPicker";
import ProfileSection from "modules/common/User/components/ProfileSection";

const ProfileForm = ({ form, handleFieldChange, onClickAddPic, img, profilePic }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <div>
      <Card
        className="profile-card-container"
        textChildren={
          <div>
            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 profile-profilesection">
              <ProfileSection img={profilePic || img} onClickAddPic={onClickAddPic} />
            </div>
            <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8 profileFormContainer">
              <Field fieldKey="name" field={fields.name} handleFieldChange={handleFieldChange} />
              <CityPicker onChange={handleFieldChange} fieldKey="city" field={fields.city} />
              <Field fieldKey="email" field={fields.email} handleFieldChange={handleFieldChange} />
            </div>
          </div>
        }
      />
      <div className="col-xs-12 col-sm-offset-10 col-sm-2 col-lg-offset-10 col-md-offset-10 col-lg-2 col-md-2 profileBtnWrapper btn-without-bottom-nav ">
        <Button className="profileBtn" {...submit} primary={true} fullWidth={true} />
      </div>
    </div>
  );
};

export default ProfileForm;
