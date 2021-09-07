import React, { useEffect, useState } from "react";
import { FormStep, RadioOrSelect } from "@egovernments/digit-ui-react-components";

const CheckSlum = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId?.split(".")[0];

  const [slumArea, setSlumArea] = useState(formData?.address?.slumArea);

  const locality = formData?.address?.locality?.code.split("_")[3];
  // const { data: slumData, isLoading: slumDataLoading } = Digit.Hooks.fsm.useMDMS(formData?.address?.city.code, "FSM", "Slum");

  const onSkip = () => onSelect();
  function goNext() {
    onSelect(config.key, { slumArea });
  }

  // useEffect(() => {
  //   // console.log("find slum data here", slumData && slumData[locality])
  //   if (slumData && (!slumData[locality] || slumData[locality].length === 0)) {
  //     onSelect(config.key, { slumArea: { code: false, i18nKey: "CS_COMMON_NO" } }, true);
  //   }
  // }, [locality, slumDataLoading]);

  return (
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
  );
};

export default CheckSlum;
