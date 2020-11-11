import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import { BackButton, Card, CardHeader, CardText, RadioButtons, SubmitBar } from "@egovernments/digit-ui-react-components";

const ReasonPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const TRANSLATION_KEY = "CS_REOPEN";
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
        <CardHeader>{t(`CS_HEADER_REOPEN_COMPLAINT`)}</CardHeader>
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
            t(`${TRANSLATION_KEY}_OPTION_ONE`),
            t(`${TRANSLATION_KEY}_OPTION_TWO`),
            t(`${TRANSLATION_KEY}_OPTION_THREE`),
            t(`${TRANSLATION_KEY}_OPTION_FOUR`),
          ]}
        />
        <Link to={`/reopen/upload-photo/${id}`}>
          <SubmitBar label="Next" />
        </Link>
      </Card>
    </React.Fragment>
  );
};

export default ReasonPage;
