import React, { useState } from "react";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { FormStep, RadioOrSelect, RadioButtons } from "@egovernments/digit-ui-react-components";
import Timeline from "../components/TLTimeline";

const SelectStructureType = ({ t, config, onSelect, userType, formData }) => {
  const [StructureType, setStructureType] = useState(formData?.TradeDetails?.StructureType);
  const isEdit = window.location.href.includes("/edit-application/")||window.location.href.includes("renew-trade");
  const menu = [
    { i18nKey: "TL_COMMON_YES", code: "IMMOVABLE" },
    { i18nKey: "TL_COMMON_NO", code: "MOVABLE" },
  ];

  const onSkip = () => onSelect();

  function selectStructuretype(value) {
    setStructureType(value);
  }

  function goNext() {
    sessionStorage.setItem("StructureType", StructureType.i18nKey);
    onSelect(config.key, { StructureType });
  }
  return (
    <React.Fragment>
    {window.location.href.includes("/citizen") ? <Timeline /> : null}
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!StructureType}>
      <RadioButtons
        t={t}
        optionsKey="i18nKey"
        isMandatory={config.isMandatory}
        options={menu}
        selectedOption={StructureType}
        onSelect={selectStructuretype}
        disabled={isEdit}
      />
    </FormStep>
    </React.Fragment>
  );
};
export default SelectStructureType;
