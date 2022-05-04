import { FormComposer, Header, Loader, Toast } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import * as func from "../../../utils";
import _ from "lodash";
import { newConfig as newConfigLocal } from "../../../config/wsCreateConfig";
import { convertApplicationData, convertEditApplicationDetails } from "../../../utils";
import cloneDeep from "lodash/cloneDeep";


const convertEditApplicationDetails1 = (data, appData) => {
  data?.cpt?.details?.owners?.forEach(owner => {
    if (owner?.permanentAddress) owner.correspondenceAddress = owner?.permanentAddress
  });

  let payload = {
    ...appData,
    proposedTaps: data?.ConnectionDetails?.[0]?.proposedTaps && Number(data?.ConnectionDetails?.[0]?.proposedTaps),
    proposedPipeSize: data?.ConnectionDetails?.[0]?.proposedPipeSize?.size && Number(data?.ConnectionDetails?.[0]?.proposedPipeSize?.size),
    proposedWaterClosets: data?.ConnectionDetails?.[0]?.proposedWaterClosets && Number(data?.ConnectionDetails?.[0]?.proposedWaterClosets),
    proposedToilets: data?.ConnectionDetails?.[0]?.proposedToilets && Number(data?.ConnectionDetails?.[0]?.proposedToilets),
    connectionHolders: !data?.ConnectionHolderDetails?.[0]?.sameAsOwnerDetails ? [{
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
    processInstance: {
      ...appData?.processInstance,
      action: "SUBMIT_APPLICATION"
    },
    action: "SUBMIT_APPLICATION",
    documents: data?.DocumentsRequired?.documents,
    plumberInfo: [],
    roadType: null,
    roadCuttingArea: null,
    roadCuttingInfo: data?.RoadCuttingDetails?.map((details) => ({
      roadType: details?.roadType?.code,
      roadCuttingArea: details?.area,
    })),
    connectionNo: null,
    connectionType: data?.ActivationConnectionDetails?.[0]?.connectionType?.code || appData?.connectionType,
    waterSource: data?.ActivationConnectionDetails?.[0]?.waterSource?.code || appData?.waterSource,
    pipeSize: data?.ActivationConnectionDetails?.[0]?.pipeSize?.code || appData?.pipeSize,
    noOfTaps: data?.ActivationConnectionDetails?.[0]?.noOfTaps || appData?.noOfTaps,
    sourceSubData: data?.ActivationConnectionDetails?.[0]?.sourceSubData?.code || appData?.sourceSubData,
    tenantId: data?.cpt?.details?.tenantId,
  }

  return payload;
}

const WSEditApplicationByConfig = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
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
  const serviceType = filters?.service;

  const details = cloneDeep(state?.data);

  const [propertyId, setPropertyId] = useState(new URLSearchParams(useLocation().search).get("propertyId"));

  const [sessionFormData, setSessionFormData, clearSessionFormData] = Digit.Hooks.useSessionStorage("PT_CREATE_EMP_WS_NEW_FORM", {});

  const { data: propertyDetails } = Digit.Hooks.pt.usePropertySearch(
    { filters: { propertyIds: propertyId }, tenantId: tenantId },
    { filters: { propertyIds: propertyId }, tenantId: tenantId },
    { enabled: propertyId ? true : false }
  );

  useEffect(() => {
    const config = newConfigLocal.find((conf) => conf.hideInCitizen);
    const head = "WS_APP_FOR_WATER_AND_SEWERAGE_EDIT_LABEL";
    const body = [];

    config?.body?.filter(data => {
      if (data?.isEditByConfigConnection) {
        body.push(data);
      }
    });

    setConfig({ head, body });
  }, []);

  useEffect(() => {
    !propertyId && setPropertyId(sessionFormData?.cpt?.details?.propertyId);
  }, [sessionFormData?.cpt]);

  useEffect(async () => {
    const IsDetailsExists = sessionStorage.getItem("IsDetailsExists") ? JSON.parse(sessionStorage.getItem("IsDetailsExists")) : false
    if (details?.applicationData?.id && !IsDetailsExists) {
      const convertAppData = await convertApplicationData(details, serviceType);
      setSessionFormData({ ...sessionFormData, ...convertAppData });
      setAppData({ ...convertAppData })
      sessionStorage.setItem("IsDetailsExists", JSON.stringify(true));
    }
  }, []);

  useEffect(() => {
    setSessionFormData({ ...sessionFormData, cpt: { details: propertyDetails?.Properties?.[0] } });
  }, [propertyDetails]);

  useEffect(() => {
    if (sessionFormData?.DocumentsRequired?.documents?.length > 0) {
      setEnabledLoader(false);
    }
  }, [propertyDetails, sessionFormData, sessionFormData?.cpt]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAppDetailsPage) window.location.href = `${window.location.origin}/digit-ui/employee/ws/application-details?applicationNumber=${sessionFormData?.ConnectionDetails?.[0]?.applicationNo}&service=${sessionFormData?.ConnectionDetails?.[0]?.serviceName?.toUpperCase()}`
    }, 3000);
    return () => clearTimeout(timer);
  }, [isAppDetailsPage]);

  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.ws.useWSApplicationActions(filters?.service);

  const onFormValueChange = (setValue, formData, formState) => {
    if (!_.isEqual(sessionFormData, formData)) {
      setSessionFormData({ ...sessionFormData, ...formData });
    }
    if (Object.keys(formState.errors).length > 0 && Object.keys(formState.errors).length == 1 && formState.errors["owners"] && Object.values(formState.errors["owners"].type).filter((ob) => ob.type === "required").length == 0 && !formData?.cpt?.details?.propertyId) setSubmitValve(true);
    else setSubmitValve(!(Object.keys(formState.errors).length));
  };

  const onSubmit = async (data) => {
    if (!canSubmit) return;

    const applicationDetails = sessionStorage.getItem("WS_EDIT_APPLICATION_DETAILS") ? JSON.parse(sessionStorage.getItem("WS_EDIT_APPLICATION_DETAILS")) : details;
    let convertAppData = await convertEditApplicationDetails1(data, applicationDetails?.applicationData);
    const reqDetails = (serviceType || data?.ConnectionDetails?.[0]?.serviceName) == "WATER" ? { WaterConnection: convertAppData } : { SewerageConnection: convertAppData }

    if (mutate) {
      mutate(reqDetails, {
        onError: (error, variables) => {
          setShowToast({ key: "error", message: error?.message ? error.message : error });
          setTimeout(closeToastOfError, 5000);
        },
        onSuccess: (data, variables) => {
          setShowToast({ key: false, message: "CS_PROPERTY_APPLICATION_SUCCESS" });
          setIsAppDetailsPage(true);
          // setTimeout(closeToast(), 5000);
        },
      });
    }
  };


  const closeToast = () => {
    setShowToast(null);
  };

  if (enabledLoader) {
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
        isDisabled={!canSubmit}
        label={t("CS_COMMON_SUBMIT")}
        onSubmit={onSubmit}
        defaultValues={sessionFormData}
      ></FormComposer>
      {showToast && <Toast error={showToast.key} label={t(showToast?.message)} onClose={closeToast} />}
    </React.Fragment>
  );
};

export default WSEditApplicationByConfig;