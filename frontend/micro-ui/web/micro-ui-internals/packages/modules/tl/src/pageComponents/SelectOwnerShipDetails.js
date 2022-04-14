import React, { useState, useEffect, useMemo } from "react";
import { FormStep, RadioOrSelect, RadioButtons, LabelFieldPair, Dropdown, CardLabel, CardLabelError } from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";
import { useLocation } from "react-router-dom";
import Timeline from "../components/TLTimeline";

const SelectOwnerShipDetails = ({ t, config, onSelect, userType, formData, onBlur, formState, setError, clearErrors }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  //const isUpdateProperty = formData?.isUpdateProperty || false;
  //let isEditProperty = formData?.isEditProperty || false;
  let isEdit = window.location.href.includes("edit-application")||window.location.href.includes("renew-trade");
  const [ownershipCategory, setOwnershipCategory] = useState(formData?.ownershipCategory);
  const { data: dropdownData } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "TLOwnerTypeWithSubtypes",{userType});

  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");

  function selectedValue(value) {
    setOwnershipCategory(value);
  }

  const onSkip = () => onSelect();
  function goNext() {
    sessionStorage.setItem("ownershipCategory", ownershipCategory?.value);
    onSelect(config.key, ownershipCategory);
  }

  useEffect(() => {
    if (userType === "employee") {
      if (!ownershipCategory) setError(config.key, { type: "required", message: t(`REQUIRED_FIELD`) }); //message: `${config.key.toUpperCase()}_REQUIRED` }
      else clearErrors(config.key);
      goNext();
    }
  }, [ownershipCategory]);


  // useEffect(() => {
  //   if (userType === "employee") {
  //     setOwnershipCategory(dropdownData[0]);
  //   }
  // }, []);

  if (userType === "employee") {
  let isRenewal = window.location.href.includes("tl/renew-application-details");
  if (window.location.href.includes("tl/edit-application-details")) isRenewal = true;
  
    return (
      <React.Fragment>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller" style={editScreen ? { color: "#B1B4B6" } : {}}>
            {`${t("TL_NEW_OWNER_DETAILS_OWNERSHIP_TYPE_LABEL")} * `}
          </CardLabel>
          <Dropdown
            className="form-field"
            selected={ownershipCategory}
            errorStyle={formState.touched?.[config.key] && formState.errors[config.key]?.message ? true : false}
            disable={isRenewal}
            option={dropdownData}
            select={selectedValue}
            optionKey="i18nKey"
            onBlur={onBlur}
            t={t}
          />
        </LabelFieldPair>
        {formState.touched?.[config.key] ? (
          <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" }}>
            {formState.errors[config.key]?.message}
          </CardLabelError>
        ) : null}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
    {window.location.href.includes("/citizen") ? <Timeline currentStep={2}/> : null}
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!ownershipCategory}>
      <RadioButtons
        isMandatory={config.isMandatory}
        options={dropdownData?dropdownData:[]}
        selectedOption={ownershipCategory}
        optionsKey="i18nKey"
        onSelect={selectedValue}
        value={ownershipCategory}
        labelKey="PT_OWNERSHIP"
        isDependent={true}
        disabled={isEdit}
      />
    </FormStep>
    </React.Fragment>
  );
};

export default SelectOwnerShipDetails;
