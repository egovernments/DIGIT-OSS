import React from "react";
import { Link } from "react-router-dom";
import { Button, TextField } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { ProfileSection } from "modules/common";
import "./index.css";

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
          <div style={{ padding: "0 8px" }} className="col-xs-12 col-sm-8 col-md-8 col-lg-8 profileFormContainer">
            <TextField {...fields.name} onChange={(e, value) => handleFieldChange("name", value)} />
            <TextField {...fields.phonenumber} />
            <TextField {...fields.email} onChange={(e, value) => handleFieldChange("email", value)} />
            <Link to="/user/change-password">
              <div style={{ marginTop: "24px", marginBottom: "24px" }}>
                <Label className="change-password-label-style" label={"CORE_COMMON_CHANGE_PASSWORD"} color="#f89a3f" />
              </div>
            </Link>
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
