import React, { useState } from "react";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { FormStep, RadioOrSelect, RadioButtons } from "@egovernments/digit-ui-react-components";

const SelectVehicleType = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const [VehicleType, setVehicleType] = useState(formData?.TradeDetails?.VehicleType);
  const isEdit = window.location.href.includes("/edit-application/")||window.location.href.includes("renew-trade");
  const { isLoading, data: Menu = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "StructureType");
  let menu = [];
  Menu &&
    Menu["common-masters"] &&
    Menu["common-masters"].StructureType.map((ob) => {
      if (!ob.code.includes("IMMOVABLE")) {
        menu.push({ i18nKey: `COMMON_MASTERS_STRUCTURETYPE_${ob.code.replaceAll(".", "_")}`, code: `${ob.code}` });
      }
    });
  /* const menu = [
    { i18nKey: "MOTOR_DRIVEN", code: "motor" },
    { i18nKey: "HAND_PULLED", code: "hand" },
  ]; */

  const onSkip = () => onSelect();

  // const propertyOwnerShipCategory = Digit.Hooks.pt.useMDMS("pb", "PropertyTax", "OwnerShipCategory", {});
  function selectVehicleType(value) {
    setVehicleType(value);
  }

  function goNext() {
    //sessionStorage.setItem("VehicleType", VehicleType.i18nKey);
    onSelect(config.key, { VehicleType });
    //onSelect("usageCategoryMajor", { i18nKey: "PROPERTYTAX_BILLING_SLAB_RESIDENTIAL" });
  }
  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!VehicleType}>
      <RadioButtons
        t={t}
        optionsKey="i18nKey"
        isMandatory={config.isMandatory}
        options={menu}
        selectedOption={VehicleType}
        onSelect={selectVehicleType}
        disable={isEdit}
      />
    </FormStep>
  );
};
export default SelectVehicleType;
