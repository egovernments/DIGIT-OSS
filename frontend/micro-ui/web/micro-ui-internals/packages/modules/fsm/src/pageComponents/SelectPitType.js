import React, { useState, useEffect } from "react";
import { FormStep, Dropdown, Loader, CardLabel, RadioButtons, RadioOrSelect } from "@egovernments/digit-ui-react-components";
import Timeline from "../components/TLTimelineInFSM";

const SelectPitType = ({ t, formData, config, onSelect, userType }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const [pitType, setPitType] = useState(formData?.pitType);
  const { data: sanitationMenu, isLoading } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PitType");

  const selectPitType = (value) => {
    setPitType(value);
    if (userType === "employee") {
      onSelect(config.key, value);
      onSelect("pitDetail", null);
    }
  };

  const onSkip = () => {
    onSelect();
  };

  const onSubmit = () => {
    onSelect(config.key, pitType);
  };

  if (isLoading) {
    return <Loader />;
  }
  if (userType === "employee") {
    return <Dropdown isMandatory={true} option={sanitationMenu} optionKey="i18nKey" select={selectPitType} selected={pitType} t={t} />;
  }
  return (
    <React.Fragment>
      <Timeline currentStep={1} flow="APPLY" />
      <FormStep config={config} onSelect={onSubmit} onSkip={onSkip} isDisabled={!pitType} t={t}>
        <CardLabel>{t("CS_FILE_APPLICATION_PIT_TYPE_LABEL")}</CardLabel>
        <RadioOrSelect
          isMandatory={config.isMandatory}
          options={sanitationMenu}
          selectedOption={pitType}
          optionKey="i18nKey"
          onSelect={selectPitType}
          t={t}
        />
      </FormStep>
    </React.Fragment>
  );
};

export default SelectPitType;
