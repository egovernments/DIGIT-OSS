import React, { useState } from "react";
import { FormStep, RadioOrSelect, RadioButtons } from "@egovernments/digit-ui-react-components";

const IsThisFloorSelfOccupied = ({ t, config, onSelect, userType, formData }) => {
  let index = window.location.href.split("/").pop();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  //const [selfOccupied, setSelfOccupied] = useState(formData?.IsThisFloorSelfOccupied);
  let selfOccupied, setSelfOccupied;
  if (!isNaN(index)) {
    [selfOccupied, setSelfOccupied] = useState(formData.units && formData.units[index] && formData.units[index].selfOccupied);
  } else {
    [selfOccupied, setSelfOccupied] = useState(formData?.selfOccupied);
  }
  const data = [
    {
      //i18nKey: "Fully rented out",
      i18nKey: "PT_FULLY_RENTED_OUT",
      code: "RENTED",
    },
    {
      //i18nKey: "Partially rented out",
      i18nKey: "PT_PARTIALLY_RENTED_OUT",
      code: "RENTED",
    },
    {
      //i18nKey: "Yes, It is fully Self Occupied",
      i18nKey: "PT_YES_IT_IS_SELFOCCUPIED",
      code: "SELFOCCUPIED",
    },
  ];
  const onSkip = () => onSelect();

  function selectSelfOccupied(value) {
    setSelfOccupied(value);
  }

  function goNext() {
    //let index = window.location.href.charAt(window.location.href.length - 1);
    let index = window.location.href.split("/").pop();
    if (formData?.isResdential?.i18nKey === "PT_COMMON_YES" || formData?.usageCategoryMajor?.i18nKey == "PROPERTYTAX_BILLING_SLAB_NONRESIDENTIAL") {
      let temp = selfOccupied.i18nKey + "1";
      sessionStorage.setItem("IsThisFloorSelfOccupied", temp);
    } else {
      sessionStorage.setItem("IsThisFloorSelfOccupied", selfOccupied.i18nKey);
    }
    //onSelect(config.key, selfOccupied, false, index);
    if (!isNaN(index)) {
      //sessionStorage.setItem("IsAnyPartOfThisFloorUnOccupied", IsAnyPartOfThisFloorUnOccupied.i18nKey);
      let unit = formData.units && formData.units[index];
      let floordet = { ...unit, selfOccupied };
      onSelect(config.key, floordet, false, index);
    } else {
      //sessionStorage.setItem("IsAnyPartOfThisFloorUnOccupied", IsAnyPartOfThisFloorUnOccupied.i18nKey);
      onSelect("selfOccupied", selfOccupied);
    }
  }
  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!selfOccupied}>
      <RadioButtons
        t={t}
        optionsKey="i18nKey"
        isMandatory={config.isMandatory}
        options={data}
        selectedOption={selfOccupied}
        onSelect={selectSelfOccupied}
      />
    </FormStep>
  );
};

export default IsThisFloorSelfOccupied;
