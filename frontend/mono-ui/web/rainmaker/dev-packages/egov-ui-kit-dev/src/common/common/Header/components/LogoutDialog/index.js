import React from "react";
import { Dialog, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const styles = {
  logoutContentStyle: { textAlign: "center", padding: "24px 20px" },
};

const LogoutDialog = ({ logout, closeLogoutDialog, logoutPopupOpen, oktext, canceltext, title, body }) => {
  const actions = [
    <Button
      id="logout-no-button"
      className="logout-no-button"
      label={<Label buttonLabel={true} label={canceltext} color="#FE7A51" />}
      backgroundColor={"#fff"}
      onClick={closeLogoutDialog}
      style={{ boxShadow: "none" }}
    />,
    <Button
      id="logout-yes-button"
      className="logout-yes-button"
      label={<Label buttonLabel={true} label={oktext} color="#FE7A51" />}
      backgroundColor={"#fff"}
      onClick={logout}
      style={{ boxShadow: "none" }}
    />,
  ];
  return (
    <Dialog
      open={logoutPopupOpen}
      title={
        <Label
          label={title}
          bold={true}
          color="rgba(0, 0, 0, 0.8700000047683716)"
          fontSize="20px"
          labelStyle={{ padding: "16px 0px 0px 24px" }}
        />
      }
      children={[
        <Label label={body} color="rgba(0, 0, 0, 0.6000000238418579)" labelStyle={{ padding: "16px 0px 0px 12px" }} />,
      ]}
      handleClose={closeLogoutDialog}
      actions={actions}
      contentClassName={"logout-popup"}
      contentStyle={{ width: "90%" }}
      isClose={true}
    />
  );
};

export default LogoutDialog;
