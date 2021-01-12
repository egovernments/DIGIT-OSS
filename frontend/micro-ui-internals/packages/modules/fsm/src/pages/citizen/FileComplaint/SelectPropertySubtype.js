import React, { useState } from "react";
import { Loader, TypeSelectCard } from "@egovernments/digit-ui-react-components";

const SelectPropertySubtype = ({ config, onSelect, t, value }) => {
  const [subtype, setSubtype] = useState(() => {
    const { subtype } = value;
    return subtype !== undefined ? subtype : null;
  });
  const { propertyType } = value;

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const propertySubtypesData = Digit.Hooks.fsm.useMDMS(tenantId, "PropertyTax", "PropertySubtype");

  const selectedValue = (value) => {
    setSubtype(value);
  };

  const goNext = () => {
    onSelect({ subtype: subtype });
  };

  if (propertySubtypesData.isLoading) {
    return <Loader />;
  }

  const menu = propertySubtypesData.data.filter((item) => item.propertyType === propertyType?.code);

  return (
    <TypeSelectCard
      {...config.texts}
      {...{ menu: menu }}
      {...{ optionsKey: "name" }}
      {...{ selected: selectedValue }}
      {...{ selectedOption: subtype }}
      {...{ onSave: goNext }}
      t={t}
    />
  );
};

export default SelectPropertySubtype;
