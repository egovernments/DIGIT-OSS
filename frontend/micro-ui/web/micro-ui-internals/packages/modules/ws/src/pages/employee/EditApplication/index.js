import { FormComposer, Header, Loader, Toast } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import * as func from "../../../utils";
import _ from "lodash";
import { newConfig as newConfigLocal } from "../../../config/wsCreateConfig";
import { convertApplicationData, convertEditApplicationDetails } from "../../../utils";
import cloneDeep from "lodash/cloneDeep";

const EditApplication = () => {
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

  let details = cloneDeep(state?.data?.applicationDetails);
  const actionData = cloneDeep(state?.data?.action);

  const stateId = Digit.ULBService.getStateId();
  let { data: newConfig, isLoading: isConfigLoading } = Digit.Hooks.ws.useWSConfigMDMS.WSCreateConfig(stateId, {});

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
      // const config = newConfigLocal.find((conf) => conf.hideInCitizen && conf.isEdit);
      const config = newConfig.find((conf) => conf.hideInCitizen && conf.isEdit);
      config.head = "WS_APP_FOR_WATER_AND_SEWERAGE_EDIT_LABEL";
      let bodyDetails = [];
      config?.body?.forEach(data => { if (data?.isEditConnection) bodyDetails.push(data); })
      config.body = bodyDetails;
      setConfig(config);
    }
  }, [newConfig]);

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
    let convertAppData = await convertEditApplicationDetails(data, details, actionData);
    const reqDetails = data?.ConnectionDetails?.[0]?.serviceName == "WATER" ? { WaterConnection: convertAppData } : { SewerageConnection: convertAppData }
    setSubmitValve(false);
    
    if (details?.processInstancesDetails?.[0]?.state?.applicationStatus?.includes("CITIZEN_ACTION")) {
      if (mutate) {
        mutate(reqDetails, {
          onError: (error, variables) => {
            setShowToast({ key: "error", message: error?.message ? error.message : error });
            setTimeout(closeToastOfError, 5000);
            setSubmitValve(true);
          },
          onSuccess: (data, variables) => {
            setShowToast({ key: false, message: "WS_APPLICATION_SUBMITTED_SUCCESSFULLY_LABEL" });
            setIsAppDetailsPage(true);
            // setTimeout(closeToast(), 5000);
          },
        });
      }
    } else {
      sessionStorage.setItem("redirectedfromEDIT", true);
      sessionStorage.setItem("WS_SESSION_APPLICATION_DETAILS", JSON.stringify(convertAppData));
      window.location.assign(`${window.location.origin}${state?.url}`);
    }
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

export default EditApplication;
