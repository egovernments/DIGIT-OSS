import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";

const SelectSubType = ({ t, config, onSelect, value }) => {
  const [subType, setSubType] = useState(() => {
    const { subType } = value;
    return subType ? subType : {};
  });
  const { complaintType } = value;
  const menu = Digit.Hooks.pgr.useComplaintSubType(complaintType, t);


  const goNext = () => {
    // const serviceCode = subType.key;
    onSelect({ subType });
  };

  function selectedValue(value) {
    setSubType(value);
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
