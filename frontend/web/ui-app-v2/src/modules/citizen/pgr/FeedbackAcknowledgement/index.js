import React from "react";
import { Button, Icon } from "components";
import SuccessMessage from "modules/common/common/SuccessMessage/components/successmessage";
import Label from "utils/translationNode";
import "./index.css";

const FeedbackAcknowledge = ({ history }) => {
  return (
    <div className="feedback-success-container">
      <div className="success-message-main-screen">
        <SuccessMessage successmessage="CS_FEEDBACK_SUCCESS" icon={<Icon action="navigation" name="check" />} backgroundColor={"#22b25f"} />
      </div>
      <div className="btn-without-bottom-nav">
        <Button
          id="feedback-acknowledgement"
          onClick={() => history.push("/citizen")}
          primary={true}
          label={<Label buttonLabel={true} label="CORE_COMMON_CONTINUE" />}
          fullWidth={true}
        />
      </div>
    </div>
  );
};

export default FeedbackAcknowledge;
