import React from "react";
import { Link } from "react-router-dom";
import { Button, TextField, Card } from "components";
import Label from "utils/translationNode";
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
              <TextField {...fields.name} onChange={(e, value) => handleFieldChange("name", value)} />
              <TextField {...fields.phonenumber} />
              <TextField {...fields.email} onChange={(e, value) => handleFieldChange("email", value)} />
              <Link to="/employee/user/change-password">
                <div style={{ marginTop: "24px", marginBottom: "24px" }}>
                  <Label label={"CHANGE PASSWORD"} color="#f89a3f" />
                </div>
              </Link>
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
