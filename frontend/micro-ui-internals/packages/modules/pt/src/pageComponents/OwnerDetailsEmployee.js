import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardLabel, LabelFieldPair, Dropdown, TextInput, LinkButton, CardLabelError, MobileNumber } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useLocation } from "react-router-dom";

const createOwnerDetails = () => ({
  name: "",
  mobileNumber: "",
  fatherOrHusbandName: "",
  emailId: "",
  permanentAddress: "",
  relationship: "",
  ownerType: "",
  gender: "",
  isCorrespondenceAddress: false,
  key: Date.now(),
});

const PTEmployeeOwnershipDetails = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
  const { t } = useTranslation();

  const { pathname } = useLocation();
  const isEditScreen = pathname.includes("/modify-application/");

  const [owners, setOwners] = useState(formData?.owners || [createOwnerDetails()]);
  const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const { data: mdmsData, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", [
    "UsageCategory",
    "OccupancyType",
    "Floor",
    "OwnerType",
    "OwnerShipCategory",
    "Documents",
    "SubOwnerShipCategory",
    "OwnerShipCategory",
  ]);

  const { data: Menu } = Digit.Hooks.pt.usePTGenderMDMS(stateId, "common-masters", "GenderType");

  let menu = [];

  Menu &&
    Menu.map((formGender) => {
      menu.push({ i18nKey: `PT_FORM3_${formGender.code}`, code: `${formGender.code}`, value: `${formGender.code}` });
    });

  const addNewOwner = () => {
    const newOwner = createOwnerDetails();
    setOwners((prev) => [...prev, newOwner]);
  };

  const removeOwner = (owner) => {
    setOwners((prev) => prev.filter((o) => o.key != owner.key));
  };

  useEffect(() => {
    const data = owners.map((e) => {
      return e;
    });
    onSelect(config?.key, data);
  }, [owners]);

  useEffect(() => {
    setOwners([createOwnerDetails()]);
  }, [formData?.ownershipCategory?.code]);

  const commonProps = {
    focusIndex,
    allOwners: owners,
    setFocusIndex,
    removeOwner,
    formData,
    formState,
    setOwners,
    mdmsData,
    t,
    setError,
    clearErrors,
    config,
    menu,
  };

  if (isEditScreen) {
    return <React.Fragment />;
  }

  return formData?.ownershipCategory?.code ? (
    <React.Fragment>
      {owners.map((owner, index) => (
        <OwnerForm key={owner.key} index={index} owner={owner} {...commonProps} />
      ))}
      {formData?.ownershipCategory?.code === "INDIVIDUAL.MULTIPLEOWNERS" ? (
        <LinkButton label="Add Owner" onClick={addNewOwner} style={{ color: "orange" }} />
      ) : null}
    </React.Fragment>
  ) : null;
};

const OwnerForm = (_props) => {
  const {
    owner,
    index,
    focusIndex,
    allOwners,
    setFocusIndex,
    removeOwner,
    setOwners,
    t,
    mdmsData,
    formData,
    config,
    setError,
    clearErrors,
    formState,
    menu,
  } = _props;

  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger } = useForm();
  const formValue = watch();
  const { errors } = localFormState;

  const specialDocsMenu = useMemo(
    () =>
      mdmsData?.PropertyTax?.Documents?.filter((e) => e.code === "OWNER.SPECIALCATEGORYPROOF")?.[0]
        .dropdownData?.filter((e) => e.parentValue.includes(formValue?.ownerType?.code))
        .map?.((e) => ({
          i18nKey: e.code?.replaceAll(".", "_"),
          code: e.code,
        })) || [],
    [mdmsData, formValue]
  );

  const ownerTypesMenu = useMemo(
    () =>
      mdmsData?.PropertyTax?.OwnerType?.map?.((e) => ({
        i18nKey: `${e.code.replaceAll("PROPERTY", "COMMON_MASTERS").replaceAll(".", "_")}`,
        code: e.code,
      })) || [],
    [mdmsData]
  );

  const isIndividualTypeOwner = useMemo(() => formData?.ownershipCategory?.code.includes("INDIVIDUAL"), [formData?.ownershipCategory?.code]);

  const institutionTypeMenu = useMemo(() => {
    const code = formData?.ownershipCategory?.code;
    const arr = mdmsData?.PropertyTax?.OwnerShipCategory?.filter((e) => e.code != code && e.code?.includes(code));
    return arr?.map((e) => ({ ...e, i18nKey: `COMMON_MASTERS_OWNERSHIPCATEGORY_${e.code?.replaceAll(".", "_")}` }));
  }, [mdmsData, formData?.ownershipCategory]);

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    const keys = Object.keys(formValue);
    const part = {};
    keys.forEach((key) => (part[key] = owner[key]));

    let _ownerType = isIndividualTypeOwner ? {} : { ownerType: { code: "NONE" } };

    if (!_.isEqual(formValue, part)) {
      setOwners((prev) => prev.map((o) => (o.key && o.key === owner.key ? { ...o, ...formValue, ..._ownerType } : { ...o })));
      trigger();
    }
  }, [formValue]);

  useEffect(() => {
    if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) setError(config.key, { type: errors });
    else if (!Object.keys(errors).length && formState.errors[config.key]) clearErrors(config.key);
  }, [errors]);

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };
  return (
    <React.Fragment>
      <div style={{ marginBottom: "16px" }}>
        <div className="label-field-pair">
          <h2 className="card-label card-label-smaller" style={{ color: "#505A5F" }}>
            {isIndividualTypeOwner
              ? `Owner ${formData?.ownershipCategory?.code?.includes("MULTIPLE") ? index + 1 : ""}`
              : "Authorised Person Details"}
          </h2>
        </div>
        <div style={{ border: "1px solid #E3E3E3", padding: "16px", marginTop: "8px" }}>
          {allOwners?.length > 2 ? (
            <div onClick={() => removeOwner(owner)} style={{ marginBottom: "16px", padding: "5px", cursor: "pointer", textAlign: "right" }}>
              X
            </div>
          ) : null}

          {!isIndividualTypeOwner ? (
            <React.Fragment>
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{t("PT_INSTITUTION_NAME") + " *"}</CardLabel>
                <div className="field">
                  <Controller
                    control={control}
                    name={"institution.name"}
                    defaultValue={owner?.name}
                    rules={{
                      required: t("CORE_COMMON_REQUIRED_ERRMSG"),
                      validate: {
                        pattern: (v) => (/^[a-zA-Z\s]+$/.test(v) ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")),
                      },
                    }}
                    render={(props) => (
                      <TextInput
                        value={props.value}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "name"}
                        onChange={(e) => {
                          props.onChange(e.target.value);
                          setFocusIndex({ index: owner.key, type: "name" });
                        }}
                        onBlur={(e) => {
                          setFocusIndex({ index: -1 });
                          props.onBlur(e);
                        }}
                      />
                    )}
                  />
                </div>
              </LabelFieldPair>
              <CardLabelError style={errorStyle}>
                {localFormState.touched?.institution?.name ? errors?.institution?.name?.message : ""}
              </CardLabelError>
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{t("PT_INSTITUTION_TYPE") + " *"}</CardLabel>
                <Controller
                  control={control}
                  name={"institution.type"}
                  defaultValue={owner?.relationship}
                  rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
                  render={(props) => (
                    <Dropdown
                      className="form-field"
                      selected={props.value}
                      select={props.onChange}
                      onBlur={props.onBlur}
                      option={institutionTypeMenu}
                      optionKey="i18nKey"
                      t={t}
                    />
                  )}
                />
              </LabelFieldPair>
              <CardLabelError style={errorStyle}>
                {localFormState.touched?.institution?.type ? errors?.institution?.type?.message : ""}
              </CardLabelError>
            </React.Fragment>
          ) : null}

          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{t("PT_OWNER_NAME") + " *"}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"name"}
                defaultValue={owner?.name}
                rules={{
                  required: t("CORE_COMMON_REQUIRED_ERRMSG"),
                  validate: { pattern: (val) => (/^[a-zA-Z\s]*$/.test(val) ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")) },
                }}
                render={(props) => (
                  <TextInput
                    value={props.value}
                    autoFocus={focusIndex.index === owner?.key && focusIndex.type === "name"}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFocusIndex({ index: owner.key, type: "name" });
                    }}
                    onBlur={(e) => {
                      setFocusIndex({ index: -1 });
                      props.onBlur(e);
                    }}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.name ? errors?.name?.message : ""}</CardLabelError>

          {isIndividualTypeOwner ? (
            <React.Fragment>
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{t("PT_FORM3_GENDER") + " *"}</CardLabel>
                <Controller
                  control={control}
                  name={"gender"}
                  defaultValue={owner?.gender}
                  rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
                  render={(props) => (
                    <Dropdown
                      className="form-field"
                      selected={props.value}
                      select={props.onChange}
                      onBlur={props.onBlur}
                      /*option={[
                        { i18nKey: "PT_FORM3_MALE", code: "Male" },
                        { i18nKey: "PT_FORM3_FEMALE", code: "Female" },
                        { i18nKey: "PT_FORM3_TRANSGENDER", code: "Transgender" },
                        { i18nKey: "COMMON_GENDER_OTHERS", code: "OTHERS" },
                      ]}*/
                      option={menu}
                      optionKey="i18nKey"
                      t={t}
                    />
                  )}
                />
              </LabelFieldPair>
              <CardLabelError style={errorStyle}>{localFormState.touched.gender ? errors?.gender?.message : ""}</CardLabelError>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{t("PT_LANDLINE_NUMBER_FLOATING_LABEL") + (isIndividualTypeOwner ? "" : " *")}</CardLabel>
                <div className="field">
                  <Controller
                    control={control}
                    name={"altContactNumber"}
                    defaultValue={owner?.altContactNumber}
                    rules={
                      isIndividualTypeOwner
                        ? {}
                        : {
                            required: t("CORE_COMMON_REQUIRED_ERRMSG"),
                            validate: { pattern: (e) => (/^[0-9]{11}$/i.test(e) ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")) },
                          }
                    }
                    render={(props) => (
                      <MobileNumber
                        value={props.value}
                        hideSpan={true}
                        maxLength={11}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "altContactNumber"}
                        onChange={(e) => {
                          props.onChange(e);
                          setFocusIndex({ index: owner.key, type: "altContactNumber" });
                        }}
                        labelStyle={{ marginTop: "unset" }}
                        onBlur={props.onBlur}
                      />
                    )}
                  />
                </div>
              </LabelFieldPair>
              <CardLabelError style={errorStyle}>{localFormState.touched.altContactNumber ? errors?.altContactNumber?.message : ""}</CardLabelError>
            </React.Fragment>
          )}
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{t("PT_FORM3_MOBILE_NUMBER") + " *"}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"mobileNumber"}
                defaultValue={owner?.mobileNumber}
                rules={{
                  required: t("CORE_COMMON_REQUIRED_ERRMSG"),
                  validate: (v) => (/^[6789]\d{9}$/.test(v) ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")),
                }}
                render={(props) => (
                  <MobileNumber
                    value={props.value}
                    autoFocus={focusIndex.index === owner?.key && focusIndex.type === "mobileNumber"}
                    onChange={(e) => {
                      props.onChange(e);
                      setFocusIndex({ index: owner.key, type: "mobileNumber" });
                    }}
                    labelStyle={{ marginTop: "unset" }}
                    onBlur={props.onBlur}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.mobileNumber ? errors?.mobileNumber?.message : ""}</CardLabelError>
          {isIndividualTypeOwner ? (
            <React.Fragment>
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{t("PT_SEARCHPROPERTY_TABEL_GUARDIANNAME") + " *"}</CardLabel>
                <div className="field">
                  <Controller
                    control={control}
                    name={"fatherOrHusbandName"}
                    defaultValue={owner?.fatherOrHusbandName}
                    rules={{
                      required: t("CORE_COMMON_REQUIRED_ERRMSG"),
                      validate: { pattern: (val) => (/^\w+( +\w+)*$/.test(val) ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")) },
                    }}
                    render={(props) => (
                      <TextInput
                        value={props.value}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "fatherOrHusbandName"}
                        onChange={(e) => {
                          props.onChange(e.target.value);
                          setFocusIndex({ index: owner.key, type: "fatherOrHusbandName" });
                        }}
                        onBlur={props.onBlur}
                      />
                    )}
                  />
                </div>
              </LabelFieldPair>
              <CardLabelError style={errorStyle}>
                {localFormState.touched.fatherOrHusbandName ? errors?.fatherOrHusbandName?.message : ""}
              </CardLabelError>
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{t("PT_FORM3_RELATIONSHIP") + " *"}</CardLabel>
                <Controller
                  control={control}
                  name={"relationship"}
                  defaultValue={owner?.relationship}
                  rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
                  render={(props) => (
                    <Dropdown
                      className="form-field"
                      selected={props.value}
                      select={props.onChange}
                      onBlur={props.onBlur}
                      option={[
                        { i18nKey: "PT_FORM3_FATHER", code: "FATHER" },
                        { i18nKey: "PT_FORM3_HUSBAND", code: "HUSBAND" },
                      ]}
                      optionKey="i18nKey"
                      t={t}
                    />
                  )}
                />
              </LabelFieldPair>
              <CardLabelError style={errorStyle}>{localFormState.touched.relationship ? errors?.relationship?.message : ""}</CardLabelError>
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{t("PT_FORM3_SPECIAL_CATEGORY") + " *"}</CardLabel>
                <Controller
                  control={control}
                  name={"ownerType"}
                  defaultValue={owner?.ownerType}
                  rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
                  render={(props) => (
                    <Dropdown
                      className="form-field"
                      selected={props.value}
                      select={props.onChange}
                      onBlur={props.onBlur}
                      option={ownerTypesMenu}
                      optionKey="i18nKey"
                      t={t}
                    />
                  )}
                />
              </LabelFieldPair>
              <CardLabelError style={errorStyle}>{localFormState.touched.ownerType ? errors?.ownerType?.message : ""}</CardLabelError>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{t("TL_NEW_DESIG_OWNER_LABEL") + " *"}</CardLabel>
                <div className="field">
                  <Controller
                    control={control}
                    name={"designation"}
                    defaultValue={owner?.designation || ""}
                    rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
                    render={(props) => (
                      <TextInput
                        value={props.value}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "designation"}
                        onChange={(e) => {
                          props.onChange(e.target.value);
                          setFocusIndex({ index: owner.key, type: "designation" });
                        }}
                        onBlur={props.onBlur}
                      />
                    )}
                  />
                </div>
              </LabelFieldPair>
              <CardLabelError style={errorStyle}>{localFormState.touched.designation ? errors?.designation?.message : ""}</CardLabelError>
            </React.Fragment>
          )}

          {formValue.ownerType?.code && formValue.ownerType?.code !== "NONE" ? (
            <React.Fragment>
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{t("PT_OWNERSHIP_DOCUMENT_TYPE") + " *"}</CardLabel>
                <Controller
                  control={control}
                  name={"documents.documentType"}
                  defaultValue={owner?.documents?.documentType}
                  rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
                  render={(props) => (
                    <Dropdown
                      className="form-field"
                      selected={props.value}
                      select={props.onChange}
                      onBlur={props.onBlur}
                      option={specialDocsMenu}
                      optionKey="i18nKey"
                      t={t}
                    />
                  )}
                />
              </LabelFieldPair>
              <CardLabelError style={errorStyle}>
                {localFormState.touched.documents?.documentType ? errors?.documents?.documentType?.message : ""}
              </CardLabelError>
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{t("PT_OWNERSHIP_DOCUMENT_ID") + " *"}</CardLabel>
                <div className="field">
                  <Controller
                    control={control}
                    name={"documents.documentUid"}
                    defaultValue={owner?.documents?.documentUid}
                    rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
                    render={(props) => (
                      <TextInput
                        value={props.value}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "documents.documentUid"}
                        onChange={(e) => {
                          props.onChange(e);
                          setFocusIndex({ index: owner.key, type: "documents.documentUid" });
                        }}
                        labelStyle={{ marginTop: "unset" }}
                        onBlur={props.onBlur}
                      />
                    )}
                  />
                </div>
              </LabelFieldPair>
              <CardLabelError style={errorStyle}>
                {localFormState.touched.documents?.documentUid ? errors?.documents?.documentUid?.message : ""}
              </CardLabelError>{" "}
            </React.Fragment>
          ) : null}
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{t("PT_OWNERSHIP_INFO_EMAIL_ID")}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"emailId"}
                defaultValue={owner?.emailId}
                rules={{ validate: (e) => ((e && /^[^\s@]+@[^\s@]+$/.test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")) }}
                render={(props) => (
                  <TextInput
                    value={props.value}
                    autoFocus={focusIndex.index === owner?.key && focusIndex.type === "emailId"}
                    onChange={(e) => {
                      props.onChange(e);
                      setFocusIndex({ index: owner.key, type: "emailId" });
                    }}
                    labelStyle={{ marginTop: "unset" }}
                    onBlur={props.onBlur}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.emailId ? errors?.emailId?.message : ""}</CardLabelError>

          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{t("PT_OWNERSHIP_INFO_CORR_ADDR") + (isIndividualTypeOwner ? "" : " *")}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"correspondenceAddress"}
                defaultValue={owner?.correspondenceAddress}
                rules={isIndividualTypeOwner ? {} : { required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
                render={(props) => (
                  <TextInput
                    value={props.value}
                    autoFocus={focusIndex.index === owner?.key && focusIndex.type === "correspondenceAddress"}
                    onChange={(e) => {
                      props.onChange(e);
                      setFocusIndex({ index: owner.key, type: "correspondenceAddress" });
                    }}
                    onBlur={props.onBlur}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>
            {localFormState.touched.correspondenceAddress ? errors?.correspondenceAddress?.message : ""}
          </CardLabelError>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PTEmployeeOwnershipDetails;
