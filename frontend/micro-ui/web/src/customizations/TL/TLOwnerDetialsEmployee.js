import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardLabel, LabelFieldPair, Dropdown, TextInput, LinkButton, CardLabelError, MobileNumber } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import { getPattern } from "../utils";

import TLInOwnerDetailsEmployee from "./TLInOwnerDetailsEmployee";
import TLInstOwnerDetailsEmployee from "./TLInstOwnerDetailsEmployee";

const TLOwnerDetialsEmployee = ({ config, onSelect, userType, formData, setError, formState, clearErrors}) => {
  //console.log(formData?.ownershipCategory, ">>>>>>>");
let ownerTYpe = formData?.ownershipCategory?.code?.includes("INDIVIDUAL")? formData?.ownershipCategory?.code?.includes("INDIVIDUAL"):"";
  return (
    <React.Fragment>
      {ownerTYpe ? (
        <TLInOwnerDetailsEmployee
          {...{ config, onSelect, userType, formData, setError, formState, clearErrors }}
        />
      ) : (
        <TLInstOwnerDetailsEmployee
          {...{ config, onSelect, userType, formData, setError, formState, clearErrors }}
        />
      )}
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
/*   const relationTypeMenu = useMemo(
    () =>
      mdmsData?.PropertyTax?.relationType?.map?.((e) => ({
        i18nKey: `${e.code.replaceAll("PROPERTY", "COMMON_MASTERS").replaceAll(".", "_")}`,
        code: e.code,
      })) || [],
    [mdmsData]
  );
 */

  const relationTypeMenu = [
    { i18nKey: "TL_PROPRIETOR", code: "PROPRIETOR" },
    { i18nKey: "TL_PARTNER", code: "PARTNER" },
    { i18nKey: "TL_DIRECTOR", code: "DIRECTOR" },
    { i18nKey: "TL_AUTHORIZEDSIGNATORY", code: "AUTHORIZEDSIGNATORY" },
  ];  
  const genderFilterTypeMenu = genderTypeData && genderTypeData["common-masters"]?.GenderType?.filter(e => e.active);

  const genderTypeMenu = useMemo(
    () =>
      genderFilterTypeMenu?.map?.((e) => ({
        i18nKey: `TL_GENDER_${e.code}`,
        code: e.code,
      })) || [],
    [genderFilterTypeMenu]
  );

  const isIndividualTypeOwner = useMemo(() => formData?.ownershipCategory?.code?.includes("INDIVIDUAL"), [formData?.ownershipCategory?.code]);

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
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
  let isMulitpleOwners = false;
  const tradedetils1 = formData?.tradedetils1;
  //console.log("prasad tradedetils1", tradedetils1)
  if (formData?.ownershipCategory?.code === "INDIVIDUAL.MULTIPLEOWNERS") isMulitpleOwners = true;
  return (
    <React.Fragment>

    </React.Fragment>
  );
};



export default TLOwnerDetialsEmployee;
