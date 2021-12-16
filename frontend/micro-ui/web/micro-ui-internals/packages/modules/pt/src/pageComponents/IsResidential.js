import React, { useState } from "react";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { FormStep, RadioOrSelect, RadioButtons } from "@egovernments/digit-ui-react-components";

const IsResidential = ({ t, config, onSelect, userType, formData }) => {
  const [isResdential, setisResdential] = useState(formData?.isResdential);
  const menu = [
    { i18nKey: "PT_COMMON_YES", code: "RESIDENTIAL" },
    { i18nKey: "PT_COMMON_NO", code: "NONRESIDENTIAL" },
  ];

  const onSkip = () => onSelect();

  function selectisResdential(value) {
    setisResdential(value);
  }

  function goNext() {
    if (isResdential.i18nKey === "PT_COMMON_NO") {
      sessionStorage.setItem("isResdential", isResdential.i18nKey);
      onSelect(config.key, isResdential);
    } else {
      sessionStorage.setItem("isResdential", isResdential.i18nKey);
      onSelect(config.key, isResdential);
      //onSelect("usageCategoryMajor", { i18nKey: "PROPERTYTAX_BILLING_SLAB_RESIDENTIAL" });
    }
  }
  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!isResdential}>
      <RadioButtons
        t={t}
        optionsKey="i18nKey"
        isMandatory={config.isMandatory}
        options={menu}
        selectedOption={isResdential}
        onSelect={selectisResdential}
      />
    </FormStep>
  );
};
export default IsResidential;
