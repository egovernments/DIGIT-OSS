import React, { useState } from "react";
import { Card, CardSubHeader, CardHeader, CardText, CardLabel, TextArea, SubmitBar } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Landmark = (props) => {
  const { t } = useTranslation();
  const [landmark, setLandmark] = useState(null);

  function textInput(e) {
    setLandmark(e.target.value);
  }

  function save() {
    props.save(landmark);
  }

  return (
    <Card>
      <CardSubHeader>{t("CS_ADDCOMPLAINT_COMPLAINT_LOCATION")}</CardSubHeader>
      <CardHeader>{t("CS_PROVIDE_LANDMARK")}</CardHeader>
      <CardText>
        {/* Provide the landmark to help us reach the complaint location easily. */}
        {t("CS_PROVIDE_LANDMARK_TEXT")}
      </CardText>
      <CardLabel>{t("CS_ADDCOMPLAINT_LANDMARK")}</CardLabel>
      <TextArea onChange={textInput}></TextArea>
      <Link to="/create-complaint/upload-photos" onClick={save}>
        <SubmitBar label="Next" />
      </Link>
    </Card>
  );
};

export default Landmark;
