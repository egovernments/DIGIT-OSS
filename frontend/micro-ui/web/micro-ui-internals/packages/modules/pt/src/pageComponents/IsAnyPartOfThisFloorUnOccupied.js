import React, { useState } from "react";
import { FormStep, RadioOrSelect, RadioButtons } from "@egovernments/digit-ui-react-components";

const IsAnyPartOfThisFloorUnOccupied = ({ t, config, onSelect, userType, formData }) => {
  let index = window.location.href.split("/").pop();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  let IsAnyPartOfThisFloorUnOccupied, setSelfOccupied;
  if (!isNaN(index)) {
    [IsAnyPartOfThisFloorUnOccupied, setSelfOccupied] = useState(
      formData.units && formData.units[index] && formData.units[index].IsAnyPartOfThisFloorUnOccupied
    );
  } else {
    [IsAnyPartOfThisFloorUnOccupied, setSelfOccupied] = useState(formData?.IsAnyPartOfThisFloorUnOccupied);
  }
  //const { data: Menu, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "OwnerType");

  const data = [
    {
      //i18nKey: "Yes",
      i18nKey: "PT_COMMON_YES",
      code: "UNOCCUPIED",
    },
    {
      //i18nKey: "No",
      i18nKey: "PT_COMMON_NO",
      code: "UNOCCUPIED",
    },
  ];
  const onSkip = () => onSelect();

  function selectSelfOccupied(value) {
    setSelfOccupied(value);
  }

  const getheaderCaption = () => {
    if (formData?.PropertyType?.i18nKey === "COMMON_PROPTYPE_BUILTUP_SHAREDPROPERTY") {
      return "PT_FLOOR_DETAILS_HEADER";
    } else {
      return `PROPERTYTAX_FLOOR_${index}_DETAILS`;
    }
  };

  function goNext() {
    //let index = window.location.href.charAt(window.location.href.length - 1);
    let index = window.location.href.split("/").pop();
    if (!isNaN(index)) {
      sessionStorage.setItem("IsAnyPartOfThisFloorUnOccupied", IsAnyPartOfThisFloorUnOccupied.i18nKey);
      let unit = formData.units && formData.units[index];
      let floordet = { ...unit, IsAnyPartOfThisFloorUnOccupied };
      onSelect(config.key, floordet, false, index);
      if (IsAnyPartOfThisFloorUnOccupied.i18nKey === "PT_COMMON_NO") {
        if (formData?.noOfFloors?.i18nKey === "PT_GROUND_PLUS_ONE_OPTION" && index < 1 && index > -1) {
          let newIndex1 = parseInt(index) + 1;
          onSelect("floordetails", {}, true, newIndex1, true);
        } else if (formData?.noOfFloors?.i18nKey === "PT_GROUND_PLUS_TWO_OPTION" && index < 2 && index > -1) {
          let newIndex2 = parseInt(index) + 1;
          onSelect("floordetails", {}, true, newIndex2, true);
        } else if (
          (formData?.noOofBasements?.i18nKey === "PT_ONE_BASEMENT_OPTION" || formData?.noOofBasements?.i18nKey === "PT_TWO_BASEMENT_OPTION") &&
          index > -1
        ) {
          onSelect("floordetails", {}, true, "-1", true);
        } else if (formData?.noOofBasements?.i18nKey === "PT_TWO_BASEMENT_OPTION" && index != -2) {
          onSelect("floordetails", {}, true, "-2", true);
        }
      }
    } else {
      sessionStorage.setItem("IsAnyPartOfThisFloorUnOccupied", IsAnyPartOfThisFloorUnOccupied.i18nKey);
      onSelect("IsAnyPartOfThisFloorUnOccupied", IsAnyPartOfThisFloorUnOccupied);
    }
  }
  return (
    <FormStep
      t={t}
      config={((config.texts.headerCaption = getheaderCaption()), config)}
      onSelect={goNext}
      onSkip={onSkip}
      isDisabled={!IsAnyPartOfThisFloorUnOccupied}
    >
      <RadioButtons
        t={t}
        optionsKey="i18nKey"
        isMandatory={config.isMandatory}
        options={data}
        selectedOption={IsAnyPartOfThisFloorUnOccupied}
        onSelect={selectSelfOccupied}
      />
    </FormStep>
  );
};

export default IsAnyPartOfThisFloorUnOccupied;
