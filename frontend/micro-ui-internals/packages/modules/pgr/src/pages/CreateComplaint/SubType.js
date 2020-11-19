import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardText, RadioButtons, SubmitBar, CardCaption } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SubType = (props) => {
  const { t } = useTranslation();
  const SessionStorage = Digit.SessionStorage;
  const subType = SessionStorage.get("complaintType");
  const [subMenu, setSubMenu] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setSubMenu(Digit.GetServiceDefinitions.getSubMenu(subType, t));
  }, []);

  function selected(item) {
    setSelectedOption(item);
  }

  function onSave() {
    props.save(selectedOption.key);
  }

  return (
    <Card>
      <CardCaption>{subType.name}</CardCaption>
      <CardHeader>Choose Complaint Sub-Type</CardHeader>
      <CardText>
        {/* The complaint type you have chosen has following complaint sub-types.
        Select the option of your choice from the list given below. */}
        {t("CS_COMPLAINT_SUBTYPE_TEXT")}
      </CardText>

      <RadioButtons selectedOption={selectedOption} options={subMenu} optionsKey="name" onSelect={selected} />
      <Link to="/create-complaint/location" onClick={onSave}>
        <SubmitBar label={t("PT_COMMONS_NEXT")} />
      </Link>
    </Card>
  );
};

export default SubType;
