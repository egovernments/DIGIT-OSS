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
  CardLabelError,
  LinkButton,
  DeleteIcon,
} from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
const getAddress = (address, t) => {
  return `${address?.houseDoorNo ? `${address?.houseDoorNo}, ` : ""} ${address?.buildingColonyName ? `${address?.buildingColonyName}, ` : ""}${
    address?.landmarkName ? `${address?.landmarkName}, ` : ""
  }${t(address?.locality.i18nkey)}, ${t(address?.cityCode.i18nKey)},${t(address?.pincode) ? `${address.pincode}` : " "}`
} 

const PropertyOwnerDetails = ({ t, config, onSelect, userType, formData, formState, ownerIndex, setError, clearErrors }) => {
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");
  const mutationScreen = url.includes("/property-mutation/");
  const isMobile = window.Digit.Utils.browser.isMobile();
  let index = 0; // mutationScreen ? ownerIndex : window.location.href.charAt(window.location.href.length - 1);
  const [ownershipCategory, setOwnerCategory] = React.useState("");
  let validation = {};
  const [ownerDetails, setOwnerDetails] = React.useState([
    {
      ...(formData.owners && formData.owners[index]),
      name: (formData.owners && formData.owners[index] && formData.owners[index].name) || formData?.owners?.name || "",
      gender: (formData.owners && formData.owners[index] && formData.owners[index].gender) || formData?.owners?.gender,
      mobileNumber: (formData.owners && formData.owners[index] && formData.owners[index].mobileNumber) || formData?.owners?.mobileNumber || "",
      fatherOrHusbandName:
        (formData.owners && formData.owners[index] && formData.owners[index].fatherOrHusbandName) || formData?.owners?.fatherOrHusbandName || "",
      relationship: (formData.owners && formData.owners[index] && formData.owners[index].relationship) || formData?.owners?.relationship,
      ownershipCategory: ownershipCategory,
      ownerType: (formData.owners && formData.owners[index] && formData.owners[index]?.ownerType) || formData.owners?.ownerType,
      permanentAddress:
        (formData.owners && formData.owners[index] && formData.owners[index].permanentAddress) || formData?.owners?.permanentAddress || "",
      email: (formData.owners && formData.owners[index] && formData.owners[index].email) || formData?.owners?.emailId || "",
      isCoresAddr: false,
    },
  ]);
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

  const [isCorrespondenceAddress, setIsCorrespondenceAddress] = useState(formData?.owners?.isCorrespondenceAddress);

  function setCorrespondenceAddress(e, ind) {
    let address = "";

    if (e.target.checked === true) {
      const locationDet = mutationScreen ? formData?.searchResult?.property?.locationDet : formData?.locationDet;   
      address =  getAddress(locationDet,t);

    }

    updateState("permanentAddress", ind, address);
    updateState("isCoresAddr", ind, e.target.checked);
    // setIsCorrespondenceAddress(e.target.checked);
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

  const {
    control,
    formState: { errors, touched },
    trigger,
    watch,
    setError: setLocalError,
    clearErrors: clearLocalErrors,
    setValue,
    getValues,
  } = useForm();
  const formValue = watch();

  React.useEffect(() => {
    let hasErrors = false;
    const part = {};
    ownerDetails.map((own) => {
      Object.keys(own).forEach((key) => {
        part[key] = formValue?.[key];
      });
      if (!_.isEqual(part, own)) {
        Object.keys(own).forEach((key) => {
          if (own[key]) {
            hasErrors = false;
            clearLocalErrors(key);
          } else {
            hasErrors = true;
          }
        });
      }
    });

    if (hasErrors) {
      setError(config?.key, { type: errors });
    } else {
      clearErrors(config?.key);
    }

    trigger();
    setIsErrors(hasErrors);
    onSelect(
      config?.key,
      ownerDetails.map((own) => ({ ...own, ownershipCategory: ownershipCategory?.value }))
    );
  }, [ownerDetails]);

  React.useEffect(() => {
    if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) {
      setError(config.key, { type: errors });
    } else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
      clearErrors(config.key);
    }
  }, [errors]);
  const updateState = (filedName = "name", ind = 0, value = "") => {
    setOwnerDetails(
      ownerDetails.map((owner, i) => {
        if (i === ind) {
          owner[filedName] = value;
        }
        return { ...owner };
      })
    );
  };

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };
  const ismultiple = ownershipCategory?.code?.includes("MULTIPLEOWNERS") ? true : false;

  return (
    <div>
      <LabelFieldPair>
        <CardLabel className="">{`${t("TL_NEW_OWNER_DETAILS_OWNERSHIP_TYPE_LABEL")}*`}</CardLabel>
        <Controller
          name="ownershipCategory"
          defaultValue={ownershipCategory}
          control={control}
          rules={{
            required: t("REQUIRED_FIELD"),
          }}
          render={({ value, onChange, onBlur }) => (
            <Dropdown
              className="form-field"
              selected={value}
              option={dropdownData?.filter((dd) => dd.code?.includes("INDIVIDUAL"))}
              select={(value) => {
                onChange(value);
                setOwnerCategory(value);
              }}
              optionKey="i18nKey"
              onBlur={onBlur}
              t={t}
            />
          )}
        />
      </LabelFieldPair>
      {/* <CardLabelError style={errorStyle}>{touched?.ownershipCategory ? errors?.ownershipCategory?.message : ""}</CardLabelError> */}
      {ownerDetails?.map((owner, index) => {
        return (
          <div
            style={{
              border: "1px solid #D6D5D4",
              background: "#FAFAFA",
              borderRadius: "4px",
              boxSizing: "border-box",
              margin: "16px 0px",
              padding: "16px 8px",
            }}
          >
            {isMobile && ismultiple && ownerDetails.length > 1 && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <LinkButton
                  label={<DeleteIcon style={{ bottom: "5px" }} fill={!(ownerDetails.length == 1) ? "#494848" : "#FAFAFA"} />}
                  style={{ margin: "0px" }}
                  onClick={(e) => {
                    setOwnerDetails([...ownerDetails.filter((own, ind) => ind != index)]);
                  }}
                />
              </div>
            )}
            <LabelFieldPair>
              <CardLabel>{`${t("PT_FORM3_MOBILE_NUMBER")}*`}</CardLabel>

              <div className="form-field">
                <Controller
                  key={"mobileNumber" + index}
                  name={"mobileNumber" + index}
                  defaultValue={owner.mobileNumber}
                  control={control}
                  rules={{
                    required: t("REQUIRED_FIELD"),
                    validate: (value) => (/[6-9]{1}[0-9]{9}/i.test(value) ? true : t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")),
                  }}
                  render={({ value, onChange, onBlur }) => (
                    <MobileNumber
                      // value={owner.mobileNumber}
                      value={value}
                      name={"mobileNumber" + index}
                      onChange={(value) => {
                        onChange(value);
                        updateState("mobileNumber", index, value);
                      }}
                      disable={isUpdateProperty || isEditProperty}
                      // {...{ required: true, pattern: "[6-9]{1}[0-9]{9}", type: "tel", title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID") }}
                      labelStyle={{ border: "1px solid #000", borderRight: "none" }}
                      onBlur={onBlur}
                    />
                  )}
                />
              </div>
              {!isMobile && (
                <div style={{ display: "flex", justifyContent: "flex-end", width: "20%", alignSelf: "flex-start" }}>
                  {ismultiple && (
                    <LinkButton
                      label={<DeleteIcon style={{ bottom: "0px" }} fill={!(ownerDetails.length == 1) ? "#494848" : "#FAFAFA"} />}
                      style={{ margin: "0px" }}
                      onClick={(e) => {
                        setOwnerDetails([...ownerDetails.filter((own, ind) => ind != index)]);
                      }}
                    />
                  )}
                </div>
              )}
            </LabelFieldPair>
            <CardLabelError style={errorStyle}>{touched?.["mobileNumber" + index] ? errors?.["mobileNumber" + index]?.message : ""}</CardLabelError>

            <LabelFieldPair>
              <CardLabel>{`${t("PT_OWNER_NAME")}*`}</CardLabel>
              <div className="form-field">
                <Controller
                  key={"name" + index}
                  name={"name" + index}
                  defaultValue={owner?.name}
                  control={control}
                  rules={{
                    required: t("REQUIRED_FIELD"),
                    validate: (value) => {
                      return /^[a-zA-Z-.`' ]*$/i.test(value) ? true : t("PT_NAME_ERROR_MESSAGE");
                    },
                  }}
                  render={({ value, onChange, onBlur }) => (
                    <TextInput
                      t={t}
                      type={"text"}
                      isMandatory={false}
                      optionKey="i18nKey"
                      name={"name" + index}
                      value={value}
                      onChange={(ev) => {
                        onChange(ev.target.value);
                        updateState("name", index, ev.target.value);
                      }}
                      disable={isUpdateProperty || isEditProperty}
                      onBlur={onBlur}
                    />
                  )}
                />
              </div>
            </LabelFieldPair>
            <CardLabelError style={errorStyle}>{touched?.["name" + index] ? errors?.["name" + index]?.message : ""}</CardLabelError>

            <LabelFieldPair>
              <CardLabel>{`${t("PT_FORM3_GENDER")}*`}</CardLabel>
              <div className="form-field">
                <Controller
                  key={"gender" + index}
                  name={"gender" + index}
                  defaultValue={owner?.gender}
                  control={control}
                  rules={{
                    required: t("REQUIRED_FIELD"),
                  }}
                  render={({ value, onChange, onBlur }) => (
                    <RadioOrSelect
                      name={"gender" + index}
                      options={menu}
                      selectedOption={value}
                      optionKey="code"
                      onSelect={(value) => {
                        onChange(value);
                        updateState("gender", index, value);
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
            <CardLabelError style={errorStyle}>{touched?.["gender" + index] ? errors?.["gender" + index]?.message : ""}</CardLabelError>

            <LabelFieldPair>
              <CardLabel>{`${t("PT_FORM3_GUARDIAN_NAME")}*`}</CardLabel>
              <div className="form-field">
                <Controller
                  key={"fatherOrHusbandName" + index}
                  name={"fatherOrHusbandName" + index}
                  defaultValue={owner?.fatherOrHusbandName}
                  control={control}
                  rules={{
                    required: t("REQUIRED_FIELD"),
                    validate: (value) => (/^[a-zA-Z-.`' ]*$/i.test(value) ? true : t("PT_NAME_ERROR_MESSAGE")),
                  }}
                  render={({ value, onChange, onBlur }) => (
                    <TextInput
                      t={t}
                      type={"text"}
                      isMandatory={false}
                      optionKey="i18nKey"
                      name={"fatherOrHusbandName" + index}
                      value={value}
                      onChange={(ev) => {
                        onChange(ev.target.value);
                        updateState("fatherOrHusbandName", index, ev.target.value);
                      }}
                      disable={isUpdateProperty || isEditProperty}
                      onBlur={onBlur}
                    />
                  )}
                />
              </div>
            </LabelFieldPair>
            <CardLabelError style={errorStyle}>
              {touched?.["fatherOrHusbandName" + index] ? errors?.["fatherOrHusbandName" + index]?.message : ""}
            </CardLabelError>

            <LabelFieldPair>
              <CardLabel>{`${t("PT_FORM3_RELATIONSHIP")}*`}</CardLabel>
              <div className="form-field">
                <Controller
                  key={"relationship" + index}
                  name={"relationship" + index}
                  defaultValue={owner?.relationship}
                  control={control}
                  rules={{
                    required: t("REQUIRED_FIELD"),
                  }}
                  render={({ value, onChange, onBlur }) => (
                    <RadioOrSelect
                      name={"relationship" + index}
                      options={GuardianOptions}
                      selectedOption={value}
                      optionKey="i18nKey"
                      onSelect={(value) => {
                        onChange(value);
                        updateState("relationship", index, value);
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
            <CardLabelError style={errorStyle}>{touched?.["relationship" + index] ? errors?.["relationship" + index]?.message : ""}</CardLabelError>

            <LabelFieldPair>
              <CardLabel className="">{`${t("PT_SPECIAL_APPLICANT_CATEGORY")}*`}</CardLabel>
              <div className="form-field">
                <div className={"form-pt-dropdown-only"}>
                  <Controller
                    key={"ownerType" + index}
                    name={"ownerType" + index}
                    defaultValue={owner?.ownerType}
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

                          updateState("ownerType", index, value);
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
            <CardLabelError style={errorStyle}>{touched?.["ownerType" + index] ? errors?.["ownerType" + index]?.message : ""}</CardLabelError>

            <LabelFieldPair>
              <CardLabel>{t("PT_CORRESPONDANCE_ADDRESS")}</CardLabel>
              <div className="form-field">
                <TextArea
                  isMandatory={false}
                  optionKey="i18nKey"
                  t={t}
                  disabled={ownerDetails?.[index]?.isCoresAddr === true}
                  name={"address" + index}
                  onChange={(e) => {
                    if (!(ownerDetails?.[index]?.isCoresAddr === true)) {
                      updateState("permanentAddress", index, e.target.value);
                    }
                  }}
                  value={ownerDetails?.[index]?.permanentAddress}
                />
              </div>
            </LabelFieldPair>

            <CheckBox
              className="form-field"
              label={`${t("PT_COMMON_SAME_AS_PROPERTY_ADDRESS")}`}
              onChange={(e) => setCorrespondenceAddress(e, index)}
              value={ownerDetails?.[index]?.isCoresAddr}
              checked={ownerDetails?.[index]?.isCoresAddr || false}
              style={window.location.href.includes("/citizen/")?{ paddingTop: "10px" }:{}}
            />
          </div>
        );
      })}
      {ismultiple ? (
        <div>
          <div style={{ display: "flex", paddingBottom: "15px", color: "#FF8C00" }}>
            <button
              type="button"
              style={{ paddingTop: "10px" }}
              onClick={() =>
                setOwnerDetails((prev) => [
                  ...prev,
                  {
                    name: "",
                    gender: "",
                    mobileNumber: "",
                    fatherOrHusbandName: "",
                    relationship: "",
                    ownershipCategory: ownershipCategory,
                    ownerType: "",
                    permanentAddress: "",
                    email: "",
                    isCoresAddr: false,
                  },
                ])
              }
            >
              {t("PT_COMMON_ADD_APPLICANT_LABEL")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PropertyOwnerDetails;
