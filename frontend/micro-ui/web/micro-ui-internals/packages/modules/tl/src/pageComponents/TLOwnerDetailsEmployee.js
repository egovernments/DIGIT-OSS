import {
  CardHeader,
  CardLabel,
  CardLabelError,
  Dropdown,
  FormStep,
  LabelFieldPair,
  LinkButton,
  MobileNumber,
  CardSectionHeader,
  TextInput,
} from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const createOwnerDetails = () => ({
  name: "",
  designation: "",
  mobileNumber: "",
  altContactNumber: "",
  instituionName: "",
  fatherOrHusbandName: "",
  relationship: "",
  emailId: "",  
  permanentAddress: "",
  ownerType: "",
  gender: "",
  subOwnerShipCategory:"",
  correspondenceAddress: "",
  key: Date.now(),
});

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
    setIsErrors,
    isErrors,
    isRenewal,
    previousLicenseDetails,
    setPreviousLicenseDetails,
    genderTypeData,
  } = _props;

  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger } = useForm();
  const formValue = watch();
  const { errors } = localFormState;
  const stateId = Digit.ULBService.getStateId();
  const [part, setPart] = useState({});
  const { ownershipCategory: { code: keyToSearchOwnershipSubtype } = {} } = formData;
  const { data: institutionOwnershipTypeOptions } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "TradeOwnershipSubType", {
    keyToSearchOwnershipSubtype : keyToSearchOwnershipSubtype ? keyToSearchOwnershipSubtype.split(".")[0]:undefined,
  });

  const typeOfOwner = useMemo(() => {
    if (formData?.ownershipCategory?.code.includes("SINGLEOWNER")) return "SINGLEOWNER";
    if (formData?.ownershipCategory?.code.includes("INSTITUTIONAL")) return "INSTITUTIONAL";
    else return "MULTIOWNER";
  }, [formData?.ownershipCategory]);

  const ownerTypesMenu = useMemo(
    () =>
      mdmsData?.PropertyTax?.OwnerType?.map?.((e) => ({
        i18nKey: `${e.code.replaceAll("PROPERTY", "COMMON_MASTERS").replaceAll(".", "_")}`,
        code: e.code,
        name:e.name
      })) || [],
    [mdmsData]
  );

  const genderFilterTypeMenu = genderTypeData && genderTypeData["common-masters"]?.GenderType?.filter((e) => e.active);

  const genderTypeMenu = useMemo(
    () =>
      genderFilterTypeMenu?.map?.((e) => ({
        i18nKey: `TL_GENDER_${e.code}`,
        code: e.code,
      })) || [],
    [genderFilterTypeMenu]
  );

  const isIndividualTypeOwner = useMemo(() => formData?.ownershipCategory?.code.includes("INDIVIDUAL"), [formData?.ownershipCategory?.code]);

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    if (!_.isEqual(formValue, part)) {
      setPart({...formValue});

      Object.keys(formValue).map((data) => {
        if (data != "key" && formValue[data] != undefined && formValue[data] != "" && formValue[data] != null && !isErrors) {
          setIsErrors(true);
        }
      });
      setOwners((prev) =>
        prev.map((o) => {
          return o.key && o.key === owner.key ? { ...o, ...formValue } : { ...o };
        })
      );
      trigger();
    }
  }, [formValue]);

  useEffect(() => {
    if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) {
      setError(config.key, { type: errors });
    } else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
      clearErrors(config.key);
    }
  }, [errors]);

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };
  let isMulitpleOwners = false;
  if (formData?.ownershipCategory?.code === "INDIVIDUAL.MULTIPLEOWNERS") isMulitpleOwners = true;

  return (
    <React.Fragment>
      {/* <FormStep config={config} onSelect={goNext} onSkip={onSkip} t={t} isDisabled={false} forcedError={t(errors)}> */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={
              typeOfOwner === "MULTIOWNER"
                ? { border: "1px solid #D6D5D4", padding: "16px", marginTop: "8px", borderRadius: "4px", background: "#FAFAFA" }
                : {}
            }
          >
            {allOwners?.length > 1 ? (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div onClick={() => removeOwner(owner)} style={{ padding: "5px", cursor: "pointer", textAlign: "right" }}>
                  <span>
                    <svg
                      style={{ float: "right", position: "relative", bottom: "5px" }}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill="#494848" />
                    </svg>
                  </span>
                </div>
              </div>
            ) : null}
            {typeOfOwner === "INSTITUTIONAL" && (
              <React.Fragment>
                <LabelFieldPair>
                  <CardLabel>{`${t("TL_INSTITUTION_NAME_LABEL")}*`}</CardLabel>
                  <div className="field">
                    <Controller
                      control={control}
                      name="instituionName"
                      defaultValue={owner?.instituionName}
                      rules={{ required: t("REQUIRED_FIELD"), validate: { pattern: (val) => (/^[a-zA-Z-.`' ]*$/.test(val) ? true : t("TL_NAME_ERROR_MESSAGE")) } }}
                      render={(props)=>(
                        <TextInput
                          t={t}
                          type={"text"}
                          isMandatory={true}
                          value={props.value}
                          autoFocus={focusIndex.index === owner?.key && focusIndex.type === "instituionName"}
                          errorStyle={localFormState.touched.instituionName && errors?.instituionName?.message ? true : false}
                          onChange={(e)=>{
                            if (e != owner?.instituionName && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
                            props.onChange(e);
                            setFocusIndex({ index: owner.key, type: "instituionName" });
                          }}
                          onBlur={props.onBlur} 
                        />
                      )}
                    ></Controller>
                  </div>
                </LabelFieldPair>
                <CardLabelError style={errorStyle}> {localFormState.touched.instituionName ? errors?.instituionName?.message : ""}</CardLabelError>
                <LabelFieldPair>
                  <CardLabel>{`${t("TL_INSTITUTION_TYPE_LABEL")}*`}</CardLabel>
                  <div className="field">
                    <Controller
                      control={control}
                      name={"subOwnerShipCategory"}
                      defaultValue={window.location.href.includes("tl/edit-application-details") || window.location.href.includes("tl/renew-application-details/") ? owner?.subOwnerShipCategory:""}
                      render={(props)=>(
                        <Dropdown
                          t={t}
                          option={institutionOwnershipTypeOptions}
                          errorStyle={localFormState.touched.subOwnerShipCategory && errors?.subOwnerShipCategory?.message ? true : false}
                          autoFocus={focusIndex.index === owner?.key && focusIndex.type === "subOwnerShipCategory"}
                          selected={props.value}
                          select={(e) => {
                            if (e?.code != owner?.subOwnerShipCategory?.code && isRenewal)
                              setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
                            props.onChange(e);
                            setFocusIndex({ index: owner.key, type: "subOwnerShipCategory" });
                          }}
                          onBlur={props.onBlur}
                          optionKey="i18nKey"
                        />
                      )}
                    ></Controller>
                  </div>
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>{localFormState.touched.subOwnerShipCategory ? errors?.subOwnerShipCategory?.message : ""}</CardLabelError>
                <CardSectionHeader>{t("TL_AUTHORIZED_PERSON_DETAILS")}</CardSectionHeader>
                <LabelFieldPair>
                  <CardLabel>{`${t("TL_NEW_OWNER_DETAILS_NAME_LABEL")}*`}</CardLabel>
                  <div className="field">
                    <Controller
                      control={control}
                      defaultValue={owner?.name}
                      name={"name"}
                      rules={{ required: t("REQUIRED_FIELD"), validate: { pattern: (val) => (/^[a-zA-Z-.`' ]*$/.test(val) ? true : t("TL_NAME_ERROR_MESSAGE")) } }}
                      render={(props)=>(
                        <TextInput
                          t={t}
                          type={"text"}
                          isMandatory={false}
                          name="name"
                          value={props.value}
                          errorStyle={localFormState.touched.name && errors?.name?.message ? true : false}
                          autoFocus={focusIndex.index === owner?.key && focusIndex.type === "name"}
                          onChange={(e)=>{
                            if (e != owner?.name && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
                            props.onChange(e);
                            setFocusIndex({ index: owner.key, type: "name" });
                          }}
                          onBlur={props.onBlur}
                        />
                      )}
                    ></Controller>
                  </div>
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>{localFormState.touched.name ? errors?.name?.message : ""}</CardLabelError>
                <LabelFieldPair>
                  <CardLabel>{`${t("TL_NEW_OWNER_DESIG_LABEL")}`}</CardLabel>
                  <div className="field">
                    <Controller
                      control={control}
                      name={"designation"}
                      defaultValue={owner?.designation}
                      rules={{ /* required: t("REQUIRED_FIELD"), */ validate: { pattern: (val) => (/^[a-zA-Z-.`' ]*$/.test(val) ? true : t("TL_NAME_ERROR_MESSAGE")) } }}
                      render={(props)=>(
                        <TextInput
                          t={t}
                          type={"text"}
                          isMandatory={false}
                          name="designation"
                          value={props.value}
                          errorStyle={localFormState.touched.designation && errors?.designation?.message ? true : false}
                          autoFocus={focusIndex.index === owner?.key && focusIndex.type === "designation"}
                          onChange={(e)=>{
                            if (e != owner?.designation && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
                            props.onChange(e);
                            setFocusIndex({ index: owner.key, type: "designation" });
                          }}
                          onBlur={props.onBlur}
                        />
                      )}
                    ></Controller>
                  </div>
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>{localFormState.touched.designation ? errors?.designation?.message : ""}</CardLabelError>
                <LabelFieldPair>
                  <CardLabel>{`${t("TL_MOBILE_NUMBER_LABEL")}*`}</CardLabel>
                  <div className="field">
                    <Controller
                     control={control}
                     name={"mobileNumber"}
                     defaultValue={owner?.mobileNumber}
                     rules={{ required: t("REQUIRED_FIELD"), validate: { pattern: (val) => (/^([6-9]{1}[0-9]{9})$/.test(val) ? true : t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")) } }}
                     render={(props)=>(
                      <MobileNumber
                        type={""}
                        t={t}
                        isMandatory={false}
                        name="mobileNumber"
                        value={props.value}
                        errorStyle={localFormState.touched.mobileNumber && errors?.mobileNumber?.message ? true : false}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "mobileNumber"}
                        onChange={(e)=>{
                          if (e != owner?.mobileNumber && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
                          props.onChange(e);
                          setFocusIndex({ index: owner.key, type: "mobileNumber" });
                        }}
                        onBlur={props.onBlur}
                      />
                     )}
                    ></Controller>
                  </div>
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>{localFormState.touched.mobileNumber ? errors?.mobileNumber?.message : ""}</CardLabelError>
                <LabelFieldPair>
                  <CardLabel>{`${t("TL_TELEPHONE_NUMBER_LABEL")}`}</CardLabel>
                  <div className="field">
                    <Controller
                     control={control}
                     name={"altContactNumber"}
                     defaultValue={owner?.altContactNumber}
                     rules={{ /* required: t("REQUIRED_FIELD"), */ validate: { pattern: (val) => (/^$|^[0][1-9][0-9]{9}$|^[1-9][0-9]{9}$/.test(val) ? false : t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")) } }}
                     render={(props)=>(
                      <MobileNumber
                        type={"text"}
                        t={t}
                        isMandatory={false}
                        maxLength={11}
                        name="altContactNumber"
                        value={owner.altContactNumber}
                        errorStyle={localFormState.touched.altContactNumber && errors?.altContactNumber?.message ? true : false}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "altContactNumber"}
                        onChange={(e)=>{
                          if (e != owner?.altContactNumber && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
                          props.onChange(e);
                          setFocusIndex({ index: owner.key, type: "altContactNumber" });
                        }}
                        onBlur={props.onBlur}
                      />
                     )}></Controller>
                  </div>
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>{localFormState.touched.altContactNumber ? errors?.altContactNumber?.message : ""}</CardLabelError>
                <LabelFieldPair>
                  <CardLabel>{`${t("NOC_APPLICANT_EMAIL_LABEL")}`}</CardLabel>
                  <div className="field">
                    <Controller
                     control={control}
                     defaultValue={owner?.emailId}
                     name={"emailId"}
                     rules={{ /* required: t("REQUIRED_FIELD"),*/ validate: { pattern: (val) => (/^$|^(?=^.{1,64}$)((([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/.test(val) ? true : t("TL_EMAIL_ERROR_MESSAGE")) }  }}
                     render={(props)=>(
                      <TextInput
                        t={t}
                        type={"text"}
                        isMandatory={false}
                        name={"emailId"}
                        value={props.value}
                        errorStyle={localFormState.touched.emailId && errors?.emailId?.message ? true : false}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "emailId"}
                        onChange={(e)=>{
                          if (e != owner?.emailId && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
                          props.onChange(e);
                          setFocusIndex({ index: owner.key, type: "emailId" });
                        }}
                        onBlur={props.onBlur}
                      />
                     )}
                    ></Controller>
                  </div>
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>{localFormState.touched.emailId ? errors?.emailId?.message : ""}</CardLabelError>
              </React.Fragment>
            )}
            {typeOfOwner !== "INSTITUTIONAL" && (
              <React.Fragment>
                <LabelFieldPair>
                  <CardLabel className="card-label-smaller">{`${ t("TL_OWNER_S_NAME_LABEL")} * `}</CardLabel>
                  <div className="field">
                    <Controller
                      control={control}
                      name={"name"}
                      defaultValue={owner?.name}
                      rules={{ required: t("REQUIRED_FIELD"), validate: { pattern: (val) => (/^\w+( +\w+)*$/.test(val) ? true : t("INVALID_NAME")) } }}
                      render={(props) => (
                        <TextInput
                          value={props.value}
                          autoFocus={focusIndex.index === owner?.key && focusIndex.type === "name"}
                          errorStyle={localFormState.touched.name && errors?.name?.message ? true : false}
                          onChange={(e) => {
                            if (e.target.value != owner?.name && isRenewal)
                              setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
                            props.onChange(e.target.value);
                            // props.onChange(e);
                            setFocusIndex({ index: owner.key, type: "name" });
                          }}
                          onBlur={(e) => {
                            setFocusIndex({ index: -1 });
                            props.onBlur(e);
                          }}
                          style={isMulitpleOwners ? { background: "#FAFAFA" } : ""}
                        />
                      )}
                    />
                  </div>
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>{localFormState.touched.name ? errors?.name?.message : ""}</CardLabelError>
                {/* <LabelFieldPair>
                  <CardLabel>{`${t("TL_NEW_OWNER_DETAILS_NAME_LABEL")}`}</CardLabel>
                </LabelFieldPair> */}
                <LabelFieldPair>
                  <CardLabel className="card-label-smaller">{`${t("TL_OWNER_S_MOBILE_NUM_LABEL")} * `}</CardLabel>
                  <div className="field">
                    <Controller
                      control={control}
                      name={"mobileNumber"}
                      defaultValue={owner?.mobileNumber}
                      rules={{ required: t("REQUIRED_FIELD"), validate: (v) => (/^[6789]\d{9}$/.test(v) ? true : t("INVALID_NUMBER")) }}
                      render={(props) => (
                        <MobileNumber
                          value={props.value}
                          autoFocus={focusIndex.index === owner?.key && focusIndex.type === "mobileNumber"}
                          onChange={(e) => {
                            if (e != owner?.mobileNumber && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
                            props.onChange(e);
                            setFocusIndex({ index: owner.key, type: "mobileNumber" });
                          }}
                          labelStyle={{ marginTop: "unset", border: "1px solid #464646", borderRight: "none" }}
                          onBlur={props.onBlur}
                          errorStyle={localFormState.touched.mobileNumber && errors?.mobileNumber?.message ? true : false}
                          style={isMulitpleOwners ? { background: "#FAFAFA" } : ""}
                        />
                      )}
                    />
                  </div>
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>{localFormState.touched.mobileNumber ? errors?.mobileNumber?.message : ""}</CardLabelError>
                <LabelFieldPair>
                  <CardLabel className="card-label-smaller">{`${t("TL_GUARDIAN_S_NAME_LABEL")} * `}</CardLabel>
                  <div className="field">
                    <Controller
                      control={control}
                      name={"fatherOrHusbandName"}
                      defaultValue={owner?.fatherOrHusbandName}
                      rules={{ required: "NAME_REQUIRED", validate: { pattern: (val) => (/^\w+( +\w+)*$/.test(val) ? true : t("INVALID_NAME")) } }}
                      render={(props) => (
                        <TextInput
                          value={props.value}
                          autoFocus={focusIndex.index === owner?.key && focusIndex.type === "fatherOrHusbandName"}
                          errorStyle={localFormState.touched.fatherOrHusbandName && errors?.fatherOrHusbandName?.message ? true : false}
                          onChange={(e) => {
                            if (e.target.value != owner?.fatherOrHusbandName && isRenewal)
                              setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
                            props.onChange(e.target.value);
                            // props.onChange(e);
                            setFocusIndex({ index: owner.key, type: "fatherOrHusbandName" });
                          }}
                          onBlur={props.onBlur}
                        />
                      )}
                    />
                  </div>
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>
                  {localFormState.touched.fatherOrHusbandName ? errors?.fatherOrHusbandName?.message : ""}{" "}
                </CardLabelError>
                <LabelFieldPair>
                  <CardLabel className="card-label-smaller">{`${t("TL_RELATIONSHIP_WITH_GUARDIAN_LABEL")} * `}</CardLabel>
                  <Controller
                    control={control}
                    name={"relationship"}
                    defaultValue={owner?.relationship}
                    rules={{ required: "RelationShip Required" }}
                    render={(props) => (
                      <Dropdown
                        className="form-field"
                        selected={props.value}
                        errorStyle={localFormState.touched.relationship && errors?.relationship?.message ? true : false}
                        select={(e) => {
                          if (e?.code != owner?.relationship?.code && isRenewal)
                            setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
                          props.onChange(e);
                        }}
                        onBlur={props.onBlur}
                        option={[
                          { i18nKey: "COMMON_RELATION_FATHER", code: "FATHER" },
                          { i18nKey: "COMMON_RELATION_HUSBAND", code: "HUSBAND" },
                        ]}
                        optionKey="i18nKey"
                        t={t}
                      />
                    )}
                  />
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>{localFormState.touched.relationship ? errors?.relationship?.message : ""}</CardLabelError>
                <LabelFieldPair>
                  <CardLabel className="card-label-smaller">{`${t("TL_NEW_OWNER_DETAILS_GENDER_LABEL")} * `}</CardLabel>
                  <Controller
                    control={control}
                    name={"gender"}
                    defaultValue={owner?.gender}
                    rules={{ required: t("REQUIRED_FIELD") }}
                    render={(props) => (
                      <Dropdown
                        className="form-field"
                        selected={props.value}
                        errorStyle={localFormState.touched.gender && errors?.gender?.message ? true : false}
                        select={(e) => {
                          if (e?.code != owner?.gender?.code && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
                          props.onChange(e);
                        }}
                        onBlur={props.onBlur}
                        option={genderTypeMenu}
                        optionKey="i18nKey"
                        t={t}
                      />
                    )}
                  />
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>{localFormState.touched.gender ? errors?.gender?.message : ""}</CardLabelError>
                <LabelFieldPair>
                  <CardLabel className="card-label-smaller">{`${t("TL_NEW_OWNER_DETAILS_EMAIL_LABEL")} `}</CardLabel>
                  <div className="field">
                    <Controller
                      control={control}
                      name={"emailId"}
                      defaultValue={owner?.emailId}
                      // rules={{ validate: (e) => ((e && getPattern("Email").test(e)) || !e ? true : t("INVALID_EMAIL")) }}
                      render={(props) => (
                        <TextInput
                          value={props.value}
                          autoFocus={focusIndex.index === owner?.key && focusIndex.type === "emailId"}
                          errorStyle={localFormState.touched.emailId && errors?.emailId?.message ? true : false}
                          onChange={(e) => {
                            if (e.target.value != owner?.emailId && isRenewal)
                              setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
                            props.onChange(e.target.value);
                            setFocusIndex({ index: owner.key, type: "emailId" });
                          }}
                          labelStyle={{ marginTop: "unset" }}
                          onBlur={props.onBlur}
                          style={isMulitpleOwners ? { background: "#FAFAFA" } : ""}
                        />
                      )}
                    />
                  </div>
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>{localFormState.touched.emailId ? errors?.emailId?.message : ""}</CardLabelError>
                <LabelFieldPair>
                  <CardLabel className="card-label-smaller">{`${t("TL_OWNER_SPECIAL_CATEGORY")} `}</CardLabel>
                  <Controller
                    control={control}
                    name={"ownerType"}
                    defaultValue={owner?.ownerType}
                    // rules={}
                    render={(props) => (
                      <Dropdown
                        className="form-field"
                        selected={props.value}
                        errorStyle={localFormState.touched.ownerType && errors?.ownerType?.message ? true : false}
                        select={(e) => {
                          if (e?.code != owner?.ownerType?.code && isRenewal)
                            setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
                          props.onChange(e);
                        }}
                        onBlur={props.onBlur}
                        option={ownerTypesMenu ? ownerTypesMenu.sort((a, b) => a.name.localeCompare(b.name)) : []}

                        optionKey="i18nKey"
                        t={t}
                      />
                    )}
                  />
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>{localFormState.touched.ownerType ? errors?.ownerType?.message : ""}</CardLabelError>
                <LabelFieldPair>
                  <CardLabel className="card-label-smaller">{`${t("TL_NEW_OWNER_DETAILS_ADDR_LABEL")} `}</CardLabel>
                  <div className="field">
                    <Controller
                      control={control}
                      name={"permanentAddress"}
                      defaultValue={owner?.permanentAddress}
                      render={(props) => (
                        <TextInput
                          value={props.value}
                          autoFocus={focusIndex.index === owner?.key && focusIndex.type === "permanentAddress"}
                          errorStyle={localFormState.touched.permanentAddress && errors?.permanentAddress?.message ? true : false}
                          onChange={(e) => {
                            if (e.target.value != owner?.permanentAddress && isRenewal)
                              setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
                            props.onChange(e.target.value);
                            setFocusIndex({ index: owner.key, type: "permanentAddress" });
                          }}
                          onBlur={props.onBlur}
                          style={isMulitpleOwners ? { background: "#FAFAFA" } : ""}
                        />
                      )}
                    />
                  </div>
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>{localFormState.touched.permanentAddress ? errors?.permanentAddress?.message : ""}</CardLabelError>
              </React.Fragment>
            )}
            </div>
        </div>
      {/* </FormStep> */}
    </React.Fragment>
  );
};

const TLOwnerDetailsEmployee = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isEditScreen = pathname.includes("/modify-application/");
  const [owners, setOwners] = useState(formData?.owners || [createOwnerDetails()]);
  const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [isErrors, setIsErrors] = useState(false);
  const [previousLicenseDetails, setPreviousLicenseDetails] = useState(formData?.tradedetils1 || []);

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

  const { data: genderTypeData } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", ["GenderType"]);

  const addNewOwner = () => {
    const newOwner = createOwnerDetails();
    setOwners((prev) => [...prev, newOwner]);
  };

  const removeOwner = (owner) => {
    setOwners((prev) => prev.filter((o) => o.key != owner.key));
  };

  useEffect(() => {
    if(formData?.ownershipCategory?.code.includes("INSTITUTIONAL") && owners.length == 1 && formData?.tradedetils1 && !owners?.[0]?.subOwnerShipCategory)
    {
      setOwners([{...owners[0],subOwnerShipCategory:formData?.ownershipCategory}])
    }
  },[owners])

  useEffect(() => {
    if (formData?.ownershipCategory?.code == "INDIVIDUAL.MULTIPLEOWNERS" && owners.length > 1) clearErrors("mulipleOwnerError");
    if (formData?.ownershipCategory?.code == "INDIVIDUAL.MULTIPLEOWNERS" && owners.length == 1)
      setError("mulipleOwnerError", { type: "owner_missing", message: `TL_ERROR_MULTIPLE_OWNER` });
    const data = owners.map((e) => {
      return e;
    });
    onSelect(config?.key, data);
  }, [owners]);

  useEffect(() => {
    onSelect("tradedetils1", previousLicenseDetails);
  }, [previousLicenseDetails]);

  useEffect(() => {
    if (window.location.href.includes("tl/new-application")) {
      setOwners([createOwnerDetails()]);
      if (formData?.ownershipCategory?.code == "INDIVIDUAL.MULTIPLEOWNERS")
        setError("mulipleOwnerError", { type: "owner_missing", message: `TL_ERROR_MULTIPLE_OWNER` });
    }
  }, [formData?.ownershipCategory?.code]);

  let isRenewal = window.location.href.includes("tl/renew-application-details");
  if (window.location.href.includes("tl/edit-application-details")) isRenewal = true;

  useEffect(() => {
    if (formData?.tradeUnits?.length > 0 && !isRenewal) {
      let flag = true;
      owners.map((data) => {
        Object.keys(data).map((dta) => {
          if (dta != "key" && data[dta]) flag = false;
        });
      });
      formData?.tradeUnits.map((data) => {
        Object.keys(data).map((dta) => {
          if (dta != "key" && data[dta] != undefined && data[data] != "" && data[data] != null) {
          } else {
            if (flag) setOwners([createOwnerDetails()]);
            flag = false;
          }
        });
      });
    }
  }, [formData?.tradeUnits?.[0]?.tradeCategory?.code]);

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
    setIsErrors,
    isErrors,
    isRenewal,
    previousLicenseDetails,
    setPreviousLicenseDetails,
    genderTypeData,
  };

  if (isEditScreen) {
    return <React.Fragment />;
  }

  return (
    <React.Fragment>
      {owners.map((owner, index) => (
        <OwnerForm key={owner.key} index={index} owner={owner} {...commonProps} />
      ))}
      {formData?.ownershipCategory?.code === "INDIVIDUAL.MULTIPLEOWNERS" ? (
        <div>
          <LinkButton label={t("TL_NEW_OWNER_DETAILS_ADD_OWN")} onClick={addNewOwner} style={{ color: "#F47738", width: "fit-content" }} />
          <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-24px" }}>
            {t(formState.errors?.mulipleOwnerError?.message || "")}
          </CardLabelError>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default TLOwnerDetailsEmployee;
