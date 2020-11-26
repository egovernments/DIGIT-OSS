import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { BackButton, Card, CardHeader, CardText, RadioButtons, SubmitBar } from "@egovernments/digit-ui-react-components";

import { LOCALIZATION_KEY } from "../../constants/Localization";
import { getRoute, PgrRoutes, PGR_BASE } from "../../constants/Routes";

const ReasonPage = (props) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [selected, setSelected] = useState("");

  const onRadioChange = (value) => {
    let reopenDetails = Digit.SessionStorage.get(`reopen.${id}`);
    Digit.SessionStorage.set(`reopen.${id}`, { ...reopenDetails, reason: value });
    setSelected(value);
  };

  return (
    <React.Fragment>
      {/* <BackButton>Back</BackButton> */}
      <Card>
        <CardHeader>{t(`${LOCALIZATION_KEY.CS_REOPEN}_REOPEN_COMPLAINT`)}</CardHeader>
        {/* <LanguageSelect /> */}
        <CardText>
          {/* Select the option related to your complaint from the list given below.
        If the complaint type you are looking for is not listed select others.{" "} */}
          {/* {t(`${TRANSLATION_KEY}_OPTION_ONE`)} */}
        </CardText>
        <RadioButtons
          // handleChange={onRadioChange}
          onSelect={onRadioChange}
          selectedOption={selected}
          // selected={(value) => setSelected(value)}
          options={[
            t(`${LOCALIZATION_KEY.CS_REOPEN}_OPTION_ONE`),
            t(`${LOCALIZATION_KEY.CS_REOPEN}_OPTION_TWO`),
            t(`${LOCALIZATION_KEY.CS_REOPEN}_OPTION_THREE`),
            t(`${LOCALIZATION_KEY.CS_REOPEN}_OPTION_FOUR`),
          ]}
        />
        <Link to={`${props.match.path}/upload-photo/${id}`}>
          <SubmitBar label={t(`${LOCALIZATION_KEY.PT_COMMONS}_NEXT`)} />
        </Link>
      </Card>
    </React.Fragment>
  );
};

export default ReasonPage;
