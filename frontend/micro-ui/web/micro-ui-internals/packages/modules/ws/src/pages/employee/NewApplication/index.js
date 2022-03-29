import { FormComposer, Header, Loader, Toast } from "@egovernments/digit-ui-react-components";
import cloneDeep from "lodash/cloneDeep";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { stringReplaceAll, convertDateToEpoch } from "../../../utils";
import * as func from "../../../utils";
import _, { clone } from "lodash";
import { newConfig as newConfigLocal } from "../../../config/wsCreateConfig";
import { createPayloadOfWS, updatePayloadOfWS } from "../../../utils";

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

  let { data: newConfig } = Digit.Hooks.obps.SearchMdmsTypes.getFormConfig(Digit.ULBService.getCurrentTenantId(), newConfigLocal);

  useEffect(() => {
    const config = newConfigLocal.find((conf) => {
      if (conf.hideInCitizen) {
        const config = {};

        config["head"] = conf.head;

        config["body"] = conf.body.map((comp) => {
          if (comp.role && comp.role === "fieldInspector") {
            return null;
          }

          return comp;
        });

        return config;
      }

      return null;
    });

    setConfig(config);
  }, []);

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
  } = Digit.Hooks.ws.useWSApplicationActions("WATER");

  const onFormValueChange = (setValue, formData, formState) => {

    if (Object.keys(formState.errors).length > 0 && Object.keys(formState.errors).length == 1 && formState.errors["owners"] && Object.values(formState.errors["owners"].type).filter((ob) => ob.type === "required").length == 0) setSubmitValve(true);
    else setSubmitValve(!(Object.keys(formState.errors).length));
  };

  const closeToastOfError = () => { setShowToast(null); };


  const onSubmit = async (data) => {
    const allDetails = cloneDeep(data);
    const payload = await createPayloadOfWS(data);
    let waterAndSewerageLoader = false, waterLoader = false, sewerageLoader = false;
    if (payload?.water && payload?.sewerage) waterAndSewerageLoader = true;
    if (payload?.water && !payload?.sewerage) waterLoader = true;
    if (!payload?.water && payload?.sewerage) sewerageLoader = true;

    let waterConnection = { WaterConnection: payload };
    let sewerageConnection = { SewerageConnection: payload };

    if (waterAndSewerageLoader) setWaterAndSewerageBoth(true);

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
                setIsEnableLoader(false);
                setAppDetails({ ...appDetails, waterConnection: data?.WaterConnection?.[0] })
                if (waterLoader) window.location.href = `${window.location.origin}/digit-ui/employee/ws/response?applicationNumber=${data?.WaterConnection?.[0]?.applicationNo}`
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
                setIsEnableLoader(false);
                setAppDetails({ ...appDetails, sewerageConnection: data?.SewerageConnections?.[0] })
                if (sewerageLoader) window.location.href = `${window.location.origin}/digit-ui/employee/ws/response?applicationNumber1=${data?.SewerageConnections?.[0]?.applicationNo}`
              },
            });
          },
        });
      }
    }
  };

  if (waterAndSewerageBoth && appDetails?.waterConnection && appDetails?.sewerageConnection) {
    window.location.href = `${window.location.origin}/digit-ui/employee/ws/response?applicationNumber=${appDetails?.waterConnection?.applicationNumber}&applicationNumber1=${appDetails?.sewerageConnection?.applicationNumber}`
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
        onFormValueChange={onFormValueChange}
        isDisabled={!canSubmit}
        label={t("CS_COMMON_SUBMIT")}
        onSubmit={onSubmit}
      ></FormComposer>
      {showToast && <Toast error={showToast.key} label={t(showToast?.message)} onClose={closeToast} />}
    </React.Fragment>
  );
};

export default NewApplication;
