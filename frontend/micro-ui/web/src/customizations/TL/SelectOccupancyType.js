import React, { useState } from "react";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import {
  FormStep,
  RadioOrSelect,
  RadioButtons,
} from "@egovernments/digit-ui-react-components";

const SelectOccupancyType = ({ t, config, onSelect, userType, formData }) => {
  const [OccupancyType, setOccupancyType] = useState(
    formData?.TradeDetails?.OccupancyType
  );
  const isEdit =
    window.location.href.includes("/edit-application/") ||
    window.location.href.includes("renew-trade");
  const menu = [
    { i18nKey: "TL_OWNED", code: "OCCUPANCYTYPE.OWNED" },
    { i18nKey: "TL_RENTED", code: "OCCUPANCYTYPE.RENTED" },
  ];

  const onSkip = () => onSelect();

  function SelectOccupancyType(value) {
    setOccupancyType(value);
  }

  function goNext() {
    sessionStorage.setItem("OccupancyType", OccupancyType.i18nKey);
    console.log(OccupancyType, "occupancy");

    onSelect(config.key, { ...formData[config.key], OccupancyType });
  }

  return (
    <FormStep
      t={t}
      config={config}
      onSelect={goNext}
      onSkip={onSkip}
      isDisabled={!OccupancyType}
    >
      <RadioButtons
        t={t}
        optionsKey="i18nKey"
        isMandatory={config.isMandatory} 
        options={menu}
        selectedOption={OccupancyType}
        onSelect={SelectOccupancyType}
        disabled={isEdit}
      />
    </FormStep>
  );
};

const customize = () => {
  window.Digit.ComponentRegistryService.setComponent(
    "SelectOccupancyType",
    SelectOccupancyType
  );
};

export default customize;
