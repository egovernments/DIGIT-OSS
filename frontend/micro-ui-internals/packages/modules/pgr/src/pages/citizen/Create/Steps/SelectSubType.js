import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const SelectSubType = ({ config, onSelect }) => {
  const goNext = () => {
    onSelect(subType);
  };
  const complaintType = Digit.SessionStorage.get("complaintType");
  const __initSubType__ = Digit.SessionStorage.get("subType");
  const { t } = useTranslation();
  const [subType, setSubType] = useState(__initSubType__ ? __initSubType__ : {});
  const menu = Digit.GetServiceDefinitions.getSubMenu(complaintType, t);

  function selectedValue(value) {
    setSubType(value);
    Digit.SessionStorage.set("subType", value);
  }

  const configNew = {
    ...config.texts,
    ...{ headerCaption: complaintType.key },
    ...{ menu: menu },
    ...{ optionsKey: "name" },
    ...{ selected: selectedValue },
    ...{ selectedOption: subType },
    ...{ onSave: goNext },
  };

  return <TypeSelectCard {...configNew} />;
};
export default SelectSubType;
