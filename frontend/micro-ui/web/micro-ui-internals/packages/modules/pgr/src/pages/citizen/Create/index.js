import React, { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import merge from "lodash.merge";
import { useDispatch } from "react-redux";
import { createComplaint } from "../../../redux/actions/index";
import { PGR_CITIZEN_COMPLAINT_CONFIG, PGR_CITIZEN_CREATE_COMPLAINT } from "../../../constants/Citizen";
import Response from "./Response";

import { config as defaultConfig } from "./defaultConfig";
import { Redirect, Route, Switch, useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { useQueryClient } from "react-query";

export const CreateComplaint = () => {
  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const match = useRouteMatch();
  const history = useHistory();
  const registry = useContext(ComponentProvider);
  const dispatch = useDispatch();
  const { data: storeData, isLoading } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage(PGR_CITIZEN_CREATE_COMPLAINT, {});
  // const [customConfig, setConfig] = Digit.Hooks.useSessionStorage(PGR_CITIZEN_COMPLAINT_CONFIG, {});
  const config = useMemo(() => merge(defaultConfig, Digit.Customizations.PGR.complaintConfig), [Digit.Customizations.PGR.complaintConfig]);
  const [paramState, setParamState] = useState(params);
  const [nextStep, setNextStep] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);

  const [rerender, setRerender] = useState(0);
  const client = useQueryClient();
  useEffect(() => {
    setCanSubmit(false);
  }, []);

  useEffect(() => {
    setParamState(params);
    if (nextStep === null) {
      wrapperSubmit();
    } else {
      history.push(`${match.path}/${nextStep}`);
    }
  }, [params, nextStep]);

  const goNext = () => {
    const currentPath = pathname.split("/").pop();

    let { nextStep } = config.routes[currentPath];
    let compType = Digit.SessionStorage.get(PGR_CITIZEN_CREATE_COMPLAINT);
    if (nextStep === "sub-type" && compType.complaintType.key === "Others") {
      setParams({
        ...params,
        complaintType: { key: "Others", name: t("SERVICEDEFS.OTHERS") },
        subType: { key: "Others", name: t("SERVICEDEFS.OTHERS") },
      });
      nextStep = config.routes[nextStep].nextStep;
    }
    setNextStep(nextStep);
  };

  const wrapperSubmit = () => {
    if (!canSubmit) {
      setCanSubmit(true);
      submitComplaint();
    }
  };
  const submitComplaint = async () => {
    if (paramState?.complaintType) {
      const { city_complaint, locality_complaint, uploadedImages, complaintType, subType, details, ...values } = paramState;
      const { code: cityCode, name: city } = city_complaint;
      const { code: localityCode, name: localityName } = locality_complaint;
      const _uploadImages = uploadedImages?.map((url) => ({
        documentType: "PHOTO",
        fileStoreId: url,
        documentUid: "",
        additionalDetails: {},
      }));

      const data = {
        ...values,
        complaintType: subType.key,
        cityCode,
        city,
        description: details,
        district: city,
        region: city,
        localityCode,
        localityName,
        state: stateInfo.name,
        uploadedImages: _uploadImages,
      };

      await dispatch(createComplaint(data));
      await client.refetchQueries(["complaintsList"]);
      history.push(`${match.path}/response`);
    }
  };

  const handleSelect = (data) => {
    setParams({ ...params, ...data });
    goNext();
  };

  const handleSkip = () => {
    goNext();
  };

  if (isLoading) return null;

  return (
    <Switch>
      {Object.keys(config.routes).map((route, index) => {
        const { component, texts, inputs } = config.routes[route];
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route path={`${match.path}/${route}`} key={index}>
            <Component config={{ texts, inputs }} onSelect={handleSelect} onSkip={handleSkip} value={params} t={t} />
          </Route>
        );
      })}
      <Route path={`${match.path}/response`}>
        <Response match={match} />
      </Route>
      <Route>
        <Redirect to={`${match.path}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};
