import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import BackButton from "../../@egovernments/components/js/BackButton";
import Card from "../../@egovernments/components/js/Card";
import CardHeader from "../../@egovernments/components/js/CardHeader";
import CardText from "../../@egovernments/components/js/CardText";
import RadioButtons from "../../@egovernments/components/js/RadioButtons";
import SubmitBar from "../../@egovernments/components/js/SubmitBar";
import { Storage } from "../../@egovernments/digit-utils/services/Storage";

const ReasonPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const TRANSLATION_KEY = "CS_REOPEN";
  const [selected, setSelected] = useState("");

  const onRadioChange = (value) => {
    let reopenDetails = Storage.get(`reopen.${id}`);
    Storage.set(`reopen.${id}`, { ...reopenDetails, reason: value });
    setSelected(value);
  };

  return (
    <>
      <BackButton>Back</BackButton>
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
    </>
  );
};

export default ReasonPage;
