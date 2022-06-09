import {
  CardLabel,
  CardLabelError,
  CitizenInfoLabel,
  Dropdown,
  FormStep,
  LabelFieldPair,
  Loader,
  RadioButtons,
} from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { stringReplaceAll } from "../utils";
import Timeline from "../components/TLTimeline";

const PropertyType = ({ t, config, onSelect, userType, formData, setError, clearErrors, formState, onBlur }) => {
  const [BuildingType, setBuildingType] = useState(formData?.PropertyType);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const { data: Menu = {}, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "PTPropertyType") || {};
  let proptype = [];
  proptype = Menu?.PropertyTax?.PropertyType;
  let i;
  let menu = [];
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

  const { pathname } = useLocation();
  const presentInModifyApplication = pathname.includes("modify");

  const onSkip = () => onSelect();

  function selectBuildingType(value) {
    setBuildingType(value);
  }

  function goNext() {
    sessionStorage.setItem("PropertyType", BuildingType?.i18nKey);
    onSelect(config.key, BuildingType);
  }

  useEffect(() => {
    if (presentInModifyApplication && userType === "employee" && Menu) {
      const original = formData?.originalData?.propertyType;
      const defaultVal = getPropertyTypeMenu(proptype)?.filter((e) => e.code === original)[0];
      setBuildingType(defaultVal);
    }
  }, [isLoading]);

  useEffect(() => {
    if (userType === "employee") {
      goNext();
      if (!BuildingType) setError(config.key, { type: "required", message: t("CORE_COMMON_REQUIRED_ERRMSG") });
      else clearErrors(config.key);
    }
  }, [BuildingType]);

  const inputs = [
    {
      label: "PT_ASSESMENT_INFO_TYPE_OF_BUILDING",
      type: "text",
      name: "propertyType",
      validation: {},
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  if (userType === "employee") {
    return inputs?.map((input, index) => {
      return (
        <React.Fragment key={index}>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{t(input.label) + " *"}</CardLabel>
            <Dropdown
              className="form-field"
              selected={getPropertyTypeMenu(proptype)?.length === 1 ? getPropertyTypeMenu(proptype)[0] : BuildingType}
              disable={getPropertyTypeMenu(proptype)?.length === 1}
              option={getPropertyTypeMenu(proptype)}
              select={selectBuildingType}
              optionKey="i18nKey"
              onBlur={onBlur}
              t={t}
            />
          </LabelFieldPair>
          {formState.touched[config.key] ? (
            <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" }}>
              {formState.errors?.[config.key]?.message}
            </CardLabelError>
          ) : null}
        </React.Fragment>
      );
    });
  }

  return (
    <React.Fragment>
          {window.location.href.includes("/citizen") ? <Timeline currentStep={1}/> : null}
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!BuildingType}>
        <RadioButtons
          t={t}
          optionsKey="i18nKey"
          isMandatory={config.isMandatory}
          //options={menu}
          options={getPropertyTypeMenu(proptype) || {}}
          selectedOption={BuildingType}
          onSelect={selectBuildingType}
        />
      </FormStep>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("PT_PROPERTY_TYPE_INFO_MSG")} />}
    </React.Fragment>
  );
};
export default PropertyType;
