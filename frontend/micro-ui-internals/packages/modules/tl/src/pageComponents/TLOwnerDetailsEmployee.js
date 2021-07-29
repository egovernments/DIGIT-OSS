import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardLabel, LabelFieldPair, Dropdown, TextInput, LinkButton, CardLabelError, MobileNumber } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import { getPattern } from "../utils";

const createOwnerDetails = () => ({
  name: "",
  mobileNumber: "",
  fatherOrHusbandName: "",
  emailId: "",
  permanentAddress: "",
  relationship: "",
  ownerType: "",
  gender: "",
  // correspondenceAddress: "",
  key: Date.now(),
});

const TLOwnerDetailsEmployee = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isEditScreen = pathname.includes("/modify-application/");
  const [owners, setOwners] = useState(formData?.owners || [createOwnerDetails()]);
  const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
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


  const { data: genderTypeData } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", [
    "GenderType"
  ]);

  const addNewOwner = () => {
    const newOwner = createOwnerDetails();
    setOwners((prev) => [...prev, newOwner]);
  };

  const removeOwner = (owner) => {
    setOwners((prev) => prev.filter((o) => o.key != owner.key));
  };

  useEffect(() => {
    if (formData?.ownershipCategory?.code == "INDIVIDUAL.MULTIPLEOWNERS" && owners.length > 1) clearErrors("mulipleOwnerError");
    if (formData?.ownershipCategory?.code == "INDIVIDUAL.MULTIPLEOWNERS" && owners.length == 1) setError("mulipleOwnerError", { type: "owner_missing", message: `TL_ERROR_MULTIPLE_OWNER` });
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
      if (formData?.ownershipCategory?.code == "INDIVIDUAL.MULTIPLEOWNERS") setError("mulipleOwnerError", { type: "owner_missing", message: `TL_ERROR_MULTIPLE_OWNER` });
    }
  }, [formData?.ownershipCategory?.code]);

  let isRenewal = window.location.href.includes("tl/renew-application-details");
  if (window.location.href.includes("tl/edit-application-details")) isRenewal = true;
  
  useEffect(() => {
    if (formData?.tradeUnits?.length > 0 && !isRenewal) {
      let flag = true;
      owners.map(data => {
        Object.keys(data).map(dta => {
          if(dta != "key" &&  data[dta]) flag = false;
        });
      });
      formData?.tradeUnits.map(data => {
        Object.keys(data).map(dta => {
          if (dta != "key" && data[dta] != undefined && data[data] != "" && data[data] != null) {

          } else {
            if (flag) setOwners([createOwnerDetails()]);
            flag = false;
          }
        });
      })
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
    genderTypeData
  };

  if (isEditScreen) {
    return <React.Fragment />;
  }

  return (
    <React.Fragment>
      {owners.map((owner, index) => (
        <OwnerForm  index={index} owner={owner} {...commonProps} />
      ))}
      {formData?.ownershipCategory?.code === "INDIVIDUAL.MULTIPLEOWNERS" ? (
        <div>
          <LinkButton label={t("TL_NEW_OWNER_DETAILS_ADD_OWN")} onClick={addNewOwner} style={{ color: "orange", width: "fit-content" }}/>
          <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-24px" }}>
            {t(formState.errors?.mulipleOwnerError?.message || "")}
        </CardLabelError>
        </div>
      ) : null}
    </React.Fragment>
  );
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
    setIsErrors,
    isErrors,
    isRenewal,
    previousLicenseDetails, 
    setPreviousLicenseDetails,
    genderTypeData
  } = _props;

  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger } = useForm();
  const formValue = watch();
  const { errors } = localFormState;

  const ownerTypesMenu = useMemo(
    () =>
      mdmsData?.PropertyTax?.OwnerType?.map?.((e) => ({
        i18nKey: `${e.code.replaceAll("PROPERTY", "COMMON_MASTERS").replaceAll(".", "_")}`,
        code: e.code,
      })) || [],
    [mdmsData]
  );

  const genderFilterTypeMenu = genderTypeData && genderTypeData["common-masters"]?.GenderType?.filter(e => e.active);

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
    console.log(formValue, "in formvalue chnage");
    const keys = Object.keys(formValue);
    const part = {};
    keys.forEach((key) => (part[key] = owner[key]));

    // let _ownerType = isIndividualTypeOwner ? {} : { ownerType: { code: "NONE" } };

    if (!_.isEqual(formValue, part)) {
      Object.keys(formValue).map(data => {
        if (data != "key" && formValue[data] != undefined && formValue[data] != "" && formValue[data] != null && !isErrors) {
          setIsErrors(true);
        }
      });
      setOwners((prev) => prev.map((o) => {
        return (o.key && o.key === owner.key ? { ...o, ...formValue } : { ...o })
      }));
      trigger();
    }
  }, [formValue]);

  useEffect(() => {
    if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) {
      setError(config.key, { type: errors });
    }
    else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
      clearErrors(config.key);
    }
  }, [errors]);

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };
  return (
    <React.Fragment>
      <div style={{ marginBottom: "16px" }}>
        <div style={formData?.ownershipCategory?.code === "INDIVIDUAL.MULTIPLEOWNERS" ? { border: "1px solid #E3E3E3", padding: "16px", marginTop: "8px", borderRadius: "4px" } : {}}>
          {allOwners?.length > 1 ? (
            <div onClick={() => removeOwner(owner)} style={{ marginBottom: "16px", padding: "5px", cursor: "pointer", textAlign: "right" }}>
              X
            </div>
          ) : null}
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_OWNER_S_NAME_LABEL")} * :`}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"name"}
                defaultValue={owner?.name}
                rules={{ required: "NAME_REQUIRED", validate: { pattern: (val) => (/^\w+( +\w+)*$/.test(val) ? true : t("INVALID_NAME")) } }}
                render={(props) => (
                  <TextInput
                    value={props.value}
                    autoFocus={focusIndex.index === owner?.key && focusIndex.type === "name"}
                    errorStyle={(localFormState.touched.name && errors?.name?.message) ? true : false}
                    onChange={(e) => {
                      if(e.target.value != owner?.name && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true});
                      props.onChange(e.target.value);
                      // props.onChange(e);
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
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_OWNER_S_MOBILE_NUM_LABEL")} * :`}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"mobileNumber"}
                defaultValue={owner?.mobileNumber}
                rules={{ required: "Required", validate: (v) => (/^[6789]\d{9}$/.test(v) ? true : "invalid Phone") }}
                render={(props) => (
                  <MobileNumber
                    value={props.value}
                    autoFocus={focusIndex.index === owner?.key && focusIndex.type === "mobileNumber"}
                    onChange={(e) => {
                      if(e != owner?.mobileNumber && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true});
                      props.onChange(e);
                      setFocusIndex({ index: owner.key, type: "mobileNumber" });
                    }}
                    labelStyle={{ marginTop: "unset", border: "1px solid #464646", borderRight: "none" }}
                    onBlur={props.onBlur}
                    errorStyle={(localFormState.touched.mobileNumber && errors?.mobileNumber?.message) ? true : false}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.mobileNumber ? errors?.mobileNumber?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_GUARDIAN_S_NAME_LABEL")} * :`}</CardLabel>
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
                    errorStyle={(localFormState.touched.fatherOrHusbandName && errors?.fatherOrHusbandName?.message) ? true : false}
                    onChange={(e) => {
                      if(e.target.value != owner?.fatherOrHusbandName && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true});
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
          <CardLabelError style={errorStyle}> {localFormState.touched.fatherOrHusbandName ? errors?.fatherOrHusbandName?.message : ""} </CardLabelError>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_RELATIONSHIP_WITH_GUARDIAN_LABEL")} * :`}</CardLabel>
            <Controller
              control={control}
              name={"relationship"}
              defaultValue={owner?.relationship}
              rules={{ required: "RelationShip Required" }}
              render={(props) => (
                <Dropdown
                  className="form-field"
                  selected={props.value}
                  errorStyle={(localFormState.touched.relationship && errors?.relationship?.message) ? true : false}
                  select={(e) => {
                    if (e?.code != owner?.relationship?.code && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
                    props.onChange(e)
                    }
                  }
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
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_OWNER_DETAILS_GENDER_LABEL")} * :`}</CardLabel>
            <Controller
              control={control}
              name={"gender"}
              defaultValue={owner?.gender}
              rules={{ required: "REQUIRED" }}
              render={(props) => (
                <Dropdown
                  className="form-field"
                  selected={props.value}
                  errorStyle={(localFormState.touched.gender && errors?.gender?.message) ? true : false}
                  select={(e) => {
                    if(e?.code !=  owner?.gender?.code && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true});
                    props.onChange(e)
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
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_OWNER_DETAILS_EMAIL_LABEL")} :`}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"emailId"}
                defaultValue={owner?.emailId}
                rules={{ validate: (e) => ((e && getPattern("Email").test(e)) || !e ? true : "INVALID_EMAIL") }}
                render={(props) => (
                  <TextInput
                    value={props.value}
                    autoFocus={focusIndex.index === owner?.key && focusIndex.type === "emailId"}
                    errorStyle={(localFormState.touched.emailId && errors?.emailId?.message) ? true : false}
                    onChange={(e) => {
                      if(e.target.value != owner?.emailId && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true});
                      props.onChange(e.target.value);
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
            <CardLabel className="card-label-smaller">{`${t("TL_OWNER_SPECIAL_CATEGORY")} :`}</CardLabel>
            <Controller
              control={control}
              name={"ownerType"}
              defaultValue={owner?.ownerType}
              // rules={}
              render={(props) => (
                <Dropdown
                  className="form-field"
                  selected={props.value}
                  errorStyle={(localFormState.touched.ownerType && errors?.ownerType?.message) ? true : false}
                  select={(e) => {
                    if(e?.code !=  owner?.ownerType?.code && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true});
                    props.onChange(e)
                  }}
                  onBlur={props.onBlur}
                  option={ownerTypesMenu}
                  optionKey="i18nKey"
                  t={t}
                />
              )}
            />
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.ownerType ? errors?.ownerType?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_OWNER_DETAILS_ADDR_LABEL")} * :`}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"permanentAddress"}
                defaultValue={owner?.permanentAddress}
                rules={{ required: "REQUIRED" }}
                render={(props) => (
                  <TextInput
                    value={props.value}
                    autoFocus={focusIndex.index === owner?.key && focusIndex.type === "permanentAddress"}
                    errorStyle={(localFormState.touched.permanentAddress && errors?.permanentAddress?.message) ? true : false}
                    onChange={(e) => {
                      if(e.target.value != owner?.permanentAddress && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true});
                      props.onChange(e.target.value);
                      setFocusIndex({ index: owner.key, type: "permanentAddress" });
                    }}
                    onBlur={props.onBlur}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.correspondenceAddress ? errors?.correspondenceAddress?.message : ""}</CardLabelError>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TLOwnerDetailsEmployee;
