import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, BrowserRouter as Router, Switch, useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { config } from "./defaultConfig";
import SelectPropertyType from "./SelectPropertyType";
import SelectPropertySubtype from "./SelectPropertySubtype";
import CheckPage from "./CheckPage";
import Response from "./Response";

const FileComplaint = ({ parentRoute }) => {
  const match = useRouteMatch();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const history = useHistory();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("FSM_CITIZEN_FILE_PROPERTY", {});

  const goNext = () => {
    const currentPath = pathname.split("/").pop();
    const { nextStep } = config.routes[currentPath];
    if (nextStep === null) {
      return history.push(`${parentRoute}/new-application/check`);
    }
    history.push(`${match.path}/${nextStep}`);
  };

  const submitComplaint = async () => {
    history.push(`${parentRoute}/new-application/response`);
  };

  function handleSelect(data) {
    setParams({ ...params, ...data });
    goNext();
  }

  const handleSkip = () => {};

  return (
    <Switch>
      {Object.keys(config.routes).map((route, index) => {
        const { component, texts, inputs } = config.routes[route];
        const Component = typeof component === "string" ? registry.getComponent(component) : component;
        return (
          <Route path={`${match.path}/${route}`} key={index}>
            <Component config={{ texts, inputs }} onSelect={handleSelect} onSkip={handleSkip} value={params} t={t} />
          </Route>
        );
      })}
      <Route path={`${match.path}/check`}>
        <CheckPage onSubmit={submitComplaint} value={params} />
      </Route>
      <Route path={`${match.path}/response`}>
        <Response data={params} onSuccess={clearParams} />
      </Route>
      <Route>
        <Redirect to={`${match.path}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};

export default FileComplaint;
