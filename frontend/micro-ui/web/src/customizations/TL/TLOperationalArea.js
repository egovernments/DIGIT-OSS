import { CardLabel, CitizenInfoLabel, FormStep, Loader, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";

const TLOperationalArea = ({ t, config, onSelect, value, userType, formData }) => {
  let validation = {};
  const onSkip = () => onSelect();
  const [operationalarea, setoperationalarea] = useState(
    formData?.[config.key]?.operationalarea
  );
  const tenantId = window.Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const isEdit = window.location.href.includes("/edit-application/") || window.location.href.includes("renew-trade");
  
  const { isLoading } = window.Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", "FinancialYear");

 
  function setSelectoperationalarea(e) {
    setoperationalarea(e.target.value);
  }

  const goNext = () => {
    onSelect(config.key, { operationalarea });
  };
  if (isLoading) {
    return <Loader></Loader>
  }

  return (
    <React.Fragment>
      <FormStep
        config={config}
        onSelect={goNext}
        onSkip={onSkip}
        t={t}
        isDisabled={!operationalarea}
      >
        <CardLabel>{`${t("TL_LOCALIZATION_OPERATIONALAREA")}`}</CardLabel>
        <TextInput
          t={t}
          isMandatory={false}
          type={"text"}
          optionKey="i18nKey"
          name="operationalarea"
          value={operationalarea}
          onChange={setSelectoperationalarea}
          disable={isEdit}
          {...(validation = { pattern: "^[0-9]*$", isRequired: true, type: "text", title: t("TL_INVALID_OPERATIONALAREA") })}
        />
      </FormStep>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("TL_LICENSE_ISSUE_YEAR_INFO_MSG") } />}
    </React.Fragment>
  );
};


const customize = () => {
  window.Digit.ComponentRegistryService.setComponent(
    "TLOperationalArea",
    TLOperationalArea
  );
};

export default customize;
