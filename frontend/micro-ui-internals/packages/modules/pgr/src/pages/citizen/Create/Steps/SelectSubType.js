import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";

const SelectSubType = ({ t, config, onSelect, value }) => {
  const [subType, setSubType] = useState(() => {
    const { subType } = value;
    return subType ? subType : {};
  });
  const { complaintType } = value;
  const menu = Digit.Hooks.pgr.useComplaintSubType(complaintType, t);

  console.log("select subtype ", value, complaintType, subType, menu);

  const goNext = () => {
    // const serviceCode = subType.key;
    // console.log("subtypekey", subTypeKey);
    onSelect({ subType });
  };
  // const complaintType = Digit.SessionStorage.get("complaintType");
  // const __initSubType__ = Digit.SessionStorage.get("subType");

  function selectedValue(value) {
    setSubType(value);
    // Digit.SessionStorage.set("subType", value);
  }

  const configNew = {
    ...config.texts,
    ...{ headerCaption: t(`SERVICEDEFS.${complaintType.key.toUpperCase()}`) },
    ...{ menu: menu },
    ...{ optionsKey: "name" },
    ...{ selected: selectedValue },
    ...{ selectedOption: subType },
    ...{ onSave: goNext },
  };

  return <TypeSelectCard {...configNew} disabled={Object.keys(subType).length === 0 || subType === null ? true : false} t={t} />;
};
export default SelectSubType;
