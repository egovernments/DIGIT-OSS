import React from "react";
import { Button, Icon } from "components";
import { SuccessMessage } from "modules/common";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const ReopenAcknowledgement = ({ history, userInfo }) => {
  // const userInfo = ;
  const role = (userInfo && userInfo.roles && userInfo.roles.length && userInfo.roles[0].code.toLowerCase()) || null;
  return (
    <div className="reopen-success-container">
      <div className="success-message-main-screen">
        <SuccessMessage successmessage="CS_REOPEN_SUCCESS_MESSAGE" icon={<Icon action="navigation" name="check" />} backgroundColor={"#22b25f"} />
      </div>
      <div className="responsive-action-button-cont">
        <Button
          id="success-message-acknowledgement"
          /* Mseva 2.0 changes */
          onClick={() => (role === "citizen" ? history.push("/") : history.push("all-complaints"))}
          primary={true}
          label={<Label buttonLabel={true} label="CORE_COMMON_GOTOHOME" />}
          fullWidth={true}
          className="responsive-action-button"
        />
      </div>
    </div>
  );
};

export default ReopenAcknowledgement;
