import React, { useEffect, useState } from "react";
import { FormStep, TextInput, CardLabel, RadioButtons, LabelFieldPair, Dropdown, Menu, MobileNumber } from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";
import { useLocation, useRouteMatch } from "react-router-dom";
import { stringReplaceAll } from "../utils";

const PropertyAssemblyDetails = ({ t, config, onSelect, userType, formData, ownerIndex, onBlur}) => {
  let proptype = [];
  let validation = {};
  
  const [BuildingType, setBuildingType] = useState(formData?.PropertyType);
  const stateId = Digit.ULBService.getStateId();
  const [floorarea, setfloorarea] = useState(formData.landArea);
  const [constructionArea, setConstructionArea] = useState(formData.constructionArea);
  const [usageCategoryMajor, setPropertyPurpose] = useState(
    formData?.usageCategoryMajor && formData?.usageCategoryMajor?.code === "NONRESIDENTIAL.OTHERS"
      ? { code: `${formData?.usageCategoryMajor?.code}`, i18nKey: `PROPERTYTAX_BILLING_SLAB_OTHERS` }
      : formData?.usageCategoryMajor
  );

  const { data: Menu = {}, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "PTPropertyType") || {};
  proptype = Menu?.PropertyTax?.PropertyType;

  const { data: Menu1 = {}, isLoading: menuLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "UsageCategory") || {};
  let usagecat = [];
  usagecat = Menu1?.PropertyTax?.UsageCategory || [];

  let index = 0;
  let assemblyDet = formData.assemblyDet;
  const assemblyDetStep = { ...assemblyDet, BuildingType, floorarea, constructionArea, usageCategoryMajor };

  function setPropertyfloorarea(e) {
    setfloorarea(e.target.value);
    onSelect(config.key, { ...formData[config.key], ...assemblyDetStep, floorarea: e.target.value }, false, index);
  }

  function setPropertyConsArea(e) {
    setConstructionArea(e.target.value);
    onSelect(config.key, { ...formData[config.key], ...assemblyDetStep, constructionArea: e.target.value }, false, index);
  }
  
  function selectBuildingType(value) {
    setBuildingType(value);
    onSelect(config.key, { ...formData[config.key], ...assemblyDetStep, BuildingType: value }, false, index);
  }

  function selectPropertyPurpose(value) {
    setPropertyPurpose(value);
    onSelect(config.key, { ...formData[config.key], ...assemblyDetStep, usageCategory: value }, false, index);
  }

  function getPropertyTypeMenu(proptype) {
    if (userType === "employee") {
      return proptype
        ?.filter((e) => e.code === "VACANT" || e.code.split(".").length > 1)
        ?.map((item) => ({ i18nKey: "COMMON_PROPTYPE_" + stringReplaceAll(item?.code, ".", "_"), code: item?.code }))
        ?.sort((a, b) => a.i18nKey.split("_").pop().localeCompare(b.i18nKey.split("_").pop()));
    } else {
      if (Array.isArray(proptype) && proptype.length > 0) {
        for (i = 0; i < proptype.length; i++) {
          if (i != 1 && i != 4 && Array.isArray(proptype) && proptype.length > 0)
            menu.push({ i18nKey: "COMMON_PROPTYPE_" + stringReplaceAll(proptype[i].code, ".", "_"), code: proptype[i].code });
        }
      }
      menu.sort((a, b) => a.i18nKey.split("_").pop().localeCompare(b.i18nKey.split("_").pop()));
      return menu;
    }
  }

  function usageCategoryMajorMenu(usagecat) {
    if (userType === "employee") {
      const catMenu = usagecat
        ?.filter((e) => e?.code.split(".").length <= 2 && e.code !== "NONRESIDENTIAL")
        ?.map((item) => {
          const arr = item?.code.split(".");
          if (arr.length == 2) return { i18nKey: "PROPERTYTAX_BILLING_SLAB_" + arr[1], code: item?.code };
          else return { i18nKey: "PROPERTYTAX_BILLING_SLAB_" + item?.code, code: item?.code };
        });
      return catMenu;
    } else {
      for (i = 0; i < 10; i++) {
        if (
          Array.isArray(usagecat) &&
          usagecat.length > 0 &&
          usagecat[i].code.split(".")[0] == "NONRESIDENTIAL" &&
          usagecat[i].code.split(".").length == 2
        ) {
          menu.push({ i18nKey: "PROPERTYTAX_BILLING_SLAB_" + usagecat[i].code.split(".")[1], code: usagecat[i].code });
        }
      }
      return menu;
    }
  }

  return (
    <div>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t('PT_PROP_TYPE')}</CardLabel>
        <div class="form-field">
          <Dropdown
            selected={getPropertyTypeMenu(proptype)?.length === 1 ? getPropertyTypeMenu(proptype)[0] : BuildingType}
            disable={getPropertyTypeMenu(proptype)?.length === 1}
            option={getPropertyTypeMenu(proptype)}
            select={selectBuildingType}
            optionKey="i18nKey"
            onBlur={onBlur}
            t={t}
            />
        </div>
      </LabelFieldPair>

      <LabelFieldPair>
        <CardLabel>{`${t("PT_TOT_LAND_AREA")}`}</CardLabel>
        <div className="form-field">        
          <TextInput
            t={t}
            type={"number"}
            isMandatory={false}
            optionKey="i18nKey"
            name="totLandArea"
            value={floorarea}
            onChange={setPropertyfloorarea}
            {...(validation = { pattern: "^([0-9]){0,8}$", type: "number", title: t("PT_TOT_LAND_AREA_ERROR_MESSAGE") })}
          />
        </div>
      </LabelFieldPair>

      <LabelFieldPair>
        <CardLabel>{`${t("PT_TOT_CONSTRUCTION_AREA")}`}</CardLabel>
        <div className="form-field">        
          <TextInput
            t={t}
            type={"number"}
            isMandatory={false}
            optionKey="i18nKey"
            name="totConstructionArea"
            value={constructionArea}
            onChange={setPropertyConsArea}
            {...(validation = { pattern: "^([0-9]){0,8}$", type: "number", title: t("PT_TOT_CONSTRUCTION_AREA_ERROR_MESSAGE") })}
          />
        </div>
      </LabelFieldPair>

      <LabelFieldPair>
        <CardLabel>{t("PT_ASSESMENT_INFO_USAGE_TYPE")}</CardLabel>
        <div className="form-field">
          <Dropdown
            selected={usageCategoryMajor}
            disable={usageCategoryMajorMenu(usagecat)?.length === 1}
            option={usageCategoryMajorMenu(usagecat)}
            select={(e) => {
              selectPropertyPurpose(e);
            }}
            optionKey="i18nKey"
            onBlur={onBlur}
            t={t}
          />
        </div>
      </LabelFieldPair>
    </div>
  );
};

export default PropertyAssemblyDetails;
