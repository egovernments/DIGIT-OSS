import React, { useState } from "react";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import data from "../../../propertyType.json";

const SelectPropertySubtype = ({ config, onSelect, t }) => {
  const [subtype, setSubtype] = useState(null);
  const menu = data.propertySubtype;

  const selectedValue = (value) => {
    setSubtype(value);
  };

  const goNext = () => {
    onSelect({ subtype: subtype });
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
