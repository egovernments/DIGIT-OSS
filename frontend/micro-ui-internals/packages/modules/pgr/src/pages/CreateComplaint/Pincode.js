import React, { useState } from "react";
import { Card, CardHeader, CardSubHeader, CardText, CardLabel, TextInput, SubmitBar, LinkButton } from "@egovernments/digit-ui-react-components";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { TextInputCard } from "@egovernments/digit-ui-react-components";

const Pincode = (props) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [pincode, setPincode] = useState(null);

  function textInput(e) {
    setPincode(e.target.value);
  }

  function onSave() {
    props.save(pincode);
    history.push("/create-complaint/address");
  }

  function onSkip() {
    history.push("/create-complaint/address");
  }
  return (
    <TextInputCard
      header={t("CS_ADDCOMPLAINT_PINCODE")}
      subHeader={t("CS_ADDCOMPLAINT_COMPLAINT_LOCATION")}
      cardText={t("CS_ADDCOMPLAINT_CHANGE_PINCODE_TEXT")}
      CardLabel={t("CORE_COMMON_PINCODE")}
      nextText={t("PT_COMMONS_NEXT")}
      skipAndContinueText={t("CORE_COMMON_SKIP_CONTINUE")}
      skip={true}
      onSave={onSave}
      onSkip={onSkip}
      textInput={textInput}
    />
  );
};

export default Pincode;
