import React, { useState, useEffect } from "react";
import { Dropdown, FormStep, Loader, RadioOrSelect } from "@egovernments/digit-ui-react-components";
import Timeline from "../components/TLTimelineInFSM";

const SelectGender = ({ config, onSelect, t, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const { data: GenderData, isLoading } = Digit.Hooks.fsm.useMDMS(stateId, "common-masters", "FSMGenderType");
  const [genderType, setGenderType] = useState(formData?.genderType);

  useEffect(() => {
    if (!isLoading && GenderData) {
      const preFilledGenderType = GenderData.filter(
        (genderType) => genderType.code === (formData?.selectGender?.code || formData?.selectGender)
      )[0];
      setGenderType(preFilledGenderType);
    }
  }, [formData?.selectGender, GenderData]);

  const selectGenderType = (value) => {
    setGenderType(value);
    if (userType === "employee") {
      onSelect(config.key, value);
      onSelect("genderDetail", null);
    }
  };

  const onSkip = () => {
    onSelect();
  };

  const onSubmit = () => {
    onSelect(config.key, genderType);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (userType === "employee") {
    return (
      <div>
        <Dropdown
          className="payment-form-text-input-correction"
          isMandatory={config.isMandatory}
          selected={genderType}
          option={GenderData}
          select={selectGenderType}
          optionKey="i18nKey"
          disable={config.disable}
          t={t}
        />
      </div>
    );
  }
  return (
    <React.Fragment>
      <Timeline currentStep={2} flow="APPLY" />
      <FormStep config={config} onSelect={onSubmit} onSkip={onSkip} isDisabled={!genderType} t={t}>
        <RadioOrSelect
          options={GenderData}
          selectedOption={genderType}
          optionKey="i18nKey"
          onSelect={selectGenderType}
          t={t}
          isMandatory={config.isMandatory}
        />
      </FormStep>
    </React.Fragment>
  );
};

export default SelectGender;
