import { FormComposer, Header, Loader, Toast } from "@egovernments/digit-ui-react-components";
import cloneDeep from "lodash/cloneDeep";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import * as func from "../../../utils";
import _ from "lodash";
import { newConfig as newConfigLocal } from "../../../config/wsCreateConfig";
import {
  createPayloadOfWS,
  updatePayloadOfWS
} from "../../../utils";

const NewApplication = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const history = useHistory();
  let filters = func.getQueryStringParams(location.search);
  const [canSubmit, setSubmitValve] = useState(false);
  const [isEnableLoader, setIsEnableLoader] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [appDetails, setAppDetails] = useState({});
  const [waterAndSewerageBoth, setWaterAndSewerageBoth] = useState(null);
  const [config, setConfig] = useState({ head: "", body: [] });
  let tenantId = Digit.ULBService.getCurrentTenantId();
  tenantId ? tenantId : Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code;
  const [propertyId, setPropertyId] = useState(new URLSearchParams(useLocation().search).get("propertyId"));

  const [sessionFormData, setSessionFormData, clearSessionFormData] = Digit.Hooks.useSessionStorage("PT_CREATE_EMP_WS_NEW_FORM", {});

  const { data: propertyDetails } = Digit.Hooks.pt.usePropertySearch(
    { filters: { propertyIds: propertyId }, tenantId: tenantId },
    { filters: { propertyIds: propertyId }, tenantId: tenantId },
    { enabled: propertyId ? true : false }
  );

  useEffect(() => {
    const config = newConfigLocal.find((conf) => conf.hideInCitizen);
    setConfig(config);
  });

  useEffect(() => {
    !propertyId && setPropertyId(sessionFormData?.cpt?.details?.propertyId);
  }, [sessionFormData?.cpt]);

  useEffect(() => {
    setSessionFormData({ ...sessionFormData, cpt: {details: propertyDetails?.Properties?.[0]} });
  }, [propertyDetails])

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

  const closeToastOfError = () => { setShowToast(null); };


  const onSubmit = async (data) => {
    const allDetails = cloneDeep(data);
    const payload = await createPayloadOfWS(data);
    // const seweragePayload = await sewerageCreatePayload(allDetails);
    let waterAndSewerageLoader = false, waterLoader = false, sewerageLoader = false;
    if (payload?.water && payload?.sewerage) waterAndSewerageLoader = true;
    if (payload?.water && !payload?.sewerage) waterLoader = true;
    if (!payload?.water && payload?.sewerage) sewerageLoader = true;

    let waterConnection = { WaterConnection: payload };
    let sewerageConnection = { SewerageConnection: payload };

    if (waterAndSewerageLoader) {
      setWaterAndSewerageBoth(true);
      sessionStorage.setItem("setWaterAndSewerageBoth", JSON.stringify(true));
    } else {
      sessionStorage.setItem("setWaterAndSewerageBoth", JSON.stringify(false));
    }

    if (payload?.water) {
      if (waterMutation) {
        setIsEnableLoader(true);
        await waterMutation(waterConnection, {
          onError: (error, variables) => {
            setIsEnableLoader(false);
            setShowToast({ key: "error", message: error?.message ? error.message : error });
            setTimeout(closeToastOfError, 5000);
          },
          onSuccess: async (data, variables) => {
            let response = await updatePayloadOfWS(data?.WaterConnection?.[0]);
            let waterConnectionUpdate = { WaterConnection: response };
            waterUpdateMutation(waterConnectionUpdate, {
              onError: (error, variables) => {
                setIsEnableLoader(false);
                setShowToast({ key: "error", message: error?.message ? error.message : error });
                setTimeout(closeToastOfError, 5000);
              },
              onSuccess: (data, variables) => {
                setAppDetails({ ...appDetails, waterConnection: data?.WaterConnection?.[0] });
                sessionStorage.setItem("waterConnectionDetails", JSON.stringify(data?.WaterConnection?.[0]));
                if (sessionStorage.getItem("setWaterAndSewerageBoth") && JSON.parse(sessionStorage.getItem("setWaterAndSewerageBoth"))) {
                  const sewerageDetails = JSON.parse(sessionStorage.getItem("sewerageConnectionDetails"));
                  clearSessionFormData();
                  window.location.href = `${window.location.origin}/digit-ui/employee/ws/response?applicationNumber=${data?.WaterConnection?.[0]?.applicationNo}&applicationNumber1=${sewerageDetails?.applicationNo}`;
                } else {
                  if (waterLoader && !sewerageLoader) {
                    clearSessionFormData();
                    window.location.href = `${window.location.origin}/digit-ui/employee/ws/response?applicationNumber=${data?.WaterConnection?.[0]?.applicationNo}`;
                  }
                }
              },
            })
          },
        });
      }
    }

    if (payload?.sewerage) {
      if (sewerageMutation) {
        setIsEnableLoader(true);
        await sewerageMutation(sewerageConnection, {
          onError: (error, variables) => {
            setIsEnableLoader(false);
            setShowToast({ key: "error", message: error?.message ? error.message : error });
            setTimeout(closeToastOfError, 5000);
          },
          onSuccess: async (data, variables) => {
            let response = await updatePayloadOfWS(data?.SewerageConnections?.[0]);
            let sewerageConnectionUpdate = { SewerageConnection: response };
            await sewerageUpdateMutation(sewerageConnectionUpdate, {
              onError: (error, variables) => {
                setIsEnableLoader(false);
                setShowToast({ key: "error", message: error?.message ? error.message : error });
                setTimeout(closeToastOfError, 5000);
              },
              onSuccess: (data, variables) => {
                setAppDetails({ ...appDetails, sewerageConnection: data?.SewerageConnections?.[0] });
                sessionStorage.setItem("sewerageConnectionDetails", JSON.stringify(data?.SewerageConnections?.[0]));
                if (sessionStorage.getItem("setWaterAndSewerageBoth") && JSON.parse(sessionStorage.getItem("setWaterAndSewerageBoth"))) {
                  const waterDetails = JSON.parse(sessionStorage.getItem("waterConnectionDetails"));
                  clearSessionFormData();
                  window.location.href = `${window.location.origin}/digit-ui/employee/ws/response?applicationNumber=${waterDetails?.applicationNo}&applicationNumber1=${data?.SewerageConnections?.[0]?.applicationNo}`;
                } else {
                  if (sewerageLoader && !waterLoader) {
                    clearSessionFormData();
                    window.location.href = `${window.location.origin}/digit-ui/employee/ws/response?applicationNumber1=${data?.SewerageConnections?.[0]?.applicationNo}`;
                  }
                }
              },
            });
          },
        });
      }
    }
  };

  if (waterAndSewerageBoth && appDetails?.waterConnection && appDetails?.sewerageConnection) {
    window.location.href = `${window.location.origin}/digit-ui/employee/ws/response?applicationNumber=${appDetails?.waterConnection?.applicationNo}&applicationNumber1=${appDetails?.sewerageConnection?.applicationNo}`
  }


  const closeToast = () => {
    setShowToast(null);
  };

  if (isEnableLoader) {
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

export default NewApplication;
