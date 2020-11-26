import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardText, RadioButtons, SubmitBar, CardCaption, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LOCALIZATION_KEY } from "../../constants/Localization";
import { PgrRoutes, getRoute } from "../../constants/Routes";

const SubType = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const SessionStorage = Digit.SessionStorage;
  const subType = SessionStorage.get("complaintType");
  const [subMenu, setSubMenu] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    setSubMenu(Digit.GetServiceDefinitions.getSubMenu(subType, t));
  }, []);

  function selected(item) {
    setSelectedOption(item);
  }

  function onSave() {
    if (selectedOption === null) {
      setValid(false);
    } else {
      props.save(selectedOption.key);
      history.push(getRoute(props.match, PgrRoutes.LocationSearch));
    }
  }

  return (
    <Card>
      <CardCaption>{subType.name}</CardCaption>
      <CardHeader>Choose Complaint Sub-Type</CardHeader>
      <CardText>
        {/* The complaint type you have chosen has following complaint sub-types.
        Select the option of your choice from the list given below. */}
        {t(`${LOCALIZATION_KEY.CS_COMPLAINT}_SUBTYPE_TEXT`)}
      </CardText>
      {valid ? null : <CardLabelError>{t("CS_ADDCOMPLAINT_ERROR_MESSAGE")}</CardLabelError>}
      <RadioButtons selectedOption={selectedOption} options={subMenu} optionsKey="name" onSelect={selected} />
      <SubmitBar label={t(`${LOCALIZATION_KEY.PT_COMMONS}_NEXT`)} onSubmit={onSave} />
    </Card>
  );
};

export default SubType;
