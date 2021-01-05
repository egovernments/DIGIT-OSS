import React, { useState } from "react";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import data from "../../../propertyType.json";

const SelectPropertySubtype = ({ config, onSelect, t, value }) => {
  const [subtype, setSubtype] = useState(null);
  const { propertyType } = value;
  const menu = data.PropertyType.filter((item) => item.propertyType === propertyType);
  console.log(menu, "menu");

  const selectedValue = (value) => {
    setSubtype(value);
  };

  const goNext = () => {
    onSelect(subtype);
  };
  return (
    <TypeSelectCard
      {...config.texts}
      {...{ menu }}
      {...{ optionsKey: "name" }}
      {...{ selected: selectedValue }}
      {...{ selectedOption: subtype }}
      {...{ onSave: goNext }}
      t={t}
    />
  );
};

export default SelectPropertySubtype;
