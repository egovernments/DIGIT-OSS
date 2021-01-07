import React, { useState } from "react";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import data from "../../../propertyType.json";

const SelectPropertySubtype = ({ config, onSelect, t, value }) => {
  const [subtype, setSubtype] = useState(() => {
    const { subtype } = value;
    return subtype !== undefined ? subtype : null;
  });
  const { propertyType } = value;
  const [subTypeMenu, setSubTypeMenu] = useState([]);

  React.useEffect(() => {
    // TODO: bottom two lines are hard coded data, whenever we get propertyType apis, it should be update
    const uniqMenu = data.PropertyType.filter((o) => o.propertyType !== undefined && o.propertyType === propertyType).map((item) => ({
      key: item.code,
      name: item.code,
    }));
    setSubTypeMenu(uniqMenu);
  }, []);

  const selectedValue = (value) => {
    setSubtype(value);
  };

  const goNext = () => {
    onSelect({ subtype: subtype });
  };
  return (
    <TypeSelectCard
      {...config.texts}
      {...{ menu: subTypeMenu }}
      {...{ optionsKey: "key" }}
      {...{ selected: selectedValue }}
      {...{ selectedOption: subtype }}
      {...{ onSave: goNext }}
      t={t}
    />
  );
};

export default SelectPropertySubtype;
