import React from "react";
import { Button, TextField } from "components";
import CityPicker from "../../../common/CityPicker";
import Label from "egov-ui-kit/utils/translationNode";

const ProfileForm = ({ name, emailId, handleMailChange, handleNameChange }) => {
  return (
    <div>
      <form className="profileFormContainer">
        <TextField
          className="profile-form-field"
          id="profile-form-name"
          fullWidth={true}
          value={name}
          hintText={<Label label="CORE_COMMON_NAME_PLACEHOLDER" />}
          floatingLabelText={<Label label="PT_OWNER_NAME" />}
          onChange={handleNameChange}
          isRequired={true}
        />
        <CityPicker />
        <TextField
          className="profile-form-field"
          id="profile-form-email"
          fullWidth={true}
          value={emailId}
          floatingLabelText={<Label label="CS_PROFILE_EMAIL" />}
          hintText={<Label label="CS_PROFILE_EMAIL_PLACEHOLDER" />}
          onChange={handleMailChange}
        />
      </form>
      <div className="col-lg-offset-2 col-md-offset-2 col-lg-8 col-md-8 profileBtnWrapper">
        <Button className="profileBtn" id="profile-save-action" primary={true} label="SAVE" fullWidth={true} onClick={this.onSaveClick} />
      </div>
    </div>
  );
};

export default ProfileForm;
