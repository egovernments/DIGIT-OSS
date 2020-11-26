import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardSubHeader,
  CardText,
  CardLabel,
  TextInput,
  SubmitBar,
  LinkButton,
  CardLabelError,
} from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LOCALIZATION_KEY } from "../../constants/Localization";
import { PgrRoutes, getRoute } from "../../constants/Routes";

const Pincode = (props) => {
  const [pincode, setPincode] = useState(props.pincode);
  const [valid, setValid] = useState(true);

  const { t } = useTranslation();
  const history = useHistory();

  function textInput(e) {
    setPincode(e.target.value);
  }

  function onSave() {
    if (pincode === null || pincode === "") {
      setValid(false);
    } else {
      props.save(pincode);
      history.push(getRoute(props.match, PgrRoutes.Address));
    }
  }

  function skip() {
    history.push(getRoute(props.match, PgrRoutes.Address));
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
      {valid ? null : <CardLabelError>{t(`${LOCALIZATION_KEY.CORE_COMMON}_PINCODE_NOT_ENTERED`)}</CardLabelError>}
      <TextInput onChange={textInput} value={pincode} />
      <SubmitBar onSubmit={onSave} label={t(`${LOCALIZATION_KEY.PT_COMMONS}_NEXT`)} />
      {props.skip ? <LinkButton onClick={skip} label={t(`${LOCALIZATION_KEY.CORE_COMMON}_SKIP_CONTINUE`)} /> : null}
    </Card>
  );
};

export default Pincode;
