import React, { useState } from "react";
import { Card, CardHeader, CardText, TextArea, SubmitBar, LinkButton, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LOCALIZATION_KEY } from "../../../constants/Localization";
import { PgrRoutes, getRoute } from "../../../constants/Routes";

const Details = (props) => {
  const [details, setDetails] = useState(null);
  // const [valid, setValid] = useState(true);

  let { t } = useTranslation();
  const history = useHistory();

  function submitComplaint() {
    details ? props.submitComplaint(details) : null;
    history.push(getRoute(props.match, PgrRoutes.CreateComplaintResponse));
  }

  function skip() {
    props.submitComplaint();
    history.push(getRoute(props.match, PgrRoutes.CreateComplaintResponse));
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
      {/* {valid ? null : <CardLabelError>{t("CS_ADDCOMPLAINT_ERROR_MESSAGE")}</CardLabelError>} */}
      <TextArea onChange={textInput}></TextArea>
      <SubmitBar label={t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_ADDITIONAL_DETAILS_SUBMIT_COMPLAINT`)} onSubmit={submitComplaint} />
      {props.skip ? <LinkButton label={t(`${LOCALIZATION_KEY.CORE_COMMON}_SKIP_CONTINUE`)} onClick={skip} /> : null}
    </Card>
  );
};

export default Details;
