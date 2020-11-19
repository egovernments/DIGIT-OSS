import React, { useState } from "react";
import { Card, CardHeader, CardSubHeader, CardText, CardLabel, TextInput, SubmitBar, LinkButton } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LOCALIZATION_KEY } from "../../constants/Localization";

const Pincode = (props) => {
  const [pincode, setPincode] = useState(null);

  const { t } = useTranslation();

  function textInput(e) {
    setPincode(e.target.value);
  }
  return (
    <Card>
      <CardSubHeader>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_COMPLAINT_LOCATION`)}</CardSubHeader>
      <CardHeader>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_PINCODE`)}</CardHeader>
      <CardText>
        {/* If you know the pincode of the complaint address, provide below. It will
        help us identify complaint location easily or you can skip and continue */}
        {t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_CHANGE_PINCODE_TEXT`)}
      </CardText>
      <CardLabel>{t(`${LOCALIZATION_KEY.CORE_COMMON}_PINCODE`)}</CardLabel>
      <TextInput onChange={textInput} />
      <Link
        to="/create-complaint/address"
        onClick={() => {
          props.save(pincode);
        }}
      >
        <SubmitBar label={t(`${LOCALIZATION_KEY.PT_COMMONS}_NEXT`)} />
      </Link>
      {props.skip ? (
        <Link to="/create-complaint/address">
          <LinkButton label={t(`${LOCALIZATION_KEY.CORE_COMMON}_SKIP_CONTINUE`)} />
        </Link>
      ) : null}
    </Card>
  );
};

export default Pincode;
