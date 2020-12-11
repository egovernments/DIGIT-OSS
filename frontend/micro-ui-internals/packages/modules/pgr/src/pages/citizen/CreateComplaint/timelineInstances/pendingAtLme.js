import { TelePhone } from "@egovernments/digit-ui-react-components";
import React from "react";

const PendingAtLME = ({ name, mobile, text }) => {
  return (
    name &&
    mobile && (
      <React.Fragment>
        <TelePhone mobile={mobile} text={`${text} ${name}`} />
      </React.Fragment>
    )
  );
};

export default PendingAtLME;
