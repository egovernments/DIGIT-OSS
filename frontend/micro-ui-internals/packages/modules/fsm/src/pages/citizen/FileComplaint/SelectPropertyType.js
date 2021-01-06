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
    const _menu = data.PropertyType.filter((item) => item.propertyType !== undefined).map((item) => item.propertyType);
    const uniqMenu = [...new Set(_menu)];
    return uniqMenu.map((item) => ({ key: item, name: item }));
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
      {...{ optionsKey: "name" }}
      {...{ selected: selectedValue }}
      {...{ selectedOption: propertyType }}
      {...{ onSave: goNext }}
      t={t}
    />
  );
};

export default SelectPropertyType;
