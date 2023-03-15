import { FormComposer, Header, Loader, Toast } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import * as func from "../../../utils";
import _ from "lodash";
import { newConfig as newConfigLocal } from "../../../config/wsCreateConfig";
import { convertApplicationData, convertModifyApplicationDetails, updatePayloadOfWS } from "../../../utils";
import cloneDeep from "lodash/cloneDeep";

const ModifyApplication = () => {
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
  const [isEnableLoader, setIsEnableLoader] = useState(false);

  let tenantId = Digit.ULBService.getCurrentTenantId();
  const applicationNumber = filters?.applicationNumber;
  const serviceType = filters?.service;

  const stateId = Digit.ULBService.getStateId();
  let { data: newConfig, isLoading: isConfigLoading } = Digit.Hooks.ws.useWSConfigMDMS.WSCreateConfig(stateId, {});

  let details = cloneDeep(state?.data);
  let { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ws.useWSDetailsPage(t, tenantId, details?.applicationNo, details?.applicationData?.serviceType,{privacy : Digit.Utils.getPrivacyObject() });
  details = applicationDetails;
  const [propertyId, setPropertyId] = useState(new URLSearchParams(useLocation().search).get("propertyId"));

  const [sessionFormData, setSessionFormData, clearSessionFormData] = Digit.Hooks.useSessionStorage("PT_CREATE_EMP_WS_NEW_FORM", {});

  const { data: propertyDetails } = Digit.Hooks.pt.usePropertySearch(
    { filters: { propertyIds: propertyId }, tenantId: tenantId },
    { filters: { propertyIds: propertyId }, tenantId: tenantId, enabled: propertyId && propertyId != "" ? true : false, privacy : Digit.Utils.getPrivacyObject() }
  );

  useEffect(() => {
   if (!isConfigLoading) {
     // const config = newConfigLocal.find((conf) => conf.hideInCitizen && conf.isModify);
     const config = newConfig.find((conf) => conf.hideInCitizen && conf.isModify);
     config.head = "WS_WATER_AND_SEWERAGE_MODIFY_CONNECTION_LABEL";
     let bodyDetails = [];
     config?.body?.forEach(data => { if (data?.isModifyConnection) bodyDetails.push(data); });
     bodyDetails.forEach(bdyData => { if (bdyData?.head == "WS_COMMON_PROPERTY_DETAILS") bdyData.head = ""; })
     config.body = bodyDetails;
     setConfig(config);
   }
  }, [newConfig]);

  useEffect(() => {
    !propertyId && sessionFormData?.cpt?.details?.propertyId && setPropertyId(sessionFormData?.cpt?.details?.propertyId);
  }, [sessionFormData?.cpt]);

  useEffect(async () => {
    const IsDetailsExists = sessionStorage.getItem("IsDetailsExists") ? JSON.parse(sessionStorage.getItem("IsDetailsExists")) : false
    if (details?.applicationData?.id /* && !IsDetailsExists */) {
      const convertAppData = await convertApplicationData(details, serviceType, true, undefined,t);
      setSessionFormData({ ...sessionFormData, ...convertAppData });
      setAppData({ ...convertAppData })
      sessionStorage.setItem("IsDetailsExists", JSON.stringify(true));
    }
  }, [details,applicationDetails]);

  useEffect(() => {
    setSessionFormData({ ...sessionFormData, cpt: { details: propertyDetails?.Properties?.[0] } });
  }, [propertyDetails]);

  useEffect(() => {
    if (sessionFormData?.ConnectionDetails?.[0]?.applicationNo) {
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
    isLoading: creatingWaterApplicationLoading,
    isError: createWaterApplicationError,
    data: createWaterResponse,
    error: createWaterError,
    mutate: waterMutation,
  } = Digit.Hooks.ws.useWaterCreateAPI("WATER");

  const {
    isLoading: updatingWaterApplicationLoading,
    isError: updateWaterApplicationError,
    data: updateWaterResponse,
    error: updateWaterError,
    mutate: waterUpdateMutation,
  } = Digit.Hooks.ws.useWSApplicationActions("WATER");

  const {
    isLoading: creatingSewerageApplicationLoading,
    isError: createSewerageApplicationError,
    data: createSewerageResponse,
    error: createSewerageError,
    mutate: sewerageMutation,
  } = Digit.Hooks.ws.useWaterCreateAPI("SEWERAGE");

  const {
    isLoading: updatingSewerageApplicationLoading,
    isError: updateSewerageApplicationError,
    data: updateSewerageResponse,
    error: updateSewerageError,
    mutate: sewerageUpdateMutation,
  } = Digit.Hooks.ws.useWSApplicationActions("SEWERAGE");

  const onFormValueChange = (setValue, formData, formState) => {
    if (!_.isEqual(sessionFormData, formData)) {
      setSessionFormData({ ...sessionFormData, ...formData });
    }
    if (Object.keys(formState.errors).length > 0 && Object.keys(formState.errors).length == 1 && formState.errors["owners"] && Object.values(formState.errors["owners"].type).filter((ob) => ob.type === "required").length == 0 && !formData?.cpt?.details?.propertyId) setSubmitValve(true);
    else setSubmitValve(!(Object.keys(formState.errors).length));
  };

  const onSubmit = async (data) => {
    if(!data?.cpt?.id && !propertyDetails?.Properties?.[0]){
      if (!data?.cpt?.details || !propertyDetails) {
          setShowToast({ key: "error", message: "ERR_INVALID_PROPERTY_ID" });
          return;
        }
    }
    if(!canSubmit){
      setShowToast({ warning: true, message: "PLEASE_FILL_MANDATORY_DETAILS" });
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    else{

    if (!data?.cpt?.details) {
      data.cpt = {
        details: propertyDetails?.Properties?.[0]
      };
    }

    const details = sessionStorage.getItem("WS_EDIT_APPLICATION_DETAILS") ? JSON.parse(sessionStorage.getItem("WS_EDIT_APPLICATION_DETAILS")) : {};
    let convertAppData = await convertModifyApplicationDetails(data, details);
    const reqDetails = data?.ConnectionDetails?.[0]?.serviceName == "WATER" ? { WaterConnection: convertAppData } : { SewerageConnection: convertAppData }

    if (serviceType == "WATER") {
      if (waterMutation) {
        setIsEnableLoader(true);
        await waterMutation(reqDetails, {
          onError: (error, variables) => {
            setIsEnableLoader(false);
            setShowToast({ key: "error", message: error?.response?.data?.Errors?.[0].message ? error?.response?.data?.Errors?.[0].message : error });
            setTimeout(closeToastOfError, 5000);
          },
          onSuccess: async (data, variables) => {
            let response = await updatePayloadOfWS(data?.WaterConnection?.[0], "WATER");
            let waterConnectionUpdate = { WaterConnection: response };
            waterUpdateMutation(waterConnectionUpdate, {
              onError: (error, variables) => {
                setIsEnableLoader(false);
                setShowToast({ key: "error", message: error?.response?.data?.Errors?.[0].message ? error?.response?.data?.Errors?.[0].message : error });
                setTimeout(closeToastOfError, 5000);
              },
              onSuccess: (data, variables) => {
                clearSessionFormData();
                history.push(`/digit-ui/employee/ws/ws-response?applicationNumber=${data?.WaterConnection?.[0]?.applicationNo}`);
                // window.location.href = `${window.location.origin}/digit-ui/employee/ws/ws-response?applicationNumber=${data?.WaterConnection?.[0]?.applicationNo}`;
              },
            })
          },
        });
      }
    }

    if (serviceType !== "WATER") {
      if (sewerageMutation) {
        setIsEnableLoader(true);
        await sewerageMutation(reqDetails, {
          onError: (error, variables) => {
            setIsEnableLoader(false);
            setShowToast({ key: "error", message: error?.response?.data?.Errors?.[0]?.message ? error?.response?.data?.Errors?.[0]?.message : error });
            setTimeout(closeToastOfError, 5000);
          },
          onSuccess: async (data, variables) => {
            let response = await updatePayloadOfWS(data?.SewerageConnections?.[0], "SEWERAGE");
            let sewerageConnectionUpdate = { SewerageConnection: response };
            await sewerageUpdateMutation(sewerageConnectionUpdate, {
              onError: (error, variables) => {
                setIsEnableLoader(false);
                setShowToast({ key: "error", message: error?.message ? error.message : error });
                setTimeout(closeToastOfError, 5000);
              },
              onSuccess: (data, variables) => {
                clearSessionFormData();
                history.push(`/digit-ui/employee/ws/ws-response?applicationNumber1=${data?.SewerageConnections?.[0]?.applicationNo}`);
                // window.location.href = `${window.location.origin}/digit-ui/employee/ws/ws-response?applicationNumber1=${data?.SewerageConnections?.[0]?.applicationNo}`;
              }
            });
          },
        });
      }
    }
  }
  };


  const closeToast = () => {
    setShowToast(null);
  };

  if (enabledLoader || isEnableLoader || isConfigLoading) {
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
      // noBreakLine={true}
      ></FormComposer>
      {showToast && <Toast isDleteBtn={true} error={showToast?.key === "error" ? true : false} label={t(showToast?.message)} onClose={closeToast} />}
      {/* {showToast && <Toast error={showToast.key} label={t(showToast?.message)} onClose={closeToast} />} */}
    </React.Fragment>
  );
};

export default ModifyApplication;
