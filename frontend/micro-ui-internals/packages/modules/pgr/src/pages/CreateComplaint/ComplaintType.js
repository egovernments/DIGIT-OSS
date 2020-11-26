import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardLabelError, CardText, RadioButtons, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { LOCALIZATION_KEY } from "../../constants/Localization";
import { PgrRoutes, getRoute } from "../../constants/Routes";

const CreateComplaint = (props) => {
  const SessionStorage = Digit.SessionStorage;
  const MDMSService = Digit.MDMSService;
  const appState = useSelector((state) => state);
  const history = useHistory();
  const { register, handleSubmit } = useForm();
  const { t } = useTranslation();
  const [localMenu, setLocalMenu] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [valid, setValid] = useState(true);

  useEffect(
    () =>
      (async () => {
        setLocalMenu(await Digit.GetServiceDefinitions.getMenu(appState.stateInfo.code, t));
      })(),
    [appState]
  );

  function selected(type) {
    setSelectedOption(type);
    SessionStorage.set("complaintType", type);
  }

  function onSave() {
    if (selectedOption === null) {
      setValid(false);
    } else {
      if (selectedOption.key === "") {
        props.save({ key: "Others", name: "Others" });
        history.push(getRoute(props.match, PgrRoutes.LocationSearch));
      } else {
        history.push(getRoute(props.match, PgrRoutes.SubType));
      }
    }
  }
  return (
    <Card>
      <CardHeader>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_COMPLAINT_TYPE_PLACEHOLDER`)}</CardHeader>
      <CardText>
        {/* Select the option related to your complaint from the list given below.
        If the complaint type you are looking for is not listed select others. */}
        {t(`${LOCALIZATION_KEY.CS_COMPLAINT}_TYPE_TEXT`)}
      </CardText>
      {valid ? null : <CardLabelError>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_ERROR_COMPLAINT_TYPE`)}</CardLabelError>}
      {localMenu ? <RadioButtons selectedOption={selectedOption} options={localMenu} optionsKey="name" onSelect={selected} /> : null}
      <SubmitBar label={t(`${LOCALIZATION_KEY.PT_COMMONS}_NEXT`)} onSubmit={onSave} />
    </Card>
  );
};

export default CreateComplaint;
