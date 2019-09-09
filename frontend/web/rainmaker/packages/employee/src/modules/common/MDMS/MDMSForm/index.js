import React from "react";
import { Dialog } from "components";

const MDMSForm = ({ open, handleClose, children, title }) => {
  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      children={children}
      title={title}
      isClose={true}
      bodyStyle={{ background: "#ffffff" }}
      contentStyle={{ maxWidth: "none" }}
      titleStyle={{ textAlign: "left" }}
    />
  );
};

export default MDMSForm;
