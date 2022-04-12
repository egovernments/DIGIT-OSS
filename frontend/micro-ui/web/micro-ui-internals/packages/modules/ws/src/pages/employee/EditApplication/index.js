import { FormComposer, Header, Toast } from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import cloneDeep from "lodash/cloneDeep";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { newConfig as newConfigLocal } from "../../../config/wsCreateConfig";
import { convertApplicationData, convertEditApplicationDetails } from "../../../utils";

const EditApplication = () => {
  const { t } = useTranslation();
  const { state, search } = useLocation();
  const history = useHistory();
  const [canSubmit, setSubmitValve] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [appData, setAppData] = useState({});
  const [config, setConfig] = useState({ head: "", body: [] });
  const [enabledLoader, setEnabledLoader] = useState(true);
  const [isAppDetailsPage, setIsAppDetailsPage] = useState(false);
  const urlParams = new URLSearchParams(location.search);
  const tenantId = Digit.ULBService.getCurrentTenantId() || Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code;
  const applicationNumber = urlParams.get("applicationNumber");
  const serviceType = urlParams.get("service");
  const [propertyId, setPropertyId] = useState(new URLSearchParams(useLocation().search).get("propertyId"));
  const details = cloneDeep(state?.data);

  const [
    sessionFormData,
    setSessionFormData,
    clearSessionFormData
  ] = Digit.Hooks.useSessionStorage("PT_CREATE_EMP_WS_NEW_FORM", {});

  const {
    isLoading: isApplicationDetailsLoading,
    data: applicationDetails,
    error: applicationDetailsError
  } = Digit.Hooks.ws.useWSDetailsPage(t, tenantId, applicationNumber, serviceType);

  const {
    data: propertyDetails
  } = Digit.Hooks.pt.usePropertySearch(
    { filters: { propertyIds: propertyId }, tenantId: tenantId },
    { filters: { propertyIds: propertyId }, tenantId: tenantId },
    { enabled: propertyId ? true : false }
  );

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
      return;
    }

    const appDetails = sessionStorage.getItem("WS_EDIT_APPLICATION_DETAILS") ? JSON.parse(sessionStorage.getItem("WS_EDIT_APPLICATION_DETAILS")) : state?.data;
    let convertAppData = await convertEditApplicationDetails(data, appDetails);
    const reqDetails = serviceType === "WATER" ? { WaterConnection: convertAppData } : { SewerageConnection: convertAppData }

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

  useEffect(() => {
    const config = newConfigLocal.find((conf) => conf.hideInCitizen);
    config.head = "WS_APP_FOR_WATER_AND_SEWERAGE_EDIT_LABEL";
    let bodyDetails = [];
    config?.body?.forEach(data => { if (data?.isEditConnection) bodyDetails.push(data); })
    config.body = bodyDetails;
    setConfig(config);
  });

  useEffect(() => {
    !propertyId && setPropertyId(sessionFormData?.cpt?.details?.propertyId);
  }, [sessionFormData?.cpt]);

  useEffect(async () => {
    const IsDetailsExists = sessionStorage.getItem("IsDetailsExists") ? JSON.parse(sessionStorage.getItem("IsDetailsExists")) : false
    if (details?.applicationData?.id && !IsDetailsExists) {
      const convertAppData = convertApplicationData(details, serviceType);
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
      if (isAppDetailsPage) window.location.href = `${window.location.origin}/digit-ui/employee/ws/application-details?applicationNumber=${applicationNumber}&service=${serviceType}`
    }, 3000);
    return () => clearTimeout(timer);
  }, [isAppDetailsPage]);

  // if (enabledLoader) {
  //   return <Loader />;
  // }

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

export default EditApplication;
