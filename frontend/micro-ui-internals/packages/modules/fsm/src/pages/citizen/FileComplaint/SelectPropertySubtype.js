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
    const uniqMenu = [...new Set(data.PropertyType.filter((o) => o.propertyType !== undefined).map((item) => item.propertyType))];
    setSubTypeMenu(uniqMenu.map((type) => ({ i18nKey: `ES_APPLICATION_DETAILS_PROPERTY_SUB_TYPE_${type}` })));
  });

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
      {...{ optionsKey: "i18nKey" }}
      {...{ selected: selectedValue }}
      {...{ selectedOption: subtype }}
      {...{ onSave: goNext }}
      t={t}
    />
  );
};

export default SelectPropertySubtype;
