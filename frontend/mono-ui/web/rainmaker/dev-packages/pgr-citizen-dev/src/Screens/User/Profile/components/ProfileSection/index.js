import React from "react";
import { ProfileSection } from "components";

const imgStyle = { width: 127, height: 127 };

const addIconStyle = {
  background: "#00bbd3",
  position: "absolute",
  right: "-5%",
  bottom: "0px",
  color: "rgb(255, 255, 255)",
  borderRadius: "50%",
  padding: "12px",
  height: 48,
  width: 48,
};

const cardStyles = {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: "0 auto",
  paddingTop: 30,
  paddingBottom: 30,
  backgroundColor: "#e0e0e0",
};

const ProfileSectionView = ({ onClickAddPic, img }) => {
  return (
    <ProfileSection
      id="profile-photo"
      className="profileSection"
      imgStyle={imgStyle}
      addIconName="add-a-photo"
      addIconStyle={addIconStyle}
      cardStyles={cardStyles}
      imgSrc={img}
      onClickAddPic={onClickAddPic}
    />
  );
};

export default ProfileSectionView;
