import React, { useEffect, useState, useCallback } from "react";
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
import _ from "lodash";

const Pincode = (props) => {
  const [pincode, setPincode] = useState(props.pincode);
  const [valid, setValid] = useState(true);
  const [possible, setPossible] = useState(true);
  const PincodeMap = Digit.PincodeMap;
  const { t } = useTranslation();
  const history = useHistory();
  function textInput(e) {
    setPincode(e.target.value);
  }

  const debounceSetState = _.debounce(() => {
    console.log("hmmm");
    setValid(false);
  }, 1000);

  const callValid = useCallback(() => debounceSetState, []);

  useEffect(() => {
    if (pincode) {
      console.log(pincode);
      if (pincode.toString().length < 6 || pincode.toString().length > 7) {
        callValid();
      } else {
        console.log("debouncestate cancell");
        console.log(debounceSetState.cancel());
        debounceSetState.cancel();
        setValid(true);
        setPossible(true);
      }
    }
  }, [pincode]);

  function onSave() {
    if (pincode === null || pincode === "" || valid === false) {
      setValid(false);
    } else {
      if (Object.keys(PincodeMap).includes(pincode)) {
        props.save(pincode.toString());
        history.push(getRoute(props.match, PgrRoutes.Address));
      } else {
        setPossible(false);
      }
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
      {valid ? null : <CardLabelError>{t(`${LOCALIZATION_KEY.CORE_COMMON}_PINCODE_INVALID`)}</CardLabelError>}
      {possible ? null : <CardLabelError>{t(`${LOCALIZATION_KEY.CORE_COMMON}_PINCODE_NOT_SERVICEABLE`)}</CardLabelError>}
      <TextInput onChange={textInput} value={pincode} />
      <SubmitBar onSubmit={onSave} label={t(`${LOCALIZATION_KEY.PT_COMMONS}_NEXT`)} />
      {props.skip ? <LinkButton onClick={skip} label={t(`${LOCALIZATION_KEY.CORE_COMMON}_SKIP_CONTINUE`)} /> : null}
    </Card>
  );
};

export default Pincode;
