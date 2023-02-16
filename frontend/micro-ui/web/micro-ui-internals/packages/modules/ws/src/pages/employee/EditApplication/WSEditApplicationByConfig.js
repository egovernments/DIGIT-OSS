import { FormComposer, Header, Loader, Toast } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import * as func from "../../../utils";
import _ from "lodash";
import { newConfig as newConfigLocal } from "../../../config/wsCreateConfig";
import { convertApplicationData, convertEditApplicationDetails } from "../../../utils";
import cloneDeep from "lodash/cloneDeep";

const convertEditApplicationDetails1 = (data, appData, serviceType) => {
  data?.cpt?.details?.owners?.forEach(owner => {
    if (owner?.permanentAddress) owner.correspondenceAddress = owner?.permanentAddress
  });

  let payload = {
    ...appData.applicationData,
    proposedTaps: data?.ConnectionDetails?.[0]?.proposedTaps && Number(data?.ConnectionDetails?.[0]?.proposedTaps),
    proposedPipeSize: data?.ConnectionDetails?.[0]?.proposedPipeSize?.size && Number(data?.ConnectionDetails?.[0]?.proposedPipeSize?.size),
    proposedWaterClosets: data?.ConnectionDetails?.[0]?.proposedWaterClosets && Number(data?.ConnectionDetails?.[0]?.proposedWaterClosets),
    proposedToilets: data?.ConnectionDetails?.[0]?.proposedToilets && Number(data?.ConnectionDetails?.[0]?.proposedToilets),
    connectionHolders: !data?.ConnectionHolderDetails?.[0]?.sameAsOwnerDetails ? [{
      ...appData?.applicationData?.connectionHolders?.[0],
      correspondenceAddress: data?.ConnectionHolderDetails?.[0]?.address || "",
      fatherOrHusbandName: data?.ConnectionHolderDetails?.[0]?.guardian || "",
      gender: data?.ConnectionHolderDetails?.[0]?.gender?.code || "",
      mobileNumber: data?.ConnectionHolderDetails?.[0]?.mobileNumber || "",
      name: data?.ConnectionHolderDetails?.[0]?.name || "",
      ownerType: data?.ConnectionHolderDetails?.[0]?.ownerType?.code || "",
      relationship: data?.ConnectionHolderDetails?.[0]?.relationship?.code || "",
      sameAsPropertyAddress: data?.ConnectionHolderDetails?.[0]?.sameAsOwnerDetails
    }] : null,
    property: data?.cpt?.details,
    propertyId: data?.cpt?.details?.propertyId,
    processInstance: {
      ...appData?.processInstance,
      action: "VERIFY_AND_FORWARD"
    },
    action: "VERIFY_AND_FORWARD",
    documents: data?.DocumentsRequired?.documents,
    plumberInfo: [
      {
        licenseNo: data?.plumberDetails?.[0]?.plumberLicenseNo || appData?.plumberLicenseNo,
        name: data?.plumberDetails?.[0]?.plumberName || appData?.plumberName,
        mobileNumber: data?.plumberDetails?.[0]?.plumberMobileNo || appData?.plumberMobileNo
      }
    ],
    roadCuttingInfo: data?.roadCuttingDetails?.filter((o) => o.roadType.code != "").map((details) => (
      details?.id && details?.id !== null
      ? 
      {
        id: details?.id,
        roadType: details?.roadType?.code,
        roadCuttingArea: details?.area,
        status: details?.status 
      } 
    : {
      roadType: details?.roadType?.code,
      roadCuttingArea: details?.area,
    } )),
    connectionNo: null,
    ...serviceType === "WATER" ?
    {
      connectionType: data?.connectionDetails?.[0]?.connectionType?.code || appData?.connectionType,
      waterSource: data?.connectionDetails?.[0]?.sourceSubData?.code || appData?.waterSource,
      pipeSize: data?.connectionDetails?.[0]?.pipeSize?.size || appData?.pipeSize,
      noOfTaps: data?.connectionDetails?.[0]?.noOfTaps || appData?.noOfTaps,
      sourceSubData: data?.connectionDetails?.[0]?.sourceSubData?.code || appData?.sourceSubData,
    } : {
      connectionType: 'Non Metered',
      noOfWaterClosets: data?.connectionDetails?.[0]?.noOfWaterClosets || appData?.noOfWaterClosets || "",
      noOfToilets: data?.connectionDetails?.[0]?.noOfToilets || appData?.noOfToilets || "",
    },
    tenantId: data?.cpt?.details?.tenantId
  }

  if (data?.plumberDetails?.[0]?.detailsProvidedBy?.code || appData?.detailsProvidedBy) {
    payload.additionalDetails.detailsProvidedBy = data?.plumberDetails?.[0]?.detailsProvidedBy?.code || appData?.detailsProvidedBy;
    payload.additionalDetails.initialMeterReading = null;
  }
  if (data?.cpt?.details?.address?.locality?.code) {
    payload.additionalDetails.locality = data?.cpt?.details?.address?.locality?.code;
  }

  if (data?.plumberDetails?.[0]?.detailsProvidedBy?.code == "ULB") {
    payload.plumberInfo = [
      {
        licenseNo: data?.plumberDetails?.[0]?.plumberLicenseNo || appData?.plumberLicenseNo,
        name: data?.plumberDetails?.[0]?.plumberName || appData?.plumberName,
        mobileNumber: data?.plumberDetails?.[0]?.plumberMobileNo || appData?.plumberMobileNo
      }
    ]
  } 

  return payload;
}



const WSEditApplicationByConfig = () => {
  const { t } = useTranslation();
  let { state } = useLocation();
  state = state  ? (typeof(state) === "string" ? JSON.parse(state) : state) : {};
  const history = useHistory();
  let filters = func.getQueryStringParams(location.search);
  const [canSubmit, setSubmitValve] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [appData, setAppData] = useState({});
  const [config, setConfig] = useState({ head: "", body: [] });
  const [enabledLoader, setEnabledLoader] = useState(true);
  const [isAppDetailsPage, setIsAppDetailsPage] = useState(false);

  let tenantId = Digit.ULBService.getCurrentTenantId();
  tenantId ? tenantId : Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code;

  const applicationNumber = filters?.applicationNumber;
  const editApplicationDetails = JSON.parse(sessionStorage.getItem("WS_EDIT_APPLICATION_DETAILS"));
  const serviceType = filters?.service || editApplicationDetails?.applicationData?.serviceType;

  const stateId = Digit.ULBService.getStateId();
  let { data: newConfig, isLoading: isConfigLoading } = Digit.Hooks.ws.useWSConfigMDMS.WSCreateConfig(stateId, {});

  let details = cloneDeep(state?.data?.applicationDetails);
  const actionData = cloneDeep(state?.data?.action);
  let { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ws.useWSDetailsPage(t, tenantId, details?.applicationNo, details?.applicationData?.serviceType,{privacy : Digit.Utils.getPrivacyObject() });
  details = applicationDetails;
  const [propertyId, setPropertyId] = useState(new URLSearchParams(useLocation().search).get("propertyId"));

  const [sessionFormData, setSessionFormData, clearSessionFormData] = Digit.Hooks.useSessionStorage("PT_CREATE_EMP_WS_NEW_FORM", {});
  const [sessionAhocFormData, setSessionAdhocFormData, clearSessionAdhocFormData] = Digit.Hooks.useSessionStorage("ADHOC_ADD_REBATE_DATA", {});

  const { data: propertyDetails } = Digit.Hooks.pt.usePropertySearch(
    { filters: { propertyIds: propertyId }, tenantId: tenantId },
    { filters: { propertyIds: propertyId }, tenantId: tenantId, enabled: propertyId && propertyId != "" ? true : false, privacy : Digit.Utils.getPrivacyObject() }
  );

  useEffect(() => {
    if (!isConfigLoading) {
      // const config = newConfigLocal.find((conf) => conf.hideInCitizen && conf.isEditByConfig);
      const config = newConfig.find((conf) => conf.hideInCitizen && conf.isEditByConfig);
      config.head = "WS_APP_FOR_WATER_AND_SEWERAGE_EDIT_LABEL";
      let bodyDetails = [];
      config?.body?.forEach(data => { if (data?.isEditByConfigConnection) bodyDetails.push(data); })
      config.body = bodyDetails;
      setConfig(config);
    }
  },[newConfig]);

  useEffect(() => {
    !propertyId && sessionFormData?.cpt?.details?.propertyId && setPropertyId(sessionFormData?.cpt?.details?.propertyId);
  }, [sessionFormData?.cpt]);

  useEffect(async () => {
    const IsDetailsExists = sessionStorage.getItem("IsDetailsExists") ? JSON.parse(sessionStorage.getItem("IsDetailsExists")) : false
    if (details?.applicationData?.id && !IsDetailsExists) {
      sessionStorage.setItem("appData",JSON.stringify(appData));
      const convertAppData = await convertApplicationData(details, serviceType, false, false, t);
      setSessionFormData({ ...sessionFormData, ...convertAppData });
      setAppData({ ...convertAppData })
      sessionStorage.setItem("IsDetailsExists", JSON.stringify(true));
    }
  }, [details,applicationDetails,sessionFormData?.cpt, sessionFormData, propertyDetails]);

  useEffect(() => {
    setSessionFormData({ ...sessionFormData, cpt: { details: propertyDetails?.Properties?.[0] } });
  }, [propertyDetails]);

  useEffect(() => {
    if (sessionFormData?.DocumentsRequired?.documents?.length > 0 || sessionFormData?.ConnectionDetails?.[0]?.water || sessionFormData?.ConnectionDetails?.[0]?.sewerage || sessionFormData?.cpt?.details && !isLoading) {
      setEnabledLoader(false);
    }
  }, [propertyDetails, sessionFormData, sessionFormData?.cpt]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAppDetailsPage) window.location.href = `${window.location.origin}/digit-ui/employee/ws/application-details?applicationNumber=${sessionFormData?.ConnectionDetails?.[0]?.applicationNo}&service=${sessionFormData?.ConnectionDetails?.[0]?.serviceName?.toUpperCase()}`
    }, 5000);
    return () => clearTimeout(timer);
  }, [isAppDetailsPage]);

  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.ws.useWSApplicationActions(serviceType);

  const onFormValueChange = (setValue, formData, formState) => {
    if (!_.isEqual(sessionFormData, formData)) {
      setSessionFormData({ ...sessionFormData, ...formData });
    }
    if (Object.keys(formState.errors).length > 0 && Object.keys(formState.errors).length == 1 && formState.errors["owners"] && Object.values(formState.errors["owners"].type).filter((ob) => ob.type === "required").length == 0 && !formData?.cpt?.details?.propertyId) setSubmitValve(true);
    else if( formData.ConnectionDetails?.[0]?.water && (formData.roadCuttingDetails?.[0]?.roadType?.code == "" 
    || formData.roadCuttingDetails?.[0]?.area == "" 
    || formData.plumberDetails?.[0]?.detailsProvidedBy == ""
    || formData.connectionDetails?.[0]?.connectionType == ""
    || formData.connectionDetails?.[0]?.waterSource == ""
    || formData.connectionDetails?.[0]?.sourceSubData == "")
    ){
      setSubmitValve(false);
    }
    else if( formData.ConnectionDetails?.[0]?.sewerage && (formData.roadCuttingDetails?.[0]?.roadType?.code == "" 
    || formData.roadCuttingDetails?.[0]?.area == "" 
    || formData.plumberDetails?.[0]?.detailsProvidedBy == ""
    || formData.connectionDetails?.[0]?.noOfWaterClosets == ""
    || formData.connectionDetails?.[0]?.noOfToilets == "")
    ){
      setSubmitValve(false);
    }
    else setSubmitValve(!(Object.keys(formState.errors).length));
  };

  const onSubmit = async (data) => {
    if(!canSubmit){
      setShowToast({ warning: true, message: "PLEASE_FILL_MANDATORY_DETAILS" });
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    else{
    const details = sessionStorage.getItem("WS_EDIT_APPLICATION_DETAILS") ? JSON.parse(sessionStorage.getItem("WS_EDIT_APPLICATION_DETAILS")) : {};
    let convertAppData = await convertEditApplicationDetails1(data, details, serviceType);
    if (sessionAhocFormData?.adhocPenalty) convertAppData.additionalDetails.adhocPenalty = parseInt(sessionAhocFormData?.adhocPenalty);
    if (sessionAhocFormData?.adhocPenaltyComment) convertAppData.additionalDetails.adhocPenaltyComment = sessionAhocFormData?.adhocPenaltyComment || "";
    if (sessionAhocFormData?.adhocPenaltyReason) convertAppData.additionalDetails.adhocPenaltyReason = sessionAhocFormData?.adhocPenaltyReason || "";
    if (sessionAhocFormData?.adhocRebate) convertAppData.additionalDetails.adhocRebate = parseInt(sessionAhocFormData?.adhocRebate);
    if (sessionAhocFormData?.adhocRebateComment) convertAppData.additionalDetails.adhocRebateComment = sessionAhocFormData?.adhocRebateComment || "";
    if (sessionAhocFormData?.adhocRebateReason) convertAppData.additionalDetails.adhocRebateReason = sessionAhocFormData?.adhocRebateReason || "";
    const reqDetails = data?.ConnectionDetails?.[0]?.serviceName == "WATER" ? { WaterConnection: convertAppData } : { SewerageConnection: convertAppData }
    setSubmitValve(false);
    sessionStorage.setItem("redirectedfromEDIT", true);
    sessionStorage.setItem("WS_SESSION_APPLICATION_DETAILS", JSON.stringify(convertAppData));
     window.location.assign(`${window.location.origin}${state?.url}`);

    // if (mutate) {
    //   mutate(reqDetails, {
    //     onError: (error, variables) => {
    //       setShowToast({ key: "error", message: error?.message ? error.message : error });
    //       setTimeout(closeToastOfError, 5000);
    //       setSubmitValve(true);
    //     },
    //     onSuccess: (data, variables) => {
    //       clearSessionAdhocFormData();
    //       setSessionAdhocFormData({});
    //       setShowToast({ key: false, message: "WS_APPLICATION_SUBMITTED_SUCCESSFULLY_LABEL" });
    //       setIsAppDetailsPage(true);
    //       // setTimeout(closeToast(), 5000);
    //     },
    //   });
    // }
    }
  };


  const closeToast = () => {
    setShowToast(null);
  };

  if (enabledLoader || isConfigLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <div style={{ marginLeft: "15px" }}>
        <Header>{t(config.head)}</Header>
      </div>
      <FormComposer
        config={config.body}
        userType={"employee"}
        onFormValueChange={onFormValueChange}
        // isDisabled={!canSubmit}
        label={t("CS_COMMON_SUBMIT")}
        onSubmit={onSubmit}
        defaultValues={sessionFormData}
        appData={appData}
      ></FormComposer>
      {showToast && <Toast error={showToast.key} label={t(showToast?.message)} warning={showToast?.warning} onClose={closeToast} />}
    </React.Fragment>
  );
};

export default WSEditApplicationByConfig;