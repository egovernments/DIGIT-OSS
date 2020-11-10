import React, { useEffect, useState } from "react";
import Card from "../../@egovernments/components/js/Card";
import CardHeader from "../../@egovernments/components/js/CardHeader";
import CardText from "../../@egovernments/components/js/CardText";
import RadioButtons from "../../@egovernments/components/js/RadioButtons";
import SubmitBar from "../../@egovernments/components/js/SubmitBar";
import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
import { Storage } from "../../@egovernments/digit-utils/services/Storage";
import { useTranslation } from "react-i18next";
import CardCaption from "../../@egovernments/components/js/CardCaption";

const SubType = (props) => {
  const { t } = useTranslation();
  const subType = Storage.get("complaintType");
  const [subMenu, setSubMenu] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const subMenuIds = Storage.get("serviceDefs").filter(
      (def) => def.menuPath === subType.key
    );
    setSubMenu(
      subMenuIds.map((id) => ({
        key: id.serviceCode,
        name: t(id.i18nKey),
      }))
    );
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

      <RadioButtons
        selectedOption={selectedOption}
        options={subMenu}
        optionsKey="name"
        onSelect={selected}
      />
      <Link to="/create-complaint/location" onClick={onSave}>
        <SubmitBar label={t("PT_COMMONS_NEXT")} />
      </Link>
    </Card>
  );
};

export default SubType;
