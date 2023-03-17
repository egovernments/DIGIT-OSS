import React from "react";
const ConfirmationBox = ({ t, title }) => {
  return (
    <div className="confirmation_box">
      <span>{t(`${title}`)} </span>
    </div>
  );
};

export default ConfirmationBox;
