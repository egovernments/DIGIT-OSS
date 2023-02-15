import { CardLabel, CitizenInfoLabel, Dropdown, FormStep, LabelFieldPair, RadioOrSelect } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import Timeline from "../components/TLTimeline";

const ProvideSubUsageType = ({ t, config, onSelect, userType, formData }) => {
  //let index = window.location.href.charAt(window.location.href.length - 1);
  let index = window.location.href.split("/").pop();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  //const [SubUsageType, setSelfOccupied] = useState(formData?.ProvideSubUsageType);
  let SubUsageType, setSelfOccupied;
  if (!isNaN(index)) {
    [SubUsageType, setSelfOccupied] = useState(formData.units && formData.units[index] && formData.units[index].SubUsageType);
  } else {
    [SubUsageType, setSelfOccupied] = useState(formData.subusagetype?.SubUsageType);
  }

  const { data: Menu = {} } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "UsageCategory") || {};

  let subusageoption = [];
  subusageoption = Menu?.PropertyTax?.UsageCategory || [];

  let i;
  let data = [];

  function getSubUsagedata(subusageoption) {
    if (userType === "employee") {
      return subusageoption
        ?.map((item) => {
          const codeArr = item?.code.split(".");
          if (codeArr[1] == formData?.usageCategoryMajor?.i18nKey.split("_")[3] && codeArr.length == 4) {
            return {
              i18nKey: "COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_" + codeArr[1] + "_" + codeArr[codeArr.length - 1],
            };
          }
          return { filter: true };
        })
        ?.filter((item) => !item?.filter)
        ?.sort((a, b) => t(a.i18nKey).localeCompare(t(b.i18nKey)));
    } else {
      for (i = 0; i < subusageoption.length; i++) {
        if (
          Array.isArray(subusageoption) &&
          subusageoption.length > 0 &&
          subusageoption[i].code.split(".")[1] == formData?.usageCategoryMajor?.i18nKey.split("_")[3] &&
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
  }

  /* useEffect(() => {
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
  }, [!isNaN(index) ? formData?.units[index]?.SubUsageType?.i18nKey : formData?.SubUsageType?.i18nKey]); */

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

  const getCode = () => {
    for (i = 0; i < subusageoption.length; i++) {
      if (subusageoption[i]?.code.split(".").pop() === SubUsageType?.i18nKey.split("_").pop()) {
        return subusageoption[i]?.code;
      }
    }
  };

  const onSkip = () => onSelect();

  function selectSelfOccupied(value) {
    setSelfOccupied(value);
  }

  function goNext() {
    //let index = window.location.href.charAt(window.location.href.length - 1);
    let subuagecode = getCode();

    if (!isNaN(index)) {
      let unit = formData.units && formData.units[index];
      let floordet = { ...unit, SubUsageType, subuagecode };
      if (unit?.selfOccupied?.i18nKey === "PT_YES_IT_IS_SELFOCCUPIED") {
        sessionStorage.setItem("subusagetypevar", "yes");
      } else {
        sessionStorage.setItem("subusagetypevar", "no");
      }
      onSelect(config.key, floordet, false, index);
    } else {
      if (userType === "employee") {
        onSelect(config.key, { SubUsageType, subuagecode });
      } else {
        if (formData?.selfOccupied?.i18nKey === "PT_YES_IT_IS_SELFOCCUPIED") {
          sessionStorage.setItem("subusagetypevar", "yes");
        } else {
          sessionStorage.setItem("subusagetypevar", "no");
        }
        onSelect("subusagetype", { SubUsageType, subuagecode });
      }
    }
  }

  const [inputs, setInputs] = useState([]);

  useEffect(() => {
    if (userType === "employee") {
      const arr = ["RESIDENTIAL", "NONRESIDENTIAL.OTHERS", "MIXED"];
      if (!arr.includes(formData?.usageCategoryMajor?.code))
        setInputs([
          {
            label: "PT_ASSESSMENT_FLOW_SUBUSAGE_HEADER",
            type: "dropdown",
            name: "subusagetype",
            validation: {},
          },
        ]);
      else setInputs([]);
    }
  }, [formData?.usageCategoryMajor?.code]);

  useEffect(() => {
    if (userType === "employee") {
      goNext();
    }
  }, [SubUsageType]);

  if (userType === "employee") {
    return null;
    return inputs?.map((input, index) => {
      return (
        <LabelFieldPair key={index}>
          <CardLabel className="card-label-smaller">{t(input.label)}</CardLabel>
          <Dropdown
            className="form-field"
            selected={getSubUsagedata(subusageoption)?.length === 1 ? getSubUsagedata(subusageoption)[0] : SubUsageType}
            disable={getSubUsagedata(subusageoption)?.length === 1}
            option={getSubUsagedata(subusageoption)}
            select={selectSelfOccupied}
            optionKey="i18nKey"
            t={t}
          />
        </LabelFieldPair>
      );
    });
  }

  return (
    <React.Fragment>
          {window.location.href.includes("/citizen") ? <Timeline currentStep={1}/> : null}
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!SubUsageType}>
        <CardLabel>{t("PT_SUB_USAGE_TYPE_LABEL")}</CardLabel>
        <div className={"form-pt-dropdown-only"}>
          {getSubUsagedata(subusageoption) && (
            <RadioOrSelect
              isMandatory={config.isMandatory}
              selectedOption={SubUsageType}
              options={data || {}}
              t={t}
              optionKey="i18nKey"
              onSelect={selectSelfOccupied}
            />
          )}
        </div>
      </FormStep>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("PT_SUB_USAGE_TYPE_INFO_MSG")} />}
    </React.Fragment>
  );
};

export default ProvideSubUsageType;
