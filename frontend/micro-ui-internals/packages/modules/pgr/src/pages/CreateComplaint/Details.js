import React, { useState } from "react";
import { Card, CardHeader, CardText, TextArea, SubmitBar, LinkButton } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LOCALIZATION_KEY } from "../../constants/Localization";
import { PgrRoutes, getRoute } from "../../constants/Routes";

const Details = (props) => {
  const [details, setDetails] = useState(null);
  let { t } = useTranslation();

  function submitComplaint() {
    props.submitComplaint(details);
  }

  function skipSubmitComplaint() {
    props.submitComplaint();
  }

  function textInput(e) {
    setDetails(e.target.value);
  }

  return (
    <Card>
      {/* <CardHeader>Provide Additional Details</CardHeader> */}
      <CardHeader>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_PROVIDE_ADDITIONAL_DETAILS`)}</CardHeader>
      <CardText>
        {/* If you think apart from information provided till now additional details
        are required to resolve complaint, provide it below: */}
        {t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_ADDITIONAL_DETAILS_TEXT`)}
      </CardText>
      <TextArea onChange={textInput}></TextArea>
      <Link to={getRoute(props.match, PgrRoutes.CreateComplaintResponse)} onClick={submitComplaint}>
        <SubmitBar label={t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_ADDITIONAL_DETAILS_SUBMIT_COMPLAINT`)} />
      </Link>
      {props.skip ? (
        <Link to={getRoute(props.match, PgrRoutes.CreateComplaintResponse)} onClick={skipSubmitComplaint}>
          <LinkButton label={t(`${LOCALIZATION_KEY.CORE_COMMON}_SKIP_CONTINUE`)} />
        </Link>
      ) : null}
    </Card>
  );
};

export default Details;
