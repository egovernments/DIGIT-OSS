import React, { useState } from "react";
import { Loader, TypeSelectCard } from "@egovernments/digit-ui-react-components";

const SelectPropertyType = ({ config, onSelect, t, value }) => {
  const [propertyType, setPropertyType] = useState(() => {
    const { propertyType } = value;
    return propertyType !== undefined ? propertyType : null;
  });
  const select = (items) => items.map((item) => ({ ...item, i18nKey: t(item.i18nKey) }));

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const propertyTypesData = Digit.Hooks.fsm.useMDMS(tenantId, "PropertyTax", "PropertyType", { select });

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
      disabled={propertyType ? false : true}
      menu={propertyTypesData.data}
      optionsKey="i18nKey"
      selected={selectedValue}
      selectedOption={propertyType}
      onSave={goNext}
      t={t}
    />
  );
};

export default SelectPropertyType;
