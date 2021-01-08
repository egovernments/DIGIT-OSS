import React, { useState } from "react";
import data from "../../../propertyType.json";
import { Loader, TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SelectPropertyType = ({ config, onSelect, t, value }) => {
  const [propertyType, setPropertyType] = useState(() => {
    const { propertyType } = value;
    return propertyType !== undefined ? propertyType : null;
  });

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const propertyTypesData = Digit.Hooks.fsm.useMDMS(tenantId, "PropertyTax", "PropertyType");

  const goNext = () => {
    onSelect({ propertyType: propertyType });
  };

  function selectedValue(value) {
    setPropertyType(value);
  }

  if (propertyTypesData.isLoading) {
    return <Loader />;
  }

  return (
    <TypeSelectCard
      {...config.texts}
      {...{ menu: propertyTypesData.data }}
      {...{ optionsKey: "name" }}
      {...{ selected: selectedValue }}
      {...{ selectedOption: propertyType }}
      {...{ onSave: goNext }}
      t={t}
    />
  );
};

export default SelectPropertyType;
