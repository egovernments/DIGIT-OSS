import React from "react";
import { Dialog, Button } from "components";
import Label from "utils/translationNode";

const styles = {
  logoutContentStyle: { textAlign: "center", padding: "24px 20px" },
};

const LogoutDialog = ({ logout, closeLogoutDialog, logoutPopupOpen }) => {
  return (
    <Dialog
      open={logoutPopupOpen}
      children={[
        <div style={styles.logoutContentStyle} key={"logout-popup"}>
          <div className="logout-label">
            <Label label={"CORE_COMMON_LOGOUT"} bold={true} color="#484848" fontSize="16px" labelStyle={{ marginBottom: "24px" }} />
            <Label label={"CORE_LOGOUTPOPUP_CONFIRM"} labelStyle={{ marginBottom: "32px" }} />
          </div>
          <div className="logout-button">
            <Button
              id="logout-no-button"
              className="logout-no-button"
              label={<Label buttonLabel={true} label={"CORE_LOGOUTPOPUP_NO"} />}
              backgroundColor={"#969696"}
              onClick={closeLogoutDialog}
            />
            <Button
              id="logout-yes-button"
              className="logout-yes-button"
              label={<Label buttonLabel={true} label={"CORE_LOGOUTPOPUP_YES"} />}
              primary={true}
              onClick={logout}
            />
          </div>
        </div>,
      ]}
      handleClose={closeLogoutDialog}
      isClose={true}
    />
  );
};

export default LogoutDialog;
