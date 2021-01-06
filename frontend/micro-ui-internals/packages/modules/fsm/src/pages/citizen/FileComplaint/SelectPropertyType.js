import React, { useState } from "react";
import data from "../../../propertyType.json";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SelectPropertyType = ({ config, onSelect, t, value }) => {
  const [propertyType, setPropertyType] = useState(() => {
    const { propertyType } = value;
    return propertyType !== undefined ? { key: propertyType, name: propertyType } : null;
  });

  const [menu, setMenu] = useState(() => {
    const uniqMenu = [...new Set(data.PropertyType.filter((item) => item.propertyType !== undefined).map((item) => item.propertyType))];
    return uniqMenu.map((type) => ({ i18nKey: `CS_PROPERTY_TYPE_${type}` }));
  });

  const goNext = () => {
    onSelect({ propertyType: propertyType.key });
  };

  function selectedValue(value) {
    setPropertyType(value);
  }

  return (
    <TypeSelectCard
      {...config.texts}
      {...{ menu: menu }}
      {...{ optionsKey: "i18nKey" }}
      {...{ selected: selectedValue }}
      {...{ selectedOption: propertyType }}
      {...{ onSave: goNext }}
      t={t}
    />
  );
};

export default SelectPropertyType;
