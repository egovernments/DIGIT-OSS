import React, { useState, useEffect } from "react";
import { FormStep, RadioOrSelect, RadioButtons, LabelFieldPair, Dropdown, CardLabel } from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";
import { useLocation } from "react-router-dom";

const SelectOwnerShipDetails = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const isUpdateProperty = formData?.isUpdateProperty || false;
  const [ownershipCategory, setOwnershipCategory] = useState(formData?.ownershipCategory);
  const { data: SubOwnerShipCategoryOb, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "SubOwnerShipCategory");
  const { data: OwnerShipCategoryOb } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "OwnerShipCategory");
  const ownerShipdropDown = [];
  let subCategoriesInOwnersType = ["INDIVIDUAL"];
  let OwnerShipCategory = {};
  let SubOwnerShipCategory = {};
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");

  useEffect(() => {
    if (!isLoading && SubOwnerShipCategoryOb && OwnerShipCategoryOb) {
      const preFilledPropertyType = SubOwnerShipCategoryOb.filter(
        (ownershipCategory) => ownershipCategory.code === (formData?.ownershipCategory?.value || formData?.ownershipCategory)
      )[0];
      setOwnershipCategory(preFilledPropertyType);
    }
  }, [formData?.ownershipCategory, SubOwnerShipCategoryOb]);

  OwnerShipCategoryOb &&
    OwnerShipCategoryOb.length > 0 &&
    OwnerShipCategoryOb.map((category) => {
      OwnerShipCategory[category.code] = category;
    });
  SubOwnerShipCategoryOb &&
    SubOwnerShipCategoryOb.length > 0 &&
    SubOwnerShipCategoryOb.map((category) => {
      SubOwnerShipCategory[category.code] = category;
    });

  getOwnerDetails();

  function formDropdown(category) {
    const { name, code } = category;
    return {
      label: name,
      value: code,
      code: code,
    };
  }

  function getDropdwonForProperty(ownerShipdropDown) {
    return (
      ownerShipdropDown &&
      ownerShipdropDown.length &&
      ownerShipdropDown.splice(0, 4).map((ownerShipDetails) => ({
        ...ownerShipDetails,
        i18nKey: `PT_OWNERSHIP_${ownerShipDetails.value.split(".")[1] ? ownerShipDetails.value.split(".")[1] : ownerShipDetails.value.split(".")[0]}`,
      }))
    );
  }

  function getOwnerDetails() {
    if (OwnerShipCategory && SubOwnerShipCategory) {
      Object.keys(OwnerShipCategory).forEach((category) => {
        const categoryCode = OwnerShipCategory[category].code;
        if (subCategoriesInOwnersType.indexOf(categoryCode) !== -1) {
          Object.keys(SubOwnerShipCategory)
            .filter((subCategory) => categoryCode === SubOwnerShipCategory[subCategory].ownerShipCategory)
            .forEach((linkedCategory) => {
              ownerShipdropDown.push(formDropdown(SubOwnerShipCategory[linkedCategory]));
            });
        } else {
          ownerShipdropDown.push(formDropdown(OwnerShipCategory[category]));
        }
      });
    }
  }

  function selectedValue(value) {
    setOwnershipCategory(value);
  }

  const onSkip = () => onSelect();
  function goNext() {
    let index = window.location.href.charAt(window.location.href.length - 1);
    sessionStorage.setItem("ownershipCategory", ownershipCategory?.value);
    onSelect(config.key, ownershipCategory, "", index);
  }

  useEffect(() => {
    if (userType === "employee") {
      goNext();
    }
  }, [ownershipCategory]);

  const inputs = [
    {
      label: "PT_PROVIDE_OWNERSHIP_DETAILS",
      type: "text",
      name: "typeOfOwnership",
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
            selected={getDropdwonForProperty(ownerShipdropDown)?.length === 1 ? getDropdwonForProperty(ownerShipdropDown)[0] : ownershipCategory}
            disable={getDropdwonForProperty(ownerShipdropDown)?.length === 1 || editScreen}
            option={getDropdwonForProperty(ownerShipdropDown)}
            select={selectedValue}
            optionKey="i18nKey"
            t={t}
          />
        </LabelFieldPair>
      );
    });
  }

  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!ownershipCategory}>
      <div style={cardBodyStyle}>
        <RadioButtons
          isMandatory={config.isMandatory}
          options={getDropdwonForProperty(ownerShipdropDown) || []}
          selectedOption={ownershipCategory}
          optionsKey="i18nKey"
          onSelect={selectedValue}
          value={ownershipCategory}
          labelKey="PT_OWNERSHIP"
          isDependent={true}
          disabled={isUpdateProperty}
        />
      </div>
    </FormStep>
  );
};

export default SelectOwnerShipDetails;
