import {
  CardLabel,
  CardLabelError,
  CheckBox,
  Dropdown,
  LabelFieldPair,
  TextInput,
  WrapUnMaskComponent,
} from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import * as func from "../utils";
import { getPattern, stringReplaceAll } from "../utils";

const createConnectionHolderDetails = () => ({
  sameAsOwnerDetails: true,
  name: "",
  gender: "",
  mobileNumber: "",
  guardian: "",
  relationship: "",
  address: "",
  ownerType: "",
  documentId: "",
  documentType: "",
  file: "",
});

const WSConnectionHolderDetails = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const filters = func.getQueryStringParams(location.search);
  const [connectionHolderDetails, setConnectionHolderDetails] = useState(
    formData?.ConnectionHolderDetails ? [{ ...formData?.ConnectionHolderDetails?.[0] }] : [createConnectionHolderDetails()]
  );
  const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
  const stateId = Digit.ULBService.getStateId();
  const [isErrors, setIsErrors] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(formData?.[config.key]?.fileStoreId || null);
  const [file, setFile] = useState(null);

  const { isLoading, data: genderTypeData } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["GenderType"]);

  let menu = [];
  genderTypeData &&
    genderTypeData["common-masters"].GenderType.filter((data) => data.active).map((genderDetails) => {
      menu.push({ i18nKey: `COMMON_GENDER_${genderDetails.code}`, code: `${genderDetails.code}`, value: `${genderDetails.code}` });
    });

  let dropdownData = [];
  const { data: Documentsob = {} } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "Documents");
  const docs = Documentsob?.PropertyTax?.Documents;
  const specialProofIdentity = Array.isArray(docs) && docs.filter((doc) => doc.code.includes("SPECIALCATEGORYPROOF"));
  if (specialProofIdentity.length > 0) {
    dropdownData = specialProofIdentity[0]?.dropdownData;
    dropdownData.forEach((data) => {
      data.i18nKey = stringReplaceAll(data.code, ".", "_");
    });
    dropdownData = dropdownData?.filter((dropdown) => dropdown.parentValue.includes(connectionHolderDetails?.[0]?.ownerType));
    if (dropdownData.length == 1 && dropdownValue != dropdownData[0]) {
      setTypeOfDropdownValue(dropdownData[0]);
    }
  }

  const GuardianOptions = [
    { name: "HUSBAND", code: "HUSBAND", i18nKey: "COMMON_MASTERS_OWNERTYPE_HUSBAND" },
    { name: "Father", code: "FATHER", i18nKey: "COMMON_MASTERS_OWNERTYPE_FATHER" },
  ];

  const { data: Menu, isLoading: isSpecialcategoryLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "OwnerType");
  Menu ? Menu.sort((a, b) => a.name.localeCompare(b.name)) : "";

  useEffect(() => {
    const data = connectionHolderDetails.map((e) => {
      return e;
    });
    onSelect(config?.key, data);
  }, [connectionHolderDetails]);

  useEffect(() => {
    if (userType === "employee") {
      //onSelect(config.key, { ...formData[config.key], ...connectionHolderDetails });
      onSelect(config.key, [{ ...formData[config.key]?.[0], ...connectionHolderDetails?.[0] }]);
    }
  }, [connectionHolderDetails]);

  function ispagereloadingenabled(eyeclick) {
    if (
      (window.location.href.includes("edit") || window.location.href.includes("modify")) &&
      formData?.ConnectionHolderDetails &&
      Object.values(formData?.ConnectionHolderDetails?.[0])?.length > 1
    ) {
      if (
        eyeclick === "gender" &&
        connectionHolderDetails?.[0]?.gender?.code &&
        formData?.ConnectionHolderDetails?.[0]?.gender?.code !== connectionHolderDetails?.[0]?.gender?.code
      )
        return true;
      else if (
        eyeclick === "connectionHoldersMobileNumber" &&
        connectionHolderDetails?.[0]?.mobileNumber &&
        formData?.ConnectionHolderDetails?.[0]?.mobileNumber !== connectionHolderDetails?.[0]?.mobileNumber
      )
        return true;
      else if (
        eyeclick === "fatherOrHusbandName" &&
        connectionHolderDetails?.[0]?.guardian &&
        formData?.ConnectionHolderDetails?.[0]?.guardian !== connectionHolderDetails?.[0]?.guardian
      )
        return true;
      else if (
        eyeclick === "relationship" &&
        connectionHolderDetails?.[0]?.relationship?.code &&
        formData?.ConnectionHolderDetails?.[0]?.relationship?.code !== connectionHolderDetails?.[0]?.relationship?.code
      )
        return true;
      else if (
        eyeclick === "correspondenceAddress" &&
        connectionHolderDetails?.[0]?.address &&
        formData?.ConnectionHolderDetails?.[0]?.address !== connectionHolderDetails?.[0]?.address
      )
        return true;
      else if (
        eyeclick === "ownerType" &&
        connectionHolderDetails?.[0]?.ownerType?.code &&
        formData?.ConnectionHolderDetails?.[0]?.ownerType?.code !== connectionHolderDetails?.[0]?.ownerType?.code
      )
        return true;
      else return false;
    } else return false;
  }

  useEffect(() => {
    let eyeclick = sessionStorage.getItem("eyeIconClicked");
    if (ispagereloadingenabled(eyeclick)) {
      sessionStorage.removeItem("eyeIconClicked");
      window.location.reload();
    }
  }, [formData?.ConnectionHolderDetails?.[0], connectionHolderDetails, formData]);

  useEffect(() => {
    if (!formData?.ConnectionHolderDetails) {
      setConnectionHolderDetails([createConnectionHolderDetails()]);
    }
  }, [formData?.ConnectionHolderDetails]);

  const commonProps = {
    focusIndex,
    connectionHolderDetails,
    setFocusIndex,
    formData,
    formState,
    t,
    setError,
    clearErrors,
    config,
    setConnectionHolderDetails,
    setIsErrors,
    isErrors,
    connectionHolderDetails,
    filters,
    menu,
    uploadedFile,
    setUploadedFile,
    file,
    setFile,
    dropdownData,
    GuardianOptions,
    Menu,
  };

  return (
    <React.Fragment>
      {connectionHolderDetails.map((connectionHolderDetail, index) => (
        <ConnectionDetails key={connectionHolderDetail.key} index={index} connectionHolderDetail={connectionHolderDetail} {...commonProps} />
      ))}
    </React.Fragment>
  );
};

const ConnectionDetails = (_props) => {
  const {
    connectionHolderDetail,
    focusIndex,
    setFocusIndex,
    t,
    formData,
    config,
    setError,
    clearErrors,
    formState,
    connectionHolderDetails,
    setIsErrors,
    isErrors,
    setConnectionHolderDetails,
    menu,
    GuardianOptions,
    Menu,
  } = _props;

  const {
    control,
    formState: localFormState,
    watch,
    setError: setLocalError,
    clearErrors: clearLocalErrors,
    setValue,
    trigger,
    getValues,
  } = useForm();
  // const formValue = watch();
  const [name, setName] = useState(connectionHolderDetail?.name);
  const [gender, setGender] = useState(connectionHolderDetail?.gender);
  const [mobileNumber, setMobileNumber] = useState(connectionHolderDetail?.mobileNumber);
  const [guardian, setGuardian] = useState(connectionHolderDetail?.guardian);
  const [relationship, setRelationship] = useState(connectionHolderDetail?.relationship);
  const [address, setAddress] = useState(connectionHolderDetail?.address);
  const [ownerType, setOwnerType] = useState(connectionHolderDetail?.ownerType);
  const [sameAsOwnerDetails, setSameAsOwnerDetails] = useState(connectionHolderDetail?.sameAsOwnerDetails);
  const [uuid, setuuid] = useState(connectionHolderDetail?.uuid);
  const formValue = { name, gender, mobileNumber, guardian, relationship, ownerType, sameAsOwnerDetails, address, uuid };
  const { errors } = localFormState;
  const isMobile = window.Digit.Utils.browser.isMobile();
  const isEmployee = window.location.href.includes("/employee")

  const { isLoading, data: privacyData } = Digit.Hooks.useCustomMDMS(Digit.ULBService.getStateId(), "DataSecurity", [{ name: "SecurityPolicy" }], {
    select: (data) => data?.DataSecurity?.SecurityPolicy?.find((elem) => elem?.model == "User") || {},
  });

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    if ((Object.entries(formValue).length > 0 && formValue?.name) || formValue?.uuid) {
      const keys = Object.keys(formValue);
      const part = {};
      keys.forEach((key) => (part[key] = connectionHolderDetail[key]));
      if (!_.isEqual(formValue, part)) {
        let isErrorsFound = true;
        Object.keys(formValue).map((data) => {
          if (!formValue[data] && isErrorsFound) {
            isErrorsFound = false;
            setIsErrors(false);
          }
        });
        if (isErrorsFound) setIsErrors(true);
        let ob = [{ ...formValue }];
        setConnectionHolderDetails(ob);
        trigger();
      }
    }
  }, [formValue]);

  useEffect(() => {
    let isClear = true;
    Object.keys(connectionHolderDetails?.[0])?.map((data) => {
      if (!connectionHolderDetails[0][data] && connectionHolderDetails[0][data] != false && isClear) isClear = false;
    });
    if (connectionHolderDetails?.[0]?.sameAsOwnerDetails || (isClear && Object.keys(connectionHolderDetails?.[0])?.length > 1)) {
      clearErrors("ConnectionHolderDetails");
    } else {
      trigger();
    }
  }, [connectionHolderDetails]);

  useEffect(() => {
    if (sameAsOwnerDetails) {
      clearErrors("ConnectionHolderDetails");
    } else {
      trigger();
    }
  }, [sameAsOwnerDetails])
  
  useEffect(() => {
    if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) {
      setError(config.key, { type: errors });
    } else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
      clearErrors(config.key);
    }
  }, [errors]);

  const checkifPrivacyValid = () => {
    if (window.location.href.includes("edit") || window.location.href.includes("modify")) return true;
    else return false;
  };
  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };
  return (
    <div>
      <div className="field">
        <Controller
          control={control}
          name="sameAsOwnerDetails"
          defaultValue={sameAsOwnerDetails}
          isMandatory={true}
          render={(props) => (
            <CheckBox
              label={t("WS_SAME_AS_PROPERTY_OWNERS")}
              name={"sameAsOwnerDetails"}
              autoFocus={focusIndex.index === connectionHolderDetail?.key && focusIndex.type === "sameAsOwnerDetails"}
              errorStyle={localFormState.touched.sameAsOwnerDetails && errors?.sameAsOwnerDetails?.message ? true : false}
              onChange={(e) => {
                setSameAsOwnerDetails(e.target.checked);
                props.onChange(e.target.checked);
                setFocusIndex({ index: connectionHolderDetail?.key, type: "sameAsOwnerDetails" });
              }}
              checked={sameAsOwnerDetails}
              style={{ paddingBottom: "10px", paddingTop: "3px" }}
              onBlur={props.onBlur}
            />
          )}
        />
      </div>

      {!sameAsOwnerDetails ? (
        <div>
          <LabelFieldPair>
            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_OWN_DETAIL_NAME")}*`}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name="name"
                defaultValue={connectionHolderDetail?.name}
                rules={{
                  validate: (e) => ((e && getPattern("Name").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")),
                  required: t("REQUIRED_FIELD"),
                }}
                isMandatory={true}
                render={(props) => (
                  <div style={{ display: "flex", alignItems: "baseline", marginRight: isMobile && isEmployee ? "" :(checkifPrivacyValid() ? "-4%" : "-4%") }}>
                    <TextInput
                      value={getValues("name")}
                      autoFocus={focusIndex.index === connectionHolderDetail?.key && focusIndex.type === "name"}
                      errorStyle={localFormState.touched.name && errors?.name?.message ? true : false}
                      onChange={(e) => {
                        setName(e.target.value);
                        props.onChange(e.target.value);
                        setFocusIndex({ index: connectionHolderDetail?.key, type: "name" });
                      }}
                      labelStyle={{ marginTop: "unset" }}
                      onBlur={props.onBlur}
                      style={
                        checkifPrivacyValid() && !getValues("name")?.includes("*")
                          ? !Digit.Utils.checkPrivacy(privacyData, { uuid: connectionHolderDetail?.uuid, fieldName: "name", model: "User" }) &&
                            !Digit.Utils.checkPrivacy(privacyData, { uuid: connectionHolderDetail?.uuid, fieldName: "mobileNumber", model: "User" })
                            ? ((isMobile && isEmployee) ? {} :{ width: "96%" })
                            : ((isMobile && isEmployee) ? {} :{ width: "96%" })
                          : {}
                      }
                    />
                    {checkifPrivacyValid() && (
                      <div style={!(isMobile && isEmployee) ? { marginRight: "-10px", marginLeft: "10px" } : {}}>
                        <WrapUnMaskComponent
                          unmaskField={(e) => {
                            setName(e);
                            props.onChange(e);
                          }}
                          iseyevisible={getValues("name")?.includes("*") ? true : false}
                          privacy={{
                            uuid: connectionHolderDetail?.uuid,
                            fieldName: "name",
                            model: "WnSConnectionOwner",
                            loadData: {
                              serviceName: formData?.ConnectionDetails?.[0]?.water ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                              requestBody: {},
                              requestParam: {
                                tenantId: formData?.cpt?.details?.tenantId,
                                applicationNumber: formData?.ConnectionDetails?.[0]?.applicationNo,
                              },
                              jsonPath: formData?.ConnectionDetails?.[0]?.water
                                ? "WaterConnection[0].connectionHolders[0].name"
                                : "SewerageConnections[0].connectionHolders[0].name",
                              isArray: false,
                            },
                          }}
                        ></WrapUnMaskComponent>
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.name ? errors?.name?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t(
              "WS_CONN_HOLDER_OWN_DETAIL_GENDER_LABEL"
            )}*`}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"gender"}
                defaultValue={connectionHolderDetail?.gender}
                rules={{ required: t("REQUIRED_FIELD") }}
                isMandatory={true}
                render={(props) => (
                  <div
                    style={{
                      display: "flex",
                      marginRight: checkifPrivacyValid() && !(isMobile && isEmployee) ? "-20px" : "unset",
                      width: (isMobile && isEmployee) ? "" : checkifPrivacyValid() ? "197%" : "208%",
                    }}
                  >
                    <Dropdown
                      className="form-field"
                     // style={checkifPrivacyValid() ? (sessionStorage.getItem("isPrivacyEnabled") !== "true" ? { width: "51.5%" } : {}) : {}}
                      selected={getValues("gender")}
                      disable={false}
                      option={menu}
                      errorStyle={localFormState.touched.gender && errors?.gender?.message ? true : false}
                      select={(e) => {
                        setGender(e);
                        props.onChange(e);
                      }}
                      optionKey="i18nKey"
                      onBlur={props.onBlur}
                      t={t}
                    />
                    {checkifPrivacyValid() && (
                      <div style={{ marginRight: "-10px", marginLeft: (isMobile && isEmployee) ? "" : "8px", marginTop: "15px" }}>
                        <WrapUnMaskComponent
                          unmaskField={(e) => {
                            const r = { code: e, i18nKey: `COMMON_GENDER_${e}`, name: e };
                            setGender(r);
                            props.onChange(r);
                          }}
                          iseyevisible={gender["i18nKey"]?.includes("*") ? true : false}
                          privacy={{
                            uuid: connectionHolderDetail?.uuid,
                            fieldName: "gender",
                            model: "WnSConnectionOwner",
                            loadData: {
                              serviceName: formData?.ConnectionDetails?.[0]?.water ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                              requestBody: {},
                              requestParam: {
                                tenantId: formData?.cpt?.details?.tenantId,
                                applicationNumber: formData?.ConnectionDetails?.[0]?.applicationNo,
                              },
                              jsonPath: formData?.ConnectionDetails?.[0]?.water
                                ? "WaterConnection[0].connectionHolders[0].gender"
                                : "SewerageConnections[0].connectionHolders[0].gender",
                              isArray: false,
                            },
                          }}
                        ></WrapUnMaskComponent>
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.gender ? errors?.gender?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700"}} className="card-label-smaller">{`${t(
              "CORE_COMMON_MOBILE_NUMBER"
            )}*`}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name="mobileNumber"
                defaultValue={connectionHolderDetail?.mobileNumber}
                rules={{
                  validate: (e) =>
                    (e && getPattern("MobileNoWithPrivacy").test(e)) || !e || e.includes("*") ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG"),
                  required: t("REQUIRED_FIELD"),
                }}
                //type="number"
                isMandatory={true}
                render={(props) => (
                  <div style={{ display: "flex", alignItems: "baseline", marginRight: isEmployee && isMobile ? "" : (getValues("mobileNumber")?.includes("*") && !(isMobile && isEmployee) ? "-20px" : "-4%") }}>
                    <div className="employee-card-input employee-card-input--front" style={{ position: "relative", marginTop: "4px" }}>
                      +91
                    </div>
                    <TextInput
                      //type="number"
                      //value={props.value}
                      value={getValues("mobileNumber")}
                      autoFocus={focusIndex.index === connectionHolderDetail?.key && focusIndex.type === "mobileNumber"}
                      errorStyle={localFormState.touched.mobileNumber && errors?.mobileNumber?.message ? true : false}
                      onChange={(e) => {
                        setMobileNumber(e.target.value);
                        props.onChange(e.target.value);
                        setFocusIndex({ index: connectionHolderDetail?.key, type: "mobileNumber" });
                      }}
                      labelStyle={{ marginTop: "unset" }}
                      onBlur={props.onBlur}
                      style={
                        checkifPrivacyValid() && !getValues("mobileNumber")?.includes("*")
                          ? !Digit.Utils.checkPrivacy(privacyData, {
                              uuid: connectionHolderDetail?.uuid,
                              fieldName: "connectionHoldersMobileNumber",
                              model: "WnSConnectionOwner",
                            }) &&
                            !Digit.Utils.checkPrivacy(privacyData, { uuid: connectionHolderDetail?.uuid, fieldName: "mobileNumber", model: "User" })
                            ? ((isMobile && isEmployee) ? {} :{ width: "96%" })
                            : ((isMobile && isEmployee) ? {} :{ width: "96%", background: "#FAFAFA" })
                          : { background: "#FAFAFA" }
                      }
                    />
                    {checkifPrivacyValid() && (
                      <div style={!(isMobile && isEmployee) ? { marginRight: "-10px", marginLeft: "10px" } : {}}>
                        <WrapUnMaskComponent
                          unmaskField={(e) => {
                            setMobileNumber(e);
                            props.onChange(e);
                          }}
                          iseyevisible={getValues("mobileNumber")?.includes("*") ? true : false}
                          privacy={{
                            uuid: connectionHolderDetail?.uuid,
                            fieldName: "connectionHoldersMobileNumber",
                            model: "WnSConnectionOwner",
                            loadData: {
                              serviceName: formData?.ConnectionDetails?.[0]?.water ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                              requestBody: {},
                              requestParam: {
                                tenantId: formData?.cpt?.details?.tenantId,
                                applicationNumber: formData?.ConnectionDetails?.[0]?.applicationNo,
                              },
                              jsonPath: formData?.ConnectionDetails?.[0]?.water
                                ? "WaterConnection[0].connectionHolders[0].mobileNumber"
                                : "SewerageConnections[0].connectionHolders[0].mobileNumber",
                              isArray: false,
                            },
                          }}
                        ></WrapUnMaskComponent>
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.mobileNumber ? errors?.mobileNumber?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t(
              "WS_OWN_DETAIL_GUARDIAN_LABEL"
            )}*`}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name="guardian"
                defaultValue={connectionHolderDetail?.guardian}
                rules={{
                  validate: (e) => ((e && getPattern("Name").test(e)) || !e || e.includes("*") ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")),
                  required: t("REQUIRED_FIELD"),
                }}
                isMandatory={true}
                render={(props) => (
                  <div style={{ display: "flex", alignItems: "baseline", marginRight: isEmployee && isMobile ? "" :(getValues("guardian")?.includes("*") && !(isMobile && isEmployee) ? "-20px" : "-4%") }}>
                    <TextInput
                      value={getValues("guardian")}
                      autoFocus={focusIndex.index === connectionHolderDetail?.key && focusIndex.type === "guardian"}
                      errorStyle={localFormState.touched.guardian && errors?.guardian?.message ? true : false}
                      onChange={(e) => {
                        setGuardian(e.target.value);
                        props.onChange(e.target.value);
                        setFocusIndex({ index: connectionHolderDetail?.key, type: "guardian" });
                      }}
                      labelStyle={{ marginTop: "unset" }}
                      onBlur={props.onBlur}
                      style={
                        checkifPrivacyValid() && !getValues("guardian")?.includes("*")
                          ? !Digit.Utils.checkPrivacy(privacyData, {
                              uuid: connectionHolderDetail?.uuid,
                              fieldName: "fatherOrHusbandName",
                              model: "WnSConnectionOwner",
                            }) &&
                            !Digit.Utils.checkPrivacy(privacyData, { uuid: connectionHolderDetail?.uuid, fieldName: "mobileNumber", model: "User" })
                            ? ((isMobile && isEmployee) ? {} :{ width: "96%" })
                            : ((isMobile && isEmployee) ? {} :{ width: "96.2%" })
                          : {}
                      }
                    />
                    {checkifPrivacyValid() && (
                      <div style={!(isMobile && isEmployee) ? { marginRight: "-10px", marginLeft: "10px" } : {}}>
                        <WrapUnMaskComponent
                          unmaskField={(e) => {
                            setGuardian(e);
                            props.onChange(e);
                          }}
                          iseyevisible={getValues("guardian")?.includes("*") ? true : false}
                          privacy={{
                            uuid: connectionHolderDetail?.uuid,
                            fieldName: "fatherOrHusbandName",
                            model: "WnSConnectionOwner",
                            loadData: {
                              serviceName: formData?.ConnectionDetails?.[0]?.water ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                              requestBody: {},
                              requestParam: {
                                tenantId: formData?.cpt?.details?.tenantId,
                                applicationNumber: formData?.ConnectionDetails?.[0]?.applicationNo,
                              },
                              jsonPath: formData?.ConnectionDetails?.[0]?.water
                                ? "WaterConnection[0].connectionHolders[0].fatherOrHusbandName"
                                : "SewerageConnections[0].connectionHolders[0].fatherOrHusbandName",
                              isArray: false,
                            },
                          }}
                        ></WrapUnMaskComponent>
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.guardian ? errors?.guardian?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t(
              "WS_CONN_HOLDER_OWN_DETAIL_RELATION_LABEL"
            )}*`}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"relationship"}
                defaultValue={connectionHolderDetail?.relationship}
                rules={{ required: t("REQUIRED_FIELD") }}
                isMandatory={true}
                render={(props) => (
                  <div
                    style={{
                      display: "flex",
                      marginRight: checkifPrivacyValid() && !(isMobile && isEmployee) ? "-20px" : "unset",
                      width: (isMobile && isEmployee) ? "" : checkifPrivacyValid() ? "197%" : "208%",
                    }}
                  >
                    <Dropdown
                      className="form-field"
                     // style={checkifPrivacyValid() ? (sessionStorage.getItem("isPrivacyEnabled") !== "true" ? { width: "51.5%" } : {}) : {}}
                      selected={getValues("relationship")}
                      disable={false}
                      option={GuardianOptions}
                      errorStyle={localFormState.touched.relationship && errors?.relationship?.message ? true : false}
                      select={(e) => {
                        setRelationship(e);
                        props.onChange(e);
                      }}
                      optionKey="i18nKey"
                      onBlur={props.onBlur}
                      t={t}
                    />
                    {checkifPrivacyValid() && (
                      <div style={{ marginRight: "-10px", marginLeft: (isMobile && isEmployee) ? "" :"8px", marginTop: "15px" }}>
                        <WrapUnMaskComponent
                          unmaskField={(e) => {
                            const r = { code: e, i18nKey: `COMMON_MASTERS_OWNERTYPE_${e}`, name: e };
                            setRelationship(r);
                            props.onChange(r);
                          }}
                          iseyevisible={relationship?.i18nKey?.includes("*") ? true : false}
                          privacy={{
                            uuid: connectionHolderDetail?.uuid,
                            fieldName: "relationship",
                            model: "WnSConnection",
                            loadData: {
                              serviceName: formData?.ConnectionDetails?.[0]?.water ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                              requestBody: {},
                              requestParam: {
                                tenantId: formData?.cpt?.details?.tenantId,
                                applicationNumber: formData?.ConnectionDetails?.[0]?.applicationNo,
                              },
                              jsonPath: formData?.ConnectionDetails?.[0]?.water
                                ? "WaterConnection[0].connectionHolders[0].relationship"
                                : "SewerageConnections[0].connectionHolders[0].relationship",
                              isArray: false,
                            },
                          }}
                        ></WrapUnMaskComponent>
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.relationship ? errors?.relationship?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t(
              "WS_CORRESPONDANCE_ADDRESS_LABEL"
            )}*`}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name="address"
                defaultValue={connectionHolderDetail?.address}
                rules={{
                  validate: (e) => ((e && getPattern("Address").test(e)) || !e || e.includes("*") ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")),
                  required: t("REQUIRED_FIELD"),
                }}
                isMandatory={true}
                render={(props) => (
                  <div style={{ display: "flex", alignItems: "baseline", marginRight: isEmployee && isMobile ? "" : (getValues("address")?.includes("*") && !(isMobile && isEmployee) ? "-20px" : "-4%") }}>
                    <TextInput
                      value={getValues("address")}
                      autoFocus={focusIndex.index === connectionHolderDetail?.key && focusIndex.type === "address"}
                      errorStyle={localFormState.touched.address && errors?.address?.message ? true : false}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        props.onChange(e.target.value);
                        setFocusIndex({ index: connectionHolderDetail?.key, type: "address" });
                      }}
                      labelStyle={{ marginTop: "unset" }}
                      onBlur={props.onBlur}
                      style={
                        checkifPrivacyValid() && !getValues("address")?.includes("*")
                          ? !Digit.Utils.checkPrivacy(privacyData, {
                              uuid: connectionHolderDetail?.uuid,
                              fieldName: "correspondenceAddress",
                              model: "WnSConnectionOwner",
                            }) &&
                            !Digit.Utils.checkPrivacy(privacyData, { uuid: connectionHolderDetail?.uuid, fieldName: "mobileNumber", model: "User" })
                            ? ((isMobile && isEmployee) ? {} :{ width: "96%" })
                            : ((isMobile && isEmployee) ? {} :{ width: "96.2%" })
                          : {}
                      }
                    />
                    {checkifPrivacyValid() && (
                      <div style={ !(isMobile && isEmployee) ? { marginRight: "-10px", marginLeft: "10px" } : {}}>
                        <WrapUnMaskComponent
                          unmaskField={(e) => {
                            setAddress(e);
                            props.onChange(e);
                          }}
                          iseyevisible={getValues("address")?.includes("*") ? true : false}
                          privacy={{
                            uuid: connectionHolderDetail?.uuid,
                            fieldName: "correspondenceAddress",
                            model: "WnSConnectionOwner",
                            loadData: {
                              serviceName: formData?.ConnectionDetails?.[0]?.water ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                              requestBody: {},
                              requestParam: {
                                tenantId: formData?.cpt?.details?.tenantId,
                                applicationNumber: formData?.ConnectionDetails?.[0]?.applicationNo,
                              },
                              jsonPath: formData?.ConnectionDetails?.[0]?.water
                                ? "WaterConnection[0].connectionHolders[0].correspondenceAddress"
                                : "SewerageConnections[0].connectionHolders[0].correspondenceAddress",
                              isArray: false,
                            },
                          }}
                        ></WrapUnMaskComponent>
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.address ? errors?.address?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t(
              "WS_OWNER_SPECIAL_CATEGORY"
            )}*`}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"ownerType"}
                defaultValue={connectionHolderDetail?.ownerType}
                rules={{ required: t("REQUIRED_FIELD") }}
                //isMandatory={true}
                render={(props) => (
                  <div
                    style={{
                      display: "flex",
                      marginRight: checkifPrivacyValid() && !(isMobile && isEmployee) ? "-20px" : "unset",
                      width: (isMobile && isEmployee) ? "" : checkifPrivacyValid() ? "197%" : "208%",
                    }}
                  >
                    <Dropdown
                      className="form-field"
                     // style={checkifPrivacyValid() ? (sessionStorage.getItem("isPrivacyEnabled") !== "true" ? { width: "51.5%" } : {}) : {}}
                      selected={getValues("ownerType")}
                      disable={false}
                      option={Menu}
                      errorStyle={localFormState.touched.ownerType && errors?.ownerType?.message ? true : false}
                      select={(e) => {
                        setOwnerType(e);
                        props.onChange(e);
                      }}
                      optionKey="i18nKey"
                      onBlur={props.onBlur}
                      t={t}
                    />
                    {checkifPrivacyValid() && (
                      <div style={{ marginRight: "-10px", marginLeft: (isMobile && isEmployee) ? "" :"8px", marginTop: "10px" }}>
                        <WrapUnMaskComponent
                          unmaskField={(e) => {
                            const r = { code: e, i18nKey: `COMMON_MASTERS_OWNERTYPE_${e}`, name: e };
                            setOwnerType(r);
                            props.onChange(r);
                          }}
                          iseyevisible={ownerType?.i18nKey?.includes("*") ? true : false}
                          privacy={{
                            uuid: connectionHolderDetail?.uuid,
                            fieldName: "ownerType",
                            model: "WnSConnection",
                            loadData: {
                              serviceName: formData?.ConnectionDetails?.[0]?.water ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                              requestBody: {},
                              requestParam: {
                                tenantId: formData?.cpt?.details?.tenantId,
                                applicationNumber: formData?.ConnectionDetails?.[0]?.applicationNo,
                              },
                              jsonPath: formData?.ConnectionDetails?.[0]?.water
                                ? "WaterConnection[0].connectionHolders[0].ownerType"
                                : "SewerageConnections[0].connectionHolders[0].ownerType",
                              isArray: false,
                            },
                          }}
                        ></WrapUnMaskComponent>
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.ownerType ? errors?.ownerType?.message : ""}</CardLabelError>
        </div>
      ) : null}
    </div>
  );
};
export default WSConnectionHolderDetails;
