import React from "react";
import PropTypes from "prop-types";
import Image from "../Image";
import Label from "../Label";
import Icon from "../Icon";

const ProfileSection = ({
  imgStyle,
  cardStyles,
  nameStyle,
  locationStyle,
  emailIdStyle,
  name,
  location,
  addIconName,
  imgSrc,
  addIconStyle,
  onClickAddPic,
  emailId,
  className,
}) => {
  return (
    <div className="profileSection" style={cardStyles}>
      <div className="profileContainer" style={{ textAlign: "center" }}>
        <Image id="profile-photo" className="img-Profile" circular={true} style={imgStyle} source={imgSrc} />
        {addIconName && (
          <div style={addIconStyle}>
            <Icon id="profile-upload-icon" action="image" name={addIconName} onClick={onClickAddPic} color={"#ffffff"} />
          </div>
        )}
        {name && (
          <Label
            id="profile-name"
            className="name-Profile"
            label={name}
            style={nameStyle}
            labelStyle={{ letterSpacing: 0.6 }}
            dark={true}
            bold={true}
          />
        )}
        {location && <Label id="profile-location" className="loc-Profile" labelPosition="after" label={location} style={locationStyle} />}
        {emailId && <Label id="profile-emailid" className="loc-Profile" label={emailId} style={emailIdStyle} />}
      </div>
    </div>
  );
};

export default ProfileSection;

ProfileSection.propTypes = {
  style: PropTypes.object,
  cardStyles: PropTypes.object,
  nameStyle: PropTypes.object,
  locationStyle: PropTypes.object,
  iconStyle: PropTypes.object,
  onClickAddPic: PropTypes.func,
};
