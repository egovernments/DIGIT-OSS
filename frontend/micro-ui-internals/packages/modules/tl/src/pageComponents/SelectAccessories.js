import React, { useState } from "react";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { FormStep, RadioOrSelect, RadioButtons } from "@egovernments/digit-ui-react-components";

const SelectAccessories = ({ t, config, onSelect, userType, formData }) => {
  const [isAccessories, setisAccessories] = useState(formData?.TradeDetails?.isAccessories);
  const menu = [
    { i18nKey: "TL_COMMON_YES", code: "ACCESSORY" },
    { i18nKey: "TL_COMMON_NO", code: "NONACCESSORY" },
  ];

  const onSkip = () => onSelect();

  // const propertyOwnerShipCategory = Digit.Hooks.pt.useMDMS("pb", "PropertyTax", "OwnerShipCategory", {});
  function selectisAccessories(value) {
    setisAccessories(value);
  }

  function goNext() {
    sessionStorage.setItem("isAccessories", isAccessories.i18nKey);
    onSelect(config.key, { isAccessories, accessories:[] });
    //onSelect("usageCategoryMajor", { i18nKey: "PROPERTYTAX_BILLING_SLAB_RESIDENTIAL" });
  }
  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!isAccessories}>
      <RadioButtons
        t={t}
        optionsKey="i18nKey"
        isMandatory={config.isMandatory}
        options={menu}
        selectedOption={isAccessories}
        onSelect={selectisAccessories}
      />
    </FormStep>
  );
};
export default SelectAccessories;
