import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardText, RadioButtons, SubmitBar, CardCaption } from "@egovernments/digit-ui-react-components";
import { Link, useHistory } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { SessionStorage } from "@egovernments/digit-ui-libraries";
import { useTranslation } from "react-i18next";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";

const SubType = (props) => {
  const history = useHistory();
  const { t } = useTranslation();
  const SessionStorage = Digit.SessionStorage;
  const subType = SessionStorage.get("complaintType");
  const [subMenu, setSubMenu] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const subMenuIds = SessionStorage.get("serviceDefs").filter((def) => def.menuPath === subType.key);
    setSubMenu(
      subMenuIds.map((id) => ({
        key: id.serviceCode,
        name: t("SERVICEDEFS." + id.serviceCode.toUpperCase()),
      }))
    );
  }, []);

  function selected(item) {
    setSelectedOption(item);
  }

  function onSave() {
    props.save(selectedOption.key);
    history.push("/create-complaint/location");
  }

  return (
    // <Card>
    //   <CardCaption>{subType.name}</CardCaption>
    //   <CardHeader>Choose Complaint Sub-Type</CardHeader>
    //   <CardText>
    //     {/* The complaint type you have chosen has following complaint sub-types.
    //     Select the option of your choice from the list given below. */}
    //     {t("CS_COMPLAINT_SUBTYPE_TEXT")}
    //   </CardText>

    //   <RadioButtons selectedOption={selectedOption} options={subMenu} optionsKey="name" onSelect={selected} />
    //   <Link to="/create-complaint/location" onClick={onSave}>
    //     <SubmitBar label={t("PT_COMMONS_NEXT")} />
    //   </Link>
    // </Card>
    <TypeSelectCard
      cardCaption={subType.name}
      complaintTypePlaceHolder={t("CS_ADDCOMPLAINT_COMPLAINT_SUBTYPE_PLACEHOLDER")}
      cardText={t("CS_COMPLAINT_SUBTYPE_TEXT")}
      submitBarLabel={t("PT_COMMONS_NEXT")}
      selectedOption={selectedOption}
      menu={subMenu}
      selected={selected}
      onSave={onSave}
    />
  );
};

export default SubType;
