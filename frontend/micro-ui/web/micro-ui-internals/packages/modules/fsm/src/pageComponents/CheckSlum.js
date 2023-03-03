import React, { useEffect, useState } from "react";
import { FormStep, RadioOrSelect } from "@egovernments/digit-ui-react-components";
import Timeline from "../components/TLTimelineInFSM";

const CheckSlum = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const [slumArea, setSlumArea] = useState(formData?.address?.slumArea);

  const locality = formData?.address?.locality?.code.split("_")[3];
  // const { data: slumData, isLoading: slumDataLoading } = Digit.Hooks.fsm.useMDMS(formData?.address?.city.code, "FSM", "Slum");

  const onSkip = () => onSelect();
  function goNext() {
    sessionStorage.removeItem("Digit.total_amount")
    onSelect(config.key, { slumArea });
  }

  return (
    <React.Fragment>
      <Timeline currentStep={1} flow="APPLY" />
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!slumArea}>
        <RadioOrSelect
          isMandatory={config.isMandatory}
          options={[
            { code: true, i18nKey: "CS_COMMON_YES" },
            { code: false, i18nKey: "CS_COMMON_NO" },
          ]}
          selectedOption={slumArea}
          optionKey="i18nKey"
          onSelect={setSlumArea}
        />
      </FormStep>
    </React.Fragment>
  );
};

export default CheckSlum;
