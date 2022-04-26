import React, { useState } from "react";
import { CardLabel, DatePicker, TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { FormStep, RadioOrSelect, RadioButtons } from "@egovernments/digit-ui-react-components";

const SelectCommencementDate = ({ t, config, onSelect, userType, formData }) => {
  const [CommencementDate, setCommencementDate] = useState(formData?.TradeDetails?.CommencementDate);
  const isEdit = window.location.href.includes("/edit-application/")||window.location.href.includes("renew-trade");
  /* const menu = [
    { i18nKey: "MOTOR_DRIVEN", code: "motor" },
    { i18nKey: "HAND_PULLED", code: "hand" },
  ]; */

  const onSkip = () => onSelect();

  // const propertyOwnerShipCategory = Digit.Hooks.pt.useMDMS("pb", "PropertyTax", "OwnerShipCategory", {});
  function selectCommencementDate(value) {
    setCommencementDate(value);
  }

  function goNext() {
    //sessionStorage.setItem("VehicleType", VehicleType.i18nKey);
    onSelect(config.key, { CommencementDate });
    //onSelect("usageCategoryMajor", { i18nKey: "PROPERTYTAX_BILLING_SLAB_RESIDENTIAL" });
  }
  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!CommencementDate}>
      <CardLabel>{t("TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL")}</CardLabel>
      <DatePicker date={CommencementDate} name="CommencementDate" onChange={selectCommencementDate} disabled={isEdit} />
    </FormStep>
  );
};
export default SelectCommencementDate;
