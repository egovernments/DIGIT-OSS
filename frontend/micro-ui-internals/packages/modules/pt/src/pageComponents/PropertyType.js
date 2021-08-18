import React, { useEffect, useState } from "react";
import { FormStep, RadioButtons, CardLabel, LabelFieldPair, Dropdown, Loader } from "@egovernments/digit-ui-react-components";
import { stringReplaceAll } from "../utils";

const PropertyType = ({ t, config, onSelect, userType, formData }) => {
  const [BuildingType, setBuildingType] = useState(formData?.PropertyType);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const { data: Menu = {}, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "PTPropertyType") || {};
  let proptype = [];
  proptype = Menu?.PropertyTax?.PropertyType;
  let i;
  let menu = [];
  function getPropertyTypeMenu(proptype) {
    if (userType === "employee") {
      return proptype
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
      //console.log(menu);
      return menu;
    }
  }

  const onSkip = () => onSelect();

  // const propertyOwnerShipCategory = Digit.Hooks.pt.useMDMS("pb", "PropertyTax", "OwnerShipCategory", {});
  function selectBuildingType(value) {
    setBuildingType(value);
  }

  function goNext() {
    sessionStorage.setItem("PropertyType", BuildingType?.i18nKey);
    onSelect(config.key, BuildingType);
  }

  useEffect(() => {
    if (userType === "employee") {
      goNext();
    }
  }, [BuildingType]);

  const inputs = [
    {
      label: "ES_NEW_APPLICATION_PROPERTY_TYPE",
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
        <LabelFieldPair key={index}>
          <CardLabel className="card-label-smaller">{t(input.label)}</CardLabel>
          <Dropdown
            className="form-field"
            selected={getPropertyTypeMenu(proptype)?.length === 1 ? getPropertyTypeMenu(proptype)[0] : BuildingType}
            disable={getPropertyTypeMenu(proptype)?.length === 1}
            option={getPropertyTypeMenu(proptype)}
            select={selectBuildingType}
            optionKey="i18nKey"
            t={t}
          />
        </LabelFieldPair>
      );
    });
  }

  return (
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
  );
};
export default PropertyType;
