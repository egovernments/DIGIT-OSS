import React, { useState } from "react";
import { Card, CardSubHeader, CardHeader, CardText, CardLabel, TextArea, SubmitBar, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LOCALIZATION_KEY } from "../../constants/Localization";
import { PgrRoutes, getRoute } from "../../constants/Routes";

const Landmark = (props) => {
  const { t } = useTranslation();
  const [landmark, setLandmark] = useState(null);
  const history = useHistory();
  const [valid, setValid] = useState(true);

  function textInput(e) {
    setLandmark(e.target.value);
  }

  function save() {
    if (landmark === null || landmark === "") {
      setValid(false);
    } else {
      props.save(landmark);
      history.push(getRoute(props.match, PgrRoutes.UploadPhotos));
    }
  }

  return (
    <Card>
      <CardSubHeader>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_COMPLAINT_LOCATION`)}</CardSubHeader>
      <CardHeader>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_PROVIDE_LANDMARK`)}</CardHeader>
      <CardText>
        {/* Provide the landmark to help us reach the complaint location easily. */}
        {t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_PROVIDE_LANDMARK_TEXT`)}
      </CardText>
      <CardLabel>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_LANDMARK`)}</CardLabel>
      {valid ? null : <CardLabelError>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_LANDMARK_ERROR`)}</CardLabelError>}
      <TextArea onChange={textInput}></TextArea>
      <SubmitBar label={t(`${LOCALIZATION_KEY.PT_COMMONS}_NEXT`)} onSubmit={save} />
    </Card>
  );
};

export default Landmark;
