import { FormComposer, Header, Loader, Toast } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import * as func from "../../../utils";
import _ from "lodash";
import { newConfig as newConfigLocal } from "../../../config/wsDisconnectionConfig";
import { convertDisonnectEditApplicationDetails, convertDisonnectApplicationData } from "../../../utils";
import cloneDeep from "lodash/cloneDeep";

const EditDisconnectionByConfig = () => {
  const { t } = useTranslation();
  let { state } = useLocation();
  state = state ? (typeof (state) === "string" ? JSON.parse(state) : state) : {};
  let filters = func.getQueryStringParams(location.search);
  const [canSubmit, setSubmitValve] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [appData, setAppData] = useState({});
  const [config, setConfig] = useState({ head: "", body: [] });

  let tenantId = Digit.ULBService.getCurrentTenantId();
  tenantId ? tenantId : Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code;

  const editApplicationDetails = JSON.parse(sessionStorage.getItem("WS_EDIT_APPLICATION_DETAILS"));
  const serviceType = filters?.service || editApplicationDetails?.applicationData?.serviceType;

  const stateId = Digit.ULBService.getStateId();
  let { data: newConfig, isLoading: isConfigLoading } = Digit.Hooks.ws.useWSConfigMDMS.WSDisconnectionConfig(stateId, {});

  let details = cloneDeep(state?.data?.applicationDetails);
  const actionData = cloneDeep(state?.data?.action);
  let { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ws.useDisConnectionDetails(t, tenantId, details?.applicationNo, details?.applicationData?.serviceType, { privacy: Digit.Utils.getPrivacyObject() });

  details = applicationDetails;

  const [sessionFormData, setSessionFormData, clearSessionFormData] = Digit.Hooks.useSessionStorage("PT_CREATE_EMP_WS_NEW_FORM", {});

  useEffect(() => {
    if (!isLoading && !isConfigLoading) {
      // const config = newConfigLocal.find((conf) => conf.isDisonnectionEdit);
      const config = newConfig.find((conf) => conf.isDisonnectionEdit);
      config.head = "WS_WATER_SEWERAGE_DISCONNECTION_EDIT_LABEL";
      let bodyDetails = [];
      config?.body?.forEach(data => { if (data?.isDisonnectionEdit) bodyDetails.push(data); })
      config.body = bodyDetails;
      setConfig(config);
    }
  }, [applicationDetails, isLoading, newConfig]);

  useEffect(async () => {
    const IsDetailsExists = sessionStorage.getItem("IsDetailsExists") ? JSON.parse(sessionStorage.getItem("IsDetailsExists")) : false
    if (details?.applicationData?.id && !IsDetailsExists) {
      const convertAppData = await convertDisonnectApplicationData(details, serviceType, false, t);
      setSessionFormData({ ...sessionFormData, ...convertAppData });
      setAppData({ ...convertAppData })
      sessionStorage.setItem("IsDetailsExists", JSON.stringify(true));
    }
  }, [details, applicationDetails, sessionFormData]);

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
    let convertAppData = await convertDisonnectEditApplicationDetails(data, details, actionData);
    setSubmitValve(false);
    sessionStorage.setItem("redirectedfromEDIT", true);
    sessionStorage.setItem("WS_SESSION_APPLICATION_DETAILS", JSON.stringify(convertAppData));
    window.location.assign(`${window.location.origin}${state?.url}`);
    }
  };


  const closeToast = () => {
    setShowToast(null);
  };

  const IsDetailsExists = sessionStorage.getItem("IsDetailsExists") ? JSON.parse(sessionStorage.getItem("IsDetailsExists")) : false
  if (isLoading || !IsDetailsExists || isConfigLoading) {
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
        noBreakLine={true}
      ></FormComposer>
      {showToast && <Toast error={showToast.key} label={t(showToast?.message)} warning={showToast?.warning} onClose={closeToast} />}
    </React.Fragment>
  );
};

export default EditDisconnectionByConfig;

