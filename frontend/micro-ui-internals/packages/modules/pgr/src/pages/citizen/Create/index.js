import React, { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import merge from "lodash.merge";
import { useDispatch } from "react-redux";
import { createComplaint } from "../../../redux/actions/index";
import { PGR_CITIZEN_COMPLAINT_CONFIG, PGR_CITIZEN_CREATE_COMPLAINT } from "../../../constants/Citizen";

import { config as defaultConfig } from "./defaultConfig";
import { Redirect, Route, Switch, useHistory, useRouteMatch, useLocation } from "react-router-dom";

export const CreateComplaint = () => {
  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { path } = useRouteMatch();
  const history = useHistory();
  const registry = useContext(ComponentProvider);
  const dispatch = useDispatch();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage(PGR_CITIZEN_CREATE_COMPLAINT, {});
  const [customConfig, setConfig] = Digit.Hooks.useSessionStorage(PGR_CITIZEN_COMPLAINT_CONFIG, {});
  const config = useMemo(() => merge(defaultConfig, Digit.Customizations.PGR.complaintConfig), [Digit.Customizations.PGR.complaintConfig]);

  const goNext = () => {
    const currentPath = pathname.split("/").pop();
    const { nextStep } = config.routes[currentPath];
    if (nextStep === null) return submitComplaint();
    history.push(`${path}/${nextStep}`);
  };

  const submitComplaint = async () => {
    // submit complaint through actions
    // await dispatch(createComplaint(params));

    //submit complaint thru react query

    //Empty Session Storage
    // Digit.SessionStorage.set("complaintType", null);
    // Digit.SessionStorage.set("subType", null);
    // Digit.SessionStorage.set("PGR_CREATE_COMPLAINT_PARAMS", null);
    // Digit.SessionStorage.set("PGR_CREATE_PINCODE", null);
    // Digit.SessionStorage.set("city_complaint", null);
    // Digit.SessionStorage.set("selected_localities", null);
    // Digit.SessionStorage.set("locality_complaint", null);
    // Digit.SessionStorage.set("PGR_CREATE_LANDMARK", null);
    // Digit.SessionStorage.set("PGR_CREATE_THUMBNAILS", null);
    // Digit.SessionStorage.set("PGR_CREATE_IMAGES", null);

    const { city_complaint, locality_complaint, uploadedImages, ...values } = params;
    const { code: cityCode, name: city } = city_complaint;
    const { code: localityCode, name: localityName } = locality_complaint;
    const _uploadImages = uploadedImages?.map((url) => ({
      documentType: "PHOTO",
      fileStore: url,
      documentUid: "",
      additionalDetails: {},
    }));

    const data = {
      ...values,
      cityCode,
      city,
      district: city,
      region: city,
      localityCode,
      localityName,
      state: "Punjab",
      uploadedImages: _uploadImages,
    };
    console.log("this is the request data", data);
    await dispatch(createComplaint(data));
    clearParams();
    history.push(`${path}/response`);
  };

  const handleSelect = (data) => {
    console.log("DATA selected", data);
    setParams({ ...params, ...data });
    goNext();
  };

  const handleSkip = () => {
    goNext();
  };

  return (
    <Switch>
      {Object.keys(config.routes).map((route, index) => {
        const { component, texts, inputs } = config.routes[route];
        const Component = typeof component === "string" ? registry.getComponent(component) : component;
        return (
          <Route path={`${path}/${route}`} key={index}>
            <Component config={{ texts, inputs }} onSelect={handleSelect} onSkip={handleSkip} value={params} t={t} />
          </Route>
        );
      })}
      <Route>
        <Redirect to={`${path}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};
