import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardText, RadioButtons, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const CreateComplaint = (props) => {
  const SessionStorage = Digit.SessionStorage;
  const MDMSService = Digit.MDMSService;
  const appState = useSelector((state) => state);
  const history = useHistory();
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);
  const { t } = useTranslation();
  const [localMenu, setLocalMenu] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

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
    if (selectedOption.key === "") {
      props.save({ key: "Others", name: "Others" });
      history.push("/create-complaint/location");
    } else {
      history.push("/create-complaint/subtype");
    }
  }
  return (
    <Card>
      <CardHeader>{t("CS_ADDCOMPLAINT_COMPLAINT_TYPE_PLACEHOLDER")}</CardHeader>
      <CardText>
        {/* Select the option related to your complaint from the list given below.
        If the complaint type you are looking for is not listed select others. */}
        {t("CS_COMPLAINT_TYPE_TEXT")}
      </CardText>
      {localMenu ? <RadioButtons selectedOption={selectedOption} options={localMenu} optionsKey="name" onSelect={selected} /> : null}
      <SubmitBar label={t("PT_COMMONS_NEXT")} onSubmit={onSave} />
    </Card>
  );
};

export default CreateComplaint;
