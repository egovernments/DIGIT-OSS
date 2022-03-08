import {
  CardLabel,
  CheckBox,
  Dropdown,
  LabelFieldPair,
  MobileNumber,
  RadioButtons,
  TextArea,
  TextInput
} from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const PropertyOwnerDetails = ({ t, config, onSelect, userType, formData, ownerIndex }) => {
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");
  const mutationScreen = url.includes("/property-mutation/");

  let index = 0; // mutationScreen ? ownerIndex : window.location.href.charAt(window.location.href.length - 1);

  let validation = {};
  const [name, setName] = useState((formData.owners && formData.owners[index] && formData.owners[index].name) || formData?.owners?.name || "");
  const [email, setEmail] = useState((formData.owners && formData.owners[index] && formData.owners[index].email) || formData?.owners?.emailId || "");
  const [gender, setGender] = useState((formData.owners && formData.owners[index] && formData.owners[index].gender) || formData?.owners?.gender);
  const [mobileNumber, setMobileNumber] = useState(
    (formData.owners && formData.owners[index] && formData.owners[index].mobileNumber) || formData?.owners?.mobileNumber || ""
  );
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState(
    (formData.owners && formData.owners[index] && formData.owners[index].fatherOrHusbandName) || formData?.owners?.fatherOrHusbandName || ""
  );
  const [relationship, setRelationship] = useState(
    (formData.owners && formData.owners[index] && formData.owners[index].relationship) || formData?.owners?.relationship || {}
  );
  const isUpdateProperty = formData?.isUpdateProperty || false;
  let isEditProperty = formData?.isEditProperty || false;

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const { data: Menu } = Digit.Hooks.pt.useGenderMDMS(stateId, "common-masters", "GenderType");

  let menu = [];
  Menu &&
    Menu.map((genderDetails) => {
      menu.push({ i18nKey: `PT_COMMON_GENDER_${genderDetails.code}`, code: `${genderDetails.code}`, value: `${genderDetails.code}` });
    });

  const [ownershipCategory, setOwnershipCategory] = useState(formData?.ownershipCategory);
  const { data: dropdownData } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "TLOwnerTypeWithSubtypes", { userType });

  const [ownerType, setOwnerType] = useState(
    (formData.owners && formData.owners[index] && formData.owners[index]?.ownerType) || formData.owners?.ownerType || {}
  );
  const { data: Menu1, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "OwnerType");
  Menu1 ? Menu1.sort((a, b) => a.name.localeCompare(b.name)) : "";

  const [permanentAddress, setPermanentAddress] = useState(
    (formData.owners && formData.owners[index] && formData.owners[index].permanentAddress) || formData?.owners?.permanentAddress || ""
  );
  const [isCorrespondenceAddress, setIsCorrespondenceAddress] = useState(
    formData.owners && formData.owners[index] && formData.owners[index].isCorrespondenceAddress
  );

  let owner = formData.owners && formData.owners[index];
  const ownerStep = {
    ...owner,
    name,
    gender,
    mobileNumber,
    fatherOrHusbandName,
    relationship,
    ownershipCategory,
    ownerType,
    permanentAddress,
    isCorrespondenceAddress,
  };

  function setOwnershipCat(value) {
    setOwnershipCategory(value);
    onSelect(config.key, { ...formData[config.key], ...ownerStep, ownershipCategory: value }, false, index);
  }

  function setOwnerName(e) {
    setName(e.target.value);
    onSelect(config.key, { ...formData[config.key], ...ownerStep, name: e.target.value }, false, index);
  }

  function setGenderName(value) {
    setGender(value);
    onSelect(config.key, { ...formData[config.key], ...ownerStep, gender: value }, false, index);
  }

  function setMobileNo(value) {
    setMobileNumber(value);
    onSelect(config.key, { ...formData[config.key], ...ownerStep, mobileNumber: value }, false, index);
  }
  function setGuardiansName(e) {
    setFatherOrHusbandName(e.target.value);
    onSelect(config.key, { ...formData[config.key], ...ownerStep, fatherOrHusbandName: e.target.value }, false, index);
  }
  function setGuardianName(value) {
    setRelationship(value);
    onSelect(config.key, { ...formData[config.key], ...ownerStep, relationship: value }, false, index);
  }

  function setOwnerType1(value) {
    setOwnerType(value);
    onSelect(config.key, { ...formData[config.key], ...ownerStep, ownerType: value }, false, index);
  }

  function setOwnerAddress(value) {
    setPermanentAddress(value);
    onSelect(config.key, { ...formData[config.key], ...ownerStep, permanentAddress: value }, false, index);
  }

  function setCorrespondenceAddress(e) {
    if (e.target.checked == true) {
      const locationDet = mutationScreen ? formData?.searchResult?.property?.locationDet : formData?.locationDet;
      let obj = {
        doorNo: locationDet?.houseDoorNo,
        street: locationDet?.buildingColonyName,
        landmark: locationDet?.landmarkName,
        locality: locationDet?.locality?.i18nkey,
        city: locationDet?.cityCode?.name,
        // pincode: locationDet?.locality?.pincode[0],
      };
      let addressDetails = "";
      for (const key in obj) {
        if (key == "city") addressDetails += obj[key] ? obj[key] : "";
        else addressDetails += obj[key] ? t(obj[key]) + ", " : "";
      }
      setOwnerAddress(addressDetails);
    } else {
      setOwnerAddress("");
    }

    setIsCorrespondenceAddress(e.target.checked);
    onSelect(config.key, { ...formData[config.key], ...ownerStep, isCorrespondenceAddress: e.target.checked }, false, index);
  }

  const options = [
    { name: "Female", value: "FEMALE", code: "FEMALE" },
    { name: "Male", value: "MALE", code: "MALE" },
    { name: "Transgender", value: "TRANSGENDER", code: "TRANSGENDER" },
    { name: "OTHERS", value: "OTHERS", code: "OTHERS" },
    // { name: "Other", value: "OTHER", code: "OTHER" },
  ];

  const GuardianOptions = [
    { name: "HUSBAND", code: "HUSBAND", i18nKey: "PT_RELATION_HUSBAND" },
    { name: "Father", code: "FATHER", i18nKey: "PT_RELATION_FATHER" },
    // { name: "Husband/Wife", code: "HUSBANDWIFE", i18nKey: "PT_RELATION_HUSBANDWIFE" },
    // { name: "Other", code: "OTHER", i18nKey: "PT_RELATION_OTHER" },
  ];

  return (
    <div>
      <LabelFieldPair>
        <CardLabel className="">{`${t("TL_NEW_OWNER_DETAILS_OWNERSHIP_TYPE_LABEL")} :`}</CardLabel>
        <Dropdown
          className="form-field"
          selected={ownershipCategory}
          // errorStyle={formState.touched?.[config.key] && formState.errors[config.key]?.message ? true : false}
          option={dropdownData}
          select={setOwnershipCat}
          optionKey="i18nKey"
          // onBlur={onBlur}
          t={t}
        />
      </LabelFieldPair>

      <LabelFieldPair>
        <CardLabel>{`${t("PT_FORM3_MOBILE_NUMBER")}`}</CardLabel>
        <div className="form-field">
          <MobileNumber
            value={mobileNumber}
            name="mobileNumber"
            onChange={setMobileNo}
            disable={isUpdateProperty || isEditProperty}
            {...{ required: true, pattern: "[6-9]{1}[0-9]{9}", type: "tel", title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID") }}
          />
        </div>
      </LabelFieldPair>

      <LabelFieldPair>
        <CardLabel>{`${t("PT_OWNER_NAME")}`}</CardLabel>
        <div className="form-field">
          <TextInput
            t={t}
            type={"text"}
            isMandatory={false}
            optionKey="i18nKey"
            name="name"
            value={name}
            onChange={setOwnerName}
            disable={isUpdateProperty || isEditProperty}
            {...(validation = {
              isRequired: true,
              pattern: "^[a-zA-Z-.`' ]*$",
              type: "text",
              title: t("PT_NAME_ERROR_MESSAGE"),
            })}
          />
        </div>
      </LabelFieldPair>

      <LabelFieldPair>
        <CardLabel>{`${t("PT_FORM3_GENDER")}`}</CardLabel>
        <div className="form-field">
          <RadioButtons
            t={t}
            options={menu}
            optionsKey="code"
            name="gender"
            value={gender}
            selectedOption={gender}
            onSelect={setGenderName}
            isDependent={true}
            labelKey="PT_COMMON_GENDER"
            disabled={isUpdateProperty || isEditProperty}
          />
        </div>
      </LabelFieldPair>

      <LabelFieldPair>
        <CardLabel>{`${t("PT_FORM3_GUARDIAN_NAME")}`}</CardLabel>
        <div className="form-field">
          <TextInput
            t={t}
            type={"text"}
            isMandatory={false}
            optionKey="i18nKey"
            name="fatherOrHusbandName"
            value={fatherOrHusbandName}
            onChange={setGuardiansName}
            disable={isUpdateProperty || isEditProperty}
            {...(validation = {
              isRequired: true,
              pattern: "^[a-zA-Z-.`' ]*$",
              type: "text",
              title: t("PT_NAME_ERROR_MESSAGE"),
            })}
          />
        </div>
      </LabelFieldPair>

      <LabelFieldPair>
        <CardLabel>{`${t("PT_FORM3_RELATIONSHIP")}`}</CardLabel>
        <div className="form-field">
          <RadioButtons
            t={t}
            optionsKey="i18nKey"
            name="relationship"
            options={GuardianOptions}
            value={relationship}
            selectedOption={relationship}
            onSelect={setGuardianName}
            isDependent={true}
            labelKey="PT_RELATION"
            disabled={isUpdateProperty || isEditProperty}
          />
        </div>
      </LabelFieldPair>

      <LabelFieldPair>
        <CardLabel className="">{`${t("PT_SPECIAL_APPLICANT_CATEGORY")}`}</CardLabel>
        <div className="form-field">
          <Dropdown
            selected={Menu1?.length === 1 ? Menu1[0] : ownerType}
            disable={Menu1?.length === 1 || editScreen}
            option={Menu1}
            select={setOwnerType1}
            optionKey="i18nKey"
            t={t}
          />
        </div>
      </LabelFieldPair>

      <LabelFieldPair>
        <CardLabel>{t("PT_CORRESPONDANCE_ADDRESS")}</CardLabel>
        <div className="form-field">
          <TextArea
            isMandatory={false}
            optionKey="i18nKey"
            t={t}
            name="address"
            onChange={(e) => setOwnerAddress(e.target.value)}
            value={permanentAddress}
          />
        </div>
      </LabelFieldPair>

      <CheckBox
        className="form-field"
        label={t("PT_COMMON_SAME_AS_PROPERTY_ADDRESS")}
        onChange={setCorrespondenceAddress}
        value={isCorrespondenceAddress}
        checked={isCorrespondenceAddress || false}
        style={{ paddingTop: "10px" }}
      />
    </div>
  );
};

export default PropertyOwnerDetails;
