import React, { useState } from "react";
import data from "../../../propertyType.json";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SelectPropertyType = ({ config, onSelect }) => {
  const [propertyType, setPropertyType] = useState(null);
  const menu = data.PropertyType;
  const { t } = useTranslation();

  const goNext = () => {
    onSelect(propertyType);
  };

  function selectedValue(value) {
    setPropertyType(value);
  }

  return (
    <TypeSelectCard
      {...config.texts}
      {...{ menu: menu }}
      {...{ optionsKey: "name" }}
      {...{ selected: selectedValue }}
      {...{ selectedOption: propertyType }}
      {...{ onSave: goNext }}
      {...{ t: t }}
    />
  );
};

export default SelectPropertyType;
