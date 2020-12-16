import React, { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import merge from "lodash.merge";
import { useDispatch } from "react-redux";
import { createComplaint } from "../../../redux/actions/index";

import { ComponentProvider } from "@egovernments/digit-ui-module-core/src/context";

import { config as defaultConfig } from "./defaultConfig";
import { Redirect, Route, Switch, useHistory, useRouteMatch, useLocation } from "react-router-dom";

export const CreateComplaint = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { path } = useRouteMatch();
  const history = useHistory();
  const registry = useContext(ComponentProvider);
  const dispatch = useDispatch();
  const customConfig = Digit.SessionStorage.get("ComplaintConfig");
  const config = useMemo(() => merge(defaultConfig, customConfig), [customConfig]);
  const __initParams = Digit.SessionStorage.get("PGR_CREATE_COMPLAINT_PARAMS");
  const [params, setParams] = useState(__initParams ? __initParams : {});

  const goNext = () => {
    const currentPath = pathname.split("/").pop();
    const { nextStep } = config.routes[currentPath];
    if (nextStep === null) return submitComplaint();
    history.push(`${path}/${nextStep}`);
  };

  const submitComplaint = async () => {
    Digit.SessionStorage.set("PGR_CREATE_COMPLAINT_PARAMS", null);

    // submit complaint through actions
    await dispatch(createComplaint(params));
    history.push(`${path}/response`);
  };

  const handleSelect = (data) => {
    setParams({ ...params, ...data });
    Digit.SessionStorage.set("PGR_CREATE_COMPLAINT_PARAMS", params);
    console.log("form params", params);
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
            <Component config={{ texts, inputs }} onSelect={handleSelect} onSkip={handleSkip} t={t} />
          </Route>
        );
      })}
      <Route>
        <Redirect to={`${path}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};
