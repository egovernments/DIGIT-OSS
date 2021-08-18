import React, { useEffect, useState } from "react";
import { FormStep, RadioOrSelect, RadioButtons, LabelFieldPair, CardLabel, Dropdown } from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";
import { useLocation } from "react-router-dom";

const SelectSpecialOwnerCategoryType = ({ t, config, onSelect, userType, formData }) => {
  let index = window.location.href.charAt(window.location.href.length - 1);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const isUpdateProperty = formData?.isUpdateProperty || false;
  const [ownerType, setOwnerType] = useState(
    (formData.owners && formData.owners[index] && formData.owners[index].ownerType) || formData.owners?.ownerType || {}
  );
  const { data: Menu, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "OwnerType");
  Menu ? Menu.sort((a, b) => a.name.localeCompare(b.name)) : "";
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");

  const onSkip = () => onSelect();

  function setTypeOfOwner(value) {
    setOwnerType(value);
  }

  function goNext() {
    let ownerDetails = formData.owners && formData.owners[index];
    ownerDetails["ownerType"] = ownerType;
    onSelect(config.key, ownerDetails, "", index);
  }

  useEffect(() => {
    if (userType === "employee") {
      onSelect(config.key, { ...formData[config.key], ownerType });
    }
  }, [ownerType]);

  const inputs = [
    {
      label: "PT_SPECIAL_OWNER_CATEGORY",
      type: "text",
      name: "ownerSpecialCategory",
      validation: {},
    },
  ];

  if (userType === "employee") {
    return inputs?.map((input, index) => {
      return (
        <LabelFieldPair key={index}>
          <CardLabel className="card-label-smaller" style={editScreen ? { color: "#B1B4B6" } : {}}>
            {t(input.label)}
          </CardLabel>
          <Dropdown
            className="form-field"
            selected={Menu?.length === 1 ? Menu[0] : ownerType}
            disable={Menu?.length === 1 || editScreen}
            option={Menu}
            select={setTypeOfOwner}
            optionKey="i18nKey"
            t={t}
          />
        </LabelFieldPair>
      );
    });
  }

  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!ownerType}>
      <div style={{ ...cardBodyStyle, maxHeight: "calc(100vh - 22em)" }}>
        <RadioButtons
          t={t}
          optionsKey="i18nKey"
          isMandatory={config.isMandatory}
          options={Menu || []}
          selectedOption={ownerType}
          onSelect={setTypeOfOwner}
          labelKey="PROPERTYTAX_OWNERTYPE"
          isDependent={true}
          disabled={isUpdateProperty}
        />
      </div>
    </FormStep>
  );
};

export default SelectSpecialOwnerCategoryType;
