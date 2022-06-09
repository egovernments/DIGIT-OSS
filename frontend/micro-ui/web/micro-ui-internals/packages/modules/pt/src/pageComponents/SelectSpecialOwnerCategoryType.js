import React, { useEffect, useState } from "react";
import { FormStep, RadioOrSelect, RadioButtons, LabelFieldPair, CardLabel, Dropdown, Loader } from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";
import { useLocation } from "react-router-dom";
import Timeline from "../components/TLTimeline";

const SelectSpecialOwnerCategoryType = ({ t, config, onSelect, userType, formData, ownerIndex }) => {
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");
  const isMutation = url.includes("property-mutation");

  let index = isMutation ? ownerIndex : window.location.href.charAt(window.location.href.length - 1);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const isUpdateProperty = formData?.isUpdateProperty || false;
  let isEditProperty = formData?.isEditProperty || false;
  const [ownerType, setOwnerType] = useState(
    (formData.owners && formData.owners[index] && formData.owners[index]?.ownerType) || formData.owners?.ownerType || {}
  );
  const { data: Menu, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "OwnerType");
  Menu ? Menu.sort((a, b) => a.name.localeCompare(b.name)) : "";
  if (Menu?.length > 0) {
    Menu?.forEach((data, index) => {
      if (data.code == "NONE") data.order = 0;
      else data.order = index + 1;
    });
    Menu.sort(function (a, b) {
      return a.order - b.order;
    });
  }

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

  if (isLoading) return <Loader />;

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
    <React.Fragment>
      {window.location.href.includes("/citizen") ? (
        window.location.href.includes("/citizen/pt/property/property-mutation") ? (
          <Timeline currentStep={1} flow="PT_MUTATE" />
        ) : (
          <Timeline currentStep={2} />
        )
      ) : null}
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!ownerType}>
        <div>
          <RadioButtons
            t={t}
            optionsKey="i18nKey"
            isMandatory={config.isMandatory}
            options={Menu || []}
            selectedOption={ownerType}
            onSelect={setTypeOfOwner}
            labelKey="PROPERTYTAX_OWNERTYPE"
            isDependent={true}
            disabled={isUpdateProperty || isEditProperty}
          />
        </div>
      </FormStep>
    </React.Fragment>
  );
};

export default SelectSpecialOwnerCategoryType;
