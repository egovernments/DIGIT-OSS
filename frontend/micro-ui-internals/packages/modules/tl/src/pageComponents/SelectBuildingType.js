import React, { useState } from "react";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { FormStep, RadioOrSelect, RadioButtons, CitizenInfoLabel } from "@egovernments/digit-ui-react-components";

const SelectBuildingType = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const [BuildingType, setBuildingType] = useState(formData?.TradeDetails?.BuildingType);
  const { isLoading, data: Menu = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "StructureType");
  const isEdit = window.location.href.includes("/edit-application/")||window.location.href.includes("renew-trade");
  let menu = [];
  Menu &&
    Menu["common-masters"] &&
    Menu["common-masters"].StructureType.map((ob) => {
      if (ob.code.includes("IMMOVABLE")) {
        menu.push({ i18nKey: `COMMON_MASTERS_STRUCTURETYPE_${ob.code.replaceAll(".", "_")}`, code: `${ob.code}` });
      }
    });
  /* const menu = [
    { i18nKey: "PUCCA", code: "pucca" },
    { i18nKey: "KUCCHA", code: "kuccha" },
  ]; */

  const onSkip = () => onSelect();

  // const propertyOwnerShipCategory = Digit.Hooks.pt.useMDMS("pb", "PropertyTax", "OwnerShipCategory", {});
  function selectBuildingType(value) {
    setBuildingType(value);
  }

  function goNext() {
    //sessionStorage.setItem("VehicleType", VehicleType.i18nKey);
    onSelect(config.key, { BuildingType });
    //onSelect("usageCategoryMajor", { i18nKey: "PROPERTYTAX_BILLING_SLAB_RESIDENTIAL" });
  }
  return (
    <React.Fragment>
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!BuildingType}>
        <RadioButtons
          t={t}
          optionsKey="i18nKey"
          isMandatory={config.isMandatory}
          options={menu}
          selectedOption={BuildingType}
          onSelect={selectBuildingType}
        />
      </FormStep>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("TL_BUILDING_TYPE_INFO_MSG")} />}
      {isEdit && <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("Structure type cant be modified")} />}
    </React.Fragment>
  );
};
export default SelectBuildingType;
