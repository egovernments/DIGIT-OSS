import React, { useState } from "react";
import { Card, CardSubHeader, CardHeader, CardText, CardLabel, TextArea, SubmitBar } from "@egovernments/digit-ui-react-components";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TextInputCard } from "@egovernments/digit-ui-react-components";

const Landmark = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [landmark, setLandmark] = useState(null);

  function textInput(e) {
    setLandmark(e.target.value);
  }

  function save() {
    props.save(landmark);
    history.push("/create-complaint/upload-photos");
  }

  return (
    <TextInputCard
      header={t("CS_PROVIDE_LANDMARK")}
      subHeader={t("CS_ADDCOMPLAINT_COMPLAINT_LOCATION")}
      cardText={t("CS_PROVIDE_LANDMARK_TEXT")}
      CardLabel={t("CS_ADDCOMPLAINT_LANDMARK")}
      nextText={t("PT_COMMONS_NEXT")}
      skip={false}
      onSave={save}
      textInput={textInput}
    />
  );
};

export default Landmark;
