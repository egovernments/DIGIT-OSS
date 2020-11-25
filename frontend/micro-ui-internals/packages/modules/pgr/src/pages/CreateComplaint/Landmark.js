import React, { useState } from "react";
import { Card, CardSubHeader, CardHeader, CardText, CardLabel, TextArea, SubmitBar } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LOCALIZATION_KEY } from "../../constants/Localization";
import { PgrRoutes, getRoute } from "../../constants/Routes";

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
      <CardSubHeader>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_COMPLAINT_LOCATION`)}</CardSubHeader>
      <CardHeader>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_PROVIDE_LANDMARK`)}</CardHeader>
      <CardText>
        {/* Provide the landmark to help us reach the complaint location easily. */}
        {t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_PROVIDE_LANDMARK_TEXT`)}
      </CardText>
      <CardLabel>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_LANDMARK`)}</CardLabel>
      <TextArea onChange={textInput}></TextArea>
      <Link to={getRoute(props.match, PgrRoutes.UploadPhotos)} onClick={save}>
        <SubmitBar label={t(`${LOCALIZATION_KEY.PT_COMMONS}_NEXT`)} />
      </Link>
    </Card>
  );
};

export default Landmark;
