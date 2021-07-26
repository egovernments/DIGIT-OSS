import React, { useState } from "react";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { FormStep, RadioOrSelect, RadioButtons, CitizenInfoLabel } from "@egovernments/digit-ui-react-components";

const TLInfoLabel = ({ t, config, onSelect, userType, formData }) => {
  return (
    <React.Fragment>
      <div style={{width:"80%"}}>
        {/* //TODO: :-(  add localization and find some better solution*/}
        <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("If there are changes in the trade details, Please make changes in the respective fields.If there are no changes, please go ahead and submit the application.")} />
      </div>
    </React.Fragment>
  );
};

export default TLInfoLabel;
