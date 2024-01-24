import React, { useState, useEffect, useMemo } from "react";
import { FormStep, RadioOrSelect, RadioButtons, LabelFieldPair, Dropdown, CardLabel, CardLabelError, CheckBox } from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";
import { useLocation } from "react-router-dom";
import Timeline from "../components/TLTimeline";
import { getOwnersForNewApplication } from "../utils/index";

const TLSelectOwnerShipDetails = ({ t, config, onSelect, userType, formData, onBlur, formState, setError, clearErrors }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  //const isUpdateProperty = formData?.isUpdateProperty || false;
  //let isEditProperty = formData?.isEditProperty || false;
  let isEdit = window.location.href.includes("edit-application")||window.location.href.includes("renew-trade");
  const [ownershipCategory, setOwnershipCategory] = useState(formData?.ownershipCategory);
  const [isSameAsPropertyOwner, setisSameAsPropertyOwner] = useState((formData?.ownershipCategory?.isSameAsPropertyOwner === "false" ? false : formData?.ownershipCategory?.isSameAsPropertyOwner)  || null);
  const { data: dropdownData } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "TLOwnerTypeWithSubtypes",{userType});
  const isEmpNewApplication = window.location.href.includes("/employee/tl/new-application");
  const isEmpRenewLicense = window.location.href.includes("/employee/tl/renew-application-details");
  const isEmpEdit = window.location.href.includes("/employee/tl/edit-application-details");

  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");

  function selectedValue(value) {
    setOwnershipCategory(value);
  }

  function selectisSameAsPropertyOwner(e) {
    setisSameAsPropertyOwner(e.target.checked);
    if(e.target.checked == true)
    {
      if(window.location.href.includes("/citizen/tl") && formData?.cpt?.details?.ownershipCategory?.includes("INSTITUTIONAL"))
      {
        setOwnershipCategory({
          code: `${formData?.cpt?.details?.ownershipCategory}`,
          i18nKey: `PT_OWNERSHIP_${formData?.cpt?.details?.ownershipCategory?.includes("INSTITUTIONAL") ? (formData?.cpt?.details?.ownershipCategory?.includes("GOVERNMENT") ?"OTHERGOVERNMENTINSTITUITION":"OTHERSPRIVATEINSTITUITION"):formData?.cpt?.details?.ownershipCategory?.split(".")[1]}`,
          label: undefined,
          value: `${formData?.cpt?.details?.ownershipCategory}${formData?.cpt?.details?.ownershipCategory?.includes("INSTITUTIONAL") ? (formData?.cpt?.details?.ownershipCategory?.includes("GOVERNMENT") ?".OTHERGOVERNMENTINSTITUITION":".OTHERSPRIVATEINSTITUITION"):""}`,
        })
      }
      else
      setOwnershipCategory({
        code: `${formData?.cpt?.details?.ownershipCategory}${formData?.cpt?.details?.ownershipCategory?.includes("INSTITUTIONAL") ? (formData?.cpt?.details?.ownershipCategory?.includes("GOVERNMENT") ?".OTHERGOVERNMENTINSTITUITION":".OTHERSPRIVATEINSTITUITION"):""}`,
        i18nKey: `COMMON_MASTERS_OWNERSHIPCATEGORY_INDIVIDUAL_${formData?.cpt?.details?.ownershipCategory?.includes("INSTITUTIONAL") ? (formData?.cpt?.details?.ownershipCategory?.includes("GOVERNMENT") ?"OTHERGOVERNMENTINSTITUITION":"OTHERSPRIVATEINSTITUITION"):formData?.cpt?.details?.ownershipCategory?.split(".")[1]}`,
        label: undefined,
        value: `${formData?.cpt?.details?.ownershipCategory}${formData?.cpt?.details?.ownershipCategory?.includes("INSTITUTIONAL") ? (formData?.cpt?.details?.ownershipCategory?.includes("GOVERNMENT") ?".OTHERGOVERNMENTINSTITUITION":".OTHERSPRIVATEINSTITUITION"):""}`,
      })
    }
    else
    {
      setOwnershipCategory({
        code: "",
        i18nKey: "",
        label: undefined,
        value: "",
      });
      if(formData?.owners?.owners)
      {
        delete formData?.owners;
        onSelect("formData",formData)
      }
    }
  }


  useEffect(() => {
    if(formData?.ownershipCategory?.isSameAsPropertyOwner == true || formData?.ownershipCategory?.isSameAsPropertyOwner == "true" && formData?.cpt?.details)
    {
      sessionStorage.setItem("ownersFromProperty",JSON.stringify(getOwnersForNewApplication(formData,t))); 
    }
    else if(formData?.ownershipCategory?.isSameAsPropertyOwner == false || formData?.ownershipCategory?.isSameAsPropertyOwner === "false")
    {
      if(sessionStorage.getItem("ownersFromProperty"))
      sessionStorage.removeItem("ownersFromProperty");
    }

  },[formData?.ownershipCategory?.isSameAsPropertyOwner, isSameAsPropertyOwner, formData?.cpt?.details?.propertyId, formData?.cptId?.id])
  const onSkip = () => onSelect();
  function goNext() {
    sessionStorage.setItem("ownershipCategory", ownershipCategory?.value);
    sessionStorage.setItem("isSameAsPropertyOwner", isSameAsPropertyOwner);
    onSelect(config.key, {...ownershipCategory,isSameAsPropertyOwner : isSameAsPropertyOwner});
  }

  useEffect(() => {
    if (userType === "employee") {
      if (!ownershipCategory?.code) setError(config.key, { type: "required", message: t(`REQUIRED_FIELD`) }); //message: `${config.key.toUpperCase()}_REQUIRED` }
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
        {!(formData?.tradedetils?.[0]?.structureType?.code === "MOVABLE") && formData?.cpt?.details && (isEmpNewApplication || isEmpRenewLicense || isEmpEdit) && <LabelFieldPair>
        <div className="field">
        <CheckBox
          label={t("TL_COMMON_SAME_AS_PROPERTY_OWNERS")}
          onChange={selectisSameAsPropertyOwner}
          value={isSameAsPropertyOwner}
          checked={isSameAsPropertyOwner || false}
          style={{ marginBottom: "20px" }}
          disable={isRenewal}
          //disable={isUpdateProperty || isEditProperty}
        />
        </div>
        </LabelFieldPair>}
        <LabelFieldPair>
          <CardLabel className="card-label-smaller" style={editScreen ? { color: "#B1B4B6" } : {}}>
            {`${t("TL_NEW_OWNER_DETAILS_OWNERSHIP_TYPE_LABEL")} * `}
          </CardLabel>
          <Dropdown
            className="form-field"
            selected={ownershipCategory?.code ? ownershipCategory:{}}
            errorStyle={formState.touched?.[config.key] && formState.errors[config.key]?.message ? true : false}
            disable={(isRenewal && ownershipCategory?.code) || isSameAsPropertyOwner}
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
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!ownershipCategory?.code}>
      { !(formData?.TradeDetails?.StructureType?.code === "MOVABLE") && formData?.cpt?.details &&<CheckBox
          label={t("TL_COMMON_SAME_AS_PROPERTY_OWNERS")}
          onChange={selectisSameAsPropertyOwner}
          value={isSameAsPropertyOwner}
          checked={isSameAsPropertyOwner || false}
          style={{ marginBottom: "20px" }}
          disable={isEdit}
      />}
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
        isTLFlow={true}
      />
    </FormStep>
    </React.Fragment>
  );
};

export default TLSelectOwnerShipDetails;
