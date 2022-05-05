import React, { useState } from "react";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { FormStep, RadioOrSelect, RadioButtons } from "@egovernments/digit-ui-react-components";
import Timeline from "../components/TLTimeline";

const SelectAccessories = ({ t, config, onSelect, userType, formData }) => {
  const [isAccessories, setisAccessories] = useState(formData?.TradeDetails?.isAccessories);
  const menu = [
    { i18nKey: "TL_COMMON_YES", code: "ACCESSORY" },
    { i18nKey: "TL_COMMON_NO", code: "NONACCESSORY" },
  ];

  const onSkip = () => onSelect();

  function selectisAccessories(value) {
    setisAccessories(value);
  }

  function goNext() {
    sessionStorage.setItem("isAccessories", isAccessories.i18nKey);
    sessionStorage.setItem("VisitedisAccessories",true);
    onSelect(config.key, { isAccessories, accessories:formData?.TradeDetails?.accessories? formData?.TradeDetails?.accessories : [] });
    //onSelect("usageCategoryMajor", { i18nKey: "PROPERTYTAX_BILLING_SLAB_RESIDENTIAL" });
  }
  return (
    <React.Fragment>
    {window.location.href.includes("/citizen") ? <Timeline /> : null}
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
    </React.Fragment>
  );
};
export default SelectAccessories;
