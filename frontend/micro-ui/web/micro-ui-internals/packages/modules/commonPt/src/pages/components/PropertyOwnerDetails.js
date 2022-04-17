import {
  CardLabel,
  CheckBox,
  Dropdown,
  LabelFieldPair,
  MobileNumber,
  RadioButtons,
  TextArea,
  TextInput,
  RadioOrSelect,
  CardLabelError
} from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

const PropertyOwnerDetails = ({ t, config, onSelect, userType, formData, formState, ownerIndex, setError, clearErrors }) => {
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");
  const mutationScreen = url.includes("/property-mutation/");

  let index = 0; // mutationScreen ? ownerIndex : window.location.href.charAt(window.location.href.length - 1);

  let validation = {};
  const [ownerDetails, setOwnerDetails] = React.useState({
    ...formData.owners && formData.owners[index],
    name: (formData.owners && formData.owners[index] && formData.owners[index].name) || formData?.owners?.name || "",
    gender: (formData.owners && formData.owners[index] && formData.owners[index].gender) || formData?.owners?.gender,
    mobileNumber: (formData.owners && formData.owners[index] && formData.owners[index].mobileNumber) || formData?.owners?.mobileNumber || "",
    fatherOrHusbandName: (formData.owners && formData.owners[index] && formData.owners[index].fatherOrHusbandName) || formData?.owners?.fatherOrHusbandName || "",
    relationship: (formData.owners && formData.owners[index] && formData.owners[index].relationship) || formData?.owners?.relationship,
    ownershipCategory: formData?.ownershipCategory,
    ownerType: (formData.owners && formData.owners[index] && formData.owners[index]?.ownerType) || formData.owners?.ownerType,
    permanentAddress: (formData.owners && formData.owners[index] && formData.owners[index].permanentAddress) || formData?.owners?.permanentAddress || "",
    email: (formData.owners && formData.owners[index] && formData.owners[index].email) || formData?.owners?.emailId || "",
  });
  const [isErrors, setIsErrors] = useState(false);

  const isUpdateProperty = formData?.isUpdateProperty || false;
  let isEditProperty = formData?.isEditProperty || false;

  const stateId = Digit.ULBService.getStateId();

  const { data: Menu } = Digit.Hooks.pt.useGenderMDMS(stateId, "common-masters", "GenderType");

  let menu = [];
  Menu &&
    Menu.map((genderDetails) => {
      menu.push({ i18nKey: `PT_COMMON_GENDER_${genderDetails.code}`, code: `${genderDetails.code}`, value: `${genderDetails.code}` });
    });

  const { data: dropdownData } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "TLOwnerTypeWithSubtypes", { userType });

  const { data: Menu1, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "OwnerType");
  
  const [isCorrespondenceAddress, setIsCorrespondenceAddress] = useState(
    formData?.owners?.isCorrespondenceAddress
  );

  function setCorrespondenceAddress(e) {
    let address = "";

    if (e.target.checked === true) {
      const locationDet = mutationScreen ? formData?.searchResult?.property?.locationDet : formData?.locationDet;
      const doorNo = locationDet?.houseDoorNo ? locationDet?.houseDoorNo + ", " : "";
      const street = locationDet?.buildingColonyName ? locationDet?.buildingColonyName + ", " : "";
      const landMark = locationDet?.landmarkName ? locationDet?.landmarkName + ", " : "";
      const locality = locationDet?.locality?.i18nKey ? locationDet?.locality?.i18nKey + ", " : "";
      const cityCode = locationDet?.locality?.pincode?.[0] ? locationDet?.locality?.pincode?.[0] : "";

      address = `${doorNo}${street}${landMark}${locality}${cityCode}`;
    }

    setOwnerDetails({ ...ownerDetails, permanentAddress: address });
    setIsCorrespondenceAddress(e.target.checked);
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

  const { control, formState: { errors, touched }, trigger, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, getValues } = useForm();
  const formValue = watch();

  React.useEffect(() => {
    let hasErrors = false;
    const part = {};

    Object.keys(ownerDetails).forEach((key) => {
      part[key] = formValue?.[key];
    });

    if (!_.isEqual(part, ownerDetails)) {
      Object.keys(ownerDetails).forEach((key) => {
        if (ownerDetails[key]) {
          hasErrors = false;
          clearLocalErrors(key);
        } else {
          hasErrors = true;
        }
      });
    }

    if (hasErrors) {
      setError(config?.key, { type: errors })
    } else {
      clearErrors(config?.key);
    }

    trigger();
    setIsErrors(hasErrors);
    onSelect(config?.key, ownerDetails);
  }, [ownerDetails]);

  React.useEffect(() => {
    if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) {
      setError(config.key, { type: errors });
    } else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
      clearErrors(config.key);
    }
  }, [errors]);

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

  return (
    <div>
      <LabelFieldPair>
        <CardLabel className="">{`${t("TL_NEW_OWNER_DETAILS_OWNERSHIP_TYPE_LABEL")}*`}</CardLabel>
        <Controller
          name="ownershipCategory"
          defaultValue={ownerDetails?.ownershipCategory}
          control={control}
          rules={{
            required: t("REQUIRED_FIELD"),
          }}
          render={({ value, onChange, onBlur }) => (
            <Dropdown
              className="form-field"
              selected={value}
              option={dropdownData?.filter(dd => dd.code?.includes("INDIVIDUAL"))}
              select={(value) => {
                onChange(value);
                setOwnerDetails({ ...ownerDetails, ownershipCategory: value })
              }}
              optionKey="i18nKey"
              onBlur={onBlur}
              t={t}
            />
          )}
        />
      </LabelFieldPair>
      <CardLabelError style={errorStyle}>{touched?.ownershipCategory ? errors?.ownershipCategory?.message : ""}</CardLabelError>

      <div style={{
        border: "1px solid #D6D5D4",
        background: "#FAFAFA",
        borderRadius: "4px",
        boxSizing: "border-box",
        margin: "16px 0px",
        padding: "16px 8px",

      }}>
        <LabelFieldPair>
          <CardLabel>{`${t("PT_FORM3_MOBILE_NUMBER")}*`}</CardLabel>
          <div className="form-field">
            <Controller
              name="mobileNumber"
              defaultValue={ownerDetails?.mobileNumber}
              control={control}
              rules={{
                required: t("REQUIRED_FIELD"),
                validation: (value) => /[6-9]{1}[0-9]{9}/i.test(value) ? true : t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")
              }}
              render={({ value, onChange, onBlur }) => (
                <MobileNumber
                  value={value}
                  name="mobileNumber"
                  onChange={(value) => {
                    onChange(value);
                    setOwnerDetails({ ...ownerDetails, mobileNumber: value });
                  }}
                  disable={isUpdateProperty || isEditProperty}
                  // {...{ required: true, pattern: "[6-9]{1}[0-9]{9}", type: "tel", title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID") }}
                  labelStyle={{ border: "1px solid #000", borderRight: "none" }}
                  onBlur={onBlur}
                />
              )}
            />
          </div>
        </LabelFieldPair>
        <CardLabelError style={errorStyle}>{touched?.mobileNumber ? errors?.mobileNumber?.message : ""}</CardLabelError>

        <LabelFieldPair>
          <CardLabel>{`${t("PT_OWNER_NAME")}*`}</CardLabel>
          <div className="form-field">
            <Controller
              name="name"
              defaultValue={ownerDetails?.name}
              control={control}
              rules={{
                required: t("REQUIRED_FIELD"),
                validation: (value) => /^[a-zA-Z-.`' ]*$/i.test(value) ? true : t("PT_NAME_ERROR_MESSAGE")
              }}
              render={({ value, onChange, onBlur }) => (
                <TextInput
                  t={t}
                  type={"text"}
                  isMandatory={false}
                  optionKey="i18nKey"
                  name="name"
                  value={value}
                  onChange={(ev) => {
                    onChange(ev.target.value);
                    setOwnerDetails({ ...ownerDetails, name: ev.target.value })
                  }}
                  disable={isUpdateProperty || isEditProperty}
                  onBlur={onBlur}
                />
              )}
            />
          </div>
        </LabelFieldPair>
        <CardLabelError style={errorStyle}>{touched?.name ? errors?.name?.message : ""}</CardLabelError>

        <LabelFieldPair>
          <CardLabel>{`${t("PT_FORM3_GENDER")}*`}</CardLabel>
          <div className="form-field">
            <Controller
              name="gender"
              defaultValue={ownerDetails?.gender}
              control={control}
              rules={{
                required: t("REQUIRED_FIELD"),
              }}
              render={({ value, onChange, onBlur }) => (
                <RadioOrSelect
                  name="gender"
                  options={menu}
                  selectedOption={value}
                  optionKey="code"
                  onSelect={(value) => {
                    onChange(value);
                    setOwnerDetails({ ...ownerDetails, gender: value });
                  }}
                  t={t}
                  disabled={isUpdateProperty || isEditProperty}
                  isDropDown={window.location.href.includes("/employee") ? true : false}
                  onBlur={onBlur}
                />
              )}
            />
            {/* <RadioButtons
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
          /> */}
          </div>
        </LabelFieldPair>
        <CardLabelError style={errorStyle}>{touched?.gender ? errors?.gender?.message : ""}</CardLabelError>

        <LabelFieldPair>
          <CardLabel>{`${t("PT_FORM3_GUARDIAN_NAME")}*`}</CardLabel>
          <div className="form-field">
            <Controller
              name="fatherOrHusbandName"
              defaultValue={ownerDetails?.fatherOrHusbandName}
              control={control}
              rules={{
                required: t("REQUIRED_FIELD"),
                validation: (value) => /^[a-zA-Z-.`' ]*$/i.test(value) ? true : t("PT_NAME_ERROR_MESSAGE")
              }}
              render={({ value, onChange, onBlur }) => (
                <TextInput
                  t={t}
                  type={"text"}
                  isMandatory={false}
                  optionKey="i18nKey"
                  name="fatherOrHusbandName"
                  value={value}
                  onChange={(ev) => {
                    onChange(ev.target.value);
                    setOwnerDetails({ ...ownerDetails, fatherOrHusbandName: ev.target.value });
                  }}
                  disable={isUpdateProperty || isEditProperty}
                  onBlur={onBlur}
                />
              )}
            />
          </div>
        </LabelFieldPair>
        <CardLabelError style={errorStyle}>{touched?.fatherOrHusbandName ? errors?.fatherOrHusbandName?.message : ""}</CardLabelError>

        <LabelFieldPair>
          <CardLabel>{`${t("PT_FORM3_RELATIONSHIP")}*`}</CardLabel>
          <div className="form-field">
            <Controller
              name="relationship"
              defaultValue={ownerDetails?.relationship}
              control={control}
              rules={{
                required: t("REQUIRED_FIELD"),
              }}
              render={({ value, onChange, onBlur }) => (
                <RadioOrSelect
                  name="relationship"
                  options={GuardianOptions}
                  selectedOption={value}
                  optionKey="i18nKey"
                  onSelect={(value) => {
                    onChange(value);
                    setOwnerDetails({ ...ownerDetails, relationship: value })
                  }}
                  t={t}
                  disabled={isUpdateProperty || isEditProperty}
                  isDropDown={window.location.href.includes("/employee") ? true : false}
                  onBlur={onBlur}
                />
              )}
            />
            {/* <RadioButtons
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
          /> */}
          </div>
        </LabelFieldPair>
        <CardLabelError style={errorStyle}>{touched?.relationship ? errors?.relationship?.message : ""}</CardLabelError>

        <LabelFieldPair>
          <CardLabel className="">{`${t("PT_SPECIAL_APPLICANT_CATEGORY")}*`}</CardLabel>
          <div className="form-field">
            <div className={"form-pt-dropdown-only"}>
              <Controller
                name="ownerType"
                defaultValue={ownerDetails?.ownerType}
                control={control}
                rules={{
                  required: t("REQUIRED_FIELD"),
                }}
                render={({ value, onChange, onBlur }) => (
                  <Dropdown
                    selected={Menu1?.length === 1 ? Menu1[0] : value}
                    disable={Menu1?.length === 1 || editScreen}
                    option={Menu1 ? Menu1.sort((a, b) => a.name.localeCompare(b.name)) : []}
                    select={(value) => {
                      onChange(value);
                      setOwnerDetails({ ...ownerDetails, ownerType: value })
                    }}
                    optionKey="i18nKey"
                    t={t}
                    onBlur={onBlur}
                  />
                )}
              />
            </div>
          </div>
        </LabelFieldPair>
        <CardLabelError style={errorStyle}>{touched?.ownerType ? errors?.ownerType?.message : ""}</CardLabelError>

        <LabelFieldPair>
          <CardLabel>{t("PT_CORRESPONDANCE_ADDRESS")}</CardLabel>
          <div className="form-field">
            <TextArea
              isMandatory={false}
              optionKey="i18nKey"
              t={t}
              disabled={isCorrespondenceAddress}
              name="address"
              onChange={(e) => {
                if (!isCorrespondenceAddress) {
                  setOwnerDetails({ ...ownerDetails, permanentAddress: e.target.value })
                }
              }}
              value={ownerDetails?.permanentAddress}
            />
          </div>
        </LabelFieldPair>

        <CheckBox
          className="form-field"
          label={`${t("PT_COMMON_SAME_AS_PROPERTY_ADDRESS")}`}
          onChange={setCorrespondenceAddress}
          value={isCorrespondenceAddress}
          checked={isCorrespondenceAddress || false}
          style={{ paddingTop: "10px" }}
        />
      </div>
    </div>
  );
};

export default PropertyOwnerDetails;
