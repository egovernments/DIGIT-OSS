import React, { useState, useEffect } from "react";
import { FormStep, RadioOrSelect, RadioButtons, LabelFieldPair, Dropdown, CardLabel, CardLabelError } from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";
import { useLocation } from "react-router-dom";

const SelectOwnerShipDetails = ({ t, config, onSelect, userType, formData, onBlur, formState, setError, clearErrors }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  //const isUpdateProperty = formData?.isUpdateProperty || false;
  //let isEditProperty = formData?.isEditProperty || false;
  let isEdit = window.location.href.includes("edit-application")||window.location.href.includes("renew-trade");
  const [ownershipCategory, setOwnershipCategory] = useState(formData?.ownershipCategory);
  const { data: OwnerShipCategoryOb } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "TLOwnerShipCategory");
  const ownerShipdropDown = [];
  let subCategoriesInOwnersType = ["INDIVIDUAL"];
  let OwnerShipCategory = {};
  let SubOwnerShipCategory = {};
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");

  OwnerShipCategoryOb &&
    OwnerShipCategoryOb.length > 0 &&
    OwnerShipCategoryOb.map((category) => {
      OwnerShipCategory[category.code] = category;
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

    if (userType === "employee") {
      const arr = ownerShipdropDown
        ?.filter((e) => e.code.split(".").length <= 2)
        ?.splice(0, 4)
        ?.map((ownerShipDetails) => ({
          ...ownerShipDetails,
          i18nKey: `COMMON_MASTERS_OWNERSHIPCATEGORY_INDIVIDUAL_${
            ownerShipDetails.value.split(".")[1] ? ownerShipDetails.value.split(".")[1] : ownerShipDetails.value.split(".")[0]
          }`,
        }));
        const finalArr = arr.filter(data => data.code.includes("INDIVIDUAL"));
      return finalArr;
    }

    return (
      ownerShipdropDown &&
      ownerShipdropDown.length &&
      ownerShipdropDown
        .splice(0, 4)
        .map((ownerShipDetails) => ({
          ...ownerShipDetails,
          i18nKey: `PT_OWNERSHIP_${
            ownerShipDetails.value.split(".")[1] ? ownerShipDetails.value.split(".")[1] : ownerShipDetails.value.split(".")[0]
          }`,
        }))
        .filter((ownerShipDetails) => ownerShipDetails.code.includes("INDIVIDUAL"))
    );
  }

  function getOwnerDetails() {
    if (OwnerShipCategory && SubOwnerShipCategory) {
      Object.keys(OwnerShipCategory).forEach((category) => {
        const categoryCode = OwnerShipCategory[category].code;
        ownerShipdropDown.push(formDropdown(OwnerShipCategory[category]));
      });
    }
  }

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
      if (!ownershipCategory) setError(config.key, { type: "required", message: `${config.key.toUpperCase()}_REQUIRED` });
      else clearErrors(config.key);
      goNext();
    }
  }, [ownershipCategory]);

  const dropdownData = getDropdwonForProperty(ownerShipdropDown);

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
            {`${t("TL_NEW_OWNER_DETAILS_OWNERSHIP_TYPE_LABEL")}:`}
          </CardLabel>
          <Dropdown
            className="form-field"
            selected={ownershipCategory}
            errorStyle={formState.touched?.[config.key] && formState.errors[config.key]?.message ? true : false}
            // selected={ownershipCategory ? ownershipCategory : dropdownData[0]}
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
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!ownershipCategory}>
      <RadioButtons
        isMandatory={config.isMandatory}
        //options={getDropdwonForProperty(ownerShipdropDown) || []}
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
  );
};

export default SelectOwnerShipDetails;
