import { CardLabel, CitizenInfoLabel, FormStep, Loader, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";

const TLNoOfEmployees = ({ t, config, onSelect, value, userType, formData }) => {
  let validation = {};
  const onSkip = () => onSelect();
  const [noofemployees, setnoofemployees] = useState(
    formData?.[config.key]?.noofemployees
  );
  const tenantId = window.Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const isEdit = window.location.href.includes("/edit-application/") || window.location.href.includes("renew-trade");
  
  const { isLoading } = window.Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", "FinancialYear");

  function setSelectnoofemployees(e) {
    setnoofemployees(e.target.value);
  }

  const goNext = () => {
    onSelect(config.key, { noofemployees });
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
        isDisabled={false}
      >
        <CardLabel>{`${t("TL_LOCALIZATION_NO_OF_EMPLOYEES")}`}</CardLabel>
        <TextInput
          t={t}
          isMandatory={false}
          type={"text"}
          optionKey="i18nKey"
          name="noofemployees"
          value={noofemployees}
          onChange={setSelectnoofemployees}
          disable={isEdit}
          {...(validation = { pattern: "^[0-9]*$", isRequired: false, type: "text", title: t("TL_INVALID_NO_EMPLOYEES") })}
        />
      </FormStep>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("TL_LICENSE_ISSUE_YEAR_INFO_MSG") } />}
    </React.Fragment>
  );
};

const customize = () => {
    window.Digit.ComponentRegistryService.setComponent(
      "TLNoOfEmployees",
      TLNoOfEmployees
    );
  };
  
  export default customize;
  