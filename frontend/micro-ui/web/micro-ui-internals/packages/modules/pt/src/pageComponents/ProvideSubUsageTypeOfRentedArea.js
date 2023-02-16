import { CardLabel, CitizenInfoLabel, FormStep, RadioOrSelect } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import Timeline from "../components/TLTimeline";

const ProvideSubUsageTypeOfRentedArea = ({ t, config, onSelect, userType, formData }) => {
  //let index = window.location.href.charAt(window.location.href.length - 1);
  let index = window.location.href.split("/").pop();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  //const [SubUsageTypeOfRentedArea, setSelfOccupied] = useState(formData?.ProvideSubUsageTypeOfRentedArea);
  let SubUsageTypeOfRentedArea, setSelfOccupied;
  if (!isNaN(index)) {
    [SubUsageTypeOfRentedArea, setSelfOccupied] = useState(
      (formData.units && formData.units[index] && formData.units[index].SubUsageTypeOfRentedArea) || ""
    );
  } else {
    [SubUsageTypeOfRentedArea, setSelfOccupied] = useState(formData.Subusagetypeofrentedarea?.SubUsageTypeOfRentedArea || "");
  }
  const { data: Menu = {} } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "UsageCategory") || {};

  let subusageoption = [];
  subusageoption = Menu?.PropertyTax?.UsageCategory || [];
  let i;
  let data = [];

  function getSubUsagedata(subusageoption) {
    for (i = 0; i < subusageoption.length; i++) {
      if (
        Array.isArray(subusageoption) &&
        subusageoption.length > 0 &&
        subusageoption[i].code.split(".")[1] == formData?.usageCategoryMajor.i18nKey.split("_")[3] &&
        subusageoption[i].code.split(".").length == 4
      ) {
        data.push({
          i18nKey:
            "COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_" +
            subusageoption[i].code.split(".")[1] +
            "_" +
            subusageoption[i].code.split(".")[subusageoption[i].code.split(".").length - 1],
        });
      }
    }
    data.sort((a, b) => t(a.i18nKey).localeCompare(t(b.i18nKey)));
    return data;
  }

  /*   useEffect(() => {
    //let index = window.location.href.charAt(window.location.href.length - 1);
    let index = window.location.href.split("/").pop();
    if (userType !== "employee" && formData?.usageCategoryMajor?.i18nKey == "PROPERTYTAX_BILLING_SLAB_OTHERS") {
      //selectPropertyPurpose({i18nKey : "RESIDENTAL"})
      //let index = window.location.href.charAt(window.location.href.length - 1);
      //onSelect(config.key, { i18nKey: "COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_OTHERS_CREMATION/BURIAL" }, true, index);
      if (!isNaN(index)) {
        //let index = window.location.href.charAt(window.location.href.length - 1);
        let index = window.location.href.split("/").pop();
        let unit = formData.units && formData.units[index];
        onSelect(config.key, unit, true, index);
      } else {
        onSelect(config.key, { i18nKey: "COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_OTHERS_CREMATION/BURIAL" }, true, index);
      }
    }
  }, [!isNaN(index) ? formData?.units[index]?.SubUsageTypeOfRentedArea?.i18nKey : formData?.SubUsageTypeOfRentedArea?.i18nKey]); */

  /*   useEffect(() => {
    if (userType !== "employee" && formData?.usageCategoryMajor?.i18nKey === "PROPERTYTAX_BILLING_SLAB_RESIDENTIAL") {
      //selectPropertyPurpose({i18nKey : "RESIDENTAL"})
      //let index = window.location.href.charAt(window.location.href.length - 1);
      let index = window.location.href.split("/").pop();
      //onSelect(config.key, { i18nKey: "PROPERTYTAX_BILLING_SLAB_RESIDENTIAL" }, true, index);
      if (!isNaN(index)) {
        //let index = window.location.href.charAt(window.location.href.length - 1);
        let index = window.location.href.split("/").pop();
        let unit = formData.units && formData.units[index];
        onSelect(config.key, unit, true, index);
      } else {
        onSelect(config.key, { i18nKey: "PROPERTYTAX_BILLING_SLAB_RESIDENTIAL" }, true, index);
      }
    }
  }); */

  /*  useEffect(() => {
    if (userType !== "employee" && formData?.IsThisFloorSelfOccupied?.i18nKey === "PT_YES_IT_IS_SELFOCCUPIED") {
      //selectPropertyPurpose({i18nKey : "RESIDENTAL"})
      if (!isNaN(index)) {
        //let index = window.location.href.charAt(window.location.href.length - 1);
        let index = window.location.href.split("/").pop();
        let unit = formData.units && formData.units[index];
        onSelect(config.key, unit, true, index);
      } else {
        onSelect(config.key, {}, true, index);
      }
    }
  }); */

  const getCode = () => {
    for (i = 0; i < subusageoption.length; i++) {
      if (subusageoption[i]?.code.split(".").pop() === SubUsageTypeOfRentedArea.i18nKey.split("_").pop()) {
        return subusageoption[i]?.code;
      }
    }
  };

  const onSkip = () => onSelect();

  function selectSelfOccupied(value) {
    setSelfOccupied(value);
  }

  function goNext() {
    let Subusagetypeofrentedareacode = getCode();
    if (!isNaN(index)) {
      let unit = formData.units && formData.units[index];
      let floordet = { ...unit, SubUsageTypeOfRentedArea, Subusagetypeofrentedareacode };
      //let index = window.location.href.charAt(window.location.href.length - 1);
      onSelect(config.key, floordet, false, index);
    } else {
      onSelect("Subusagetypeofrentedarea", { SubUsageTypeOfRentedArea, Subusagetypeofrentedareacode });
    }
  }
  return (
    <React.Fragment>
          {window.location.href.includes("/citizen") ? <Timeline currentStep={1}/> : null}
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!SubUsageTypeOfRentedArea}>
        <CardLabel>{t("PT_SUB_USAGE_TYPE_LABEL")}</CardLabel>
        <div className={"form-pt-dropdown-only"}>
          {getSubUsagedata(subusageoption) && (
            <RadioOrSelect
              t={t}
              optionKey="i18nKey"
              isMandatory={config.isMandatory}
              options={data || []}
              selectedOption={SubUsageTypeOfRentedArea}
              onSelect={selectSelfOccupied}
            />
          )}
        </div>
      </FormStep>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("PT_SUB_USAGE_TYPE_INFO_MSG")} />}
    </React.Fragment>
  );
};

export default ProvideSubUsageTypeOfRentedArea;
